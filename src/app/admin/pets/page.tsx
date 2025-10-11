'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Save, X, Heart } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

interface Pet {
  id: string
  name: string
  nickname: string | null
  species: 'dog' | 'cat' | 'other'
  breed: string | null
  description: string | null
  personality: string | null
  image_url: string
  thumbnail_url: string | null
  date_joined: string | null
  is_visible: boolean
  display_order: number
}

export default function AdminPets() {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Pet>>({})
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadPets()
  }, [])

  const loadPets = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('display_order')

      if (error) throw error
      setPets(data || [])
    } catch (error) {
      console.error('Error loading pets:', error)
      alert('Erro ao carregar pets')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (pet: Pet) => {
    setEditingId(pet.id)
    setEditForm(pet)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
    setShowAddForm(false)
  }

  const savePet = async () => {
    if (!editForm.name || !editForm.species || !editForm.image_url) {
      alert('Nome, espécie e imagem são obrigatórios')
      return
    }

    try {
      const supabase = createClient()

      if (editingId) {
        // Update existing pet
        const { error } = await supabase
          .from('pets')
          .update({
            name: editForm.name,
            nickname: editForm.nickname,
            species: editForm.species,
            breed: editForm.breed,
            description: editForm.description,
            personality: editForm.personality,
            image_url: editForm.image_url,
            thumbnail_url: editForm.thumbnail_url,
            date_joined: editForm.date_joined,
            is_visible: editForm.is_visible ?? true,
            display_order: editForm.display_order || 0
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Insert new pet
        const { error } = await supabase
          .from('pets')
          .insert({
            name: editForm.name,
            nickname: editForm.nickname,
            species: editForm.species,
            breed: editForm.breed,
            description: editForm.description,
            personality: editForm.personality,
            image_url: editForm.image_url,
            thumbnail_url: editForm.thumbnail_url,
            date_joined: editForm.date_joined,
            is_visible: editForm.is_visible ?? true,
            display_order: editForm.display_order || pets.length + 1
          })

        if (error) throw error
      }

      await loadPets()
      cancelEdit()
      alert('Pet salvo!')
    } catch (error) {
      console.error('Error saving pet:', error)
      alert('Erro ao salvar pet')
    }
  }

  const deletePet = async (id: string, name: string) => {
    if (!window.confirm(`Deletar "${name}"?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadPets()
      alert('Pet deletado')
    } catch (error) {
      console.error('Error deleting pet:', error)
      alert('Erro ao deletar pet')
    }
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditForm({
      name: '',
      species: 'cat',
      is_visible: true,
      display_order: pets.length + 1
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
              Gerenciar Nossa Família
            </h1>
            <p className="text-burgundy-600 mt-2">{pets.length} pets cadastrados</p>
          </div>
          <Button onClick={startAdd} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar Pet
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="glass p-6 mb-8">
            <h3 className="text-xl font-bold text-burgundy-800 mb-4">
              {editingId ? 'Editar Pet' : 'Novo Pet'}
            </h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Nome *"
                />
                <input
                  type="text"
                  value={editForm.nickname || ''}
                  onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Apelido"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={editForm.species || 'cat'}
                  onChange={(e) => setEditForm({ ...editForm, species: e.target.value as 'dog' | 'cat' | 'other' })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                >
                  <option value="cat">Gato 🐱</option>
                  <option value="dog">Cachorro 🐶</option>
                  <option value="other">Outro 🐾</option>
                </select>
                <input
                  type="text"
                  value={editForm.breed || ''}
                  onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Raça"
                />
              </div>

              <input
                type="text"
                value={editForm.personality || ''}
                onChange={(e) => setEditForm({ ...editForm, personality: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="Personalidade (ex: Matriarca Autista 👑)"
              />

              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-burgundy-200 rounded-lg"
                placeholder="Descrição"
                rows={3}
              />

              <div>
                <label className="block text-sm font-medium text-burgundy-700 mb-2">
                  Foto do Pet (600x600 recomendado)
                </label>
                <ImageUpload
                  currentImageUrl={editForm.image_url || null}
                  onImageUploaded={(url) => setEditForm({ ...editForm, image_url: url })}
                  folder="pets"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="date"
                  value={editForm.date_joined || ''}
                  onChange={(e) => setEditForm({ ...editForm, date_joined: e.target.value })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Data que entrou na família"
                />
                <input
                  type="number"
                  value={editForm.display_order || 0}
                  onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-burgundy-200 rounded-lg"
                  placeholder="Ordem"
                />
                <label className="flex items-center gap-2 px-4 py-2 border border-burgundy-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={editForm.is_visible ?? true}
                    onChange={(e) => setEditForm({ ...editForm, is_visible: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <span className="text-burgundy-700">Visível no site</span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button onClick={savePet} className="flex items-center gap-2">
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

        {/* Pets Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="glass p-6">
              <div className="flex gap-4">
                {/* Pet Image */}
                {pet.image_url && (
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="w-24 h-24 object-cover rounded-full border-4 border-burgundy-100"
                  />
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-burgundy-800">
                        {pet.name}
                        {pet.species === 'cat' && ' 🐱'}
                        {pet.species === 'dog' && ' 🐶'}
                      </h3>
                      {pet.personality && (
                        <p className="text-sm text-burgundy-600 font-medium">{pet.personality}</p>
                      )}
                      {pet.breed && (
                        <p className="text-xs text-burgundy-500">{pet.breed}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(pet)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deletePet(pet.id, pet.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {pet.description && (
                    <p className="text-sm text-burgundy-600 mb-2">{pet.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-burgundy-500">
                    {pet.date_joined && (
                      <span>📅 {new Date(pet.date_joined).toLocaleDateString('pt-BR')}</span>
                    )}
                    <span className={pet.is_visible ? 'text-green-600' : 'text-red-600'}>
                      {pet.is_visible ? '👁️ Visível' : '🚫 Oculto'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="glass p-4 mt-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Dicas</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Tamanho recomendado: 600x600 pixels (quadrado)</li>
            <li>• Formato: JPG ou PNG</li>
            <li>• Use a ordem para controlar a sequência de exibição</li>
            <li>• Marque "Visível no site" para mostrar o pet na página</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
