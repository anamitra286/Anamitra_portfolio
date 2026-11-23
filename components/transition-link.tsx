'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useTransitionNav } from './providers/transition-provider'

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

export function TransitionLink({ href, onClick, children, ...props }: TransitionLinkProps) {
  const { navigate } = useTransitionNav()

  return (
    <Link
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return
        }
        event.preventDefault()
        navigate(href)
      }}
    >
      {children}
    </Link>
  )
}
