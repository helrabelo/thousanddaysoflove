'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  folder?: string
}

export default function ImageUpload({ currentImageUrl, onImageUploaded, folder = 'timeline' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      const supabase = createClient()

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('wedding-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(fileName)

      setPreview(publicUrl)
      onImageUploaded(publicUrl)
      alert('Foto enviada com sucesso!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Erro ao fazer upload da foto')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB')
      return
    }

    uploadImage(file)
  }

  const removeImage = () => {
    setPreview(null)
    onImageUploaded('')
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-burgundy-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-burgundy-400 mx-auto mb-4" />
          <p className="text-burgundy-600 mb-4">
            {uploading ? 'Enviando...' : 'Clique para selecionar uma foto'}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload">
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              className="cursor-pointer"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('image-upload')?.click()
              }}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Foto
                </>
              )}
            </Button>
          </label>
          <p className="text-xs text-burgundy-500 mt-2">
            PNG, JPG ou JPEG (máx. 5MB)
          </p>
        </div>
      )}

      {/* Fallback: Manual URL input */}
      <details className="text-sm">
        <summary className="cursor-pointer text-burgundy-600 hover:text-burgundy-800">
          Ou cole uma URL externa
        </summary>
        <input
          type="url"
          value={preview || ''}
          onChange={(e) => {
            setPreview(e.target.value)
            onImageUploaded(e.target.value)
          }}
          className="w-full px-3 py-2 border border-burgundy-200 rounded-lg mt-2"
          placeholder="https://..."
        />
      </details>
    </div>
  )
}