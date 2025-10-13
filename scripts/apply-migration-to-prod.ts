/**
 * Apply Migration to Production Database
 *
 * Applies the invitations and guest posts migration (024) to production Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('🚀 Applying migration to production database...\n');
  console.log(`📍 Target: ${supabaseUrl}\n`);

  // Read migration file
  const migrationPath = path.resolve(process.cwd(), 'supabase/migrations/024_invitations_and_guest_posts.sql');

  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  console.log('📄 Reading migration file...');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  console.log('✅ Migration file loaded\n');

  // Split the SQL file into individual statements
  // This is a simple split - production systems should use a proper SQL parser
  const statements = migrationSQL
    .split(/;\s*$/gm)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`📝 Found ${statements.length} SQL statements\n`);
  console.log('⚠️  WARNING: This will modify your PRODUCTION database!');
  console.log('⏰ Starting in 3 seconds... (Ctrl+C to cancel)\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('▶️  Executing migration...\n');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments and empty statements
    if (!statement || statement.startsWith('--') || statement.startsWith('/*')) {
      continue;
    }

    // Show progress for table creation and major operations
    if (statement.includes('CREATE TABLE')) {
      const match = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/);
      if (match) {
        console.log(`📊 Creating table: ${match[1]}...`);
      }
    } else if (statement.includes('CREATE INDEX')) {
      const match = statement.match(/CREATE INDEX (\w+)/);
      if (match) {
        console.log(`🔍 Creating index: ${match[1]}...`);
      }
    } else if (statement.includes('CREATE POLICY')) {
      const match = statement.match(/CREATE POLICY "([^"]+)"/);
      if (match) {
        console.log(`🔒 Creating policy: ${match[1]}...`);
      }
    } else if (statement.includes('CREATE TRIGGER')) {
      const match = statement.match(/CREATE TRIGGER (\w+)/);
      if (match) {
        console.log(`⚡ Creating trigger: ${match[1]}...`);
      }
    } else if (statement.includes('INSERT INTO')) {
      console.log(`📝 Inserting sample data...`);
    }

    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      });

      // If RPC doesn't exist, try direct query
      if (error?.message?.includes('exec_sql')) {
        console.log('\n⚠️  Note: RPC method not available. Please run this SQL manually in Supabase SQL Editor:');
        console.log('\n------- SQL TO RUN IN SUPABASE DASHBOARD -------\n');
        console.log(migrationSQL);
        console.log('\n------- END SQL -------\n');
        console.log('\nSteps:');
        console.log('1. Go to https://supabase.com/dashboard/project/uottcbjzpiudgmqzhuii/sql');
        console.log('2. Create a new query');
        console.log('3. Paste the SQL above');
        console.log('4. Click "Run"');
        console.log('5. Then run: npm run seed:invitations\n');
        process.exit(0);
      }

      if (error) {
        // Some errors are expected (table already exists, etc.)
        if (
          error.message.includes('already exists') ||
          error.message.includes('duplicate key')
        ) {
          console.log(`   ⚠️  Already exists, skipping...`);
        } else {
          console.error(`   ❌ Error: ${error.message}`);
          errorCount++;
        }
      } else {
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exception:`, err);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Completed: ${successCount} statements executed`);
  if (errorCount > 0) {
    console.log(`⚠️  Errors: ${errorCount} statements failed`);
  }
  console.log('='.repeat(50) + '\n');

  // Verify tables were created
  console.log('🔍 Verifying tables...\n');
  const tables = ['invitations', 'guest_posts', 'post_reactions', 'post_comments', 'pinned_posts'];

  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.log(`❌ ${table}: Not accessible (${error.message})`);
    } else {
      console.log(`✅ ${table}: OK`);
    }
  }

  console.log('\n✅ Migration application complete!');
  console.log('\n📝 Next step: Run "npm run seed:invitations" to add sample data\n');
}

// Run the migration
applyMigration()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
