'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PaymentConfirmation from '@/components/payments/PaymentConfirmation'
import { PaymentService } from '@/lib/services/payments'

function PaymentConfirmationContent() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const paymentId = searchParams.get('payment')
  const mercadoPagoId = searchParams.get('mp')

  useEffect(() => {
    loadPaymentData()
  }, [paymentId, mercadoPagoId])

  const loadPaymentData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!paymentId && !mercadoPagoId) {
        throw new Error('ID do pagamento não fornecido')
      }

      const response = await fetch(`/api/payments/status?${paymentId ? `paymentId=${paymentId}` : `mercadoPagoId=${mercadoPagoId}`}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Erro ao carregar dados do pagamento')
      }

      const payment = result.payment

      // Format payment data for the confirmation component
      const formattedData = {
        paymentId: payment.id,
        giftName: payment.gifts?.name || 'Presente',
        amount: payment.amount,
        buyerName: payment.guests?.name || 'Convidado',
        buyerEmail: payment.guests?.email || 'convidado@casamento.com',
        paymentDate: payment.created_at
      }

      setPaymentData(formattedData)

    } catch (error) {
      console.error('Error loading payment data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando dados do pagamento...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
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
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 flex items-center justify-center p-4">
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
    )
  }

  return <PaymentConfirmation paymentData={paymentData} />
}

export default function PaymentConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Carregando confirmacao de pagamento...</p>
        </div>
      </div>
    }>
      <PaymentConfirmationContent />
    </Suspense>
  )
}