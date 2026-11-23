'use client'

import { useRef, type ReactNode } from 'react'
import { useScrollReveal } from '@/lib/animations'
import { cn } from '@/lib/utils'

export function RevealScope({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null)
  useScrollReveal(ref)
  return (
    <main ref={ref} id={id ?? 'main'} className={cn('relative', className)}>
      {children}
    </main>
  )
}

export function SectionLabel({ index, children, className }: { index: string; children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={cn('flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] text-muted-foreground', className)}>
      <span className="font-mono text-volt">{index}</span>
      <span className="h-px w-10 bg-paper/20" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export function PageHeading({ eyebrow, index, children }: { eyebrow: string; index: string; children: string }) {
  return (
    <header className="relative mx-auto max-w-7xl px-6 pb-16 pt-40 md:px-10 md:pb-24 md:pt-48">
      <SectionLabel index={index}>{eyebrow}</SectionLabel>
      <h1
        data-split
        className="mt-8 max-w-6xl text-balance text-[clamp(2.6rem,7.5vw,7.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]"
      >
        {children}
      </h1>
      <div className="mt-12 h-px w-full bg-paper/10" aria-hidden="true">
        <div data-draw className="h-px w-full bg-gradient-to-r from-volt via-paper/40 to-transparent" />
      </div>
    </header>
  )
}
