'use client'

import { ArrowUp } from 'lucide-react'
import { navItems, site } from '@/lib/content'
import { TransitionLink } from './transition-link'
import { scrollToTarget, useLenis } from './providers/smooth-scroll'

export function SiteFooter() {
  const lenis = useLenis()

  return (
    <footer className="relative border-t border-paper/10 px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {'© '}
          {new Date().getFullYear()} {site.fullName}. All rights reserved.
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <TransitionLink
                href={item.href}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-paper"
              >
                {item.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => scrollToTarget(lenis, 0)}
          className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-paper"
          data-cursor="hover"
        >
          Back to top
          <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-full border border-paper/20 transition-colors group-hover:border-volt">
            <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-10" aria-hidden="true" />
            <ArrowUp className="absolute size-4 translate-y-10 text-volt transition-transform duration-500 group-hover:translate-y-0" aria-hidden="true" />
          </span>
        </button>
      </div>
    </footer>
  )
}
