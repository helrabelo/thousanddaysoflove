'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Clock,
  Users,
  Gift,
  DollarSign,
  Heart,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AnalyticsData {
  weddingProgress: {
    daysRemaining: number
    totalDays: number
    completionPercentage: number
  }
  guestAnalytics: {
    totalInvited: number
    confirmed: number
    declined: number
    pending: number
    confirmationRate: number
    lastWeekConfirmations: number
    topInvitationSources: Array<{ source: string; count: number }>
  }
  giftRegistryAnalytics: {
    totalGifts: number
    purchased: number
    available: number
    totalValue: number
    purchasedValue: number
    averageGiftValue: number
    popularCategories: Array<{ category: string; count: number; value: number }>
    recentPurchases: number
  }
  paymentAnalytics: {
    totalRevenue: number
    pendingRevenue: number
    completedPayments: number
    pendingPayments: number
    pixPercentage: number
    averagePaymentTime: string
    dailyRevenue: Array<{ date: string; amount: number }>
  }
  engagement: {
    websiteVisits: number
    rsvpPageViews: number
    giftRegistryViews: number
    averageSessionDuration: string
    mobileVsDesktop: { mobile: number; desktop: number }
  }
  milestones: {
    achieved: Array<{ name: string; date: string; description: string }>
    upcoming: Array<{ name: string; date: string; description: string }>
  }
}

export function WeddingAnalyticsTab() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const weddingDate = new Date('2025-11-20T00:00:00')
  const today = new Date()
  const daysRemaining = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics, timeRange])

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true)
    try {
      // TODO: Load real analytics data from various services
      // This would aggregate data from GuestService, GiftService, PaymentService, etc.

      const mockAnalytics: AnalyticsData = {
        weddingProgress: {
          daysRemaining,
          totalDays: 1000, // Representing the "1000 days of love" theme
          completionPercentage: Math.max(0, Math.min(100, ((1000 - daysRemaining) / 1000) * 100))
        },
        guestAnalytics: {
          totalInvited: 150,
          confirmed: 95,
          declined: 15,
          pending: 40,
          confirmationRate: 73.3,
          lastWeekConfirmations: 12,
          topInvitationSources: [
            { source: 'WhatsApp', count: 85 },
            { source: 'Email', count: 45 },
            { source: 'Convite Físico', count: 20 }
          ]
        },
        giftRegistryAnalytics: {
          totalGifts: 45,
          purchased: 28,
          available: 17,
          totalValue: 15500,
          purchasedValue: 9200,
          averageGiftValue: 344,
          popularCategories: [
            { category: 'Cozinha', count: 12, value: 4200 },
            { category: 'Casa', count: 8, value: 3100 },
            { category: 'Quarto', count: 5, value: 1500 },
            { category: 'Viagem', count: 2, value: 1200 },
            { category: 'Experiência', count: 1, value: 800 }
          ],
          recentPurchases: 8
        },
        paymentAnalytics: {
          totalRevenue: 9200,
          pendingRevenue: 1800,
          completedPayments: 25,
          pendingPayments: 7,
          pixPercentage: 87.5,
          averagePaymentTime: '2.3 min',
          dailyRevenue: [
            { date: '2024-09-21', amount: 250 },
            { date: '2024-09-22', amount: 400 },
            { date: '2024-09-23', amount: 150 },
            { date: '2024-09-24', amount: 300 },
            { date: '2024-09-25', amount: 500 },
            { date: '2024-09-26', amount: 200 },
            { date: '2024-09-27', amount: 350 }
          ]
        },
        engagement: {
          websiteVisits: 1240,
          rsvpPageViews: 320,
          giftRegistryViews: 890,
          averageSessionDuration: '4m 32s',
          mobileVsDesktop: { mobile: 78, desktop: 22 }
        },
        milestones: {
          achieved: [
            { name: 'Site Lançado', date: '2024-09-15', description: 'Website do casamento foi ao ar' },
            { name: 'Primeira Confirmação', date: '2024-09-16', description: 'Primeiro convidado confirmou presença' },
            { name: '50% dos Convites', date: '2024-09-20', description: 'Metade dos convidados confirmou' },
            { name: 'Primeiro Presente', date: '2024-09-18', description: 'Primeiro presente foi comprado' }
          ],
          upcoming: [
            { name: '100 Confirmações', date: '2024-10-05', description: 'Meta de 100 confirmações' },
            { name: 'Lista 75% Completa', date: '2024-10-15', description: '75% da lista de presentes' },
            { name: 'RSVP Deadline', date: '2024-10-25', description: 'Prazo final para confirmações' },
            { name: 'O Grande Dia!', date: '2025-11-20', description: 'Mil Dias de Amor - Casamento!' }
          ]
        }
      }

      setAnalytics(mockAnalytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [daysRemaining])

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (isLoading || !analytics) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blush-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-burgundy-700 font-medium">Carregando analytics do casamento...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
            Analytics do Casamento
          </h2>
          <p className="text-burgundy-600">
            Insights detalhados sobre o progresso do seu casamento
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-1">
            {(['7d', '30d', '90d', 'all'] as const).map(period => (
              <Button
                key={period}
                variant={timeRange === period ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(period)}
              >
                {period === 'all' ? 'Tudo' : period}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalytics}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Relatório
          </Button>
        </div>
      </div>

      {/* Wedding Progress Overview */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-blush-50 to-gray-50 border-blush-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-burgundy-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-blush-500" fill="currentColor" />
            Progresso até o Grande Dia
          </h3>
          <Badge variant="pending" className="text-lg px-4 py-2">
            {analytics.weddingProgress.daysRemaining} dias restantes
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-burgundy-800 mb-1">
              {analytics.weddingProgress.completionPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-burgundy-600">Progresso da Jornada</div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
              <div
                className="bg-gradient-to-r from-blush-500 to-gray-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analytics.weddingProgress.completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-burgundy-800 mb-1">
              20/11
            </div>
            <div className="text-sm text-burgundy-600">Data do Casamento</div>
            <div className="text-xs text-blush-600 mt-1">
              Novembro 2025
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-burgundy-800 mb-1">
              1000
            </div>
            <div className="text-sm text-burgundy-600">Dias de Amor</div>
            <div className="text-xs text-blush-600 mt-1">
              Celebrando o marco especial
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-sage-50 to-white border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <Users className="w-6 h-6 text-sage-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">
                {formatPercentage(analytics.guestAnalytics.confirmationRate)}
              </h3>
              <p className="text-sm text-burgundy-600">Taxa de Confirmação</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Esta semana</div>
              <div className="text-xs text-sage-600 font-medium">
                +{analytics.guestAnalytics.lastWeekConfirmations} confirmações
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Gift className="w-6 h-6 text-gray-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">
                {formatPercentage((analytics.giftRegistryAnalytics.purchased / analytics.giftRegistryAnalytics.totalGifts) * 100)}
              </h3>
              <p className="text-sm text-burgundy-600">Lista Completa</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Recentemente</div>
              <div className="text-xs text-gray-600 font-medium">
                +{analytics.giftRegistryAnalytics.recentPurchases} presentes
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <h3 className="text-xl font-bold text-burgundy-800">
                {formatBRL(analytics.paymentAnalytics.totalRevenue)}
              </h3>
              <p className="text-sm text-burgundy-600">Total Arrecadado</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">PIX</div>
              <div className="text-xs text-green-600 font-medium">
                {formatPercentage(analytics.paymentAnalytics.pixPercentage)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Activity className="w-6 h-6 text-blue-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">
                {analytics.engagement.websiteVisits}
              </h3>
              <p className="text-sm text-burgundy-600">Visitas ao Site</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Duração média</div>
              <div className="text-xs text-blue-600 font-medium">
                {analytics.engagement.averageSessionDuration}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Guest Analytics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-burgundy-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-sage-500" />
            Análise de Convidados
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-sage-600">{analytics.guestAnalytics.confirmed}</div>
                <div className="text-xs text-burgundy-600">Confirmados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{analytics.guestAnalytics.pending}</div>
                <div className="text-xs text-burgundy-600">Pendentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{analytics.guestAnalytics.declined}</div>
                <div className="text-xs text-burgundy-600">Declinaram</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-burgundy-800 mb-2">Fontes de Convite</h4>
              {analytics.guestAnalytics.topInvitationSources.map(source => (
                <div key={source.source} className="flex justify-between items-center py-1">
                  <span className="text-sm text-burgundy-700">{source.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sage-500 h-2 rounded-full"
                        style={{
                          width: `${(source.count / analytics.guestAnalytics.totalInvited) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-burgundy-800">{source.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Gift Registry Analytics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-burgundy-800 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-gray-500" />
            Análise da Lista de Presentes
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-gray-600">
                  {formatBRL(analytics.giftRegistryAnalytics.averageGiftValue)}
                </div>
                <div className="text-xs text-burgundy-600">Valor Médio</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-600">
                  {formatBRL(analytics.giftRegistryAnalytics.purchasedValue)}
                </div>
                <div className="text-xs text-burgundy-600">Arrecadado</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-burgundy-800 mb-2">Categorias Populares</h4>
              {analytics.giftRegistryAnalytics.popularCategories.slice(0, 3).map(category => (
                <div key={category.category} className="flex justify-between items-center py-1">
                  <span className="text-sm text-burgundy-700">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-burgundy-600">{formatBRL(category.value)}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-500 h-2 rounded-full"
                        style={{
                          width: `${(category.count / analytics.giftRegistryAnalytics.totalGifts) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-burgundy-800">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Trend and Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-burgundy-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Tendência de Receita (7 dias)
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">
                  {formatBRL(analytics.paymentAnalytics.totalRevenue)}
                </div>
                <div className="text-xs text-burgundy-600">Total</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-600">
                  {formatBRL(analytics.paymentAnalytics.pendingRevenue)}
                </div>
                <div className="text-xs text-burgundy-600">Pendente</div>
              </div>
            </div>

            {/* Simple bar chart visualization */}
            <div className="space-y-2">
              {analytics.paymentAnalytics.dailyRevenue.map(day => (
                <div key={day.date} className="flex items-center gap-2">
                  <div className="text-xs text-burgundy-600 w-16">
                    {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${(day.amount / Math.max(...analytics.paymentAnalytics.dailyRevenue.map(d => d.amount))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-burgundy-800 w-20 text-right">
                    {formatBRL(day.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Engagement Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-burgundy-800 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Engajamento do Site
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-600">{analytics.engagement.websiteVisits}</div>
                <div className="text-xs text-burgundy-600">Total de Visitas</div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-600">{analytics.engagement.averageSessionDuration}</div>
                <div className="text-xs text-burgundy-600">Duração Média</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-burgundy-800 mb-2">Páginas Mais Visitadas</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-burgundy-700">Lista de Presentes</span>
                  <span className="text-sm font-medium text-burgundy-800">{analytics.engagement.giftRegistryViews}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-burgundy-700">RSVP</span>
                  <span className="text-sm font-medium text-burgundy-800">{analytics.engagement.rsvpPageViews}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-burgundy-800 mb-2">Dispositivos</h4>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{analytics.engagement.mobileVsDesktop.mobile}%</div>
                  <div className="text-xs text-burgundy-600">Mobile</div>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${analytics.engagement.mobileVsDesktop.mobile}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">{analytics.engagement.mobileVsDesktop.desktop}%</div>
                  <div className="text-xs text-burgundy-600">Desktop</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Milestones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-burgundy-800 mb-6 flex items-center gap-2">
          <Target className="w-5 h-5 text-blush-500" />
          Marcos da Jornada
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Achieved Milestones */}
          <div>
            <h4 className="font-medium text-burgundy-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sage-500" />
              Marcos Alcançados
            </h4>
            <div className="space-y-3">
              {analytics.milestones.achieved.map((milestone, index) => (
                <motion.div
                  key={milestone.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-sage-50 rounded-lg border-l-4 border-sage-500"
                >
                  <CheckCircle className="w-5 h-5 text-sage-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-burgundy-800">{milestone.name}</div>
                    <div className="text-sm text-burgundy-600">{milestone.description}</div>
                    <div className="text-xs text-sage-600 mt-1">
                      {new Date(milestone.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div>
            <h4 className="font-medium text-burgundy-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blush-500" />
              Próximos Marcos
            </h4>
            <div className="space-y-3">
              {analytics.milestones.upcoming.map((milestone, index) => (
                <motion.div
                  key={milestone.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-blush-50 rounded-lg border-l-4 border-blush-500"
                >
                  <Clock className="w-5 h-5 text-blush-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-burgundy-800">{milestone.name}</div>
                    <div className="text-sm text-burgundy-600">{milestone.description}</div>
                    <div className="text-xs text-blush-600 mt-1">
                      {new Date(milestone.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
