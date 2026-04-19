import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getAllCountries,
  getPostsByCountry,
  getCountryCrossRefs,
} from '@/lib/sanity'
import { countryLabel, COUNTRIES } from '@/lib/countries'
import TagPageShell from '@/app/components/TagPageShell'
import PostList from '@/app/components/PostList'
import CrossRefs from '@/app/components/CrossRefs'

export const revalidate = 60

export async function generateStaticParams() {
  const codes = await getAllCountries()
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

  const [posts, refs] = await Promise.all([
    getPostsByCountry(params.code),
    getCountryCrossRefs(params.code),
  ])

  return (
    <TagPageShell
      kicker="Country"
      heading={countryLabel(params.code)}
      count={posts.length}
      crossRefs={
        <CrossRefs
          composers={refs?.composers}
          titles={refs?.titles}
          years={refs?.years}
          excludeCountry={params.code}
          title="Also tagged"
        />
      }
    >
      <PostList posts={posts} />
    </TagPageShell>
  )
}
