# Quick Start Migration Guide

**Project**: Thousand Days of Love - CMS Consolidation
**For**: Developers ready to execute the migration
**Estimated Time**: 3 weeks (15 working days)

---

## Prerequisites Checklist

Before starting migration, ensure you have:

- [ ] Full Supabase database backup created
- [ ] Staging environment with production data copy
- [ ] Sanity project configured and deployed
- [ ] `SANITY_API_TOKEN` with write permissions
- [ ] `SUPABASE_SERVICE_ROLE_KEY` for migration scripts
- [ ] All team members trained on Sanity Studio
- [ ] Migration window scheduled (recommend weekend)
- [ ] Rollback plan documented and reviewed

---

## Week 1: Schema Design & Migration Scripts

### Day 1-2: Create Sanity Schemas

#### Task 1.1: Gallery Schemas
```bash
# Create gallery schemas
touch src/sanity/schemas/documents/galleryImage.ts
touch src/sanity/schemas/documents/galleryVideo.ts
```

Copy schema definitions from `CMS_CONSOLIDATION_PLAN.md` section 1.1

#### Task 1.2: Gift Registry Schemas
```bash
# Create gift schemas
touch src/sanity/schemas/documents/giftItem.ts
touch src/sanity/schemas/documents/giftCategory.ts
```

Copy schema definitions from `CMS_CONSOLIDATION_PLAN.md` section 1.2

#### Task 1.3: Timeline Schema
```bash
# Create timeline schema
touch src/sanity/schemas/documents/timelineEvent.ts
```

Copy schema definition from `CMS_CONSOLIDATION_PLAN.md` section 1.3

#### Task 1.4: Register Schemas
```typescript
// src/sanity/schemas/documents/index.ts
export { default as galleryImage } from './galleryImage'
export { default as galleryVideo } from './galleryVideo'
export { default as giftItem } from './giftItem'
export { default as giftCategory } from './giftCategory'
export { default as timelineEvent } from './timelineEvent'

// Add to documentSchemas array
export const documentSchemas = [
  pet,
  storyCard,
  featureCard,
  weddingSettings,
  // NEW
  galleryImage,
  galleryVideo,
  giftItem,
  giftCategory,
  timelineEvent,
]
```

#### Task 1.5: Update Desk Structure
```bash
# Edit Sanity Studio desk structure
code src/sanity/desk/index.ts
```

Add Gallery, Timeline, and Gifts sections (see `CMS_CONSOLIDATION_PLAN.md` section 4.3)

#### Task 1.6: Deploy Sanity Studio
```bash
# Deploy updated studio
npm run sanity:deploy
```

### Day 3-4: Write Migration Scripts

#### Task 2.1: Setup Migration Directory
```bash
# Create migration scripts directory
mkdir -p scripts/migration

# Install dependencies
npm install node-fetch@2
```

#### Task 2.2: Create Gallery Migration Script
```bash
touch scripts/migration/migrate-gallery-to-sanity.ts
```

Copy script from `CMS_CONSOLIDATION_PLAN.md` section 2.1

#### Task 2.3: Create Gift Registry Migration Script
```bash
touch scripts/migration/migrate-gifts-to-sanity.ts
```

Copy script from `CMS_CONSOLIDATION_PLAN.md` section 2.2

#### Task 2.4: Create Timeline Migration Script
```bash
touch scripts/migration/migrate-timeline-to-sanity.ts
```

Copy script from `CMS_CONSOLIDATION_PLAN.md` section 2.3

#### Task 2.5: Add Migration NPM Scripts
```json
// package.json
{
  "scripts": {
    "migrate:gallery": "tsx scripts/migration/migrate-gallery-to-sanity.ts",
    "migrate:gifts": "tsx scripts/migration/migrate-gifts-to-sanity.ts",
    "migrate:timeline": "tsx scripts/migration/migrate-timeline-to-sanity.ts",
    "migrate:all": "npm run migrate:gallery && npm run migrate:gifts && npm run migrate:timeline"
  }
}
```

### Day 5: Test Migration on Staging

#### Task 3.1: Setup Environment Variables
```bash
# .env.migration (for migration scripts)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
NEXT_PUBLIC_SUPABASE_URL=your_staging_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Task 3.2: Run Migration on Staging
```bash
# Test individual migrations
npm run migrate:gallery
npm run migrate:gifts
npm run migrate:timeline

# Or run all at once
npm run migrate:all
```

#### Task 3.3: Verify Migration
```bash
# Check Sanity Studio
# Browse to https://your-project.sanity.studio/studio

# Verify counts
# Gallery: ~180 images/videos
# Gifts: ~50 items + 5 categories
# Timeline: ~30 events
```

#### Task 3.4: Data Integrity Checks
```typescript
// scripts/verify-migration.ts
import { createClient } from '@sanity/client'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

async function verifyMigration() {
  const sanity = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    token: process.env.SANITY_API_TOKEN!,
    apiVersion: '2025-10-12',
    useCdn: false
  })

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Count gallery items
  const { data: supabaseMedia } = await supabase
    .from('media_items')
    .select('id', { count: 'exact', head: true })

  const sanityMedia = await sanity.fetch(`count(*[_type in ["galleryImage", "galleryVideo"]])`)

  console.log(`Supabase media: ${supabaseMedia}`)
  console.log(`Sanity media: ${sanityMedia}`)
  console.log(`Match: ${supabaseMedia === sanityMedia ? '✅' : '❌'}`)

  // Count gifts
  const { data: supabaseGifts } = await supabase
    .from('gifts')
    .select('id', { count: 'exact', head: true })

  const sanityGifts = await sanity.fetch(`count(*[_type == "giftItem"])`)

  console.log(`Supabase gifts: ${supabaseGifts}`)
  console.log(`Sanity gifts: ${sanityGifts}`)
  console.log(`Match: ${supabaseGifts === sanityGifts ? '✅' : '❌'}`)

  // Count timeline events
  const { data: supabaseEvents } = await supabase
    .from('timeline_events')
    .select('id', { count: 'exact', head: true })

  const sanityEvents = await sanity.fetch(`count(*[_type == "timelineEvent"])`)

  console.log(`Supabase events: ${supabaseEvents}`)
  console.log(`Sanity events: ${sanityEvents}`)
  console.log(`Match: ${supabaseEvents === sanityEvents ? '✅' : '❌'}`)
}

verifyMigration()
```

Run verification:
```bash
npm run verify-migration
```

---

## Week 2: Frontend Updates & Testing

### Day 1-2: Update Frontend Components

#### Task 4.1: Update Gallery Component
```bash
# Edit gallery component
code src/components/gallery/MasonryGallery.tsx
```

Replace Supabase queries with Sanity queries (see `CMS_CONSOLIDATION_PLAN.md` section 3.1)

```typescript
// Before (Supabase)
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'
const images = await SupabaseGalleryService.getMediaItems()

// After (Sanity)
import { client } from '@/sanity/lib/client'
const images = await client.fetch(`*[_type == "galleryImage" && isPublic == true]`)
```

#### Task 4.2: Update Gift Registry Component
```bash
# Edit gift component
code src/components/gifts/GiftRegistry.tsx
```

Replace Supabase queries with Sanity queries (see `CMS_CONSOLIDATION_PLAN.md` section 3.2)

#### Task 4.3: Update Timeline Component
```bash
# Edit timeline component
code src/components/timeline/Timeline.tsx
```

Replace Supabase queries with Sanity queries (see `CMS_CONSOLIDATION_PLAN.md` section 3.3)

#### Task 4.4: Remove Supabase Services
```bash
# Remove obsolete service files
rm src/lib/services/supabaseGalleryService.ts
rm src/lib/services/supabaseGiftService.ts
rm src/lib/services/supabaseTimelineService.ts
```

#### Task 4.5: Update TypeScript Types
```bash
# Edit types file
code src/types/wedding.ts
```

Remove Supabase types, add Sanity types (see `CMS_CONSOLIDATION_PLAN.md` section 5.2)

### Day 3: Update Admin Dashboard

#### Task 5.1: Remove Old Admin Pages
```bash
# Remove content admin pages (10 files)
rm -rf src/app/admin/galeria
rm -rf src/app/admin/presentes
rm -rf src/app/admin/timeline
rm -rf src/app/admin/about-us
rm -rf src/app/admin/hero-images
rm -rf src/app/admin/pets
rm -rf src/app/admin/wedding-settings
rm -rf src/app/admin/story-cards
rm -rf src/app/admin/homepage-features
rm -rf src/app/admin/hero-text
```

#### Task 5.2: Remove Admin Components
```bash
# Remove obsolete admin components (6 files)
rm src/components/gallery/GalleryAdmin.tsx
rm src/components/gallery/MediaUploader.tsx
rm src/components/admin/MediaManager.tsx
rm src/components/admin/MultiMediaManager.tsx
rm src/components/admin/ImageUpload.tsx
rm src/components/admin/WeddingConfigTab.tsx
```

#### Task 5.3: Update Admin Dashboard
```bash
# Edit main admin page
code src/app/admin/page.tsx
```

Update to show only 4 admin interfaces (see `CMS_CONSOLIDATION_PLAN.md` section 4.2)

### Day 4: End-to-End Testing

#### Test Checklist

**Gallery Page**
- [ ] Gallery page loads without errors
- [ ] Images display correctly from Sanity
- [ ] Categories filter works
- [ ] Featured images show correctly
- [ ] Image optimization works (WebP)
- [ ] Performance: Load time < 2 seconds

**Gift Registry Page**
- [ ] Gifts display correctly from Sanity
- [ ] Categories show correctly
- [ ] Prices display correctly
- [ ] "Buy Gift" flow works (Supabase purchase tracking)
- [ ] Performance: Load time < 2 seconds

**Timeline Page**
- [ ] Timeline events load correctly
- [ ] Images display correctly
- [ ] Fullbleed images work
- [ ] Milestone badges show
- [ ] Performance: Load time < 2 seconds

**Admin Interface**
- [ ] /admin shows 4 interfaces (3 Supabase + 1 Sanity)
- [ ] /admin/guests works (RSVP tracking)
- [ ] /admin/pagamentos works (payment tracking)
- [ ] /admin/analytics works (statistics)
- [ ] /studio opens Sanity Studio
- [ ] Old admin pages return 404

**Sanity Studio**
- [ ] Gallery section shows all migrated images
- [ ] Timeline section shows all events
- [ ] Gifts section shows all items + categories
- [ ] Edit/create/delete operations work
- [ ] Image uploads work
- [ ] Preview mode works

### Day 5: Production Deployment

#### Task 6.1: Pre-Deployment Checklist
- [ ] All tests pass on staging
- [ ] Data integrity verified (100% match)
- [ ] Performance benchmarks met
- [ ] Rollback plan documented
- [ ] Team notified of deployment

#### Task 6.2: Database Backup
```bash
# Create full Supabase backup
# Via Supabase Dashboard: Settings → Database → Create Backup
```

#### Task 6.3: Deploy to Production
```bash
# Commit changes
git add .
git commit -m "feat: migrate content from Supabase to Sanity CMS

- Create Sanity schemas for gallery, gifts, timeline
- Migrate 180+ gallery items to Sanity
- Migrate 50+ gift items to Sanity
- Migrate 30+ timeline events to Sanity
- Update frontend components to use Sanity
- Remove 10 obsolete admin pages
- Consolidate admin to 3 Supabase + 1 Sanity Studio
- Remove custom service layer
- Update TypeScript types

BREAKING CHANGE: Content now managed in Sanity CMS instead of Supabase"

# Push to main
git push origin main

# Vercel will auto-deploy
```

#### Task 6.4: Run Production Migration
```bash
# Update .env.migration for production
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token
NEXT_PUBLIC_SUPABASE_URL=your_production_url
SUPABASE_SERVICE_ROLE_KEY=your_production_key

# Run migration
npm run migrate:all

# Verify
npm run verify-migration
```

#### Task 6.5: Smoke Testing
- [ ] Visit homepage → No errors
- [ ] Visit /galeria → Images load
- [ ] Visit /presentes → Gifts load
- [ ] Visit /timeline → Events load
- [ ] Submit RSVP → Works
- [ ] Buy gift → Purchase tracked
- [ ] Check /admin → 4 interfaces
- [ ] Check /studio → Content visible

---

## Week 3: Database Cleanup & Monitoring

### Day 1: Monitor Production

#### Task 7.1: Error Monitoring
```bash
# Check Vercel logs
vercel logs --follow

# Check browser console errors
# Visit each page and check console

# Check Sentry (if configured)
# Monitor error rates
```

#### Task 7.2: Performance Monitoring
```bash
# Run Lighthouse audits
npm run lighthouse

# Check Core Web Vitals
# Vercel Dashboard → Analytics → Core Web Vitals

# Compare before/after metrics
```

#### Task 7.3: User Feedback
- [ ] Content editors test Sanity Studio
- [ ] Stakeholders review pages
- [ ] Collect feedback on admin experience

### Day 2-3: Database Cleanup

⚠️ **CRITICAL**: Only run after 48 hours of stable production operation!

#### Task 8.1: Mark Supabase Tables Read-Only
```sql
-- Create read-only role
CREATE ROLE readonly_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;

-- Switch tables to read-only (safety measure)
REVOKE INSERT, UPDATE, DELETE ON public.media_items FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON public.timeline_events FROM PUBLIC;
REVOKE INSERT, UPDATE, DELETE ON public.gifts FROM PUBLIC;
```

#### Task 8.2: Wait 2 Weeks
Keep Supabase content tables for 2 weeks as safety buffer. Monitor for any issues.

#### Task 8.3: Final Cleanup Migration
```sql
-- Migration: Remove content tables
-- ONLY RUN AFTER 2 WEEKS OF STABLE OPERATION

BEGIN;

-- Drop content tables
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.timeline_event_media CASCADE;
DROP TABLE IF EXISTS public.hero_images CASCADE;
DROP TABLE IF EXISTS public.our_family_pets CASCADE;
DROP TABLE IF EXISTS public.about_us_content CASCADE;
DROP TABLE IF EXISTS public.wedding_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;
DROP TABLE IF EXISTS public.hero_text CASCADE;

-- Restructure gifts table
ALTER TABLE public.gifts RENAME TO gift_purchases;

-- Remove content columns
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS name;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS description;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS price;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS image_url;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS registry_url;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS quantity_desired;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS category;
ALTER TABLE public.gift_purchases DROP COLUMN IF EXISTS priority;

-- Add Sanity reference
ALTER TABLE public.gift_purchases ADD COLUMN IF NOT EXISTS sanity_gift_id VARCHAR(50);
ALTER TABLE public.gift_purchases ADD COLUMN IF NOT EXISTS buyer_name VARCHAR(255);
ALTER TABLE public.gift_purchases ADD COLUMN IF NOT EXISTS buyer_email VARCHAR(320);

COMMIT;
```

Save as `supabase/migrations/099_cleanup_content_tables.sql` and run:
```bash
npx supabase db push
```

### Day 4: Verification

#### Task 9.1: Verify Database State
```sql
-- Check remaining tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Should only show:
-- ✅ guests
-- ✅ gift_purchases (renamed from gifts)
-- ✅ payments
-- ✅ wedding_config
```

#### Task 9.2: Verify Application
- [ ] All pages still work
- [ ] No console errors
- [ ] RSVP flow works
- [ ] Gift purchase flow works
- [ ] Sanity content displays correctly

#### Task 9.3: Performance Check
```bash
# Run final performance audit
npm run lighthouse

# Compare with pre-migration benchmarks
```

### Day 5: Documentation & Handoff

#### Task 10.1: Update Documentation
```bash
# Update CLAUDE.md
code CLAUDE.md

# Add migration completion note
# Document new architecture
# Update admin instructions
```

#### Task 10.2: Create Admin Guide
```markdown
# Admin Guide - Post Migration

## Content Management
All content is now managed in **Sanity Studio**: https://thousanddaysoflove.com/studio

### Gallery Management
1. Open Sanity Studio → Gallery → Photos/Videos
2. Click "Create" to add new images
3. Fill in title, description, category, tags
4. Upload image (drag & drop)
5. Click "Publish"

### Gift Registry Management
1. Open Sanity Studio → Gifts → Gift Items
2. Click "Create" to add new gift
3. Fill in details (name, price, category)
4. Upload image
5. Set priority (high/medium/low)
6. Click "Publish"

### Timeline Management
1. Open Sanity Studio → Timeline → Timeline Events
2. Click "Create" to add event
3. Fill in date, title, description
4. Upload photo or video
5. Set milestone type
6. Click "Publish"

## Transactional Data
RSVPs and payments are managed at: https://thousanddaysoflove.com/admin

### RSVP Management
1. Go to /admin/guests
2. View all RSVPs
3. Add manual guests
4. Export guest list

### Payment Tracking
1. Go to /admin/pagamentos
2. View all gift purchases
3. Track PIX payments
4. Export payment reports

### Analytics
1. Go to /admin/analytics
2. View statistics dashboard
3. Monitor guest responses
4. Track gift purchase rates
```

#### Task 10.3: Commit Final Documentation
```bash
git add docs/
git commit -m "docs: complete CMS migration documentation"
git push origin main
```

---

## Rollback Procedure (If Needed)

If critical issues occur:

### Immediate Rollback (< 24 hours after deployment)

```bash
# 1. Revert deployment
vercel rollback

# 2. Restore previous commit
git revert HEAD
git push origin main

# 3. Verify old admin pages work
# Visit /admin/galeria, /admin/presentes, etc.

# 4. Investigate issues before retry
```

### Feature Flag Rollback (24-48 hours after deployment)

```typescript
// lib/config.ts
export const USE_SANITY_FOR_CONTENT = process.env.NEXT_PUBLIC_USE_SANITY === 'true'

// In components
if (USE_SANITY_FOR_CONTENT) {
  // Fetch from Sanity
  const images = await client.fetch(`*[_type == "galleryImage"]`)
} else {
  // Fall back to Supabase
  const images = await SupabaseGalleryService.getMediaItems()
}
```

Set environment variable:
```bash
# Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_USE_SANITY=false
```

### Database Restore (> 48 hours, data corruption detected)

```bash
# 1. Restore Supabase backup
# Via Supabase Dashboard: Settings → Database → Restore Backup

# 2. Verify data integrity
npm run verify-migration

# 3. Investigate corruption cause

# 4. Fix issues before retry
```

---

## Success Metrics

### Migration Complete When:
- ✅ All content migrated to Sanity (100% data integrity)
- ✅ All frontend components use Sanity
- ✅ Admin consolidated (3 Supabase + 1 Sanity)
- ✅ Zero console errors in production
- ✅ Performance maintained or improved
- ✅ Content editors trained on Sanity Studio
- ✅ Database cleaned up (only transactional tables)
- ✅ Documentation complete

### Performance Targets:
- ✅ Gallery page load: < 2 seconds
- ✅ Gift registry page load: < 2 seconds
- ✅ Timeline page load: < 2 seconds
- ✅ Lighthouse score: > 90 (maintained)
- ✅ Core Web Vitals: All green

### User Experience Targets:
- ✅ Zero support tickets for admin confusion
- ✅ Content editors prefer Sanity Studio
- ✅ Faster content updates (no code deployments)

---

## Support & Resources

### Documentation
- **Full Plan**: `docs/CMS_CONSOLIDATION_PLAN.md`
- **Architecture**: `docs/ARCHITECTURE_COMPARISON.md`
- **Summary**: `docs/MIGRATION_SUMMARY.md`

### External Resources
- **Sanity Docs**: https://www.sanity.io/docs
- **GROQ Query Language**: https://www.sanity.io/docs/groq
- **Supabase Docs**: https://supabase.com/docs

### Contact
- **Project Lead**: Hel Rabelo (hel@helrabelo.com)
- **Migration Support**: Claude Code (Studio Orchestrator)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Ready to Execute**: YES (after stakeholder approval)
