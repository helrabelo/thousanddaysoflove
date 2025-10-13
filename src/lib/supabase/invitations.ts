/**
 * Invitations Service Layer
 *
 * Service functions for managing personalized wedding invitations with tracking
 *
 * Features:
 * - Fetch invitations by unique code
 * - Track invitation opens and view counts
 * - Update guest progress (RSVP, gifts, photos, messages)
 * - Calculate completion percentage
 */

import { createClient } from '@/lib/supabase/client';
import type { Invitation, GuestProgress } from '@/types/wedding';

/**
 * Get invitation by unique code
 *
 * @param code - Unique invitation code (e.g., FAMILY001)
 * @returns Invitation object or null if not found
 */
export async function getInvitationByCode(
  code: string
): Promise<Invitation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('code', code.toUpperCase())
    .single();

  if (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }

  return data as Invitation;
}

/**
 * Track invitation open event
 *
 * Updates the opened_at timestamp (first time) and increments open_count
 *
 * @param code - Invitation code
 * @returns Updated invitation or null on error
 */
export async function trackInvitationOpen(
  code: string
): Promise<Invitation | null> {
  const supabase = createClient();

  // First, get the current invitation to check if it's the first open
  const invitation = await getInvitationByCode(code);
  if (!invitation) return null;

  const updates: Partial<Invitation> = {
    open_count: invitation.open_count + 1,
  };

  // Set opened_at only on first open
  if (!invitation.opened_at) {
    updates.opened_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('invitations')
    .update(updates)
    .eq('code', code.toUpperCase())
    .select()
    .single();

  if (error) {
    console.error('Error tracking invitation open:', error);
    return null;
  }

  return data as Invitation;
}

/**
 * Update guest progress flags
 *
 * Updates the progress tracking fields for a guest's invitation
 *
 * @param code - Invitation code
 * @param progress - Progress fields to update
 * @returns Updated invitation or null on error
 */
export async function updateGuestProgress(
  code: string,
  progress: {
    rsvp_completed?: boolean;
    gift_selected?: boolean;
    photos_uploaded?: boolean;
  }
): Promise<Invitation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invitations')
    .update(progress)
    .eq('code', code.toUpperCase())
    .select()
    .single();

  if (error) {
    console.error('Error updating guest progress:', error);
    return null;
  }

  return data as Invitation;
}

/**
 * Calculate guest progress
 *
 * Computes completion percentage based on completed actions
 *
 * @param invitation - Invitation object
 * @returns Guest progress with percentage and counts
 */
export function calculateGuestProgress(
  invitation: Invitation
): GuestProgress {
  const actions = [
    invitation.rsvp_completed,
    invitation.gift_selected,
    invitation.photos_uploaded,
    false, // messages_sent - will be implemented in Phase 2
  ];

  const completed = actions.filter(Boolean).length;
  const total = actions.length;
  const percentage = Math.round((completed / total) * 100);

  return {
    rsvp_completed: invitation.rsvp_completed,
    gift_selected: invitation.gift_selected,
    photos_uploaded: invitation.photos_uploaded,
    messages_sent: false, // Future feature
    completion_percentage: percentage,
    completed_count: completed,
    total_count: total,
  };
}

/**
 * Get invitation statistics (admin use)
 *
 * Retrieves aggregate statistics for all invitations
 *
 * @returns Invitation statistics
 */
export async function getInvitationStats() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invitations')
    .select('*');

  if (error) {
    console.error('Error fetching invitation stats:', error);
    return null;
  }

  const invitations = data as Invitation[];

  return {
    total: invitations.length,
    opened: invitations.filter((i) => i.opened_at).length,
    rsvp_completed: invitations.filter((i) => i.rsvp_completed).length,
    gift_selected: invitations.filter((i) => i.gift_selected).length,
    photos_uploaded: invitations.filter((i) => i.photos_uploaded).length,
    total_opens: invitations.reduce((sum, i) => sum + i.open_count, 0),
    by_relationship: {
      family: invitations.filter((i) => i.relationship_type === 'family')
        .length,
      friend: invitations.filter((i) => i.relationship_type === 'friend')
        .length,
      colleague: invitations.filter((i) => i.relationship_type === 'colleague')
        .length,
      other: invitations.filter((i) => i.relationship_type === 'other').length,
    },
  };
}

/**
 * Check if guest has completed RSVP
 *
 * @param code - Invitation code
 * @returns Boolean indicating RSVP completion
 */
export async function hasCompletedRsvp(code: string): Promise<boolean> {
  const invitation = await getInvitationByCode(code);
  return invitation?.rsvp_completed ?? false;
}

/**
 * Check if guest has selected a gift
 *
 * @param code - Invitation code
 * @returns Boolean indicating gift selection
 */
export async function hasSelectedGift(code: string): Promise<boolean> {
  const invitation = await getInvitationByCode(code);
  return invitation?.gift_selected ?? false;
}

/**
 * Check if guest has uploaded photos
 *
 * @param code - Invitation code
 * @returns Boolean indicating photo upload
 */
export async function hasUploadedPhotos(code: string): Promise<boolean> {
  const invitation = await getInvitationByCode(code);
  return invitation?.photos_uploaded ?? false;
}
