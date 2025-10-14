/**
 * Admin Post Moderation API
 * PATCH /api/admin/posts/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { moderatePost } from '@/lib/supabase/messages/admin';
import type { GuestPost } from '@/types/wedding';

export const runtime = 'nodejs';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  success: true;
  post: GuestPost;
}

interface ModerateRequestBody {
  action?: string;
  reason?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json().catch(() => null) as ModerateRequestBody | null;
    if (!body) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { action, reason } = body;

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    const { id } = await params;

    const updatedPost = await moderatePost(id, action, 'Admin', reason);

    if (!updatedPost) {
      return NextResponse.json(
        { error: 'Erro ao atualizar mensagem' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, post: updatedPost }, { status: 200 });
  } catch (error) {
    console.error('Admin moderate post error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
