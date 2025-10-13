# Admin Routes Cleanup Assessment

**Date:** 2025-10-13
**Context:** Hel wants to keep hybrid architecture (Sanity for admin-managed content, Supabase for guest-uploaded content), but clean up redundant admin routes.

---

## Architecture Decision ✅

**APPROVED HYBRID ARCHITECTURE:**
- **Sanity CMS:** Admin-managed marketing content (gallery, story, pets, about us)
- **Supabase:** Guest-generated transactional content (photos, RSVPs, payments)

**Reasoning:** Makes perfect sense!
- You manage curated content → Sanity (better content management UX)
- Guests upload photos → Supabase (transactional, needs moderation workflow)
- Clean separation of concerns

---

## Current Admin Routes

### Existing Routes (7 total)
```
/admin                  → Dashboard (homepage)
/admin/login            → Admin authentication
/admin/guests           → Guest RSVP management
/admin/photos           → Guest photo moderation
/admin/pagamentos       → Payment tracking
/admin/analytics        → Wedding statistics
/admin/presentes        → Gift registry management
```

---

## Assessment: Keep or Remove?

### ✅ KEEP (5 routes) - Transactional Operations

#### 1. `/admin` (Dashboard)
**Status:** ✅ KEEP
**Purpose:** Admin homepage with navigation cards
**Reason:** Central navigation hub, necessary

**Current Cards:**
- Gerenciar Convidados → `/admin/guests`
- Moderação de Fotos → `/admin/photos`
- Lista de Presentes → `/admin/presentes` (⚠️ needs discussion)
- Pagamentos → `/admin/pagamentos`
- Analytics → `/admin/analytics`
- Sanity Studio → `/studio`

---

#### 2. `/admin/login` (Authentication)
**Status:** ✅ KEEP
**Purpose:** Admin password authentication
**Reason:** Required for admin access control

**Uses:** Simple cookie-based auth with `ADMIN_PASSWORD` env var

---

#### 3. `/admin/guests` (RSVP Management)
**Status:** ✅ KEEP - CORRECT ARCHITECTURE
**Purpose:** Manage guest RSVPs and confirmations

**Why it's correct:**
- RSVPs are **transactional data** (guest responses, timestamps)
- Not marketing content
- Belongs in Supabase database
- Admin dashboard is correct UI for this

**Database Table:** `guests` (Supabase)
- name, email, phone, attending, dietary_restrictions
- plus_one, invitation_code, rsvp_date
- Transactional operations: confirm RSVP, track responses

---

#### 4. `/admin/photos` (Guest Photo Moderation)
**Status:** ✅ KEEP - CORRECT ARCHITECTURE
**Purpose:** Approve/reject guest-uploaded photos/videos

**Why it's correct:**
- Guest photos are **user-generated content** requiring moderation workflow
- Transactional operations: approve, reject, batch operations
- Not marketing content (not admin-curated)
- Belongs in Supabase with moderation status tracking

**Database Table:** `guest_photos` (Supabase)
- guest_id, storage_path, moderation_status (pending/approved/rejected)
- caption, upload_phase, uploaded_at
- Transactional workflow: upload → moderate → approve/reject → publish

**Features:**
- Batch approve/reject
- Keyboard shortcuts (A/R/Space)
- Filter by status, phase, guest
- Activity feed integration

**Verdict:** This is a PERFECT use of Supabase admin dashboard

---

#### 5. `/admin/pagamentos` (Payment Tracking)
**Status:** ✅ KEEP - CORRECT ARCHITECTURE
**Purpose:** Track PIX payments and gift purchases

**Why it's correct:**
- Payments are **transactional data** (Mercado Pago integration)
- Financial records require database transactions
- Not marketing content
- Belongs in Supabase

**Database Table:** `payments` (Supabase)
- gift_id, guest_id, amount, status, payment_method
- mercado_pago_payment_id, message
- Transactional operations: track payments, reconcile transactions

---

#### 6. `/admin/analytics` (Wedding Statistics)
**Status:** ✅ KEEP - CORRECT ARCHITECTURE
**Purpose:** View real-time wedding statistics and metrics

**Why it's correct:**
- Analytics are **computed from transactional data** (guest count, payment totals)
- Real-time calculations from Supabase tables
- Not marketing content
- Dashboard is correct UI for metrics

**Data Sources:**
- `guests` table → RSVP stats, attendance count
- `payments` table → Revenue totals, payment status
- `guest_photos` table → Photo upload stats
- `wedding_config` table → Wedding metadata

---

### ❌ REMOVE (1 route) - Marketing Content

#### 7. `/admin/presentes` (Gift Registry Management)
**Status:** ⚠️ NEEDS DISCUSSION → Likely ❌ REMOVE
**Purpose:** CRUD operations on gift items (name, description, price, image)

**Current Implementation:**
- Manages `gifts` table in Supabase
- Fields: title, description, price, category, image_url, priority
- CRUD: Create, edit, delete gift items

**The Problem:**
Gift registry items are **marketing content**, not transactional data:
- Admin-curated list of desired gifts
- Descriptions, images, categories
- Content you want to manage like other marketing content
- Should be in Sanity CMS with other curated content

**The Confusion:**
The `gifts` table is mixing concerns:
- **Marketing content:** Gift item details (name, description, image, category)
- **Transactional data:** Purchase tracking (is_purchased, purchased_by, quantity_purchased)

---

## The Gift Registry Architecture Problem

### Current State (Mixed Concerns)
```sql
-- supabase/migrations/001_initial_schema.sql
CREATE TABLE public.gifts (
    id UUID PRIMARY KEY,

    -- MARKETING CONTENT (should be Sanity)
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    registry_url TEXT,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium',

    -- TRANSACTIONAL DATA (correct in Supabase)
    quantity_desired INTEGER DEFAULT 1 NOT NULL,
    quantity_purchased INTEGER DEFAULT 0 NOT NULL,
    is_available BOOLEAN DEFAULT true NOT NULL,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**Problem:** Marketing content + transactional data in same table

---

### Proposed Architecture (Separated Concerns)

#### Option A: Move Gift Items to Sanity (Recommended)

**Sanity CMS:**
```typescript
// Gift Item (marketing content)
{
  _type: 'giftItem',
  title: string,           // "Jogo de Panelas"
  description: string,     // Marketing description
  price: number,           // R$ 500.00
  image: SanityImage,      // Managed in Sanity Assets
  category: reference,     // Reference to category
  priority: 'high' | 'medium' | 'low',
  quantityDesired: number, // How many we want
  displayOrder: number,
  isAvailable: boolean     // Show in public list
}
```

**Supabase:**
```sql
-- Gift Purchases (transactional data)
CREATE TABLE gift_purchases (
    id UUID PRIMARY KEY,
    sanity_gift_id VARCHAR(50) NOT NULL, -- Reference to Sanity
    guest_id UUID REFERENCES guests(id),
    purchased_at TIMESTAMPTZ DEFAULT now(),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Frontend Query:**
```typescript
// Fetch gift items from Sanity with purchase counts from Supabase
const giftsQuery = `*[_type == "giftItem" && isAvailable == true] {
  _id,
  title,
  description,
  price,
  image,
  category->,
  quantityDesired
}`

const gifts = await sanityClient.fetch(giftsQuery)

// Join with Supabase purchase counts
for (const gift of gifts) {
  const { count } = await supabase
    .from('gift_purchases')
    .select('*', { count: 'exact', head: true })
    .eq('sanity_gift_id', gift._id)

  gift.quantityPurchased = count
  gift.isAvailable = count < gift.quantityDesired
}
```

**Benefits:**
- ✅ Clean separation: marketing content in Sanity, transactions in Supabase
- ✅ Better content management UX (Sanity Studio)
- ✅ Image management handled by Sanity CDN
- ✅ Purchase tracking still in Supabase (correct)
- ✅ Can remove `/admin/presentes` route

**Migration Effort:** ~2-3 hours
- Create Sanity `giftItem` schema
- Migrate gift items from Supabase to Sanity
- Create `gift_purchases` table in Supabase
- Update frontend to query both sources
- Update payment flow to reference Sanity gift ID
- Remove `/admin/presentes` route

---

#### Option B: Keep Gifts in Supabase (Pragmatic)

**Arguments for keeping:**
- Gift items are tied to payment transactions (foreign key)
- Current implementation is working
- Migration effort not worth it for small wedding site
- Only need to manage ~20-50 gift items

**Arguments against:**
- Breaks clean architecture principle
- Custom admin UI for content management (should use CMS)
- Images in Supabase instead of Sanity CDN
- Not consistent with rest of architecture (gallery, story, pets in Sanity)

**Verdict:** Keep if you want to avoid migration work, but acknowledge it's technical debt

---

## Recommendations

### Recommendation 1: Clean Architecture (2-3 hours work)

**Execute gift registry migration:**
1. Create `giftItem` schema in Sanity
2. Migrate gift items from Supabase to Sanity
3. Create `gift_purchases` table in Supabase
4. Update frontend to query both sources
5. Remove `/admin/presentes` route

**Result:**
- ✅ 6 admin routes (removed 1)
- ✅ Clean architecture: all marketing content in Sanity
- ✅ Only transactional operations in admin dashboard

---

### Recommendation 2: Pragmatic Approach (0 hours work)

**Accept current state:**
- Keep `/admin/presentes` route
- Acknowledge it's technical debt
- Document the exception
- Move to Sanity post-wedding if needed

**Result:**
- ✅ 7 admin routes (no change)
- ⚠️ Gift items are exception to architecture
- ✅ Everything works, ship it

---

### Recommendation 3: Hybrid Quick Fix (1 hour work)

**Keep gifts in Supabase but improve UX:**
1. Keep `/admin/presentes` route
2. Add note in admin dashboard: "Gift items managed here (exception)"
3. Add link to Sanity Studio: "Other content managed in Sanity"
4. Document architecture decision in CLAUDE.md

**Result:**
- ✅ 7 admin routes (no change)
- ✅ Clear documentation of hybrid approach
- ✅ Quick ship, clean up later

---

## Final Admin Routes (After Cleanup)

### If Clean Architecture (Option A)
```
✅ /admin                → Dashboard
✅ /admin/login          → Authentication
✅ /admin/guests         → RSVP management (transactional)
✅ /admin/photos         → Photo moderation (transactional)
✅ /admin/pagamentos     → Payment tracking (transactional)
✅ /admin/analytics      → Statistics (transactional)
❌ /admin/presentes      → REMOVED (moved to Sanity)
```

**Total:** 6 routes (all transactional operations)

**Sanity Studio:** All marketing content
- Gallery images (admin-curated)
- Story moments (timeline)
- Gift items (NEW)
- Pets
- About us
- Pages and sections

---

### If Pragmatic Approach (Option B)
```
✅ /admin                → Dashboard
✅ /admin/login          → Authentication
✅ /admin/guests         → RSVP management (transactional)
✅ /admin/photos         → Photo moderation (transactional)
✅ /admin/pagamentos     → Payment tracking (transactional)
✅ /admin/analytics      → Statistics (transactional)
⚠️ /admin/presentes      → KEEP (exception to architecture)
```

**Total:** 7 routes (6 transactional + 1 exception)

**Sanity Studio:** Most marketing content
- Gallery images (admin-curated)
- Story moments (timeline)
- Pets
- About us
- Pages and sections

**Exception:** Gift items stay in Supabase admin

---

## Updated Admin Dashboard Cards

### If Clean Architecture (Remove /admin/presentes)

```typescript
const adminSections = [
  {
    href: '/admin/guests',
    icon: Users,
    title: 'Gerenciar Convidados',
    description: 'Adicionar convidados e confirmar RSVPs',
    color: 'blush'
  },
  {
    href: '/admin/photos',
    icon: ImageIcon,
    title: 'Moderação de Fotos',
    description: 'Aprovar/rejeitar fotos dos convidados',
    color: 'purple'
  },
  {
    href: '/admin/pagamentos',
    icon: CreditCard,
    title: 'Pagamentos',
    description: 'Rastrear pagamentos PIX',
    color: 'sage'
  },
  {
    href: '/admin/analytics',
    icon: BarChart3,
    title: 'Analytics',
    description: 'Estatísticas do casamento',
    color: 'purple'
  },
  {
    href: '/studio',
    icon: Calendar,
    title: 'Sanity Studio',
    description: 'Gerenciar conteúdo: História, Galeria, Presentes, Pets',
    color: 'sage',
    external: true
  }
]
```

**Note:** "Presentes" moved to Sanity Studio description

---

### If Pragmatic Approach (Keep /admin/presentes)

```typescript
const adminSections = [
  {
    href: '/admin/guests',
    icon: Users,
    title: 'Gerenciar Convidados',
    description: 'Adicionar convidados e confirmar RSVPs',
    color: 'blush'
  },
  {
    href: '/admin/photos',
    icon: ImageIcon,
    title: 'Moderação de Fotos',
    description: 'Aprovar/rejeitar fotos dos convidados',
    color: 'purple'
  },
  {
    href: '/admin/presentes',
    icon: Gift,
    title: 'Lista de Presentes',
    description: 'Gerenciar presentes (⚠️ exceção - deveria estar no Sanity)',
    color: 'blush'
  },
  {
    href: '/admin/pagamentos',
    icon: CreditCard,
    title: 'Pagamentos',
    description: 'Rastrear pagamentos PIX',
    color: 'sage'
  },
  {
    href: '/admin/analytics',
    icon: BarChart3,
    title: 'Analytics',
    description: 'Estatísticas do casamento',
    color: 'purple'
  },
  {
    href: '/studio',
    icon: Calendar,
    title: 'Sanity Studio',
    description: 'Gerenciar conteúdo: História, Galeria, Pets, Sobre Nós',
    color: 'sage',
    external: true
  }
]
```

**Note:** Added warning emoji to Presentes description

---

## Summary

### Current State ✅
Your admin dashboard is **95% correct architecture**:
- ✅ `/admin/guests` - RSVP management (transactional) ✓
- ✅ `/admin/photos` - Photo moderation (transactional) ✓
- ✅ `/admin/pagamentos` - Payment tracking (transactional) ✓
- ✅ `/admin/analytics` - Statistics (transactional) ✓
- ⚠️ `/admin/presentes` - Gift registry (marketing content) ✗

### Only Exception
Gift items are the ONLY thing that should be in Sanity but are currently in Supabase admin

### Your Call
Choose one:

**Option A: Clean Architecture** (2-3 hours migration)
- Move gift items to Sanity
- Remove `/admin/presentes` route
- 100% clean architecture
- Best long-term solution

**Option B: Pragmatic Approach** (0 hours work)
- Keep `/admin/presentes` route
- Accept as technical debt
- Document exception
- Ship it now, clean up later

**Option C: Hybrid Quick Fix** (1 hour documentation)
- Keep current state
- Add clear documentation
- Update descriptions
- Plan post-wedding migration

### My Recommendation
**Option B (Pragmatic)** for now, **Option A (Clean)** post-wedding

**Reasoning:**
1. Wedding is Nov 20 (5 weeks away)
2. Gift registry is working fine
3. Migration is low-risk but not zero-risk
4. Focus on testing and polish
5. Clean up architecture after wedding

---

**Next Step:** What's your preference? A, B, or C?
