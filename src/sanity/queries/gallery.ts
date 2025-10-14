/**
 * Gallery Queries
 *
 * GROQ queries for fetching gallery albums from Sanity CMS.
 * Updated to support multiple media items per album.
 */

import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import type { MediaItem } from '@/types/wedding'

// Image URL Builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Media Fragment
 * Fetches media array with proper asset resolution for both images and videos
 */
const mediaFragment = groq`
  media[] {
    mediaType,
    "image": select(
      mediaType == "image" => image {
        asset-> { url },
        alt,
        hotspot,
        crop
      }
    ),
    "video": select(
      mediaType == "video" => video {
        asset-> { url }
      }
    ),
    alt,
    caption,
    displayOrder
  } | order(displayOrder asc)
`

/**
 * Legacy Media Fragment (for backwards compatibility)
 * Fetches old single image/video fields if they exist
 */
const legacyMediaFragment = groq`
  "legacyImage": image {
    asset-> { url },
    alt
  }
`

/**
 * Gallery Album Fields
 * Standard fields to fetch for all gallery queries
 */
const galleryAlbumFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  description,
  ${mediaFragment},
  ${legacyMediaFragment},
  category,
  tags,
  dateTaken,
  location,
  isFeatured,
  isPublic,
  displayOrder,
  aspectRatio,
  photographer,
  cameraInfo
`

/**
 * Get all public gallery albums
 * Sorted by date taken (newest first) or display order
 */
export const galleryImagesQuery = groq`
  *[_type == "galleryImage" && isPublic == true] | order(
    displayOrder asc,
    dateTaken desc,
    _createdAt desc
  ) {
    ${galleryAlbumFields}
  }
`

/**
 * Get gallery albums filtered by category
 */
export function getGalleryImagesByCategoryQuery(category: string) {
  return groq`
    *[_type == "galleryImage" && isPublic == true && category == $category] | order(
      displayOrder asc,
      dateTaken desc,
      _createdAt desc
    ) {
      ${galleryAlbumFields}
    }
  `
}

/**
 * Get featured gallery albums
 */
export const featuredGalleryImagesQuery = groq`
  *[_type == "galleryImage" && isPublic == true && isFeatured == true] | order(
    displayOrder asc,
    dateTaken desc,
    _createdAt desc
  ) {
    ${galleryAlbumFields}
  }
`

/**
 * Get single gallery album by ID
 */
export function getGalleryImageByIdQuery(id: string) {
  return groq`
    *[_type == "galleryImage" && _id == $id][0] {
      ${galleryAlbumFields}
    }
  `
}

/**
 * Get gallery statistics
 */
export const galleryStatsQuery = groq`
  {
    "total_photos": count(*[_type == "galleryImage" && isPublic == true]),
    "total_videos": count(*[_type == "galleryImage" && isPublic == true]),
    "featured_count": count(*[_type == "galleryImage" && isPublic == true && isFeatured == true]),
    "categories_breakdown": {
      "engagement": count(*[_type == "galleryImage" && isPublic == true && category == "engagement"]),
      "travel": count(*[_type == "galleryImage" && isPublic == true && category == "travel"]),
      "dates": count(*[_type == "galleryImage" && isPublic == true && category == "dates"]),
      "family": count(*[_type == "galleryImage" && isPublic == true && category == "family"]),
      "friends": count(*[_type == "galleryImage" && isPublic == true && category == "friends"]),
      "special_moments": count(*[_type == "galleryImage" && isPublic == true && category == "special_moments"]),
      "proposal": count(*[_type == "galleryImage" && isPublic == true && category == "proposal"]),
      "wedding_prep": count(*[_type == "galleryImage" && isPublic == true && category == "wedding_prep"]),
      "behind_scenes": count(*[_type == "galleryImage" && isPublic == true && category == "behind_scenes"]),
      "professional": count(*[_type == "galleryImage" && isPublic == true && category == "professional"])
    },
    "most_popular_category": *[_type == "galleryImage" && isPublic == true] | {
      category
    } | group(category) | order(count desc)[0].category,
    "latest_upload_date": *[_type == "galleryImage" && isPublic == true] | order(_createdAt desc)[0]._createdAt
  }
`

/**
 * Search gallery albums by title, description, tags, or location
 */
export function searchGalleryImagesQuery(searchTerm: string) {
  return groq`
    *[
      _type == "galleryImage" &&
      isPublic == true &&
      (
        title match $searchTerm ||
        description match $searchTerm ||
        location match $searchTerm ||
        $searchTerm in tags
      )
    ] | order(
      displayOrder asc,
      dateTaken desc,
      _createdAt desc
    ) {
      ${galleryAlbumFields}
    }
  `
}

/**
 * TypeScript Interfaces for Gallery Data
 */

export interface SanityGalleryAlbumMediaItem {
  mediaType: 'image' | 'video'
  image?: {
    asset: { url: string }
    alt?: string
    hotspot?: any
    crop?: any
  }
  video?: {
    asset: { url: string }
  }
  alt?: string
  caption?: string
  displayOrder: number
}

export interface SanityGalleryAlbum {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  description?: string
  media: SanityGalleryAlbumMediaItem[]
  legacyImage?: {
    asset: { url: string }
    alt?: string
  }
  category: string
  tags?: string[]
  dateTaken?: string
  location?: string
  isFeatured: boolean
  isPublic: boolean
  displayOrder?: number
  aspectRatio?: number
  photographer?: string
  cameraInfo?: {
    make?: string
    model?: string
    lens?: string
    settings?: string
  }
}

export interface SanityGalleryStats {
  total_photos: number
  total_videos: number
  featured_count: number
  categories_breakdown: {
    engagement: number
    travel: number
    dates: number
    family: number
    friends: number
    special_moments: number
    proposal: number
    wedding_prep: number
    behind_scenes: number
    professional: number
  }
  most_popular_category: string
  latest_upload_date?: string
}

/**
 * Helper: Convert Sanity album to MediaItem format
 * Maintains compatibility with existing MediaItem interface
 * Returns the PRIMARY (first) media item from the album
 */
export function sanityAlbumToMediaItem(sanityAlbum: SanityGalleryAlbum): MediaItem {
  // Get first media item or fallback to legacy image
  const firstMedia = sanityAlbum.media?.[0]
  const imageUrl = firstMedia?.image?.asset?.url || sanityAlbum.legacyImage?.asset?.url || ''
  const videoUrl = firstMedia?.video?.asset?.url || ''
  const mediaType = firstMedia?.mediaType === 'video' ? 'video' : 'photo'
  const url = mediaType === 'video' ? videoUrl : imageUrl

  // Generate optimized thumbnail using Sanity Image CDN
  const thumbnailUrl = mediaType === 'photo' && firstMedia?.image
    ? urlFor(firstMedia.image)
        .width(400)
        .height(300)
        .quality(80)
        .format('webp')
        .url()
    : url

  return {
    id: sanityAlbum._id,
    title: sanityAlbum.title,
    description: sanityAlbum.description || '',
    url: url,
    thumbnail_url: thumbnailUrl,
    media_type: mediaType,
    aspect_ratio: sanityAlbum.aspectRatio || 1.5,
    category: sanityAlbum.category as MediaItem['category'],
    tags: sanityAlbum.tags || [],
    date_taken: sanityAlbum.dateTaken,
    location: sanityAlbum.location,
    is_featured: sanityAlbum.isFeatured,
    is_public: sanityAlbum.isPublic,
    upload_date: sanityAlbum._createdAt,
    created_at: sanityAlbum._createdAt,
    updated_at: sanityAlbum._updatedAt,
    // Additional Sanity-specific data in metadata
    metadata: {
      photographer: sanityAlbum.photographer,
      camera_make: sanityAlbum.cameraInfo?.make,
      camera_model: sanityAlbum.cameraInfo?.model,
      lens: sanityAlbum.cameraInfo?.lens,
    },
  }
}

/**
 * Service Layer: Sanity Gallery Service
 * Drop-in replacement for SupabaseGalleryService
 */
export class SanityGalleryService {
  /**
   * Get all gallery albums
   */
  static async getMediaItems(filters?: {
    categories?: string[]
    media_types?: ('photo' | 'video')[]
    is_featured?: boolean
    search_query?: string
  }): Promise<MediaItem[]> {
    try {
      let query = galleryImagesQuery
      const params: Record<string, unknown> = {}

      // Apply category filter
      if (filters?.categories && filters.categories.length > 0) {
        query = groq`
          *[_type == "galleryImage" && isPublic == true && category in $categories] | order(
            displayOrder asc,
            dateTaken desc,
            _createdAt desc
          ) {
            ${galleryAlbumFields}
          }
        `
        params.categories = filters.categories
      }

      // Apply featured filter
      if (filters?.is_featured !== undefined) {
        query = groq`
          *[_type == "galleryImage" && isPublic == true && isFeatured == $isFeatured] | order(
            displayOrder asc,
            dateTaken desc,
            _createdAt desc
          ) {
            ${galleryAlbumFields}
          }
        `
        params.isFeatured = filters.is_featured
      }

      // Apply search filter
      if (filters?.search_query) {
        query = searchGalleryImagesQuery(filters.search_query)
        params.searchTerm = `*${filters.search_query}*`
      }

      const data: SanityGalleryAlbum[] = await client.fetch(query, params)

      // Convert to MediaItem format for compatibility (using primary media item)
      return data.map(sanityAlbumToMediaItem)
    } catch (error) {
      console.error('Error fetching gallery albums from Sanity:', error)
      return []
    }
  }

  /**
   * Get gallery statistics
   */
  static async getGalleryStats() {
    try {
      const stats: SanityGalleryStats = await client.fetch(galleryStatsQuery)

      // Add total_size_mb and timeline_events_count for compatibility
      return {
        ...stats,
        total_size_mb: 0, // Not tracked in Sanity (CDN handles optimization)
        timeline_events_count: 0, // To be added when timeline is migrated
      }
    } catch (error) {
      console.error('Error fetching gallery stats from Sanity:', error)
      throw error
    }
  }

  /**
   * Get featured albums
   */
  static async getFeaturedImages(): Promise<MediaItem[]> {
    try {
      const data: SanityGalleryAlbum[] = await client.fetch(featuredGalleryImagesQuery)
      return data.map(sanityAlbumToMediaItem)
    } catch (error) {
      console.error('Error fetching featured albums from Sanity:', error)
      return []
    }
  }

  /**
   * Get albums by category
   */
  static async getImagesByCategory(category: string): Promise<MediaItem[]> {
    try {
      const query = getGalleryImagesByCategoryQuery(category)
      const data: SanityGalleryAlbum[] = await client.fetch(query, { category })
      return data.map(sanityAlbumToMediaItem)
    } catch (error) {
      console.error(`Error fetching ${category} albums from Sanity:`, error)
      return []
    }
  }

  /**
   * Search gallery albums
   */
  static async searchImages(searchTerm: string): Promise<MediaItem[]> {
    try {
      const query = searchGalleryImagesQuery(searchTerm)
      const data: SanityGalleryAlbum[] = await client.fetch(query, {
        searchTerm: `*${searchTerm}*`
      })
      return data.map(sanityAlbumToMediaItem)
    } catch (error) {
      console.error('Error searching gallery albums in Sanity:', error)
      return []
    }
  }
}
