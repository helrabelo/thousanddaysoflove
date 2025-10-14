'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Gift,
  TrendingUp,
  PieChart,
  BarChart3,
  Smartphone,
  Eye,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Payment } from '@/types/wedding'
import { formatDate, formatDateTime } from '@/lib/utils'

type FilterStatus = 'all' | 'pending' | 'completed' | 'failed' | 'refunded'
type FilterMethod = 'all' | 'pix' | 'credit_card' | 'bank_transfer'

interface PaymentWithDetails extends Payment {
  guest_name?: string
  gift_name?: string
}

export function PaymentTrackingTab() {
  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterMethod, setFilterMethod] = useState<FilterMethod>('all')
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null)
  const [showPaymentDetail, setShowPaymentDetail] = useState(false)

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
    completedAmount: 0,
    pendingAmount: 0,
    pixPayments: 0,
    creditCardPayments: 0,
    averageAmount: 0,
    successRate: 0,
    todayPayments: 0,
    thisWeekPayments: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = payments

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.gift_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.mercado_pago_payment_id?.includes(searchTerm) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(payment => payment.status === filterStatus)
    }

    // Apply payment method filter
    if (filterMethod !== 'all') {
      filtered = filtered.filter(payment => payment.payment_method === filterMethod)
    }

    setFilteredPayments(filtered)
  }, [payments, searchTerm, filterStatus, filterMethod])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // TODO: Load real payment data from PaymentService
      // For now, using mock data that would come from the API

      const mockPayments: PaymentWithDetails[] = [
        {
          id: '1',
          gift_id: 'gift-1',
          guest_id: 'guest-1',
          amount: 250.00,
          status: 'completed',
          payment_method: 'pix',
          mercado_pago_payment_id: 'MP123456789',
          message: 'Desejamos muito amor e felicidade!',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          guest_name: 'Maria Silva',
          gift_name: 'Jogo de Panelas Antiaderentes'
        },
        {
          id: '2',
          gift_id: 'gift-2',
          guest_id: 'guest-2',
          amount: 150.00,
          status: 'pending',
          payment_method: 'pix',
          mercado_pago_payment_id: 'MP987654321',
          message: 'Parabéns pelo casamento!',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          guest_name: 'João Santos',
          gift_name: 'Kit de Toalhas de Banho'
        },
        {
          id: '3',
          gift_id: 'gift-3',
          guest_id: 'guest-3',
          amount: 500.00,
          status: 'completed',
          payment_method: 'pix',
          mercado_pago_payment_id: 'MP456789123',
          message: 'Com carinho da família Oliveira',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
          guest_name: 'Ana Oliveira',
          gift_name: 'Aparelho de Jantar Completo'
        }
      ]

      setPayments(mockPayments)

      // Calculate stats
      const total = mockPayments.length
      const completed = mockPayments.filter(p => p.status === 'completed').length
      const pending = mockPayments.filter(p => p.status === 'pending').length
      const failed = mockPayments.filter(p => p.status === 'failed').length
      const totalAmount = mockPayments.reduce((sum, p) => sum + p.amount, 0)
      const completedAmount = mockPayments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
      const pendingAmount = mockPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
      const pixPayments = mockPayments.filter(p => p.payment_method === 'pix').length
      const creditCardPayments = mockPayments.filter(p => p.payment_method === 'credit_card').length
      const averageAmount = total > 0 ? totalAmount / total : 0
      const successRate = total > 0 ? (completed / total) * 100 : 0

      // Today and this week calculations
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000)

      const todayPayments = mockPayments.filter(p => new Date(p.created_at) >= todayStart).length
      const thisWeekPayments = mockPayments.filter(p => new Date(p.created_at) >= weekStart).length

      setStats({
        total,
        completed,
        pending,
        failed,
        totalAmount,
        completedAmount,
        pendingAmount,
        pixPayments,
        creditCardPayments,
        averageAmount,
        successRate,
        todayPayments,
        thisWeekPayments
      })
    } catch (error) {
      console.error('Error loading payment data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Pago</Badge>
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>
      case 'refunded':
        return <Badge variant="warning">Reembolsado</Badge>
      default:
        return <Badge variant="warning">Desconhecido</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-sage-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'refunded':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'pix':
        return <Smartphone className="w-4 h-4 text-green-600" />
      case 'credit_card':
        return <CreditCard className="w-4 h-4 text-blue-600" />
      case 'bank_transfer':
        return <DollarSign className="w-4 h-4 text-purple-600" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'pix':
        return 'PIX'
      case 'credit_card':
        return 'Cartão de Crédito'
      case 'bank_transfer':
        return 'Transferência'
      default:
        return method
    }
  }

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Data',
      'Convidado',
      'Presente',
      'Valor',
      'Status',
      'Método',
      'Mercado Pago ID',
      'Mensagem'
    ]

    const rows = filteredPayments.map(payment => [
      payment.id,
      formatDateTime(new Date(payment.created_at)),
      payment.guest_name || '',
      payment.gift_name || '',
      formatBRL(payment.amount),
      payment.status,
      getPaymentMethodLabel(payment.payment_method),
      payment.mercado_pago_payment_id || '',
      payment.message || ''
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `pagamentos-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blush-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-burgundy-700 font-medium">Carregando dados de pagamento...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
            Rastreamento de Pagamentos
          </h2>
          <p className="text-burgundy-600">
            Monitore todos os pagamentos PIX e compras de presentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{formatBRL(stats.completedAmount)}</h3>
              <p className="text-sm text-burgundy-600">Total Recebido</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">de {formatBRL(stats.totalAmount)}</div>
              <div className="text-xs text-green-600 font-medium">
                {stats.totalAmount ? Math.round((stats.completedAmount / stats.totalAmount) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-sage-50 to-white border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <CheckCircle className="w-6 h-6 text-sage-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.completed}</h3>
              <p className="text-sm text-burgundy-600">Pagamentos Completos</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Taxa de Sucesso</div>
              <div className="text-xs text-sage-600 font-medium">
                {stats.successRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <Clock className="w-6 h-6 text-yellow-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.pending}</h3>
              <p className="text-sm text-burgundy-600">Pendentes</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Valor Pendente</div>
              <div className="text-xs text-yellow-600 font-medium">
                {formatBRL(stats.pendingAmount)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blush-50 to-white border-blush-200">
          <div className="flex items-center justify-between">
            <div>
              <Smartphone className="w-6 h-6 text-blush-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.pixPayments}</h3>
              <p className="text-sm text-burgundy-600">Pagamentos PIX</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Valor Médio</div>
              <div className="text-xs text-blush-600 font-medium">
                {formatBRL(stats.averageAmount)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-burgundy-800">Hoje</h3>
              <p className="text-sm text-burgundy-600">{stats.todayPayments} pagamentos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="font-semibold text-burgundy-800">Esta Semana</h3>
              <p className="text-sm text-burgundy-600">{stats.thisWeekPayments} pagamentos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-burgundy-800">PIX Dominante</h3>
              <p className="text-sm text-burgundy-600">
                {stats.total > 0 ? Math.round((stats.pixPayments / stats.total) * 100) : 0}% dos pagamentos
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por convidado, presente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-w-[300px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos ({stats.total})
              </Button>
              <Button
                variant={filterStatus === 'completed' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('completed')}
              >
                Completos ({stats.completed})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pendentes ({stats.pending})
              </Button>
              <Button
                variant={filterStatus === 'failed' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('failed')}
              >
                Falharam ({stats.failed})
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterMethod === 'all' ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setFilterMethod('all')}
            >
              Todos Métodos
            </Button>
            <Button
              variant={filterMethod === 'pix' ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setFilterMethod('pix')}
            >
              PIX ({stats.pixPayments})
            </Button>
            <Button
              variant={filterMethod === 'credit_card' ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setFilterMethod('credit_card')}
            >
              Cartão ({stats.creditCardPayments})
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blush-200">
          <p className="text-sm text-burgundy-600">
            Mostrando <strong>{filteredPayments.length}</strong> de <strong>{payments.length}</strong> pagamentos
          </p>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blush-50 border-b border-blush-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Pagamento</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Convidado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Presente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Valor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Método</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blush-100">
              {filteredPayments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blush-25 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-mono text-sm text-burgundy-800">
                        #{payment.id.slice(0, 8)}
                      </div>
                      {payment.mercado_pago_payment_id && (
                        <div className="text-xs text-burgundy-600">
                          MP: {payment.mercado_pago_payment_id}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-blush-500" />
                      <span className="text-sm text-burgundy-700">
                        {payment.guest_name || 'Anônimo'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Gift className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm text-burgundy-700">
                        {payment.gift_name || 'Presente removido'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-semibold text-burgundy-800">
                      {formatBRL(payment.amount)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      {getStatusBadge(payment.status)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(payment.payment_method)}
                      <span className="text-sm text-burgundy-700">
                        {getPaymentMethodLabel(payment.payment_method)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-burgundy-700">
                      <Calendar className="w-4 h-4 mr-2 text-blush-500" />
                      {formatDate(new Date(payment.created_at))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedPayment(payment)
                          setShowPaymentDetail(true)
                        }}
                        className="p-2"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {payment.mercado_pago_payment_id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 text-blue-600 hover:text-blue-800"
                          title="Ver no Mercado Pago"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || filterStatus !== 'all' || filterMethod !== 'all'
                  ? 'Nenhum pagamento encontrado com os filtros aplicados'
                  : 'Nenhum pagamento registrado ainda'
                }
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {showPaymentDetail && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPaymentDetail(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-playfair font-bold text-burgundy-800">
                  Detalhes do Pagamento
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPaymentDetail(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Informações do Pagamento</h3>
                    <div className="space-y-2">
                      <p><strong>ID:</strong> <span className="font-mono">{selectedPayment.id}</span></p>
                      <p><strong>Valor:</strong> {formatBRL(selectedPayment.amount)}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedPayment.status)}</p>
                      <p><strong>Método:</strong> {getPaymentMethodLabel(selectedPayment.payment_method)}</p>
                      {selectedPayment.mercado_pago_payment_id && (
                        <p><strong>Mercado Pago ID:</strong> <span className="font-mono">{selectedPayment.mercado_pago_payment_id}</span></p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Informações Relacionadas</h3>
                    <div className="space-y-2">
                      <p><strong>Convidado:</strong> {selectedPayment.guest_name || 'Anônimo'}</p>
                      <p><strong>Presente:</strong> {selectedPayment.gift_name || 'Presente removido'}</p>
                      <p><strong>Data de Criação:</strong> {formatDateTime(new Date(selectedPayment.created_at))}</p>
                      <p><strong>Última Atualização:</strong> {formatDateTime(new Date(selectedPayment.updated_at))}</p>
                    </div>
                  </div>
                </div>

                {selectedPayment.message && (
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Mensagem do Convidado</h3>
                    <p className="bg-gray-50 p-4 rounded-xl">{selectedPayment.message}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <div className="flex gap-2">
                  {selectedPayment.mercado_pago_payment_id && (
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver no Mercado Pago
                    </Button>
                  )}
                  {selectedPayment.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Verificar Status
                    </Button>
                  )}
                </div>
                <Button
                  onClick={() => setShowPaymentDetail(false)}
                  variant="wedding"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
