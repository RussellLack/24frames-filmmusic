import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getTitleBySlug,
  getAllTitleSlugs,
  getPostsByTitleSlug,
  getTitleCrossRefs,
} from '@/lib/sanity'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'
import CrossRefs from '@/app/components/CrossRefs'

export const revalidate = 3600

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
  const [title, posts, refs] = await Promise.all([
    getTitleBySlug(params.slug),
    getPostsByTitleSlug(params.slug),
    getTitleCrossRefs(params.slug),
  ])
  if (!title) notFound()

  const kindLabel = title.kind === 'tv' ? 'TV Show' : title.kind === 'film' ? 'Film' : 'Title'

  return (
    <TagPageShell
      kicker={kindLabel}
      heading={title.name}
      count={posts.length}
      crossRefs={
        <CrossRefs
          composers={refs?.composers}
          years={refs?.years}
          countries={refs?.countries}
          title="Also tagged"
        />
      }
    >
      <PostList posts={posts} />
    </TagPageShell>
  )
}
