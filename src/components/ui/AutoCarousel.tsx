'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface MediaItem {
  media_type: 'image' | 'video'
  media_url: string
  caption?: string
}

interface AutoCarouselProps {
  media: MediaItem[]
  interval?: number // milliseconds
  autoPlay?: boolean
  showControls?: boolean
  className?: string
}

export default function AutoCarousel({
  media,
  interval = 5000,
  autoPlay = true,
  showControls = true,
  className = ''
}: AutoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovering && media.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length)
      }, interval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isHovering, media.length, interval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Single media - no carousel needed
  if (media.length === 0) {
    return null
  }

  if (media.length === 1) {
    const item = media[0]
    return (
      <div className={`relative ${className}`}>
        {item.media_type === 'image' ? (
          <div className="relative h-full w-full">
            <Image
              src={item.media_url}
              alt={item.caption || 'Mídia'}
              fill
              className="object-cover rounded-lg"
              sizes="100vw"
            />
          </div>
        ) : (
          <video
            src={item.media_url}
            controls
            className="w-full h-full rounded-lg"
          />
        )}
        {item.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 rounded-b-lg">
            <p className="text-sm text-center">{item.caption}</p>
          </div>
        )}
      </div>
    )
  }

  const currentMedia = media[currentIndex]

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Media Display */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {media.map((item, index) => (
            <div key={index} className="relative min-w-full h-full">
              {item.media_type === 'image' ? (
                <Image
                  src={item.media_url}
                  alt={item.caption || `Mídia ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <video
                  src={item.media_url}
                  controls
                  className="w-full h-full"
                />
              )}
            </div>
          ))}
        </div>

        {/* Caption */}
        {currentMedia.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3">
            <p className="text-sm text-center">{currentMedia.caption}</p>
          </div>
        )}

        {/* Navigation Controls */}
        {showControls && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {media.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-burgundy-600 w-6'
                : 'bg-burgundy-300 hover:bg-burgundy-400'
            }`}
            aria-label={`Ir para mídia ${index + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center mt-2">
        <p className="text-sm text-burgundy-600">
          {currentIndex + 1} / {media.length}
        </p>
      </div>
    </div>
  )
}
