/**
 * Track Invitation Open API Endpoint
 * Server-side tracking of invitation opens to bypass RLS
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const runtime = 'edge'

interface TrackOpenRequest {
  code: string
}

interface InvitationOpenUpdate {
  open_count: number
  opened_at?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as TrackOpenRequest | null

    if (!body || !body.code) {
      return NextResponse.json(
        { error: 'Código de convite é obrigatório' },
        { status: 400 }
      )
    }

    const { code } = body
    const supabase = createAdminClient()

    // Get current invitation
    const { data: invitation, error: fetchError } = await supabase
      .from('invitations')
      .select('id, open_count, opened_at')
      .eq('code', code.toUpperCase())
      .single()

    if (fetchError || !invitation) {
      return NextResponse.json(
        { error: 'Convite não encontrado' },
        { status: 404 }
      )
    }

    // Prepare updates
    const updates: InvitationOpenUpdate = {
      open_count: invitation.open_count + 1,
    }

    // Set opened_at only on first open
    if (!invitation.opened_at) {
      updates.opened_at = new Date().toISOString()
    }

    // Update invitation
    const { data, error: updateError } = await supabase
      .from('invitations')
      .update(updates)
      .eq('code', code.toUpperCase())
      .select()
      .single()

    if (updateError) {
      console.error('Error tracking invitation open:', updateError)
      return NextResponse.json(
        { error: 'Erro ao rastrear abertura' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        invitation: data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Track open error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
