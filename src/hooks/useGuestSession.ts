'use client'

import { useState, useEffect, useCallback } from 'react'
import type { GuestSession } from '@/lib/auth/guestAuth'
import { clearGuestSessionCookie } from '@/lib/auth/guestAuth'

export function useGuestSession() {
  const [session, setSession] = useState<GuestSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/guest/session')
        if (response.ok) {
          const data = await response.json()
          setSession(data.session || null)
        } else {
          setSession(null)
        }
      } catch (error) {
        console.error('Error fetching guest session:', error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  const logout = useCallback(async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        // Clear client-side cookie
        clearGuestSessionCookie()

        // Clear session state
        setSession(null)

        return { success: true }
      } else {
        const error = await response.text()
        console.error('Logout failed:', error)
        return { success: false, error: 'Erro ao fazer logout' }
      }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Erro ao fazer logout' }
    }
  }, [])

  return { session, loading, logout }
}
