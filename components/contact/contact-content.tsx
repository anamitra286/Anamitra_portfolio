'use client'

import { useActionState, useEffect } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { contact } from '@/lib/content'
import { sendMessage, type ContactState } from '@/app/contact/actions'
import { MagneticButton } from '@/components/magnetic-button'
import { SectionLabel } from '@/components/reveal-scope'
import { cn } from '@/lib/utils'

export function SocialLinks() {
  return (
    <section aria-label="Profiles" className="mx-auto max-w-7xl px-6 md:px-10">
      <ul data-stagger className="border-t border-paper/10">
        {contact.socials.map((social, i) => {
          const external = social.href.startsWith('http')
          return (
            <li key={social.label} className="border-b border-paper/10">
              <a
                href={social.href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                data-cursor-label="Open"
                className="group relative flex items-center gap-6 overflow-hidden py-7 md:py-9"
              >
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100" aria-hidden="true" />
                <span className="relative font-mono text-xs text-volt transition-colors group-hover:text-ink/60">{`0${i + 1}`}</span>
                <span className="relative text-[clamp(2rem,6vw,5.5rem)] font-semibold uppercase leading-none tracking-[-0.04em] transition-all duration-500 group-hover:translate-x-4 group-hover:text-ink">
                  {social.label}
                </span>
                <span className="relative ml-auto hidden text-sm text-muted-foreground transition-colors group-hover:text-ink/70 md:inline">
                  {social.handle}
                </span>
                <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full border border-paper/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:text-ink md:size-16">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const initial: ContactState = { status: 'idle', message: '' }

function Field({
  id,
  label,
  error,
  multiline,
  ...props
}: { id: string; label: string; error?: string; multiline?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  const className = cn(
    'peer w-full border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg text-paper outline-none transition-colors placeholder:text-transparent focus:border-volt',
    error ? 'border-destructive' : 'border-paper/20',
  )
  return (
    <div className="relative">
      {multiline ? (
        <textarea id={id} name={id} rows={4} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={cn(className, 'resize-none')} required minLength={10} maxLength={4000} />
      ) : (
        <input id={id} name={id} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={className} {...props} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-7 text-lg text-muted-foreground transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.2em] peer-focus:text-volt peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.2em]"
      >
        {label}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, initial)

  useEffect(() => {
    if (state.status === 'fallback' && state.mailto) window.location.href = state.mailto
  }, [state])

  return (
    <section aria-labelledby="form-title" className="mx-auto grid max-w-7xl gap-12 px-6 py-28 md:px-10 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <SectionLabel index="02">Write to me</SectionLabel>
        <h2 id="form-title" data-split className="mt-6 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-5xl">
          Start a conversation.
        </h2>
        <p data-reveal className="mt-6 max-w-sm text-pretty leading-relaxed text-muted-foreground">
          Product ideas, collaborations, roles or just a good question — I read every message.
        </p>
      </div>

      {state.status === 'success' ? (
        <div role="status" className="flex flex-col items-start justify-center gap-6 rounded-3xl border border-volt/40 bg-card p-10 lg:col-span-8">
          <span className="flex size-14 items-center justify-center rounded-full bg-volt text-ink">
            <Check className="size-6" aria-hidden="true" />
          </span>
          <p className="text-3xl font-medium tracking-tight">{state.message}</p>
        </div>
      ) : (
        <form action={action} noValidate className="flex flex-col gap-8 lg:col-span-8" data-reveal>
          <div className="grid gap-8 md:grid-cols-2">
            <Field id="name" label="Your name" autoComplete="name" required maxLength={100} error={state.errors?.name} />
            <Field id="email" label="Email address" type="email" autoComplete="email" required maxLength={200} error={state.errors?.email} />
          </div>
          <Field id="message" label="Tell me about it" multiline error={state.errors?.message} />
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="flex flex-wrap items-center justify-between gap-6">
            <p aria-live="polite" className={cn('text-sm', state.status === 'error' ? 'text-destructive' : 'text-muted-foreground')}>
              {state.message}
            </p>
            <MagneticButton type="submit" variant="solid" size="lg" disabled={pending}>
              {pending ? 'Sending…' : 'Send message'}
            </MagneticButton>
          </div>
        </form>
      )}
    </section>
  )
}

export function Closing() {
  return (
    <section aria-label="Closing" className="noise relative overflow-hidden border-t border-paper/10 px-6 py-32 text-center md:px-10 md:py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/10 blur-[130px]" aria-hidden="true" />
      <p data-split className="relative mx-auto max-w-6xl text-balance text-[clamp(2.4rem,7.5vw,7.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.045em]">
        {contact.closing}
      </p>
    </section>
  )
}
