# Gallery Migration to Sanity - Agent Prompt

## 🎯 Mission

Migrate the entire gallery feature (`/galeria` page) from Supabase to Sanity CMS, enabling image uploads and management through Sanity Studio with a beautiful masonry layout on the frontend.

---

## 📋 Context

### Current State
- **Gallery Page**: `http://localhost:3000/galeria`
- **Current Backend**: Supabase (database + storage)
- **Frontend**: `/src/app/galeria/page.tsx` - React component with masonry layout
- **Admin Upload**: `/src/app/admin/galeria/page.tsx` - Supabase-based upload interface
- **Images**: ~180+ photos from relationship stored in Supabase storage

### What Already Exists
✅ **Sanity Schema**: `galleryImage.ts` schema already created (check `/src/sanity/schemas/documents/galleryImage.ts`)
✅ **Migration Script**: `scripts/migrate-gallery-to-sanity.ts` exists but may need updates
✅ **Documentation**:
- `GALLERY_MIGRATION_GUIDE.md` - Comprehensive migration guide
- `GALLERY_MIGRATION_SUMMARY.md` - Migration summary

### Project Structure
```
thousanddaysoflove/
├── src/
│   ├── app/
│   │   ├── galeria/page.tsx          # Gallery page (needs update)
│   │   └── admin/galeria/page.tsx    # Admin upload (can be removed)
│   ├── sanity/
│   │   ├── schemas/documents/galleryImage.ts  # ✅ Already exists
│   │   └── queries/gallery.ts        # Needs creation
│   └── components/
│       └── gallery/                  # Gallery components
├── scripts/
│   └── migrate-gallery-to-sanity.ts  # Migration script
└── .env.local                        # Has SANITY_API_WRITE_TOKEN
```

---

## 🎨 Desired Result

### Gallery Page Features
1. **Masonry Layout**: Pinterest-style responsive grid
2. **Image Display**: High-quality images from Sanity CDN
3. **Lightbox**: Click to view full-size images
4. **Categories/Filtering**: Optional filter by category (travel, pets, dates, home, etc.)
5. **Lazy Loading**: Progressive image loading for performance
6. **Image Metadata**: Show captions, dates, locations (optional)

### Sanity Studio Management
1. **Bulk Upload**: Upload multiple images at once
2. **Rich Metadata**:
   - Title/caption
   - Date taken
   - Location/venue
   - Category tags
   - Visibility toggle
   - Display order
3. **Image Optimization**: Automatic WebP conversion and responsive sizes
4. **Easy Organization**: Drag-and-drop ordering, bulk edit

---

## 🛠️ Technical Requirements

### 1. Sanity Schema (Already Exists - Verify & Update)
**File**: `/src/sanity/schemas/documents/galleryImage.ts`

**Required Fields:**
```typescript
{
  _type: 'galleryImage',
  title: string,              // Caption/title
  image: SanityImage,         // Main image asset
  dateTaken: datetime,        // When photo was taken
  location: string,           // Optional location
  category: string[],         // Multiple categories
  tags: string[],             // Keywords
  isFeatured: boolean,        // Featured images
  displayOrder: number,       // Manual ordering
  isVisible: boolean,         // Show/hide
  metadata: {
    photographer: string,     // Who took it
    camera: string,          // Optional
    description: text        // Longer description
  }
}
```

**Categories:**
- `travel` - Viagens
- `dates` - Encontros/Dates
- `home` - Casa
- `pets` - Cachorros
- `family` - Família
- `celebrations` - Celebrações
- `food` - Comida/Restaurantes
- `nature` - Natureza
- `special_moments` - Momentos Especiais
- `random` - Aleatórias

### 2. Sanity Query
**File**: `/src/sanity/queries/gallery.ts` (Create)

```typescript
// Fetch all gallery images with filters
export const galleryQuery = groq`
  *[_type == "galleryImage" && isVisible == true] | order(displayOrder asc, dateTaken desc) {
    _id,
    title,
    image {
      asset-> {
        _id,
        url,
        metadata {
          dimensions,
          lqip
        }
      },
      alt,
      hotspot
    },
    dateTaken,
    location,
    category,
    tags,
    isFeatured,
    displayOrder
  }
`

// Fetch featured images only
export const featuredGalleryQuery = groq`
  *[_type == "galleryImage" && isVisible == true && isFeatured == true] | order(displayOrder asc) [0...12]
`

// Fetch by category
export const galleryByCategoryQuery = (category: string) => groq`
  *[_type == "galleryImage" && isVisible == true && "${category}" in category] | order(dateTaken desc)
`
```

### 3. Frontend Gallery Page
**File**: `/src/app/galeria/page.tsx` (Update)

**Requirements:**
- Load images from Sanity (not Supabase)
- Masonry grid layout (use `react-masonry-css` or CSS grid)
- Lightbox for full-size viewing (use `yet-another-react-lightbox`)
- Category filter UI
- Lazy loading with IntersectionObserver
- Responsive: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
- Image optimization with Sanity's built-in CDN parameters

**Key Components:**
```typescript
// Sanity image URL builder with optimization
import imageUrlBuilder from '@sanity/image-url'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder
    .image(source)
    .auto('format')           // Auto WebP
    .quality(80)              // Optimize quality
    .fit('max')               // Preserve aspect ratio
}

// Usage:
<img
  src={urlFor(image).width(800).url()}
  srcSet={`
    ${urlFor(image).width(400).url()} 400w,
    ${urlFor(image).width(800).url()} 800w,
    ${urlFor(image).width(1200).url()} 1200w
  `}
/>
```

### 4. Remove Admin Upload Page
**File**: `/src/app/admin/galeria/page.tsx`

Since Sanity Studio provides better image management:
- Remove this admin page
- Update navigation to point to Sanity Studio
- Document Sanity Studio workflow for uploading

---

## 📦 Migration Steps

### Phase 1: Verify & Update Schema
1. Review existing `galleryImage.ts` schema
2. Ensure all fields match requirements
3. Add any missing fields
4. Update Sanity desk structure to show gallery section

### Phase 2: Create Queries
1. Create `/src/sanity/queries/gallery.ts`
2. Add gallery queries with filters
3. Add image URL builder utilities

### Phase 3: Update Frontend
1. Update `/src/app/galeria/page.tsx`:
   - Replace Supabase client with Sanity client
   - Update data fetching logic
   - Ensure masonry layout works
   - Add category filters
   - Implement lightbox
   - Add lazy loading

### Phase 4: Sanity Studio Setup
1. Add gallery section to Sanity desk structure
2. Configure bulk upload capabilities
3. Test image upload workflow
4. Create documentation for content editors

### Phase 5: Data Migration (Optional)
If user wants to migrate existing Supabase images:
1. Review existing migration script
2. Update script to handle Sanity API properly
3. Run migration for existing ~180 images
4. Verify all images uploaded correctly

### Phase 6: Cleanup
1. Remove admin galeria page
2. Update navigation links
3. Remove Supabase gallery-related code
4. Update documentation

---

## 🎯 Success Criteria

After completion:
- [ ] Gallery page loads images from Sanity
- [ ] Beautiful masonry layout displays correctly
- [ ] Lightbox works for full-size viewing
- [ ] Category filtering works
- [ ] Images load fast with CDN optimization
- [ ] Sanity Studio has easy upload interface
- [ ] Can upload multiple images at once
- [ ] No references to Supabase gallery code remain
- [ ] Documentation updated

---

## 🚀 Agent Recommendations

Use these specialized agents:

1. **backend-architect**: Schema review, query design, API integration
2. **frontend-developer**: Gallery page UI/UX, masonry layout, lightbox, performance
3. **ux-researcher**: Gallery organization, filtering, user workflow
4. **workflow-optimizer**: Migration process, content editor workflow

---

## 📚 Reference Files

**Must Read:**
- `/src/sanity/schemas/documents/galleryImage.ts` - Existing schema
- `/src/app/galeria/page.tsx` - Current gallery page
- `GALLERY_MIGRATION_GUIDE.md` - Migration documentation
- `GALLERY_MIGRATION_SUMMARY.md` - Summary of approach

**Similar Patterns:**
- `/src/app/historia/page.tsx` - Recently migrated timeline (reference for Sanity integration)
- `/src/sanity/queries/timeline.ts` - Query patterns to follow
- `/src/components/sections/StoryPreview.tsx` - Image handling with Sanity

---

## ⚙️ Environment

**Available:**
- `SANITY_API_WRITE_TOKEN` - Already in `.env.local`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - ala3rp0f
- `NEXT_PUBLIC_SANITY_DATASET` - production

**Tech Stack:**
- Next.js 15.5.4 + React 19
- Sanity CMS 4.10.2
- Tailwind CSS v4
- TypeScript 5
- Framer Motion (animations)

---

## 💡 Design Requirements

### Visual Style
- Monochromatic color palette (cream, charcoal, silver-gray)
- Typography: Playfair Display (headings), Crimson Text (body)
- Wedding invitation aesthetic
- Generous white space
- Subtle botanical decorative elements
- Mobile-first responsive design

### Layout Preferences
- Masonry grid (Pinterest-style)
- 1 column on mobile, 2-3 on tablet, 3-4 on desktop
- Equal gutters between images
- Smooth hover effects
- Elegant transitions

---

## 🎬 Getting Started

**Recommended Prompt:**
```
For the "Thousand Days of Love" wedding website, migrate the gallery feature from
Supabase to Sanity CMS. The gallery is at /galeria and should display relationship
photos in a beautiful masonry layout.

Key requirements:
1. Update /src/app/galeria/page.tsx to load from Sanity instead of Supabase
2. Ensure galleryImage schema has all necessary fields
3. Create Sanity queries for gallery data
4. Implement masonry layout with lightbox
5. Add category filtering
6. Optimize images with Sanity CDN
7. Remove admin upload page (Sanity Studio will handle this)

Reference GALLERY_TO_SANITY_PROMPT.md for complete specifications.

Use backend-architect and frontend-developer agents to ensure professional
implementation with optimal performance.
```

---

## 📝 Notes

- **Image Count**: ~180+ photos (manageable for Sanity free tier)
- **Performance Goal**: Sub-2s page load with lazy loading
- **CDN Benefit**: 60% faster loading vs Supabase (from previous analysis)
- **Cost Savings**: Eliminates Supabase storage costs
- **User Experience**: Sanity Studio provides better image management than custom admin

---

## 🔗 Related Work

**Recently Completed:**
- ✅ Timeline migration to Sanity (3 chapters, 15 moments)
- ✅ StoryPreview section with Sanity integration
- ✅ Sanity desk structure reorganization
- ✅ Clear naming conventions established

**Pattern to Follow:**
The timeline migration is the perfect reference - it shows how to:
- Create Sanity queries
- Update frontend to load from Sanity
- Handle images from Sanity CDN
- Maintain performance and UX

Apply the same patterns to the gallery feature! 🚀
