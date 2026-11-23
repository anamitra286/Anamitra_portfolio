'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { about, projects } from '@/lib/content'
import { ImageSlot } from '@/components/image-slot'
import { hasImage } from '@/lib/images'
import { MagneticButton } from '@/components/magnetic-button'
import { ParticleField } from '@/components/particles/particle-field'
import { SectionLabel } from '@/components/reveal-scope'
import { TransitionLink } from '@/components/transition-link'

export function Manifesto() {
  return (
    <section aria-labelledby="manifesto-title" className="relative mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
      <SectionLabel index="01">Introduction</SectionLabel>
      <h2
        id="manifesto-title"
        data-split
        className="mt-10 max-w-6xl text-balance text-[clamp(1.9rem,4.4vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.025em]"
      >
        {
          "I'm an engineer who thinks like a product manager — curious about how things work, and obsessed with why they should exist at all."
        }
      </h2>
      <div data-stagger className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-3">
        {about.pillars.map((pillar, i) => (
          <article key={pillar.label} className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-card">
            <span className="font-mono text-[10px] text-volt">{`0${i + 1}`}</span>
            <h3 className="mt-6 text-xs uppercase tracking-[0.25em] text-paper">{pillar.label}</h3>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-volt transition-transform duration-700 group-hover:scale-x-100" aria-hidden="true" />
          </article>
        ))}
      </div>
      <div data-reveal className="mt-12">
        <MagneticButton href="/about">More about me</MagneticButton>
      </div>
    </section>
  )
}

export function Marquee({ words = ['Product thinking', 'User research', 'Roadmaps', 'Shipping ideas', 'Creative technology', 'AI systems'] }: { words?: string[] }) {
  const row = [...words, ...words]
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-paper/10 py-6">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-10 font-serif text-3xl italic text-paper/70 md:text-5xl">
            {word}
            <span className="size-2 rounded-full bg-volt" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function SelectedWork() {
  const ref = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section ref={ref} id="selected-work" aria-labelledby="work-title" className="relative overflow-hidden py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <SectionLabel index="02">Selected work</SectionLabel>
          <h2 id="work-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-6xl">
            Ideas turned into reality.
          </h2>
        </div>
        <MagneticButton href="/work" variant="outline">
          All projects
        </MagneticButton>
      </div>

      <div className="mt-12 flex items-center justify-end gap-3 px-6 md:px-10">
        <button type="button" onClick={() => step(-1)} aria-label="Scroll left" className="flex size-11 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper">
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Scroll right" className="flex size-11 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper">
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={trackRef}
        data-lenis-prevent
        tabIndex={0}
        aria-label="Selected projects carousel"
        className="mt-6 flex snap-x snap-mandatory scroll-smooth gap-6 overflow-x-auto overscroll-x-contain px-6 pb-6 md:px-10 [scrollbar-width:thin] [scrollbar-color:rgb(125_140_255/0.6)_transparent]"
      >
        {projects.map((project) => (
          <TransitionLink
            key={project.slug}
            href={`/work#${project.slug}`}
            data-cursor-label="View"
            className="group relative w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[38vw]"
          >
            {hasImage(project.cover) && (
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-paper/10">
                <ImageSlot
                  id={project.cover}
                  sizes="(min-width: 1024px) 38vw, 82vw"
                  className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full border border-paper/15 bg-ink/60 px-3 py-1 font-mono text-[10px] text-paper backdrop-blur">
                  {project.index}
                </span>
              </div>
            )}
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-medium tracking-tight md:text-2xl">{project.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-paper/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-volt group-hover:bg-volt group-hover:text-ink">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
          </TransitionLink>
        ))}
      </div>
    </section>
  )
}

export function SkillStack() {
  return (
    <section aria-labelledby="toolkit-title" className="relative mx-auto grid max-w-7xl gap-12 px-6 py-28 md:px-10 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-4">
        <SectionLabel index="03">Toolkit</SectionLabel>
        <h2 id="toolkit-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-5xl">
          A deck of many skills.
        </h2>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
        {about.skills.map((group, i) => (
          <li key={group.category} className="rounded-2xl border border-paper/10 bg-card p-6">
            <span className="font-mono text-[10px] text-volt">{`0${i + 1} / 0${about.skills.length}`}</span>
            <h3 className="mt-3 font-serif text-3xl italic">{group.category}</h3>
            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={`${group.category} skills`}>
              {group.items.map((item) => (
                <li key={item} className="rounded-full border border-paper/20 px-2.5 py-1 text-[11px] text-paper">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ClosingCta() {
  return (
    <section aria-labelledby="cta-title" className="noise relative overflow-hidden px-6 py-32 text-center md:px-10 md:py-48">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/10 blur-[120px]" aria-hidden="true" />
      <ParticleField className="opacity-90" count={5000} />
      <p data-reveal className="relative text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        {"What's next"}
      </p>
      <h2 id="cta-title" data-split className="relative mx-auto mt-8 max-w-5xl text-balance text-[clamp(2.4rem,7vw,7rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em]">
        Have something interesting in mind?
      </h2>
      <div data-reveal className="relative mt-12 flex flex-wrap justify-center gap-4">
        <MagneticButton href="/contact" variant="solid" size="lg">
          {"Let's talk"}
        </MagneticButton>
        <MagneticButton href="/achievements" size="lg">
          See milestones
        </MagneticButton>
      </div>
    </section>
  )
}
