import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Instrument_Serif } from 'next/font/google'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { TransitionProvider } from '@/components/providers/transition-provider'
import { SiteNav } from '@/components/site-nav'
import { ScrollProgress } from '@/components/scroll-progress'
import { ClickBubbles } from '@/components/click-bubbles'
import { Cursor } from '@/components/cursor'
import { site } from '@/lib/content'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument' })

export const metadata: Metadata = {
  title: { default: site.title, template: `%s — ${site.fullName}` },
  description: site.description,
  generator: 'v0.app',
  openGraph: { title: site.title, description: site.description, type: 'website' },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#08090B',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${instrument.variable} bg-ink`}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <TransitionProvider>
            <SiteNav />
            <ScrollProgress />
            <ClickBubbles />
            {children}
            <Cursor />
          </TransitionProvider>
        </SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
