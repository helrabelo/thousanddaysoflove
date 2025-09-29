'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X, Calendar, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TimelineEvent {
  id: string
  title: string
  date: string
  description: string | null
  location: string | null
  image_url: string | null
  milestone_type: string
  display_order: number
  is_visible: boolean
}

export default function AdminTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<TimelineEvent>>({})
  const [showAddForm, setShowAddForm] = useState(false)

  const milestoneTypes = [
    { value: 'first_meet', label: 'Primeiro Encontro' },
    { value: 'proposal', label: 'Pedido' },
    { value: 'pet', label: 'Pet' },
    { value: 'home', label: 'Casa' },
    { value: 'anniversary', label: 'Aniversário' },
    { value: 'other', label: 'Outro' }
  ]

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('date')
        .order('display_order')

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
      alert('Erro ao carregar eventos')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (event: TimelineEvent) => {
    setEditingId(event.id)
    setEditForm(event)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setShowAddForm(false)
  }

  const saveEvent = async () => {
    if (!editForm.title || !editForm.date) {
      alert('Título e data são obrigatórios')
      return
    }

    try {
      const supabase = createClient()

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('timeline_events')
          .update({
            title: editForm.title,
            date: editForm.date,
            description: editForm.description,
            location: editForm.location,
            image_url: editForm.image_url,
            milestone_type: editForm.milestone_type,
            display_order: editForm.display_order
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Insert new
        const { error } = await supabase
          .from('timeline_events')
          .insert({
            title: editForm.title,
            date: editForm.date,
            description: editForm.description,
            location: editForm.location,
            image_url: editForm.image_url,
            milestone_type: editForm.milestone_type || 'other',
            display_order: editForm.display_order || 0
          })

        if (error) throw error
      }

      await loadEvents()
      cancelEdit()
      alert('Evento salvo!')
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Erro ao salvar evento')
    }
  }

  const deleteEvent = async (id: string, title: string) => {
    if (!window.confirm(`Deletar "${title}"?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadEvents()
      alert('Evento deletado')
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Erro ao deletar evento')
    }
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      milestone_type: 'other',
      display_order: events.length + 1
    })
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
              Gerenciar Nossa História
            </h1>
            <p className="text-burgundy-600 mt-2">{events.length} eventos na timeline</p>
          </div>
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Evento
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="glass p-6 mb-8">
            <h3 className="text-xl font-bold text-burgundy-800 mb-4">
              {editingId ? 'Editar Evento' : 'Novo Evento'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="Título *"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={editForm.date || ''}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                />
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Local"
                />
              </div>
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="Descrição"
                rows={3}
              />
              <input
                type="url"
                value={editForm.image_url || ''}
                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="URL da Foto"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={editForm.milestone_type || 'other'}
                  onChange={(e) => setEditForm({ ...editForm, milestone_type: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                >
                  {milestoneTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editForm.display_order || 0}
                  onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Ordem"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={saveEvent} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Timeline Events */}
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className="glass p-6">
              <div className="flex gap-6">
                {/* Image */}
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-burgundy-800">{event.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-burgundy-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('pt-BR')}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        )}
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          {milestoneTypes.find(t => t.value === event.milestone_type)?.label || event.milestone_type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(event)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteEvent(event.id, event.title)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {event.description && (
                    <p className="text-burgundy-600 mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}