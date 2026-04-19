import type { Metadata } from 'next'
import Consent from './components/Consent'
import '../styles/blog.css'

const siteUrl = 'https://24frames-filmmusic.com'

export const metadata: Metadata = {
  title: { default: '24 Frames Under', template: '%s — 24 Frames Under' },
  description: 'On film music, buried and otherwise.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteUrl,
    siteName: '24 Frames Under',
    title: '24 Frames Under',
    description: 'On film music, buried and otherwise.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Consent />
      </body>
    </html>
  )
}
