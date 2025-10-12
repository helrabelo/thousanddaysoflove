/**
 * Bulk Upload Gallery Images to Sanity
 *
 * Uploads all images from a local directory to Sanity CMS as galleryImage documents.
 *
 * Usage:
 * npx tsx scripts/bulk-upload-gallery.ts
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') })

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

// Sanity client with write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ala3rp0f',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Configuration
const IMAGES_DIR = path.join(process.env.HOME || '', 'Downloads', 'casamento-hy')
const BATCH_SIZE = 5 // Upload 5 images at a time
const DELAY_BETWEEN_BATCHES = 2000 // 2 seconds between batches

interface UploadStats {
  total: number
  uploaded: number
  skipped: number
  errors: number
  errorDetails: Array<{ file: string; error: string }>
}

/**
 * Extract image number from filename
 * "Casamento H❤️Y - 42 of 117.jpeg" → 42
 */
function extractImageNumber(filename: string): number {
  const match = filename.match(/(\d+)\s+of\s+\d+/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Generate title from filename
 * "Casamento H❤️Y - 42 of 117.jpeg" → "Momento 42"
 */
function generateTitle(filename: string): string {
  const number = extractImageNumber(filename)
  return number > 0 ? `Momento ${number}` : filename.replace(/\.(jpg|jpeg|png|heic)$/i, '')
}

/**
 * Determine category based on image number
 * You can customize this logic to categorize images as you prefer
 */
function determineCategory(imageNumber: number): string {
  // Default: group images into categories based on number ranges
  // Customize these ranges based on your actual photo content

  if (imageNumber <= 15) return 'engagement'        // First 15: Engagement
  if (imageNumber <= 30) return 'dates'             // 16-30: Dates
  if (imageNumber <= 45) return 'travel'            // 31-45: Travel
  if (imageNumber <= 60) return 'special_moments'   // 46-60: Special Moments
  if (imageNumber <= 75) return 'friends'           // 61-75: Friends
  if (imageNumber <= 90) return 'family'            // 76-90: Family
  if (imageNumber <= 105) return 'wedding_prep'     // 91-105: Wedding Prep
  return 'professional'                              // 106+: Professional
}

/**
 * Upload image file to Sanity
 */
async function uploadImage(filePath: string, filename: string) {
  const imageBuffer = await readFile(filePath)

  const asset = await client.assets.upload('image', imageBuffer, {
    filename: filename,
  })

  return asset
}

/**
 * Create galleryImage document
 */
async function createGalleryDocument(imageAsset: any, filename: string, displayOrder: number) {
  const imageNumber = extractImageNumber(filename)
  const title = generateTitle(filename)
  const category = determineCategory(imageNumber)

  const doc = {
    _type: 'galleryImage',
    title: title,
    description: `Foto ${imageNumber} da galeria de casamento`,
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    },
    mediaType: 'photo' as const,
    category: category,
    tags: ['casamento', 'Casa HY', '1000 dias'],
    isFeatured: false, // You can manually feature images later in Studio
    isPublic: true,
    displayOrder: displayOrder,
  }

  return client.create(doc)
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Main upload function
 */
async function bulkUpload() {
  console.log('🚀 Starting bulk gallery upload to Sanity...\n')

  // Validate environment
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Error: SANITY_API_WRITE_TOKEN not found in environment')
    console.error('   Make sure .env.local has SANITY_API_WRITE_TOKEN set\n')
    process.exit(1)
  }

  // Validate images directory
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Error: Images directory not found: ${IMAGES_DIR}`)
    console.error('   Update IMAGES_DIR in the script to point to your images\n')
    process.exit(1)
  }

  console.log(`📁 Images directory: ${IMAGES_DIR}`)

  // Get all image files
  const files = await readdir(IMAGES_DIR)
  const imageFiles = files
    .filter(file => /\.(jpg|jpeg|png|heic)$/i.test(file))
    .filter(file => !file.startsWith('.')) // Skip hidden files like .DS_Store
    .sort((a, b) => extractImageNumber(a) - extractImageNumber(b)) // Sort by number

  console.log(`📷 Found ${imageFiles.length} images to upload\n`)

  if (imageFiles.length === 0) {
    console.log('⚠️  No images found. Exiting.')
    return
  }

  const stats: UploadStats = {
    total: imageFiles.length,
    uploaded: 0,
    skipped: 0,
    errors: 0,
    errorDetails: [],
  }

  // Process images in batches
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE)

    console.log(`\n📦 Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(imageFiles.length / BATCH_SIZE)}`)
    console.log(`   Images ${i + 1}-${Math.min(i + BATCH_SIZE, imageFiles.length)} of ${imageFiles.length}`)

    // Process batch in parallel
    await Promise.all(
      batch.map(async (filename, batchIndex) => {
        const displayOrder = i + batchIndex + 1
        const filePath = path.join(IMAGES_DIR, filename)

        try {
          console.log(`   ⬆️  Uploading: ${filename}`)

          // Upload image asset
          const imageAsset = await uploadImage(filePath, filename)

          // Create gallery document
          const doc = await createGalleryDocument(imageAsset, filename, displayOrder)

          console.log(`   ✅ Created: ${doc.title} (${doc.category})`)
          stats.uploaded++

        } catch (error: any) {
          console.error(`   ❌ Error: ${filename}`)
          console.error(`      ${error.message}`)
          stats.errors++
          stats.errorDetails.push({
            file: filename,
            error: error.message,
          })
        }
      })
    )

    // Delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < imageFiles.length) {
      console.log(`   ⏸️  Waiting ${DELAY_BETWEEN_BATCHES / 1000}s before next batch...`)
      await sleep(DELAY_BETWEEN_BATCHES)
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Upload Summary')
  console.log('='.repeat(60))
  console.log(`✅ Successfully uploaded: ${stats.uploaded} images`)
  console.log(`⏭️  Skipped: ${stats.skipped} images`)
  console.log(`❌ Errors: ${stats.errors} images`)
  console.log(`📁 Total processed: ${stats.total} images`)
  console.log('='.repeat(60))

  if (stats.errorDetails.length > 0) {
    console.log('\n❌ Error Details:')
    stats.errorDetails.forEach(({ file, error }) => {
      console.log(`   ${file}: ${error}`)
    })
  }

  console.log('\n✨ Upload complete!')
  console.log(`\n🎨 Next steps:`)
  console.log(`   1. Open Sanity Studio: http://localhost:3000/studio`)
  console.log(`   2. Navigate to: 📷 Galeria → Todas as Imagens`)
  console.log(`   3. Review uploaded images`)
  console.log(`   4. Edit descriptions, categories, and feature special images`)
  console.log(`   5. Visit gallery page: http://localhost:3000/galeria\n`)
}

// Run upload
bulkUpload().catch(error => {
  console.error('\n💥 Fatal error during upload:')
  console.error(error)
  process.exit(1)
})
