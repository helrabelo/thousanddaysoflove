'use client'

/**
 * Photo Moderation Grid (Client Component)
 * Handles interactive moderation, selection, and filtering
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatFileSize } from '@/lib/utils/format'

interface Photo {
  id: string
  guest_id: string
  guest_name: string
  caption?: string | null
  title?: string | null
  upload_phase: 'before' | 'during' | 'after'
  storage_path: string
  storage_bucket: string
  public_url: string
  file_size_bytes: number
  mime_type: string
  width?: number | null
  height?: number | null
  is_video: boolean
  moderation_status: 'pending' | 'approved' | 'rejected'
  moderated_at?: string | null
  moderated_by?: string | null
  rejection_reason?: string | null
  uploaded_at: string
  guest?: { name: string }
}

interface PhotoModerationGridProps {
  photos: Photo[]
  initialFilters: {
    status: string
    phase: string
    search: string
  }
}

export default function PhotoModerationGrid({
  photos: initialPhotos,
  initialFilters,
}: PhotoModerationGridProps) {
  const router = useRouter()
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState(initialFilters.status)
  const [phaseFilter, setPhaseFilter] = useState(initialFilters.phase)
  const [searchQuery, setSearchQuery] = useState(initialFilters.search)

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyboard(e: KeyboardEvent) {
      // Don't trigger if user is typing in input
      if ((e.target as HTMLElement).tagName === 'INPUT') return

      const currentPhoto = photos[focusedIndex]

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setFocusedIndex((i) => Math.max(0, i - 1))
          break
        case 'ArrowRight':
          e.preventDefault()
          setFocusedIndex((i) => Math.min(photos.length - 1, i + 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((i) => Math.max(0, i - 4))
          break
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((i) => Math.min(photos.length - 1, i + 4))
          break
        case ' ':
          e.preventDefault()
          if (currentPhoto) toggleSelection(currentPhoto.id)
          break
        case 'a':
          if (!e.shiftKey && currentPhoto) {
            e.preventDefault()
            moderatePhoto(currentPhoto.id, 'approved')
          }
          break
        case 'A':
          e.preventDefault()
          if (selectedIds.size > 0) {
            moderateBatch('approved')
          }
          break
        case 'r':
          if (!e.shiftKey && currentPhoto) {
            e.preventDefault()
            const reason = prompt('Motivo da rejeição:')
            if (reason) {
              moderatePhoto(currentPhoto.id, 'rejected', reason)
            }
          }
          break
        case 'R':
          e.preventDefault()
          if (selectedIds.size > 0) {
            const reason = prompt('Motivo da rejeição em lote:')
            if (reason) {
              moderateBatch('rejected', reason)
            }
          }
          break
        case 'Escape':
          e.preventDefault()
          setSelectedIds(new Set())
          break
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [photos, focusedIndex, selectedIds])

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Select all
  const selectAll = () => {
    setSelectedIds(new Set(photos.map((p) => p.id)))
  }

  // Deselect all
  const deselectAll = () => {
    setSelectedIds(new Set())
  }

  // Moderate single photo
  const moderatePhoto = async (
    id: string,
    action: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejection_reason: rejectionReason,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to moderate photo')
      }

      // Update local state
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                moderation_status: action,
                moderated_at: new Date().toISOString(),
                rejection_reason: rejectionReason || null,
              }
            : p
        )
      )

      // Refresh server-side data
      router.refresh()
    } catch (error) {
      console.error('Moderation error:', error)
      alert('Erro ao moderar foto')
    } finally {
      setIsLoading(false)
    }
  }

  // Moderate batch
  const moderateBatch = async (
    action: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    if (selectedIds.size === 0) return

    setIsLoading(true)

    try {
      const promises = Array.from(selectedIds).map((id) =>
        fetch(`/api/admin/photos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            rejection_reason: rejectionReason,
          }),
        })
      )

      await Promise.all(promises)

      // Clear selection
      setSelectedIds(new Set())

      // Refresh
      router.refresh()
    } catch (error) {
      console.error('Batch moderation error:', error)
      alert('Erro ao moderar fotos em lote')
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters via URL
  const applyFilters = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (phaseFilter !== 'all') params.set('phase', phaseFilter)
    if (searchQuery) params.set('search', searchQuery)

    router.push(`/admin/photos?${params.toString()}`)
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-md focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="approved">Aprovado</option>
              <option value="rejected">Rejeitado</option>
            </select>
          </div>

          {/* Phase Filter */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Fase
            </label>
            <select
              value={phaseFilter}
              onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-md focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="before">Antes</option>
              <option value="during">Durante</option>
              <option value="after">Depois</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Buscar Convidado
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nome do convidado..."
              className="w-full px-4 py-2 border border-[#E8E6E3] rounded-md focus:ring-2 focus:ring-[#2C2C2C] focus:border-transparent"
            />
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="w-full px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#4A4A4A] transition-colors"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedIds.size} foto(s) selecionada(s)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => moderateBatch('approved')}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                Aprovar Selecionadas
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Motivo da rejeição:')
                  if (reason) moderateBatch('rejected', reason)
                }}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
              >
                Rejeitar Selecionadas
              </button>
              <button
                onClick={deselectAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
              >
                Desmarcar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#4A4A4A]">Nenhuma foto encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isSelected={selectedIds.has(photo.id)}
              isFocused={index === focusedIndex}
              onToggleSelect={() => toggleSelection(photo.id)}
              onApprove={() => moderatePhoto(photo.id, 'approved')}
              onReject={() => {
                const reason = prompt('Motivo da rejeição:')
                if (reason) moderatePhoto(photo.id, 'rejected', reason)
              }}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-medium text-[#2C2C2C] mb-4">
          Atalhos de Teclado
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">←→↑↓</kbd>
            <span className="ml-2 text-[#4A4A4A]">Navegar</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Space</kbd>
            <span className="ml-2 text-[#4A4A4A]">Selecionar</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">A</kbd>
            <span className="ml-2 text-[#4A4A4A]">Aprovar</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">R</kbd>
            <span className="ml-2 text-[#4A4A4A]">Rejeitar</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Shift+A</kbd>
            <span className="ml-2 text-[#4A4A4A]">Aprovar Lote</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Shift+R</kbd>
            <span className="ml-2 text-[#4A4A4A]">Rejeitar Lote</span>
          </div>
          <div>
            <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd>
            <span className="ml-2 text-[#4A4A4A]">Limpar Seleção</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Photo Card Component
interface PhotoCardProps {
  photo: Photo
  isSelected: boolean
  isFocused: boolean
  onToggleSelect: () => void
  onApprove: () => void
  onReject: () => void
  isLoading: boolean
}

function PhotoCard({
  photo,
  isSelected,
  isFocused,
  onToggleSelect,
  onApprove,
  onReject,
  isLoading,
}: PhotoCardProps) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    approved: 'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300',
  }

  const phaseLabels = {
    before: 'Antes',
    during: 'Durante',
    after: 'Depois',
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      } ${isFocused ? 'ring-2 ring-gray-400' : ''}`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {photo.is_video ? (
          <video
            src={photo.public_url}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <Image
            src={photo.public_url}
            alt={photo.title || 'Guest photo'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}

        {/* Selection Checkbox */}
        <button
          onClick={onToggleSelect}
          className="absolute top-2 left-2 w-6 h-6 bg-white rounded-md shadow-md flex items-center justify-center"
        >
          {isSelected && <span className="text-blue-600">✓</span>}
        </button>

        {/* Phase Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded-md text-xs font-medium">
          {phaseLabels[photo.upload_phase]}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Guest Name */}
        <p className="font-medium text-[#2C2C2C] mb-1">
          {photo.guest?.name || photo.guest_name}
        </p>

        {/* Caption */}
        {photo.caption && (
          <p className="text-sm text-[#4A4A4A] mb-2 line-clamp-2">
            {photo.caption}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-[#4A4A4A] mb-3">
          <span>{formatFileSize(photo.file_size_bytes)}</span>
          <span>•</span>
          <span>
            {new Date(photo.uploaded_at).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Status Badge */}
        <div
          className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border mb-3 ${
            statusColors[photo.moderation_status]
          }`}
        >
          {photo.moderation_status === 'pending' && 'Pendente'}
          {photo.moderation_status === 'approved' && 'Aprovado'}
          {photo.moderation_status === 'rejected' && 'Rejeitado'}
        </div>

        {/* Rejection Reason */}
        {photo.rejection_reason && (
          <p className="text-xs text-red-600 mb-3">{photo.rejection_reason}</p>
        )}

        {/* Actions */}
        {photo.moderation_status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              Aprovar
            </button>
            <button
              onClick={onReject}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
            >
              Rejeitar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
