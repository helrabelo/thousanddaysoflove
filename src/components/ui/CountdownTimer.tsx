'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCountdown, getCountdownMessage } from '@/lib/utils/wedding'
import { CardAccent } from '@/components/ui/BotanicalDecorations'

interface CountdownTimerProps {
  className?: string
}

export default function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown())

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  if (countdown.hasWeddingPassed) {
    return (
      <motion.div
        className={`text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="mb-6"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '600',
            color: 'var(--primary-text)',
            letterSpacing: '0.05em'
          }}
        >
          Recém Casados!
        </div>
        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '1.25rem',
            lineHeight: '1.8',
            color: 'var(--secondary-text)',
            fontStyle: 'italic'
          }}
        >
          Nossos mil dias de amor levaram a este momento
        </p>
      </motion.div>
    )
  }

  if (countdown.isWeddingDay) {
    return (
      <motion.div
        className={`text-center ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="mb-6"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: '600',
            color: 'var(--primary-text)',
            letterSpacing: '0.05em'
          }}
        >
          Hoje é o Dia!
        </div>
        <p
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '1.25rem',
            lineHeight: '1.8',
            color: 'var(--secondary-text)',
            fontStyle: 'italic'
          }}
        >
          Nossos mil dias de amor culminam hoje
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-20">
        {/* Days */}
        <motion.div
          className="relative group"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <CardAccent variant="corner" className="opacity-30" />
          <div
            className="p-10 md:p-16 text-center rounded-lg transition-all duration-300 group-hover:shadow-[0_8px_24px_var(--shadow-medium)]"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px var(--shadow-subtle)',
              minWidth: '140px'
            }}
          >
            <div
              className="text-5xl md:text-7xl font-light mb-4"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.05em',
                fontWeight: '300'
              }}
            >
              {countdown.days}
            </div>
            <div
              className="text-sm md:text-lg"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--secondary-text)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: '500'
              }}
            >
              {countdown.days === 1 ? 'Dia' : 'Dias'}
            </div>
          </div>
        </motion.div>

        {/* Elegant Botanical Separator */}
        <div className="hidden md:flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="var(--decorative)" strokeWidth="1" fill="none" opacity="0.6">
              <circle cx="20" cy="20" r="8" />
              <circle cx="20" cy="20" r="3" fill="var(--decorative)" opacity="0.3" />
              <path d="M12 20 Q16 16 20 20 Q24 24 28 20" strokeLinecap="round" />
              <path d="M20 12 Q16 16 20 20 Q24 16 20 12" strokeLinecap="round" opacity="0.5" />
            </g>
          </svg>
        </div>

        {/* Hours */}
        <motion.div
          className="relative group"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <CardAccent variant="corner" className="opacity-30" />
          <div
            className="p-10 md:p-16 text-center rounded-lg transition-all duration-300 group-hover:shadow-[0_8px_24px_var(--shadow-medium)]"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px var(--shadow-subtle)',
              minWidth: '140px'
            }}
          >
            <div
              className="text-5xl md:text-7xl font-light mb-4"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.05em',
                fontWeight: '300'
              }}
            >
              {countdown.hours}
            </div>
            <div
              className="text-sm md:text-lg"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--secondary-text)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: '500'
              }}
            >
              {countdown.hours === 1 ? 'Hora' : 'Horas'}
            </div>
          </div>
        </motion.div>

        {/* Elegant Botanical Separator */}
        <div className="hidden md:flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="var(--decorative)" strokeWidth="1" fill="none" opacity="0.6">
              <circle cx="20" cy="20" r="8" />
              <circle cx="20" cy="20" r="3" fill="var(--decorative)" opacity="0.3" />
              <path d="M12 20 Q16 16 20 20 Q24 24 28 20" strokeLinecap="round" />
              <path d="M20 12 Q16 16 20 20 Q24 16 20 12" strokeLinecap="round" opacity="0.5" />
            </g>
          </svg>
        </div>

        {/* Minutes */}
        <motion.div
          className="relative group"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <CardAccent variant="corner" className="opacity-30" />
          <div
            className="p-10 md:p-16 text-center rounded-lg transition-all duration-300 group-hover:shadow-[0_8px_24px_var(--shadow-medium)]"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px var(--shadow-subtle)',
              minWidth: '140px'
            }}
          >
            <div
              className="text-5xl md:text-7xl font-light mb-4"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--primary-text)',
                letterSpacing: '0.05em',
                fontWeight: '300'
              }}
            >
              {countdown.minutes}
            </div>
            <div
              className="text-sm md:text-lg"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--secondary-text)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: '500'
              }}
            >
              {countdown.minutes === 1 ? 'Minuto' : 'Minutos'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Romantic milestone message */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div
          className="mb-4 px-6 py-3 inline-block rounded-full"
          style={{
            background: 'var(--accent)',
            fontFamily: 'var(--font-crimson)',
            fontSize: '1rem',
            color: 'var(--primary-text)',
            fontStyle: 'italic',
            border: '1px solid var(--border-subtle)'
          }}
        >
          {getCountdownMessage(countdown.days)}
        </div>
      </motion.div>

      <motion.p
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: 'clamp(1.125rem, 3vw, 1.375rem)',
          lineHeight: '1.8',
          color: 'var(--secondary-text)',
          fontStyle: 'italic',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        Até que nossos mil dias de amor se tornem para sempre
      </motion.p>
    </motion.div>
  )
}