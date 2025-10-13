# Phase 2: Admin Photo Moderation Dashboard

## Context

Phase 1 of the guest photo upload system is **COMPLETE** and committed (commit ae87738).

### ✅ What's Working in Phase 1:
- **Authentication**: Guest login with invitation codes or shared password (`1000dias`)
- **Upload System**: Drag-and-drop photo/video upload at `/dia-1000/upload`
- **Storage**: Supabase Storage `wedding-photos` bucket with files uploading successfully
- **Database**: Records created with `moderation_status='pending'` in `guest_photos` table
- **API Endpoints**: All auth and upload endpoints working

### 📊 Database Schema
```sql
-- Guest photos stored with Supabase Storage paths
guest_photos (
  id, guest_id, guest_name, caption, title,
  upload_phase: 'before' | 'during' | 'after',
  storage_path, storage_bucket, public_url,
  file_size_bytes, mime_type, width, height,
  is_video, video_duration_seconds,
  moderation_status: 'pending' | 'approved' | 'rejected',
  moderated_at, moderated_by, rejection_reason,
  view_count, like_count, is_featured
)
```

### 🔑 Authentication Notes
- Service role key bypasses RLS for admin operations
- Use `createAdminClient()` from `@/lib/supabase/server` for moderation endpoints
- Default shared password: `1000dias` (change in production)

## Your Task: Build Admin Moderation Dashboard

Build `/admin/photos` page for moderating guest-uploaded photos.

### Requirements

**1. Admin Photos Page (`src/app/admin/photos/page.tsx`)**
- Server-side rendered (use `createAdminClient()`)
- Grid layout showing all pending uploads
- Each card displays:
  - Photo/video preview (or thumbnail)
  - Guest name (`guest_name`)
  - Upload time (`uploaded_at`)
  - Upload phase badge (before/during/after)
  - File size and dimensions
  - Caption (if provided)
- Approve/Reject buttons on each card
- Show approved/rejected status with visual indicators

**2. Moderation API Endpoints**

Create `src/app/api/admin/photos/[id]/route.ts`:
```typescript
// PATCH /api/admin/photos/[id] - Moderate photo
{
  "action": "approve" | "reject",
  "rejection_reason"?: string  // Required if rejecting
}
```

Update `guest_photos` table:
- Set `moderation_status` to 'approved' or 'rejected'
- Set `moderated_at` to NOW()
- Set `moderated_by` to admin username/email
- Store `rejection_reason` if rejecting

**3. Filters & Search**
- Status filter: All / Pending / Approved / Rejected
- Phase filter: All / Before / During / After
- Search by guest name
- Sort by: Date (newest first), Guest name, File size

**4. Batch Operations**
- Checkbox selection for multiple photos
- "Approve Selected" button
- "Reject Selected" button (prompt for reason)
- "Select All" / "Deselect All" toggles

**5. Keyboard Shortcuts**
- Arrow keys: Navigate between photos
- `A`: Approve current photo
- `R`: Reject current photo (show reason prompt)
- `Space`: Select/deselect current photo
- `Shift+A`: Approve all selected
- `Shift+R`: Reject all selected
- `Escape`: Clear selection

**6. UI/UX Polish**
- Mobile-responsive grid (1 col mobile, 2-3 cols tablet, 4-5 cols desktop)
- Loading states for moderation actions
- Success/error toasts
- Confirmation dialogs for destructive actions
- Wedding theme styling (Playfair Display + Crimson Text)
- Stats summary: X pending, Y approved, Z rejected

**7. Admin Authentication**
For now, use simple password protection:
- Check environment variable `ADMIN_PASSWORD=HelYlana1000Dias!`
- Create simple login at `/admin/login` if not authenticated
- Store session in HTTP-only cookie

### Implementation Notes

**Supabase Client Usage:**
```typescript
// In admin pages/API routes - bypasses RLS
import { createAdminClient } from '@/lib/supabase/server'
const supabase = createAdminClient()

// Query all photos with moderation status
const { data: photos } = await supabase
  .from('guest_photos')
  .select('*')
  .eq('moderation_status', 'pending')
  .order('uploaded_at', { ascending: false })
```

**Update Photo Status:**
```typescript
await supabase
  .from('guest_photos')
  .update({
    moderation_status: 'approved',
    moderated_at: new Date().toISOString(),
    moderated_by: 'admin',
  })
  .eq('id', photoId)

// Also update activity_feed.is_public = true for approved photos
await supabase
  .from('activity_feed')
  .update({ is_public: true })
  .eq('target_type', 'photo')
  .eq('target_id', photoId)
```

**Storage URLs:**
Photos already have `storage_path` - get public URL:
```typescript
import { getPublicUrl } from '@/lib/supabase/storage'
const url = getPublicUrl(photo.storage_path)
```

### Testing Checklist

- [ ] `/admin/photos` page loads and shows pending uploads
- [ ] Can approve individual photos (status changes to 'approved')
- [ ] Can reject individual photos with reason
- [ ] Filters work (status, phase, search)
- [ ] Batch operations work (select multiple, approve/reject all)
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive layout
- [ ] Loading states and error handling
- [ ] Activity feed entries become public when approved

### Project Location
```
/Users/helrabelo/code/personal/thousanddaysoflove
```

### Quick Start Commands
```bash
cd /Users/helrabelo/code/personal/thousanddaysoflove
npm run dev           # Start dev server
git log --oneline -5  # See recent commits
```

### Documentation References
- `docs/2025-10-13-guest-photo-upload-guide.md` - Complete Phase 1 guide
- `docs/2025-10-13-guest-authentication-system.md` - Auth architecture
- `PHASE1_COMPLETE_SUMMARY.md` - Implementation summary

### Success Criteria

✅ Admin can view all uploaded photos in a grid
✅ Admin can approve/reject photos individually
✅ Admin can batch approve/reject multiple photos
✅ Filtering and search work smoothly
✅ Keyboard shortcuts provide efficient workflow
✅ Mobile-responsive and follows wedding theme
✅ Activity feed entries become public when photos are approved

---

**Let's build the admin moderation dashboard!** 🚀
