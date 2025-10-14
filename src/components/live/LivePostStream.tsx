'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUp, Loader2, Sparkles as SparklesIcon, MessageSquare } from 'lucide-react'
import { subscribeToNewPosts, getLivePosts } from '@/lib/supabase/live'
import type { GuestPost } from '@/types/wedding'
import { Confetti, Sparkles } from '@/components/ui/Confetti'
import { isMilestone, getMilestoneMessage } from '@/lib/utils/animations'
import { slideInVariants, tapScaleVariants } from '@/lib/utils/animations'
import { playNewPostSound, playMilestoneSound } from '@/lib/utils/soundManager'
import PostCard from '@/components/messages/PostCard'

export function LivePostStream() {
  const [posts, setPosts] = useState<GuestPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasNewPosts, setHasNewPosts] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestoneData, setMilestoneData] = useState({ count: 0, message: '' })
  const [triggerConfetti, setTriggerConfetti] = useState(false)
  const [newPostId, setNewPostId] = useState<string | null>(null)
  const [guestName, setGuestName] = useState<string>('')
  const streamRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // Load guest session for commenting
  useEffect(() => {
    checkGuestSession()
  }, [])

  const checkGuestSession = async () => {
    try {
      const response = await fetch('/api/auth/verify')
      const data = await response.json()

      if (response.ok && data.success && data.session) {
        const resolvedName = data.session.guest?.name || 'Convidado'
        setGuestName(resolvedName)
      } else {
        // Fallback to session storage for anonymous guests
        const storedName = sessionStorage.getItem('guest_name')
        if (storedName) {
          setGuestName(storedName)
        }
      }
    } catch (error) {
      console.error('Error checking guest session:', error)
      const storedName = sessionStorage.getItem('guest_name')
      if (storedName) {
        setGuestName(storedName)
      }
    }
  }

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

        // Check for milestone
        const newCount = prev.length + 1
        const milestone = isMilestone(newCount)

        if (milestone.milestone) {
          const message = getMilestoneMessage(newCount, 'posts')
          setMilestoneData({ count: newCount, message })
          setShowMilestone(true)

          // Trigger confetti for medium and large milestones
          if (milestone.type === 'medium' || milestone.type === 'large') {
            setTriggerConfetti(true)
            playMilestoneSound()
          } else {
            playNewPostSound()
          }

          // Hide milestone after 4 seconds
          setTimeout(() => {
            setShowMilestone(false)
            setTriggerConfetti(false)
          }, 4000)
        } else {
          // Play subtle sound for regular posts
          playNewPostSound()
        }

        // Show sparkle effect on new post
        setNewPostId(newPost.id)
        setTimeout(() => setNewPostId(null), 1500)

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
    console.log('🔍 [LivePostStream] Loaded posts:', data.length, 'posts')
    console.log('🔍 [LivePostStream] Posts breakdown:', {
      total: data.length,
      photos: data.filter(p => p.id.startsWith('photo-')).length,
      posts: data.filter(p => !p.id.startsWith('photo-')).length,
      types: data.map(p => ({ id: p.id, type: p.post_type }))
    })
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-8 h-8 text-[#A8A8A8]" />
        </motion.div>
        <motion.span
          className="ml-3 text-[#4A4A4A]"
          animate={shouldReduceMotion ? {} : { opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Carregando mensagens...
        </motion.span>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : {
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        </motion.div>
        <p className="text-gray-500 font-crimson italic">
          Nenhuma mensagem ainda. Seja o primeiro a compartilhar este momento especial!
        </p>
        <motion.div
          className="mt-4 text-3xl"
          animate={shouldReduceMotion ? {} : {
            y: [0, -10, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          💕
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="relative">
      {/* Milestone celebration */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[#2C2C2C] to-[#4A4A4A] text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-[#A8A8A8]"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                animate={shouldReduceMotion ? {} : {
                  rotate: [0, -15, 15, -15, 0],
                  scale: [1, 1.3, 1]
                }}
                transition={{ duration: 0.6 }}
              >
                🎉
              </motion.span>
              <span className="font-playfair font-bold text-lg">
                {milestoneData.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti for major milestones */}
      <Confetti
        trigger={triggerConfetti}
        preset="milestoneReached"
        onComplete={() => setTriggerConfetti(false)}
      />

      {/* New posts banner */}
      <AnimatePresence>
        {hasNewPosts && (
          <motion.button
            variants={slideInVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={scrollToTop}
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r from-[#2C2C2C] to-[#4A4A4A] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 border border-[#A8A8A8]"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={tapScaleVariants.tap}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : {
                y: [0, -3, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.div>
            <span className="font-semibold">Novas mensagens disponíveis</span>
            <motion.div
              animate={shouldReduceMotion ? {} : {
                rotate: [0, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <SparklesIcon className="w-4 h-4" />
            </motion.div>
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
              variants={slideInVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ delay: index * 0.03 }}
              className="relative"
            >
              {/* Sparkle effect for new posts */}
              {post.id === newPostId && <Sparkles trigger={true} />}

              {/* Use full-featured PostCard with comments support */}
              <PostCard
                post={post}
                currentGuestName={guestName || undefined}
                showComments={true}
                onCommentAdded={() => {
                  // Refresh post data to get updated comment count
                  loadInitialPosts()
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
