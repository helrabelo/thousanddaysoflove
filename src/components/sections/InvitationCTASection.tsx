'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, MessageCircle, Radio } from 'lucide-react'
import Image from 'next/image'

const guestFeatures = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Meu Convite',
    description: 'Acesse seu convite personalizado e acompanhe seu progresso',
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: 'Mensagens',
    description: 'Compartilhe fotos, vídeos e mensagens com outros convidados',
  },
  {
    icon: <Radio className="w-5 h-5" />,
    title: 'Ao Vivo',
    description: 'Acompanhe a festa em tempo real no dia do casamento',
  },
]

export default function InvitationCTASection() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--white-soft)] via-[#F5F0ED] to-[var(--white-soft)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              {/* Placeholder for invitation preview image */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #E8B4B8 0%, #D4A5A5 100%)',
                }}
              >
                <div className="text-center p-8">
                  <div
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontSize: 'clamp(3rem, 8vw, 5rem)',
                      fontWeight: '300',
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}
                  >
                    H & Y
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                      color: 'white',
                      letterSpacing: '0.1em',
                    }}
                  >
                    SEU CONVITE PESSOAL
                  </div>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-white opacity-40" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-white opacity-40" />
            </div>

            {/* Floating badge */}
            <motion.div
              className="absolute -top-4 -right-4 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              style={{
                fontFamily: 'var(--font-crimson)',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
              }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              ✨ Personalizado
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-block px-4 py-2 mb-6 rounded-full text-sm font-medium"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontStyle: 'italic',
                background: 'var(--accent)',
                color: 'var(--secondary-text)',
              }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Experiência Exclusiva
            </motion.div>

            {/* Title */}
            <h2
              className="mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: '600',
                color: 'var(--primary-text)',
                letterSpacing: '-0.02em',
                lineHeight: '1.2',
              }}
            >
              Seu Espaço Personalizado
            </h2>

            {/* Description */}
            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                color: 'var(--secondary-text)',
                lineHeight: '1.7',
              }}
            >
              Cada convidado tem acesso a uma experiência única e personalizada. Acesse
              seu convite digital, compartilhe momentos e participe da celebração de
              forma especial.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {guestFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-xl"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                >
                  <div
                    className="flex-shrink-0 p-2 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #E8B4B8, #D4A5A5)',
                      color: 'white',
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1.125rem',
                        fontWeight: '600',
                        color: 'var(--primary-text)',
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        fontSize: '0.875rem',
                        color: 'var(--secondary-text)',
                        lineHeight: '1.5',
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <Link href="/convite" className="inline-block group">
                <motion.div
                  className="flex items-center gap-3 px-8 py-4 rounded-full"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #2C2C2C, #4A4A4A)',
                    color: 'white',
                    letterSpacing: '0.02em',
                    boxShadow: '0 4px 20px rgba(44, 44, 44, 0.3)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(44, 44, 44, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Acessar Meu Convite</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </Link>

              {/* Helper text */}
              <p
                className="mt-4 text-sm"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                }}
              >
                Não tem um código de convite? Entre em contato conosco.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
