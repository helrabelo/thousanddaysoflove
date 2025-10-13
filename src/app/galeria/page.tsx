import Navigation from '@/components/ui/Navigation'
import GalleryHero from '@/components/gallery/GalleryHero'
import GalleryClient from '@/components/gallery/GalleryClient'
import { SanityGalleryService } from '@/sanity/queries/gallery'

export default async function GaleriaPage() {
  // Fetch gallery data server-side
  let mediaItems
  try {
    mediaItems = await SanityGalleryService.getMediaItems()
  } catch (error) {
    console.error('Error loading gallery data:', error)
    mediaItems = []
  }

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section with Animations */}
      <GalleryHero />

      {/* Client-side Gallery Components with Lightbox */}
      <GalleryClient mediaItems={mediaItems} />
    </main>
  )
}
