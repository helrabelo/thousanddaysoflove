'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react'
import { getRecentApprovedPhotos } from '@/lib/supabase/live'
import type { RecentPhoto } from '@/lib/supabase/live'
import { Card } from '@/components/ui/card'

export function LivePhotoGallery() {
  const [photos, setPhotos] = useState<RecentPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPhotos()
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
    }, 5000) // 5 seconds per photo

    return () => clearInterval(interval)
  }, [isPlaying, photos.length])

  const loadPhotos = async () => {
    const data = await getRecentApprovedPhotos(20)
    setPhotos(data)
    setIsLoading(false)
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const currentPhoto = photos[currentIndex]

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="aspect-video bg-gray-100 rounded-lg animate-pulse" />
      </Card>
    )
  }

  if (photos.length === 0) {
    return (
      <Card className="p-6">
        <div className="aspect-video bg-[#F8F6F3] rounded-lg flex items-center justify-center">
          <p className="text-[#4A4A4A]">Nenhuma foto disponível ainda</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 relative overflow-hidden">
        {/* Gallery header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#2C2C2C]">Galeria de Fotos</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-[#F8F6F3] hover:bg-[#E8E6E3] transition-colors"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-[#2C2C2C]" />
              ) : (
                <Play className="w-4 h-4 text-[#2C2C2C]" />
              )}
            </button>
          </div>
        </div>

        {/* Slideshow */}
        <div
          className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setIsFullscreen(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhoto.id}
              src={currentPhoto.photo_url}
              alt="Foto do casamento"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-contain"
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Photo info overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-medium">
              {currentPhoto.guest_name || 'Convidado'}
            </p>
            <p className="text-white/80 text-sm">
              {currentIndex + 1} de {photos.length}
            </p>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#2C2C2C] scale-110'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={photo.photo_url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </Card>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.img
              key={currentPhoto.id}
              src={currentPhoto.photo_url}
              alt="Foto do casamento"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
              <p className="font-semibold text-lg mb-1">
                {currentPhoto.guest_name || 'Convidado'}
              </p>
              <p className="text-white/80">
                {currentIndex + 1} de {photos.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
