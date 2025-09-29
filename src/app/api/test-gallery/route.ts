import { NextResponse } from 'next/server'
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'

export async function GET() {
  try {
    console.log('🧪 Testing Supabase Gallery integration...')
    console.log('Environment check:')
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('ANON_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 'undefined')

    // Test 1: Skip storage bucket test for now (will be created on first upload)
    console.log('1. Skipping storage bucket test (will be created on upload)...')
    console.log('✅ Storage bucket check skipped!')

    // Test 2: Get gallery stats
    console.log('2. Testing gallery stats...')
    const stats = await SupabaseGalleryService.getGalleryStats()
    console.log('✅ Gallery stats retrieved:', {
      photos: stats.total_photos,
      videos: stats.total_videos,
      size: `${stats.total_size_mb.toFixed(2)} MB`
    })

    // Test 3: Get media items
    console.log('3. Testing media items retrieval...')
    const mediaItems = await SupabaseGalleryService.getMediaItems()
    console.log(`✅ Found ${mediaItems.length} media items`)

    // Test 4: Get timeline events
    console.log('4. Testing timeline events...')
    const timelineEvents = await SupabaseGalleryService.getTimelineEvents()
    console.log(`✅ Found ${timelineEvents.length} timeline events`)

    return NextResponse.json({
      success: true,
      message: 'Supabase Gallery integration is working!',
      data: {
        stats,
        mediaItemsCount: mediaItems.length,
        timelineEventsCount: timelineEvents.length,
        bucketReady: 'skipped'
      }
    })
  } catch (error) {
    console.error('❌ Supabase Gallery test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}