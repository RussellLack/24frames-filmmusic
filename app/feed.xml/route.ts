import { getAllPosts } from '@/lib/sanity'

const SITE_URL = 'https://24frames-filmmusic.com'
const SITE_NAME = '24 Frames Under'
const SITE_DESCRIPTION = 'On film music, buried and otherwise.'

export const revalidate = 60

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts: Array<{
    _id: string
    title: string
    slug: { current: string }
    publishedAt: string
    subject?: string
    excerpt?: string
  }> = await getAllPosts()

  const lastBuildDate = new Date().toUTCString()

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug.current}`
      const pubDate = new Date(post.publishedAt).toUTCString()
      const descParts = [post.subject, post.excerpt].filter(Boolean).join(' — ')
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      ${descParts ? `<description>${escapeXml(descParts)}</description>` : ''}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-GB</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=600',
    },
  })
}
