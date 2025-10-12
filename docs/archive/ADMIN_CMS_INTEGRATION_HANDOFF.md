# Admin CMS Integration - Complete Handoff Document

**Date**: October 11, 2025
**Status**: All Sections Now Admin-Manageable via Supabase
**Migrations**: 018-021 created, ready to run

---

## 🎯 What Was Completed

### ✅ Database Migrations Created (4 new migrations)

All migrations are in `supabase/migrations/`:

1. **018_wedding_settings.sql** - Wedding date, time, venue, dress code
2. **019_story_cards.sql** - Story preview section (header + 3 moment cards)
3. **020_homepage_features.sql** - Homepage features section (4 navigation cards)
4. **021_hero_text.sql** - Video hero text overlay (names, tagline, CTAs)

### ✅ Admin Pages Created (4 new admin interfaces)

All admin pages created in `src/app/admin/`:

1. **/admin/wedding-settings** - Single-row wedding configuration form
2. **/admin/story-cards** - Story preview header + moment cards management
3. **/admin/homepage-features** - Homepage section header + feature cards
4. **/admin/hero-text** - Video hero overlay text configuration

### ✅ Frontend Components Updated (2 of 4)

1. **EventDetailsSection** - ✅ COMPLETE - Loads from `wedding_settings`
2. **StoryPreview** - ✅ COMPLETE - Loads from `story_preview_settings` + `story_cards`
3. **QuickPreview** - ⏳ TODO - Needs to load from `homepage_section_settings` + `homepage_features`
4. **VideoHeroSection** - ⏳ TODO - Needs to load from `hero_text`

---

## 🚀 Quick Start Guide

### Step 1: Start Docker/OrbStack

```bash
# Migrations won't run without Docker
# Make sure OrbStack or Docker Desktop is running
```

### Step 2: Start Supabase

```bash
npx supabase start
```

### Step 3: Migrations Run Automatically

The 4 new migrations (018-021) will run automatically when Supabase starts. You'll see:

```
✅ Migration 018 complete: Wedding settings table created
✅ Migration 019 complete: Story preview tables created
✅ Migration 020 complete: Homepage features tables created
✅ Migration 021 complete: Hero text table created
```

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Access Admin Pages

Navigate to:
- http://localhost:3001/admin-login
- Then access any of the new admin pages listed below

---

## 📋 Admin Pages Guide

### 1. /admin/wedding-settings

**Purpose**: Manage all wedding event details
**Database**: `wedding_settings` (single row)

**Fields**:
- Wedding date & time
- Bride & groom names
- Venue details (name, address, city, state, zip, lat/lng)
- Dress code & description
- RSVP deadline
- Guest limit

**Used By**:
- `EventDetailsSection` (countdown timer, event details grid, dress code)
- `QuickPreview` (wedding highlights card - date, time, venue, dress code)
- Future: `WeddingLocation` component

### 2. /admin/story-cards

**Purpose**: Manage "Nossa História" section on homepage
**Database**: `story_preview_settings` (header) + `story_cards` (moments)

**Section Settings**:
- Section title ("Nossa História")
- Section description (intro paragraph)
- Proposal photo URL & alt text
- Photo caption
- CTA button text & link

**Story Cards** (3 timeline moments):
- Title
- Description
- Day number (optional reference)
- Display order

**Used By**:
- `StoryPreview` component on homepage

### 3. /admin/homepage-features

**Purpose**: Manage "Tudo Que Você Precisa" section (QuickPreview)
**Database**: `homepage_section_settings` (header) + `homepage_features` (cards)

**Section Settings**:
- Section title
- Section description
- Highlights card title
- Show/hide highlights card

**Feature Cards** (4 navigation cards):
- Title
- Description
- Icon name (Lucide icons: Users, Gift, Calendar, MapPin, etc.)
- Link URL
- Link text
- Display order

**Used By**:
- `QuickPreview` component on homepage

### 4. /admin/hero-text

**Purpose**: Manage video hero section text overlay
**Database**: `hero_text` (single row)

**Fields**:
- Monogram (e.g., "H ♥ Y")
- Bride & groom names
- Names separator (& or e)
- Tagline/subtitle
- Date badge (20.11.2025)
- Primary CTA text & link
- Secondary CTA text & link
- Scroll indicator text

**Used By**:
- `VideoHeroSection` component

**Note**: Hero images/videos are managed separately via `/admin/hero-images` (in `site_settings` table)

---

## 🔧 Remaining Frontend Updates

### QuickPreview Component

**File**: `src/components/sections/QuickPreview.tsx`
**Status**: ⏳ TODO
**Current**: Hardcoded feature cards and section header
**Target**: Load from `homepage_section_settings` + `homepage_features`

**Implementation Guide**:
```typescript
// Add imports
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Add interfaces
interface HomepageSectionSettings {
  section_title: string
  section_description: string
  highlights_title: string
  show_highlights: boolean
}

interface HomepageFeature {
  id: string
  title: string
  description: string
  icon_name: string
  link_url: string
  link_text: string | null
  display_order: number
}

// Add state and data loading
const [settings, setSettings] = useState<HomepageSectionSettings | null>(null)
const [features, setFeatures] = useState<HomepageFeature[]>([])

// Load data from Supabase
const loadData = async () => {
  const supabase = createClient()

  const { data: settingsData } = await supabase
    .from('homepage_section_settings')
    .select('*')
    .eq('is_published', true)
    .limit(1)
    .maybeSingle()

  const { data: featuresData } = await supabase
    .from('homepage_features')
    .select('*')
    .eq('is_visible', true)
    .order('display_order')

  setSettings(settingsData)
  setFeatures(featuresData || [])
}

// Map icon names to Lucide icons
import * as Icons from 'lucide-react'
const Icon = Icons[feature.icon_name as keyof typeof Icons] || Icons.Heart

// Replace hardcoded values with settings/features data
```

### VideoHeroSection Component

**File**: `src/components/sections/VideoHeroSection.tsx`
**Status**: ⏳ TODO
**Current**: Hardcoded names, tagline, CTAs (images already load from Supabase)
**Target**: Load text from `hero_text`

**Implementation Guide**:
```typescript
// Add interface
interface HeroText {
  monogram: string
  bride_name: string
  groom_name: string
  names_separator: string
  tagline: string
  date_badge: string
  primary_cta_text: string
  primary_cta_link: string
  secondary_cta_text: string
  secondary_cta_link: string
  scroll_text: string
}

// Add state
const [heroText, setHeroText] = useState<HeroText | null>(null)

// Load data
const loadHeroText = async () => {
  const supabase = createClient()
  const { data } = await supabase
    .from('hero_text')
    .select('*')
    .eq('is_published', true)
    .limit(1)
    .maybeSingle()

  setHeroText(data)
}

// Replace hardcoded strings:
// - Monogram: {heroText.monogram}
// - Names: {heroText.bride_name} {heroText.names_separator} {heroText.groom_name}
// - Tagline: {heroText.tagline}
// - Date badge: {heroText.date_badge}
// - Primary CTA: {heroText.primary_cta_text} → {heroText.primary_cta_link}
// - Secondary CTA: {heroText.secondary_cta_text} → {heroText.secondary_cta_link}
// - Scroll text: {heroText.scroll_text}
```

---

## 🗄️ Database Schema Reference

### wedding_settings
- **Type**: Single-row configuration
- **Purpose**: All wedding event details
- **Key fields**: wedding_date, wedding_time, venue_name, venue_city, dress_code

### story_preview_settings
- **Type**: Single-row configuration
- **Purpose**: "Nossa História" section header
- **Key fields**: section_title, section_description, photo_url, cta_text

### story_cards
- **Type**: Multiple rows
- **Purpose**: Timeline moment cards (3 default)
- **Key fields**: title, description, display_order, is_visible

### homepage_section_settings
- **Type**: Single-row configuration
- **Purpose**: "Tudo Que Você Precisa" section header
- **Key fields**: section_title, section_description, highlights_title

### homepage_features
- **Type**: Multiple rows
- **Purpose**: Feature navigation cards (4 default)
- **Key fields**: title, description, icon_name, link_url, display_order

### hero_text
- **Type**: Single-row configuration
- **Purpose**: Video hero overlay text
- **Key fields**: bride_name, groom_name, tagline, date_badge, primary_cta_text

---

## 🧪 Testing Checklist

### Before Testing
1. ✅ Ensure Docker/OrbStack is running
2. ✅ Run `npx supabase start`
3. ✅ Verify migrations ran successfully (check output)
4. ✅ Run `npm run dev`

### Admin Pages Testing
1. **Wedding Settings**:
   - [ ] Can edit wedding date/time
   - [ ] Can edit venue details
   - [ ] Can edit dress code
   - [ ] Changes save successfully

2. **Story Cards**:
   - [ ] Can edit section header
   - [ ] Can edit photo URL
   - [ ] Can add/edit/delete story cards
   - [ ] Can reorder cards (display_order)
   - [ ] Can toggle visibility

3. **Homepage Features**:
   - [ ] Can edit section header
   - [ ] Can add/edit/delete feature cards
   - [ ] Can change icons (dropdown)
   - [ ] Can reorder cards
   - [ ] Can toggle visibility

4. **Hero Text**:
   - [ ] Can edit names
   - [ ] Can edit tagline
   - [ ] Can edit CTAs
   - [ ] Can preview changes (shows preview in form)

### Frontend Testing
1. **EventDetailsSection** (✅ COMPLETE):
   - [ ] Countdown timer uses correct wedding date
   - [ ] Event details show dynamic venue name/city
   - [ ] Dress code displays correctly
   - [ ] All data loads from Supabase

2. **StoryPreview** (✅ COMPLETE):
   - [ ] Section header loads from settings
   - [ ] Photo displays (if URL provided)
   - [ ] 3 story cards display in order
   - [ ] CTA button uses dynamic text/link

3. **QuickPreview** (⏳ TODO):
   - [ ] Section header loads from settings
   - [ ] 4 feature cards display in order
   - [ ] Icons render correctly
   - [ ] Links work

4. **VideoHeroSection** (⏳ TODO):
   - [ ] Names display correctly
   - [ ] Tagline shows
   - [ ] CTAs use correct text/links
   - [ ] Date badge shows

---

## 📝 Default Content Inserted

All migrations insert default content so the site works immediately:

### Wedding Settings (Migration 018)
- Date: 2025-11-20
- Time: 10:30
- Venue: Constable Galerie
- Dress code: Traje Esporte Fino

### Story Cards (Migration 019)
- Card 1: "Do Tinder ao WhatsApp"
- Card 2: "O Momento"
- Card 3: "A Casa"

### Homepage Features (Migration 020)
- Feature 1: Confirmação (Users icon) → /rsvp
- Feature 2: Lista de Presentes (Gift icon) → /presentes
- Feature 3: Cronograma (Calendar icon) → #timeline
- Feature 4: Local (MapPin icon) → /local

### Hero Text (Migration 021)
- Monogram: "H ♥ Y"
- Names: Ylana & Hel
- Tagline: "1000 dias. Sim, a gente fez a conta."
- Date: 20.11.2025

**All default content can be edited via admin pages!**

---

## 🔄 Next Steps

### Immediate (This Session)
1. ✅ Migrations 018-021 created
2. ✅ Admin pages created (/admin/wedding-settings, /admin/story-cards, etc.)
3. ✅ EventDetailsSection updated
4. ✅ StoryPreview updated
5. ⏳ **TODO**: Update QuickPreview component
6. ⏳ **TODO**: Update VideoHeroSection component

### After Component Updates
1. Test all admin pages
2. Verify all data loads correctly
3. Update real content via admin
4. Remove mock placeholders
5. Update IMPLEMENTATION_ROADMAP.md status

### Future Enhancements
1. Add image upload to admin pages (currently URLs only)
2. Add drag-and-drop reordering for cards
3. Add rich text editor for descriptions
4. Add bulk import/export for content

---

## 🎉 Achievement Summary

**Before**:
- EventDetailsSection: Hardcoded wedding date, venue, dress code
- StoryPreview: Hardcoded 3 story cards, header, photo
- QuickPreview: Hardcoded 4 feature cards, section header
- VideoHeroSection: Hardcoded names, tagline, CTAs

**After (When Complete)**:
- **100% of homepage content** admin-manageable via Supabase
- **4 new database tables** with proper RLS policies
- **4 new admin interfaces** for content management
- **All sections** load dynamically from database
- **Zero hardcoded content** on homepage

**Progress**:
- ✅ Database: 100% complete (4 migrations)
- ✅ Admin: 100% complete (4 admin pages)
- 🟡 Frontend: 50% complete (2 of 4 components updated)

---

## 📚 Additional Resources

### Admin Page Patterns

**Single-Row Configuration** (wedding_settings, hero_text):
- Load with `.maybeSingle()`
- Update with `.update().eq('id', id)`
- Simple form interface

**Multiple Rows** (story_cards, homepage_features):
- Load with `.select('*').order('display_order')`
- Add/Edit/Delete CRUD operations
- Toggle visibility per row
- Display order management

### Common Supabase Patterns

```typescript
// Load single published settings
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('is_published', true)
  .limit(1)
  .maybeSingle()

// Load multiple visible items
const { data } = await supabase
  .from('table_name')
  .select('*')
  .eq('is_visible', true)
  .order('display_order')

// Update single row
await supabase
  .from('table_name')
  .update({ ...fields })
  .eq('id', id)

// Insert new row
await supabase
  .from('table_name')
  .insert({ ...fields })
```

---

## 🐛 Troubleshooting

### Migrations Don't Run
- **Solution**: Ensure Docker/OrbStack is running, then restart Supabase

### Admin Pages Show No Data
- **Solution**: Check migrations ran successfully, verify `is_published=true` in database

### Frontend Shows No Data
- **Solution**: Check browser console for errors, verify Supabase connection, check RLS policies

### Images Don't Load
- **Solution**: Images managed separately via `/admin/hero-images` and media tables

---

**Last Updated**: October 11, 2025
**Next Session**: Complete QuickPreview and VideoHeroSection components
**Contact**: Continue from this handoff document
