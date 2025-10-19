#!/usr/bin/env tsx

/**
 * Fix Guaramiranga Date
 *
 * Updates "Guaramiranga Espontâneo" from Feb 24 to Feb 25, 2023 (Day 1)
 */

import { createClient } from '@sanity/client'
import 'dotenv/config'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

async function fixGuaramirangaDate() {
  console.log('🔧 Fixing Guaramiranga date...\n')

  try {
    // Find the Guaramiranga moment
    const moment = await client.fetch(
      `*[_type == "storyMoment" && title == "Guaramiranga Espontâneo"][0]{ _id, title, date }`
    )

    if (!moment) {
      console.log('❌ Could not find "Guaramiranga Espontâneo" moment')
      return
    }

    console.log('Found moment:')
    console.log(`  Title: ${moment.title}`)
    console.log(`  Current date: ${moment.date}`)
    console.log(`  New date: 2023-02-25`)
    console.log('')

    // Update the date
    await client
      .patch(moment._id)
      .set({ date: '2023-02-25' })
      .commit()

    console.log('✅ Successfully updated Guaramiranga to Feb 25, 2023 (Day 1)!\n')
  } catch (error) {
    console.error('❌ Failed to update:', error)
    process.exit(1)
  }
}

fixGuaramirangaDate()
