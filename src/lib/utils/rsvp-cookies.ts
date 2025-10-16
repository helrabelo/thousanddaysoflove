/**
 * RSVP Cookie Management Utilities
 *
 * Manages client-side cookies for RSVP state tracking including:
 * - Dismissal state (when user closes RSVP prompt)
 * - Confirmation status (when user confirms attendance)
 *
 * Cookie naming convention: rsvp_{type}_{inviteCode}
 * All cookies expire after 7 days
 */

const COOKIE_EXPIRATION_DAYS = 7;

/**
 * Set a cookie with expiration
 */
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return; // Server-side guard

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // Server-side guard

  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 */
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return; // Server-side guard

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// ============================================================================
// RSVP Dismissed State
// ============================================================================

/**
 * Mark RSVP prompt as dismissed for a specific invitation code
 * Cookie expires after 7 days, allowing re-prompt if not confirmed
 */
export function setRSVPDismissed(inviteCode: string): void {
  const cookieName = `rsvp_dismissed_${inviteCode}`;
  setCookie(cookieName, 'true', COOKIE_EXPIRATION_DAYS);
}

/**
 * Check if RSVP prompt has been dismissed
 * Returns true if dismissed and cookie hasn't expired
 */
export function getRSVPDismissed(inviteCode: string): boolean {
  const cookieName = `rsvp_dismissed_${inviteCode}`;
  return getCookie(cookieName) === 'true';
}

/**
 * Clear dismissed state (used when user reopens RSVP prompt)
 */
export function clearRSVPDismissed(inviteCode: string): void {
  const cookieName = `rsvp_dismissed_${inviteCode}`;
  deleteCookie(cookieName);
}

// ============================================================================
// RSVP Status State
// ============================================================================

export type RSVPStatus = 'confirmed' | 'declined' | 'pending';

/**
 * Set RSVP status for a specific invitation code
 * Used to show appropriate UI state before database sync completes
 */
export function setRSVPStatus(inviteCode: string, status: RSVPStatus): void {
  const cookieName = `rsvp_status_${inviteCode}`;
  setCookie(cookieName, status, COOKIE_EXPIRATION_DAYS);
}

/**
 * Get RSVP status from cookie
 * Returns status if set, otherwise 'pending'
 */
export function getRSVPStatus(inviteCode: string): RSVPStatus {
  const cookieName = `rsvp_status_${inviteCode}`;
  const status = getCookie(cookieName) as RSVPStatus | null;
  return status || 'pending';
}

/**
 * Clear RSVP status cookie (used when user changes their response)
 */
export function clearRSVPStatus(inviteCode: string): void {
  const cookieName = `rsvp_status_${inviteCode}`;
  deleteCookie(cookieName);
}

/**
 * Check if user has confirmed attendance (helper)
 */
export function isRSVPConfirmed(inviteCode: string): boolean {
  return getRSVPStatus(inviteCode) === 'confirmed';
}

/**
 * Check if user has declined attendance (helper)
 */
export function isRSVPDeclined(inviteCode: string): boolean {
  return getRSVPStatus(inviteCode) === 'declined';
}

// ============================================================================
// Clear All RSVP Data
// ============================================================================

/**
 * Clear all RSVP-related cookies for a specific invitation code
 * Useful for debugging or reset functionality
 */
export function clearAllRSVPCookies(inviteCode: string): void {
  clearRSVPDismissed(inviteCode);
  clearRSVPStatus(inviteCode);
}
