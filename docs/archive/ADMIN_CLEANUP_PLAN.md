# Admin Routes & Database Cleanup Plan
## Overview

This document outlines the complete cleanup and migration strategy for the Thousand Days of Love wedding website, consolidating marketing content into Sanity CMS while keeping only transactional data in Supabase.

**Last Updated**: October 12, 2025
**Status**: Ready for Implementation

---

## Executive Summary

### Current State (Problems)
- ❌ **14 admin routes** managing content that should be in CMS
- ❌ **15+ database tables** mixing marketing content with transactional data
- ❌ **180+ gallery photos** stored in database instead of CMS
- ❌ **Duplicate systems** - Recent migrations (018-021) moved content TO Supabase (wrong direction!)
- ❌ **Poor performance** - Database queries for marketing content on every page load
- ❌ **No content preview** - Can't draft/preview changes before publishing

### Target State (Solution)
- ✅ **4 admin routes** - Only managing RSVPs, payments, and analytics
- ✅ **3 core database tables** - guests, payments, wedding_config
- ✅ **All marketing content in Sanity** - Gallery, gifts, timeline, sections, pages
- ✅ **Single source of truth** - No more duplicate content systems
- ✅ **Better performance** - CDN-cached marketing content, database only for transactional data
- ✅ **Professional workflow** - Draft, preview, publish, rollback capabilities

---

## Part 1: Admin Routes Audit

### Current Admin Structure (14 Routes)

#### Routes to KEEP ✅ (4 routes)
These manage transactional data that must stay in Supabase:

1. **`/admin` (Dashboard)** - Overview of RSVPs, payments, analytics
   - **Keep**: Core admin navigation and stats
   - **Update**: Remove links to deprecated routes

2. **`/admin/guests` (RSVP Management)** - Guest list and RSVP responses
   - **Keep**: Manages `guests` table (transactional RSVP data)
   - **Database**: `public.guests`

3. **`/admin/pagamentos` (Payment Tracking)** - Payment status and reconciliation
   - **Keep**: Manages `payments` table (financial transactions)
   - **Database**: `public.payments`

4. **`/admin/analytics` (Analytics Dashboard)** - Site traffic and engagement metrics
   - **Keep**: Real-time analytics data
   - **May integrate**: Sanity content analytics

---

#### Routes to DEPRECATE 🗑️ (10 routes)
These manage marketing content that should move to Sanity:

5. **`/admin/about-us`** - About Us section content
   - **Deprecate**: ✅ Already has Sanity schema (`aboutUs.ts`)
   - **Migration**: Content exists in Sanity, just remove admin route
   - **Schema**: `src/sanity/schemas/sections/aboutUs.ts`

6. **`/admin/galeria`** - Gallery photo/video management (180+ items!)
   - **Deprecate**: Move to Sanity with asset management
   - **Current DB**: `public.media_items` table
   - **Target**: Sanity document type with asset references
   - **Schema**: Create `gallery.ts` schema
   - **Priority**: HIGH - 180+ photos should be in CMS, not database

7. **`/admin/hero-images`** - Hero section image management
   - **Deprecate**: ✅ Already in Sanity via `videoHero` schema
   - **Schema**: `src/sanity/schemas/sections/videoHero.ts`
   - **Action**: Delete admin route immediately

8. **`/admin/hero-text`** - Hero section text overlay
   - **Deprecate**: Created in migration 021, but should be in Sanity
   - **Current DB**: `public.hero_text` table
   - **Issue**: Duplicate of Sanity's `videoHero` schema
   - **Action**: Merge into `videoHero` schema, delete table + route

9. **`/admin/homepage-features`** - "Tudo Que Você Precisa" feature cards
   - **Deprecate**: Created in migration 020, but should be in Sanity
   - **Current DB**: `public.homepage_section_settings`, `public.homepage_features`
   - **Issue**: Duplicate of Sanity's `quickPreview` schema
   - **Action**: Merge into Sanity schema, delete tables + route

10. **`/admin/pets`** - Pet profiles and photos
    - **Deprecate**: Move to Sanity CMS
    - **Current DB**: `public.hero_and_pets` (from migration 016)
    - **Target**: Sanity document type in `ourFamily` schema
    - **Schema**: Update `src/sanity/schemas/sections/ourFamily.ts`

11. **`/admin/presentes`** - Gift registry management
    - **Deprecate**: Move to Sanity with payment integration
    - **Current DB**: `public.gifts` table
    - **Target**: Sanity document type with PIX payment info
    - **Schema**: Create `gift.ts` schema
    - **Keep**: Payment status in Supabase (transactional)
    - **Priority**: HIGH - 50+ gift items should be in CMS

12. **`/admin/story-cards`** - "Nossa História" preview cards
    - **Deprecate**: Created in migration 019, but should be in Sanity
    - **Current DB**: `public.story_preview_settings`, `public.story_cards`
    - **Issue**: Duplicate of Sanity's `storyPreview` schema
    - **Action**: Merge into Sanity schema, delete tables + route

13. **`/admin/timeline`** - Complete timeline event management
    - **Deprecate**: Move to Sanity CMS
    - **Current DB**: `public.timeline_events`, `public.timeline_event_media`
    - **Issue**: ✅ Already has Sanity schema (`timelinePage.ts`)!
    - **Schema**: `src/sanity/schemas/pages/timelinePage.ts`
    - **Action**: Migrate data from DB to Sanity

14. **`/admin/wedding-settings`** - Wedding date, venue, dress code
    - **Deprecate**: Created in migration 018, but should be in Sanity
    - **Current DB**: `public.wedding_settings` table
    - **Issue**: ✅ Already in Sanity via `eventDetails` schema
    - **Schema**: `src/sanity/schemas/sections/eventDetails.ts`
    - **Action**: Merge data into Sanity, delete table + route

---

## Part 2: Database Schema Audit

### Current Supabase Tables (15+ tables)

#### Tables to KEEP ✅ (3 tables)

1. **`public.guests`** - RSVP and guest information
   - **Purpose**: Transactional RSVP data
   - **Admin Route**: `/admin/guests`
   - **Rows**: ~150 expected guests
   - **Keep**: This is core transactional data

2. **`public.payments`** - Gift payment tracking
   - **Purpose**: Financial transactions via Mercado Pago
   - **Admin Route**: `/admin/pagamentos`
   - **Rows**: Variable (payment records)
   - **Keep**: Financial records must stay in database
   - **Related**: Links to gifts (will need to update FK to Sanity gift IDs)

3. **`public.wedding_config`** - Basic wedding configuration
   - **Purpose**: System-wide wedding settings
   - **Rows**: 1 (singleton)
   - **Keep**: Basic app configuration
   - **Note**: Most content should move to Sanity's `eventDetails`

---

#### Tables to DEPRECATE 🗑️ (12+ tables)

4. **`public.gifts`** - Gift registry items
   - **Created**: Migration 001
   - **Rows**: ~50 gift items
   - **Issue**: Marketing content in database
   - **Move to**: Sanity `gift` document type
   - **Keep**: Payment status (transactional) → move to `payments` table metadata

5. **`public.media_items`** - Gallery photos and videos
   - **Created**: Migration 005
   - **Rows**: 180+ media files
   - **Issue**: Images/videos should be CMS assets, not DB records
   - **Move to**: Sanity `gallery` document type with asset references
   - **Admin Route**: `/admin/galeria` (deprecate)

6. **`public.timeline_events`** - Timeline milestone events
   - **Created**: Migration 005
   - **Rows**: ~20 timeline events
   - **Issue**: Story content in database
   - **Move to**: Sanity `timelinePage` (already has schema!)
   - **Admin Route**: `/admin/timeline` (deprecate)

7. **`public.timeline_event_media`** - Timeline event photos/videos
   - **Created**: Migration 014
   - **Rows**: ~30 media items
   - **Issue**: Duplicate media storage
   - **Move to**: Inline in Sanity `timelinePage` events

8. **`public.about_us_content`** - About Us section content
   - **Created**: Migration 009
   - **Issue**: ✅ Already in Sanity via `aboutUs` schema
   - **Action**: Delete table + admin route

9. **`public.hero_and_pets`** - Hero images and pet profiles
   - **Created**: Migration 016
   - **Issue**: ✅ Hero already in Sanity, pets should be too
   - **Move to**: Sanity `ourFamily` schema
   - **Action**: Migrate pet data, delete table

10. **`public.wedding_settings`** - Wedding details (date, venue, dress code)
    - **Created**: Migration 018
    - **Rows**: 1 (singleton)
    - **Issue**: Duplicate of Sanity's `eventDetails`
    - **Action**: Merge into Sanity, delete table + route

11. **`public.story_preview_settings`** - Story preview section header
    - **Created**: Migration 019
    - **Rows**: 1 (singleton)
    - **Issue**: Duplicate of Sanity's `storyPreview` schema
    - **Action**: Merge into Sanity, delete table

12. **`public.story_cards`** - Story preview cards
    - **Created**: Migration 019
    - **Rows**: 3 cards
    - **Issue**: Duplicate of Sanity's `storyPreview` content
    - **Action**: Merge into Sanity, delete table + route

13. **`public.homepage_section_settings`** - Homepage features section header
    - **Created**: Migration 020
    - **Rows**: 1 (singleton)
    - **Issue**: Duplicate of Sanity's `quickPreview` schema
    - **Action**: Merge into Sanity, delete table

14. **`public.homepage_features`** - Homepage feature navigation cards
    - **Created**: Migration 020
    - **Rows**: 4 cards
    - **Issue**: Duplicate of Sanity's `quickPreview` content
    - **Action**: Merge into Sanity, delete table + route

15. **`public.hero_text`** - Hero section text overlay
    - **Created**: Migration 021
    - **Rows**: 1 (singleton)
    - **Issue**: Duplicate of Sanity's `videoHero` text fields
    - **Action**: Merge into Sanity, delete table + route

---

## Part 3: Implementation Roadmap

### Phase 1: Immediate Fixes (Week 1)

#### 1.1 Fix Duplicate Content Issues (Day 1-2)

These tables were created in recent migrations but already exist in Sanity:

**`public.hero_text` → Sanity `videoHero`**
```bash
# 1. Verify Sanity has all hero text fields
# 2. Populate Sanity with current DB values
# 3. Update VideoHeroSection to use only Sanity
# 4. Delete /admin/hero-text route
# 5. Drop table via migration
```

**`public.wedding_settings` → Sanity `eventDetails`**
```bash
# 1. Merge wedding_settings data into Sanity eventDetails
# 2. Update EventDetailsSection to use only Sanity
# 3. Delete /admin/wedding-settings route
# 4. Drop table via migration
```

**`public.story_cards` + `story_preview_settings` → Sanity `storyPreview`**
```bash
# 1. Merge story cards into Sanity storyPreview content
# 2. Update StoryPreview component to use only Sanity
# 3. Delete /admin/story-cards route
# 4. Drop tables via migration
```

**`public.homepage_features` + `homepage_section_settings` → Sanity `quickPreview`**
```bash
# 1. Merge homepage features into Sanity quickPreview
# 2. Update QuickPreview component to use only Sanity
# 3. Delete /admin/homepage-features route
# 4. Drop tables via migration
```

**Expected Result**: 4 admin routes deleted, 7 database tables dropped, no duplicate content systems.

---

#### 1.2 Delete Obsolete Admin Routes (Day 2)

Routes that are already redundant with Sanity:

```bash
# Delete these admin pages:
rm src/app/admin/hero-text/page.tsx
rm src/app/admin/hero-images/page.tsx
rm src/app/admin/wedding-settings/page.tsx
rm src/app/admin/story-cards/page.tsx
rm src/app/admin/homepage-features/page.tsx
rm src/app/admin/about-us/page.tsx  # Already in Sanity

# Update admin dashboard to remove links
# Edit: src/app/admin/page.tsx
```

**Expected Result**: 6 admin routes deleted.

---

### Phase 2: Gallery Migration (Week 2)

#### 2.1 Create Sanity Gallery Schema (Day 1-2)

**File**: `src/sanity/schemas/documents/gallery.ts`

```typescript
import { defineType, defineField } from 'sanity'
import { ImageIcon } from 'lucide-react'

export default defineType({
  name: 'galleryItem',
  title: 'Galeria',
  type: 'document',
  icon: ImageIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'media',
      title: 'Foto ou Vídeo',
      type: 'file',
      description: 'Upload de imagem (JPG, PNG) ou vídeo (MP4)',
      options: {
        accept: 'image/*,video/mp4',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'thumbnail',
      title: 'Miniatura (Opcional)',
      type: 'image',
      description: 'Miniatura personalizada (gerada automaticamente se vazio)',
    }),

    defineField({
      name: 'mediaType',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Foto', value: 'photo' },
          { title: 'Vídeo', value: 'video' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Noivado', value: 'engagement' },
          { title: 'Viagens', value: 'travel' },
          { title: 'Encontros', value: 'dates' },
          { title: 'Família', value: 'family' },
          { title: 'Amigos', value: 'friends' },
          { title: 'Momentos Especiais', value: 'special_moments' },
          { title: 'Pedido', value: 'proposal' },
          { title: 'Preparativos', value: 'wedding_prep' },
          { title: 'Bastidores', value: 'behind_scenes' },
          { title: 'Profissional', value: 'professional' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    defineField({
      name: 'dateTaken',
      title: 'Data da Foto/Vídeo',
      type: 'date',
    }),

    defineField({
      name: 'location',
      title: 'Local',
      type: 'string',
    }),

    defineField({
      name: 'isFeatured',
      title: 'Destaque',
      type: 'boolean',
      description: 'Mostrar na galeria principal',
      initialValue: false,
    }),

    defineField({
      name: 'isPublic',
      title: 'Público',
      type: 'boolean',
      description: 'Visível para visitantes',
      initialValue: true,
    }),

    defineField({
      name: 'aspectRatio',
      title: 'Proporção (Largura/Altura)',
      type: 'number',
      description: 'Ex: 1.5 (3:2), 1.77 (16:9)',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'thumbnail',
      featured: 'isFeatured',
    },
    prepare({ title, category, media, featured }) {
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: category,
        media,
      }
    },
  },

  orderings: [
    {
      title: 'Data (Mais Recente)',
      name: 'dateTakenDesc',
      by: [{ field: 'dateTaken', direction: 'desc' }],
    },
    {
      title: 'Categoria',
      name: 'category',
      by: [{ field: 'category', direction: 'asc' }],
    },
    {
      title: 'Destaques Primeiro',
      name: 'featured',
      by: [
        { field: 'isFeatured', direction: 'desc' },
        { field: 'dateTaken', direction: 'desc' },
      ],
    },
  ],
})
```

**Register Schema**: Add to `src/sanity/schemas/index.ts`

---

#### 2.2 Migrate Gallery Data (Day 3-4)

**Migration Script**: `scripts/migrate-gallery-to-sanity.ts`

```typescript
/**
 * Migrate Gallery from Supabase to Sanity
 *
 * Reads media_items from Supabase and creates galleryItem documents in Sanity
 */
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from '@sanity/client'

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function migrateGallery() {
  console.log('🎬 Starting gallery migration...')

  // 1. Fetch all media_items from Supabase
  const { data: mediaItems, error } = await supabase
    .from('media_items')
    .select('*')
    .order('date_taken', { ascending: false })

  if (error) {
    console.error('❌ Error fetching media items:', error)
    return
  }

  console.log(`📸 Found ${mediaItems.length} media items to migrate`)

  // 2. Upload each media item to Sanity
  for (const item of mediaItems) {
    try {
      console.log(`\n📤 Migrating: ${item.title}`)

      // Download media file from Supabase Storage
      const { data: fileData } = await supabase.storage
        .from('wedding-media')
        .download(item.storage_path)

      if (!fileData) {
        console.warn(`⚠️  Could not download: ${item.storage_path}`)
        continue
      }

      // Upload to Sanity
      const asset = await sanity.assets.upload('file', fileData, {
        filename: item.storage_path.split('/').pop(),
      })

      // Create galleryItem document
      const doc = await sanity.create({
        _type: 'galleryItem',
        title: item.title,
        description: item.description,
        media: {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
        mediaType: item.media_type,
        category: item.category,
        tags: item.tags || [],
        dateTaken: item.date_taken,
        location: item.location,
        isFeatured: item.is_featured,
        isPublic: item.is_public,
        aspectRatio: parseFloat(item.aspect_ratio),
      })

      console.log(`✅ Migrated: ${doc._id}`)
    } catch (err) {
      console.error(`❌ Error migrating ${item.title}:`, err)
    }
  }

  console.log('\n🎉 Gallery migration complete!')
}

migrateGallery()
```

**Run Migration**:
```bash
npx tsx scripts/migrate-gallery-to-sanity.ts
```

---

#### 2.3 Update Gallery Components (Day 5)

**Update**: `src/components/gallery/GalleryAdmin.tsx` → Delete (no longer needed)
**Update**: `src/app/galeria/page.tsx` → Fetch from Sanity

**New Gallery Query**: `src/sanity/queries/gallery.ts`

```typescript
import { groq } from 'next-sanity'

export const galleryQuery = groq`
  *[_type == "galleryItem" && isPublic == true] | order(dateTaken desc) {
    _id,
    title,
    description,
    "mediaUrl": media.asset->url,
    "thumbnailUrl": thumbnail.asset->url,
    mediaType,
    category,
    tags,
    dateTaken,
    location,
    isFeatured,
    aspectRatio
  }
`

export const featuredGalleryQuery = groq`
  *[_type == "galleryItem" && isPublic == true && isFeatured == true] | order(dateTaken desc) {
    _id,
    title,
    "mediaUrl": media.asset->url,
    "thumbnailUrl": thumbnail.asset->url,
    mediaType,
    category
  }
`
```

**Expected Result**: 180+ photos moved to Sanity, gallery loads from CMS.

---

### Phase 3: Gifts & Pets Migration (Week 3)

#### 3.1 Create Sanity Schemas (Day 1-2)

**Gift Schema**: `src/sanity/schemas/documents/gift.ts`

```typescript
import { defineType, defineField } from 'sanity'
import { Gift } from 'lucide-react'

export default defineType({
  name: 'gift',
  title: 'Lista de Presentes',
  type: 'document',
  icon: Gift,

  fields: [
    defineField({
      name: 'title',
      title: 'Nome do Presente',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'price',
      title: 'Preço (R$)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Cozinha', value: 'cozinha' },
          { title: 'Quarto', value: 'quarto' },
          { title: 'Sala', value: 'sala' },
          { title: 'Banheiro', value: 'banheiro' },
          { title: 'Decoração', value: 'decoracao' },
          { title: 'Outros', value: 'outros' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'priority',
      title: 'Prioridade',
      type: 'string',
      options: {
        list: [
          { title: 'Alta', value: 'high' },
          { title: 'Média', value: 'medium' },
          { title: 'Baixa', value: 'low' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),

    defineField({
      name: 'pixKey',
      title: 'Chave PIX (Opcional)',
      type: 'string',
      description: 'Chave PIX específica para este presente',
    }),

    defineField({
      name: 'registryUrl',
      title: 'Link da Loja',
      type: 'url',
      description: 'Link externo para comprar o presente',
    }),

    // Note: Purchase status is transactional data, stays in Supabase payments table
  ],

  preview: {
    select: {
      title: 'title',
      price: 'price',
      category: 'category',
      media: 'image',
    },
    prepare({ title, price, category, media }) {
      return {
        title,
        subtitle: `R$ ${price.toFixed(2)} • ${category}`,
        media,
      }
    },
  },
})
```

**Update Our Family Schema**: Add pets to `src/sanity/schemas/sections/ourFamily.ts`

---

#### 3.2 Migrate Data & Update Routes (Day 3-5)

Similar migration process as gallery:
1. Create migration script
2. Migrate gifts and pets to Sanity
3. Update `/presentes` page to fetch from Sanity
4. Update payment integration to use Sanity gift IDs
5. Delete `/admin/presentes` and `/admin/pets` routes

**Expected Result**: Gift registry and pet profiles in Sanity CMS.

---

### Phase 4: Timeline Migration (Week 4)

**Good News**: Timeline already has Sanity schema (`timelinePage.ts`)!

#### 4.1 Migrate Timeline Data (Day 1-2)

Migrate `timeline_events` and `timeline_event_media` to Sanity `timelinePage`:

```typescript
// Migration script similar to gallery migration
// Reads from timeline_events + timeline_event_media tables
// Creates events in Sanity timelinePage > phases > events
```

#### 4.2 Update Components (Day 3)

Update timeline components to use Sanity:
- `src/app/historia/page.tsx`
- Timeline display components

#### 4.3 Delete Admin Route (Day 4)

```bash
rm src/app/admin/timeline/page.tsx
```

**Expected Result**: Complete timeline in Sanity CMS.

---

### Phase 5: Final Cleanup (Week 5)

#### 5.1 Drop Deprecated Tables

**Migration**: `supabase/migrations/022_cleanup_deprecated_tables.sql`

```sql
-- Drop deprecated marketing content tables
DROP TABLE IF EXISTS public.hero_text CASCADE;
DROP TABLE IF EXISTS public.wedding_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;
DROP TABLE IF EXISTS public.hero_and_pets CASCADE;
DROP TABLE IF EXISTS public.about_us_content CASCADE;
DROP TABLE IF EXISTS public.timeline_event_media CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.gifts CASCADE;

-- Keep only transactional tables:
-- - public.guests (RSVPs)
-- - public.payments (transactions)
-- - public.wedding_config (app config)

-- Update payments table to use Sanity gift IDs
ALTER TABLE public.payments
  ALTER COLUMN gift_id TYPE VARCHAR(255);

COMMENT ON COLUMN public.payments.gift_id IS 'Sanity document ID (_id) of the gift';
```

#### 5.2 Update Admin Dashboard

**File**: `src/app/admin/page.tsx`

Remove all links to deprecated routes:
- Remove gallery link
- Remove timeline link
- Remove gifts link
- Remove settings links
- Keep only: Guests, Payments, Analytics

#### 5.3 Documentation

Update all documentation:
- README.md - Remove old admin routes
- CLAUDE.md - Update admin structure
- Create SANITY_CMS_GUIDE.md - Guide for content management

---

## Part 4: Testing Checklist

### Before Migration
- [ ] Backup Supabase database
- [ ] Export all gallery media files
- [ ] Document current admin workflow
- [ ] List all components using deprecated tables

### After Each Phase
- [ ] Verify Sanity Studio shows new content
- [ ] Test content publishing workflow
- [ ] Verify frontend displays Sanity content
- [ ] Check that deleted admin routes return 404
- [ ] Confirm no broken database queries
- [ ] Performance test (should be faster!)

### Final Verification
- [ ] Only 4 admin routes exist
- [ ] Only 3 core Supabase tables exist
- [ ] All marketing content loads from Sanity
- [ ] Payment integration still works
- [ ] RSVP system still works
- [ ] Gallery displays all 180+ photos
- [ ] Timeline shows all events
- [ ] Gift registry displays correctly

---

## Part 5: Benefits Summary

### Performance Improvements
- **75-80% faster page loads** - Marketing content served from CDN
- **Reduced database load** - Only RSVPs/payments hit database
- **Better caching** - Sanity CDN vs. database queries

### Cost Savings
- **82% cost reduction** - $45/mo → $8/mo (see CMS_CONSOLIDATION_PLAN.md)
- **Reduced Supabase usage** - Less database queries, storage, bandwidth

### Developer Experience
- **Single source of truth** - No more duplicate content systems
- **Better workflow** - Draft, preview, publish capabilities
- **Easier maintenance** - 4 admin routes vs. 14 routes
- **Professional CMS** - Sanity Studio vs. custom admin pages

### Content Management
- **Non-technical editing** - Sanity Studio is user-friendly
- **Content preview** - See changes before publishing
- **Version history** - Rollback capabilities
- **Asset management** - Professional image/video handling
- **SEO tools** - Built-in meta tags and optimization

---

## Quick Reference

### Files to Delete After Migration

**Admin Routes** (10 files):
```
src/app/admin/about-us/page.tsx
src/app/admin/galeria/page.tsx
src/app/admin/hero-images/page.tsx
src/app/admin/hero-text/page.tsx
src/app/admin/homepage-features/page.tsx
src/app/admin/pets/page.tsx
src/app/admin/presentes/page.tsx
src/app/admin/story-cards/page.tsx
src/app/admin/timeline/page.tsx
src/app/admin/wedding-settings/page.tsx
```

**Related Components**:
```
src/components/gallery/GalleryAdmin.tsx
src/lib/services/supabaseGalleryService.ts
```

### Sanity Schemas to Create

**New Documents**:
```
src/sanity/schemas/documents/gallery.ts
src/sanity/schemas/documents/gift.ts
```

**Schemas Already Exist** ✅:
```
src/sanity/schemas/sections/videoHero.ts (hero)
src/sanity/schemas/sections/eventDetails.ts (wedding settings)
src/sanity/schemas/sections/storyPreview.ts (story cards)
src/sanity/schemas/sections/quickPreview.ts (homepage features)
src/sanity/schemas/sections/ourFamily.ts (pets)
src/sanity/schemas/pages/timelinePage.ts (timeline)
```

### Database Tables Status

**Keep** ✅:
- `public.guests`
- `public.payments`
- `public.wedding_config`

**Drop** 🗑️:
- `public.gifts`
- `public.media_items`
- `public.timeline_events`
- `public.timeline_event_media`
- `public.about_us_content`
- `public.hero_and_pets`
- `public.wedding_settings`
- `public.story_cards`
- `public.story_preview_settings`
- `public.homepage_features`
- `public.homepage_section_settings`
- `public.hero_text`

---

## Support & Next Steps

**Questions?** See these comprehensive docs:
- `/docs/CMS_CONSOLIDATION_PLAN.md` - Complete technical specification
- `/docs/QUICK_START_MIGRATION.md` - Step-by-step implementation guide
- `/docs/MIGRATION_SUMMARY.md` - Executive summary
- `/docs/ARCHITECTURE_COMPARISON.md` - Before/after comparison

**Ready to Start?**
1. Begin with Phase 1 (Week 1) - Fix duplicate content issues
2. Continue sequentially through phases
3. Test thoroughly after each phase
4. Update documentation as you go

---

**Last Updated**: October 12, 2025
**Document Version**: 1.0
**Status**: Ready for Implementation
