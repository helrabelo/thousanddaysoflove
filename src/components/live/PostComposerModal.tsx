'use client'

/**
 * Post Composer Modal Component
 *
 * Modal wrapper for PostComposer component
 * - Full-screen overlay with elegant animations
 * - ESC key to close
 * - Refresh feed on successful post
 * - Wedding aesthetic with monochromatic colors
 * - Mobile-first responsive design
 */

import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import PostComposer from '@/components/messages/PostComposer'
import type { GuestPost } from '@/types/wedding'

interface PostComposerModalProps {
  isOpen: boolean
  guestName: string
  isAuthenticated?: boolean
  onClose: () => void
  onPostCreated?: (post: GuestPost, autoApproved: boolean) => void
}

export function PostComposerModal({
  isOpen,
  guestName,
  isAuthenticated = false,
  onClose,
  onPostCreated
}: PostComposerModalProps) {
  const shouldReduceMotion = useReducedMotion()

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handlePostCreated = (post: GuestPost, autoApproved: boolean) => {
    // Call parent handler
    onPostCreated?.(post, autoApproved)

    // TODO: Show success toast notification
    // const message = autoApproved
    //   ? '✅ Mensagem publicada com sucesso!'
    //   : '⏳ Mensagem enviada para aprovação!'

    // Close modal after brief delay
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Container - Mobile Optimized */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#F8F6F3] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-2 border-[#E8E6E3]"
            >
              {/* Header - Mobile Responsive */}
              <div className="bg-white border-b-2 border-[#E8E6E3] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10">
                <div className='flex-1 min-w-0 mr-2'>
                  <h2 className="text-xl sm:text-2xl font-playfair font-bold text-[#2C2C2C] truncate">
                    Criar Mensagem
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A4A4A] font-crimson mt-1">
                    Compartilhe suas felicitações
                  </p>
                </div>

                {/* Close Button - Min 44px touch target */}
                <motion.button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-[#E8E6E3] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center !w-fit"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A4A4A]" />
                </motion.button>
              </div>

              {/* Content - Scrollable with mobile padding */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)]">
                <PostComposer
                  guestName={guestName}
                  isAuthenticated={isAuthenticated}
                  onPostCreated={handlePostCreated}
                  onCancel={onClose}
                />
              </div>

              {/* Footer Hint - Hide on mobile for space */}
              <div className="hidden sm:block bg-white border-t-2 border-[#E8E6E3] px-6 py-3 text-center">
                <p className="text-xs text-[#A8A8A8] font-crimson italic">
                  💡 Pressione ESC para fechar
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
