/**
 * Guest Logout API Endpoint
 * Invalidates the guest session
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  logoutGuestSession,
  GUEST_SESSION_COOKIE,
} from '@/lib/auth/guestAuth'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookie
    const sessionToken = request.cookies.get(GUEST_SESSION_COOKIE)?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Nenhuma sessão encontrada' },
        { status: 401 }
      )
    }

    // Logout session
    await logoutGuestSession(sessionToken)

    // Create response and clear cookie
    const response = NextResponse.json(
      { success: true, message: 'Logout realizado com sucesso' },
      { status: 200 }
    )

    response.cookies.delete(GUEST_SESSION_COOKIE)

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}
