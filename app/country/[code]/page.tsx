import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllCountries, getPostsByCountry } from '@/lib/sanity'
import { countryLabel, COUNTRIES } from '@/lib/countries'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'

export const revalidate = 60

export async function generateStaticParams() {
  const codes = await getAllCountries()
  // Only build pages for countries that actually have posts.
  const valid = new Set(COUNTRIES.map((c) => c.value))
  return codes.filter((c) => valid.has(c)).map((code) => ({ code }))
}

export async function generateMetadata({ params }: { params: { code: string } }): Promise<Metadata> {
  const name = countryLabel(params.code)
  return { title: name, description: `Writing from ${name}.` }
}

export default async function CountryPage({ params }: { params: { code: string } }) {
  const valid = new Set(COUNTRIES.map((c) => c.value))
  if (!valid.has(params.code)) notFound()
  const posts = await getPostsByCountry(params.code)

  return (
    <TagPageShell kicker="Country" heading={countryLabel(params.code)}>
      <PostList posts={posts} />
    </TagPageShell>
  )
}
