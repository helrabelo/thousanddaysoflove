import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import StoryPreview from '@/components/sections/StoryPreview'
import QuickPreview from '@/components/sections/QuickPreview'
import WeddingLocation from '@/components/sections/WeddingLocation'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StoryPreview />
      <QuickPreview />
      <div id="location">
        <WeddingLocation />
      </div>
    </main>
  )
}
