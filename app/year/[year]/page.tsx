import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllYears, getPostsByYear } from '@/lib/sanity'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'

export const revalidate = 60

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
  const posts = await getPostsByYear(year)

  return (
    <TagPageShell kicker="Year" heading={String(year)}>
      <PostList posts={posts} />
    </TagPageShell>
  )
}
