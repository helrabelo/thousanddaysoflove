'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'
import { getScrollProgressMessage } from '@/lib/utils/whimsy'

interface ScrollProgressProps {
  showMessage?: boolean
  color?: string
}

export function ScrollProgress({ showMessage = true, color = 'var(--decorative)' }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const percent = Math.round(latest * 100)
      setProgress(percent)
      if (showMessage) {
        setMessage(getScrollProgressMessage(percent))
      }
    })
  }, [scrollYProgress, showMessage])

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 origin-left z-50"
        style={{
          scaleX,
          background: color,
          boxShadow: '0 0 10px rgba(168, 168, 168, 0.3)'
        }}
      />

      {/* Progress message */}
      {showMessage && progress > 5 && progress < 95 && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full z-40"
          style={{
            background: 'var(--white-soft)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 12px var(--shadow-subtle)',
            backdropFilter: 'blur(10px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p
            className="text-sm text-center whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-crimson)',
              color: 'var(--secondary-text)',
              fontStyle: 'italic'
            }}
          >
            {message}
          </p>
        </motion.div>
      )}
    </>
  )
}

// Heart trail on scroll
export function ScrollHeartTrail() {
  const { scrollY } = useScroll()
  const [hearts, setHearts] = useState<Array<{ id: number; y: number }>>([])

  useEffect(() => {
    let lastScroll = 0
    let heartId = 0

    return scrollY.on('change', (latest) => {
      if (latest > lastScroll + 100) {
        heartId++
        setHearts(prev => [...prev, { id: heartId, y: latest }])

        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== heartId))
        }, 2000)

        lastScroll = latest
      }
    })
  }, [scrollY])

  return (
    <div className="fixed left-4 top-0 pointer-events-none z-30">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          className="absolute text-2xl"
          style={{ top: heart.y }}
          initial={{ opacity: 0, x: -20, scale: 0 }}
          animate={{ opacity: 0.3, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0 }}
          transition={{ duration: 0.6 }}
        >
          💕
        </motion.div>
      ))}
    </div>
  )
}

// Scroll hint animation
export function ScrollHint({ show = true }: { show?: boolean }) {
  if (!show) return null

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex flex-col items-center gap-2">
        <p
          className="text-sm"
          style={{
            fontFamily: 'var(--font-crimson)',
            color: 'var(--secondary-text)',
            fontStyle: 'italic'
          }}
        >
          Role para descobrir nossa história
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5V19M12 19L5 12M12 19L19 12"
              stroke="var(--decorative)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  )
}
