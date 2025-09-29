'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface AboutUsItem {
  id: string
  section: string
  title: string
  description: string | null
  icon: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
}

export default function AdminAboutUs() {
  const [items, setItems] = useState<AboutUsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<AboutUsItem>>({})

  const sections = ['header', 'personality', 'shared', 'individual', 'pets']

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('about_us_items')
        .select('*')
        .order('section')
        .order('display_order')

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error loading items:', error)
      alert('Erro ao carregar itens')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (item: AboutUsItem) => {
    setEditingId(item.id)
    setEditForm(item)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveItem = async () => {
    if (!editingId || !editForm.title) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('about_us_items')
        .update({
          title: editForm.title,
          description: editForm.description,
          icon: editForm.icon,
          section: editForm.section,
          display_order: editForm.display_order
        })
        .eq('id', editingId)

      if (error) throw error

      await loadItems()
      cancelEdit()
      alert('Item atualizado!')
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Erro ao salvar item')
    }
  }

  const deleteItem = async (id: string, title: string) => {
    if (!window.confirm(`Deletar "${title}"?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('about_us_items')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadItems()
      alert('Item deletado')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Erro ao deletar item')
    }
  }

  const addNewItem = async () => {
    const title = prompt('Título do novo item:')
    if (!title) return

    const section = prompt(`Seção (${sections.join(', ')}):`, 'shared')
    if (!section || !sections.includes(section)) {
      alert('Seção inválida')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('about_us_items')
        .insert({
          title,
          section,
          description: '',
          display_order: items.filter(i => i.section === section).length + 1
        })

      if (error) throw error
      await loadItems()
      alert('Item adicionado!')
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Erro ao adicionar item')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center">
        <p className="text-burgundy-700">Carregando...</p>
      </div>
    )
  }

  const itemsBySection = sections.map(section => ({
    section,
    items: items.filter(i => i.section === section)
  }))

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
              Gerenciar Sobre Nós
            </h1>
          </div>
          <Button onClick={addNewItem} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Item
          </Button>
        </div>

        {/* Items by Section */}
        {itemsBySection.map(({ section, items: sectionItems }) => (
          <div key={section} className="mb-8">
            <h2 className="text-2xl font-bold text-burgundy-800 mb-4 capitalize">
              {section}
            </h2>
            <div className="space-y-3">
              {sectionItems.map((item) => (
                <Card key={item.id} className="glass p-4">
                  {editingId === item.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-burgundy-200 rounded-lg"
                        placeholder="Título"
                      />
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-burgundy-200 rounded-lg"
                        placeholder="Descrição"
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editForm.icon || ''}
                          onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                          className="px-3 py-2 border border-burgundy-200 rounded-lg"
                          placeholder="Ícone (ex: Wine, Home)"
                        />
                        <input
                          type="number"
                          value={editForm.display_order || 0}
                          onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
                          className="px-3 py-2 border border-burgundy-200 rounded-lg"
                          placeholder="Ordem"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={saveItem} className="flex items-center gap-1">
                          <Save className="w-4 h-4" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="flex items-center gap-1">
                          <X className="w-4 h-4" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-burgundy-800">{item.title}</h3>
                          {item.icon && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {item.icon}
                            </span>
                          )}
                          <span className="text-xs text-burgundy-500">
                            Ordem: {item.display_order}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-burgundy-600">{item.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(item)}
                          className="flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteItem(item.id, item.title)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}