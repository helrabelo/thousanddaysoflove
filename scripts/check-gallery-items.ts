#!/usr/bin/env tsx
/**
 * Check Gallery Items in Sanity
 *
 * Diagnoses why uploaded gallery items aren't appearing on /galeria
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

async function checkGalleryItems() {
  console.log('\n🔍 Checking Gallery Items in Sanity\n')

  // Check all gallery items (including drafts)
  const allItemsQuery = groq`*[_type == "galleryImage"] { _id, title, isPublic, _createdAt } | order(_createdAt desc)[0...10]`
  const allItems = await client.fetch(allItemsQuery)

  console.log('📊 All Gallery Items (last 10):')
  console.log(`   Total found: ${allItems.length}\n`)

  allItems.forEach((item: any) => {
    const isDraft = item._id.startsWith('drafts.')
    const status = isDraft ? '📝 DRAFT' : '✅ Published'
    const publicStatus = item.isPublic ? '🌐 Public' : '🔒 Private'
    console.log(`   ${status} ${publicStatus} - ${item.title}`)
    console.log(`      ID: ${item._id}`)
  })

  console.log('\n' + '='.repeat(60))

  // Check public items (what the website query uses)
  const publicItemsQuery = groq`*[_type == "galleryImage" && isPublic == true] { _id, title, isPublic }`
  const publicItems = await client.fetch(publicItemsQuery)

  console.log('\n✅ Public Gallery Items (what website sees):')
  console.log(`   Total found: ${publicItems.length}\n`)

  if (publicItems.length === 0) {
    console.log('   ⚠️  NO PUBLIC ITEMS FOUND!')
    console.log('   This is why they\'re not showing on /galeria\n')
  } else {
    publicItems.forEach((item: any) => {
      console.log(`   - ${item.title} (${item._id})`)
    })
  }

  console.log('\n' + '='.repeat(60))

  // Check draft items
  const draftItemsQuery = groq`*[_id in path("drafts.**") && _type == "galleryImage"] { _id, title }`
  const draftItems = await client.fetch(draftItemsQuery)

  console.log('\n📝 Draft Gallery Items:')
  console.log(`   Total found: ${draftItems.length}\n`)

  if (draftItems.length > 0) {
    console.log('   ⚠️  DRAFTS NEED TO BE PUBLISHED!')
    console.log('   These items are invisible to the website until published\n')
    draftItems.slice(0, 5).forEach((item: any) => {
      console.log(`   - ${item.title} (${item._id})`)
    })
    if (draftItems.length > 5) {
      console.log(`   ... and ${draftItems.length - 5} more`)
    }
  }

  console.log('\n')
}

checkGalleryItems().catch((error) => {
  console.error('\n❌ Error:', error)
  process.exit(1)
})
