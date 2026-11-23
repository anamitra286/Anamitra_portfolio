'use client'

import { useRef, type ReactNode, type RefObject } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { TransitionLink } from './transition-link'

export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, strength = 0.35) {
  useGSAP(
    () => {
      const el = ref.current
      if (!el || !window.matchMedia('(pointer: fine)').matches) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    },
    { dependencies: [strength] },
  )
}

type MagneticButtonProps = {
  children: ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'md' | 'lg'
  icon?: ReactNode | false
  disabled?: boolean
  className?: string
  'aria-label'?: string
}

const variants = {
  solid: 'bg-paper text-ink border-paper',
  outline: 'bg-transparent text-paper border-paper/25 hover:border-paper/60',
  ghost: 'bg-transparent text-paper border-transparent',
}

const fills = {
  solid: 'bg-volt',
  outline: 'bg-paper',
  ghost: 'bg-paper/10',
}

const hoverText = {
  solid: 'group-hover:text-ink',
  outline: 'group-hover:text-ink',
  ghost: '',
}

export function MagneticButton({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'outline',
  size = 'md',
  icon,
  disabled,
  className,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null)
  useMagnetic(ref, 0.3)

  const classes = cn(
    'group relative inline-flex select-none items-center justify-center gap-3 overflow-hidden rounded-full border font-medium uppercase tracking-[0.18em] transition-[transform,border-color,box-shadow] duration-300 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50',
    'hover:shadow-[0_0_40px_-8px_rgb(125_140_255/0.55)]',
    size === 'lg' ? 'h-14 px-8 text-xs' : 'h-11 px-6 text-[11px]',
    variants[variant],
    className,
  )

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-0 translate-y-full rounded-[inherit] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0',
          fills[variant],
        )}
      />
      <span className={cn('relative z-10 transition-colors duration-300', hoverText[variant])}>{children}</span>
      {icon !== false && (
        <span
          aria-hidden="true"
          className={cn('relative z-10 inline-flex size-4 overflow-hidden transition-colors duration-300', hoverText[variant])}
        >
          {icon ?? (
            <>
              <ArrowUpRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-4 group-hover:translate-x-4" />
              <ArrowUpRight className="absolute size-4 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:translate-y-0" />
            </>
          )}
        </span>
      )}
    </>
  )

  if (href && href.startsWith('/')) {
    return (
      <TransitionLink
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        data-cursor="hover"
        aria-label={rest['aria-label']}
      >
        {content}
      </TransitionLink>
    )
  }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        data-cursor="hover"
        aria-label={rest['aria-label']}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      data-cursor="hover"
      aria-label={rest['aria-label']}
    >
      {content}
    </button>
  )
}
