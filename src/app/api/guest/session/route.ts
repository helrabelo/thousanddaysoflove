import { NextResponse } from 'next/server'
import { getCurrentGuestSession } from '@/lib/auth/guestAuth.server'

/**
 * Get current guest session information
 * Used by client components to retrieve guest details
 */
export async function GET() {
  try {
    const session = await getCurrentGuestSession()

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active session found',
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    console.error('Error fetching guest session:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
