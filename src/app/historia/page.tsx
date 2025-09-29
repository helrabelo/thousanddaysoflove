'use client'

import { motion } from 'framer-motion'
import Navigation from '@/components/ui/Navigation'
import StoryTimeline from '@/components/gallery/StoryTimeline'
import AboutUsSection from '@/components/sections/AboutUsSection'
import { realTimelineEvents } from '@/data/realTimeline'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HistoriaPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-12"
              style={{
                background: 'var(--decorative)',
                opacity: 0.9
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
                lineHeight: '1.2'
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
                fontStyle: 'italic'
              }}
            >
              De um simples "oi" no WhatsApp até o altar - a jornada de 1000 dias que nos trouxe até aqui.
              Cada momento, cada marco, cada descoberta que construiu nosso amor.
            </p>

            <div
              className="w-32 h-px mx-auto mb-16"
              style={{ background: 'var(--decorative)' }}
            />
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <StoryTimeline
        events={realTimelineEvents}
        title="1000 Dias de Amor"
        description="Cada dia nos trouxe mais perto do para sempre"
      />

      {/* About Us Section */}
      <AboutUsSection />

      {/* Navigation Back */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              variant="wedding-outline"
              size="lg"
              asChild
            >
              <Link href="/" className="flex items-center">
                <ArrowLeft className="w-5 h-5 mr-3" />
                Voltar ao Início
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}