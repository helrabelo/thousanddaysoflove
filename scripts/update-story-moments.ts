/**
 * Update story moments with media from local folders
 * Matches existing moments with folders in Downloads/NossaHistoria
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

// Load environment variables
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

const HISTORIA_PATH = '/Users/helrabelo/Downloads/NossaHistoria'

interface FolderInfo {
  dayNumber: number
  folderName: string
  fullPath: string
  files: string[]
}

interface StoryMoment {
  _id: string
  title: string
  dayNumber?: number
  displayOrder: number
  media?: any[]
}

/**
 * Parse folder name to extract day number
 */
function parseFolderName(folderName: string): { day: number; name: string } | null {
  const match = folderName.match(/^(\d+)\s*-\s*(.+)$/)
  if (match) {
    return {
      day: parseInt(match[1], 10),
      name: match[2].trim(),
    }
  }
  return null
}

/**
 * Get all media files from a folder
 */
function getMediaFiles(folderPath: string): string[] {
  const files = readdirSync(folderPath)
  const mediaExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v']

  return files
    .filter(file => {
      const ext = extname(file).toLowerCase()
      return mediaExtensions.includes(ext) && !file.startsWith('.')
    })
    .map(file => join(folderPath, file))
    .sort() // Sort alphabetically for consistent ordering
}

/**
 * Scan all folders in NossaHistoria
 */
function scanHistoriaFolders(): FolderInfo[] {
  const folders: FolderInfo[] = []

  const items = readdirSync(HISTORIA_PATH)

  for (const item of items) {
    const fullPath = join(HISTORIA_PATH, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const parsed = parseFolderName(item)
      if (parsed) {
        const files = getMediaFiles(fullPath)
        if (files.length > 0) {
          folders.push({
            dayNumber: parsed.day,
            folderName: item,
            fullPath,
            files,
          })
        }
      }
    }
  }

  return folders.sort((a, b) => a.dayNumber - b.dayNumber)
}

/**
 * Detect media type from file extension
 */
function getMediaType(filePath: string): 'image' | 'video' {
  const ext = extname(filePath).toLowerCase()
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v']
  return videoExtensions.includes(ext) ? 'video' : 'image'
}

/**
 * Get content type from file extension
 */
function getContentType(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.heic': 'image/heic',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    '.m4v': 'video/x-m4v',
  }
  return contentTypes[ext] || 'application/octet-stream'
}

/**
 * Upload media file to Sanity
 */
async function uploadMedia(filePath: string, mediaType: 'image' | 'video') {
  try {
    console.log(`      📥 Uploading ${mediaType}: ${filePath.split('/').pop()}`)
    const buffer = readFileSync(filePath)
    const contentType = getContentType(filePath)
    const filename = filePath.split('/').pop() || 'media'

    // Sanity uses 'file' for videos, not 'video'
    const sanityAssetType = mediaType === 'video' ? 'file' : 'image'

    const asset = await client.assets.upload(sanityAssetType, buffer, {
      contentType,
      filename,
    })

    console.log(`      ✅ Uploaded: ${asset._id}`)

    // Return proper Sanity asset structure
    return {
      _type: sanityAssetType, // 'image' or 'file'
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`      ❌ Failed to upload ${filePath}:`, error)
    return null
  }
}

/**
 * Match folder to story moment
 */
function findBestMatch(folder: FolderInfo, moments: StoryMoment[]): StoryMoment | null {
  // First try to match by displayOrder (most reliable)
  const orderMatch = moments.find(m => m.displayOrder === folder.dayNumber)
  if (orderMatch) return orderMatch

  // Try to match by existing dayNumber
  const dayMatch = moments.find(m => m.dayNumber === folder.dayNumber)
  if (dayMatch) return dayMatch

  // Try fuzzy title matching
  const folderNameLower = folder.folderName.toLowerCase()
  const titleMatch = moments.find(m => {
    const titleLower = m.title.toLowerCase()
    return folderNameLower.includes(titleLower) || titleLower.includes(folderNameLower)
  })

  return titleMatch || null
}

/**
 * Update story moment with media and day number
 */
async function updateMoment(moment: StoryMoment, folder: FolderInfo) {
  console.log(`\n📝 Updating: ${moment.title}`)
  console.log(`   Folder: ${folder.folderName}`)
  console.log(`   Day: ${folder.dayNumber}`)
  console.log(`   Media files: ${folder.files.length}`)

  // Upload all media files
  const mediaArray = []
  for (let i = 0; i < folder.files.length; i++) {
    const filePath = folder.files[i]
    const mediaType = getMediaType(filePath)

    const uploadedAsset = await uploadMedia(filePath, mediaType)
    if (uploadedAsset) {
      mediaArray.push({
        _key: `media-${Date.now()}-${i}`,
        mediaType,
        [mediaType]: uploadedAsset,
        alt: moment.title,
        displayOrder: i + 1,
      })
    }
  }

  if (mediaArray.length === 0) {
    console.log(`   ⚠️  No media uploaded, skipping update`)
    return false
  }

  // Update the moment
  try {
    await client
      .patch(moment._id)
      .set({
        media: mediaArray,
        dayNumber: folder.dayNumber,
      })
      .commit()

    console.log(`   ✅ Updated successfully`)
    return true
  } catch (error) {
    console.error(`   ❌ Failed to update:`, error)
    return false
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('📖 Updating Story Moments from NossaHistoria folders...\n')

  // Scan folders
  console.log('📁 Scanning folders...')
  const folders = scanHistoriaFolders()
  console.log(`   Found ${folders.length} folders with media\n`)

  if (folders.length === 0) {
    console.log('⚠️  No folders found!')
    return
  }

  // Fetch existing moments
  console.log('📚 Fetching existing story moments...')
  const moments = await client.fetch<StoryMoment[]>(`
    *[_type == "storyMoment"] | order(displayOrder asc) {
      _id,
      title,
      dayNumber,
      displayOrder,
      media
    }
  `)
  console.log(`   Found ${moments.length} story moments\n`)

  // Show folder list
  console.log('📋 Available folders:')
  folders.forEach(f => {
    console.log(`   Dia ${f.dayNumber}: ${f.folderName} (${f.files.length} files)`)
  })

  console.log('\n📋 Existing moments:')
  moments.forEach(m => {
    const mediaCount = m.media?.length || 0
    console.log(`   #${m.displayOrder}. ${m.title} - Dia ${m.dayNumber || 'N/A'} (${mediaCount} media)`)
  })

  console.log('\n🔍 Matching and updating...\n')

  let updated = 0
  let skipped = 0

  for (const folder of folders) {
    const match = findBestMatch(folder, moments)

    if (match) {
      const success = await updateMoment(match, folder)
      if (success) updated++
      else skipped++
    } else {
      console.log(`\n⚠️  No match found for: ${folder.folderName}`)
      skipped++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ Updated: ${updated} moments`)
  console.log(`⚠️  Skipped: ${skipped} moments`)
  console.log('\n🎉 Done! Check your moments at:')
  console.log(`   https://thousandaysof.love/studio/structure/storyMoment\n`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
