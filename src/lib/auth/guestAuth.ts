/**
 * Guest Authentication Utilities
 * Handles invitation code and shared password authentication
 */

import { createClient } from '@/lib/supabase/client'

export const GUEST_SESSION_COOKIE = 'guest_session_token'
export const GUEST_SESSION_DURATION_HOURS = 72

export interface GuestSession {
  id: string
  guest_id: string
  session_token: string
  auth_method: 'invitation_code' | 'shared_password' | 'both'
  expires_at: string
  is_active: boolean
  guest?: {
    id: string
    name: string
    invitation_code: string
    attending: boolean
  }
}

export interface AuthResult {
  success: boolean
  session?: GuestSession
  error?: string
}

/**
 * Authenticate guest with invitation code
 */
export async function authenticateWithInvitationCode(
  invitationCode: string
): Promise<AuthResult> {
  const supabase = createClient()

  // Find guest by invitation code
  const { data: guest, error: guestError } = await supabase
    .from('simple_guests')
    .select('id, name, invitation_code, attending')
    .eq('invitation_code', invitationCode.toUpperCase())
    .single()

  if (guestError || !guest) {
    return {
      success: false,
      error: 'Código de convite inválido',
    }
  }

  // Create session
  const sessionResult = await createGuestSession(guest.id, 'invitation_code')

  if (!sessionResult.success || !sessionResult.session) {
    return {
      success: false,
      error: 'Erro ao criar sessão',
    }
  }

  // Mark account as created
  await supabase
    .from('simple_guests')
    .update({
      account_created: true,
      last_login: new Date().toISOString(),
    })
    .eq('id', guest.id)

  return {
    success: true,
    session: {
      ...sessionResult.session,
      guest,
    },
  }
}

/**
 * Authenticate guest with shared password
 */
export async function authenticateWithPassword(
  password: string,
  guestName?: string
): Promise<AuthResult> {
  const supabase = createClient()

  // Verify shared password
  const { data: isValid, error: verifyError } = await supabase.rpc(
    'verify_shared_password',
    {
      input_password: password,
    }
  )

  if (verifyError || !isValid) {
    return {
      success: false,
      error: 'Senha incorreta',
    }
  }

  // If guest name provided, find or create guest
  let guestId: string
  let guest: any

  if (guestName) {
    // Try to find existing guest by name
    const { data: existingGuest } = await supabase
      .from('simple_guests')
      .select('id, name, invitation_code, attending')
      .ilike('name', guestName.trim())
      .single()

    if (existingGuest) {
      guestId = existingGuest.id
      guest = existingGuest
    } else {
      // Create new guest with generated invitation code
      const { data: newGuestData, error: createError } = await supabase.rpc(
        'create_guest_with_invitation',
        {
          p_name: guestName.trim(),
        }
      )

      if (createError || !newGuestData || !Array.isArray(newGuestData) || newGuestData.length === 0) {
        console.error('Error creating guest:', createError)
        return {
          success: false,
          error: 'Erro ao criar conta de convidado',
        }
      }

      const newGuest = newGuestData[0]
      guestId = newGuest.id
      guest = newGuest
    }
  } else {
    // Anonymous guest session - create with generated invitation code
    const { data: anonGuestData, error: anonError } = await supabase.rpc(
      'create_guest_with_invitation',
      {
        p_name: 'Convidado Anônimo',
      }
    )

    if (anonError || !anonGuestData || !Array.isArray(anonGuestData) || anonGuestData.length === 0) {
      console.error('Error creating anonymous guest:', anonError)
      return {
        success: false,
        error: 'Erro ao criar sessão',
      }
    }

    const anonGuest = anonGuestData[0]
    guestId = anonGuest.id
    guest = anonGuest
  }

  // Create session
  const sessionResult = await createGuestSession(guestId, 'shared_password')

  if (!sessionResult.success || !sessionResult.session) {
    return {
      success: false,
      error: 'Erro ao criar sessão',
    }
  }

  // Update last login
  await supabase
    .from('simple_guests')
    .update({
      last_login: new Date().toISOString(),
    })
    .eq('id', guestId)

  return {
    success: true,
    session: {
      ...sessionResult.session,
      guest,
    },
  }
}

/**
 * Create guest session
 */
async function createGuestSession(
  guestId: string,
  authMethod: 'invitation_code' | 'shared_password' | 'both'
): Promise<AuthResult> {
  const supabase = createClient()

  // Generate session token
  const sessionToken = generateSessionToken()

  // Create session in database
  const { data: session, error } = await supabase.rpc('create_guest_session', {
    p_guest_id: guestId,
    p_session_token: sessionToken,
    p_auth_method: authMethod,
    p_duration_hours: GUEST_SESSION_DURATION_HOURS,
  })

  if (error) {
    console.error('Error creating guest session:', error)
    return {
      success: false,
      error: 'Erro ao criar sessão',
    }
  }

  // Get full session details
  const { data: sessionDetails, error: sessionError } = await supabase
    .from('guest_sessions')
    .select('*')
    .eq('session_token', sessionToken)
    .single()

  if (sessionError || !sessionDetails) {
    return {
      success: false,
      error: 'Erro ao recuperar sessão',
    }
  }

  return {
    success: true,
    session: sessionDetails,
  }
}

/**
 * Verify guest session
 */
export async function verifyGuestSession(
  sessionToken: string
): Promise<GuestSession | null> {
  const supabase = createClient()

  const { data: session, error } = await supabase
    .from('guest_sessions')
    .select(
      `
      *,
      guest:simple_guests(id, name, invitation_code, attending)
    `
    )
    .eq('session_token', sessionToken)
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !session) {
    return null
  }

  // Update last activity
  await supabase
    .from('guest_sessions')
    .update({
      last_activity_at: new Date().toISOString(),
    })
    .eq('id', session.id)

  return session as GuestSession
}

// Note: getCurrentGuestSession moved to guestAuth.server.ts
// to avoid importing next/headers in client components

/**
 * Logout guest session
 */
export async function logoutGuestSession(sessionToken: string): Promise<void> {
  const supabase = createClient()

  await supabase
    .from('guest_sessions')
    .update({
      is_active: false,
    })
    .eq('session_token', sessionToken)
}

/**
 * Generate secure session token
 */
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Check if guest can upload (rate limiting)
 */
export async function canGuestUpload(guestId: string): Promise<{
  allowed: boolean
  reason?: string
  remaining?: number
}> {
  const supabase = createClient()

  // Get auth config
  const { data: config } = await supabase
    .from('wedding_auth_config')
    .select('max_uploads_per_guest, photo_upload_enabled, video_upload_enabled')
    .single()

  if (!config?.photo_upload_enabled) {
    return {
      allowed: false,
      reason: 'Upload de fotos está desabilitado no momento',
    }
  }

  // Count guest's current uploads
  const { count, error } = await supabase
    .from('guest_photos')
    .select('*', { count: 'exact', head: true })
    .eq('guest_id', guestId)
    .eq('is_deleted', false)

  if (error) {
    return {
      allowed: false,
      reason: 'Erro ao verificar limite de uploads',
    }
  }

  const maxUploads = config.max_uploads_per_guest || 50
  const currentUploads = count || 0

  if (currentUploads >= maxUploads) {
    return {
      allowed: false,
      reason: `Limite de ${maxUploads} uploads atingido`,
    }
  }

  return {
    allowed: true,
    remaining: maxUploads - currentUploads,
  }
}

/**
 * Set guest session cookie (client-side)
 */
export function setGuestSessionCookie(sessionToken: string): void {
  const expiresIn = GUEST_SESSION_DURATION_HOURS * 60 * 60 * 1000 // Convert to milliseconds
  const expires = new Date(Date.now() + expiresIn)

  document.cookie = `${GUEST_SESSION_COOKIE}=${sessionToken}; path=/; expires=${expires.toUTCString()}; SameSite=Strict; Secure`
}

/**
 * Get guest session cookie (client-side)
 */
export function getGuestSessionCookie(): string | null {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')
  const sessionCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${GUEST_SESSION_COOKIE}=`)
  )

  if (!sessionCookie) return null

  return sessionCookie.split('=')[1].trim()
}

/**
 * Clear guest session cookie (client-side)
 */
export function clearGuestSessionCookie(): void {
  document.cookie = `${GUEST_SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
