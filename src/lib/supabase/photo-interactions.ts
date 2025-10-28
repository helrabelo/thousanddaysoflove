// @ts-nocheck: Supabase photo interaction queries rely on dynamic views pending typed coverage
/**
 * Photo Interactions Service
 * Handles reactions and comments on guest photos
 */

import { createClient } from '@/lib/supabase/client'
import {
  addMediaReaction,
  removeMediaReaction,
  getMediaReactions,
  getUserReaction,
  addMediaComment,
  getMediaComments,
  deleteMediaComment,
} from '@/lib/supabase/media-interactions'
import type { Database } from '@/types/supabase'
import type { MediaComment, MediaReaction, MediaReactionType } from '@/types/media-interactions'

// =====================================================
// TYPES
// =====================================================

export type ReactionType = MediaReactionType

export type PhotoReaction = MediaReaction & { photo_id: string }

export interface PhotoComment {
  id: string
  photo_id: string
  parent_comment_id: string | null
  guest_session_id: string | null
  guest_name: string | null
  content: string
  created_at: string
  updated_at: string
  replies?: PhotoComment[]
}

export interface PhotoWithInteractions {
  id: string
  title: string | null
  caption: string | null
  storage_path: string
  guest_name: string
  upload_phase: 'before' | 'during' | 'after'
  reactions_count: number
  comment_count: number
  created_at: string
}

type GuestPhotoRowWithCounts = Database['public']['Tables']['guest_photos']['Row'] & {
  reactions_count?: number | null
  comment_count?: number | null
}

function mapMediaComment(comment: MediaComment): PhotoComment {
  return {
    id: comment.id,
    photo_id: comment.media_id,
    parent_comment_id: comment.parent_id ?? null,
    guest_session_id: comment.guest_session_id ?? null,
    guest_name: comment.guest_name ?? null,
    content: comment.comment_text,
    created_at: comment.created_at,
    updated_at: comment.created_at,
    replies: comment.replies?.map(mapMediaComment),
  }
}

// =====================================================
// REACTIONS
// =====================================================

/**
 * Add a reaction to a photo
 */
export async function addPhotoReaction(
  photoId: string,
  reactionType: ReactionType,
  guestSessionId: string,
  guestName: string
): Promise<{ success: boolean; error?: string }> {
  const result = await addMediaReaction('guest_photo', photoId, reactionType, {
    guestSessionId,
    guestName,
  })

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return { success: true }
}

/**
 * Remove a reaction from a photo
 */
export async function removePhotoReaction(
  photoId: string,
  guestSessionId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await removeMediaReaction('guest_photo', photoId, {
    guestSessionId,
  })

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return { success: true }
}

/**
 * Get all reactions for a photo
 */
export async function getPhotoReactions(photoId: string): Promise<PhotoReaction[]> {
  const reactions = await getMediaReactions('guest_photo', photoId)
  return reactions.map((reaction) => ({
    ...reaction,
    photo_id: reaction.media_id,
  }))
}

/**
 * Get reaction counts by type for a photo
 */
export async function getPhotoReactionCounts(
  photoId: string
): Promise<Record<ReactionType, number>> {
  const reactions = await getMediaReactions('guest_photo', photoId)

  const counts: Record<ReactionType, number> = {
    heart: 0,
    clap: 0,
    laugh: 0,
    celebrate: 0,
    love: 0,
  }

  reactions.forEach((reaction) => {
    counts[reaction.reaction_type]++
  })

  return counts
}

/**
 * Check if user has reacted to a photo
 */
export async function getUserPhotoReaction(
  photoId: string,
  guestSessionId: string
): Promise<ReactionType | null> {
  const reaction = await getUserReaction('guest_photo', photoId, {
    guestSessionId,
  })

  return reaction?.reaction_type ?? null
}

// =====================================================
// COMMENTS
// =====================================================

/**
 * Add a comment to a photo
 */
export async function addPhotoComment(
  photoId: string,
  content: string,
  guestSessionId: string,
  guestName: string,
  parentCommentId?: string
): Promise<{ success: boolean; comment?: PhotoComment; error?: string }> {
  const result = await addMediaComment('guest_photo', photoId, content, {
    guestSessionId,
    guestName,
  }, parentCommentId)

  if (!result.success || !result.data) {
    return { success: false, error: result.error }
  }

  return { success: true, comment: mapMediaComment(result.data) }
}

/**
 * Get all comments for a photo with nested replies
 */
export async function getPhotoComments(photoId: string): Promise<PhotoComment[]> {
  const comments = await getMediaComments('guest_photo', photoId)
  return comments.map(mapMediaComment)
}

/**
 * Delete a comment (admin only)
 */
export async function deletePhotoComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await deleteMediaComment(commentId)
  return { success: result.success, error: result.error }
}

// =====================================================
// STATISTICS
// =====================================================

/**
 * Get photos with their interaction counts
 */
export async function getPhotosWithInteractions(
  phase?: 'before' | 'during' | 'after'
): Promise<PhotoWithInteractions[]> {
  const supabase = createClient()

  let query = supabase
    .from('guest_photos')
    .select('*')
    .eq('moderation_status', 'approved')
    .eq('is_deleted', false)
    .order('uploaded_at', { ascending: false })

  if (phase) {
    query = query.eq('upload_phase', phase)
  }

  const { data, error } = await query

  if (error) {
    console.error('[photo-interactions] Error fetching photos:', error)
    return []
  }

  console.log('[photo-interactions] Raw data from Supabase:', data?.length || 0, 'photos')

  if (!data) return []

  const typedPhotos: GuestPhotoRowWithCounts[] = data

  // Map to expected interface, handling legacy data without reactions_count
  const mappedPhotos = typedPhotos.map((photo) => ({
    id: photo.id,
    title: photo.title || null,
    caption: photo.caption || null,
    storage_path: photo.storage_path,
    guest_name: photo.guest_name,
    upload_phase: photo.upload_phase,
    reactions_count: photo.reactions_count ?? 0,
    comment_count: photo.comment_count ?? 0,
    created_at: photo.uploaded_at || photo.created_at, // Use uploaded_at (correct field name)
  }))

  console.log('[photo-interactions] Mapped photos:', mappedPhotos.length, mappedPhotos[0])

  return mappedPhotos
}
