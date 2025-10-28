// Unified media interactions service
// Handles reactions and comments for guest photos, Sanity images, and guest posts

import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/server'
import type {
  MediaComment,
  MediaInteractionIdentity,
  MediaReaction,
  MediaReactionType,
  MediaSubscriptionEvent,
  MediaType,
} from '@/types/media-interactions'

type MediaReactionRow = MediaReaction & {
  guest_session_id: string | null
  guest_name: string | null
}

type MediaCommentRow = MediaComment & {
  guest_session_id: string | null
  guest_name: string | null
  parent_id: string | null
  replies?: never
}

interface MutationResult<T> {
  success: boolean
  data?: T
  error?: string
}

function assertIdentity(identity?: MediaInteractionIdentity): asserts identity is MediaInteractionIdentity {
  if (!identity || (!identity.guestSessionId && !identity.guestName)) {
    throw new Error('A valid guest identity (session or name) is required for this action.')
  }
}

function applyIdentityFilters<T extends { eq: (column: string, value: string) => T; is: (column: string, value: null) => T }>(
  query: T,
  identity: MediaInteractionIdentity
): T {
  if (identity.guestSessionId) {
    return query.eq('guest_session_id', identity.guestSessionId)
  }

  query.is('guest_session_id', null)
  return query.eq('guest_name', identity.guestName!)
}

function mapCommentRows(rows: MediaCommentRow[]): MediaComment[] {
  const commentMap = new Map<string, MediaComment>()
  const root: MediaComment[] = []

  rows.forEach((row) => {
    commentMap.set(row.id, {
      ...row,
      replies: [],
    })
  })

  rows.forEach((row) => {
    const current = commentMap.get(row.id)
    if (!current) return

    if (row.parent_id) {
      const parent = commentMap.get(row.parent_id)
      if (parent) {
        parent.replies = parent.replies ?? []
        parent.replies.push(current)
      }
    } else {
      root.push(current)
    }
  })

  return root
}

// =====================================================
// Reactions
// =====================================================

export async function getMediaReactions(
  mediaType: MediaType,
  mediaId: string
): Promise<MediaReaction[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('media_reactions')
    .select('*')
    .eq('media_type', mediaType)
    .eq('media_id', mediaId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[media-interactions] Failed to fetch reactions', error)
    return []
  }

  return (data as MediaReactionRow[]) ?? []
}

export async function getUserReaction(
  mediaType: MediaType,
  mediaId: string,
  identity: MediaInteractionIdentity
): Promise<MediaReaction | null> {
  assertIdentity(identity)
  const supabase = createClient()

  let query = supabase
    .from('media_reactions')
    .select('*')
    .eq('media_type', mediaType)
    .eq('media_id', mediaId)

  query = applyIdentityFilters(query, identity)

  const { data, error } = await query.maybeSingle()

  if (error) {
    console.error('[media-interactions] Failed to fetch user reaction', error)
    return null
  }

  return (data as MediaReactionRow) ?? null
}

export async function addMediaReaction(
  mediaType: MediaType,
  mediaId: string,
  reactionType: MediaReactionType,
  identity: MediaInteractionIdentity
): Promise<MutationResult<MediaReaction>> {
  assertIdentity(identity)
  const supabase = createClient()

  const payload = {
    media_type: mediaType,
    media_id: mediaId,
    reaction_type: reactionType,
    guest_session_id: identity.guestSessionId ?? null,
    guest_name: identity.guestName ?? null,
  }

  const { data, error } = await supabase
    .from('media_reactions')
    .insert(payload)
    .select()
    .single()

  if (!error && data) {
    return { success: true, data: data as MediaReaction }
  }

  if (error && error.code === '23505') {
    let updateQuery = supabase
      .from('media_reactions')
      .update({ reaction_type: reactionType })
      .eq('media_type', mediaType)
      .eq('media_id', mediaId)

    updateQuery = applyIdentityFilters(updateQuery, identity)

    const { data: updated, error: updateError } = await updateQuery.select().single()

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true, data: updated as MediaReaction }
  }

  return { success: false, error: error?.message ?? 'Falha ao registrar reação' }
}

export async function removeMediaReaction(
  mediaType: MediaType,
  mediaId: string,
  identity: MediaInteractionIdentity
): Promise<MutationResult<null>> {
  assertIdentity(identity)
  const supabase = createClient()

  let query = supabase
    .from('media_reactions')
    .delete()
    .eq('media_type', mediaType)
    .eq('media_id', mediaId)

  query = applyIdentityFilters(query, identity)

  const { error } = await query

  if (error) {
    console.error('[media-interactions] Failed to remove reaction', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =====================================================
// Comments
// =====================================================

export async function getMediaComments(
  mediaType: MediaType,
  mediaId: string
): Promise<MediaComment[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('media_comments')
    .select('*')
    .eq('media_type', mediaType)
    .eq('media_id', mediaId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[media-interactions] Failed to fetch comments', error)
    return []
  }

  if (!data) return []

  return mapCommentRows(data as MediaCommentRow[])
}

export async function addMediaComment(
  mediaType: MediaType,
  mediaId: string,
  text: string,
  identity: MediaInteractionIdentity,
  parentId?: string
): Promise<MutationResult<MediaComment>> {
  assertIdentity(identity)

  const supabase = createClient()

  const trimmed = text.trim()
  if (!trimmed) {
    return { success: false, error: 'O comentário não pode estar vazio.' }
  }

  const payload = {
    media_type: mediaType,
    media_id: mediaId,
    comment_text: trimmed,
    parent_id: parentId ?? null,
    guest_session_id: identity.guestSessionId ?? null,
    guest_name: identity.guestName ?? null,
  }

  const { data, error } = await supabase
    .from('media_comments')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[media-interactions] Failed to add comment', error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data as MediaComment }
}

export async function deleteMediaComment(commentId: string): Promise<MutationResult<null>> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('media_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('[media-interactions] Failed to delete comment', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getCommentThread(commentId: string): Promise<MediaComment | null> {
  const supabase = createClient()

  const { data: target, error: targetError } = await supabase
    .from('media_comments')
    .select('*')
    .eq('id', commentId)
    .maybeSingle()

  if (targetError || !target) {
    if (targetError) {
      console.error('[media-interactions] Failed to load comment thread', targetError)
    }
    return null
  }

  const comment = target as MediaCommentRow

  const { data: related, error: relatedError } = await supabase
    .from('media_comments')
    .select('*')
    .eq('media_type', comment.media_type)
    .eq('media_id', comment.media_id)
    .order('created_at', { ascending: true })

  if (relatedError || !related) {
    if (relatedError) {
      console.error('[media-interactions] Failed to load related comments', relatedError)
    }
    return comment
  }

  const nested = mapCommentRows(related as MediaCommentRow[])

  const stack: MediaComment[] = [...nested]
  while (stack.length > 0) {
    const current = stack.pop()!
    if (current.id === commentId) {
      return current
    }
    if (current.replies && current.replies.length > 0) {
      stack.push(...current.replies)
    }
  }

  return null
}

// =====================================================
// Real-time subscriptions
// =====================================================

export function subscribeToMediaReactions(
  mediaType: MediaType,
  mediaId: string,
  callback: (event: MediaSubscriptionEvent<MediaReaction>) => void
): () => void {
  const supabase = createClient()
  const channel = supabase
    .channel(`media-reactions-${mediaType}-${mediaId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'media_reactions',
        filter: `media_type=eq.${mediaType},media_id=eq.${mediaId}`,
      },
      (payload) => {
        const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
        const data =
          event === 'DELETE'
            ? (payload.old as MediaReactionRow)
            : (payload.new as MediaReactionRow)
        callback({ event, payload: data })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToMediaComments(
  mediaType: MediaType,
  mediaId: string,
  callback: (event: MediaSubscriptionEvent<MediaComment>) => void
): () => void {
  const supabase = createClient()
  const channel = supabase
    .channel(`media-comments-${mediaType}-${mediaId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'media_comments',
        filter: `media_type=eq.${mediaType},media_id=eq.${mediaId}`,
      },
      (payload) => {
        const event = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
        const data =
          event === 'DELETE'
            ? (payload.old as MediaCommentRow)
            : (payload.new as MediaCommentRow)
        callback({ event, payload: data })
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
