'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import BotanicalCorners from '../ui/BotanicalCorners'

export default function ElegantInvitation({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mb-8 rounded-2xl overflow-hidden shadow-2xl relative bg-white"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}
      >

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8"
        >
          {/* Botanical corner decorations */}
          <BotanicalCorners pattern="diagonal-right" opacity={0.15} />

          {/* Main invitation content */}
          <div className="text-center max-w-lg space-y-3 sm:space-y-4 md:space-y-6">
            {/* Date/Time - Card Title Style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="my-3 sm:my-5 md:my-8"
            >
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(0.6875rem, 2vw, 1.125rem)',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  textTransform: 'uppercase',
                  letterSpacing: 'clamp(0.05em, 1vw, 0.15em)',
                  marginBottom: '0.25rem',
                }}
              >
                Quinta-feira, 20 de Novembro 2025
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                  fontWeight: '600',
                  color: 'var(--primary-text)',
                  letterSpacing: 'clamp(0.1em, 1.5vw, 0.2em)',
                }}
              >
                11H.00
              </div>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-2 sm:mb-4 md:mb-6 flex justify-center"
            >
              <Image
                src="/hy-logo.svg"
                alt="H & Y"
                width={140}
                height={48}
                className="h-auto"
                style={{
                  width: 'clamp(80px, 18vw, 140px)',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
                }}
                priority
              />
            </motion.div>


            {/* Address & Venue - Card Description Style */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="space-y-1 sm:space-y-2 px-2"
            >
              <p
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(0.6875rem, 2vw, 0.875rem)',
                  color: 'var(--secondary-text)',
                  lineHeight: '1.4',
                }}
              >
                <span style={{ fontWeight: '600' }}>Rua:</span> Coronel Francisco Flávio Carneiro 200
                <br />
                Luciano Cavalcante
              </p>
              <p
                className="hidden sm:block"
                style={{
                  fontFamily: 'var(--font-crimson)',
                  fontSize: 'clamp(0.6875rem, 2vw, 0.875rem)',
                  color: 'var(--secondary-text)',
                  lineHeight: '1.4',
                }}
              >
                <span style={{ fontWeight: '600' }}>Local:</span> Nosso Salão de Festas.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8"
    >
      {/* Botanical corner decorations */}
      <BotanicalCorners pattern="diagonal-right" opacity={0.15} />

      {/* Main invitation content */}
      <div className="text-center max-w-xl space-y-3 sm:space-y-4 md:space-y-6 h-full max-h-[80%] flex flex-col justify-center gap-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-2 sm:mb-4 md:mb-6 flex justify-center"
        >
          <Image
            src="/hy-logo.svg"
            alt="H & Y"
            width={140}
            height={48}
            className="h-auto"
            style={{
              width: 'clamp(80px, 18vw, 140px)',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))',
            }}
            priority
          />
        </motion.div>

        {/* Names - Title Style */}
        {/* <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '600',
            color: 'var(--primary-text)',
            letterSpacing: '-0.02em',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
          }}
        >
          HEL & YLANA
        </motion.h3> */}

        {/* Invitation text - Subtitle Style */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="px-2"
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: 'clamp(0.8125rem, 2.5vw, 1rem)',
            color: 'var(--secondary-text)',
            lineHeight: '1.5',
            marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)',
          }}
        >
          Convidamos você para testemunhar nosso dia mais especial.
          {' '}
          Celebramos nosso <strong style={{ fontWeight: '600' }}>milésimo</strong> dia juntos
          {' '}
          transformando nossa certeza em compromisso.
        </motion.p>

        {/* Date/Time - Card Title Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="my-3 sm:my-5 md:my-8"
        >
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(0.6875rem, 2vw, 1.125rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              textTransform: 'uppercase',
              letterSpacing: 'clamp(0.05em, 1vw, 0.15em)',
              marginBottom: '0.25rem',
            }}
          >
            Quinta-feira, 20 de Novembro 2025
          </div>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: 'clamp(0.1em, 1.5vw, 0.2em)',
            }}
          >
            11H.00
          </div>
        </motion.div>

        {/* Address & Venue - Card Description Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="space-y-1 sm:space-y-2 px-2"
        >
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(0.6875rem, 2vw, 0.875rem)',
              color: 'var(--secondary-text)',
              lineHeight: '1.4',
            }}
          >
            <span style={{ fontWeight: '600' }}>Rua:</span> Coronel Francisco Flávio Carneiro 200
            <br />
            Luciano Cavalcante
          </p>
          <p
            className="hidden sm:block"
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: 'clamp(0.6875rem, 2vw, 0.875rem)',
              color: 'var(--secondary-text)',
              lineHeight: '1.4',
            }}
          >
            <span style={{ fontWeight: '600' }}>Local:</span> Nosso Salão de Festas, onde celebraremos juntos este dia inesquecível.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
