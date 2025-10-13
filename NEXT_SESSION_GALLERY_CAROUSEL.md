# Gallery Multi-Media Carousel Implementation - Next Session Prompt

## Context
We just completed refactoring the **"Nossa História" (Story Moments)** section to support multiple images/videos per moment with an autoplay carousel. Now we need to apply the same pattern to the **Gallery** section.

## Current Gallery Implementation

### Sanity Schema
**File**: `src/sanity/schemas/documents/galleryImage.ts`

Currently supports:
- Single image per gallery item
- Title, description, date taken
- Category field
- Featured/public flags
- Tags array

### Frontend Components
**File**: `src/components/gallery/MasonryGallery.tsx`

Current behavior:
- Displays images in masonry grid layout
- Click to open lightbox
- Filter by category
- No video support
- One image per card

## Goal
Refactor the Gallery to support **multiple images and/or videos** per gallery item, just like we did for Story Moments.

## Required Changes

### 1. Backend (Sanity Schema)

#### Update `galleryImage` schema
**File**: `src/sanity/schemas/documents/galleryImage.ts`

**Current structure**:
```typescript
{
  name: 'galleryImage',
  fields: [
    { name: 'title' },
    { name: 'image', type: 'image' },  // Single image
    { name: 'description' },
    { name: 'category' },
    // ... other fields
  ]
}
```

**Required changes**:
- Replace single `image` field with `media` array (similar to storyMoment)
- Each media item should have:
  - `mediaType`: 'image' | 'video'
  - `image` or `video` asset
  - `alt`: alternative text
  - `caption`: optional caption
  - `displayOrder`: number for ordering
- Keep legacy `image` field hidden for backwards compatibility
- Rename document to `galleryAlbum` (or keep as `galleryImage` with better preview)
- Update preview to show media count

#### Update Gallery Queries
**File**: `src/sanity/queries/gallery.ts`

- Update GROQ queries to fetch media arrays
- Similar pattern to what we did in `timeline.ts`
- Fetch all media items with proper asset URLs

### 2. Frontend Integration

#### Reuse MediaCarousel Component
**File**: `src/components/ui/MediaCarousel.tsx` ✅ (Already created!)

The MediaCarousel is ready to use! It supports:
- Multiple images/videos
- Autoplay with configurable intervals
- Navigation controls
- Two modes: `contain` (gallery) and `cover` (background)

#### Update MasonryGallery
**File**: `src/components/gallery/MasonryGallery.tsx`

**Current behavior**: Click image → open lightbox with single image

**New behavior**:
1. **Grid Card Display**:
   - Show primary media (first image/video) as thumbnail
   - Add badge indicator when item has multiple media (like StoryPreview)
   - Badge shows count: "3 📸" or "5 🎞️"

2. **Lightbox/Modal View**:
   - When clicked, open modal with MediaCarousel
   - Display all media items in carousel
   - Full-screen or large modal
   - Navigation controls visible
   - Show title, description, and captions

3. **Alternative: Inline Carousel**:
   - Option to show small carousel directly in grid card (on hover?)
   - Could be cool for desktop hover interactions

#### Create Gallery Utilities
**File**: `src/lib/utils/sanity-gallery.ts` (NEW)

Similar to `sanity-media.ts`, create utilities:
```typescript
export function getGalleryAlbumMedia(album: SanityGalleryAlbum): RenderedMediaItem[]
export function getPrimaryGalleryMedia(album: SanityGalleryAlbum): RenderedMediaItem | null
export function hasMultipleMedia(album: SanityGalleryAlbum): boolean
```

### 3. Types

#### Update Wedding Types
**File**: `src/types/wedding.ts`

Add types for gallery:
```typescript
export interface SanityGalleryAlbumMediaItem {
  mediaType: 'image' | 'video'
  image?: { asset: { url: string }, alt?: string, hotspot?: {...} }
  video?: { asset: { url: string } }
  alt?: string
  caption?: string
  displayOrder: number
}

export interface SanityGalleryAlbum {
  _id: string
  title: string
  description?: string
  media: SanityGalleryAlbumMediaItem[]
  category: MediaCategory
  date_taken?: string
  is_featured: boolean
  is_public: boolean
  tags: string[]

  // Legacy field
  legacyImage?: { asset: { url: string }, alt?: string }
}
```

### 4. Gallery Page Integration
**File**: `src/app/galeria/page.tsx` (or wherever gallery is rendered)

- Update to fetch gallery albums with media arrays
- Transform data using new utility functions
- Pass media arrays to MasonryGallery

## Design Considerations

### Grid View (Masonry)
- Show primary media as thumbnail (like current implementation)
- Add subtle badge when `hasMultipleMedia()` returns true
- Badge design matches StoryPreview aesthetic
- Badge positioned in top-right corner
- Show media count: "3" with Images icon

### Lightbox/Modal View
- Full-screen or large modal overlay
- MediaCarousel component with `fillMode="contain"`
- Dark background (like current lightbox)
- Show title at top or bottom
- Display description and date if available
- Navigation controls always visible
- Close button (X or ESC key)
- Optional: thumbnails strip at bottom

### Video Handling
- Videos autoplay when opened in lightbox
- Muted by default (like hero video)
- Optional unmute button
- Show video duration badge on thumbnail?

### Mobile Experience
- Touch-friendly carousel controls
- Swipe gestures for navigation
- Optimized image sizes
- Smooth transitions

## Success Criteria

### ✅ Backwards Compatibility
- Legacy single image galleries still work
- Gradual migration path for content editors
- No breaking changes to existing content

### ✅ User Experience
- Intuitive multi-media indicators
- Smooth carousel in lightbox
- Fast loading with lazy images
- Accessible (keyboard nav, screen readers)

### ✅ Content Management
- Easy to add multiple media in Sanity Studio
- Clear preview of media count
- Flexible ordering system

## Reference Implementation
Look at what we just built for Story Moments:
- **Schema**: `src/sanity/schemas/documents/storyMoment.ts`
- **Queries**: `src/sanity/queries/timeline.ts`
- **Utilities**: `src/lib/utils/sanity-media.ts`
- **Component**: `src/components/ui/MediaCarousel.tsx` ✅
- **Integration**: `src/components/sections/StoryPreview.tsx` (for badge example)
- **Types**: `src/types/wedding.ts` (SanityStoryMomentMediaItem section)

## Next Steps

1. **Analyze** current gallery schema and components
2. **Update Sanity schema** with media array
3. **Update queries** to fetch media arrays
4. **Create utilities** for gallery media handling
5. **Update MasonryGallery** with badges
6. **Create/update lightbox** with MediaCarousel
7. **Test** with multiple images and videos
8. **Document** changes

## Optional Enhancements

### Advanced Features (if time permits)
- **Bulk upload**: Upload multiple files at once in Sanity
- **Auto-grouping**: Automatically create albums from upload batches
- **Slideshow mode**: Auto-advance through all gallery items
- **Social sharing**: Share specific albums or media items
- **Download all**: Download all media in an album as ZIP

### Performance
- Progressive image loading
- Video thumbnail generation
- Lazy load media in carousel
- Optimized srcset for responsive images

## Technical Notes

### Don't Reinvent the Wheel
- ✅ MediaCarousel component is ready to use
- ✅ sanity-media utilities pattern is established
- ✅ Badge design from StoryPreview can be reused
- ✅ Type patterns from wedding.ts are proven

### Coordinate with Specialized Agents
- **backend-architect**: Schema and query updates
- **frontend-developer**: MasonryGallery and lightbox updates
- **whimsy-injector**: Add delightful touches to gallery interactions

---

## Prompt for Next Session

```
I want to refactor our Gallery to support multiple images/videos per gallery item, just like we did for Story Moments.

Right now, each gallery item (`galleryImage`) only supports a single image. I want to:
1. Update the Sanity schema to support a media array (up to 10 images/videos)
2. Show a badge on grid cards when items have multiple media
3. When clicked, open a lightbox/modal with the MediaCarousel component
4. Use the same patterns we established: sanity utilities, backwards compatibility, elegant UI

The MediaCarousel component is already built and ready to use! It's at:
`src/components/ui/MediaCarousel.tsx`

Reference the Story Moments implementation we just completed:
- Schema: `src/sanity/schemas/documents/storyMoment.ts`
- Utilities: `src/lib/utils/sanity-media.ts`
- Types: `src/types/wedding.ts` (SanityStoryMomentMediaItem section)

Use our best agents for this refactoring.
```

---

**Status**: Ready for next session
**Estimated Time**: 1-2 hours (similar to Story Moments)
**Dependencies**: All patterns established in Story Moments implementation
