#!/usr/bin/env tsx
/**
 * Upload Wedding Day Photos (HY-Dia-1000)
 *
 * Uploads all photos from ~/Downloads/HY-Dia-1000 to Sanity CMS
 * Renames NIC_#### to HY-### format
 *
 * Usage:
 *   npx tsx scripts/upload-wedding-day-photos.ts --dry-run   # Preview
 *   npx tsx scripts/upload-wedding-day-photos.ts             # Upload
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { homedir } from 'os'

// Sanity client with write token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

// Configuration
const PHOTOS_DIR = path.join(homedir(), 'Downloads', 'HY-Dia-1000')
const DRY_RUN = process.argv.includes('--dry-run')
const BATCH_SIZE = 5 // Upload 5 at a time
const DELAY_BETWEEN_BATCHES = 2000 // 2 seconds

// Parse --start-from=N flag
const startFromArg = process.argv.find((arg) => arg.startsWith('--start-from='))
const START_FROM = startFromArg ? parseInt(startFromArg.split('=')[1], 10) : 1

interface PhotoFile {
  filePath: string
  originalName: string
  newName: string // HY-### format
  displayOrder: number
  size: number
}

/**
 * Extract number from NIC_#### or NIC_####-2 format
 */
function extractNumber(filename: string): number {
  // Match NIC_0006.jpg or NIC_0082-2.jpg
  const match = filename.match(/NIC_(\d+)(?:-\d+)?\.jpg/i)
  if (match) {
    return parseInt(match[1], 10)
  }
  return 0
}

/**
 * Format number to HY-### (3 digits, padded)
 */
function formatNewName(sequentialIndex: number): string {
  return `HY-${String(sequentialIndex).padStart(3, '0')}`
}

/**
 * Get all photo files sorted by original number
 */
function getAllPhotos(): PhotoFile[] {
  console.log(`\n📁 Scanning: ${PHOTOS_DIR}\n`)

  const files = fs.readdirSync(PHOTOS_DIR)
  const photoFiles = files
    .filter((f) => /\.(jpg|jpeg|png|heic)$/i.test(f))
    .filter((f) => !f.startsWith('.'))
    .map((filename) => ({
      filename,
      number: extractNumber(filename),
    }))
    .sort((a, b) => a.number - b.number)

  // Create PhotoFile objects with sequential HY-### names
  return photoFiles.map((file, index) => {
    const filePath = path.join(PHOTOS_DIR, file.filename)
    const stat = fs.statSync(filePath)

    return {
      filePath,
      originalName: file.filename,
      newName: formatNewName(index + 1),
      displayOrder: index + 1,
      size: stat.size,
    }
  })
}

/**
 * Format file size for display
 */
function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

/**
 * Upload image to Sanity
 */
async function uploadImage(photo: PhotoFile): Promise<any> {
  const fileBuffer = fs.readFileSync(photo.filePath)

  return await client.assets.upload('image', fileBuffer, {
    filename: `${photo.newName}.jpg`,
  })
}

/**
 * Create gallery document in Sanity
 */
async function createGalleryDocument(
  photo: PhotoFile,
  imageAsset: any
): Promise<any> {
  const doc = {
    _type: 'galleryImage',
    title: photo.newName,
    description: `Dia 1000 - ${photo.newName}`,
    category: 'professional', // Wedding day professional photos
    tags: ['casamento', 'dia-1000', 'wedding-day', 'hely'],
    dateTaken: '2025-11-20', // Wedding day!
    location: 'Fortaleza, Ceará',
    isPublic: true,
    isFeatured: false,
    media: [
      {
        _type: 'object',
        _key: `media-${Date.now()}-${photo.displayOrder}`,
        mediaType: 'image',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id,
          },
        },
        alt: `${photo.newName} - Casamento H&Y`,
        caption: '',
        displayOrder: 1,
      },
    ],
  }

  return await client.create(doc)
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Main execution
 */
async function main() {
  console.log('\n📸 Wedding Day Photos Upload Script')
  console.log('='.repeat(50))
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (Preview)' : '🚀 LIVE UPLOAD'}`)
  if (START_FROM > 1) {
    console.log(`Starting from: HY-${String(START_FROM).padStart(3, '0')}`)
  }

  // Validate environment
  if (!DRY_RUN && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('\n❌ SANITY_API_WRITE_TOKEN not found in .env.local')
    process.exit(1)
  }

  // Validate directory
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`\n❌ Directory not found: ${PHOTOS_DIR}`)
    process.exit(1)
  }

  // Get all photos, filtered by START_FROM
  const allPhotos = getAllPhotos()
  const photos = allPhotos.filter((p) => p.displayOrder >= START_FROM)
  const totalSize = photos.reduce((sum, p) => sum + p.size, 0)

  if (START_FROM > 1) {
    console.log(`\n📋 Skipping first ${START_FROM - 1} photos (already uploaded)`)
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Photos: ${photos.length}`)
  console.log(`   Total size: ${formatSize(totalSize)}`)
  console.log(`   Batches: ${Math.ceil(photos.length / BATCH_SIZE)}`)

  // Preview first and last files
  console.log(`\n📋 Rename preview:`)
  const previewItems = [
    ...photos.slice(0, 3),
    ...(photos.length > 6 ? [{ newName: '...', originalName: '...' } as PhotoFile] : []),
    ...photos.slice(-3),
  ]
  previewItems.forEach((p) => {
    if (p.newName === '...') {
      console.log(`   ...`)
    } else {
      console.log(`   ${p.originalName} → ${p.newName}`)
    }
  })

  if (DRY_RUN) {
    console.log('\n✅ Dry run complete! No files uploaded.')
    console.log('\nTo upload, run:')
    console.log('  npx tsx scripts/upload-wedding-day-photos.ts\n')
    return
  }

  // Confirm
  console.log(`\n⚠️  About to upload ${photos.length} photos to Sanity!`)
  console.log('Press Ctrl+C to cancel, waiting 5 seconds...\n')
  await sleep(5000)

  console.log('🚀 Starting upload...\n')

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ file: string; error: string }> = []
  const startTime = Date.now()

  // Process in batches
  for (let i = 0; i < photos.length; i += BATCH_SIZE) {
    const batch = photos.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(photos.length / BATCH_SIZE)

    console.log(`📦 Batch ${batchNum}/${totalBatches} (${i + 1}-${Math.min(i + BATCH_SIZE, photos.length)})`)

    // Process batch in parallel
    const results = await Promise.allSettled(
      batch.map(async (photo) => {
        try {
          // Upload image asset
          const asset = await uploadImage(photo)

          // Create gallery document
          const doc = await createGalleryDocument(photo, asset)

          console.log(`   ✅ ${photo.newName} (${photo.originalName})`)
          return { success: true, photo }
        } catch (error: any) {
          console.error(`   ❌ ${photo.newName}: ${error.message}`)
          throw { photo, error: error.message }
        }
      })
    )

    // Count results
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        successCount++
      } else {
        errorCount++
        const { photo, error } = result.reason
        errors.push({ file: photo.originalName, error })
      }
    })

    // Progress update
    const elapsed = (Date.now() - startTime) / 1000
    const rate = successCount / elapsed
    const remaining = (photos.length - i - batch.length) / rate
    console.log(
      `   Progress: ${successCount}/${photos.length} (${Math.round((successCount / photos.length) * 100)}%) - ETA: ${Math.round(remaining)}s\n`
    )

    // Delay between batches
    if (i + BATCH_SIZE < photos.length) {
      await sleep(DELAY_BETWEEN_BATCHES)
    }
  }

  // Final report
  const totalTime = Math.round((Date.now() - startTime) / 1000)
  console.log('='.repeat(50))
  console.log('\n✨ Upload Complete!\n')
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Failed: ${errorCount}`)
  console.log(`   ⏱️  Time: ${totalTime}s`)
  console.log(`   📊 Rate: ${(successCount / totalTime).toFixed(1)} photos/sec\n`)

  if (errors.length > 0) {
    console.log('❌ Errors:')
    errors.forEach(({ file, error }) => {
      console.log(`   • ${file}: ${error}`)
    })
    console.log('')
  }

  console.log('🎉 Done! Check your gallery at:')
  console.log('   http://localhost:3000/galeria')
  console.log('   http://localhost:3000/studio (Sanity Studio)\n')
}

main().catch((error) => {
  console.error('\n💥 Fatal error:', error)
  process.exit(1)
})
