'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Search, Filter, Edit, Trash2, Star, Eye, EyeOff,
  Upload, Download, Grid, List, BarChart3, Settings,
  Image, Video, Calendar, MapPin, Tag, Heart, Share2
} from 'lucide-react'
import { MediaItem, MediaCategory, GalleryStats, GalleryFilter } from '@/types/wedding'
import MediaUploader from './MediaUploader'

interface GalleryAdminProps {
  items: MediaItem[]
  stats: GalleryStats
  onUpload?: (items: MediaItem[]) => Promise<void>
  onUpdate?: (item: MediaItem) => Promise<void>
  onDelete?: (itemId: string) => Promise<void>
  onBulkUpdate?: (itemIds: string[], updates: Partial<MediaItem>) => Promise<void>
  onExport?: () => Promise<void>
}

const categoryLabels: Record<MediaCategory, string> = {
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

type ViewMode = 'grid' | 'list'
type TabType = 'overview' | 'media' | 'stats' | 'settings'

export default function GalleryAdmin({
  items,
  stats,
  onUpload,
  onUpdate,
  onDelete,
  onBulkUpdate,
  onExport
}: GalleryAdminProps) {
  const [activeTab, setActiveTab] = useState<TabType>('media')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showUploader, setShowUploader] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<GalleryFilter>({
    categories: [],
    media_types: [],
    tags: [],
    sort_by: 'upload_date',
    sort_order: 'desc'
  })

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const searchMatch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const categoryMatch = filters.categories.length === 0 ||
        filters.categories.includes(item.category)

      const typeMatch = filters.media_types.length === 0 ||
        filters.media_types.includes(item.media_type)

      const tagMatch = filters.tags.length === 0 ||
        filters.tags.some(tag => item.tags.includes(tag))

      return searchMatch && categoryMatch && typeMatch && tagMatch
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any

      switch (filters.sort_by) {
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'category':
          aVal = a.category
          bVal = b.category
          break
        case 'date_taken':
          aVal = new Date(a.date_taken || 0).getTime()
          bVal = new Date(b.date_taken || 0).getTime()
          break
        default:
          aVal = new Date(a.upload_date).getTime()
          bVal = new Date(b.upload_date).getTime()
      }

      if (filters.sort_order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return filtered
  }, [items, searchQuery, filters])

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedItems.size === 0 || !onBulkUpdate) return

    const itemIds = Array.from(selectedItems)

    switch (action) {
      case 'feature':
        await onBulkUpdate(itemIds, { is_featured: true })
        break
      case 'unfeature':
        await onBulkUpdate(itemIds, { is_featured: false })
        break
      case 'public':
        await onBulkUpdate(itemIds, { is_public: true })
        break
      case 'private':
        await onBulkUpdate(itemIds, { is_public: false })
        break
      case 'delete':
        if (confirm(`Deletar ${itemIds.length} itens selecionados?`)) {
          for (const itemId of itemIds) {
            if (onDelete) await onDelete(itemId)
          }
        }
        break
    }

    setSelectedItems(new Set())
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Fotos</p>
              <p className="text-3xl font-bold">{stats.total_photos}</p>
            </div>
            <Image className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total de Vídeos</p>
              <p className="text-3xl font-bold">{stats.total_videos}</p>
            </div>
            <Video className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Destacados</p>
              <p className="text-3xl font-bold">{stats.featured_count}</p>
            </div>
            <Star className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Tamanho Total</p>
              <p className="text-3xl font-bold">{Math.round(stats.total_size_mb)}MB</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(stats.categories_breakdown).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600">{categoryLabels[category as MediaCategory]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Uploads Recentes</h3>
        <div className="space-y-3">
          {items
            .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
            .slice(0, 5)
            .map(item => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <img
                  src={item.thumbnail_url || item.url}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {categoryLabels[item.category]} •{' '}
                    {new Date(item.upload_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {item.is_featured && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  const MediaTab = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Search and Filters */}
        <div className="flex flex-1 space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar fotos e vídeos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {onExport && (
            <button
              onClick={onExport}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          )}

        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-xl p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedItems.size} item{selectedItems.size !== 1 ? 'ns' : ''} selecionado{selectedItems.size !== 1 ? 's' : ''}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('feature')}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
              >
                Destacar
              </button>
              <button
                onClick={() => handleBulkAction('public')}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Publicar
              </button>
              <button
                onClick={() => handleBulkAction('private')}
                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Privado
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Deletar
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Items Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Checkbox */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedItems.has(item.id)}
                  onChange={() => handleSelectItem(item.id)}
                  className="w-4 h-4 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500"
                />
              </div>

              {/* Media */}
              <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <img
                  src={item.thumbnail_url || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Video Indicator */}
                {item.media_type === 'video' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  {item.is_featured && (
                    <div className="bg-yellow-500 text-white p-1 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  {!item.is_public && (
                    <div className="bg-gray-500 text-white p-1 rounded-full">
                      <EyeOff className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="bg-white/90 text-gray-700 p-1 rounded-full hover:bg-white transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(item.id)}
                    className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h4 className="font-medium text-gray-800 text-sm line-clamp-1 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {categoryLabels[item.category]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={filteredItems.length > 0 && selectedItems.size === filteredItems.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500 mr-4"
              />
              <span className="text-sm font-medium text-gray-700">
                Selecionar todos ({filteredItems.length})
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredItems.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500"
                  />

                  <img
                    src={item.thumbnail_url || item.url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-800 truncate">
                        {item.title}
                      </h4>
                      {item.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                      {!item.is_public && (
                        <EyeOff className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{categoryLabels[item.category]}</span>
                      <span className="capitalize">{item.media_type}</span>
                      {item.date_taken && (
                        <span>{new Date(item.date_taken).toLocaleDateString('pt-BR')}</span>
                      )}
                      {item.location && <span>{item.location}</span>}
                    </div>

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{item.tags.length - 3} mais
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Nenhuma mídia encontrada
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filters.categories.length > 0
              ? 'Tente ajustar os filtros ou fazer uma nova busca'
              : 'Adicione suas primeiras fotos e vídeos para começar'}
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300"
          >
            Adicionar Primeira Mídia
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Galeria - Administração
              </h1>
              <p className="text-gray-600">
                Gerencie suas fotos e vídeos do casamento
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {items.length} itens • {Math.round(stats.total_size_mb)} MB
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                { id: 'media', label: 'Mídia', icon: Grid },
                { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
                { id: 'settings', label: 'Configurações', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'media' && <MediaTab />}
        {activeTab === 'stats' && <div>Estatísticas em breve...</div>}
        {activeTab === 'settings' && <div>Configurações em breve...</div>}
      </div>

      {/* Fixed Floating Upload Button */}
      <motion.button
        onClick={() => setShowUploader(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:from-rose-600 hover:to-pink-700 transition-all duration-300 z-50 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Adicionar Fotos/Vídeos
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </motion.button>

      {/* Media Uploader Modal */}
      <AnimatePresence>
        {showUploader && (
          <MediaUploader
            onClose={() => setShowUploader(false)}
            onUpload={async (uploads) => {
              // Convert uploads to MediaItem format
              const mediaItems: MediaItem[] = uploads.map(upload => ({
                id: upload.id,
                title: upload.title,
                description: upload.description,
                url: upload.preview_url, // This would be replaced with actual uploaded URL
                thumbnail_url: upload.preview_url,
                media_type: upload.file.type.startsWith('image/') ? 'photo' : 'video',
                aspect_ratio: 1, // Would be calculated from actual file
                category: upload.category,
                tags: upload.tags,
                date_taken: upload.date_taken,
                location: upload.location,
                is_featured: upload.is_featured,
                is_public: true,
                upload_date: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }))

              if (onUpload) {
                await onUpload(mediaItems)
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}