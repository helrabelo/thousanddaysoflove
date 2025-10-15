'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Search, Filter, X, Share2, Heart, Download, Play, MapPin, Calendar, Images } from 'lucide-react'
import { MediaItem, MediaCategory, GalleryFilter } from '@/types/wedding'
import GalleryLightbox from './GalleryLightbox'

// Placeholder type - backend architect will provide actual type from utilities
// This matches the structure from the updated galleryImage schema
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

interface MasonryGalleryProps {
  items: MediaItem[]
  title?: string
  description?: string
  showFilters?: boolean
  initialCategory?: MediaCategory | 'all'
  onItemClick?: (item: MediaItem, index: number) => void
}

const categoryLabels: Record<MediaCategory | 'all', string> = {
  all: 'Todas',
  engagement: 'Noivado',
  travel: 'Viagens',
  dates: 'Encontros',
  family: 'Família',
  friends: 'Amigos',
  special_moments: 'Momentos Especiais',
  proposal: 'Pedido',
  wedding_prep: 'Preparativos',
  behind_scenes: 'Bastidores',
  professional: 'Profissionais'
}

const categoryIcons: Record<MediaCategory | 'all', string> = {
  all: '📸',
  engagement: '💍',
  travel: '✈️',
  dates: '💕',
  family: '👨‍👩‍👧‍👦',
  friends: '👥',
  special_moments: '⭐',
  proposal: '💖',
  wedding_prep: '👰',
  behind_scenes: '🎬',
  professional: '📷'
}

// Helper functions - will be replaced by backend architect's utilities
// Placeholder implementations based on the schema structure
function getPrimaryGalleryMedia(item: any): { url: string; type: 'image' | 'video' } | null {
  // Check if item has media array (Sanity album format)
  if (item.media && Array.isArray(item.media) && item.media.length > 0) {
    const firstMedia = item.media[0]
    if (firstMedia.mediaType === 'video' && firstMedia.video?.asset?.url) {
      return { url: firstMedia.video.asset.url, type: 'video' }
    }
    if (firstMedia.mediaType === 'image' && firstMedia.image?.asset?.url) {
      return { url: firstMedia.image.asset.url, type: 'image' }
    }
  }

  // Fallback to MediaItem format (guest photos or legacy format)
  if (item.url) {
    return { url: item.url, type: item.media_type === 'video' ? 'video' : 'image' }
  }

  return null
}

function hasMultipleMedia(item: any): boolean {
  return item.media && Array.isArray(item.media) && item.media.length > 1
}

export default function MasonryGallery({
  items,
  title,
  description,
  showFilters = true,
  initialCategory = 'all',
  onItemClick
}: MasonryGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'all'>(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'photo' | 'video'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<SanityGalleryAlbum | null>(null)

  // Get unique categories from items
  const availableCategories = useMemo(() => {
    const categories = ['all' as const, ...new Set(items.map(item => item.category))]
    return categories
  }, [items])

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
      const searchMatch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const typeMatch = mediaTypeFilter === 'all' || item.media_type === mediaTypeFilter

      return categoryMatch && searchMatch && typeMatch && item.is_public
    })
  }, [items, selectedCategory, searchQuery, mediaTypeFilter])

  const handleItemClick = useCallback((item: MediaItem, index: number) => {
    // Check if item is a Sanity album with multiple media
    if (hasMultipleMedia(item)) {
      // Open lightbox for albums
      setSelectedAlbum(item as any as SanityGalleryAlbum)
      setLightboxOpen(true)
    } else if (onItemClick) {
      // Use custom handler for single items
      onItemClick(item, index)
    }
  }, [onItemClick])

  const toggleLike = useCallback((itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }, [])

  const shareItem = useCallback((item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description || 'Confira esta memória especial do nosso amor!',
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
    setSelectedAlbum(null)
  }, [])

  return (
    <>
      <section className="py-20">
        {/* Header with padding */}
        <div className="container-padding max-w-8xl mx-auto">
          {title && <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em' }}>
              {title}
            </h2>
            <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
              {description}
            </p>
          </motion.div>}

          {/* Filters */}
          {showFilters && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--decorative)' }} />
                <input
                  type="text"
                  placeholder="Buscar fotos e vídeos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                  style={{
                    background: 'var(--white-soft)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--primary-text)',
                    fontFamily: 'var(--font-crimson)'
                  }}
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {availableCategories.map(category => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center space-x-2"
                    style={{
                      background: selectedCategory === category ? 'var(--decorative)' : 'var(--white-soft)',
                      color: selectedCategory === category ? 'var(--white-soft)' : 'var(--primary-text)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-crimson)',
                      boxShadow: selectedCategory === category ? '0 2px 8px var(--shadow-subtle)' : 'none'
                    }}
                    whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{categoryIcons[category]}</span>
                    <span>{categoryLabels[category]}</span>
                    <span className="text-xs opacity-75">
                      ({category === 'all' ? items.length : items.filter(item => item.category === category).length})
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Advanced Filters Toggle */}
              <div className="text-center">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="font-medium flex items-center space-x-2 mx-auto transition-all duration-300"
                  style={{
                    color: 'var(--decorative)',
                    fontFamily: 'var(--font-crimson)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--secondary-text)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--decorative)' }}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filtros Avançados</span>
                </button>
              </div>

              {/* Advanced Filters */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    className="mt-6 p-6 rounded-2xl"
                    style={{ background: 'var(--accent)' }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-wrap gap-4 justify-center">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-crimson)' }}>Tipo:</span>
                        {['all', 'photo', 'video'].map(type => (
                          <button
                            key={type}
                            onClick={() => setMediaTypeFilter(type as any)}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                            style={{
                              background: mediaTypeFilter === type ? 'var(--decorative)' : 'var(--white-soft)',
                              color: mediaTypeFilter === type ? 'var(--white-soft)' : 'var(--primary-text)',
                              border: '1px solid var(--border-subtle)',
                              fontFamily: 'var(--font-crimson)'
                            }}
                          >
                            {type === 'all' ? 'Todos' : type === 'photo' ? 'Fotos' : 'Vídeos'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Results Info */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
              Mostrando {filteredItems.length} de {items.length} {filteredItems.length === 1 ? 'memória' : 'memórias'}
            </p>
          </motion.div>
        </div>

        {/* Masonry Grid - Full Width, Edge-to-Edge */}
        <div className="full-width">
          <motion.div
            className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {filteredItems.map((item, index) => {
              const primaryMedia = getPrimaryGalleryMedia(item)
              const hasMultiple = hasMultipleMedia(item)

              return (
                <motion.div
                  key={item.id}
                  className="break-inside-avoid mb-3 group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0.3 : 0.5,
                    delay: shouldReduceMotion ? 0 : index * 0.05
                  }}
                  onClick={() => handleItemClick(item, index)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative overflow-hidden rounded-xl transition-all duration-300"
                    style={{
                      boxShadow: hoveredItem === item.id ? '0 12px 40px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.08)',
                    }}>
                    {/* Clean Image */}
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={primaryMedia?.url || item.thumbnail_url || item.url}
                        alt={item.title}
                        className="w-full h-auto object-cover"
                        style={{
                          aspectRatio: item.aspect_ratio,
                          display: 'block'
                        }}
                        loading="lazy"
                        animate={{
                          scale: hoveredItem === item.id ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />

                      {/* Multi-Media Badge with Shimmer Effect */}
                      {hasMultiple && (
                        <motion.div
                          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5"
                          style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            fontFamily: 'var(--font-crimson)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                          }}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            boxShadow: shouldReduceMotion ? '0 2px 8px rgba(0, 0, 0, 0.3)' : [
                              '0 2px 8px rgba(255, 255, 255, 0.3)',
                              '0 4px 16px rgba(255, 255, 255, 0.5)',
                              '0 2px 8px rgba(255, 255, 255, 0.3)'
                            ]
                          }}
                          transition={{
                            delay: 0.2,
                            duration: 0.3,
                            boxShadow: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <Images className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span>{(item as any).media?.length || '2+'}</span>
                        </motion.div>
                      )}

                      {/* Featured Badge - Subtle with Gentle Pulse */}
                      {item.is_featured && (
                        <motion.div
                          className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
                          style={{
                            background: 'rgba(255, 255, 255, 0.85)',
                            color: 'var(--decorative)',
                            fontFamily: 'var(--font-crimson)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                          initial={{ opacity: 0.7 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : {
                            opacity: [0.7, 1, 0.7],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          ⭐
                        </motion.div>
                      )}

                      {/* Video Play Icon - Subtle (only for single videos, not albums) */}
                      {!hasMultiple && primaryMedia?.type === 'video' && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          initial={{ opacity: 0.6 }}
                          animate={{ opacity: hoveredItem === item.id ? 1 : 0.6 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                            style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                            <Play className="w-6 h-6 ml-0.5" style={{ color: 'var(--primary-text)' }} fill="currentColor" />
                          </div>
                        </motion.div>
                      )}

                      {/* "Ver álbum completo" Hint - Only for multi-media albums */}
                      {hasMultiple && (
                        <AnimatePresence>
                          {hoveredItem === item.id && (
                            <motion.div
                              className="absolute bottom-4 left-4 right-4 z-10 hidden md:block"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div
                                className="px-4 py-2 rounded-lg backdrop-blur-md text-center"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.95)',
                                  color: 'var(--primary-text)',
                                  fontFamily: 'var(--font-crimson)',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                }}
                              >
                                Ver álbum completo →
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      {/* Hover Overlay with Information - Desktop Only */}
                      <AnimatePresence>
                        {hoveredItem === item.id && !hasMultiple && (
                          <motion.div
                            className="absolute inset-0 hidden md:block"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                              pointerEvents: 'none'
                            }}
                          >
                            {/* Content Container */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 pb-3 pointer-events-auto">
                              {/* Title */}
                              <motion.h3
                                className="font-bold text-lg mb-2 line-clamp-2 text-white"
                                style={{ fontFamily: 'var(--font-playfair)' }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                              >
                                {item.title}
                              </motion.h3>

                              {/* Description */}
                              {item.description && (
                                <motion.p
                                  className="text-sm mb-3 line-clamp-2 text-white/90"
                                  style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}
                                  initial={{ y: 20, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                >
                                  {item.description}
                                </motion.p>
                              )}

                              {/* Date and Location */}
                              <motion.div
                                className="flex items-center gap-3 text-xs text-white/75 mb-3"
                                style={{ fontFamily: 'var(--font-crimson)' }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                              >
                                {item.date_taken && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.date_taken).toLocaleDateString('pt-BR')}
                                  </span>
                                )}
                                {item.location && (
                                  <span className="flex items-center gap-1 truncate">
                                    <MapPin className="w-3 h-3" />
                                    {item.location}
                                  </span>
                                )}
                              </motion.div>

                              {/* Action Buttons */}
                              <motion.div
                                className="flex gap-2"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <button
                                  onClick={(e) => toggleLike(item.id, e)}
                                  className="p-2 rounded-full backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110"
                                  style={{
                                    background: likedItems.has(item.id) ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
                                >
                                  <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                                </button>

                                <button
                                  onClick={(e) => shareItem(item, e)}
                                  className="p-2 rounded-full backdrop-blur-md border border-white/30 text-white hover:scale-110 transition-all duration-300"
                                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Mobile Touch Overlay - Lighter */}
                      <div className="absolute inset-0 md:hidden active:bg-black/20 transition-colors duration-150" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Empty State - Whimsical (with padding) */}
        <div className="container-padding">
          {filteredItems.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={shouldReduceMotion ? {} : {
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                📸
              </motion.div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>
                Nenhuma memória encontrada
              </h3>
              <p className="mb-6" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                Em breve, muitas memórias! 📸✨
              </p>
              <motion.button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                  setMediaTypeFilter('all')
                }}
                className="px-6 py-3 rounded-full font-semibold transition-all duration-300"
                style={{
                  background: 'var(--decorative)',
                  color: 'var(--white-soft)',
                  fontFamily: 'var(--font-playfair)'
                }}
                whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Limpar Filtros
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Gallery Lightbox Modal */}
      <GalleryLightbox
        isOpen={lightboxOpen}
        album={selectedAlbum}
        onClose={closeLightbox}
      />
    </>
  )
}
