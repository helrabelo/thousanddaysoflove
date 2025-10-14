/**
 * Check guest_posts RLS policies
 * Run with: npx tsx scripts/check-guest-posts-policies.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkPolicies() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('🔍 Checking guest_posts RLS Policies...\n')

  // Test 1: Can we insert with service role?
  console.log('📝 Test 1: Insert with service_role key')
  const { data: testPost, error: insertError } = await supabase
    .from('guest_posts')
    .insert({
      guest_name: 'Test Guest',
      content: 'Test post from check script',
      post_type: 'text',
      status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    console.log('  ❌ INSERT FAILED:', insertError.message)
    console.log('  Details:', JSON.stringify(insertError, null, 2))
  } else {
    console.log('  ✅ INSERT SUCCESS')
    console.log('  Created post ID:', testPost?.id)

    // Clean up test post
    const { error: deleteError } = await supabase
      .from('guest_posts')
      .delete()
      .eq('id', testPost.id)

    if (deleteError) {
      console.log('  ⚠️  Could not delete test post:', deleteError.message)
    } else {
      console.log('  🗑️  Test post cleaned up')
    }
  }

  // Test 2: Check if table has RLS enabled
  console.log('\n📋 Test 2: Check if RLS is enabled')
  const { data: tableInfo, error: tableError } = await supabase.rpc(
    'exec_sql' as any,
    {
      sql: `
        SELECT tablename, rowsecurity
        FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'guest_posts';
      `,
    }
  )

  if (!tableError && tableInfo) {
    console.log('  Table info:', tableInfo)
  } else {
    console.log('  ⚠️  Could not get table info')
  }

  // Test 3: Try to list existing posts
  console.log('\n📋 Test 3: List existing posts')
  const { data: posts, error: selectError } = await supabase
    .from('guest_posts')
    .select('id, guest_name, status, created_at')
    .limit(5)

  if (selectError) {
    console.log('  ❌ SELECT FAILED:', selectError.message)
  } else {
    console.log(`  ✅ SELECT SUCCESS - Found ${posts?.length || 0} posts`)
    if (posts && posts.length > 0) {
      posts.forEach((p: any) => {
        console.log(`    - ${p.id}: ${p.guest_name} (${p.status})`)
      })
    }
  }

  console.log('\n✨ Check complete!')
}

checkPolicies().catch(console.error)
