/**
 * Sanity Client Configuration
 *
 * Provides configured Sanity clients for:
 * - Public read-only queries (client)
 * - Write operations (writeClient)
 */

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!projectId || !dataset) {
  throw new Error(
    'Missing required Sanity environment variables. Please check .env.local'
  )
}

/**
 * Public read-only client for fetching published content
 * Used in frontend components and pages
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for fast reads in production
  perspective: 'published', // Only fetch published documents
})

/**
 * Write client with authentication token
 * Used for mutations and draft content access
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Don't use CDN for writes
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'previewDrafts', // Access draft content
})

/**
 * Helper to fetch data with Next.js caching
 *
 * @example
 * const homePage = await sanityFetch({
 *   query: homePageQuery,
 *   tags: ['homePage'],
 * })
 */
export async function sanityFetch<T = any>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: any
  tags?: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    cache: 'force-cache',
    next: {
      tags,
    },
  })
}
