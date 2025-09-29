'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Heart, Home, Baby, Calendar } from 'lucide-react'

interface Milestone {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  count: number
  color: string
}

const milestones: Milestone[] = [
  {
    id: 'days',
    icon: <Calendar className="w-6 h-6" />,
    title: '1000',
    subtitle: 'Dias de Amor',
    count: 1000,
    color: 'var(--primary-text)'
  },
  {
    id: 'moments',
    icon: <Heart className="w-6 h-6" />,
    title: '8',
    subtitle: 'Marcos Especiais',
    count: 8,
    color: 'var(--decorative)'
  },
  {
    id: 'home',
    icon: <Home className="w-6 h-6" />,
    title: '1',
    subtitle: 'Casa dos Sonhos',
    count: 1,
    color: 'var(--decorative)'
  },
  {
    id: 'pets',
    icon: <Baby className="w-6 h-6" />,
    title: '4',
    subtitle: 'Pets na Família',
    count: 4,
    color: 'var(--decorative)'
  }
]

interface CounterProps {
  milestone: Milestone
  delay: number
}

function AnimatedCounter({ milestone, delay }: CounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      const duration = milestone.count > 100 ? 2000 : 1000
      const steps = Math.max(20, Math.min(100, milestone.count))
      const increment = milestone.count / steps
      const stepDuration = duration / steps

      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= milestone.count) {
          current = milestone.count
          clearInterval(interval)
        }
        setCount(Math.floor(current))
      }, stepDuration)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [isVisible, milestone.count, delay])

  return (
    <motion.div
      className="text-center group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: delay / 1000 }
      }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div
        className="rounded-xl p-8 transition-all duration-300"
        style={{
          background: 'var(--white-soft)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 4px 15px var(--shadow-subtle)'
        }}
      >
        {/* Ícone */}
        <motion.div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: milestone.color,
            opacity: 0.9
          }}
          whileHover={{ rotate: 10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div style={{ color: 'var(--white-soft)' }}>
            {milestone.icon}
          </div>
        </motion.div>

        {/* Número Animado */}
        <div
          className="text-5xl font-bold mb-2 font-mono"
          style={{
            color: milestone.color,
            fontFamily: 'var(--font-playfair)',
            letterSpacing: '0.05em'
          }}
        >
          {milestone.count === 1000 ? count.toLocaleString('pt-BR') : count}
        </div>

        {/* Título */}
        <div
          className="text-lg font-medium"
          style={{
            fontFamily: 'var(--font-playfair)',
            color: 'var(--primary-text)',
            letterSpacing: '0.1em'
          }}
        >
          {milestone.subtitle}
        </div>

        {/* Detalhe Emocional baseado no ID */}
        <div
          className="text-sm mt-3 opacity-70 group-hover:opacity-100 transition-opacity"
          style={{
            fontFamily: 'var(--font-crimson)',
            color: 'var(--secondary-text)',
            fontStyle: 'italic'
          }}
        >
          {milestone.id === 'days' && 'Desde o primeiro "oi"'}
          {milestone.id === 'moments' && 'Que definiram nosso amor'}
          {milestone.id === 'home' && 'Sonho da faculdade realizado'}
          {milestone.id === 'pets' && 'Linda, Cacao, Olivia & Oliver'}
        </div>
      </div>
    </motion.div>
  )
}

interface MilestoneCounterProps {
  title?: string
  description?: string
  variant?: 'default' | 'compact'
}

export default function MilestoneCounter({
  title = "Nossa História em Números",
  description = "Cada número conta uma parte especial da nossa jornada de amor",
  variant = 'default'
}: MilestoneCounterProps) {
  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {milestones.map((milestone, index) => (
          <AnimatedCounter
            key={milestone.id}
            milestone={milestone}
            delay={index * 200}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-24" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.05em',
              lineHeight: '1.2'
            }}
          >
            {title}
          </h2>
          <p
            className="max-w-3xl mx-auto"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            {description}
          </p>
        </motion.div>

        {/* Contadores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <AnimatedCounter
              key={milestone.id}
              milestone={milestone}
              delay={index * 300}
            />
          ))}
        </div>

        {/* Call-out Especial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div
            className="inline-block px-8 py-4 rounded-lg"
            style={{
              background: 'var(--accent)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '1.25rem',
                color: 'var(--primary-text)',
                fontWeight: '500',
                letterSpacing: '0.05em'
              }}
            >
              Do primeiro match ao{' '}
              <span style={{ color: 'var(--decorative)' }}>para sempre</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}