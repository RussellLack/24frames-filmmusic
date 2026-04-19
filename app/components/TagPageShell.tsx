import Link from 'next/link'

const SITE_NAME = '24 Frames Under'

export default function TagPageShell({
  kicker,
  heading,
  children,
}: {
  kicker: string
  heading: string
  children: React.ReactNode
}) {
  return (
    <main className="container">
      <nav className="nav">
        <Link href="/" className="nav-name">{SITE_NAME}</Link>
        <div className="nav-links">
          <Link href="/">writing</Link>
          <Link href="/about">about</Link>
        </div>
      </nav>

      <Link href="/" className="back-link">← All writing</Link>

      <header style={{ marginBottom: '2.5rem' }}>
        <div className="mono-label">{kicker}</div>
        <h1 className="article-title" style={{ marginBottom: 0 }}>{heading}</h1>
      </header>

      {children}

      <footer className="footer">
        <span>© {new Date().getFullYear()} Russell Lack</span>
        <span>{SITE_NAME}</span>
      </footer>
    </main>
  )
}
