# Gallery Management Guide

## Overview

The wedding website uses **Sanity CMS** for storing gallery albums with Sanity CDN for fast global delivery.

## Uploading Gallery Items

### From ~/Downloads/Galeria

The easiest way to bulk upload photos and videos:

```bash
# Preview what will be uploaded (dry run)
npm run upload-gallery:dry-run

# Actually upload to Sanity
npm run upload-gallery
```

**What it does:**
- Scans `~/Downloads/Galeria` for images (.jpg, .jpeg, .png, .heic) and videos (.mov, .mp4, .m4v)
- Creates individual gallery albums in Sanity (one per file)
- Uses folder names as album titles
- Marks all as public and in "special_moments" category
- Auto-generates descriptions

### Via Sanity Studio

For more control over albums:

1. Open Sanity Studio: http://localhost:3000/studio
2. Go to "Gallery" section
3. Create new "Gallery Image" document
4. Upload up to 10 images/videos per album
5. Set title, description, category, etc.
6. Publish when ready

## Cache Management

### Why aren't my new uploads showing on production?

Sanity uses CDN caching for fast performance. After uploading new items, you need to clear the cache.

### Solution 1: Revalidate Cache (Recommended)

```bash
# Trigger cache revalidation for /galeria page
npm run revalidate:gallery
```

**Requirements:**
1. Add to `.env.local`:
   ```bash
   REVALIDATION_SECRET=your-random-secret-token
   NEXT_PUBLIC_SITE_URL=https://your-production-url.vercel.app
   ```

2. Add same variables to Vercel environment variables

3. Deploy the `/api/revalidate` route first

### Solution 2: Wait for Natural Cache Expiry

Sanity CDN cache typically expires in 1-60 minutes. Your new uploads will appear automatically after that.

### Solution 3: Redeploy

```bash
git commit -m "feat: new gallery uploads"
git push
```

A fresh deployment clears all caches.

## Video Handling

### Video Display

Videos are rendered with native `<video>` elements that:
- Show first frame as thumbnail
- Play on hover (desktop)
- Have play button overlay
- Auto-loop when playing

### Supported Formats

- **Images**: .jpg, .jpeg, .png, .heic
- **Videos**: .mov, .mp4, .m4v

## Album Structure

Each gallery album can contain:
- **1-10 media items** (images and/or videos)
- **Title** and description
- **Category**: engagement, travel, dates, family, friends, special_moments, etc.
- **Tags** for searchability
- **Date taken** and location
- **Featured** flag for highlighting
- **Public/Private** visibility

## Troubleshooting

### "Items in Sanity but not on website"

**Check:**
1. Are items marked as `isPublic: true`? (check in Sanity Studio)
2. CDN cache - trigger revalidation
3. Local dev server - disable CDN in `src/sanity/lib/client.ts` temporarily

### "Videos showing as broken images"

**Fixed!** Videos now use `<video>` element. Make sure:
1. Video file is uploaded to Sanity
2. Video URL is valid in the `media` array
3. File format is supported (.mov, .mp4, .m4v)

### "Upload script permission error"

**Check:**
- `SANITY_API_WRITE_TOKEN` exists in `.env.local`
- Token has "Editor" or "Administrator" role in Sanity dashboard
- Token is for correct project/dataset

## Development vs Production

### Development (localhost)
- Set `useCdn: false` for instant updates
- No revalidation needed
- See changes immediately

### Production
- Uses `useCdn: true` for performance
- Requires revalidation after uploads
- 1-60 minute cache TTL

## Quick Reference

```bash
# Upload workflow
npm run upload-gallery:dry-run    # Preview
npm run upload-gallery             # Upload
npm run revalidate:gallery         # Clear cache

# Check what's in Sanity
npx tsx scripts/check-gallery-items.ts

# Sanity Studio
open http://localhost:3000/studio
```

## Best Practices

1. **Organize by folders** - Folder names become album titles
2. **Use descriptive names** - Help with searchability
3. **Trigger revalidation** - Don't wait for cache expiry
4. **Test locally first** - Use dry run mode
5. **Keep videos short** - Large files slow down gallery
6. **Tag appropriately** - Makes filtering easier

---

**Questions?** Check `/scripts/upload-gallery-from-downloads.ts` for implementation details.
