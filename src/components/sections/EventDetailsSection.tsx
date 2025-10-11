'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'
import { CONSTABLE_GALERIE } from '@/lib/utils/maps'

// Wedding date: November 20, 2025 at 10:30 AM
const WEDDING_DATE = new Date('2025-11-20T10:30:00-03:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date()
  const difference = WEDDING_DATE.getTime() - now.getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

export default function EventDetailsSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const eventDetails = [
    {
      icon: Calendar,
      label: 'Data',
      value: '20 de Novembro de 2025',
      subtitle: 'Quinta-feira',
    },
    {
      icon: Clock,
      label: 'Horário',
      value: '10:30h',
      subtitle: 'Cerimônia',
    },
    {
      icon: MapPin,
      label: 'Local',
      value: CONSTABLE_GALERIE.name,
      subtitle: 'Eng. Luciano Cavalcante',
    },
  ]

  return (
    <section className="py-32" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Heart
              className="w-12 h-12 mx-auto mb-6"
              style={{
                color: 'var(--decorative)',
                strokeWidth: 1.5,
              }}
            />
          </motion.div>

          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.05em',
              lineHeight: '1.2',
            }}
          >
            Contagem Regressiva
          </h2>

          <p
            className="max-w-4xl mx-auto mb-16"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            Faltam apenas alguns dias para o nosso dia especial
          </p>

          {/* Countdown Display */}
          <div className="grid grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {[
              { value: timeLeft.days, label: 'Dias' },
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Minutos' },
              { value: timeLeft.seconds, label: 'Segundos' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  variant="glass"
                  className="backdrop-blur-sm"
                  style={{
                    background: 'rgba(168, 168, 168, 0.05)',
                    border: '1px solid rgba(168, 168, 168, 0.2)',
                  }}
                >
                  <CardContent className="text-center py-6 sm:py-8">
                    <div
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: '600',
                        color: 'var(--primary-text)',
                        lineHeight: '1',
                      }}
                    >
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <SectionDivider className="mt-16" />
        </motion.div>

        {/* Event Details - 3 Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3
            className="mb-12"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: '500',
              color: 'var(--primary-text)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Detalhes do Evento
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {eventDetails.map((detail, index) => {
            const Icon = detail.icon
            return (
              <motion.div
                key={detail.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  variant="elegant"
                  className="h-full relative group"
                  style={{
                    background: 'var(--white-soft)',
                    border: '1px solid var(--decorative)',
                  }}
                >
                  <CardContent className="text-center py-12">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="w-16 h-16 flex items-center justify-center mx-auto mb-8 rounded-full"
                      style={{
                        background: 'var(--decorative)',
                        opacity: 0.9,
                      }}
                    >
                      <Icon
                        className="h-7 w-7"
                        style={{
                          color: 'var(--white-soft)',
                          strokeWidth: 1.5,
                        }}
                      />
                    </motion.div>

                    <div
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '0.875rem',
                        color: 'var(--decorative)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        fontWeight: '600',
                      }}
                    >
                      {detail.label}
                    </div>

                    <h4
                      className="mb-2"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                        fontWeight: '600',
                        color: 'var(--primary-text)',
                        letterSpacing: '0.02em',
                        lineHeight: '1.4',
                      }}
                    >
                      {detail.value}
                    </h4>

                    <p
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1rem',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                      }}
                    >
                      {detail.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Dress Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card
            variant="invitation"
            style={{
              background: 'var(--accent)',
              border: '1px solid var(--decorative)',
            }}
          >
            <CardContent className="py-8">
              <div
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '0.875rem',
                  color: 'var(--decorative)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: '600',
                }}
              >
                Dress Code
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.5rem',
                  fontWeight: '500',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.05em',
                }}
              >
                Traje Social
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
