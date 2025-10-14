'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import BotanicalCorners from '@/components/ui/BotanicalCorners'

export default function GalleryHero() {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden">
      {/* Botanical Corner Decorations */}
      <BotanicalCorners pattern="diagonal-right" opacity={0.15} />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* HY Monogram Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <Image
              src="/HY.svg"
              alt="Hel & Ylana"
              width={80}
              height={80}
              className="opacity-80"
              style={{
                filter: 'brightness(0) saturate(100%)',
                color: 'var(--decorative)'
              }}
            />
          </motion.div>

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
  )
}
