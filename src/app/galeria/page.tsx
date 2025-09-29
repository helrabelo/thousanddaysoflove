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

// Real timeline data for Hel & Ylana's 1000-day journey
const realTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2023-01-06',
    title: 'Dia 1 - O Primeiro "Oi"',
    description: 'Do Tinder ao WhatsApp: aquele primeiro "oi" que mudou tudo. Quem diria que um match se tornaria a mais linda história de 1000 dias? ✨',
    media_type: 'photo',
    media_url: '/images/gallery/dia-1.jpg',
    thumbnail_url: '/images/gallery/dia-1-thumb.jpg',
    location: 'WhatsApp - Primeiro Contato',
    milestone_type: 'first_date',
    is_major_milestone: true,
    order_index: 1,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    date: '2024-03-15',
    title: 'Dia 434 - Nossa Casa Própria',
    description: 'O apartamento dos sonhos! Hel passava de bicicleta na faculdade sonhando em morar aqui. Anos de trabalho duro para nossa casa própria com 4 pets. 🏠💕',
    media_type: 'photo',
    media_url: '/images/gallery/dia-500.jpg',
    thumbnail_url: '/images/gallery/dia-500-thumb.jpg',
    location: 'Nosso Apartamento dos Sonhos',
    milestone_type: 'anniversary',
    is_major_milestone: true,
    order_index: 2,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    date: '2025-11-20',
    title: 'Dia 1000 - Para Sempre',
    description: 'Constable Galerie, 10h30. Exatos 1000 dias após aquele primeiro "oi" no WhatsApp. Caseiros e introvertidos celebrando com quem mais amamos. Mil dias virando eternidade. 💑',
    media_type: 'photo',
    media_url: '/images/gallery/dia-1000-casamento.jpg',
    thumbnail_url: '/images/gallery/dia-1000-thumb.jpg',
    location: 'Constable Galerie, Fortaleza',
    milestone_type: 'engagement',
    is_major_milestone: true,
    order_index: 3,
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Casa Fontana & Avatar VIP',
    description: 'Nosso primeiro encontro: jantar no Casa Fontana + Avatar VIP F11/F12. A química foi instantânea!',
    url: '/images/gallery/primeiro-beijo.jpg',
    thumbnail_url: '/images/gallery/primeiro-beijo-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.5,
    category: 'dates',
    tags: ['romântico', 'primeiro', 'especial'],
    date_taken: '2023-01-14',
    location: 'Casa Fontana, Fortaleza',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'O Gesto Decisivo',
    description: 'Ylana levando remédio e chá quando Hel ficou doente. "Na hora eu já sabia: é ela"',
    url: '/images/gallery/jantar-romantico.jpg',
    thumbnail_url: '/images/gallery/jantar-romantico-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.2,
    category: 'dates',
    tags: ['jantar', 'romântico', 'intimidade'],
    date_taken: '2023-02-15',
    location: 'Casa do Hel, Fortaleza',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Guaramiranga Espontâneo',
    description: 'Planejei jantar especial, mas não consegui esperar! Pedi namoro na manhã, nas montanhas',
    url: '/images/gallery/praia-juntos.jpg',
    thumbnail_url: '/images/gallery/praia-juntos-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.8,
    category: 'travel',
    tags: ['praia', 'viagem', 'diversão'],
    date_taken: '2023-02-25',
    location: 'Guaramiranga, Ceará',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    title: 'O Pedido em Icaraí',
    description: '"Vamos jantar no restaurante" virou surpresa na suíte com câmeras ligadas. O SIM mais lindo!',
    url: '/videos/gallery/pedido-completo.mp4',
    thumbnail_url: '/images/gallery/pedido-video-thumb.jpg',
    media_type: 'video',
    aspect_ratio: 1.77,
    category: 'proposal',
    tags: ['pedido', 'emoção', 'noivado'],
    date_taken: '2025-08-30',
    location: 'Icaraí de Amontada, Ceará',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    title: 'Nossa Família de 4 Pets',
    description: 'Linda 👑 (autista perfeita), Cacao 🍫, Olivia 🌸 e Oliver ⚡ - nossa família completa!',
    url: '/images/gallery/festa-noivado.jpg',
    thumbnail_url: '/images/gallery/festa-noivado-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.3,
    category: 'friends',
    tags: ['festa', 'celebração', 'amigos'],
    date_taken: '2024-03-10',
    location: 'Nossa Casa Própria, Fortaleza',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    title: 'Mangue Azul & Rio/Búzios',
    description: '2º aniversário no nosso favorito Mangue Azul + viagem dos sonhos em hotel 5 estrelas',
    url: '/images/gallery/escolha-vestido.jpg',
    thumbnail_url: '/images/gallery/escolha-vestido-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.1,
    category: 'wedding_prep',
    tags: ['vestido', 'preparativos', 'noiva'],
    date_taken: '2024-10-25',
    location: 'Mangue Azul, Fortaleza / Rio & Búzios',
    is_featured: false,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    title: 'Natal em Casa PRÓPRIA',
    description: 'Primeiro Natal recebendo a família em NOSSA casa. Não mais alugada - era nosso lar!',
    url: '/images/gallery/ensaio-pre-wedding.jpg',
    thumbnail_url: '/images/gallery/ensaio-pre-wedding-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.4,
    category: 'professional',
    tags: ['ensaio', 'fotografia', 'amor'],
    date_taken: '2024-12-25',
    location: 'Nossa Casa Própria, Fortaleza',
    is_featured: true,
    is_public: true,
    upload_date: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    title: 'Pensando no Futuro',
    description: 'Ylana congelou óvulos aos 34 anos - cuidando do nosso futuro, planejando nossa família',
    url: '/images/gallery/familia-dele.jpg',
    thumbnail_url: '/images/gallery/familia-dele-thumb.jpg',
    media_type: 'photo',
    aspect_ratio: 1.6,
    category: 'family',
    tags: ['família', 'domingo', 'união'],
    date_taken: '2025-04-15',
    location: 'Fortaleza, Ceará',
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
        setTimelineEvents(events.length > 0 ? events : realTimelineEvents)
      } catch (error) {
        console.error('Error loading gallery data:', error)
        // Fall back to mock data if service fails
        setMediaItems(mockMediaItems)
        setTimelineEvents(realTimelineEvents)
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
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-6" style={{ borderColor: 'var(--decorative)', borderTopColor: 'var(--primary-text)' }} />
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em' }}>
              Preparando nossos 1000 dias...
            </h2>
            <p style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic', fontSize: '1.125rem' }}>
              Do primeiro "oi" no WhatsApp até o Constable Galerie...
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      {/* Hero Section - Wedding Invitation Style */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em', lineHeight: '1.1' }}>
              Nossa Galeria
            </h1>
            <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
            <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
              Mil dias de amor capturados em momentos eternos.
              Cada foto conta uma parte da nossa jornada até o altar.
            </p>
          </motion.div>
        </div>
      </section>

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
      <section className="py-20" style={{ background: 'var(--accent)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em' }}>
              Memórias Destacadas
            </h2>
            <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
            <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
              Os momentos mais especiais da nossa jornada, escolhidos com carinho para contar nossa história de amor
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
                  <div className="relative overflow-hidden rounded-xl transition-all duration-500" style={{ background: 'var(--white-soft)', boxShadow: '0 4px 20px var(--shadow-subtle)', border: '1px solid var(--border-subtle)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px var(--shadow-medium)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)' }}>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.thumbnail_url || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold" style={{ background: 'var(--decorative)', color: 'var(--white-soft)', fontFamily: 'var(--font-crimson)' }}>
                      ✨ Destaque
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
                        {item.title}
                      </h3>
                      <p className="mb-4 line-clamp-2" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-crimson)' }}>
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
                    <div className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" style={{ background: 'linear-gradient(to top, rgba(44, 44, 44, 0.8), transparent)' }}>
                      <div className="absolute bottom-6 left-6 right-6" style={{ color: 'var(--white-soft)' }}>
                        <h4 className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>{item.title}</h4>
                        <p className="text-sm opacity-90 line-clamp-2" style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
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
      <section className="py-20" style={{ background: 'var(--decorative)' }}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--white-soft)', letterSpacing: '0.15em' }}>
              Venham para o Constable Galerie
            </h2>
            <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--white-soft)', opacity: '0.6' }} />
            <p className="text-xl mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--white-soft)', fontStyle: 'italic', opacity: '0.95' }}>
              No dia 20 de novembro de 2025, exatos 1000 dias após o primeiro "oi" no WhatsApp,
              onde a arte encontra o amor e nossos mil dias se tornam eternidade.
              Como sempre recebemos nossos amigos em casa, agora os recebemos no altar!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105" style={{ background: 'var(--white-soft)', color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)', boxShadow: '0 4px 15px var(--shadow-subtle)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-medium)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 15px var(--shadow-subtle)' }}>
                Confirmar Presença nos 1000 Dias
              </button>
              <button className="px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 border border-white/30 hover:bg-white/10" style={{ background: 'transparent', color: 'var(--white-soft)', fontFamily: 'var(--font-playfair)' }}>
                Ajudem a Construir Nosso Lar
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