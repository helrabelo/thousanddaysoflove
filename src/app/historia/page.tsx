'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/ui/Navigation'
import TimelineMomentCard from '@/components/timeline/TimelineMomentCard'
import TimelinePhaseHeader from '@/components/timeline/TimelinePhaseHeader'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Heart } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface TimelineEvent {
  id: string
  day_number: number
  date: string
  title: string
  description: string
  image_url: string
  image_alt: string
  content_align: 'left' | 'right'
  phase: string
  video_url?: string
}

interface PhaseConfig {
  id: string
  title: string
  dayRange: string
  subtitle: string
}

const phases: PhaseConfig[] = [
  {
    id: 'primeiros_dias',
    title: 'Os Primeiros Dias',
    dayRange: 'Dia 1 - 100',
    subtitle: 'Do Tinder ao primeiro encontro. Aquele nervosismo que a gente não admitia.',
  },
  {
    id: 'construindo_juntos',
    title: 'Construindo Juntos',
    dayRange: 'Dia 100 - 500',
    subtitle: 'Quando a gente percebeu que isso aqui era pra valer. Casa própria, primeira dog, e muitas cervejas no Mangue Azul.',
  },
  {
    id: 'nossa_familia',
    title: 'Nossa Família',
    dayRange: 'Dia 500 - 900',
    subtitle: 'De 1 pra 4 cachorros. Caos total. A gente ama cada segundo.',
  },
  {
    id: 'caminhando_altar',
    title: 'Caminhando Pro Altar',
    dayRange: 'Dia 900 - 1000',
    subtitle: 'O pedido em Icaraí. Planejamento do casamento. E a gente aqui, prestes a celebrar 1000 dias juntos.',
  },
]

export default function HistoriaPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .eq('is_visible', true)
        .not('day_number', 'is', null)
        .order('day_number')

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error loading timeline events:', error)
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

  // Group events by phase
  const eventsByPhase = events.reduce((acc, event) => {
    if (!acc[event.phase]) acc[event.phase] = []
    acc[event.phase].push(event)
    return acc
  }, {} as Record<string, TimelineEvent[]>)

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

      {/* Dynamic Timeline Phases and Events from Supabase */}
      {phases.map((phase) => {
        const phaseEvents = eventsByPhase[phase.id] || []
        if (phaseEvents.length === 0) return null

        return (
          <div key={phase.id}>
            <TimelinePhaseHeader
              title={phase.title}
              dayRange={phase.dayRange}
              subtitle={phase.subtitle}
            />

            {phaseEvents.map((event) => (
              <TimelineMomentCard
                key={event.id}
                day={event.day_number}
                date={new Date(event.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
                title={event.title}
                description={event.description}
                imageUrl={event.image_url}
                imageAlt={event.image_alt}
                contentAlign={event.content_align}
                videoUrl={event.video_url}
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