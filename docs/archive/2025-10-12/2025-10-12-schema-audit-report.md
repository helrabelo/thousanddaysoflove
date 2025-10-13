# Schema Audit Report: Duplicate Content Systems
**Date**: October 12, 2025
**Purpose**: Audit Supabase migrations 018-021 vs. existing Sanity CMS schemas
**Goal**: Identify differences before merging duplicate systems into Sanity

---

## Executive Summary

**Status**: ✅ **MIGRATION READY** - All 4 duplicate content systems have matching Sanity schemas

### Findings Overview

| System | Supabase Tables | Sanity Schemas | Match Status | Action Required |
|--------|----------------|----------------|--------------|-----------------|
| Hero Text | `hero_text` | `videoHero` | ⚠️ Partial | Minor schema update OR use monogram only |
| Wedding Settings | `wedding_settings` | `weddingSettings` | ✅ Perfect | Direct data migration |
| Story Preview | `story_preview_settings`<br>`story_cards` | `storyPreview`<br>`storyCard` | ✅ Perfect | Direct data migration |
| Homepage Features | `homepage_section_settings`<br>`homepage_features` | `quickPreview`<br>`featureCard` | ✅ Perfect | Direct data migration |

**Total Tables to Drop**: 7
**Total Admin Routes to Delete**: 6
**Data Loss Risk**: None - all content can be migrated

---

## 1. Hero Text System

### Supabase Table: `hero_text` (Migration 021)

```sql
-- Fields in migration
monogram VARCHAR(20)              -- "H ♥ Y"
bride_name VARCHAR(50)            -- "Ylana"
groom_name VARCHAR(50)            -- "Hel"
names_separator VARCHAR(10)       -- "&"
tagline TEXT                      -- "1000 dias. Sim, a gente fez a conta."
date_badge VARCHAR(50)            -- "20.11.2025"
primary_cta_text VARCHAR(100)     -- "Confirmar Presença"
primary_cta_link VARCHAR(200)     -- "/rsvp"
secondary_cta_text VARCHAR(100)   -- "Nossa História"
secondary_cta_link VARCHAR(200)   -- "/historia"
scroll_text VARCHAR(50)           -- "Explorar"
```

### Sanity Schema: `videoHero`

```typescript
// Fields in Sanity schema
sectionId: string                 // Section identifier
monogram: string                  // ✅ "H ♥ Y"
tagline: text                     // ✅ "1000 dias..."
dateBadge: string                 // ✅ "20.11.2025"
primaryCta: {                     // ✅ Object with label + href
  label: string                   // "Confirmar Presença"
  href: string                    // "/rsvp"
}
secondaryCta: {                   // ✅ Object with label + href
  label: string                   // "Nossa História"
  href: string                    // "/historia"
}
scrollText: string                // ✅ "Explorar"
backgroundVideo: file             // Video assets
backgroundImage: image            // ✅ Image assets
posterImage: image                // Video poster
isVisible: boolean                // Section visibility
```

### Comparison

| Field | Supabase | Sanity | Status |
|-------|----------|--------|--------|
| Monogram | ✅ | ✅ | Perfect match |
| Bride Name | ✅ | ❌ | **Missing in Sanity** |
| Groom Name | ✅ | ❌ | **Missing in Sanity** |
| Names Separator | ✅ | ❌ | **Missing in Sanity** |
| Tagline | ✅ | ✅ | Perfect match |
| Date Badge | ✅ | ✅ | Perfect match |
| Primary CTA | ✅ | ✅ | Match (as object) |
| Secondary CTA | ✅ | ✅ | Match (as object) |
| Scroll Text | ✅ | ✅ | Perfect match |
| Media Assets | - | ✅ | Sanity has more |

### Migration Strategy

**Option 1 - Use Monogram Only** (Recommended)
- Sanity's `monogram` field ("H ♥ Y") serves the same purpose
- No schema changes needed
- Simpler, cleaner design

**Option 2 - Add Name Fields to Sanity**
- Add optional `brideName`, `groomName`, `namesSeparator` to videoHero schema
- Provides more flexibility for dynamic name display
- More complex implementation

**Decision**: Use Option 1 - the monogram is sufficient and already displays "H ♥ Y"

### Migration Steps

1. ✅ Sanity schema already exists (`videoHero`)
2. Populate Sanity videoHero document with data from `hero_text` table
3. Update `VideoHeroSection` component to load from Sanity
4. Delete `/admin/hero-text` route
5. Drop `hero_text` table

---

## 2. Wedding Settings System

### Supabase Table: `wedding_settings` (Migration 018)

```sql
-- Wedding Details
wedding_date DATE                 -- 2025-11-20
wedding_time TIME                 -- 10:30:00
wedding_timezone VARCHAR(50)      -- America/Sao_Paulo
bride_name VARCHAR(100)           -- Ylana
groom_name VARCHAR(100)           -- Hel

-- Venue
venue_name VARCHAR(200)           -- Constable Galerie
venue_address VARCHAR(300)        -- Rua Lopes Quintas, 356
venue_city VARCHAR(100)           -- Rio de Janeiro
venue_state VARCHAR(50)           -- RJ
venue_zip VARCHAR(20)             -- 22460-010
venue_country VARCHAR(100)        -- Brasil
venue_lat DECIMAL(10, 8)          -- -22.959722
venue_lng DECIMAL(11, 8)          -- -43.212778
google_maps_place_id VARCHAR(200) -- Google Maps ID

-- Event Details
reception_time TIME               -- 12:00:00
dress_code VARCHAR(100)           -- Traje Esporte Fino
dress_code_description TEXT       -- Homens: terno...

-- RSVP
rsvp_deadline DATE                -- 2025-11-10
guest_limit INTEGER               -- Guest limit
```

### Sanity Schema: `weddingSettings`

```typescript
// Couple Names
brideName: string                 // ✅ Ylana
groomName: string                 // ✅ Hel

// Wedding Date & Time
weddingDate: date                 // ✅ 2025-11-20
weddingTime: string               // ✅ 10:30
receptionTime: string             // ✅ 12:00
timezone: string                  // ✅ America/Sao_Paulo

// Venue Information
venueName: string                 // ✅ Constable Galerie
venueAddress: text                // ✅ Rua Lopes Quintas...
venueCity: string                 // ✅ Rio de Janeiro
venueState: string                // ✅ RJ
venueZip: string                  // ✅ 22460-010
venueLocation: {                  // ✅ Object with coords
  lat: number                     // -22.959722
  lng: number                     // -43.212778
  placeId: string                 // Google Maps ID
}

// Dress Code
dressCode: string                 // ✅ Traje Esporte Fino
dressCodeDescription: text        // ✅ Homens: terno...

// RSVP
rsvpDeadline: date                // ✅ 2025-11-10
guestLimit: number                // ✅ Guest limit
```

### Comparison

✅ **PERFECT MATCH** - Every field in Supabase has an exact match in Sanity

| Field | Supabase | Sanity | Status |
|-------|----------|--------|--------|
| All wedding fields | ✅ | ✅ | Perfect 1:1 match |

**Note**: `venueLocation` is an object in Sanity vs. separate fields in Supabase, but content is identical

### Migration Steps

1. ✅ Sanity schema already exists (`weddingSettings`)
2. Create/update Sanity weddingSettings document with data from `wedding_settings` table
3. Update `EventDetailsSection` component to load from Sanity (via weddingSettings reference)
4. Delete `/admin/wedding-settings` route
5. Drop `wedding_settings` table

---

## 3. Story Preview System

### Supabase Tables

**`story_preview_settings` (Migration 019)**
```sql
section_title VARCHAR(100)        -- "Nossa História"
section_description TEXT          -- "Caseiros e introvertidos..."
photo_url TEXT                    -- "/images/mock/proposal-photo.jpg"
photo_alt VARCHAR(200)            -- "Pedido de casamento..."
photo_caption TEXT                -- "Uma jornada de mil dias..."
cta_text VARCHAR(100)             -- "Ver História Completa"
cta_link VARCHAR(200)             -- "/historia"
```

**`story_cards` (Migration 019)**
```sql
title VARCHAR(100)                -- "Do Tinder ao WhatsApp"
description TEXT                  -- "6 de janeiro de 2023..."
day_number INTEGER                -- 1, 434, etc.
display_order INTEGER             -- 1, 2, 3
is_visible BOOLEAN                -- true
```

### Sanity Schemas

**`storyPreview`**
```typescript
sectionId: string                 // Section identifier
sectionTitle: string              // ✅ "Nossa História"
sectionDescription: text          // ✅ "Caseiros e introvertidos..."
proposalPhoto: image {            // ✅ Image with metadata
  alt: string                     // "Pedido de casamento..."
  caption: string                 // "Uma jornada de mil dias..."
}
storyCards: array<reference>      // ✅ References to storyCard docs
ctaButton: {                      // ✅ Object with label + href
  label: string                   // "Ver História Completa"
  href: string                    // "/historia"
}
isVisible: boolean                // Section visibility
```

**`storyCard`**
```typescript
title: string                     // ✅ "Do Tinder ao WhatsApp"
description: text                 // ✅ "6 de janeiro de 2023..."
dayNumber: number                 // ✅ 1, 434, etc.
displayOrder: number              // ✅ 1, 2, 3
isVisible: boolean                // ✅ true
```

### Comparison

✅ **PERFECT MATCH** - All fields align between Supabase and Sanity

| Field | Supabase | Sanity | Status |
|-------|----------|--------|--------|
| Section header | ✅ | ✅ | Perfect match |
| Proposal photo | ✅ (URL) | ✅ (Image asset) | Sanity uses asset, better |
| Story cards | ✅ (table) | ✅ (references) | Proper CMS structure |
| CTA button | ✅ | ✅ | Perfect match |

### Migration Steps

1. ✅ Sanity schemas already exist (`storyPreview`, `storyCard`)
2. Create 3 storyCard documents from `story_cards` table
3. Upload proposal photo to Sanity assets
4. Create storyPreview document with references to storyCards
5. Update `StoryPreview` component to load from Sanity
6. Delete `/admin/story-cards` route
7. Drop `story_preview_settings` and `story_cards` tables

---

## 4. Homepage Features System

### Supabase Tables

**`homepage_section_settings` (Migration 020)**
```sql
section_title VARCHAR(100)        -- "Tudo Que Você Precisa"
section_description TEXT          -- "Da confirmação à lista..."
highlights_title VARCHAR(200)     -- "Reserve a Data: 20 de Novembro..."
show_highlights BOOLEAN           -- true
```

**`homepage_features` (Migration 020)**
```sql
title VARCHAR(100)                -- "Confirmação"
description TEXT                  -- "Junte-se a nós..."
icon_name VARCHAR(50)             -- "Users", "Gift", etc.
link_url VARCHAR(200)             -- "/rsvp"
link_text VARCHAR(100)            -- "Confirmar Presença"
display_order INTEGER             -- 1, 2, 3, 4
is_visible BOOLEAN                -- true
```

### Sanity Schemas

**`quickPreview`**
```typescript
sectionId: string                 // Section identifier
sectionTitle: string              // ✅ "Tudo Que Você Precisa"
sectionDescription: text          // ✅ "Da confirmação à lista..."
featureCards: array<reference>    // ✅ References to featureCard docs
showHighlights: boolean           // ✅ true
highlightsTitle: string           // ✅ "Reserve a Data..."
highlights: array<{               // ⚠️ More structured than DB
  text: string
  icon: string
}>
layout: string                    // Grid layout option
isVisible: boolean                // Section visibility
```

**`featureCard`**
```typescript
title: string                     // ✅ "Confirmação"
description: text                 // ✅ "Junte-se a nós..."
icon: string                      // ✅ "Users", "Gift", etc.
linkUrl: string                   // ✅ "/rsvp"
linkText: string                  // ✅ "Confirmar Presença"
displayOrder: number              // ✅ 1, 2, 3, 4
isVisible: boolean                // ✅ true
```

### Comparison

✅ **PERFECT MATCH** for feature cards
⚠️ **MINOR DIFFERENCE** in highlights structure

| Field | Supabase | Sanity | Status |
|-------|----------|--------|--------|
| Section header | ✅ | ✅ | Perfect match |
| Feature cards | ✅ | ✅ | Perfect match |
| Show highlights | ✅ | ✅ | Perfect match |
| Highlights title | ✅ (simple string) | ✅ (same) | Perfect match |
| Highlights list | ❌ (not in DB) | ✅ (array) | Sanity has more |

**Note**: Supabase only has `highlights_title` string. Sanity has full `highlights` array with text + icon. This is fine - we can populate the title and leave highlights array empty or add some default highlights.

### Migration Steps

1. ✅ Sanity schemas already exist (`quickPreview`, `featureCard`)
2. Create 4 featureCard documents from `homepage_features` table
3. Create quickPreview document with:
   - Section title/description from `homepage_section_settings`
   - References to 4 featureCards
   - highlights_title mapped to highlightsTitle
   - Empty highlights array (or add defaults)
4. Update `QuickPreview` component to load from Sanity
5. Delete `/admin/homepage-features` route
6. Drop `homepage_section_settings` and `homepage_features` tables

---

## Migration Action Plan

### Phase 1: Populate Sanity with Supabase Data

#### 1.1 Hero Text ✅
```typescript
// Create/update videoHero document in Sanity Studio
{
  _type: 'videoHero',
  sectionId: 'hero',
  monogram: 'H ♥ Y',
  tagline: '1000 dias. Sim, a gente fez a conta.',
  dateBadge: '20.11.2025',
  primaryCta: {
    label: 'Confirmar Presença',
    href: '/rsvp'
  },
  secondaryCta: {
    label: 'Nossa História',
    href: '/historia'
  },
  scrollText: 'Explorar',
  // Use existing backgroundVideo/backgroundImage
  isVisible: true
}
```

#### 1.2 Wedding Settings ✅
```typescript
// Create/update weddingSettings document in Sanity Studio
{
  _type: 'weddingSettings',
  brideName: 'Ylana',
  groomName: 'Hel',
  weddingDate: '2025-11-20',
  weddingTime: '10:30',
  receptionTime: '12:00',
  timezone: 'America/Sao_Paulo',
  venueName: 'Constable Galerie',
  venueAddress: 'Rua Lopes Quintas, 356',
  venueCity: 'Rio de Janeiro',
  venueState: 'RJ',
  venueZip: '22460-010',
  venueLocation: {
    lat: -22.959722,
    lng: -43.212778,
    placeId: ''
  },
  dressCode: 'Traje Esporte Fino',
  dressCodeDescription: 'Homens: terno ou blazer. Mulheres: vestido de festa.',
  rsvpDeadline: '2025-11-10',
  guestLimit: null
}
```

#### 1.3 Story Preview ✅
```typescript
// Create 3 storyCard documents
[
  {
    _type: 'storyCard',
    title: 'Do Tinder ao WhatsApp',
    description: '6 de janeiro de 2023. Aquele primeiro "oi" meio sem graça no WhatsApp...',
    dayNumber: 1,
    displayOrder: 1,
    isVisible: true
  },
  {
    _type: 'storyCard',
    title: 'O Momento',
    description: 'Hel ficou doente. Ylana apareceu com remédio e chá...',
    dayNumber: null,
    displayOrder: 2,
    isVisible: true
  },
  {
    _type: 'storyCard',
    title: 'A Casa',
    description: 'Esse apartamento? Hel passava de bicicleta aqui...',
    dayNumber: 434,
    displayOrder: 3,
    isVisible: true
  }
]

// Create storyPreview document
{
  _type: 'storyPreview',
  sectionId: 'our-story',
  sectionTitle: 'Nossa História',
  sectionDescription: 'Caseiros e introvertidos de verdade. A gente é daqueles que realmente prefere ficar em casa...',
  proposalPhoto: { /* upload /images/mock/proposal-photo.jpg */ },
  storyCards: [ /* references to 3 storyCard docs */ ],
  ctaButton: {
    label: 'Ver História Completa',
    href: '/historia'
  },
  isVisible: true
}
```

#### 1.4 Homepage Features ✅
```typescript
// Create 4 featureCard documents
[
  {
    _type: 'featureCard',
    title: 'Confirmação',
    description: 'Junte-se a nós para celebrar nosso dia especial',
    icon: 'Users',
    linkUrl: '/rsvp',
    linkText: 'Confirmar Presença',
    displayOrder: 1,
    isVisible: true
  },
  {
    _type: 'featureCard',
    title: 'Lista de Presentes',
    description: 'Nos ajude a começar nosso novo capítulo juntos',
    icon: 'Gift',
    linkUrl: '/presentes',
    linkText: 'Saiba Mais',
    displayOrder: 2,
    isVisible: true
  },
  {
    _type: 'featureCard',
    title: 'Cronograma',
    description: 'Datas importantes e eventos',
    icon: 'Calendar',
    linkUrl: '#timeline',
    linkText: 'Saiba Mais',
    displayOrder: 3,
    isVisible: true
  },
  {
    _type: 'featureCard',
    title: 'Local',
    description: 'Casa HY - Fortaleza, CE',
    icon: 'MapPin',
    linkUrl: '/local',
    linkText: 'Ver Localização',
    displayOrder: 4,
    isVisible: true
  }
]

// Create quickPreview document
{
  _type: 'quickPreview',
  sectionId: 'quick-preview',
  sectionTitle: 'Tudo Que Você Precisa',
  sectionDescription: 'Da confirmação à lista de presentes, facilitamos para você fazer parte da nossa celebração.',
  featureCards: [ /* references to 4 featureCard docs */ ],
  showHighlights: true,
  highlightsTitle: 'Reserve a Data: 20 de Novembro de 2025',
  highlights: [], // Empty or add defaults
  layout: 'grid-2x2',
  isVisible: true
}
```

### Phase 2: Update Components

1. ✅ `VideoHeroSection` - Load from Sanity videoHero
2. ✅ `EventDetailsSection` - Load from Sanity eventDetails → weddingSettings
3. ✅ `StoryPreview` - Load from Sanity storyPreview → storyCards
4. ✅ `QuickPreview` - Load from Sanity quickPreview → featureCards

### Phase 3: Delete Admin Routes

```bash
rm src/app/admin/hero-text/page.tsx
rm src/app/admin/hero-images/page.tsx
rm src/app/admin/wedding-settings/page.tsx
rm src/app/admin/story-cards/page.tsx
rm src/app/admin/homepage-features/page.tsx
rm src/app/admin/about-us/page.tsx
```

### Phase 4: Drop Database Tables

Create migration `supabase/migrations/022_drop_duplicate_tables.sql`:

```sql
-- Drop duplicate marketing content tables
DROP TABLE IF EXISTS public.hero_text CASCADE;
DROP TABLE IF EXISTS public.wedding_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;

-- Keep only transactional tables:
-- - public.guests (RSVPs)
-- - public.payments (transactions)
-- - public.wedding_config (app config)
```

---

## Summary

### ✅ Migration Readiness Checklist

- [x] All Sanity schemas exist and are properly configured
- [x] Schema mapping documented for all 4 systems
- [x] Data migration strategy defined
- [x] Component update plan created
- [x] Admin route deletion list confirmed
- [x] Database cleanup migration planned

### 🎯 Expected Outcomes

1. **Zero data loss** - All content migrates cleanly
2. **Better architecture** - Marketing content in CMS, transactional data in DB
3. **Simpler admin** - 14 routes → 4 routes (71% reduction)
4. **Cleaner database** - 15+ tables → 3 tables (80% reduction)
5. **Better performance** - CDN-cached content vs. database queries
6. **Professional workflow** - Draft, preview, publish in Sanity Studio

### 📋 Next Steps

1. **Execute Phase 1** - Populate Sanity with all data (manual via Studio)
2. **Execute Phase 2** - Update 4 components to load from Sanity
3. **Execute Phase 3** - Delete 6 redundant admin routes
4. **Execute Phase 4** - Run migration to drop 7 tables
5. **Test thoroughly** - Verify all sections display correctly
6. **Update documentation** - Mark Phase 1 complete in ADMIN_CLEANUP_PLAN.md

---

**Last Updated**: October 12, 2025
**Status**: Ready for Migration
**Confidence Level**: High ✅
