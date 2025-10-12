'use client'

import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'
import Link from 'next/link'
import Image from 'next/image'

interface StoryCard {
  _id: string
  title: string
  description: string
  dayNumber?: number
  displayOrder: number
  image?: {
    asset: {
      url: string
    }
    alt?: string
  }
}

interface StoryPreviewProps {
  data?: {
    sectionTitle?: string
    sectionDescription?: string
    storyCards?: StoryCard[]
    ctaButton?: {
      label?: string
      href?: string
    }
  }
}

export default function StoryPreview({ data }: StoryPreviewProps) {
  // Extract values with fallbacks
  const sectionTitle = data?.sectionTitle || 'Nossa História'
  const sectionDescription = data?.sectionDescription || 'Uma jornada de amor e companheirismo'
  const cards = data?.storyCards || []
  const ctaText = data?.ctaButton?.label || 'Conheça Nossa História Completa'
  const ctaLink = data?.ctaButton?.href || '/nossa-historia'

  // Show placeholder photo if no story cards have images
  const hasPhotoInCards = cards.some(card => card.image?.asset?.url)
  const placeholderPhoto = !hasPhotoInCards

  return (
    <section className="py-32" style={{ background: 'var(--accent)' }}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Split Layout: Image Left, Content Right */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Column - Sticky Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32 relative"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              {!placeholderPhoto && cards[0]?.image?.asset?.url ? (
                <Image
                  src={cards[0].image.asset.url}
                  alt={cards[0].image.alt || 'Story photo'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                // Placeholder for story photo
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--decorative) 0%, var(--accent) 100%)',
                  }}
                >
                  <div className="text-center p-8">
                    <Heart
                      className="w-16 h-16 mx-auto mb-4"
                      style={{
                        color: 'var(--white-soft)',
                        strokeWidth: 1,
                      }}
                    />
                    <p
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1.125rem',
                        color: 'var(--white-soft)',
                        fontStyle: 'italic',
                        opacity: 0.9,
                      }}
                    >
                      [Foto da História]
                    </p>
                  </div>
                </div>
              )}

              {/* Decorative border overlay */}
              <div
                className="absolute inset-0 border-8 rounded-lg pointer-events-none"
                style={{
                  borderColor: 'var(--white-soft)',
                  opacity: 0.1,
                }}
              />
            </div>

            {/* Caption below image */}
            {cards[0]?.image?.alt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-6 text-center"
              >
                <p
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    fontSize: '1rem',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                    lineHeight: '1.6',
                  }}
                >
                  {cards[0].image.alt}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Story Content */}
          <div className="space-y-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className="mb-6"
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
                className="mb-8"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  lineHeight: '1.8',
                  color: 'var(--secondary-text)',
                  fontStyle: 'italic',
                }}
              >
                {sectionDescription}
              </p>
              <SectionDivider className="my-8" />
            </motion.div>

            {/* Story Moments */}
            {cards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                {cards.map((card, index) => (
                  <div
                    key={card._id}
                    className="relative pl-8 border-l-2"
                    style={{ borderColor: 'var(--decorative)' }}
                  >
                    <div
                      className="absolute -left-3 top-0 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        background: 'var(--decorative)',
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'var(--white-soft)' }}
                      />
                    </div>
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1.5rem',
                        fontWeight: '500',
                        color: 'var(--primary-text)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '1.125rem',
                        lineHeight: '1.8',
                        color: 'var(--secondary-text)',
                        fontStyle: 'italic',
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <Button variant="wedding" size="lg" asChild className="group">
                <Link href={ctaLink} className="flex items-center gap-2">
                  {ctaText}
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    style={{ strokeWidth: 2 }}
                  />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
