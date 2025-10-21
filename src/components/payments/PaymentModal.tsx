'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, QrCode, Copy, Check, Heart, Clock, CreditCard, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GiftWithProgress } from '@/lib/services/gifts'
import Image from 'next/image'
import { CreditCardForm } from './CreditCardForm'
import { PaymentMethodOption, PaymentMethodSelector } from './PaymentMethodSelector'
import type { Database } from '@/types/supabase'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  gift: GiftWithProgress
  onPaymentSuccess: (paymentId: string) => void
}

type PaymentRecord = Database['public']['Tables']['payments']['Row']

interface PaymentData {
  payment: PaymentRecord
  mercadoPago: {
    paymentId: string
    status: string
    pixCode?: string
    qrCodeBase64?: string
    qrCodeImage?: string
    statusDetail?: string
    installments?: number
    paymentMethodId?: string
    issuerId?: string
  }
  gift: {
    id: string
    name: string
    price: number
  }
}

export default function PaymentModal({ isOpen, onClose, gift, onPaymentSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'pix' | 'card' | 'success' | 'error'>('form')
  const [loading, setLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [copied, setCopied] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    amount: 0, // Start with no amount selected
    message: ''
  })
  const [statusChecking, setStatusChecking] = useState(false)
  const [showCustomAmount, setShowCustomAmount] = useState(false)
  const [selectedSuggestedAmount, setSelectedSuggestedAmount] = useState<number | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodOption>('pix')

  // Check payment status every 5 seconds when showing PIX
  useEffect(() => {
    if (step === 'pix' && paymentData?.mercadoPago.paymentId) {
      const interval = setInterval(async () => {
        try {
          setStatusChecking(true)
          console.log('🔍 Status polling - paymentData:', {
            internalId: paymentData.payment?.id,
            mercadoPagoId: paymentData.payment?.mercado_pago_payment_id,
            mercadoPagoIdFromMercadoPago: paymentData.mercadoPago?.paymentId,
            fullPaymentObject: paymentData.payment
          })
          const response = await fetch(`/api/payments/status?paymentId=${paymentData.payment.id}`)
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

  const handleContinue = async () => {
    if (selectedMethod === 'pix') {
      await handleCreatePixPayment()
    } else {
      setStep('card')
    }
  }

  const handleCreatePixPayment = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/payments/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sanityGiftId: gift._id,
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

  const handleCreditCardPayment = async (cardDetails: {
    token: string
    paymentMethodId: string
    issuerId?: string
    installments: number
    identificationType: string
    identificationNumber: string
    cardholderName: string
  }) => {
    if (!buyerInfo.amount || buyerInfo.amount < 50) {
      throw new Error('Escolha um valor válido para continuar.')
    }

    const response = await fetch('/api/payments/create-credit-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sanityGiftId: gift._id,
        amount: buyerInfo.amount,
        payerEmail: buyerInfo.email,
        buyerName: buyerInfo.name,
        message: buyerInfo.message,
        installments: cardDetails.installments,
        cardToken: cardDetails.token,
        paymentMethodId: cardDetails.paymentMethodId,
        issuerId: cardDetails.issuerId,
        identificationType: cardDetails.identificationType,
        identificationNumber: cardDetails.identificationNumber,
        cardholderName: cardDetails.cardholderName
      })
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || result.details || 'Falha ao processar pagamento com cartão.')
    }

    setPaymentData(result)
    setStep('success')
    onPaymentSuccess(result.payment.id)
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
      amount: 0,
      message: ''
    })
    setCopied(false)
    setShowCustomAmount(false)
    setSelectedSuggestedAmount(null)
    setSelectedMethod('pix')
  }

  // Handle selecting a suggested amount
  const handleSelectAmount = (amount: number) => {
    setSelectedSuggestedAmount(amount)
    setBuyerInfo({ ...buyerInfo, amount })
    setShowCustomAmount(false)
  }

  // Handle selecting custom amount option
  const handleSelectCustom = () => {
    setShowCustomAmount(true)
    setSelectedSuggestedAmount(null)
    setBuyerInfo({ ...buyerInfo, amount: 0 })
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
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
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
                    {step === 'form' && (selectedMethod === 'pix' ? 'Contribuir com PIX' : 'Contribuir com Cartão')}
                    {step === 'pix' && 'Pagamento PIX'}
                    {step === 'card' && 'Pagamento com Cartão'}
                    {step === 'success' && 'Contribuição Confirmada!'}
                    {step === 'error' && 'Erro no Pagamento'}
                  </h3>
                  <p className="text-sm text-gray-600">{gift.title}</p>
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
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    {gift.imageUrl && (
                      <Image
                        src={gift.imageUrl}
                        alt={gift.title}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{gift.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{gift.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600">Meta do presente:</p>
                      <p className="text-lg font-semibold text-gray-700">
                        {formatBRL(gift.fullPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Já arrecadado:</p>
                      <p className="text-base font-medium text-gray-700">
                        {formatBRL(gift.totalContributed)} ({Math.round(gift.percentFunded)}%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contribution Amount Selection - Prominent */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      💝 Escolha o valor da sua contribuição *
                    </label>
                    <p className="text-xs text-gray-600 mb-3">
                      Contribua com qualquer valor! Muitos convidados juntos tornam esse sonho realidade.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {(gift.suggestedContributions || [100, 250, 500, 1000]).map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleSelectAmount(amount)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            selectedSuggestedAmount === amount
                              ? 'border-gray-700 bg-gray-100 shadow-md'
                              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900">{formatBRL(amount)}</p>
                            {amount === gift.remainingAmount && (
                              <p className="text-xs text-green-600 mt-1">✨ Completa o presente!</p>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleSelectCustom}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 col-span-2 ${
                          showCustomAmount
                            ? 'border-gray-700 bg-gray-100 shadow-md'
                            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-base font-semibold text-gray-900">💖 Outro valor</p>
                        <p className="text-xs text-gray-600 mt-1">Escolha quanto você quer contribuir</p>
                      </button>
                    </div>
                  </div>

                  {/* Custom Amount Input - Only shows when custom is selected */}
                  {showCustomAmount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Digite o valor personalizado
                      </label>
                      <input
                        type="number"
                        value={buyerInfo.amount || ''}
                        onChange={(e) => setBuyerInfo({ ...buyerInfo, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        min="50"
                        max={gift.remainingAmount}
                        step="10"
                        placeholder="Mínimo R$ 50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Valor mínimo: R$ 50 • Falta: {formatBRL(gift.remainingAmount)}
                      </p>
                    </motion.div>
                  )}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem para os noivos (opcional)
                    </label>
                    <textarea
                      value={buyerInfo.message}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, message: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      rows={3}
                      placeholder="Deixe uma mensagem carinhosa para Hel & Ylana..."
                    />
                  </div>
                </div>

                <PaymentMethodSelector
                  value={selectedMethod}
                  onChange={(method) => setSelectedMethod(method)}
                />

                <Button
                  onClick={handleContinue}
                  disabled={
                    loading ||
                    !buyerInfo.name ||
                    !buyerInfo.email ||
                    !buyerInfo.amount ||
                    buyerInfo.amount < 50
                  }
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Gerando PIX...
                    </div>
                  ) : buyerInfo.amount > 0 ? (
                    selectedMethod === 'pix'
                      ? `Contribuir ${formatBRL(buyerInfo.amount)} via PIX`
                      : `Continuar para pagar ${formatBRL(buyerInfo.amount)} com cartão`
                  ) : (
                    'Escolha um valor para continuar'
                  )}
                </Button>
              </motion.div>
            )}

            {/* Credit Card Payment Step */}
            {step === 'card' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Ajustar valor ou dados do convidado
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod('pix')
                      setStep('form')
                    }}
                    className="text-xs text-gray-500 hover:text-gray-800"
                  >
                    Prefere pagar com PIX?
                  </button>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Presente:</span>
                    <span className="font-medium text-gray-800">{gift.title}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Contribuição:</span>
                    <span className="font-semibold text-gray-900">{formatBRL(buyerInfo.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Nome:</span>
                    <span className="font-medium text-gray-800">{buyerInfo.name}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Email:</span>
                    <span className="font-medium text-gray-800">{buyerInfo.email}</span>
                  </div>
                </div>

                <CreditCardForm
                  amount={buyerInfo.amount}
                  buyerName={buyerInfo.name}
                  buyerEmail={buyerInfo.email}
                  onSubmit={handleCreditCardPayment}
                />
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
                    <div className="inline-block p-4 bg-white rounded-xl shadow-lg border-2 border-gray-200">
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
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
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
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
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
                    Contribuição Confirmada!
                  </h4>
                  <p className="text-gray-600">
                    Obrigado por contribuir para o sonho de Hel & Ylana! 💝
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-700 mb-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Sua contribuição</span>
                  </div>
                  <p className="text-sm text-gray-700">{gift.title}</p>
                  <p className="text-lg font-semibold text-gray-700 mt-1">
                    {formatBRL(buyerInfo.amount)}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Junto com outros convidados, você está ajudando a tornar esse sonho realidade!
                  </p>
                </div>

                <p className="text-sm text-gray-600">
                  Você receberá um e-mail de confirmação em breve.
                </p>

                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-3 rounded-xl font-medium"
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
                    className="w-full bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white py-3 rounded-xl font-medium"
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
