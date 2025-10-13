/**
 * Server-side Supabase Storage Utilities
 * For use in API routes and server components
 * Does NOT include browser-only functions (compression, video metadata)
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const STORAGE_BUCKET = 'wedding-photos'

export type UploadPhase = 'before' | 'during' | 'after'

export interface ServerUploadOptions {
  guestId: string
  phase: UploadPhase
  file: File
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
 * Get public URL for storage path (server-side)
 */
export function getPublicUrl(
  storagePath: string,
  bucket: string = STORAGE_BUCKET
): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath)
  return data.publicUrl
}

/**
 * Upload file to Supabase Storage (server-side)
 * Uses service role key for admin access
 */
export async function uploadFile(
  options: ServerUploadOptions
): Promise<StorageResult> {
  const { guestId, phase, file } = options

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  // Validate file
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')

  if (!isImage && !isVideo) {
    throw new Error('File must be an image or video')
  }

  // Convert File to Buffer for server-side upload
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Generate storage path
  const storagePath = generateStoragePath(guestId, phase, file.name)

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
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
    file_size_bytes: file.size,
    mime_type: file.type,
    width: undefined, // Not available server-side
    height: undefined, // Not available server-side
    is_video: isVideo,
    video_duration_seconds: undefined, // Not available server-side
    public_url: publicUrl,
  }
}

/**
 * Delete file from storage (server-side)
 */
export async function deleteFile(storagePath: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([storagePath])

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(`Delete failed: ${error.message}`)
  }
}

/**
 * Check if file is valid for upload
 */
export function validateFile(file: File): {
  valid: boolean
  error?: string
} {
  const MAX_IMAGE_SIZE = 100 * 1024 * 1024 // 100MB
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500MB

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

  return { valid: true }
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
