/**
 * Dashboard Service Layer - Phase 6
 *
 * Service functions for guest dashboard data aggregation
 *
 * Features:
 * - Fetch all dashboard data in optimized queries
 * - Get guest activity across all features
 * - Calculate personal statistics
 * - Recent activity timeline
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Invitation,
  GuestProgress,
} from '@/types/wedding';
import { getInvitationByCode, calculateGuestProgress } from './invitations';

// =====================================================
// TYPES
// =====================================================

/**
 * Activity item for guest timeline
 */
export interface ActivityItem {
  id: string;
  type:
    | 'post_created'
    | 'comment_made'
    | 'reaction_given'
    | 'photo_uploaded'
    | 'gift_selected'
    | 'rsvp_completed';
  description: string;
  icon: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Guest personal statistics
 */
export interface GuestStats {
  posts_count: number;
  comments_count: number;
  reactions_count: number;
  photos_count: number;
}

/**
 * Complete dashboard data
 */
export interface GuestDashboardData {
  invitation: Invitation;
  progress: GuestProgress;
  recentActivity: ActivityItem[];
  stats: GuestStats;
}

// =====================================================
// DASHBOARD DATA FUNCTIONS
// =====================================================

/**
 * Fetch all data for guest dashboard in one call
 *
 * Optimized function that fetches all dashboard data efficiently
 *
 * @param code - Invitation code
 * @returns Complete dashboard data object
 */
export async function getGuestDashboardData(
  code: string
): Promise<GuestDashboardData | null> {
  // Get invitation
  const invitation = await getInvitationByCode(code);
  if (!invitation) return null;

  // Fetch all data in parallel
  const [recentActivity, stats] = await Promise.all([
    getGuestActivity(code, 10),
    getGuestStats(code),
  ]);

  // Calculate progress
  const progress = calculateGuestProgress(invitation);

  return {
    invitation,
    progress,
    recentActivity,
    stats,
  };
}

/**
 * Get guest's recent activity across all features
 *
 * Combines activities from posts, comments, reactions, photos, gifts, and RSVP
 *
 * @param code - Invitation code
 * @param limit - Number of recent activities to fetch (default: 10)
 * @returns Array of activity items sorted by timestamp
 */
export async function getGuestActivity(
  code: string,
  limit: number = 10
): Promise<ActivityItem[]> {
  const supabase = createClient();
  const activities: ActivityItem[] = [];

  // Get invitation to get guest_name for matching
  const invitation = await getInvitationByCode(code);
  if (!invitation) return [];

  const guestName = invitation.guest_name;

  // Fetch posts by guest
  const { data: posts } = await supabase
    .from('guest_posts')
    .select('id, created_at, post_type, content')
    .eq('guest_name', guestName)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (posts) {
    activities.push(
      ...posts
        .filter((post) => post.created_at !== null)
        .map((post) => ({
          id: `post-${post.id}`,
          type: 'post_created' as const,
          description: getPostDescription(post.post_type),
          icon: '📝',
          timestamp: post.created_at!,
          metadata: { post_id: post.id, content: post.content },
        }))
    );
  }

  // Fetch comments by guest
  const { data: comments } = await supabase
    .from('post_comments')
    .select('id, created_at, content, post_id')
    .eq('guest_name', guestName)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (comments) {
    activities.push(
      ...comments
        .filter((comment) => comment.created_at !== null)
        .map((comment) => ({
          id: `comment-${comment.id}`,
          type: 'comment_made' as const,
          description: 'Você comentou em um post',
          icon: '💬',
          timestamp: comment.created_at!,
          metadata: { comment_id: comment.id, post_id: comment.post_id },
        }))
    );
  }

  // Fetch reactions by guest
  const { data: reactions } = await supabase
    .from('post_reactions')
    .select('id, created_at, reaction_type, post_id')
    .eq('guest_name', guestName)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (reactions) {
    activities.push(
      ...reactions
        .filter((reaction) => reaction.created_at !== null)
        .map((reaction) => ({
          id: `reaction-${reaction.id}`,
          type: 'reaction_given' as const,
          description: `Você reagiu com ${getReactionEmoji(reaction.reaction_type)}`,
          icon: getReactionEmoji(reaction.reaction_type),
          timestamp: reaction.created_at!,
          metadata: { reaction_id: reaction.id, post_id: reaction.post_id },
        }))
    );
  }

  // Fetch photos uploaded by guest
  const { data: photos } = await supabase
    .from('guest_photos')
    .select('id, created_at')
    .eq('guest_name', guestName)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (photos) {
    activities.push(
      ...photos
        .filter((photo) => photo.created_at !== null)
        .map((photo) => ({
          id: `photo-${photo.id}`,
          type: 'photo_uploaded' as const,
          description: 'Você enviou uma foto',
          icon: '📸',
          timestamp: photo.created_at!,
          metadata: { photo_id: photo.id },
        }))
    );
  }

  // Add RSVP activity if completed
  if (invitation.rsvp_completed) {
    activities.push({
      id: `rsvp-${invitation.id}`,
      type: 'rsvp_completed',
      description: 'Você confirmou presença',
      icon: '✓',
      timestamp: invitation.updated_at, // Approximate timestamp
      metadata: { invitation_id: invitation.id },
    });
  }

  // Add gift selection activity if completed
  if (invitation.gift_selected) {
    activities.push({
      id: `gift-${invitation.id}`,
      type: 'gift_selected',
      description: 'Você selecionou um presente',
      icon: '🎁',
      timestamp: invitation.updated_at, // Approximate timestamp
      metadata: { invitation_id: invitation.id },
    });
  }

  // Sort all activities by timestamp (most recent first)
  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Return only the requested limit
  return activities.slice(0, limit);
}

/**
 * Get guest's personal statistics
 *
 * Calculates counts for all guest activities
 *
 * @param code - Invitation code
 * @returns Guest statistics object
 */
export async function getGuestStats(code: string): Promise<GuestStats> {
  const supabase = createClient();

  // Get invitation to get guest_name
  const invitation = await getInvitationByCode(code);
  if (!invitation) {
    return {
      posts_count: 0,
      comments_count: 0,
      reactions_count: 0,
      photos_count: 0,
    };
  }

  const guestName = invitation.guest_name;

  // Fetch counts in parallel
  const [postsResult, commentsResult, reactionsResult, photosResult] =
    await Promise.all([
      supabase
        .from('guest_posts')
        .select('id', { count: 'exact', head: true })
        .eq('guest_name', guestName)
        .eq('status', 'approved'),
      supabase
        .from('post_comments')
        .select('id', { count: 'exact', head: true })
        .eq('guest_name', guestName),
      supabase
        .from('post_reactions')
        .select('id', { count: 'exact', head: true })
        .eq('guest_name', guestName),
      supabase
        .from('guest_photos')
        .select('id', { count: 'exact', head: true })
        .eq('guest_name', guestName)
        .eq('status', 'approved'),
    ]);

  return {
    posts_count: postsResult.count ?? 0,
    comments_count: commentsResult.count ?? 0,
    reactions_count: reactionsResult.count ?? 0,
    photos_count: photosResult.count ?? 0,
  };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get human-readable post description
 */
function getPostDescription(postType: string): string {
  switch (postType) {
    case 'text':
      return 'Você postou uma mensagem';
    case 'image':
      return 'Você compartilhou fotos';
    case 'video':
      return 'Você compartilhou vídeos';
    case 'mixed':
      return 'Você compartilhou fotos e vídeos';
    default:
      return 'Você fez um post';
  }
}

/**
 * Get emoji for reaction type
 */
function getReactionEmoji(reactionType: string): string {
  switch (reactionType) {
    case 'heart':
      return '❤️';
    case 'clap':
      return '👏';
    case 'laugh':
      return '😂';
    case 'celebrate':
      return '🎉';
    case 'love':
      return '💕';
    default:
      return '❤️';
  }
}
