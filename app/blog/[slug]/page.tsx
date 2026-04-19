import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllSlugs, urlFor } from '@/lib/sanity'
import { formatDate, categoryLabel, youtubeId } from '@/lib/utils'
import { countryLabel } from '@/lib/countries'
import type { Metadata } from 'next'

export const revalidate = 60
const SITE_NAME = '24 Frames Under'

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((s: any) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

function PostTags({ post }: { post: any }) {
  const composers: { _id: string; name: string; slug: string }[] = post.composers || []
  const titles: { _id: string; name: string; kind?: string; slug: string }[] = post.titles || []
  const years: number[] = post.years || []
  const countries: string[] = post.countries || []
  if (!composers.length && !titles.length && !years.length && !countries.length) return null
  return (
    <div className="tag-row">
      {composers.map((c) => (
        <Link key={`c-${c._id}`} href={`/composer/${c.slug}`} className="tag">{c.name}</Link>
      ))}
      {titles.map((t) => (
        <Link key={`t-${t._id}`} href={`/title/${t.slug}`} className="tag">{t.name}</Link>
      ))}
      {years.map((y) => (
        <Link key={`y-${y}`} href={`/year/${y}`} className="tag">{y}</Link>
      ))}
      {countries.map((code) => (
        <Link key={`co-${code}`} href={`/country/${code}`} className="tag">{countryLabel(code)}</Link>
      ))}
    </div>
  )
}

const components = {
  types: {
    image: ({ value }: any) => (
      <figure>
        <img
          src={urlFor(value).width(1200).url()}
          alt={value.alt || ''}
          style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(15%)' }}
        />
        {value.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
  },
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

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

      <header className="article-header">
        {post.coverImage && (
          <img
            className="article-cover"
            src={urlFor(post.coverImage).width(1400).url()}
            alt={post.coverImage.alt || post.title}
          />
        )}
        {post.category && <div className="mono-label">{categoryLabel(post.category)}</div>}
        <h1 className="article-title">{post.title}</h1>
        <div className="article-meta">
          {post.subject ? `${post.subject} · ` : ''}{formatDate(post.publishedAt)}
        </div>
        {post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}
        <PostTags post={post} />
      </header>

      <article className="article-body">
        <PortableText value={post.body} components={components} />
      </article>

      {post.youtubeUrls && post.youtubeUrls.length > 0 && (
        <aside className="video-list">
          <div className="mono-label">Watch</div>
          {post.youtubeUrls
            .map((url: string) => ({ url, id: youtubeId(url) }))
            .filter((v: { id: string | null }) => v.id)
            .map((v: { url: string; id: string }) => (
              <div key={v.id} className="video-embed">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.id}`}
                  title="YouTube video"
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ))}
        </aside>
      )}

      {post.links && post.links.length > 0 && (
        <aside className="further-reading">
          <div className="mono-label">Further reading</div>
          <ul className="links-list">
            {post.links.map((link: { label: string; url: string }, i: number) => (
              <li key={i}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <footer className="footer">
        <span>© {new Date().getFullYear()} Russell Lack</span>
        <span>{SITE_NAME}</span>
      </footer>
    </main>
  )
}
