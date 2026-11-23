'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return

    document.documentElement.classList.add('has-custom-cursor')
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    let visible = false
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(event.clientX)
      dotY(event.clientY)
      ringX(event.clientX)
      ringY(event.clientY)
    }

    const onOver = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], input, textarea, label')
      const text = target?.dataset.cursorLabel
      const isField = target?.matches('input, textarea')
      gsap.to(ring, {
        scale: text ? 3.2 : target && !isField ? 1.8 : 1,
        backgroundColor: text ? 'rgba(242,242,240,1)' : 'rgba(242,242,240,0)',
        borderColor: target ? 'rgba(125,140,255,0.9)' : 'rgba(242,242,240,0.4)',
        duration: 0.4,
        ease: 'power3.out',
      })
      gsap.to(dot, { scale: target ? 0 : 1, duration: 0.25 })
      label.textContent = text ?? ''
    }

    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 })
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)
    return () => {
      document.documentElement.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
    }
  })

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div ref={dotRef} className="fixed left-0 top-0 size-1.5 rounded-full bg-paper mix-blend-difference" />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex size-9 items-center justify-center rounded-full border border-paper/40"
      >
        <span ref={labelRef} className="text-[4px] font-medium uppercase tracking-[0.15em] text-ink" />
      </div>
    </div>
  )
}
