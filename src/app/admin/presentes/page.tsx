'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Gift, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Gift {
  id: string
  title: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  priority: string
  is_purchased: boolean
  purchased_by: string | null
  purchased_at: string | null
}

export default function AdminPresentes() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Gift>>({})
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = ['Cozinha', 'Quarto', 'Sala', 'Banheiro', 'Decoração']
  const priorities = ['high', 'medium', 'low']

  useEffect(() => {
    loadGifts()
  }, [])

  const loadGifts = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('priority')
        .order('title')

      if (error) throw error
      setGifts(data || [])
    } catch (error) {
      console.error('Error loading gifts:', error)
      alert('Erro ao carregar presentes')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (gift: Gift) => {
    setEditingId(gift.id)
    setEditForm(gift)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setShowAddForm(false)
  }

  const saveGift = async () => {
    if (!editForm.title || !editForm.price) {
      alert('Título e preço são obrigatórios')
      return
    }

    try {
      const supabase = createClient()

      if (editingId) {
        const { error } = await supabase
          .from('gifts')
          .update({
            title: editForm.title,
            description: editForm.description,
            price: editForm.price,
            category: editForm.category,
            image_url: editForm.image_url,
            priority: editForm.priority
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('gifts')
          .insert({
            title: editForm.title,
            description: editForm.description,
            price: editForm.price,
            category: editForm.category || 'Outros',
            image_url: editForm.image_url,
            priority: editForm.priority || 'medium'
          })

        if (error) throw error
      }

      await loadGifts()
      cancelEdit()
      alert('Presente salvo!')
    } catch (error) {
      console.error('Error saving gift:', error)
      alert('Erro ao salvar presente')
    }
  }

  const deleteGift = async (id: string, title: string) => {
    if (!window.confirm(`Deletar "${title}"?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadGifts()
      alert('Presente deletado')
    } catch (error) {
      console.error('Error deleting gift:', error)
      alert('Erro ao deletar presente')
    }
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditForm({
      title: '',
      price: 0,
      category: 'Cozinha',
      priority: 'medium'
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-burgundy-700 hover:text-blush-600 inline-block mb-4">
              ← Voltar ao Admin
            </Link>
            <h1 className="text-4xl font-playfair font-bold text-burgundy-800">
              Gerenciar Lista de Presentes
            </h1>
            <p className="text-burgundy-600 mt-2">{gifts.length} presentes cadastrados</p>
          </div>
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Presente
          </Button>
        </div>

        {(showAddForm || editingId) && (
          <Card className="glass p-6 mb-8">
            <h3 className="text-xl font-bold text-burgundy-800 mb-4">
              {editingId ? 'Editar Presente' : 'Novo Presente'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="Nome do Presente *"
              />
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="Descrição"
                rows={3}
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="number"
                  value={editForm.price || 0}
                  onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Preço *"
                />
                <select
                  value={editForm.category || 'Cozinha'}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={editForm.priority || 'medium'}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                >
                  <option value="high">Alta Prioridade</option>
                  <option value="medium">Média Prioridade</option>
                  <option value="low">Baixa Prioridade</option>
                </select>
              </div>
              <input
                type="url"
                value={editForm.image_url || ''}
                onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="URL da Imagem"
              />
              <div className="flex gap-3">
                <Button onClick={saveGift} className="flex items-center gap-2">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gifts.map((gift) => (
            <Card key={gift.id} className="glass p-6">
              {gift.image_url && (
                <img
                  src={gift.image_url}
                  alt={gift.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-burgundy-800">{gift.title}</h3>
                  <p className="text-sm text-burgundy-600">{gift.category}</p>
                  <p className="text-lg font-bold text-blush-600 mt-2">
                    R$ {gift.price.toFixed(2)}
                  </p>
                  {gift.is_purchased && (
                    <p className="text-sm text-green-600 mt-1">✓ Comprado</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(gift)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGift(gift.id, gift.title)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {gift.description && (
                <p className="text-burgundy-600 mt-2 text-sm">{gift.description}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}