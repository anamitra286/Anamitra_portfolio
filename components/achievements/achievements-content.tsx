'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X, Expand, ArrowLeft, ArrowRight } from 'lucide-react'
import { gsap, useGSAP, ease } from '@/lib/gsap'
import { achievements } from '@/lib/content'
import { certificateIds, galleryIds, getImage, hasImage, type ImageSlotId } from '@/lib/images'
import { ImageSlot } from '@/components/image-slot'
import { SectionLabel } from '@/components/reveal-scope'
import { CardStack } from '@/components/card-stack'
import { useLenis } from '@/components/providers/smooth-scroll'
import { cn } from '@/lib/utils'

function Lightbox({ id, onClose }: { id: ImageSlotId; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()
  const image = getImage(id)

  useGSAP(
    () => {
      gsap.from(ref.current, { autoAlpha: 0, duration: 0.4 })
      gsap.from('[data-lightbox-img]', { scale: 0.9, y: 30, autoAlpha: 0, duration: 0.8, ease: ease.out })
    },
    { scope: ref },
  )

  useEffect(() => {
    lenis?.stop()
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [lenis, onClose])

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={image.caption ?? image.alt}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/90 p-6 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="group absolute right-6 top-6 flex size-12 items-center justify-center rounded-full border border-paper/20 hover:border-paper"
        aria-label="Close preview"
      >
        <X className="size-5 transition-transform duration-500 group-hover:rotate-90" aria-hidden="true" />
      </button>
      <div data-lightbox-img className="relative aspect-[4/3] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <ImageSlot id={id} showCaption sizes="90vw" className="absolute inset-0" />
      </div>
    </div>
  )
}

function useLightbox() {
  const [open, setOpen] = useState<ImageSlotId | null>(null)
  const close = useCallback(() => setOpen(null), [])
  return { open, setOpen, element: open ? <Lightbox id={open} onClose={close} /> : null }
}

function ExpandableImage({ id, onOpen, className }: { id: ImageSlotId; onOpen: (id: ImageSlotId) => void; className?: string }) {
  const image = getImage(id)
  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      data-cursor-label="Expand"
      aria-label={`Expand ${image.caption ?? image.alt}`}
      className={cn('animated-border group relative block overflow-hidden rounded-2xl', className)}
    >
      <ImageSlot id={id} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-[1px] transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
      <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-ink/70 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        <Expand className="size-4" aria-hidden="true" />
      </span>
    </button>
  )
}

export function CircularGallery() {
  const ref = useRef<HTMLElement>(null)
  const { setOpen, element } = useLightbox()
  const [active, setActive] = useState(0)
  const gallery = galleryIds.filter(hasImage)
  const count = gallery.length

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('[data-wheel]', {
          rotate: -180,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
      })
    },
    { scope: ref },
  )

  return (
    <section ref={ref} aria-labelledby="gallery-title" className="relative overflow-hidden border-y border-paper/10 px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <SectionLabel index="01">Gallery</SectionLabel>
          <h2 id="gallery-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-5xl">
            Moments in orbit.
          </h2>
          <p data-reveal className="mt-6 max-w-sm text-pretty leading-relaxed text-muted-foreground">
            Events, awards, stages and screenshots — arranged in a slow-turning circle. Select any frame to expand it.
          </p>
          <p className="mt-8 font-mono text-xs text-volt" aria-live="polite">
            {`0${active + 1}`}
            <span className="text-muted-foreground">{` / 0${count} — ${getImage(gallery[active]).caption}`}</span>
          </p>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[640px] lg:col-span-8">
          <div className="absolute inset-[14%] rounded-full border border-paper/10" aria-hidden="true" />
          <div className="absolute inset-[30%] rounded-full border border-dashed border-paper/10" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span className="font-serif text-3xl italic text-silver md:text-5xl">Milestones</span>
          </div>
          <ul data-wheel className="absolute inset-0">
            {gallery.map((id, i) => {
              const angle = (i / count) * 360
              return (
                <li
                  key={id}
                  className="absolute left-1/2 top-1/2 w-[24%]"
                  style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-155%) rotate(${-angle}deg)` }}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  <ExpandableImage id={id} onOpen={setOpen} className="aspect-[4/5] w-full" />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      {element}
    </section>
  )
}

export function Highlights() {
  const { setOpen, element } = useLightbox()
  return (
    <section aria-labelledby="highlights-title" className="mx-auto max-w-7xl px-6 py-28 md:px-10">
      <SectionLabel index="02">Achievements</SectionLabel>
      <h2 id="highlights-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-6xl">
        Recognised along the way.
      </h2>
      <div data-stagger className="mt-14 grid gap-6 md:grid-cols-2">
        {achievements.highlights.map((item) => (
          <article key={item.id} className="group relative overflow-hidden rounded-3xl border border-paper/10 bg-card p-4">
            {hasImage(item.image) && <ExpandableImage id={item.image} onOpen={setOpen} className="aspect-[16/10] w-full" />}
            <div className="flex items-end justify-between gap-6 p-4 pt-8">
              <div>
                <h3 className="text-2xl font-medium tracking-tight md:text-3xl">{item.title}</h3>
                <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
              <span className="font-serif text-5xl italic text-paper/15 transition-colors duration-500 group-hover:text-volt md:text-6xl">
                {item.year}
              </span>
            </div>
          </article>
        ))}
      </div>
      {element}
    </section>
  )
}

export function ExperienceTimeline() {
  const trackRef = useRef<HTMLDivElement>(null)
  const { setOpen, element } = useLightbox()
  const items = [
    ...achievements.experience.map((e) => ({ ...e, kind: 'Professional' })),
    ...achievements.other.map((e) => ({ ...e, kind: 'Beyond work' })),
  ]

  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.7, behavior: 'smooth' })
  }

  return (
    <section aria-labelledby="experience-title" className="relative overflow-hidden border-y border-paper/10 py-24">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
        <SectionLabel index="03">Experience</SectionLabel>
        <h2 id="experience-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-6xl">
          Roles that shaped me.
        </h2>
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Scroll left"
            className="flex size-11 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Scroll right"
            className="flex size-11 items-center justify-center rounded-full border border-paper/20 transition-colors hover:border-paper"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
          <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Scroll sideways to see all</span>
        </div>
      </div>
      <div
        ref={trackRef}
        data-lenis-prevent
        tabIndex={0}
        aria-label="Experience and achievements carousel"
        className="mt-10 flex snap-x snap-mandatory scroll-smooth gap-6 overflow-x-auto overscroll-x-contain px-6 pb-6 md:px-10 [scrollbar-width:thin] [scrollbar-color:rgb(125_140_255/0.6)_transparent]"
      >
        {items.map((item, i) => (
          <article key={item.role} className="relative flex w-[80vw] shrink-0 snap-start flex-col gap-6 sm:w-[50vw] lg:w-[30vw]">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-volt">{`0${i + 1}`}</span>
              <span className="h-px flex-1 bg-paper/15" aria-hidden="true" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{item.kind}</span>
            </div>
            {hasImage(item.image) && <ExpandableImage id={item.image} onOpen={setOpen} className="aspect-[4/3] w-full" />}
            <div>
              <h3 className="text-2xl font-medium tracking-tight">{item.role}</h3>
              <p className="mt-1 font-serif text-lg italic text-silver">{item.org}</p>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      {element}
    </section>
  )
}

export function Certificates() {
  const { setOpen, element } = useLightbox()
  const cards = certificateIds.filter(hasImage).map((id) => {
    const image = getImage(id)
    return {
      id,
      label: image.caption ?? 'Certificate',
      front: <ImageSlot id={id} sizes="280px" className="h-full w-full" />,
      detail: (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">{image.caption}</p>
          <span
            role="link"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              setOpen(id)
            }}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-ink"
          >
            <Expand className="size-3" aria-hidden="true" />
            Expand
          </span>
        </div>
      ),
    }
  })

  return (
    <section aria-labelledby="certificates-title" className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:px-10 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-4">
        <SectionLabel index="04">Certificates</SectionLabel>
        <h2 id="certificates-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-5xl">
          Proof on paper.
        </h2>
        <p data-reveal className="mt-6 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          A stack of certificates, ready to fan out. Click a card to bring it forward, then expand it to read.
        </p>
      </div>
      <CardStack cards={cards} className="lg:col-span-8" />
      {element}
    </section>
  )
}
