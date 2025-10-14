/**
 * Messages Service Layer
 *
 * Service functions for managing guest posts, reactions, and comments
 *
 * Features:
 * - Create and fetch guest posts with moderation
 * - Add and remove reactions (heart, clap, laugh, celebrate, love)
 * - Create and fetch comments with nested replies
 * - Moderate posts (approve/reject)
 * - Pin/unpin special moments
 */

import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/server';
import type {
  GuestPost,
  PostReaction,
  PostComment,
  PinnedPost,
} from '@/types/wedding';

// =====================================================
// GUEST POSTS
// =====================================================

/**
 * Create a new guest post
 *
 * Auto-approves posts from authenticated guests (via invitation code)
 * Requires manual approval for anonymous guests (via shared password)
 *
 * @param post - Post data
 * @param isAuthenticated - Whether guest is authenticated via invitation code
 * @returns Created post or null on error
 */
export async function createGuestPost(post: {
  guest_name: string;
  content: string;
  post_type: 'text' | 'image' | 'video' | 'mixed';
  media_urls?: string[];
  isAuthenticated?: boolean;
}): Promise<GuestPost | null> {
  const supabase = createClient();

  // Auto-approve for authenticated guests (invitation code)
  // Require approval for anonymous guests (shared password)
  const status = post.isAuthenticated ? 'approved' : 'pending';

  const { data, error } = await supabase
    .from('guest_posts')
    .insert({
      guest_name: post.guest_name,
      content: post.content,
      post_type: post.post_type,
      media_urls: post.media_urls,
      status,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating guest post:', error);
    return null;
  }

  return data as GuestPost;
}

/**
 * Get all approved posts
 *
 * Returns posts sorted by creation date (newest first)
 *
 * @param options - Query options (limit, offset, post_type filter)
 * @returns Array of approved posts
 */
export async function getApprovedPosts(options?: {
  limit?: number;
  offset?: number;
  post_type?: 'text' | 'image' | 'video' | 'mixed';
}): Promise<GuestPost[]> {
  const supabase = createClient();

  let query = supabase
    .from('guest_posts')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (options?.post_type) {
    query = query.eq('post_type', options.post_type);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching approved posts:', error);
    return [];
  }

  return data as GuestPost[];
}

/**
 * Get all posts with reactions and comments (admin only)
 *
 * Returns all posts regardless of moderation status
 *
 * @param status - Filter by status (optional)
 * @returns Array of posts
 */
export async function getAllPosts(status?: 'pending' | 'approved' | 'rejected'): Promise<GuestPost[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from('guest_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all posts:', error);
    return [];
  }

  return data as GuestPost[];
}

/**
 * Get pending posts count (admin only)
 *
 * @returns Count of pending posts
 */
export async function getPendingPostsCount(): Promise<number> {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from('guest_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) {
    console.error('Error counting pending posts:', error);
    return 0;
  }

  return count || 0;
}

/**
 * Moderate a guest post (admin only)
 *
 * @param postId - Post ID
 * @param action - 'approve' or 'reject'
 * @param reason - Optional reason for rejection
 * @param moderatedBy - Admin username/email
 * @returns Updated post or null on error
 */
export async function moderatePost(
  postId: string,
  action: 'approve' | 'reject',
  moderatedBy: string,
  reason?: string
): Promise<GuestPost | null> {
  const supabase = createAdminClient();

  const updates = {
    status: action === 'approve' ? 'approved' : 'rejected',
    moderated_at: new Date().toISOString(),
    moderated_by: moderatedBy,
    moderation_reason: reason || null,
  } as const;

  const { data, error } = await supabase
    .from('guest_posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('Error moderating post:', error);
    return null;
  }

  return data as GuestPost;
}

/**
 * Batch moderate posts (admin only)
 *
 * @param postIds - Array of post IDs
 * @param action - 'approve' or 'reject'
 * @param moderatedBy - Admin username/email
 * @returns Number of posts moderated
 */
export async function batchModeratePosts(
  postIds: string[],
  action: 'approve' | 'reject',
  moderatedBy: string
): Promise<number> {
  const supabase = createAdminClient();

  const updates = {
    status: action === 'approve' ? 'approved' : 'rejected',
    moderated_at: new Date().toISOString(),
    moderated_by: moderatedBy,
  } as const;

  const { data, error } = await supabase
    .from('guest_posts')
    .update(updates)
    .in('id', postIds)
    .select();

  if (error) {
    console.error('Error batch moderating posts:', error);
    return 0;
  }

  return data?.length || 0;
}

// =====================================================
// REACTIONS
// =====================================================

/**
 * Add a reaction to a post
 *
 * One reaction per guest per post (UPSERT behavior via unique constraint)
 *
 * @param reaction - Reaction data
 * @returns Created reaction or null on error
 */
export async function addReaction(reaction: {
  post_id: string;
  guest_name: string;
  reaction_type: 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love';
}): Promise<PostReaction | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_reactions')
    .insert(reaction)
    .select()
    .single();

  if (error) {
    console.error('Error adding reaction:', error);
    return null;
  }

  return data as PostReaction;
}

/**
 * Remove a reaction from a post
 *
 * @param postId - Post ID
 * @param guestName - Guest name
 * @returns Success status
 */
export async function removeReaction(
  postId: string,
  guestName: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('post_reactions')
    .delete()
    .eq('post_id', postId)
    .eq('guest_name', guestName);

  if (error) {
    console.error('Error removing reaction:', error);
    return false;
  }

  return true;
}

/**
 * Get reactions for a post
 *
 * @param postId - Post ID
 * @returns Array of reactions
 */
export async function getPostReactions(postId: string): Promise<PostReaction[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching reactions:', error);
    return [];
  }

  return data as PostReaction[];
}

/**
 * Check if guest has reacted to a post
 *
 * @param postId - Post ID
 * @param guestName - Guest name
 * @returns Reaction type or null
 */
export async function getGuestReaction(
  postId: string,
  guestName: string
): Promise<PostReaction | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('guest_name', guestName)
    .maybeSingle();

  if (error) {
    console.error('Error checking guest reaction:', error);
    return null;
  }

  return data as PostReaction | null;
}

// =====================================================
// COMMENTS
// =====================================================

/**
 * Create a comment on a post
 *
 * @param comment - Comment data
 * @returns Created comment or null on error
 */
export async function createComment(comment: {
  post_id: string;
  guest_name: string;
  content: string;
  parent_comment_id?: string;
}): Promise<PostComment | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_comments')
    .insert(comment)
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return null;
  }

  return data as PostComment;
}

/**
 * Get comments for a post with nested replies
 *
 * @param postId - Post ID
 * @returns Array of comments (top-level only, use getCommentReplies for nested)
 */
export async function getPostComments(postId: string): Promise<PostComment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .is('parent_comment_id', null) // Top-level comments only
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data as PostComment[];
}

/**
 * Get replies to a comment
 *
 * @param commentId - Parent comment ID
 * @returns Array of reply comments
 */
export async function getCommentReplies(commentId: string): Promise<PostComment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('parent_comment_id', commentId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comment replies:', error);
    return [];
  }

  return data as PostComment[];
}

/**
 * Get all comments for a post (flat structure)
 *
 * @param postId - Post ID
 * @returns Array of all comments (no nesting)
 */
export async function getAllPostComments(postId: string): Promise<PostComment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching all comments:', error);
    return [];
  }

  return data as PostComment[];
}

// =====================================================
// PINNED POSTS (Admin Only)
// =====================================================

/**
 * Pin a post (admin only)
 *
 * @param postId - Post ID (must be approved)
 * @param pinnedBy - Admin username/email
 * @param displayOrder - Display order (default: 0)
 * @returns Pinned post or null on error
 */
export async function pinPost(
  postId: string,
  pinnedBy: string,
  displayOrder = 0
): Promise<PinnedPost | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('pinned_posts')
    .insert({
      post_id: postId,
      pinned_by: pinnedBy,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    console.error('Error pinning post:', error);
    return null;
  }

  return data as PinnedPost;
}

/**
 * Unpin a post (admin only)
 *
 * @param postId - Post ID
 * @returns Success status
 */
export async function unpinPost(postId: string): Promise<boolean> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('pinned_posts')
    .delete()
    .eq('post_id', postId);

  if (error) {
    console.error('Error unpinning post:', error);
    return false;
  }

  return true;
}

/**
 * Get pinned posts with full post details
 *
 * @returns Array of pinned posts sorted by display order
 */
export async function getPinnedPosts(): Promise<GuestPost[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pinned_posts')
    .select(`
      *,
      guest_posts (*)
    `)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching pinned posts:', error);
    return [];
  }

  // Extract the nested guest_posts data
  return (data as any[])
    .map((item) => item.guest_posts)
    .filter(Boolean) as GuestPost[];
}

/**
 * Check if a post is pinned
 *
 * @param postId - Post ID
 * @returns Boolean indicating pin status
 */
export async function isPostPinned(postId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('pinned_posts')
    .select('id')
    .eq('post_id', postId)
    .maybeSingle();

  if (error) {
    console.error('Error checking pin status:', error);
    return false;
  }

  return !!data;
}

// =====================================================
// STATISTICS
// =====================================================

/**
 * Get post statistics (admin only)
 *
 * @returns Post statistics
 */
export async function getPostStats() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('guest_posts')
    .select('*');

  if (error) {
    console.error('Error fetching post stats:', error);
    return null;
  }

  const posts = data as GuestPost[];

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
    total_likes: posts.reduce((sum, p) => sum + p.likes_count, 0),
    total_comments: posts.reduce((sum, p) => sum + p.comments_count, 0),
  };
}
