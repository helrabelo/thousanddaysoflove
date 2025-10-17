'use client'

import { useEffect, useRef, useState } from 'react'
import { CountUp } from 'countup.js'
import { useReducedMotion } from 'framer-motion'

interface AnimatedDayNumberProps {
  /** The day number to animate to (can be negative) */
  value: number
  /** Duration of the animation in seconds (default: 2) */
  duration?: number
  /** Delay before starting the animation in seconds (default: 0) */
  delay?: number
  /** Custom CSS class name */
  className?: string
  /** Custom inline styles */
  style?: React.CSSProperties
}

/**
 * AnimatedDayNumber Component
 *
 * Animates day numbers using CountUp.js with support for:
 * - Negative numbers (for days before the couple met)
 * - Scroll-triggered animations (using Intersection Observer)
 * - Accessibility (respects prefers-reduced-motion)
 * - Brazilian Portuguese formatting (thousands separator)
 *
 * @example
 * // Positive day number
 * <AnimatedDayNumber value={365} />
 *
 * @example
 * // Negative day number (before they met)
 * <AnimatedDayNumber value={-730} duration={2.5} />
 */
export default function AnimatedDayNumber({
  value,
  duration = 2,
  delay = 0,
  className,
  style,
}: AnimatedDayNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const countUpRef = useRef<CountUp | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!elementRef.current) return

    // Respect user's motion preferences
    if (shouldReduceMotion) {
      // Skip animation, show final value immediately
      elementRef.current.textContent = value.toLocaleString('pt-BR')
      setHasAnimated(true)
      return
    }

    // Initialize CountUp.js
    // For negative numbers, we need to start from 0 and count down
    const startValue = value < 0 ? 0 : 0
    const endValue = value

    // CountUp.js options
    const options = {
      startVal: startValue,
      duration: duration,
      separator: '.', // Brazilian Portuguese uses dot for thousands
      decimal: ',',   // Brazilian Portuguese uses comma for decimals
      decimalPlaces: 0, // Whole numbers only
      useEasing: true,
      useGrouping: true,
      enableScrollSpy: false, // We handle scroll detection ourselves
      scrollSpyDelay: 0,
      scrollSpyOnce: true,
    }

    // Create CountUp instance
    countUpRef.current = new CountUp(elementRef.current, endValue, options)

    // Create Intersection Observer to trigger animation when element is visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Trigger animation when element is 20% visible and hasn't animated yet
          if (entry.isIntersecting && !hasAnimated && countUpRef.current) {
            // Apply delay if specified
            if (delay > 0) {
              setTimeout(() => {
                if (countUpRef.current && !countUpRef.current.error) {
                  countUpRef.current.start()
                  setHasAnimated(true)
                }
              }, delay * 1000)
            } else {
              if (!countUpRef.current.error) {
                countUpRef.current.start()
                setHasAnimated(true)
              }
            }
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before fully visible
      }
    )

    // Start observing the element
    if (elementRef.current) {
      observerRef.current.observe(elementRef.current)
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [value, duration, delay, hasAnimated, shouldReduceMotion])

  // Initial render: show 0 for animations, or final value if motion reduced
  const initialDisplay = shouldReduceMotion ? value.toLocaleString('pt-BR') : '0'

  return (
    <span
      ref={elementRef}
      className={className}
      style={style}
      aria-label={`Dia ${value}`}
    >
      {initialDisplay}
    </span>
  )
}
