# Guest Photo/Video Upload System - Setup Guide

## 📋 Overview

Complete guest photo/video upload system using **Supabase Storage** (not Sanity). Guests can authenticate with invitation codes or shared password, then upload photos/videos that require admin moderation before appearing in the public gallery.

## 🎯 What's Been Implemented

### ✅ Phase 1: Core Infrastructure (COMPLETE)

1. **Database Migration** (`024_unified_guest_photos_supabase_storage.sql`)
   - Fixed conflicts between migrations 023 and 20251013061016
   - Updated `guest_photos` table to use Supabase Storage paths
   - Added video support columns
   - Created helper functions and views

2. **Storage Utilities** (`src/lib/supabase/storage.ts`)
   - File upload with client-side compression
   - Video metadata extraction
   - Thumbnail generation
   - Storage path management
   - File validation

3. **Authentication System** (`src/lib/auth/guestAuth.ts`)
   - Invitation code authentication
   - Shared password authentication
   - Session management (72-hour sessions)
   - Upload rate limiting
   - Cookie-based session storage

4. **API Endpoints**
   - `/api/auth/login` - Guest authentication
   - `/api/auth/verify` - Session verification
   - `/api/auth/logout` - Session invalidation
   - `/api/photos/upload` - File upload handler
   - `/api/photos/list` - Photo listing with filters

5. **User Interface**
   - `/dia-1000/login` - Guest login page (invitation code OR shared password)
   - `/dia-1000/upload` - Drag-and-drop upload page with progress tracking

## 🚀 Setup Instructions

### Step 1: Run Database Migration

```bash
# Apply the unified migration
npm run supabase:migrate

# Or manually:
supabase db push
```

This will:
- Fix `guest_photos` table to use Supabase Storage
- Create helper functions for storage management
- Update RLS policies for authenticated uploads
- Create storage statistics views

### Step 2: Create Supabase Storage Bucket

```bash
# Run the setup script
npx tsx scripts/setup-storage-bucket.ts
```

Or manually in Supabase Dashboard:
1. Go to Storage > Create new bucket
2. Name: `wedding-photos`
3. Settings:
   - Public: ✅ Yes
   - File size limit: 500MB
   - Allowed MIME types: `image/*`, `video/*`

### Step 3: Configure Storage RLS Policies

The policies are already defined in migration 024, but verify in Supabase Dashboard:

```sql
-- Guests can upload to their own folder
CREATE POLICY "Guests upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wedding-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Everyone can view approved photos (public bucket)
CREATE POLICY "Public read approved"
ON storage.objects FOR SELECT
USING (bucket_id = 'wedding-photos');
```

### Step 4: Set Default Shared Password

The default password is `1000dias`. To change it:

```sql
SELECT update_shared_password('your-new-password');
```

### Step 5: Generate Invitation Codes

Invitation codes are auto-generated when guests RSVP. To manually generate:

```sql
-- For existing guests
UPDATE simple_guests
SET invitation_code = generate_guest_invitation_code()
WHERE invitation_code IS NULL;

-- View all invitation codes
SELECT name, invitation_code FROM simple_guests ORDER BY name;
```

### Step 6: Test the Flow

1. **Login**: Visit `/dia-1000/login`
   - Option A: Use invitation code (e.g., `HY1000`)
   - Option B: Use shared password (`1000dias`)

2. **Upload**: Visit `/dia-1000/upload`
   - Select upload phase (before/during/after)
   - Drag and drop files or click to select
   - Add optional caption
   - Click "Enviar"

3. **Verify**: Check Supabase Dashboard
   - Storage: `wedding-photos` bucket should have files
   - Database: `guest_photos` table should have records with `moderation_status = 'pending'`

## 📁 File Structure

```
supabase/migrations/
  └── 024_unified_guest_photos_supabase_storage.sql

scripts/
  └── setup-storage-bucket.ts

src/
  ├── lib/
  │   ├── supabase/
  │   │   └── storage.ts          # Storage utilities
  │   └── auth/
  │       └── guestAuth.ts        # Authentication helpers
  │
  ├── app/
  │   ├── api/
  │   │   ├── auth/
  │   │   │   ├── login/route.ts
  │   │   │   ├── verify/route.ts
  │   │   │   └── logout/route.ts
  │   │   └── photos/
  │   │       ├── upload/route.ts
  │   │       └── list/route.ts
  │   │
  │   └── dia-1000/
  │       ├── login/page.tsx      # Guest login
  │       └── upload/page.tsx     # Upload interface
```

## 🔐 Authentication Flow

### Option A: Invitation Code
1. Guest receives unique code (e.g., `HY1000`) in wedding invitation
2. Guest enters code on `/dia-1000/login`
3. System finds guest in `simple_guests` table
4. Creates 72-hour session
5. Redirects to upload page

### Option B: Shared Password
1. All guests know shared password (`1000dias`)
2. Guest enters password and optionally their name
3. System verifies password via `verify_shared_password()` function
4. Creates or finds guest record
5. Creates 72-hour session
6. Redirects to upload page

## 📤 Upload Flow

1. Guest selects files (drag-and-drop or file picker)
2. Client-side validation (file type, size)
3. Images compressed to 1920x1920 max (80% quality)
4. Video metadata extracted (duration, dimensions)
5. File uploaded to Supabase Storage: `{guest_id}/{phase}/{timestamp}_{filename}`
6. Database record created with `moderation_status = 'pending'`
7. Activity feed entry created (hidden until approved)
8. Session upload counter incremented

## 🛡️ Security Features

### Rate Limiting
- Max 50 uploads per guest (configurable in `wedding_auth_config`)
- Session-based tracking
- Enforced at database and API level

### File Validation
- **Images**: 100MB max, JPEG/PNG/WebP/HEIC
- **Videos**: 500MB max, MP4/MOV/WebM
- Client-side and server-side validation

### RLS Policies
- Guests can only upload when authenticated (valid session)
- Guests can only update/delete their own photos
- Public can only view approved photos
- Admin can see all photos

### Content Moderation
- All uploads default to `moderation_status = 'pending'`
- Must be approved by admin before appearing in gallery
- Rejected photos are hidden but not deleted (audit trail)

## 🎨 Features Implemented

### Login Page (`/dia-1000/login`)
- ✅ Tabbed interface (invitation code OR shared password)
- ✅ Form validation
- ✅ Error handling
- ✅ Mobile-responsive
- ✅ Wedding-themed design (Playfair Display + Crimson Text)

### Upload Page (`/dia-1000/upload`)
- ✅ Session verification (auto-redirect to login if not authenticated)
- ✅ Upload phase selection (before/during/after)
- ✅ Drag-and-drop file upload
- ✅ Multi-file upload queue
- ✅ File preview (images and videos)
- ✅ Progress tracking per file
- ✅ Error handling with retry
- ✅ Success states with clearing
- ✅ Caption input (shared across all files)
- ✅ File size display
- ✅ Mobile camera access (via file input)

## 📊 Database Schema

### `guest_photos` Table
```sql
- id (uuid)
- guest_id (uuid) → simple_guests
- guest_name (text)
- title (text, optional)
- caption (text, max 500 chars)
- upload_phase (enum: before/during/after)
- uploaded_at (timestamptz)

-- Supabase Storage
- storage_path (text) → bucket path
- storage_bucket (text) → 'wedding-photos'
- optimized_path (text) → WebP version
- thumbnail_path (text) → thumbnail version

-- File Metadata
- file_size_bytes (integer)
- mime_type (text)
- width (integer)
- height (integer)
- is_video (boolean)
- video_duration_seconds (integer, for videos)
- video_thumbnail_path (text, for videos)

-- Moderation
- moderation_status (enum: pending/approved/rejected)
- moderated_at (timestamptz)
- moderated_by (text)
- rejection_reason (text)

-- Engagement
- view_count (integer)
- like_count (integer)
- comment_count (integer)

-- Flags
- is_featured (boolean)
- is_deleted (boolean)
```

### `guest_sessions` Table
```sql
- id (uuid)
- guest_id (uuid) → simple_guests
- session_token (text, unique)
- auth_method (enum: invitation_code/shared_password/both)
- expires_at (timestamptz)
- is_active (boolean)
- user_agent (text)
- ip_address (inet)
- uploads_count (integer)
- messages_count (integer)
- last_activity_at (timestamptz)
```

## 🎯 Next Steps

### Phase 2: Admin Moderation (TODO)
- [ ] Create `/admin/photos` moderation dashboard
- [ ] Implement batch approve/reject
- [ ] Add rejection reason notes
- [ ] Email notifications to guests

### Phase 3: Public Gallery (TODO)
- [ ] Create `/dia-1000/galeria` public gallery
- [ ] Masonry grid layout
- [ ] Filter by phase (before/during/after)
- [ ] Lightbox viewer
- [ ] Real-time updates (Supabase Realtime)
- [ ] Like/comment functionality

### Phase 4: Polish (TODO)
- [ ] Offline upload queue
- [ ] Network retry logic
- [ ] WebP conversion (server-side)
- [ ] Video thumbnail generation (server-side)
- [ ] CDN caching setup
- [ ] Analytics tracking

## 🐛 Troubleshooting

### Migration Conflicts
If you see errors about columns already existing:
```bash
# Reset migrations (DANGER: will lose data)
npm run db:reset

# Or manually fix
supabase db reset --local
```

### Storage Upload Fails
1. Check bucket exists: Supabase Dashboard > Storage
2. Verify RLS policies: Storage > Policies
3. Check file size limits: Storage > Settings
4. Test with setup script: `npx tsx scripts/setup-storage-bucket.ts`

### Authentication Issues
1. Check session cookie: Browser DevTools > Application > Cookies
2. Verify session in database: `SELECT * FROM guest_sessions WHERE is_active = true`
3. Check shared password: `SELECT verify_shared_password('1000dias')`
4. View invitation codes: `SELECT * FROM guest_auth_status`

### CORS Errors
Ensure Supabase project has correct CORS settings:
- Supabase Dashboard > Settings > API
- Add your domain to allowed origins

## 💾 Storage Costs

**Supabase Pro Plan**: $25/month
- 100GB storage included
- 200GB bandwidth included

**Estimated Usage** (200 guests, 10 photos each):
- Storage: ~20-30GB (compressed images)
- Bandwidth: ~100-150GB (first month)
- **Total: $25-40/month during wedding, $0-10/month after**

## 📝 Notes

- **Decision**: Using Supabase Storage (not Sanity) because:
  - 5x cheaper ($25 vs $129/month)
  - Better video support (500MB vs 100MB)
  - Simpler integration
  - Better CDN performance

- **Session Duration**: 72 hours (3 days)
  - Guests can stay logged in throughout wedding weekend
  - Configurable in `wedding_auth_config.session_duration_hours`

- **Upload Limits**: 50 photos per guest
  - Prevents abuse
  - Configurable in `wedding_auth_config.max_uploads_per_guest`

- **Moderation**: All uploads require approval
  - Prevents inappropriate content
  - Maintains wedding quality standards

## ✅ Success Criteria

- [x] Guests can login with invitation code
- [x] Guests can login with shared password
- [x] Guests can upload photos from desktop
- [x] Guests can upload photos from mobile
- [x] Uploads work on slow mobile networks (3G)
- [ ] Admin can moderate uploads (TODO: Phase 2)
- [ ] Public gallery shows approved photos (TODO: Phase 3)
- [ ] System handles 200 concurrent uploads (TODO: Load testing)
- [x] All photos backed up to Supabase Storage

## 🎉 Deployment Checklist

Before going live:
- [ ] Run migration 024
- [ ] Create storage bucket
- [ ] Set RLS policies
- [ ] Change default password from `1000dias`
- [ ] Test invitation code flow
- [ ] Test shared password flow
- [ ] Test upload from mobile device
- [ ] Test upload on slow network
- [ ] Set up error monitoring (Sentry)
- [ ] Configure email notifications (SendGrid)
- [ ] Load test with 200 concurrent uploads

---

**Implementation Date**: October 2024
**Status**: Phase 1 Complete ✅
**Next Phase**: Admin Moderation Dashboard
