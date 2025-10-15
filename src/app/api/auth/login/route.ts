/**
 * Guest Login API Endpoint
 * Handles invitation code and shared password authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  authenticateWithInvitationCode,
  authenticateWithPassword,
  GUEST_SESSION_COOKIE,
  GUEST_SESSION_DURATION_HOURS,
  type AuthResult,
} from '@/lib/auth/guestAuth'

// Using Node.js runtime for better Supabase compatibility
export const runtime = 'nodejs'

interface LoginRequestBody {
  authMethod?: string
  invitationCode?: string
  password?: string
  guestName?: string
}

interface ErrorResponse {
  error: string
}

interface SuccessResponse {
  success: true
  session: {
    id: string
    guest_id: string
    auth_method: string
    expires_at: string
    guest?: {
      id: string
      name: string
      invitation_code: string
      attending: boolean
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    const body = await request.json().catch(() => null) as LoginRequestBody | null

    if (!body) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const { authMethod, invitationCode, password, guestName } = body

    // Validate input
    if (!authMethod || !['invitation_code', 'shared_password', 'both'].includes(authMethod)) {
      return NextResponse.json(
        { error: 'Método de autenticação inválido' },
        { status: 400 }
      )
    }

    let result: AuthResult | undefined

    // Authenticate based on method
    if (authMethod === 'invitation_code') {
      if (!invitationCode) {
        return NextResponse.json(
          { error: 'Código de convite é obrigatório' },
          { status: 400 }
        )
      }

      result = await authenticateWithInvitationCode(invitationCode)
    } else if (authMethod === 'shared_password') {
      if (!password) {
        return NextResponse.json(
          { error: 'Senha é obrigatória' },
          { status: 400 }
        )
      }

      result = await authenticateWithPassword(password, guestName)
    } else if (authMethod === 'both') {
      // Require both invitation code and password
      if (!invitationCode || !password) {
        return NextResponse.json(
          { error: 'Código de convite e senha são obrigatórios' },
          { status: 400 }
        )
      }

      // First authenticate with invitation code
      result = await authenticateWithInvitationCode(invitationCode)

      // If successful, verify password as well
      if (result.success) {
        const passwordResult = await authenticateWithPassword(password)
        if (!passwordResult.success) {
          return NextResponse.json(
            { error: 'Senha incorreta' },
            { status: 401 }
          )
        }
      }
    }

    if (!result || !result.success || !result.session) {
      console.error('Guest authentication failed:', result?.error)
      return NextResponse.json(
        { error: result?.error || 'Falha na autenticação' },
        { status: 401 }
      )
    }

    // Create response with session cookie
    const response = NextResponse.json<SuccessResponse>(
      {
        success: true,
        session: {
          id: result.session.id,
          guest_id: result.session.guest_id,
          auth_method: result.session.auth_method,
          expires_at: result.session.expires_at,
          guest: result.session.guest,
        },
      },
      { status: 200 }
    )

    // Set session cookie
    const expiresIn = GUEST_SESSION_DURATION_HOURS * 60 * 60 // seconds
    response.cookies.set({
      name: GUEST_SESSION_COOKIE,
      value: result.session.session_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
