// Test script for Supabase Gallery integration
// Run with: node test-supabase-gallery.js

import { SupabaseGalleryService } from './src/lib/services/supabaseGalleryService.js'

console.log('🧪 TESTING SUPABASE GALLERY INTEGRATION...\n')

async function testSupabaseGallery() {
  try {
    console.log('1. 🔧 Testing storage bucket setup...')
    await SupabaseGalleryService.ensureBucketExists()
    console.log('✅ Storage bucket is ready!\n')

    console.log('2. 📊 Testing gallery stats...')
    const stats = await SupabaseGalleryService.getGalleryStats()
    console.log('✅ Gallery stats:', {
      photos: stats.total_photos,
      videos: stats.total_videos,
      size: `${stats.total_size_mb.toFixed(2)} MB`,
      categories: Object.keys(stats.categories_breakdown).length,
      featured: stats.featured_count
    })
    console.log('')

    console.log('3. 📸 Testing media items retrieval...')
    const mediaItems = await SupabaseGalleryService.getMediaItems()
    console.log(`✅ Found ${mediaItems.length} media items`)
    if (mediaItems.length > 0) {
      console.log('First item:', {
        title: mediaItems[0].title,
        type: mediaItems[0].media_type,
        category: mediaItems[0].category
      })
    }
    console.log('')

    console.log('4. 📅 Testing timeline events...')
    const timelineEvents = await SupabaseGalleryService.getTimelineEvents()
    console.log(`✅ Found ${timelineEvents.length} timeline events`)
    if (timelineEvents.length > 0) {
      console.log('First event:', {
        title: timelineEvents[0].title,
        date: timelineEvents[0].date,
        milestone: timelineEvents[0].milestone_type
      })
    }
    console.log('')

    console.log('🎉 ALL TESTS PASSED! Supabase Gallery is ready for uploads!')
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Open http://localhost:3000/admin/galeria')
    console.log('2. Click the floating upload button')
    console.log('3. Upload some photos/videos')
    console.log('4. Check that they appear in the gallery')
    console.log('5. Verify they are stored in Supabase (not localStorage)')

  } catch (error) {
    console.error('❌ TEST FAILED:', error.message)
    console.error('\n🔧 DEBUGGING INFO:')
    console.error('- Check that Supabase is running: npx supabase status')
    console.error('- Check .env.local file for correct Supabase URLs')
    console.error('- Verify database migrations: npx supabase db push')
    console.error('\nFull error:', error)
  }
}

testSupabaseGallery()