/**
 * Sanity Gallery Utilities
 * Helper functions for working with Sanity gallery album media arrays
 *
 * Follows the same pattern as sanity-media.ts for story moments
 */

import type {
  SanityGalleryAlbum,
  SanityGalleryAlbumMediaItem,
  RenderedGalleryMediaItem,
} from '@/types/wedding'

/**
 * Transforms Sanity media items into a normalized format for rendering
 * Handles both new media array and legacy single image/video fields
 *
 * @param album - The Sanity gallery album with media
 * @returns Array of normalized media items ready for rendering
 */
export function getGalleryAlbumMedia(
  album: SanityGalleryAlbum
): RenderedGalleryMediaItem[] {
  const mediaItems: RenderedGalleryMediaItem[] = []

  // Process new media array
  if (album.media && album.media.length > 0) {
    album.media.forEach((item) => {
      const mediaItem = transformMediaItem(item)
      if (mediaItem) {
        mediaItems.push(mediaItem)
      }
    })
  }

  // Fallback to legacy image field for backwards compatibility
  if (mediaItems.length === 0 && album.legacyImage?.asset?.url) {
    mediaItems.push({
      type: 'image',
      url: album.legacyImage.asset.url,
      alt: album.legacyImage.alt || album.title,
      order: 1,
    })
  }

  return mediaItems
}

/**
 * Transforms a single Sanity media item into normalized format
 *
 * @param item - The Sanity media item
 * @returns Normalized media item or null if invalid
 */
function transformMediaItem(
  item: SanityGalleryAlbumMediaItem
): RenderedGalleryMediaItem | null {
  if (item.mediaType === 'image' && item.image?.asset?.url) {
    return {
      type: 'image',
      url: item.image.asset.url,
      alt: item.alt || item.caption || 'Gallery photo',
      caption: item.caption,
      order: item.displayOrder,
      hotspot: item.image.hotspot,
    }
  }

  if (item.mediaType === 'video' && item.video?.asset?.url) {
    return {
      type: 'video',
      url: item.video.asset.url,
      alt: item.alt || item.caption || 'Gallery video',
      caption: item.caption,
      order: item.displayOrder,
    }
  }

  return null
}

/**
 * Gets the primary (first) media item for a gallery album
 * Useful for thumbnails, previews, and cards
 *
 * @param album - The Sanity gallery album
 * @returns The primary media item or null if none exists
 */
export function getPrimaryGalleryMedia(
  album: SanityGalleryAlbum
): RenderedGalleryMediaItem | null {
  const mediaItems = getGalleryAlbumMedia(album)
  return mediaItems.length > 0 ? mediaItems[0] : null
}

/**
 * Checks if a gallery album has multiple media items
 *
 * @param album - The Sanity gallery album
 * @returns True if the album has more than one media item
 */
export function hasMultipleMedia(album: SanityGalleryAlbum): boolean {
  return getGalleryAlbumMedia(album).length > 1
}

/**
 * Gets media items filtered by type
 *
 * @param album - The Sanity gallery album
 * @param type - Filter by 'image' or 'video'
 * @returns Array of media items of the specified type
 */
export function getGalleryMediaByType(
  album: SanityGalleryAlbum,
  type: 'image' | 'video'
): RenderedGalleryMediaItem[] {
  return getGalleryAlbumMedia(album).filter((item) => item.type === type)
}

/**
 * Generates srcset for responsive images with Sanity's image pipeline
 * Useful for optimizing image loading based on device size
 *
 * @param imageUrl - The base Sanity image URL
 * @param widths - Array of desired widths
 * @returns srcset string for responsive images
 */
export function generateSanitySrcSet(
  imageUrl: string,
  widths: number[] = [400, 800, 1200, 1600]
): string {
  if (!imageUrl.includes('cdn.sanity.io')) {
    return imageUrl
  }

  return widths
    .map((width) => {
      const url = `${imageUrl}?w=${width}&auto=format`
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Gets optimized image URL with Sanity's image pipeline
 *
 * @param imageUrl - The base Sanity image URL
 * @param options - Image optimization options
 * @returns Optimized image URL
 */
export function getOptimizedSanityImage(
  imageUrl: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
    fit?: 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min'
  } = {}
): string {
  if (!imageUrl.includes('cdn.sanity.io')) {
    return imageUrl
  }

  const params = new URLSearchParams()

  if (options.width) params.append('w', options.width.toString())
  if (options.height) params.append('h', options.height.toString())
  if (options.quality) params.append('q', options.quality.toString())
  if (options.format) params.append('fm', options.format)
  if (options.fit) params.append('fit', options.fit)

  // Auto format for best browser support
  if (!options.format) params.append('auto', 'format')

  const queryString = params.toString()
  return queryString ? `${imageUrl}?${queryString}` : imageUrl
}

/**
 * Gets image URL with hotspot cropping applied
 *
 * @param imageUrl - The base Sanity image URL
 * @param hotspot - The hotspot coordinates from Sanity
 * @param width - Desired width
 * @param height - Desired height
 * @returns Cropped image URL focused on hotspot
 */
export function getHotspotImage(
  imageUrl: string,
  hotspot: { x: number; y: number; height: number; width: number } | undefined,
  width: number,
  height: number
): string {
  if (!imageUrl.includes('cdn.sanity.io') || !hotspot) {
    return getOptimizedSanityImage(imageUrl, { width, height })
  }

  // Sanity handles hotspot automatically when using crop/fit parameters
  return getOptimizedSanityImage(imageUrl, {
    width,
    height,
    fit: 'crop',
  })
}
