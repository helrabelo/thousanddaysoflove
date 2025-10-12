'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
          background: 'var(--background)',
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
      {/* Header Section - Clean Cream Background */}
      <div
        className="relative px-8 sm:px-12 lg:px-16"
        style={{
          background: 'var(--background)',
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
      <div className="relative">
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

              // Skip moments without images for now
              if (!moment.image?.asset?.url) {
                return null
              }

              return (
                <motion.div
                  key={moment._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.015, 0.6) }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`story-item ${shouldSpanTwo ? 'story-item-wide' : ''}`}
                >
                  <div className="relative w-full h-full overflow-hidden group">
                    {/* Moment Image */}
                    <Image
                      src={moment.image.asset.url}
                      alt={moment.image.alt || moment.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                    {/* Hover Overlay with Story Content */}
                    <div className="story-overlay">
                      {/* Day Number Badge - Top Left */}
                      {moment.dayNumber && (
                        <div className="day-badge">
                          Dia {moment.dayNumber}
                        </div>
                      )}

                      {/* Story Content - Bottom */}
                      <div className="story-content">
                        <h3 className="story-title">{moment.title}</h3>
                        <p className="story-description">
                          {truncateText(moment.description, 120)}
                        </p>
                        {moment.date && (
                          <div className="story-date">
                            {formatBrazilianDate(moment.date)}
                          </div>
                        )}
                      </div>
                    </div>
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

      {/* CSS for Masonry Grid with Fixed Row Heights + Story Hover Effects */}
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

        /* Ensure images fill their containers perfectly */
        .story-item > div {
          border-radius: 4px;
        }

        /* ======================================
           STORY HOVER OVERLAY STYLES
           ====================================== */

        .story-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.75) 40%,
            rgba(0, 0, 0, 0.5) 70%,
            rgba(0, 0, 0, 0.2) 100%
          );
          opacity: 0;
          transition: opacity 500ms ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          z-index: 10;
        }

        /* Show overlay on hover (desktop only) */
        @media (hover: hover) and (pointer: fine) {
          .story-item:hover .story-overlay {
            opacity: 1;
          }
        }

        /* Mobile: Show overlay on tap/touch */
        @media (hover: none) {
          .story-item:active .story-overlay {
            opacity: 1;
          }
        }

        /* Day Badge - Top Left */
        .day-badge {
          align-self: flex-start;
          background: rgba(168, 168, 168, 0.95);
          color: white;
          padding: 0.625rem 1.125rem;
          border-radius: 999px;
          font-family: var(--font-crimson);
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Story Content - Bottom */
        .story-content {
          text-align: left;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .story-title {
          font-family: var(--font-playfair);
          font-size: 1.375rem;
          font-weight: 700;
          line-height: 1.25;
          text-shadow: 0 3px 10px rgba(0, 0, 0, 0.7);
          margin-bottom: 0.5rem;
        }

        .story-description {
          font-family: var(--font-crimson);
          font-size: 1rem;
          line-height: 1.7;
          opacity: 0.98;
          font-style: italic;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .story-date {
          font-family: var(--font-crimson);
          font-size: 0.875rem;
          opacity: 0.9;
          font-style: italic;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
        }

        .story-date::before {
          content: '📅';
          margin-right: 0.5rem;
          font-size: 0.875rem;
        }

        /* Mobile adjustments for overlay content */
        @media (max-width: 639px) {
          .story-overlay {
            padding: 0.75rem;
          }

          .day-badge {
            padding: 0.375rem 0.75rem;
            font-size: 0.75rem;
          }

          .story-title {
            font-size: 1rem;
          }

          .story-description {
            font-size: 0.8125rem;
            -webkit-line-clamp: 2; /* Reduce to 2 lines on mobile */
          }

          .story-date {
            font-size: 0.75rem;
          }
        }

        /* Tablet adjustments */
        @media (min-width: 640px) and (max-width: 1023px) {
          .story-title {
            font-size: 1.125rem;
          }

          .story-description {
            font-size: 0.875rem;
          }
        }

        /* Ensure overlay text is readable on all backgrounds */
        .story-content * {
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        }

        /* Smooth transition for all overlay elements */
        .day-badge,
        .story-content > * {
          transition: transform 200ms ease, opacity 200ms ease;
        }

        /* Subtle animation on hover */
        @media (hover: hover) and (pointer: fine) {
          .story-item:hover .day-badge {
            transform: translateY(-2px);
          }

          .story-item:hover .story-content > * {
            transform: translateY(-2px);
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
