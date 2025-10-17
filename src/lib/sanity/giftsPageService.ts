/**
 * Gifts Page Sanity Service
 *
 * Service layer for fetching gifts page sections (header, footer, project renders)
 * from Sanity CMS. Provides type-safe access to all /presentes page content.
 */

import { sanityFetch } from '@/sanity/lib/client'
import { giftsPageSectionsQuery, projectRendersQuery } from '@/sanity/queries/gifts'
import type { GiftsPageSections, ProjectRender } from '@/types/wedding'

/**
 * Fetches all gifts page sections (header, footer, project gallery)
 * from Sanity CMS with Next.js caching
 *
 * @returns Complete gifts page sections or null if not found/not active
 */
export async function getGiftsPageSections(): Promise<GiftsPageSections | null> {
  try {
    const sections = await sanityFetch<GiftsPageSections>({
      query: giftsPageSectionsQuery,
      tags: ['giftsPageSections'],
    })

    return sections
  } catch (error) {
    console.error('Error fetching gifts page sections:', error)
    return null
  }
}

/**
 * Fetches only the project render gallery images
 * from Sanity CMS with Next.js caching
 *
 * @returns Project render images sorted by display order, or empty array
 */
export async function getProjectRenders(): Promise<ProjectRender[]> {
  try {
    const data = await sanityFetch<{
      projectGalleryTitle?: string
      projectGalleryDescription?: string
      projectRenders?: ProjectRender[]
    }>({
      query: projectRendersQuery,
      tags: ['giftsPageSections', 'projectRenders'],
    })

    return data?.projectRenders ?? []
  } catch (error) {
    console.error('Error fetching project renders:', error)
    return []
  }
}

/**
 * Helper function to get Sanity image URL builder for project renders
 * Generates optimized image URLs with proper sizing and CDN caching
 *
 * @param imageUrl - Base Sanity image URL
 * @param width - Desired width (optional)
 * @param height - Desired height (optional)
 * @returns Optimized image URL
 */
export function getProjectRenderImageUrl(
  imageUrl: string,
  width?: number,
  height?: number
): string {
  if (!imageUrl) return ''

  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    let url = imageUrl

    // Add optimization parameters
    const params: string[] = []
    if (width) params.push(`w=${width}`)
    if (height) params.push(`h=${height}`)
    params.push('auto=format') // Auto-format based on browser support
    params.push('fit=max') // Fit within dimensions without cropping

    if (params.length > 0) {
      url += (url.includes('?') ? '&' : '?') + params.join('&')
    }

    return url
  }

  return imageUrl
}

/**
 * Helper to split multi-line content into array of lines
 * Client components can use this to map over lines and add <br/> tags
 *
 * @param content - Multi-line text content
 * @returns Array of text lines
 */
export function splitContentIntoLines(content: string): string[] {
  if (!content) return []
  return content.split('\n')
}
