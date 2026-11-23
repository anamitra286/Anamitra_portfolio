'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const LenisContext = createContext<Lenis | null>(null)

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      anchors: { offset: -80 },
    })

    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)

    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext value={lenis}>{children}</LenisContext>
}

export function useLenis() {
  return useContext(LenisContext)
}

export function scrollToTarget(lenis: Lenis | null, target: string | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'string' ? -80 : 0, immediate })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}
