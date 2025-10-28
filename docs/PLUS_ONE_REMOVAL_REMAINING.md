# Plus One Removal - Remaining Work

## ✅ Completed (Current Session)

### Database Layer
- ✅ Migration created: `027_remove_plus_one_functionality.sql`
- ✅ Updated `get_table_guests()` function

### TypeScript Types
- ✅ Removed from `src/types/wedding.ts`:
  - `Guest.plus_one` and `Guest.plus_one_name`
  - `InvitationCode.code_type` (removed 'plus_one' option)
  - `GuestRsvpStats.total_with_plus_ones`
  - `Invitation.plus_one_allowed` and `Invitation.plus_one_name`
  - `TableGuest.plus_one_allowed` and `TableGuest.plus_one_name`

- ✅ Removed from `src/types/database.ts`:
  - All `plus_one` and `plus_one_name` fields from guests table

### Forms & Validation
- ✅ `src/lib/validation/forms.ts`:
  - Removed `plusOne` and `plusOneName` from `RsvpFormData`
  - Removed plus one validation logic

- ✅ `src/components/forms/RsvpForm.tsx`:
  - Removed `plusOne` and `plusOneName` from form state
  - Removed plus one validation in `validateCurrentStep()`
  - Removed plus one fields from `GuestService.submitRsvp()` call
  - Removed entire plus one checkbox and name input UI section

---

## 🔄 Remaining Work

### Priority 1: Service Layer (Critical)

#### 1. `/src/lib/services/guests.ts`
Remove plus_one from:
- `submitRsvp()` method parameters
- Any internal logic using plus_one fields

#### 2. `/src/lib/supabase/invitations.ts`
Remove from all queries and transforms:
- `plus_one_allowed` field
- `plus_one_name` field
- Stats calculations with plus ones

#### 3. `/src/lib/supabase/live.ts`
Remove from confirmed guests query:
- `plus_one_allowed`
- `plus_one_name`

#### 4. `/src/lib/services/email-automation.ts`
Remove from email templates:
- Plus one conditionals
- Plus one name displays
- Plus one greetings

#### 5. `/src/lib/utils/invitation-helpers.ts`
Remove:
- Plus one related helper text
- Plus one allowed logic

#### 6. `/src/lib/utils/messages.ts`
Remove from message templates:
- `guest.plus_one` references
- `guest.plus_one_name` references

### Priority 2: API Routes

#### 1. `/src/app/api/invitations/submit-rsvp/route.ts`
Remove:
- `plus_one_attending` parameter
- `plus_one_name` parameter
- `InvitationUpdatePayload.plus_one_name`
- Update logic for plus_one fields

### Priority 3: UI Components (Display)

#### 1. `/src/components/invitations/RSVPQuickForm.tsx`
Remove:
- `plusOneAttending` state
- `plusOneName` state
- Plus one validation
- Plus one API payload fields

#### 2. `/src/components/invitations/RSVPPromptCard.tsx`
Remove (Lines 137-142):
- Plus one name display section
```typescript
{attending && invitation.plus_one_name && (
  <div className="mt-4 pt-4 border-t border-emerald-200">
    <p className="font-crimson text-sm text-emerald-800">
      <strong>Acompanhante:</strong> {invitation.plus_one_name}
    </p>
  </div>
)}
```

#### 3. `/src/components/invitations/featureContent.ts`
Remove:
- Plus one feature description (appears twice)

#### 4. `/src/components/live/GuestsGrid.tsx` (Lines 20-30+)
Remove:
- Plus one counting logic: `+ (guest.plus_one_allowed ? 1 : 0)`
- Plus one name display

#### 5. `/src/components/dashboard/InvitationCard.tsx`
Remove:
- `invitation.plus_one_allowed` conditional
- `invitation.plus_one_name` display

#### 6. `/src/components/seating/SeatingChart.tsx`
Remove:
- Plus one name display: `(+ {guest.plus_one_name})`

#### 7. `/src/components/seating/SeatingChartPrintable.tsx`
Remove:
- Plus one name display with italics

### Priority 4: Admin Pages

#### 1. `/src/app/admin/guests/page.tsx`
Remove:
- `plus_ones` field from guest data structure
- `plus_ones` field from edit form
- Sort field `'plus_ones'`
- Display `{guest.plus_ones}`
- Update `plus_ones: normalized`

#### 2. `/src/app/admin/analytics/page.tsx`
Remove:
- `plus_ones: number | null` stat
- `totalWithPlusOnes` calculation

#### 3. `/src/app/admin/convites/page.tsx` (Large file - multiple sections)
Remove:
- `plus_one_allowed` checkbox toggle
- `plus_one_name` input field
- Admin form creation modal plus one fields
- Admin form edit modal plus one fields
- Detail view modal plus one display
- Status column plus one info

#### 4. `/src/app/rsvp/page.tsx`
Remove:
- `plus_ones: number` field
- Confirmation display `+ ${guest.plus_ones} acompanhante(s)`
- "Quantos acompanhantes?" input
- Bulk confirm plus ones parameter

#### 5. `/src/app/materiais/page.tsx`
Remove:
- Seating chart plus one display

### Priority 5: Page Routes

#### 1. `/src/app/convite/[code]/page.tsx`
Remove from query and display:
- `plus_one_allowed`
- `plus_one_name`
- Display `(+ {guest.plus_one_name})`

---

## Automated Removal Strategy

Given the scope (38 remaining files), consider using find/replace across project:

### Safe Find/Replace Operations

1. **Remove plus_one_allowed from Supabase queries:**
```bash
# Find
plus_one_allowed,?

# Replace with
(nothing - remove the line)
```

2. **Remove plus_one_name from Supabase queries:**
```bash
# Find
plus_one_name,?

# Replace with
(nothing - remove the line)
```

3. **Remove plus_one display conditionals:**
```bash
# Search pattern
{.*plus_one.*}

# Review each case individually for safe removal
```

4. **Remove plus_ones integer field:**
```bash
# Find
plus_ones

# Review and remove from relevant contexts
```

---

## Testing Checklist

After all removals:

- [ ] TypeScript builds without errors (`npm run type-check`)
- [ ] ESLint passes (`npm run lint`)
- [ ] RSVP form works (submit without plus one)
- [ ] Guest list displays correctly (no plus one columns)
- [ ] Analytics dashboard shows accurate counts
- [ ] Seating chart displays properly (no plus one names)
- [ ] Admin invitation CRUD works (no plus one fields)
- [ ] Email templates send successfully (no plus one refs)
- [ ] API routes function (no plus one parameters)
- [ ] Personalized invitations work (`/convite/[code]`)

---

## Migration Execution

When ready to apply database migration:

```bash
# For local Supabase
npx supabase db reset --local

# For production (use with caution!)
# First backup, then:
npm run migrate:prod -- 027
```

---

## Estimated Effort

- **Service Layer**: 2 hours (6 files, complex logic)
- **API Routes**: 30 minutes (1 file)
- **UI Components**: 2 hours (7 files, various displays)
- **Admin Pages**: 3 hours (5 files, large and complex)
- **Page Routes**: 1 hour (1 main file)
- **Testing**: 1.5 hours (comprehensive verification)

**Total**: ~10 hours for complete, tested implementation

---

## Quick Command Reference

```bash
# Find all remaining plus_one references
grep -r "plus_one" src/ --exclude-dir=node_modules

# Find plusOne camelCase references
grep -r "plusOne" src/ --exclude-dir=node_modules

# Count remaining occurrences
grep -r "plus_one\|plusOne" src/ --exclude-dir=node_modules | wc -l

# TypeScript check
npm run type-check

# Lint check
npm run lint
```

---

## Next Session Continuation

To resume this work efficiently:

1. Start with **Service Layer** (Priority 1) - Most critical for functionality
2. Then **API Routes** (Priority 2) - Ensures backend works
3. Follow with **UI Components** (Priority 3) - User-facing fixes
4. Complete **Admin Pages** (Priority 4) - Internal tools
5. Finish with **Page Routes** (Priority 5) - Final touches
6. Run full **Testing Checklist**

The migration file and type definitions are ready - remaining work is removing references from service/UI layers.
