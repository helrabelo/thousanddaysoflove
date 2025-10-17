'use client'

import Image from 'next/image'
import { clsx } from 'clsx'
import { Film, Play } from 'lucide-react'
import type { TimelineEventPhoto } from '@/types/wedding'

interface EventPhotoGalleryProps {
  photos: TimelineEventPhoto[]
  variant?: 'mobile' | 'tv'
  onViewAll?: () => void
}

const MAX_TV_PHOTOS = 6
const MAX_MOBILE_PHOTOS = 4

export function EventPhotoGallery({
  photos,
  variant = 'mobile',
  onViewAll,
}: EventPhotoGalleryProps) {
  if (!photos || photos.length === 0) {
    return null
  }

  const maxPhotos = variant === 'tv' ? MAX_TV_PHOTOS : MAX_MOBILE_PHOTOS
  const displayPhotos = photos.slice(0, maxPhotos)
  const remainingCount = Math.max(photos.length - displayPhotos.length, 0)

  return (
    <section
      className={clsx(
        'rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md text-white',
        variant === 'tv' ? 'p-5' : 'p-4'
      )}
    >
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50">
          <Film className="h-4 w-4" aria-hidden />
          Fotos do momento
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:text-white"
          >
            ver tudo
          </button>
        )}
      </header>

      {variant === 'tv' ? (
        <div className="grid grid-cols-3 gap-3">
          {displayPhotos.map((photo, index) => (
            <GalleryTile
              key={photo.id}
              photo={photo}
              isFirst={index === 0}
              showMoreOverlay={index === displayPhotos.length - 1 && remainingCount > 0}
              remainingCount={remainingCount}
              variant={variant}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {displayPhotos.map((photo, index) => (
            <GalleryTile
              key={photo.id}
              photo={photo}
              isFirst={index === 0}
              showMoreOverlay={index === displayPhotos.length - 1 && remainingCount > 0}
              remainingCount={remainingCount}
              variant={variant}
            />
          ))}
        </div>
      )}
    </section>
  )
}

interface GalleryTileProps {
  photo: TimelineEventPhoto
  showMoreOverlay: boolean
  remainingCount: number
  variant: 'mobile' | 'tv'
  isFirst: boolean
}

function GalleryTile({ photo, showMoreOverlay, remainingCount, variant, isFirst }: GalleryTileProps) {
  const baseClassName = clsx(
    'group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/5',
    variant === 'tv' ? 'aspect-[4/3]' : 'min-w-[96px] max-w-[120px] aspect-square'
  )

  return (
    <div className={baseClassName}>
      <Image
        src={photo.publicUrl}
        alt={`Foto de ${photo.guestName}`}
        fill
        sizes={variant === 'tv' ? '200px' : '120px'}
        className="object-cover transition duration-500 group-hover:scale-105"
        priority={variant === 'tv' && isFirst}
      />

      {photo.isVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play className="h-8 w-8 text-white drop-shadow-lg" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 text-[11px] uppercase tracking-[0.2em] text-white/80">
        <span className="truncate">{photo.guestName}</span>
      </div>

      {showMoreOverlay && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-center text-white">
          <span className="text-xl font-semibold">+{remainingCount}</span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/60">fotos</span>
        </div>
      )}
    </div>
  )
}

export default EventPhotoGallery
