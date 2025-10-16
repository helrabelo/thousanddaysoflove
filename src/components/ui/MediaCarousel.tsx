'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'

export interface MediaItem {
  mediaType: 'image' | 'video'
  url: string
  alt?: string
  caption?: string
  width?: number
  height?: number
  aspectRatio?: number // width / height
}

interface MediaCarouselProps {
  media: MediaItem[]
  className?: string
  autoplayInterval?: number // milliseconds for images (default: 5000ms)
  showControls?: boolean // show prev/next navigation controls
  fillMode?: 'contain' | 'cover' // object-fit mode (default: contain)
  backgroundColor?: string // background color (default: var(--primary-text))
}

export default function MediaCarousel({
  media,
  className = '',
  autoplayInterval = 5000,
  showControls = true,
  fillMode = 'contain',
  backgroundColor = 'var(--primary-text)'
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()
  const shouldReduceMotion = useReducedMotion()

  const itemCount = media.length
  const hasMedia = itemCount > 0
  const safeIndex = hasMedia ? Math.min(currentIndex, itemCount - 1) : 0
  const isSingleItem = itemCount <= 1
  const currentMedia = hasMedia ? media[safeIndex] : null

  // Reset image loaded state when index changes
  useEffect(() => {
    if (!hasMedia) return
    if (currentMedia?.mediaType === 'image') {
      setImageLoaded(false)
    }
  }, [currentIndex, currentMedia?.mediaType, hasMedia])

  // Navigation handlers
  const goToNext = () => {
    if (!hasMedia) return
    setDirection('forward')
    setCurrentIndex((prev) => (prev + 1) % itemCount)
    setImageLoaded(false)
  }

  const goToPrevious = () => {
    if (!hasMedia) return
    setDirection('backward')
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount)
    setImageLoaded(false)
  }

  const goToIndex = (index: number) => {
    if (!hasMedia) return
    const boundedIndex = ((index % itemCount) + itemCount) % itemCount
    setDirection(boundedIndex > safeIndex ? 'forward' : 'backward')
    setCurrentIndex(boundedIndex)
    setImageLoaded(false)
  }

  useEffect(() => {
    if (!hasMedia) {
      if (currentIndex !== 0) {
        setCurrentIndex(0)
      }
      return
    }

    if (currentIndex >= itemCount) {
      setCurrentIndex(itemCount - 1)
    }
  }, [hasMedia, itemCount, currentIndex])

  // Auto-advance for images
  useEffect(() => {
    if (!hasMedia || isSingleItem || !isPlaying || isPaused) return

    if (currentMedia?.mediaType === 'image') {
      timerRef.current = setTimeout(() => {
        goToNext()
      }, autoplayInterval)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [currentIndex, currentMedia?.mediaType, isPlaying, isPaused, autoplayInterval, isSingleItem, hasMedia, goToNext])

  // Handle video ended - move to next item
  const handleVideoEnded = () => {
    if (!isSingleItem) {
      goToNext()
    }
  }

  // Handle video error
  const handleVideoError = () => {
    if (!currentMedia) return
    console.error('Video failed to load:', currentMedia.url)
    // Move to next item if video fails
    if (!isSingleItem) {
      setTimeout(goToNext, 1000)
    }
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!hasMedia) return

    setIsPaused((prev) => {
      const next = !prev

      if (currentMedia?.mediaType === 'video' && videoRef.current) {
        if (next) {
          videoRef.current.pause()
        } else {
          videoRef.current.play().catch(console.error)
        }
      }

      return next
    })
  }

  // Keyboard navigation
  useEffect(() => {
    if (!hasMedia) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (isSingleItem) return

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case ' ':
          e.preventDefault()
          togglePlayPause()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hasMedia, isSingleItem, goToPrevious, goToNext, togglePlayPause])

  // Animation variants
  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? '-100%' : '100%',
      opacity: 0
    })
  }

  const fadeVariants = {
    enter: { opacity: 0, scale: 1.05 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }

  // Determine if we're in background mode (cover) or regular mode (contain)
  const isBackgroundMode = fillMode === 'cover'
  const objectFitClass = isBackgroundMode ? 'object-cover' : 'object-contain'

  if (!hasMedia) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] rounded-2xl ${className}`}
        style={{
          background: 'var(--accent)',
          color: 'var(--secondary-text)',
          fontFamily: 'var(--font-crimson)',
          fontStyle: 'italic'
        }}
      >
        <p>Nenhuma mídia disponível</p>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${isBackgroundMode ? '' : 'rounded-2xl'} ${className}`}
      onMouseEnter={() => !isSingleItem && setIsPlaying(false)}
      onMouseLeave={() => !isSingleItem && setIsPlaying(true)}
      style={{
        background: backgroundColor,
        minHeight: isBackgroundMode ? '100%' : '400px',
        height: isBackgroundMode ? '100%' : 'auto'
      }}
    >
      {/* Media Display */}
      <div className={`relative w-full h-full ${isBackgroundMode ? '' : 'aspect-[16/9]'}`}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={shouldReduceMotion ? fadeVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0.3 : 0.6,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
            className="absolute inset-0"
          >
            {currentMedia?.mediaType === 'image' ? (
              <div className="relative w-full h-full">
                <Image
                  src={currentMedia.url}
                  alt={currentMedia.alt || 'Media item'}
                  fill
                  className={objectFitClass}
                  onLoad={() => setImageLoaded(true)}
                  priority={currentIndex === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />

                {/* Loading state for images */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-12 h-12 border-4 rounded-full"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderTopColor: 'rgba(255, 255, 255, 0.8)'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay={!isPaused}
                loop={isSingleItem}
                muted
                playsInline
                onEnded={handleVideoEnded}
                onError={handleVideoError}
                className={`w-full h-full ${objectFitClass}`}
                style={{ background: backgroundColor }}
              >
                <source src={currentMedia?.url} type="video/mp4" />
                <p style={{ color: 'white', padding: '20px' }}>
                  Seu navegador não suporta vídeos.
                </p>
              </video>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Caption */}
      {currentMedia?.caption && (
        <motion.div
          key={`caption-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            color: 'white',
            fontFamily: 'var(--font-crimson)',
            fontStyle: 'italic',
            fontSize: '1rem',
            textAlign: 'center'
          }}
        >
          {currentMedia.caption}
        </motion.div>
      )}

      {/* Navigation Controls */}
      {!isSingleItem && showControls && (
        <>
          {/* Previous Button */}
          <motion.button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              color: 'white'
            }}
            whileHover={{
              scale: 1.1,
              background: 'rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            aria-label="Mídia anterior"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </motion.button>

          {/* Next Button */}
          <motion.button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              color: 'white'
            }}
            whileHover={{
              scale: 1.1,
              background: 'rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            aria-label="Próxima mídia"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            className="absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              color: 'white'
            }}
            whileHover={{
              scale: 1.1,
              background: 'rgba(255, 255, 255, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            aria-label={isPaused ? 'Reproduzir' : 'Pausar'}
          >
            {isPaused ? (
              <Play className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Pause className="w-5 h-5" strokeWidth={2} />
            )}
          </motion.button>
        </>
      )}

      {/* Dot Indicators */}
      {!isSingleItem && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2"
          style={{
            padding: '8px 12px',
            borderRadius: '999px',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {media.map((_, index) => (
            <motion.button
              key={index}
              className="rounded-full transition-all duration-300"
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                background: currentIndex === index
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer'
              }}
              whileHover={{
                scale: 1.2,
                background: 'rgba(255, 255, 255, 0.8)'
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToIndex(index)}
              aria-label={`Ir para mídia ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Media Counter */}
      {!isSingleItem && (
        <motion.div
          className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full backdrop-blur-md"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            fontFamily: 'var(--font-crimson)',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentIndex + 1} / {media.length}
        </motion.div>
      )}
    </div>
  )
}
