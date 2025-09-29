'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Image as ImageIcon, Video, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type MediaType = 'image' | 'video'

interface MediaManagerProps {
  currentMediaUrl?: string | null
  currentMediaType?: MediaType
  onMediaUploaded: (url: string, type: MediaType) => void
  allowVideo?: boolean
  folder?: string
  maxSizeMB?: number
}

export default function MediaManager({
  currentMediaUrl,
  currentMediaType = 'image',
  onMediaUploaded,
  allowVideo = false,
  folder = 'timeline',
  maxSizeMB = 10
}: MediaManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentMediaUrl || null)
  const [mediaType, setMediaType] = useState<MediaType>(currentMediaType)
  const [error, setError] = useState<string | null>(null)

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

  const uploadMedia = async (file: File, type: MediaType) => {
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
      setPreview(publicUrl)
      setMediaType(type)
      onMediaUploaded(publicUrl, type)

      setTimeout(() => {
        setUploadProgress(0)
        alert(`${type === 'image' ? 'Foto' : 'Vídeo'} enviado com sucesso!`)
      }, 500)
    } catch (error: any) {
      console.error('Error uploading media:', error)
      setError(error.message || 'Erro ao fazer upload')
      alert(`Erro ao fazer upload: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Detect media type
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isImage && !isVideo) {
      setError('Por favor, selecione uma imagem ou vídeo')
      return
    }

    if (isVideo && !allowVideo) {
      setError('Vídeos não são suportados aqui')
      return
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Máximo ${maxSizeMB}MB`)
      return
    }

    const type: MediaType = isVideo ? 'video' : 'image'
    uploadMedia(file, type)
  }

  const removeMedia = () => {
    setPreview(null)
    setMediaType('image')
    setError(null)
    onMediaUploaded('', 'image')
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {preview ? (
        <Card className="glass p-4">
          <div className="relative">
            {mediaType === 'image' ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full h-64 rounded-lg"
              />
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={removeMedia}
              className="absolute top-2 right-2 bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-burgundy-600 mt-2 flex items-center gap-2">
            {mediaType === 'image' ? (
              <>
                <ImageIcon className="w-4 h-4" />
                Foto enviada
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Vídeo enviado
              </>
            )}
          </p>
        </Card>
      ) : (
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
              <Upload className="w-12 h-12 text-burgundy-400 mx-auto mb-4" />
              <p className="text-burgundy-600 mb-2">
                Clique para selecionar {allowVideo ? 'foto ou vídeo' : 'foto'}
              </p>
              <input
                type="file"
                accept={allowVideo ? 'image/*,video/*' : 'image/*'}
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload">
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('media-upload')?.click()
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </label>
              <p className="text-xs text-burgundy-500 mt-3">
                {allowVideo
                  ? `Imagens: PNG, JPG, JPEG • Vídeos: MP4, MOV (máx. ${maxSizeMB}MB)`
                  : `PNG, JPG, JPEG (máx. ${maxSizeMB}MB)`}
              </p>
              <p className="text-xs text-burgundy-400 mt-1">
                Imagens grandes serão automaticamente otimizadas
              </p>
            </>
          )}
        </div>
      )}

      {/* Fallback: Manual URL input */}
      <details className="text-sm">
        <summary className="cursor-pointer text-burgundy-600 hover:text-burgundy-800">
          Ou cole uma URL externa
        </summary>
        <div className="mt-2 space-y-2">
          <input
            type="url"
            value={preview || ''}
            onChange={(e) => {
              setPreview(e.target.value)
              onMediaUploaded(e.target.value, mediaType)
            }}
            className="w-full px-3 py-2 border border-burgundy-200 rounded-lg"
            placeholder="https://..."
          />
          {allowVideo && (
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
              className="w-full px-3 py-2 border border-burgundy-200 rounded-lg"
            >
              <option value="image">Imagem</option>
              <option value="video">Vídeo</option>
            </select>
          )}
        </div>
      </details>
    </div>
  )
}