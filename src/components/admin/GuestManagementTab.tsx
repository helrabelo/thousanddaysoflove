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
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Send,
  Filter,
  FileText,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Guest } from '@/types/wedding'
import { GuestService } from '@/lib/services/guests'
import { formatDate, formatDateTime } from '@/lib/utils'

type FilterStatus = 'all' | 'attending' | 'not-attending' | 'pending'

export function GuestManagementTab() {
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
  const [showAddGuest, setShowAddGuest] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])

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

  const handleBulkReminder = async () => {
    if (selectedGuests.length === 0) {
      alert('Selecione pelo menos um convidado')
      return
    }

    try {
      // TODO: Implement bulk reminder sending
      alert(`Enviando lembretes para ${selectedGuests.length} convidados...`)
      setSelectedGuests([])
      setShowBulkActions(false)
    } catch (error) {
      console.error('Error sending reminders:', error)
      alert('Erro ao enviar lembretes')
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

  const handleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev =>
      prev.includes(guestId)
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    )
  }

  const selectAllVisible = () => {
    setSelectedGuests(filteredGuests.map(guest => guest.id))
  }

  const clearSelection = () => {
    setSelectedGuests([])
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blush-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-burgundy-700 font-medium">Carregando convidados...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-burgundy-800 mb-2">
            Gestão de Convidados
          </h2>
          <p className="text-burgundy-600">
            Gerencie todos os aspectos dos seus convidados e confirmações
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkActions(!showBulkActions)}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Ações em Lote
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddGuest(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Convidado
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-blush-50 to-white border-blush-200">
          <div className="flex items-center justify-between">
            <div>
              <Users className="w-6 h-6 text-blush-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.total}</h3>
              <p className="text-sm text-burgundy-600">Total de Convidados</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Meta: 150</div>
              <div className="text-xs text-blush-600 font-medium">
                {Math.round((stats.total / 150) * 100)}% da meta
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-sage-50 to-white border-sage-200">
          <div className="flex items-center justify-between">
            <div>
              <UserCheck className="w-6 h-6 text-sage-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.attending}</h3>
              <p className="text-sm text-burgundy-600">Confirmados</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">+Acompanhantes</div>
              <div className="text-xs text-sage-600 font-medium">
                {stats.totalWithPlusOnes} pessoas total
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
              <div className="text-xs text-burgundy-500">Taxa RSVP</div>
              <div className="text-xs text-yellow-600 font-medium">
                {stats.total ? Math.round(((stats.attending + stats.notAttending) / stats.total) * 100) : 0}%
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-white border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <UserX className="w-6 h-6 text-red-500 mb-2" />
              <h3 className="text-2xl font-bold text-burgundy-800">{stats.notAttending}</h3>
              <p className="text-sm text-burgundy-600">Não Comparecerão</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-burgundy-500">Taxa declínio</div>
              <div className="text-xs text-red-600 font-medium">
                {stats.total ? Math.round((stats.notAttending / stats.total) * 100) : 0}%
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
                <Filter className="w-4 h-4 mr-2" />
                Todos ({guests.length})
              </Button>
              <Button
                variant={filterStatus === 'attending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('attending')}
              >
                Confirmados ({stats.attending})
              </Button>
              <Button
                variant={filterStatus === 'not-attending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('not-attending')}
              >
                Não virão ({stats.notAttending})
              </Button>
              <Button
                variant={filterStatus === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('pending')}
              >
                Pendentes ({stats.pending})
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

        {/* Bulk Actions */}
        {showBulkActions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-blush-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={selectAllVisible}>
                  Selecionar Visíveis
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Limpar Seleção
                </Button>
                <span className="text-sm text-burgundy-600">
                  {selectedGuests.length} selecionados
                </span>
              </div>

              {selectedGuests.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={handleBulkReminder}>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Lembretes
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="mt-4 pt-4 border-t border-blush-200">
          <p className="text-sm text-burgundy-600">
            Mostrando <strong>{filteredGuests.length}</strong> de <strong>{guests.length}</strong> convidados
            {selectedGuests.length > 0 && (
              <span className="ml-2 text-blush-600">
                • <strong>{selectedGuests.length}</strong> selecionados
              </span>
            )}
          </p>
        </div>
      </Card>

      {/* Enhanced Guests Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blush-50 border-b border-blush-200">
              <tr>
                {showBulkActions && (
                  <th className="px-4 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedGuests.length === filteredGuests.length && filteredGuests.length > 0}
                      onChange={() => selectedGuests.length === filteredGuests.length ? clearSelection() : selectAllVisible()}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
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
                  className={`hover:bg-blush-25 transition-colors ${
                    selectedGuests.includes(guest.id) ? 'bg-blush-50' : ''
                  }`}
                >
                  {showBulkActions && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedGuests.includes(guest.id)}
                        onChange={() => handleGuestSelection(guest.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}

                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-burgundy-800">{guest.name}</div>
                      <div className="text-sm text-burgundy-600">
                        Código: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{guest.invitation_code}</span>
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
                      {!guest.rsvp_date && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-2 text-blush-600 hover:text-blush-800"
                          title="Enviar lembrete"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
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
      </Card>

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
                      <p><strong>Código do Convite:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedGuest.invitation_code}</span></p>
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

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
                <div className="flex gap-2">
                  {!selectedGuest.rsvp_date && (
                    <Button variant="outline" size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Lembrete
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Email
                  </Button>
                </div>
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