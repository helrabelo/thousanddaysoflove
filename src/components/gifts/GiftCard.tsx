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
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Prioridade Alta'
      case 'medium':
        return 'Prioridade Media'
      case 'low':
        return 'Prioridade Baixa'
      default:
        return priority
    }
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
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border ${
          isCompleted ? 'border-green-200' : 'border-gray-100'
        }`}
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
            <div className="w-full h-full bg-gradient-to-br from-rose-100 to-purple-100 flex items-center justify-center">
              <Heart className="w-16 h-16 text-rose-300" />
            </div>
          )}

          {/* Priority Badge */}
          {gift.priority !== 'low' && (
            <div className="absolute top-3 left-3">
              <Badge className={`${getPriorityColor(gift.priority)} text-xs font-medium`}>
                {getPriorityLabel(gift.priority)}
              </Badge>
            </div>
          )}

          {/* Completion Badge */}
          {isCompleted && (
            <div className="absolute top-3 right-3">
              <div className="bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Completo
              </div>
            </div>
          )}

          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
              {gift.category}
            </Badge>
          </div>
        </div>

        {/* Gift Content */}
        <div className="p-6">
          {/* Gift Info */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {gift.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
              {gift.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-purple-600">
                {formatBRL(gift.price)}
              </span>
              {gift.registry_url && (
                <a
                  href={gift.registry_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-700 underline"
                >
                  Ver na loja
                </a>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {gift.quantity_purchased} de {gift.quantity_desired} {gift.quantity_desired === 1 ? 'presente' : 'presentes'}
                </span>
              </div>
              <span className="font-medium">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full transition-colors duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-rose-400 to-purple-600'
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {isCompleted ? (
              <div className="text-center py-3">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Presente Completo</span>
                </div>
                <p className="text-sm text-gray-600">
                  Obrigado a todos que contribuiram!
                </p>
              </div>
            ) : (
              <Button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                Comprar com PIX
              </Button>
            )}

            {/* Quick Actions */}
            {!isCompleted && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Comprar
                </Button>
                {gift.registry_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => window.open(gift.registry_url, '_blank')}
                  >
                    Ver Loja
                  </Button>
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