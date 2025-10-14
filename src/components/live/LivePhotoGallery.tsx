'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, X, Camera } from 'lucide-react'
import { getRecentApprovedPhotos } from '@/lib/supabase/live'
import type { RecentPhoto } from '@/lib/supabase/live'
import { Card } from '@/components/ui/card'
import { kenBurnsVariants, hoverLiftVariants, pulseVariants } from '@/lib/utils/animations'
import { playPhotoSound } from '@/lib/utils/soundManager'

export function LivePhotoGallery() {
  const [photos, setPhotos] = useState<RecentPhoto[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [direction, setDirection] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    loadPhotos()
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % photos.length)
      playPhotoSound()
    }, 5000) // 5 seconds per photo

    return () => clearInterval(interval)
  }, [isPlaying, photos.length])

  const loadPhotos = async () => {
    const data = await getRecentApprovedPhotos(20)
    setPhotos(data)
    setIsLoading(false)
  }

  const goToPrevious = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }, [photos.length])

  const currentPhoto = photos[currentIndex]

  if (isLoading) {
    return (
      <Card className="p-6">
        <motion.div
          className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Camera className="w-12 h-12 text-[#A8A8A8]" />
        </motion.div>
      </Card>
    )
  }

  if (photos.length === 0) {
    return (
      <Card className="p-6">
        <motion.div
          className="aspect-video rounded-lg flex flex-col items-center justify-center bg-[#F8F6F3]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : {
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Camera className="w-12 h-12 text-[#A8A8A8] mb-3" />
          </motion.div>
          <p className="text-[#4A4A4A] font-crimson italic">
            Aguardando as primeiras fotos...
          </p>
          <motion.p
            className="text-2xl mt-2"
            animate={shouldReduceMotion ? {} : {
              y: [0, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            📸
          </motion.p>
        </motion.div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 relative overflow-hidden">
        {/* Gallery header */}
        <div className="flex items-center justify-between mb-4">
          <motion.h3
            className="text-lg font-semibold text-[#2C2C2C] font-playfair flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div variants={pulseVariants} animate="animate">
              📸
            </motion.div>
            Galeria de Fotos
          </motion.h3>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg hover:bg-[#E8E6E3] transition-colors"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={shouldReduceMotion ? {} : (isPlaying ? {
                  scale: [1, 1.1, 1]
                } : {})}
                transition={{
                  duration: 0.6,
                  repeat: isPlaying ? Infinity : 0,
                  repeatDelay: 1
                }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-[#2C2C2C]" />
                ) : (
                  <Play className="w-4 h-4 text-[#2C2C2C]" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Slideshow with Ken Burns effect */}
        <div
          className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setIsFullscreen(true)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPhoto.id}
              custom={direction}
              initial={{
                x: direction > 0 ? 300 : -300,
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: direction > 0 ? -300 : 300,
                opacity: 0
              }}
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
              }}
              className="absolute inset-0"
            >
              {/* Ken Burns effect - subtle zoom and pan */}
              <motion.img
                src={currentPhoto.photo_url}
                alt="Foto do casamento"
                className="w-full h-full object-contain"
                variants={shouldReduceMotion ? {} : kenBurnsVariants}
                initial="initial"
                animate="animate"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            whileHover={shouldReduceMotion ? {} : { scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            whileHover={shouldReduceMotion ? {} : { scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Photo info overlay with elegant fade */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.p
              className="text-white font-medium font-playfair"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {currentPhoto.guest_name || 'Convidado'}
            </motion.p>
            <motion.p
              className="text-white/80 text-sm font-crimson"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {currentIndex + 1} de {photos.length}
            </motion.p>
          </motion.div>

          {/* Elegant progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: isPlaying ? 5 : 0,
                ease: 'linear',
                repeat: 0
              }}
              key={currentIndex}
            />
          </div>
        </div>

        {/* Thumbnail strip with hover effects */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#E8E6E3]">
          {photos.map((photo, index) => (
            <motion.button
              key={photo.id}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-[#2C2C2C] scale-110 shadow-lg'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              whileHover={shouldReduceMotion ? {} : {
                scale: index === currentIndex ? 1.1 : 1.05,
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={photo.photo_url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 border-2 border-white rounded-lg"
                  layoutId="thumbnail-border"
                />
              )}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Fullscreen modal with elegant animations */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              whileHover={shouldReduceMotion ? {} : {
                scale: 1.1,
                rotate: 90
              }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={currentPhoto.id}
                src={currentPhoto.photo_url}
                alt="Foto do casamento"
                custom={direction}
                initial={{
                  x: direction > 0 ? 300 : -300,
                  scale: 0.9,
                  opacity: 0
                }}
                animate={{
                  x: 0,
                  scale: 1,
                  opacity: 1
                }}
                exit={{
                  x: direction > 0 ? -300 : 300,
                  scale: 0.9,
                  opacity: 0
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-8 h-8" />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-8 h-8" />
            </motion.button>

            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center bg-black/50 backdrop-blur-sm px-6 py-3 rounded-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-semibold text-lg font-playfair mb-1">
                {currentPhoto.guest_name || 'Convidado'}
              </p>
              <p className="text-white/80 font-crimson">
                {currentIndex + 1} de {photos.length}
              </p>
            </motion.div>

            {/* Keyboard hint */}
            <motion.div
              className="absolute top-4 left-4 text-white/60 text-sm font-crimson"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Use ← → ou clique nas setas
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
