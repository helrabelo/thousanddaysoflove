/**
 * Guest Authentication Server Utilities
 * Server-only functions that use next/headers
 */

import { cookies } from 'next/headers'
import { verifyGuestSession, GUEST_SESSION_COOKIE } from './guestAuth'
import type { GuestSession } from './guestAuth'

/**
 * Get current guest session (server-side)
 */
export async function getCurrentGuestSession(): Promise<GuestSession | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(GUEST_SESSION_COOKIE)?.value

  if (!sessionToken) {
    return null
  }

  return verifyGuestSession(sessionToken)
}
