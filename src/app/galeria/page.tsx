import Navigation from '@/components/ui/Navigation'
import GalleryHero from '@/components/gallery/GalleryHero'
import GuestPhotosSection from '@/components/gallery/GuestPhotosSection'
import { SupabaseGalleryService } from '@/lib/supabase/gallery'

export default async function GaleriaPage() {
  type GuestPhotosByPhase = Awaited<ReturnType<typeof SupabaseGalleryService.getApprovedPhotosByPhase>>

  // Fetch approved guest photos
  let guestPhotosByPhase: GuestPhotosByPhase = { before: [], during: [], after: [] }

  try {
    guestPhotosByPhase = await SupabaseGalleryService.getApprovedPhotosByPhase()
  } catch (error) {
    console.error('Error loading guest photos:', error)
    guestPhotosByPhase = { before: [], during: [], after: [] } satisfies GuestPhotosByPhase
  }

  // Calculate total guest photos
  const totalGuestPhotos = guestPhotosByPhase.before.length + guestPhotosByPhase.during.length + guestPhotosByPhase.after.length

  return (
    <main className="min-h-screen pt-12 md:pt-0">
      <Navigation />

      {/* Hero Section with Upload CTA */}
      <GalleryHero />

      {/* Guest Photos Gallery with Reactions & Comments */}
      <GuestPhotosSection guestPhotosByPhase={guestPhotosByPhase} />
    </main>
  )
}
