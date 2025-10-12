# Architecture Comparison: Current vs Target State

**Project**: Thousand Days of Love Wedding Website
**Date**: 2025-10-12

---

## Current State (Mixed Architecture - PROBLEMATIC)

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEBSITE FRONTEND                         │
│                    (Next.js 15 + React 19)                      │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
             │                                    │
    ┌────────▼─────────┐                 ┌───────▼────────────┐
    │   SANITY CMS     │                 │     SUPABASE       │
    │  (Underutilized) │                 │   (Overloaded)     │
    ├──────────────────┤                 ├────────────────────┤
    │ ✅ Homepage      │                 │ ❌ Gallery (180+)  │
    │ ✅ Sections      │                 │ ❌ Gifts (~50)     │
    │ ✅ Story Cards   │                 │ ❌ Timeline (~30)  │
    │ ✅ Features      │                 │ ❌ About Us        │
    │ ✅ Pets          │                 │ ❌ Hero Images     │
    │ ✅ Wedding       │                 │ ❌ Pets (dup!)     │
    │    Settings      │                 │ ❌ Story (dup!)    │
    │                  │                 │ ❌ Features (dup!) │
    │                  │                 │ ✅ RSVPs           │
    │                  │                 │ ✅ Payments        │
    │                  │                 │ ✅ Analytics       │
    └──────────────────┘                 └────────────────────┘
         /studio                         /admin (13 pages!)
```

### Problems with Current Architecture

1. **Duplicate Content Management**
   - Story cards exist in BOTH Sanity and Supabase
   - Pets exist in BOTH Sanity and Supabase
   - Features exist in BOTH Sanity and Supabase
   - Wedding settings exist in BOTH Sanity and Supabase

2. **Wrong Data Location**
   - Gallery (marketing content) in Supabase (transactional database)
   - Timeline (storytelling) in Supabase (transactional database)
   - Gift items (marketing) mixed with gift purchases (transactions)

3. **Admin Interface Chaos**
   - 13 admin pages split across 2 systems
   - Content editors must learn 2 different interfaces
   - No clear rule: "Which admin do I use?"

4. **Developer Confusion**
   - "Where is this content stored?"
   - "Which service should I query?"
   - "How do I update the gallery?"

5. **Maintenance Burden**
   - Must maintain custom Supabase admin UIs
   - Must sync data between Sanity and Supabase
   - Must handle migrations for content changes

---

## Target State (Clean Separation - OPTIMAL)

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEBSITE FRONTEND                         │
│                    (Next.js 15 + React 19)                      │
└────────────┬────────────────────────────────────┬───────────────┘
             │                                    │
             │                                    │
    ┌────────▼─────────┐                 ┌───────▼────────────┐
    │   SANITY CMS     │                 │     SUPABASE       │
    │ (ALL MARKETING)  │                 │ (ONLY TRANSACTIONS)│
    ├──────────────────┤                 ├────────────────────┤
    │ ✅ Pages         │                 │ ✅ RSVPs           │
    │ ✅ Sections      │                 │ ✅ Gift Purchases  │
    │ ✅ Gallery (180+)│                 │    (with Sanity    │
    │ ✅ Gifts (~50)   │                 │     reference)     │
    │ ✅ Timeline (~30)│                 │ ✅ Payments        │
    │ ✅ Story Cards   │                 │ ✅ Analytics       │
    │ ✅ Features      │                 │                    │
    │ ✅ Pets          │                 │ 3 tables only      │
    │ ✅ About Us      │                 │ Clean & focused    │
    │ ✅ Hero Content  │                 │                    │
    │ ✅ All Assets    │                 │                    │
    └──────────────────┘                 └────────────────────┘
         /studio                         /admin (3 pages)
    (Professional CMS)                   (Transactional only)
```

### Benefits of Target Architecture

1. **Single Source of Truth**
   - All marketing content in Sanity (zero duplication)
   - All transactions in Supabase (zero confusion)
   - Clear rule: "Content = Sanity, Transactions = Supabase"

2. **Correct Data Location**
   - Gallery in Sanity (content management system)
   - Timeline in Sanity (storytelling platform)
   - Gift items in Sanity, purchases in Supabase (proper separation)

3. **Unified Admin Interface**
   - 1 professional CMS (Sanity Studio) for all content
   - 3 focused admin pages for transactional data
   - Content editors learn 1 system, not 2

4. **Developer Clarity**
   - "Marketing content? Sanity."
   - "User actions? Supabase."
   - Simple, predictable architecture

5. **Reduced Maintenance**
   - No custom admin UIs for content
   - No data syncing between systems
   - Sanity handles content migrations

---

## Data Flow Comparison

### Current State: Confusing Data Flow

```
User Action: "View Gallery"
├─ Frontend queries Supabase (media_items table)
├─ Fetches from Supabase Storage
├─ Manual admin UI for uploads
└─ Custom service layer (SupabaseGalleryService)

User Action: "Choose Gift"
├─ Frontend queries Supabase (gifts table)
├─ Gift items mixed with purchase data
└─ Custom admin UI for gift management

User Action: "RSVP"
├─ Frontend queries Supabase (guests table) ✅ CORRECT
└─ Transactional data in transactional database
```

### Target State: Clear Data Flow

```
User Action: "View Gallery"
├─ Frontend queries Sanity (galleryImage documents)
├─ Served from Sanity CDN (global, fast)
├─ Sanity Studio for uploads (professional UI)
└─ Automatic image optimization (WebP, responsive)

User Action: "Choose Gift"
├─ Frontend queries Sanity (giftItem documents)
├─ Shows marketing content (name, price, image)
├─ User clicks "Buy" → Creates gift_purchase in Supabase
└─ gift_purchase.sanity_gift_id references Sanity item

User Action: "RSVP"
├─ Frontend queries Supabase (guests table) ✅ STILL CORRECT
└─ Transactional data in transactional database
```

---

## Admin Interface Comparison

### Current State: 13 Admin Pages

```
/admin
├─ /guests             ✅ Supabase (transactional - correct)
├─ /pagamentos         ✅ Supabase (transactional - correct)
├─ /analytics          ✅ Supabase (transactional - correct)
├─ /galeria            ❌ Supabase (should be Sanity)
├─ /presentes          ❌ Supabase (should be Sanity)
├─ /timeline           ❌ Supabase (should be Sanity)
├─ /about-us           ❌ Supabase (should be Sanity)
├─ /hero-images        ❌ Supabase (should be Sanity)
├─ /pets               ❌ Supabase (should be Sanity)
├─ /wedding-settings   ❌ Supabase (should be Sanity)
├─ /story-cards        ❌ Supabase (should be Sanity)
├─ /homepage-features  ❌ Supabase (should be Sanity)
└─ /hero-text          ❌ Supabase (should be Sanity)

/studio                ✅ Sanity (but underutilized)
```

**Content Editor Experience**: "I need to learn 13 different admin pages across 2 systems. Which one do I use for what?"

### Target State: 4 Admin Interfaces

```
/admin
├─ /guests             ✅ Supabase (RSVP tracking)
├─ /pagamentos         ✅ Supabase (Payment tracking)
└─ /analytics          ✅ Supabase (Statistics)

/studio                ✅ Sanity (ALL content)
  ├─ Pages
  │  ├─ Homepage
  │  ├─ Timeline Page
  │  └─ Other Pages
  ├─ Gallery
  │  ├─ Photos
  │  └─ Videos
  ├─ Timeline
  │  └─ Timeline Events
  ├─ Gifts
  │  ├─ Gift Items
  │  └─ Gift Categories
  ├─ Content
  │  ├─ Story Cards
  │  ├─ Feature Cards
  │  ├─ Pets
  │  └─ Wedding Settings
  └─ Settings
     ├─ Site Settings
     ├─ Navigation
     ├─ Footer
     └─ SEO Settings
```

**Content Editor Experience**: "I manage content in Sanity Studio. I check RSVPs and payments in the admin dashboard. Simple!"

---

## Code Comparison

### Current State: Complex Service Layer

```typescript
// For every content type, custom Supabase service
class SupabaseGalleryService {
  static async getMediaItems() { /* custom code */ }
  static async uploadFiles() { /* custom code */ }
  static async updateMediaItem() { /* custom code */ }
  static async deleteMediaItem() { /* custom code */ }
  static async bulkUpdateMediaItems() { /* custom code */ }
  static async getGalleryStats() { /* custom code */ }
}

class SupabaseGiftService {
  static async getGifts() { /* custom code */ }
  static async createGift() { /* custom code */ }
  // ... more custom code
}

class SupabaseTimelineService {
  static async getEvents() { /* custom code */ }
  // ... more custom code
}

// Every component must import and use custom services
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'
```

### Target State: Simple Sanity Queries

```typescript
// One line queries with GROQ
const images = await client.fetch(`*[_type == "galleryImage" && isPublic == true]`)
const gifts = await client.fetch(`*[_type == "giftItem" && isAvailable == true]`)
const events = await client.fetch(`*[_type == "timelineEvent"] | order(date asc)`)

// No custom service layer needed
// Sanity client handles everything
import { client } from '@/sanity/lib/client'
```

---

## Migration Path

### Step 1: Create Sanity Schemas
```
Before: Content in Supabase tables
After: Content schemas defined in Sanity
Duration: 2 days
```

### Step 2: Migrate Data
```
Before: ~300 content records in Supabase
After: ~300 content records in Sanity
Duration: 3 days (includes testing)
```

### Step 3: Update Frontend
```
Before: Components query Supabase
After: Components query Sanity
Duration: 2 days
```

### Step 4: Deprecate Admin Pages
```
Before: 13 admin pages
After: 4 admin interfaces
Duration: 1 day
```

### Step 5: Clean Database
```
Before: 15 Supabase tables (content + transactions)
After: 3 Supabase tables (transactions only)
Duration: 2 days (with monitoring)
```

**Total Duration**: 3 weeks (15 working days)

---

## Database Table Count Comparison

### Current State: 15+ Tables

```sql
-- Content tables (WRONG - should be in CMS)
media_items                    -- 180+ records
timeline_events                -- 30+ records
timeline_event_media           -- 50+ records
hero_images                    -- 10+ records
our_family_pets                -- 4 records
about_us_content               -- 2 records
wedding_settings               -- 1 record
story_cards                    -- 3 records
story_preview_settings         -- 1 record
homepage_features              -- 4 records
homepage_section_settings      -- 1 record
hero_text                      -- 1 record
gifts (mixed content+tx)       -- 50 records

-- Transactional tables (CORRECT)
guests                         -- RSVP data
payments                       -- Payment tracking
wedding_config                 -- Metadata
```

### Target State: 3 Tables

```sql
-- Transactional tables ONLY
guests                         -- RSVP data
gift_purchases                 -- Purchase tracking (references Sanity)
payments                       -- Payment tracking
```

**Database Size Reduction**: ~60% (estimated)

---

## Asset Management Comparison

### Current State: Split Asset Storage

```
Supabase Storage
├─ wedding-media/
│  ├─ gallery/          (180+ photos/videos)
│  ├─ timeline/         (30+ event photos)
│  └─ hero/             (10+ hero images)

Sanity Assets
├─ (minimal usage)
└─ (underutilized)
```

**Problems**:
- Manual image optimization
- No automatic WebP conversion
- No responsive image generation
- Manual thumbnail creation
- No global CDN caching

### Target State: Unified Asset Management

```
Sanity Assets (Global CDN)
├─ Gallery/             (180+ photos/videos)
├─ Timeline/            (30+ event photos)
├─ Hero/                (10+ hero images)
├─ Gifts/               (50+ product images)
└─ Pets/                (4 pet photos)
```

**Benefits**:
- Automatic image optimization
- Automatic WebP/AVIF conversion
- Responsive image generation
- Automatic thumbnail creation
- Global CDN (fast worldwide)
- Blurhash generation
- Metadata extraction

---

## Performance Comparison

### Current State: Performance Metrics

```
Gallery Page Load
├─ Supabase query: ~200ms
├─ Image load from Supabase Storage: ~500ms
├─ No CDN caching
└─ Total: ~700ms

Gift Registry Page Load
├─ Supabase query: ~150ms
├─ Image load from Supabase Storage: ~400ms
└─ Total: ~550ms

Timeline Page Load
├─ Supabase query: ~250ms
├─ Image load from Supabase Storage: ~600ms
└─ Total: ~850ms
```

### Target State: Expected Performance

```
Gallery Page Load
├─ Sanity query (CDN cached): ~50ms
├─ Image load from Sanity CDN: ~100ms
├─ Global edge caching
└─ Total: ~150ms (78% faster)

Gift Registry Page Load
├─ Sanity query (CDN cached): ~40ms
├─ Image load from Sanity CDN: ~80ms
└─ Total: ~120ms (78% faster)

Timeline Page Load
├─ Sanity query (CDN cached): ~60ms
├─ Image load from Sanity CDN: ~120ms
└─ Total: ~180ms (79% faster)
```

**Expected Performance Improvement**: 75-80% faster page loads

---

## Cost Comparison

### Current State: Monthly Costs (Estimated)

```
Supabase
├─ Database storage: ~$20/month (content + transactions)
├─ Storage (images/videos): ~$15/month
├─ Bandwidth: ~$10/month
└─ Total: ~$45/month

Sanity
├─ Free tier (underutilized)
└─ Total: $0/month

TOTAL: ~$45/month
```

### Target State: Expected Monthly Costs

```
Supabase
├─ Database storage: ~$5/month (transactions only)
├─ Storage: $0 (no media files)
├─ Bandwidth: ~$3/month
└─ Total: ~$8/month (82% reduction)

Sanity
├─ Free tier (up to 10GB assets, sufficient for wedding)
├─ CDN bandwidth included
└─ Total: $0/month

TOTAL: ~$8/month (82% savings)
```

**Expected Cost Savings**: ~$37/month (~$444/year)

---

## Developer Experience Comparison

### Current State: Complex Developer Experience

```typescript
// Different patterns for each content type
import { SupabaseGalleryService } from '@/lib/services/supabaseGalleryService'
import { SupabaseGiftService } from '@/lib/services/supabaseGiftService'
import { SupabaseTimelineService } from '@/lib/services/supabaseTimelineService'
import { createClient } from '@/lib/supabase/client'

// Inconsistent query patterns
const images = await SupabaseGalleryService.getMediaItems()
const gifts = await SupabaseGiftService.getGifts()
const events = await SupabaseTimelineService.getEvents()

// Manual type definitions
interface MediaItem { ... }
interface GiftItem { ... }
interface TimelineEvent { ... }

// Manual error handling for each service
try {
  const images = await SupabaseGalleryService.getMediaItems()
} catch (error) {
  // custom error handling
}
```

### Target State: Consistent Developer Experience

```typescript
// One import, one pattern
import { client } from '@/sanity/lib/client'

// Consistent query pattern (GROQ)
const images = await client.fetch(`*[_type == "galleryImage"]`)
const gifts = await client.fetch(`*[_type == "giftItem"]`)
const events = await client.fetch(`*[_type == "timelineEvent"]`)

// Auto-generated types from schemas
import type { GalleryImage, GiftItem, TimelineEvent } from '@/sanity/types'

// Consistent error handling
try {
  const images = await client.fetch<GalleryImage[]>(`*[_type == "galleryImage"]`)
} catch (error) {
  // Sanity error handling
}
```

---

## Summary

### Why This Migration Matters

1. **Architectural Correctness**: Content in CMS, transactions in database
2. **Developer Productivity**: Consistent patterns, less custom code
3. **Content Editor Experience**: Professional CMS, not custom admin UIs
4. **Performance**: 75-80% faster page loads with CDN caching
5. **Cost Optimization**: 82% reduction in infrastructure costs
6. **Maintainability**: Less code to maintain, fewer bugs

### The Core Problem

The current architecture mixes **content** (marketing, storytelling) with **transactions** (user actions, payments). This creates:
- Developer confusion
- Editor confusion
- Performance issues
- Maintenance burden
- Cost inefficiency

### The Solution

Clean separation of concerns:
- **Sanity**: Single source of truth for ALL marketing content
- **Supabase**: ONLY transactional and analytics data
- **Admin**: 1 professional CMS + 3 focused transactional dashboards

---

**Next Step**: Review detailed migration plan in `CMS_CONSOLIDATION_PLAN.md`

**Questions**: Contact Hel Rabelo (hel@helrabelo.com)

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
