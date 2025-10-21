/**
 * Upload gallery albums with multiple images/videos
 * Album-based format with multi-media support
 */

import { config } from 'dotenv'
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { extname } from 'path'

// Load environment variables
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})

interface MediaItem {
  path: string
  caption?: string
}

interface Album {
  title: string
  description?: string
  category: string
  dateTaken?: string
  location?: string
  media: MediaItem[]
  isFeatured?: boolean
}

/**
 * Auto-generate description based on title and category
 */
function generateDescription(title: string, category: string): string {
  const descriptions: Record<string, string> = {
    engagement: `Um momento especial do nosso noivado. ${title} - uma memória que guardaremos para sempre.`,
    travel: `Viagem inesquecível! ${title} - aventuras e descobertas juntos.`,
    dates: `${title} - um dos nossos encontros especiais que tornaram nosso relacionamento único.`,
    family: `Momentos em família. ${title} - celebrando com quem amamos.`,
    friends: `${title} - diversão e alegria com nossos amigos queridos.`,
    special_moments: `${title} - um momento único na nossa história juntos.`,
    proposal: `O pedido! ${title} - quando decidimos passar nossas vidas juntos.`,
    wedding_prep: `Preparativos do casamento. ${title} - construindo nosso dia perfeito.`,
    behind_scenes: `${title} - os bastidores da nossa história.`,
    professional: `${title} - registros profissionais dos nossos momentos especiais.`,
  }

  return descriptions[category] || `${title} - momentos especiais da nossa jornada juntos.`
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
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.heic': 'image/heic',
    // Videos
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
async function uploadMedia(
  filePath: string,
  mediaType: 'image' | 'video'
) {
  try {
    console.log(`    📥 Reading ${mediaType} from ${filePath}...`)
    const buffer = readFileSync(filePath)
    const contentType = getContentType(filePath)
    const filename = filePath.split('/').pop() || 'media'

    console.log(`    ⬆️  Uploading ${mediaType} to Sanity...`)
    const asset = await client.assets.upload(mediaType, buffer, {
      contentType,
      filename,
    })

    console.log(`    ✅ ${mediaType} uploaded: ${asset._id}`)
    return {
      _type: mediaType,
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    }
  } catch (error) {
    console.error(`    ❌ Failed to upload ${mediaType} from ${filePath}:`, error)
    throw error
  }
}

/**
 * Create gallery album in Sanity
 */
async function createAlbum(album: Album, index: number) {
  console.log(`\n📸 Album ${index + 1}: ${album.title}`)
  console.log(`  📁 Category: ${album.category}`)
  console.log(`  🖼️  Media items: ${album.media.length}`)

  // Upload all media items
  const mediaArray = []
  for (let i = 0; i < album.media.length; i++) {
    const item = album.media[i]
    const mediaType = getMediaType(item.path)

    console.log(`  📷 Media ${i + 1}/${album.media.length}`)
    const uploadedAsset = await uploadMedia(item.path, mediaType)

    mediaArray.push({
      _key: `media-${Date.now()}-${i}`,
      mediaType,
      [mediaType]: uploadedAsset,
      alt: item.caption || album.title,
      caption: item.caption,
      displayOrder: i + 1,
    })
  }

  // Create album document
  const description = album.description || generateDescription(album.title, album.category)

  const albumDoc = {
    _type: 'galleryImage',
    title: album.title,
    description,
    media: mediaArray,
    category: album.category,
    dateTaken: album.dateTaken,
    location: album.location,
    isFeatured: album.isFeatured || false,
    isPublic: true,
  }

  try {
    const result = await client.create(albumDoc)
    console.log(`  ✅ Album created: ${result._id}`)
    return result
  } catch (error) {
    console.error(`  ❌ Failed to create album:`, error)
    throw error
  }
}

/**
 * Parse gallery data from text file
 */
function parseGalleryData(filePath: string): Album[] {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')

  const albums: Album[] = []
  let currentAlbum: Partial<Album> | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip comments and empty lines
    if (trimmed.startsWith('#') || trimmed === '') {
      // If we were building an album, save it
      if (currentAlbum && currentAlbum.title && currentAlbum.category && currentAlbum.media) {
        albums.push(currentAlbum as Album)
        currentAlbum = null
      }
      continue
    }

    // Parse album fields
    if (trimmed.startsWith('Album:')) {
      // Save previous album if exists
      if (currentAlbum && currentAlbum.title && currentAlbum.category && currentAlbum.media) {
        albums.push(currentAlbum as Album)
      }
      // Start new album
      currentAlbum = {
        title: trimmed.substring(6).trim(),
        media: [],
      }
    } else if (trimmed.startsWith('Category:')) {
      if (currentAlbum) {
        currentAlbum.category = trimmed.substring(9).trim()
      }
    } else if (trimmed.startsWith('Date:')) {
      if (currentAlbum) {
        currentAlbum.dateTaken = trimmed.substring(5).trim()
      }
    } else if (trimmed.startsWith('Location:')) {
      if (currentAlbum) {
        currentAlbum.location = trimmed.substring(9).trim()
      }
    } else if (trimmed.startsWith('Featured:')) {
      if (currentAlbum) {
        currentAlbum.isFeatured = trimmed.substring(9).trim().toLowerCase() === 'yes'
      }
    } else if (trimmed.startsWith('Description:')) {
      if (currentAlbum) {
        currentAlbum.description = trimmed.substring(12).trim()
      }
    } else if (trimmed.startsWith('-')) {
      // Media item
      if (currentAlbum) {
        const mediaLine = trimmed.substring(1).trim()
        const [path, caption] = mediaLine.split('|').map(s => s.trim())
        currentAlbum.media!.push({ path, caption })
      }
    }
  }

  // Save last album
  if (currentAlbum && currentAlbum.title && currentAlbum.category && currentAlbum.media) {
    albums.push(currentAlbum as Album)
  }

  return albums
}

/**
 * Main execution
 */
async function main() {
  console.log('📸 Starting gallery album upload...\n')

  // Read albums from data file
  const dataFile = './scripts/gallery-data.txt'
  console.log(`📄 Reading data from: ${dataFile}\n`)

  const albums = parseGalleryData(dataFile)

  if (albums.length === 0) {
    console.log('⚠️  No albums found in data file!')
    console.log('   Please add your albums to: scripts/gallery-data.txt\n')
    process.exit(0)
  }

  console.log(`📊 Total albums to upload: ${albums.length}\n`)

  let successCount = 0
  let failCount = 0

  for (let i = 0; i < albums.length; i++) {
    try {
      await createAlbum(albums[i], i)
      successCount++
    } catch (error) {
      failCount++
      console.error(`Failed to process album: ${albums[i].title}`, error)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n✅ Successfully created: ${successCount} albums`)
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} albums`)
  }
  console.log('\n🎉 Done! Check your gallery at:')
  console.log(`   https://thousandaysof.love/studio/structure/galleryImage\n`)
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
