#!/usr/bin/env tsx

/**
 * Recalculate Day Numbers for Story Moments
 *
 * This script updates all existing story moments in Sanity with the correct
 * day numbers based on the reference date (Feb 25, 2023 = Day 1).
 *
 * Usage:
 *   npm run recalculate-days
 *   # or
 *   tsx scripts/recalculate-day-numbers.ts
 */

import { createClient } from '@sanity/client'
import { calculateDayNumber } from '../src/lib/utils/relationship-days'
import 'dotenv/config'

// Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

interface StoryMoment {
  _id: string
  _rev: string
  title: string
  date: string
  dayNumber?: number
}

async function recalculateDayNumbers() {
  console.log('🔄 Starting day number recalculation...\n')

  try {
    // Fetch all story moments with dates
    console.log('📥 Fetching story moments from Sanity...')
    const moments = await client.fetch<StoryMoment[]>(
      `*[_type == "storyMoment" && defined(date)] | order(date asc) {
        _id,
        _rev,
        title,
        date,
        dayNumber
      }`
    )

    console.log(`✅ Found ${moments.length} story moments\n`)

    if (moments.length === 0) {
      console.log('ℹ️  No story moments found to update.')
      return
    }

    // Calculate and prepare updates
    console.log('📊 Calculating day numbers...\n')
    const updates = moments.map((moment) => {
      const calculatedDay = calculateDayNumber(moment.date)
      const hasChanged = moment.dayNumber !== calculatedDay

      return {
        ...moment,
        calculatedDay,
        hasChanged,
      }
    })

    // Display preview of changes
    console.log('═══════════════════════════════════════════════════════════════')
    console.log('PREVIEW OF CHANGES')
    console.log('═══════════════════════════════════════════════════════════════\n')

    updates.forEach(({ title, date, dayNumber: currentDay, calculatedDay, hasChanged }, index) => {
      const status = hasChanged ? '🔄 UPDATE' : '✓ OK'
      const dateFormatted = new Date(date).toLocaleDateString('pt-BR')

      console.log(`${index + 1}. ${status} ${title}`)
      console.log(`   📅 Date: ${dateFormatted}`)

      if (hasChanged) {
        console.log(`   📊 Day: ${currentDay ?? 'undefined'} → ${calculatedDay}`)
      } else {
        console.log(`   📊 Day: ${calculatedDay} (no change)`)
      }

      console.log('')
    })

    // Count updates
    const updatesNeeded = updates.filter((u) => u.hasChanged).length

    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`Total moments: ${moments.length}`)
    console.log(`Updates needed: ${updatesNeeded}`)
    console.log(`Already correct: ${moments.length - updatesNeeded}`)
    console.log('═══════════════════════════════════════════════════════════════\n')

    if (updatesNeeded === 0) {
      console.log('✅ All day numbers are already correct! No updates needed.')
      return
    }

    // Confirm before proceeding
    console.log('⚠️  This will update the day numbers in Sanity.')
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n')

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000))

    // Perform updates
    console.log('🚀 Starting updates...\n')

    let successCount = 0
    let errorCount = 0

    for (const update of updates) {
      if (!update.hasChanged) {
        continue
      }

      try {
        await client
          .patch(update._id)
          .set({ dayNumber: update.calculatedDay })
          .commit({ autoGenerateArrayKeys: true })

        console.log(`✅ Updated: ${update.title} → Dia ${update.calculatedDay}`)
        successCount++
      } catch (error) {
        console.error(`❌ Failed to update ${update.title}:`, error)
        errorCount++
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════')
    console.log('MIGRATION COMPLETE')
    console.log('═══════════════════════════════════════════════════════════════')
    console.log(`✅ Successfully updated: ${successCount}`)
    console.log(`❌ Failed: ${errorCount}`)
    console.log(`⏭️  Skipped (no change): ${moments.length - updatesNeeded}`)
    console.log('═══════════════════════════════════════════════════════════════\n')

    if (errorCount === 0) {
      console.log('🎉 All day numbers have been recalculated successfully!')
    } else {
      console.log('⚠️  Some updates failed. Check the errors above.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
recalculateDayNumbers()
