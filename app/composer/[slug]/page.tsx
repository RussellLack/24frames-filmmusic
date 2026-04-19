import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getComposerBySlug, getAllComposerSlugs, getPostsByComposerSlug } from '@/lib/sanity'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'

export const revalidate = 60

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
  const composer = await getComposerBySlug(params.slug)
  if (!composer) notFound()
  const posts = await getPostsByComposerSlug(params.slug)

  return (
    <TagPageShell kicker="Composer" heading={composer.name}>
      <PostList posts={posts} />
    </TagPageShell>
  )
}
