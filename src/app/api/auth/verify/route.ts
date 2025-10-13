/**
 * Guest Session Verification API Endpoint
 * Verifies if a guest session is valid and active
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  verifyGuestSession,
  GUEST_SESSION_COOKIE,
} from '@/lib/auth/guestAuth'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Nenhuma sessão encontrada' },
        { status: 401 }
      )
    }

    // Verify session
    const session = await verifyGuestSession(sessionToken)

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        session: {
          id: session.id,
          guest_id: session.guest_id,
          auth_method: session.auth_method,
          expires_at: session.expires_at,
          guest: session.guest,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar sessão' },
      { status: 500 }
    )
  }
}
