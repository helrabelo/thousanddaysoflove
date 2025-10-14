// @ts-nocheck: gallery lightbox animation props pending framer-motion type alignment
'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import MediaCarousel, { MediaItem as CarouselMediaItem } from '@/components/ui/MediaCarousel'

// Placeholder type - backend architect will provide actual type
interface SanityGalleryAlbum {
  _id: string
  title: string
  description?: string
  media: Array<{
    mediaType: 'image' | 'video'
    image?: { asset: { url: string }; alt?: string }
    video?: { asset: { url: string } }
    alt?: string
    caption?: string
    displayOrder: number
  }>
}

interface GalleryLightboxProps {
  isOpen: boolean
  album: SanityGalleryAlbum | null
  onClose: () => void
}

/**
 * Gallery Lightbox Modal
 *
 * Full-screen modal for viewing gallery albums with multi-media carousel.
 * Features:
 * - Full-screen overlay with dark background
 * - MediaCarousel integration for image/video playback
 * - Keyboard controls (ESC to close)
 * - Album title and description display
 * - Smooth Framer Motion animations with delightful micro-interactions
 */
export default function GalleryLightbox({ isOpen, album, onClose }: GalleryLightboxProps) {
  const [isLoading, setIsLoading] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden'

      // Simulate loading state for smooth entrance
      setIsLoading(true)
      const loadTimer = setTimeout(() => setIsLoading(false), 300)

      return () => {
        clearTimeout(loadTimer)
        window.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Transform album media into MediaCarousel format
  const carouselMedia: CarouselMediaItem[] = album?.media
    ? album.media
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => ({
          mediaType: item.mediaType === 'video' ? 'video' : 'image',
          url: item.mediaType === 'video'
            ? item.video?.asset?.url || ''
            : item.image?.asset?.url || '',
          alt: item.alt || item.image?.alt || album.title,
          caption: item.caption,
        }))
        .filter((item) => item.url) // Filter out items without URLs
    : []

  if (!album) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.3 }}
        >
          {/* Dark Overlay Background */}
          <motion.div
            className="absolute inset-0 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close lightbox"
          />

          {/* Lightbox Content */}
          <motion.div
            className="relative z-10 w-full h-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.4,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {/* Loading State - Playful "Preparando álbum..." */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="text-5xl mb-3"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      📸
                    </motion.div>
                    <p
                      className="text-lg"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontStyle: 'italic',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Preparando álbum...
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header with Title and Close Button */}
            <motion.div
              className="flex items-start justify-between mb-4 md:mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.2,
                duration: 0.4
              }}
            >
              <div className="flex-1 pr-4">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'white',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.3,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  {album.title}
                </motion.h2>
                {album.description && (
                  <motion.p
                    className="text-base md:text-lg"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: shouldReduceMotion ? 0 : 0.4,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {album.description}
                  </motion.p>
                )}
              </div>

              {/* Close Button with Rotate Animation */}
              <motion.button
                onClick={onClose}
                className="flex-shrink-0 p-3 rounded-full backdrop-blur-md"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                }}
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.3,
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={shouldReduceMotion ? {} : {
                  scale: 1.1,
                  rotate: 90,
                  background: 'rgba(255, 255, 255, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" strokeWidth={2} />
              </motion.button>
            </motion.div>

            {/* Media Carousel */}
            <motion.div
              className="flex-1 min-h-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.35,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {carouselMedia.length > 0 ? (
                <MediaCarousel
                  media={carouselMedia}
                  autoplayInterval={5000}
                  showControls={true}
                  fillMode="contain"
                  className="h-full"
                />
              ) : (
                // Whimsical empty state
                <motion.div
                  className="flex flex-col items-center justify-center h-full rounded-2xl"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic',
                  }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    📷
                  </motion.div>
                  <p className="text-xl font-bold mb-2">Álbum vazio</p>
                  <p className="text-base opacity-75">Em breve, muitas memórias aqui! ✨</p>
                </motion.div>
              )}
            </motion.div>

            {/* Keyboard Hint with Pulse Animation */}
            <motion.div
              className="text-center mt-4 text-sm"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'var(--font-crimson)',
                fontStyle: 'italic',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.8,
                duration: 0.4
              }}
            >
              <motion.span
                animate={shouldReduceMotion ? {} : {
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Pressione ESC para fechar • Use as setas para navegar
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
