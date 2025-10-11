'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart } from 'lucide-react'

interface Pet {
  name: string
  emoji: string
  title: string
  personality: string
  fact: string
  image: string
  color: string
}

const pets: Pet[] = [
  {
    name: 'Linda',
    emoji: '👑',
    title: 'A Matriarca',
    personality: 'Autista perfeita, elegante e independente',
    fact: 'Mãe de Olivia e Oliver, dona da casa desde o primeiro dia',
    image: '/images/pets/linda.jpg',
    color: '#D4AF37' // Gold
  },
  {
    name: 'Cacao',
    emoji: '🍫',
    title: 'O Companheiro',
    personality: 'Doce, leal e sempre ao nosso lado',
    fact: 'Chegou para fazer companhia à Linda e conquistou nossos corações',
    image: '/images/pets/cacao.jpg',
    color: '#8B4513' // Brown
  },
  {
    name: 'Olivia',
    emoji: '🌸',
    title: 'A Doce',
    personality: 'Delicada, carinhosa e cheia de amor',
    fact: 'Filhote da Linda que ficou com a gente, puro amor em forma de pet',
    image: '/images/pets/olivia.jpg',
    color: '#FFB6C1' // Pink
  },
  {
    name: 'Oliver',
    emoji: '⚡',
    title: 'O Energético',
    personality: 'Brincalhão, curioso e cheio de energia',
    fact: 'Irmão da Olivia, transforma a casa em parque de diversões',
    image: '/images/pets/oliver.jpg',
    color: '#4169E1' // Blue
  }
]

export default function OurFamilySection() {
  return (
    <section className="py-24 px-6" style={{ background: 'var(--accent)' }}>
      <div className="max-w-7xl mx-auto">
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
            Nossa Família Peluda
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
            Quatro patas, quatro corações. Linda, Cacao, Olivia e Oliver são parte essencial
            da nossa história de amor. Eles transformaram nossa casa em lar.
          </p>
        </motion.div>

        {/* Pet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.name}
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
                    src={pet.image}
                    alt={`${pet.name} ${pet.emoji}`}
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
                    {pet.emoji}
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

                  {/* Title */}
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1rem',
                      color: pet.color,
                      fontStyle: 'italic',
                      fontWeight: '600'
                    }}
                  >
                    {pet.title}
                  </p>

                  {/* Personality */}
                  <p
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '0.9375rem',
                      lineHeight: '1.6',
                      color: 'var(--secondary-text)'
                    }}
                  >
                    {pet.personality}
                  </p>

                  {/* Divider */}
                  <div
                    className="w-12 h-px my-4"
                    style={{ background: 'var(--decorative)', opacity: 0.5 }}
                  />

                  {/* Fun Fact */}
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
                    {pet.fact}
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
          ))}
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
