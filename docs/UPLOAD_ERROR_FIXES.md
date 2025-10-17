# Upload Error Fixes - JSON Parsing & File Size Limits

## Problem
Users were getting `Unexpected token 'R', "Request En"... is not valid JSON` error when uploading files through MediaUploadModal.

## Root Cause
The error occurred when:
1. **File size exceeded Vercel's limits** (4.5MB on Hobby plan, 50MB on Pro)
2. **Vercel/proxy returned HTML error** instead of JSON (413 Request Entity Too Large)
3. **Client tried to parse non-JSON response** as JSON, causing the error

## Solutions Implemented

### 1. Better Error Handling in MediaUploadModal ✅
**File**: `src/components/live/MediaUploadModal.tsx`

Added robust error handling that checks if response is JSON before parsing:

```typescript
// Check if response is JSON
const contentType = response.headers.get('content-type')
const isJson = contentType && contentType.includes('application/json')

if (!response.ok) {
  // Handle non-JSON errors (e.g., 413 from proxy)
  if (!isJson) {
    const errorText = await response.text()

    // Check for file size errors
    if (response.status === 413 || errorText.toLowerCase().includes('too large')) {
      throw new Error('Arquivo muito grande. Tente um arquivo menor (máximo 50MB)')
    }

    throw new Error(`Erro no servidor: ${response.statusText}`)
  }

  // Parse JSON error
  const data = await response.json()
  throw new Error(data.error || 'Erro ao fazer upload')
}
```

**Benefits**:
- No more JSON parsing crashes
- User-friendly error messages
- Handles both JSON and non-JSON responses

### 2. File Size Validation with Warnings ✅
**File**: `src/lib/supabase/storage.ts`

Added validation function that warns users about large files:

```typescript
export function validateFile(file: File): {
  valid: boolean
  error?: string
  warning?: string
}
```

**Limits**:
- **Theoretical**: 100MB for images, 500MB for videos (Supabase Storage)
- **Practical**: 4.5MB on Vercel Hobby (shows warning above this)

**Warnings shown**:
- Files > 4.5MB get a warning: "Arquivo grande (X.XMB). Pode falhar no upload."
- Still allows upload attempt (might work in development)
- Prevents user confusion

### 3. Pre-Upload Validation ✅
**File**: `src/components/live/MediaUploadModal.tsx`

Files are validated when selected, before upload:

```typescript
const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
  const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => {
    const validation = validateFile(file)
    return {
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: validation.valid ? 'pending' : 'error',
      error: validation.error,
      warning: validation.warning, // Show warning in UI
    }
  })
})
```

**UI shows**:
- ⚠️ Orange warning for files > 4.5MB
- ❌ Red error for invalid files
- ✅ Green success after upload

### 4. Documentation ✅
**File**: `src/app/api/photos/upload/route.ts`

Added clear documentation about limits:

```typescript
/**
 * File Upload Limits:
 * - Development: Limited by Node.js (typically ~50MB)
 * - Vercel Hobby: 4.5MB request body limit (hard limit)
 * - Vercel Pro: 50MB request body limit
 *
 * If users encounter 413 errors on large files:
 * 1. Upgrade to Vercel Pro, OR
 * 2. Implement direct client-to-Supabase upload (bypasses Vercel)
 */
```

## Understanding the Limits

### What Limits Apply to Us?

We're uploading files through a **Next.js API route** (`/api/photos/upload`), which then uploads to **Supabase Storage**.

This means we're constrained by **Vercel Serverless Function limits**, NOT deployment or Blob limits:

| Limit Type | Value | Applies to Us? |
|-----------|-------|----------------|
| **Deployment source files** | 100MB | ❌ No (only for `vercel deploy`) |
| **Vercel Blob storage** | 5TB per file | ❌ No (we use Supabase, not Blob) |
| **API Route body payload** | **4.5MB** | ✅ **YES - This is our constraint!** |
| **Serverless function duration** | 10s (Hobby) / 60s (Pro) | ✅ Yes |

### Current Architecture: Files Through API Route
```
Browser → /api/photos/upload (4.5MB limit) → Supabase Storage (5GB limit)
          ↑ This is the bottleneck!
```

**Constraint**: 4.5MB max request body on ALL Vercel plans (Hobby, Pro, Enterprise)

### Solution Options

#### Option 1: Keep Current (Simple) ✅ Current
- **Pros**: Simple, works for most photos
- **Cons**: 4.5MB limit
- **Good for**: Photos from phones (usually 2-4MB)

#### Option 2: Direct Client Upload (Recommended for large files)
```
Browser → Supabase Storage (5GB limit) directly
         ↑ No Vercel limits!
```
- **Pros**: No 4.5MB limit, faster uploads
- **Cons**: More complex auth (signed URLs needed)
- **Good for**: Videos, RAW photos, professional cameras

#### Option 3: Switch to Vercel Blob (Not needed)
- **Pros**: 5TB files, multipart uploads
- **Cons**: Locks us into Vercel ecosystem
- **Not recommended**: Supabase already handles this well

## Testing

### Test Cases
1. ✅ Upload file < 4.5MB → Success
2. ✅ Upload file > 4.5MB → Warning shown, may fail with friendly error
3. ✅ Upload invalid file type → Error shown immediately
4. ✅ Server returns 413 → Friendly "file too large" message
5. ✅ Server returns HTML error → Generic error message instead of crash

### Test in Development
```bash
npm run dev

# Visit http://localhost:3000/dia-1000
# Try uploading:
# - Small file (< 4.5MB) - Should work
# - Large file (> 4.5MB) - Should show warning
# - Very large file (> 50MB) - Should show error
```

## User Experience

### Before
- ❌ Cryptic error: "Unexpected token 'R'..."
- ❌ No warning about file size
- ❌ App crashes on large files

### After
- ✅ Clear error: "Arquivo muito grande. Tente um arquivo menor"
- ✅ Warning before upload: "⚠️ Arquivo grande (X.XMB). Pode falhar no upload."
- ✅ Graceful error handling, no crashes

## Future Improvements

### Short Term
- Add image compression before upload
- Show upload size in real-time
- Add retry with compression

### Long Term
- Implement direct Supabase upload for large files
- Add video compression
- Progressive upload with chunking

## Summary

✅ **Fixed**: JSON parsing error when server returns non-JSON
✅ **Added**: File size warnings before upload
✅ **Improved**: User-friendly error messages
✅ **Documented**: Vercel limits and solutions
✅ **Validated**: Files checked before upload attempt

Users now get clear feedback about file sizes and errors instead of cryptic crashes! 🎉
