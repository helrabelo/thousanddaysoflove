'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MasonryGallery from '@/components/gallery/MasonryGallery'
import VideoGallery from '@/components/gallery/VideoGallery'
import MediaLightbox from '@/components/gallery/MediaLightbox'
import { MediaItem } from '@/types/wedding'

interface GalleryClientProps {
  mediaItems: MediaItem[]
}

export default function GalleryClient({ mediaItems }: GalleryClientProps) {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    currentIndex: 0,
    items: [] as MediaItem[]
  })

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

  return (
    <>
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
              Venham para a Casa HY
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
          const link = document.createElement('a')
          link.href = item.url
          link.download = `${item.title}.${item.media_type === 'video' ? 'mp4' : 'jpg'}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}
      />
    </>
  )
}
