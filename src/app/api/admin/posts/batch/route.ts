/**
 * Admin Post Batch Moderation API
 * POST /api/admin/posts/batch
 */

import { NextRequest, NextResponse } from 'next/server';
import { batchModeratePosts } from '@/lib/supabase/messages/admin';
import { isAdminAuthenticatedFromRequest, unauthorizedResponse, badRequestResponse } from '@/lib/auth/adminAuth';

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
    if (!isAdminAuthenticatedFromRequest(request)) {
      return unauthorizedResponse();
    }

    const body = await request.json().catch(() => null) as BatchModerateRequestBody | null;
    if (!body) {
      return badRequestResponse('Dados inválidos');
    }

    const { action, postIds, reason } = body;

    if (action !== 'approve' && action !== 'reject') {
      return badRequestResponse('Ação inválida');
    }

    if (!Array.isArray(postIds) || postIds.length === 0) {
      return badRequestResponse('Nenhuma mensagem selecionada');
    }

    // Validate all postIds are strings
    if (!postIds.every((id): id is string => typeof id === 'string')) {
      return badRequestResponse('IDs de mensagem inválidos');
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
