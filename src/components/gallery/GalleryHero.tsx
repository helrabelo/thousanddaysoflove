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
            Galeria HY
          </h1>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
            Um compilado de momentos especiais capturados em fotos.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
