/**
 * Supabase Storage Utilities for Guest Photos
 * Handles file uploads, compression, and storage management
 */

import { createClient } from '@/lib/supabase/client'

export const STORAGE_BUCKET = 'wedding-photos'

export type UploadPhase = 'before' | 'during' | 'after'

export interface UploadOptions {
  guestId: string
  phase: UploadPhase
  file: File
  onProgress?: (progress: number) => void
}

export interface StorageResult {
  storage_path: string
  storage_bucket: string
  file_size_bytes: number
  mime_type: string
  width?: number
  height?: number
  is_video: boolean
  video_duration_seconds?: number
  public_url: string
}

/**
 * Generate storage path for uploads
 * Format: {guest_id}/{phase}/{timestamp}_{sanitized_filename}
 */
export function generateStoragePath(
  guestId: string,
  phase: UploadPhase,
  filename: string
): string {
  const timestamp = Date.now()
  const sanitizedFilename = filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars
    .toLowerCase()
    .slice(0, 100) // Limit length

  return `${guestId}/${phase}/${timestamp}_${sanitizedFilename}`
}

/**
 * Get public URL for storage path
 */
export function getPublicUrl(
  storagePath: string,
  bucket: string = STORAGE_BUCKET
): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
  return data.publicUrl
}

/**
 * Compress image before upload (client-side)
 * Uses browser Canvas API to reduce file size
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8
): Promise<{
  file: File
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Create canvas and compress
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          // Create new file from blob
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          resolve({
            file: compressedFile,
            width,
            height,
          })
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Get video metadata (duration, dimensions)
 */
export async function getVideoMetadata(file: File): Promise<{
  duration: number
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)

      resolve({
        duration: Math.round(video.duration),
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video metadata'))
    }

    video.src = url
  })
}

/**
 * Upload file to Supabase Storage (server-side, no compression)
 */
export async function uploadFile(
  options: UploadOptions
): Promise<StorageResult> {
  const { guestId, phase, file } = options
  const supabase = createClient()

  // Validate file
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')

  if (!isImage && !isVideo) {
    throw new Error('File must be an image or video')
  }

  // Note: Compression/metadata extraction skipped on server-side
  // Client should compress images before upload
  const uploadFile = file
  const width: number | undefined = undefined
  const height: number | undefined = undefined
  const videoDuration: number | undefined = undefined

  // Generate storage path
  const storagePath = generateStoragePath(guestId, phase, uploadFile.name)

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, uploadFile, {
      contentType: uploadFile.type,
      upsert: false, // Don't overwrite existing files
    })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error(`Upload failed: ${error.message}`)
  }

  // Get public URL
  const publicUrl = getPublicUrl(data.path)

  return {
    storage_path: data.path,
    storage_bucket: STORAGE_BUCKET,
    file_size_bytes: uploadFile.size,
    mime_type: uploadFile.type,
    width,
    height,
    is_video: isVideo,
    video_duration_seconds: videoDuration,
    public_url: publicUrl,
  }
}

/**
 * Delete file from storage
 */
export async function deleteFile(storagePath: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath])

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Generate thumbnail for video
 */
export async function generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const url = URL.createObjectURL(file)

    video.onloadeddata = () => {
      // Seek to 1 second or 10% of video duration
      video.currentTime = Math.min(1, video.duration * 0.1)
    }

    video.onseeked = () => {
      // Draw video frame to canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)

          if (!blob) {
            reject(new Error('Failed to generate thumbnail'))
            return
          }

          resolve(blob)
        },
        'image/jpeg',
        0.8
      )
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video'))
    }

    video.src = url
  })
}

/**
 * Check if file is valid for upload
 */
export function validateFile(file: File): {
  valid: boolean
  error?: string
  warning?: string
} {
  // Theoretical limits (Supabase Storage supports up to 5GB)
  const MAX_IMAGE_SIZE = 100 * 1024 * 1024 // 100MB
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500MB

  // Practical limit (Vercel API Route body size - ALL plans)

  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: 'Arquivo deve ser uma foto ou vídeo',
    }
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / 1024 / 1024)
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${maxSizeMB}MB`,
    }
  }

  // Now using direct upload to Supabase (no Vercel 4.5MB limit!)
  // Just warn about very large files (slow uploads)
  const LARGE_FILE_WARNING = 20 * 1024 * 1024 // 20MB

  let warning: string | undefined
  if (file.size > LARGE_FILE_WARNING) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1)
    warning = `Arquivo grande (${sizeMB}MB). Upload pode demorar alguns minutos.`
  }

  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ]
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm']

  if (isImage && !allowedImageTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de imagem não suportado',
    }
  }

  if (isVideo && !allowedVideoTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato de vídeo não suportado',
    }
  }

  return { valid: true, warning }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get storage usage for guest
 */
export async function getGuestStorageUsage(guestId: string): Promise<{
  totalFiles: number
  totalBytes: number
  photoCount: number
  videoCount: number
}> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('guest_photos')
    .select('file_size_bytes, is_video')
    .eq('guest_id', guestId)
    .eq('is_deleted', false)

  if (error) {
    console.error('Error getting storage usage:', error)
    throw new Error('Failed to get storage usage')
  }

  return {
    totalFiles: data.length,
    totalBytes: data.reduce((sum, photo) => sum + (photo.file_size_bytes || 0), 0),
    photoCount: data.filter((p) => !p.is_video).length,
    videoCount: data.filter((p) => p.is_video).length,
  }
}
