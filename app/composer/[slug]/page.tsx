import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getComposerBySlug,
  getAllComposerSlugs,
  getPostsByComposerSlug,
  getComposerCrossRefs,
} from '@/lib/sanity'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'
import CrossRefs from '@/app/components/CrossRefs'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getAllComposerSlugs()
  return slugs.map((s: any) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const composer = await getComposerBySlug(params.slug)
  if (!composer) return {}
  return { title: composer.name, description: `Writing about ${composer.name}.` }
}

export default async function ComposerPage({ params }: { params: { slug: string } }) {
  const [composer, posts, refs] = await Promise.all([
    getComposerBySlug(params.slug),
    getPostsByComposerSlug(params.slug),
    getComposerCrossRefs(params.slug),
  ])
  if (!composer) notFound()

  return (
    <TagPageShell
      kicker="Composer"
      heading={composer.name}
      count={posts.length}
      crossRefs={
        <CrossRefs
          composers={refs?.coComposers}
          titles={refs?.titles}
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
