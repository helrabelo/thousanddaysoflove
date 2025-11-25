#!/usr/bin/env tsx
/**
 * Fix Gallery Images - Remove invalid displayOrder field
 *
 * Removes the root-level displayOrder field from galleryImage documents
 * that were incorrectly created with it.
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

const DRY_RUN = process.argv.includes('--dry-run')

async function main() {
  console.log('\n🔧 Fix Gallery DisplayOrder Field')
  console.log('='.repeat(50))
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN' : '🚀 LIVE FIX'}\n`)

  // Find all gallery images with displayOrder field
  const query = `*[_type == "galleryImage" && defined(displayOrder)] {
    _id,
    title,
    displayOrder
  }`

  const docs = await client.fetch(query)

  console.log(`Found ${docs.length} documents with displayOrder field\n`)

  if (docs.length === 0) {
    console.log('✅ No documents need fixing!')
    return
  }

  // Show what will be fixed
  console.log('Documents to fix:')
  docs.forEach((doc: any) => {
    console.log(`  • ${doc.title} (displayOrder: ${doc.displayOrder})`)
  })

  if (DRY_RUN) {
    console.log('\n✅ Dry run complete. Run without --dry-run to fix.')
    return
  }

  console.log('\n🔧 Fixing documents...\n')

  let fixed = 0
  let errors = 0

  for (const doc of docs) {
    try {
      await client
        .patch(doc._id)
        .unset(['displayOrder'])
        .commit()

      console.log(`  ✅ Fixed: ${doc.title}`)
      fixed++
    } catch (error: any) {
      console.error(`  ❌ Error fixing ${doc.title}: ${error.message}`)
      errors++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Fixed: ${fixed}`)
  console.log(`❌ Errors: ${errors}`)
  console.log('='.repeat(50) + '\n')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
