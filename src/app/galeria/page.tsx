import Navigation from '@/components/ui/Navigation'
import GalleryHero from '@/components/gallery/GalleryHero'
import GalleryClient from '@/components/gallery/GalleryClient'
import GuestPhotosSection from '@/components/gallery/GuestPhotosSection'
import type { MediaItem } from '@/types/wedding'
import { SanityGalleryService } from '@/sanity/queries/gallery'
import { SupabaseGalleryService } from '@/lib/supabase/gallery'

export default async function GaleriaPage() {
  type GuestPhotosByPhase = Awaited<ReturnType<typeof SupabaseGalleryService.getApprovedPhotosByPhase>>

  // Fetch gallery data server-side (Sanity only for main gallery)
  let sanityMediaItems: MediaItem[] = []
  let guestPhotosByPhase: GuestPhotosByPhase = { before: [], during: [], after: [] }

  try {
    // Fetch Sanity CMS gallery photos
    sanityMediaItems = await SanityGalleryService.getMediaItems()
  } catch (error) {
    console.error('Error loading Sanity gallery data:', error)
    sanityMediaItems = []
  }

  try {
    // Fetch approved guest photos for dedicated section only
    guestPhotosByPhase = await SupabaseGalleryService.getApprovedPhotosByPhase()
  } catch (error) {
    console.error('Error loading guest photos:', error)
    guestPhotosByPhase = { before: [], during: [], after: [] } satisfies GuestPhotosByPhase
  }

  // Calculate total guest photos for conditional rendering
  const totalGuestPhotos = guestPhotosByPhase.before.length + guestPhotosByPhase.during.length + guestPhotosByPhase.after.length

  return (
    <main className="min-h-screen pt-12 md:pt-0">
      <Navigation />

      {/* Hero Section with Animations */}
      <GalleryHero />

      {/* Main Gallery (Sanity CMS Only - Photos & Videos merged inside) */}
      <GalleryClient mediaItems={sanityMediaItems} guestPhotosByPhase={guestPhotosByPhase} />
    </main>
  )
}
