'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { getRandomLoadingMessage } from '@/lib/utils/whimsy'
import { petsPersonalities } from '@/lib/utils/wedding'
import HYBadge from './HYBadge'

interface DelightfulLoaderProps {
  category?: 'rsvp' | 'gifts' | 'gallery' | 'payment' | 'timeline'
  message?: string
  withPets?: boolean
}

export function DelightfulLoader({ category = 'rsvp', message, withPets = true }: DelightfulLoaderProps) {
  const displayMessage = message || getRandomLoadingMessage(category)
  const pets = Object.values(petsPersonalities)

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated loader */}
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Outer ring */}
        <motion.div
          className="w-20 h-20 rounded-full border-4 border-t-transparent"
          style={{
            borderColor: 'var(--decorative)',
            borderTopColor: 'transparent'
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Inner HY logo */}
        <HYBadge />
      </motion.div>

      {/* Loading message */}
      <motion.p
        className="text-center mb-6 max-w-md px-4"
        style={{
          fontFamily: 'var(--font-crimson)',
          fontSize: '1.125rem',
          color: 'var(--secondary-text)',
          fontStyle: 'italic',
          lineHeight: '1.6'
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {displayMessage}
      </motion.p>

      {/* Pets animation */}
      {withPets && (
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {pets.map((pet, index) => (
            <motion.div
              key={pet.name}
              className="text-2xl"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.15,
                ease: "easeInOut"
              }}
            >
              {pet.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Progress dots */}
      <motion.div
        className="flex items-center gap-2 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--decorative)' }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Mini loader for inline use
export function MiniLoader({ size = 20, color = 'var(--decorative)' }: { size?: number; color?: string }) {
  return (
    <motion.div
      className="inline-block rounded-full border-2 border-t-transparent"
      style={{
        width: size,
        height: size,
        borderColor: color,
        borderTopColor: 'transparent'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

// Skeleton loader with personality
interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'image' | 'gift'
  count?: number
}

export function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'gift':
        return (
          <div
            className="rounded-2xl p-6 space-y-4 animate-pulse"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div className="w-full h-48 rounded-lg" style={{ background: 'var(--accent)' }} />
            <div className="space-y-2">
              <div className="h-6 rounded" style={{ background: 'var(--accent)', width: '70%' }} />
              <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '90%' }} />
              <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '60%' }} />
            </div>
            <div className="h-10 rounded-lg" style={{ background: 'var(--accent)' }} />
          </div>
        )

      case 'image':
        return (
          <div
            className="w-full h-64 rounded-lg animate-pulse"
            style={{ background: 'var(--accent)' }}
          />
        )

      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '100%' }} />
            <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '85%' }} />
            <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '60%' }} />
          </div>
        )

      default:
        return (
          <div
            className="rounded-2xl p-6 space-y-4 animate-pulse"
            style={{
              background: 'var(--white-soft)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div className="h-6 rounded" style={{ background: 'var(--accent)', width: '60%' }} />
            <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '90%' }} />
            <div className="h-4 rounded" style={{ background: 'var(--accent)', width: '75%' }} />
          </div>
        )
    }
  }

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  )
}
