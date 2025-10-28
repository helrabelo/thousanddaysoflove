import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

interface InvitationUpdatePayload {
  rsvp_completed: boolean;
  attending: boolean;
  dietary_restrictions?: string;
}

/**
 * POST /api/invitations/submit-rsvp
 *
 * Submit RSVP for a wedding invitation
 *
 * Body:
 * - code: Invitation code
 * - attending: Boolean (will attend)
 * - dietary_restrictions: String (optional)
 *
 * Returns:
 * - Updated invitation object
 *
 * Note: Uses admin client to bypass RLS, but validates invitation exists first.
 * This is safe because the API route runs server-side only.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      attending,
      dietary_restrictions,
    } = body;

    console.log('[RSVP] Received submission:', { code, attending });

    // Validation
    if (!code) {
      return NextResponse.json(
        { error: 'Invitation code is required' },
        { status: 400 }
      );
    }

    if (typeof attending !== 'boolean') {
      return NextResponse.json(
        { error: 'Attending status is required' },
        { status: 400 }
      );
    }

    // Create admin client (safe in API routes - service key stays on server)
    const supabase = createAdminClient();

    // Fetch invitation to validate it exists
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      rsvp_completed: true,
      attending: attending,  // Maps to attending field in simple_guests
    };

    // Update dietary restrictions if provided
    if (dietary_restrictions) {
      updateData.dietary_restrictions = dietary_restrictions;
    }

    // Update invitation
    const { data: updatedInvitation, error: updateError } = await supabase
      .from('invitations')
      .update(updateData)
      .eq('code', code.toUpperCase())
      .select()
      .single();

    if (updateError) {
      console.error('Error updating invitation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update invitation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invitation: updatedInvitation,
    });
  } catch (error) {
    console.error('Error in submit-rsvp API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
