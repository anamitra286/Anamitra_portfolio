'use client'

import { useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP, ease } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export type StackCard = {
  id: string
  front: ReactNode
  detail?: ReactNode
  label: string
}

/**
 * Overlapping cards that fan out as the stack scrolls into view or on hover,
 * tilt in 3D, and flip forward to reveal details when clicked.
 */
export function CardStack({ cards, className }: { cards: StackCard[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const spread = useRef(0)

  const { contextSafe } = useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>('[data-stack-card]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const small = window.matchMedia('(max-width: 640px)').matches
      const mid = (items.length - 1) / 2

      const layout = (amount: number, duration = 0.9) => {
        spread.current = amount
        items.forEach((el, i) => {
          const offset = i - mid
          gsap.to(el, {
            x: offset * (small ? 34 : 120) * amount,
            y: Math.abs(offset) * 14 * amount - offset * (1 - amount) * 8,
            rotateZ: offset * (small ? 5 : 7) * amount + offset * 1.5 * (1 - amount),
            rotateY: offset * -6 * amount,
            z: -Math.abs(offset) * 30,
            duration: reduce ? 0 : duration,
            ease: ease.out,
            overwrite: 'auto',
          })
        })
      }

      layout(0, 0)
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 75%',
        end: 'center 45%',
        scrub: reduce ? false : 0.6,
        onUpdate: (self) => layout(self.progress, 0.4),
      })
      ;(ref.current as HTMLDivElement & { __layout?: typeof layout }).__layout = layout
    },
    { scope: ref },
  )

  const onTilt = contextSafe((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    const el = event.currentTarget.querySelector<HTMLElement>('[data-tilt]')
    if (!el) return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, { rotateY: px * 14, rotateX: -py * 14, duration: 0.5, ease: ease.soft })
  })

  const resetTilt = contextSafe((event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget.querySelector<HTMLElement>('[data-tilt]')
    if (el) gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: ease.out })
  })

  const toggle = contextSafe((id: string) => {
    const next = active === id ? null : id
    setActive(next)
    gsap.utils.toArray<HTMLElement>('[data-stack-card]').forEach((el) => {
      const isActive = el.dataset.id === next
      gsap.to(el, {
        scale: next ? (isActive ? 1.06 : 0.94) : 1,
        autoAlpha: next && !isActive ? 0.45 : 1,
        zIndex: isActive ? 30 : Number(el.dataset.z),
        duration: 0.7,
        ease: ease.out,
      })
    })
  })

  return (
    <div
      ref={ref}
      className={cn('relative flex min-h-[26rem] items-center justify-center [perspective:1400px] sm:min-h-[30rem]', className)}
      onPointerEnter={() => {
        const host = ref.current as (HTMLDivElement & { __layout?: (n: number) => void }) | null
        if (host?.__layout && spread.current < 1) host.__layout(1)
      }}
    >
      {cards.map((card, i) => {
        const isActive = active === card.id
        return (
          <button
            key={card.id}
            type="button"
            data-stack-card
            data-id={card.id}
            data-z={i + 1}
            onClick={() => toggle(card.id)}
            onPointerMove={onTilt}
            onPointerLeave={resetTilt}
            aria-pressed={isActive}
            aria-label={`${card.label} — ${isActive ? 'hide' : 'show'} details`}
            data-cursor-label={isActive ? 'Close' : 'Open'}
            className="absolute w-[min(68vw,280px)] text-left [transform-style:preserve-3d]"
            style={{ zIndex: i + 1 }}
          >
            <div
              data-tilt
              className={cn(
                'relative aspect-[3/4] w-full rounded-2xl border bg-card p-3 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8),0_0_0_1px_rgb(255_255_255/0.02)] transition-colors duration-500 [transform-style:preserve-3d]',
                isActive ? 'border-volt/60' : 'border-paper/10',
              )}
            >
              <div className={cn('h-full transition-opacity duration-500', isActive && card.detail ? 'opacity-0' : 'opacity-100')}>
                {card.front}
              </div>
              {card.detail && (
                <div
                  className={cn(
                    'absolute inset-3 flex flex-col justify-end rounded-xl bg-gradient-to-b from-transparent via-ink/70 to-ink p-4 transition-all duration-500',
                    isActive ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
                  )}
                >
                  {card.detail}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
