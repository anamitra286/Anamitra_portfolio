'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { about } from '@/lib/content'
import { ImageSlot } from '@/components/image-slot'
import { SectionLabel } from '@/components/reveal-scope'

export function AboutIntro() {
  return (
    <section aria-labelledby="about-lead" className="mx-auto grid max-w-7xl gap-12 px-6 pb-28 md:px-10 lg:grid-cols-12">
      <div className="relative lg:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" data-reveal>
          <div data-parallax="-8" className="absolute inset-[-8%]">
            <ImageSlot id="about.portrait" priority sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0" />
          </div>
        </div>
        <span className="absolute -bottom-4 left-6 rounded-full border border-paper/15 bg-ink px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Pillai College of Engineering
        </span>
      </div>
      <div className="flex flex-col justify-between gap-12 lg:col-span-7 lg:pl-10">
        <p id="about-lead" data-split className="text-balance text-[clamp(1.6rem,3.2vw,2.8rem)] font-medium leading-[1.15] tracking-[-0.02em]">
          {about.lead}
        </p>
        <div data-stagger className="grid gap-8 sm:grid-cols-3">
          {about.pillars.map((pillar, i) => (
            <div key={pillar.label} className="border-t border-paper/15 pt-5">
              <span className="font-mono text-[10px] text-volt">{`0${i + 1}`}</span>
              <h2 className="mt-3 text-xs uppercase tracking-[0.25em]">{pillar.label}</h2>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Timeline() {
  return (
    <section aria-labelledby="timeline-title" className="mx-auto max-w-7xl px-6 py-28 md:px-10">
      <SectionLabel index="03">Journey</SectionLabel>
      <h2 id="timeline-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-6xl">
        The story so far.
      </h2>
      <ol className="relative mt-16">
        <span className="absolute bottom-0 left-[7px] top-0 w-px bg-paper/10 md:left-1/2" aria-hidden="true">
          <span data-draw="y" className="block h-full w-px bg-gradient-to-b from-volt via-silver to-transparent" />
        </span>
        {about.timeline.map((item, i) => (
          <li key={item.title} className="relative grid pb-14 pl-10 md:grid-cols-2 md:gap-16 md:pl-0">
            <span
              className="absolute left-0 top-1.5 size-[15px] rounded-full border border-volt bg-ink shadow-[0_0_16px_rgb(125_140_255/0.6)] md:left-1/2 md:-translate-x-1/2"
              aria-hidden="true"
            />
            <div data-reveal className={i % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}>
              <span className="font-mono text-xs text-volt">{item.period}</span>
              <h3 className="mt-2 text-2xl font-medium tracking-tight">{item.title}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.place}</p>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
