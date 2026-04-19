import Link from 'next/link'
import { getRelatedPosts } from '@/lib/sanity'
import { formatDate } from '@/lib/utils'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  subject?: string
  composers?: { _id: string }[]
  titles?: { _id: string }[]
  years?: number[]
  countries?: string[]
}

type Candidate = {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  subject?: string
  composerIds?: string[]
  titleIds?: string[]
  years?: number[]
  countries?: string[]
}

const WEIGHTS = { composer: 3, title: 3, year: 1, country: 1 }

function score(current: Post, candidate: Candidate): number {
  const cc = new Set((current.composers || []).map((c) => c._id))
  const ct = new Set((current.titles || []).map((t) => t._id))
  const cy = new Set(current.years || [])
  const co = new Set(current.countries || [])
  let s = 0
  for (const id of candidate.composerIds || []) if (cc.has(id)) s += WEIGHTS.composer
  for (const id of candidate.titleIds || []) if (ct.has(id)) s += WEIGHTS.title
  for (const y of candidate.years || []) if (cy.has(y)) s += WEIGHTS.year
  for (const c of candidate.countries || []) if (co.has(c)) s += WEIGHTS.country
  return s
}

export default async function RelatedPosts({ post, limit = 6 }: { post: Post; limit?: number }) {
  const composerIds = (post.composers || []).map((c) => c._id)
  const titleIds = (post.titles || []).map((t) => t._id)
  const years = post.years || []
  const countries = post.countries || []

  if (!composerIds.length && !titleIds.length && !years.length && !countries.length) return null

  const candidates: Candidate[] = await getRelatedPosts({
    excludeId: post._id,
    composerIds,
    titleIds,
    years,
    countries,
  })

  if (!candidates.length) return null

  const ranked = candidates
    .map((c) => ({ c, s: score(post, c) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => (b.s - a.s) || (new Date(b.c.publishedAt).getTime() - new Date(a.c.publishedAt).getTime()))
    .slice(0, limit)
    .map((r) => r.c)

  if (!ranked.length) return null

  return (
    <aside className="related-posts">
      <div className="mono-label">More from this site</div>
      {ranked.map((p) => (
        <Link key={p._id} href={`/blog/${p.slug.current}`} className="post-row">
          <span className="post-title">{p.title}</span>
          {p.subject && <span className="post-subject">{p.subject}</span>}
          <span className="post-date">{formatDate(p.publishedAt, 'short')}</span>
        </Link>
      ))}
    </aside>
  )
}
