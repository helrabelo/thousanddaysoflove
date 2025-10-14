'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AnimatedTitleProps {
  className?: string
  delay?: number
}

export default function AnimatedTitle({ className = '', delay = 2 }: AnimatedTitleProps) {
  const [currentState, setCurrentState] = useState<'initial' | 'transforming' | 'final'>('initial')

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentState('transforming')

      // After transformation animation completes, set to final state
      setTimeout(() => {
        setCurrentState('final')
      }, 2000) // Duration of transformation animation
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  const containerVariants = {
    initial: { opacity: 1 },
    transforming: { opacity: 1 },
    final: { opacity: 1 }
  }

  const characterVariants = {
    initial: () => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      color: '#fef7f7' // rose-50
    }),
    transforming: (custom: string) => ({
      opacity: [1, 0, 1],
      scale: [1, 1.2, 1],
      rotateY: [0, 180, 360],
      color: custom === 'heart' ? '#f43f5e' : '#fef7f7', // rose-500 for heart, rose-50 for others
      transition: {
        duration: 0.8,
        ease: [0.42, 0, 0.58, 1], // easeInOut as cubic bezier
        times: [0, 0.5, 1]
      }
    }),
    final: (custom: string) => ({
      opacity: 1,
      scale: 1,
      rotateY: 0,
      color: custom === 'heart' ? '#f43f5e' : '#fef7f7'
    })
  }

  const getDisplayText = () => {
    switch (currentState) {
      case 'initial':
        return ['1', '0', '0', '0']
      case 'transforming':
        return ['H', '♥', '♥', 'Y'] // Intermediate state during animation
      case 'final':
        return ['H', '♥', 'Y'] // Final state with only 3 characters
    }
  }

  const getCustomType = (index: number) => {
    if (currentState === 'final') {
      return index === 1 ? 'heart' : 'letter'
    }
    return currentState === 'transforming' && (index === 1 || index === 2) ? 'heart' : 'letter'
  }

  return (
    <motion.div
      className={`inline-flex ${className}`}
      variants={containerVariants}
      initial="initial"
      animate={currentState}
    >
      <AnimatePresence mode="wait">
        {getDisplayText().map((char, index) => (
          <motion.span
            key={`${currentState}-${index}`}
            custom={getCustomType(index)}
            variants={characterVariants as any}
            initial="initial"
            animate={currentState}
            className="inline-block text-center font-bold tracking-wider"
            style={{
              fontSize: 'inherit',
              lineHeight: 'inherit',
              minWidth: char === '♥' ? '1.2em' : '0.8em'
            }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Magical sparkle effects during transformation */}
      {currentState === 'transforming' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-300 text-lg"
              initial={{
                opacity: 0,
                scale: 0,
                x: Math.random() * 200 - 100,
                y: Math.random() * 100 - 50
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
