'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart } from 'lucide-react'

interface Pet {
  _id: string
  name: string
  slug: { current: string }
  photo: {
    asset: { url: string }
    alt?: string
  }
  bio: string
  role?: string
  breed?: string
  adoptionDate?: string
  displayOrder: number
}

interface OurFamilyData {
  sectionTitle?: string
  sectionDescription?: string
  pets?: Pet[]
}

interface OurFamilySectionProps {
  data?: OurFamilyData
}

// Default emoji based on pet name (for fallback)
const getDefaultEmoji = (name: string) => {
  const nameMap: Record<string, string> = {
    linda: '👑',
    cacao: '🍫',
    olivia: '🌸',
    oliver: '⚡'
  }
  return nameMap[name.toLowerCase()] || '🐾'
}

// Extract emoji from role/bio if it exists
const extractEmoji = (text?: string, fallbackName?: string) => {
  if (!text) return getDefaultEmoji(fallbackName || '')
  const emojiMatch = text.match(/([\u{1F300}-\u{1F9FF}])/u)
  return emojiMatch ? emojiMatch[0] : getDefaultEmoji(fallbackName || '')
}

// Helper to assign colors
const getColorForPet = (index: number) => {
  const colors = ['#D4AF37', '#8B4513', '#FFB6C1', '#4169E1', '#9370DB', '#20B2AA']
  return colors[index % colors.length]
}

export default function OurFamilySection({ data }: OurFamilySectionProps) {
  // Extract values with fallbacks
  const sectionTitle = data?.sectionTitle || 'Nossa Família Peluda'
  const sectionDescription = data?.sectionDescription || 'Quatro patas, quatro corações. Linda, Cacao, Olivia e Oliver são parte essencial da nossa história de amor. Eles transformaram nossa casa em lar.'
  const pets = data?.pets || []

  // If no pets data, don't render the section
  if (pets.length === 0) {
    return null
  }

  return (
    <section className="min-h-screen md:h-screen flex items-center py-16 md:py-0 px-6" style={{ background: 'var(--accent)' }}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8"
            style={{
              background: 'var(--decorative)',
              opacity: 0.9
            }}
          >
            <Heart className="w-8 h-8" style={{ color: 'var(--white-soft)' }} fill="currentColor" />
          </div>

          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.1em',
              lineHeight: '1.2'
            }}
          >
            {sectionTitle}
          </h2>

          <div
            className="w-24 h-px mx-auto mb-8"
            style={{ background: 'var(--decorative)' }}
          />

          <p
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            {sectionDescription}
          </p>
        </motion.div>

        {/* Pet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pets.map((pet, index) => {
            const emoji = extractEmoji(pet.role, pet.name)
            const title = pet.role?.replace(/[\u{1F300}-\u{1F9FF}]/ug, '').trim() || pet.breed || ''
            const color = getColorForPet(index)

            return (
              <motion.div
                key={pet._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div
                  className="relative overflow-hidden rounded-2xl transition-all duration-500"
                  style={{
                    background: 'var(--white-soft)',
                    boxShadow: '0 4px 20px var(--shadow-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 12px 40px var(--shadow-medium)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)'
                  }}
                >
                  {/* Pet Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={pet.photo.asset.url}
                      alt={pet.photo.alt || `${pet.name} ${emoji}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Emoji Badge */}
                    <div
                      className="absolute top-4 right-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm"
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid rgba(168, 168, 168, 0.3)'
                      }}
                    >
                      {emoji}
                    </div>
                  </div>

                  {/* Pet Info */}
                  <div className="p-6">
                    {/* Name */}
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1.75rem',
                        fontWeight: '600',
                        color: 'var(--primary-text)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {pet.name}
                    </h3>

                    {/* Title/Role */}
                    {title && (
                      <p
                        className="mb-3"
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          fontSize: '1rem',
                          color,
                          fontStyle: 'italic',
                          fontWeight: '600'
                        }}
                      >
                        {title}
                      </p>
                    )}

                    {/* Divider */}
                    <div
                      className="w-12 h-px my-4"
                      style={{ background: 'var(--decorative)', opacity: 0.5 }}
                    />

                    {/* Bio */}
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '0.875rem',
                        lineHeight: '1.6',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                      }}
                    >
                      {pet.bio}
                    </p>
                  </div>

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(44, 44, 44, 0.7), transparent 60%)'
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer Message */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p
            className="max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            De 2 pets para 4, nossa família cresceu junto com nosso amor.
            No dia do casamento, eles estarão em nossos corações, como sempre estiveram
            em cada momento desses mil dias.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
