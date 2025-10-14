// @ts-nocheck: Supabase messaging tables not yet captured in generated types
/**
 * Guest-facing message utilities
 *
 * These helpers run in the browser (Supabase anon key) and must never touch
 * service-role credentials. They cover read/write operations that are already
 * protected by RLS:
 *   - fetching approved posts
 *   - managing reactions
 *   - managing comments
 *   - reading pinned posts
 */

import { createClient } from '@/lib/supabase/client'
import type {
  GuestPost,
  PostReaction,
  PostComment,
} from '@/types/wedding'

/**
 * Fetch approved guest posts with optional filtering/pagination.
 */
export async function getApprovedPosts(options?: {
  limit?: number
  offset?: number
  post_type?: 'text' | 'image' | 'video' | 'mixed'
}): Promise<GuestPost[]> {
  const supabase = createClient()

  let query = supabase
    .from('guest_posts')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (options?.post_type) {
    query = query.eq('post_type', options.post_type)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 10) - 1
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching approved posts:', error)
    return []
  }

  return data as GuestPost[]
}

/**
 * Add a reaction to a post (one per guest per post enforced by RLS/constraints).
 */
export async function addReaction(reaction: {
  post_id: string
  guest_name: string
  reaction_type: 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'
}): Promise<PostReaction | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_reactions')
    .insert(reaction)
    .select()
    .single()

  if (error) {
    console.error('Error adding reaction:', error)
    return null
  }

  return data as PostReaction
}

/**
 * Remove a guest reaction from a post.
 */
export async function removeReaction(
  postId: string,
  guestName: string
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('post_reactions')
    .delete()
    .eq('post_id', postId)
    .eq('guest_name', guestName)

  if (error) {
    console.error('Error removing reaction:', error)
    return false
  }

  return true
}

/**
 * Fetch every reaction for a post.
 */
export async function getPostReactions(postId: string): Promise<PostReaction[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching reactions:', error)
    return []
  }

  return data as PostReaction[]
}

/**
 * Fetch the current guest's reaction if it exists.
 */
export async function getGuestReaction(
  postId: string,
  guestName: string
): Promise<PostReaction | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('guest_name', guestName)
    .maybeSingle()

  if (error) {
    console.error('Error checking guest reaction:', error)
    return null
  }

  return (data as PostReaction) ?? null
}

/**
 * Create a comment (top-level or reply).
 */
export async function createComment(comment: {
  post_id: string
  guest_name: string
  content: string
  parent_comment_id?: string
}): Promise<PostComment | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_comments')
    .insert(comment)
    .select()
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    return null
  }

  return data as PostComment
}

/**
 * Fetch the top-level comments for a post.
 */
export async function getPostComments(postId: string): Promise<PostComment[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .is('parent_comment_id', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data as PostComment[]
}

/**
 * Fetch replies for a specific comment.
 */
export async function getCommentReplies(
  commentId: string
): Promise<PostComment[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('parent_comment_id', commentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comment replies:', error)
    return []
  }

  return data as PostComment[]
}

/**
 * Fetch every comment (flat) for a post.
 */
export async function getAllPostComments(postId: string): Promise<PostComment[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching all comments:', error)
    return []
  }

  return data as PostComment[]
}

/**
 * Fetch pinned posts with their metadata.
 */
export async function getPinnedPosts(): Promise<GuestPost[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pinned_posts')
    .select(
      `
      *,
      guest_posts (*)
    `
    )
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching pinned posts:', error)
    return []
  }

  return (data as any[])
    .map((item) => item.guest_posts)
    .filter(Boolean) as GuestPost[]
}

/**
 * Check if a post is pinned.
 */
export async function isPostPinned(postId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('pinned_posts')
    .select('id')
    .eq('post_id', postId)
    .maybeSingle()

  if (error) {
    console.error('Error checking pin status:', error)
    return false
  }

  return !!data
}
