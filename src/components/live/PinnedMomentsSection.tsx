'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Heart, MessageSquare, Sparkles } from 'lucide-react'
import { getPinnedPostsWithDetails, subscribeToPinnedPosts } from '@/lib/supabase/live'
import type { GuestPost } from '@/types/wedding'
import { formatDistanceToNow } from '@/lib/utils'

export function PinnedMomentsSection() {
  const [pinnedPosts, setPinnedPosts] = useState<GuestPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPinnedPosts()

    // Subscribe to pinned posts changes
    const unsubscribe = subscribeToPinnedPosts(() => {
      loadPinnedPosts()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const loadPinnedPosts = async () => {
    const posts = await getPinnedPostsWithDetails()
    setPinnedPosts(posts)
    setIsLoading(false)
  }

  if (isLoading) {
    return null
  }

  if (pinnedPosts.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-yellow-500 rounded-full blur-lg opacity-50"
          />
        </div>
        <h2 className="text-2xl font-playfair font-bold text-[#2C2C2C]">
          Momentos Especiais
        </h2>
      </div>

      {/* Pinned posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {pinnedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-gradient-to-br from-yellow-50 via-white to-gray-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.5
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ width: '50%' }}
              />

              {/* Pinned badge */}
              <div className="absolute -top-3 -right-3 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                <Star className="w-5 h-5 fill-current" />
              </div>

              {/* Post header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-gray-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {post.guest_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#2C2C2C] text-lg">
                    {post.guest_name}
                  </h4>
                  <p className="text-sm text-[#4A4A4A]">
                    {formatDistanceToNow(new Date(post.created_at))}
                  </p>
                </div>
              </div>

              {/* Post content */}
              <p className="text-[#2C2C2C] whitespace-pre-wrap mb-4 font-crimson italic">
                "{post.content}"
              </p>

              {/* Media preview (if available) */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="mb-4 rounded-xl overflow-hidden shadow-md">
                  {post.media_urls[0].includes('.mp4') || post.media_urls[0].includes('.mov') ? (
                    <video
                      src={post.media_urls[0]}
                      className="w-full aspect-video object-cover"
                      controls
                    />
                  ) : (
                    <div className="relative aspect-video">
                      <Image
                        src={post.media_urls[0]}
                        alt="Momento especial"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Post stats */}
              <div className="flex items-center gap-6 text-sm text-[#4A4A4A] pt-4 border-t border-yellow-200">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{post.comments_count || 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
