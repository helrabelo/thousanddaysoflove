'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Gift, CreditCard, Calendar, TrendingUp, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface Analytics {
  guests: {
    total: number
    confirmed: number
    declined: number
    pending: number
    totalWithPlusOnes: number
  }
  gifts: {
    total: number
    purchased: number
    remaining: number
    totalValue: number
    purchasedValue: number
  }
  payments: {
    total: number
    completed: number
    pending: number
    totalAmount: number
  }
  wedding: {
    daysToWedding: number
  }
}

interface SimpleGuest {
  id: string
  attending: boolean | null
  plus_ones: number | null
}

interface GiftItem {
  id: string
  price: number
  quantity_desired: number | null
  quantity_purchased: number | null
}

interface PaymentItem {
  id: string
  status: string
  amount: number
}

export default function AdminAnalytics(): JSX.Element {
  const [analytics, setAnalytics] = useState<Analytics>({
    guests: { total: 0, confirmed: 0, declined: 0, pending: 0, totalWithPlusOnes: 0 },
    gifts: { total: 0, purchased: 0, remaining: 0, totalValue: 0, purchasedValue: 0 },
    payments: { total: 0, completed: 0, pending: 0, totalAmount: 0 },
    wedding: { daysToWedding: 0 }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async (): Promise<void> => {
    setLoading(true)
    try {
      const supabase = createClient()

      // Load guests
      const { data: guests } = await supabase.from('simple_guests').select<'*', SimpleGuest>('*')
      const confirmed = guests?.filter(g => g.attending === true) || []
      const declined = guests?.filter(g => g.attending === false) || []
      const pending = guests?.filter(g => g.attending === null) || []
      const totalWithPlusOnes = confirmed.reduce((sum, g) => sum + (g.plus_ones || 0) + 1, 0)

      // Load gifts
      const { data: gifts } = await supabase.from('gifts').select<'*', GiftItem>('*')
      const purchased =
        gifts?.filter((g) => (g.quantity_purchased ?? 0) > 0) || []
      const totalValue =
        gifts?.reduce((sum, g) => sum + g.price * (g.quantity_desired ?? 1), 0) || 0
      const purchasedValue = purchased.reduce(
        (sum, g) => sum + g.price * (g.quantity_purchased ?? 0),
        0
      )

      // Load payments
      const { data: payments } = await supabase.from('payments').select<'*', PaymentItem>('*')
      const completed = payments?.filter(p => p.status === 'completed') || []
      const pendingPayments = payments?.filter(p => p.status === 'pending') || []
      const totalAmount = completed.reduce((sum, p) => sum + p.amount, 0)

      // Calculate days to wedding
      const weddingDate = new Date('2025-11-20T00:00:00')
      const today = new Date()
      const daysToWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      setAnalytics({
        guests: {
          total: guests?.length || 0,
          confirmed: confirmed.length,
          declined: declined.length,
          pending: pending.length,
          totalWithPlusOnes
        },
        gifts: {
          total: gifts?.length || 0,
          purchased: purchased.length,
          remaining: (gifts?.length || 0) - purchased.length,
          totalValue,
          purchasedValue
        },
        payments: {
          total: payments?.length || 0,
          completed: completed.length,
          pending: pendingPayments.length,
          totalAmount
        },
        wedding: {
          daysToWedding
        }
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
      alert('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
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
            Analytics do Casamento
          </h1>
          <p className="text-burgundy-600 mt-2">Estatísticas completas dos mil dias</p>
        </div>

        {/* Wedding Countdown */}
        <Card className="glass p-8 text-center mb-8">
          <Calendar className="w-12 h-12 text-blush-500 mx-auto mb-4" />
          <h2 className="text-5xl font-bold text-burgundy-800 mb-2">
            {analytics.wedding.daysToWedding}
          </h2>
          <p className="text-xl text-burgundy-600">
            Dias para a Casa HY
          </p>
          <p className="text-sm text-burgundy-500 mt-2">
            20 de Novembro de 2025 - Casa HY
          </p>
        </Card>

        {/* Guests Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-burgundy-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Convidados
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-burgundy-800">{analytics.guests.total}</h3>
              <p className="text-burgundy-600">Total</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-green-600">{analytics.guests.confirmed}</h3>
              <p className="text-burgundy-600">Confirmados</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-yellow-600">{analytics.guests.pending}</h3>
              <p className="text-burgundy-600">Pendentes</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-blush-600">{analytics.guests.totalWithPlusOnes}</h3>
              <p className="text-burgundy-600">Com Acompanhantes</p>
            </Card>
          </div>
        </div>

        {/* Gifts Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-burgundy-800 mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6" />
            Lista de Presentes
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-burgundy-800">{analytics.gifts.total}</h3>
              <p className="text-burgundy-600">Total</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-green-600">{analytics.gifts.purchased}</h3>
              <p className="text-burgundy-600">Comprados</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-gray-600">
                R$ {(analytics.gifts.totalValue / 1000).toFixed(1)}k
              </h3>
              <p className="text-burgundy-600">Valor Total</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-blush-600">
                R$ {(analytics.gifts.purchasedValue / 1000).toFixed(1)}k
              </h3>
              <p className="text-burgundy-600">Recebido</p>
            </Card>
          </div>
        </div>

        {/* Payments Analytics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-burgundy-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Pagamentos
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-burgundy-800">{analytics.payments.total}</h3>
              <p className="text-burgundy-600">Total</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-green-600">{analytics.payments.completed}</h3>
              <p className="text-burgundy-600">Confirmados</p>
            </Card>
            <Card className="glass p-6 text-center">
              <h3 className="text-3xl font-bold text-blush-600">
                R$ {(analytics.payments.totalAmount / 1000).toFixed(1)}k
              </h3>
              <p className="text-burgundy-600">Total Recebido</p>
            </Card>
          </div>
        </div>

        {/* Progress Summary */}
        <Card className="glass p-8 text-center">
          <Heart className="w-12 h-12 text-blush-500 mx-auto mb-4" fill="currentColor" />
          <h2 className="text-2xl font-bold text-burgundy-800 mb-4">
            Progresso do Casamento
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-burgundy-600">Taxa de Confirmação</p>
              <p className="text-2xl font-bold text-burgundy-800">
                {analytics.guests.total > 0
                  ? Math.round((analytics.guests.confirmed / analytics.guests.total) * 100)
                  : 0}%
              </p>
            </div>
            <div>
              <TrendingUp className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-burgundy-600">Presentes Adquiridos</p>
              <p className="text-2xl font-bold text-burgundy-800">
                {analytics.gifts.total > 0
                  ? Math.round((analytics.gifts.purchased / analytics.gifts.total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
