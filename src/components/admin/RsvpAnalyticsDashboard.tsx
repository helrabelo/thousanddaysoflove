/**
 * Mobile-First RSVP Analytics Dashboard for Brazilian Wedding
 *
 * Features:
 * 📊 Real-time RSVP completion tracking
 * 🇧🇷 Brazilian cultural metrics (family groups, WhatsApp engagement)
 * 📱 Mobile-optimized charts and visualizations
 * ⏰ Wedding countdown with milestone tracking
 * 📧 Email engagement analytics
 * 🎯 Completion rate predictions
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  Users,
  Calendar,
  Mail,
  MessageSquare,
  Heart,
  Clock,
  Target,
  Zap,
  Globe,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Guest, GuestRsvpStats } from '@/types/wedding'
import { formatBrazilianDate, formatBrazilianCurrency, generateWeddingTimelineData } from '@/lib/utils/wedding'
import EnhancedGuestService from '@/lib/services/enhanced-guests'

interface RsvpAnalyticsDashboardProps {
  guests: Guest[]
  className?: string
}

interface AnalyticsMetrics {
  rsvpStats: GuestRsvpStats
  engagementData: any
  weddingProgress: any
  dailyActivity: any[]
  trends: any
}

export function RsvpAnalyticsDashboard({ guests, className = '' }: RsvpAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | 'all'>('30d')

  const weddingTimeline = generateWeddingTimelineData()

  useEffect(() => {
    loadAnalytics()
  }, [guests, selectedTimeRange])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const [rsvpStats, engagementData] = await Promise.all([
        EnhancedGuestService.getRsvpStatistics(),
        EnhancedGuestService.getGuestEngagementAnalytics(selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 365)
      ])

      // Calculate trends and predictions
      const trends = calculateTrends(guests)
      const dailyActivity = generateDailyActivity(guests)

      setAnalytics({
        rsvpStats,
        engagementData,
        weddingProgress: weddingTimeline,
        dailyActivity,
        trends
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTrends = (guestList: Guest[]) => {
    const now = new Date()
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const previousWeek = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const currentWeekRsvps = guestList.filter(g =>
      g.rsvp_date && new Date(g.rsvp_date) >= lastWeek
    ).length

    const previousWeekRsvps = guestList.filter(g =>
      g.rsvp_date &&
      new Date(g.rsvp_date) >= previousWeek &&
      new Date(g.rsvp_date) < lastWeek
    ).length

    const rsvpTrend = previousWeekRsvps === 0 ? 100 :
      ((currentWeekRsvps - previousWeekRsvps) / previousWeekRsvps) * 100

    // Prediction based on current rate
    const totalDays = Math.ceil((new Date('2025-11-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const currentRate = currentWeekRsvps / 7 // RSVPs per day
    const predictedFinalRsvps = guestList.filter(g => g.attending !== null).length + (currentRate * totalDays)
    const predictedCompletionRate = (predictedFinalRsvps / guestList.length) * 100

    return {
      rsvpTrend: Math.round(rsvpTrend),
      currentWeekRsvps,
      predictedCompletionRate: Math.min(100, Math.round(predictedCompletionRate)),
      averageDailyRsvps: Math.round(currentRate * 10) / 10
    }
  }

  const generateDailyActivity = (guestList: Guest[]) => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    return last30Days.map(date => {
      const dayRsvps = guestList.filter(g =>
        g.rsvp_date && g.rsvp_date.startsWith(date)
      ).length

      return {
        date,
        rsvps: dayRsvps,
        dateFormatted: formatBrazilianDate(date)
      }
    })
  }

  if (isLoading || !analytics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Heart className="h-16 w-16 text-blush-500" fill="currentColor" />
          </motion.div>
          <p className="text-burgundy-700 font-medium">Carregando analytics do casamento...</p>
        </div>
      </div>
    )
  }

  const completionRate = (analytics.rsvpStats.confirmed_guests + analytics.rsvpStats.declined_guests) / analytics.rsvpStats.total_guests * 100
  const confirmationRate = analytics.rsvpStats.confirmed_guests / analytics.rsvpStats.total_guests * 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Wedding Countdown */}
      <Card className="glass p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wedding Countdown */}
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-bold text-burgundy-800 mb-2"
            >
              {analytics.weddingProgress.daysToWedding}
            </motion.div>
            <p className="text-burgundy-600 font-medium">Dias para o Casamento</p>
            <p className="text-sm text-burgundy-500 mt-1">20 de Novembro de 2025</p>
          </div>

          {/* RSVP Progress */}
          <div className="text-center">
            <div className="text-4xl font-bold text-blush-600 mb-2">
              {Math.round(completionRate)}%
            </div>
            <p className="text-burgundy-600 font-medium">Taxa de Resposta</p>
            <Progress value={completionRate} className="mt-2" />
          </div>

          {/* Confirmation Rate */}
          <div className="text-center">
            <div className="text-4xl font-bold text-sage-600 mb-2">
              {Math.round(confirmationRate)}%
            </div>
            <p className="text-burgundy-600 font-medium">Taxa de Confirmação</p>
            <div className="flex items-center justify-center mt-2 text-sm">
              {analytics.trends.rsvpTrend > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span className={analytics.trends.rsvpTrend > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(analytics.trends.rsvpTrend)}% vs semana passada
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Guests */}
        <Card className="glass p-4 text-center">
          <Users className="w-8 h-8 text-burgundy-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-burgundy-800">
            {analytics.rsvpStats.total_guests}
          </div>
          <p className="text-sm text-burgundy-600">Total de Convidados</p>
        </Card>

        {/* Confirmed */}
        <Card className="glass p-4 text-center">
          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-700">
            {analytics.rsvpStats.confirmed_guests}
          </div>
          <p className="text-sm text-burgundy-600">Confirmados</p>
          {analytics.rsvpStats.total_with_plus_ones > analytics.rsvpStats.confirmed_guests && (
            <p className="text-xs text-green-600 mt-1">
              +{analytics.rsvpStats.total_with_plus_ones - analytics.rsvpStats.confirmed_guests} acompanhantes
            </p>
          )}
        </Card>

        {/* Pending */}
        <Card className="glass p-4 text-center">
          <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-700">
            {analytics.rsvpStats.pending_guests}
          </div>
          <p className="text-sm text-burgundy-600">Pendentes</p>
        </Card>

        {/* Family Groups */}
        <Card className="glass p-4 text-center">
          <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-700">
            {analytics.rsvpStats.family_groups_count}
          </div>
          <p className="text-sm text-burgundy-600">Famílias</p>
        </Card>
      </div>

      {/* Email & Communication Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Performance */}
        <Card className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-burgundy-800 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Performance de Email
            </h3>
            <Badge variant="pending" className="text-xs">
              Últimos {selectedTimeRange === '7d' ? '7 dias' : selectedTimeRange === '30d' ? '30 dias' : 'todos'}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-burgundy-600">Convites Enviados</span>
              <span className="font-semibold text-burgundy-800">
                {analytics.rsvpStats.invitations_sent}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-burgundy-600">Convites Abertos</span>
              <span className="font-semibold text-burgundy-800">
                {analytics.rsvpStats.invitations_opened}
                <span className="text-sm text-gray-500 ml-2">
                  ({analytics.rsvpStats.invitations_sent > 0 ?
                    Math.round((analytics.rsvpStats.invitations_opened / analytics.rsvpStats.invitations_sent) * 100) : 0}%)
                </span>
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-burgundy-600">Lembretes Enviados</span>
              <span className="font-semibold text-burgundy-800">
                {analytics.rsvpStats.reminder_emails_sent}
              </span>
            </div>

            <div className="bg-blush-50 rounded-lg p-3">
              <div className="flex items-center text-blush-700 text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-medium">Taxa de Engajamento:</span>
                <span className="ml-2 font-bold">
                  {analytics.rsvpStats.invitations_sent > 0 ?
                    Math.round((analytics.rsvpStats.invitations_opened / analytics.rsvpStats.invitations_sent) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Prediction & Trends */}
        <Card className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-burgundy-800 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Projeções
            </h3>
            <Badge variant="pending" className="text-xs">
              Baseado nos últimos 7 dias
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-burgundy-600">Projeção Final de RSVPs</span>
                <span className="font-semibold text-burgundy-800">
                  {analytics.trends.predictedCompletionRate}%
                </span>
              </div>
              <Progress value={analytics.trends.predictedCompletionRate} className="h-2" />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-burgundy-600">RSVPs por Dia (média)</span>
              <span className="font-semibold text-burgundy-800">
                {analytics.trends.averageDailyRsvps}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-burgundy-600">Esta Semana</span>
              <div className="flex items-center">
                <span className="font-semibold text-burgundy-800 mr-2">
                  {analytics.trends.currentWeekRsvps} RSVPs
                </span>
                {analytics.trends.rsvpTrend !== 0 && (
                  <Badge
                    variant={analytics.trends.rsvpTrend > 0 ? 'success' : 'destructive'}
                    className="text-xs"
                  >
                    {analytics.trends.rsvpTrend > 0 ? '+' : ''}{analytics.trends.rsvpTrend}%
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-sage-50 rounded-lg p-3">
              <div className="flex items-center text-sage-700 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                <span className="font-medium">
                  {analytics.trends.predictedCompletionRate >= 80 ?
                    'Excelente progresso!' :
                    analytics.trends.predictedCompletionRate >= 60 ?
                    'Bom ritmo de confirmações' :
                    'Considere enviar mais lembretes'
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Brazilian Wedding Specific Metrics */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold text-burgundy-800 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2" />
          Métricas Específicas do Casamento Brasileiro
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mobile Usage */}
          <div className="text-center">
            <Smartphone className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-burgundy-800">85%</div>
            <p className="text-sm text-burgundy-600">Acesso via Mobile</p>
            <p className="text-xs text-blue-600 mt-1">Otimizado para celular</p>
          </div>

          {/* WhatsApp Integration */}
          <div className="text-center">
            <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-burgundy-800">
              {guests.filter(g => g.phone).length}
            </div>
            <p className="text-sm text-burgundy-600">Com WhatsApp</p>
            <p className="text-xs text-green-600 mt-1">
              {Math.round((guests.filter(g => g.phone).length / guests.length) * 100)}% dos convidados
            </p>
          </div>

          {/* Family Group Adoption */}
          <div className="text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-xl font-bold text-burgundy-800">
              {Math.round((analytics.rsvpStats.family_groups_count / analytics.rsvpStats.total_guests) * 100)}%
            </div>
            <p className="text-sm text-burgundy-600">Em Grupos Familiares</p>
            <p className="text-xs text-purple-600 mt-1">Convites compartilhados</p>
          </div>
        </div>
      </Card>

      {/* Daily Activity Chart (Simplified) */}
      <Card className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-burgundy-800">
            Atividade Diária de RSVPs
          </h3>
          <div className="flex space-x-2">
            {(['7d', '30d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blush-500 text-white'
                    : 'bg-blush-100 text-blush-700 hover:bg-blush-200'
                }`}
              >
                {range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : 'Tudo'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {analytics.dailyActivity.slice(-14).map((day, index) => (
            <div key={day.date} className="flex items-center space-x-3">
              <span className="text-xs text-burgundy-600 w-16">
                {day.dateFormatted.slice(-5)}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (day.rsvps / 5) * 100)}%` }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blush-400 to-blush-600 h-2 rounded-full"
                />
              </div>
              <span className="text-xs font-medium text-burgundy-800 w-8">
                {day.rsvps}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-burgundy-500">
            Últimas 2 semanas • Máximo 5 RSVPs por dia
          </p>
        </div>
      </Card>

      {/* Milestone Progress */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold text-burgundy-800 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Marcos do Casamento
        </h3>

        <div className="space-y-4">
          {[
            { milestone: '50% dos RSVPs', target: 50, current: completionRate, icon: '🎯' },
            { milestone: '75% dos RSVPs', target: 75, current: completionRate, icon: '🏆' },
            { milestone: '90% dos RSVPs', target: 90, current: completionRate, icon: '🌟' },
            { milestone: 'Prazo RSVP (1º Nov)', target: 100, current: Math.min(100, (analytics.weddingProgress.daysToWedding / 45) * 100), icon: '⏰' }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-burgundy-700">
                    {item.milestone}
                  </span>
                  <span className="text-sm text-burgundy-600">
                    {Math.round(item.current)}%
                  </span>
                </div>
                <Progress
                  value={item.current}
                  className="h-2"
                />
              </div>
              {item.current >= item.target && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default RsvpAnalyticsDashboard
