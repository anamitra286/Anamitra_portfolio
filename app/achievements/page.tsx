import type { Metadata } from 'next'
import { achievements } from '@/lib/content'
import { certificateIds, galleryIds, hasImage } from '@/lib/images'
import { PageHeading, RevealScope } from '@/components/reveal-scope'
import { Certificates, CircularGallery, ExperienceTimeline, Highlights } from '@/components/achievements/achievements-content'
import { ClosingCta } from '@/components/home/home-sections'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Achievements, professional experience and milestones of KR Anamitra.',
}

export default function AchievementsPage() {
  const showGallery = galleryIds.some(hasImage)
  const showCertificates = certificateIds.some(hasImage)

  return (
    <>
      <RevealScope>
        <PageHeading index="03" eyebrow="Achievements & experience">
          {achievements.heading}
        </PageHeading>
        {showGallery && <CircularGallery />}
        <Highlights />
        <ExperienceTimeline />
        {showCertificates && <Certificates />}
        <ClosingCta />
      </RevealScope>
      <SiteFooter />
    </>
  )
}
