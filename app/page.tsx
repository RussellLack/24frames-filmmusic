import Link from 'next/link'
import { getAllPosts, getLatestPost, urlFor } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'
import Nav from '@/app/components/Nav'

export const revalidate = 60
const SITE_NAME = '24 Frames Under'

export default async function Home() {
  const [latest, allPosts] = await Promise.all([getLatestPost(), getAllPosts()])
  const rest = allPosts.filter((p: any) => p._id !== latest?._id)

  return (
    <main className="container">
      <Nav />

      {latest && (
        <>
          <div className="mono-label">Latest</div>
          {latest.coverImage && (
            <img
              className="hero-image"
              src={urlFor(latest.coverImage).width(1400).url()}
              alt={latest.coverImage.alt || latest.title}
            />
          )}
          <h1 className="hero-title">{latest.title}</h1>
          <div className="hero-subject">
            {latest.subject ? `${latest.subject} · ` : ''}{formatDate(latest.publishedAt)}
          </div>
          {latest.excerpt && <p className="hero-excerpt">{latest.excerpt}</p>}
          <Link href={`/blog/${latest.slug.current}`} className="read-link">Read →</Link>
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
