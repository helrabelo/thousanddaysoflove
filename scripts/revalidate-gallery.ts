#!/usr/bin/env tsx
/**
 * Trigger Gallery Revalidation
 *
 * Forces Next.js to revalidate the /galeria page cache
 * Useful after uploading new gallery items to Sanity
 *
 * Usage:
 *   npm run revalidate:gallery
 */

import 'dotenv/config'

const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thousanddaysoflove.vercel.app'
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || 'your-secret-token-here'

async function revalidateGallery() {
  console.log('\n🔄 Triggering Gallery Page Revalidation\n')

  const url = `${PRODUCTION_URL}/api/revalidate?secret=${REVALIDATION_SECRET}&path=/galeria`

  console.log(`📡 Sending request to: ${PRODUCTION_URL}/api/revalidate`)
  console.log(`📄 Path to revalidate: /galeria\n`)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Revalidation successful!')
      console.log(`   Path: ${data.path}`)
      console.log(`   Timestamp: ${new Date(data.now).toLocaleString()}\n`)
      console.log('🎉 Gallery page cache cleared! New items should appear shortly.\n')
    } else {
      console.error('❌ Revalidation failed!')
      console.error(`   Status: ${response.status}`)
      console.error(`   Message: ${data.message}\n`)

      if (response.status === 401) {
        console.log('💡 Tip: Make sure REVALIDATION_SECRET is set in your production environment variables\n')
      }
    }
  } catch (error) {
    console.error('❌ Error triggering revalidation:', error)
    console.error('\n💡 Make sure:')
    console.error('   1. Your production site is deployed')
    console.error('   2. REVALIDATION_SECRET is set in .env.local and production')
    console.error('   3. The /api/revalidate route is deployed\n')
  }
}

revalidateGallery().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
