'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import BotanicalCorners from '@/components/ui/BotanicalCorners'

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
    <section
      className="relative overflow-hidden min-h-screen md:h-[calc(100vh-80px)]"
      style={{
        background: 'var(--background)',
      }}
    >
      {/* Botanical Corner Decorations */}
      <BotanicalCorners pattern="diagonal-right" />

      {/* Mobile Layout - Stack Vertically */}
      <div className="md:hidden px-6 sm:px-8 py-12 relative z-10 flex flex-col min-h-screen justify-center">
        {/* Countdown Timer - Mobile */}
        {showCountdown && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Heart
                className="w-10 h-10 mx-auto mb-4"
                style={{
                  color: 'var(--decorative)',
                  strokeWidth: 1.5,
                }}
              />
            </motion.div>

            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                fontWeight: '600',
                color: 'var(--primary-text)',
                letterSpacing: '0.05em',
                lineHeight: '1.2',
              }}
            >
              {sectionTitle}
            </h2>

            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1rem, 4vw, 1.125rem)',
                lineHeight: '1.6',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
              }}
            >
              Faltam apenas alguns dias para o nosso dia especial
            </p>

            {/* Countdown Display - Mobile: Only Days & Hours */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              {[
                { value: timeLeft.days, label: 'Dias' },
                { value: timeLeft.hours, label: 'Horas' },
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
                    <CardContent className="text-center py-4">
                      <div
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                          fontWeight: '600',
                          color: 'var(--primary-text)',
                          lineHeight: '1',
                        }}
                      >
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div
                        className="mt-1"
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
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
          </motion.div>
        )}

        {/* Event Details - Mobile */}
        {showEventDetails && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4 mb-8"
          >
            {eventDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    variant="elegant"
                    style={{
                      background: 'var(--white-soft)',
                      border: '1px solid var(--decorative)',
                    }}
                  >
                    <CardContent className="flex items-center gap-4 py-4">
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0"
                        style={{
                          background: 'var(--decorative)',
                          opacity: 0.9,
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{
                            color: 'var(--white-soft)',
                            strokeWidth: 1.5,
                          }}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className="mb-1"
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: '0.75rem',
                            color: 'var(--decorative)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                          }}
                        >
                          {detail.label}
                        </div>
                        <h4
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: 'var(--primary-text)',
                            letterSpacing: '0.02em',
                            lineHeight: '1.3',
                          }}
                        >
                          {detail.value}
                        </h4>
                        <p
                          style={{
                            fontFamily: 'var(--font-crimson)',
                            fontSize: '0.875rem',
                            color: 'var(--secondary-text)',
                            fontStyle: 'italic',
                          }}
                        >
                          {detail.subtitle}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Dress Code - Mobile */}
        {showDressCode && settings.dressCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card
              variant="invitation"
              style={{
                background: 'var(--accent)',
                border: '1px solid var(--decorative)',
              }}
            >
              <CardContent className="py-6 text-center">
                <div
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '0.75rem',
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
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {settings.dressCode}
                </div>
                {settings.dressCodeDescription && (
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.875rem',
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

      {/* Desktop Layout - Side by Side */}
      <div className="hidden md:flex items-center justify-center h-[calc(100vh-80px)] px-8 lg:px-16 relative z-10">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Countdown Timer */}
          {showCountdown && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Heart
                  className="w-14 h-14 mx-auto mb-6"
                  style={{
                    color: 'var(--decorative)',
                    strokeWidth: 1.5,
                  }}
                />
              </motion.div>

              <h2
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  letterSpacing: '0.05em',
                  lineHeight: '1.2',
                }}
              >
                {sectionTitle}
              </h2>

              <p
                className="mb-10 max-w-lg mx-auto"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
                  lineHeight: '1.7',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                }}
              >
                Faltam apenas alguns dias para o nosso dia especial
              </p>

              {/* Countdown Display - Desktop: All 4 in one row */}
              <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[
                  { value: timeLeft.days, label: 'Dias' },
                  { value: timeLeft.hours, label: 'Horas' },
                  { value: timeLeft.minutes, label: 'Minutos' },
                  { value: timeLeft.seconds, label: 'Segundos' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
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
                      <CardContent className="text-center py-5">
                        <div
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: 'clamp(2.5rem, 4vw, 3rem)',
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
                            fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
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
            </motion.div>
          )}

          {/* Right Column - Event Details & Dress Code */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Event Details + Dress Code - 2x2 Grid */}
            {showEventDetails && (
              <div>
                <h3
                  className="text-center mb-6"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
                    fontWeight: '500',
                    color: 'var(--primary-text)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Detalhes do Evento
                </h3>

                <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {eventDetails.map((detail, index) => {
                    const Icon = detail.icon
                    return (
                      <motion.div
                        key={detail.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card
                          variant="elegant"
                          className="group hover:shadow-lg transition-shadow duration-300 h-full"
                          style={{
                            background: 'var(--white-soft)',
                            border: '1px solid var(--decorative)',
                          }}
                        >
                          <CardContent className="flex flex-col items-center justify-center text-center py-5 h-full">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                              className="w-12 h-12 flex items-center justify-center rounded-full mb-3"
                              style={{
                                background: 'var(--decorative)',
                                opacity: 0.9,
                              }}
                            >
                              <Icon
                                className="h-5 w-5"
                                style={{
                                  color: 'var(--white-soft)',
                                  strokeWidth: 1.5,
                                }}
                              />
                            </motion.div>

                            <div
                              className="mb-1"
                              style={{
                                fontFamily: 'var(--font-playfair)',
                                fontSize: '0.7rem',
                                color: 'var(--decorative)',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                fontWeight: '600',
                              }}
                            >
                              {detail.label}
                            </div>
                            <h4
                              className="mb-1"
                              style={{
                                fontFamily: 'var(--font-playfair)',
                                fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                                fontWeight: '600',
                                color: 'var(--primary-text)',
                                letterSpacing: '0.02em',
                                lineHeight: '1.3',
                              }}
                            >
                              {detail.value}
                            </h4>
                            <p
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.8125rem',
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

                  {/* Dress Code - Part of 2x2 Grid */}
                  {showDressCode && settings.dressCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <Card
                        variant="elegant"
                        className="group hover:shadow-lg transition-shadow duration-300 h-full"
                        style={{
                          background: 'var(--white-soft)',
                          border: '1px solid var(--decorative)',
                        }}
                      >
                        <CardContent className="flex flex-col items-center justify-center text-center py-5 h-full">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="w-12 h-12 flex items-center justify-center rounded-full mb-3"
                            style={{
                              background: 'var(--decorative)',
                              opacity: 0.9,
                            }}
                          >
                            <Heart
                              className="h-5 w-5"
                              style={{
                                color: 'var(--white-soft)',
                                strokeWidth: 1.5,
                              }}
                            />
                          </motion.div>

                          <div
                            className="mb-1"
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontSize: '0.7rem',
                              color: 'var(--decorative)',
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              fontWeight: '600',
                            }}
                          >
                            Dress Code
                          </div>
                          <h4
                            className="mb-1"
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                              fontWeight: '600',
                              color: 'var(--primary-text)',
                              letterSpacing: '0.02em',
                              lineHeight: '1.3',
                            }}
                          >
                            {settings.dressCode}
                          </h4>
                          {settings.dressCodeDescription && (
                            <p
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.8125rem',
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
