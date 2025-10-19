import { NextRequest, NextResponse } from 'next/server'
import { verifyGuestSession } from '@/lib/auth/guestAuth'

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Token de sessão não fornecido' },
        { status: 400 }
      )
    }

    const session = await verifyGuestSession(sessionToken)

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão inválida ou expirada' },
        { status: 401 }
      )
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error verifying session:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar sessão' },
      { status: 500 }
    )
  }
}
