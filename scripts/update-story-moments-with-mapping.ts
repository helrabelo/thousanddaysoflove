/**
 * Update story moments using manual mapping file
 * Reads mapping from story-moments-mapping.txt
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
const MAPPING_FILE = './scripts/story-moments-mapping.txt'

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

interface Mapping {
  [momentOrder: number]: number // momentOrder -> folderDayNumber
}

/**
 * Parse mapping file
 */
function parseMappingFile(filePath: string): Mapping {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const mapping: Mapping = {}

  for (const line of lines) {
    const trimmed = line.trim()
    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') continue

    // Parse: "2 = 28" format
    const match = trimmed.match(/^(\d+)\s*=\s*(\d+)/)
    if (match) {
      const momentOrder = parseInt(match[1], 10)
      const folderDay = parseInt(match[2], 10)
      mapping[momentOrder] = folderDay
    }
  }

  return mapping
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
    .sort()
}

/**
 * Scan all folders in NossaHistoria
 */
function scanHistoriaFolders(): Map<number, FolderInfo> {
  const folders = new Map<number, FolderInfo>()

  const items = readdirSync(HISTORIA_PATH)

  for (const item of items) {
    const fullPath = join(HISTORIA_PATH, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const parsed = parseFolderName(item)
      if (parsed) {
        const files = getMediaFiles(fullPath)
        if (files.length > 0) {
          folders.set(parsed.day, {
            dayNumber: parsed.day,
            folderName: item,
            fullPath,
            files,
          })
        }
      }
    }
  }

  return folders
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
async function uploadMedia(filePath: string, mediaType: 'image' | 'video', title: string) {
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
 * Update story moment with media and day number
 */
async function updateMoment(moment: StoryMoment, folder: FolderInfo) {
  console.log(`\n📝 #${moment.displayOrder}. ${moment.title}`)
  console.log(`   Folder: ${folder.folderName}`)
  console.log(`   New Day: ${folder.dayNumber}`)
  console.log(`   Media files: ${folder.files.length}`)

  // Upload all media files
  const mediaArray = []
  for (let i = 0; i < folder.files.length; i++) {
    const filePath = folder.files[i]
    const mediaType = getMediaType(filePath)

    const uploadedAsset = await uploadMedia(filePath, mediaType, moment.title)
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
    const result = await client
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
  console.log('📖 Updating Story Moments using mapping file...\n')

  // Read mapping file
  console.log(`📄 Reading mapping from: ${MAPPING_FILE}`)
  const mapping = parseMappingFile(MAPPING_FILE)
  console.log(`   Found ${Object.keys(mapping).length} mappings\n`)

  if (Object.keys(mapping).length === 0) {
    console.log('⚠️  No mappings found! Please fill in the mapping file.')
    console.log(`   Edit: ${MAPPING_FILE}\n`)
    return
  }

  // Scan folders
  console.log('📁 Scanning folders...')
  const folders = scanHistoriaFolders()
  console.log(`   Found ${folders.size} folders with media\n`)

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

  // Show mappings
  console.log('📋 Mappings to apply:')
  for (const [momentOrder, folderDay] of Object.entries(mapping)) {
    const moment = moments.find(m => m.displayOrder === parseInt(momentOrder))
    const folder = folders.get(folderDay)

    if (moment && folder) {
      console.log(`   #${momentOrder}. ${moment.title} → Dia ${folderDay} (${folder.files.length} files)`)
    } else if (!moment) {
      console.log(`   ⚠️  Moment #${momentOrder} not found`)
    } else if (!folder) {
      console.log(`   ⚠️  Folder Dia ${folderDay} not found`)
    }
  }

  console.log('\n🔄 Starting updates...\n')

  let updated = 0
  let skipped = 0

  for (const [momentOrder, folderDay] of Object.entries(mapping)) {
    const moment = moments.find(m => m.displayOrder === parseInt(momentOrder))
    const folder = folders.get(folderDay)

    if (moment && folder) {
      const success = await updateMoment(moment, folder)
      if (success) updated++
      else skipped++
    } else {
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
