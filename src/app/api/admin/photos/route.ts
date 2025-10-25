/**
 * Admin Photos API Route
 * Fetch photos with filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getPublicUrl } from '@/lib/supabase/storage-server'
import { isAdminAuthenticatedFromRequest, unauthorizedResponse } from '@/lib/auth/adminAuth'
import { mapToModerationStatus } from '@/lib/constants/moderation'
import type { ModerationStatus, UploadPhase } from '@/types/interactive-features'

const VALID_UPLOAD_PHASES = ['before', 'during', 'after'] as const

const mapUploadPhase = (phase: string | null | undefined): UploadPhase => {
  if (phase && VALID_UPLOAD_PHASES.includes(phase as UploadPhase)) {
    return phase as UploadPhase
  }
  return 'during'
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    if (!isAdminAuthenticatedFromRequest(request)) {
      return unauthorizedResponse()
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || ''
    const action = searchParams.get('action')

    const supabase = createAdminClient()

    // If requesting stats, return stats from ALL photos
    if (action === 'stats') {
      const { data: allPhotos } = await supabase
        .from('guest_photos')
        .select('moderation_status')
        .eq('is_deleted', false)

      const stats = {
        total: allPhotos?.length || 0,
        pending: allPhotos?.filter((p) => p.moderation_status === 'pending').length || 0,
        approved: allPhotos?.filter((p) => p.moderation_status === 'approved').length || 0,
        rejected: allPhotos?.filter((p) => p.moderation_status === 'rejected').length || 0,
      }

      return NextResponse.json(stats)
    }

    // Fetch filtered photos
    let query = supabase
      .from('guest_photos')
      .select('*, guest:simple_guests(name)')
      .eq('is_deleted', false)
      .order('uploaded_at', { ascending: false })

    // Apply status filter
    if (statusFilter) {
      query = query.eq('moderation_status', statusFilter)
    }

    const { data: photos, error } = await query

    if (error) {
      console.error('Error fetching photos:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform photos
    const photosWithUrls = (photos || []).map((photo) => ({
      id: photo.id,
      guest_id: photo.guest_id || '',
      guest_name: photo.guest_name || 'Anônimo',
      caption: photo.caption,
      title: photo.title,
      upload_phase: mapUploadPhase(photo.upload_phase as string | null),
      storage_path: photo.storage_path || '',
      storage_bucket: photo.storage_bucket || 'wedding-photos',
      public_url: photo.storage_path ? getPublicUrl(photo.storage_path, photo.storage_bucket) : '',
      file_size_bytes: photo.file_size_bytes || 0,
      mime_type: photo.mime_type || 'image/jpeg',
      width: photo.width,
      height: photo.height,
      is_video: photo.mime_type?.startsWith('video/') || false,
      moderation_status: mapToModerationStatus(photo.moderation_status as string | null),
      moderated_at: photo.moderated_at,
      moderated_by: photo.moderated_by,
      rejection_reason: photo.rejection_reason,
      uploaded_at: photo.created_at,
      guest: photo.guest,
    }))

    return NextResponse.json(photosWithUrls)
  } catch (error) {
    console.error('Error in photos API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
