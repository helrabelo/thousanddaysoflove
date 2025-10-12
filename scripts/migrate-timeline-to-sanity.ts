/**
 * Migrate Timeline Events from Supabase to Sanity
 *
 * This script:
 * 1. Creates 3 default story phases
 * 2. Migrates timeline events to storyMoments
 * 3. Assigns each moment to appropriate phase
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN || '',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Default phases based on day ranges
const DEFAULT_PHASES = [
  {
    _type: 'storyPhase',
    _id: 'phase-primeiros-dias',
    id: { _type: 'slug', current: 'primeiros-dias' },
    title: 'Os Primeiros Dias',
    dayRange: 'Dia 1 - 100',
    subtitle: 'Do Tinder ao primeiro encontro. Aquele nervosismo que a gente não admitia.',
    displayOrder: 1,
    isVisible: true,
  },
  {
    _type: 'storyPhase',
    _id: 'phase-construindo-juntos',
    id: { _type: 'slug', current: 'construindo-juntos' },
    title: 'Construindo Juntos',
    dayRange: 'Dia 101 - 500',
    subtitle: 'Quando a gente percebeu que isso aqui era pra valer. Casa própria, primeira dog, e muitas cervejas no Mangue Azul.',
    displayOrder: 2,
    isVisible: true,
  },
  {
    _type: 'storyPhase',
    _id: 'phase-rumo-ao-altar',
    id: { _type: 'slug', current: 'rumo-ao-altar' },
    title: 'Caminhando Pro Altar',
    dayRange: 'Dia 501 - 1000',
    subtitle: 'O pedido em Icaraí. Planejamento do casamento. E a gente aqui, prestes a celebrar 1000 dias juntos.',
    displayOrder: 3,
    isVisible: true,
  },
]

// Map milestone types to emojis
const MILESTONE_ICONS: Record<string, string> = {
  first_date: '💑',
  anniversary: '💖',
  family: '🐾',
  engagement: '💍',
  other: '❤️',
}

// Calculate day number from start date (2023-01-06)
const START_DATE = new Date('2023-01-06')
function calculateDayNumber(dateString: string): number {
  const eventDate = new Date(dateString)
  const diffTime = eventDate.getTime() - START_DATE.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Day 1, not Day 0
}

// Assign phase based on day number
function assignPhase(dayNumber: number): { _type: 'reference'; _ref: string } {
  if (dayNumber <= 100) {
    return { _type: 'reference', _ref: 'phase-primeiros-dias' }
  } else if (dayNumber <= 500) {
    return { _type: 'reference', _ref: 'phase-construindo-juntos' }
  } else {
    return { _type: 'reference', _ref: 'phase-rumo-ao-altar' }
  }
}

// Assign content alignment (alternate left/right)
function getContentAlign(index: number): 'left' | 'right' {
  return index % 2 === 0 ? 'left' : 'right'
}

async function main() {
  console.log('🚀 Starting timeline migration to Sanity...\n')

  // Check environment variables
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !token) {
    console.error('❌ Missing environment variables!')
    console.error('   NEXT_PUBLIC_SANITY_PROJECT_ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? '✅' : '❌')
    console.error('   SANITY_API_WRITE_TOKEN:', process.env.SANITY_API_WRITE_TOKEN ? '✅' : '❌')
    console.error('\nPlease set SANITY_API_WRITE_TOKEN in your .env.local file')
    console.error('Get it from: https://sanity.io/manage')
    process.exit(1)
  }

  // Step 1: Create phases
  console.log('📚 Step 1: Creating story phases...')
  for (const phase of DEFAULT_PHASES) {
    try {
      await client.createOrReplace(phase)
      console.log(`   ✅ Created phase: ${phase.title}`)
    } catch (error) {
      console.error(`   ❌ Failed to create phase ${phase.title}:`, error)
    }
  }
  console.log('')

  // Step 2: Load timeline events from JSON
  console.log('📖 Step 2: Loading timeline events from JSON...')
  const jsonPath = path.join(process.env.HOME || '', 'Downloads', 'timeline_events_rows.json')

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ File not found: ${jsonPath}`)
    process.exit(1)
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8')
  const timelineEvents = JSON.parse(rawData)
  console.log(`   ✅ Loaded ${timelineEvents.length} events\n`)

  // Step 3: Migrate each event to storyMoment
  console.log('💫 Step 3: Migrating events to storyMoments...')
  let successCount = 0
  let errorCount = 0

  for (const event of timelineEvents) {
    try {
      const dayNumber = calculateDayNumber(event.date)
      const phase = assignPhase(dayNumber)
      const icon = MILESTONE_ICONS[event.milestone_type] || '❤️'
      const contentAlign = getContentAlign(event.display_order)

      const storyMoment = {
        _type: 'storyMoment',
        _id: `story-moment-${event.id}`,
        title: event.title,
        date: event.date,
        icon: icon,
        description: event.description,
        // Note: Images will need to be uploaded separately to Sanity
        // For now, we'll skip the image field
        phase: phase,
        dayNumber: dayNumber,
        contentAlign: contentAlign,
        displayOrder: event.display_order,
        showInPreview: event.display_order <= 5, // First 5 in preview
        showInTimeline: true,
        isVisible: event.is_visible,
      }

      await client.createOrReplace(storyMoment)
      console.log(`   ✅ [${event.display_order}/${timelineEvents.length}] ${event.title} (Day ${dayNumber})`)
      successCount++
    } catch (error) {
      console.error(`   ❌ Failed to migrate: ${event.title}`, error)
      errorCount++
    }
  }

  console.log('\n✨ Migration complete!')
  console.log(`   ✅ Success: ${successCount}/${timelineEvents.length}`)
  if (errorCount > 0) {
    console.log(`   ❌ Errors: ${errorCount}`)
  }

  console.log('\n📝 Next steps:')
  console.log('   1. Open Sanity Studio: http://localhost:3000/studio')
  console.log('   2. Navigate to: Páginas > Nossa História')
  console.log('   3. Upload images to each story moment')
  console.log('   4. Verify phase assignments')
  console.log('   5. Test homepage preview and timeline page')
}

main().catch(console.error)
