'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/ui/Navigation'
import TimelineMomentCard from '@/components/timeline/TimelineMomentCard'
import TimelinePhaseHeader from '@/components/timeline/TimelinePhaseHeader'
import { client } from '@/sanity/lib/client'
import { timelineQuery } from '@/sanity/queries/timeline'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface TimelineMoment {
  _id: string
  title: string
  date: string
  icon?: string
  description: string
  image?: {
    asset: { url: string }
    alt?: string
  }
  video?: {
    asset: { url: string }
  }
  dayNumber?: number
  contentAlign: 'left' | 'right'
  displayOrder: number
}

interface TimelinePhase {
  _id: string
  id: { current: string }
  title: string
  dayRange: string
  subtitle?: string
  displayOrder: number
  moments: TimelineMoment[]
}

interface TimelineData {
  phases: TimelinePhase[]
}

export default function HistoriaPage() {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTimeline()
  }, [])

  const loadTimeline = async () => {
    try {
      const data = await client.fetch<TimelineData>(timelineQuery)
      setTimelineData(data)
    } catch (error) {
      console.error('Error loading timeline from Sanity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <p style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-crimson)', fontSize: '1.25rem' }}>
          Carregando nossa história...
        </p>
      </div>
    )
  }

  if (!timelineData || timelineData.phases.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <p style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-crimson)', fontSize: '1.25rem' }}>
          Nenhum momento encontrado. Adicione momentos no Sanity Studio!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20" style={{ background: 'var(--background)' }}>
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

      {/* Dynamic Timeline Phases and Events from Sanity */}
      {timelineData.phases.map((phase) => {
        if (!phase.moments || phase.moments.length === 0) return null

        return (
          <div key={phase._id}>
            <TimelinePhaseHeader
              title={phase.title}
              dayRange={phase.dayRange}
              subtitle={phase.subtitle || ''}
            />

            {phase.moments.map((moment) => (
              <TimelineMomentCard
                key={moment._id}
                day={moment.dayNumber || 0}
                date={new Date(moment.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
                title={moment.title}
                description={moment.description}
                imageUrl={moment.image?.asset?.url || ''}
                imageAlt={moment.image?.alt || moment.title}
                contentAlign={moment.contentAlign}
                videoUrl={moment.video?.asset?.url}
              />
            ))}
          </div>
        )
      })}

      {/* Spacer before back button */}
      <div className="py-16" style={{ background: 'var(--background)' }} />

      {/* Navigation Back */}
      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-4xl mx-auto text-center px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button variant="wedding-outline" size="lg" asChild>
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