// @ts-nocheck: Pending animation + icon typing cleanup
'use client'

/**
 * Floating Action Buttons (FAB) Component - Option B Design
 *
 * Two always-visible action buttons with text labels
 * - Research-backed: 50% faster than hidden menu (1 tap vs 2)
 * - Better discoverability: No hidden interactions to learn
 * - Wedding context: Clear, obvious actions for non-technical guests
 * - Mobile-first: Responsive layouts (stack on desktop, row on mobile)
 * - Accessibility: ARIA labels, reduced motion support, 44px touch targets
 */

import { motion, useReducedMotion } from 'framer-motion'
import { MessageSquare, Image as ImageIcon } from 'lucide-react'

interface FloatingActionButtonProps {
  isAuthenticated: boolean
  guestName: string
  onOpenMessageComposer: () => void
  onOpenMediaUpload: () => void
}

export function FloatingActionButton({
  isAuthenticated,
  onOpenMessageComposer,
  onOpenMediaUpload
}: FloatingActionButtonProps) {
  const shouldReduceMotion = useReducedMotion()

  // Don't render if guest is not authenticated
  if (!isAuthenticated) {
    return null
  }

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    },
    hover: shouldReduceMotion ? {} : {
      scale: 1.05,
      y: -2,
      boxShadow: '0 12px 32px rgba(44, 44, 44, 0.4)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  return (
    <>
      {/* Desktop Layout: Bottom-Right Stack */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 hidden sm:flex flex-col gap-3 z-50"
        style={{
          bottom: 'calc(24px + env(safe-area-inset-bottom))',
          right: 'calc(24px + env(safe-area-inset-right))'
        }}
      >
        {/* Nova Mensagem Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={onOpenMessageComposer}
          className="group flex items-center gap-3 bg-white text-[#2C2C2C] px-5 py-3.5 rounded-full shadow-lg border border-[#E8E6E3] hover:border-[#A8A8A8] transition-all"
          aria-label="Criar nova mensagem"
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C2C2C] to-[#4A4A4A] flex items-center justify-center flex-shrink-0"
            whileHover={shouldReduceMotion ? {} : { rotate: 10 }}
          >
            <MessageSquare className="w-5 h-5 text-[#F8F6F3]" />
          </motion.div>
          <span
            className="font-medium whitespace-nowrap text-sm"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Nova Mensagem
          </span>
        </motion.button>

        {/* Enviar Mídia Button */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          onClick={onOpenMediaUpload}
          transition={{ delay: 0.1 }}
          className="group flex items-center gap-3 bg-white text-[#2C2C2C] px-5 py-3.5 rounded-full shadow-lg border border-[#E8E6E3] hover:border-[#A8A8A8] transition-all"
          aria-label="Enviar fotos ou vídeos"
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C2C2C] to-[#4A4A4A] flex items-center justify-center flex-shrink-0"
            whileHover={shouldReduceMotion ? {} : { rotate: 10 }}
          >
            <ImageIcon className="w-5 h-5 text-[#F8F6F3]" />
          </motion.div>
          <span
            className="font-medium whitespace-nowrap text-sm"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Enviar Mídia
          </span>
        </motion.button>
      </motion.div>

      {/* Mobile Layout: Bottom-Center Row */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-50 sm:hidden"
        style={{
          bottom: 'calc(24px + env(safe-area-inset-bottom))',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)'
        }}
      >
        {/* Nova Mensagem Button (Mobile - Compact) */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileTap="tap"
          onClick={onOpenMessageComposer}
          className="flex items-center gap-2 bg-white text-[#2C2C2C] px-4 py-3 rounded-full shadow-lg border border-[#E8E6E3] active:border-[#A8A8A8] active:shadow-md transition-all min-w-[130px] justify-center"
          aria-label="Criar nova mensagem"
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span
            className="font-medium text-xs whitespace-nowrap"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Mensagem
          </span>
        </motion.button>

        {/* Enviar Mídia Button (Mobile - Compact) */}
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileTap="tap"
          onClick={onOpenMediaUpload}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 bg-white text-[#2C2C2C] px-4 py-3 rounded-full shadow-lg border border-[#E8E6E3] active:border-[#A8A8A8] active:shadow-md transition-all min-w-[130px] justify-center"
          aria-label="Enviar fotos ou vídeos"
        >
          <ImageIcon className="w-4 h-4 flex-shrink-0" />
          <span
            className="font-medium text-xs whitespace-nowrap"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            Mídia
          </span>
        </motion.button>
      </motion.div>
    </>
  )
}
