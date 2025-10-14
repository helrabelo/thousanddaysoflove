/**
 * Update Guest Progress API Endpoint
 * Server-side progress tracking to bypass RLS
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export const runtime = 'edge'

interface UpdateProgressRequest {
  code: string
  progress: {
    rsvp_completed?: boolean
    gift_selected?: boolean
    photos_uploaded?: boolean
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null) as UpdateProgressRequest | null

    if (!body || !body.code || !body.progress) {
      return NextResponse.json(
        { error: 'Código de convite e progresso são obrigatórios' },
        { status: 400 }
      )
    }

    const { code, progress } = body
    const supabase = createAdminClient()

    // Update progress
    const { data, error } = await supabase
      .from('invitations')
      .update(progress)
      .eq('code', code.toUpperCase())
      .select()
      .single()

    if (error) {
      console.error('Error updating guest progress:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar progresso' },
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
    console.error('Update progress error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
