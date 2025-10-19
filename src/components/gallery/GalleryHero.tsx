'use client'

import { motion } from 'framer-motion'
import BotanicalCorners from '@/components/ui/BotanicalCorners'
import HYBadge from '../ui/HYBadge'

export default function GalleryHero() {
  return (
    <section className="relative pt-8 md:pt-24 pb-20 px-6 overflow-hidden">
      {/* Botanical Corner Decorations */}
      <BotanicalCorners pattern="diagonal-right" opacity={0.15} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* HY Monogram Logo */}
          <HYBadge />

          <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em', lineHeight: '1.1' }}>
            Nosso Caos Bonito Em Fotos
          </h1>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-6" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
            Cada clique aqui tem cheiro de café, latido no fundo e sorriso torto. Vida real, zero filtro.
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-12" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)' }}>
            Achou uma foto nossa perdida no rolo? Manda. Pode ser bastidor antes do casamento, selfie suada na festa, vídeo tremido do after. Tudo vira memória oficial por aqui – e a gente guarda como álbum de família (porque é).
          </p>

          {/* Upload CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <button
              onClick={() => {
                // Trigger the global media upload modal
                window.dispatchEvent(new CustomEvent('open-media-upload'))
              }}
              className="inline-flex items-center gap-3 px-10 py-5 text-lg font-medium transition-all duration-300 group hover:shadow-lg"
              style={{
                fontFamily: 'var(--font-crimson)',
                background: 'var(--primary-text)',
                color: 'var(--background)',
                borderRadius: '2px',
              }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
              <span>Compartilhar Suas Fotos</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
