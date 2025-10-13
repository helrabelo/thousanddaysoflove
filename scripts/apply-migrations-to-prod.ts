/**
 * Apply Missing Migrations to Production Supabase
 * Run with: npx ts-node scripts/apply-migrations-to-prod.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function applyMigrations() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Migrations to apply (in order)
  const migrations = [
    '023_guest_authentication_system.sql',
    '20251013062000_unified_guest_photos_supabase_storage.sql',
    '20251013100000_create_guest_with_invitation_function.sql',
  ]

  console.log('🚀 Applying migrations to production Supabase...\n')

  for (const migration of migrations) {
    console.log(`📄 Applying ${migration}...`)

    const migrationPath = path.join(
      __dirname,
      '../supabase/migrations',
      migration
    )

    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ Migration file not found: ${migrationPath}`)
      continue
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8')

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

      if (error) {
        // Try direct query if RPC doesn't work
        console.log('   Trying direct query...')
        const response = await fetch(
          `${supabaseUrl}/rest/v1/rpc/query`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: supabaseServiceKey,
              Authorization: `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ query: sql }),
          }
        )

        if (!response.ok) {
          throw new Error(
            `HTTP error! status: ${response.status} - ${await response.text()}`
          )
        }

        console.log(`✅ ${migration} applied successfully`)
      } else {
        console.log(`✅ ${migration} applied successfully`)
      }
    } catch (err) {
      console.error(`❌ Error applying ${migration}:`, err)
      console.log('   You may need to apply this manually in Supabase dashboard')
    }

    console.log('')
  }

  console.log('✨ Migration process complete!')
  console.log(
    '\n💡 If any migrations failed, please apply them manually via:'
  )
  console.log('   https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/editor/sql')
}

applyMigrations().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
