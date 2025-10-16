import { NextResponse } from 'next/server'
import { getCurrentGuestSession } from '@/lib/auth/guestAuth.server'

export async function GET() {
  try {
    const session = await getCurrentGuestSession()

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error fetching guest session:', error)
    return NextResponse.json({ session: null }, { status: 500 })
  }
}
