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

export async function getAllPosts() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc) { _id, title, slug, publishedAt, category, subject, excerpt }`)
}

export async function getLatestPost() {
  return client.fetch(`*[_type == "post"] | order(publishedAt desc)[0] { _id, title, slug, publishedAt, category, subject, excerpt, coverImage }`)
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] { _id, title, slug, publishedAt, category, subject, excerpt, coverImage, body, links }`,
    { slug }
  )
}

export async function getAllSlugs() {
  return client.fetch(`*[_type == "post"] { "slug": slug.current }`)
}
