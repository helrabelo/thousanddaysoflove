'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCountdown, getCountdownMessage, getCountdownEasterEgg, getSpecialMoments } from '@/lib/utils/wedding'
import { CardAccent } from '@/components/ui/BotanicalDecorations'

interface CountdownTimerProps {
  className?: string
}

export default function CountdownTimer({ className = '' }: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown())
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')
  const specialMoments = getSpecialMoments()

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
          Nossos Mil Dias Viraram Para Sempre!
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
          Do primeiro 'oi' no WhatsApp ao altar - que jornada incrível! 💕
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
          Hoje é o Grande Dia no Constable Galerie!
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
          Onde a arte encontra o amor e nossos mil dias viram eternidade ✨
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
      <div
        className="cursor-pointer love-cursor transition-all duration-300 hover:scale-105"
        onClick={() => {
          setEasterEggMessage(getCountdownEasterEgg())
          setShowEasterEgg(true)
          setTimeout(() => setShowEasterEgg(false), 4000)
        }}
        title="Clique para revelar um momento especial da nossa história"
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
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-romantic-pulse">
                  💖
                </div>
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

        {/* Romantic floating hearts */}
        <div className="hidden md:flex items-center justify-center relative">
          <motion.div
            className="absolute text-2xl"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💕
          </motion.div>
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
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-romantic-pulse">
                  🕐
                </div>
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

        {/* Romantic floating sparkles */}
        <div className="hidden md:flex items-center justify-center relative">
          <motion.div
            className="absolute text-2xl"
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            ✨
          </motion.div>
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
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-romantic-pulse">
                  ⏰
                </div>
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

      </div>

      {/* Easter Egg Modal */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(44, 44, 44, 0.8)' }}
          >
            <div
              className="max-w-md p-8 rounded-2xl text-center relative animate-gentle-bounce"
              style={{
                background: 'var(--white-soft)',
                border: '2px solid var(--decorative)',
                boxShadow: '0 20px 40px var(--shadow-medium)'
              }}
            >
              <div className="text-4xl mb-4 animate-love-sparkle">
                💕
              </div>
              <p
                className="text-lg mb-6"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  color: 'var(--primary-text)',
                  fontStyle: 'italic',
                  lineHeight: '1.6'
                }}
              >
                {easterEggMessage}
              </p>
              <button
                onClick={() => setShowEasterEgg(false)}
                className="px-6 py-2 rounded-full transition-all duration-200 text-sm"
                style={{
                  background: 'var(--decorative)',
                  color: 'var(--white-soft)',
                  fontFamily: 'var(--font-playfair)'
                }}
              >
                ✨ Continuar sonhando ✨
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="mt-8 text-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p
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
        </p>

        {/* Filosofia do casal */}
        <div className="mt-6 opacity-80">
          <p
            className="text-sm italic"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--text-muted)'
            }}
          >
            "{specialMoments.couplePhilosophy}"
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}