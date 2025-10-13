'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageSquare, Image, Video, ArrowUp, Loader2 } from 'lucide-react'
import { subscribeToNewPosts, getLivePosts } from '@/lib/supabase/live'
import type { GuestPost } from '@/types/wedding'
import { formatDistanceToNow } from '@/lib/utils'

export function LivePostStream() {
  const [posts, setPosts] = useState<GuestPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasNewPosts, setHasNewPosts] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)
  const streamRef = useRef<HTMLDivElement>(null)

  // Load initial posts
  useEffect(() => {
    loadInitialPosts()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToNewPosts((newPost) => {
      setPosts((prev) => {
        // Check if post already exists
        if (prev.some((p) => p.id === newPost.id)) {
          return prev
        }

        // If user is not at top, show "new posts available" banner
        if (!isAtTop) {
          setHasNewPosts(true)
          return prev
        }

        // Add new post at the beginning
        return [newPost, ...prev]
      })
    })

    return () => {
      unsubscribe()
    }
  }, [isAtTop])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (streamRef.current) {
        const scrollTop = streamRef.current.scrollTop
        setIsAtTop(scrollTop < 100)
      }
    }

    const container = streamRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const loadInitialPosts = async () => {
    setIsLoading(true)
    const data = await getLivePosts(50)
    setPosts(data)
    setIsLoading(false)
  }

  const scrollToTop = () => {
    streamRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    setHasNewPosts(false)
    loadInitialPosts()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#A8A8A8]" />
        <span className="ml-3 text-[#4A4A4A]">Carregando mensagens...</span>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Nenhuma mensagem ainda. Seja o primeiro a compartilhar!</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* New posts banner */}
      <AnimatePresence>
        {hasNewPosts && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={scrollToTop}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <ArrowUp className="w-4 h-4" />
            Novas mensagens disponíveis
          </motion.button>
        )}
      </AnimatePresence>

      {/* Posts stream */}
      <div
        ref={streamRef}
        className="space-y-4 max-h-[800px] overflow-y-auto pr-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#E8E6E3 transparent'
        }}
      >
        <AnimatePresence mode="popLayout">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#E8E6E3] hover:shadow-md transition-shadow"
            >
              {/* Post header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {post.guest_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2C2C2C]">{post.guest_name}</h4>
                    <p className="text-sm text-[#4A4A4A]">
                      {formatDistanceToNow(new Date(post.created_at))}
                    </p>
                  </div>
                </div>

                {/* Post type badge */}
                {post.post_type !== 'text' && (
                  <div className="flex items-center gap-1 text-xs text-[#4A4A4A] bg-[#F8F6F3] px-2 py-1 rounded-full">
                    {post.post_type === 'image' && <Image className="w-3 h-3" />}
                    {post.post_type === 'video' && <Video className="w-3 h-3" />}
                    {post.post_type === 'mixed' && (
                      <>
                        <Image className="w-3 h-3" />
                        <Video className="w-3 h-3" />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Post content */}
              <p className="text-[#2C2C2C] whitespace-pre-wrap mb-4">{post.content}</p>

              {/* Media preview */}
              {post.media_urls && post.media_urls.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {post.media_urls.slice(0, 4).map((url, idx) => {
                    const isVideo = url.includes('.mp4') || url.includes('.mov')
                    return (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        {isVideo ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Mídia ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )
                  })}
                  {post.media_urls.length > 4 && (
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      +{post.media_urls.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Post stats */}
              <div className="flex items-center gap-6 text-sm text-[#4A4A4A]">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{post.likes_count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.comments_count || 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
