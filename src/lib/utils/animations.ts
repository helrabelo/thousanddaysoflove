/**
 * Animation Utilities for Delightful Micro-interactions
 * Elegant wedding-themed animations with reduced motion support
 */

import { Variants } from 'framer-motion'

/**
 * Sparkle animation for celebration moments
 * Subtle and sophisticated for wedding aesthetic
 */
export const sparkleVariants: Variants = {
  initial: { scale: 0, rotate: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 0],
    rotate: [0, 180, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      times: [0, 0.5, 1]
    }
  }
}

/**
 * Gentle shimmer effect for badges and highlights
 */
export const shimmerVariants: Variants = {
  initial: { opacity: 0.8 },
  animate: {
    opacity: [0.8, 1, 0.8],
    boxShadow: [
      '0 2px 8px rgba(168, 168, 168, 0.3)',
      '0 4px 16px rgba(168, 168, 168, 0.5)',
      '0 2px 8px rgba(168, 168, 168, 0.3)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

/**
 * Elegant slide-in animation for new content
 */
export const slideInVariants: Variants = {
  initial: {
    opacity: 0,
    y: -20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 0.5
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
}

/**
 * Gentle pulse animation for live indicators
 */
export const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.15, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

/**
 * Heart reaction animation - bouncy and joyful
 */
export const heartReactionVariants: Variants = {
  initial: { scale: 0, rotate: -15 },
  animate: {
    scale: [0, 1.3, 1],
    rotate: [-15, 5, 0],
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 15
    }
  }
}

/**
 * Milestone celebration animation
 * For special moments like 10th, 50th, 100th post
 */
export const milestoneVariants: Variants = {
  initial: {
    scale: 0,
    rotate: 0,
    opacity: 0
  },
  animate: {
    scale: [0, 1.5, 1],
    rotate: [0, 360, 720],
    opacity: [0, 1, 1],
    transition: {
      duration: 1.2,
      ease: [0.34, 1.56, 0.64, 1], // Elastic easing
      times: [0, 0.6, 1]
    }
  }
}

/**
 * Ken Burns effect for photo slideshow
 * Subtle zoom and pan for elegant transitions
 */
export const kenBurnsVariants: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: 1.1,
    x: [0, -10, 0],
    y: [0, -10, 0],
    transition: {
      duration: 10,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
}

/**
 * Confetti burst positions for milestone celebrations
 * Returns array of confetti pieces with random positions
 */
export function generateConfettiPositions(count: number = 12) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const distance = 60 + Math.random() * 40
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: Math.random() * 360,
      scale: 0.6 + Math.random() * 0.4
    }
  })
}

/**
 * Confetti piece variants
 */
export const confettiVariants: Variants = {
  initial: {
    scale: 0,
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 0
  },
  animate: (custom: { x: number; y: number; rotate: number; scale: number }) => ({
    scale: [0, custom.scale, 0],
    x: [0, custom.x, custom.x],
    y: [0, custom.y, custom.y + 100],
    rotate: [0, custom.rotate, custom.rotate + 180],
    opacity: [0, 1, 0],
    transition: {
      duration: 1.5,
      ease: 'easeOut',
      times: [0, 0.4, 1]
    }
  })
}

/**
 * Stagger animation for lists
 */
export function getStaggerVariants(staggerDelay: number = 0.05): Variants {
  return {
    initial: { opacity: 0, y: 20 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * staggerDelay,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  }
}

/**
 * Hover lift effect for interactive elements
 */
export const hoverLiftVariants: Variants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    }
  }
}

/**
 * Scale bounce on tap
 */
export const tapScaleVariants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
}

/**
 * Milestone detection - returns true for special post numbers
 */
export function isMilestone(count: number): { milestone: boolean; type: 'small' | 'medium' | 'large' } {
  if (count === 100 || count === 500 || count === 1000) {
    return { milestone: true, type: 'large' }
  }
  if (count === 50 || count === 250) {
    return { milestone: true, type: 'medium' }
  }
  if (count % 10 === 0 && count > 0) {
    return { milestone: true, type: 'small' }
  }
  return { milestone: false, type: 'small' }
}

/**
 * Celebration messages for milestones
 */
export function getMilestoneMessage(count: number, type: 'posts' | 'photos'): string {
  const entity = type === 'posts' ? 'mensagens' : 'fotos'

  if (count === 1000) return `🎊 1000 ${entity}! Um momento histórico! 🎊`
  if (count === 500) return `✨ 500 ${entity}! Que celebração incrível! ✨`
  if (count === 250) return `🌟 250 ${entity}! A festa está apenas começando! 🌟`
  if (count === 100) return `🎉 100 ${entity}! Que momento especial! 🎉`
  if (count === 50) return `💕 50 ${entity}! O amor está no ar! 💕`
  if (count % 10 === 0) return `🎈 ${count} ${entity}! Continue compartilhando! 🎈`

  return ''
}
