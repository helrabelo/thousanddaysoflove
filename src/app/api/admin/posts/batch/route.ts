/**
 * Admin Post Batch Moderation API
 * POST /api/admin/posts/batch
 */

import { NextRequest, NextResponse } from 'next/server';
import { batchModeratePosts } from '@/lib/supabase/messages/admin';

export const runtime = 'nodejs';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  success: true;
  count: number;
}

interface BatchModerateRequestBody {
  action?: string;
  postIds?: unknown;
  reason?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    const sessionCookie = request.cookies.get('admin_session');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json().catch(() => null) as BatchModerateRequestBody | null;
    if (!body) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const { action, postIds, reason } = body;

    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json({ error: 'Nenhuma mensagem selecionada' }, { status: 400 });
    }

    // Validate all postIds are strings
    if (!postIds.every((id): id is string => typeof id === 'string')) {
      return NextResponse.json({ error: 'IDs de mensagem inválidos' }, { status: 400 });
    }

    const updatedCount = await batchModeratePosts(postIds, action, 'Admin', reason);

    return NextResponse.json(
      { success: true, count: updatedCount },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin batch moderate posts error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
