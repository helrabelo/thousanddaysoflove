# Sanity Section Schemas - Complete Implementation

## Overview
All 7 section schemas have been successfully created following the DTF-inspired modular architecture pattern. These schemas enable flexible page composition by allowing pages to reference reusable content sections.

## Architecture Pattern
```
Documents (Reusable Content)
    ↓ referenced by
Sections (Page Building Blocks)
    ↓ composed into
Pages (Full Pages)
```

---

## Section Schemas Created

### 1. **videoHero.ts** - Video Hero Section
**Purpose**: Full-screen hero with background video or image, monogram, and CTAs

**Key Fields**:
- `monogram` (string) - Couple's monogram (e.g., "H ♥ Y")
- `tagline` (text) - Subtitle/invitation text
- `dateBadge` (string) - Formatted wedding date (e.g., "20.11.2025")
- `primaryCta` (object) - Main CTA button with label + href
- `secondaryCta` (object) - Secondary CTA button (optional)
- `scrollText` (string) - Scroll indicator text
- `backgroundVideo` (file) - Background video (MP4)
- `backgroundImage` (image) - Fallback background image
- `posterImage` (image) - Video loading poster

**Use Case**: Homepage hero section showcasing the couple

---

### 2. **eventDetails.ts** - Event Details Section
**Purpose**: Wedding countdown timer, event details, and dress code

**Key Fields**:
- `sectionTitle` (string) - Default: "Faltam Apenas"
- `weddingSettings` (reference) - Links to weddingSettings singleton
- `showCountdown` (boolean) - Display countdown timer
- `showEventDetails` (boolean) - Display date/time/location
- `showDressCode` (boolean) - Display dress code info
- `additionalContent` (text) - Optional extra text

**References**: `weddingSettings` document

**Use Case**: Event information with live countdown

---

### 3. **storyPreview.ts** - Story Preview Section
**Purpose**: Timeline preview of couple's journey with key moments

**Key Fields**:
- `sectionTitle` (string) - Default: "Nossa História"
- `sectionDescription` (text) - Section intro
- `proposalPhoto` (image) - Featured proposal photo with caption
- `storyCards` (array of references) - Timeline moments (1-6 cards)
- `ctaButton` (object) - Button to full story page

**References**: `storyCard` documents

**Use Case**: Homepage story preview with timeline

---

### 4. **aboutUs.ts** - About Us Section
**Purpose**: Rich text about the couple with photos

**Key Fields**:
- `sectionTitle` (string) - Default: "Sobre Nós"
- `content` (portable text) - Rich formatted text with headings, quotes
- `couplePhotos` (array of images) - Photo gallery (max 4)
- `layout` (string) - Layout options:
  - `text-left` - Text left, photos right
  - `text-right` - Text right, photos left
  - `centered` - Text center, photos below

**Use Case**: Detailed couple biography page

---

### 5. **ourFamily.ts** - Our Family Section
**Purpose**: Showcase the couple's beloved pets

**Key Fields**:
- `sectionTitle` (string) - Default: "Nossa Família"
- `sectionDescription` (text) - Intro about pet family
- `pets` (array of references) - Pet profiles (1-6 pets)
- `layout` (string) - Display options:
  - `grid-2x2` - 2×2 grid
  - `grid-3col` - 3 columns
  - `grid-4col` - 4 columns
  - `carousel` - Swipeable carousel
- `showAdoptionDates` (boolean) - Display adoption dates

**References**: `pet` documents

**Use Case**: Pet family showcase section

---

### 6. **quickPreview.ts** - Quick Preview/Features Section
**Purpose**: Navigation hub with feature cards to key site sections

**Key Fields**:
- `sectionTitle` (string) - Default: "Tudo Que Você Precisa"
- `sectionDescription` (text) - Section intro
- `featureCards` (array of references) - Navigation cards (2-6 cards)
- `layout` (string) - Grid options:
  - `grid-2x2` - 2×2 grid
  - `grid-3col` - 3 columns
  - `grid-4col` - 4 columns
- `showHighlights` (boolean) - Show additional highlights
- `highlightsTitle` (string) - Highlights section title
- `highlights` (array of objects) - Highlight items with icons

**References**: `featureCard` documents

**Use Case**: Homepage feature navigation section

---

### 7. **weddingLocation.ts** - Wedding Location Section
**Purpose**: Interactive map and directions to wedding venue

**Key Fields**:
- `sectionTitle` (string) - Default: "Como Chegar"
- `sectionDescription` (text) - Additional instructions
- `weddingSettings` (reference) - Links to venue data
- `mapStyle` (string) - Google Maps style:
  - `standard` - Default style
  - `silver` - Elegant silver theme
  - `retro` - Retro style
  - `dark` - Dark mode
- `mapZoom` (number) - Initial zoom level (10-20)
- `showDirections` (boolean) - Show Google Maps/Waze button
- `nearbyPlaces` (array of objects) - Nearby points of interest:
  - Hotels, parking, restaurants, landmarks, transport
- `transportationInfo` (object) - Parking and transit details:
  - `hasParking` (boolean)
  - `parkingDetails` (text)
  - `publicTransport` (text)
  - `valetService` (boolean)

**References**: `weddingSettings` document

**Use Case**: Location and directions page

---

## File Structure

```
src/sanity/schemas/
├── index.ts                    # Main schema registry
├── documents/
│   ├── index.ts
│   ├── featureCard.ts          # Referenced by quickPreview
│   ├── pet.ts                  # Referenced by ourFamily
│   ├── storyCard.ts            # Referenced by storyPreview
│   └── weddingSettings.ts      # Referenced by eventDetails, weddingLocation
├── sections/
│   ├── index.ts
│   ├── videoHero.ts            # ✅ NEW
│   ├── eventDetails.ts         # ✅ NEW
│   ├── storyPreview.ts         # ✅ NEW
│   ├── aboutUs.ts              # ✅ NEW
│   ├── ourFamily.ts            # ✅ NEW
│   ├── quickPreview.ts         # ✅ NEW
│   └── weddingLocation.ts      # ✅ NEW
└── globals/
    ├── index.ts
    ├── footer.ts
    ├── navigation.ts
    ├── seoSettings.ts
    └── siteSettings.ts
```

---

## Common Features Across All Sections

### Standard Fields
All section schemas include:
- `sectionId` (string) - Unique identifier for navigation/anchors
- `isVisible` (boolean) - Toggle section visibility
- Preview configuration with title/subtitle/media

### Design Principles
- **Portuguese UI**: All field titles and descriptions in Portuguese for content editors
- **Validation**: Required fields properly validated
- **Documentation**: Helpful descriptions and placeholders
- **Icons**: Lucide React icons for visual identification
- **Defaults**: Sensible default values for quick setup

### Preview System
Each schema includes intelligent preview showing:
- Section title/type
- Key configuration details
- Reference counts (e.g., "4 pets", "3 story cards")
- Visual media when available

---

## Integration with Existing Schemas

### Document References
Sections reference these existing documents:
- `weddingSettings` - Event details, venue, couple names
- `pet` - Pet profiles with photos and bios
- `storyCard` - Timeline moments
- `featureCard` - Navigation cards with icons

### Schema Registry
All schemas are exported through:
```typescript
src/sanity/schemas/index.ts
```

Organized as:
```typescript
export const schemaTypes = [
  ...documentSchemas,    // Reusable content
  ...sectionSchemas,     // Page sections (7 new schemas)
  ...globalSchemas,      // Singleton settings
]
```

---

## Next Steps

### 1. Page Schemas
Create page schemas that reference these sections:
```typescript
// Example: Homepage schema
{
  name: 'homepage',
  fields: [
    {
      name: 'sections',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'videoHero' }] },
        { type: 'reference', to: [{ type: 'eventDetails' }] },
        { type: 'reference', to: [{ type: 'storyPreview' }] },
        // etc.
      ]
    }
  ]
}
```

### 2. Frontend Components
Build React components for each section:
- `components/sections/VideoHero.tsx`
- `components/sections/EventDetails.tsx`
- `components/sections/StoryPreview.tsx`
- etc.

### 3. Sanity Studio Configuration
Update `sanity.config.ts` to import schemas:
```typescript
import { schemaTypes } from './src/sanity/schemas'

export default defineConfig({
  // ...
  schema: {
    types: schemaTypes,
  },
})
```

### 4. Desk Structure
Create custom desk structure for better content organization:
```typescript
// Group sections by type
S.list()
  .title('Content')
  .items([
    S.listItem().title('Sections').child(/* ... */),
    S.listItem().title('Documents').child(/* ... */),
    S.listItem().title('Settings').child(/* ... */),
  ])
```

---

## Benefits of This Architecture

### For Developers
- **Type-safe**: Full TypeScript support
- **Modular**: Reusable sections across pages
- **Maintainable**: Clear separation of concerns
- **Flexible**: Easy to add new section types

### For Content Editors
- **Intuitive**: Portuguese UI with helpful descriptions
- **Visual**: Image previews and icons
- **Organized**: Logical grouping of related content
- **Powerful**: Rich content editing with portable text

### For the Wedding Site
- **Consistent**: Shared content (weddingSettings, pets, etc.)
- **Dynamic**: Live countdown, maps, real-time updates
- **Beautiful**: Rich media support (video, images, galleries)
- **Fast**: Efficient references instead of duplication

---

## File Locations

All schemas created at:
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/videoHero.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/eventDetails.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/storyPreview.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/aboutUs.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/ourFamily.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/quickPreview.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/weddingLocation.ts`

Index files:
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/index.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/sections/index.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/documents/index.ts`
- `/Users/helrabelo/code/personal/thousanddaysoflove/src/sanity/schemas/globals/index.ts`

---

## Status: ✅ COMPLETE

All 7 section schemas implemented with:
- Full TypeScript types
- Comprehensive validation
- Rich field configurations
- Portuguese content editor UI
- Preview configurations
- Proper schema organization
- Export structure ready for Sanity Studio
