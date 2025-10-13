/**
 * List Guest Photos API Endpoint
 * Retrieves photos with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyGuestSession, GUEST_SESSION_COOKIE } from '@/lib/auth/guestAuth'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)

    // Optional filters
    const phase = searchParams.get('phase') // before, during, after
    const guestId = searchParams.get('guestId')
    const moderationStatus = searchParams.get('status') // approved, pending, rejected
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('guest_photos')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('uploaded_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (phase && ['before', 'during', 'after'].includes(phase)) {
      query = query.eq('upload_phase', phase)
    }

    if (guestId) {
      query = query.eq('guest_id', guestId)
    }

    // Moderation status filter (requires authentication for non-approved)
    if (moderationStatus && ['pending', 'rejected'].includes(moderationStatus)) {
      // Verify session for viewing non-approved photos
      const sessionToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value

      if (!sessionToken) {
        return NextResponse.json(
          { error: 'Autenticação necessária para ver fotos não aprovadas' },
          { status: 401 }
        )
      }

      const session = await verifyGuestSession(sessionToken)

      if (!session) {
        return NextResponse.json(
          { error: 'Sessão inválida' },
          { status: 401 }
        )
      }

      // Only allow viewing own pending/rejected photos
      query = query.eq('moderation_status', moderationStatus)
      if (!guestId) {
        query = query.eq('guest_id', session.guest_id)
      }
    } else {
      // Default: only show approved photos
      query = query.eq('moderation_status', 'approved')
    }

    // Execute query
    const { data: photos, error, count } = await query

    if (error) {
      console.error('Error fetching photos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar fotos' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        photos: photos || [],
        total: count || 0,
        limit,
        offset,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('List photos error:', error)
    return NextResponse.json(
      { error: 'Erro ao listar fotos' },
      { status: 500 }
    )
  }
}
