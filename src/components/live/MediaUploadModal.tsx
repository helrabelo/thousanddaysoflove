'use client'

/**
 * Media Upload Modal Component
 *
 * Simplified photo/video upload modal for live feed
 * - Drag-and-drop interface
 * - Multi-file upload support
 * - Phase selection (before/during/after)
 * - Real-time upload progress
 * - Wedding aesthetic
 * - Mobile-first responsive design
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Upload, Loader2, CheckCircle2, XCircle, Video } from 'lucide-react'
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

interface MediaUploadModalProps {
  isOpen: boolean
  guestName: string
  onClose: () => void
  onUploadComplete?: () => void
}

export function MediaUploadModal({
  isOpen,
  guestName: _guestName, // eslint-disable-line @typescript-eslint/no-unused-vars -- Passed from parent but not used in this component
  onClose,
  onUploadComplete
}: MediaUploadModalProps) {
  const shouldReduceMotion = useReducedMotion()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploadPhase, setUploadPhase] = useState<UploadPhase>('during')
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [caption, setCaption] = useState('')

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFiles([])
      setCaption('')
      setUploadPhase('during')
      setIsDragging(false)
    }
  }, [isOpen])

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending'
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
        credentials: 'include', // Include cookies for authentication
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      // Update status to success
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
                error: error instanceof Error ? error.message : 'Erro ao fazer upload'
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

    // Call completion handler after all uploads
    onUploadComplete?.()
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

  const hasFiles = files.length > 0
  const hasPending = files.some((f) => f.status === 'pending')
  const hasSuccess = files.some((f) => f.status === 'success')
  const allSuccess = files.length > 0 && files.every((f) => f.status === 'success')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            style={{ backdropFilter: 'blur(8px)' }}
          />

          {/* Modal Container - Mobile Optimized */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#F8F6F3] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border-2 border-[#E8E6E3]"
            >
              {/* Header - Mobile Responsive */}
              <div className="bg-white border-b-2 border-[#E8E6E3] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-10">
                <div className='flex-1 min-w-0 mr-2'>
                  <h2 className="text-xl sm:text-2xl font-playfair font-bold text-[#2C2C2C] truncate">
                    Enviar Mídia
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A4A4A] font-crimson mt-1">
                    Compartilhe fotos e vídeos
                  </p>
                </div>

                {/* Close Button - Min 44px touch target */}
                <motion.button
                  onClick={onClose}
                  className="flex-shrink-0 p-2 rounded-full hover:bg-[#E8E6E3] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center !w-fit"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A4A4A]" />
                </motion.button>
              </div>

              {/* Content - Scrollable with mobile padding */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)] sm:max-h-[calc(90vh-140px)] space-y-4">
                {/* Success State */}
                {allSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <motion.div
                      animate={shouldReduceMotion ? {} : {
                        scale: [1, 1.2, 1],
                        rotate: [0, 360, 720]
                      }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6"
                    >
                      <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </motion.div>
                    <h3 className="font-playfair text-xl sm:text-2xl text-[#2C2C2C] mb-2">
                      Upload Completo!
                    </h3>
                    <p className="font-crimson text-sm sm:text-base text-[#4A4A4A] mb-4 sm:mb-6 px-4">
                      {files.every((f) => f.autoApproved)
                        ? 'Suas mídias foram aprovadas automaticamente! ✨'
                        : 'Suas mídias foram enviadas e estão aguardando aprovação ⏳'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                      <motion.button
                        onClick={clearSuccessful}
                        className="min-h-[44px] px-6 py-3 bg-white text-[#2C2C2C] font-crimson rounded-lg border-2 border-[#E8E6E3] hover:border-[#A8A8A8] transition-colors"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Enviar Mais
                      </motion.button>
                      <motion.button
                        onClick={onClose}
                        className="min-h-[44px] px-6 py-3 bg-[#2C2C2C] text-[#F8F6F3] font-crimson rounded-lg hover:bg-[#4A4A4A] transition-colors"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Fechar
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Upload Phase Selection - Mobile Responsive */}
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E8E6E3]">
                      <label className="block font-crimson text-xs sm:text-sm text-[#4A4A4A] mb-2 sm:mb-3">
                        Quando foi tirada a mídia?
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {(['before', 'during', 'after'] as UploadPhase[]).map((phase) => (
                          <motion.button
                            key={phase}
                            type="button"
                            onClick={() => setUploadPhase(phase)}
                            className={`min-h-[44px] py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-crimson text-sm transition-all ${
                              uploadPhase === phase
                                ? 'bg-[#2C2C2C] text-white'
                                : 'bg-[#E8E6E3] text-[#4A4A4A] hover:bg-[#A8A8A8]/20'
                            }`}
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Selecionar fase ${phase === 'before' ? 'antes' : phase === 'during' ? 'durante' : 'depois'}`}
                          >
                            {phase === 'before' && 'Antes'}
                            {phase === 'during' && 'Durante'}
                            {phase === 'after' && 'Depois'}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Drag and Drop Zone - Mobile Touch Friendly */}
                    <motion.div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`bg-white rounded-lg p-6 sm:p-8 border-2 border-dashed transition-all cursor-pointer min-h-[44px] ${
                        isDragging
                          ? 'border-[#2C2C2C] bg-[#E8E6E3]/20'
                          : 'border-[#E8E6E3] hover:border-[#A8A8A8]'
                      }`}
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
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
                        <motion.div
                          animate={isDragging && !shouldReduceMotion ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Upload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[#A8A8A8] mb-3 sm:mb-4" />
                        </motion.div>
                        <p className="font-crimson text-sm sm:text-base text-[#2C2C2C] mb-1 sm:mb-2">
                          Toque para selecionar ou arraste aqui
                        </p>
                        <p className="font-crimson text-xs sm:text-sm text-[#A8A8A8]">
                          Fotos e vídeos até 500MB
                        </p>
                      </div>
                    </motion.div>

                    {/* Caption Input */}
                    {hasFiles && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-lg p-3 sm:p-4 border border-[#E8E6E3]"
                      >
                        <label className="block font-crimson text-xs sm:text-sm text-[#4A4A4A] mb-2">
                          Legenda (opcional)
                        </label>
                        <textarea
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="Adicione uma legenda..."
                          maxLength={500}
                          rows={3}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#E8E6E3] rounded-lg font-crimson text-sm sm:text-base text-[#2C2C2C] placeholder:text-[#A8A8A8] focus:outline-none focus:border-[#2C2C2C] transition-colors resize-none"
                        />
                        <p className="mt-2 font-crimson text-xs text-[#A8A8A8] text-right">
                          {caption.length}/500
                        </p>
                      </motion.div>
                    )}

                    {/* File List - Mobile Optimized */}
                    {hasFiles && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-white rounded-lg p-3 sm:p-4 border border-[#E8E6E3]"
                      >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="font-crimson text-base sm:text-lg text-[#2C2C2C]">
                            Arquivos ({files.length})
                          </h3>
                          {hasSuccess && (
                            <button
                              onClick={clearSuccessful}
                              className="font-crimson text-xs sm:text-sm text-[#A8A8A8] hover:text-[#2C2C2C] transition-colors min-h-[44px] flex items-center"
                            >
                              Limpar enviados
                            </button>
                          )}
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          {files.map((file) => {
                            const isVideo = file.file.type.startsWith('video/')
                            return (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 border border-[#E8E6E3] rounded-lg"
                              >
                                {/* Preview */}
                                <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-[#E8E6E3] rounded overflow-hidden">
                                  {isVideo ? (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Video className="w-6 h-6 sm:w-8 sm:h-8 text-[#A8A8A8]" />
                                    </div>
                                  ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={file.preview}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>

                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                  <p className="font-crimson text-xs sm:text-sm text-[#2C2C2C] truncate">
                                    {file.file.name}
                                  </p>
                                  <p className="font-crimson text-xs text-[#A8A8A8]">
                                    {formatFileSize(file.file.size)}
                                  </p>

                                  {/* Progress Bar */}
                                  {file.status === 'uploading' && (
                                    <div className="mt-1 sm:mt-2">
                                      <div className="h-1 bg-[#E8E6E3] rounded-full overflow-hidden">
                                        <motion.div
                                          className="h-full bg-[#2C2C2C]"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${file.progress}%` }}
                                          transition={{ duration: 0.3 }}
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

                                {/* Status Icon - Min touch target */}
                                <div className="flex-shrink-0">
                                  {file.status === 'pending' && (
                                    <button
                                      onClick={() => removeFile(file.id)}
                                      className="p-2 text-[#A8A8A8] hover:text-red-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                      aria-label="Remover arquivo"
                                    >
                                      <X className="w-5 h-5" />
                                    </button>
                                  )}
                                  {file.status === 'uploading' && (
                                    <Loader2 className="w-5 h-5 text-[#2C2C2C] animate-spin" />
                                  )}
                                  {file.status === 'success' && (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  )}
                                  {file.status === 'error' && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                  )}
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Upload Button - Mobile Touch Target */}
                    {hasPending && (
                      <motion.button
                        onClick={handleUploadAll}
                        className="w-full min-h-[44px] py-3 sm:py-4 px-6 bg-[#2C2C2C] text-white font-crimson text-base sm:text-lg rounded-lg hover:bg-[#4A4A4A] transition-colors"
                        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Enviar {files.filter((f) => f.status === 'pending').length} arquivo(s)
                      </motion.button>
                    )}
                  </>
                )}
              </div>

              {/* Footer Hint - Hide on mobile for space */}
              <div className="hidden sm:block bg-white border-t-2 border-[#E8E6E3] px-6 py-3 text-center">
                <p className="text-xs text-[#A8A8A8] font-crimson italic">
                  💡 Pressione ESC para fechar
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
