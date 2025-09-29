import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('🪣 Creating Supabase storage bucket...')

    // Use service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin.storage.createBucket('wedding-media', {
      public: true,
      allowedMimeTypes: ['image/*', 'video/*'],
      fileSizeLimit: 50 * 1024 * 1024 // 50MB
    })

    if (error) {
      console.error('❌ Failed to create storage bucket:', error)
      throw error
    }

    console.log('✅ Storage bucket created successfully!', data)

    return NextResponse.json({
      success: true,
      message: 'Storage bucket created successfully!',
      bucketName: 'wedding-media',
      data
    })
  } catch (error) {
    console.error('❌ Failed to create storage bucket:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}