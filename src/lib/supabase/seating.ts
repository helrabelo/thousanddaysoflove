/**
 * Supabase Seating Chart Service
 * Handles all seating chart and table assignment operations
 */

import { createServerClient } from '@/lib/supabase/server';
import type { Table, TableWithGuests, TableGuest } from '@/types/wedding';

/**
 * Get all tables with their assigned guests
 */
export async function getTablesWithGuests(): Promise<TableWithGuests[]> {
  const supabase = createServerClient();

  // Get all tables
  const { data: tables, error: tablesError } = await supabase
    .from('tables')
    .select('*')
    .order('table_number', { ascending: true });

  if (tablesError) {
    console.error('Error fetching tables:', tablesError);
    throw tablesError;
  }

  if (!tables || tables.length === 0) {
    return [];
  }

  // Get all invitations with table assignments
  const { data: invitations, error: invitationsError } = await supabase
    .from('invitations')
    .select('guest_name, guest_email, rsvp_completed, dietary_restrictions, table_number')
    .not('table_number', 'is', null)
    .order('guest_name', { ascending: true });

  if (invitationsError) {
    console.error('Error fetching invitations:', invitationsError);
    throw invitationsError;
  }

  // Map guests to their tables
  const tablesWithGuests: TableWithGuests[] = tables.map((table) => {
    const tableGuests = (invitations || [])
      .filter((inv) => inv.table_number === table.table_number)
      .map((inv) => ({
        guest_name: inv.guest_name,
        guest_email: inv.guest_email || undefined,
        rsvp_completed: inv.rsvp_completed || false,
        dietary_restrictions: inv.dietary_restrictions || undefined,
      }));

    const confirmedGuests = tableGuests.filter((g) => g.rsvp_completed).length;

    return {
      ...table,
      guests: tableGuests,
      assigned_guests: tableGuests.length,
      confirmed_guests: confirmedGuests,
    };
  });

  return tablesWithGuests;
}

/**
 * Get a specific table with its guests
 */
export async function getTableWithGuests(tableNumber: number): Promise<TableWithGuests | null> {
  const supabase = createServerClient();

  // Get the table
  const { data: table, error: tableError } = await supabase
    .from('tables')
    .select('*')
    .eq('table_number', tableNumber)
    .single();

  if (tableError || !table) {
    console.error('Error fetching table:', tableError);
    return null;
  }

  // Get guests for this table
  const { data: invitations, error: invitationsError } = await supabase
    .from('invitations')
    .select('guest_name, guest_email, rsvp_completed, dietary_restrictions')
    .eq('table_number', tableNumber)
    .order('guest_name', { ascending: true });

  if (invitationsError) {
    console.error('Error fetching table invitations:', invitationsError);
    return null;
  }

  const tableGuests: TableGuest[] = (invitations || []).map((inv) => ({
    guest_name: inv.guest_name,
    guest_email: inv.guest_email || undefined,
    rsvp_completed: inv.rsvp_completed || false,
    dietary_restrictions: inv.dietary_restrictions || undefined,
  }));

  const confirmedGuests = tableGuests.filter((g) => g.rsvp_completed).length;

  return {
    ...table,
    guests: tableGuests,
    assigned_guests: tableGuests.length,
    confirmed_guests: confirmedGuests,
  };
}

/**
 * Get table assignment for a specific guest by invitation code
 */
export async function getGuestTableAssignment(invitationCode: string): Promise<{
  table: Table | null;
  tableGuests: TableGuest[];
} | null> {
  const supabase = createServerClient();

  // Get the invitation
  const { data: invitation, error: invError } = await supabase
    .from('invitations')
    .select('table_number')
    .eq('code', invitationCode)
    .single();

  if (invError || !invitation || !invitation.table_number) {
    return null;
  }

  // Get the table details
  const tableWithGuests = await getTableWithGuests(invitation.table_number);

  if (!tableWithGuests) {
    return null;
  }

  return {
    table: {
      id: tableWithGuests.id,
      table_number: tableWithGuests.table_number,
      table_name: tableWithGuests.table_name,
      capacity: tableWithGuests.capacity,
      position_x: tableWithGuests.position_x,
      position_y: tableWithGuests.position_y,
      is_special: tableWithGuests.is_special,
      notes: tableWithGuests.notes,
      created_at: tableWithGuests.created_at,
      updated_at: tableWithGuests.updated_at,
    },
    tableGuests: tableWithGuests.guests,
  };
}

/**
 * Get seating statistics
 */
export async function getSeatingStats() {
  const supabase = createServerClient();

  const { data: stats, error } = await supabase
    .from('tables')
    .select('table_number, capacity')
    .order('table_number');

  if (error || !stats) {
    return {
      totalTables: 0,
      totalCapacity: 0,
      assignedSeats: 0,
      confirmedSeats: 0,
      availableSeats: 0,
    };
  }

  const totalCapacity = stats.reduce((sum, table) => sum + table.capacity, 0);

  // Get assigned and confirmed counts
  const { count: assignedCount } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true })
    .not('table_number', 'is', null);

  const { count: confirmedCount } = await supabase
    .from('invitations')
    .select('*', { count: 'exact', head: true })
    .not('table_number', 'is', null)
    .eq('rsvp_completed', true);

  return {
    totalTables: stats.length,
    totalCapacity,
    assignedSeats: assignedCount || 0,
    confirmedSeats: confirmedCount || 0,
    availableSeats: totalCapacity - (assignedCount || 0),
  };
}
