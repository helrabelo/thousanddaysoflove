'use client'

import { motion } from 'framer-motion'
import { petsPersonalities } from '@/lib/utils/wedding'
import { useState } from 'react'

interface PetsFamilyProps {
  className?: string
  variant?: 'full' | 'compact'
}

export default function PetsFamily({ className = '', variant = 'full' }: PetsFamilyProps) {
  const [clickedPet, setClickedPet] = useState<string | null>(null)
  const pets = Object.values(petsPersonalities)

  const handlePetClick = (petKey: string) => {
    setClickedPet(petKey)
    setTimeout(() => setClickedPet(null), 3000)
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-center gap-4 ${className}`}>
        {pets.map((pet, index) => (
          <motion.div
            key={pet.name}
            className="cursor-pointer love-cursor"
            whileHover={{ scale: 1.2, y: -5 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: clickedPet === pet.name.toLowerCase() ? 1.3 : 1,
              y: clickedPet === pet.name.toLowerCase() ? -8 : 0
            }}
            onClick={() => handlePetClick(pet.name.toLowerCase())}
            title={pet.story}
          >
            <span className="text-2xl animate-gentle-bounce" style={{ animationDelay: `${index * 0.5}s` }}>
              {pet.emoji}
            </span>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <section className={`py-16 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-playfair)',
              color: 'var(--primary-text)'
            }}
          >
            Nossa Família de 4 Patinhas
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              lineHeight: '1.8'
            }}
          >
            Linda, Cacao, Olivia e Oliver completam nossa casa de caseiros apaixonados
          </p>
        </motion.div>

        {/* Pets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((pet, index) => (
            <motion.div
              key={pet.name}
              className="group cursor-pointer love-cursor"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
              onClick={() => handlePetClick(pet.name.toLowerCase())}
            >
              <div
                className="rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
                style={{
                  background: 'var(--white-soft)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 4px 20px var(--shadow-subtle)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px var(--shadow-medium)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)'
                }}
              >
                {/* Pet Emoji */}
                <div className="text-6xl mb-4 animate-gentle-bounce" style={{ animationDelay: `${index * 0.3}s` }}>
                  {pet.emoji}
                </div>

                {/* Pet Info */}
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    color: 'var(--primary-text)'
                  }}
                >
                  {pet.name}
                </h3>

                <p
                  className="text-sm mb-3"
                  style={{
                    color: 'var(--secondary-text)',
                    fontFamily: 'var(--font-crimson)',
                    fontStyle: 'italic'
                  }}
                >
                  {pet.description}
                </p>

                <div
                  className="text-xs px-3 py-1 rounded-full inline-block"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--decorative)',
                    fontFamily: 'var(--font-crimson)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {pet.speciality}
                </div>

                {/* Hover story */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-4">
                  <p
                    className="text-xs"
                    style={{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic'
                    }}
                  >
                    {pet.story}
                  </p>
                </div>

                {/* Click animation overlay */}
                {clickedPet === pet.name.toLowerCase() && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{
                      background: 'rgba(168, 168, 168, 0.1)',
                      borderRadius: '1rem'
                    }}
                  >
                    <div
                      className="text-center p-4"
                      style={{
                        background: 'var(--white-soft)',
                        borderRadius: '1rem',
                        border: '2px solid var(--decorative)',
                        boxShadow: '0 8px 24px var(--shadow-medium)'
                      }}
                    >
                      <div className="text-3xl mb-2 animate-love-sparkle">
                        {pet.emoji}
                      </div>
                      <p
                        className="text-sm"
                        style={{
                          color: 'var(--primary-text)',
                          fontFamily: 'var(--font-crimson)',
                          fontStyle: 'italic'
                        }}
                      >
                        {pet.story}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fun footer */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p
            className="text-sm italic"
            style={{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-crimson)'
            }}
          >
            "Cada patinha ensina sobre amor incondicional" 🐾💕
          </p>
        </motion.div>
      </div>
    </section>
  )
}
