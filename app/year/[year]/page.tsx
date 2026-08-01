import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllYears, getPostsByYear } from '@/lib/sanity'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'

export const revalidate = 3600

export async function generateStaticParams() {
  const years = await getAllYears()
  return years.map((y) => ({ year: String(y) }))
}

export async function generateMetadata({ params }: { params: { year: string } }): Promise<Metadata> {
  return { title: params.year, description: `Writing from ${params.year}.` }
}

export default async function YearPage({ params }: { params: { year: string } }) {
  const year = Number(params.year)
  if (!Number.isInteger(year)) notFound()

  const [posts, allYears] = await Promise.all([getPostsByYear(year), getAllYears()])

  const sorted = [...allYears].sort((a, b) => a - b)
  const idx = sorted.indexOf(year)
  const prev = idx > 0 ? sorted[idx - 1] : null
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null

  return (
    <TagPageShell
      kicker="Year"
      heading={String(year)}
      count={posts.length}
      crossRefs={
        (prev || next) ? (
          <aside className="cross-refs">
            <div className="mono-label">Jump to</div>
            <div className="tag-row">
              {prev && <Link href={`/year/${prev}`} className="tag">← {prev}</Link>}
              {next && <Link href={`/year/${next}`} className="tag">{next} →</Link>}
            </div>
          </aside>
        ) : null
      }
    >
      <PostList posts={posts} />
    </TagPageShell>
  )
}
