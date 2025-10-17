'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getRecentApprovedPhotos, subscribeToNewPosts } from '@/lib/supabase/live'
import type { RecentPhoto } from '@/lib/supabase/live'
import type { GuestPost } from '@/types/wedding'
import { formatDistanceToNow } from '@/lib/utils'

const DIGIT_PATTERNS: Record<string, number[][]> = {
  '1': [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 0]
  ],
  '0': [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ]
}

const DIGITS = ['1', '0', '0', '0']
const DIGIT_GAP = 2
const MAX_STORED_PHOTOS = 120
const FALLBACK_TILE_COLORS = ['#F8F6F3', '#E8E6E3', '#D1CCC4', '#C2BCB2']

type TilePosition = {
  id: string
  row: number
  col: number
}

type MosaicLayout = {
  tiles: TilePosition[]
  columns: number
  rows: number
}

interface LivingPhotoMosaicHeaderProps {
  connectionStatus: 'live' | 'polling'
  isMuted: boolean
  variant?: 'default' | 'tv'
}

function transformPostToPhoto(post: GuestPost): RecentPhoto | null {
  if (!post.media_urls?.length) return null
  if (post.post_type !== 'image') return null

  return {
    id: post.id,
    photo_url: post.media_urls[0],
    guest_name: post.guest_name,
    phase: 'during',
    created_at: post.created_at
  }
}

export function LivingPhotoMosaicHeader({ connectionStatus, isMuted, variant = 'default' }: LivingPhotoMosaicHeaderProps) {
  const [photos, setPhotos] = useState<RecentPhoto[]>([])
  const [tileAssignments, setTileAssignments] = useState<RecentPhoto[]>([])
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const isTV = variant === 'tv'

  const layout = useMemo<MosaicLayout>(() => {
    const tiles: TilePosition[] = []
    const rows = DIGIT_PATTERNS['1'].length

    let colOffset = 0

    DIGITS.forEach((digit, index) => {
      const pattern = DIGIT_PATTERNS[digit]
      pattern.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell === 1) {
            tiles.push({
              id: `${digit}-${index}-${rowIndex}-${colIndex}`,
              row: rowIndex + 1,
              col: colOffset + colIndex + 1
            })
          }
        })
      })

      const digitWidth = pattern[0]?.length ?? 0
      const hasNextDigit = index < DIGITS.length - 1
      colOffset += digitWidth + (hasNextDigit ? DIGIT_GAP : 0)
    })

    const columns = colOffset

    return { tiles, columns, rows }
  }, [])

  const { tiles, columns, rows } = layout
  const photoCount = photos.length
  const latestGuest = photos[0]?.guest_name ?? 'Convidado'
  const lastUpdateLabel = lastUpdatedAt
    ? formatDistanceToNow(new Date(lastUpdatedAt))
    : 'aguardando fotos'

  // Initial load
  useEffect(() => {
    let active = true

    async function loadInitialPhotos() {
      try {
        const initialPhotos = await getRecentApprovedPhotos(80)
        if (!active) return

        setPhotos(initialPhotos)
        if (initialPhotos.length > 0) {
          setLastUpdatedAt(initialPhotos[0].created_at)
        }
      } catch (error) {
        console.error('[LivingPhotoMosaicHeader] Failed to load photos', error)
      }
    }

    loadInitialPhotos()

    return () => {
      active = false
    }
  }, [])

  // Real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToNewPosts((post) => {
      const nextPhoto = transformPostToPhoto(post)
      if (!nextPhoto) return

      setPhotos((prev) => {
        const exists = prev.some((photo) => photo.id === nextPhoto.id || photo.photo_url === nextPhoto.photo_url)
        if (exists) {
          return prev
        }

        const updated = [nextPhoto, ...prev]
        return updated.slice(0, MAX_STORED_PHOTOS)
      })

      setLastUpdatedAt(nextPhoto.created_at)

      setTileAssignments((prev) => {
        if (!prev.length) return prev
        const next = [...prev]
        const randomIndex = Math.floor(Math.random() * next.length)
        next[randomIndex] = nextPhoto
        return next
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Ensure the mosaic stays filled when new photos arrive
  useEffect(() => {
    if (!photoCount || !tiles.length) return

    setTileAssignments((prev) => {
      if (prev.length === tiles.length) return prev
      return tiles.map((_, index) => photos[index % photoCount])
    })
  }, [photoCount, photos, tiles])

  // Soft shuffle to keep mosaic feeling alive
  useEffect(() => {
    if (shouldReduceMotion) return
    if (!photoCount || !tiles.length) return

    const interval = window.setInterval(() => {
      setTileAssignments((prev) => {
        if (!prev.length) return prev
        const next = [...prev]
        const randomTile = Math.floor(Math.random() * next.length)
        const randomPhoto = photos[Math.floor(Math.random() * photoCount)]
        if (randomPhoto) {
          next[randomTile] = randomPhoto
        }
        return next
      })
    }, 6000)

    return () => window.clearInterval(interval)
  }, [photoCount, photos, shouldReduceMotion, tiles])

  const tileData = tiles.map((tile, index) => ({
    ...tile,
    photo: tileAssignments[index] ?? (photoCount ? photos[index % photoCount] : null)
  }))

  const headerStyle = isTV
    ? { minHeight: '260px', maxHeight: '45vh' }
    : { minHeight: '190px' }

  const containerClass = isTV
    ? 'relative max-w-7xl mx-auto px-6 py-6 lg:px-10 lg:py-8'
    : 'relative max-w-7xl mx-auto px-5 py-4 lg:px-8 lg:py-5'

  const mosaicWrapperClass = isTV
    ? 'flex-1 w-full md:max-w-[660px] lg:max-w-[760px]'
    : 'flex-1 w-full md:max-w-[460px] lg:max-w-[540px]'

  const gridClass = `grid ${isTV ? 'gap-1.5' : 'gap-1'} rounded-2xl bg-[#15120F]/60 p-3 shadow-inner`

  const statusRowClass = `flex items-center gap-3 ${
    isTV ? 'text-sm uppercase tracking-[0.25em]' : 'text-sm uppercase tracking-[0.2em]'
  } text-white/70`

  const heroHeadingClass = `font-playfair ${
    isTV ? 'text-3xl lg:text-[2.75rem]' : 'text-2xl'
  } font-semibold leading-snug`

  const heroBodyClass = `font-crimson ${isTV ? 'text-lg' : 'text-base'} text-white/80`

  const sidebarWidthClass = isTV ? 'w-full md:w-80 lg:w-96' : 'w-full md:w-72 lg:w-80'

  return (
    <div
      className="relative overflow-hidden bg-[#1C1A17] text-[#F8F6F3] border-b border-[#2E2B27]"
      style={headerStyle}
    >
      <div className="absolute inset-0 opacity-80"
        style={{
          background: 'radial-gradient(circle at top left, rgba(248,246,243,0.18), transparent 55%)'
        }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className={containerClass}>
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center">
          <div className={mosaicWrapperClass}>
            <div
              className={gridClass}
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
              }}
            >
              {tileData.map((tile, index) => (
                <motion.div
                  key={tile.id}
                  style={{ gridColumn: tile.col, gridRow: tile.row }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.01 }}
                  className="relative overflow-hidden rounded-sm"
                >
                  {tile.photo ? (
                    <motion.img
                      key={tile.photo.id}
                      src={tile.photo.photo_url}
                      alt={tile.photo.guest_name ? `Foto de ${tile.photo.guest_name}` : 'Foto enviada por convidado'}
                      className="h-full w-full object-cover"
                      initial={{ opacity: 0.6, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{ backgroundColor: FALLBACK_TILE_COLORS[index % FALLBACK_TILE_COLORS.length] }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/12" />
                </motion.div>
              ))}
            </div>
          </div>
          <div className={sidebarWidthClass}>
            <div className={statusRowClass}>
              <motion.span
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.span
                  className={`h-2 w-2 rounded-full ${connectionStatus === 'live' ? 'bg-[#FDAF6A]' : 'bg-[#9E9A93]'}`}
                  animate={!shouldReduceMotion && connectionStatus === 'live' ? {
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.6, 1]
                  } : {}}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                {connectionStatus === 'live' ? 'Ao vivo' : 'Atualizando'}
              </motion.span>
              <span className="text-white/30">•</span>
              <span>{photoCount} fotos aprovadas</span>
            </div>
            <div className={`mt-4 flex items-center gap-3 text-white ${isTV ? 'lg:mt-5' : ''}`}>
              <div className="rounded-full bg-white/10 p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className={heroHeadingClass}>1000 dias, um mosaico vivo</h2>
                <p className={heroBodyClass}>Cada foto aprovada se junta ao numero magico desta noite.</p>
              </div>
            </div>
            <div className={`mt-4 rounded-2xl border border-white/10 bg-white/5 ${isTV ? 'p-5' : 'p-4'}`}>
              <p className={`${isTV ? 'text-base' : 'text-sm'} text-white/80`}>
                Ultima foto: <span className="font-semibold text-white">{lastUpdateLabel}</span>
              </p>
              <p className={`mt-1 ${isTV ? 'text-base' : 'text-sm'} text-white/60`}>
                Mais recente de: <span className="text-white">{latestGuest}</span>
              </p>
              {isMuted && (
                <p className={`mt-3 ${isTV ? 'text-sm' : 'text-xs'} font-crimson italic text-white/60`}>
                  💡 Ative o som no controle abaixo do feed para ouvir cada celebracao.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
