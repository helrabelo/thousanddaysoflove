'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, QrCode, Copy, Check, Heart, Clock, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Gift } from '@/types/wedding'
import Image from 'next/image'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  gift: Gift
  onPaymentSuccess: (paymentId: string) => void
}

interface PaymentData {
  payment: any
  mercadoPago: {
    paymentId: string
    status: string
    pixCode?: string
    qrCodeBase64?: string
    qrCodeImage?: string
  }
  gift: {
    id: string
    name: string
    price: number
  }
}

export default function PaymentModal({ isOpen, onClose, gift, onPaymentSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'pix' | 'success' | 'error'>('form')
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [copied, setCopied] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    amount: gift.price,
    message: ''
  })
  const [statusChecking, setStatusChecking] = useState(false)

  // Check payment status every 5 seconds when showing PIX
  useEffect(() => {
    if (step === 'pix' && paymentData?.mercadoPago.paymentId) {
      const interval = setInterval(async () => {
        try {
          setStatusChecking(true)
          const response = await fetch(`/api/payments/status?mercadoPagoId=${paymentData.mercadoPago.paymentId}`)
          const result = await response.json()

          if (result.success && result.payment.status === 'completed') {
            setStep('success')
            onPaymentSuccess(result.payment.id)
            clearInterval(interval)
          } else if (result.payment.status === 'failed') {
            setStep('error')
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
        } finally {
          setStatusChecking(false)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [step, paymentData, onPaymentSuccess])

  const handleCreatePixPayment = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          giftId: gift.id,
          amount: buyerInfo.amount,
          payerEmail: buyerInfo.email,
          buyerName: buyerInfo.name,
          message: buyerInfo.message
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentData(result)
        setStep('pix')
      } else {
        throw new Error(result.error || 'Falha ao criar pagamento')
      }
    } catch (error) {
      console.error('Error creating PIX payment:', error)
      setStep('error')
    } finally {
      setLoading(false)
    }
  }

  const copyPixCode = async () => {
    if (paymentData?.mercadoPago.pixCode) {
      try {
        await navigator.clipboard.writeText(paymentData.mercadoPago.pixCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy PIX code:', error)
      }
    }
  }

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const resetModal = () => {
    setStep('form')
    setPaymentData(null)
    setBuyerInfo({
      name: '',
      email: '',
      amount: gift.price,
      message: ''
    })
    setCopied(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center">
                  {step === 'pix' ? (
                    <QrCode className="w-5 h-5 text-white" />
                  ) : step === 'success' ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step === 'form' && 'Comprar com PIX'}
                    {step === 'pix' && 'Pagamento PIX'}
                    {step === 'success' && 'Pagamento Confirmado!'}
                    {step === 'error' && 'Erro no Pagamento'}
                  </h3>
                  <p className="text-sm text-gray-600">{gift.name}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Form Step */}
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center gap-3">
                    {gift.image_url && (
                      <Image
                        src={gift.image_url}
                        alt={gift.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{gift.name}</h4>
                      <p className="text-sm text-gray-600">{gift.description}</p>
                      <p className="text-lg font-semibold text-purple-600 mt-1">
                        {formatBRL(gift.price)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seu nome *
                    </label>
                    <input
                      type="text"
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor
                    </label>
                    <input
                      type="number"
                      value={buyerInfo.amount}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                      max={gift.price}
                      step="0.01"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Voce pode contribuir com qualquer valor ate {formatBRL(gift.price)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem para os noivos (opcional)
                    </label>
                    <textarea
                      value={buyerInfo.message}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="Deixe uma mensagem carinhosa para Hel & Ylana..."
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreatePixPayment}
                  disabled={loading || !buyerInfo.name || !buyerInfo.email}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gerando PIX...
                    </div>
                  ) : (
                    `Gerar PIX - ${formatBRL(buyerInfo.amount)}`
                  )}
                </Button>
              </motion.div>
            )}

            {/* PIX Payment Step */}
            {step === 'pix' && paymentData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* QR Code */}
                <div className="text-center">
                  {paymentData.mercadoPago.qrCodeImage ? (
                    <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-purple-100">
                      <Image
                        src={paymentData.mercadoPago.qrCodeImage}
                        alt="QR Code PIX"
                        width={256}
                        height={256}
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-64 h-64 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-medium text-gray-900 mb-2">Como pagar:</h4>
                  <ol className="text-sm text-gray-700 space-y-1">
                    <li>1. Abra o app do seu banco</li>
                    <li>2. Escaneie o QR Code acima</li>
                    <li>3. Confirme o pagamento</li>
                    <li>4. Aguarde a confirmacao automatica</li>
                  </ol>
                </div>

                {/* PIX Code */}
                {paymentData.mercadoPago.pixCode && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      Ou copie o codigo PIX:
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg border text-sm font-mono break-all">
                        {paymentData.mercadoPago.pixCode}
                      </div>
                      <Button
                        onClick={copyPixCode}
                        variant="outline"
                        className="px-3"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    {copied && (
                      <p className="text-sm text-green-600">Codigo copiado!</p>
                    )}
                  </div>
                )}

                {/* Status */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {statusChecking ? 'Verificando pagamento...' : 'Aguardando pagamento'}
                  </div>
                  {statusChecking && (
                    <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto" />
                  )}
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Presente:</span>
                    <span className="font-medium">{paymentData.gift.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-medium">{formatBRL(buyerInfo.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Comprador:</span>
                    <span className="font-medium">{buyerInfo.name}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-white" />
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Pagamento Confirmado!
                  </h4>
                  <p className="text-gray-600">
                    Obrigado por presentear Hel & Ylana!
                  </p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Presente confirmado</span>
                  </div>
                  <p className="text-sm text-gray-700">{gift.name}</p>
                  <p className="text-lg font-semibold text-purple-600 mt-1">
                    {formatBRL(buyerInfo.amount)}
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Voces receberao um e-mail de confirmacao em breve.
                </p>

                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium"
                >
                  Fechar
                </Button>
              </motion.div>
            )}

            {/* Error Step */}
            {step === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto">
                  <X className="w-10 h-10 text-white" />
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Erro no Pagamento
                  </h4>
                  <p className="text-gray-600">
                    Ocorreu um erro ao processar seu pagamento.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => setStep('form')}
                    className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium"
                  >
                    Tentar Novamente
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outline"
                    className="w-full"
                  >
                    Fechar
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}