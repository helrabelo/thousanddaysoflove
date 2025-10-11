'use client'

import { motion } from 'framer-motion'
import { SectionDivider } from '@/components/ui/BotanicalDecorations'

interface TimelinePhaseHeaderProps {
  /** Phase title (e.g., "Os Primeiros Dias") */
  title: string
  /** Day range (e.g., "Dia 1 - 100") */
  dayRange: string
  /** Optional subtitle or description */
  subtitle?: string
}

export default function TimelinePhaseHeader({
  title,
  dayRange,
  subtitle,
}: TimelinePhaseHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-24 text-center"
      style={{ background: 'var(--background)' }}
    >
      <div className="max-w-4xl mx-auto px-8 sm:px-12 lg:px-16">
        {/* Day Range Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="inline-block mb-6 px-6 py-2 rounded-full"
          style={{
            background: 'var(--accent)',
            border: '1px solid var(--decorative)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: 'var(--decorative)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {dayRange}
          </span>
        </motion.div>

        {/* Phase Title */}
        <h2
          className="mb-6"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            color: 'var(--primary-text)',
            letterSpacing: '0.05em',
            lineHeight: '1.2',
          }}
        >
          {title}
        </h2>

        {/* Optional Subtitle */}
        {subtitle && (
          <p
            className="mb-8"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              lineHeight: '1.8',
              color: 'var(--secondary-text)',
              fontStyle: 'italic',
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Decorative Divider */}
        <SectionDivider className="mt-8" />
      </div>
    </motion.div>
  )
}
