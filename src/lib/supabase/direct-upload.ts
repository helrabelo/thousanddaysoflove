/**
 * Direct Client-to-Supabase Upload
 *
 * This bypasses Vercel's 4.5MB limit by uploading files directly from
 * the browser to Supabase Storage using signed URLs.
 *
 * Flow:
 * 1. Request signed URL from /api/photos/upload-url
 * 2. Upload file directly to Supabase using signed URL (bypasses Vercel!)
 * 3. Confirm upload with /api/photos/confirm (saves metadata)
 *
 * Benefits:
 * - No 4.5MB Vercel limit (Supabase supports up to 5GB)
 * - Faster uploads (no proxy through Vercel)
 * - Lower Vercel function costs
 */

import type { UploadPhase } from './storage'

export interface DirectUploadOptions {
  file: File
  phase: UploadPhase
  title?: string
  caption?: string
  timelineEventId?: string
  onProgress?: (progress: number) => void
}

export interface DirectUploadResult {
  success: boolean
  photo?: {
    id: string
    storage_path: string
    public_url: string
    is_video: boolean
    moderation_status: string
    auto_approved: boolean
    timeline_event_id: string | null
  }
  message?: string
  error?: string
}

/**
 * Upload file directly to Supabase Storage
 * Bypasses Vercel's 4.5MB limit
 */
export async function uploadFileDirect(
  options: DirectUploadOptions
): Promise<DirectUploadResult> {
  const { file, phase, title, caption, timelineEventId, onProgress } = options

  try {
    // Step 1: Get signed upload URL
    onProgress?.(10)

    const signedUrlResponse = await fetch('/api/photos/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        phase,
      }),
    })

    if (!signedUrlResponse.ok) {
      const error = await signedUrlResponse.json()
      throw new Error(error.error || 'Erro ao gerar URL de upload')
    }

    const { uploadUrl, storagePath, publicUrl } = await signedUrlResponse.json()

    // Step 2: Upload file directly to Supabase
    onProgress?.(30)

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-upsert': 'false', // Don't overwrite existing files
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Erro ao fazer upload do arquivo')
    }

    onProgress?.(70)

    // Step 3: Extract metadata (if image/video)
    const isVideo = file.type.startsWith('video/')
    let width: number | undefined
    let height: number | undefined
    let videoDuration: number | undefined

    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await getImageDimensions(file)
        width = dimensions.width
        height = dimensions.height
      } catch (e) {
        console.warn('Failed to get image dimensions:', e)
      }
    } else if (isVideo) {
      try {
        const metadata = await getVideoMetadata(file)
        width = metadata.width
        height = metadata.height
        videoDuration = metadata.duration
      } catch (e) {
        console.warn('Failed to get video metadata:', e)
      }
    }

    onProgress?.(80)

    // Step 4: Confirm upload and save metadata
    const confirmResponse = await fetch('/api/photos/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        storagePath,
        publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        isVideo,
        phase,
        title,
        caption,
        timelineEventId,
        width,
        height,
        videoDuration,
      }),
    })

    if (!confirmResponse.ok) {
      const error = await confirmResponse.json()
      throw new Error(error.error || 'Erro ao confirmar upload')
    }

    const result = await confirmResponse.json()

    onProgress?.(100)

    return {
      success: true,
      photo: result.photo,
      message: result.message,
    }
  } catch (error) {
    console.error('Direct upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao fazer upload',
    }
  }
}

/**
 * Get image dimensions
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Get video metadata
 */
function getVideoMetadata(file: File): Promise<{
  width: number
  height: number
  duration: number
}> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const url = URL.createObjectURL(file)

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: Math.round(video.duration),
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load video'))
    }

    video.src = url
  })
}
