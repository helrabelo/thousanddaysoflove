'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Users, QrCode, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { Gift } from '@/types/wedding'
import { Button } from '@/components/ui/button'
import PaymentModal from '@/components/payments/PaymentModal'
import { Badge } from '@/components/ui/badge'

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
  const progress = getProgressPercentage()

  const getPriorityColor = (priority: string) => {
    // Using monochromatic wedding invitation colors only
    return 'px-2 py-1 rounded-full text-xs font-medium'
  }

  const getPriorityStyle = (priority: string) => ({
    background: 'var(--accent)',
    color: 'var(--decorative)',
    fontFamily: 'var(--font-crimson)',
    border: '1px solid var(--border-subtle)'
  })

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

  // Generate romantic context for gift categories
  const getRomanticContext = (category: string, name: string) => {
    const contexts = {
      'Casa': 'Para construir nosso lar com amor',
      'Cozinha': 'Para temperar nosso amor com sabores especiais',
      'Quarto': 'Para sonhar juntos todos os dias',
      'Banheiro': 'Para cuidar um do outro com carinho',
      'Sala': 'Para receber amigos e família com alegria',
      'Experiências': 'Para criar memórias que durarão para sempre',
      'Eletrônicos': 'Para conectar nossos corações à tecnologia',
      'Decoração': 'Para encher nosso lar de beleza e amor',
      'Jardim': 'Para cultivar nosso amor como uma flor',
      default: 'Escolhido com amor para nossos mil dias juntos'
    }
    return contexts[category as keyof typeof contexts] || contexts.default
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentModal(false)
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentId)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        className="rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          background: 'var(--white-soft)',
          boxShadow: '0 4px 20px var(--shadow-subtle)',
          border: `1px solid ${isCompleted ? 'var(--decorative)' : 'var(--border-subtle)'}`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 30px var(--shadow-medium)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 20px var(--shadow-subtle)'
        }}
      >
        {/* Gift Image */}
        <div className="relative h-48 overflow-hidden">
          {gift.image_url ? (
            <Image
              src={gift.image_url}
              alt={gift.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), var(--background))' }}>
              <Heart className="w-16 h-16" style={{ color: 'var(--decorative)' }} />
            </div>
          )}

          {/* Priority Badge */}
          {gift.priority !== 'low' && (
            <div className="absolute top-3 left-3">
              <span className={getPriorityColor(gift.priority)} style={getPriorityStyle(gift.priority)}>
                {getPriorityLabel(gift.priority)}
              </span>
            </div>
          )}

          {/* Completion Badge */}
          {isCompleted && (
            <div className="absolute top-3 right-3">
              <div className="px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium" style={{ background: 'var(--decorative)', color: 'var(--white-soft)', fontFamily: 'var(--font-crimson)' }}>
                <CheckCircle className="w-3 h-3" />
                Completo com amor
              </div>
            </div>
          )}

          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--white-soft)', color: 'var(--primary-text)', fontFamily: 'var(--font-crimson)', opacity: '0.95', border: '1px solid var(--border-subtle)' }}>
              {gift.category}
            </span>
          </div>
        </div>

        {/* Gift Content */}
        <div className="p-6">
          {/* Gift Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>
              {gift.name}
            </h3>
            <p className="text-sm line-clamp-3 mb-3" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
              {gift.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold" style={{ color: 'var(--decorative)', fontFamily: 'var(--font-playfair)' }}>
                {formatBRL(gift.price)}
              </span>
              {gift.registry_url && (
                <a
                  href={gift.registry_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline transition-colors duration-200"
                  style={{ color: 'var(--decorative)', fontFamily: 'var(--font-crimson)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--secondary-text)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--decorative)' }}
                >
                  Ver na loja
                </a>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {gift.quantity_purchased} de {gift.quantity_desired} {gift.quantity_desired === 1 ? 'presente' : 'presentes'}
                </span>
              </div>
              <span className="font-medium">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'var(--accent)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full transition-colors duration-300"
                style={{
                  background: isCompleted ? 'var(--decorative)' : 'linear-gradient(90deg, var(--decorative), var(--secondary-text))'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {isCompleted ? (
              <div className="text-center py-3">
                <div className="flex items-center justify-center gap-2 mb-1" style={{ color: 'var(--decorative)' }}>
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium" style={{ fontFamily: 'var(--font-playfair)' }}>Presente Realizado com Amor</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
                  Obrigado a todos que contribuíram!
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: 'var(--primary-text)',
                  color: 'var(--white-soft)',
                  fontFamily: 'var(--font-playfair)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--secondary-text)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--primary-text)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <QrCode className="w-4 h-4" />
                Presentear com Amor via PIX
              </button>
            )}

            {/* Quick Actions */}
            {!isCompleted && (
              <div className="flex gap-2">
                <button
                  className="flex-1 text-xs py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
                  style={{
                    background: 'var(--accent)',
                    color: 'var(--primary-text)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-crimson)'
                  }}
                  onClick={() => setShowPaymentModal(true)}
                >
                  <ShoppingCart className="w-3 h-3" />
                  Comprar
                </button>
                {gift.registry_url && (
                  <button
                    className="flex-1 text-xs py-2 px-3 rounded-lg transition-all duration-200"
                    style={{
                      background: 'var(--accent)',
                      color: 'var(--primary-text)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-crimson)'
                    }}
                    onClick={() => window.open(gift.registry_url, '_blank')}
                  >
                    Ver Loja
                  </button>
                )}
              </div>
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