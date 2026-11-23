'use client'

import { useRef } from 'react'
import { gsap, SplitText, useGSAP, ease } from '@/lib/gsap'
import { hero, site } from '@/lib/content'
import { ImageSlot } from '@/components/image-slot'
import { MagneticButton } from '@/components/magnetic-button'
import { Typewriter } from './typewriter'
import { MetallicRing } from './metallic-ring'
import type { ImageSlotId } from '@/lib/images'

const satellites: { id: ImageSlotId; angle: number }[] = [
  { id: 'hero.satellite.1', angle: 20 },
  { id: 'hero.satellite.2', angle: 150 },
  { id: 'hero.satellite.3', angle: 260 },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const lines = gsap.utils.toArray<HTMLElement>('[data-hero-line]')
        const split = SplitText.create(lines, { type: 'chars', mask: 'chars' })
        const tl = gsap.timeline({ delay: 0.35, defaults: { ease: ease.out } })
        tl.from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.025 })
          .from('[data-hero-visual]', { scale: 0.85, autoAlpha: 0, duration: 2 }, 0.2)
          .from('[data-hero-fade]', { y: 30, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.9)

        gsap.to('[data-hero-visual]', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        gsap.to('[data-hero-title]', {
          yPercent: -12,
          autoAlpha: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        return () => split.revert()
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="hero-title" className="noise relative flex min-h-dvh flex-col overflow-hidden px-6 pb-10 pt-28 md:px-10">
      <div className="grid-lines pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-10 size-[50rem] rounded-full bg-volt/10 blur-[140px]" aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <div data-hero-fade className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="flex items-center gap-3">
            <span className="relative size-2 animate-pulse-dot rounded-full bg-volt" aria-hidden="true" />
            <span>{site.status}</span>
          </span>
          <span className="hidden sm:inline">{site.location}</span>
        </div>

        <div className="relative mt-8 flex flex-1 flex-col justify-center lg:mt-0">
          <div
            data-hero-visual
            className="relative mx-auto aspect-square w-[min(88vw,440px)] lg:absolute lg:right-[-2%] lg:top-1/2 lg:w-[min(48vw,640px)] lg:-translate-y-1/2"
          >
            <ImageSlot
              id="hero.center"
              shape="circle"
              priority
              sizes="(min-width: 1024px) 30vw, 50vw"
              className="absolute left-1/2 top-1/2 size-[44%] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_80px_rgb(125_140_255/0.25)]"
            />
            <MetallicRing />
            <div className="pointer-events-none absolute inset-[-4%] animate-orbit motion-reduce:animate-none" aria-hidden="true">
              {satellites.map((satellite) => (
                <div
                  key={satellite.id}
                  className="absolute left-1/2 top-1/2"
                  style={{ transform: `rotate(${satellite.angle}deg) translateX(min(24vw,330px)) rotate(-${satellite.angle}deg)` }}
                >
                  <div className="-translate-x-1/2 -translate-y-1/2 animate-orbit-reverse motion-reduce:animate-none">
                    <ImageSlot
                      id={satellite.id}
                      shape="circle"
                      sizes="80px"
                      className="hidden size-16 border border-paper/15 lg:block xl:size-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1
            id="hero-title"
            data-hero-title
            className="relative z-10 mt-10 text-[clamp(3rem,9.2vw,9.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em] lg:mt-0"
          >
            <span data-hero-line className="block">
              {hero.lines[0]}
            </span>
            <span data-hero-line className="block font-serif font-normal normal-case italic tracking-[-0.02em] text-silver">
              {'Ideas.'}
            </span>
            <span data-hero-line className="block md:pl-[8vw]">
              {hero.lines[2]}
            </span>
            <span data-hero-line className="block md:pl-[8vw]">
              {"WHAT'S "}
              <span className="font-serif font-normal normal-case italic tracking-[-0.02em] metal-text">{'next.'}</span>
            </span>
          </h1>
        </div>

        <div className="relative z-10 mt-12 grid gap-8 border-t border-paper/10 pt-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p data-hero-fade className="text-[11px] uppercase tracking-[0.25em] text-silver">
              {hero.roles}
            </p>
            <p data-hero-fade className="mt-4 text-sm font-medium text-paper md:text-base">
              <span className="text-muted-foreground">{'Currently — '}</span>
              <Typewriter words={hero.typewriter} />
            </p>
          </div>
          <p data-hero-fade className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:col-span-4">
            {hero.intro}
          </p>
          <div data-hero-fade className="flex items-center justify-between gap-6 md:col-span-3 md:justify-end">
            <MagneticButton href="/about" variant="solid" size="lg">
              Explore my world
            </MagneticButton>
          </div>
        </div>

      </div>
    </section>
  )
}
