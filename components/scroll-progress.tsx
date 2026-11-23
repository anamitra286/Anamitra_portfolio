'use client'

import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      if (bar.current) bar.current.style.transform = `scaleX(${progress})`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
      <div ref={bar} className="h-full origin-left bg-volt shadow-[0_0_12px_rgb(125_140_255)]" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
