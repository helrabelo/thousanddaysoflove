# CMS Restructure Implementation Checklist

## Pre-Implementation

### Planning & Backup
- [ ] Review `SANITY_CMS_RESTRUCTURE_PLAN.md`
- [ ] Review `SANITY_CMS_BEFORE_AFTER_COMPARISON.md`
- [ ] Backup Sanity dataset
  ```bash
  npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz
  ```
- [ ] Create feature branch
  ```bash
  git checkout -b feature/story-content-restructure
  ```
- [ ] Document current content count
  - Story Cards: ___
  - Timeline Events: ___
  - Phases: ___

---

## Phase 1: Schema Creation (2 hours)

### New Document: Story Phase
- [ ] Create `/src/sanity/schemas/documents/storyPhase.ts`
- [ ] Add fields: id, title, dayRange, subtitle, displayOrder, isVisible
- [ ] Add icon (Layers)
- [ ] Add orderings (displayOrder)
- [ ] Add preview with order number
- [ ] Test: Create draft phase in Studio

### Updated Document: Story Moment
- [ ] Rename `/src/sanity/schemas/documents/storyCard.ts` → `storyMoment.ts`
- [ ] Update schema name: `storyCard` → `storyMoment`
- [ ] Update title: `Story Cards` → `Momento da História`
- [ ] Change date field: `string` → `date` type
- [ ] Add video field (file, optional)
- [ ] Add phase field (reference to storyPhase)
- [ ] Add contentAlign field (left/right)
- [ ] Add showInPreview field (boolean)
- [ ] Add showInTimeline field (boolean)
- [ ] Update preview with badges
- [ ] Add orderings: dayNumber, date, phaseOrder
- [ ] Test: Create draft moment in Studio

### Update Schema Registry
- [ ] Update `/src/sanity/schemas/documents/index.ts`
  ```typescript
  import storyMoment from './storyMoment'  // renamed
  import storyPhase from './storyPhase'    // new

  export const documentSchemas = [
    featureCard,
    pet,
    storyMoment,    // renamed
    storyPhase,     // new
    weddingSettings,
    galleryImage,
  ]
  ```
- [ ] Test: Run `npm run dev`, check for TypeScript errors

---

## Phase 2: Update Sections (30 min)

### Story Preview Section
- [ ] Open `/src/sanity/schemas/sections/storyPreview.ts`
- [ ] Rename field: `storyCards` → `storyMoments`
- [ ] Update reference: `type: 'storyCard'` → `type: 'storyMoment'`
- [ ] Add filter: `showInPreview == true && isVisible == true`
- [ ] Update preview text
- [ ] Test: Check section in Studio

---

## Phase 3: Update Timeline Page (1 hour)

### Timeline Page Schema
- [ ] Open `/src/sanity/schemas/pages/timelinePage.ts`
- [ ] Replace inline `phases` array with new structure:
  ```typescript
  phases: [
    {
      phase: reference(storyPhase),
      moments: [reference(storyMoment)]
    }
  ]
  ```
- [ ] Remove inline event fields
- [ ] Add filter for moments: `showInTimeline == true`
- [ ] Update preview calculations
- [ ] Test: Open timeline page in Studio

---

## Phase 4: Update Desk Structure (1 hour)

### Reorganize Sidebar
- [ ] Open `/src/sanity/desk/index.ts`
- [ ] Replace "Nossa História (Timeline)" with expanded group:
  ```typescript
  S.listItem()
    .title('Nossa História')
    .icon(Clock)
    .child(S.list().title('Nossa História').items([
      // Page Configuration
      S.listItem()
        .title('⚙️ Configurar Página')
        .child(S.document().schemaType('timelinePage')...),

      S.divider(),

      // Story Phases
      S.listItem()
        .title('📚 Fases da História')
        .child(S.documentTypeList('storyPhase')...),

      // Story Moments
      S.listItem()
        .title('❤️ Momentos da História')
        .child(S.documentTypeList('storyMoment')...),
    ]))
  ```
- [ ] Remove "Story Cards" from "Conteúdo" section
- [ ] Update imports if needed
- [ ] Test: Restart Studio, verify new structure

### Verify Desk Structure
- [ ] Navigate: Páginas > Nossa História
- [ ] See: 3 sub-items (Configurar, Fases, Momentos)
- [ ] Navigate: Conteúdo
- [ ] Verify: No "Story Cards" section
- [ ] Check: All other sections still work

---

## Phase 5: Data Migration (1 hour)

### Create Migration Script
- [ ] Create `/scripts/migrate-story-content.ts`
- [ ] Install dependencies: `npm install @sanity/client dotenv`
- [ ] Add Sanity client configuration
- [ ] Create default phases (3 suggested):
  - Phase 1: "Os Primeiros Dias" (Dia 1-100)
  - Phase 2: "Construindo Juntos" (Dia 101-500)
  - Phase 3: "Rumo ao Altar" (Dia 501-1000)
- [ ] Migrate storyCard → storyMoment:
  - Copy all fields
  - Assign phase based on dayNumber
  - Set showInPreview = true
  - Set showInTimeline = true
  - Convert date string to date type
- [ ] Add rollback function
- [ ] Test: Dry run with console.log

### Run Migration
- [ ] Backup dataset (again)
- [ ] Run: `npm run migrate:story-content`
- [ ] Verify: Check Sanity Studio
  - Phases created
  - Moments migrated
  - References correct
  - Images/videos preserved
- [ ] Document: Count migrated items

### Verify Data
- [ ] Navigate: Páginas > Nossa História > Fases
- [ ] Count: ___ phases created
- [ ] Navigate: Páginas > Nossa História > Momentos
- [ ] Count: ___ moments migrated
- [ ] Spot check: 3-5 random moments
  - All fields present
  - Images load
  - Phase assigned
  - Visibility toggles correct

---

## Phase 6: Update Frontend (2 hours)

### Update Types
- [ ] Create `/src/types/storyMoment.ts`
  ```typescript
  export interface StoryMoment {
    _id: string
    _type: 'storyMoment'
    title: string
    date: string
    icon?: string
    description: string
    image: SanityImage
    video?: SanityFile
    dayNumber: number
    phase?: StoryPhase
    displayOrder: number
    contentAlign: 'left' | 'right'
    showInPreview: boolean
    showInTimeline: boolean
    isVisible: boolean
  }

  export interface StoryPhase {
    _id: string
    _type: 'storyPhase'
    id: { current: string }
    title: string
    dayRange: string
    subtitle?: string
    displayOrder: number
    isVisible: boolean
  }
  ```

### Update GROQ Queries
- [ ] Update homepage query in `/src/lib/sanity.queries.ts`
  ```typescript
  // OLD
  storyCards[]->{...}

  // NEW
  storyMoments[]->{
    ...,
    phase->
  }
  ```
- [ ] Update timeline query
  ```typescript
  phases[] {
    "phaseData": phase->,
    "moments": moments[]-> {
      ...,
      phase->
    }
  }
  ```

### Update Story Preview Component
- [ ] Open `/src/components/sections/StoryPreview.tsx`
- [ ] Update prop types: `StoryCard` → `StoryMoment`
- [ ] Update field access (if needed)
- [ ] Add video support (if video field present)
- [ ] Test: Homepage preview renders

### Update Timeline Component
- [ ] Open `/src/components/pages/TimelinePage.tsx` (or create)
- [ ] Update to use phases array
- [ ] Map over `phases[].moments[]`
- [ ] Add phase headers
- [ ] Support left/right alignment
- [ ] Add video support
- [ ] Test: `/historia` page renders

### Test Frontend
- [ ] Start dev server: `npm run dev`
- [ ] Visit: `http://localhost:3000`
- [ ] Verify: Homepage story preview loads
- [ ] Verify: 3-6 moments displayed
- [ ] Visit: `http://localhost:3000/historia`
- [ ] Verify: Timeline page loads
- [ ] Verify: Phases displayed
- [ ] Verify: Moments grouped by phase
- [ ] Verify: Images/videos load

---

## Phase 7: Testing (1 hour)

### Studio Testing
- [ ] Test: Create new phase
- [ ] Test: Create new moment
- [ ] Test: Assign moment to phase
- [ ] Test: Toggle showInPreview
- [ ] Test: Toggle showInTimeline
- [ ] Test: Reorder phases (displayOrder)
- [ ] Test: Reorder moments (displayOrder)
- [ ] Test: Upload new image
- [ ] Test: Upload video (optional)
- [ ] Test: Preview document
- [ ] Test: Publish changes

### Content Visibility Testing
| Toggles | Expected |
|---------|----------|
| ✅ Preview + ✅ Timeline + ✅ Visible | Shows both |
| ❌ Preview + ✅ Timeline + ✅ Visible | Timeline only |
| ✅ Preview + ❌ Timeline + ✅ Visible | Homepage only |
| Any + Any + ❌ Visible | Hidden |

- [ ] Test: All 4 visibility combinations work

### Frontend Testing
- [ ] Test: Homepage preview shows correct moments
- [ ] Test: Only moments with showInPreview=true appear
- [ ] Test: Timeline shows all phases
- [ ] Test: Moments grouped correctly
- [ ] Test: Videos play (if present)
- [ ] Test: Images use hotspot/crop correctly
- [ ] Test: Mobile responsive
- [ ] Test: Performance (no slow queries)

### Edge Cases
- [ ] Test: Phase with no moments
- [ ] Test: Moment with no phase
- [ ] Test: Moment with no image
- [ ] Test: Long descriptions
- [ ] Test: Special characters in text
- [ ] Test: Very large images
- [ ] Test: Invalid video format

---

## Phase 8: Documentation (30 min)

### Update Documentation
- [ ] Create user guide: `SANITY_CMS_USER_GUIDE.md` (done)
- [ ] Update PROJECT_STATUS.md
- [ ] Update CLAUDE.md with changes
- [ ] Add migration notes
- [ ] Document new content structure

### Code Comments
- [ ] Add JSDoc comments to new schemas
- [ ] Document GROQ queries
- [ ] Add inline comments for complex logic

---

## Phase 9: Cleanup (30 min)

### Remove Old Code
- [ ] Delete old storyCard schema (if safe)
- [ ] Remove old timeline inline event code
- [ ] Clean up unused imports
- [ ] Remove temporary migration scripts

### Git Cleanup
- [ ] Review all changes
- [ ] Commit with clear message:
  ```bash
  git add .
  git commit -m "feat: restructure story content in Sanity CMS

  - Rename storyCard → storyMoment with enhanced fields
  - Add storyPhase document for timeline organization
  - Update timeline page to use references
  - Reorganize desk structure (move story content under Nossa História)
  - Add visibility controls (homepage/timeline toggles)
  - Migrate existing content with default phases
  - Update frontend components and queries

  BREAKING CHANGES:
  - storyCard type renamed to storyMoment
  - Timeline page structure changed from inline to references
  - Studio sidebar organization updated"
  ```

---

## Phase 10: Deployment

### Pre-Deploy Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Studio loads correctly
- [ ] Frontend renders correctly
- [ ] Mobile responsive works
- [ ] Performance acceptable

### Deploy
- [ ] Push to Git
  ```bash
  git push origin feature/story-content-restructure
  ```
- [ ] Create pull request
- [ ] Review changes
- [ ] Merge to main
- [ ] Deploy to production (Vercel auto-deploys)
- [ ] Deploy Studio
  ```bash
  npx sanity deploy
  ```

### Post-Deploy Verification
- [ ] Visit: Production site
- [ ] Test: Homepage story preview
- [ ] Test: Timeline page
- [ ] Visit: Production Studio
- [ ] Test: Create new moment
- [ ] Test: Edit existing moment
- [ ] Verify: No broken references
- [ ] Monitor: Check for errors in logs

---

## Phase 11: User Training (Optional)

### Create Training Materials
- [ ] Share user guide with Hel & Ylana
- [ ] Walk through: Creating a moment
- [ ] Walk through: Organizing phases
- [ ] Walk through: Visibility controls
- [ ] Demo: Preview badges
- [ ] Answer questions

### Feedback
- [ ] Gather feedback on new structure
- [ ] Document any confusion points
- [ ] Make adjustments if needed

---

## Rollback Plan (If Needed)

### Emergency Rollback
If critical issues occur:

1. [ ] Revert Git commit
   ```bash
   git revert HEAD
   git push origin main
   ```

2. [ ] Restore Sanity dataset
   ```bash
   npx sanity dataset import backup-YYYYMMDD.tar.gz production
   ```

3. [ ] Redeploy Studio
   ```bash
   npx sanity deploy
   ```

4. [ ] Clear CDN cache (if applicable)

5. [ ] Notify users of rollback

---

## Success Metrics

### Quantitative
- [ ] All story cards migrated (100%)
- [ ] Zero broken references
- [ ] Page load time ≤ previous version
- [ ] Studio load time ≤ previous version
- [ ] Zero console errors

### Qualitative
- [ ] Content editors understand new structure
- [ ] Easier to manage story content
- [ ] Clear where to add/edit stories
- [ ] Reduced confusion vs. old structure
- [ ] Positive user feedback

---

## Known Issues / Future Improvements

Document any issues discovered:

### Issues
- [ ] Issue: ___
  - Workaround: ___
  - Fix planned: ___

### Future Improvements
- [ ] Add bulk operations (hide multiple moments)
- [ ] Add filtering in Studio (by phase, visibility)
- [ ] Add custom preview URLs
- [ ] Add rich text support for descriptions
- [ ] Add moment templates
- [ ] Add duplicate moment feature

---

## Sign-Off

### Technical Review
- [ ] Developer: ___ (Date: ___)
- [ ] Code review passed
- [ ] Tests passed
- [ ] Documentation complete

### Content Review
- [ ] Hel: ___ (Date: ___)
- [ ] Ylana: ___ (Date: ___)
- [ ] Content verified
- [ ] User guide reviewed

### Production Deployment
- [ ] Deployed to production: ___ (Date: ___)
- [ ] Studio updated: ___ (Date: ___)
- [ ] Users notified: ___ (Date: ___)
- [ ] Backup taken: ___ (Date: ___)

---

**Estimated Total Time**: 8-10 hours
**Recommended Approach**: Complete in 1-2 days
**Risk Level**: Medium (data migration involved)
**Impact**: High (improves UX significantly)

**Status**: ⏳ Ready to begin
