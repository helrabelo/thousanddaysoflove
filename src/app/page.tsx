import Navigation from '@/components/ui/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import StoryPreview from '@/components/sections/StoryPreview'
import QuickPreview from '@/components/sections/QuickPreview'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StoryPreview />
      <QuickPreview />
    </main>
  )
}
