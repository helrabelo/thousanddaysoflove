'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Download,
  RefreshCw,
  Heart,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Guest } from '@/types/wedding'
import { GuestService } from '@/lib/services/guests'
import { formatDate, formatDateTime } from '@/lib/utils'

type FilterStatus = 'all' | 'attending' | 'not-attending' | 'pending'

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [stats, setStats] = useState({
    total: 0,
    attending: 0,
    notAttending: 0,
    pending: 0,
    totalWithPlusOnes: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [showGuestDetail, setShowGuestDetail] = useState(false)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  // Filter guests based on search and status
  useEffect(() => {
    let filtered = guests

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(guest =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone?.includes(searchTerm) ||
        guest.invitation_code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(guest => {
        switch (filterStatus) {
          case 'attending':
            return guest.attending === true
          case 'not-attending':
            return guest.attending === false
          case 'pending':
            return guest.attending === null
          default:
            return true
        }
      })
    }

    setFilteredGuests(filtered)
  }, [guests, searchTerm, filterStatus])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [guestList, guestStats] = await Promise.all([
        GuestService.getAllGuests(),
        GuestService.getGuestStats()
      ])
      setGuests(guestList)
      setStats(guestStats)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm('Tem certeza que deseja excluir este convidado?')) return

    try {
      await GuestService.deleteGuest(guestId)
      loadData() // Reload data
    } catch (error) {
      console.error('Error deleting guest:', error)
      alert('Erro ao excluir convidado')
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Confirmação',
      'Acompanhante',
      'Nome do Acompanhante',
      'Restrições Alimentares',
      'Pedidos Especiais',
      'Código do Convite',
      'Data do RSVP',
      'Data de Criação'
    ]

    const rows = filteredGuests.map(guest => [
      guest.name,
      guest.email,
      guest.phone || '',
      guest.attending === true ? 'Sim' : guest.attending === false ? 'Não' : 'Pendente',
      guest.plus_one ? 'Sim' : 'Não',
      guest.plus_one_name || '',
      guest.dietary_restrictions || '',
      guest.special_requests || '',
      guest.invitation_code,
      guest.rsvp_date ? formatDateTime(new Date(guest.rsvp_date)) : '',
      formatDateTime(new Date(guest.created_at))
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `convidados-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getAttendingIcon = (attending: boolean | null) => {
    if (attending === true) {
      return <CheckCircle className="w-5 h-5 text-sage-600" />
    } else if (attending === false) {
      return <XCircle className="w-5 h-5 text-red-600" />
    }
    return <AlertCircle className="w-5 h-5 text-yellow-600" />
  }

  const getAttendingBadge = (attending: boolean | null) => {
    if (attending === true) {
      return <Badge variant="success">Confirmado</Badge>
    } else if (attending === false) {
      return <Badge variant="destructive">Não virá</Badge>
    }
    return <Badge variant="warning">Pendente</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blush-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-burgundy-700 font-medium">Carregando dados...</p>
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
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blush-500" fill="currentColor" />
              <span className="font-bold text-xl bg-gradient-to-r from-blush-600 to-burgundy-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </Link>
            <Link href="/" className="text-burgundy-700 hover:text-blush-600 transition-colors duration-300 font-medium">
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-burgundy-800 mb-4"
            >
              Dashboard do Casamento
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-burgundy-600"
            >
              Gerencie seus convidados e acompanhe as confirmações
            </motion.p>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-blush-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.total}</h3>
              <p className="text-burgundy-600">Total de Convidados</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <UserCheck className="w-8 h-8 text-sage-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.attending}</h3>
              <p className="text-burgundy-600">Confirmados</p>
              <p className="text-sm text-sage-600 mt-1">
                {stats.totalWithPlusOnes} pessoas total
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <UserX className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.notAttending}</h3>
              <p className="text-burgundy-600">Não Comparecerão</p>
            </div>

            <div className="glass rounded-2xl p-6 text-center">
              <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.pending}</h3>
              <p className="text-burgundy-600">Pendentes</p>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por nome, email, telefone ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 min-w-[300px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === 'attending' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('attending')}
                  >
                    Confirmados
                  </Button>
                  <Button
                    variant={filterStatus === 'not-attending' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('not-attending')}
                  >
                    Não virão
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('pending')}
                  >
                    Pendentes
                  </Button>
                </div>
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
                  variant="secondary"
                  size="sm"
                  onClick={exportToCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blush-200">
              <p className="text-sm text-burgundy-600">
                Mostrando <strong>{filteredGuests.length}</strong> de <strong>{guests.length}</strong> convidados
              </p>
            </div>
          </motion.div>

          {/* Guests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blush-50 border-b border-blush-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Convidado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Contato</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Acompanhante</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">RSVP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-burgundy-800">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blush-100">
                  {filteredGuests.map((guest, index) => (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-blush-25 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-burgundy-800">{guest.name}</div>
                          <div className="text-sm text-burgundy-600">
                            Código: <span className="font-mono">{guest.invitation_code}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-burgundy-700">
                            <Mail className="w-4 h-4 mr-2 text-blush-500" />
                            {guest.email}
                          </div>
                          {guest.phone && (
                            <div className="flex items-center text-sm text-burgundy-700">
                              <Phone className="w-4 h-4 mr-2 text-blush-500" />
                              {guest.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getAttendingIcon(guest.attending)}
                          {getAttendingBadge(guest.attending)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {guest.plus_one ? (
                          <div>
                            <div className="text-sm font-medium text-sage-700">
                              <UserPlus className="w-4 h-4 inline mr-1" />
                              Sim
                            </div>
                            {guest.plus_one_name && (
                              <div className="text-sm text-burgundy-600">{guest.plus_one_name}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Não</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {guest.rsvp_date ? (
                          <div className="flex items-center text-sm text-burgundy-700">
                            <Calendar className="w-4 h-4 mr-2 text-blush-500" />
                            {formatDate(new Date(guest.rsvp_date))}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Não respondeu</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedGuest(guest)
                              setShowGuestDetail(true)
                            }}
                            className="p-2"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {filteredGuests.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Nenhum convidado encontrado com os filtros aplicados'
                      : 'Nenhum convidado cadastrado ainda'
                    }
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Guest Detail Modal */}
      <AnimatePresence>
        {showGuestDetail && selectedGuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowGuestDetail(false)}
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
                  Detalhes do Convidado
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGuestDetail(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Informações Básicas</h3>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedGuest.name}</p>
                      <p><strong>Email:</strong> {selectedGuest.email}</p>
                      {selectedGuest.phone && <p><strong>Telefone:</strong> {selectedGuest.phone}</p>}
                      <p><strong>Código do Convite:</strong> <span className="font-mono">{selectedGuest.invitation_code}</span></p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Status do RSVP</h3>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <strong>Confirmação:</strong>
                        {getAttendingIcon(selectedGuest.attending)}
                        {getAttendingBadge(selectedGuest.attending)}
                      </p>
                      {selectedGuest.rsvp_date && (
                        <p><strong>Data do RSVP:</strong> {formatDateTime(new Date(selectedGuest.rsvp_date))}</p>
                      )}
                      <p><strong>Cadastrado em:</strong> {formatDateTime(new Date(selectedGuest.created_at))}</p>
                    </div>
                  </div>
                </div>

                {selectedGuest.plus_one && (
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Acompanhante</h3>
                    <p><strong>Trará acompanhante:</strong> Sim</p>
                    {selectedGuest.plus_one_name && (
                      <p><strong>Nome do acompanhante:</strong> {selectedGuest.plus_one_name}</p>
                    )}
                  </div>
                )}

                {selectedGuest.dietary_restrictions && (
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Restrições Alimentares</h3>
                    <p className="bg-gray-50 p-4 rounded-xl">{selectedGuest.dietary_restrictions}</p>
                  </div>
                )}

                {selectedGuest.special_requests && (
                  <div>
                    <h3 className="font-semibold text-burgundy-800 mb-3">Pedidos Especiais / Mensagem</h3>
                    <p className="bg-gray-50 p-4 rounded-xl">{selectedGuest.special_requests}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <Button
                  onClick={() => setShowGuestDetail(false)}
                  variant="primary"
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