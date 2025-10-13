# Guest Authentication Architecture

## Overview

This document describes the **guest authentication system** for the Thousand Days of Love wedding website, designed to allow controlled access for wedding guests to upload photos/videos and leave messages.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                      GUEST AUTHENTICATION                    │
│                                                              │
│  ┌──────────────┐           ┌──────────────┐               │
│  │ Invitation   │    OR     │   Shared     │               │
│  │    Code      │           │  Password    │               │
│  │  (HY1000)    │           │ (1000dias)   │               │
│  └──────┬───────┘           └──────┬───────┘               │
│         │                          │                        │
│         └─────────┬────────────────┘                        │
│                   │                                         │
│              ┌────▼─────┐                                   │
│              │  Session │                                   │
│              │  Token   │                                   │
│              │ (72hrs)  │                                   │
│              └────┬─────┘                                   │
│                   │                                         │
│         ┌─────────▼──────────┐                             │
│         │  Authenticated     │                             │
│         │  Guest Actions:    │                             │
│         │  • Upload Photos   │                             │
│         │  • Upload Videos   │                             │
│         │  • Post Messages   │                             │
│         │  • Like & Comment  │                             │
│         └────────────────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Methods

### Option 1: Invitation Code (Recommended)
Each guest receives a unique invitation code (e.g., `HY1000`, `AMOR25`).

**Use Case**: Personalized guest experience, track who uploaded what

**Flow**:
1. Guest enters their invitation code on `/dia-1000/login`
2. System looks up code in `simple_guests` table
3. If valid, creates session and associates uploads with guest
4. Guest can see their upload history

**Pros**:
- Personalized experience
- Track individual guest contributions
- Can send invite codes via email/WhatsApp
- Each guest accountable for uploads

**Cons**:
- More complex setup (need to generate codes)
- Guests might lose their codes

### Option 2: Shared Password
Single password shared with all wedding guests (e.g., `1000dias`).

**Use Case**: Simple access, all guests use same password

**Flow**:
1. Guest enters shared password on `/dia-1000/login`
2. System verifies against hashed password in `wedding_auth_config`
3. Creates anonymous session (not tied to specific guest)
4. Guest can upload but association is weaker

**Pros**:
- Extremely simple (one password for everyone)
- Easy to share (announce at wedding, WhatsApp message)
- No setup required

**Cons**:
- Can't track individual guest contributions as precisely
- If password leaks, harder to revoke access
- Less personalized experience

### Option 3: Both Methods (Flexible)
Allow guests to use either invitation code OR shared password.

**Recommended Configuration**:
- Invitation code: Preferred, associates uploads with guest
- Shared password: Backup method for guests who lost code

## Database Schema

### 1. Guest Invitation Codes (`simple_guests` table)

```sql
ALTER TABLE simple_guests
ADD COLUMN invitation_code TEXT UNIQUE NOT NULL,
ADD COLUMN account_created BOOLEAN DEFAULT false,
ADD COLUMN last_login TIMESTAMPTZ;
```

**Fields**:
- `invitation_code`: Unique 6-character code (e.g., `HY1000`)
- `account_created`: Whether guest has logged in at least once
- `last_login`: Track guest activity

### 2. Shared Password Config (`wedding_auth_config` table)

```sql
CREATE TABLE wedding_auth_config (
  id UUID PRIMARY KEY,
  shared_password_hash TEXT NOT NULL,
  shared_password_enabled BOOLEAN DEFAULT true,
  require_invitation_code BOOLEAN DEFAULT true,
  allow_password_only BOOLEAN DEFAULT false,
  session_duration_hours INTEGER DEFAULT 72,
  max_uploads_per_guest INTEGER DEFAULT 50,
  photo_upload_enabled BOOLEAN DEFAULT true,
  video_upload_enabled BOOLEAN DEFAULT true,
  message_board_enabled BOOLEAN DEFAULT true
);
```

**Singleton Pattern**: Only one row exists in this table.

**Key Fields**:
- `shared_password_hash`: Bcrypt-hashed password
- `shared_password_enabled`: Toggle shared password on/off
- `require_invitation_code`: Force guests to use invite codes
- `allow_password_only`: Allow shared password without invite code
- `session_duration_hours`: How long sessions last (default: 72 hours)
- `max_uploads_per_guest`: Upload limit per guest

### 3. Guest Sessions (`guest_sessions` table)

```sql
CREATE TABLE guest_sessions (
  id UUID PRIMARY KEY,
  guest_id UUID REFERENCES simple_guests(id),
  session_token TEXT UNIQUE NOT NULL,
  auth_method TEXT CHECK (auth_method IN ('invitation_code', 'shared_password', 'both')),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  user_agent TEXT,
  ip_address INET,
  uploads_count INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose**: Track active guest sessions for authentication and rate limiting.

**Session Token**: JWT or random UUID stored in browser localStorage/cookies.

## Media Storage Strategy

### Photos & Videos → Sanity CMS
All guest-uploaded photos and videos are stored in **Sanity CMS**, NOT Supabase Storage.

**Why Sanity?**
- ✅ Powerful CDN with automatic image optimization
- ✅ Built-in image transformation (resize, crop, format conversion)
- ✅ Video storage and streaming
- ✅ Better long-term content management
- ✅ Unified CMS for all wedding content

**Flow**:
```
1. Guest uploads file → Next.js API endpoint
2. API uploads to Sanity using @sanity/client
3. Sanity stores in CDN, returns asset ID
4. Create Sanity document (guestMedia) with asset reference
5. Create Supabase record with Sanity IDs for fast queries
```

### Comments & Engagement → Supabase
Comments, likes, and real-time interactions stay in **Supabase**.

**Why Supabase?**
- ✅ Real-time subscriptions (WebSockets)
- ✅ Fast queries with proper indexing
- ✅ Row-level security
- ✅ Better for transactional data

## Updated `guest_photos` Table

```sql
-- Removed old columns (storage_path, thumbnail_path, file_size, mime_type, width, height)
-- Added Sanity references:

ALTER TABLE guest_photos
ADD COLUMN sanity_asset_id TEXT UNIQUE,        -- Sanity asset ID
ADD COLUMN sanity_document_id TEXT UNIQUE,     -- Sanity document _id
ADD COLUMN sanity_image_url TEXT,              -- CDN URL
ADD COLUMN is_video BOOLEAN DEFAULT false,     -- Photo or video
ADD COLUMN original_filename TEXT,
ADD COLUMN file_size_bytes INTEGER,
ADD COLUMN duration_seconds INTEGER;           -- For videos
```

**Purpose**: Fast queries and real-time updates in Supabase, while actual media lives in Sanity.

## Sanity Schema: `guestMedia`

New Sanity document type for guest-uploaded media.

**Key Fields**:
- `mediaType`: 'photo' | 'video'
- `image`: Sanity image asset (for photos)
- `video`: Sanity file asset (for videos)
- `videoThumbnail`: Thumbnail image for video previews
- `guestId`: UUID reference to Supabase `simple_guests`
- `guestName`: Guest's name
- `title`: Optional title
- `caption`: Up to 500 characters
- `uploadPhase`: 'before' | 'during' | 'after' wedding
- `moderationStatus`: 'pending' | 'approved' | 'rejected'
- `isFeatured`: Show in featured galleries
- `likeCount`, `commentCount`, `viewCount`: Synced from Supabase

**Moderation Workflow**:
1. Guest uploads → Status: `pending`
2. Admin reviews in Sanity Studio
3. Admin approves/rejects
4. Status updated in both Sanity and Supabase
5. Only `approved` content visible on frontend

## Authentication Flow

### Login with Invitation Code

```typescript
// 1. Guest submits invitation code
POST /api/auth/login
{
  "invitationCode": "HY1000"
}

// 2. Server verifies code
const guest = await supabase
  .from('simple_guests')
  .select('*')
  .eq('invitation_code', 'HY1000')
  .single()

// 3. Create session
const sessionToken = generateSecureToken()
const session = await create_guest_session(
  guest.id,
  sessionToken,
  'invitation_code',
  72 // hours
)

// 4. Return token to client
return {
  sessionToken,
  guest: {
    id: guest.id,
    name: guest.name,
    invitation_code: guest.invitation_code
  },
  expiresAt: session.expires_at
}

// 5. Client stores token in localStorage
localStorage.setItem('guestSession', sessionToken)
```

### Login with Shared Password

```typescript
// 1. Guest submits shared password
POST /api/auth/login
{
  "sharedPassword": "1000dias"
}

// 2. Server verifies password
const isValid = await supabase.rpc('verify_shared_password', {
  input_password: '1000dias'
})

// 3. Create anonymous session (no guest_id)
const sessionToken = generateSecureToken()
const session = await create_guest_session(
  null, // No specific guest
  sessionToken,
  'shared_password',
  72
)

// 4. Return token
return {
  sessionToken,
  guest: null,
  expiresAt: session.expires_at
}
```

### Authenticated Requests

```typescript
// All subsequent requests include session token
GET /api/photos
Headers: {
  Authorization: Bearer <sessionToken>
}

// Server validates token
const session = await supabase
  .from('guest_sessions')
  .select('*')
  .eq('session_token', token)
  .eq('is_active', true)
  .gt('expires_at', new Date())
  .single()

if (!session) {
  return { error: 'Invalid or expired session' }
}

// If valid, allow action
```

## Admin Functions

### 1. Generate Invitation Codes

```sql
-- Auto-generate codes for all guests
UPDATE simple_guests
SET invitation_code = generate_guest_invitation_code()
WHERE invitation_code IS NULL;
```

### 2. Change Shared Password

```sql
-- Update shared password (admin only)
SELECT update_shared_password('new-password-here');
```

### 3. View Guest Auth Status

```sql
-- See which guests have logged in, uploaded photos, etc.
SELECT * FROM guest_auth_status;
```

Returns:
```
┌──────────────┬─────────────────┬───────────────┬────────────────┬──────────────────┐
│ name         │ invitation_code │ last_login    │ photos_uploaded│ messages_posted  │
├──────────────┼─────────────────┼───────────────┼────────────────┼──────────────────┤
│ João Silva   │ HY1000          │ 2025-11-20    │ 15             │ 3                │
│ Maria Costa  │ AMOR25          │ 2025-11-19    │ 8              │ 1                │
│ Pedro Santos │ LUV999          │ NULL          │ 0              │ 0                │
└──────────────┴─────────────────┴───────────────┴────────────────┴──────────────────┘
```

### 4. Clean Up Expired Sessions

```sql
-- Remove expired sessions (run daily via cron)
SELECT cleanup_expired_sessions();
```

## Rate Limiting

Prevent abuse by limiting guest actions:

**Per Guest**:
- Max 50 photo/video uploads (configurable)
- Max 20 uploads per hour
- Max 100 messages per day

**Implementation**:
```typescript
// Check upload count
const session = await getGuestSession(token)

if (session.uploads_count >= MAX_UPLOADS_PER_GUEST) {
  return { error: 'Upload limit reached' }
}

// Increment counter after successful upload
await supabase
  .from('guest_sessions')
  .update({ uploads_count: session.uploads_count + 1 })
  .eq('id', session.id)
```

## Security Considerations

### 1. Session Security
- Sessions expire after 72 hours (configurable)
- Session tokens are random UUIDs or JWTs
- Tokens stored in `httpOnly` cookies or localStorage
- HTTPS only in production

### 2. Password Security
- Shared password hashed with bcrypt (cost factor 10)
- Password verification uses `crypt()` function in PostgreSQL
- Only admins can update password via Supabase functions

### 3. Content Moderation
- All uploads start as `pending`
- Admin approval required before public display
- Spam detection flags suspicious content
- Inappropriate content scoring (future: AI moderation)

### 4. Row-Level Security (RLS)
```sql
-- Only authenticated guests can upload
CREATE POLICY "Authenticated guests can upload photos"
ON guest_photos FOR INSERT
WITH CHECK (guest_id IN (
  SELECT guest_id FROM guest_sessions
  WHERE is_active = true AND expires_at > NOW()
));
```

## Frontend Implementation

### Login Page (`/dia-1000/login`)

```tsx
'use client'

export default function GuestLogin() {
  const [authMethod, setAuthMethod] = useState<'invite' | 'password'>('invite')
  const [inviteCode, setInviteCode] = useState('')
  const [sharedPassword, setSharedPassword] = useState('')

  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        authMethod === 'invite'
          ? { invitationCode: inviteCode }
          : { sharedPassword: sharedPassword }
      ),
    })

    const { sessionToken, guest, expiresAt } = await response.json()

    // Store session
    localStorage.setItem('guestSession', sessionToken)
    localStorage.setItem('guestInfo', JSON.stringify(guest))

    // Redirect to upload page
    router.push('/dia-1000/upload')
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1>Acesse a Galeria dos Convidados</h1>

      <div className="mb-4">
        <button onClick={() => setAuthMethod('invite')}>
          Tenho um Código de Convite
        </button>
        <button onClick={() => setAuthMethod('password')}>
          Tenho a Senha Compartilhada
        </button>
      </div>

      {authMethod === 'invite' ? (
        <input
          placeholder="Digite seu código (ex: HY1000)"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
        />
      ) : (
        <input
          type="password"
          placeholder="Digite a senha compartilhada"
          value={sharedPassword}
          onChange={(e) => setSharedPassword(e.target.value)}
        />
      )}

      <button onClick={handleLogin}>Entrar</button>
    </div>
  )
}
```

### Protected API Route

```typescript
// /api/photos/upload
import { verifyGuestSession } from '@/lib/auth/guestAuth'

export async function POST(req: Request) {
  // Verify session
  const session = await verifyGuestSession(req)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check rate limit
  if (session.uploads_count >= MAX_UPLOADS) {
    return Response.json({ error: 'Upload limit reached' }, { status: 429 })
  }

  // Process upload
  const formData = await req.formData()
  const file = formData.get('file') as File

  // 1. Upload to Sanity
  const sanityAsset = await uploadToSanity(file)

  // 2. Create Sanity document
  const sanityDoc = await sanityClient.create({
    _type: 'guestMedia',
    mediaType: 'photo',
    image: {
      _type: 'image',
      asset: {
        _ref: sanityAsset._id,
        _type: 'reference',
      },
    },
    guestId: session.guest_id,
    guestName: session.guest?.name,
    uploadPhase: 'during',
    moderationStatus: 'pending',
  })

  // 3. Create Supabase record
  await supabase.from('guest_photos').insert({
    guest_id: session.guest_id,
    guest_name: session.guest?.name,
    sanity_asset_id: sanityAsset._id,
    sanity_document_id: sanityDoc._id,
    sanity_image_url: getImageUrl(sanityAsset),
    upload_phase: 'during',
    moderation_status: 'pending',
  })

  // 4. Update upload count
  await incrementUploadCount(session.id)

  return Response.json({ success: true })
}
```

## Configuration Options

### Default Settings

```sql
-- Default configuration (change as needed)
shared_password: "1000dias"
session_duration: 72 hours
require_invitation_code: true
allow_password_only: false
max_uploads_per_guest: 50
photo_upload_enabled: true
video_upload_enabled: true
message_board_enabled: true
```

### Recommended Production Settings

**Before Wedding** (Testing Phase):
- `require_invitation_code: true`
- `allow_password_only: false`
- Only invited guests can test upload

**Wedding Day**:
- `require_invitation_code: false`
- `allow_password_only: true`
- Shared password announced at venue
- Anyone with password can upload

**After Wedding**:
- `photo_upload_enabled: false`
- `video_upload_enabled: false`
- Close uploads, keep gallery open for viewing

## Migration Steps

### 1. Apply Database Migration

```bash
cd /Users/helrabelo/code/personal/thousanddaysoflove
npx supabase db reset
```

This runs migration `023_guest_authentication_system.sql`.

### 2. Generate Invitation Codes

```sql
-- Generates codes for all existing guests
UPDATE simple_guests
SET invitation_code = generate_guest_invitation_code()
WHERE invitation_code IS NULL;
```

### 3. Set Shared Password

```sql
-- Change from default "1000dias" to your chosen password
SELECT update_shared_password('your-secure-password');
```

### 4. Export Invitation Codes

```sql
-- Get all codes to send to guests
SELECT name, email, invitation_code
FROM simple_guests
ORDER BY name;
```

Save as CSV and send via email/WhatsApp.

### 5. Deploy Sanity Schema

```bash
# Add guestMedia to Sanity Studio
npm run sanity:typegen

# Deploy to Sanity
npm run build
```

## Testing Checklist

- [ ] Generate invitation codes for test guests
- [ ] Test login with invitation code
- [ ] Test login with shared password
- [ ] Test photo upload flow (upload to Sanity, record in Supabase)
- [ ] Test video upload flow
- [ ] Test session expiration (72 hours)
- [ ] Test rate limiting (50 uploads max)
- [ ] Test moderation workflow in Sanity Studio
- [ ] Test unauthenticated access (should be blocked)
- [ ] Test expired session handling

## Support & Troubleshooting

### Guest Can't Log In
1. Check invitation code is correct (case-insensitive)
2. Verify code exists: `SELECT * FROM simple_guests WHERE invitation_code = 'CODE'`
3. Check shared password is enabled: `SELECT * FROM wedding_auth_config`

### Upload Failing
1. Check session is valid: `SELECT * FROM guest_sessions WHERE session_token = 'TOKEN'`
2. Verify upload limit not reached
3. Check Sanity API credentials in `.env.local`

### Session Expired Too Soon
1. Check `session_duration_hours` in `wedding_auth_config`
2. Default is 72 hours; increase if needed

## Future Enhancements

- [ ] Two-factor authentication via SMS
- [ ] Guest-specific galleries (each guest sees their own uploads)
- [ ] AI-powered content moderation (NSFW detection)
- [ ] Bulk invitation code generation with QR codes
- [ ] Guest leaderboards (most photos, most liked)
- [ ] Real-time notifications when guest uploads

---

**Next Steps**: Apply migration, test authentication flow, deploy to staging.
