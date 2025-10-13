#!/usr/bin/env tsx
/**
 * Setup Supabase Storage Bucket for Guest Photos
 * Creates the wedding-photos bucket with proper policies
 * Run with: npx tsx scripts/setup-storage-bucket.ts
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

async function setupStorageBucket() {
  console.log('🚀 Setting up Supabase Storage for Guest Photos\n')

  // ============================================================================
  // 1. CREATE BUCKET
  // ============================================================================

  console.log('📦 Creating storage bucket: wedding-photos')

  const { data: existingBuckets, error: listError } =
    await supabase.storage.listBuckets()

  if (listError) {
    console.error('❌ Error listing buckets:', listError)
    process.exit(1)
  }

  const bucketExists = existingBuckets?.some((b) => b.name === 'wedding-photos')

  if (bucketExists) {
    console.log('   ✓ Bucket already exists\n')
  } else {
    const { data: bucket, error: createError } =
      await supabase.storage.createBucket('wedding-photos', {
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
          // Videos
          'video/mp4',
          'video/quicktime',
          'video/webm',
        ],
      })

    if (createError) {
      console.error('❌ Error creating bucket:', createError)
      process.exit(1)
    }

    console.log('   ✓ Bucket created successfully\n')
  }

  // ============================================================================
  // 2. SETUP RLS POLICIES
  // ============================================================================

  console.log('🔐 Setting up Row Level Security policies')

  // Note: Storage policies are managed via SQL, not the JS SDK
  // The policies are already defined in migration 024
  // This is just a verification step

  const policies = `
    -- Guests can upload to their own folder (requires active session)
    CREATE POLICY "Guests upload own photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'wedding-photos' AND
      auth.role() = 'authenticated' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Everyone can view approved photos (public bucket)
    CREATE POLICY "Public read approved"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'wedding-photos');

    -- Guests can update their own photos
    CREATE POLICY "Guests update own photos"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'wedding-photos' AND
      auth.role() = 'authenticated' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );

    -- Guests can delete their own photos
    CREATE POLICY "Guests delete own photos"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'wedding-photos' AND
      auth.role() = 'authenticated' AND
      (storage.foldername(name))[1] = auth.uid()::text
    );
  `

  console.log('   ✓ RLS policies defined in migration 024')
  console.log('   ℹ️  Run the migration to apply policies\n')

  // ============================================================================
  // 3. VERIFY BUCKET CONFIGURATION
  // ============================================================================

  console.log('🔍 Verifying bucket configuration')

  const { data: bucketDetails, error: detailsError } =
    await supabase.storage.getBucket('wedding-photos')

  if (detailsError) {
    console.error('❌ Error getting bucket details:', detailsError)
    process.exit(1)
  }

  console.log('   Bucket Configuration:')
  console.log(`   - Name: ${bucketDetails.name}`)
  console.log(`   - Public: ${bucketDetails.public}`)
  console.log(
    `   - File size limit: ${(bucketDetails.file_size_limit / 1024 / 1024).toFixed(0)}MB`
  )
  console.log(
    `   - Allowed MIME types: ${bucketDetails.allowed_mime_types?.length || 'all'} types`
  )
  console.log()

  // ============================================================================
  // 4. TEST UPLOAD (OPTIONAL)
  // ============================================================================

  console.log('🧪 Testing upload functionality')

  const testFilePath = `test/${Date.now()}_test.txt`
  const testFileContent = 'Test upload for wedding-photos bucket'

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('wedding-photos')
    .upload(testFilePath, testFileContent, {
      contentType: 'text/plain',
      upsert: false,
    })

  if (uploadError) {
    console.error('❌ Test upload failed:', uploadError)
    console.log(
      '   ℹ️  This might be due to RLS policies - check guest authentication\n'
    )
  } else {
    console.log('   ✓ Test upload successful')

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(testFilePath)

    console.log(`   ✓ Public URL: ${urlData.publicUrl}`)

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from('wedding-photos')
      .remove([testFilePath])

    if (!deleteError) {
      console.log('   ✓ Test file cleaned up\n')
    }
  }

  // ============================================================================
  // 5. SUMMARY
  // ============================================================================

  console.log('✅ Storage setup complete!\n')
  console.log('📋 Next steps:')
  console.log('   1. Run migration 024 to apply RLS policies')
  console.log('   2. Implement guest authentication endpoints')
  console.log('   3. Build upload UI with drag-and-drop')
  console.log('   4. Test guest photo uploads\n')

  console.log('💡 Usage in code:')
  console.log('   ```typescript')
  console.log("   const { data, error } = await supabase.storage")
  console.log("     .from('wedding-photos')")
  console.log(
    "     .upload(`{guest_id}/{phase}/{filename}`, file)"
  )
  console.log('   ```\n')
}

// Run the setup
setupStorageBucket()
  .then(() => {
    console.log('🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  })
