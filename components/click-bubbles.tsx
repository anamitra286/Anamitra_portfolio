'use client'

import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'

const TINTS = ['rgb(125 140 255 / 0.55)', 'rgb(230 232 239 / 0.4)', 'rgb(125 140 255 / 0.3)']

/**
 * Releases a small burst of bubbles from every click or tap across the site.
 * Purely decorative: pointer-events are disabled and it respects reduced motion.
 */
export function ClickBubbles({ count = 7 }: { count?: number }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const layer = document.createElement('div')
    layer.setAttribute('aria-hidden', 'true')
    layer.className = 'pointer-events-none fixed inset-0 z-[65] overflow-hidden'
    document.body.appendChild(layer)

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return

      for (let i = 0; i < count; i++) {
        const size = 8 + Math.random() * 24
        const bubble = document.createElement('span')
        bubble.style.cssText = [
          'position:absolute', 'left:0', 'top:0',
          `width:${size}px`, `height:${size}px`, 'border-radius:50%',
          'border:1px solid rgb(230 232 239 / 0.35)',
          `background:radial-gradient(circle at 30% 30%, rgb(255 255 255 / 0.5), ${TINTS[i % TINTS.length]} 60%, transparent 72%)`,
          'will-change:transform,opacity',
        ].join(';')
        layer.appendChild(bubble)

        const startX = event.clientX - size / 2
        const startY = event.clientY - size / 2
        const rise = 90 + Math.random() * 170
        const drift = (Math.random() - 0.5) * 140

        gsap.fromTo(
          bubble,
          { x: startX, y: startY, scale: 0.2, opacity: 1 },
          {
            x: startX + drift,
            y: startY - rise,
            scale: 1,
            opacity: 0,
            duration: 1.1 + Math.random() * 0.8,
            ease: 'power2.out',
            onComplete: () => bubble.remove(),
          },
        )
      }
    }

    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', onDown)
      layer.remove()
    }
  }, [count])

  return null
}
