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

// Post list projection used on listings. Keep minimal.
const POST_LIST_PROJECTION = `{
  _id, title, slug, publishedAt, category, subject, excerpt
}`

export async function getAllPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) ${POST_LIST_PROJECTION}`)
}

export async function getLatestPost() {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0] {
      _id, title, slug, publishedAt, category, subject, excerpt, coverImage
    }`,
  )
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, slug, publishedAt, category, subject, excerpt, coverImage, body, links, youtubeUrls,
      "composers": composers[]->{_id, name, "slug": slug.current},
      "titles": titles[]->{_id, name, kind, "slug": slug.current},
      years, countries
    }`,
    { slug },
  )
}

export async function getAllSlugs() {
  return client.fetch(`*[_type == "post"] { "slug": slug.current }`)
}

// --- Tag index queries ---

export async function getComposerBySlug(slug: string) {
  return client.fetch(
    `*[_type == "composer" && slug.current == $slug][0] { _id, name, "slug": slug.current }`,
    { slug },
  )
}

export async function getAllComposerSlugs() {
  return client.fetch(`*[_type == "composer" && defined(slug.current)] { "slug": slug.current }`)
}

export async function getPostsByComposerSlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && $slug in composers[]->slug.current] | order(publishedAt desc) ${POST_LIST_PROJECTION}`,
    { slug },
  )
}

export async function getTitleBySlug(slug: string) {
  return client.fetch(
    `*[_type == "title" && slug.current == $slug][0] { _id, name, kind, "slug": slug.current }`,
    { slug },
  )
}

export async function getAllTitleSlugs() {
  return client.fetch(`*[_type == "title" && defined(slug.current)] { "slug": slug.current }`)
}

export async function getPostsByTitleSlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && $slug in titles[]->slug.current] | order(publishedAt desc) ${POST_LIST_PROJECTION}`,
    { slug },
  )
}

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
