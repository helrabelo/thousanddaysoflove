'use client'

/**
 * Guest Photo/Video Upload Page
 * Drag-and-drop upload interface with real-time progress
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { validateFile, formatFileSize, type UploadPhase } from '@/lib/supabase/storage'

interface UploadFile {
  id: string
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  autoApproved?: boolean
}

export default function GuestUploadPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [guestName, setGuestName] = useState('')

  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('during')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [caption, setCaption] = useState('')

  // Verify authentication on mount
  useEffect(() => {
    verifyAuth()
  }, [])

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify')
      const data = await response.json()

      if (response.ok && data.success) {
        setAuthenticated(true)
        setGuestName(data.session.guest?.name || 'Convidado')
      } else {
        router.push('/dia-1000/login')
      }
    } catch (error) {
      console.error('Auth verification error:', error)
      router.push('/dia-1000/login')
    } finally {
      setLoading(false)
    }
  }

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  // Upload file
  const uploadFile = async (uploadFile: UploadFile) => {
    // Validate file
    const validation = validateFile(uploadFile.file)
    if (!validation.valid) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'error', error: validation.error }
            : f
        )
      )
      return
    }

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 0 } : f
      )
    )

    try {
      const formData = new FormData()
      formData.append('file', uploadFile.file)
      formData.append('phase', uploadPhase)
      if (caption) {
        formData.append('caption', caption)
      }

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      // Update status to success with auto-approval info
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? { ...f, status: 'success', progress: 100, autoApproved: data.photo?.auto_approved }
            : f
        )
      )
    } catch (error) {
      console.error('Upload error:', error)
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: 'error',
                error:
                  error instanceof Error ? error.message : 'Erro ao fazer upload',
              }
            : f
        )
      )
    }
  }

  // Upload all files
  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')

    for (const file of pendingFiles) {
      await uploadFile(file)
    }
  }

  // Remove file
  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === fileId)
      if (file) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== fileId)
    })
  }

  // Clear successful uploads
  const clearSuccessful = () => {
    setFiles((prev) => {
      prev
        .filter((f) => f.status === 'success')
        .forEach((f) => URL.revokeObjectURL(f.preview))
      return prev.filter((f) => f.status !== 'success')
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C2C2C] mx-auto mb-4" />
          <p className="font-crimson text-[#4A4A4A]">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  const hasFiles = files.length > 0
  const hasPending = files.some((f) => f.status === 'pending')
  const hasSuccess = files.some((f) => f.status === 'success')
  const allAutoApproved = files.filter((f) => f.status === 'success').every((f) => f.autoApproved === true)

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#F8F6F3] px-4 pt-32 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-playfair text-4xl md:text-5xl text-[#2C2C2C] mb-2">
            Compartilhe Suas Memórias
          </h1>
          <p className="font-crimson text-lg text-[#4A4A4A]">
            Olá, {guestName}! Faça upload das suas fotos e vídeos
          </p>
        </div>

        {/* Upload Phase Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block font-crimson text-sm text-[#4A4A4A] mb-3">
            Quando foi tirada a foto/vídeo?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['before', 'during', 'after'] as UploadPhase[]).map((phase) => (
              <button
                key={phase}
                type="button"
                onClick={() => setUploadPhase(phase)}
                className={`py-3 px-4 rounded-lg font-crimson text-sm transition-all ${
                  uploadPhase === phase
                    ? 'bg-[#2C2C2C] text-white'
                    : 'bg-[#E8E6E3] text-[#4A4A4A] hover:bg-[#A8A8A8]/20'
                }`}
              >
                {phase === 'before' && 'Antes'}
                {phase === 'during' && 'Durante'}
                {phase === 'after' && 'Depois'}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white rounded-lg shadow-sm p-12 mb-6 border-2 border-dashed transition-all cursor-pointer ${
            isDragging
              ? 'border-[#2C2C2C] bg-[#E8E6E3]/20'
              : 'border-[#E8E6E3] hover:border-[#A8A8A8]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-[#A8A8A8] mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-crimson text-[#2C2C2C] mb-2">
              Arraste fotos/vídeos aqui ou clique para selecionar
            </p>
            <p className="font-crimson text-sm text-[#A8A8A8]">
              Máx: 100MB (fotos) / 500MB (vídeos)
            </p>
          </div>
        </div>

        {/* Caption Input */}
        {hasFiles && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <label
              htmlFor="caption"
              className="block font-crimson text-sm text-[#4A4A4A] mb-2"
            >
              Legenda (opcional)
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Adicione uma legenda para suas fotos..."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 border border-[#E8E6E3] rounded-lg font-crimson text-[#2C2C2C] placeholder:text-[#A8A8A8] focus:outline-none focus:border-[#2C2C2C] transition-colors resize-none"
            />
            <p className="mt-2 font-crimson text-xs text-[#A8A8A8] text-right">
              {caption.length}/500
            </p>
          </div>
        )}

        {/* File List */}
        {hasFiles && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-crimson text-lg text-[#2C2C2C]">
                Arquivos ({files.length})
              </h3>
              {hasSuccess && (
                <button
                  onClick={clearSuccessful}
                  className="font-crimson text-sm text-[#A8A8A8] hover:text-[#2C2C2C]"
                >
                  Limpar enviados
                </button>
              )}
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 border border-[#E8E6E3] rounded-lg"
                >
                  {/* Preview */}
                  <div className="w-16 h-16 flex-shrink-0 bg-[#E8E6E3] rounded overflow-hidden">
                    {file.file.type.startsWith('image/') ? (
                      <img
                        src={file.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-[#A8A8A8]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-crimson text-sm text-[#2C2C2C] truncate">
                      {file.file.name}
                    </p>
                    <p className="font-crimson text-xs text-[#A8A8A8]">
                      {formatFileSize(file.file.size)}
                    </p>

                    {/* Progress Bar */}
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="h-1 bg-[#E8E6E3] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2C2C2C] transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {file.status === 'error' && file.error && (
                      <p className="mt-1 font-crimson text-xs text-red-600">
                        {file.error}
                      </p>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {file.status === 'pending' && (
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-2 text-[#A8A8A8] hover:text-red-600 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                    {file.status === 'uploading' && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2C2C2C]" />
                    )}
                    {file.status === 'success' && (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {file.status === 'error' && (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {hasPending && (
          <button
            onClick={handleUploadAll}
            className="w-full py-4 px-6 bg-[#2C2C2C] text-white font-crimson text-lg rounded-lg hover:bg-[#4A4A4A] transition-colors"
          >
            Enviar {files.filter((f) => f.status === 'pending').length} arquivo(s)
          </button>
        )}

        {/* Success Message */}
        {hasSuccess && !hasPending && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-playfair text-2xl text-[#2C2C2C] mb-2">
              Upload Completo!
            </h3>
            <p className="font-crimson text-[#4A4A4A] mb-6">
              {allAutoApproved
                ? 'Suas fotos foram aprovadas e já está visível na galeria!'
                : 'Suas fotos foram enviadas e estão aguardando aprovação'}
            </p>
            <button
              onClick={clearSuccessful}
              className="py-3 px-6 bg-[#2C2C2C] text-white font-crimson rounded-lg hover:bg-[#4A4A4A] transition-colors"
            >
              Enviar Mais Fotos
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
