'use client'

import { useEffect, useState, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import PaymentConfirmation from '@/components/payments/PaymentConfirmation'
import type { PaymentConfirmationData } from '@/components/payments/PaymentConfirmation'

type PaymentStatusSuccessResponse = {
  success: true
  payment: {
    id: string
    amount: number | string
    created_at: string
    guests?: { name?: string | null; email?: string | null } | null
    gifts?: { name?: string | null } | null
  }
}

type PaymentStatusErrorResponse = {
  success: false
  error?: string
}

type PaymentStatusResponse = PaymentStatusSuccessResponse | PaymentStatusErrorResponse

function PaymentConfirmationContent() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentConfirmationData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const paymentId = searchParams.get('payment')
  const mercadoPagoId = searchParams.get('mp')

  const loadPaymentData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!paymentId && !mercadoPagoId) {
        throw new Error('ID do pagamento não fornecido')
      }

      const queryParam = paymentId
        ? `paymentId=${encodeURIComponent(paymentId)}`
        : `mercadoPagoId=${encodeURIComponent(mercadoPagoId ?? '')}`

      const response = await fetch(`/api/payments/status?${queryParam}`)
      const result: PaymentStatusResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao carregar dados do pagamento')
      }

      const payment = result.payment

      const formattedData: PaymentConfirmationData = {
        paymentId: payment.id,
        giftName: payment.gifts?.name ?? 'Presente',
        amount: Number(payment.amount),
        buyerName: payment.guests?.name ?? 'Convidado',
        buyerEmail: payment.guests?.email ?? 'convidado@casamento.com',
        paymentDate: payment.created_at
      }

      setPaymentData(formattedData)
    } catch (loadError) {
      console.error('Error loading payment data:', loadError)
      const message = loadError instanceof Error ? loadError.message : 'Erro ao carregar dados do pagamento'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [mercadoPagoId, paymentId])

  useEffect(() => {
    void loadPaymentData()
  }, [loadPaymentData])

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Carregando dados do pagamento...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4 pt-32">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao Carregar Pagamento</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/presentes"
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 inline-block"
            >
              Voltar à Lista de Presentes
            </a>
          </div>
        </div>
      </>
    )
  }

  if (!paymentData) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center p-4 pt-32">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">❓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagamento Não Encontrado</h1>
            <p className="text-gray-600 mb-6">
              Não foi possível encontrar os dados deste pagamento.
            </p>
            <a
              href="/presentes"
              className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 inline-block"
            >
              Ver Lista de Presentes
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <PaymentConfirmation paymentData={paymentData} />
    </>
  )
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Carregando confirmacao de pagamento...</p>
          </div>
        </div>
      </>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  )
}
