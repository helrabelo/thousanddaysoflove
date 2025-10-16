import Navigation from '@/components/ui/Navigation'
import TimelineMomentCard from '@/components/timeline/TimelineMomentCard'
import TimelinePhaseHeader from '@/components/timeline/TimelinePhaseHeader'
import HistoriaHero from '@/components/historia/HistoriaHero'
import HistoriaBackButton from '@/components/historia/HistoriaBackButton'
import { sanityFetch } from '@/sanity/lib/client'
import { timelineQuery } from '@/sanity/queries/timeline'
import { getStoryMomentMedia } from '@/lib/utils/sanity-media'
import type { SanityStoryMoment } from '@/types/wedding'

interface TimelineMoment extends SanityStoryMoment {
  _id: string
  title: string
  date: string
  icon?: string
  description: string
  dayNumber?: number
  contentAlign: 'left' | 'right'
  displayOrder: number
}

interface TimelinePhase {
  _id: string
  id: { current: string }
  title: string
  dayRange: string
  subtitle?: string
  displayOrder: number
  moments: TimelineMoment[]
}

interface TimelineData {
  phases: TimelinePhase[]
}

export default async function HistoriaPage() {
  // Fetch timeline data server-side
  let timelineData: TimelineData | null = null

  try {
    timelineData = await sanityFetch<TimelineData>({
      query: timelineQuery,
      tags: ['timeline', 'storyMoment', 'storyPhase'],
    })
  } catch (error) {
    console.error('Error loading timeline from Sanity:', error)
  }

  // If no data, show empty state
  if (!timelineData || !timelineData.phases || timelineData.phases.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-crimson)', fontSize: '1.25rem' }}>
          Nenhum momento encontrado. Adicione momentos no Sanity Studio!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with Animations */}
      <HistoriaHero />

      {/* Dynamic Timeline Phases and Events from Sanity */}
      {timelineData.phases.map((phase) => {
        if (!phase.moments || phase.moments.length === 0) return null

        return (
          <div key={phase._id}>
            <TimelinePhaseHeader
              title={phase.title}
              dayRange={phase.dayRange}
              subtitle={phase.subtitle || ''}
            />

            {phase.moments.map((moment) => {
              // Transform Sanity media into MediaCarousel format
              const mediaItems = getStoryMomentMedia(moment).map(item => ({
                mediaType: item.type as 'image' | 'video',
                url: item.url,
                alt: item.alt,
                caption: item.caption,
                width: item.width,
                height: item.height,
                aspectRatio: item.aspectRatio,
              }))

              return (
                <TimelineMomentCard
                  key={moment._id}
                  day={moment.dayNumber || 0}
                  date={new Date(moment.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                  title={moment.title}
                  description={moment.description}
                  media={mediaItems}
                  contentAlign={moment.contentAlign}
                />
              )
            })}
          </div>
        )
      })}

      {/* Spacer before back button */}
      <div className="py-16" />

      {/* Navigation Back with Animation */}
      <HistoriaBackButton />
    </div>
  )
}
