# Thousand Days of Love - Code Cleanup Opportunities

**Generated:** 2025-10-25
**Project Status:** Production wedding website with comprehensive features

## Executive Summary

This report identifies unused code, dependencies, scripts, and documentation that can be safely removed to reduce repository size and improve maintainability. The analysis covers:

- **Current Size:** ~4.3MB of code/docs (excluding node_modules)
  - `src/components`: 1.3MB
  - `docs`: 1.4MB (83 files total, 28 archived)
  - `src/app`: 788KB
  - `src/lib`: 448KB
  - `scripts`: 352KB

- **Estimated Cleanup Potential:** ~800KB-1.2MB reduction possible

---

## 1. UNUSED DEPENDENCIES (High Priority)

### Can Be Removed Immediately

**`date-fns-tz`** (Unused)
- **Status:** ❌ Not imported anywhere in codebase
- **Action:** Remove from package.json
- **Command:** `npm uninstall date-fns-tz`
- **Savings:** ~50KB

**`countup.js`** (Minimal Usage)
- **Status:** ⚠️ Used in only 2 files (AnimatedDayNumber.tsx, SocialProofStats.tsx)
- **Alternative:** Could be replaced with native CSS animations or framer-motion
- **Current Size:** ~12KB
- **Action:** Consider removing if animation complexity can be reduced
- **Files to refactor:**
  - `src/components/timeline/AnimatedDayNumber.tsx`
  - `src/components/invitations/SocialProofStats.tsx`

### Missing Dependencies (Add or Clean Up)

**`@sanity/ui`** (Missing)
- **Status:** Required by `src/sanity/components/DayRangeInput.tsx`
- **Action:** Either add to package.json or refactor component

**`@heroicons/react`** (Missing)
- **Status:** Required by `src/components/gifts/GiftContributionCard.tsx`
- **Action:** Switch to lucide-react (already installed) or add package

**`axios`** (Missing)
- **Status:** Used in `scripts/populate-gifts.ts` (one-time script)
- **Action:** Use native fetch() API or mark as devDependency

**`pg`** (Missing)
- **Status:** Used in `test-payment-flow.mjs` (development only)
- **Action:** Add to devDependencies or remove test file

---

## 2. UNUSED COMPONENTS (Medium Priority)

### UI Components - Candidates for Removal

**`src/components/ui/MilestoneCounter.tsx`**
- **Status:** ❌ No imports found
- **Created:** Likely for milestone celebrations
- **Action:** Remove if not needed for wedding day features

**`src/components/ui/ScrollProgress.tsx`**
- **Status:** ⚠️ Self-import only (component imports itself for example)
- **Action:** Remove if no actual usage in pages

**`src/components/ui/RadioGroup.tsx`**
- **Status:** ✅ Used in `RsvpForm.tsx`
- **Action:** Keep (actively used)

### Section Components - Legacy/Unused

**`src/components/sections/EmotionalJourneyMap.tsx`**
- **Status:** ⚠️ Used in homepage but may be redundant
- **Action:** Review if this overlaps with timeline features

**`src/components/sections/ElegantInvitation.tsx`**
- **Status:** ✅ Used in RSVP page and personalized invitations
- **Action:** Keep (core feature)

**`src/components/sections/InvitationCTASection.tsx`**
- **Status:** ✅ Used in homepage
- **Action:** Keep (core feature)

---

## 3. UTILITY FILES & SERVICES (Medium Priority)

### Archived Services (Already Moved)

**`src/lib/services/archive/enhanced-guests.ts`**
- **Status:** ✅ Already archived (850 lines)
- **Action:** Keep in archive for reference, already moved

### Utilities - Potentially Unused

**`src/lib/utils/giftMessages.ts` & `src/lib/utils/giftMessaging.ts`**
- **Status:** ⚠️ Only used in gift components (4 files)
- **Action:** Review if both files are needed or if they should be consolidated

**`src/lib/utils/whimsy.ts`**
- **Status:** ⚠️ Minimal usage (found in 2 docs files, not in source)
- **Action:** Remove if not actively enhancing UX

**`src/lib/utils/soundManager.ts`**
- **Status:** ✅ Used in live feed features (3 components)
- **Action:** Keep (active feature for wedding day)

**`src/lib/supabase/photo-interactions.ts`**
- **Status:** ✅ Used in gallery features (3 components)
- **Action:** Keep (active feature)

---

## 4. SCRIPTS & UTILITIES (High Priority)

### Root-Level Test Files (Can Be Deleted)

These are temporary test files that should be in a `tests/` directory or removed:

```
test-admin.mjs                (4KB)
test-complete-flow.mjs        (5KB)
test-complete.mjs             (9KB)
test-gift-migration.mjs       (6KB)
test-messages.mjs             (8KB)
test-payment-flow.mjs         (6KB)
```

**Total Savings:** ~38KB
**Action:** Delete all `test-*.mjs` files from root directory

### Root-Level Documentation (Can Be Archived or Deleted)

These are session notes that should be in `docs/archive/`:

```
CODE_POLISH_COMPLETE.md
FINAL_MIGRATION_CLEANUP.md
PRODUCTION_MERCADO_PAGO_DEBUG.md
PRODUCTION_ISSUE_RESOLUTION.md
TESTING_GUIDE_PHASE_4_5.md
MERCADO_PAGO_COMPARISON.md
MEDIA_UPLOAD_FIX.md
APPLY_MIGRATION.md
AUTO_APPROVAL_SUMMARY.md
```

**Total Savings:** ~60-80KB
**Action:** Move to `docs/archive/` or delete if redundant

### Package.json Scripts - Unused/Redundant

**Potentially Unused Scripts:**

```json
"dev:webpack": "next dev"              // Using turbopack by default now
"build:turbo": "next build --turbopack" // Same as regular build
"sanity:studio": "open http://localhost:3001/studio" // Studio runs on same port as app
```

**Migration Scripts (One-Time Use):**

These can be removed after confirming migrations are complete:

```json
"migrate:to-sanity": "tsx scripts/migration/migrate-to-sanity.ts"
"migrate:timeline": "tsx scripts/migrate-timeline-to-sanity.ts"
"migrate:recalculate-days": "tsx scripts/recalculate-day-numbers.ts"
"setup:story-preview": "tsx scripts/setup-story-preview.ts"
"migrate:prod": "tsx scripts/apply-migration-to-prod.ts"
"sanity:populate-gifts": "tsx scripts/populate-gifts-sections.ts"
```

**Test Scripts:**
```json
"test:e2e": "playwright test"           // Playwright installed but no tests written
"test:e2e:headed": "playwright test --headed"
"test:e2e:debug": "playwright test --debug"
"test:e2e:report": "playwright show-report"
"test:e2e:ui": "playwright test --ui"
```

**Action:** Remove Playwright if no E2E tests planned, saves ~15MB in node_modules

---

## 5. DOCUMENTATION CLEANUP (Medium Priority)

### Duplicate/Redundant Documentation

**COUNTUP Documentation (5 Files, 41KB):**
```
docs/COUNTUP_IMPLEMENTATION.md
docs/COUNTUP_QUICK_REFERENCE.md
docs/COUNTUP_README.md
docs/COUNTUP_SUMMARY.md
docs/COUNTUP_VISUAL_EXAMPLES.md
```

**Status:** CountUp.js is barely used (2 files)
**Action:** Consolidate into single doc or remove if planning to remove countup.js

**Cleanup/Migration Docs:**
```
docs/CLEANUP_SUMMARY.md
docs/DATABASE_CLEANUP_PLAN.md
FINAL_MIGRATION_CLEANUP.md (root level)
```

**Action:** Archive completed cleanup docs, keep as historical reference

### Archived Documentation

**Current Archive:** 28 files in `docs/archive/`
**Action:** Review and potentially compress older session notes into quarterly summaries

---

## 6. SANITY SCHEMAS (Low Priority)

### Potentially Unused Schemas

**`weddingTimelineEvent`**
- **Status:** ⚠️ Found in schema index and 1 doc file
- **Action:** Verify if this is still used vs `storyMoment`/`storyPhase` system

**`featureCard`**
- **Status:** ⚠️ Found in schema index and 2 doc files
- **Action:** Verify usage in Sanity CMS

**All Schemas:** 11 document schemas + 14 section/global schemas = 25 total
**Action:** Run `sanity typegen generate` and check for unused types

---

## CLEANUP ACTION PLAN

### Phase 1: Quick Wins (Immediate, ~100KB savings)

1. **Remove unused npm dependencies:**
   ```bash
   npm uninstall date-fns-tz
   ```

2. **Delete root-level test files:**
   ```bash
   rm test-*.mjs
   ```

3. **Move root-level docs to archive:**
   ```bash
   mkdir -p docs/archive/2025-10
   mv *.md docs/archive/2025-10/ (except README.md, CLAUDE.md)
   ```

4. **Clean package.json scripts:**
   - Remove `dev:webpack`, `build:turbo`, `sanity:studio`
   - Remove all migration scripts (after confirming migrations complete)

### Phase 2: Component Cleanup (~200-400KB savings)

1. **Remove unused UI components:**
   ```bash
   # After confirming no usage:
   rm src/components/ui/MilestoneCounter.tsx
   rm src/components/ui/ScrollProgress.tsx  # if confirmed unused
   ```

2. **Consider removing countup.js:**
   - Refactor AnimatedDayNumber.tsx to use framer-motion
   - Refactor SocialProofStats.tsx to use CSS animations
   - `npm uninstall countup.js`

3. **Add missing dependencies or refactor:**
   ```bash
   # Option A: Add missing deps
   npm install @heroicons/react @sanity/ui

   # Option B: Refactor to use existing alternatives
   # - Switch to lucide-react instead of @heroicons
   # - Refactor DayRangeInput to use native Sanity components
   ```

### Phase 3: Documentation Consolidation (~500KB savings)

1. **Consolidate COUNTUP docs:**
   - Merge into single `docs/COUNTUP_GUIDE.md`
   - Delete redundant files

2. **Archive cleanup/migration docs:**
   ```bash
   mv docs/CLEANUP_SUMMARY.md docs/archive/
   mv docs/DATABASE_CLEANUP_PLAN.md docs/archive/
   ```

3. **Compress archive:**
   - Consider creating quarterly summaries
   - Delete extremely redundant docs

### Phase 4: Optional - E2E Testing Decision

**If NO E2E tests planned:**
```bash
npm uninstall @playwright/test playwright
rm -rf tests/  # if exists
# Remove all test:e2e:* scripts from package.json
```

**Savings:** ~15MB in node_modules, ~10KB in package.json

**If E2E tests ARE planned:**
- Keep Playwright
- Write actual tests before wedding day
- Test critical flows: RSVP, payments, photo upload

---

## ESTIMATED TOTAL SAVINGS

| Category | Savings (KB) | Difficulty |
|----------|-------------|------------|
| NPM Dependencies | 50-60 | Easy |
| Root Test Files | 38 | Easy |
| Root Doc Files | 60-80 | Easy |
| Package.json Scripts | 5-10 | Easy |
| **Phase 1 Total** | **153-188** | **Easy** |
| Unused Components | 50-100 | Medium |
| CountUp Refactor | 12 | Medium |
| Utility Consolidation | 20-50 | Medium |
| **Phase 2 Total** | **82-162** | **Medium** |
| Doc Consolidation | 300-500 | Medium |
| Archive Compression | 200-400 | Low |
| **Phase 3 Total** | **500-900** | **Medium** |
| Playwright Removal | 15,000 | Easy |
| **GRAND TOTAL** | **735-1,250KB** | **(or 15MB if removing Playwright)** |

---

## RECOMMENDATIONS

### High Priority (Do Now)
1. ✅ Remove `date-fns-tz` dependency
2. ✅ Delete all `test-*.mjs` files from root
3. ✅ Move root-level `.md` files to `docs/archive/`
4. ✅ Clean up package.json scripts (migrations, redundant build commands)

### Medium Priority (Before Wedding)
1. ⚠️ Decide on Playwright - keep or remove
2. ⚠️ Consolidate COUNTUP documentation
3. ⚠️ Remove unused UI components (MilestoneCounter, etc.)
4. ⚠️ Fix missing dependencies (@heroicons/react, @sanity/ui)

### Low Priority (Post-Wedding)
1. 📝 Archive old session documentation
2. 📝 Consider removing countup.js and using framer-motion
3. 📝 Review and consolidate gift messaging utilities
4. 📝 Audit Sanity schemas for unused types

---

## SAFETY NOTES

### Before Deleting Anything:

1. **Commit current state:**
   ```bash
   git add -A
   git commit -m "chore: pre-cleanup snapshot"
   ```

2. **Create cleanup branch:**
   ```bash
   git checkout -b chore/code-cleanup
   ```

3. **Test after each phase:**
   ```bash
   npm run build
   npm run type-check
   npm run lint
   ```

4. **Keep archive directory:**
   - Don't delete `src/lib/services/archive/` - contains useful reference code
   - Don't delete `docs/archive/` - historical context is valuable

### Files to NEVER Delete:

- ✅ `CLAUDE.md` (project configuration)
- ✅ `README.md` (project overview)
- ✅ `src/lib/services/archive/` (already properly archived code)
- ✅ `docs/GUEST_EXPERIENCE_ROADMAP.md` (active roadmap)
- ✅ Any file actively imported in `src/app` or `src/components`

---

## NEXT STEPS

Ready to start cleanup? Run:

```bash
# Create cleanup branch
git checkout -b chore/code-cleanup

# Phase 1 cleanup script
npm uninstall date-fns-tz
rm test-*.mjs
mkdir -p docs/archive/2025-10-cleanup
mv CODE_POLISH_COMPLETE.md FINAL_MIGRATION_CLEANUP.md docs/archive/2025-10-cleanup/
# ... move other root .md files

# Test everything still works
npm run build
npm run type-check

# Commit cleanup
git add -A
git commit -m "chore: phase 1 cleanup - remove unused deps and test files"
```

---

**Generated by:** Claude Code Cleanup Analysis
**Next Review:** Before wedding day (2025-11-20)
