'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface Payment {
  id: string
  gift_id: string
  guest_name: string
  amount: number
  payment_method: string
  status: string
  pix_code: string | null
  mercado_pago_id: string | null
  created_at: string
  confirmed_at: string | null
}

export default function AdminPagamentos() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
    completedAmount: 0
  })

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      const payments: Payment[] = (data || []).map(payment => ({
        id: payment.id,
        gift_id: payment.gift_id,
        guest_name: payment.guest_id || 'Anônimo', // Fallback if guest_name doesn't exist
        amount: payment.amount,
        payment_method: payment.payment_method,
        status: payment.status || 'pending',
        pix_code: null, // Not in current schema
        mercado_pago_id: payment.mercado_pago_payment_id,
        created_at: payment.created_at,
        confirmed_at: null // Not in current schema
      }))
      setPayments(payments)

      // Calculate stats
      const completed = payments.filter(p => p.status === 'completed')
      const pending = payments.filter(p => p.status === 'pending')
      const failed = payments.filter(p => p.status === 'failed')

      setStats({
        total: payments.length,
        completed: completed.length,
        pending: pending.length,
        failed: failed.length,
        totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
        completedAmount: completed.reduce((sum, p) => sum + p.amount, 0)
      })
    } catch (error) {
      console.error('Error loading payments:', error)
      showToast({ title: 'Erro ao carregar pagamentos', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Confirmado'
      case 'pending':
        return 'Pendente'
      case 'failed':
        return 'Falhou'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <p className="text-burgundy-700">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-burgundy-700 hover:text-blush-600 inline-block mb-4">
            ← Voltar ao Admin
          </Link>
          <h1 className="text-4xl font-playfair font-bold text-burgundy-800">
            Rastreamento de Pagamentos
          </h1>
          <p className="text-burgundy-600 mt-2">{payments.length} pagamentos registrados</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-burgundy-800">
              R$ {(stats.completedAmount / 1000).toFixed(1)}k
            </h3>
            <p className="text-burgundy-600">Recebido</p>
          </Card>

          <Card className="glass p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-burgundy-800">{stats.completed}</h3>
            <p className="text-burgundy-600">Confirmados</p>
          </Card>

          <Card className="glass p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-burgundy-800">{stats.pending}</h3>
            <p className="text-burgundy-600">Pendentes</p>
          </Card>

          <Card className="glass p-6 text-center">
            <CreditCard className="w-8 h-8 text-gray-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-burgundy-800">{stats.total}</h3>
            <p className="text-burgundy-600">Total</p>
          </Card>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="glass p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(payment.status)}
                    <h3 className="text-xl font-bold text-burgundy-800">
                      {payment.guest_name}
                    </h3>
                  </div>
                  <div className="text-sm text-burgundy-600 space-y-1">
                    <p>Valor: <span className="font-bold text-blush-600">R$ {payment.amount.toFixed(2)}</span></p>
                    <p>Método: {payment.payment_method.toUpperCase()}</p>
                    <p>Status: {getStatusText(payment.status)}</p>
                    <p>Data: {new Date(payment.created_at).toLocaleDateString('pt-BR')}</p>
                    {payment.confirmed_at && (
                      <p>Confirmado: {new Date(payment.confirmed_at).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                </div>
                {payment.pix_code && (
                  <div className="text-right">
                    <p className="text-xs text-burgundy-500 mb-1">Código PIX</p>
                    <code className="text-xs bg-burgundy-100 px-2 py-1 rounded">
                      {payment.pix_code.substring(0, 20)}...
                    </code>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {payments.length === 0 && (
          <Card className="glass p-12 text-center">
            <CreditCard className="w-16 h-16 text-burgundy-300 mx-auto mb-4" />
            <p className="text-burgundy-600">Nenhum pagamento registrado ainda</p>
          </Card>
        )}
      </div>
    </div>
  )
}
