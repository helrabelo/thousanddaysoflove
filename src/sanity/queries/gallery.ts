/**
 * Gallery Queries
 *
 * GROQ queries for fetching gallery images from Sanity CMS.
 * Replaces SupabaseGalleryService queries with Sanity-powered queries.
 */

import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Image URL Builder
const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Gallery Image Fields
 * Standard fields to fetch for all gallery queries
 */
const galleryImageFields = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  description,
  image {
    asset-> {
      _id,
      url,
      metadata {
        dimensions,
        lqip,
        blurhash,
        palette
      }
    },
    hotspot,
    crop
  },
  video {
    asset-> {
      _id,
      url,
      size,
      mimeType
    }
  },
  mediaType,
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
 * Get all public gallery images
 * Sorted by date taken (newest first) or display order
 */
export const galleryImagesQuery = groq`
  *[_type == "galleryImage" && isPublic == true] | order(
    displayOrder asc,
    dateTaken desc,
    _createdAt desc
  ) {
    ${galleryImageFields}
  }
`

/**
 * Get gallery images filtered by category
 */
export function getGalleryImagesByCategoryQuery(category: string) {
  return groq`
    *[_type == "galleryImage" && isPublic == true && category == $category] | order(
      displayOrder asc,
      dateTaken desc,
      _createdAt desc
    ) {
      ${galleryImageFields}
    }
  `
}

/**
 * Get featured gallery images
 */
export const featuredGalleryImagesQuery = groq`
  *[_type == "galleryImage" && isPublic == true && isFeatured == true] | order(
    displayOrder asc,
    dateTaken desc,
    _createdAt desc
  ) {
    ${galleryImageFields}
  }
`

/**
 * Get gallery images filtered by media type (photo or video)
 */
export function getGalleryImagesByMediaTypeQuery(mediaType: 'photo' | 'video') {
  return groq`
    *[_type == "galleryImage" && isPublic == true && mediaType == $mediaType] | order(
      displayOrder asc,
      dateTaken desc,
      _createdAt desc
    ) {
      ${galleryImageFields}
    }
  `
}

/**
 * Get single gallery image by ID
 */
export function getGalleryImageByIdQuery(id: string) {
  return groq`
    *[_type == "galleryImage" && _id == $id][0] {
      ${galleryImageFields}
    }
  `
}

/**
 * Get gallery statistics
 */
export const galleryStatsQuery = groq`
  {
    "total_photos": count(*[_type == "galleryImage" && isPublic == true && mediaType == "photo"]),
    "total_videos": count(*[_type == "galleryImage" && isPublic == true && mediaType == "video"]),
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
 * Search gallery images by title, description, tags, or location
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
      ${galleryImageFields}
    }
  `
}

/**
 * TypeScript Interfaces for Gallery Data
 */

export interface SanityGalleryImage {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  description?: string
  image?: {
    asset: {
      _id: string
      url: string
      metadata: {
        dimensions: {
          width: number
          height: number
          aspectRatio: number
        }
        lqip?: string
        blurhash?: string
        palette?: any
      }
    }
    hotspot?: any
    crop?: any
  }
  video?: {
    asset: {
      _id: string
      url: string
      size: number
      mimeType: string
    }
  }
  mediaType: 'photo' | 'video'
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
 * Helper: Convert Sanity image to MediaItem format
 * Maintains compatibility with existing MediaItem interface
 */
export function sanityImageToMediaItem(sanityImage: SanityGalleryImage) {
  const imageUrl = sanityImage.image?.asset?.url || ''
  const videoUrl = sanityImage.video?.asset?.url || ''
  const url = sanityImage.mediaType === 'video' ? videoUrl : imageUrl

  // Generate optimized thumbnail using Sanity Image CDN
  const thumbnailUrl = sanityImage.mediaType === 'photo' && sanityImage.image
    ? urlFor(sanityImage.image)
        .width(400)
        .height(300)
        .quality(80)
        .format('webp')
        .url()
    : url

  const aspectRatio = sanityImage.image?.asset?.metadata?.dimensions?.aspectRatio ||
                      sanityImage.aspectRatio ||
                      1.5

  return {
    id: sanityImage._id,
    title: sanityImage.title,
    description: sanityImage.description || '',
    url: url,
    thumbnail_url: thumbnailUrl,
    media_type: sanityImage.mediaType,
    aspect_ratio: aspectRatio,
    category: sanityImage.category,
    tags: sanityImage.tags || [],
    date_taken: sanityImage.dateTaken,
    location: sanityImage.location,
    is_featured: sanityImage.isFeatured,
    is_public: sanityImage.isPublic,
    upload_date: sanityImage._createdAt,
    created_at: sanityImage._createdAt,
    updated_at: sanityImage._updatedAt,
    // Additional Sanity-specific data
    photographer: sanityImage.photographer,
    camera_info: sanityImage.cameraInfo,
    // Image metadata for placeholders
    blurhash: sanityImage.image?.asset?.metadata?.blurhash,
    lqip: sanityImage.image?.asset?.metadata?.lqip,
  }
}

/**
 * Service Layer: Sanity Gallery Service
 * Drop-in replacement for SupabaseGalleryService
 */
export class SanityGalleryService {
  /**
   * Get all gallery images
   */
  static async getMediaItems(filters?: {
    categories?: string[]
    media_types?: ('photo' | 'video')[]
    is_featured?: boolean
    search_query?: string
  }) {
    try {
      let query = galleryImagesQuery
      let params: any = {}

      // Apply category filter
      if (filters?.categories && filters.categories.length > 0) {
        query = groq`
          *[_type == "galleryImage" && isPublic == true && category in $categories] | order(
            displayOrder asc,
            dateTaken desc,
            _createdAt desc
          ) {
            ${galleryImageFields}
          }
        `
        params.categories = filters.categories
      }

      // Apply media type filter
      if (filters?.media_types && filters.media_types.length > 0) {
        query = groq`
          *[_type == "galleryImage" && isPublic == true && mediaType in $mediaTypes] | order(
            displayOrder asc,
            dateTaken desc,
            _createdAt desc
          ) {
            ${galleryImageFields}
          }
        `
        params.mediaTypes = filters.media_types
      }

      // Apply featured filter
      if (filters?.is_featured !== undefined) {
        query = groq`
          *[_type == "galleryImage" && isPublic == true && isFeatured == $isFeatured] | order(
            displayOrder asc,
            dateTaken desc,
            _createdAt desc
          ) {
            ${galleryImageFields}
          }
        `
        params.isFeatured = filters.is_featured
      }

      // Apply search filter
      if (filters?.search_query) {
        query = searchGalleryImagesQuery(filters.search_query)
        params.searchTerm = `*${filters.search_query}*`
      }

      const data: SanityGalleryImage[] = await client.fetch(query, params)

      // Convert to MediaItem format for compatibility
      return data.map(sanityImageToMediaItem)
    } catch (error) {
      console.error('Error fetching gallery images from Sanity:', error)
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
   * Get featured images
   */
  static async getFeaturedImages() {
    try {
      const data: SanityGalleryImage[] = await client.fetch(featuredGalleryImagesQuery)
      return data.map(sanityImageToMediaItem)
    } catch (error) {
      console.error('Error fetching featured images from Sanity:', error)
      return []
    }
  }

  /**
   * Get images by category
   */
  static async getImagesByCategory(category: string) {
    try {
      const query = getGalleryImagesByCategoryQuery(category)
      const data: SanityGalleryImage[] = await client.fetch(query, { category })
      return data.map(sanityImageToMediaItem)
    } catch (error) {
      console.error(`Error fetching ${category} images from Sanity:`, error)
      return []
    }
  }

  /**
   * Search gallery images
   */
  static async searchImages(searchTerm: string) {
    try {
      const query = searchGalleryImagesQuery(searchTerm)
      const data: SanityGalleryImage[] = await client.fetch(query, {
        searchTerm: `*${searchTerm}*`
      })
      return data.map(sanityImageToMediaItem)
    } catch (error) {
      console.error('Error searching gallery images in Sanity:', error)
      return []
    }
  }
}
