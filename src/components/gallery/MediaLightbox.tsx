'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
  Download, Share2, Heart, Play, Pause, Volume2, VolumeX,
  Maximize, Grid, Info
} from 'lucide-react'
import { MediaItem, LightboxState } from '@/types/wedding'

interface MediaLightboxProps {
  isOpen: boolean
  items: MediaItem[]
  currentIndex: number
  autoPlay?: boolean
  showThumbnails?: boolean
  onClose: () => void
  onChange: (index: number) => void
  onLike?: (item: MediaItem) => void
  onShare?: (item: MediaItem) => void
  onDownload?: (item: MediaItem) => void
}

export default function MediaLightbox({
  isOpen,
  items,
  currentIndex,
  autoPlay = false,
  showThumbnails = true,
  onClose,
  onChange,
  onLike,
  onShare,
  onDownload
}: MediaLightboxProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  const videoRef = useRef<HTMLVideoElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const currentItem = items[currentIndex]

  // Reset states when item changes
  useEffect(() => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
    setShowInfo(false)
  }, [currentIndex])

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return

    const resetTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    resetTimeout()
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case ' ':
          e.preventDefault()
          if (currentItem.media_type === 'video') {
            togglePlay()
          }
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case 'r':
          rotateImage()
          break
        case 'i':
          setShowInfo(!showInfo)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, showInfo, currentItem])

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    onChange(newIndex)
  }, [currentIndex, items.length, onChange])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    onChange(newIndex)
  }, [currentIndex, items.length, onChange])

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 4))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.5))
  }, [])

  const rotateImage = useCallback(() => {
    setRotation(prev => (prev + 90) % 360)
  }, [])

  const resetTransform = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }, [])

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }, [isPlaying])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const handleLike = useCallback(() => {
    if (onLike) {
      onLike(currentItem)
    }
    setLikedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentItem.id)) {
        newSet.delete(currentItem.id)
      } else {
        newSet.add(currentItem.id)
      }
      return newSet
    })
  }, [currentItem, onLike])

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare(currentItem)
    } else if (navigator.share) {
      navigator.share({
        title: currentItem.title,
        text: currentItem.description || 'Confira esta memória especial!',
        url: window.location.href
      })
    }
  }, [currentItem, onShare])

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload(currentItem)
    } else {
      // Create download link
      const link = document.createElement('a')
      link.href = currentItem.url
      link.download = `${currentItem.title}.${currentItem.media_type === 'video' ? 'mp4' : 'jpg'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [currentItem, onDownload])

  // Mouse drag for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }, [zoom, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart, zoom])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (!isOpen || !currentItem) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowControls(true)}
      >
        {/* Background Overlay */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={onClose}
        />

        {/* Main Content */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {/* Media Display */}
          <div
            className="relative max-w-full max-h-full"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
          >
            {currentItem.media_type === 'photo' ? (
              <motion.img
                ref={imageRef}
                src={currentItem.url}
                alt={currentItem.title}
                className="max-w-screen max-h-[75vh] object-contain select-none -mt-8"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease'
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onDoubleClick={zoom === 1 ? zoomIn : resetTransform}
              />
            ) : (
              <motion.video
                ref={videoRef}
                src={currentItem.url}
                className="max-w-full max-h-full object-contain"
                autoPlay={autoPlay}
                loop
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>

          {/* Navigation Arrows */}
          <AnimatePresence>
            {showControls && items.length > 1 && (
              <>
                <motion.button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
                  onClick={goToPrevious}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
                  onClick={goToNext}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}
          </AnimatePresence>

          {/* Top Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute top-4 left-4 right-4 flex justify-between items-center z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Left Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onClose}
                    className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="text-sm font-medium">
                      {currentIndex + 1} / {items.length}
                    </span>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      likedItems.has(currentItem.id)
                        ? 'bg-gray-500 text-white'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedItems.has(currentItem.id) ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleDownload}
                    className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                className="absolute bottom-4 left-4 right-4 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {/* Image Controls */}
                {currentItem.media_type === 'photo' && (
                  <div className="flex justify-center space-x-2 mb-4">
                    <button
                      onClick={zoomOut}
                      className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                      disabled={zoom <= 0.5}
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>

                    <div className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                      <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
                    </div>

                    <button
                      onClick={zoomIn}
                      className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                      disabled={zoom >= 4}
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>

                    <button
                      onClick={rotateImage}
                      className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={resetTransform}
                      className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      <span className="text-sm font-medium">Reset</span>
                    </button>
                  </div>
                )}

                {/* Video Controls */}
                {currentItem.media_type === 'video' && (
                  <div className="flex justify-center space-x-2 mb-4">
                    <button
                      onClick={togglePlay}
                      className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {/* Thumbnails */}
                {showThumbnails && items.length > 1 && (
                  <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
                    {items.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => onChange(index)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                          index === currentIndex
                            ? 'border-gray-500 scale-110'
                            : 'border-white/20 hover:border-white/50'
                        }`}
                      >
                        <img
                          src={item.thumbnail_url || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.media_type === 'video' && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                className="absolute top-20 right-4 w-80 bg-black/80 text-white p-6 rounded-2xl backdrop-blur-md z-10"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <h3 className="text-lg font-bold mb-2">{currentItem.title}</h3>

                {currentItem.description && (
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {currentItem.description}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  {currentItem.date_taken && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data:</span>
                      <span>{new Date(currentItem.date_taken).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}

                  {currentItem.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Local:</span>
                      <span>{currentItem.location}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Tipo:</span>
                    <span className="capitalize">{currentItem.media_type === 'photo' ? 'Foto' : 'Vídeo'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Categoria:</span>
                    <span className="capitalize">{currentItem.category}</span>
                  </div>

                  {currentItem.tags.length > 0 && (
                    <div className="mt-4">
                      <span className="text-gray-400 block mb-2">Tags:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentItem.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
