'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  addMediaReaction,
  removeMediaReaction,
  getMediaReactions,
  getUserReaction,
} from '@/lib/supabase/media-interactions'
import type { MediaReactionType } from '@/types/media-interactions'

const REACTION_EMOJIS: Record<MediaReactionType, string> = {
  heart: '❤️',
  clap: '👏',
  laugh: '😂',
  celebrate: '🎉',
  love: '💕',
}

const REACTION_LABELS: Record<MediaReactionType, string> = {
  heart: 'Adorei',
  clap: 'Parabéns',
  laugh: 'Engraçado',
  celebrate: 'Celebrar',
  love: 'Amor',
}

interface PhotoReactionsProps {
  photoId: string
  guestSessionId: string | null
  guestName: string
}

export default function PhotoReactions({ photoId, guestSessionId, guestName }: PhotoReactionsProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [userReaction, setUserReaction] = useState<MediaReactionType | null>(null)
  const [reactionCounts, setReactionCounts] = useState<Record<MediaReactionType, number>>({
    heart: 0,
    clap: 0,
    laugh: 0,
    celebrate: 0,
    love: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const totalReactions = useMemo(
    () => Object.values(reactionCounts).reduce((sum, count) => sum + count, 0),
    [reactionCounts]
  )

  // Load user's reaction and counts on mount
  const loadReactions = useCallback(async () => {
    try {
      if (guestSessionId || guestName) {
        const reaction = await getUserReaction(
          'guest_photo',
          photoId,
          {
            guestSessionId,
            guestName,
          }
        )
        setUserReaction(reaction?.reaction_type ?? null)
      } else {
        setUserReaction(null)
      }

      const reactions = await getMediaReactions('guest_photo', photoId)
      const counts: Record<MediaReactionType, number> = {
        heart: 0,
        clap: 0,
        laugh: 0,
        celebrate: 0,
        love: 0,
      }

      reactions.forEach((reaction) => {
        counts[reaction.reaction_type] = (counts[reaction.reaction_type] || 0) + 1
      })

      setReactionCounts(counts)
    } catch (error) {
      console.error('Error loading reactions:', error)
    }
  }, [guestSessionId, guestName, photoId])

  useEffect(() => {
    loadReactions()
  }, [loadReactions])

  useEffect(() => {
    if (!showPicker) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPicker(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPicker])

  const handleReaction = async (reactionType: MediaReactionType) => {
    if (!guestSessionId && !guestName) {
      alert('Por favor, faça login para reagir às fotos')
      return
    }

    setIsLoading(true)
    const previousReaction = userReaction

    try {
      if (previousReaction === reactionType) {
        // Remove reaction if clicking the same one
        const result = await removeMediaReaction(
          'guest_photo',
          photoId,
          {
            guestSessionId,
            guestName,
          }
        )

        if (result.success) {
          setUserReaction(null)
          setReactionCounts((prev) => ({
            ...prev,
            [reactionType]: Math.max(0, prev[reactionType] - 1),
          }))
          setShowPicker(false)
        }
      } else {
        // Add or change reaction
        const result = await addMediaReaction(
          'guest_photo',
          photoId,
          reactionType,
          {
            guestSessionId,
            guestName,
          }
        )

        if (result.success) {
          // Update counts
          setReactionCounts((prev) => {
            const newCounts = { ...prev }

            // Remove old reaction count
            if (previousReaction) {
              newCounts[previousReaction] = Math.max(0, newCounts[previousReaction] - 1)
            }

            // Add new reaction count
            newCounts[reactionType] = newCounts[reactionType] + 1

            return newCounts
          })

          setUserReaction(reactionType)
          setShowPicker(false)
        }
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker((prev) => !prev)}
        disabled={isLoading}
        aria-haspopup="dialog"
        aria-expanded={showPicker}
        className={`flex items-center gap-2 rounded-full border px-3 py-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#4A7C59]/30 focus-visible:outline-none ${
          userReaction
            ? 'border-[#4A7C59]/30 bg-[#F8F6F3] text-[#2C2C2C] shadow-sm'
            : 'border-[#E8E6E3] bg-white/90 text-[#4A4A4A] shadow-[0_4px_16px_rgba(26,26,26,0.05)] hover:shadow-md'
        }`}
        style={{ fontFamily: 'var(--font-crimson)' }}
      >
        <span className="text-lg leading-none">
          {userReaction ? REACTION_EMOJIS[userReaction] : '❤️'}
        </span>
        <span className="text-sm font-medium">
          {userReaction ? 'Sua reação' : 'Reagir'}
        </span>
        {totalReactions > 0 && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#4A7C59]/10 text-[#336146]">
            {totalReactions}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showPicker && (
          <>
            <div
              className="fixed inset-0 z-[45]"
              onClick={() => setShowPicker(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full left-0 z-[60] mb-3 rounded-2xl border border-[#E8E6E3] bg-white/95 shadow-[0_20px_45px_rgba(12,12,12,0.12)] backdrop-blur-sm px-4 py-3"
            >
              <div className="flex items-end gap-2">
                {(Object.keys(REACTION_EMOJIS) as MediaReactionType[]).map((type) => {
                  const count = reactionCounts[type]
                  const isActive = userReaction === type

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleReaction(type)}
                      disabled={isLoading}
                      className={`group relative flex h-16 w-14 flex-col items-center justify-center gap-1 rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]/30 ${
                        isActive
                          ? 'border-transparent bg-[#F8F6F3]'
                          : 'border-transparent bg-transparent hover:bg-[#F8F6F3]'
                      } disabled:opacity-50`}
                      aria-label={REACTION_LABELS[type]}
                    >
                      <motion.span
                        className="text-2xl"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {REACTION_EMOJIS[type]}
                      </motion.span>

                      {count > 0 && (
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                          style={{
                            background: 'var(--accent)',
                            color: 'var(--secondary-text)',
                          }}
                        >
                          {count}
                        </span>
                      )}

                      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-[#2C2C2C] px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {REACTION_LABELS[type]}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
