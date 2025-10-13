'use client'

import { motion } from 'framer-motion'

export default function GalleryHero() {
  return (
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
  )
}
