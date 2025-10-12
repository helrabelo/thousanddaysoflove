import Navigation from '@/components/ui/Navigation'
import VideoHeroSection from '@/components/sections/VideoHeroSection'
import StoryPreview from '@/components/sections/StoryPreview'
import AboutUsSection from '@/components/sections/AboutUsSection'
import OurFamilySection from '@/components/sections/OurFamilySection'
import EventDetailsSection from '@/components/sections/EventDetailsSection'
import QuickPreview from '@/components/sections/QuickPreview'
import WeddingLocation from '@/components/sections/WeddingLocation'
import { sanityFetch } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/queries/homepage'

export default async function Home() {
  // Fetch homepage data from Sanity (single query for entire page)
  const homePage = await sanityFetch<any>({
    query: homePageQuery,
    tags: ['homePage'],
  })

  // If no homepage configured in Sanity, show message
  if (!homePage || !homePage.sections) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-hero-gradient">
        <div className="text-center max-w-2xl px-8">
          <h1 className="text-4xl font-playfair font-bold text-burgundy-800 mb-4">
            Bem-vindo ao Thousand Days of Love
          </h1>
          <p className="text-burgundy-600 mb-6">
            O conteúdo da página está sendo configurado no Sanity Studio.
          </p>
          <a
            href="/studio"
            className="text-burgundy-700 hover:text-blush-600 underline"
          >
            Acessar Sanity Studio →
          </a>
        </div>
      </main>
    )
  }

  // Extract sections by type for easy prop passing
  const sections = homePage.sections.reduce((acc: any, section: any) => {
    acc[section._type] = section
    return acc
  }, {})

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Video Hero Section */}
      {sections.videoHero && <VideoHeroSection data={sections.videoHero} />}

      {/* Event Details Section */}
      {sections.eventDetails && <EventDetailsSection data={sections.eventDetails} />}

      {/* Story Preview Section - Now self-contained, loads own data */}
      <StoryPreview />

      {/* About Us Section */}
      {sections.aboutUs && <AboutUsSection data={sections.aboutUs} />}

      {/* Our Family Section */}
      {sections.ourFamily && <OurFamilySection data={sections.ourFamily} />}

      {/* Quick Preview Section */}
      {sections.quickPreview && <QuickPreview data={sections.quickPreview} />}

      {/* Wedding Location Section */}
      {sections.weddingLocation && (
        <div id="location">
          <WeddingLocation data={sections.weddingLocation} />
        </div>
      )}
    </main>
  )
}
