import { Hero } from '@/components/hero/hero'
import { ClosingCta, Manifesto, Marquee, SelectedWork, SkillStack } from '@/components/home/home-sections'
import { RevealScope } from '@/components/reveal-scope'
import { SiteFooter } from '@/components/site-footer'

export default function HomePage() {
  return (
    <>
      <RevealScope>
        <Hero />
        <Manifesto />
        <Marquee />
        <SelectedWork />
        <SkillStack />
        <ClosingCta />
      </RevealScope>
      <SiteFooter />
    </>
  )
}
