import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllSlugs, urlFor } from '@/lib/sanity'
import { formatDate, categoryLabel } from '@/lib/utils'
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
      </header>

      <article className="article-body">
        <PortableText value={post.body} components={components} />
      </article>

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
