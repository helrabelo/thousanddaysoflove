/**
 * Admin Posts API
 * Server-side API for fetching posts with service role access
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, getPostStats } from '@/lib/supabase/messages';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Check admin auth (middleware already verified, but double-check cookie)
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;
    const action = searchParams.get('action'); // 'posts' or 'stats'

    // Return stats
    if (action === 'stats') {
      const stats = await getPostStats();
      return NextResponse.json(stats);
    }

    // Return posts
    const posts = await getAllPosts(status || undefined);
    return NextResponse.json(posts);

  } catch (error) {
    console.error('Admin posts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
