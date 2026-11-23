'use server'

import { site } from '@/lib/content'

export type ContactState = {
  status: 'idle' | 'success' | 'error' | 'fallback'
  message: string
  errors?: Partial<Record<'name' | 'email' | 'message', string>>
  mailto?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (formData.get('company')) return { status: 'success', message: 'Thanks — message received.' }

  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  const errors: ContactState['errors'] = {}
  if (name.length < 2 || name.length > 100) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = 'Please enter a valid email address.'
  if (message.length < 10 || message.length > 4000) errors.message = 'Your message should be 10–4000 characters.'
  if (Object.keys(errors).length) return { status: 'error', message: 'Please check the highlighted fields.', errors }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL ?? site.email

  if (!apiKey) {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    return {
      status: 'fallback',
      message: 'Opening your email app to send the message.',
      mailto: `mailto:${to}?subject=${subject}&body=${body}`,
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        text: `${message}\n\n— ${name} (${email})`,
      }),
    })
    if (!response.ok) throw new Error(`Resend responded ${response.status}`)
    return { status: 'success', message: 'Message sent. I will get back to you soon.' }
  } catch (error) {
    console.error('Contact form failed:', error)
    return { status: 'error', message: 'Something went wrong. Please email me directly instead.' }
  }
}
