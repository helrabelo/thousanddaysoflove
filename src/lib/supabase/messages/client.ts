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
import {
  addMediaReaction,
  removeMediaReaction,
  getMediaReactions,
  getUserReaction,
  getMediaComments,
  addMediaComment,
} from '@/lib/supabase/media-interactions'
import type { GuestPost } from '@/types/wedding'
import type { MediaReaction, MediaComment } from '@/types/media-interactions'

type PostReaction = MediaReaction
type PostComment = MediaComment

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
  const result = await addMediaReaction(
    'guest_post',
    reaction.post_id,
    reaction.reaction_type,
    { guestName: reaction.guest_name }
  )

  if (!result.success) {
    if (result.error) {
      console.error('Error adding reaction:', result.error)
    }
    return null
  }

  return result.data ?? null
}

/**
 * Remove a guest reaction from a post.
 */
export async function removeReaction(
  postId: string,
  guestName: string
): Promise<boolean> {
  const result = await removeMediaReaction(
    'guest_post',
    postId,
    { guestName }
  )

  if (!result.success) {
    if (result.error) {
      console.error('Error removing reaction:', result.error)
    }
    return false
  }

  return true
}

/**
 * Fetch every reaction for a post.
 */
export async function getPostReactions(postId: string): Promise<PostReaction[]> {
  const data = await getMediaReactions('guest_post', postId)
  return data
}

/**
 * Fetch the current guest's reaction if it exists.
 */
export async function getGuestReaction(
  postId: string,
  guestName: string
): Promise<PostReaction | null> {
  return getUserReaction(
    'guest_post',
    postId,
    { guestName }
  )
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
  const result = await addMediaComment(
    'guest_post',
    comment.post_id,
    comment.content,
    { guestName: comment.guest_name },
    comment.parent_comment_id
  )

  if (!result.success) {
    if (result.error) {
      console.error('Error creating comment:', result.error)
    }
    return null
  }

  return result.data ?? null
}

/**
 * Fetch the top-level comments for a post.
 */
export async function getPostComments(postId: string): Promise<PostComment[]> {
  const data = await getMediaComments('guest_post', postId)
  return data
}

/**
 * Fetch replies for a specific comment.
 */
export async function getCommentReplies(
  commentId: string
): Promise<PostComment[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('media_comments')
    .select('*')
    .eq('parent_id', commentId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comment replies:', error)
    return []
  }

  return (data as MediaComment[]) ?? []
}

/**
 * Fetch every comment (flat) for a post.
 */
export async function getAllPostComments(postId: string): Promise<PostComment[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('media_comments')
    .select('*')
    .eq('media_type', 'guest_post')
    .eq('media_id', postId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching all comments:', error)
    return []
  }

  return (data as MediaComment[]) ?? []
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

  if (!Array.isArray(data)) {
    return []
  }

  const posts = data
    .map((item) => {
      if (item && typeof item === 'object' && 'guest_posts' in item) {
        const { guest_posts } = item as { guest_posts?: GuestPost | null }
        return guest_posts ?? null
      }
      return null
    })
    .filter((post): post is GuestPost => post !== null)

  return posts
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
