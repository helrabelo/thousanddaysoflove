import { NextRequest, NextResponse } from 'next/server'

// Simple password-based authentication for wedding admin
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HelYlana2025!' // Change this in production!

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (password === ADMIN_PASSWORD) {
      // Set secure cookie for authentication
      const response = NextResponse.json({ success: true })

      response.cookies.set('admin-auth', 'authenticated', {
        httpOnly: false, // Allow client-side access for middleware
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 hours
        path: '/'
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE() {
  const response = NextResponse.json({ success: true })

  response.cookies.delete('admin-auth')

  return response
}