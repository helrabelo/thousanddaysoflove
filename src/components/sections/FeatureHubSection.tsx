// @ts-nocheck: feature hub animations await framer-motion variant typing clean-up
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, Gift, Heart, Image } from 'lucide-react'

interface FeatureCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  gradient: string
  badge?: string
  badgeType?: 'urgent' | 'new'
}

const features: FeatureCard[] = [
  {
    title: 'Nossa História',
    description: 'Do "oi" ao altar - Nossa jornada de mil dias de amor',
    href: '/historia',
    icon: <Heart className="w-8 h-8" />,
    gradient: '',
  },
  {
    title: 'Galeria',
    description: '1000 dias em fotos - Momentos especiais capturados',
    href: '/galeria',
    icon: <Image className="w-8 h-8" />,
    gradient: '',
  },
  {
    title: 'Confirmação',
    description: 'Confirme sua presença - Colabore com o TOC da Ylana!',
    href: '/rsvp',
    icon: <Calendar className="w-8 h-8" />,
    gradient: '',
    badge: 'Urgente',
    badgeType: 'urgent',
  },
  {
    title: 'Lista de Presentes',
    description: 'Ajude a realizar nossos sonhos - Bora coçar os bolsos!',
    href: '/presentes',
    icon: <Gift className="w-8 h-8" />,
    gradient: '',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function FeatureHubSection() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--white-soft)]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '-0.02em',
            }}
          >
            Explore Nosso Casamento
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              color: 'var(--secondary-text)',
              lineHeight: '1.6',
            }}
          >
            Tudo que você precisa para celebrar conosco - RSVP, presentes, fotos e
            nossa história
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Link href={feature.href} className="block group">
                <motion.div
                  className="relative h-full p-8 md:p-10 rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badge */}
                  {feature.badge && (
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        fontFamily: 'var(--font-crimson)',
                        background:
                          feature.badgeType === 'urgent'
                            ? 'var(--primary-text)'
                            : 'var(--decorative)',
                        color: 'var(--white-soft)',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                      animate={
                        feature.badgeType === 'urgent'
                          ? { scale: [1, 1.05, 1] }
                          : {}
                      }
                      transition={
                        feature.badgeType === 'urgent'
                          ? { repeat: Infinity, duration: 2 }
                          : {}
                      }
                    >
                      {feature.badge}
                    </motion.div>
                  )}

                  {/* Icon */}
                  <motion.div
                    className="mb-6"
                    style={{ color: 'var(--primary-text)' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Content */}
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                      fontWeight: '600',
                      color: 'var(--primary-text)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontSize: '1rem',
                      color: 'var(--secondary-text)',
                      lineHeight: '1.6',
                    }}
                  >
                    {feature.description}
                  </p>

                  {/* Arrow with hover animation */}
                  <motion.div
                    className="flex items-center gap-2"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      fontStyle: 'italic',
                      fontSize: '0.875rem',
                      color: 'var(--primary-text)',
                      fontWeight: '600',
                    }}
                  >
                    <span>Explorar</span>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                      }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
