'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Gift,
  CreditCard,
  BarChart3,
  Settings,
  Heart,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

// Import specialized components
import { GuestManagementTab } from '@/components/admin/GuestManagementTab'
import { GiftRegistryTab } from '@/components/admin/GiftRegistryTab'
import { PaymentTrackingTab } from '@/components/admin/PaymentTrackingTab'
import { WeddingAnalyticsTab } from '@/components/admin/WeddingAnalyticsTab'
import { WeddingConfigTab } from '@/components/admin/WeddingConfigTab'

type AdminTab = 'guests' | 'gifts' | 'payments' | 'analytics' | 'config'

interface DashboardStats {
  guests: {
    total: number
    confirmed: number
    pending: number
    declined: number
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
    pixPayments: number
  }
  analytics: {
    rsvpCompletionRate: number
    averageGiftValue: number
    daysToWedding: number
    lastActivity: string
  }
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('guests')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    guests: { total: 0, confirmed: 0, pending: 0, declined: 0, totalWithPlusOnes: 0 },
    gifts: { total: 0, purchased: 0, remaining: 0, totalValue: 0, purchasedValue: 0 },
    payments: { total: 0, completed: 0, pending: 0, totalAmount: 0, pixPayments: 0 },
    analytics: { rsvpCompletionRate: 0, averageGiftValue: 0, daysToWedding: 0, lastActivity: '' }
  })

  const weddingDate = new Date('2025-11-11T00:00:00')
  const today = new Date()
  const daysToWedding = Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // TODO: Load real data from services
      // This would integrate with existing GuestService, GiftService, PaymentService

      // Simulated data for now - replace with actual API calls
      const mockStats: DashboardStats = {
        guests: {
          total: 150,
          confirmed: 85,
          pending: 45,
          declined: 20,
          totalWithPlusOnes: 140
        },
        gifts: {
          total: 45,
          purchased: 28,
          remaining: 17,
          totalValue: 15500,
          purchasedValue: 9200
        },
        payments: {
          total: 32,
          completed: 25,
          pending: 7,
          totalAmount: 9200,
          pixPayments: 28
        },
        analytics: {
          rsvpCompletionRate: 70,
          averageGiftValue: 329,
          daysToWedding,
          lastActivity: '2 horas atrás'
        }
      }

      setStats(mockStats)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    {
      id: 'guests' as AdminTab,
      label: 'Convidados',
      icon: Users,
      description: 'Gerenciar convidados e RSVPs',
      count: stats.guests.total
    },
    {
      id: 'gifts' as AdminTab,
      label: 'Lista de Presentes',
      icon: Gift,
      description: 'Gerenciar presentes e registro',
      count: stats.gifts.total
    },
    {
      id: 'payments' as AdminTab,
      label: 'Pagamentos',
      icon: CreditCard,
      description: 'Rastrear pagamentos PIX',
      count: stats.payments.total
    },
    {
      id: 'analytics' as AdminTab,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Estatísticas do casamento',
      count: null
    },
    {
      id: 'config' as AdminTab,
      label: 'Configurações',
      icon: Settings,
      description: 'Configurações do casamento',
      count: null
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Heart className="h-16 w-16 text-blush-500" fill="currentColor" />
          </motion.div>
          <p className="text-burgundy-700 font-medium">Carregando painel do casamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blush-500" fill="currentColor" />
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blush-600 to-burgundy-600 bg-clip-text text-transparent">
                  Admin Wedding Center
                </span>
                <div className="text-xs text-burgundy-600 font-medium">
                  Mil Dias de Amor • {daysToWedding} dias restantes
                </div>
              </div>
            </Link>
            <Link href="/" className="text-burgundy-700 hover:text-blush-600 transition-colors duration-300 font-medium">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-burgundy-800 mb-4"
            >
              Centro de Gestão do Casamento
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-burgundy-600"
            >
              Painel profissional para gerenciar seu dia especial
            </motion.p>
          </div>

          {/* Quick Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Wedding Countdown */}
            <Card className="glass p-6 text-center">
              <Calendar className="w-8 h-8 text-blush-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-burgundy-800">{daysToWedding}</h3>
              <p className="text-burgundy-600">Dias para o Casamento</p>
              <div className="mt-2 text-sm text-blush-600 font-medium">
                20 de Novembro, 2025
              </div>
            </Card>

            {/* RSVP Progress */}
            <Card className="glass p-6 text-center">
              <Users className="w-8 h-8 text-sage-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-burgundy-800">{stats.analytics.rsvpCompletionRate}%</h3>
              <p className="text-burgundy-600">Taxa de Confirmação</p>
              <div className="mt-2 text-sm text-sage-600 font-medium">
                {stats.guests.confirmed} de {stats.guests.total} confirmados
              </div>
            </Card>

            {/* Gift Registry Progress */}
            <Card className="glass p-6 text-center">
              <Gift className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-burgundy-800">{Math.round((stats.gifts.purchased / stats.gifts.total) * 100)}%</h3>
              <p className="text-burgundy-600">Presentes Comprados</p>
              <div className="mt-2 text-sm text-purple-600 font-medium">
                {stats.gifts.purchased} de {stats.gifts.total} presentes
              </div>
            </Card>

            {/* Revenue Tracking */}
            <Card className="glass p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-burgundy-800">
                R$ {(stats.payments.totalAmount / 1000).toFixed(1)}k
              </h3>
              <p className="text-burgundy-600">Valor Arrecadado</p>
              <div className="mt-2 text-sm text-green-600 font-medium">
                {stats.payments.completed} pagamentos PIX
              </div>
            </Card>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? 'primary' : 'outline'}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-3 transition-all duration-300 ${
                      isActive ? 'shadow-lg' : 'hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold flex items-center gap-2">
                        {tab.label}
                        {tab.count && (
                          <Badge variant="secondary" className="text-xs">
                            {tab.count}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl min-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'guests' && (
                <motion.div
                  key="guests"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GuestManagementTab />
                </motion.div>
              )}

              {activeTab === 'gifts' && (
                <motion.div
                  key="gifts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GiftRegistryTab />
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PaymentTrackingTab />
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeddingAnalyticsTab />
                </motion.div>
              )}

              {activeTab === 'config' && (
                <motion.div
                  key="config"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <WeddingConfigTab />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Actions Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="glass p-6 text-center hover:shadow-lg transition-shadow">
              <MessageSquare className="w-8 h-8 text-blush-500 mx-auto mb-3" />
              <h3 className="font-semibold text-burgundy-800 mb-2">Enviar Lembretes</h3>
              <p className="text-sm text-burgundy-600 mb-4">
                Envie lembretes de RSVP para convidados pendentes
              </p>
              <Button variant="outline" size="sm">
                Enviar Lembretes
              </Button>
            </Card>

            <Card className="glass p-6 text-center hover:shadow-lg transition-shadow">
              <TrendingUp className="w-8 h-8 text-sage-500 mx-auto mb-3" />
              <h3 className="font-semibold text-burgundy-800 mb-2">Relatório Semanal</h3>
              <p className="text-sm text-burgundy-600 mb-4">
                Gere relatório de progresso dos últimos 7 dias
              </p>
              <Button variant="outline" size="sm">
                Gerar Relatório
              </Button>
            </Card>

            <Card className="glass p-6 text-center hover:shadow-lg transition-shadow">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-burgundy-800 mb-2">Backup de Dados</h3>
              <p className="text-sm text-burgundy-600 mb-4">
                Faça backup de todos os dados do casamento
              </p>
              <Button variant="outline" size="sm">
                Fazer Backup
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
