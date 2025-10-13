# Documentation Cleanup Plan
**Created**: 2025-10-13
**Status**: Ready for Execution

## Overview
Transform `/docs` from 76 files into a clean, organized documentation structure where every file follows naming conventions and serves a clear purpose.

---

## Current State Assessment

### Total Files
- **76 markdown files** across docs/ and docs/archive/
- **28 files in archive/** (mix of dated and undated)
- **48 files in docs/** (mix of formats)

### Naming Issues
- ❌ Only 17 files follow YYYY-MM-DD format
- ❌ 59 files use UPPERCASE_WITH_UNDERSCORES
- ❌ Inconsistent naming patterns
- ❌ Creation dates don't match content dates

---

## Cleanup Strategy

### Phase 1: Consolidation & Deletion
**Goal**: Remove redundancy, merge similar docs

#### Files to DELETE (Obsolete/Duplicate)
1. **Multiple READMEs** (3 → 1)
   - DELETE: `README_DOCS.md` (outdated gallery migration info)
   - DELETE: `README_RSVP_RESEARCH.md` (combine into main README)
   - KEEP: `README.md` (main index) - update comprehensively

2. **Sanity Documentation** (8 → 2)
   - DELETE: `SANITY_DOCUMENTATION_SUMMARY.md` (meta doc)
   - DELETE: `SANITY_EXECUTIVE_SUMMARY.md` (superseded)
   - DELETE: `SANITY_MIGRATION_PLAN.md` (superseded)
   - DELETE: `SANITY_VISUAL_GUIDE.md` (obsolete)
   - DELETE: `SANITY_QUICK_REFERENCE.md` (consolidated)
   - KEEP: `SANITY_ARCHITECTURE.md` (technical reference)
   - CONSOLIDATE INTO: New `2025-10-11-sanity-cms-guide.md`

3. **CMS Consolidation Docs** (4 → 1)
   - DELETE: `MIGRATION_SUMMARY.md` (redundant with plan)
   - DELETE: `ARCHITECTURE_COMPARISON.md` (merge into plan)
   - DELETE: `QUICK_START_MIGRATION.md` (merge into plan)
   - KEEP: `CMS_CONSOLIDATION_PLAN.md` (comprehensive)

4. **CMS Restructure Docs** (5 → 2)
   - DELETE: `CMS_RESTRUCTURE_EXECUTIVE_SUMMARY.md` (merge)
   - DELETE: `SANITY_CMS_BEFORE_AFTER_COMPARISON.md` (merge)
   - KEEP: `SANITY_CMS_RESTRUCTURE_PLAN.md` (technical)
   - KEEP: `SANITY_CMS_USER_GUIDE.md` (end-user)

5. **RSVP Research** (5 → 1)
   - CONSOLIDATE ALL 5 FILES INTO: `2025-10-12-rsvp-ux-enhancement-guide.md`
   - Source files:
     - RSVP_UX_RESEARCH_REPORT.md
     - RSVP_REDESIGN_CONCEPTS.md
     - RSVP_QUICK_WINS_IMPLEMENTATION.md
     - RSVP_VISUAL_REFERENCE.md
     - RSVP_RESEARCH_SUMMARY.md

6. **Archive Cleanup** (28 → 5)
   - DELETE all undated session summaries
   - DELETE duplicate transformation/roadmap docs
   - KEEP only significant milestone docs

---

## Phase 2: Rename All Remaining Files

### Naming Convention
Format: `YYYY-MM-DD-kebab-case-name.md`

### Files to Rename

#### Main Documentation (docs/)

**Sanity CMS**
- `SANITY_ARCHITECTURE.md` → `2025-10-11-sanity-architecture.md`
- `SANITY_CMS_RESTRUCTURE_PLAN.md` → `2025-10-12-sanity-cms-restructure-plan.md`
- `SANITY_CMS_USER_GUIDE.md` → `2025-10-12-sanity-cms-user-guide.md`
- `SANITY_IMPLEMENTATION_GUIDE.md` → `2025-10-12-sanity-implementation-guide.md`

**CMS Consolidation**
- `CMS_CONSOLIDATION_PLAN.md` → `2025-10-12-cms-consolidation-plan.md`

**Timeline**
- `TIMELINE_MIGRATION_GUIDE.md` → `2025-10-12-timeline-migration-guide.md`

**Implementation**
- `IMPLEMENTATION_CHECKLIST.md` → `2025-10-12-implementation-checklist.md`

**Already Correct**
- ✅ `2025-10-12-sanity-migration-complete.md` (correct)

---

## Phase 3: Archive Organization

### New Archive Structure
```
archive/
├── 2025-10-10/
│   └── 2025-10-10-mobile-menu-ux-analysis.md
├── 2025-10-11/
│   ├── 2025-10-11-design-audit-report.md
│   ├── 2025-10-11-voice-transformation.md
│   └── 2025-10-11-sanity-setup-complete.md
└── 2025-10-12/
    ├── 2025-10-12-gallery-migration-summary.md
    ├── 2025-10-12-cleanup-summary.md
    └── 2025-10-12-responsive-100vh-complete.md
```

### Archive Retention Strategy
**KEEP** (Historical Value):
- Project status snapshots
- Major migration completions
- Significant architecture changes
- UX analysis reports

**DELETE** (Low Value):
- Session handoffs
- Duplicate summaries
- Intermediate planning docs
- Superseded guides

---

## Final Structure

### docs/ (Main Documentation)
```
docs/
├── README.md                                          ← Master index
│
├── CMS & Architecture (2025-10-11 to 2025-10-12)
│   ├── 2025-10-11-sanity-architecture.md
│   ├── 2025-10-12-cms-consolidation-plan.md
│   ├── 2025-10-12-sanity-cms-restructure-plan.md
│   ├── 2025-10-12-sanity-cms-user-guide.md
│   ├── 2025-10-12-sanity-implementation-guide.md
│   └── 2025-10-12-sanity-migration-complete.md
│
├── Feature Implementation (2025-10-12)
│   ├── 2025-10-12-timeline-migration-guide.md
│   ├── 2025-10-12-rsvp-ux-enhancement-guide.md       ← NEW (5 files → 1)
│   └── 2025-10-12-implementation-checklist.md
│
└── archive/                                           ← Organized by date
    ├── 2025-10-10/                                    ← 1 file
    ├── 2025-10-11/                                    ← 3 files
    └── 2025-10-12/                                    ← 6 files
```

**Total Files**: ~20 (from 76)
**Reduction**: 74% smaller
**Organization**: Perfect

---

## Consolidation Details

### NEW: 2025-10-12-rsvp-ux-enhancement-guide.md

**Consolidates 5 Files Into 1**:
1. RSVP_UX_RESEARCH_REPORT.md (research)
2. RSVP_REDESIGN_CONCEPTS.md (concepts)
3. RSVP_QUICK_WINS_IMPLEMENTATION.md (code)
4. RSVP_VISUAL_REFERENCE.md (design)
5. RSVP_RESEARCH_SUMMARY.md (summary)

**Structure**:
```markdown
# RSVP UX Enhancement Guide
Created: 2025-10-12

## Part 1: Executive Summary
(from RSVP_RESEARCH_SUMMARY.md)

## Part 2: UX Research & Analysis
(from RSVP_UX_RESEARCH_REPORT.md)

## Part 3: Design Concepts
(from RSVP_REDESIGN_CONCEPTS.md)

## Part 4: Implementation Guide
(from RSVP_QUICK_WINS_IMPLEMENTATION.md)

## Part 5: Visual Reference
(from RSVP_VISUAL_REFERENCE.md)
```

### NEW: 2025-10-11-sanity-cms-guide.md

**Consolidates**:
- SANITY_EXECUTIVE_SUMMARY.md
- SANITY_MIGRATION_PLAN.md
- SANITY_QUICK_REFERENCE.md
- SANITY_DOCUMENTATION_SUMMARY.md

---

## Archive Files to Keep

### 2025-10-10/ (1 file)
- `2025-10-10-mobile-menu-ux-analysis.md`

### 2025-10-11/ (3 files)
- `2025-10-11-design-audit-report.md`
- `2025-10-11-voice-transformation-summary.md` (consolidate voice docs)
- `2025-10-11-sanity-setup-complete.md`

### 2025-10-12/ (6 files)
- `2025-10-12-project-status.md`
- `2025-10-12-cleanup-summary.md`
- `2025-10-12-gallery-migration-summary.md`
- `2025-10-12-responsive-100vh-complete.md`
- `2025-10-12-schema-audit-report.md`
- `2025-10-12-phase-1-findings.md`

**Total Archive**: 10 files (organized by date)

---

## Files to DELETE Completely

### From docs/
1. README_DOCS.md
2. README_RSVP_RESEARCH.md
3. SANITY_DOCUMENTATION_SUMMARY.md
4. SANITY_EXECUTIVE_SUMMARY.md
5. SANITY_MIGRATION_PLAN.md
6. SANITY_VISUAL_GUIDE.md
7. SANITY_QUICK_REFERENCE.md
8. MIGRATION_SUMMARY.md
9. ARCHITECTURE_COMPARISON.md
10. QUICK_START_MIGRATION.md
11. CMS_RESTRUCTURE_EXECUTIVE_SUMMARY.md
12. SANITY_CMS_BEFORE_AFTER_COMPARISON.md
13. RSVP_UX_RESEARCH_REPORT.md (→ consolidated)
14. RSVP_REDESIGN_CONCEPTS.md (→ consolidated)
15. RSVP_QUICK_WINS_IMPLEMENTATION.md (→ consolidated)
16. RSVP_VISUAL_REFERENCE.md (→ consolidated)
17. RSVP_RESEARCH_SUMMARY.md (→ consolidated)

### From archive/ (18 files)
1. MOBILE_MENU_UX_ANALYSIS.md (→ rename & keep)
2. CSS_ARCHITECTURE_ANALYSIS.md (obsolete)
3. FRONTEND_ARCHITECTURE_ASSESSMENT.md (obsolete)
4. DESIGN_AUDIT_REPORT.md (→ rename & keep)
5. VOICE_REWRITES.md (consolidate)
6. IMPLEMENTATION_GUIDE.md (superseded)
7. VOICE_TRANSFORMATION_SUMMARY.md (consolidate)
8. QUICK_REFERENCE.md (obsolete)
9. COPY_TRANSFORMATION_SUMMARY.md (consolidate)
10. UI_TRANSFORMATION_PROMPT.md (obsolete)
11. VISUAL_TRANSFORMATION_PROMPT.md (obsolete)
12. OPTION_2_IMAGE_HERO.md (obsolete)
13. HOMEPAGE_HERO_TRANSFORMATION_SUMMARY.md (obsolete)
14. CONTENT_MEDIA_STRATEGY.md (obsolete)
15. IA_AUDIT_AND_RECOMMENDATIONS.md (obsolete)
16. COMPLETE_TRANSFORMATION_ROADMAP.md (obsolete)
17. HERO_SETUP_GUIDE.md (obsolete)
18. MOCK_CONTENT_GUIDE.md (obsolete)
19. SESSION_SUMMARY.md (obsolete)
20. SESSION_HANDOFF.md (obsolete)
21. IMAGE_MANAGEMENT_COMPLETE.md (obsolete)
22. CURRENT_STATUS_UPDATE.md (superseded)
23. ROADMAP_STATUS.md (superseded)
24. IMPLEMENTATION_ROADMAP.md (superseded)
25. HANDOFF_NEXT_SESSION.md (obsolete)
26. ADMIN_CMS_INTEGRATION_HANDOFF.md (obsolete)
27. SECTION_SCHEMAS_SUMMARY.md (superseded)
28. SANITY_SETUP_COMPLETE.md (→ rename & keep)
29. HERO_FIX_SUMMARY.md (obsolete)
30. ADMIN_CLEANUP_PLAN.md (completed)
31. SCHEMA_AUDIT_REPORT.md (→ rename & keep)
32. PHASE_1_FINDINGS_AND_NEXT_STEPS.md (→ rename & keep)
33. 2025-10-12-gallery-migration-guide.md (superseded by summary)
34. 2025-10-12-sanity-cms-ux-analysis.md (merged into plan)
35. 2025-10-12-gallery-to-sanity-prompt.md (obsolete)
36. 2025-10-12-quick-fix-guide.md (obsolete)
37. 2025-10-12-gallery-sanity-ready.md (obsolete)
38. 2025-10-12-ready-to-upload.md (obsolete)
39. 2025-10-12-implementation-complete.md (keep migration summary)
40. 2025-10-12-migration-guide.md (superseded)
41. 2025-10-12-bulk-upload-guide.md (obsolete)
42. 2025-10-12-story-preview-theatrical-reveal.md (experimental)
43. 2025-10-12-story-preview-timeline-redesign.md (experimental)
44. 2025-10-12-responsive-100vh-implementation-summary.md (duplicate)
45. UI_LAYOUT_SPECIFICATIONS.md (obsolete)
46. OPTION_3_HYBRID_HERO.md (obsolete)
47. OPTION_1_VIDEO_HERO.md (obsolete)

---

## Execution Steps

### Step 1: Create Consolidated Files
```bash
# Create new consolidated RSVP guide
touch /Users/helrabelo/code/personal/thousanddaysoflove/docs/2025-10-12-rsvp-ux-enhancement-guide.md

# Create new consolidated Sanity guide
touch /Users/helrabelo/code/personal/thousanddaysoflove/docs/2025-10-11-sanity-cms-guide.md
```

### Step 2: Rename Files (Main Docs)
```bash
cd /Users/helrabelo/code/personal/thousanddaysoflove/docs

# Sanity files
mv SANITY_ARCHITECTURE.md 2025-10-11-sanity-architecture.md
mv SANITY_CMS_RESTRUCTURE_PLAN.md 2025-10-12-sanity-cms-restructure-plan.md
mv SANITY_CMS_USER_GUIDE.md 2025-10-12-sanity-cms-user-guide.md
mv SANITY_IMPLEMENTATION_GUIDE.md 2025-10-12-sanity-implementation-guide.md

# CMS Consolidation
mv CMS_CONSOLIDATION_PLAN.md 2025-10-12-cms-consolidation-plan.md

# Implementation
mv TIMELINE_MIGRATION_GUIDE.md 2025-10-12-timeline-migration-guide.md
mv IMPLEMENTATION_CHECKLIST.md 2025-10-12-implementation-checklist.md
```

### Step 3: Organize Archive
```bash
cd /Users/helrabelo/code/personal/thousanddaysoflove/docs/archive

# Create date folders
mkdir -p 2025-10-10 2025-10-11 2025-10-12

# Move and rename 2025-10-10 files
mv MOBILE_MENU_UX_ANALYSIS.md 2025-10-10/2025-10-10-mobile-menu-ux-analysis.md

# Move and rename 2025-10-11 files
mv DESIGN_AUDIT_REPORT.md 2025-10-11/2025-10-11-design-audit-report.md
# (create voice consolidation)
mv SANITY_SETUP_COMPLETE.md 2025-10-11/2025-10-11-sanity-setup-complete.md

# Move 2025-10-12 files
mv 2025-10-12-project-status.md 2025-10-12/
mv 2025-10-12-cleanup-summary.md 2025-10-12/
mv 2025-10-12-gallery-migration-summary.md 2025-10-12/
mv 2025-10-12-responsive-100vh-complete.md 2025-10-12/
mv SCHEMA_AUDIT_REPORT.md 2025-10-12/2025-10-12-schema-audit-report.md
mv PHASE_1_FINDINGS_AND_NEXT_STEPS.md 2025-10-12/2025-10-12-phase-1-findings.md
```

### Step 4: Delete Obsolete Files
```bash
# Delete from docs/
cd /Users/helrabelo/code/personal/thousanddaysoflove/docs
rm README_DOCS.md README_RSVP_RESEARCH.md
rm SANITY_DOCUMENTATION_SUMMARY.md SANITY_EXECUTIVE_SUMMARY.md
rm SANITY_MIGRATION_PLAN.md SANITY_VISUAL_GUIDE.md SANITY_QUICK_REFERENCE.md
rm MIGRATION_SUMMARY.md ARCHITECTURE_COMPARISON.md QUICK_START_MIGRATION.md
rm CMS_RESTRUCTURE_EXECUTIVE_SUMMARY.md SANITY_CMS_BEFORE_AFTER_COMPARISON.md
rm RSVP_UX_RESEARCH_REPORT.md RSVP_REDESIGN_CONCEPTS.md
rm RSVP_QUICK_WINS_IMPLEMENTATION.md RSVP_VISUAL_REFERENCE.md RSVP_RESEARCH_SUMMARY.md

# Delete from archive/ (all obsolete files)
cd archive
rm CSS_ARCHITECTURE_ANALYSIS.md FRONTEND_ARCHITECTURE_ASSESSMENT.md
rm VOICE_REWRITES.md IMPLEMENTATION_GUIDE.md QUICK_REFERENCE.md
# ... (continue with full list)
```

### Step 5: Update README.md
```bash
# Rewrite main README to reflect new structure
```

---

## Success Criteria

### After Cleanup
- ✅ All files follow YYYY-MM-DD-kebab-case.md format
- ✅ Main docs/ has 12-15 essential files
- ✅ Archive has 10 files organized by date
- ✅ Total reduction: ~75% (76 → ~20)
- ✅ Zero redundancy
- ✅ README.md is comprehensive index
- ✅ Every file serves clear purpose
- ✅ Easy to find any information
- ✅ Maintainable structure

---

## Timeline

**Total Time**: 2-3 hours

1. **Create consolidated files** (30 min)
2. **Rename main docs** (15 min)
3. **Organize archive** (30 min)
4. **Delete obsolete files** (15 min)
5. **Update README** (45 min)
6. **Verify & test** (15 min)
7. **Git commit** (10 min)

---

## Next Steps

1. Review this plan
2. Approve consolidation strategy
3. Execute step-by-step
4. Verify all links work
5. Update project CLAUDE.md
6. Commit with message: `docs: complete documentation cleanup and consolidation`

---

**Result**: Spotless documentation structure you could eat off of! 🧹✨
