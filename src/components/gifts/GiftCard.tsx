'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Users, QrCode, CheckCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { Gift } from '@/types/wedding'
import { Button } from '@/components/ui/button'
import PaymentModal from '@/components/payments/PaymentModal'
import { Badge } from '@/components/ui/badge'
import { giftStories } from '@/lib/utils/wedding'

interface GiftCardProps {
  gift: Gift
  onPaymentSuccess?: (paymentId: string) => void
}

export default function GiftCard({ gift, onPaymentSuccess }: GiftCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const getProgressPercentage = () => {
    if (gift.quantity_desired === 0) return 0
    return Math.round((gift.quantity_purchased / gift.quantity_desired) * 100)
  }

  const isCompleted = gift.quantity_purchased >= gift.quantity_desired
  const isPartial = gift.quantity_purchased > 0 && !isCompleted
  const progress = getProgressPercentage()

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Sonho dos Noivos ✨'
      case 'medium':
        return 'Desejo Especial 💕'
      case 'low':
        return 'Presente Querido 💝'
      default:
        return priority
    }
  }

  const getRemainingAmount = () => {
    const remaining = (gift.quantity_desired - gift.quantity_purchased) * gift.price
    return formatBRL(remaining)
  }

  // Use romantic context from wedding utils with couple's specific stories
  const getRomanticContext = (category: string, name: string) => {
    // First check for specific gift stories from their unique history
    const story = giftStories[category as keyof typeof giftStories];
    if (story) return story;

    // Fallback for specific items that might have unique meanings
    if (name.toLowerCase().includes('remédio') || name.toLowerCase().includes('chá')) {
      return '🍵 Como aquele remédio e chá que mudou tudo - "na hora já sabia que era ela"';
    }
    if (name.toLowerCase().includes('bicicleta')) {
      return '🚲 Para lembrar dos sonhos da faculdade quando passava de bike pelo apartamento dos sonhos';
    }
    if (name.toLowerCase().includes('câmera') || name.toLowerCase().includes('foto')) {
      return '📸 Para o Hel capturar cada momento dos próximos mil dias';
    }
    if (name.toLowerCase().includes('vinho')) {
      return '🍷 Para nossas noites caseiras de introvertidos apaixonados';
    }

    return 'Escolhido com amor para construir nossos sonhos da faculdade que viraram realidade 🏠';
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentModal(false)
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentId)
    }
  }

  // Get appropriate CTA text based on gift state
  const getCtaText = () => {
    if (isCompleted) return null
    if (isPartial) return 'Completar Presente'
    return 'Presentear 💕'
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="rounded-2xl transition-all duration-300 overflow-hidden relative group"
        style={{
          background: 'var(--white-soft)',
          boxShadow: '0 4px 20px var(--shadow-subtle)',
          border: `1px solid ${isCompleted ? 'var(--decorative)' : 'var(--border-subtle)'}`,
          opacity: isCompleted ? 0.95 : 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = '0 12px 35px var(--shadow-medium)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)'
        }}
      >
        {/* Completed Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/10 pointer-events-none z-10" />
        )}

        {/* Gift Image */}
        <div className="relative h-56 overflow-hidden">
          {gift.image_url ? (
            <Image
              src={gift.image_url}
              alt={gift.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--background))' }}>
              <Heart className="w-20 h-20" style={{ color: 'var(--decorative)' }} />
            </div>
          )}

          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Priority Badge - Top Left */}
          {gift.priority !== 'low' && !isCompleted && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1.5"
                style={{
                  background: 'rgba(248, 246, 243, 0.95)',
                  color: 'var(--decorative)',
                  fontFamily: 'var(--font-crimson)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                <Sparkles className="w-3.5 h-3.5" />
                {getPriorityLabel(gift.priority)}
              </div>
            </motion.div>
          )}

          {/* Completion Badge - Top Right */}
          {isCompleted && (
            <motion.div
              className="absolute top-4 right-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <div className="px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold backdrop-blur-sm"
                style={{
                  background: 'var(--decorative)',
                  color: 'var(--white-soft)',
                  fontFamily: 'var(--font-playfair)',
                  boxShadow: '0 4px 12px rgba(168, 168, 168, 0.4)'
                }}>
                <CheckCircle className="w-4 h-4" />
                Sonho Realizado ✨
              </div>
            </motion.div>
          )}

          {/* Category Badge - Bottom Left */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md"
              style={{
                background: 'rgba(254, 254, 254, 0.9)',
                color: 'var(--primary-text)',
                fontFamily: 'var(--font-crimson)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
              }}>
              {gift.category}
            </span>
          </div>
        </div>

        {/* Gift Content */}
        <div className="p-6">
          {/* Gift Info */}
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-2 line-clamp-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)', lineHeight: '1.3' }}>
              {gift.name}
            </h3>
            <p className="text-sm line-clamp-3 mb-3" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic', lineHeight: '1.6' }}>
              {gift.description}
            </p>

            {/* Romantic story on hover - Enhanced visibility */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 mb-3 transform translate-y-2 group-hover:translate-y-0">
              <p className="text-xs italic p-2 rounded-lg" style={{
                color: 'var(--decorative)',
                fontFamily: 'var(--font-crimson)',
                background: 'var(--accent)',
                border: '1px solid var(--border-subtle)'
              }}>
                {getRomanticContext(gift.category, gift.name)}
              </p>
            </div>

            {/* Price and Store Link */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold" style={{ color: 'var(--decorative)', fontFamily: 'var(--font-playfair)' }}>
                {formatBRL(gift.price)}
              </span>
              {gift.registry_url && !isCompleted && (
                <a
                  href={gift.registry_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline transition-colors duration-200 hover:no-underline"
                  style={{ color: 'var(--decorative)', fontFamily: 'var(--font-crimson)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--secondary-text)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--decorative)' }}
                >
                  Ver na loja ↗
                </a>
              )}
            </div>
          </div>

          {/* Progress Section - Enhanced */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm mb-3" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className="font-medium">
                  {gift.quantity_purchased} de {gift.quantity_desired}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {isPartial && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{
                    background: 'var(--accent)',
                    color: 'var(--decorative)'
                  }}>
                    Faltam {getRemainingAmount()}
                  </span>
                )}
                <span className="font-bold text-base" style={{ color: 'var(--primary-text)' }}>{progress}%</span>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="w-full rounded-full h-3 overflow-hidden relative" style={{ background: 'var(--accent)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full relative overflow-hidden"
                style={{
                  background: isCompleted
                    ? 'var(--decorative)'
                    : 'linear-gradient(90deg, var(--decorative) 0%, var(--secondary-text) 100%)'
                }}
              >
                {/* Shimmer effect on progress bar */}
                {!isCompleted && (
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                )}
              </motion.div>
            </div>
          </div>

          {/* Action Buttons - Redesigned */}
          <div className="space-y-3">
            {isCompleted ? (
              // Completed State - Elegant thank you message
              <motion.div
                className="text-center py-4 rounded-xl"
                style={{ background: 'var(--accent)', border: '1px solid var(--border-subtle)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2" style={{ color: 'var(--decorative)' }}>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold text-base" style={{ fontFamily: 'var(--font-playfair)' }}>Presente Completo 💝</span>
                </div>
                <p className="text-sm px-4" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic', lineHeight: '1.5' }}>
                  Vocês tornaram nosso sonho realidade 💕<br/>
                  <span className="font-medium">Hel & Ylana agradecem de coração</span>
                </p>
              </motion.div>
            ) : (
              <>
                {/* Primary CTA - Concise and elegant */}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group/button"
                  style={{
                    background: 'var(--primary-text)',
                    color: 'var(--white-soft)',
                    fontFamily: 'var(--font-playfair)',
                    fontSize: '1rem',
                    letterSpacing: '0.02em'
                  }}
                  title={getRomanticContext(gift.category, gift.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--secondary-text)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(44, 44, 44, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--primary-text)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Subtle shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                  <QrCode className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{getCtaText()}</span>
                </button>

                {/* Secondary Actions - More subtle */}
                {gift.registry_url && (
                  <button
                    className="w-full text-sm py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: 'transparent',
                      color: 'var(--decorative)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-crimson)'
                    }}
                    onClick={() => window.open(gift.registry_url, '_blank')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent)'
                      e.currentTarget.style.borderColor = 'var(--decorative)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ver produto na loja
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        gift={gift}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  )
}
