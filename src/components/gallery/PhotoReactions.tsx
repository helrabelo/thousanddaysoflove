'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  addPhotoReaction,
  removePhotoReaction,
  getPhotoReactionCounts,
  getUserPhotoReaction,
  type ReactionType,
} from '@/lib/supabase/photo-interactions'

interface PhotoReactionsProps {
  photoId: string
  guestSessionId: string | null
  guestName: string
  initialCount?: number
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  heart: '❤️',
  clap: '👏',
  laugh: '😂',
  celebrate: '🎉',
  love: '💕',
}

const REACTION_LABELS: Record<ReactionType, string> = {
  heart: 'Adorei',
  clap: 'Parabéns',
  laugh: 'Engraçado',
  celebrate: 'Celebrar',
  love: 'Amor',
}

export default function PhotoReactions({
  photoId,
  guestSessionId,
  guestName,
  initialCount = 0,
}: PhotoReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null)
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionType, number>>({
    heart: 0,
    clap: 0,
    laugh: 0,
    celebrate: 0,
    love: 0,
  })
  const [totalCount, setTotalCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)

  // Load user's reaction and counts on mount
  const loadReactions = useCallback(async () => {
    if (!guestSessionId) return

    try {
      // Get user's reaction
      const reaction = await getUserPhotoReaction(photoId, guestSessionId)
      setUserReaction(reaction)

      // Get reaction counts
      const counts = await getPhotoReactionCounts(photoId)
      setReactionCounts(counts)

      // Calculate total
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0)
      setTotalCount(total)
    } catch (error) {
      console.error('Error loading reactions:', error)
    }
  }, [guestSessionId, photoId])

  useEffect(() => {
    loadReactions()
  }, [loadReactions])

  const handleReaction = async (reactionType: ReactionType) => {
    if (!guestSessionId) {
      alert('Por favor, faça login para reagir às fotos')
      return
    }

    setIsLoading(true)

    try {
      if (userReaction === reactionType) {
        // Remove reaction if clicking the same one
        const result = await removePhotoReaction(photoId, guestSessionId)

        if (result.success) {
          setUserReaction(null)
          setReactionCounts((prev) => ({
            ...prev,
            [reactionType]: Math.max(0, prev[reactionType] - 1),
          }))
          setTotalCount((prev) => Math.max(0, prev - 1))
        }
      } else {
        // Add or change reaction
        const result = await addPhotoReaction(
          photoId,
          reactionType,
          guestSessionId,
          guestName
        )

        if (result.success) {
          // Update counts
          setReactionCounts((prev) => {
            const newCounts = { ...prev }

            // Remove old reaction count
            if (userReaction) {
              newCounts[userReaction] = Math.max(0, newCounts[userReaction] - 1)
            } else {
              // New reaction, increment total
              setTotalCount((t) => t + 1)
            }

            // Add new reaction count
            newCounts[reactionType] = newCounts[reactionType] + 1

            return newCounts
          })

          setUserReaction(reactionType)
        }
      }

      setShowPicker(false)
    } catch (error) {
      console.error('Error handling reaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Reaction Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#F8F6F3] disabled:opacity-50"
        style={{
          fontFamily: 'var(--font-crimson)',
          color: userReaction ? '#4A7C59' : 'var(--secondary-text)',
        }}
      >
        <span className="text-lg">
          {userReaction ? REACTION_EMOJIS[userReaction] : '❤️'}
        </span>
        <span className="text-sm font-medium">
          {totalCount > 0 ? totalCount : 'Curtir'}
        </span>
      </button>

      {/* Reaction Picker Popup */}
      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPicker(false)}
            />

            {/* Picker */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl p-3 z-50 border border-[#E8E6E3]"
            >
              <div className="flex items-center gap-2">
                {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleReaction(type)}
                    disabled={isLoading}
                    className="group relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 hover:bg-[#F8F6F3] disabled:opacity-50"
                    style={{
                      background: userReaction === type ? '#F8F6F3' : 'transparent',
                    }}
                  >
                    <motion.span
                      className="text-2xl"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {REACTION_EMOJIS[type]}
                    </motion.span>

                    {/* Count Badge */}
                    {reactionCounts[type] > 0 && (
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                        style={{
                          fontFamily: 'var(--font-crimson)',
                          background: 'var(--accent)',
                          color: 'var(--secondary-text)',
                        }}
                      >
                        {reactionCounts[type]}
                      </span>
                    )}

                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#2C2C2C] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      {REACTION_LABELS[type]}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
