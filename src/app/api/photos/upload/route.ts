/**
 * Photo/Video Upload API Endpoint
 * Handles file uploads to Supabase Storage and creates database records
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  verifyGuestSession,
  canGuestUpload,
  GUEST_SESSION_COOKIE,
  type GuestSession,
} from '@/lib/auth/guestAuth'
import {
  uploadFile,
  validateFile,
  type UploadPhase,
  type StorageResult,
} from '@/lib/supabase/storage-server'
import { createAdminClient } from '@/lib/supabase/server'
import { writeClient } from '@/sanity/lib/client'

export const runtime = 'nodejs' // Need Node runtime for file handling
export const maxDuration = 60 // 1 minute timeout for large uploads

/**
 * File Upload Limits:
 *
 * Current Architecture: Browser → API Route → Supabase Storage
 *
 * Constraints:
 * - Vercel API Route body limit: 4.5MB (ALL plans - Hobby/Pro/Enterprise)
 * - Vercel function duration: 10s (Hobby) / 60s (Pro)
 * - Supabase Storage max: 5GB per file
 *
 * Note: The 100MB Vercel deployment limit doesn't apply here (that's for `vercel deploy`)
 * Note: Vercel Blob 5TB limit doesn't apply (we use Supabase, not Blob)
 *
 * For files > 4.5MB, implement direct client→Supabase upload:
 * - Generate signed upload URL from API route
 * - Upload directly from browser to Supabase Storage
 * - No Vercel limits (up to Supabase's 5GB)
 * - Faster uploads (no proxy through Vercel)
 */

interface ErrorResponse {
  error: string
}

interface SuccessResponse {
  success: true
  photo: {
    id: string
    storage_path: string
    public_url: string
    is_video: boolean
    moderation_status: string
    auto_approved: boolean
    timeline_event_id: string | null
  }
  message: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    // Parse form data first to check for invitation_code
    const formData = await request.formData()
    const invitationCode = formData.get('invitation_code') as string | null

    let session: GuestSession | null = null

    if (invitationCode) {
      // Authenticate with invitation code
      const { authenticateWithInvitationCode } = await import('@/lib/auth/guestAuth')
      const authResult = await authenticateWithInvitationCode(invitationCode)

      if (!authResult.success || !authResult.session) {
        return NextResponse.json(
          { error: 'Código de convite inválido' },
          { status: 401 }
        )
      }

      session = authResult.session
    } else {
      // Check for existing session cookie
      const sessionToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value

      if (!sessionToken) {
        return NextResponse.json(
          { error: 'Autenticação necessária' },
          { status: 401 }
        )
      }

      session = await verifyGuestSession(sessionToken)

      if (!session) {
        return NextResponse.json(
          { error: 'Sessão inválida ou expirada' },
          { status: 401 }
        )
      }
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    // Check upload permissions
    const uploadCheck = await canGuestUpload(session.guest_id)

    if (!uploadCheck.allowed) {
      return NextResponse.json(
        { error: uploadCheck.reason || 'Upload não permitido' },
        { status: 403 }
      )
    }

    // Get file from formData (already parsed above)
    const file = formData.get('file')
    const phase = formData.get('phase') as string | null
    const caption = formData.get('caption') as string | null
    const title = formData.get('title') as string | null
    const timelineEventIdRaw = formData.get('timeline_event_id')
    const timelineEventId = typeof timelineEventIdRaw === 'string' && timelineEventIdRaw.trim().length > 0
      ? timelineEventIdRaw.trim()
      : null

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' },
        { status: 400 }
      )
    }

    if (!phase || !['before', 'during', 'after'].includes(phase)) {
      return NextResponse.json(
        { error: 'Fase inválida (before/during/after)' },
        { status: 400 }
      )
    }

    const uploadPhase = phase as UploadPhase

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Arquivo inválido' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const storageResult: StorageResult = await uploadFile({
      guestId: session.guest_id,
      phase: uploadPhase,
      file,
    })

    // Create database record (use admin client to bypass RLS)
    const supabase = createAdminClient()

    // Auto-approve photos from authenticated guests (invitation code)
    // Require approval for anonymous guests (shared password)
    const moderationStatus = session.auth_method === 'invitation_code' ? 'approved' : 'pending'

    const { data: photo, error: dbError } = await supabase
      .from('guest_photos')
      .insert({
        guest_id: session.guest_id,
        guest_name: session.guest?.name || 'Convidado',
        title: title || null,
        caption: caption || null,
        upload_phase: uploadPhase,
        storage_path: storageResult.storage_path,
        storage_bucket: storageResult.storage_bucket,
        file_size_bytes: storageResult.file_size_bytes,
        mime_type: storageResult.mime_type,
        width: storageResult.width || null,
        height: storageResult.height || null,
        is_video: storageResult.is_video,
        video_duration_seconds: storageResult.video_duration_seconds || null,
        moderation_status: moderationStatus,
        timeline_event_id: timelineEventId,
      })
      .select()
      .single()

    if (dbError || !photo) {
      console.error('Database insert error:', dbError)

      // Clean up uploaded file if database insert fails
      // Note: Implement cleanup in storage.ts if needed

      return NextResponse.json(
        { error: 'Erro ao salvar foto no banco de dados' },
        { status: 500 }
      )
    }

    if (timelineEventId) {
      try {
        await writeClient.patch(timelineEventId).inc({ guestPhotosCount: 1 }).commit()
      } catch (sanityError) {
        console.error('Failed to increment timeline guest photo count:', sanityError)
      }
    }

    // Update session activity (uploads_count might not exist in older sessions)
    await supabase
      .from('guest_sessions')
      .update({
        last_activity_at: new Date().toISOString(),
      })
      .eq('id', session.id)

    // Create activity feed entry (public if auto-approved)
    await supabase.from('activity_feed').insert({
      activity_type: 'photo_uploaded',
      guest_id: session.guest_id,
      guest_name: session.guest?.name || 'Convidado',
      target_type: 'photo',
      target_id: photo.id,
      metadata: {
        is_video: storageResult.is_video,
        phase: uploadPhase,
        file_size: storageResult.file_size_bytes,
        auto_approved: moderationStatus === 'approved',
        timeline_event_id: timelineEventId,
      },
      is_public: moderationStatus === 'approved', // Show immediately if auto-approved
    })

    const responseMessage = moderationStatus === 'approved'
      ? 'Upload realizado com sucesso! Sua foto já está visível na galeria.'
      : 'Upload realizado com sucesso! Aguardando aprovação.'

    return NextResponse.json(
      {
        success: true,
        photo: {
          id: photo.id,
          storage_path: storageResult.storage_path,
          public_url: storageResult.public_url,
          is_video: storageResult.is_video,
          moderation_status: photo.moderation_status || 'pending',
          auto_approved: moderationStatus === 'approved',
          timeline_event_id: timelineEventId,
        },
        message: responseMessage,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erro ao fazer upload',
      },
      { status: 500 }
    )
  }
}
