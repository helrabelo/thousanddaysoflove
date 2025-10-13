/**
 * Admin Photo Moderation API
 * PATCH /api/admin/photos/[id] - Approve or reject a photo
 */

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin authentication
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')?.value

    if (!adminSession) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { action, rejection_reason } = body

    // Validate action
    if (!action || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      )
    }

    // Require rejection reason
    if (action === 'rejected' && !rejection_reason) {
      return NextResponse.json(
        { error: 'Motivo da rejeição é obrigatório' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient()

    // Update photo moderation status
    const { data: photo, error: updateError } = await supabase
      .from('guest_photos')
      .update({
        moderation_status: action,
        moderated_at: new Date().toISOString(),
        moderated_by: 'admin', // TODO: Use actual admin username
        rejection_reason: action === 'rejected' ? rejection_reason : null,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !photo) {
      console.error('Error updating photo:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar foto' },
        { status: 500 }
      )
    }

    // Update activity_feed entries to be public if approved
    if (action === 'approved') {
      await supabase
        .from('activity_feed')
        .update({ is_public: true })
        .eq('target_type', 'photo')
        .eq('target_id', id)
    } else if (action === 'rejected') {
      // Hide activity feed entries if rejected
      await supabase
        .from('activity_feed')
        .update({ is_public: false })
        .eq('target_type', 'photo')
        .eq('target_id', id)
    }

    return NextResponse.json(
      {
        success: true,
        photo: {
          id: photo.id,
          moderation_status: photo.moderation_status,
          moderated_at: photo.moderated_at,
          rejection_reason: photo.rejection_reason,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Moderation error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
