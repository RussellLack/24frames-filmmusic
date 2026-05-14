import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getPostBySlug, getAllSlugs, urlFor } from '@/lib/sanity'
import { formatDate, youtubeId, readingTimeMinutes } from '@/lib/utils'
import { countryLabel } from '@/lib/countries'
import Nav from '@/app/components/Nav'
import RelatedPosts from '@/app/components/RelatedPosts'
import type { Metadata } from 'next'

export const revalidate = 60
const SITE_NAME = '24 Frames Under'
const SITE_URL = 'https://24frames-filmmusic.com'

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((s: any) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}

  const url = `${SITE_URL}/blog/${params.slug}`
  const ogImage = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      authors: ['Russell Lack'],
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
  }
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

function buildJsonLd(post: any, slug: string) {
  const url = `${SITE_URL}/blog/${slug}`
  const filmTitle = post.titles?.find((t: any) => t.kind === 'film')?.name || post.titles?.[0]?.name
  const composerNames: string[] = (post.composers || []).map((c: any) => c.name)

  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': filmTitle ? 'Review' : 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: 'Russell Lack',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Person',
      name: 'Russell Lack',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  }

  if (post.coverImage) {
    jsonLd.image = urlFor(post.coverImage).width(1200).url()
  }

  if (filmTitle) {
    jsonLd.itemReviewed = {
      '@type': 'Movie',
      name: filmTitle,
      ...(composerNames.length && {
        musicBy: composerNames.map((name) => ({ '@type': 'Person', name })),
      }),
    }
  }

  return jsonLd
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const minutes = readingTimeMinutes(post.body)
  const jsonLd = buildJsonLd(post, params.slug)

  return (
    <main className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav />

      <Link href="/" className="back-link">← All writing</Link>

      <header className="article-header">
        {post.coverImage && (
          <figure className="article-cover-figure">
            <img
              className="article-cover"
              src={urlFor(post.coverImage).width(1400).url()}
              alt={post.coverImage.alt || post.title}
            />
            {post.coverImage.caption && (
              <figcaption className="article-cover-caption">{post.coverImage.caption}</figcaption>
            )}
          </figure>
        )}
        <h1 className="article-title">{post.title}</h1>
        <PostTags post={post} />
        <div className="article-meta">
          {post.subject ? `${post.subject} · ` : ''}
          {formatDate(post.publishedAt)}
          {minutes ? ` · ${minutes} min read` : ''}
        </div>
        {post.excerpt && <p className="article-excerpt">{post.excerpt}</p>}
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

      <RelatedPosts post={post} />

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
