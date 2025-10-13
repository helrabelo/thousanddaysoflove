'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { sanityFetch } from '@/sanity/lib/client'
import { storyPreviewMomentsQuery } from '@/sanity/queries/timeline'

// Story Moment Interface (from Sanity storyMoment document)
interface StoryMoment {
  _id: string
  title: string
  date?: string
  icon?: string
  description: string
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
  video?: {
    asset: {
      url: string
    }
  }
  dayNumber?: number
  contentAlign?: 'left' | 'right' | 'center'
  displayOrder: number
  phase?: {
    _id: string
    title: string
    dayRange: string
  }
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Helper function to format date in Brazilian format
const formatBrazilianDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch (error) {
    return dateString
  }
}

export default function StoryPreview() {
  const [storyMoments, setStoryMoments] = useState<StoryMoment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load story moments from Sanity CMS
      const moments = await sanityFetch<StoryMoment[]>({
        query: storyPreviewMomentsQuery,
        tags: ['storyMoment', 'storyPhase'],
      })

      console.log('📊 Story Preview - Loaded moments:', moments?.length || 0)
      console.log('📸 Moments with images:', moments?.filter(m => m.image?.asset?.url).length || 0)
      console.log('🎬 Moments with videos:', moments?.filter(m => m.video?.asset?.url).length || 0)
      console.log('❌ Moments without media:', moments?.filter(m => !m.image?.asset?.url && !m.video?.asset?.url).length || 0)

      setStoryMoments(moments || [])
    } catch (error) {
      console.error('Error loading story preview from Sanity:', error)
      setStoryMoments([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '600px',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div className="relative z-10 h-full flex items-center justify-center">
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: '1.25rem',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            Carregando momentos especiais...
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/collage-background.jpg"
          alt="Nossa História"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(248, 246, 243, 0.92) 0%, rgba(248, 246, 243, 0.88) 50%, rgba(248, 246, 243, 0.95) 100%)'
          }}
        />
      </div>

      {/* Header Section */}
      <div
        className="relative z-10 px-8 sm:px-12 lg:px-16"
        style={{
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: '600',
                color: 'var(--primary-text)',
                letterSpacing: '0.05em',
                lineHeight: '1.2',
              }}
            >
              Nossa História
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                lineHeight: '1.8',
                color: 'var(--secondary-text)',
                fontStyle: 'italic',
                opacity: 0.95,
              }}
            >
              De um simples "oi" no WhatsApp a 1000 dias de amor, cada momento nos trouxe até aqui.
              Conheça a jornada que nos levou ao altar na Casa HY.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Masonry Story Grid - Edge-to-Edge with Fixed Row Heights */}
      <div className="relative z-10">
        {/* Story Grid Container */}
        <div className="w-full overflow-hidden">
          <div className="story-grid">
            {storyMoments.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p style={{ fontFamily: 'var(--font-crimson)', fontSize: '1.25rem', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
                  Nenhum momento cadastrado ainda. Adicione momentos especiais no Sanity Studio!
                </p>
              </div>
            )}
            {storyMoments.map((moment, index) => {
              // Vary column spans for visual interest (every 3rd and 5th item spans 2 columns)
              const shouldSpanTwo = index % 3 === 0 || index % 5 === 0

              // Use uploaded image or fallback to wedding invitation poster
              const imageUrl = moment.image?.asset?.url || '/images/hero-poster.jpg'

              return (
                <motion.div
                  key={moment._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.015, 0.6) }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`story-item ${shouldSpanTwo ? 'story-item-wide' : ''}`}
                  onMouseEnter={() => setHoveredItem(moment._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="relative w-full h-full overflow-hidden group cursor-pointer rounded-[4px]">
                    {/* Moment Image */}
                    <motion.div
                      className="relative w-full h-full"
                      animate={{
                        scale: hoveredItem === moment._id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src={imageUrl}
                        alt={moment.image?.alt || moment.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </motion.div>

                    {/* Hover Overlay with Story Content - Desktop Only */}
                    <AnimatePresence>
                      {hoveredItem === moment._id && (
                        <motion.div
                          className="absolute inset-0 hidden md:block"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                            pointerEvents: 'none',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          {/* Day Number Badge - Top */}
                          {moment.dayNumber && (
                            <motion.div
                              style={{
                                alignSelf: 'flex-start',
                                background: 'rgba(168, 168, 168, 0.95)',
                                color: 'white',
                                padding: '0.625rem 1.125rem',
                                borderRadius: '999px',
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                boxShadow: '0 3px 12px rgba(0, 0, 0, 0.3)',
                                textTransform: 'uppercase',
                                backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                              }}
                              initial={{ y: -20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                              Dia {moment.dayNumber}
                            </motion.div>
                          )}

                          {/* Story Content - Bottom */}
                          <div style={{ textAlign: 'left', color: 'white' }}>
                            {/* Title */}
                            <motion.h3
                              style={{
                                fontFamily: 'var(--font-playfair)',
                                fontSize: '1.375rem',
                                fontWeight: 700,
                                lineHeight: '1.25',
                                textShadow: '0 3px 10px rgba(0, 0, 0, 0.7)',
                                marginBottom: '0.5rem',
                              }}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {moment.title}
                            </motion.h3>

                            {/* Description */}
                            <motion.p
                              style={{
                                fontFamily: 'var(--font-crimson)',
                                fontSize: '1rem',
                                lineHeight: '1.7',
                                opacity: 0.98,
                                fontStyle: 'italic',
                                textShadow: '0 2px 6px rgba(0, 0, 0, 0.6)',
                                marginBottom: '0.75rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                              {truncateText(moment.description, 120)}
                            </motion.p>

                            {/* Date */}
                            {moment.date && (
                              <motion.div
                                style={{
                                  fontFamily: 'var(--font-crimson)',
                                  fontSize: '0.875rem',
                                  opacity: 0.9,
                                  fontStyle: 'italic',
                                  textShadow: '0 2px 5px rgba(0, 0, 0, 0.6)',
                                  paddingTop: '0.5rem',
                                  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <Calendar className="w-3.5 h-3.5" />
                                {formatBrazilianDate(moment.date)}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Mobile Touch Overlay */}
                    <div className="absolute inset-0 md:hidden active:bg-black/20 transition-colors duration-150" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Tall Gradient Overlay with CTA (400px) */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center"
          style={{
            height: '400px',
            background: `linear-gradient(to bottom, transparent 0%, rgba(248, 246, 243, 0.5) 30%, var(--background) 85%)`,
          }}
        >
          {/* Small Text Above Button */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6 text-center px-6"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(0.875rem, 2vw, 1rem)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
              maxWidth: '500px',
            }}
          >
            Descubra os 12 momentos que nos levaram ao altar
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button
              variant="wedding"
              size="lg"
              asChild
              className="group shadow-xl"
            >
              <Link href="/historia" className="flex items-center gap-2">
                Ver História Completa
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  style={{ strokeWidth: 2 }}
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Simplified CSS - Grid Layout Only */}
      <style jsx>{`
        .story-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* Mobile: 2 columns */
          grid-auto-rows: 200px; /* FIXED ROW HEIGHT */
          gap: 8px;
          width: 100%;
          max-height: 1200px; /* Show 4-6 rows (1200px ÷ 200px = 6 rows) */
          overflow: hidden;
        }

        /* Tablet: 3-4 columns */
        @media (min-width: 640px) {
          .story-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 768px) {
          .story-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }
        }

        /* Desktop: 5-6 columns */
        @media (min-width: 1024px) {
          .story-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
          }
        }

        @media (min-width: 1280px) {
          .story-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        /* Story items - standard size */
        .story-item {
          position: relative;
          grid-column: span 1;
          grid-row: span 1;
          cursor: pointer;
          overflow: hidden;
        }

        /* Wide story items - span 2 columns for variety */
        .story-item-wide {
          grid-column: span 2;
        }

        /* Mobile: limit wide spans on small screens */
        @media (max-width: 639px) {
          .story-item-wide {
            grid-column: span 1; /* Don't span on mobile, too narrow */
          }
        }

        /* Fallback background for items without images */
        .story-item > div {
          background: linear-gradient(
            135deg,
            var(--accent) 0%,
            var(--decorative) 100%
          );
        }
      `}</style>
    </section>
  )
}
