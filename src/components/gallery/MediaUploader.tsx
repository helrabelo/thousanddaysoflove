'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, X, Plus, Image, Video, Calendar, MapPin, Tag,
  Loader2, Check, AlertCircle, Camera, Heart
} from 'lucide-react'
import { MediaUpload, MediaCategory } from '@/types/wedding'
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'

interface MediaUploaderProps {
  onUpload?: (uploads: MediaUpload[]) => Promise<void>
  onClose?: () => void
  maxFiles?: number
  maxSizePerFile?: number // in MB
  allowedTypes?: string[]
  categories?: MediaCategory[]
}

const defaultCategories: MediaCategory[] = [
  'engagement', 'travel', 'dates', 'family', 'friends',
  'special_moments', 'proposal', 'wedding_prep', 'behind_scenes', 'professional'
]

const categoryLabels: Record<MediaCategory, string> = {
  engagement: 'Noivado',
  travel: 'Viagens',
  dates: 'Encontros',
  family: 'Família',
  friends: 'Amigos',
  special_moments: 'Momentos Especiais',
  proposal: 'Pedido',
  wedding_prep: 'Preparativos',
  behind_scenes: 'Bastidores',
  professional: 'Profissionais'
}

const categoryIcons: Record<MediaCategory, string> = {
  engagement: '💍',
  travel: '✈️',
  dates: '💕',
  family: '👨‍👩‍👧‍👦',
  friends: '👥',
  special_moments: '⭐',
  proposal: '💖',
  wedding_prep: '👰',
  behind_scenes: '🎬',
  professional: '📷'
}

export default function MediaUploader({
  onUpload,
  onClose,
  maxFiles = 50,
  maxSizePerFile = 100, // 100MB
  allowedTypes = ['image/*', 'video/*'],
  categories = defaultCategories
}: MediaUploaderProps) {
  const [uploads, setUploads] = useState<MediaUpload[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])
  const [selectedUpload, setSelectedUpload] = useState<MediaUpload | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSizePerFile * 1024 * 1024) {
      return `Arquivo muito grande. Máximo ${maxSizePerFile}MB.`
    }

    // Check file type
    const isValidType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('*', ''))
      }
      return file.type === type
    })

    if (!isValidType) {
      return 'Tipo de arquivo não suportado. Use apenas fotos e vídeos.'
    }

    return null
  }, [maxSizePerFile, allowedTypes])

  const processFiles = useCallback((files: File[]) => {
    const newErrors: string[] = []
    const newUploads: MediaUpload[] = []

    // Check total file limit
    if (uploads.length + files.length > maxFiles) {
      newErrors.push(`Máximo ${maxFiles} arquivos permitidos.`)
      setErrors(newErrors)
      return
    }

    files.forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(`${file.name}: ${error}`)
        return
      }

      const upload: MediaUpload = {
        id: generateId(),
        file,
        preview_url: URL.createObjectURL(file),
        upload_progress: 0,
        status: 'pending',
        category: 'special_moments',
        title: file.name.replace(/\.[^/.]+$/, ''),
        description: '',
        tags: [],
        date_taken: '',
        location: '',
        is_featured: false
      }

      newUploads.push(upload)
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    if (newUploads.length > 0) {
      setUploads(prev => [...prev, ...newUploads])
    }
  }, [uploads.length, maxFiles, validateFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  const updateUpload = useCallback((uploadId: string, updates: Partial<MediaUpload>) => {
    setUploads(prev => prev.map(upload =>
      upload.id === uploadId ? { ...upload, ...updates } : upload
    ))
  }, [])

  const removeUpload = useCallback((uploadId: string) => {
    const upload = uploads.find(u => u.id === uploadId)
    if (upload) {
      URL.revokeObjectURL(upload.preview_url)
    }
    setUploads(prev => prev.filter(u => u.id !== uploadId))

    if (selectedUpload?.id === uploadId) {
      setSelectedUpload(null)
    }
  }, [uploads, selectedUpload])

  const handleUpload = useCallback(async () => {
    if (uploads.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Upload files via API route (more secure than direct client upload)
      const uploadedItems = []

      for (let i = 0; i < uploads.length; i++) {
        const upload = uploads[i]
        setUploadProgress((i / uploads.length) * 80)

        const formData = new FormData()
        formData.append('file', upload.file)
        formData.append('category', upload.category)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }

        const result = await response.json()
        uploadedItems.push(result.data)
      }

      setUploadProgress(80)

      // Update each upload with actual media item data
      setUploads(prev => prev.map((upload, index) => {
        const uploadedItem = uploadedItems[index]
        if (uploadedItem) {
          return {
            ...upload,
            status: 'completed',
            upload_progress: 100,
            // Update with actual uploaded data
            title: uploadedItem.title,
            category: uploadedItem.category as MediaCategory,
            description: uploadedItem.description || upload.description,
            tags: uploadedItem.tags || upload.tags,
            date_taken: uploadedItem.date_taken || upload.date_taken,
            location: uploadedItem.location || upload.location,
            is_featured: uploadedItem.is_featured
          }
        }
        return { ...upload, status: 'completed', upload_progress: 100 }
      }))

      setUploadProgress(100)

      // Call the onUpload callback if provided (for backwards compatibility)
      if (onUpload) {
        await onUpload(uploads)
      }

      // Close after a short delay
      setTimeout(() => {
        if (onClose) onClose()
      }, 1500)
    } catch (error) {
      console.error('Error uploading files:', error)
      setErrors(['Erro no upload. Tente novamente.'])
      setUploads(prev => prev.map(upload => ({
        ...upload,
        status: 'failed'
      })))
    } finally {
      setIsUploading(false)
    }
  }, [uploads, onUpload, onClose])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Adicionar Memórias</h2>
              <p className="text-rose-100">
                Compartilhe suas fotos e vídeos especiais
              </p>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-rose-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4">
              <div className="bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-rose-100 mt-1">
                Enviando... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Upload Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Error Messages */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-2">
                        Problemas encontrados:
                      </h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={clearErrors}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop Zone */}
            {uploads.length === 0 && (
              <div
                ref={dropZoneRef}
                className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-300 hover:border-rose-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragActive(true)
                }}
                onDragLeave={() => setIsDragActive(false)}
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: isDragActive ? 1.1 : 1 }}
                >
                  {isDragActive ? '🎉' : '📸'}
                </motion.div>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {isDragActive ? 'Solte os arquivos aqui!' : 'Arraste suas memórias aqui'}
                </h3>

                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Ou clique para selecionar fotos e vídeos do seu dispositivo.
                  Máximo {maxFiles} arquivos, {maxSizePerFile}MB cada.
                </p>

                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-3 py-1 rounded-full">JPG</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">PNG</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">MP4</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full">MOV</span>
                </div>
              </div>
            )}

            {/* Upload Grid */}
            {uploads.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {uploads.length} arquivo{uploads.length !== 1 ? 's' : ''} selecionado{uploads.length !== 1 ? 's' : ''}
                  </h3>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Mais</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploads.map(upload => (
                    <motion.div
                      key={upload.id}
                      className="relative group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setSelectedUpload(upload)}
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative">
                        {upload.file.type.startsWith('image/') ? (
                          <img
                            src={upload.preview_url}
                            alt={upload.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <Video className="w-12 h-12 text-gray-400" />
                          </div>
                        )}

                        {/* Status Overlay */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {upload.status === 'pending' && (
                            <span className="text-white text-sm font-medium">
                              Pronto para envio
                            </span>
                          )}
                          {upload.status === 'uploading' && (
                            <div className="text-white text-center">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
                              <span className="text-sm">{upload.upload_progress}%</span>
                            </div>
                          )}
                          {upload.status === 'completed' && (
                            <div className="text-green-400 text-center">
                              <Check className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">Enviado!</span>
                            </div>
                          )}
                          {upload.status === 'failed' && (
                            <div className="text-red-400 text-center">
                              <AlertCircle className="w-6 h-6 mx-auto mb-1" />
                              <span className="text-sm">Erro</span>
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeUpload(upload.id)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Featured Badge */}
                        {upload.is_featured && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white p-1 rounded-full">
                            <Heart className="w-4 h-4 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {upload.title || upload.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {categoryLabels[upload.category]}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details Panel */}
          {selectedUpload && (
            <motion.div
              className="w-80 border-l border-gray-200 p-6 bg-gray-50 overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Detalhes</h3>
                <button
                  onClick={() => setSelectedUpload(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview */}
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-200">
                {selectedUpload.file.type.startsWith('image/') ? (
                  <img
                    src={selectedUpload.preview_url}
                    alt={selectedUpload.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={selectedUpload.title}
                    onChange={(e) => updateUpload(selectedUpload.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Nome da memória"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={selectedUpload.description}
                    onChange={(e) => updateUpload(selectedUpload.id, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Conte a história desta memória..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    value={selectedUpload.category}
                    onChange={(e) => updateUpload(selectedUpload.id, { category: e.target.value as MediaCategory })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {categoryIcons[category]} {categoryLabels[category]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedUpload.date_taken}
                    onChange={(e) => updateUpload(selectedUpload.id, { date_taken: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Local
                  </label>
                  <input
                    type="text"
                    value={selectedUpload.location}
                    onChange={(e) => updateUpload(selectedUpload.id, { location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Onde foi tirada?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Tags
                  </label>
                  <input
                    type="text"
                    value={selectedUpload.tags.join(', ')}
                    onChange={(e) => updateUpload(selectedUpload.id, {
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="amor, viagem, família..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separe as tags com vírgulas
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={selectedUpload.is_featured}
                    onChange={(e) => updateUpload(selectedUpload.id, { is_featured: e.target.checked })}
                    className="mr-2 w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Destacar esta memória
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {uploads.length > 0 && (
                <span>
                  {uploads.length} arquivo{uploads.length !== 1 ? 's' : ''} •
                  {' '}{Math.round(uploads.reduce((acc, upload) => acc + upload.file.size, 0) / 1024 / 1024)} MB total
                </span>
              )}
            </div>

            <div className="flex space-x-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                  disabled={isUploading}
                >
                  Cancelar
                </button>
              )}

              <button
                onClick={handleUpload}
                disabled={uploads.length === 0 || isUploading}
                className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-2 rounded-full font-semibold hover:from-rose-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Enviar {uploads.length} arquivo{uploads.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>
    </div>
  )
}