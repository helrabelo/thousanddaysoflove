// @ts-nocheck: invitation workflows still await stable typed Supabase views
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
 * Uses server-side API to bypass RLS policies
 *
 * @param code - Invitation code
 * @returns Updated invitation or null on error
 */
export async function trackInvitationOpen(
  code: string
): Promise<Invitation | null> {
  try {
    const response = await fetch('/api/invitations/track-open', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error tracking invitation open:', error)
      return null
    }

    const { invitation } = await response.json()
    return invitation as Invitation
  } catch (error) {
    console.error('Error tracking invitation open:', error)
    return null
  }
}

/**
 * Update guest progress flags
 *
 * Updates the progress tracking fields for a guest's invitation
 * Uses server-side API to bypass RLS policies
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
  try {
    const response = await fetch('/api/invitations/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, progress }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Error updating guest progress:', error)
      return null
    }

    const { invitation } = await response.json()
    return invitation as Invitation
  } catch (error) {
    console.error('Error updating guest progress:', error)
    return null
  }
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

// =====================================================
// ADMIN FUNCTIONS - Phase 4
// =====================================================

/**
 * Get all invitations (admin use)
 *
 * Retrieves all invitations with optional filtering and sorting
 *
 * @param filters - Optional filters (relationship_type, search query)
 * @param sortBy - Sort field (created_at, guest_name, opened_at)
 * @param sortOrder - Sort order (asc, desc)
 * @returns Array of invitations
 */
export async function getAllInvitations(
  filters?: {
    relationship_type?: 'family' | 'friend' | 'colleague' | 'other';
    search?: string;
    rsvp_completed?: boolean;
    gift_selected?: boolean;
    photos_uploaded?: boolean;
    has_opened?: boolean;
  },
  sortBy: 'created_at' | 'guest_name' | 'opened_at' | 'open_count' = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<Invitation[]> {
  const supabase = createClient();

  let query = supabase.from('invitations').select('*');

  // Apply filters
  if (filters) {
    if (filters.relationship_type) {
      query = query.eq('relationship_type', filters.relationship_type);
    }
    if (filters.rsvp_completed !== undefined) {
      query = query.eq('rsvp_completed', filters.rsvp_completed);
    }
    if (filters.gift_selected !== undefined) {
      query = query.eq('gift_selected', filters.gift_selected);
    }
    if (filters.photos_uploaded !== undefined) {
      query = query.eq('photos_uploaded', filters.photos_uploaded);
    }
    if (filters.has_opened) {
      query = query.not('opened_at', 'is', null);
    }
    if (filters.search) {
      query = query.or(
        `guest_name.ilike.%${filters.search}%,guest_email.ilike.%${filters.search}%,code.ilike.%${filters.search}%`
      );
    }
  }

  // Apply sorting
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }

  return data as Invitation[];
}

/**
 * Create new invitation (admin use)
 *
 * Generates a new invitation with a unique code
 *
 * @param invitation - Invitation data
 * @returns Created invitation or null on error
 */
export async function createInvitation(
  invitation: Omit<Invitation, 'id' | 'created_at' | 'updated_at' | 'open_count' | 'opened_at' | 'rsvp_completed' | 'gift_selected' | 'photos_uploaded'>
): Promise<Invitation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invitations')
    .insert({
      code: invitation.code.toUpperCase(),
      guest_name: invitation.guest_name,
      guest_email: invitation.guest_email,
      guest_phone: invitation.guest_phone,
      relationship_type: invitation.relationship_type,
      plus_one_allowed: invitation.plus_one_allowed,
      plus_one_name: invitation.plus_one_name,
      custom_message: invitation.custom_message,
      table_number: invitation.table_number,
      dietary_restrictions: invitation.dietary_restrictions,
      created_by: invitation.created_by,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating invitation:', error);
    return null;
  }

  return data as Invitation;
}

/**
 * Update invitation (admin use)
 *
 * Updates an existing invitation
 *
 * @param id - Invitation ID
 * @param updates - Fields to update
 * @returns Updated invitation or null on error
 */
export async function updateInvitation(
  id: string,
  updates: Partial<Omit<Invitation, 'id' | 'created_at' | 'updated_at'>>
): Promise<Invitation | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invitations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating invitation:', error);
    return null;
  }

  return data as Invitation;
}

/**
 * Delete invitation (admin use)
 *
 * Deletes an invitation by ID
 *
 * @param id - Invitation ID
 * @returns Success boolean
 */
export async function deleteInvitation(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('invitations').delete().eq('id', id);

  if (error) {
    console.error('Error deleting invitation:', error);
    return false;
  }

  return true;
}

/**
 * Generate unique invitation code
 *
 * Creates a unique code in the format: TYPE###
 * Examples: FAMILY001, FRIEND042, WORK015
 *
 * @param relationship_type - Relationship type for prefix
 * @returns Unique code string
 */
export async function generateUniqueCode(
  relationship_type: 'family' | 'friend' | 'colleague' | 'other'
): Promise<string> {
  const supabase = createClient();

  // Map relationship types to prefixes
  const prefixMap = {
    family: 'FAMILY',
    friend: 'FRIEND',
    colleague: 'WORK',
    other: 'OTHER',
  };

  const prefix = prefixMap[relationship_type];

  // Get all existing codes with this prefix
  const { data } = await supabase
    .from('invitations')
    .select('code')
    .ilike('code', `${prefix}%`);

  if (!data) return `${prefix}001`;

  // Extract numbers from existing codes
  const numbers = data
    .map((inv) => {
      const match = inv.code.match(/\d+$/);
      return match ? parseInt(match[0]) : 0;
    })
    .filter((n) => n > 0);

  // Find the next available number
  const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
}

/**
 * Bulk create invitations (admin use)
 *
 * Creates multiple invitations at once with auto-generated codes
 *
 * @param invitations - Array of invitation data (without codes)
 * @returns Array of created invitations
 */
export async function bulkCreateInvitations(
  invitations: Array<
    Omit<Invitation, 'id' | 'code' | 'created_at' | 'updated_at' | 'open_count' | 'opened_at' | 'rsvp_completed' | 'gift_selected' | 'photos_uploaded'>
  >
): Promise<Invitation[]> {
  const createdInvitations: Invitation[] = [];

  for (const inv of invitations) {
    const code = await generateUniqueCode(inv.relationship_type);
    const created = await createInvitation({ ...inv, code });
    if (created) {
      createdInvitations.push(created);
    }
  }

  return createdInvitations;
}

/**
 * Export invitations to CSV format (admin use)
 *
 * Generates CSV string of all invitations for export
 *
 * @returns CSV string
 */
export async function exportInvitationsToCSV(): Promise<string> {
  const invitations = await getAllInvitations();

  // CSV header
  const headers = [
    'Code',
    'Guest Name',
    'Email',
    'Phone',
    'Relationship',
    'Plus One',
    'Plus One Name',
    'Table',
    'Dietary Restrictions',
    'Custom Message',
    'Opened',
    'Open Count',
    'RSVP',
    'Gift',
    'Photos',
    'Created At',
  ];

  // CSV rows
  const rows = invitations.map((inv) => [
    inv.code,
    inv.guest_name,
    inv.guest_email || '',
    inv.guest_phone || '',
    inv.relationship_type,
    inv.plus_one_allowed ? 'Yes' : 'No',
    inv.plus_one_name || '',
    inv.table_number || '',
    inv.dietary_restrictions || '',
    (inv.custom_message || '').replace(/"/g, '""'), // Escape quotes
    inv.opened_at ? new Date(inv.opened_at).toLocaleDateString('pt-BR') : '',
    inv.open_count.toString(),
    inv.rsvp_completed ? 'Yes' : 'No',
    inv.gift_selected ? 'Yes' : 'No',
    inv.photos_uploaded ? 'Yes' : 'No',
    new Date(inv.created_at).toLocaleDateString('pt-BR'),
  ]);

  // Combine headers and rows
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => (cell.includes(',') || cell.includes('"') ? `"${cell}"` : cell))
        .join(',')
    ),
  ].join('\n');

  return csv;
}

/**
 * Get detailed invitation analytics (admin use)
 *
 * Retrieves comprehensive analytics with breakdowns and rates
 *
 * @returns Detailed analytics object
 */
export async function getInvitationAnalytics() {
  const invitations = await getAllInvitations();

  const total = invitations.length;
  const opened = invitations.filter((i) => i.opened_at).length;
  const rsvp_completed = invitations.filter((i) => i.rsvp_completed).length;
  const gift_selected = invitations.filter((i) => i.gift_selected).length;
  const photos_uploaded = invitations.filter((i) => i.photos_uploaded).length;

  // Calculate rates
  const open_rate = total > 0 ? Math.round((opened / total) * 100) : 0;
  const rsvp_rate = total > 0 ? Math.round((rsvp_completed / total) * 100) : 0;
  const gift_rate = total > 0 ? Math.round((gift_selected / total) * 100) : 0;
  const photo_rate = total > 0 ? Math.round((photos_uploaded / total) * 100) : 0;

  // Breakdown by relationship type
  const by_relationship = {
    family: {
      total: invitations.filter((i) => i.relationship_type === 'family').length,
      opened: invitations.filter(
        (i) => i.relationship_type === 'family' && i.opened_at
      ).length,
      rsvp: invitations.filter(
        (i) => i.relationship_type === 'family' && i.rsvp_completed
      ).length,
    },
    friend: {
      total: invitations.filter((i) => i.relationship_type === 'friend').length,
      opened: invitations.filter(
        (i) => i.relationship_type === 'friend' && i.opened_at
      ).length,
      rsvp: invitations.filter(
        (i) => i.relationship_type === 'friend' && i.rsvp_completed
      ).length,
    },
    colleague: {
      total: invitations.filter((i) => i.relationship_type === 'colleague')
        .length,
      opened: invitations.filter(
        (i) => i.relationship_type === 'colleague' && i.opened_at
      ).length,
      rsvp: invitations.filter(
        (i) => i.relationship_type === 'colleague' && i.rsvp_completed
      ).length,
    },
    other: {
      total: invitations.filter((i) => i.relationship_type === 'other').length,
      opened: invitations.filter(
        (i) => i.relationship_type === 'other' && i.opened_at
      ).length,
      rsvp: invitations.filter(
        (i) => i.relationship_type === 'other' && i.rsvp_completed
      ).length,
    },
  };

  // Recent activity (last 10 openings)
  const recent_openings = invitations
    .filter((i) => i.opened_at)
    .sort(
      (a, b) =>
        new Date(b.opened_at!).getTime() - new Date(a.opened_at!).getTime()
    )
    .slice(0, 10)
    .map((i) => ({
      code: i.code,
      guest_name: i.guest_name,
      opened_at: i.opened_at!,
      relationship_type: i.relationship_type,
    }));

  // Plus one stats
  const plus_one_allowed = invitations.filter((i) => i.plus_one_allowed).length;
  const plus_one_with_name = invitations.filter((i) => i.plus_one_name).length;

  return {
    total,
    opened,
    rsvp_completed,
    gift_selected,
    photos_uploaded,
    open_rate,
    rsvp_rate,
    gift_rate,
    photo_rate,
    total_opens: invitations.reduce((sum, i) => sum + i.open_count, 0),
    by_relationship,
    recent_openings,
    plus_one_stats: {
      allowed: plus_one_allowed,
      with_name: plus_one_with_name,
    },
  };
}

// =====================================================
// GUEST AUTHENTICATION - Phase 6
// =====================================================

/**
 * Authenticate guest with invitation code
 *
 * Creates a persistent session in localStorage for guest access
 *
 * @param code - Invitation code
 * @returns Invitation object if valid, null otherwise
 */
export async function loginWithInvitationCode(
  code: string
): Promise<Invitation | null> {
  const invitation = await getInvitationByCode(code);

  if (!invitation) {
    return null;
  }

  // Store session in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest_session_code', code.toUpperCase());
  }

  // Track invitation open on first login
  await trackInvitationOpen(code);

  return invitation;
}

/**
 * Get current guest session
 *
 * Retrieves the logged-in guest's invitation from localStorage
 *
 * @returns Invitation object if session exists, null otherwise
 */
export async function getGuestSession(): Promise<Invitation | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  const code = localStorage.getItem('guest_session_code');

  if (!code) {
    return null;
  }

  return await getInvitationByCode(code);
}

/**
 * Logout current guest
 *
 * Clears the guest session from localStorage
 */
export function logoutGuest(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('guest_session_code');
  }
}
