'use client'

import type { RefObject } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP, ease } from './gsap'

/**
 * Declarative scroll animations, driven by data attributes inside `scope`:
 *  - data-split           → line-masked word reveal
 *  - data-reveal          → fade + rise
 *  - data-stagger         → children fade + rise in sequence
 *  - data-parallax="-20"  → yPercent drift while scrolling
 *  - data-draw            → scaleX/scaleY line draw (use data-draw="y" for vertical)
 */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
          SplitText.create(el, {
            type: 'lines,words',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 110,
                duration: 1.2,
                ease: ease.out,
                stagger: 0.035,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }),
          })
        })

        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 48,
            autoAlpha: 0,
            duration: 1.2,
            ease: ease.out,
            delay: Number(el.dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
          gsap.from(el.children, {
            y: 56,
            autoAlpha: 0,
            duration: 1.1,
            ease: ease.out,
            stagger: 0.09,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        root.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.parallax || -15),
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })

        root.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
          const vertical = el.dataset.draw === 'y'
          gsap.fromTo(
            el,
            vertical ? { scaleY: 0 } : { scaleX: 0 },
            {
              ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
              transformOrigin: vertical ? 'top' : 'left',
              ease: 'none',
              scrollTrigger: {
                trigger: el.parentElement ?? el,
                start: 'top 75%',
                end: vertical ? 'bottom 60%' : 'top 40%',
                scrub: true,
              },
            },
          )
        })
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
      return () => mm.revert()
    },
    { scope },
  )
}
