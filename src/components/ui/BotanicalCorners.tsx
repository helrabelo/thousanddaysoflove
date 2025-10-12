'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface BotanicalCornersProps {
  pattern?: 'diagonal-right' | 'diagonal-left'
  opacity?: number
}

/**
 * BotanicalCorners - Reusable decorative botanical corner elements
 *
 * @param pattern - Diagonal pattern for corner placement:
 *   - 'diagonal-right': top-right + bottom-left (default)
 *   - 'diagonal-left': top-left + bottom-right
 * @param opacity - Opacity of the decorations (default: 0.2)
 */
export default function BotanicalCorners({
  pattern = 'diagonal-right',
  opacity = 0.2
}: BotanicalCornersProps) {
  const isDiagonalRight = pattern === 'diagonal-right'

  return (
    <>
      {/* Top Corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true }}
        className={`absolute top-0 ${isDiagonalRight ? 'right-0' : 'left-0'} w-24 sm:w-32 md:w-40 lg:w-48 pointer-events-none z-0`}
        style={{ opacity }}
      >
        <Image
          src="/corner-plant.svg"
          alt=""
          width={971}
          height={1752}
          className="w-full h-auto"
          style={{
            filter: 'brightness(0) saturate(100%)',
            color: 'var(--decorative)',
            opacity,
            transform: isDiagonalRight ? 'none' : 'scaleX(-1)',
          }}
        />
      </motion.div>

      {/* Bottom Corner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        viewport={{ once: true }}
        className={`absolute bottom-0 ${isDiagonalRight ? 'left-0' : 'right-0'} w-24 sm:w-32 md:w-40 lg:w-48 pointer-events-none z-0`}
        style={{ opacity }}
      >
        <div style={{ transform: isDiagonalRight ? 'rotate(180deg)' : 'rotate(180deg) scaleX(-1)' }}>
          <Image
            src="/corner-plant.svg"
            alt=""
            width={971}
            height={1752}
            className="w-full h-auto"
            style={{
              filter: 'brightness(0) saturate(100%)',
              color: 'var(--decorative)',
              opacity,
            }}
          />
        </div>
      </motion.div>
    </>
  )
}
