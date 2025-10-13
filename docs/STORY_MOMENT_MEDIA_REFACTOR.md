# Story Moment Media Refactor - Multiple Media Support

## Overview
Refactored the Sanity `storyMoment` schema to support multiple media items (images and videos) per story moment, replacing the previous single image/video field limitation.

## Changes Made

### 1. Schema Refactor (`/src/sanity/schemas/documents/storyMoment.ts`)

#### New Structure
- **Replaced**: Single `image` and `video` fields
- **With**: New `media` array field that supports multiple items

#### New `media` Array Field
```typescript
{
  name: 'media',
  type: 'array',
  validation: min(1), max(10),
  of: [
    {
      fields: [
        mediaType: 'image' | 'video',
        image: (image asset, conditional),
        video: (video file, conditional),
        alt: string,
        caption: string (optional),
        displayOrder: number
      ]
    }
  ]
}
```

#### Key Features
- **Validation**: Requires at least 1 media item, maximum 10
- **Conditional Fields**: Image field shows only when type='image', video field shows only when type='video'
- **Ordering**: Each media item has `displayOrder` for custom sorting
- **Captions**: Optional caption field for each media item
- **Accessibility**: Alt text support for all media items
- **Hotspot Support**: Maintains Sanity's image hotspot functionality

#### Backwards Compatibility
- Legacy `image` and `video` fields are kept but **hidden** in the UI
- Marked as `DEPRECATED` with clear warnings
- Still queryable from the database for migration purposes
- Preview shows media count: "❤️ 1. Title (3 mídias) 🏠 📍"

### 2. Query Updates (`/src/sanity/queries/timeline.ts`)

#### New GROQ Fragments
```groq
// Modern media array with proper asset resolution
media[] {
  mediaType,
  "image": select(
    mediaType == "image" => image {
      asset-> { url },
      alt,
      hotspot,
      crop
    }
  ),
  "video": select(
    mediaType == "video" => video {
      asset-> { url }
    }
  ),
  alt,
  caption,
  displayOrder
} | order(displayOrder asc)
```

#### Legacy Support Fragment
```groq
// For backwards compatibility during migration
"legacyImage": image {
  asset-> { url },
  alt
},
"legacyVideo": video {
  asset-> { url }
}
```

#### Updated Queries
- **`timelineQuery`**: Now fetches both `media[]` and legacy fields
- **`storyPreviewMomentsQuery`**: Same media array support for homepage preview

### 3. TypeScript Types (`/src/types/wedding.ts`)

#### New Types Added

**`SanityStoryMomentMediaItem`**
```typescript
interface SanityStoryMomentMediaItem {
  mediaType: 'image' | 'video';
  image?: {
    asset: { url: string };
    alt?: string;
    hotspot?: { x, y, height, width };
    crop?: { top, bottom, left, right };
  };
  video?: {
    asset: { url: string };
  };
  alt?: string;
  caption?: string;
  displayOrder: number;
}
```

**`SanityStoryMoment`**
```typescript
interface SanityStoryMoment {
  // ... existing fields
  media: SanityStoryMomentMediaItem[];

  // Legacy fields for backwards compatibility
  legacyImage?: { asset: { url }, alt? };
  legacyVideo?: { asset: { url } };
}
```

**`RenderedStoryMediaItem`**
```typescript
interface RenderedStoryMediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  caption?: string;
  order: number;
  hotspot?: { x, y, height, width };
}
```

**`TimelineQueryResponse`**
```typescript
interface TimelineQueryResponse {
  phases: Array<
    SanityStoryPhase & {
      moments: SanityStoryMoment[];
    }
  >;
}
```

### 4. Utility Functions (`/src/lib/utils/sanity-media.ts`)

#### Core Functions

**`getStoryMomentMedia(moment)`**
- Transforms Sanity media items into normalized rendering format
- Handles both new media array and legacy fields
- Returns `RenderedStoryMediaItem[]`

**`getPrimaryStoryMedia(moment)`**
- Gets the first/primary media item
- Useful for thumbnails, previews, cards
- Returns `RenderedStoryMediaItem | null`

**`hasMultipleMedia(moment)`**
- Checks if moment has more than one media item
- Returns `boolean`

**`getStoryMediaByType(moment, type)`**
- Filters media items by type ('image' | 'video')
- Returns `RenderedStoryMediaItem[]`

#### Image Optimization Functions

**`generateSanitySrcSet(imageUrl, widths)`**
- Generates responsive srcset for Sanity images
- Default widths: [400, 800, 1200, 1600]
- Returns srcset string

**`getOptimizedSanityImage(imageUrl, options)`**
- Gets optimized image URL with Sanity's CDN
- Options: width, height, quality, format, fit
- Auto-format enabled by default

**`getHotspotImage(imageUrl, hotspot, width, height)`**
- Gets image URL with hotspot cropping applied
- Maintains focus on important areas
- Falls back to regular crop if no hotspot

## Migration Strategy

### Phase 1: Schema Deployment (Complete)
- ✅ New `media` array field added to schema
- ✅ Legacy fields hidden but preserved
- ✅ Validation rules enforced (min: 1, max: 10)

### Phase 2: Data Migration (Next Step)
You'll need to create a migration script to:

1. **Query all existing story moments** with legacy image/video fields
2. **Transform legacy data** into new media array format:
   ```typescript
   // Example transformation
   if (moment.image) {
     moment.media = [{
       mediaType: 'image',
       image: moment.image,
       alt: moment.image.alt || moment.title,
       displayOrder: 1
     }]
   }
   else if (moment.video) {
     moment.media = [{
       mediaType: 'video',
       video: moment.video,
       alt: moment.title,
       displayOrder: 1
     }]
   }
   ```
3. **Update documents** with new media array
4. **Verify** all moments have valid media array

### Phase 3: Frontend Updates (Next Step)
Update components that consume story moments:

```typescript
// Before (old way)
<img src={moment.image?.asset?.url} alt={moment.image?.alt} />

// After (new way with utilities)
import { getStoryMomentMedia, getPrimaryStoryMedia } from '@/lib/utils/sanity-media'

// For single primary image
const primaryMedia = getPrimaryStoryMedia(moment)
<img src={primaryMedia?.url} alt={primaryMedia?.alt} />

// For all media items (carousel/gallery)
const allMedia = getStoryMomentMedia(moment)
{allMedia.map((media, index) => (
  media.type === 'image'
    ? <img key={index} src={media.url} alt={media.alt} />
    : <video key={index} src={media.url} />
))}
```

### Phase 4: Legacy Field Removal (Future)
Once migration is complete and verified:
1. Remove legacy `image` and `video` fields from schema
2. Remove `legacyImage` and `legacyVideo` from queries
3. Remove backwards compatibility code from utilities
4. Update TypeScript types to remove legacy fields

## Component Integration Examples

### Timeline Card with Primary Media
```typescript
import { getPrimaryStoryMedia } from '@/lib/utils/sanity-media'

function TimelineCard({ moment }: { moment: SanityStoryMoment }) {
  const media = getPrimaryStoryMedia(moment)

  return (
    <div className="timeline-card">
      {media?.type === 'image' && (
        <img src={media.url} alt={media.alt} />
      )}
      {media?.type === 'video' && (
        <video src={media.url} controls />
      )}
      <h3>{moment.title}</h3>
      <p>{moment.description}</p>
    </div>
  )
}
```

### Story Moment Gallery (Multiple Media)
```typescript
import { getStoryMomentMedia, hasMultipleMedia } from '@/lib/utils/sanity-media'

function StoryMomentDetail({ moment }: { moment: SanityStoryMoment }) {
  const allMedia = getStoryMomentMedia(moment)
  const isGallery = hasMultipleMedia(moment)

  return (
    <div className="story-moment">
      <h2>{moment.title}</h2>

      {isGallery ? (
        <div className="media-gallery">
          {allMedia.map((media, index) => (
            <div key={index} className="gallery-item">
              {media.type === 'image' ? (
                <img src={media.url} alt={media.alt} />
              ) : (
                <video src={media.url} controls />
              )}
              {media.caption && <p>{media.caption}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="single-media">
          {allMedia[0]?.type === 'image' ? (
            <img src={allMedia[0].url} alt={allMedia[0].alt} />
          ) : (
            <video src={allMedia[0]?.url} controls />
          )}
        </div>
      )}

      <p>{moment.description}</p>
    </div>
  )
}
```

### Optimized Responsive Images
```typescript
import {
  getPrimaryStoryMedia,
  generateSanitySrcSet,
  getOptimizedSanityImage
} from '@/lib/utils/sanity-media'

function ResponsiveTimelineImage({ moment }: { moment: SanityStoryMoment }) {
  const media = getPrimaryStoryMedia(moment)

  if (!media || media.type !== 'image') return null

  const srcSet = generateSanitySrcSet(media.url)
  const optimizedSrc = getOptimizedSanityImage(media.url, {
    width: 1200,
    quality: 85,
    format: 'webp'
  })

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={media.alt}
      loading="lazy"
    />
  )
}
```

## Benefits

### For Content Editors
- ✅ Can add multiple photos/videos per story moment
- ✅ Better storytelling with image galleries
- ✅ Flexible ordering of media items
- ✅ Individual captions for each media item
- ✅ Clear UI with media count in preview

### For Developers
- ✅ Type-safe TypeScript interfaces
- ✅ Utility functions for common patterns
- ✅ Backwards compatible during migration
- ✅ Optimized image loading with CDN
- ✅ Responsive image support built-in

### For Users
- ✅ Richer timeline experience with galleries
- ✅ Faster image loading with optimization
- ✅ Better mobile experience with responsive images
- ✅ Proper accessibility with alt text

## Files Modified

1. **`/src/sanity/schemas/documents/storyMoment.ts`** - Schema refactor with media array
2. **`/src/sanity/queries/timeline.ts`** - Updated GROQ queries
3. **`/src/types/wedding.ts`** - New TypeScript types

## Files Created

1. **`/src/lib/utils/sanity-media.ts`** - Utility functions for media handling
2. **`/docs/STORY_MOMENT_MEDIA_REFACTOR.md`** - This documentation

## Next Steps

1. **Create Migration Script** - Write script to migrate existing data
2. **Update Timeline Components** - Refactor components to use new media array
3. **Update Historia Page** - Support multiple media display
4. **Test Gallery Layouts** - Design and implement gallery UI
5. **Performance Testing** - Verify image optimization works correctly
6. **Remove Legacy Fields** - After successful migration and verification

## Notes

- All validation happens at schema level (Sanity Studio)
- Media items are automatically ordered by `displayOrder`
- Hotspot/crop data preserved for images
- Video support maintained (Sanity file upload)
- Maximum 10 media items per moment (configurable in schema)
- Legacy fields kept for safe migration path

---

**Status**: Schema refactor complete, ready for data migration and frontend integration
**Date**: 2025-10-13
**Version**: 1.0.0
