'use client'

import { useState, useEffect } from 'react'
import type { GuestSession } from '@/lib/auth/guestAuth'

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

  return { session, loading }
}
