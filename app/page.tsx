import Link from 'next/link'
import { getAllPosts, getLatestPost, urlFor } from '@/lib/sanity'
import { formatDate, categoryLabel } from '@/lib/utils'

export const revalidate = 60
const SITE_NAME = '24 Frames Under'

export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
  const [latest, allPosts] = await Promise.all([getLatestPost(), getAllPosts()])
  const activeCategory = searchParams.category ?? null
  const filtered = activeCategory ? allPosts.filter((p: any) => p.category === activeCategory) : allPosts
  const rest = filtered.filter((p: any) => p._id !== latest?._id)

  return (
    <main className="container">
      <nav className="nav">
        <Link href="/" className="nav-name">{SITE_NAME}</Link>
        <div className="nav-links">
          <Link href="/">writing</Link>
          <Link href="/about">about</Link>
        </div>
      </nav>

      {latest && !activeCategory && (
        <>
          <div className="mono-label">Latest</div>
          {latest.coverImage && <img className="hero-image" src={urlFor(latest.coverImage).width(1400).url()} alt={latest.coverImage.alt || latest.title} />}
          <h1 className="hero-title">{latest.title}</h1>
          <div className="hero-subject">{latest.subject ? `${latest.subject} · ` : ''}{formatDate(latest.publishedAt)}</div>
          {latest.excerpt && <p className="hero-excerpt">{latest.excerpt}</p>}
          <Link href={`/blog/${latest.slug.current}`} className="read-link">Read →</Link>
          <hr className="divider" />
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
        <div className="mono-label" style={{ marginBottom: 0 }}>All writing</div>
        <nav className="filter-bar">
          <Link href="/" className={!activeCategory ? 'active' : ''}>all</Link>
          <Link href="/?category=score" className={activeCategory === 'score' ? 'active' : ''}>scores</Link>
          <Link href="/?category=composer" className={activeCategory === 'composer' ? 'active' : ''}>composers</Link>
          <Link href="/?category=soundtrack" className={activeCategory === 'soundtrack' ? 'active' : ''}>soundtracks</Link>
          <Link href="/?category=essay" className={activeCategory === 'essay' ? 'active' : ''}>essays</Link>
        </nav>
      </div>

      {rest.map((post: any) => (
        <Link key={post._id} href={`/blog/${post.slug.current}`} className="post-row">
          <span className="post-cat">{categoryLabel(post.category)}</span>
          <span className="post-title">{post.title}</span>
          {post.subject && <span className="post-subject">{post.subject}</span>}
          <span className="post-date">{formatDate(post.publishedAt, 'short')}</span>
        </Link>
      ))}

      <footer className="footer">
        <span>© {new Date().getFullYear()} Russell Lack</span>
        <span>{SITE_NAME}</span>
      </footer>
    </main>
  )
}
