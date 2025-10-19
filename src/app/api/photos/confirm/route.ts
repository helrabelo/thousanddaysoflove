/**
 * Confirm Direct Upload and Save Metadata
 *
 * After the client uploads directly to Supabase Storage using a signed URL,
 * this endpoint saves the photo metadata to the database.
 *
 * Flow:
 * 1. Client uploads file directly to Supabase (bypasses Vercel)
 * 2. Client calls this endpoint with file metadata
 * 3. Endpoint saves metadata to guest_photos table
 * 4. Endpoint creates activity feed entry
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  verifyGuestSession,
  GUEST_SESSION_COOKIE,
} from '@/lib/auth/guestAuth'
import { createAdminClient } from '@/lib/supabase/server'
import { writeClient } from '@/sanity/lib/client'
import { STORAGE_BUCKET } from '@/lib/supabase/storage'

export const runtime = 'edge'

interface ConfirmUploadRequest {
  storagePath: string
  publicUrl: string
  fileName: string
  fileSize: number
  mimeType: string
  isVideo: boolean
  phase: 'before' | 'during' | 'after'
  title?: string
  caption?: string
  timelineEventId?: string
  width?: number
  height?: number
  videoDuration?: number
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate guest
    const sessionToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Autenticação necessária' },
        { status: 401 }
      )
    }

    const session = await verifyGuestSession(sessionToken)

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    // Parse request
    const body: ConfirmUploadRequest = await request.json()
    const {
      storagePath,
      publicUrl,
      fileName,
      fileSize,
      mimeType,
      isVideo,
      phase,
      title,
      caption,
      timelineEventId,
      width,
      height,
      videoDuration,
    } = body

    // Validate required fields
    if (!storagePath || !publicUrl || !fileName || !fileSize || !mimeType || !phase) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Auto-approve for authenticated guests
    const moderationStatus = session.auth_method === 'invitation_code' ? 'approved' : 'pending'

    // Save to database
    const supabase = createAdminClient()

    const { data: photo, error: dbError } = await supabase
      .from('guest_photos')
      .insert({
        guest_id: session.guest_id,
        guest_name: session.guest?.name || 'Convidado',
        title: title || null,
        caption: caption || null,
        upload_phase: phase,
        storage_path: storagePath,
        storage_bucket: STORAGE_BUCKET,
        file_size_bytes: fileSize,
        mime_type: mimeType,
        width: width || null,
        height: height || null,
        is_video: isVideo,
        video_duration_seconds: videoDuration || null,
        moderation_status: moderationStatus,
        timeline_event_id: timelineEventId || null,
      })
      .select()
      .single()

    if (dbError || !photo) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { error: 'Erro ao salvar foto no banco de dados' },
        { status: 500 }
      )
    }

    // Update timeline photo count
    if (timelineEventId) {
      try {
        await writeClient.patch(timelineEventId).inc({ guestPhotosCount: 1 }).commit()
      } catch (sanityError) {
        console.error('Failed to increment timeline guest photo count:', sanityError)
      }
    }

    // Update session activity
    await supabase
      .from('guest_sessions')
      .update({
        last_activity_at: new Date().toISOString(),
      })
      .eq('id', session.id)

    // Create activity feed entry
    await supabase.from('activity_feed').insert({
      activity_type: 'photo_uploaded',
      guest_id: session.guest_id,
      guest_name: session.guest?.name || 'Convidado',
      target_type: 'photo',
      target_id: photo.id,
      metadata: {
        is_video: isVideo,
        phase,
        file_size: fileSize,
        auto_approved: moderationStatus === 'approved',
        timeline_event_id: timelineEventId,
      },
      is_public: moderationStatus === 'approved',
    })

    const responseMessage = moderationStatus === 'approved'
      ? 'Upload realizado com sucesso! Sua foto já está visível na galeria.'
      : 'Upload realizado com sucesso! Aguardando aprovação.'

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        storage_path: storagePath,
        public_url: publicUrl,
        is_video: isVideo,
        moderation_status: photo.moderation_status || 'pending',
        auto_approved: moderationStatus === 'approved',
        timeline_event_id: timelineEventId,
      },
      message: responseMessage,
    })
  } catch (error) {
    console.error('Confirm upload error:', error)
    return NextResponse.json(
      { error: 'Erro ao confirmar upload' },
      { status: 500 }
    )
  }
}
