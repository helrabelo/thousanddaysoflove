'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, Heart } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'romantic'

export interface ToastProps {
  id?: string
  type?: ToastType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  showPets?: boolean
}

export function Toast({
  id = 'toast',
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  showPets = false
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = useCallback(() => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }, [onClose])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" style={{ color: 'var(--decorative)' }} />
      case 'error':
        return <AlertCircle className="w-5 h-5" style={{ color: 'var(--primary-text)' }} />
      case 'romantic':
        return <Heart className="w-5 h-5 fill-current" style={{ color: 'var(--decorative)' }} />
      default:
        return <Info className="w-5 h-5" style={{ color: 'var(--decorative)' }} />
    }
  }

  const getBackground = () => {
    switch (type) {
      case 'romantic':
        return 'linear-gradient(135deg, var(--white-soft) 0%, var(--accent) 100%)'
      default:
        return 'var(--white-soft)'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id={id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="rounded-2xl shadow-lg p-6 min-w-[320px] max-w-md relative overflow-hidden"
          style={{
            background: getBackground(),
            border: `2px solid var(--border-subtle)`,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Decorative corner */}
          {type === 'romantic' && (
            <div className="absolute top-0 right-0 opacity-10">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <path
                  d="M40 20 Q50 10 60 20 T60 40 L40 60 L20 40 Q10 30 20 20 T40 20"
                  fill="currentColor"
                  style={{ color: 'var(--decorative)' }}
                />
              </svg>
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold mb-1"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  color: 'var(--primary-text)',
                  fontSize: '1.125rem'
                }}
              >
                {title}
              </h3>

              {message && (
                <p
                  className="text-sm"
                  style={{
                    fontFamily: 'var(--font-crimson)',
                    color: 'var(--secondary-text)',
                    fontStyle: 'italic',
                    lineHeight: '1.5'
                  }}
                >
                  {message}
                </p>
              )}

              {/* Pets celebration */}
              {showPets && type === 'success' && (
                <motion.div
                  className="flex items-center gap-2 mt-3"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {['👑', '🍫', '🌸', '⚡'].map((emoji, index) => (
                    <motion.span
                      key={index}
                      animate={{
                        y: [0, -4, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut"
                      }}
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-1 rounded-lg transition-colors duration-200 hover:bg-black/5"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" style={{ color: 'var(--secondary-text)' }} />
            </button>
          </div>

          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
              style={{ background: 'var(--decorative)', opacity: 0.3 }}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast Container for managing multiple toasts
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-md">
      {children}
    </div>
  )
}

// Hook for programmatic toast usage
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = `toast-${Date.now()}`
    const newToast = {
      ...toast,
      id,
      onClose: () => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }
    }
    setToasts(prev => [...prev, newToast])
  }

  const ToastRenderer = () => (
    <ToastContainer>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContainer>
  )

  return { showToast, ToastRenderer }
}
