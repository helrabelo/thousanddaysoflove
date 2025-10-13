import Navigation from '@/components/ui/Navigation'
import GalleryHero from '@/components/gallery/GalleryHero'
import GalleryClient from '@/components/gallery/GalleryClient'
import GuestPhotosSection from '@/components/gallery/GuestPhotosSection'
import { SanityGalleryService } from '@/sanity/queries/gallery'
import { SupabaseGalleryService } from '@/lib/supabase/gallery'

export default async function GaleriaPage() {
  // Fetch gallery data server-side (both Sanity and guest photos)
  let sanityMediaItems
  let guestPhotos
  let guestPhotosByPhase

  try {
    // Fetch Sanity CMS gallery photos
    sanityMediaItems = await SanityGalleryService.getMediaItems()
  } catch (error) {
    console.error('Error loading Sanity gallery data:', error)
    sanityMediaItems = []
  }

  try {
    // Fetch approved guest photos
    guestPhotos = await SupabaseGalleryService.getApprovedGuestPhotos()
    guestPhotosByPhase = await SupabaseGalleryService.getApprovedPhotosByPhase()
  } catch (error) {
    console.error('Error loading guest photos:', error)
    guestPhotos = []
    guestPhotosByPhase = { before: [], during: [], after: [] }
  }

  // Merge all photos for main gallery (Sanity photos first, then guest photos)
  const allMediaItems = [...sanityMediaItems, ...guestPhotos]

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section with Animations */}
      <GalleryHero />

      {/* Main Gallery (Sanity CMS Photos + All Approved Guest Photos) */}
      <GalleryClient mediaItems={allMediaItems} />

      {/* Guest Photos Section (with Phase Tabs) */}
      {guestPhotos.length > 0 && (
        <GuestPhotosSection photosByPhase={guestPhotosByPhase} />
      )}
    </main>
  )
}
