# Direct Client-to-Supabase Upload Implementation

## 1. The Fix ✅

### What Changed

**Before (Wrong):**
```
Browser → Vercel API Route → Supabase Storage
         (4.5MB limit!)     (5GB limit)
```

**After (Correct):**
```
Browser → Vercel API (get signed URL, ~1KB)
Browser → Supabase Storage (upload file directly, 5GB limit)
Browser → Vercel API (save metadata, ~1KB)
```

### Files Created

1. **`/api/photos/upload-url`** - Generates signed upload URLs
2. **`/api/photos/confirm`** - Saves metadata after upload
3. **`src/lib/supabase/direct-upload.ts`** - Client-side upload logic
4. **Updated `MediaUploadModal.tsx`** - Uses direct uploads

### Benefits

✅ **No more 4.5MB limit** - Can now upload up to 5GB (Supabase's limit)
✅ **Faster uploads** - Files go directly to storage (no proxy)
✅ **Lower costs** - Vercel functions process less data
✅ **Better UX** - Real progress tracking, no timeout errors

---

## 2. Root Cause Analysis

### What We Were Doing Wrong

```typescript
// OLD (WRONG): Proxy through Vercel
Browser uploads 50MB file
  ↓
Vercel API Route receives 50MB (FAILS at 4.5MB!)
  ↓
Vercel uploads to Supabase
  ↓
Returns result to browser
```

**Problem**: The entire file went through Vercel's serverless function as part of the request body.

### Why It Failed

**Vercel's Limit**: ALL serverless functions have a **4.5MB request body limit** (Hobby, Pro, Enterprise - all the same!)

This limit exists because:
- Serverless functions have limited memory
- Large payloads slow down cold starts
- Functions are meant for logic, not file proxying

### What We Needed to Do

```typescript
// NEW (CORRECT): Direct upload
Browser requests signed URL (1KB request)
  ↓
Vercel generates signed URL (<1KB response)
  ↓
Browser uploads directly to Supabase (bypasses Vercel!)
  ↓
Browser confirms upload with metadata (1KB request)
```

**Solution**: Only small metadata goes through Vercel; large files go directly to storage.

---

## 3. The Concept: Signed Upload URLs

### Mental Model

Think of it like getting a **temporary parking pass**:

1. **Request**: "Hey Vercel, I need to store a file"
2. **Response**: "Here's a signed URL - it's valid for 1 hour"
3. **Upload**: Browser uses that URL to upload directly to Supabase
4. **Confirm**: "Hey Vercel, I uploaded the file, save the metadata"

### How Signed URLs Work

```typescript
// Step 1: Generate signed URL (server-side, authenticated)
const { data } = await supabase.storage
  .from('wedding-photos')
  .createSignedUploadUrl(storagePath)

// Returns: { signedUrl: "https://supabase.co/storage/...?token=abc123" }

// Step 2: Upload directly (client-side, no auth needed!)
await fetch(signedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
})

// The signed URL contains a temporary token that grants upload permission
```

### Security Model

**Q**: Isn't it dangerous to upload without authentication?

**A**: No! The signed URL:
- ✅ Is created server-side after verifying guest session
- ✅ Contains a cryptographic token that proves authorization
- ✅ Expires after 1 hour
- ✅ Can only upload to a specific path (can't overwrite other files)
- ✅ Requires server confirmation to save metadata

### Why This Design Exists

This pattern is used by **all major cloud storage providers**:
- AWS S3 - Presigned URLs
- Google Cloud Storage - Signed URLs
- Azure Blob Storage - SAS tokens
- Supabase Storage - Signed upload URLs

**Reason**: Keeps large files out of your application servers!

---

## 4. Warning Signs & Prevention

### When to Use Direct Uploads

✅ **DO use direct uploads when**:
- Uploading files > 1MB
- Handling user-generated content (photos, videos, documents)
- Building file upload features
- Users might have slow connections (progress tracking needed)

❌ **DON'T use direct uploads when**:
- File needs server-side processing before storage (virus scan, watermark, etc.)
- File size is tiny (<100KB) and already in memory
- You need to modify the file before storing it

### Code Smells That Indicate This Problem

```typescript
// 🚨 RED FLAG: File in FormData going to API route
const formData = new FormData()
formData.append('file', largeFile) // If this is >4.5MB...
await fetch('/api/upload', { body: formData }) // ...this will fail!

// ✅ BETTER: Check file size first
if (file.size > 4.5 * 1024 * 1024) {
  // Use direct upload!
  await uploadFileDirect({ file, ... })
} else {
  // Small files can go through API
  await fetch('/api/upload', { body: formData })
}
```

### Similar Mistakes to Watch For

1. **Sending large Base64 strings in JSON**
   ```typescript
   // ❌ BAD: 10MB image becomes 13MB Base64 string
   await fetch('/api/save-image', {
     body: JSON.stringify({ imageData: base64String })
   })
   ```

2. **Uploading multiple files in one request**
   ```typescript
   // ❌ BAD: 5 files × 2MB each = 10MB request
   const formData = new FormData()
   files.forEach(f => formData.append('files[]', f))
   await fetch('/api/upload-many', { body: formData })
   ```

3. **Not checking file size before upload**
   ```typescript
   // ❌ BAD: No validation
   const file = input.files[0]
   await uploadToServer(file) // Might be 100MB!

   // ✅ GOOD: Validate first
   if (file.size > MAX_SIZE) {
     alert('File too large!')
     return
   }
   ```

---

## 5. Alternative Approaches & Trade-offs

### Option 1: Direct Upload (Current) ✅

```typescript
Browser → /api/upload-url → Browser → Supabase → /api/confirm
```

**Pros**:
- No file size limits (up to 5GB)
- Fast uploads (direct to storage)
- Cheap (low Vercel function usage)
- Works with Supabase (our existing stack)

**Cons**:
- Slightly more complex (3 steps vs 1)
- Can't process file server-side before storage
- Requires signed URL generation

**Best for**: User uploads (photos, videos, documents)

### Option 2: Proxy Through Vercel (Old) ❌

```typescript
Browser → /api/upload → Supabase
```

**Pros**:
- Simple (one endpoint)
- Can process file server-side
- Easy to add virus scanning, watermarks, etc.

**Cons**:
- **4.5MB limit** (deal-breaker for photos/videos!)
- Slow (file goes through two hops)
- Expensive (high function execution time)
- Can timeout on slow connections

**Best for**: Small files (<1MB) that need server processing

### Option 3: Vercel Blob ❓

```typescript
Browser → /api/blob-url → Browser → Vercel Blob
```

**Pros**:
- Integrated with Vercel
- Supports multipart uploads
- 5TB file size limit

**Cons**:
- Locks you into Vercel ecosystem
- **More expensive** than Supabase
- We already have Supabase Storage
- Migration overhead

**Best for**: Vercel-only stacks without existing storage

### Option 4: Multipart Upload 🔬

```typescript
Browser → Split file into chunks → Upload each chunk → Reassemble
```

**Pros**:
- Can resume failed uploads
- Works around ANY size limit
- Better progress tracking

**Cons**:
- Very complex to implement
- Requires chunking logic
- Overkill for wedding photos

**Best for**: Very large files (>1GB), unreliable connections

---

## How Our Implementation Works

### Flow Diagram

```
┌─────────┐
│ Browser │
└────┬────┘
     │
     │ 1. POST /api/photos/upload-url
     │    { filename, fileType, fileSize, phase }
     ▼
┌──────────────┐
│ Vercel API   │ ← Verify guest session
│              │ ← Check upload permissions
│              │ ← Generate storage path
│              │ ← Create signed URL
└────┬─────────┘
     │
     │ 2. Returns signed URL
     ▼
┌─────────┐
│ Browser │
└────┬────┘
     │
     │ 3. PUT {signedUrl}
     │    Body: File (binary)
     ▼
┌──────────────────┐
│ Supabase Storage │ ← File stored directly
└──────────────────┘
     │
     │ 4. Upload complete
     ▼
┌─────────┐
│ Browser │
└────┬────┘
     │
     │ 5. POST /api/photos/confirm
     │    { storagePath, publicUrl, metadata... }
     ▼
┌──────────────┐
│ Vercel API   │ ← Save metadata to database
│              │ ← Create activity feed entry
│              │ ← Update timeline count
└────┬─────────┘
     │
     │ 6. Returns success
     ▼
┌─────────┐
│ Browser │ ← Shows success message
└─────────┘
```

### Code Example

```typescript
// User selects file
const file = input.files[0]

// Validate file
const validation = validateFile(file)
if (!validation.valid) {
  alert(validation.error)
  return
}

// Upload directly to Supabase
const result = await uploadFileDirect({
  file,
  phase: 'during',
  caption: 'Amazing moment!',
  onProgress: (progress) => {
    console.log(`Upload: ${progress}%`)
  }
})

if (result.success) {
  alert('Upload successful!')
} else {
  alert(`Error: ${result.error}`)
}
```

---

## Testing

### Test Cases

1. **Small file (<4.5MB)** - Should work ✅
2. **Medium file (5-20MB)** - Should work with warning ⚠️
3. **Large file (20-100MB)** - Should work (slow) ✅
4. **Very large file (>100MB images, >500MB videos)** - Should error ❌
5. **Invalid file type** - Should error immediately ❌
6. **No auth** - Should fail at signed URL generation ❌

### How to Test

```bash
# Start dev server
npm run dev

# Visit upload modal
http://localhost:3000/dia-1000

# Try uploading:
# - 2MB photo (should work fast)
# - 10MB photo (should work, shows warning)
# - 50MB video (should work, slower)
# - 200MB video (should error with "too large")
```

### Debugging

Check browser Network tab:
1. **POST /api/photos/upload-url** - Should return signed URL
2. **PUT {signedUrl}** - Should upload file directly to Supabase
3. **POST /api/photos/confirm** - Should save metadata

If step 2 fails:
- Check signed URL hasn't expired (1 hour limit)
- Check Supabase Storage bucket exists
- Check RLS policies allow uploads

---

## Migration Notes

### Old API Route Status

The old `/api/photos/upload` route still exists for backwards compatibility, but:
- ❌ Still has 4.5MB limit
- ❌ Not used by MediaUploadModal anymore
- ℹ️ Can be deleted once all clients update

### Deployment Checklist

Before deploying to production:
- [x] Create signed URL endpoint
- [x] Create confirmation endpoint
- [x] Update MediaUploadModal
- [ ] Test in production with real files
- [ ] Monitor for errors
- [ ] Delete old upload route (optional)

### Rollback Plan

If issues occur in production:

1. Revert MediaUploadModal to use old `/api/photos/upload`
2. Accept 4.5MB limit temporarily
3. Debug signed URL generation
4. Re-deploy when fixed

---

## Summary

### What We Learned

1. **Serverless functions have size limits** - Don't proxy large files!
2. **Use signed URLs for file uploads** - Industry standard pattern
3. **Direct uploads are faster and cheaper** - Skip the middleman
4. **Always validate file size client-side** - Catch issues early

### Key Takeaway

> When handling user file uploads, **never proxy binary data through your API**.
> Instead, generate signed URLs and let clients upload directly to storage.

This pattern applies to:
- Photo/video uploads
- Document uploads
- CSV/data file uploads
- Any user-generated content >1MB

### Further Reading

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [Vercel Function Limits](https://vercel.com/docs/functions/limits)
