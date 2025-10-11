import Navigation from '@/components/ui/Navigation'
import VideoHeroSection from '@/components/sections/VideoHeroSection'
import StoryPreview from '@/components/sections/StoryPreview'
import AboutUsSection from '@/components/sections/AboutUsSection'
import OurFamilySection from '@/components/sections/OurFamilySection'
import QuickPreview from '@/components/sections/QuickPreview'
import WeddingLocation from '@/components/sections/WeddingLocation'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <VideoHeroSection />
      <StoryPreview />
      <AboutUsSection />
      <OurFamilySection />
      <QuickPreview />
      <div id="location">
        <WeddingLocation />
      </div>
    </main>
  )
}
