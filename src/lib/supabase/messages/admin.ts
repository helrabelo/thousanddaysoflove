/**
 * Admin-facing message utilities
 *
 * These helpers run on the server (API routes, server components). They use the
 * Supabase service role key and must never be imported from client components.
 */

import { createAdminClient } from '@/lib/supabase/server'
import type { GuestPost, PinnedPost } from '@/types/wedding'
import type { Database } from '@/types/supabase'
type PostStatus = Database['public']['Tables']['guest_posts']['Row']['status']

/**
 * Fetch every post regardless of status for moderation dashboards.
 */
export async function getAllPosts(
  status?: PostStatus
): Promise<GuestPost[]> {
  const supabase = createAdminClient()

  let query = supabase
    .from('guest_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all posts:', error)
    return []
  }

  return (data || []) as GuestPost[]
}

/**
 * Count pending posts for badge display.
 */
export async function getPendingPostsCount(): Promise<number> {
  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from('guest_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) {
    console.error('Error counting pending posts:', error)
    return 0
  }

  return count ?? 0
}

/**
 * Moderate a single post.
 */
export async function moderatePost(
  postId: string,
  action: 'approve' | 'reject',
  moderatedBy: string,
  reason?: string
): Promise<GuestPost | null> {
  const supabase = createAdminClient()

  const updates = {
    status: (action === 'approve' ? 'approved' : 'rejected') as PostStatus,
    moderated_at: new Date().toISOString(),
    moderated_by: moderatedBy,
    moderation_reason: reason || null,
  }

  const { data, error } = await supabase
    .from('guest_posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  if (error) {
    console.error('Error moderating post:', error)
    return null
  }

  return data as GuestPost
}

/**
 * Moderate multiple posts at once.
 */
export async function batchModeratePosts(
  postIds: string[],
  action: 'approve' | 'reject',
  moderatedBy: string,
  reason?: string
): Promise<number> {
  const supabase = createAdminClient()

  const updates = {
    status: (action === 'approve' ? 'approved' : 'rejected') as PostStatus,
    moderated_at: new Date().toISOString(),
    moderated_by: moderatedBy,
    moderation_reason: action === 'reject' ? reason || null : null,
  }

  const { data, error } = await supabase
    .from('guest_posts')
    .update(updates)
    .in('id', postIds)
    .select()

  if (error) {
    console.error('Error batch moderating posts:', error)
    return 0
  }

  return data?.length ?? 0
}

/**
 * Pin an approved post.
 */
export async function pinPost(
  postId: string,
  pinnedBy: string,
  displayOrder = 0
): Promise<PinnedPost | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('pinned_posts')
    .insert({
      post_id: postId,
      pinned_by: pinnedBy,
      display_order: displayOrder,
    })
    .select()
    .single()

  if (error) {
    console.error('Error pinning post:', error)
    return null
  }

  return data as PinnedPost
}

/**
 * Unpin a post from special moments
 */
export async function unpinPost(postId: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('pinned_posts')
    .delete()
    .eq('post_id', postId)

  if (error) {
    console.error('Error unpinning post:', error)
    return false
  }

  return true
}

interface PostStats {
  total: number
  pending: number
  approved: number
  rejected: number
  by_type: {
    text: number
    image: number
    video: number
    mixed: number
  }
  total_likes: number
  total_comments: number
}

/**
 * Derive aggregate stats for dashboards.
 */
export async function getPostStats(): Promise<PostStats | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('guest_posts')
    .select('*')

  if (error) {
    console.error('Error fetching post stats:', error)
    return null
  }

  const posts = data as GuestPost[]

  return {
    total: posts.length,
    pending: posts.filter((p) => p.status === 'pending').length,
    approved: posts.filter((p) => p.status === 'approved').length,
    rejected: posts.filter((p) => p.status === 'rejected').length,
    by_type: {
      text: posts.filter((p) => p.post_type === 'text').length,
      image: posts.filter((p) => p.post_type === 'image').length,
      video: posts.filter((p) => p.post_type === 'video').length,
      mixed: posts.filter((p) => p.post_type === 'mixed').length,
    },
    total_likes: posts.reduce((sum, p) => sum + (p.likes_count || 0), 0),
    total_comments: posts.reduce((sum, p) => sum + (p.comments_count || 0), 0),
  }
}
