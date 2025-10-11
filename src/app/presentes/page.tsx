'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Heart, Gift as GiftIcon, Sparkles } from 'lucide-react'
import Navigation from '@/components/ui/Navigation'
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
      <div className="min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--decorative)', borderTopColor: 'var(--primary-text)' }} />
            <p style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>Preparando ideias para construir nosso lar...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex flex-row items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex flex-row items-center justify-center" style={{ background: 'var(--decorative)' }}>
              <GiftIcon className="w-6 h-6" style={{ color: 'var(--white-soft)' }} />
            </div>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em' }}>
              Ajudem a Construir Nosso Lar
            </h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic', lineHeight: '1.8' }}>
            Para nossa casa própria e nossa família de 4 patinhas!
            Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡ também agradecem cada gesto de carinho.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px var(--shadow-subtle)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>{stats.total}</div>
            <div className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>Itens do Lar</div>
          </div>
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px var(--shadow-subtle)' }}>
            <div className="text-2xl font-bold mb-2" style={{ color: 'var(--decorative)', fontFamily: 'var(--font-playfair)' }}>{stats.completed}</div>
            <div className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>Conquistados</div>
          </div>
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px var(--shadow-subtle)' }}>
            <div className="text-lg font-bold mb-2" style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-playfair)' }}>{formatBRL(stats.totalValue)}</div>
            <div className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>Sonho Total</div>
          </div>
          <div className="rounded-xl p-6 text-center" style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px var(--shadow-subtle)' }}>
            <div className="text-lg font-bold mb-2" style={{ color: 'var(--decorative)', fontFamily: 'var(--font-playfair)' }}>{formatBRL(stats.completedValue)}</div>
            <div className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>Amor Recebido</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-8 mb-8"
          style={{ background: 'var(--white-soft)', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px var(--shadow-subtle)' }}
        >
          <div className="flex flex-row items-center gap-2 mb-6">
            <Filter className="w-5 h-5" style={{ color: 'var(--decorative)' }} />
            <h3 className="font-semibold" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.1em' }}>Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--decorative)' }} />
              <input
                type="text"
                placeholder="Buscar presentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-all duration-200"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--background)',
                  color: 'var(--primary-text)',
                  fontFamily: 'var(--font-crimson)'
                }}
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-3 border rounded-lg focus:ring-2 transition-all duration-200"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'var(--background)',
                color: 'var(--primary-text)',
                fontFamily: 'var(--font-crimson)'
              }}
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
              className="w-full px-3 py-3 border rounded-lg focus:ring-2 transition-all duration-200"
              style={{
                borderColor: 'var(--border-subtle)',
                background: 'var(--background)',
                color: 'var(--primary-text)',
                fontFamily: 'var(--font-crimson)'
              }}
            >
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>

            {/* Show Completed Toggle */}
            <div className="flex flex-row items-center justify-center">
              <label className="flex flex-row items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{
                    accentColor: 'var(--decorative)',
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border-subtle)'
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)' }}>Mostrar completos</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex flex-row items-center justify-between mb-6">
          <p style={{ color: 'var(--secondary-text)', fontFamily: 'var(--font-crimson)', fontStyle: 'italic' }}>
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
              variant="wedding-outline"
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
            <div className="w-16 h-16 rounded-full flex flex-row items-center justify-center mx-auto mb-4" style={{ background: 'var(--accent)' }}>
              <Sparkles className="w-8 h-8" style={{ color: 'var(--decorative)' }} />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)' }}>
              Em breve, ideias para nosso novo lar
            </h3>
            <p className="mb-4" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
              Ajuste os filtros para descobrir como nos ajudar a construir nosso cantinho
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedPriority('all')
                setShowCompleted(true)
              }}
              variant="wedding-outline"
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
          className="text-center rounded-2xl p-12"
          style={{ background: 'var(--decorative)', color: 'var(--white-soft)' }}
        >
          <Heart className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--white-soft)' }} />
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', letterSpacing: '0.15em' }}>
            Obrigado por Ajudar a Construir Nosso Lar!
          </h3>
          <p className="max-w-2xl mx-auto mb-8" style={{ fontFamily: 'var(--font-crimson)', fontStyle: 'italic', lineHeight: '1.8', color: 'var(--white-soft)', opacity: '0.9' }}>
            Cada presente nos ajuda a transformar nossa casa própria em um lar ainda mais especial.
            Linda, Cacao, Olivia e Oliver também agradecem! Nos vemos no Constable Galerie em 20 de novembro de 2025!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex flex-row items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--white-soft)' }} />
              <span style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.875rem' }}>PIX brasileiro, rápido e seguro</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--white-soft)' }} />
              <span style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.875rem' }}>Confirmação na hora do carinho</span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--white-soft)' }} />
              <span style={{ fontFamily: 'var(--font-crimson)', fontSize: '0.875rem' }}>"O que temos entre nós é muito maior" - Hel & Ylana</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
