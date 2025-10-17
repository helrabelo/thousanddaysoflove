/**
 * Generate Signed Upload URL for Direct Client Upload
 *
 * This endpoint generates a signed URL that allows the client to upload
 * files directly to Supabase Storage, bypassing Vercel's 4.5MB limit.
 *
 * Flow:
 * 1. Client requests signed URL from this endpoint
 * 2. Endpoint returns signed URL + metadata
 * 3. Client uploads file directly to Supabase using signed URL
 * 4. Client calls /api/photos/confirm to save metadata in database
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  verifyGuestSession,
  canGuestUpload,
  GUEST_SESSION_COOKIE,
} from '@/lib/auth/guestAuth'
import { createAdminClient } from '@/lib/supabase/server'
import { generateStoragePath, STORAGE_BUCKET } from '@/lib/supabase/storage'

export const runtime = 'edge' // Fast, no file processing needed

interface SignedUrlRequest {
  filename: string
  fileType: string
  fileSize: number
  phase: 'before' | 'during' | 'after'
}

interface SignedUrlResponse {
  uploadUrl: string
  storagePath: string
  publicUrl: string
  expiresIn: number
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

    // Check upload permissions
    const uploadCheck = await canGuestUpload(session.guest_id)

    if (!uploadCheck.allowed) {
      return NextResponse.json(
        { error: uploadCheck.reason || 'Upload não permitido' },
        { status: 403 }
      )
    }

    // Parse request
    const body: SignedUrlRequest = await request.json()
    const { filename, fileType, fileSize, phase } = body

    // Validate
    if (!filename || !fileType || !fileSize || !phase) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    if (!['before', 'during', 'after'].includes(phase)) {
      return NextResponse.json(
        { error: 'Fase inválida' },
        { status: 400 }
      )
    }

    // Generate storage path
    const storagePath = generateStoragePath(session.guest_id, phase, filename)

    // Create signed upload URL
    const supabase = createAdminClient()

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(storagePath)

    if (error) {
      console.error('Error creating signed URL:', error)
      return NextResponse.json(
        { error: 'Erro ao gerar URL de upload' },
        { status: 500 }
      )
    }

    // Get public URL (will work after file is uploaded)
    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)

    const response: SignedUrlResponse = {
      uploadUrl: data.signedUrl,
      storagePath,
      publicUrl: publicUrlData.publicUrl,
      expiresIn: 3600, // 1 hour
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Signed URL generation error:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar URL de upload' },
      { status: 500 }
    )
  }
}
