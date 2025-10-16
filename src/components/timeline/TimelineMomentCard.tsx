'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode, useMemo, useState, useEffect } from 'react'
import MediaCarousel, { MediaItem } from '@/components/ui/MediaCarousel'

interface TimelineMomentCardProps {
  /** Day number in the relationship */
  day: number
  /** Date of the moment */
  date: string
  /** Title of the moment */
  title: string
  /** Description/story of the moment */
  description: string
  /** Media items (images and/or videos) */
  media: MediaItem[]
  /** Content alignment: 'left' or 'right' (determines layout on desktop) */
  contentAlign?: 'left' | 'right'
  /** Custom children for more complex layouts */
  children?: ReactNode
}

/**
 * Extract dimensions from Sanity CDN URL
 * Sanity encodes dimensions in the filename like: {assetId}-{width}x{height}.{ext}
 */
function extractDimensionsFromSanityUrl(url: string): { width: number; height: number } | null {
  try {
    // Match pattern like: abc123-1920x1080.jpg or abc123-1080x1920.mp4
    const match = url.match(/-(\d+)x(\d+)\.(jpg|jpeg|png|gif|webp|mp4|mov)/i)
    if (match) {
      const width = parseInt(match[1], 10)
      const height = parseInt(match[2], 10)
      if (width > 0 && height > 0) {
        return { width, height }
      }
    }
  } catch (error) {
    console.warn('Failed to parse Sanity URL dimensions:', error)
  }
  return null
}

/**
 * Calculate the best aspect ratio for the polaroid frame
 * More precise buckets for different media types
 */
function calculateAspectRatioBucket(ratio: number): string {
  // Ultra-wide landscape (21:9 or wider)
  if (ratio >= 2.2) return '21/9'

  // Wide landscape (16:9)
  if (ratio >= 1.6) return '16/9'

  // Standard landscape (4:3)
  if (ratio >= 1.2) return '4/3'

  // Square-ish (1:1)
  if (ratio >= 0.85) return '1/1'

  // Standard portrait (3:4)
  if (ratio >= 0.6) return '3/4'

  // Tall portrait (9:16) - mobile screenshots
  if (ratio >= 0.45) return '9/16'

  // Ultra-tall (e.g., 1179x2556 = 0.46)
  return '9/16'
}

/**
 * Calculate the best aspect ratio for the polaroid frame
 * based on the first media item's dimensions
 */
function getPolaroidAspectRatio(media: MediaItem[]): string {
  if (!media || media.length === 0) return '3/4' // Default portrait

  const firstMedia = media[0]

  // Use explicit aspect ratio if provided
  if (firstMedia.aspectRatio) {
    const result = calculateAspectRatioBucket(firstMedia.aspectRatio)
    console.log('✅ Using aspectRatio:', firstMedia.aspectRatio, '→', result)
    return result
  }

  // Calculate from width/height if available
  if (firstMedia.width && firstMedia.height) {
    const ratio = firstMedia.width / firstMedia.height
    const result = calculateAspectRatioBucket(ratio)
    console.log('✅ Calculated from w/h:', ratio, '→', result)
    return result
  }

  // FALLBACK: Extract dimensions from Sanity CDN URL
  const urlDimensions = extractDimensionsFromSanityUrl(firstMedia.url)
  if (urlDimensions) {
    const ratio = urlDimensions.width / urlDimensions.height
    const result = calculateAspectRatioBucket(ratio)
    console.log('✅ Extracted from URL:', urlDimensions, 'ratio:', ratio, '→', result)
    return result
  }

  // Default to portrait for vertical iPhone photos
  console.log('⚠️ No dimensions found, using default: 3/4')
  return '3/4'
}

export default function TimelineMomentCard({
  day,
  date,
  title,
  description,
  media,
  contentAlign = 'left',
  children,
}: TimelineMomentCardProps) {
  const isLeft = contentAlign === 'left'
  const shouldReduceMotion = useReducedMotion()

  // State for dynamically detected aspect ratio (for videos)
  const [detectedAspectRatio, setDetectedAspectRatio] = useState<string | null>(null)

  // Calculate initial aspect ratio based on first media item
  const initialAspectRatio = useMemo(() => getPolaroidAspectRatio(media), [media])

  // Use detected aspect ratio if available, otherwise use initial
  const aspectRatio = detectedAspectRatio || initialAspectRatio

  // Detect video dimensions client-side
  useEffect(() => {
    if (!media || media.length === 0) return
    const firstMedia = media[0]

    // Only detect for videos without dimensions
    if (firstMedia.mediaType === 'video' && !firstMedia.width && !firstMedia.height) {
      const video = document.createElement('video')
      video.src = firstMedia.url
      video.preload = 'metadata'

      video.addEventListener('loadedmetadata', () => {
        if (video.videoWidth && video.videoHeight) {
          const ratio = video.videoWidth / video.videoHeight
          const bucket = calculateAspectRatioBucket(ratio)
          console.log('🎥 Video dimensions detected:', {
            width: video.videoWidth,
            height: video.videoHeight,
            ratio,
            bucket
          })
          setDetectedAspectRatio(bucket)
        }
      })
    }
  }, [media])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0.3 : 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="w-full py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Desktop: Split Horizontal Layout | Mobile: Stacked Vertical */}
        <div
          className={`
            flex flex-col gap-8
            md:grid md:grid-cols-2 md:gap-12 md:items-center
            ${isLeft ? 'md:grid-flow-col' : 'md:grid-flow-col-dense'}
          `}
        >
          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : (isLeft ? -40 : 40) }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.3 : 0.7, delay: shouldReduceMotion ? 0 : 0.2 }}
            viewport={{ once: true }}
            className={`
              flex flex-col
              ${isLeft ? 'md:col-start-1' : 'md:col-start-2'}
            `}
          >
            {/* Day Badge */}
            <motion.div
              initial={{ scale: shouldReduceMotion ? 1 : 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4 px-5 py-2.5 rounded-full self-start"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--decorative)',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '700',
                  }}
                >
                  Dia {day}
                </span>
                <span className="opacity-50">•</span>
                <span className="opacity-75">{date}</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.35 }}
              viewport={{ once: true }}
              className="mb-4"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: '600',
                color: 'var(--primary-text)',
                letterSpacing: '0.01em',
                lineHeight: '1.3',
              }}
            >
              {title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.4 }}
              viewport={{ once: true }}
              className="mb-6"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.0625rem, 2vw, 1.25rem)',
                lineHeight: '1.8',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              {description}
            </motion.p>

            {/* Custom Children (optional) */}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.45 }}
                viewport={{ once: true }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>

          {/* Polaroid-style Image Section */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30, rotate: shouldReduceMotion ? 0 : (isLeft ? -1.5 : 1.5) }}
            whileInView={{ opacity: 1, y: 0, rotate: isLeft ? -0.5 : 0.5 }}
            transition={{
              duration: shouldReduceMotion ? 0.3 : 0.8,
              delay: shouldReduceMotion ? 0 : 0.25,
              rotate: { duration: shouldReduceMotion ? 0 : 1.2 }
            }}
            viewport={{ once: true }}
            whileHover={shouldReduceMotion ? {} : {
              rotate: 0,
              scale: 1.02,
              y: -8,
              transition: { duration: 0.4 }
            }}
            className={`
              relative
              ${isLeft ? 'md:col-start-2' : 'md:col-start-1'}
            `}
          >
            {/* Polaroid Frame */}
            <div
              className="relative p-3 pb-12 sm:p-4 sm:pb-16"
              style={{
                background: 'white',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
                borderRadius: '2px',
              }}
            >
              {/* Media Container with dynamic aspect ratio */}
              <div
                className="relative w-full"
                style={{ aspectRatio } as React.CSSProperties}
              >
                <div className="absolute inset-0">
                  <div
                    className="w-full h-full"
                    style={{ aspectRatio } as React.CSSProperties}
                  >
                    <MediaCarousel
                      media={media}
                      autoplayInterval={6000}
                      showControls={media.length > 1}
                      fillMode="contain"
                      backgroundColor="white"
                      className="!rounded-none !min-h-0 !h-full !max-h-full [&>div]:!aspect-auto [&>div]:!min-h-0"
                    />
                  </div>
                </div>
              </div>

              {/* Polaroid Caption Area */}
              <div
                className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-center"
                style={{
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-shadows)',
                    fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                    color: 'var(--secondary-text)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {media.length > 1
                    ? `${media.length} memórias`
                    : title.length > 30
                      ? `${title.substring(0, 30)}...`
                      : title
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Divider */}
      <div
        className="mt-12 md:mt-16 mx-auto"
        style={{
          height: '1px',
          maxWidth: '200px',
          background: 'linear-gradient(to right, transparent 0%, var(--decorative) 50%, transparent 100%)',
          opacity: 0.4,
        }}
      />
    </motion.section>
  )
}
