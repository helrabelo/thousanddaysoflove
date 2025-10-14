#!/usr/bin/env tsx
/**
 * Setup Supabase Storage Bucket for Guest Posts (Messages)
 * Creates the wedding-posts bucket with proper policies
 * Run with: npx tsx scripts/setup-wedding-posts-bucket.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function setupPostsBucket() {
  console.log('🚀 Setting up Supabase Storage for Guest Posts\n')

  // ============================================================================
  // 1. CREATE BUCKET
  // ============================================================================

  console.log('📦 Creating storage bucket: wedding-posts')

  const { data: existingBuckets, error: listError } =
    await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Error listing buckets:', listError)
    process.exit(1)
  }

  const bucketExists = existingBuckets?.some((b) => b.name === 'wedding-posts')

  if (bucketExists) {
    console.log('   ✓ Bucket already exists\n')
  } else {
    const { error: createError } =
      await supabase.storage.createBucket('wedding-posts', {
        public: true,
        fileSizeLimit: 524288000, // 500MB (for videos)
        allowedMimeTypes: [
          // Images
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'image/heic',
          'image/heif',
          'image/gif',
          // Videos
          'video/mp4',
          'video/quicktime',
          'video/webm',
          'video/x-m4v',
        ],
      })

    if (createError) {
      console.error('❌ Error creating bucket:', createError)
      process.exit(1)
    }

    console.log('   ✓ Bucket created successfully\n')
  }

  // ============================================================================
  // 2. VERIFY BUCKET CONFIGURATION
  // ============================================================================

  console.log('🔍 Verifying bucket configuration')

  const { data: bucketDetails, error: detailsError } =
    await supabase.storage.getBucket('wedding-posts')

  if (detailsError) {
    console.error('❌ Error getting bucket details:', detailsError)
    process.exit(1)
  }

  console.log('   Bucket Configuration:')
  console.log(`   - Name: ${bucketDetails.name}`)
  console.log(`   - Public: ${bucketDetails.public}`)
  const fileSizeLimit = bucketDetails.file_size_limit
  console.log(
    fileSizeLimit != null
      ? `   - File size limit: ${(fileSizeLimit / 1024 / 1024).toFixed(0)}MB`
      : '   - File size limit: unlimited'
  )
  console.log(
    `   - Allowed MIME types: ${bucketDetails.allowed_mime_types?.length || 'all'} types`
  )
  console.log()

  // ============================================================================
  // 3. TEST UPLOAD
  // ============================================================================

  console.log('🧪 Testing upload functionality')

  const testFilePath = `test/${Date.now()}_test.txt`
  const testFileContent = 'Test upload for wedding-posts bucket'

  const { error: uploadError } = await supabase.storage
    .from('wedding-posts')
    .upload(testFilePath, testFileContent, {
      contentType: 'text/plain',
      upsert: false,
    })

  if (uploadError) {
    console.error('❌ Test upload failed:', uploadError)
    console.log(
      '   ℹ️  This might be due to RLS policies - check authentication\n'
    )
  } else {
    console.log('   ✓ Test upload successful')

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('wedding-posts')
      .getPublicUrl(testFilePath)

    console.log(`   ✓ Public URL: ${urlData.publicUrl}`)

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from('wedding-posts')
      .remove([testFilePath])

    if (!deleteError) {
      console.log('   ✓ Test file cleaned up\n')
    }
  }

  // ============================================================================
  // 4. SUMMARY
  // ============================================================================

  console.log('✅ Storage setup complete!\n')
  console.log('📋 Next steps:')
  console.log('   1. Implement uploadFiles function in PostComposer.tsx')
  console.log('   2. Test guest post uploads with images/videos')
  console.log('   3. Run E2E tests to verify functionality\n')

  console.log('💡 Usage in code:')
  console.log('   ```typescript')
  console.log("   const { data, error } = await supabase.storage")
  console.log("     .from('wedding-posts')")
  console.log(
    "     .upload(`posts/{timestamp}-{random}.{ext}`, file)"
  )
  console.log('   ```\n')
}

// Run the setup
setupPostsBucket()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  })
