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
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader2, CornerDownRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createComment, getCommentReplies } from '@/lib/supabase/messages';
import type { PostComment } from '@/types/wedding';

interface CommentThreadProps {
  postId: string;
  comments: PostComment[];
  currentGuestName?: string;
  showInput?: boolean;
  onCommentAdded?: () => void;
}

interface CommentItemProps {
  comment: PostComment;
  currentGuestName?: string;
  onReplyAdded?: () => void;
  depth?: number;
}

const MAX_COMMENT_LENGTH = 1000;
const MAX_DEPTH = 3; // Maximum nesting level

// Individual Comment Component
function CommentItem({
  comment,
  currentGuestName,
  onReplyAdded,
  depth = 0,
}: CommentItemProps) {
  const [replies, setReplies] = useState<PostComment[]>([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  // Load replies for this comment
  useEffect(() => {
    loadReplies();
  }, [comment.id]);

  const loadReplies = async () => {
    const data = await getCommentReplies(comment.id);
    setReplies(data);
    if (data.length > 0) {
      setShowReplies(true);
    }
  };

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !currentGuestName || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newComment = await createComment({
        post_id: comment.post_id,
        guest_name: currentGuestName,
        content: replyContent.trim(),
        parent_comment_id: comment.id,
      });

      if (newComment) {
        setReplyContent('');
        setShowReplyInput(false);
        await loadReplies();
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
  const hasReplies = replies.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-8' : ''}`}>
      <div className="flex gap-3 mb-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F8F6F3] border border-[#E8E6E3] flex items-center justify-center">
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
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canReply && (
              <button
                type="button"
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors"
              >
                Responder
              </button>
            )}

            {hasReplies && (
              <button
                type="button"
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-xs text-[#4A4A4A] hover:text-[#2C2C2C] transition-colors"
              >
                <CornerDownRight className="w-3 h-3" />
                {showReplies ? 'Ocultar' : 'Ver'} {replies.length} resposta{replies.length !== 1 && 's'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply Input */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-3 ${depth > 0 ? 'ml-11' : 'ml-11'}`}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escreva uma resposta..."
                maxLength={MAX_COMMENT_LENGTH}
                disabled={isSubmitting}
                className="flex-1 px-3 py-2 text-sm border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || isSubmitting}
                className="px-3 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
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
  postId,
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
      const newComment = await createComment({
        post_id: postId,
        guest_name: currentGuestName,
        content: commentContent.trim(),
      });

      if (newComment) {
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
      {/* Comment Input */}
      {showInput && currentGuestName && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Escreva um comentário..."
              maxLength={MAX_COMMENT_LENGTH}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-[#E8E6E3] rounded-md focus:outline-none focus:ring-2 focus:ring-[#A8A8A8] transition-all disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!commentContent.trim() || isSubmitting}
              className="px-4 py-2 bg-[#2C2C2C] text-white rounded-md hover:bg-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
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
