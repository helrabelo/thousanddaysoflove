#!/usr/bin/env node
/**
 * Verify Timeline Import
 *
 * Queries Sanity to verify the timeline document was created successfully.
 * Run: node scripts/migration/verify-timeline-import.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

async function verifyTimeline() {
  console.log('\n=== TIMELINE VERIFICATION ===\n');

  try {
    const query = '*[_type == "timelinePage"][0]';
    const timeline = await client.fetch(query);

    if (!timeline) {
      console.error('❌ Timeline document not found');
      process.exit(1);
    }

    console.log('✅ Timeline document found!');
    console.log(`   Document ID: ${timeline._id}`);
    console.log(`   Created At: ${timeline._createdAt}`);
    console.log(`   Updated At: ${timeline._updatedAt}`);
    console.log(`   Status: ${timeline._id.startsWith('drafts.') ? 'Draft' : 'Published'}`);

    console.log('\n📊 Content Summary:');
    console.log(`   Title: ${timeline.title}`);
    console.log(`   Hero Title: ${timeline.hero?.title}`);
    console.log(`   Phases: ${timeline.phases?.length || 0}`);

    // Analyze each phase
    if (timeline.phases && timeline.phases.length > 0) {
      console.log('\n📅 Phase Breakdown:');
      timeline.phases.forEach((phase, idx) => {
        console.log(`\n   ${idx + 1}. ${phase.title} (${phase.dayRange})`);
        console.log(`      Events: ${phase.events?.length || 0}`);
        console.log(`      Subtitle: ${phase.subtitle?.substring(0, 50)}...`);

        // Show first 2 events from each phase as examples
        if (phase.events && phase.events.length > 0) {
          console.log(`      Sample events:`);
          phase.events.slice(0, 2).forEach(event => {
            console.log(`        • Day ${event.dayNumber}: ${event.title}`);
          });
          if (phase.events.length > 2) {
            console.log(`        ... and ${phase.events.length - 2} more`);
          }
        }
      });
    }

    // Count events with/without images
    const allEvents = timeline.phases?.flatMap(p => p.events || []) || [];
    const eventsWithImages = allEvents.filter(e => e.image).length;
    const eventsWithoutImages = allEvents.length - eventsWithImages;

    console.log('\n📷 Image Status:');
    console.log(`   Total Events: ${allEvents.length}`);
    console.log(`   With Images: ${eventsWithImages}`);
    console.log(`   Without Images: ${eventsWithoutImages}`);

    if (eventsWithoutImages > 0) {
      console.log('\n⚠️  Action Required:');
      console.log('   Some events are missing images. Add them in Sanity Studio:');
      console.log('   http://localhost:3002/studio');
    }

    // SEO check
    console.log('\n🔍 SEO Status:');
    if (timeline.seo) {
      console.log(`   ✅ Title: ${timeline.seo.title || 'Not set'}`);
      console.log(`   ✅ Description: ${timeline.seo.description?.substring(0, 50) || 'Not set'}...`);
      console.log(`   ${timeline.seo.ogImage ? '✅' : '⚠️ '} OG Image: ${timeline.seo.ogImage ? 'Set' : 'Not set'}`);
    } else {
      console.log('   ⚠️  SEO metadata not configured');
    }

    console.log('\n✅ Verification complete!\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyTimeline();
