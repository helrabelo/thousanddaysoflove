/**
 * Clear all gallery images from Sanity
 * Prepares for fresh batch upload
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'

// Load environment variables
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

async function main() {
  console.log('🗑️  Starting gallery cleanup...\n')

  try {
    // Fetch all gallery images
    const query = '*[_type == "galleryImage"]'
    const galleryImages = await client.fetch(query)

    console.log(`📊 Found ${galleryImages.length} gallery albums to delete\n`)

    if (galleryImages.length === 0) {
      console.log('✨ Gallery is already empty!\n')
      return
    }

    // Ask for confirmation
    console.log('⚠️  WARNING: This will delete ALL gallery albums!')
    console.log('   This action cannot be undone.\n')

    // Delete all gallery images
    let deletedCount = 0
    let failedCount = 0

    for (const image of galleryImages) {
      try {
        console.log(`  🗑️  Deleting: ${image.title || image._id}`)
        await client.delete(image._id)
        deletedCount++
      } catch (error) {
        console.error(`  ❌ Failed to delete ${image._id}:`, error)
        failedCount++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log(`\n✅ Successfully deleted: ${deletedCount} albums`)
    if (failedCount > 0) {
      console.log(`❌ Failed to delete: ${failedCount} albums`)
    }
    console.log('\n✨ Gallery is now empty and ready for new uploads!\n')
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

main()
