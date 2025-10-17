'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Package,
  DollarSign,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  TrendingUp,
  Tag,
  Image,
  ExternalLink,
  RefreshCw,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Gift as GiftType } from '@/types/wedding'
import { GiftService } from '@/lib/services/gifts'

type FilterCategory = 'all' | 'Casa' | 'Cozinha' | 'Quarto' | 'Viagem' | 'Experiência'
type FilterStatus = 'all' | 'available' | 'purchased' | 'unavailable'

export function GiftRegistryTab() {
  const [gifts, setGifts] = useState<GiftType[]>([])
  const [filteredGifts, setFilteredGifts] = useState<GiftType[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null)
  const [showGiftDetail, setShowGiftDetail] = useState(false)
  const [showAddGift, setShowAddGift] = useState(false)
  const [showEditGift, setShowEditGift] = useState(false)

  const [stats, setStats] = useState({
    total: 0,
    purchased: 0,
    available: 0,
    totalValue: 0,
    purchasedValue: 0,
    averagePrice: 0,
    popularCategory: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = gifts

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(gift =>
        gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gift.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gift.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(gift => gift.category === filterCategory)
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(gift => {
        switch (filterStatus) {
          case 'available':
            return gift.is_available && gift.quantity_purchased < gift.quantity_desired
          case 'purchased':
            return gift.quantity_purchased >= gift.quantity_desired
          case 'unavailable':
            return !gift.is_available
          default:
            return true
        }
      })
    }

    setFilteredGifts(filtered)
  }, [gifts, searchTerm, filterCategory, filterStatus])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [giftList, categoryList, registryTotals] = await Promise.all([
        GiftService.getAllGifts(),
        GiftService.getGiftCategories(),
        GiftService.getRegistryTotalValue()
      ])

      setGifts(giftList)
      setCategories(categoryList)

      // Calculate stats
      const totalGifts = giftList.length
      const purchasedGifts = giftList.filter(g => g.quantity_purchased >= g.quantity_desired).length
      const availableGifts = giftList.filter(g => g.is_available && g.quantity_purchased < g.quantity_desired).length
      const totalValue = giftList.reduce((sum, g) => sum + (g.price * g.quantity_desired), 0)
      const averagePrice = totalGifts > 0 ? totalValue / totalGifts : 0

      // Find popular category
      const categoryCount = giftList.reduce((acc, gift) => {
        acc[gift.category] = (acc[gift.category] || 0) + gift.quantity_purchased
        return acc
      }, {} as Record<string, number>)
      const popularCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

      setStats({
        total: totalGifts,
        purchased: purchasedGifts,
        available: availableGifts,
        totalValue: registryTotals.desired,
        purchasedValue: registryTotals.purchased,
        averagePrice,
        popularCategory
      })
    } catch (error) {
      console.error('Error loading gift data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGift = async (giftId: string) => {
    if (!confirm('Tem certeza que deseja excluir este presente?')) return

    try {
      await GiftService.deleteGift(giftId)
      loadData()
    } catch (error) {
      console.error('Error deleting gift:', error)
      alert('Erro ao excluir presente')
    }
  }

  const getStatusBadge = (gift: GiftType) => {
    if (!gift.is_available) {
      return <Badge variant="declined">Indisponível</Badge>
    } else if (gift.quantity_purchased >= gift.quantity_desired) {
      return <Badge variant="success">Completo</Badge>
    } else if (gift.quantity_purchased > 0) {
      return <Badge variant="warning">Parcial</Badge>
    }
    return <Badge variant="pending">Disponível</Badge>
  }

  const getStatusIcon = (gift: GiftType) => {
    if (!gift.is_available) {
      return <AlertCircle className="w-5 h-5 text-gray-500" />
    } else if (gift.quantity_purchased >= gift.quantity_desired) {
      return <CheckCircle className="w-5 h-5 text-sage-600" />
    } else if (gift.quantity_purchased > 0) {
      return <Clock className="w-5 h-5 text-yellow-600" />
    }
    return <Package className="w-5 h-5 text-blush-600" />
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Alta</Badge>
      case 'medium':
        return <Badge variant="warning" className="text-xs">Média</Badge>
      case 'low':
        return <Badge variant="destructive" className="text-xs">Baixa</Badge>
      default:
        return null
    }
  }

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blush-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-burgundy-700 font-medium">Carregando lista de presentes...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
            Lista de Presentes
          </h2>
          <p className="text-burgundy-600">
            Gerencie sua lista de presentes e acompanhe as compras
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEditGift(true)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Editar Lista
          </Button>
          <Button
            variant="wedding"
            size="sm"
            onClick={() => setShowAddGift(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Presente
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-gray-50 to-white border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Gift className="w-6 h-6 text-gray-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.total}</h3>
              <p className="text-sm text-burgundy-600">Presentes na Lista</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Categoria Popular</div>
              <div className="text-xs text-gray-600 font-medium">
                {stats.popularCategory}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-sage-50 to-white border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <CheckCircle className="w-6 h-6 text-sage-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.purchased}</h3>
              <p className="text-sm text-burgundy-600">Completos</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Taxa de Sucesso</div>
              <div className="text-xs text-sage-600 font-medium">
                {stats.total ? Math.round((stats.purchased / stats.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-white border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
              <h3 className="text-xl font-bold text-burgundy-800">{formatBRL(stats.purchasedValue)}</h3>
              <p className="text-sm text-burgundy-600">Arrecadado</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">de {formatBRL(stats.totalValue)}</div>
              <div className="text-xs text-green-600 font-medium">
                {stats.totalValue ? Math.round((stats.purchasedValue / stats.totalValue) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blush-50 to-white border-blush-200">
          <div className="flex items-center justify-between">
            <div>
              <TrendingUp className="w-6 h-6 text-blush-500 mb-2" />
              <h3 className="text-xl font-bold text-burgundy-800">{formatBRL(stats.averagePrice)}</h3>
              <p className="text-sm text-burgundy-600">Preço Médio</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Disponíveis</div>
              <div className="text-xs text-blush-600 font-medium">
                {stats.available} presentes
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Controls */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar presentes por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 min-w-[300px]"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterCategory === 'all' ? 'wedding' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                Todas Categorias
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filterCategory === category ? 'wedding' : 'outline'}
                  size="sm"
                  onClick={() => setFilterCategory(category as FilterCategory)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Todos
            </Button>
            <Button
              variant={filterStatus === 'available' ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('available')}
            >
              Disponíveis
            </Button>
            <Button
              variant={filterStatus === 'purchased' ? 'wedding' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('purchased')}
            >
              Completos
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blush-200 flex justify-between items-center">
          <p className="text-sm text-burgundy-600">
            Mostrando <strong>{filteredGifts.length}</strong> de <strong>{gifts.length}</strong> presentes
          </p>
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
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>
      </Card>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Gift Image */}
              <div className="aspect-video bg-gradient-to-br from-blush-100 to-gray-100 relative">
                {gift.image_url ? (
                  <img
                    src={gift.image_url}
                    alt={gift.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gift className="w-12 h-12 text-blush-400" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  {getStatusBadge(gift)}
                </div>

                {/* Priority Badge */}
                <div className="absolute top-3 right-3">
                  {getPriorityBadge(gift.priority)}
                </div>
              </div>

              {/* Gift Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-burgundy-800 mb-1 line-clamp-2">
                      {gift.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-burgundy-600">
                      <Tag className="w-4 h-4" />
                      {gift.category}
                    </div>
                  </div>
                  {getStatusIcon(gift)}
                </div>

                <p className="text-sm text-burgundy-600 mb-4 line-clamp-2">
                  {gift.description}
                </p>

                {/* Price and Quantity */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-burgundy-800">
                    {formatBRL(gift.price)}
                  </div>
                  <div className="text-sm text-burgundy-600">
                    {gift.quantity_purchased}/{gift.quantity_desired} comprados
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blush-500 to-gray-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((gift.quantity_purchased / gift.quantity_desired) * 100, 100)}%`
                    }}
                  ></div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedGift(gift)
                      setShowGiftDetail(true)
                    }}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>

                  {gift.registry_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(gift.registry_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGift(gift.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredGifts.length === 0 && (
        <Card className="p-12 text-center">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-burgundy-800 mb-2">
            Nenhum presente encontrado
          </h3>
          <p className="text-burgundy-600 mb-6">
            {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
              ? 'Tente ajustar os filtros para ver mais presentes'
              : 'Comece adicionando presentes à sua lista de casamento'
            }
          </p>
          <Button
            variant="wedding"
            onClick={() => setShowAddGift(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Primeiro Presente
          </Button>
        </Card>
      )}

      {/* Gift Detail Modal */}
      <AnimatePresence>
        {showGiftDetail && selectedGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowGiftDetail(false)}
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
                  Detalhes do Presente
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGiftDetail(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Gift Image */}
                <div className="aspect-video bg-gradient-to-br from-blush-100 to-gray-100 rounded-xl overflow-hidden">
                  {selectedGift.image_url ? (
                    <img
                      src={selectedGift.image_url}
                      alt={selectedGift.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-16 h-16 text-blush-400" />
                    </div>
                  )}
                </div>

                {/* Gift Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Informações do Presente</h3>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedGift.name}</p>
                      <p><strong>Categoria:</strong> {selectedGift.category}</p>
                      <p><strong>Preço:</strong> {formatBRL(selectedGift.price)}</p>
                      <p><strong>Prioridade:</strong> {getPriorityBadge(selectedGift.priority)}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedGift)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Status da Compra</h3>
                    <div className="space-y-2">
                      <p><strong>Quantidade Desejada:</strong> {selectedGift.quantity_desired}</p>
                      <p><strong>Quantidade Comprada:</strong> {selectedGift.quantity_purchased}</p>
                      <p><strong>Restante:</strong> {selectedGift.quantity_desired - selectedGift.quantity_purchased}</p>
                      <p><strong>Progresso:</strong> {Math.round((selectedGift.quantity_purchased / selectedGift.quantity_desired) * 100)}%</p>
                    </div>
                  </div>
                </div>

                {selectedGift.description && (
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Descrição</h3>
                    <p className="bg-gray-50 p-4 rounded-xl">{selectedGift.description}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <div className="flex gap-2">
                  {selectedGift.registry_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedGift.registry_url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver na Loja
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </div>
                <Button
                  onClick={() => setShowGiftDetail(false)}
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
