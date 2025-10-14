'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import BotanicalCorners from '../ui/BotanicalCorners'

export default function ElegantInvitation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full h-full flex items-center justify-center p-8"
    >
      {/* Botanical corner decorations */}
      <BotanicalCorners pattern="diagonal-right" opacity={0.15} />

      {/* Main invitation content */}
      <div className="text-center max-w-xl space-y-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <Image
            src="/hy-logo.svg"
            alt="H & Y"
            width={140}
            height={48}
            className="h-auto"
            style={{
              width: 'clamp(100px, 20vw, 140px)',
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

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center justify-center gap-3 my-4 mt-16"
        >
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'var(--decorative)',
            }}
          />
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--decorative)',
            }}
          />
          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'var(--decorative)',
            }}
          />
        </motion.div>

        {/* Invitation text - Subtitle Style */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-crimson)',
            fontSize: '1rem',
            color: 'var(--secondary-text)',
            lineHeight: '1.7',
            marginBottom: '1.5rem',
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
          className="my-8"
        >
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--primary-text)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '0.25rem',
            }}
          >
            Quinta-feira, 20 de Novembro 2025
          </div>
          <div
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--primary-text)',
              letterSpacing: '0.2em',
            }}
          >
            11H.00
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex items-center justify-center gap-3 my-4"
        >
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'var(--decorative)',
            }}
          />
          <div
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'var(--decorative)',
            }}
          />
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'var(--decorative)',
            }}
          />
        </motion.div>

        {/* Address & Venue - Card Description Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="space-y-2"
        >
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: '0.875rem',
              color: 'var(--secondary-text)',
              lineHeight: '1.5',
            }}
          >
            <span style={{ fontWeight: '600' }}>Rua:</span> Coronel Francisco Flávio Carneiro 200
            <br />
            Luciano Cavalcante
          </p>
          <p
            style={{
              fontFamily: 'var(--font-crimson)',
              fontSize: '0.875rem',
              color: 'var(--secondary-text)',
              lineHeight: '1.5',
            }}
          >
            <span style={{ fontWeight: '600' }}>Local:</span> Nosso Salão de Festas, onde celebraremos juntos este dia inesquecível.
          </p>
        </motion.div>

        {/* Bottom floral decoration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-8 flex justify-center"
        >
          <svg width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 10 Q15 5, 20 10 T30 10"
              stroke="var(--decorative)"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="40" cy="10" r="2" fill="var(--decorative)" opacity="0.6" />
            <path
              d="M50 10 Q55 5, 60 10 T70 10"
              stroke="var(--decorative)"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
