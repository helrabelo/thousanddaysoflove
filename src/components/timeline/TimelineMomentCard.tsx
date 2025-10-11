'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ReactNode } from 'react'

interface TimelineMomentCardProps {
  /** Day number in the relationship */
  day: number
  /** Date of the moment */
  date: string
  /** Title of the moment */
  title: string
  /** Description/story of the moment */
  description: string
  /** Background image URL */
  imageUrl: string
  /** Alternative text for image */
  imageAlt: string
  /** Content alignment: 'left' or 'right' */
  contentAlign?: 'left' | 'right'
  /** Optional video URL for background */
  videoUrl?: string
  /** Custom children for more complex layouts */
  children?: ReactNode
}

export default function TimelineMomentCard({
  day,
  date,
  title,
  description,
  imageUrl,
  imageAlt,
  contentAlign = 'left',
  videoUrl,
  children,
}: TimelineMomentCardProps) {
  const isLeft = contentAlign === 'left'

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative w-full overflow-hidden"
      style={{
        height: 'clamp(60vh, 80vh, 900px)',
      }}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster={imageUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        )}
      </div>

      {/* Gradient Overlay - Alternates based on content alignment */}
      <div
        className="absolute inset-0"
        style={{
          background: isLeft
            ? 'linear-gradient(to right, rgba(44, 44, 44, 0.85) 0%, rgba(44, 44, 44, 0.4) 50%, rgba(44, 44, 44, 0) 100%)'
            : 'linear-gradient(to left, rgba(44, 44, 44, 0.85) 0%, rgba(44, 44, 44, 0.4) 50%, rgba(44, 44, 44, 0) 100%)',
        }}
      />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
        <div
          className={`
            h-full flex items-center
            ${isLeft ? 'justify-start' : 'justify-end'}
          `}
        >
          <motion.div
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            {/* Day Badge */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-6 px-6 py-3 rounded-full backdrop-blur-sm"
              style={{
                background: 'rgba(248, 246, 243, 0.15)',
                border: '1px solid rgba(248, 246, 243, 0.3)',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--white-soft)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                <span
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                  }}
                >
                  Dia {day}
                </span>
                <span className="opacity-70">•</span>
                <span className="opacity-90">{date}</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mb-6"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '600',
                color: 'var(--white-soft)',
                letterSpacing: '0.02em',
                lineHeight: '1.2',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              }}
            >
              {title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mb-8"
              style={{
                fontFamily: 'var(--font-crimson)',
                fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
                lineHeight: '1.8',
                color: 'var(--white-soft)',
                fontStyle: 'italic',
                textShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
                maxWidth: '500px',
              }}
            >
              {description}
            </motion.p>

            {/* Custom Children (optional) */}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(to right, transparent 0%, var(--decorative) 50%, transparent 100%)',
          opacity: 0.3,
        }}
      />
    </motion.section>
  )
}
