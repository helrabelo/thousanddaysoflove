#!/usr/bin/env node

/**
 * Gallery Migration Script: Supabase → Sanity CMS
 *
 * Migrates gallery images from Supabase Storage + media_items table
 * to Sanity CMS with full metadata preservation.
 *
 * Usage:
 *   npx tsx scripts/migrate-gallery-to-sanity.ts
 *
 * Prerequisites:
 *   1. Export gallery data from /admin/galeria (galeria-completa.json)
 *   2. Download all images from Supabase Storage
 *   3. Set up gallery-migration directory structure:
 *      ./gallery-migration/
 *        - galeria-completa.json (exported data)
 *        - images/ (downloaded images)
 *
 * Environment variables required:
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET
 *   - SANITY_API_WRITE_TOKEN
 */

import { createClient } from '@sanity/client'
import { createReadStream } from 'fs'
import { readdir, readFile, stat } from 'fs/promises'
import path from 'path'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

// Sanity write client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

interface SupabaseMediaItem {
  id: string
  title: string
  description?: string
  url: string
  thumbnail_url?: string
  media_type: 'photo' | 'video'
  category: string
  tags?: string[]
  date_taken?: string
  location?: string
  is_featured: boolean
  is_public: boolean
  aspect_ratio?: number
  file_size?: number
  upload_date: string
  created_at: string
  updated_at: string
}

interface MigrationStats {
  total: number
  success: number
  skipped: number
  errors: number
  videos: number
  startTime: number
  endTime?: number
}

const stats: MigrationStats = {
  total: 0,
  success: 0,
  skipped: 0,
  errors: 0,
  videos: 0,
  startTime: Date.now(),
}

/**
 * Upload image file to Sanity
 */
async function uploadImageToSanity(imagePath: string): Promise<any> {
  try {
    const imageStream = createReadStream(imagePath)
    const fileName = path.basename(imagePath)

    console.log(`  📤 Uploading file: ${fileName}`)

    const asset = await sanityClient.assets.upload('image', imageStream, {
      filename: fileName,
    })

    console.log(`  ✅ Uploaded asset: ${asset._id}`)
    return asset
  } catch (error) {
    console.error(`  ❌ Upload failed for ${imagePath}:`, error)
    throw error
  }
}

/**
 * Create gallery image document in Sanity
 */
async function createGalleryImageDocument(
  item: SupabaseMediaItem,
  imageAsset: any
): Promise<void> {
  try {
    const doc = {
      _type: 'galleryImage',
      title: item.title,
      description: item.description || '',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset._id,
        },
      },
      mediaType: item.media_type,
      category: item.category,
      tags: item.tags || [],
      dateTaken: item.date_taken,
      location: item.location,
      isFeatured: item.is_featured,
      isPublic: item.is_public,
      aspectRatio: item.aspect_ratio,
    }

    const result = await sanityClient.create(doc)
    console.log(`  ✅ Created document: ${result._id}`)
  } catch (error) {
    console.error(`  ❌ Document creation failed for ${item.title}:`, error)
    throw error
  }
}

/**
 * Find image file in migration directory
 */
async function findImageFile(imageUrl: string, imagesDir: string): Promise<string | null> {
  try {
    const fileName = path.basename(imageUrl)
    const possiblePaths = [path.join(imagesDir, fileName)]

    for (const filePath of possiblePaths) {
      try {
        await stat(filePath)
        return filePath
      } catch {
        continue
      }
    }

    return null
  } catch {
    console.error(`  ⚠️  Could not find image file for ${imageUrl}`)
    return null
  }
}

/**
 * Validate environment setup
 */
function validateEnvironment(): void {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'SANITY_API_WRITE_TOKEN',
  ]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach((key) => console.error(`   - ${key}`))
    console.error('\nPlease check your .env.local file')
    process.exit(1)
  }

  console.log('✅ Environment validated')
}

/**
 * Validate migration directory structure
 */
async function validateMigrationDirectory(): Promise<void> {
  const migrationDir = './gallery-migration'
  const imagesDir = path.join(migrationDir, 'images')
  const exportFile = path.join(migrationDir, 'galeria-completa.json')

  try {
    await stat(migrationDir)
    console.log('✅ Migration directory found')
  } catch {
    console.error('❌ Migration directory not found: ./gallery-migration/')
    console.error('   Please create it and add:')
    console.error('   - galeria-completa.json (exported data)')
    console.error('   - images/ (downloaded images)')
    process.exit(1)
  }

  try {
    await stat(exportFile)
    console.log('✅ Export file found: galeria-completa.json')
  } catch {
    console.error('❌ Export file not found: galeria-completa.json')
    console.error('   Export gallery data from /admin/galeria first')
    process.exit(1)
  }

  try {
    await stat(imagesDir)
    const files = await readdir(imagesDir)
    console.log(`✅ Images directory found: ${files.length} files`)
  } catch {
    console.error('❌ Images directory not found: ./gallery-migration/images/')
    console.error('   Download images from Supabase Storage first')
    process.exit(1)
  }
}

/**
 * Display migration summary
 */
function displaySummary(): void {
  stats.endTime = Date.now()
  const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2)

  console.log('\n' + '='.repeat(60))
  console.log('🎉 MIGRATION COMPLETE!')
  console.log('='.repeat(60))
  console.log(`Total items:     ${stats.total}`)
  console.log(`✅ Success:       ${stats.success}`)
  console.log(`⏭️  Skipped:       ${stats.skipped}`)
  console.log(`🎬 Videos:        ${stats.videos} (skipped - handle separately)`)
  console.log(`❌ Errors:        ${stats.errors}`)
  console.log(`⏱️  Duration:      ${duration}s`)
  console.log('='.repeat(60))

  if (stats.errors > 0) {
    console.log('\n⚠️  Some items failed to migrate. Check logs above for details.')
  }

  if (stats.videos > 0) {
    console.log('\n📹 Video migration not yet implemented.')
    console.log('   Videos need to be uploaded separately to Sanity.')
  }

  console.log('\n📝 Next Steps:')
  console.log('   1. Verify images in Sanity Studio: http://localhost:3000/studio')
  console.log('   2. Test gallery page: http://localhost:3000/galeria')
  console.log('   3. Check migration guide: GALLERY_MIGRATION_GUIDE.md')
}

/**
 * Main migration function
 */
async function migrateGallery() {
  try {
    console.log('🚀 Starting Gallery Migration: Supabase → Sanity CMS')
    console.log('=' .repeat(60))

    // 1. Validate environment
    console.log('\n📋 Step 1: Validating environment...')
    validateEnvironment()

    // 2. Validate migration directory
    console.log('\n📋 Step 2: Validating migration directory...')
    await validateMigrationDirectory()

    // 3. Load exported data
    console.log('\n📋 Step 3: Loading exported data...')
    const exportPath = './gallery-migration/galeria-completa.json'
    const exportData = JSON.parse(await readFile(exportPath, 'utf-8'))
    const mediaItems: SupabaseMediaItem[] = exportData.media_items

    stats.total = mediaItems.length
    console.log(`✅ Loaded ${stats.total} items from export`)

    // 4. Process each item
    console.log('\n📋 Step 4: Migrating images...')
    console.log('=' .repeat(60))

    const imagesDir = './gallery-migration/images'

    for (let i = 0; i < mediaItems.length; i++) {
      const item = mediaItems[i]
      const progress = `[${i + 1}/${stats.total}]`

      console.log(`\n${progress} Processing: ${item.title}`)
      console.log(`  Category: ${item.category} | Featured: ${item.is_featured}`)

      try {
        // Skip videos for now
        if (item.media_type === 'video') {
          console.log(`  ⏭️  Skipped: Video (handle separately)`)
          stats.videos++
          stats.skipped++
          continue
        }

        // Skip private items
        if (!item.is_public) {
          console.log(`  ⏭️  Skipped: Private item`)
          stats.skipped++
          continue
        }

        // Find image file
        const imagePath = await findImageFile(item.url, imagesDir)
        if (!imagePath) {
          console.log(`  ❌ Error: Image file not found`)
          stats.errors++
          continue
        }

        // Upload image to Sanity
        const imageAsset = await uploadImageToSanity(imagePath)

        // Create gallery document
        await createGalleryImageDocument(item, imageAsset)

        stats.success++
        console.log(`  ✅ Success!`)
      } catch (error) {
        console.error(`  ❌ Failed:`, error)
        stats.errors++
      }

      // Rate limiting - pause every 10 items
      if ((i + 1) % 10 === 0) {
        console.log('\n⏸️  Pausing 2s (rate limiting)...')
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // 5. Display summary
    displaySummary()
  } catch (error) {
    console.error('\n💥 MIGRATION FAILED:', error)
    process.exit(1)
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrateGallery()
}

export { migrateGallery }
