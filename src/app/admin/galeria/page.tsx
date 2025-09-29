'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GalleryAdmin from '@/components/gallery/GalleryAdmin'
import { MediaItem, GalleryStats, MediaCategory } from '@/types/wedding'
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'

// Mock data for demonstration
const mockStats: GalleryStats = {
  total_photos: 156,
  total_videos: 24,
  total_size_mb: 2840.5,
  categories_breakdown: {
    engagement: 12,
    travel: 28,
    dates: 45,
    family: 23,
    friends: 34,
    special_moments: 18,
    proposal: 8,
    wedding_prep: 15,
    behind_scenes: 11,
    professional: 26
  },
  featured_count: 15,
  latest_upload_date: '2024-09-28T10:30:00Z',
  most_popular_category: 'dates',
  timeline_events_count: 5
}

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Primeiro Encontro no Café',
    description: 'O momento em que tudo começou - nosso primeiro encontro no café da Rua Augusta',
    url: '/images/gallery/primeiro-encontro.jpg',
    thumbnail_url: '/images/gallery/primeiro-encontro-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.5,
    category: 'dates',
    tags: ['primeiro', 'encontro', 'café', 'início'],
    date_taken: '2022-11-20',
    location: 'Café da Rua Augusta, São Paulo',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-15T09:00:00Z',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    title: 'Jantar Romântico - Dia dos Namorados',
    description: 'Nossa primeira celebração do Dia dos Namorados juntos',
    url: '/images/gallery/dia-namorados.jpg',
    thumbnail_url: '/images/gallery/dia-namorados-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.2,
    category: 'dates',
    tags: ['romântico', 'dia dos namorados', 'jantar'],
    date_taken: '2023-02-14',
    location: 'Restaurante Panorâmico, São Paulo',
    is_featured: true,
    is_public: true,
    upload_date: '2024-02-15T08:30:00Z',
    created_at: '2024-02-15T08:30:00Z',
    updated_at: '2024-02-15T08:30:00Z'
  },
  {
    id: '3',
    title: 'Viagem para o Rio de Janeiro',
    description: 'Nossa primeira viagem juntos - praias, Cristo Redentor e muito amor',
    url: '/images/gallery/rio-viagem.jpg',
    thumbnail_url: '/images/gallery/rio-viagem-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.8,
    category: 'travel',
    tags: ['viagem', 'rio', 'praia', 'primeira viagem'],
    date_taken: '2023-07-15',
    location: 'Rio de Janeiro, RJ',
    is_featured: true,
    is_public: true,
    upload_date: '2024-07-20T14:15:00Z',
    created_at: '2024-07-20T14:15:00Z',
    updated_at: '2024-07-20T14:15:00Z'
  },
  {
    id: '4',
    title: 'Video do Pedido de Casamento',
    description: 'O momento mais emocionante e especial das nossas vidas',
    url: '/videos/gallery/pedido-casamento.mp4',
    thumbnail_url: '/images/gallery/pedido-thumb.jpg',
    media_type: 'video',
    aspect_ratio: 1.77,
    category: 'proposal',
    tags: ['pedido', 'casamento', 'noivado', 'emoção'],
    date_taken: '2024-05-10',
    location: 'Praia de Copacabana, Rio de Janeiro',
    is_featured: true,
    is_public: true,
    upload_date: '2024-05-11T16:45:00Z',
    created_at: '2024-05-11T16:45:00Z',
    updated_at: '2024-05-11T16:45:00Z'
  },
  {
    id: '5',
    title: 'Festa de Noivado',
    description: 'Celebrando nosso noivado com todos os nossos amigos e família',
    url: '/images/gallery/festa-noivado.jpg',
    thumbnail_url: '/images/gallery/festa-noivado-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.3,
    category: 'friends',
    tags: ['festa', 'noivado', 'celebração', 'amigos', 'família'],
    date_taken: '2024-06-20',
    location: 'Buffet Vila Olímpia, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-06-21T10:00:00Z',
    created_at: '2024-06-21T10:00:00Z',
    updated_at: '2024-06-21T10:00:00Z'
  },
  {
    id: '6',
    title: 'Ensaio Pré-Wedding',
    description: 'Nosso ensaio fotográfico profissional no Parque Ibirapuera',
    url: '/images/gallery/ensaio-pre-wedding.jpg',
    thumbnail_url: '/images/gallery/ensaio-pre-wedding-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.4,
    category: 'professional',
    tags: ['ensaio', 'pré-wedding', 'fotografia', 'profissional'],
    date_taken: '2024-09-10',
    location: 'Parque Ibirapuera, São Paulo',
    is_featured: true,
    is_public: true,
    upload_date: '2024-09-11T09:30:00Z',
    created_at: '2024-09-11T09:30:00Z',
    updated_at: '2024-09-11T09:30:00Z'
  },
  {
    id: '7',
    title: 'Preparativos - Escolha do Vestido',
    description: 'O dia especial em que escolhemos o vestido perfeito para o grande dia',
    url: '/images/gallery/escolha-vestido.jpg',
    thumbnail_url: '/images/gallery/escolha-vestido-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.1,
    category: 'wedding_prep',
    tags: ['vestido', 'preparativos', 'noiva', 'escolha'],
    date_taken: '2024-08-15',
    location: 'Atelier de Noivas, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-08-16T11:20:00Z',
    created_at: '2024-08-16T11:20:00Z',
    updated_at: '2024-08-16T11:20:00Z'
  },
  {
    id: '8',
    title: 'Domingo em Família',
    description: 'Almoço especial com a família dele - momento de união e carinho',
    url: '/images/gallery/familia-domenica.jpg',
    thumbnail_url: '/images/gallery/familia-domenica-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.6,
    category: 'family',
    tags: ['família', 'domingo', 'almoço', 'união'],
    date_taken: '2024-07-28',
    location: 'Casa da Família, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-07-29T15:10:00Z',
    created_at: '2024-07-29T15:10:00Z',
    updated_at: '2024-07-29T15:10:00Z'
  },
  {
    id: '9',
    title: 'Noite com Amigos',
    description: 'Saída especial com nosso grupo de amigos mais próximos',
    url: '/images/gallery/noite-amigos.jpg',
    thumbnail_url: '/images/gallery/noite-amigos-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.5,
    category: 'friends',
    tags: ['amigos', 'noite', 'diversão', 'grupo'],
    date_taken: '2024-03-22',
    location: 'Bar Vila Madalena, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-03-23T12:40:00Z',
    created_at: '2024-03-23T12:40:00Z',
    updated_at: '2024-03-23T12:40:00Z'
  },
  {
    id: '10',
    title: 'Momento Íntimo - Casa Nova',
    description: 'Nosso primeiro momento na casa que dividimos juntos',
    url: '/images/gallery/casa-nova.jpg',
    thumbnail_url: '/images/gallery/casa-nova-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.3,
    category: 'special_moments',
    tags: ['casa', 'novo lar', 'intimidade', 'começando'],
    date_taken: '2024-01-10',
    location: 'Nossa Casa, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-11T18:25:00Z',
    created_at: '2024-01-11T18:25:00Z',
    updated_at: '2024-01-11T18:25:00Z'
  },
  {
    id: '11',
    title: 'Behind the Scenes - Ensaio',
    description: 'Bastidores divertidos do nosso ensaio fotográfico',
    url: '/videos/gallery/bastidores-ensaio.mp4',
    thumbnail_url: '/images/gallery/bastidores-thumb.jpg',
    media_type: 'video',
    aspect_ratio: 1.77,
    category: 'behind_scenes',
    tags: ['bastidores', 'ensaio', 'diversão', 'natural'],
    date_taken: '2024-09-10',
    location: 'Parque Ibirapuera, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-09-11T20:15:00Z',
    created_at: '2024-09-11T20:15:00Z',
    updated_at: '2024-09-11T20:15:00Z'
  },
  {
    id: '12',
    title: 'Nosso Primeiro Ano Juntos',
    description: 'Celebrando nosso primeiro aniversário de relacionamento',
    url: '/images/gallery/primeiro-ano.jpg',
    thumbnail_url: '/images/gallery/primeiro-ano-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.4,
    category: 'special_moments',
    tags: ['aniversário', 'primeiro ano', 'celebração', 'marco'],
    date_taken: '2023-11-20',
    location: 'Restaurante Especial, São Paulo',
    is_featured: true,
    is_public: true,
    upload_date: '2023-11-21T14:30:00Z',
    created_at: '2023-11-21T14:30:00Z',
    updated_at: '2023-11-21T14:30:00Z'
  }
]

export default function AdminGaleriaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [stats, setStats] = useState<GalleryStats>(mockStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data from SupabaseGalleryService
        const [items, galleryStats] = await Promise.all([
          SupabaseGalleryService.getMediaItems(),
          SupabaseGalleryService.getGalleryStats()
        ])

        setMediaItems(items)
        setStats(galleryStats)
      } catch (error) {
        console.error('Error loading gallery data:', error)
        // Fall back to mock data if service fails
        setMediaItems(mockMediaItems)
        setStats(mockStats)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUpload = async (newItems: MediaItem[]) => {
    try {
      // Upload is already handled by SupabaseGalleryService.uploadFiles() in MediaUploader
      // Just reload data to refresh the display
      const [items, galleryStats] = await Promise.all([
        SupabaseGalleryService.getMediaItems(),
        SupabaseGalleryService.getGalleryStats()
      ])

      setMediaItems(items)
      setStats(galleryStats)

      console.log('✅ Upload concluído com sucesso!')
    } catch (error) {
      console.error('❌ Erro no upload:', error)
      throw error
    }
  }

  const handleUpdate = async (updatedItem: MediaItem) => {
    try {
      await SupabaseGalleryService.updateMediaItem(updatedItem.id, updatedItem)

      // Reload data
      const [items, galleryStats] = await Promise.all([
        SupabaseGalleryService.getMediaItems(),
        SupabaseGalleryService.getGalleryStats()
      ])

      setMediaItems(items)
      setStats(galleryStats)

      console.log('✅ Item atualizado com sucesso!')
    } catch (error) {
      console.error('❌ Erro na atualização:', error)
      throw error
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      await SupabaseGalleryService.deleteMediaItem(itemId)

      // Reload data
      const [items, galleryStats] = await Promise.all([
        SupabaseGalleryService.getMediaItems(),
        SupabaseGalleryService.getGalleryStats()
      ])

      setMediaItems(items)
      setStats(galleryStats)

      console.log('✅ Item deletado com sucesso!')
    } catch (error) {
      console.error('❌ Erro na deleção:', error)
      throw error
    }
  }

  const handleBulkUpdate = async (itemIds: string[], updates: Partial<MediaItem>) => {
    try {
      await SupabaseGalleryService.bulkUpdateMediaItems(itemIds, updates)

      // Reload data
      const [items, galleryStats] = await Promise.all([
        SupabaseGalleryService.getMediaItems(),
        SupabaseGalleryService.getGalleryStats()
      ])

      setMediaItems(items)
      setStats(galleryStats)

      console.log(`✅ ${itemIds.length} itens atualizados com sucesso!`)
    } catch (error) {
      console.error('❌ Erro na atualização em lote:', error)
      throw error
    }
  }

  const handleExport = async () => {
    try {
      const exportData = await SupabaseGalleryService.exportGalleryData()

      // Download JSON export
      const blob = new Blob([exportData], { type: 'application/json;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `galeria-completa-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('✅ Exportação concluída com sucesso!')
    } catch (error) {
      console.error('❌ Erro na exportação:', error)
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Carregando Administração da Galeria...
          </h2>
          <p className="text-gray-600">
            Preparando ferramentas de gerenciamento
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Administração da Galeria
                </h1>
                <p className="text-rose-100">
                  Gerencie todas as fotos e vídeos da sua história de amor
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">
                  {stats.total_photos + stats.total_videos}
                </div>
                <div className="text-sm text-rose-100">
                  Total de Mídias
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GalleryAdmin
          items={mediaItems}
          stats={stats}
          onUpload={handleUpload}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onBulkUpdate={handleBulkUpdate}
          onExport={handleExport}
        />
      </motion.div>

    </div>
  )
}