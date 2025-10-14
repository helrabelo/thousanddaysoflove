/**
 * Guest Messages API
 *
 * POST /api/messages → create a new guest post
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import {
  verifyGuestSession,
  GUEST_SESSION_COOKIE,
} from '@/lib/auth/guestAuth'

export const runtime = 'nodejs'

const MAX_CONTENT_LENGTH = 5000
const POST_TYPES = ['text', 'image', 'video', 'mixed'] as const

type PostType = (typeof POST_TYPES)[number]

type RequestBody = {
  guestName?: string
  content?: string
  postType?: PostType
  mediaUrls?: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as RequestBody | null

    if (!body) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const trimmedContent = body.content?.trim() ?? ''
    const mediaUrls = Array.isArray(body.mediaUrls)
      ? body.mediaUrls.filter((url) => typeof url === 'string' && url.trim().length > 0)
      : []

    if (!trimmedContent) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    if (trimmedContent.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Mensagem muito longa (máximo ${MAX_CONTENT_LENGTH} caracteres)` },
        { status: 400 }
      )
    }

    const requestedPostType = body.postType && POST_TYPES.includes(body.postType)
      ? body.postType
      : undefined

    const postType: PostType = requestedPostType
      ?? (mediaUrls.length > 0 ? 'mixed' : 'text')

    // Verify guest session (if any)
    const sessionToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value
    const session = sessionToken ? await verifyGuestSession(sessionToken) : null

    let guestName = session?.guest?.name?.trim() ?? ''

    if (!guestName && body.guestName) {
      guestName = body.guestName.trim()
    }

    if (!guestName) {
      return NextResponse.json(
        { error: 'Nome do convidado é obrigatório' },
        { status: 400 }
      )
    }

    const autoApproved = session?.auth_method === 'invitation_code'
    const status = autoApproved ? 'approved' : 'pending'

    const supabase = createAdminClient()

    console.log('📝 Attempting to insert guest post:', {
      guest_session_id: session?.id ?? null,
      guest_name: guestName,
      content: trimmedContent.substring(0, 50) + '...',
      post_type: postType,
      media_urls_count: mediaUrls.length,
      status,
    })

    // Note: guest_posts table exists but types may not be generated yet
    const { data, error } = await supabase
      .from('guest_posts' as any)
      .insert({
        guest_session_id: session?.id ?? null,
        guest_name: guestName,
        content: trimmedContent,
        post_type: postType,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        status,
      })
      .select()
      .single()

    if (error || !data) {
      console.error('❌ Error creating guest post via API:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        fullError: JSON.stringify(error, null, 2),
      })
      return NextResponse.json(
        {
          error: 'Erro ao criar mensagem',
          statusCode: error?.code || '500',
          message: error?.message || 'Unknown error',
        },
        { status: 500 }
      )
    }

    console.log('✅ Guest post created successfully:', data.id)

    return NextResponse.json(
      {
        success: true,
        post: data,
        autoApproved,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Guest post creation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
