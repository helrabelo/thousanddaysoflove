'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/ui/Navigation'
import HeroVideoSection from '@/components/gallery/HeroVideoSection'
import StoryTimeline from '@/components/gallery/StoryTimeline'
import MasonryGallery from '@/components/gallery/MasonryGallery'
import VideoGallery from '@/components/gallery/VideoGallery'
import MediaLightbox from '@/components/gallery/MediaLightbox'
import { MediaItem, TimelineEvent } from '@/types/wedding'
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'

// Mock data for demonstration
const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2022-11-20',
    title: 'Primeiro Encontro',
    description: 'Nosso primeiro encontro no café da Rua Augusta. Foi amor à primeira vista! Conversamos por horas sobre sonhos, viagens e a vida.',
    media_type: 'photo',
    media_url: '/images/gallery/primeiro-encontro.jpg',
    thumbnail_url: '/images/gallery/primeiro-encontro-thumb.jpg',
    location: 'Café da Rua Augusta, São Paulo',
    milestone_type: 'first_date',
    is_major_milestone: true,
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    date: '2023-02-14',
    title: 'Nosso Primeiro Dia dos Namorados',
    description: 'Uma noite mágica no restaurante com vista para a cidade. Foi quando soubemos que era para sempre.',
    media_type: 'photo',
    media_url: '/images/gallery/dia-namorados.jpg',
    thumbnail_url: '/images/gallery/dia-namorados-thumb.jpg',
    location: 'Restaurante Panorâmico, São Paulo',
    milestone_type: 'anniversary',
    is_major_milestone: true,
    order_index: 2,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    date: '2023-07-15',
    title: 'Viagem para o Rio',
    description: 'Nossa primeira viagem juntos. Praia, sol, e momentos inesquecíveis. Foi quando percebemos que éramos uma equipe perfeita.',
    media_type: 'video',
    media_url: '/videos/gallery/rio-viagem.mp4',
    thumbnail_url: '/images/gallery/rio-thumb.jpg',
    location: 'Rio de Janeiro, RJ',
    milestone_type: 'travel',
    is_major_milestone: true,
    order_index: 3,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    date: '2024-05-10',
    title: 'O Pedido',
    description: 'O momento mais especial de nossas vidas. No pôr do sol na praia, com o anel que eu escolhi pensando nela.',
    media_type: 'video',
    media_url: '/videos/gallery/pedido.mp4',
    thumbnail_url: '/images/gallery/pedido-thumb.jpg',
    location: 'Praia de Copacabana, Rio de Janeiro',
    milestone_type: 'proposal',
    is_major_milestone: true,
    order_index: 4,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    date: '2024-08-22',
    title: 'Conhecendo a Família',
    description: 'O dia em que oficialmente nos tornamos uma família. Emoção, alegria e muito amor em cada abraço.',
    media_type: 'photo',
    media_url: '/images/gallery/familia.jpg',
    thumbnail_url: '/images/gallery/familia-thumb.jpg',
    location: 'Casa da Família, São Paulo',
    milestone_type: 'family',
    is_major_milestone: false,
    order_index: 5,
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Primeiro Beijo',
    description: 'O momento mágico do nosso primeiro beijo no jardim do café',
    url: '/images/gallery/primeiro-beijo.jpg',
    thumbnail_url: '/images/gallery/primeiro-beijo-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.5,
    category: 'dates',
    tags: ['romântico', 'primeiro', 'especial'],
    date_taken: '2022-11-20',
    location: 'São Paulo, SP',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Noite Romântica',
    description: 'Jantar à luz de velas no nosso restaurante favorito',
    url: '/images/gallery/jantar-romantico.jpg',
    thumbnail_url: '/images/gallery/jantar-romantico-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.2,
    category: 'dates',
    tags: ['jantar', 'romântico', 'intimidade'],
    date_taken: '2023-02-14',
    location: 'Restaurante Vila Madalena, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Dia na Praia',
    description: 'Nosso primeiro fim de semana na praia - sol, mar e muito amor',
    url: '/images/gallery/praia-juntos.jpg',
    thumbnail_url: '/images/gallery/praia-juntos-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.8,
    category: 'travel',
    tags: ['praia', 'viagem', 'diversão'],
    date_taken: '2023-07-15',
    location: 'Guarujá, SP',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'Video do Pedido',
    description: 'O momento mais emocionante das nossas vidas capturado em vídeo',
    url: '/videos/gallery/pedido-completo.mp4',
    thumbnail_url: '/images/gallery/pedido-video-thumb.jpg',
    media_type: 'video',
    aspect_ratio: 1.77,
    category: 'proposal',
    tags: ['pedido', 'emoção', 'noivado'],
    date_taken: '2024-05-10',
    location: 'Praia de Copacabana, Rio de Janeiro',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Festa de Noivado',
    description: 'Celebrando nosso noivado com amigos e família',
    url: '/images/gallery/festa-noivado.jpg',
    thumbnail_url: '/images/gallery/festa-noivado-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.3,
    category: 'friends',
    tags: ['festa', 'celebração', 'amigos'],
    date_taken: '2024-06-20',
    location: 'Buffet Vila Olímpia, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Preparativos do Casamento',
    description: 'Escolhendo o vestido perfeito para o grande dia',
    url: '/images/gallery/escolha-vestido.jpg',
    thumbnail_url: '/images/gallery/escolha-vestido-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.1,
    category: 'wedding_prep',
    tags: ['vestido', 'preparativos', 'noiva'],
    date_taken: '2024-08-15',
    location: 'Atelier de Noivas, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    title: 'Ensaio Pré-Wedding',
    description: 'Nosso ensaio fotográfico no Ibirapuera com o fotógrafo',
    url: '/images/gallery/ensaio-pre-wedding.jpg',
    thumbnail_url: '/images/gallery/ensaio-pre-wedding-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.4,
    category: 'professional',
    tags: ['ensaio', 'fotografia', 'amor'],
    date_taken: '2024-09-10',
    location: 'Parque Ibirapuera, São Paulo',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    title: 'Com a Família Dele',
    description: 'Domingo em família - almoço, risadas e muito carinho',
    url: '/images/gallery/familia-dele.jpg',
    thumbnail_url: '/images/gallery/familia-dele-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.6,
    category: 'family',
    tags: ['família', 'domingo', 'união'],
    date_taken: '2024-07-28',
    location: 'Casa da Família, São Paulo',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export default function GaleriaPage() {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    currentIndex: 0,
    items: [] as MediaItem[]
  })

  const [isLoading, setIsLoading] = useState(true)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data from SupabaseGalleryService
        const [items, events] = await Promise.all([
          SupabaseGalleryService.getMediaItems(),
          SupabaseGalleryService.getTimelineEvents()
        ])

        setMediaItems(items)
        setTimelineEvents(events)
      } catch (error) {
        console.error('Error loading gallery data:', error)
        // Fall back to mock data if service fails
        setMediaItems(mockMediaItems)
        setTimelineEvents(mockTimelineEvents)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const openLightbox = (item: MediaItem, items: MediaItem[] = mediaItems) => {
    const index = items.findIndex(i => i.id === item.id)
    setLightboxState({
      isOpen: true,
      currentIndex: index >= 0 ? index : 0,
      items
    })
  }

  const closeLightbox = () => {
    setLightboxState(prev => ({ ...prev, isOpen: false }))
  }

  const changeLightboxIndex = (index: number) => {
    setLightboxState(prev => ({ ...prev, currentIndex: index }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-deep-romantic mb-2">
            Carregando Nossa História...
          </h2>
          <p className="text-gray-600">
            Preparando momentos especiais para você
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Video Section */}
      <HeroVideoSection
        videoUrl="/videos/hero-love-story.mp4"
        posterUrl="/images/hero-poster.jpg"
        title="Mil Dias de Amor"
        subtitle="Uma jornada fotográfica através dos momentos mais especiais da nossa história de amor. Cada imagem conta uma parte da nossa jornada até o altar."
        overlayOpacity={0.5}
        textPosition="center"
        autoPlay={true}
        showControls={true}
      />

      {/* Story Timeline */}
      <StoryTimeline
        events={timelineEvents}
        title="Nossa Linha do Tempo"
        description="Os marcos mais importantes da nossa jornada de amor"
      />

      {/* Photo Gallery */}
      <MasonryGallery
        items={mediaItems.filter(item => item.media_type === 'photo')}
        title="Galeria de Fotos"
        description="Momentos capturados que guardam para sempre nossos sorrisos, abraços e olhares apaixonados"
        showFilters={true}
        onItemClick={(item, index) => {
          const photoItems = mediaItems.filter(i => i.media_type === 'photo')
          openLightbox(item, photoItems)
        }}
      />

      {/* Video Gallery */}
      <VideoGallery
        videos={mediaItems.filter(item => item.media_type === 'video')}
        title="Galeria de Vídeos"
        description="Momentos em movimento que capturam a essência da nossa história"
        layout="grid"
        autoPlay={false}
        showDuration={true}
        onVideoClick={(item, index) => {
          const videoItems = mediaItems.filter(i => i.media_type === 'video')
          openLightbox(item, videoItems)
        }}
      />

      {/* Featured Memories Section */}
      <section className="py-20 bg-gradient-to-br from-rose-100 via-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-header text-deep-romantic mb-6">
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Memórias Destacadas
              </span>
            </h2>
            <p className="story-text text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Os momentos mais especiais da nossa jornada, escolhidos a dedo para contar nossa história de amor
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediaItems
              .filter(item => item.is_featured)
              .slice(0, 6)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.thumbnail_url || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Destaque
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-deep-romantic mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
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

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl">
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-sm opacity-90 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              No dia 20 de novembro de 2025, esses mil dias de amor se transformarão em para sempre.
              Venha celebrar conosco o início de uma nova jornada!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Confirmar Presença
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
                Ver Lista de Presentes
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <MediaLightbox
        isOpen={lightboxState.isOpen}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        autoPlay={false}
        showThumbnails={true}
        onClose={closeLightbox}
        onChange={changeLightboxIndex}
        onLike={(item) => {
          console.log('Liked:', item.title)
        }}
        onShare={(item) => {
          if (navigator.share) {
            navigator.share({
              title: item.title,
              text: item.description || 'Confira esta memória especial do nosso amor!',
              url: window.location.href
            })
          }
        }}
        onDownload={(item) => {
          // Create download link
          const link = document.createElement('a')
          link.href = item.url
          link.download = `${item.title}.${item.media_type === 'video' ? 'mp4' : 'jpg'}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}
      />
    </main>
  )
}