'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, User } from 'lucide-react'
import {
  getPhotoComments,
  addPhotoComment,
  type PhotoComment,
} from '@/lib/supabase/photo-interactions'
import { formatTimeAgo } from '@/lib/utils/format'

interface PhotoCommentsProps {
  photoId: string
  guestSessionId: string | null
  guestName: string
  initialCount?: number
}

export default function PhotoComments({
  photoId,
  guestSessionId,
  guestName,
  initialCount = 0,
}: PhotoCommentsProps) {
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<PhotoComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadComments = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPhotoComments(photoId)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [photoId])

  useEffect(() => {
    if (showComments) {
      loadComments()
    }
  }, [loadComments, showComments])

  const handleSubmitComment = async () => {
    if (!guestSessionId) {
      alert('Por favor, faça login para comentar')
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)

    try {
      const result = await addPhotoComment(
        photoId,
        newComment,
        guestSessionId,
        guestName,
        replyingTo || undefined
      )

      if (result.success) {
        setNewComment('')
        setReplyingTo(null)
        await loadComments()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  const totalComments = showComments
    ? comments.reduce((count, comment) => count + 1 + (comment.replies?.length || 0), 0)
    : initialCount

  return (
    <div className="relative">
      {/* Comments Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#F8F6F3]"
        style={{
          fontFamily: 'var(--font-crimson)',
          color: 'var(--secondary-text)',
        }}
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {totalComments > 0 ? totalComments : 'Comentar'}
        </span>
      </button>

      {/* Comments Panel */}
      <AnimatePresence>
        {showComments && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setShowComments(false)}
            />

            {/* Comments Modal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-4 bottom-4 md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-full md:mt-2 md:w-96 bg-white rounded-2xl shadow-2xl z-50 border border-[#E8E6E3] max-h-[70vh] flex flex-col"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#E8E6E3]">
                <h3
                  className="font-medium text-[#2C2C2C]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Comentários ({totalComments})
                </h3>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-[#A8A8A8]">
                    <p style={{ fontFamily: 'var(--font-crimson)' }}>Carregando...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-[#A8A8A8]">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p style={{ fontFamily: 'var(--font-crimson)' }}>
                      Seja o primeiro a comentar!
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onReply={() => setReplyingTo(comment.id)}
                    />
                  ))
                )}
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-[#E8E6E3]">
                {replyingTo && (
                  <div className="mb-2 flex items-center justify-between">
                    <p
                      className="text-xs text-[#A8A8A8]"
                      style={{ fontFamily: 'var(--font-crimson)' }}
                    >
                      Respondendo...
                    </p>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-xs text-[#4A7C59] hover:underline"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Adicione um comentário..."
                    maxLength={1000}
                    rows={2}
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E8E6E3] text-sm resize-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 transition-all disabled:opacity-50"
                    style={{
                      fontFamily: 'var(--font-crimson)',
                      color: 'var(--primary-text)',
                    }}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={isSubmitting || !newComment.trim()}
                    className="px-4 py-2 bg-[#4A7C59] text-white rounded-xl transition-all duration-300 hover:bg-[#3d6a4a] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="mt-1 text-xs text-[#A8A8A8]"
                  style={{ fontFamily: 'var(--font-crimson)' }}
                >
                  {newComment.length}/1000
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

// Comment Item Component
function CommentItem({
  comment,
  onReply,
  isReply = false,
}: {
  comment: PhotoComment
  onReply: () => void
  isReply?: boolean
}) {
  return (
    <div className={isReply ? 'ml-8' : ''}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <User className="w-4 h-4" style={{ color: 'var(--secondary-text)' }} />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <p
              className="font-medium text-sm text-[#2C2C2C]"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {comment.guest_name}
            </p>
            <p
              className="text-xs text-[#A8A8A8]"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              {formatTimeAgo(comment.created_at)}
            </p>
          </div>
          <p
            className="text-sm text-[#4A4A4A] break-words"
            style={{ fontFamily: 'var(--font-crimson)' }}
          >
            {comment.content}
          </p>
          {!isReply && (
            <button
              onClick={onReply}
              className="mt-1 text-xs text-[#4A7C59] hover:underline"
              style={{ fontFamily: 'var(--font-crimson)' }}
            >
              Responder
            </button>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  isReply
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
