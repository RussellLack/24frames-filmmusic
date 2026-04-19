import Link from 'next/link'
import Nav from './Nav'

const SITE_NAME = '24 Frames Under'

export default function TagPageShell({
  kicker,
  heading,
  count,
  crossRefs,
  children,
}: {
  kicker: string
  heading: string
  count?: number
  crossRefs?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="container">
      <Nav />

      <Link href="/" className="back-link">← All writing</Link>

      <header className="tag-page-header">
        <div className="mono-label">{kicker}</div>
        <h1 className="article-title">{heading}</h1>
        {typeof count === 'number' && (
          <div className="tag-page-count">
            {count} {count === 1 ? 'post' : 'posts'}
          </div>
        )}
      </header>

      {children}

      {crossRefs}

      <footer className="footer">
        <span>© {new Date().getFullYear()} Russell Lack</span>
        <span>{SITE_NAME}</span>
      </footer>
    </main>
  )
}
