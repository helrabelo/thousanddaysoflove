/**
 * Script to analyze story structure from Sanity CMS
 * Fetches all story phases, moments, and cards to provide comprehensive analysis
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import { resolve } from 'path'
import { calculateDayNumber } from '../src/lib/utils/relationship-days'

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
})

interface StoryPhase {
  _id: string
  title: string
  subtitle?: string
  dayRange?: string
  displayOrder: number
  isVisible: boolean
}

interface StoryMoment {
  _id: string
  title: string
  date: string
  icon?: string
  description: string
  phase: {
    _ref: string
    title?: string
  }
  contentAlign: 'left' | 'right'
  displayOrder: number
  showInPreview: boolean
  showInTimeline: boolean
  isVisible: boolean
  media?: Array<{
    mediaType: 'image' | 'video'
    caption?: string
    alt?: string
    displayOrder: number
  }>
}

interface StoryCard {
  _id: string
  title: string
  date?: string
  dayNumber?: number
  icon?: string
  description: string
  displayOrder: number
  isVisible: boolean
}

async function analyzeStoryStructure() {
  console.log('🔍 ANALYZING STORY STRUCTURE - Thousand Days of Love\n')
  console.log('=' .repeat(80))
  console.log('\n')

  try {
    // Fetch all story phases
    const phases = await client.fetch<StoryPhase[]>(`
      *[_type == "storyPhase"] | order(displayOrder asc) {
        _id,
        title,
        subtitle,
        dayRange,
        displayOrder,
        isVisible
      }
    `)

    // Fetch all story moments with phase references
    const moments = await client.fetch<StoryMoment[]>(`
      *[_type == "storyMoment"] | order(displayOrder asc) {
        _id,
        title,
        date,
        icon,
        description,
        phase->{
          _id,
          title
        },
        contentAlign,
        displayOrder,
        showInPreview,
        showInTimeline,
        isVisible,
        media[] {
          mediaType,
          caption,
          alt,
          displayOrder
        }
      }
    `)

    // Fetch all story cards (legacy preview system)
    const cards = await client.fetch<StoryCard[]>(`
      *[_type == "storyCard"] | order(displayOrder asc) {
        _id,
        title,
        date,
        dayNumber,
        icon,
        description,
        displayOrder,
        isVisible
      }
    `)

    // PHASE ANALYSIS
    console.log('📚 STORY PHASES (CHAPTERS)\n')
    console.log(`Total Phases: ${phases.length}`)
    console.log(`Visible Phases: ${phases.filter((p) => p.isVisible).length}\n`)

    phases.forEach((phase) => {
      const phaseMoments = moments.filter(
        (m) => m.phase && (m.phase as any)._id === phase._id
      )
      const visibilityIcon = phase.isVisible ? '✅' : '❌'

      console.log(`${visibilityIcon} CHAPTER ${phase.displayOrder}: ${phase.title}`)
      if (phase.subtitle) console.log(`   Subtitle: "${phase.subtitle}"`)
      if (phase.dayRange) console.log(`   Day Range: ${phase.dayRange}`)
      console.log(`   Moments in this chapter: ${phaseMoments.length}`)

      if (phaseMoments.length > 0) {
        const dayNumbers = phaseMoments.map((m) => calculateDayNumber(m.date))
        if (dayNumbers.length > 0) {
          const minDay = Math.min(...dayNumbers)
          const maxDay = Math.max(...dayNumbers)
          console.log(`   Actual day range: Day ${minDay} → Day ${maxDay}`)
          console.log(`   Duration: ${maxDay - minDay + 1} days`)
        }

        const previewMoments = phaseMoments.filter((m) => m.showInPreview).length
        const timelineMoments = phaseMoments.filter((m) => m.showInTimeline).length
        console.log(
          `   Preview moments: ${previewMoments} | Timeline moments: ${timelineMoments}`
        )
      }

      console.log('')
    })

    // MOMENT ANALYSIS
    console.log('\n' + '='.repeat(80))
    console.log('\n❤️  STORY MOMENTS (DETAILED)\n')
    console.log(`Total Moments: ${moments.length}`)
    console.log(`Visible Moments: ${moments.filter((m) => m.isVisible).length}`)
    console.log(`Preview Moments: ${moments.filter((m) => m.showInPreview).length}`)
    console.log(`Timeline Moments: ${moments.filter((m) => m.showInTimeline).length}\n`)

    // Group moments by phase
    const momentsByPhase = new Map<string, StoryMoment[]>()
    moments.forEach((moment) => {
      if (moment.phase && (moment.phase as any)._id) {
        const phaseId = (moment.phase as any)._id
        if (!momentsByPhase.has(phaseId)) {
          momentsByPhase.set(phaseId, [])
        }
        momentsByPhase.get(phaseId)!.push(moment)
      }
    })

    phases.forEach((phase) => {
      const phaseMoments = momentsByPhase.get(phase._id) || []
      if (phaseMoments.length === 0) return

      console.log(`\n📖 ${phase.title.toUpperCase()}`)
      console.log('-'.repeat(80))

      phaseMoments.forEach((moment) => {
        const visibilityIcon = moment.isVisible ? '✅' : '❌'
        const previewIcon = moment.showInPreview ? '🏠' : ''
        const timelineIcon = moment.showInTimeline ? '📍' : ''
        const mediaCount = moment.media?.length || 0
        const mediaInfo = mediaCount > 0 ? ` [${mediaCount} media items]` : ''

        console.log(
          `${visibilityIcon} ${moment.icon || '❤️'} #${moment.displayOrder}: ${moment.title} ${previewIcon}${timelineIcon}`
        )
        const calculatedDay = calculateDayNumber(moment.date)
        console.log(
          `   Day ${Number.isFinite(calculatedDay) ? calculatedDay : '?'} | ${moment.date} | Align: ${moment.contentAlign}${mediaInfo}`
        )
        console.log(`   "${moment.description.substring(0, 100)}..."`)
        console.log('')
      })
    })

    // STORY CARDS ANALYSIS (Legacy)
    if (cards.length > 0) {
      console.log('\n' + '='.repeat(80))
      console.log('\n📇 STORY CARDS (LEGACY PREVIEW SYSTEM)\n')
      console.log(`Total Cards: ${cards.length}`)
      console.log(`Visible Cards: ${cards.filter((c) => c.isVisible).length}\n`)

      cards.forEach((card) => {
        const visibilityIcon = card.isVisible ? '✅' : '❌'
        console.log(`${visibilityIcon} ${card.icon || '❤️'} #${card.displayOrder}: ${card.title}`)
        console.log(`   Day ${card.dayNumber || '?'} | ${card.date || 'No date'}`)
        console.log(`   "${card.description.substring(0, 80)}..."`)
        console.log('')
      })
    }

    // NARRATIVE ANALYSIS
    console.log('\n' + '='.repeat(80))
    console.log('\n📊 NARRATIVE STRUCTURE ANALYSIS\n')

    // Calculate content distribution
    const totalMoments = moments.filter((m) => m.isVisible).length
    phases.forEach((phase) => {
      const phaseMoments = moments.filter(
        (m) => m.isVisible && m.phase && (m.phase as any)._id === phase._id
      )
      const percentage = ((phaseMoments.length / totalMoments) * 100).toFixed(1)
      console.log(`${phase.title}: ${phaseMoments.length} moments (${percentage}%)`)
    })

    // Calculate day coverage
    console.log('\n📅 TIMELINE COVERAGE')
    const gaps: { start: number; end: number; days: number }[] = []

    const allDayNumbers = moments
      .filter((m) => m.isVisible)
      .map((m) => calculateDayNumber(m.date))
      .filter((day) => Number.isFinite(day))
      .sort((a, b) => a - b)

    if (allDayNumbers.length > 0) {
      const firstDay = allDayNumbers[0]
      const lastDay = allDayNumbers[allDayNumbers.length - 1]
      const totalDays = lastDay - firstDay + 1

      console.log(`First documented moment: Day ${firstDay}`)
      console.log(`Last documented moment: Day ${lastDay}`)
      console.log(`Total span: ${totalDays} days`)
      console.log(`Documented moments: ${allDayNumbers.length}`)
      console.log(
        `Coverage density: ${((allDayNumbers.length / totalDays) * 100).toFixed(2)}% (moments per day span)`
      )

      // Calculate gaps
      for (let i = 0; i < allDayNumbers.length - 1; i++) {
        const gap = allDayNumbers[i + 1] - allDayNumbers[i]
        if (gap > 30) {
          gaps.push({
            start: allDayNumbers[i],
            end: allDayNumbers[i + 1],
            days: gap,
          })
        }
      }

      if (gaps.length > 0) {
        console.log(`\n⚠️  Large gaps (>30 days): ${gaps.length}`)
        gaps.forEach((gap) => {
          console.log(`   Day ${gap.start} → Day ${gap.end} (${gap.days} days gap)`)
        })
      }
    }

    // Media analysis
    console.log('\n📸 MEDIA DISTRIBUTION')
    const momentsWithMedia = moments.filter((m) => m.media && m.media.length > 0)
    const totalMediaItems = moments.reduce((sum, m) => sum + (m.media?.length || 0), 0)
    console.log(`Moments with media: ${momentsWithMedia.length}/${moments.length}`)
    console.log(`Total media items: ${totalMediaItems}`)
    console.log(
      `Average media per moment: ${(totalMediaItems / moments.length).toFixed(1)}`
    )

    const imageCount = moments.reduce(
      (sum, m) =>
        sum + (m.media?.filter((item) => item.mediaType === 'image').length || 0),
      0
    )
    const videoCount = moments.reduce(
      (sum, m) =>
        sum + (m.media?.filter((item) => item.mediaType === 'video').length || 0),
      0
    )
    console.log(`Images: ${imageCount} | Videos: ${videoCount}`)

    // RECOMMENDATIONS
    console.log('\n' + '='.repeat(80))
    console.log('\n💡 PRELIMINARY OBSERVATIONS\n')

    if (phases.length < 3) {
      console.log('⚠️  Only ' + phases.length + ' chapters - may feel underdeveloped')
    } else if (phases.length === 3) {
      console.log('✅ 3 chapters is a classic narrative structure (Setup, Conflict, Resolution)')
    } else if (phases.length > 5) {
      console.log(
        '⚠️  ' + phases.length + ' chapters may fragment the narrative flow'
      )
    }

    const unbalancedPhases = phases.map((phase) => {
      const count = moments.filter(
        (m) => m.phase && (m.phase as any)._id === phase._id
      ).length
      return { title: phase.title, count }
    })

    const maxMoments = Math.max(...unbalancedPhases.map((p) => p.count))
    const minMoments = Math.min(...unbalancedPhases.map((p) => p.count))
    const imbalanceRatio = maxMoments / (minMoments || 1)

    if (imbalanceRatio > 2) {
      console.log(
        `\n⚠️  Content imbalance detected (${maxMoments} vs ${minMoments} moments)`
      )
      console.log('   Consider redistributing content for better pacing')
    }

    if (gaps.length > 2) {
      console.log('\n⚠️  Multiple large gaps in timeline - consider filling these periods')
    }

    console.log('\n' + '='.repeat(80))
    console.log('\n✅ Analysis complete! Review data above for structure recommendations.\n')
  } catch (error) {
    console.error('❌ Error analyzing story structure:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  }
}

analyzeStoryStructure()
