/**
 * Admin Post Moderation API
 * PATCH /api/admin/posts/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { moderatePost } from '@/lib/supabase/messages/admin';
import type { GuestPost } from '@/types/wedding';
import { isAdminAuthenticatedFromRequest, unauthorizedResponse, badRequestResponse } from '@/lib/auth/adminAuth';

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
    if (!isAdminAuthenticatedFromRequest(request)) {
      return unauthorizedResponse();
    }

    const body = await request.json().catch(() => null) as ModerateRequestBody | null;
    if (!body) {
      return badRequestResponse('Dados inválidos');
    }

    const { action, reason } = body;

    if (action !== 'approve' && action !== 'reject') {
      return badRequestResponse('Ação inválida');
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
