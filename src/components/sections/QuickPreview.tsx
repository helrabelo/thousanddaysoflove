'use client'

import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDivider, CardAccent } from '@/components/ui/BotanicalDecorations'

interface FeatureCard {
  _id: string
  title: string
  description: string
  icon: string
  linkUrl: string
  linkText?: string | null
  displayOrder: number
}

interface QuickPreviewProps {
  data?: {
    sectionTitle?: string
    sectionDescription?: string
    featureCards?: FeatureCard[]
    showHighlights?: boolean
    highlightsTitle?: string
    weddingSettings?: {
      weddingDate?: string
      weddingTime?: string
      venueName?: string
      venueCity?: string
      dressCode?: string
    }
  }
}

export default function QuickPreview({ data }: QuickPreviewProps) {
  // Extract values with fallbacks
  const sectionTitle = data?.sectionTitle || 'Explore Nossa Celebração'
  const sectionDescription = data?.sectionDescription || 'Descubra todos os detalhes do nosso dia especial'
  const features = data?.featureCards || []
  const showHighlights = data?.showHighlights !== false
  const highlightsTitle = data?.highlightsTitle || 'Informações Essenciais'
  const weddingSettings = data?.weddingSettings

  // Format wedding date
  const formattedDate = weddingSettings?.weddingDate
    ? new Date(weddingSettings.weddingDate).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '20 de Novembro de 2025'

  // Format wedding time
  const formattedTime = weddingSettings?.weddingTime
    ? new Date(`2000-01-01T${weddingSettings.weddingTime}`).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '10:30h'

  return (
    <section className="min-h-screen md:h-[calc(100vh-80px)] flex items-center py-16 md:py-0" style={{ background: 'var(--accent)' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.05em',
              lineHeight: '1.2'
            }}
          >
            {sectionTitle}
          </h2>
          <p
            className="max-w-4xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            {sectionDescription}
          </p>
          <SectionDivider className="mt-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            // Get icon component from lucide-react
            const Icon = (Icons as any)[feature.icon] || Icons.Heart

            return (
              <motion.div
                key={feature._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Link href={feature.linkUrl} className="block h-full">
                  <Card variant="elegant" className="h-full relative group cursor-pointer">
                    <CardAccent variant="top" className="opacity-30" />
                    <CardContent className="text-center h-full flex flex-col">
                      <div
                        className="w-14 h-14 flex items-center justify-center mx-auto mb-6 rounded-full transition-all duration-300 group-hover:scale-110"
                        style={{
                          background: 'var(--decorative)',
                          opacity: 0.9
                        }}
                      >
                        <Icon className="h-6 w-6" style={{ color: 'var(--white-soft)', strokeWidth: 1.5 }} />
                      </div>

                      <h3
                        className="mb-4"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: '1.25rem',
                          fontWeight: '500',
                          color: 'var(--primary-text)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {feature.title}
                      </h3>

                      <p
                        className="mb-6 flex-1"
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                          color: 'var(--secondary-text)',
                          fontStyle: 'italic'
                        }}
                      >
                        {feature.description}
                      </p>

                      <div
                        className="group-hover:underline transition-all duration-200"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          color: 'var(--decorative)',
                          fontSize: '0.9rem',
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          fontWeight: '500'
                        }}
                      >
                        {feature.linkText || 'Saiba Mais'}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Wedding Highlights - Show if enabled in settings */}
        {showHighlights && weddingSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <Card variant="invitation" className="relative">
              <CardAccent variant="corner" className="opacity-20" />
              <CardContent>
                <h3
                  className="mb-12"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                  }}
                >
                  {highlightsTitle}
                </h3>
                <SectionDivider className="mb-12" />
                <div className="grid md:grid-cols-4 gap-12">
                  <div className="text-center">
                    <div
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontSize: '1rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: '500'
                      }}
                    >
                      Cerimônia
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1.125rem',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}
                    >
                      {formattedTime}
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontSize: '1rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: '500'
                      }}
                    >
                      Local
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1.125rem',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}
                    >
                      {weddingSettings.venueName || 'A confirmar'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontSize: '1rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: '500'
                      }}
                    >
                      Bairro
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1.125rem',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}
                    >
                      {weddingSettings.venueCity || 'A confirmar'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        color: 'var(--primary-text)',
                        fontSize: '1rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        fontWeight: '500'
                      }}
                    >
                      Dress Code
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1.125rem',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                        lineHeight: '1.6'
                      }}
                    >
                      {weddingSettings.dressCode || 'Traje Social'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
