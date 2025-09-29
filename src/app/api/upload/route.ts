import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string || 'special_moments'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`📸 Uploading file: ${file.name} (${file.size} bytes) to category: ${category}`)

    // Use service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `${category}/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('wedding-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('wedding-media')
      .getPublicUrl(data.path)

    // Save media item to database
    const mediaItem = {
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: '',
      storage_path: data.path,
      url: publicUrlData.publicUrl,
      thumbnail_url: publicUrlData.publicUrl,
      media_type: file.type.startsWith('image/') ? 'photo' : 'video',
      file_size: file.size,
      aspect_ratio: 1.5, // Would be calculated from actual file
      category: category,
      tags: [],
      is_featured: false,
      is_public: true,
      upload_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('media_items')
      .insert([mediaItem])
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to clean up uploaded file if database insert fails
      await supabaseAdmin.storage
        .from('wedding-media')
        .remove([data.path])

      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    console.log('✅ File uploaded successfully:', data.path)

    return NextResponse.json({
      success: true,
      data: dbData,
      storagePath: data.path,
      publicUrl: publicUrlData.publicUrl
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      error: error.message || 'Upload failed'
    }, { status: 500 })
  }
}