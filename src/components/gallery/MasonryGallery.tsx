'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Share2, Heart, Download, Play } from 'lucide-react'
import { MediaItem, MediaCategory, GalleryFilter } from '@/types/wedding'

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

export default function MasonryGallery({
  items,
  title = "Nossa Galeria de Memórias",
  description = "Cada foto conta uma parte da nossa história",
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
    if (onItemClick) {
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

  return (
    <section className="py-20" style={{ background: 'var(--background)' }}>
      <div className="max-w-8xl mx-auto px-6">
        {/* Header */}
        <motion.div
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
        </motion.div>

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
                  whileHover={{ scale: 1.05 }}
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

        {/* Masonry Grid */}
        <motion.div
          className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="break-inside-avoid mb-6 group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => handleItemClick(item, index)}
            >
              <div className="relative overflow-hidden rounded-2xl transition-all duration-500" style={{ background: 'var(--white-soft)', boxShadow: '0 4px 20px var(--shadow-subtle)', border: '1px solid var(--border-subtle)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px var(--shadow-medium)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)' }}>
                {/* Media Content */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.thumbnail_url || item.url}
                    alt={item.title}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ aspectRatio: item.aspect_ratio }}
                    loading="lazy"
                  />

                  {/* Video Play Overlay */}
                  {item.media_type === 'video' && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: 'var(--white-soft)' }}>
                        <Play className="w-8 h-8 ml-1" style={{ color: 'var(--decorative)' }} />
                      </div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {item.is_featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--decorative)', color: 'var(--white-soft)', fontFamily: 'var(--font-crimson)', boxShadow: '0 2px 8px var(--shadow-subtle)' }}>
                      ⭐ Destaque
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {/* Action Buttons */}
                  <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => toggleLike(item.id, e)}
                      className="p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300"
                      style={{
                        background: likedItems.has(item.id) ? 'var(--decorative)' : 'rgba(255, 255, 255, 0.1)',
                        color: 'white'
                      }}
                    >
                      <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={(e) => shareItem(item, e)}
                      className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                      {item.description}
                    </p>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--decorative)',
                            fontFamily: 'var(--font-crimson)'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="text-xs" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
                          +{item.tags.length - 3} mais
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date and Location */}
                  <div className="flex justify-between items-center text-xs" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
                    {item.date_taken && (
                      <span>
                        {new Date(item.date_taken).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                    {item.location && (
                      <span className="truncate ml-2">{item.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>
              Nenhuma memória encontrada
            </h3>
            <p className="mb-6" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
              Tente ajustar os filtros ou fazer uma nova busca
            </p>
            <button
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
            >
              Limpar Filtros
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}