'use client'

import { useState, useEffect } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Check, X, Trash2 } from 'lucide-react'
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
}

interface NewGuestForm {
  name: string
  phone: string
  email: string
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
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGuest, setNewGuest] = useState<NewGuestForm>({ name: '', phone: '', email: '' })

  useEffect(() => {
    loadGuests()
  }, [])

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

  const addGuest = async (): Promise<void> => {
    if (!newGuest.name.trim()) {
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
          name: newGuest.name,
          phone: newGuest.phone || null,
          email: newGuest.email || null,
          invitation_code: invitationCode
        })

      if (error) throw error

      setNewGuest({ name: '', phone: '', email: '' })
      setShowAddForm(false)
      await loadGuests()
      alert('Convidado adicionado!')
    } catch (error) {
      console.error('Error adding guest:', error)
      alert('Erro ao adicionar convidado')
    }
  }

  const adminRSVP = async (guestId: string, guestName: string, attending: boolean): Promise<void> => {
    if (!window.confirm(`Confirmar presença de ${guestName} como ADMIN?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('simple_guests')
        .update({
          attending,
          plus_ones: 0,
          confirmed_at: new Date().toISOString(),
          confirmed_by: 'admin'
        })
        .eq('id', guestId)

      if (error) throw error
      await loadGuests()
      alert('RSVP confirmado!')
    } catch (error) {
      console.error('Error confirming RSVP:', error)
      alert('Erro ao confirmar RSVP')
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setNewGuest(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault()
    addGuest()
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
    <div className="min-h-screen bg-hero-gradient py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-burgundy-700 hover:text-blush-600 inline-block mb-4">
              ← Voltar ao Admin
            </Link>
            <h1 className="text-4xl font-playfair font-bold text-burgundy-800">
              Gerenciar Convidados
            </h1>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Convidado
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="glass p-4 text-center">
            <div className="text-2xl font-bold text-burgundy-800">{stats.total}</div>
            <div className="text-sm text-burgundy-600">Total</div>
          </Card>
          <Card className="glass p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-burgundy-600">Confirmados</div>
          </Card>
          <Card className="glass p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
            <div className="text-sm text-burgundy-600">Não Vão</div>
          </Card>
          <Card className="glass p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-burgundy-600">Pendentes</div>
          </Card>
          <Card className="glass p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalPlusOnes}</div>
            <div className="text-sm text-burgundy-600">Acompanhantes</div>
          </Card>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="glass p-6 mb-8">
            <h3 className="text-xl font-bold text-burgundy-800 mb-4">Novo Convidado</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Nome *"
                  value={newGuest.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefone"
                  value={newGuest.phone}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={newGuest.email}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit">Adicionar</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Guest List */}
        <div className="space-y-3">
          {guests.map((guest) => (
            <Card key={guest.id} className="glass p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-burgundy-800">{guest.name}</h3>
                    {guest.attending === true && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        ✓ Confirmado {guest.plus_ones > 0 && `+${guest.plus_ones}`}
                      </span>
                    )}
                    {guest.attending === false && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        ✗ Não vai
                      </span>
                    )}
                    {guest.attending === null && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        ? Pendente
                      </span>
                    )}
                    {guest.confirmed_by === 'admin' && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-burgundy-600 mt-1">
                    {guest.phone && <span className="mr-4">{guest.phone}</span>}
                    {guest.email && <span>{guest.email}</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  {guest.attending !== true && (
                    <Button
                      size="sm"
                      onClick={() => adminRSVP(guest.id, guest.name, true)}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      Confirmar
                    </Button>
                  )}
                  {guest.attending !== false && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adminRSVP(guest.id, guest.name, false)}
                      className="flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Não Vai
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGuest(guest.id, guest.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
