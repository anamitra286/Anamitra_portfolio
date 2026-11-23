import type { Metadata } from 'next'
import { PageHeading, RevealScope } from '@/components/reveal-scope'
import { ProjectList } from '@/components/work/project-list'
import { ClosingCta } from '@/components/home/home-sections'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects by KR Anamitra — DecisionOS, a digital portfolio maker and multimodal LLM security research.',
}

export default function WorkPage() {
  return (
    <>
      <RevealScope>
        <PageHeading index="02" eyebrow="My work">
          IDEAS TURNED INTO REALITY.
        </PageHeading>
        <ProjectList />
        <ClosingCta />
      </RevealScope>
      <SiteFooter />
    </>
  )
}
