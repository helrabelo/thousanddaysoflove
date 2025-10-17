/**
 * Supabase Gallery Service
 * Fetches approved guest-uploaded photos for gallery integration
 */

import { createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { MediaItem, TimelineEventPhoto } from '@/types/wedding'

export interface GuestPhoto {
  id: string
  guest_id: string
  guest_name: string
  caption?: string | null
  title?: string | null
  upload_phase: 'before' | 'during' | 'after'
  storage_path: string
  storage_bucket: string
  file_size_bytes: number
  mime_type: string
  width?: number | null
  height?: number | null
  is_video: boolean
  moderation_status: 'pending' | 'approved' | 'rejected'
  uploaded_at: string
  timeline_event_id: string | null
  guest?: { name: string }
}

export const GUEST_PHOTO_BUCKET = 'wedding-photos'

function getSupabaseClient() {
  return typeof window === 'undefined' ? createServerClient() : createBrowserClient()
}

/**
 * Supabase Gallery Service
 * Handles guest photo retrieval for gallery integration
 */
export class SupabaseGalleryService {
  /**
   * Get all approved guest photos
   * Returns photos in MediaItem format for seamless gallery integration
   */
  static async getApprovedGuestPhotos(filters?: {
    phase?: 'before' | 'during' | 'after'
    media_types?: ('photo' | 'video')[]
  }): Promise<MediaItem[]> {
    try {
      const supabase = getSupabaseClient()

      let query = supabase
        .from('guest_photos')
        .select('*, guest:simple_guests(name)')
        .eq('moderation_status', 'approved')
        .eq('is_deleted', false)
        .order('uploaded_at', { ascending: false })

      // Apply phase filter
      if (filters?.phase) {
        query = query.eq('upload_phase', filters.phase)
      }

      // Apply media type filter
      if (filters?.media_types && filters.media_types.length > 0) {
        const isVideoFilter = filters.media_types.includes('video')
        query = query.eq('is_video', isVideoFilter)
      }

      const { data: photos, error } = await query

      if (error) {
        console.error('Error fetching approved guest photos:', error)
        return []
      }

      // Convert to MediaItem format
      return (photos || []).map((photo) =>
        guestPhotoToMediaItem(photo as GuestPhoto, supabase)
      )
    } catch (error) {
      console.error('Error in getApprovedGuestPhotos:', error)
      return []
    }
  }

  /**
   * Get approved guest photos grouped by phase
   */
  static async getApprovedPhotosByPhase(): Promise<{
    before: MediaItem[]
    during: MediaItem[]
    after: MediaItem[]
  }> {
    try {
      const allPhotos = await this.getApprovedGuestPhotos()

      return {
        before: allPhotos.filter((p) => p.upload_phase === 'before'),
        during: allPhotos.filter((p) => p.upload_phase === 'during'),
        after: allPhotos.filter((p) => p.upload_phase === 'after'),
      }
    } catch (error) {
      console.error('Error in getApprovedPhotosByPhase:', error)
      return {
        before: [],
        during: [],
        after: [],
      }
    }
  }

  /**
   * Get guest photo statistics
   */
  static async getGuestPhotoStats(): Promise<{
    total: number
    approved: number
    by_phase: {
      before: number
      during: number
      after: number
    }
  }> {
    try {
      const supabase = getSupabaseClient()

      const { data: allPhotos } = await supabase
        .from('guest_photos')
        .select('id, moderation_status, upload_phase')
        .eq('is_deleted', false)

      const approved = (allPhotos || []).filter(
        (p) => p.moderation_status === 'approved'
      )

      return {
        total: allPhotos?.length || 0,
        approved: approved.length,
        by_phase: {
          before: approved.filter((p) => p.upload_phase === 'before').length,
          during: approved.filter((p) => p.upload_phase === 'during').length,
          after: approved.filter((p) => p.upload_phase === 'after').length,
        },
      }
    } catch (error) {
      console.error('Error fetching guest photo stats:', error)
      return {
        total: 0,
        approved: 0,
        by_phase: {
          before: 0,
          during: 0,
          after: 0,
        },
      }
    }
  }

  /**
   * Get approved guest photos grouped by timeline event
   */
  static async getApprovedPhotosByTimelineEvent(
    timelineEventIds: string[]
  ): Promise<Record<string, TimelineEventPhoto[]>> {
    if (timelineEventIds.length === 0) {
      return {}
    }

    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from('guest_photos')
        .select(
          `id, guest_id, guest_name, upload_phase, storage_path, storage_bucket, file_size_bytes, mime_type, width, height, is_video, uploaded_at, timeline_event_id`
        )
        .eq('moderation_status', 'approved')
        .eq('is_deleted', false)
        .in('timeline_event_id', timelineEventIds)
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.error('Error fetching event guest photos:', error)
        return {}
      }

      const grouped: Record<string, TimelineEventPhoto[]> = {}

      for (const eventId of timelineEventIds) {
        grouped[eventId] = []
      }

      for (const row of data ?? []) {
        if (!row.timeline_event_id) {
          continue
        }

        const { data: urlData } = supabase.storage
          .from(row.storage_bucket || GUEST_PHOTO_BUCKET)
          .getPublicUrl(row.storage_path)

        const publicUrl = urlData.publicUrl

        const photo: TimelineEventPhoto = {
          id: row.id as string,
          timelineEventId: row.timeline_event_id,
          publicUrl,
          storagePath: row.storage_path,
          isVideo: Boolean(row.is_video),
          guestName: row.guest_name as string,
          uploadedAt: row.uploaded_at as string,
          uploadPhase: row.upload_phase as TimelineEventPhoto['uploadPhase'],
          width: row.width ?? null,
          height: row.height ?? null,
        }

        if (!grouped[row.timeline_event_id]) {
          grouped[row.timeline_event_id] = []
        }

        grouped[row.timeline_event_id].push(photo)
      }

      return grouped
    } catch (error) {
      console.error('Error in getApprovedPhotosByTimelineEvent:', error)
      return {}
    }
  }
}

/**
 * Helper: Convert GuestPhoto to MediaItem format
 * Adds custom fields for guest attribution and phase
 */
export function guestPhotoToMediaItem(
  photo: GuestPhoto,
  supabase = getSupabaseClient()
): MediaItem {
  const bucket = photo.storage_bucket || GUEST_PHOTO_BUCKET
  const { data } = supabase.storage.from(bucket).getPublicUrl(photo.storage_path)
  const publicUrl = data.publicUrl

  // Calculate aspect ratio if dimensions available
  const aspectRatio =
    photo.width && photo.height ? photo.width / photo.height : 1.5

  return {
    id: photo.id,
    title: photo.title || `Foto de ${photo.guest?.name || photo.guest_name}`,
    description: photo.caption || undefined,
    url: publicUrl,
    thumbnail_url: publicUrl, // Supabase Storage doesn't have auto-thumbnails
    media_type: photo.is_video ? 'video' : 'photo',
    file_size: photo.file_size_bytes,
    width: photo.width || undefined,
    height: photo.height || undefined,
    aspect_ratio: aspectRatio,
    category: 'wedding_prep' as any, // Guest photos are "wedding prep"
    tags: ['guest_upload', photo.upload_phase],
    date_taken: photo.uploaded_at,
    location: undefined,
    is_featured: false, // Guest photos not featured by default
    is_public: true, // Already approved
    upload_date: photo.uploaded_at,
    uploaded_by: photo.guest?.name || photo.guest_name,
    created_at: photo.uploaded_at,
    updated_at: photo.uploaded_at,
    // Custom fields for guest photos
    guest_name: photo.guest?.name || photo.guest_name,
    upload_phase: photo.upload_phase,
    is_guest_upload: true,
  }
}

// Extend MediaItem interface with guest photo fields
declare module '@/types/wedding' {
  interface MediaItem {
    guest_name?: string
    upload_phase?: 'before' | 'during' | 'after'
    is_guest_upload?: boolean
  }
}
