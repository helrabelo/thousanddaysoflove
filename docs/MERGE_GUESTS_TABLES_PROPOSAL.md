# Merge Invitations + Simple Guests Tables

## Problem

We currently have **two overlapping tables** that cause confusion and data duplication:

1. **`invitations`** - Personalized invitation codes with tracking
2. **`simple_guests`** - Guest records for authentication/sessions

When a guest authenticates with an invitation code, the system:
- Finds their record in `invitations`
- **Creates a duplicate record** in `simple_guests`
- Links `guest_sessions` to the `simple_guests` record

This creates:
- **Data duplication** (name, email, phone stored in both tables)
- **Sync issues** (updating one table doesn't update the other)
- **Confusion** (which table is the source of truth?)

## Proposed Solution

**Merge into a single `guests` table** that handles both use cases:

### Use Case 1: Admin-Created Invitations
Admin creates guest records with:
- Unique invitation codes
- Personalized messages
- Pre-filled contact info
- Relationship tracking

### Use Case 2: Shared Password Walk-ins
Guest authenticates with shared password:
- System generates invitation code automatically
- Guest provides their name
- Minimal initial data
- Can be enhanced later

## Proposed Schema

```sql
CREATE TABLE guests (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Invitation System (from invitations table)
  invitation_code TEXT UNIQUE NOT NULL,  -- Generated for all guests
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,

  -- Relationship & Grouping (from invitations table)
  relationship_type TEXT CHECK (relationship_type IN ('family', 'friend', 'colleague', 'other')),
  created_by_admin BOOLEAN DEFAULT false,  -- NEW: Distinguish admin vs self-created

  -- Plus One (merged from both tables)
  plus_one_allowed BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  plus_ones_count INTEGER DEFAULT 0,  -- Actual count from RSVP

  -- Event Details (from invitations table)
  table_number INTEGER,
  dietary_restrictions TEXT,
  custom_message TEXT,  -- Admin's personalized message
  notes TEXT,  -- Guest's own notes

  -- RSVP & Attendance (from simple_guests table)
  attending BOOLEAN DEFAULT NULL,  -- NULL = not responded
  confirmed_at TIMESTAMPTZ,
  confirmed_by TEXT,  -- 'self', 'admin', or name

  -- Progress Tracking (from invitations table)
  opened_at TIMESTAMPTZ,  -- First opened invitation
  open_count INTEGER DEFAULT 0,
  rsvp_completed BOOLEAN DEFAULT false,
  gift_selected BOOLEAN DEFAULT false,
  photos_uploaded BOOLEAN DEFAULT false,
  messages_posted BOOLEAN DEFAULT false,  -- NEW

  -- Account Status
  account_created BOOLEAN DEFAULT false,  -- Has logged in
  last_login TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_guests_invitation_code ON guests(invitation_code);
CREATE INDEX idx_guests_email ON guests(guest_email);
CREATE INDEX idx_guests_name ON guests USING gin(to_tsvector('portuguese', guest_name));
CREATE INDEX idx_guests_relationship_type ON guests(relationship_type);
CREATE INDEX idx_guests_attending ON guests(attending);
CREATE INDEX idx_guests_created_at ON guests(created_at DESC);
```

## Migration Strategy

### Phase 1: Create New Table ✅
```sql
-- Create guests table with merged schema
-- Add all indexes
-- Add RLS policies
```

### Phase 2: Migrate Data 📋
```sql
-- Migrate invitations → guests
INSERT INTO guests (
  invitation_code, guest_name, guest_email, guest_phone,
  relationship_type, plus_one_allowed, plus_one_name,
  table_number, dietary_restrictions, custom_message,
  opened_at, open_count, rsvp_completed, gift_selected, photos_uploaded,
  created_by_admin, created_at, updated_at
)
SELECT
  code, guest_name, guest_email, guest_phone,
  relationship_type, plus_one_allowed, plus_one_name,
  table_number, dietary_restrictions, custom_message,
  opened_at, open_count, rsvp_completed, gift_selected, photos_uploaded,
  true,  -- created_by_admin
  created_at, updated_at
FROM invitations;

-- Migrate simple_guests → guests (only if not already from invitations)
INSERT INTO guests (
  invitation_code, guest_name, guest_email, guest_phone,
  attending, plus_ones_count, notes,
  confirmed_at, confirmed_by,
  account_created, last_login,
  created_by_admin, created_at, updated_at
)
SELECT
  COALESCE(invitation_code, 'GUEST' || LPAD(NEXTVAL('guest_code_seq')::TEXT, 6, '0')),
  name, email, phone,
  attending, plus_ones, notes,
  confirmed_at, confirmed_by,
  true,  -- has account if in simple_guests
  last_login,
  false,  -- created_by_admin
  created_at, updated_at
FROM simple_guests
WHERE invitation_code IS NULL  -- Don't duplicate invitations data
   OR invitation_code NOT IN (SELECT code FROM invitations);
```

### Phase 3: Update Foreign Keys 🔧
```sql
-- guest_sessions.guest_id already references simple_guests(id)
-- We need to update it to reference guests(id)

-- Step 1: Add temporary column
ALTER TABLE guest_sessions ADD COLUMN new_guest_id UUID;

-- Step 2: Map old IDs to new IDs
UPDATE guest_sessions gs
SET new_guest_id = g.id
FROM simple_guests sg
JOIN guests g ON (
  g.invitation_code = sg.invitation_code
  OR g.guest_email = sg.email
  OR g.guest_name = sg.name
)
WHERE gs.guest_id = sg.id;

-- Step 3: Drop old FK, rename column, add new FK
ALTER TABLE guest_sessions DROP CONSTRAINT guest_sessions_guest_id_fkey;
ALTER TABLE guest_sessions DROP COLUMN guest_id;
ALTER TABLE guest_sessions RENAME COLUMN new_guest_id TO guest_id;
ALTER TABLE guest_sessions
  ADD CONSTRAINT guest_sessions_guest_id_fkey
  FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE;
```

### Phase 4: Update Code 💻
Update all queries from:
- `from('invitations')` → `from('guests')`
- `from('simple_guests')` → `from('guests')`

Files to update:
- `src/lib/auth/guestAuth.ts`
- `src/lib/supabase/invitations.ts`
- `src/app/convite/[code]/layout.tsx`
- `src/app/admin/guests/page.tsx`
- `src/app/admin/convites/page.tsx` (combine with guests page?)
- All API routes using invitations/simple_guests

### Phase 5: Drop Old Tables 🗑️
```sql
DROP TABLE invitations CASCADE;
DROP TABLE simple_guests CASCADE;
```

## Benefits

✅ **Single source of truth** - All guest data in one place
✅ **No duplication** - Name, email, phone stored once
✅ **Simpler code** - One table to query instead of two
✅ **Better tracking** - Progress tracking works for all guests
✅ **Cleaner admin** - One guest management page
✅ **Backwards compatible** - Migration preserves all data

## Risks & Mitigation

⚠️ **Risk**: Data loss during migration
✅ **Mitigation**:
- Create full backup before migration
- Test on local database first
- Keep old tables until verified

⚠️ **Risk**: Breaking active guest sessions
✅ **Mitigation**:
- Run migration during low-traffic period
- Sessions will auto-recover on next request
- Session cleanup happens naturally

⚠️ **Risk**: Code references to old tables
✅ **Mitigation**:
- Comprehensive grep for all references
- Update TypeScript types
- Test all auth flows

## Timeline

1. **Review & Approve** (you) - Review this proposal
2. **Create Migration** (10 min) - Write SQL migration file
3. **Test Locally** (15 min) - Run on local Supabase
4. **Update Code** (30 min) - Update all table references
5. **Test Everything** (20 min) - Auth, invitations, sessions
6. **Deploy to Production** (5 min) - Run migration
7. **Monitor** (24 hours) - Watch for issues

**Total Time**: ~1.5 hours

## Next Steps

If you approve this plan, I'll:
1. Create the migration file
2. Update all code references
3. Test locally
4. Prepare deployment guide

What do you think?
