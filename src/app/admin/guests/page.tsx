'use client'

import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus,
  Check,
  X,
  Trash2,
  Edit2,
  Save,
  XCircle,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Users
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Guest {
  id: string
  name: string
  phone: string | null
  email: string | null
  attending: boolean | null
  plus_ones: number
  notes: string | null
  confirmed_by: string | null
  invitation_code?: string | null
}

interface EditingGuest {
  id: string
  name: string
  phone: string
  email: string
  attending: boolean | null
  plus_ones: number
  notes: string
  invitation_code: string
}

interface GuestStats {
  total: number
  confirmed: number
  declined: number
  pending: number
  totalPlusOnes: number
}

export default function AdminGuests(): JSX.Element {
  const [guests, setGuests] = useState<Guest[]>([])
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditingGuest | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'declined' | 'pending'>('all')

  useEffect(() => {
    loadGuests()
  }, [])

  useEffect(() => {
    filterAndSearchGuests()
  }, [guests, searchQuery, filterStatus])

  const loadGuests = async (): Promise<void> => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('simple_guests')
        .select<'*', Guest>('*')
        .order('name')

      if (error) throw error
      setGuests(data || [])
    } catch (error) {
      console.error('Error loading guests:', error)
      alert('Erro ao carregar convidados')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSearchGuests = (): void => {
    let filtered = [...guests]

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(g => {
        if (filterStatus === 'confirmed') return g.attending === true
        if (filterStatus === 'declined') return g.attending === false
        if (filterStatus === 'pending') return g.attending === null
        return true
      })
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(g =>
        g.name.toLowerCase().includes(query) ||
        g.email?.toLowerCase().includes(query) ||
        g.phone?.includes(query) ||
        g.invitation_code?.toLowerCase().includes(query)
      )
    }

    setFilteredGuests(filtered)
  }

  const startEditing = (guest: Guest): void => {
    setEditingId(guest.id)
    setEditForm({
      id: guest.id,
      name: guest.name,
      phone: guest.phone || '',
      email: guest.email || '',
      attending: guest.attending,
      plus_ones: guest.plus_ones,
      notes: guest.notes || '',
      invitation_code: guest.invitation_code || ''
    })
  }

  const cancelEditing = (): void => {
    setEditingId(null)
    setEditForm(null)
  }

  const saveGuest = async (): Promise<void> => {
    if (!editForm) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .update({
          name: editForm.name,
          phone: editForm.phone || null,
          email: editForm.email || null,
          attending: editForm.attending,
          plus_ones: editForm.plus_ones,
          notes: editForm.notes || null,
          invitation_code: editForm.invitation_code || null
        })
        .eq('id', editForm.id)

      if (error) throw error

      await loadGuests()
      cancelEditing()
      alert('Convidado atualizado!')
    } catch (error) {
      console.error('Error updating guest:', error)
      alert('Erro ao atualizar convidado')
    }
  }

  const addGuest = async (name: string, phone: string, email: string): Promise<void> => {
    if (!name.trim()) {
      alert('Nome é obrigatório')
      return
    }

    try {
      const supabase = createClient()

      // Generate a unique invitation code
      const invitationCode = `HY${Date.now().toString().slice(-6)}`

      const { error } = await supabase
        .from('simple_guests')
        .insert({
          name,
          phone: phone || null,
          email: email || null,
          invitation_code: invitationCode
        })

      if (error) throw error

      setShowAddForm(false)
      await loadGuests()
      alert('Convidado adicionado!')
    } catch (error) {
      console.error('Error adding guest:', error)
      alert('Erro ao adicionar convidado')
    }
  }

  const deleteGuest = async (guestId: string, guestName: string): Promise<void> => {
    if (!window.confirm(`DELETAR ${guestName} da lista?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .delete()
        .eq('id', guestId)

      if (error) throw error
      await loadGuests()
      alert('Convidado removido')
    } catch (error) {
      console.error('Error deleting guest:', error)
      alert('Erro ao deletar convidado')
    }
  }

  const updateRSVP = async (guestId: string, attending: boolean | null): Promise<void> => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .update({
          attending,
          confirmed_at: attending !== null ? new Date().toISOString() : null,
          confirmed_by: attending !== null ? 'admin' : null
        })
        .eq('id', guestId)

      if (error) throw error
      await loadGuests()
    } catch (error) {
      console.error('Error updating RSVP:', error)
      alert('Erro ao atualizar RSVP')
    }
  }

  const exportToCSV = (): void => {
    const headers = ['Nome', 'Email', 'Telefone', 'Status', 'Acompanhantes', 'Código Convite', 'Observações']
    const rows = filteredGuests.map(g => [
      g.name,
      g.email || '',
      g.phone || '',
      g.attending === true ? 'Confirmado' : g.attending === false ? 'Não Vai' : 'Pendente',
      g.plus_ones.toString(),
      g.invitation_code || '',
      (g.notes || '').replace(/"/g, '""')
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell => cell.includes(',') || cell.includes('"') ? `"${cell}"` : cell).join(',')
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `convidados-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const stats: GuestStats = {
    total: guests.length,
    confirmed: guests.filter(g => g.attending === true).length,
    declined: guests.filter(g => g.attending === false).length,
    pending: guests.filter(g => g.attending === null).length,
    totalPlusOnes: guests.reduce((sum, g) => sum + (g.plus_ones || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <p className="text-burgundy-700">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hero-gradient py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/admin" className="text-burgundy-700 hover:text-blush-600 inline-block mb-2 text-sm">
              ← Voltar ao Admin
            </Link>
            <h1 className="text-3xl font-playfair font-bold text-burgundy-800">
              Gerenciar Convidados
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Card className="glass p-3 text-center">
            <div className="text-xl font-bold text-burgundy-800">{stats.total}</div>
            <div className="text-xs text-burgundy-600">Total</div>
          </Card>
          <Card className="glass p-3 text-center">
            <div className="text-xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-xs text-burgundy-600">Confirmados</div>
          </Card>
          <Card className="glass p-3 text-center">
            <div className="text-xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-xs text-burgundy-600">Não Vão</div>
          </Card>
          <Card className="glass p-3 text-center">
            <div className="text-xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-burgundy-600">Pendentes</div>
          </Card>
          <Card className="glass p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{stats.totalPlusOnes}</div>
            <div className="text-xs text-burgundy-600">Acompanhantes</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy-400" />
              <input
                type="text"
                placeholder="Buscar por nome, email, telefone ou código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-burgundy-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filterStatus === 'all'
                    ? 'bg-burgundy-800 text-white'
                    : 'bg-white text-burgundy-700 border border-burgundy-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('confirmed')}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filterStatus === 'confirmed'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 border border-green-200'
                }`}
              >
                Confirmados
              </button>
              <button
                onClick={() => setFilterStatus('declined')}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filterStatus === 'declined'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-red-700 border border-red-200'
                }`}
              >
                Não Vão
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-2 rounded-lg text-sm ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-white text-yellow-700 border border-yellow-200'
                }`}
              >
                Pendentes
              </button>
            </div>
          </div>
        </Card>

        {/* Add Form */}
        {showAddForm && (
          <Card className="glass p-4 mb-4">
            <h3 className="text-lg font-bold text-burgundy-800 mb-3">Novo Convidado</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              addGuest(
                formData.get('name') as string,
                formData.get('phone') as string,
                formData.get('email') as string
              )
            }}>
              <div className="grid md:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome *"
                  className="px-3 py-2 border border-burgundy-200 rounded-lg text-sm"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="px-3 py-2 border border-burgundy-200 rounded-lg text-sm"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefone"
                  className="px-3 py-2 border border-burgundy-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm">Adicionar</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Table */}
        <Card className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-burgundy-200">
                  <th className="text-left p-3 font-semibold text-burgundy-800">Nome</th>
                  <th className="text-left p-3 font-semibold text-burgundy-800">Email</th>
                  <th className="text-left p-3 font-semibold text-burgundy-800">Telefone</th>
                  <th className="text-left p-3 font-semibold text-burgundy-800">Código</th>
                  <th className="text-center p-3 font-semibold text-burgundy-800">Status</th>
                  <th className="text-center p-3 font-semibold text-burgundy-800">+</th>
                  <th className="text-left p-3 font-semibold text-burgundy-800">Obs</th>
                  <th className="text-right p-3 font-semibold text-burgundy-800">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => {
                  const isEditing = editingId === guest.id

                  return (
                    <tr key={guest.id} className="border-b border-burgundy-100 hover:bg-burgundy-50/50">
                      {isEditing && editForm ? (
                        <>
                          {/* Editing mode */}
                          <td className="p-2">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm"
                              placeholder="email@example.com"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                              className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm"
                              placeholder="(00) 00000-0000"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={editForm.invitation_code}
                              onChange={(e) => setEditForm({ ...editForm, invitation_code: e.target.value })}
                              className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm font-mono"
                              placeholder="HY123456"
                            />
                          </td>
                          <td className="p-2">
                            <select
                              value={editForm.attending === null ? 'null' : editForm.attending.toString()}
                              onChange={(e) => {
                                const val = e.target.value === 'null' ? null : e.target.value === 'true'
                                setEditForm({ ...editForm, attending: val })
                              }}
                              className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm"
                            >
                              <option value="null">Pendente</option>
                              <option value="true">Confirmado</option>
                              <option value="false">Não Vai</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              max="5"
                              value={editForm.plus_ones}
                              onChange={(e) => setEditForm({ ...editForm, plus_ones: parseInt(e.target.value) || 0 })}
                              className="w-16 px-2 py-1 border border-burgundy-200 rounded text-sm text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={editForm.notes}
                              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                              className="w-full px-2 py-1 border border-burgundy-200 rounded text-sm"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="p-2">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={saveGuest}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                title="Salvar"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Cancelar"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* View mode */}
                          <td className="p-3">
                            <div className="font-medium text-burgundy-800">{guest.name}</div>
                            {guest.confirmed_by === 'admin' && (
                              <span className="text-xs text-blue-600">Admin</span>
                            )}
                          </td>
                          <td className="p-3">
                            {guest.email ? (
                              <a href={`mailto:${guest.email}`} className="text-burgundy-600 hover:text-blush-600 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {guest.email}
                              </a>
                            ) : (
                              <span className="text-burgundy-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {guest.phone ? (
                              <a href={`tel:${guest.phone}`} className="text-burgundy-600 hover:text-blush-600 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {guest.phone}
                              </a>
                            ) : (
                              <span className="text-burgundy-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {guest.invitation_code ? (
                              <code className="text-xs bg-burgundy-100 px-2 py-1 rounded font-mono text-burgundy-800">
                                {guest.invitation_code}
                              </code>
                            ) : (
                              <span className="text-burgundy-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => updateRSVP(guest.id, true)}
                                className={`p-1 rounded ${
                                  guest.attending === true
                                    ? 'bg-green-100 text-green-700'
                                    : 'text-burgundy-300 hover:bg-green-50 hover:text-green-600'
                                }`}
                                title="Confirmar"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateRSVP(guest.id, false)}
                                className={`p-1 rounded ${
                                  guest.attending === false
                                    ? 'bg-red-100 text-red-700'
                                    : 'text-burgundy-300 hover:bg-red-50 hover:text-red-600'
                                }`}
                                title="Não Vai"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateRSVP(guest.id, null)}
                                className={`p-1 rounded ${
                                  guest.attending === null
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'text-burgundy-300 hover:bg-yellow-50 hover:text-yellow-600'
                                }`}
                                title="Pendente"
                              >
                                <Users className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-burgundy-800 font-medium">{guest.plus_ones}</span>
                          </td>
                          <td className="p-3">
                            {guest.notes ? (
                              <span className="text-xs text-burgundy-600" title={guest.notes}>
                                {guest.notes.substring(0, 30)}{guest.notes.length > 30 ? '...' : ''}
                              </span>
                            ) : (
                              <span className="text-burgundy-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => startEditing(guest)}
                                className="p-1 text-burgundy-600 hover:bg-burgundy-100 rounded"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteGuest(guest.id, guest.name)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                title="Deletar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredGuests.length === 0 && (
            <div className="text-center py-8 text-burgundy-400">
              <p>Nenhum convidado encontrado</p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="mt-4 text-center text-sm text-burgundy-600">
          Mostrando {filteredGuests.length} de {guests.length} convidados
        </div>
      </div>
    </div>
  )
}
