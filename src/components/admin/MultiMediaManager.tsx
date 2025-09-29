'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon, Video, AlertCircle, Star, GripVertical, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TimelineEventMedia {
  id?: string
  media_type: 'image' | 'video'
  media_url: string
  caption?: string
  display_order: number
  is_primary: boolean
}

interface MultiMediaManagerProps {
  eventId?: string
  currentMedia?: TimelineEventMedia[]
  onMediaUpdated: (media: TimelineEventMedia[]) => void
  maxMedia?: number
  folder?: string
  maxSizeMB?: number
}

export default function MultiMediaManager({
  eventId,
  currentMedia = [],
  onMediaUpdated,
  maxMedia = 10,
  folder = 'timeline',
  maxSizeMB = 15
}: MultiMediaManagerProps) {
  const [mediaList, setMediaList] = useState<TimelineEventMedia[]>(currentMedia)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    setMediaList(currentMedia)
  }, [currentMedia])

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Max dimensions 1920x1080
          const maxWidth = 1920
          const maxHeight = 1080

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error('Falha ao comprimir imagem'))
              }
            },
            'image/jpeg',
            0.85
          )
        }
        img.onerror = () => reject(new Error('Falha ao carregar imagem'))
      }
      reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
    })
  }

  const uploadMedia = async (file: File, type: 'image' | 'video') => {
    try {
      setUploading(true)
      setError(null)
      setUploadProgress(10)
      const supabase = createClient()

      let fileToUpload: File | Blob = file

      // Compress images if needed
      if (type === 'image' && file.size > 2 * 1024 * 1024) {
        setUploadProgress(20)
        fileToUpload = await compressImage(file)
      }

      setUploadProgress(40)

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      setUploadProgress(80)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(fileName)

      setUploadProgress(100)

      // Add to media list
      const newMedia: TimelineEventMedia = {
        media_type: type,
        media_url: publicUrl,
        caption: '',
        display_order: mediaList.length,
        is_primary: mediaList.length === 0 // First one is primary
      }

      const updatedMedia = [...mediaList, newMedia]
      setMediaList(updatedMedia)
      onMediaUpdated(updatedMedia)

      setTimeout(() => {
        setUploadProgress(0)
      }, 500)
    } catch (error: any) {
      console.error('Error uploading media:', error)
      setError(error.message || 'Erro ao fazer upload')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (mediaList.length + files.length > maxMedia) {
      setError(`Máximo de ${maxMedia} mídias por evento`)
      return
    }

    setError(null)

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Detect media type
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')

      if (!isImage && !isVideo) {
        setError('Por favor, selecione apenas imagens ou vídeos')
        continue
      }

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        setError(`Arquivo muito grande. Máximo ${maxSizeMB}MB`)
        continue
      }

      const type: 'image' | 'video' = isVideo ? 'video' : 'image'
      await uploadMedia(file, type)
    }
  }

  const removeMedia = (index: number) => {
    const updatedMedia = mediaList.filter((_, i) => i !== index)

    // Reorder display_order
    updatedMedia.forEach((media, idx) => {
      media.display_order = idx
    })

    // If removed was primary, make first one primary
    if (mediaList[index].is_primary && updatedMedia.length > 0) {
      updatedMedia[0].is_primary = true
    }

    setMediaList(updatedMedia)
    onMediaUpdated(updatedMedia)
  }

  const setPrimary = (index: number) => {
    const updatedMedia = mediaList.map((media, idx) => ({
      ...media,
      is_primary: idx === index
    }))
    setMediaList(updatedMedia)
    onMediaUpdated(updatedMedia)
  }

  const updateCaption = (index: number, caption: string) => {
    const updatedMedia = [...mediaList]
    updatedMedia[index] = { ...updatedMedia[index], caption }
    setMediaList(updatedMedia)
    onMediaUpdated(updatedMedia)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const updatedMedia = [...mediaList]
    const draggedItem = updatedMedia[draggedIndex]
    updatedMedia.splice(draggedIndex, 1)
    updatedMedia.splice(index, 0, draggedItem)

    // Update display_order
    updatedMedia.forEach((media, idx) => {
      media.display_order = idx
    })

    setMediaList(updatedMedia)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    onMediaUpdated(mediaList)
  }

  const canAddMore = mediaList.length < maxMedia

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Media Grid */}
      {mediaList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mediaList.map((media, index) => (
            <Card
              key={index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="glass p-3 cursor-move relative"
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 bg-white/80 rounded p-1">
                <GripVertical className="w-4 h-4 text-gray-600" />
              </div>

              {/* Primary Badge */}
              {media.is_primary && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Principal
                </div>
              )}

              {/* Media Preview */}
              <div className="relative mb-3">
                {media.media_type === 'image' ? (
                  <img
                    src={media.media_url}
                    alt={media.caption || `Mídia ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={media.media_url}
                    className="w-full h-48 rounded-lg"
                    controls
                  />
                )}
              </div>

              {/* Caption Input */}
              <input
                type="text"
                value={media.caption || ''}
                onChange={(e) => updateCaption(index, e.target.value)}
                className="w-full px-3 py-2 border border-burgundy-200 rounded-lg text-sm mb-2"
                placeholder="Legenda (opcional)"
              />

              {/* Actions */}
              <div className="flex gap-2">
                {!media.is_primary && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setPrimary(index)}
                    className="flex-1"
                  >
                    Definir como principal
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeMedia(index)}
                  className="text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Type Badge */}
              <p className="text-xs text-burgundy-600 mt-2 flex items-center gap-2">
                {media.media_type === 'image' ? (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    Foto
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    Vídeo
                  </>
                )}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {canAddMore && (
        <div className="border-2 border-dashed border-burgundy-300 rounded-lg p-8 text-center">
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-burgundy-500 mx-auto animate-spin" />
              <p className="text-burgundy-600">Enviando... {uploadProgress}%</p>
              <div className="w-full bg-burgundy-100 rounded-full h-2">
                <div
                  className="bg-blush-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <Plus className="w-12 h-12 text-burgundy-400 mx-auto mb-4" />
              <p className="text-burgundy-600 mb-2">
                Adicionar mais fotos ou vídeos ({mediaList.length}/{maxMedia})
              </p>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                id="multi-media-upload"
                multiple
              />
              <label htmlFor="multi-media-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('multi-media-upload')?.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivos
                </Button>
              </label>
              <p className="text-xs text-burgundy-500 mt-3">
                Imagens: PNG, JPG, JPEG • Vídeos: MP4, MOV (máx. {maxSizeMB}MB cada)
              </p>
              <p className="text-xs text-burgundy-400 mt-1">
                Arraste as mídias para reordenar
              </p>
            </>
          )}
        </div>
      )}

      {mediaList.length === 0 && (
        <p className="text-center text-burgundy-500 text-sm">
          Nenhuma mídia adicionada ainda
        </p>
      )}
    </div>
  )
}