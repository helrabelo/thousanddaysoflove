/**
 * Sanity Image URL Builder
 *
 * Helper for generating optimized image URLs from Sanity image references
 */

import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { client } from './client'

const builder = imageUrlBuilder(client)

/**
 * Generate optimized image URL from Sanity image reference
 *
 * @example
 * <Image
 *   src={urlForImage(image).width(800).height(600).url()}
 *   alt="Hero image"
 * />
 */
export function urlForImage(source: Image) {
  return builder.image(source).auto('format').fit('max')
}

/**
 * Get blur data URL for placeholder while loading
 */
export function getImageBlurDataUrl(source: Image): string {
  return urlForImage(source).width(20).quality(20).blur(50).url()
}
