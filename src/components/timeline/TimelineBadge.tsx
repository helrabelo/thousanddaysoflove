'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { TimelineEventState } from '@/types/wedding'

interface TimelineBadgeProps {
  state: TimelineEventState
  size?: 'sm' | 'md'
}

export function TimelineBadge({ state, size = 'md' }: TimelineBadgeProps) {
  const baseClass = clsx('inline-flex items-center gap-2 uppercase tracking-[0.25em]', {
    'text-xs': size === 'sm',
    'text-sm': size === 'md',
  })

  switch (state.status) {
    case 'happening_now':
      return (
        <motion.span
          className={clsx(baseClass, 'text-[#F6D28B]')}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#F6D28B] shadow-[0_0_10px_rgba(246,210,139,0.8)]" />
          Agora
        </motion.span>
      )
    case 'completed':
      return (
        <span className={clsx(baseClass, 'text-white/40')}>
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/20" />
          Celebrado
        </span>
      )
    default:
      return (
        <span className={clsx(baseClass, 'text-white/60')}>
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-white/30" />
          {state.isNext ? 'A Seguir' : 'Em Breve'}
        </span>
      )
  }
}

export default TimelineBadge
