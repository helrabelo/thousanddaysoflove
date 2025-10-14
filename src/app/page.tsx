import Navigation from '@/components/ui/Navigation'
import VideoHeroSection from '@/components/sections/VideoHeroSection'
import FeatureHubSection from '@/components/sections/FeatureHubSection'
import InvitationCTASection from '@/components/sections/InvitationCTASection'
import { sanityFetch } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/queries/homepage'
import type { SanityHomePage, SanityVideoHero } from '@/types/sanity'
import Link from 'next/link'

interface HomePageSections {
  videoHero?: SanityVideoHero;
  [key: string]: unknown;
}

export default async function Home(): Promise<JSX.Element> {
  // Fetch homepage data from Sanity (single query for entire page)
  const homePage = await sanityFetch<SanityHomePage>({
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
          <Link
            href="/studio"
            className="text-burgundy-700 hover:text-blush-600 underline"
          >
            Acessar Sanity Studio →
          </Link>
        </div>
      </main>
    )
  }

  // Extract sections by type for easy prop passing
  const sections = homePage.sections.reduce<HomePageSections>((acc, section) => {
    acc[section._type] = section
    return acc
  }, {})

  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Video Hero Section - SUPER IMPORTANT, unchanged */}
      {sections.videoHero && <VideoHeroSection data={sections.videoHero as any} />}

      {/* Feature Hub Section - NEW: 2x2 grid showcasing main features */}
      <FeatureHubSection />

      {/* Invitation CTA Section - NEW: Introduces personalized guest experience */}
      <InvitationCTASection />
    </main>
  )
}
