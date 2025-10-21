'use client'

/**
 * Photo Moderation Grid (Client Component)
 * Handles interactive moderation, selection, and filtering
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, RefreshCw, Loader2, AlertCircle } from 'lucide-react'
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
}: PhotoModerationGridProps) {
  const router = useRouter()
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState<{
    total: number
    pending: number
    approved: number
    rejected: number
  } | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [phaseFilter, setPhaseFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch photos when status filter changes
  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  // Load stats on mount
  useEffect(() => {
    loadStats()
  }, [loadStats])

  const loadPhotos = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/admin/photos?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load photos')

      const data = await response.json()
      setPhotos(data)
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter])

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/photos?action=stats')
      if (!response.ok) throw new Error('Failed to load stats')

      const data: {
        total: number
        pending: number
        approved: number
        rejected: number
      } = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await Promise.all([loadPhotos(), loadStats()])
    setIsRefreshing(false)
  }, [loadPhotos, loadStats])

  // Client-side filtering for phase and search
  const filteredPhotos = photos.filter(photo => {
    // Phase filter
    if (phaseFilter !== 'all' && photo.upload_phase !== phaseFilter) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = photo.guest_name?.toLowerCase().includes(query)
      const matchesCaption = photo.caption?.toLowerCase().includes(query)
      return matchesName || matchesCaption
    }

    return true
  })

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
  }, [focusedIndex, moderateBatch, moderatePhoto, photos, selectedIds])

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

  // Select all (filtered photos)
  const selectAll = () => {
    setSelectedIds(new Set(filteredPhotos.map((p) => p.id)))
  }

  // Deselect all
  const deselectAll = () => {
    setSelectedIds(new Set())
  }

  // Moderate single photo
  const moderatePhoto = useCallback(async (
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
  }, [router])

  // Moderate batch
  const moderateBatch = useCallback(async (
    action: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    if (selectedIds.size === 0) {
      console.log('No photos selected for batch moderation')
      return
    }

    console.log(`Starting batch ${action} for ${selectedIds.size} photos`)
    setIsLoading(true)

    try {
      const ids = Array.from(selectedIds)
      const promises = ids.map(async (id) => {
        console.log(`Moderating photo ${id} as ${action}`)
        const response = await fetch(`/api/admin/photos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            rejection_reason: rejectionReason,
          }),
        })

        if (!response.ok) {
          const error = await response.text()
          console.error(`Failed to moderate photo ${id}:`, error)
          throw new Error(`Failed to moderate photo ${id}`)
        }

        console.log(`Successfully moderated photo ${id}`)
        return response
      })

      const results = await Promise.all(promises)
      console.log(`Batch moderation completed: ${results.length} photos processed`)

      // Update local state immediately
      setPhotos((prev) =>
        prev.map((p) =>
          selectedIds.has(p.id)
            ? {
                ...p,
                moderation_status: action,
                moderated_at: new Date().toISOString(),
                rejection_reason: rejectionReason || null,
              }
            : p
        )
      )

      // Clear selection
      setSelectedIds(new Set())

      // Reload data
      await Promise.all([loadPhotos(), loadStats()])
    } catch (error) {
      console.error('Batch moderation error:', error)
      alert('Erro ao moderar fotos em lote')
    } finally {
      setIsLoading(false)
    }
  }, [loadPhotos, loadStats, selectedIds])

  return (
    <div className="min-h-screen  py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-serif text-[#2C2C2C]">
              Moderação de Fotos
            </h1>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-[#E8E6E3] p-4">
                <p className="text-sm text-[#4A4A4A] mb-1">Total</p>
                <p className="text-2xl font-semibold text-[#2C2C2C]">{stats.total}</p>
              </div>
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                <p className="text-sm text-amber-700 mb-1">Pendentes</p>
                <p className="text-2xl font-semibold text-amber-900">{stats.pending}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                <p className="text-sm text-green-700 mb-1">Aprovadas</p>
                <p className="text-2xl font-semibold text-green-900">{stats.approved}</p>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                <p className="text-sm text-red-700 mb-1">Rejeitadas</p>
                <p className="text-2xl font-semibold text-red-900">{stats.rejected}</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-[#E8E6E3] p-4 mb-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A8A8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome ou legenda..."
                className="w-full pl-10 pr-4 py-2 border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8]"
              />
            </div>
          </div>

          {/* Filter Buttons Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter Buttons */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      statusFilter === status
                        ? 'bg-[#2C2C2C] text-white'
                        : ' text-[#4A4A4A] hover:bg-[#E8E6E3]'
                    }`}
                  >
                    {status === 'all' && 'Todos'}
                    {status === 'pending' && 'Pendentes'}
                    {status === 'approved' && 'Aprovados'}
                    {status === 'rejected' && 'Rejeitados'}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase Filter Buttons */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
                Fase
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'before', 'during', 'after'] as const).map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setPhaseFilter(phase)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      phaseFilter === phase
                        ? 'bg-[#2C2C2C] text-white'
                        : ' text-[#4A4A4A] hover:bg-[#E8E6E3]'
                    }`}
                  >
                    {phase === 'all' && 'Todas'}
                    {phase === 'before' && 'Antes'}
                    {phase === 'during' && 'Durante'}
                    {phase === 'after' && 'Depois'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Select All & Batch Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8E6E3]">
            <div className="flex items-center gap-4">
              {/* Select All Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredPhotos.length && filteredPhotos.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      selectAll()
                    } else {
                      deselectAll()
                    }
                  }}
                  className="w-4 h-4 rounded border-[#E8E6E3]"
                />
                <span className="text-sm text-[#2C2C2C] font-medium">
                  Selecionar Todas ({filteredPhotos.length})
                </span>
              </label>

              {selectedIds.size > 0 && (
                <span className="text-sm text-[#4A4A4A]">
                  {selectedIds.size} foto(s) selecionada(s)
                </span>
              )}
            </div>

            {/* Batch Action Buttons */}
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moderateBatch('approved')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                >
                  Aprovar Selecionadas
                </button>
                <button
                  type="button"
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
                  type="button"
                  onClick={deselectAll}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
                >
                  Desmarcar Todas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-[#A8A8A8] animate-spin mx-auto mb-4" />
            <p className="text-[#4A4A4A]">Carregando fotos...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#E8E6E3] p-12 text-center">
            <AlertCircle className="w-12 h-12 text-[#A8A8A8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2C2C2C] mb-2">
              Nenhuma foto encontrada
            </h3>
            <p className="text-[#4A4A4A]">
              {searchQuery || phaseFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Não há fotos neste status'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo, index) => (
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
        <div className="mt-8 bg-white rounded-lg border border-[#E8E6E3] p-4">
          <h3 className="text-sm font-semibold text-[#2C2C2C] mb-2">
            Atalhos de Teclado
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#4A4A4A]">
            <div><kbd className="px-2 py-1  rounded">A</kbd> = Aprovar</div>
            <div><kbd className="px-2 py-1  rounded">R</kbd> = Rejeitar</div>
            <div><kbd className="px-2 py-1  rounded">Space</kbd> = Selecionar</div>
            <div><kbd className="px-2 py-1  rounded">Esc</kbd> = Limpar</div>
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
  const selectionLabel = isSelected ? 'Desmarcar foto' : 'Selecionar foto'

  return (
    <div
      data-testid="photo-card"
      data-photo-id={photo.id}
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
          type="button"
          aria-pressed={isSelected}
          aria-label={selectionLabel}
          data-testid="photo-select-toggle"
          onClick={onToggleSelect}
          className="absolute top-2 left-2 w-6 h-6 bg-white rounded-md shadow-md flex items-center justify-center"
        >
          {isSelected && (
            <span className="text-blue-600" aria-hidden="true">
              ✓
            </span>
          )}
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
          data-testid="photo-status"
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
