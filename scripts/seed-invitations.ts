/**
 * Seed Invitations Script
 *
 * Inserts sample invitation data into the production Supabase database
 * for testing the personalized invitation system.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SAMPLE_INVITATIONS = [
  {
    code: 'FAMILY001',
    guest_name: 'João Silva',
    guest_email: 'joao@example.com',
    relationship_type: 'family',
    plus_one_allowed: true,
    custom_message: 'Estamos ansiosos para compartilhar este momento especial com você e sua família!',
    rsvp_completed: false,
    gift_selected: false,
    photos_uploaded: false,
  },
  {
    code: 'FRIEND002',
    guest_name: 'Maria Santos',
    guest_email: 'maria@example.com',
    relationship_type: 'friend',
    plus_one_allowed: true,
    custom_message: 'Sua amizade significa muito para nós. Não perca!',
    rsvp_completed: false,
    gift_selected: false,
    photos_uploaded: false,
  },
  {
    code: 'FRIEND003',
    guest_name: 'Pedro Costa',
    guest_email: 'pedro@example.com',
    relationship_type: 'friend',
    plus_one_allowed: false,
    custom_message: 'Será uma honra ter você conosco neste dia tão especial!',
    rsvp_completed: false,
    gift_selected: false,
    photos_uploaded: false,
  },
  {
    code: 'WORK004',
    guest_name: 'Ana Oliveira',
    guest_email: 'ana@example.com',
    relationship_type: 'colleague',
    plus_one_allowed: false,
    custom_message: 'Obrigado por fazer parte da nossa jornada profissional e pessoal!',
    rsvp_completed: false,
    gift_selected: false,
    photos_uploaded: false,
  },
];

async function seedInvitations() {
  console.log('🌱 Starting invitation seeding...\n');

  // Check if table exists
  const { data: tables, error: tablesError } = await supabase
    .from('invitations')
    .select('code')
    .limit(1);

  if (tablesError) {
    console.error('❌ Error: invitations table not found or accessible');
    console.error('   Make sure migration 024 has been run on production database');
    console.error('   Error:', tablesError.message);
    process.exit(1);
  }

  console.log('✅ Invitations table found\n');

  // Delete existing sample data if any
  console.log('🧹 Cleaning existing sample data...');
  const codes = SAMPLE_INVITATIONS.map(inv => inv.code);
  const { error: deleteError } = await supabase
    .from('invitations')
    .delete()
    .in('code', codes);

  if (deleteError) {
    console.error('⚠️  Warning: Could not delete existing data:', deleteError.message);
  } else {
    console.log('✅ Cleaned existing sample data\n');
  }

  // Insert sample invitations
  console.log('📝 Inserting sample invitations...\n');

  for (const invitation of SAMPLE_INVITATIONS) {
    const { data, error } = await supabase
      .from('invitations')
      .insert(invitation)
      .select()
      .single();

    if (error) {
      console.error(`❌ Failed to insert ${invitation.code}:`, error.message);
    } else {
      console.log(`✅ Inserted: ${invitation.code} - ${invitation.guest_name}`);
      console.log(`   Relationship: ${invitation.relationship_type}`);
      console.log(`   Plus one: ${invitation.plus_one_allowed ? 'Yes' : 'No'}`);
      console.log(`   Message: "${invitation.custom_message.substring(0, 50)}..."`);
      console.log('');
    }
  }

  console.log('\n🎉 Seeding complete!\n');
  console.log('Test URLs:');
  console.log('---');
  SAMPLE_INVITATIONS.forEach(inv => {
    console.log(`http://localhost:3000/convite/${inv.code} - ${inv.guest_name}`);
  });
  console.log('---\n');
}

// Run the seed script
seedInvitations()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
