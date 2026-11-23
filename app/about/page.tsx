import type { Metadata } from 'next'
import { about } from '@/lib/content'
import { AboutIntro, Timeline } from '@/components/about/about-content'
import { PageHeading, RevealScope } from '@/components/reveal-scope'
import { ClosingCta, Marquee } from '@/components/home/home-sections'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, interests, approach and skills of KR Anamitra.',
}

export default function AboutPage() {
  return (
    <>
      <RevealScope>
        <PageHeading index="01" eyebrow="About me">
          {about.heading}
        </PageHeading>
        <AboutIntro />
        <Marquee words={['Curiosity', 'Empathy', 'Systems thinking', 'Storytelling', 'Shipping']} />
        <Timeline />
        <ClosingCta />
      </RevealScope>
      <SiteFooter />
    </>
  )
}
