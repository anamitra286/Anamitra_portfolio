'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap, ScrollTrigger, ease, prefersReducedMotion } from '@/lib/gsap'
import { navItems, site } from '@/lib/content'
import { scrollToTarget, useLenis } from './smooth-scroll'

type TransitionContextValue = { navigate: (href: string) => void }

const TransitionContext = createContext<TransitionContextValue>({ navigate: () => {} })

function labelFor(path: string) {
  if (path === '/') return site.wordmark
  return navItems.find((item) => item.href === path)?.label.toUpperCase() ?? site.wordmark
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()
  const curtainRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)
  const pendingHash = useRef<string | null>(null)
  const [label, setLabel] = useState(site.wordmark)

  const navigate = useCallback(
    (href: string) => {
      const [path = '/', hash] = href.split('#')
      const targetPath = path || pathname

      if (targetPath === pathname) {
        scrollToTarget(lenis, hash ? `#${hash}` : 0)
        return
      }
      if (busy.current) return

      pendingHash.current = hash ? `#${hash}` : null

      if (prefersReducedMotion() || !curtainRef.current) {
        router.push(href, { scroll: true })
        return
      }

      busy.current = true
      setLabel(labelFor(targetPath))
      lenis?.stop()

      gsap
        .timeline()
        .set(curtainRef.current, { display: 'flex', clipPath: 'inset(100% 0% 0% 0%)' })
        .to(curtainRef.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: ease.inOut })
        .fromTo(labelRef.current, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: ease.out }, '-=0.35')
        .add(() => router.push(href, { scroll: false }))
    },
    [lenis, pathname, router],
  )

  useEffect(() => {
    if (!busy.current) {
      if (pendingHash.current) {
        const hash = pendingHash.current
        pendingHash.current = null
        requestAnimationFrame(() => scrollToTarget(lenis, hash))
      }
      return
    }

    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true, force: true })

    const tl = gsap.timeline({
      delay: 0.2,
      onComplete: () => {
        busy.current = false
        lenis?.start()
        ScrollTrigger.refresh()
        if (pendingHash.current) {
          scrollToTarget(lenis, pendingHash.current)
          pendingHash.current = null
        }
      },
    })
    tl.to(labelRef.current, { yPercent: -110, duration: 0.45, ease: 'power3.in' })
      .to(curtainRef.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: ease.inOut }, '-=0.1')
      .set(curtainRef.current, { display: 'none' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <TransitionContext value={{ navigate }}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="fixed inset-0 z-[90] hidden items-center justify-center bg-paper text-ink"
        style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      >
        <div className="overflow-hidden">
          <span ref={labelRef} className="block font-serif text-[clamp(3rem,10vw,9rem)] italic leading-none">
            {label}
          </span>
        </div>
        <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-ink/60">
          {site.fullName}
        </span>
      </div>
    </TransitionContext>
  )
}

export function useTransitionNav() {
  return useContext(TransitionContext)
}
