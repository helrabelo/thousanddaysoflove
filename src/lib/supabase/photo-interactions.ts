/**
 * Photo Interactions Service
 * Handles reactions and comments on guest photos
 */

import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/server'

// =====================================================
// TYPES
// =====================================================

export type ReactionType = 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'

export interface PhotoReaction {
  id: string
  photo_id: string
  guest_session_id: string | null
  guest_name: string | null
  reaction_type: ReactionType
  created_at: string
}

export interface PhotoComment {
  id: string
  photo_id: string
  parent_comment_id: string | null
  guest_session_id: string | null
  guest_name: string
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
  const supabase = createClient()

  const { error } = await supabase
    .from('photo_reactions')
    .insert({
      photo_id: photoId,
      guest_session_id: guestSessionId,
      guest_name: guestName,
      reaction_type: reactionType,
    })

  if (error) {
    // Check if it's a unique constraint violation (user already reacted)
    if (error.code === '23505') {
      // Update existing reaction instead
      const { error: updateError } = await supabase
        .from('photo_reactions')
        .update({ reaction_type: reactionType })
        .eq('photo_id', photoId)
        .eq('guest_session_id', guestSessionId)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      return { success: true }
    }

    return { success: false, error: error.message }
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
  const supabase = createClient()

  const { error } = await supabase
    .from('photo_reactions')
    .delete()
    .eq('photo_id', photoId)
    .eq('guest_session_id', guestSessionId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Get all reactions for a photo
 */
export async function getPhotoReactions(photoId: string): Promise<PhotoReaction[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('photo_reactions')
    .select('*')
    .eq('photo_id', photoId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching photo reactions:', error)
    return []
  }

  return data || []
}

/**
 * Get reaction counts by type for a photo
 */
export async function getPhotoReactionCounts(
  photoId: string
): Promise<Record<ReactionType, number>> {
  const reactions = await getPhotoReactions(photoId)

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
  const supabase = createClient()

  const { data, error } = await supabase
    .from('photo_reactions')
    .select('reaction_type')
    .eq('photo_id', photoId)
    .eq('guest_session_id', guestSessionId)
    .maybeSingle()

  if (error || !data) {
    return null
  }

  return data.reaction_type as ReactionType
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
  const supabase = createClient()

  const { data, error } = await supabase
    .from('photo_comments')
    .insert({
      photo_id: photoId,
      parent_comment_id: parentCommentId || null,
      guest_session_id: guestSessionId,
      guest_name: guestName,
      content: content.trim(),
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, comment: data }
}

/**
 * Get all comments for a photo with nested replies
 */
export async function getPhotoComments(photoId: string): Promise<PhotoComment[]> {
  const supabase = createClient()

  // Get all comments for the photo
  const { data, error } = await supabase
    .from('photo_comments')
    .select('*')
    .eq('photo_id', photoId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching photo comments:', error)
    return []
  }

  if (!data) return []

  // Build nested structure
  const commentMap = new Map<string, PhotoComment>()
  const rootComments: PhotoComment[] = []

  // Initialize all comments in the map
  data.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  // Build tree structure
  data.forEach((comment) => {
    const commentWithReplies = commentMap.get(comment.id)!

    if (comment.parent_comment_id) {
      // This is a reply
      const parent = commentMap.get(comment.parent_comment_id)
      if (parent) {
        parent.replies = parent.replies || []
        parent.replies.push(commentWithReplies)
      }
    } else {
      // This is a root comment
      rootComments.push(commentWithReplies)
    }
  })

  return rootComments
}

/**
 * Delete a comment (admin only)
 */
export async function deletePhotoComment(
  commentId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('photo_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
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

  // Map to expected interface, handling legacy data without reactions_count
  const mappedPhotos = data.map((photo: any) => ({
    id: photo.id,
    title: photo.title || null,
    caption: photo.caption || null,
    storage_path: photo.storage_path,
    guest_name: photo.guest_name,
    upload_phase: photo.upload_phase,
    reactions_count: photo.reactions_count || 0, // Fallback for legacy data
    comment_count: photo.comment_count || 0,
    created_at: photo.uploaded_at || photo.created_at, // Use uploaded_at (correct field name)
  }))

  console.log('[photo-interactions] Mapped photos:', mappedPhotos.length, mappedPhotos[0])

  return mappedPhotos
}
