'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { gsap, useGSAP, ease } from '@/lib/gsap'
import { navItems, site } from '@/lib/content'
import { cn } from '@/lib/utils'
import { TransitionLink } from './transition-link'
import { useLenis } from './providers/smooth-scroll'

function SlideText({ children }: { children: string }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full text-paper transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

export function SiteNav() {
  const pathname = usePathname()
  const lenis = useLenis()
  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  const moveIndicator = (target: HTMLElement | null) => {
    const indicator = indicatorRef.current
    const list = listRef.current
    if (!indicator || !list) return
    if (!target) {
      gsap.to(indicator, { autoAlpha: 0, duration: 0.3 })
      return
    }
    const listRect = list.getBoundingClientRect()
    const rect = target.getBoundingClientRect()
    gsap.to(indicator, {
      x: rect.left - listRect.left,
      width: rect.width,
      autoAlpha: 1,
      duration: 0.55,
      ease: ease.out,
    })
  }

  const activeLink = () =>
    listRef.current?.querySelector<HTMLElement>(`[data-href="${pathname}"]`) ?? null

  useEffect(() => {
    moveIndicator(activeLink())
    setOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 160 && y > last)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useGSAP(() => {
    gsap.from(navRef.current, { y: -40, autoAlpha: 0, duration: 1.2, ease: ease.out, delay: 0.3 })
  })

  useGSAP(
    () => {
      const menu = menuRef.current
      if (!menu) return
      if (open) {
        lenis?.stop()
        gsap.set(menu, { display: 'flex' })
        gsap.fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: ease.inOut })
        gsap.fromTo(menu.querySelectorAll('[data-menu-item]'), { yPercent: 120 }, { yPercent: 0, stagger: 0.06, duration: 0.9, ease: ease.out, delay: 0.25 })
      } else {
        lenis?.start()
        gsap.to(menu, { clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: ease.inOut, onComplete: () => void gsap.set(menu, { display: 'none' }) })
      }
    },
    { dependencies: [open], revertOnUpdate: false },
  )

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          'fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          hidden && !open && '-translate-y-24',
        )}
      >
        <nav
          aria-label="Primary"
          className="flex w-full max-w-5xl items-center justify-between rounded-full border border-paper/10 bg-ink/60 py-2 pl-5 pr-2 backdrop-blur-xl"
        >
          <TransitionLink href="/" className="group flex items-center gap-2 text-sm font-semibold tracking-[0.3em]" aria-label={`${site.wordmark} — home`}>
            <span className="size-2 rounded-full bg-volt shadow-[0_0_12px_rgb(125_140_255)] transition-transform duration-500 group-hover:scale-150" />
            <SlideText>{site.wordmark}</SlideText>
          </TransitionLink>

          <ul
            ref={listRef}
            className="relative hidden items-center gap-1 md:flex"
            onPointerLeave={() => moveIndicator(activeLink())}
          >
            <span
              ref={indicatorRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-full rounded-full border border-paper/15 bg-paper/[0.06] opacity-0"
            />
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    data-href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onPointerEnter={(event) => moveIndicator(event.currentTarget)}
                    className={cn(
                      'group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors',
                      active ? 'text-paper' : 'text-muted-foreground',
                    )}
                  >
                    <span className="font-mono text-[9px] text-volt/80">{item.index}</span>
                    <SlideText>{item.label}</SlideText>
                  </TransitionLink>
                </li>
              )
            })}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-[61] flex h-10 items-center gap-3 rounded-full border border-paper/15 px-4 text-[11px] uppercase tracking-[0.2em] md:hidden"
          >
            <span>{open ? 'Close' : 'Menu'}</span>
            <span aria-hidden="true" className="relative block h-2 w-4">
              <span className={cn('absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-300', open && 'translate-y-1 rotate-45')} />
              <span className={cn('absolute bottom-0 left-0 h-px w-full bg-paper transition-transform duration-300', open && '-translate-y-[3px] -rotate-45')} />
            </span>
          </button>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className="fixed inset-0 z-[49] hidden flex-col justify-end bg-ink px-6 pb-12 pt-28 md:hidden"
        style={{ clipPath: 'circle(0% at 100% 0%)' }}
      >
        <ul className="flex flex-col gap-2">
          {[{ label: 'Home', href: '/', index: '00' }, ...navItems].map((item) => (
            <li key={item.href} className="overflow-hidden border-b border-paper/10 pb-2">
              <TransitionLink
                href={item.href}
                data-menu-item
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between"
              >
                <span className="font-serif text-5xl italic">{item.label}</span>
                <span className="font-mono text-xs text-volt">{item.index}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs uppercase tracking-[0.2em] text-muted-foreground">{site.status}</p>
      </div>
    </>
  )
}
