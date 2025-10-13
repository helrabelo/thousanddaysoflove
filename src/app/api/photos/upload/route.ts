/**
 * Photo/Video Upload API Endpoint
 * Handles file uploads to Supabase Storage and creates database records
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  verifyGuestSession,
  canGuestUpload,
  GUEST_SESSION_COOKIE,
} from '@/lib/auth/guestAuth'
import {
  uploadFile,
  validateFile,
  generateStoragePath,
  type UploadPhase,
} from '@/lib/supabase/storage'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'nodejs' // Need Node runtime for file handling
export const maxDuration = 60 // 1 minute timeout for large uploads

export async function POST(request: NextRequest) {
  try {
    // Verify session
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

    // Check upload permissions
    const uploadCheck = await canGuestUpload(session.guest_id)

    if (!uploadCheck.allowed) {
      return NextResponse.json(
        { error: uploadCheck.reason || 'Upload não permitido' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const phase = formData.get('phase') as UploadPhase
    const caption = formData.get('caption') as string | null
    const title = formData.get('title') as string | null

    if (!file) {
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

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const storageResult = await uploadFile({
      guestId: session.guest_id,
      phase,
      file,
    })

    // Create database record (use admin client to bypass RLS)
    const { createAdminClient } = await import('@/lib/supabase/server')
    const supabase = createAdminClient()

    const { data: photo, error: dbError } = await supabase
      .from('guest_photos')
      .insert({
        guest_id: session.guest_id,
        guest_name: session.guest?.name || 'Convidado',
        title: title || null,
        caption: caption || null,
        upload_phase: phase,
        storage_path: storageResult.storage_path,
        storage_bucket: storageResult.storage_bucket,
        file_size_bytes: storageResult.file_size_bytes,
        mime_type: storageResult.mime_type,
        width: storageResult.width,
        height: storageResult.height,
        is_video: storageResult.is_video,
        video_duration_seconds: storageResult.video_duration_seconds,
        moderation_status: 'pending', // Requires admin approval
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

    // Update session upload count
    await supabase
      .from('guest_sessions')
      .update({
        uploads_count: session.uploads_count + 1,
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
        is_video: storageResult.is_video,
        phase,
        file_size: storageResult.file_size_bytes,
      },
      is_public: false, // Only show after moderation approval
    })

    return NextResponse.json(
      {
        success: true,
        photo: {
          id: photo.id,
          storage_path: storageResult.storage_path,
          public_url: storageResult.public_url,
          is_video: storageResult.is_video,
          moderation_status: photo.moderation_status,
        },
        message: 'Upload realizado com sucesso! Aguardando aprovação.',
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
