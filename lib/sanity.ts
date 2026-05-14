import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

// Minimal projection for post listings.
const POST_LIST_PROJECTION = `{
  _id, title, slug, publishedAt, subject, excerpt
}`

// Projection for the article page — includes body + expanded refs.
const POST_FULL_PROJECTION = `{
  _id, title, slug, publishedAt, subject, excerpt, coverImage, body, links, youtubeUrls,
  "composers": composers[]->{_id, name, "slug": slug.current},
  "titles": titles[]->{_id, name, kind, "slug": slug.current},
  years, countries
}`

// ---------- Listings ----------

export async function getAllPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) ${POST_LIST_PROJECTION}`)
}

export async function getLatestPost() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0] {
      _id, title, slug, publishedAt, subject, excerpt, coverImage
    }`,
  )
}

// Hero for the homepage: prefer featured posts (most recent among them),
// fallback to plain latest if none are featured.
export async function getHeroPost() {
  return client.fetch(
    `coalesce(
      *[_type == "post" && featured == true] | order(publishedAt desc)[0] {
        _id, title, slug, publishedAt, subject, excerpt, coverImage, "featured": true
      },
      *[_type == "post"] | order(publishedAt desc)[0] {
        _id, title, slug, publishedAt, subject, excerpt, coverImage, "featured": false
      }
    )`,
  )
}

export async function getAllSlugs() {
  return client.fetch(`*[_type == "post"] { "slug": slug.current, publishedAt }`)
}

// ---------- Single post ----------

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] ${POST_FULL_PROJECTION}`,
    { slug },
  )
}

// ---------- Related posts ----------
// Find other posts sharing at least one tag dimension with the given post.
// We fetch candidates server-side, then rank by overlap count in JS.
export async function getRelatedPosts(params: {
  excludeId: string
  composerIds: string[]
  titleIds: string[]
  years: number[]
  countries: string[]
}) {
  const { excludeId, composerIds, titleIds, years, countries } = params
  if (!composerIds.length && !titleIds.length && !years.length && !countries.length) return []

  return client.fetch(
    `*[_type == "post" && _id != $excludeId && (
      count(composers[@._ref in $composerIds]) > 0 ||
      count(titles[@._ref in $titleIds]) > 0 ||
      count(years[@ in $years]) > 0 ||
      count(countries[@ in $countries]) > 0
    )] | order(publishedAt desc)[0...20] {
      _id, title, slug, publishedAt, subject,
      "composerIds": composers[]._ref,
      "titleIds": titles[]._ref,
      years, countries
    }`,
    { excludeId, composerIds, titleIds, years, countries },
  )
}

// ---------- Tag index: Composers ----------

export async function getComposerBySlug(slug: string) {
  return client.fetch(
    `*[_type == "composer" && slug.current == $slug][0] { _id, name, "slug": slug.current }`,
    { slug },
  )
}

export async function getAllComposerSlugs() {
  return client.fetch(`*[_type == "composer" && defined(slug.current)] { "slug": slug.current, publishedAt }`)
}

export async function getPostsByComposerSlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && $slug in composers[]->slug.current] | order(publishedAt desc) ${POST_LIST_PROJECTION}`,
    { slug },
  )
}

// Cross-refs: which other composers co-appear with this one, and which titles/years/countries.
export async function getComposerCrossRefs(slug: string) {
  return client.fetch(
    `{
      "coComposers": *[_type == "composer" && slug.current != $slug && _id in *[_type == "post" && $slug in composers[]->slug.current].composers[]._ref]{
        _id, name, "slug": slug.current
      },
      "titles": *[_type == "title" && _id in *[_type == "post" && $slug in composers[]->slug.current].titles[]._ref]{
        _id, name, kind, "slug": slug.current
      },
      "years": array::unique(*[_type == "post" && $slug in composers[]->slug.current].years[]),
      "countries": array::unique(*[_type == "post" && $slug in composers[]->slug.current].countries[])
    }`,
    { slug },
  )
}

// ---------- Tag index: Titles ----------

export async function getTitleBySlug(slug: string) {
  return client.fetch(
    `*[_type == "title" && slug.current == $slug][0] { _id, name, kind, "slug": slug.current }`,
    { slug },
  )
}

export async function getAllTitleSlugs() {
  return client.fetch(`*[_type == "title" && defined(slug.current)] { "slug": slug.current, publishedAt }`)
}

export async function getPostsByTitleSlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && $slug in titles[]->slug.current] | order(publishedAt desc) ${POST_LIST_PROJECTION}`,
    { slug },
  )
}

export async function getTitleCrossRefs(slug: string) {
  return client.fetch(
    `{
      "composers": *[_type == "composer" && _id in *[_type == "post" && $slug in titles[]->slug.current].composers[]._ref]{
        _id, name, "slug": slug.current
      },
      "years": array::unique(*[_type == "post" && $slug in titles[]->slug.current].years[]),
      "countries": array::unique(*[_type == "post" && $slug in titles[]->slug.current].countries[])
    }`,
    { slug },
  )
}

// ---------- Tag index: Years ----------

export async function getAllYears(): Promise<number[]> {
  const years: number[] = await client.fetch(
    `array::unique(*[_type == "post" && defined(years)].years[])`,
  )
  return (years || []).filter((y) => typeof y === 'number').sort((a, b) => b - a)
}

export async function getPostsByYear(year: number) {
  return client.fetch(
    `*[_type == "post" && $year in years] | order(publishedAt desc) ${POST_LIST_PROJECTION}`,
    { year },
  )
}

// ---------- Tag index: Countries ----------

export async function getAllCountries(): Promise<string[]> {
  const codes: string[] = await client.fetch(
    `array::unique(*[_type == "post" && defined(countries)].countries[])`,
  )
  return (codes || []).filter(Boolean)
}

export async function getPostsByCountry(code: string) {
  return client.fetch(
    `*[_type == "post" && $code in countries] | order(publishedAt desc) ${POST_LIST_PROJECTION}`,
    { code },
  )
}

export async function getCountryCrossRefs(code: string) {
  return client.fetch(
    `{
      "composers": *[_type == "composer" && _id in *[_type == "post" && $code in countries].composers[]._ref]{
        _id, name, "slug": slug.current
      },
      "titles": *[_type == "title" && _id in *[_type == "post" && $code in countries].titles[]._ref]{
        _id, name, kind, "slug": slug.current
      },
      "years": array::unique(*[_type == "post" && $code in countries].years[])
    }`,
    { code },
  )
}

// ---------- Topics hub ----------

export type TopicsHub = {
  composers: { _id: string; name: string; slug: string; count: number }[]
  titles: { _id: string; name: string; kind: string; slug: string; count: number }[]
  years: { year: number; count: number }[]
  countries: { code: string; count: number }[]
}

export async function getTopicsHub(): Promise<TopicsHub> {
  const raw = await client.fetch(`{
    "composers": *[_type == "composer"]{
      _id, name, "slug": slug.current,
      "count": count(*[_type == "post" && references(^._id)])
    }[count > 0] | order(count desc, name asc),
    "titles": *[_type == "title"]{
      _id, name, kind, "slug": slug.current,
      "count": count(*[_type == "post" && references(^._id)])
    }[count > 0] | order(count desc, name asc),
    "allYears": *[_type == "post" && defined(years)].years[],
    "allCountries": *[_type == "post" && defined(countries)].countries[]
  }`)

  const yearCounts = new Map<number, number>()
  for (const y of raw.allYears || []) {
    if (typeof y === 'number') yearCounts.set(y, (yearCounts.get(y) || 0) + 1)
  }
  const years = Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year)

  const countryCounts = new Map<string, number>()
  for (const c of raw.allCountries || []) {
    if (typeof c === 'string') countryCounts.set(c, (countryCounts.get(c) || 0) + 1)
  }
  const countries = Array.from(countryCounts.entries())
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)

  return {
    composers: raw.composers || [],
    titles: raw.titles || [],
    years,
    countries,
  }
}
