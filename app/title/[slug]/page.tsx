import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTitleBySlug, getAllTitleSlugs, getPostsByTitleSlug } from '@/lib/sanity'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllTitleSlugs()
  return slugs.map((s: any) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = await getTitleBySlug(params.slug)
  if (!title) return {}
  return { title: title.name, description: `Writing about ${title.name}.` }
}

export default async function TitlePage({ params }: { params: { slug: string } }) {
  const title = await getTitleBySlug(params.slug)
  if (!title) notFound()
  const posts = await getPostsByTitleSlug(params.slug)

  const kindLabel = title.kind === 'tv' ? 'TV Show' : title.kind === 'film' ? 'Film' : 'Title'

  return (
    <TagPageShell kicker={kindLabel} heading={title.name}>
      <PostList posts={posts} />
    </TagPageShell>
  )
}
