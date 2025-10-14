# Media Upload Implementation & Test Fixes

## Issue Summary
E2E tests for media posts were failing because:
1. File upload functionality wasn't implemented (returned empty array)
2. Test helpers didn't wait for file upload + API completion

## Solution Implemented

### 1. File Upload Implementation ✅

**File**: `src/components/messages/PostComposer.tsx` (line 133-163)

Implemented the `uploadFiles` function to:
- Upload files to Supabase Storage bucket `wedding-posts`
- Generate unique filenames: `{timestamp}-{random}.{ext}`
- Store files in `posts/` directory
- Return public URLs for database storage
- Handle errors with Portuguese messages

```typescript
const uploadFiles = async (files: File[]): Promise<string[]> => {
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();

  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error } = await supabase.storage
      .from('wedding-posts')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Erro ao fazer upload de ${file.name}: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('wedding-posts')
      .getPublicUrl(filePath);

    return publicUrl;
  });

  return await Promise.all(uploadPromises);
};
```

### 2. Supabase Storage Bucket ✅

**Created**: `wedding-posts` bucket (manually created by user)
**Permissions**: Public access for approved posts
**File Types**: Images (jpg, png, webp, heic) + Videos (mp4, webm, quicktime)
**Size Limit**: 500MB (for videos)

### 3. Test Helper Fixes ✅

**File**: `tests/e2e/two-tier-moderation.spec.ts`

Fixed both `createPostWithImage()` and `createPostWithVideo()` helpers to:
- Wait for the actual API response (`/api/messages` with 200/201 status)
- Increase timeout to 30 seconds for images, 60 seconds for videos
- Replace arbitrary `waitForTimeout()` with proper `waitForResponse()`

**Before** (causing test failures):
```typescript
await page.click('button:has-text("Enviar")');
await page.waitForTimeout(2000); // Not enough time for upload!
```

**After** (proper async handling):
```typescript
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/messages') &&
              (response.status() === 200 || response.status() === 201),
  { timeout: 30000 } // Enough time for file upload + storage upload
);

await page.click('button:has-text("Enviar")');
await responsePromise;
await page.waitForTimeout(1000); // Brief wait for UI update
```

## Test Coverage

### Fixed Tests (Expected to pass now):
1. ✅ "should create post with single image"
2. ✅ "should create post with video"
3. ✅ "should create mixed post with image and text"

### Still Investigating:
4. ⚠️ "should bulk approve multiple pending photos" - timeout issue (different from upload)

## Technical Details

### Upload Flow:
1. User selects files in PostComposer
2. Files stored in component state with preview URLs
3. On submit: `uploadFiles()` uploads to Supabase Storage
4. Returns array of public URLs
5. URLs sent to `/api/messages` endpoint
6. Stored in `guest_posts.media_urls` column

### Storage Structure:
```
wedding-posts/
  posts/
    1760466884968-x4k2j9.jpg
    1760466914596-a8p5m1.mp4
    1760466937883-q7n3w8.jpg
```

### API Response Format:
```json
{
  "success": true,
  "post": {
    "id": "uuid",
    "guest_name": "Maria Santos",
    "content": "Image post 1760466884968",
    "post_type": "image",
    "media_urls": ["https://...supabase.co/.../posts/1760466884968-x4k2j9.jpg"],
    "status": "approved"
  },
  "autoApproved": true
}
```

## Next Steps

1. ✅ File upload implemented
2. ✅ Test helpers fixed to wait for async operations
3. ⏳ Run E2E tests to verify fixes
4. ⏳ Investigate bulk photo approval timeout (separate issue)

## Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run only media post tests
npx playwright test tests/e2e/two-tier-moderation.spec.ts -g "Multi-Format Post Creation"

# Run with UI for debugging
npx playwright test --ui
```
