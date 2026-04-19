import Link from 'next/link'
import { getAllPosts, getHeroPost, urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'
import Nav from '@/app/components/Nav'

export const revalidate = 60
const SITE_NAME = '24 Frames Under'

export default async function Home() {
  const [hero, allPosts] = await Promise.all([getHeroPost(), getAllPosts()])
  const rest = allPosts.filter((p: any) => p._id !== hero?._id)

  return (
    <main className="container">
      <Nav />

      {hero && (
        <>
          <div className="mono-label">{hero.featured ? 'Featured' : 'Latest'}</div>
          {hero.coverImage && (
            <img
              className="hero-image"
              src={urlFor(hero.coverImage).width(1400).url()}
              alt={hero.coverImage.alt || hero.title}
            />
          )}
          <h1 className="hero-title">{hero.title}</h1>
          <div className="hero-subject">
            {hero.subject ? `${hero.subject} · ` : ''}{formatDate(hero.publishedAt)}
          </div>
          {hero.excerpt && <p className="hero-excerpt">{hero.excerpt}</p>}
          <Link href={`/blog/${hero.slug.current}`} className="read-link">Read →</Link>
          <hr className="divider" />
        </>
      )}

      <div className="listing-head">
        <div className="mono-label" style={{ marginBottom: 0 }}>All writing</div>
        <Link href="/topics" className="browse-link">Browse topics →</Link>
      </div>

      {rest.map((post: any) => (
        <Link key={post._id} href={`/blog/${post.slug.current}`} className="post-row">
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
