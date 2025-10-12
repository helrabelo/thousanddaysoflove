#!/usr/bin/env node
/**
 * Import Timeline to Sanity Studio
 *
 * Uses Sanity's client API to directly create the timelinePage document.
 * Run: node scripts/migration/import-timeline-to-sanity.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const timelineData = require('./sanity-timeline-import.json');

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function checkExistingTimeline() {
  console.log('\n🔍 Checking for existing timeline document...');
  const query = '*[_type == "timelinePage"][0]';
  const existing = await client.fetch(query);
  return existing;
}

async function importTimeline() {
  console.log('\n=== TIMELINE IMPORT TO SANITY ===\n');

  // Validate environment
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID not found in .env.local');
    process.exit(1);
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ SANITY_API_WRITE_TOKEN not found in .env.local');
    process.exit(1);
  }

  console.log('✅ Environment configured');
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(`   Write Token: ${process.env.SANITY_API_WRITE_TOKEN.substring(0, 20)}...`);

  try {
    // Check for existing timeline document
    const existing = await checkExistingTimeline();

    if (existing) {
      console.log(`⚠️  Timeline document already exists (ID: ${existing._id})`);
      console.log('\nOptions:');
      console.log('1. Delete existing document in Studio and run this script again');
      console.log('2. Manually update the existing document');
      console.log('3. Run with --force flag to replace (not implemented yet)');
      process.exit(0);
    }

    console.log('✅ No existing timeline found - proceeding with import');

    // Create the document
    console.log('\n📝 Creating timeline document...');
    const result = await client.create(timelineData);

    console.log('\n✅ Timeline imported successfully!');
    console.log(`   Document ID: ${result._id}`);
    console.log(`   Document Type: ${result._type}`);
    console.log(`   Phases: ${result.phases?.length || 0}`);

    // Count total events
    const totalEvents = result.phases?.reduce(
      (sum, phase) => sum + (phase.events?.length || 0),
      0
    );
    console.log(`   Total Events: ${totalEvents}`);

    console.log('\n📋 Next Steps:');
    console.log('1. Open Sanity Studio: http://localhost:3002/studio');
    console.log('2. Navigate to: Páginas → Nossa História');
    console.log('3. Add images to each of the 15 timeline events');
    console.log('4. Publish the document');
    console.log('5. Update frontend to load from Sanity\n');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    if (error.response) {
      console.error('Response details:', error.response);
    }
    process.exit(1);
  }
}

// Run the import
importTimeline();
