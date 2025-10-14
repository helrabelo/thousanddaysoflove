/**
 * Check what exists in cloud Supabase database
 * Run with: npx tsx scripts/check-cloud-db.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function checkDatabase() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  console.log('🔍 Checking Cloud Supabase Database...\n')

  // Check if functions exist
  console.log('📋 Checking Functions:')

  const functions = [
    'create_guest_with_invitation',
    'create_guest_session',
    'generate_guest_invitation_code',
    'verify_shared_password',
  ]

  for (const fn of functions) {
    try {
      const { error } = await supabase.rpc(fn as any)
      if (error && error.message.includes('not find')) {
        console.log(`  ❌ ${fn} - NOT FOUND`)
      } else {
        console.log(`  ✅ ${fn} - EXISTS`)
      }
    } catch (err: any) {
      if (err.message?.includes('not find')) {
        console.log(`  ❌ ${fn} - NOT FOUND`)
      } else {
        console.log(`  ⚠️  ${fn} - ${err.message}`)
      }
    }
  }

  // Check tables
  console.log('\n📋 Checking Tables:')

  const tables = [
    'guest_photos',
    'guest_sessions',
    'wedding_auth_config',
    'simple_guests',
    'guest_posts',
    'post_reactions',
    'post_comments',
  ]

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1)
    if (error) {
      console.log(`  ❌ ${table} - ${error.message}`)
    } else {
      console.log(`  ✅ ${table} - EXISTS`)
    }
  }

  // Check guest_photos columns
  console.log('\n📋 Checking guest_photos columns:')
  const { data: photos, error: photosError } = await supabase
    .from('guest_photos')
    .select('*')
    .limit(1)

  if (!photosError && photos) {
    const columns = photos.length > 0 ? Object.keys(photos[0]) : []
    const requiredColumns = [
      'storage_path',
      'storage_bucket',
      'is_video',
      'moderation_status',
    ]

    requiredColumns.forEach((col) => {
      if (columns.includes(col)) {
        console.log(`  ✅ ${col}`)
      } else {
        console.log(`  ❌ ${col} - MISSING`)
      }
    })
  }

  // Check storage bucket
  console.log('\n📋 Checking Storage Buckets:')
  const { data: buckets } = await supabase.storage.listBuckets()

  if (buckets) {
    const weddingPhotos = buckets.find((b) => b.name === 'wedding-photos')
    const weddingPosts = buckets.find((b) => b.name === 'wedding-posts')

    if (weddingPhotos) {
      console.log(`  ✅ wedding-photos bucket EXISTS (public: ${weddingPhotos.public})`)
    } else {
      console.log(`  ❌ wedding-photos bucket NOT FOUND`)
    }

    if (weddingPosts) {
      console.log(`  ✅ wedding-posts bucket EXISTS (public: ${weddingPosts.public})`)
    } else {
      console.log(`  ❌ wedding-posts bucket NOT FOUND`)
    }

    console.log(`     All buckets: ${buckets.map((b) => b.name).join(', ')}`)
  }

  // Check guest_posts RLS policies
  console.log('\n📋 Checking guest_posts RLS policies:')
  const { data: policies, error: policiesError } = await supabase.rpc(
    'exec_sql' as any,
    {
      query: `
        SELECT policyname, cmd, roles, qual, with_check
        FROM pg_policies
        WHERE tablename = 'guest_posts'
        ORDER BY cmd, policyname;
      `,
    }
  ).catch(() => ({ data: null, error: 'RPC not available' }))

  if (policiesError || !policies) {
    console.log('  ⚠️  Could not query policies (trying alternative method...)')

    // Try direct SQL query
    const { data: altPolicies, error: altError } = await supabase
      .from('pg_policies' as any)
      .select('policyname, cmd, roles')
      .eq('tablename', 'guest_posts')
      .catch(() => ({ data: null, error: 'Not accessible' }))

    if (altError || !altPolicies) {
      console.log('  ⚠️  Could not access RLS policies')
      console.log('  💡 Try running this SQL in Supabase Dashboard:')
      console.log(`     SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'guest_posts';`)
    } else {
      altPolicies.forEach((p: any) => {
        console.log(`  ✅ ${p.policyname} (${p.cmd}) - roles: ${p.roles || 'all'}`)
      })
    }
  } else {
    policies.forEach((p: any) => {
      console.log(`  ✅ ${p.policyname} (${p.cmd}) - roles: ${p.roles || 'all'}`)
    })
  }

  console.log('\n✨ Check complete!')
}

checkDatabase().catch(console.error)
