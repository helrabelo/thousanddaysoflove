'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { confettiPresets, type ConfettiConfig } from '@/lib/utils/whimsy'

interface ConfettiProps {
  trigger: boolean
  preset?: keyof typeof confettiPresets
  config?: ConfettiConfig
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  delay: number
}

export function Confetti({ trigger, preset = 'rsvpSuccess', config, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      const presetConfig = confettiPresets[preset]
      const finalConfig = { ...presetConfig, ...config }

      const newParticles = Array.from({ length: finalConfig.count || 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: finalConfig.colors?.[Math.floor(Math.random() * finalConfig.colors.length)] || '#F8F6F3',
        delay: Math.random() * 0.3
      }))

      setParticles(newParticles)

      setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, finalConfig.duration || 3000)
    }
  }, [trigger, preset, config, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${particle.x}%`,
              backgroundColor: particle.color,
              opacity: 0.8
            }}
            initial={{
              y: particle.y,
              rotate: 0,
              scale: 0
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: particle.rotation * 3,
              scale: particle.scale,
              opacity: [0.8, 0.8, 0.4, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: particle.delay,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Heart particles for romantic moments
interface HeartParticlesProps {
  trigger: boolean
  count?: number
  onComplete?: () => void
}

export function HeartParticles({ trigger, count = 10, onComplete }: HeartParticlesProps) {
  const [hearts, setHearts] = useState<Particle[]>([])

  useEffect(() => {
    if (trigger) {
      const newHearts = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: 0,
        scale: 0.8 + Math.random() * 0.4,
        color: '#A8A8A8',
        delay: Math.random() * 0.5
      }))

      setHearts(newHearts)

      setTimeout(() => {
        setHearts([])
        onComplete?.()
      }, 3000)
    }
  }, [trigger, count, onComplete])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-2xl"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              opacity: 0.6
            }}
            initial={{
              scale: 0,
              opacity: 0
            }}
            animate={{
              scale: heart.scale,
              opacity: [0, 0.6, 0.6, 0],
              y: -100
            }}
            transition={{
              duration: 2,
              delay: heart.delay,
              ease: "easeOut"
            }}
          >
            💕
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Sparkle effect for special moments
interface SparkleProps {
  trigger: boolean
  position?: { x: number; y: number }
}

export function Sparkles({ trigger, position }: SparkleProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger) {
      setShow(true)
      setTimeout(() => setShow(false), 1000)
    }
  }, [trigger])

  if (!show) return null

  const sparkles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 8,
    distance: 40 + Math.random() * 20
  }))

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute text-xl"
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1
          }}
          animate={{
            x: Math.cos(sparkle.angle * Math.PI / 180) * sparkle.distance,
            y: Math.sin(sparkle.angle * Math.PI / 180) * sparkle.distance,
            scale: [0, 1.2, 0],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  )
}
