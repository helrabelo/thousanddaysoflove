'use client'

/**
 * Global Guest Actions Component
 *
 * Provides globally accessible FAB (Floating Action Button) and modals
 * for authenticated guests to create posts and upload media from any page
 *
 * Features:
 * - Automatic authentication detection
 * - FloatingActionButton for quick actions
 * - PostComposerModal for creating messages
 * - MediaUploadModal for photo/video uploads
 * - Listens for auth changes (from /convite/[CODE] auto-auth)
 * - Only renders when guest is authenticated
 */

import { useState, useEffect } from 'react'
import { FloatingActionButton } from '@/components/live/FloatingActionButton'
import { PostComposerModal } from '@/components/live/PostComposerModal'
import { MediaUploadModal } from '@/components/live/MediaUploadModal'
import type { GuestPost } from '@/types/wedding'

export function GlobalGuestActions() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [guestName, setGuestName] = useState('Convidado')
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false)
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false)

  useEffect(() => {
    // Check guest authentication on mount
    checkAuthentication()

    // Listen for auth changes (triggered by /convite/[CODE] auto-auth)
    const handleAuthChange = () => {
      console.log('🔄 [GlobalGuestActions] Auth changed event received, re-checking authentication...')
      checkAuthentication()
    }

    // Listen for requests to open modals from other components
    const handleOpenMessageComposer = () => {
      console.log('📝 [GlobalGuestActions] Request to open message composer received')
      setIsPostComposerOpen(true)
    }

    const handleOpenMediaUpload = () => {
      console.log('📸 [GlobalGuestActions] Request to open media upload received')
      setIsMediaUploadOpen(true)
    }

    window.addEventListener('auth-changed', handleAuthChange)
    window.addEventListener('open-message-composer', handleOpenMessageComposer as EventListener)
    window.addEventListener('open-media-upload', handleOpenMediaUpload as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('auth-changed', handleAuthChange)
      window.removeEventListener('open-message-composer', handleOpenMessageComposer as EventListener)
      window.removeEventListener('open-media-upload', handleOpenMediaUpload as EventListener)
    }
  }, [])

  const checkAuthentication = async () => {
    try {
      // Verify with API - it can read the httpOnly cookie
      // Note: guest_session_token is an httpOnly cookie, so we can't check it client-side
      const response = await fetch('/api/auth/verify')
      const data = await response.json()

      console.log('[GlobalGuestActions] Auth verification response:', {
        ok: response.ok,
        status: response.status,
        hasSession: !!data.session
      })

      if (response.ok && data.success && data.session?.guest) {
        console.log('[GlobalGuestActions] ✅ Authentication successful:', data.session.guest.name)
        setIsAuthenticated(true)
        setGuestName(data.session.guest.name || 'Convidado')
      } else {
        console.log('[GlobalGuestActions] ❌ Not authenticated:', data.error || 'No session')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('[GlobalGuestActions] ⚠️ Error checking authentication:', error)
      setIsAuthenticated(false)
    }
  }

  const handlePostCreated = (post: GuestPost, autoApproved: boolean) => {
    console.log('[GlobalGuestActions] Post created:', post, 'Auto-approved:', autoApproved)

    // Dispatch custom event to notify other components (like LivePostStream)
    if (autoApproved) {
      window.dispatchEvent(new CustomEvent('post-created', { detail: { post } }))
    }
  }

  const handleUploadComplete = () => {
    console.log('[GlobalGuestActions] Media upload completed')

    // Dispatch custom event to notify other components (like LivePhotoGallery)
    window.dispatchEvent(new CustomEvent('media-uploaded'))
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Floating Action Button (FAB) - Globally available */}
      <FloatingActionButton
        isAuthenticated={isAuthenticated}
        guestName={guestName}
        onOpenMessageComposer={() => setIsPostComposerOpen(true)}
        onOpenMediaUpload={() => setIsMediaUploadOpen(true)}
      />

      {/* Post Composer Modal */}
      <PostComposerModal
        isOpen={isPostComposerOpen}
        guestName={guestName}
        isAuthenticated={isAuthenticated}
        onClose={() => setIsPostComposerOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Media Upload Modal */}
      <MediaUploadModal
        isOpen={isMediaUploadOpen}
        guestName={guestName}
        onClose={() => setIsMediaUploadOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </>
  )
}
