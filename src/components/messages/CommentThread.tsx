'use client';

/**
 * Comment Thread Component
 *
 * Display and manage comments with nested replies
 *
 * Features:
 * - Nested comment display with indentation
 * - Reply to comments
 * - Character limit with counter
 * - Loading states
 * - Elegant wedding aesthetic
 * - Mobile-first responsive design
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader2, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { addMediaComment } from '@/lib/supabase/media-interactions';
import type { MediaComment, MediaType } from '@/types/media-interactions';

interface CommentThreadProps {
  mediaType: MediaType;
  mediaId: string;
  comments: MediaComment[];
  currentGuestName?: string;
  showInput?: boolean;
  onCommentAdded?: () => void;
}

interface CommentItemProps {
  mediaType: MediaType;
  mediaId: string;
  comment: MediaComment;
  currentGuestName?: string;
  onReplyAdded?: () => void;
  depth?: number;
}

const MAX_COMMENT_LENGTH = 1000;
const MAX_DEPTH = 3; // Maximum nesting level

// Individual Comment Component
function CommentItem({
  mediaType,
  mediaId,
  comment,
  currentGuestName,
  onReplyAdded,
  depth = 0,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState((comment.replies?.length ?? 0) > 0);

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !currentGuestName || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await addMediaComment(
        mediaType,
        mediaId,
        replyContent.trim(),
        { guestName: currentGuestName },
        comment.id
      );

      if (result.success) {
        setReplyContent('');
        setShowReplyInput(false);
        setShowReplies(true);
        onReplyAdded?.();
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const canReply = depth < MAX_DEPTH && currentGuestName;
  const replies = comment.replies ?? [];
  const hasReplies = replies.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-4 sm:ml-8' : ''}`}>
      <div className="flex gap-2 sm:gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#E8E6E3] flex items-center justify-center">
          <User className="w-4 h-4 text-[#A8A8A8]" />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-semibold text-sm text-[#2C2C2C]">
              {comment.guest_name}
            </span>
            <span className="text-xs text-[#A8A8A8]">{timeAgo}</span>
          </div>

          {/* Content */}
          <p className="text-sm text-[#2C2C2C] whitespace-pre-wrap break-words mb-2">
            {comment.comment_text}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canReply && (
              <button
                type="button"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors min-h-[44px] sm:min-h-0 flex items-center"
              >
                Responder
              </button>
            )}

            {hasReplies && (
              <button
                type="button"
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors min-h-[44px] sm:min-h-0"
              >
                <CornerDownRight className="w-3 h-3" />
                {showReplies ? 'Ocultar' : 'Ver'} {replies.length} resposta{replies.length !== 1 && 's'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input - Mobile Optimized */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-3 ${depth > 0 ? 'ml-10 sm:ml-11' : 'ml-10 sm:ml-11'}`}
          >
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Mobile: Full width input above button */}
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escreva uma resposta..."
                maxLength={MAX_COMMENT_LENGTH}
                disabled={isSubmitting}
                className="w-full sm:flex-1 px-3 py-3 sm:py-2 text-sm border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
              />
              {/* Mobile: Full width button below input, min 44px touch target */}
              <button
                type="button"
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || isSubmitting}
                className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-3 sm:py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Enviar resposta"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="sm:hidden">Enviar</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-[#A8A8A8]">
                {replyContent.length}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nested Replies */}
      <AnimatePresence>
        {showReplies && hasReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                mediaType={mediaType}
                mediaId={mediaId}
                comment={reply}
                currentGuestName={currentGuestName}
                onReplyAdded={onReplyAdded}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Comment Thread Component
export default function CommentThread({
  mediaType,
  mediaId,
  comments,
  currentGuestName,
  showInput = false,
  onCommentAdded,
}: CommentThreadProps) {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit top-level comment
  const handleSubmit = async () => {
    if (!commentContent.trim() || !currentGuestName || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await addMediaComment(
        mediaType,
        mediaId,
        commentContent.trim(),
        { guestName: currentGuestName }
      );

      if (result.success) {
        setCommentContent('');
        onCommentAdded?.();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Comment Input - Mobile Optimized */}
      {showInput && currentGuestName && (
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Mobile: Full width input above button */}
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Escreva um comentário..."
              maxLength={MAX_COMMENT_LENGTH}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            {/* Mobile: Full width button below input, min 44px touch target */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!commentContent.trim() || isSubmitting}
              className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-4 py-3 sm:py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label="Enviar comentário"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="sm:hidden">Enviar</span>
                </>
              )}
            </button>
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-[#A8A8A8]">
              {commentContent.length}/{MAX_COMMENT_LENGTH}
            </span>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              mediaType={mediaType}
              mediaId={mediaId}
              comment={comment}
              currentGuestName={currentGuestName}
              onReplyAdded={onCommentAdded}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-[#A8A8A8] text-sm">
          <p>Nenhum comentário ainda.</p>
          <p className="text-xs mt-1">Seja o primeiro a comentar!</p>
        </div>
      )}
    </div>
  );
}
