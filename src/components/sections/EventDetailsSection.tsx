'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface EventDetailsSectionProps {
  data?: {
    sectionTitle?: string
    weddingSettings?: {
      brideName?: string
      groomName?: string
      weddingDate?: string
      weddingTime?: string
      receptionTime?: string
      timezone?: string
      venueName?: string
      venueAddress?: string
      venueCity?: string
      venueState?: string
      venueZip?: string
      venueLocation?: {
        lat: number
        lng: number
      }
      dressCode?: string
      dressCodeDescription?: string
      rsvpDeadline?: string
      guestLimit?: number
    }
    showCountdown?: boolean
    showEventDetails?: boolean
    showDressCode?: boolean
  }
}

function calculateTimeLeft(weddingDate: Date): TimeLeft {
  const now = new Date()
  const difference = weddingDate.getTime() - now.getTime()

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

export default function EventDetailsSection({ data }: EventDetailsSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const [weddingDate, setWeddingDate] = useState<Date | null>(null)

  // Extract values with fallbacks
  const sectionTitle = data?.sectionTitle || 'Contagem Regressiva'
  const showCountdown = data?.showCountdown !== false
  const showEventDetails = data?.showEventDetails !== false
  const showDressCode = data?.showDressCode !== false
  const settings = data?.weddingSettings

  useEffect(() => {
    if (!settings?.weddingDate || !settings?.weddingTime) return

    // Create wedding date from date + time
    const dateTimeStr = `${settings.weddingDate}T${settings.weddingTime}`
    const weddingDateTime = new Date(dateTimeStr)
    setWeddingDate(weddingDateTime)
  }, [settings])

  useEffect(() => {
    if (!weddingDate) return

    setMounted(true)
    setTimeLeft(calculateTimeLeft(weddingDate))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [weddingDate])

  // Prevent hydration mismatch
  if (!mounted || !settings || !weddingDate) {
    return null
  }

  // Format date
  const formattedDate = weddingDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const formattedDay = weddingDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
  })

  // Format time
  const formattedTime = weddingDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const eventDetails = [
    {
      icon: Calendar,
      label: 'Data',
      value: formattedDate,
      subtitle: formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1),
    },
    {
      icon: Clock,
      label: 'Horário',
      value: formattedTime,
      subtitle: 'Cerimônia',
    },
    {
      icon: MapPin,
      label: 'Local',
      value: settings.venueName || 'A confirmar',
      subtitle: settings.venueCity || '',
    },
  ]

  return (
    <section className="py-32" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Countdown Timer */}
        {showCountdown && (
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
              {sectionTitle}
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
                    variant="subtle"
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
        )}

        {/* Event Details - 3 Column Grid */}
        {showEventDetails && (
          <>
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
          </>
        )}

        {/* Dress Code */}
        {showDressCode && settings.dressCode && (
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
                  {settings.dressCode}
                </div>
                {settings.dressCodeDescription && (
                  <p
                    className="mt-3"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1rem',
                      color: 'var(--secondary-text)',
                      fontStyle: 'italic',
                    }}
                  >
                    {settings.dressCodeDescription}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}
