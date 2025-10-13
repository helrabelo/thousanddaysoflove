/**
 * Admin Login API
 * POST /api/admin/login - Authenticate admin with password
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HelYlana1000Dias!'
const SESSION_DURATION = 24 * 60 * 60 // 24 hours in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Validate password
    if (!password) {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      )
    }

    // Check password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }

    // Generate simple session token
    const sessionToken = generateSessionToken()

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login realizado com sucesso',
      },
      { status: 200 }
    )

    // Set session cookie
    response.cookies.set({
      name: 'admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}
