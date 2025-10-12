# CMS Migration Summary - Quick Reference

**Project**: Thousand Days of Love Wedding Website
**Date**: 2025-10-12
**Status**: Planning Phase

---

## The Problem

The wedding website currently has a **mixed architecture** with content scattered between Sanity CMS and Supabase database:

### Currently in Supabase (WRONG - Should be in Sanity)
- ❌ Gallery (photos/videos) - 180+ lines of SQL
- ❌ Gift Registry items - Marketing content, not transactions
- ❌ Timeline events - Storytelling content
- ❌ About Us content - Marketing copy
- ❌ Hero images & text - Marketing assets
- ❌ Pets profiles - Marketing content
- ❌ Homepage sections - Already in Sanity too (duplicate!)

### Currently in Supabase (CORRECT - Should stay)
- ✅ RSVPs (guests table) - Transactional user responses
- ✅ Payments (payments table) - Financial transactions
- ✅ Analytics - Metrics and statistics

---

## The Solution

### Clean Architecture Separation

```
┌─────────────────────────────────────────────────────┐
│                   SANITY CMS                        │
│  (Single Source of Truth for ALL Marketing Content) │
├─────────────────────────────────────────────────────┤
│  • Pages (Homepage, Timeline, About Us)             │
│  • Sections (Hero, Event Details, Story Preview)    │
│  • Gallery (Photos & Videos with categories/tags)   │
│  • Gift Registry Items (what gifts exist)           │
│  • Timeline Events (our story moments)              │
│  • Pet Profiles (Linda, Cacao, Olivia, Oliver)      │
│  • All Images & Assets (Sanity CDN)                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   SUPABASE                          │
│       (Only Transactional & Analytics Data)         │
├─────────────────────────────────────────────────────┤
│  • Guests (RSVP responses, attendance tracking)     │
│  • Gift Purchases (references Sanity gift ID)       │
│  • Payments (Mercado Pago transactions)             │
│  • Analytics (metrics, statistics, dashboards)      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 ADMIN INTERFACE                     │
├─────────────────────────────────────────────────────┤
│  • /studio → Sanity Studio (ALL content management) │
│  • /admin/guests → Supabase Admin (RSVP tracking)   │
│  • /admin/pagamentos → Supabase Admin (Payments)    │
│  • /admin/analytics → Supabase Admin (Statistics)   │
└─────────────────────────────────────────────────────┘
```

---

## What Gets Migrated

### Phase 1: Gallery System
**From**: Supabase `media_items` table + Supabase Storage
**To**: Sanity `galleryImage` + `galleryVideo` documents + Sanity Assets

**Impact**: ~180 media items migrated

### Phase 2: Gift Registry
**From**: Supabase `gifts` table (mixing content + transactions)
**To**:
- Sanity `giftItem` + `giftCategory` (gift content)
- Supabase `gift_purchases` (transaction tracking with Sanity ID reference)

**Impact**: ~50 gift items migrated, purchases table restructured

### Phase 3: Timeline
**From**: Supabase `timeline_events` + `timeline_event_media` tables
**To**: Sanity `timelineEvent` documents

**Impact**: ~30 timeline events migrated

### Phase 4: Other Content
**From**: Supabase tables:
- `about_us_content`
- `hero_images` + `hero_text`
- `our_family_pets`
- `wedding_settings`
- `story_cards` + `story_preview_settings`
- `homepage_features` + `homepage_section_settings`

**To**: Sanity schemas (some already exist, just need data migration)

**Impact**: ~50+ content records migrated

---

## Admin Routes Cleanup

### Before (13 admin pages)
```
/admin/guests             ✅ Keep (transactional)
/admin/pagamentos         ✅ Keep (transactional)
/admin/analytics          ✅ Keep (transactional)
/admin/galeria            ❌ Remove → Move to Sanity
/admin/presentes          ❌ Remove → Move to Sanity
/admin/timeline           ❌ Remove → Move to Sanity
/admin/about-us           ❌ Remove → Move to Sanity
/admin/hero-images        ❌ Remove → Move to Sanity
/admin/pets               ❌ Remove → Move to Sanity
/admin/wedding-settings   ❌ Remove → Move to Sanity
/admin/story-cards        ❌ Remove → Move to Sanity
/admin/homepage-features  ❌ Remove → Move to Sanity
/admin/hero-text          ❌ Remove → Move to Sanity
/studio                   ✅ Keep (content CMS)
```

### After (4 admin interfaces)
```
/admin/guests       → Supabase Admin (RSVP tracking)
/admin/pagamentos   → Supabase Admin (Payment tracking)
/admin/analytics    → Supabase Admin (Statistics)
/studio            → Sanity Studio (ALL content)
```

**Result**: 10 admin pages removed, 1 unified CMS interface

---

## Migration Timeline

### Week 1: Schema Design & Migration Scripts
- Create Sanity schemas (gallery, gifts, timeline)
- Write migration scripts
- Test on staging with production data copy

### Week 2: Frontend Updates & Testing
- Update components to use Sanity
- Deprecate old admin pages
- Test end-to-end functionality
- Deploy to production

### Week 3: Database Cleanup & Monitoring
- Monitor production for issues
- Drop Supabase content tables (keep transactional)
- Verify all functionality
- Document final architecture

**Total Duration**: 3 weeks (15 working days)

---

## Key Benefits

### For Developers
- ✅ Single source of truth for content
- ✅ No more dual CMS confusion
- ✅ Better TypeScript types (auto-generated from Sanity)
- ✅ Faster queries with GROQ

### For Content Editors
- ✅ Professional CMS interface (Sanity Studio)
- ✅ Rich media handling (drag-and-drop, auto-optimization)
- ✅ Live preview before publishing
- ✅ Version control for content changes

### For Performance
- ✅ CDN-backed assets (Sanity global CDN)
- ✅ Automatic image optimization (WebP, responsive)
- ✅ Reduced database load (Supabase only for transactions)
- ✅ Better edge caching

### For Cost
- ✅ Lower Supabase costs (less storage/compute)
- ✅ Sanity free tier sufficient for wedding site
- ✅ Better Vercel edge caching

---

## Risk Mitigation

### Data Loss Prevention
- Full Supabase backup before migration
- Keep Supabase tables read-only for 2 weeks
- Verify 100% data integrity before cleanup

### Rollback Strategy
- Feature flags to toggle Sanity/Supabase sources
- Keep old admin pages in "legacy" mode for 1 month
- Restore from backup if critical issues occur

### Performance Monitoring
- Benchmark before/after migration
- Monitor Core Web Vitals
- Canary deployment (10% traffic first)

---

## The Recent Migration Issue (2025-10-11)

### What Happened
On 2025-10-11, we created 4 new Supabase migrations (018-021):
- `wedding_settings`
- `story_cards` + `story_preview_settings`
- `homepage_features` + `homepage_section_settings`
- `hero_text`

These moved content FROM hardcoded TO Supabase.

### The Problem
This was the **wrong direction**! We should have moved content TO Sanity, not Supabase.

### The Fix
This migration plan reverses that decision:
- Move those 4 table sets FROM Supabase TO Sanity
- Use Sanity sections (already exist in codebase)
- Deprecate the 4 new admin pages created yesterday

---

## Files to Create

### New Sanity Schemas
```
src/sanity/schemas/documents/
  - galleryImage.ts
  - galleryVideo.ts
  - giftItem.ts
  - giftCategory.ts
  - timelineEvent.ts
  - aboutUsContent.ts
```

### Migration Scripts
```
scripts/migration/
  - migrate-gallery-to-sanity.ts
  - migrate-gifts-to-sanity.ts
  - migrate-timeline-to-sanity.ts
  - migrate-content-to-sanity.ts
```

### Updated Components
```
src/components/
  - gallery/MasonryGallery.tsx (use Sanity)
  - gifts/GiftRegistry.tsx (use Sanity)
  - timeline/Timeline.tsx (use Sanity)
```

---

## Files to Remove

### Admin Pages (10 files)
```
src/app/admin/
  - galeria/page.tsx
  - presentes/page.tsx
  - timeline/page.tsx
  - about-us/page.tsx
  - hero-images/page.tsx
  - pets/page.tsx
  - wedding-settings/page.tsx
  - story-cards/page.tsx
  - homepage-features/page.tsx
  - hero-text/page.tsx
```

### Admin Components (6 files)
```
src/components/gallery/
  - GalleryAdmin.tsx
  - MediaUploader.tsx

src/components/admin/
  - MediaManager.tsx
  - MultiMediaManager.tsx
  - ImageUpload.tsx
  - WeddingConfigTab.tsx
```

---

## Database Changes

### Supabase Tables to Drop (After Migration)
```sql
DROP TABLE IF EXISTS public.media_items;
DROP TABLE IF EXISTS public.timeline_events;
DROP TABLE IF EXISTS public.timeline_event_media;
DROP TABLE IF EXISTS public.hero_images;
DROP TABLE IF EXISTS public.our_family_pets;
DROP TABLE IF EXISTS public.about_us_content;
DROP TABLE IF EXISTS public.wedding_settings;
DROP TABLE IF EXISTS public.story_cards;
DROP TABLE IF EXISTS public.story_preview_settings;
DROP TABLE IF EXISTS public.homepage_features;
DROP TABLE IF EXISTS public.homepage_section_settings;
DROP TABLE IF EXISTS public.hero_text;
```

### Supabase Tables to Keep
```sql
✅ public.guests (RSVP data)
✅ public.payments (payment transactions)
✅ public.wedding_config (wedding metadata)
```

### Supabase Tables to Restructure
```sql
-- Rename gifts → gift_purchases
ALTER TABLE public.gifts RENAME TO gift_purchases;

-- Remove content fields (now in Sanity)
ALTER TABLE public.gift_purchases DROP COLUMN name;
ALTER TABLE public.gift_purchases DROP COLUMN description;
ALTER TABLE public.gift_purchases DROP COLUMN price;
ALTER TABLE public.gift_purchases DROP COLUMN image_url;

-- Add Sanity reference
ALTER TABLE public.gift_purchases ADD COLUMN sanity_gift_id VARCHAR(50) NOT NULL;
```

---

## Success Criteria

### Phase 1 Complete When:
- ✅ All Sanity schemas created
- ✅ Migration scripts tested on staging
- ✅ 100% data integrity verified

### Phase 2 Complete When:
- ✅ All components use Sanity
- ✅ Zero console errors in production
- ✅ Page load times maintained or improved

### Phase 3 Complete When:
- ✅ Admin consolidated (3 Supabase + 1 Sanity)
- ✅ Content editors using Sanity successfully
- ✅ Zero support tickets

### Phase 4 Complete When:
- ✅ Supabase tables cleaned up
- ✅ Zero runtime errors for 7 days
- ✅ Documentation complete

---

## Next Actions

1. **Review** this plan with Hel and stakeholders
2. **Schedule** migration window (recommend weekend)
3. **Create** Sanity schemas (Phase 1)
4. **Test** migration scripts on staging
5. **Execute** migration following 3-week timeline
6. **Monitor** production for 48 hours
7. **Cleanup** Supabase after 2-week verification

---

## Questions?

**Full detailed plan**: See `CMS_CONSOLIDATION_PLAN.md`

**Stakeholder**: Hel Rabelo (hel@helrabelo.com)
**Timeline**: 3 weeks starting TBD
**Risk Level**: Medium (mitigated with backups and rollback strategy)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Status**: Awaiting approval to proceed
