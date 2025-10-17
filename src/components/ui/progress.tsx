/**
 * Progress Component for Wedding RSVP System
 *
 * Beautiful animated progress bars with Brazilian wedding theme
 */

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'romantic' | 'success' | 'warning' | 'danger'
}

export function Progress({
  value,
  className = '',
  showLabel = false,
  variant = 'default'
}: ProgressProps) {
  const normalizedValue = Math.max(0, Math.min(100, value))

  const variants = {
    default: 'from-blush-400 to-blush-600',
    romantic: 'from-blush-400 via-gray-400 to-burgundy-500',
    success: 'from-sage-400 to-sage-600',
    warning: 'from-yellow-400 to-orange-500',
    danger: 'from-red-400 to-red-600'
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalizedValue}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            'h-full bg-gradient-to-r rounded-full transition-all duration-300',
            variants[variant]
          )}
        />
      </div>
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute right-0 top-3 text-xs font-medium text-burgundy-600"
        >
          {Math.round(normalizedValue)}%
        </motion.span>
      )}
    </div>
  )
}

export default Progress