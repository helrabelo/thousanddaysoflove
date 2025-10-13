import Navigation from '@/components/ui/Navigation'
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

      {/* Hero Section - Wedding Invitation Style */}
      <section className="relative pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: 'var(--primary-text)', letterSpacing: '0.15em', lineHeight: '1.1' }}>
            Nossa Galeria
          </h1>
          <div className="w-24 h-px mx-auto mb-8" style={{ background: 'var(--decorative)' }} />
          <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-crimson)', color: 'var(--secondary-text)', fontStyle: 'italic' }}>
            Mil dias de amor capturados em momentos eternos.
            Cada foto conta uma parte da nossa jornada até o altar.
          </p>
        </div>
      </section>

      {/* Client-side Gallery Components with Lightbox */}
      <GalleryClient mediaItems={mediaItems} />
    </main>
  )
}
