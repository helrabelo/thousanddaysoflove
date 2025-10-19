'use client'

import { useState } from 'react'
import MasonryGallery from '@/components/gallery/MasonryGallery'
import MediaLightbox from '@/components/gallery/MediaLightbox'
import GuestPhotosSection from '@/components/gallery/GuestPhotosSection'
import { MediaItem } from '@/types/wedding'

interface GalleryClientProps {
  mediaItems: MediaItem[]
  guestPhotosByPhase: {
    before: MediaItem[]
    during: MediaItem[]
    after: MediaItem[]
  }
}

export default function GalleryClient({ mediaItems, guestPhotosByPhase }: GalleryClientProps) {
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    currentIndex: 0,
    items: [] as MediaItem[]
  })

  const openLightbox = (item: MediaItem, items: MediaItem[] = mediaItems) => {
    const index = items.findIndex(i => i.id === item.id)
    setLightboxState({
      isOpen: true,
      currentIndex: index >= 0 ? index : 0,
      items
    })
  }

  const closeLightbox = () => {
    setLightboxState(prev => ({ ...prev, isOpen: false }))
  }

  const changeLightboxIndex = (index: number) => {
    setLightboxState(prev => ({ ...prev, currentIndex: index }))
  }

  // Calculate total guest photos for conditional rendering
  const totalGuestPhotos =
    guestPhotosByPhase.before.length +
    guestPhotosByPhase.during.length +
    guestPhotosByPhase.after.length

  // Shuffle function for random order
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Randomize gallery order (consistent per page load)
  const [randomizedMedia] = useState(() => shuffleArray(mediaItems))

  return (
    <>
      {/* Guest Photos Section - FIRST! */}
      {totalGuestPhotos > 0 && (
        <GuestPhotosSection photosByPhase={guestPhotosByPhase} />
      )}

      {/* Unified Media Gallery (Photos & Videos) - Random order, no filters */}
      <MasonryGallery
        items={randomizedMedia}
        showFilters={false}
        onItemClick={(item, index) => {
          openLightbox(item, randomizedMedia)
        }}
      />

      {/* Lightbox */}
      <MediaLightbox
        isOpen={lightboxState.isOpen}
        items={lightboxState.items}
        currentIndex={lightboxState.currentIndex}
        autoPlay={false}
        showThumbnails={true}
        onClose={closeLightbox}
        onChange={changeLightboxIndex}
        onLike={(item) => {
          // Like action (future: save to database)
        }}
        onShare={(item) => {
          if (navigator.share) {
            navigator.share({
              title: item.title,
              text: item.description || 'Confira esta memória especial do nosso amor!',
              url: window.location.href
            })
          }
        }}
        onDownload={(item) => {
          const link = document.createElement('a')
          link.href = item.url
          link.download = `${item.title}.${item.media_type === 'video' ? 'mp4' : 'jpg'}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}
      />
    </>
  )
}
