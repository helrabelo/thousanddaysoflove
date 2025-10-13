'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Calendar, Clock, MapPin, Heart } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
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

// Animated countdown digit component with flip effect
function AnimatedDigit({ value, label }: { value: number; label: string }) {
  const prevValue = useRef(value)
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    if (prevValue.current !== value) {
      setIsFlipping(true)
      prevValue.current = value
      const timer = setTimeout(() => setIsFlipping(false), 400)
      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <Card
      variant="subtle"
      className="backdrop-blur-sm overflow-hidden"
      style={{
        background: 'rgba(168, 168, 168, 0.05)',
        border: '1px solid rgba(168, 168, 168, 0.2)',
      }}
    >
      <CardContent className="text-center py-5">
        <motion.div
          key={value}
          initial={{ rotateX: isFlipping ? 90 : 0, opacity: isFlipping ? 0 : 1 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            transformStyle: 'preserve-3d',
            perspective: 1000,
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2.5rem, 4vw, 3rem)',
            fontWeight: '600',
            color: 'var(--primary-text)',
            lineHeight: '1',
            willChange: 'transform, opacity',
          }}
        >
          {String(value).padStart(2, '0')}
        </motion.div>
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
          {label}
        </div>
      </CardContent>
    </Card>
  )
}

export default function EventDetailsSection({ data }: EventDetailsSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)
  const [weddingDate, setWeddingDate] = useState<Date | null>(null)
  const shouldReduceMotion = useReducedMotion()

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
      <div className="md:hidden container-padding py-12 relative z-10 flex flex-col min-h-screen justify-center">
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

        {/* Event Details + Dress Code - Mobile Grid (1 column, same gap as desktop) */}
        {showEventDetails && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {eventDetails.map((detail, index) => {
                const Icon = detail.icon
                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8, y: shouldReduceMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    viewport={{ once: true }}
                  >
                    <Card
                      variant="elegant"
                      className="h-full"
                      style={{
                        background: 'var(--white-soft)',
                        border: '1px solid var(--decorative)',
                      }}
                    >
                      <CardContent className="flex flex-col items-center justify-center text-center py-4 h-full">
                        <motion.div
                          animate={shouldReduceMotion ? {} : {
                            scale: [1, 1.02, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          className="w-10 h-10 flex items-center justify-center rounded-full mb-2.5"
                          style={{
                            background: 'linear-gradient(135deg, var(--decorative) 0%, rgba(168, 168, 168, 0.85) 100%)',
                            boxShadow: '0 2px 8px rgba(168, 168, 168, 0.15)',
                            willChange: 'transform',
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
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.15) + 0.2 }}
                          viewport={{ once: true }}
                          className="mb-1.5"
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: '0.75rem',
                            color: 'var(--decorative)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                          }}
                        >
                          {detail.label}
                        </motion.div>
                        <motion.h4
                          initial={{ opacity: 0, y: 5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.15) + 0.3 }}
                          viewport={{ once: true }}
                          className="mb-1.5"
                          style={{
                            fontFamily: 'var(--font-playfair)',
                            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                            fontWeight: '600',
                            color: 'var(--primary-text)',
                            letterSpacing: '0.01em',
                            lineHeight: '1.25',
                          }}
                        >
                          {detail.value}
                        </motion.h4>
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.15) + 0.4 }}
                          viewport={{ once: true }}
                          style={{
                            fontFamily: 'var(--font-crimson)',
                            fontSize: '0.9375rem',
                            color: 'var(--secondary-text)',
                            fontStyle: 'italic',
                            lineHeight: '1.4',
                          }}
                        >
                          {detail.subtitle}
                        </motion.p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}

              {/* Dress Code - Mobile (part of 2x2 grid) */}
              {showDressCode && settings.dressCode && (
                <motion.div
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8, y: shouldReduceMotion ? 0 : 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.45,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  viewport={{ once: true }}
                >
                  <Card
                    variant="elegant"
                    className="h-full"
                    style={{
                      background: 'var(--white-soft)',
                      border: '1px solid var(--decorative)',
                    }}
                  >
                    <CardContent className="flex flex-col items-center justify-center text-center py-4 h-full">
                      <motion.div
                        animate={shouldReduceMotion ? {} : {
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full mb-2.5"
                        style={{
                          background: 'linear-gradient(135deg, var(--decorative) 0%, rgba(168, 168, 168, 0.85) 100%)',
                          boxShadow: '0 2px 8px rgba(168, 168, 168, 0.15)',
                          willChange: 'transform',
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
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.65 }}
                        viewport={{ once: true }}
                        className="mb-1.5"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: '0.75rem',
                          color: 'var(--decorative)',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          fontWeight: '600',
                        }}
                      >
                        Dress Code
                      </motion.div>
                      <motion.h4
                        initial={{ opacity: 0, y: 5 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.75 }}
                        viewport={{ once: true }}
                        className="mb-1.5"
                        style={{
                          fontFamily: 'var(--font-playfair)',
                          fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                          fontWeight: '600',
                          color: 'var(--primary-text)',
                          letterSpacing: '0.01em',
                          lineHeight: '1.25',
                        }}
                      >
                        {settings.dressCode}
                      </motion.h4>
                      {settings.dressCodeDescription && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.85 }}
                          viewport={{ once: true }}
                          style={{
                            fontFamily: 'var(--font-crimson)',
                            fontSize: '0.9375rem',
                            color: 'var(--secondary-text)',
                            fontStyle: 'italic',
                            lineHeight: '1.4',
                          }}
                        >
                          {settings.dressCodeDescription}
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Desktop Layout - Side by Side */}
      <div className="hidden md:flex items-center justify-center h-[calc(100vh-80px)] container-padding relative z-10">
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
                    initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <AnimatedDigit value={item.value} label={item.label} />
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
                        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8, y: shouldReduceMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.15,
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        <Card
                          variant="elegant"
                          className="group hover:shadow-lg transition-shadow duration-300 h-full"
                          style={{
                            background: 'var(--white-soft)',
                            border: '1px solid var(--decorative)',
                          }}
                        >
                          <CardContent className="flex flex-col items-center justify-center text-center py-4 h-full">
                            <motion.div
                              whileHover={{
                                scale: 1.15,
                                rotate: shouldReduceMotion ? 0 : [0, -5, 5, 0]
                              }}
                              animate={shouldReduceMotion ? {} : {
                                scale: [1, 1.02, 1]
                              }}
                              transition={{
                                hover: {
                                  type: 'spring',
                                  stiffness: 400,
                                  damping: 10
                                },
                                default: {
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }
                              }}
                              className="w-10 h-10 flex items-center justify-center rounded-full mb-2.5"
                              style={{
                                background: 'linear-gradient(135deg, var(--decorative) 0%, rgba(168, 168, 168, 0.85) 100%)',
                                boxShadow: '0 2px 8px rgba(168, 168, 168, 0.15)',
                                willChange: 'transform',
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

                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: (index * 0.15) + 0.2 }}
                              viewport={{ once: true }}
                              className="mb-1.5"
                              style={{
                                fontFamily: 'var(--font-playfair)',
                                fontSize: '0.75rem',
                                color: 'var(--decorative)',
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                fontWeight: '600',
                              }}
                            >
                              {detail.label}
                            </motion.div>
                            <motion.h4
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: (index * 0.15) + 0.3 }}
                              viewport={{ once: true }}
                              className="mb-1.5"
                              style={{
                                fontFamily: 'var(--font-playfair)',
                                fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                                fontWeight: '600',
                                color: 'var(--primary-text)',
                                letterSpacing: '0.01em',
                                lineHeight: '1.25',
                              }}
                            >
                              {detail.value}
                            </motion.h4>
                            <motion.p
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: (index * 0.15) + 0.4 }}
                              viewport={{ once: true }}
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.9375rem',
                                color: 'var(--secondary-text)',
                                fontStyle: 'italic',
                                lineHeight: '1.4',
                              }}
                            >
                              {detail.subtitle}
                            </motion.p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}

                  {/* Dress Code - Part of 2x2 Grid */}
                  {showDressCode && settings.dressCode && (
                    <motion.div
                      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8, y: shouldReduceMotion ? 0 : 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: 0.45,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      viewport={{ once: true, margin: '-50px' }}
                    >
                      <Card
                        variant="elegant"
                        className="group hover:shadow-lg transition-shadow duration-300 h-full"
                        style={{
                          background: 'var(--white-soft)',
                          border: '1px solid var(--decorative)',
                        }}
                      >
                        <CardContent className="flex flex-col items-center justify-center text-center py-4 h-full">
                          <motion.div
                            whileHover={{
                              scale: 1.15,
                              rotate: shouldReduceMotion ? 0 : [0, -5, 5, 0]
                            }}
                            animate={shouldReduceMotion ? {} : {
                              scale: [1, 1.02, 1]
                            }}
                            transition={{
                              hover: {
                                type: 'spring',
                                stiffness: 400,
                                damping: 10
                              },
                              default: {
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full mb-2.5"
                            style={{
                              background: 'linear-gradient(135deg, var(--decorative) 0%, rgba(168, 168, 168, 0.85) 100%)',
                              boxShadow: '0 2px 8px rgba(168, 168, 168, 0.15)',
                              willChange: 'transform',
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

                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.65 }}
                            viewport={{ once: true }}
                            className="mb-1.5"
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontSize: '0.75rem',
                              color: 'var(--decorative)',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              fontWeight: '600',
                            }}
                          >
                            Dress Code
                          </motion.div>
                          <motion.h4
                            initial={{ opacity: 0, y: 5 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.75 }}
                            viewport={{ once: true }}
                            className="mb-1.5"
                            style={{
                              fontFamily: 'var(--font-playfair)',
                              fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                              fontWeight: '600',
                              color: 'var(--primary-text)',
                              letterSpacing: '0.01em',
                              lineHeight: '1.25',
                            }}
                          >
                            {settings.dressCode}
                          </motion.h4>
                          {settings.dressCodeDescription && (
                            <motion.p
                              initial={{ opacity: 0, y: 5 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.85 }}
                              viewport={{ once: true }}
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.9375rem',
                                color: 'var(--secondary-text)',
                                fontStyle: 'italic',
                                lineHeight: '1.4',
                              }}
                            >
                              {settings.dressCodeDescription}
                            </motion.p>
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
