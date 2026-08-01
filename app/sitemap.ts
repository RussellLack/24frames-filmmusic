import type { MetadataRoute } from 'next'
import {
  getAllSlugs,
  getAllComposerSlugs,
  getAllTitleSlugs,
  getAllYears,
  getAllCountries,
} from '@/lib/sanity'

const SITE_URL = 'https://24frames-filmmusic.com'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, composerSlugs, titleSlugs, years, countries] = await Promise.all([
    getAllSlugs(),
    getAllComposerSlugs(),
    getAllTitleSlugs(),
    getAllYears(),
    getAllCountries(),
  ])

  const now = new Date()
  const latestPostDate =
    postSlugs?.[0]?.publishedAt ? new Date(postSlugs[0].publishedAt) : now

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/topics`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
  ]

  const postRoutes: MetadataRoute.Sitemap = (postSlugs || []).map((s: any) => ({
    url: `${SITE_URL}/blog/${s.slug}`,
    lastModified: s.publishedAt ? new Date(s.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const composerRoutes: MetadataRoute.Sitemap = (composerSlugs || []).map((s: any) => ({
    url: `${SITE_URL}/composer/${s.slug}`,
    lastModified: latestPostDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const titleRoutes: MetadataRoute.Sitemap = (titleSlugs || []).map((s: any) => ({
    url: `${SITE_URL}/title/${s.slug}`,
    lastModified: latestPostDate,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const yearRoutes: MetadataRoute.Sitemap = years.map((y) => ({
    url: `${SITE_URL}/year/${y}`,
    lastModified: latestPostDate,
    changeFrequency: 'yearly',
    priority: 0.4,
  }))

  const countryRoutes: MetadataRoute.Sitemap = countries.map((c) => ({
    url: `${SITE_URL}/country/${c}`,
    lastModified: latestPostDate,
    changeFrequency: 'monthly',
    priority: 0.4,
  }))

  return [
    ...staticRoutes,
    ...postRoutes,
    ...composerRoutes,
    ...titleRoutes,
    ...yearRoutes,
    ...countryRoutes,
  ]
}
