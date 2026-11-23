'use client'

import { useEffect, useState } from 'react'

export function Typewriter({ words, className }: { words: string[]; className?: string }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [length, setLength] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const word = words[wordIndex]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLength(word.length)
      const id = setTimeout(() => setWordIndex((i) => (i + 1) % words.length), 2600)
      return () => clearTimeout(id)
    }

    let delay = deleting ? 38 : 85
    if (!deleting && length === word.length) delay = 1800
    if (deleting && length === 0) delay = 350

    const id = setTimeout(() => {
      if (!deleting && length === word.length) {
        setDeleting(true)
      } else if (deleting && length === 0) {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % words.length)
      } else {
        setLength((l) => l + (deleting ? -1 : 1))
      }
    }, delay)
    return () => clearTimeout(id)
  }, [deleting, length, word, words.length])

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {word
          .slice(0, length)
          .split('')
          .map((char, i) => (
            <span key={`${wordIndex}-${i}`} className="inline-block animate-char-in whitespace-pre">
              {char}
            </span>
          ))}
      </span>
    </span>
  )
}
