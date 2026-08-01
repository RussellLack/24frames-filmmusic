import Link from 'next/link'
import type { Metadata } from 'next'
import Nav from '@/app/components/Nav'
import { getTopicsHub } from '@/lib/sanity'
import { countryLabel } from '@/lib/countries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Browse writing on 24 Frames Under by composer, film or TV show, year, and country.',
}

const SITE_NAME = '24 Frames Under'

export default async function TopicsPage() {
  const hub = await getTopicsHub()

  const anyTags =
    hub.composers.length + hub.titles.length + hub.years.length + hub.countries.length > 0

  return (
    <main className="container">
      <Nav />

      <header style={{ marginBottom: '2.5rem' }}>
        <div className="mono-label">Index</div>
        <h1 className="article-title" style={{ marginBottom: 0 }}>Topics</h1>
      </header>

      {!anyTags && <p className="empty-list">No tags yet.</p>}

      {hub.composers.length > 0 && (
        <section className="topic-section">
          <h2 className="topic-heading">Composers</h2>
          <div className="topic-grid">
            {hub.composers.map((c) => (
              <Link key={c._id} href={`/composer/${c.slug}`} className="topic-item">
                <span className="topic-name">{c.name}</span>
                <span className="topic-count">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hub.titles.length > 0 && (
        <section className="topic-section">
          <h2 className="topic-heading">Films & TV</h2>
          <div className="topic-grid">
            {hub.titles.map((t) => (
              <Link key={t._id} href={`/title/${t.slug}`} className="topic-item">
                <span className="topic-name">{t.name}</span>
                <span className="topic-kind">{t.kind === 'tv' ? 'TV' : 'Film'}</span>
                <span className="topic-count">{t.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hub.years.length > 0 && (
        <section className="topic-section">
          <h2 className="topic-heading">Years</h2>
          <div className="topic-grid">
            {hub.years.map((y) => (
              <Link key={y.year} href={`/year/${y.year}`} className="topic-item">
                <span className="topic-name">{y.year}</span>
                <span className="topic-count">{y.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hub.countries.length > 0 && (
        <section className="topic-section">
          <h2 className="topic-heading">Countries</h2>
          <div className="topic-grid">
            {hub.countries.map((c) => (
              <Link key={c.code} href={`/country/${c.code}`} className="topic-item">
                <span className="topic-name">{countryLabel(c.code)}</span>
                <span className="topic-count">{c.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="footer">
        <span>© {new Date().getFullYear()} Russell Lack</span>
        <span>{SITE_NAME}</span>
      </footer>
    </main>
  )
}
