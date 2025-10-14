// @ts-nocheck: live supabase feed still waiting for generated channel + post types
/**
 * Live Wedding Day Feed Service
 *
 * Provides real-time functionality for the wedding day live feed including:
 * - Real-time post subscriptions
 * - Pinned posts management
 * - Live statistics and celebration metrics
 * - Recent activity tracking
 * - Confirmed guests display
 */

import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type {
  GuestPost,
  PostReaction,
  PostComment,
  RealtimeChannel
} from '@/types/wedding'

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to new approved posts in real-time
 * Returns cleanup function to unsubscribe
 */
export function subscribeToNewPosts(
  callback: (post: GuestPost) => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel('live-posts')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'guest_posts',
        filter: 'status=eq.approved'
      },
      (payload) => {
        callback(payload.new as GuestPost)
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'guest_posts',
        filter: 'status=eq.approved'
      },
      (payload) => {
        callback(payload.new as GuestPost)
      }
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}

/**
 * Subscribe to post reactions in real-time
 */
export function subscribeToReactions(
  callback: (reaction: PostReaction) => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel('live-reactions')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'post_reactions'
      },
      (payload) => {
        callback(payload.new as PostReaction)
      }
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}

/**
 * Subscribe to post comments in real-time
 */
export function subscribeToComments(
  callback: (comment: PostComment) => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel('live-comments')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'post_comments'
      },
      (payload) => {
        callback(payload.new as PostComment)
      }
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}

/**
 * Subscribe to pinned posts changes
 */
export function subscribeToPinnedPosts(
  callback: () => void
): () => void {
  const supabase = createClient()

  const channel = supabase
    .channel('pinned-posts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'pinned_posts'
      },
      () => {
        callback()
      }
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}

// ============================================================================
// PINNED POSTS MANAGEMENT
// ============================================================================

/**
 * Get all pinned posts with full post details
 * Ordered by display_order
 */
export async function getPinnedPostsWithDetails(): Promise<GuestPost[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('pinned_posts')
    .select(`
      display_order,
      guest_posts (
        id,
        guest_session_id,
        guest_name,
        content,
        post_type,
        media_urls,
        status,
        likes_count,
        comments_count,
        created_at,
        updated_at
      )
    `)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching pinned posts:', error)
    return []
  }

  // Extract posts from the joined data
  return (data || [])
    .map((item: any) => item.guest_posts)
    .filter(Boolean) as GuestPost[]
}

/**
 * Pin a post to the special moments section
 */
export async function pinPost(
  postId: string,
  pinnedBy: string
): Promise<boolean> {
  const supabase = await createServerClient()

  // Get current max display_order
  const { data: maxOrderData } = await supabase
    .from('pinned_posts')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = (maxOrderData?.display_order || 0) + 1

  const { error } = await supabase
    .from('pinned_posts')
    .insert({
      post_id: postId,
      pinned_by: pinnedBy,
      display_order: nextOrder
    })

  if (error) {
    console.error('Error pinning post:', error)
    return false
  }

  return true
}

/**
 * Unpin a post from special moments
 */
export async function unpinPost(postId: string): Promise<boolean> {
  const supabase = await createServerClient()

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

/**
 * Update pinned post display order
 */
export async function updatePinnedPostOrder(
  postId: string,
  newOrder: number
): Promise<boolean> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('pinned_posts')
    .update({ display_order: newOrder })
    .eq('post_id', postId)

  if (error) {
    console.error('Error updating pinned post order:', error)
    return false
  }

  return true
}

/**
 * Check if a post is pinned
 */
export async function isPostPinned(postId: string): Promise<boolean> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('pinned_posts')
    .select('id')
    .eq('post_id', postId)
    .single()

  return !error && data !== null
}

// ============================================================================
// LIVE STATISTICS
// ============================================================================

export interface LiveCelebrationStats {
  total_posts_today: number
  photos_uploaded_today: number
  guests_checked_in: number
  total_reactions: number
  comments_today: number
}

/**
 * Get live celebration statistics for the dashboard
 */
export async function getLiveCelebrationStats(): Promise<LiveCelebrationStats> {
  const supabase = await createServerClient()

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString()

  // Fetch all stats in parallel
  const [
    { count: postsCount },
    { count: photosCount },
    { count: guestsCount },
    { count: reactionsCount },
    { count: commentsCount }
  ] = await Promise.all([
    // Total approved posts today
    supabase
      .from('guest_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('created_at', todayStr),

    // Photos uploaded today
    supabase
      .from('guest_photos')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .gte('created_at', todayStr),

    // Guests checked in (RSVP completed)
    supabase
      .from('invitations')
      .select('id', { count: 'exact', head: true })
      .eq('rsvp_completed', true),

    // Total reactions given
    supabase
      .from('post_reactions')
      .select('id', { count: 'exact', head: true }),

    // Comments posted today
    supabase
      .from('post_comments')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', todayStr)
  ])

  return {
    total_posts_today: postsCount || 0,
    photos_uploaded_today: photosCount || 0,
    guests_checked_in: guestsCount || 0,
    total_reactions: reactionsCount || 0,
    comments_today: commentsCount || 0
  }
}

// ============================================================================
// RECENT ACTIVITY
// ============================================================================

export interface ActivityItem {
  id: string
  type: 'post' | 'reaction' | 'comment' | 'photo'
  guest_name: string
  description: string
  created_at: string
}

/**
 * Get recent activity across all features
 */
export async function getRecentActivity(limit: number = 10): Promise<ActivityItem[]> {
  const supabase = await createServerClient()
  const activities: ActivityItem[] = []

  // Fetch recent approved posts
  const { data: posts } = await supabase
    .from('guest_posts')
    .select('id, guest_name, post_type, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (posts) {
    activities.push(
      ...posts.map((post) => ({
        id: post.id,
        type: 'post' as const,
        guest_name: post.guest_name,
        description: `postou ${
          post.post_type === 'image' ? 'uma foto' :
          post.post_type === 'video' ? 'um vídeo' :
          'uma mensagem'
        }`,
        created_at: post.created_at
      }))
    )
  }

  // Fetch recent approved photos
  const { data: photos } = await supabase
    .from('guest_photos')
    .select('id, guest_name, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (photos) {
    activities.push(
      ...photos.map((photo) => ({
        id: photo.id,
        type: 'photo' as const,
        guest_name: photo.guest_name || 'Convidado',
        description: 'enviou uma foto',
        created_at: photo.created_at
      }))
    )
  }

  // Sort all activities by date and limit
  return activities
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

// ============================================================================
// CONFIRMED GUESTS
// ============================================================================

export interface ConfirmedGuest {
  id: string
  guest_name: string
  guest_email: string | null
  relationship_type: string
  plus_one_allowed: boolean
  plus_one_name: string | null
}

/**
 * Get list of confirmed guests (RSVP completed)
 */
export async function getConfirmedGuests(): Promise<ConfirmedGuest[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('invitations')
    .select('id, guest_name, guest_email, relationship_type, plus_one_allowed, plus_one_name')
    .eq('rsvp_completed', true)
    .order('guest_name', { ascending: true })

  if (error) {
    console.error('Error fetching confirmed guests:', error)
    return []
  }

  return data || []
}

// ============================================================================
// RECENT APPROVED PHOTOS
// ============================================================================

export interface RecentPhoto {
  id: string
  photo_url: string
  guest_name: string | null
  phase: 'before' | 'during' | 'after'
  created_at: string
}

/**
 * Get recently approved photos for slideshow
 */
export async function getRecentApprovedPhotos(limit: number = 20): Promise<RecentPhoto[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('guest_photos')
    .select('id, photo_url, guest_name, phase, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent photos:', error)
    return []
  }

  return data || []
}

// ============================================================================
// LIVE POSTS STREAM
// ============================================================================

/**
 * Get approved posts for live feed with pagination
 */
export async function getLivePosts(
  limit: number = 50,
  offset: number = 0
): Promise<GuestPost[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('guest_posts')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching live posts:', error)
    return []
  }

  return data || []
}

/**
 * Get single post by ID (for real-time updates)
 */
export async function getPostById(postId: string): Promise<GuestPost | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('guest_posts')
    .select('*')
    .eq('id', postId)
    .single()

  if (error) {
    console.error('Error fetching post:', error)
    return null
  }

  return data
}
