#!/usr/bin/env tsx
/**
 * Upload Gallery Items from Downloads/Galeria
 *
 * This script scans ~/Downloads/Galeria for images and videos
 * and uploads them as individual gallery albums to Sanity.
 *
 * Features:
 * - Dry run mode to preview uploads
 * - Organizes by folder name
 * - Supports images (jpg, jpeg, png) and videos (mov, mp4)
 * - Uses Sanity write token for uploads
 *
 * Usage:
 *   npm run upload-gallery:dry-run   # Preview only
 *   npm run upload-gallery           # Actually upload
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
const GALLERY_PATH = path.join(homedir(), 'Downloads', 'Galeria')
const DRY_RUN = process.argv.includes('--dry-run')
const SUPPORTED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.heic'],
  video: ['.mov', '.mp4', '.m4v'],
}

interface MediaFile {
  filePath: string
  fileName: string
  albumName: string
  mediaType: 'image' | 'video'
  extension: string
  size: number
}

/**
 * Get all media files from the Gallery directory
 */
function getAllMediaFiles(): MediaFile[] {
  const mediaFiles: MediaFile[] = []

  console.log(`\n📁 Scanning: ${GALLERY_PATH}\n`)

  const items = fs.readdirSync(GALLERY_PATH)

  for (const item of items) {
    // Skip hidden files and .DS_Store
    if (item.startsWith('.')) continue

    const itemPath = path.join(GALLERY_PATH, item)
    const stat = fs.statSync(itemPath)

    if (stat.isDirectory()) {
      // Scan folder for media files
      const folderFiles = fs.readdirSync(itemPath)

      for (const file of folderFiles) {
        if (file.startsWith('.')) continue

        const filePath = path.join(itemPath, file)
        const fileExt = path.extname(file).toLowerCase()

        // Check if it's a supported media file
        const mediaType = SUPPORTED_EXTENSIONS.image.includes(fileExt)
          ? 'image'
          : SUPPORTED_EXTENSIONS.video.includes(fileExt)
          ? 'video'
          : null

        if (mediaType && fs.statSync(filePath).isFile()) {
          mediaFiles.push({
            filePath,
            fileName: file,
            albumName: item,
            mediaType,
            extension: fileExt,
            size: fs.statSync(filePath).size,
          })
        }
      }
    } else if (stat.isFile()) {
      // Handle individual files in root
      const fileExt = path.extname(item).toLowerCase()

      const mediaType = SUPPORTED_EXTENSIONS.image.includes(fileExt)
        ? 'image'
        : SUPPORTED_EXTENSIONS.video.includes(fileExt)
        ? 'video'
        : null

      if (mediaType) {
        // Use filename (without extension) as album name
        const albumName = path.basename(item, fileExt)

        mediaFiles.push({
          filePath: itemPath,
          fileName: item,
          albumName,
          mediaType,
          extension: fileExt,
          size: stat.size,
        })
      }
    }
  }

  return mediaFiles
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(2)} MB`
  const kb = bytes / 1024
  return `${kb.toFixed(2)} KB`
}

/**
 * Upload a media file to Sanity
 */
async function uploadMediaToSanity(mediaFile: MediaFile): Promise<any> {
  const fileStream = fs.createReadStream(mediaFile.filePath)

  if (mediaFile.mediaType === 'image') {
    return await client.assets.upload('image', fileStream, {
      filename: mediaFile.fileName,
    })
  } else {
    return await client.assets.upload('file', fileStream, {
      filename: mediaFile.fileName,
      contentType: `video/${mediaFile.extension.replace('.', '')}`,
    })
  }
}

/**
 * Create a gallery album document
 */
async function createGalleryAlbum(
  mediaFile: MediaFile,
  uploadedAsset: any,
  index: number
): Promise<any> {
  const doc = {
    _type: 'galleryImage',
    title: mediaFile.albumName,
    description: `Momento especial: ${mediaFile.albumName}`,
    category: 'special_moments',
    isPublic: true,
    isFeatured: false,
    displayOrder: index + 1,
    media: [
      {
        _type: 'object',
        _key: `media-${Date.now()}`,
        mediaType: mediaFile.mediaType,
        [mediaFile.mediaType]: {
          _type: mediaFile.mediaType === 'image' ? 'image' : 'file',
          asset: {
            _type: 'reference',
            _ref: uploadedAsset._id,
          },
        },
        alt: mediaFile.albumName,
        caption: '',
        displayOrder: 1,
      },
    ],
  }

  return await client.create(doc)
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🎨 Gallery Upload Script\n')
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (Preview Only)' : '🚀 LIVE UPLOAD'}\n`)

  // Get all media files
  const mediaFiles = getAllMediaFiles()

  if (mediaFiles.length === 0) {
    console.log('❌ No media files found in', GALLERY_PATH)
    process.exit(1)
  }

  // Group by album name for better display
  const byAlbum = mediaFiles.reduce((acc, file) => {
    if (!acc[file.albumName]) acc[file.albumName] = []
    acc[file.albumName].push(file)
    return acc
  }, {} as Record<string, MediaFile[]>)

  console.log(`📊 Summary:\n`)
  console.log(`  Total files: ${mediaFiles.length}`)
  console.log(`  Albums: ${Object.keys(byAlbum).length}`)
  console.log(
    `  Images: ${mediaFiles.filter((f) => f.mediaType === 'image').length}`
  )
  console.log(
    `  Videos: ${mediaFiles.filter((f) => f.mediaType === 'video').length}\n`
  )

  // Display grouped preview
  console.log('📋 Files to upload:\n')
  for (const [albumName, files] of Object.entries(byAlbum)) {
    console.log(`  📁 ${albumName} (${files.length} files)`)
    files.forEach((file) => {
      const icon = file.mediaType === 'image' ? '📷' : '🎥'
      console.log(`     ${icon} ${file.fileName} (${formatFileSize(file.size)})`)
    })
    console.log('')
  }

  if (DRY_RUN) {
    console.log('✅ Dry run complete! No files were uploaded.\n')
    console.log('To actually upload, run without --dry-run flag:\n')
    console.log('  npx tsx scripts/upload-gallery-from-downloads.ts\n')
    return
  }

  // Confirm before upload
  console.log('⚠️  WARNING: This will upload', mediaFiles.length, 'files to Sanity!\n')
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')

  await new Promise((resolve) => setTimeout(resolve, 5000))

  console.log('🚀 Starting upload...\n')

  let successCount = 0
  let errorCount = 0
  const errors: Array<{ file: string; error: string }> = []

  for (let i = 0; i < mediaFiles.length; i++) {
    const mediaFile = mediaFiles[i]
    const progress = `[${i + 1}/${mediaFiles.length}]`

    try {
      console.log(
        `${progress} Uploading ${mediaFile.mediaType}: ${mediaFile.fileName}...`
      )

      // Upload media asset
      const uploadedAsset = await uploadMediaToSanity(mediaFile)
      console.log(`  ✅ Asset uploaded: ${uploadedAsset._id}`)

      // Create gallery document
      const doc = await createGalleryAlbum(mediaFile, uploadedAsset, i)
      console.log(`  ✅ Album created: ${doc._id}`)
      console.log('')

      successCount++
    } catch (error) {
      errorCount++
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`  ❌ Failed: ${errorMessage}\n`)
      errors.push({
        file: mediaFile.fileName,
        error: errorMessage,
      })
    }
  }

  // Final report
  console.log('\n' + '='.repeat(60))
  console.log('\n✨ Upload Complete!\n')
  console.log(`  ✅ Success: ${successCount}`)
  console.log(`  ❌ Failed: ${errorCount}`)
  console.log(`  📊 Total: ${mediaFiles.length}\n`)

  if (errors.length > 0) {
    console.log('❌ Errors:\n')
    errors.forEach(({ file, error }) => {
      console.log(`  • ${file}`)
      console.log(`    ${error}\n`)
    })
  }

  console.log('🎉 Done!\n')
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
