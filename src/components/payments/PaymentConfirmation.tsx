'use client'

import { motion } from 'framer-motion'
import { Check, Heart, Home, Gift, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PaymentConfirmationProps {
  paymentData: {
    paymentId: string
    giftName: string
    amount: number
    buyerName: string
    buyerEmail: string
    paymentDate: string
  }
  onClose?: () => void
}

export default function PaymentConfirmation({ paymentData, onClose }: PaymentConfirmationProps) {
  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const shareMessage = `🎁 Acabei de presentear Hel & Ylana com ${paymentData.giftName} no valor de ${formatBRL(paymentData.amount)} para o casamento deles! 💕 #MillDiasDeAmor #CasamentoHelYlana`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Presente para Hel & Ylana',
          text: shareMessage,
          url: window.location.origin
        })
      } catch (error) {
        console.log('Error sharing:', error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareMessage} ${window.location.origin}`)
      alert('Mensagem copiada para a área de transferência!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
    }
  }

  const downloadReceipt = () => {
    const receiptData = {
      paymentId: paymentData.paymentId,
      giftName: paymentData.giftName,
      amount: formatBRL(paymentData.amount),
      buyerName: paymentData.buyerName,
      buyerEmail: paymentData.buyerEmail,
      paymentDate: new Date(paymentData.paymentDate).toLocaleString('pt-BR'),
      weddingDate: '20 de Novembro de 2025',
      couple: 'Hel & Ylana'
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `recibo-casamento-${paymentData.paymentId}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-purple-600 px-8 py-12 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Pagamento Confirmado!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-lg opacity-90"
          >
            Obrigado por presentear Hel & Ylana! ❤️
          </motion.p>
        </div>

        {/* Payment Details */}
        <div className="px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Gift Info */}
            <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-6 border border-rose-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Presente Confirmado</h3>
                  <p className="text-gray-600">Para Hel & Ylana</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Presente:</span>
                  <span className="font-medium text-gray-900">{paymentData.giftName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor:</span>
                  <span className="font-bold text-purple-600 text-lg">{formatBRL(paymentData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comprador:</span>
                  <span className="font-medium text-gray-900">{paymentData.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(paymentData.paymentDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-2xl">
                <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
                <span className="font-semibold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Hel & Ylana
                </span>
                <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                <p className="text-gray-700 font-medium italic">
                  "Sua generosidade torna nosso dia ainda mais especial!
                  Estamos ansiosos para celebrar com você no dia 20 de novembro de 2025.
                  Muito obrigado por fazer parte da nossa história de amor!"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </Button>

              <Button
                onClick={downloadReceipt}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Baixar Recibo
              </Button>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Voltar ao Início
                </Button>
              </Link>

              <Link href="/presentes" className="w-full">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Ver Mais Presentes
                </Button>
              </Link>
            </div>

            {/* Email Confirmation Note */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-700 text-center">
                📧 Você receberá um e-mail de confirmação em <strong>{paymentData.buyerEmail}</strong> em alguns minutos.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
