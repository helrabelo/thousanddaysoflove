'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Heart, Gift as GiftIcon, Sparkles } from 'lucide-react'
import GiftCard from '@/components/gifts/GiftCard'
import { Gift } from '@/types/wedding'
import { GiftService } from '@/lib/services/gifts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PresentsPage() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [filteredGifts, setFilteredGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(true)

  const categories = [
    'all',
    'Casa e Decoracao',
    'Cozinha',
    'Quarto',
    'Banheiro',
    'Eletronicos',
    'Experiencias'
  ]

  const priorities = [
    { value: 'all', label: 'Todas as Prioridades' },
    { value: 'high', label: 'Prioridade Alta' },
    { value: 'medium', label: 'Prioridade Media' },
    { value: 'low', label: 'Prioridade Baixa' }
  ]

  useEffect(() => {
    loadGifts()
  }, [])

  useEffect(() => {
    filterGifts()
  }, [gifts, searchTerm, selectedCategory, selectedPriority, showCompleted])

  const loadGifts = async () => {
    try {
      setLoading(true)
      const data = await GiftService.getAllGifts()
      setGifts(data)
    } catch (error) {
      console.error('Error loading gifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterGifts = () => {
    let filtered = [...gifts]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(gift =>
        gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gift.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(gift => gift.category === selectedCategory)
    }

    // Filter by priority
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(gift => gift.priority === selectedPriority)
    }

    // Filter by completion status
    if (!showCompleted) {
      filtered = filtered.filter(gift => gift.quantity_purchased < gift.quantity_desired)
    }

    setFilteredGifts(filtered)
  }

  const handlePaymentSuccess = () => {
    // Reload gifts to update the quantities
    loadGifts()
  }

  const getStats = () => {
    const total = gifts.length
    const completed = gifts.filter(g => g.quantity_purchased >= g.quantity_desired).length
    const totalValue = gifts.reduce((sum, gift) => sum + gift.price, 0)
    const completedValue = gifts
      .filter(g => g.quantity_purchased >= g.quantity_desired)
      .reduce((sum, gift) => sum + gift.price, 0)

    return { total, completed, totalValue, completedValue }
  }

  const formatBRL = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando lista de presentes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-600 rounded-full flex items-center justify-center">
              <GiftIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Lista de Presentes
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ajudem Hel & Ylana a comecar esta nova jornada juntos!
            Cada presente e um simbolo do amor e carinho que voces tem por nos.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Presentes</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completos</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-lg font-bold text-purple-600">{formatBRL(stats.totalValue)}</div>
            <div className="text-sm text-gray-600">Valor Total</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
            <div className="text-lg font-bold text-green-600">{formatBRL(stats.completedValue)}</div>
            <div className="text-sm text-gray-600">Arrecadado</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar presentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas as Categorias' : category}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>

            {/* Show Completed Toggle */}
            <div className="flex items-center justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700">Mostrar completos</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredGifts.length} {filteredGifts.length === 1 ? 'presente encontrado' : 'presentes encontrados'}
          </p>
          {filteredGifts.length !== gifts.length && (
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedPriority('all')
                setShowCompleted(true)
              }}
              variant="outline"
              size="sm"
            >
              Limpar Filtros
            </Button>
          )}
        </div>

        {/* Gifts Grid */}
        {filteredGifts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
          >
            {filteredGifts.map((gift, index) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GiftCard gift={gift} onPaymentSuccess={handlePaymentSuccess} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum presente encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros para ver mais opcoes
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedPriority('all')
                setShowCompleted(true)
              }}
              variant="outline"
            >
              Limpar Filtros
            </Button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl p-8 text-white"
        >
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Obrigado por Celebrar Conosco!
          </h3>
          <p className="text-rose-100 max-w-2xl mx-auto mb-6">
            Cada presente e uma manifestacao do amor que voces tem por nos.
            Estamos ansiosos para compartilhar nossa alegria no dia 20 de novembro de 2025!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Pagamento seguro com PIX</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Confirmacao instantanea</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full" />
              <span>Com amor, Hel & Ylana</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
