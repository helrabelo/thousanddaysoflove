'use client'

/**
 * Floating Action Button (FAB) Component
 *
 * Elegant floating button for quick actions on the live feed
 * - Only visible when guest is authenticated
 * - Opens action menu with "Nova Mensagem" and "Enviar Mídia"
 * - Monochromatic wedding aesthetic
 * - Mobile-first responsive design
 */

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Plus, MessageSquare, Image, X } from 'lucide-react'

interface FloatingActionButtonProps {
  isAuthenticated: boolean
  guestName: string
  onOpenMessageComposer: () => void
  onOpenMediaUpload: () => void
}

export function FloatingActionButton({
  isAuthenticated,
  guestName,
  onOpenMessageComposer,
  onOpenMediaUpload
}: FloatingActionButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Don't render if guest is not authenticated
  if (!isAuthenticated) {
    return null
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleMessageClick = () => {
    setIsMenuOpen(false)
    onOpenMessageComposer()
  }

  const handleMediaClick = () => {
    setIsMenuOpen(false)
    onOpenMediaUpload()
  }

  return (
    <div
      className="fixed z-50 flex flex-col items-end gap-3"
      style={{
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
        right: 'calc(24px + env(safe-area-inset-right))'
      }}
    >
      {/* Action Menu Items */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop overlay for mobile - clicking closes menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
            />

            {/* Send Message Action */}
            <motion.button
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 20 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: 0.05
              }}
              onClick={handleMessageClick}
              className="flex items-center gap-3 bg-white text-[#2C2C2C] px-5 py-3 rounded-full shadow-lg border border-[#E8E6E3] hover:border-[#A8A8A8] hover:shadow-xl transition-all group"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-crimson font-medium whitespace-nowrap">
                Nova Mensagem
              </span>
              <motion.div
                className="w-10 h-10 rounded-full bg-[#2C2C2C] flex items-center justify-center"
                whileHover={shouldReduceMotion ? {} : { rotate: 10 }}
              >
                <MessageSquare className="w-5 h-5 text-[#F8F6F3]" />
              </motion.div>
            </motion.button>

            {/* Send Media Action */}
            <motion.button
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 20 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                delay: 0.1
              }}
              onClick={handleMediaClick}
              className="flex items-center gap-3 bg-white text-[#2C2C2C] px-5 py-3 rounded-full shadow-lg border border-[#E8E6E3] hover:border-[#A8A8A8] hover:shadow-xl transition-all group"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-crimson font-medium whitespace-nowrap">
                Enviar Mídia
              </span>
              <motion.div
                className="w-10 h-10 rounded-full bg-[#2C2C2C] flex items-center justify-center"
                whileHover={shouldReduceMotion ? {} : { rotate: 10 }}
              >
                <Image className="w-5 h-5 text-[#F8F6F3]" />
              </motion.div>
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={toggleMenu}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2C2C2C] to-[#4A4A4A] text-[#F8F6F3] shadow-2xl border-2 border-[#A8A8A8] flex items-center justify-center"
        whileHover={shouldReduceMotion ? {} : {
          scale: 1.1,
          boxShadow: '0 10px 40px rgba(44, 44, 44, 0.4)'
        }}
        whileTap={{ scale: 0.95 }}
        animate={isMenuOpen ? {} : shouldReduceMotion ? {} : {
          boxShadow: [
            '0 8px 24px rgba(44, 44, 44, 0.3)',
            '0 12px 32px rgba(44, 44, 44, 0.4)',
            '0 8px 24px rgba(44, 44, 44, 0.3)'
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }}
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu de ações'}
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {isMenuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Plus className="w-7 h-7" />
          )}
        </motion.div>
      </motion.button>

      {/* Guest name tooltip - shows on hover */}
      <AnimatePresence>
        {!isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-3 bottom-5 pointer-events-none hidden md:block"
          >
            <div className="bg-[#2C2C2C] text-[#F8F6F3] px-3 py-2 rounded-lg text-sm font-crimson whitespace-nowrap shadow-lg border border-[#A8A8A8]">
              Olá, {guestName}! 👋
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
