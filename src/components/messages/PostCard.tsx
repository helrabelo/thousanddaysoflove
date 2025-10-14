'use client';

/**
 * Post Card Component
 *
 * Display individual guest posts with reactions and comments
 *
 * Features:
 * - Display post content with media gallery
 * - Reaction system (heart, clap, laugh, celebrate, love)
 * - Comment thread with nested replies
 * - Guest attribution with avatar
 * - Timestamp with relative time
 * - Elegant wedding aesthetic
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Laugh,
  Sparkles,
  PartyPopper,
  User,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  addReaction,
  removeReaction,
  getGuestReaction,
  getPostReactions,
  getPostComments,
} from '@/lib/supabase/messages/client';
import type { GuestPost, PostReaction, PostComment } from '@/types/wedding';
import CommentThread from './CommentThread';

interface PostCardProps {
  post: GuestPost;
  currentGuestName?: string;
  showComments?: boolean;
  onCommentAdded?: () => void;
}

// Reaction icons mapping
const REACTION_ICONS = {
  heart: Heart,
  clap: Sparkles,
  laugh: Laugh,
  celebrate: PartyPopper,
  love: Heart,
};

const REACTION_LABELS = {
  heart: 'Coração',
  clap: 'Aplauso',
  laugh: 'Risada',
  celebrate: 'Celebração',
  love: 'Amor',
};

const REACTION_EMOJIS = {
  heart: '❤️',
  clap: '👏',
  laugh: '😂',
  celebrate: '🎉',
  love: '💕',
};

export default function PostCard({
  post,
  currentGuestName,
  showComments = true,
}: PostCardProps) {
  const [reactions, setReactions] = useState<PostReaction[]>([]);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [userReaction, setUserReaction] = useState<PostReaction | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  // Check if this is a guest photo (not a regular post)
  // Guest photos have IDs like "photo-{uuid}" and don't support reactions/comments
  const isGuestPhoto = post.id.startsWith('photo-');

  // Load reactions and comments (skip for guest photos)
  useEffect(() => {
    if (!isGuestPhoto) {
      loadReactions();
      if (showComments) {
        loadComments();
      }
    }
  }, [post.id, isGuestPhoto]);

  // Load user's reaction (skip for guest photos)
  useEffect(() => {
    if (!isGuestPhoto && currentGuestName) {
      loadUserReaction();
    }
  }, [post.id, currentGuestName, isGuestPhoto]);

  const loadReactions = async () => {
    const data = await getPostReactions(post.id);
    setReactions(data);
  };

  const loadComments = async () => {
    const data = await getPostComments(post.id);
    setComments(data);
  };

  const loadUserReaction = async () => {
    if (!currentGuestName) return;
    const reaction = await getGuestReaction(post.id, currentGuestName);
    setUserReaction(reaction);
  };

  // Handle reaction toggle
  const handleReaction = async (
    reactionType: 'heart' | 'clap' | 'laugh' | 'celebrate' | 'love'
  ) => {
    if (!currentGuestName || isReacting) return;

    setIsReacting(true);

    try {
      // If user already reacted with this type, remove it
      if (userReaction?.reaction_type === reactionType) {
        const success = await removeReaction(post.id, currentGuestName);
        if (success) {
          setUserReaction(null);
          await loadReactions();
        }
      }
      // If user reacted with different type, remove old and add new
      else if (userReaction) {
        await removeReaction(post.id, currentGuestName);
        const newReaction = await addReaction({
          post_id: post.id,
          guest_name: currentGuestName,
          reaction_type: reactionType,
        });
        if (newReaction) {
          setUserReaction(newReaction);
          await loadReactions();
        }
      }
      // User hasn't reacted, add new reaction
      else {
        const newReaction = await addReaction({
          post_id: post.id,
          guest_name: currentGuestName,
          reaction_type: reactionType,
        });
        if (newReaction) {
          setUserReaction(newReaction);
          await loadReactions();
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setIsReacting(false);
    }
  };

  // Get reaction counts by type
  const reactionCounts = reactions.reduce(
    (acc, reaction) => {
      acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Format timestamp
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-[#E8E6E3] p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full  border border-[#E8E6E3] flex items-center justify-center">
          <User className="w-5 h-5 text-[#A8A8A8]" />
        </div>

        {/* Guest Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#2C2C2C] truncate">
            {post.guest_name}
          </h3>
          <p className="text-sm text-[#A8A8A8]" title={new Date(post.created_at).toLocaleString('pt-BR')}>
            {timeAgo}
          </p>
        </div>

        {/* Post Type Badge */}
        <div className="flex-shrink-0">
          {post.post_type !== 'text' && (
            <span className="inline-flex items-center gap-1 px-2 py-1  border border-[#E8E6E3] rounded-full text-xs text-[#4A4A4A]">
              {post.post_type === 'image' && '📸'}
              {post.post_type === 'video' && '🎥'}
              {post.post_type === 'mixed' && '🎬'}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-[#2C2C2C] whitespace-pre-wrap break-words leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Media Gallery */}
      {post.media_urls && post.media_urls.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {post.media_urls.map((url, index) => {
            const isVideo = url.includes('.mp4') || url.includes('.mov'); // Simple detection

            return (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative aspect-square rounded-md overflow-hidden  border border-[#E8E6E3]"
              >
                {isVideo ? (
                  <video
                    src={url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={url}
                    alt="Post media"
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Engagement Stats - Hide for guest photos */}
      {!isGuestPhoto && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#E8E6E3]">
          {/* Reaction Summary */}
          {post.likes_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-[#4A4A4A]">
              <div className="flex -space-x-1">
                {Object.entries(reactionCounts)
                  .slice(0, 3)
                  .map(([type]) => (
                    <span
                      key={type}
                      className="inline-block text-base"
                      title={REACTION_LABELS[type as keyof typeof REACTION_LABELS]}
                    >
                      {REACTION_EMOJIS[type as keyof typeof REACTION_EMOJIS]}
                    </span>
                  ))}
              </div>
              <span>{post.likes_count}</span>
            </div>
          )}

          {/* Comment Count */}
          {post.comments_count > 0 && (
            <div className="flex items-center gap-1 text-sm text-[#4A4A4A]">
              <MessageCircle className="w-4 h-4" />
              <span>
                {post.comments_count} comentário{post.comments_count !== 1 && 's'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Actions - Hide for guest photos */}
      {!isGuestPhoto && (
        <div className="flex items-center gap-2 mb-4">
          {/* Reaction Buttons */}
          {(['heart', 'clap', 'laugh', 'celebrate'] as const).map((type) => {
            const Icon = REACTION_ICONS[type];
            const count = reactionCounts[type] || 0;
            const isActive = userReaction?.reaction_type === type;

            return (
              <motion.button
                key={type}
                type="button"
                onClick={() => handleReaction(type)}
                disabled={!currentGuestName || isReacting}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1 px-3 py-2 rounded-full border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                    : 'bg-white text-[#4A4A4A] border-[#E8E6E3] hover:'
                }`}
                title={REACTION_LABELS[type]}
              >
                <span className="text-base">{REACTION_EMOJIS[type]}</span>
                {count > 0 && <span className="text-xs">{count}</span>}
              </motion.button>
            );
          })}

          {/* Comment Button */}
          {currentGuestName && showComments && (
            <button
              type="button"
              onClick={() => setShowCommentInput(!showCommentInput)}
              className="flex items-center gap-1 px-3 py-2 rounded-full border border-[#E8E6E3] bg-white text-[#4A4A4A] hover: transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Comentar</span>
            </button>
          )}
        </div>
      )}

      {/* Comments Section - Hide for guest photos */}
      {!isGuestPhoto && showComments && (
        <AnimatePresence>
          {(showCommentInput || comments.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-[#E8E6E3]"
            >
              <CommentThread
                postId={post.id}
                comments={comments}
                currentGuestName={currentGuestName}
                showInput={showCommentInput}
                onCommentAdded={() => {
                  loadComments();
                  setShowCommentInput(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.article>
  );
}
