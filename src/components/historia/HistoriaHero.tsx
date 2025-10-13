'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function HistoriaHero() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/collage-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Overlay for better text readability */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, rgba(248, 246, 243, 0.92) 0%, rgba(248, 246, 243, 0.95) 100%)',
        }}
      />

      <div className="max-w-4xl mx-auto text-center container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-12"
            style={{
              background: 'var(--decorative)',
              opacity: 0.9,
            }}
          >
            <Heart className="w-8 h-8" style={{ color: 'var(--white-soft)' }} />
          </div>

          <h1
            className="mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.1em',
              lineHeight: '1.2',
            }}
          >
            Nossa História Completa
          </h1>

          <p
            className="mb-12 max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            Daquele "oi" no WhatsApp até o casamento. 1000 dias, muitas histórias, e a gente aqui.
          </p>

          <div className="w-32 h-px mx-auto mb-16" style={{ background: 'var(--decorative)' }} />
        </motion.div>
      </div>
    </section>
  )
}
