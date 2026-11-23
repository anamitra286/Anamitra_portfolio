import type { Metadata } from 'next'
import { contact } from '@/lib/content'
import { PageHeading, RevealScope } from '@/components/reveal-scope'
import { Closing, ContactForm, SocialLinks } from '@/components/contact/contact-content'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with KR Anamitra — email, LinkedIn, GitHub, Medium or the contact form.',
}

export default function ContactPage() {
  return (
    <>
      <RevealScope>
        <PageHeading index="04" eyebrow="Contact">
          {contact.heading}
        </PageHeading>
        <SocialLinks />
        <ContactForm />
        <Closing />
      </RevealScope>
      <SiteFooter />
    </>
  )
}
