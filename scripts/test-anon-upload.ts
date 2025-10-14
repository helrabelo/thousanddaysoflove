/**
 * Test if anonymous users can upload to wedding-posts bucket
 * Run with: npx tsx scripts/test-anon-upload.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // ANON key, not service role

async function testAnonUpload() {
  // Create client with ANON key (simulating frontend behavior)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('🧪 Testing anonymous upload to wedding-posts bucket...\n')

  // Create a simple test file
  const testContent = 'Test file content from anonymous client'
  const testFile = new Blob([testContent], { type: 'text/plain' })
  const fileName = `test-${Date.now()}.txt`
  const filePath = `posts/${fileName}`

  console.log('📤 Attempting to upload file:', filePath)
  console.log('   Using ANON key (not service role)\n')

  const { data, error } = await supabase.storage
    .from('wedding-posts')
    .upload(filePath, testFile, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.log('❌ UPLOAD FAILED (This is the problem!)')
    console.log('   Error:', error.message)
    console.log('   Error code:', error.statusCode)
    console.log('   Full error:', JSON.stringify(error, null, 2))
    console.log('\n💡 Solution: The wedding-posts bucket needs RLS policies to allow anonymous uploads')
    console.log('   or the PostComposer should upload via an API route that uses service role.\n')
  } else {
    console.log('✅ UPLOAD SUCCESS')
    console.log('   File path:', data.path)

    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from('wedding-posts')
      .remove([filePath])

    if (deleteError) {
      console.log('   ⚠️  Could not delete test file:', deleteError.message)
    } else {
      console.log('   🗑️  Test file cleaned up\n')
    }
  }
}

testAnonUpload().catch(console.error)
