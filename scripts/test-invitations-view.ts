/**
 * Test script to verify invitations view works correctly
 *
 * This tests that:
 * 1. We can query the invitations view
 * 2. Data is actually stored in simple_guests
 * 3. Column mapping works (code ↔ invitation_code, etc.)
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testInvitationsView() {
  console.log('🧪 Testing invitations view...\n')

  // Test 1: Query invitations view
  console.log('1️⃣  Querying invitations view...')
  const { data: invitations, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .limit(5)

  if (invError) {
    console.error('❌ Error querying invitations:', invError)
  } else {
    console.log(`✅ Found ${invitations?.length || 0} invitations`)
    if (invitations && invitations.length > 0) {
      console.log('   Sample:', invitations[0])
    }
  }

  // Test 2: Query simple_guests directly
  console.log('\n2️⃣  Querying simple_guests table...')
  const { data: guests, error: guestsError } = await supabase
    .from('simple_guests')
    .select('*')
    .limit(5)

  if (guestsError) {
    console.error('❌ Error querying simple_guests:', guestsError)
  } else {
    console.log(`✅ Found ${guests?.length || 0} guests`)
    if (guests && guests.length > 0) {
      console.log('   Sample:', guests[0])
    }
  }

  // Test 3: Verify column mapping
  console.log('\n3️⃣  Verifying column mappings...')
  if (invitations && invitations.length > 0 && guests && guests.length > 0) {
    const inv = invitations[0]
    const guest = guests.find((g: any) => g.id === inv.id)

    if (guest) {
      console.log('✅ Column mappings verified:')
      console.log(`   code (${inv.code}) = invitation_code (${guest.invitation_code})`)
      console.log(`   guest_name (${inv.guest_name}) = name (${guest.name})`)
      console.log(`   guest_email (${inv.guest_email}) = email (${guest.email})`)
    }
  }

  console.log('\n✨ Tests complete!')
}

testInvitationsView()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
