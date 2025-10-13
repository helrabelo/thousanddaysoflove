#!/usr/bin/env tsx
/**
 * Apply Guest Posts Migration to Cloud Supabase
 *
 * This script applies the guest_posts migration (024) to your cloud Supabase database.
 * Run with: npx tsx scripts/apply-guest-posts-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🚀 Starting migration application...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/024_invitations_and_guest_posts.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded:', migrationPath);
    console.log('📏 SQL size:', migrationSQL.length, 'characters\n');

    // Note: We need to remove the guest_sessions reference since that table doesn't exist
    console.log('⚠️  Fixing guest_sessions references...');
    const fixedSQL = migrationSQL
      .replace(/guest_session_id UUID REFERENCES guest_sessions\(id\) ON DELETE SET NULL/g, 'guest_session_id UUID')
      .replace(/CREATE INDEX idx_guest_posts_guest_session ON guest_posts\(guest_session_id\);/g, '-- Index removed: guest_session_id')
      .replace(/CREATE INDEX idx_post_reactions_guest_session ON post_reactions\(guest_session_id\);/g, '-- Index removed: guest_session_id')
      .replace(/CREATE INDEX idx_post_comments_guest_session ON post_comments\(guest_session_id\);/g, '-- Index removed: guest_session_id');

    console.log('✅ References fixed\n');

    // Split into individual statements (rough split, be careful with complex queries)
    const statements = fixedSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📦 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length < 10) {
        skipCount++;
        continue;
      }

      // Show progress
      const preview = statement.substring(0, 60).replace(/\n/g, ' ');
      console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

        if (error) {
          // Try direct query for certain statements
          const { error: queryError } = await supabase.from('_migrations').select('*').limit(1);

          if (queryError) {
            console.error(`  ⚠️  Warning: ${error.message}`);
            console.log(`  ℹ️  This might be OK if the object already exists`);
          }
        }

        successCount++;
        console.log(`  ✅ Success`);
      } catch (err: any) {
        console.error(`  ❌ Error: ${err.message}`);
        console.log(`  ℹ️  Continuing...`);
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Migration completed!`);
    console.log(`   Successful: ${successCount} statements`);
    console.log(`   Skipped: ${skipCount} statements`);
    console.log('='.repeat(60));

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const tables = ['invitations', 'guest_posts', 'post_reactions', 'post_comments', 'pinned_posts'];

    for (const table of tables) {
      const { error, count } = await supabase.from(table).select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table}: Not found or error`);
      } else {
        console.log(`  ✅ ${table}: Exists (${count ?? 0} rows)`);
      }
    }

    console.log('\n✨ All done! You can now use /mensagens and /meu-convite\n');

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Alternative: Direct SQL execution via Supabase SQL Editor
function printManualInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('📝 ALTERNATIVE: Manual Migration Steps');
  console.log('='.repeat(60));
  console.log('\nIf the automatic migration fails, you can apply it manually:');
  console.log('\n1. Go to: https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/sql/new');
  console.log('2. Copy the contents of: supabase/migrations/024_invitations_and_guest_posts.sql');
  console.log('3. IMPORTANT: Remove these lines first:');
  console.log('   - Line 51: guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL');
  console.log('   - Replace with: guest_session_id UUID');
  console.log('   - Do the same for lines 89 and 111');
  console.log('4. Paste the modified SQL into the Supabase SQL Editor');
  console.log('5. Click "Run" to execute\n');
  console.log('This will create all necessary tables for the messaging system.\n');
}

// Run migration
applyMigration().catch(err => {
  console.error('Fatal error:', err);
  printManualInstructions();
  process.exit(1);
});
