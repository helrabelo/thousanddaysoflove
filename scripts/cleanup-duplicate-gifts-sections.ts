/**
 * Cleanup Duplicate Gifts Page Sections
 *
 * Removes the old "gifts-page-sections-main" document that was created
 * before the singleton pattern was properly implemented.
 *
 * The correct singleton document ID should be "giftsPageSections"
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ala3rp0f'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('❌ Error: SANITY_API_WRITE_TOKEN not found in environment')
  console.error('Add it to .env.local to run this script')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  apiVersion: '2024-01-01',
  token,
})

async function cleanupDuplicates() {
  console.log('🔍 Checking for duplicate giftsPageSections documents...\n')

  // Query all giftsPageSections documents
  const duplicates = await client.fetch<
    Array<{ _id: string; _createdAt: string; isActive: boolean }>
  >(`*[_type == "giftsPageSections"] { _id, _createdAt, isActive }`)

  console.log(`Found ${duplicates.length} document(s):`)
  duplicates.forEach((doc) => {
    console.log(`  - ${doc._id} (created: ${doc._createdAt}, active: ${doc.isActive})`)
  })

  // Find the old duplicate
  const oldDuplicate = duplicates.find((doc) => doc._id === 'gifts-page-sections-main')
  const correctSingleton = duplicates.find((doc) => doc._id === 'giftsPageSections')

  if (!oldDuplicate) {
    console.log('\n✅ No duplicate found! Only the correct singleton exists.')
    return
  }

  if (!correctSingleton) {
    console.error(
      '\n⚠️  Warning: The correct singleton "giftsPageSections" does not exist!'
    )
    console.error('Please ensure the singleton is created before running this cleanup.')
    process.exit(1)
  }

  console.log('\n🗑️  Removing old duplicate: gifts-page-sections-main')

  try {
    await client.delete(oldDuplicate._id)
    console.log('✅ Successfully deleted duplicate document!')

    // Verify deletion
    const remaining = await client.fetch<
      Array<{ _id: string }>
    >(`*[_type == "giftsPageSections"] { _id }`)

    console.log(`\n✨ Cleanup complete! ${remaining.length} document remaining:`)
    remaining.forEach((doc) => {
      console.log(`  - ${doc._id}`)
    })
  } catch (error) {
    console.error('❌ Error deleting duplicate:', error)
    process.exit(1)
  }
}

cleanupDuplicates()
  .then(() => {
    console.log('\n✅ All done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
