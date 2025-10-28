export type MediaType = 'guest_photo' | 'sanity_image' | 'guest_post'

export type MediaReactionType = 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'

export interface MediaReaction {
  id: string
  media_type: MediaType
  media_id: string
  reaction_type: MediaReactionType
  guest_session_id?: string | null
  guest_name?: string | null
  created_at: string
}

export interface MediaComment {
  id: string
  media_type: MediaType
  media_id: string
  comment_text: string
  guest_session_id?: string | null
  guest_name?: string | null
  parent_id?: string | null
  created_at: string
  replies?: MediaComment[]
}

export interface MediaInteractionIdentity {
  guestSessionId?: string | null
  guestName?: string | null
}

export interface MediaSubscriptionEvent<T> {
  event: 'INSERT' | 'UPDATE' | 'DELETE'
  payload: T
}
