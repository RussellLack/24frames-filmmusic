import Link from 'next/link'

const SITE_NAME = '24 Frames Under'

export default function About() {
  return (
    <main className="container">
      <nav className="nav">
        <Link href="/" className="nav-name">{SITE_NAME}</Link>
        <div className="nav-links">
          <Link href="/">writing</Link>
          <Link href="/about">about</Link>
        </div>
      </nav>

      <div className="mono-label">About</div>
      <h1 className="article-title">24 Frames Under</h1>

      <article className="article-body" style={{ marginTop: '1.5rem' }}>
        <p>On film music, buried and otherwise. Writing on scores, soundtracks, and composers — the heard and the unheard, the canonical and the neglected.</p>
        <p>24 Frames Under began as a book — <em>24 Frames Under: A Buried History of Film Music</em> — and continues here as an ongoing excavation.</p>
        <p>Written by Russell Lack. Based in Oslo.</p>
      </article>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Russell Lack</span>
        <span>{SITE_NAME}</span>
      </footer>
    </main>
  )
}
