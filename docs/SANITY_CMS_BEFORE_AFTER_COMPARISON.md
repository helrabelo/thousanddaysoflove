# Sanity CMS Reorganization - Before & After Comparison

## Visual Comparison

### BEFORE: Current Structure (Confusing)

```
📄 Páginas
│
├─ 🏠 Homepage
│   └─ (references storyPreview section → references storyCards)
│
├─ 📖 Nossa História (Timeline)  ⚠️ CONFUSING NAME
│   └─ Contains: Inline phase objects with inline events
│       {
│         phase: { title, dayRange, events: [...] }
│       }
│
└─ 📄 Outras Páginas

💾 Conteúdo
│
├─ ❤️ Story Cards  ⚠️ CONFUSING - Why here?
│   └─ Used by: Homepage preview only
│
├─ 🎯 Feature Cards
│
├─ 🐾 Pets
│
└─ 💒 Configurações do Casamento
```

**Problems**:
1. "Story Cards" in "Conteúdo" but only used for homepage
2. "Nossa História (Timeline)" has its own inline events (duplication)
3. No visual connection between Story Cards and Timeline
4. To show same story in both places = duplicate content manually

---

### AFTER: Proposed Structure (Clear)

```
📄 Páginas
│
├─ 🏠 Homepage
│   └─ (references storyPreview section → references storyMoments)
│
├─ 📖 Nossa História  ✅ CLEAR GROUPING
│   │
│   ├─ ⚙️ Configurar Página (timelinePage)
│   │   └─ Hero settings, SEO, etc.
│   │
│   ├─ 📚 Fases da História (storyPhase documents)
│   │   ├─ 1. Os Primeiros Dias (Dia 1-100)
│   │   ├─ 2. Construindo Juntos (Dia 101-500)
│   │   └─ 3. Rumo ao Altar (Dia 501-1000)
│   │
│   └─ ❤️ Momentos da História (storyMoment documents)  ✅ MOVED HERE
│       ├─ Dia 1: Do Tinder ao WhatsApp 📍 Homepage + Timeline
│       ├─ Dia 50: Primeira Viagem 📍 Timeline
│       └─ Dia 434: Pedido de Casamento 📍 Homepage + Timeline
│
└─ 📄 Outras Páginas

💾 Conteúdo
│
├─ 🎯 Feature Cards
│
├─ 🐾 Pets
│
└─ 💒 Configurações do Casamento

⚙️ Configurações
│
├─ 🌐 Site
├─ 🧭 Navegação
├─ 📧 Rodapé
└─ 🔍 SEO
```

**Benefits**:
1. All story content grouped under "Nossa História"
2. Clear hierarchy: Page → Phases → Moments
3. Visual badges show where moments are used
4. Single source of truth - edit once, updates everywhere

---

## User Flow Comparison

### BEFORE: To Add a Story Moment

#### Scenario: Add "First Date" story to both homepage and timeline

**Step 1**: Add to Homepage Preview
```
Navigate: Conteúdo > Story Cards > Add New
Fill: Title, Date, Description, Image
Set: displayOrder = 1
Save & Publish
```

**Step 2**: Add to Timeline (DUPLICATE WORK!)
```
Navigate: Páginas > Nossa História (Timeline)
Find: Correct phase
Add: Inline event object
Fill: SAME Title, Date, Description
Upload: SAME Image
Save & Publish
```

**Result**: 😞
- Content duplicated in 2 places
- Must update both places if story changes
- Risk of inconsistency
- Extra work for every story

---

### AFTER: To Add a Story Moment

#### Scenario: Add "First Date" story to both homepage and timeline

**Step 1**: Create Story Moment (ONE TIME)
```
Navigate: Páginas > Nossa História > ❤️ Momentos da História
Add New Story Moment
Fill: Title, Date, Description, Image
Select: Phase (automatically filters by day number)
Toggle: ✅ Show on Homepage
Toggle: ✅ Show on Timeline
Save & Publish
```

**Result**: 😊
- Content automatically appears on homepage AND timeline
- Edit once, updates everywhere
- No duplication, no inconsistency
- Less work, more control

---

## Schema Comparison

### BEFORE: Story Card (Limited)

```typescript
{
  _type: 'storyCard',
  title: "Do Tinder ao WhatsApp",
  date: "6 de janeiro de 2023",  // STRING (not queryable)
  icon: "💑",
  description: "Nossa primeira conversa...",
  image: { ... },
  dayNumber: 1,
  displayOrder: 1,
  isVisible: true,  // Only controls homepage
}

// Timeline events are separate inline objects (DUPLICATION)
{
  dayNumber: 1,
  date: "2023-01-06",
  title: "Do Tinder ao WhatsApp",  // DUPLICATED
  description: "Nossa primeira conversa...",  // DUPLICATED
  image: { ... },  // DUPLICATED
}
```

---

### AFTER: Story Moment (Enhanced)

```typescript
{
  _type: 'storyMoment',
  title: "Do Tinder ao WhatsApp",
  date: "2023-01-06",  // DATE type (queryable, sortable)
  icon: "💑",
  description: "Nossa primeira conversa...",

  // Media
  image: { ... },
  video: { ... },  // NEW: Optional video

  // Organization
  dayNumber: 1,
  phase: { _ref: 'phase-1' },  // NEW: Links to phase
  displayOrder: 1,
  contentAlign: 'left',  // NEW: Timeline layout

  // Visibility Control
  showInPreview: true,   // NEW: Show on homepage?
  showInTimeline: true,  // NEW: Show on full timeline?
  isVisible: true,       // Master visibility toggle
}

// Single source of truth - referenced by both homepage and timeline
```

**Improvements**:
- ✅ Single content entry (no duplication)
- ✅ Date as proper date type (sortable, filterable)
- ✅ Phase relationship for organization
- ✅ Independent visibility controls
- ✅ Video support
- ✅ Layout options for timeline

---

## Timeline Page Structure Comparison

### BEFORE: Inline Events (Duplication)

```typescript
// timelinePage document
{
  phases: [
    {
      title: "Os Primeiros Dias",
      dayRange: "Dia 1 - 100",
      events: [
        {
          dayNumber: 1,
          date: "2023-01-06",
          title: "Do Tinder ao WhatsApp",  // INLINE
          description: "...",              // INLINE
          image: { ... }                   // INLINE
        },
        {
          dayNumber: 50,
          date: "2023-02-24",
          title: "Primeira Viagem",        // INLINE
          description: "...",              // INLINE
          image: { ... }                   // INLINE
        }
      ]
    },
    {
      title: "Construindo Juntos",
      dayRange: "Dia 101 - 500",
      events: [...]  // MORE INLINE EVENTS
    }
  ]
}
```

**Problems**:
- ❌ Events locked inside timeline page
- ❌ Can't reuse on homepage without duplication
- ❌ Hard to query/filter
- ❌ No relationship to phase documents

---

### AFTER: Referenced Moments (Reusable)

```typescript
// timelinePage document
{
  phases: [
    {
      phase: { _ref: 'phase-1' },  // REFERENCE to phase document
      moments: [
        { _ref: 'moment-1' },      // REFERENCE to moment document
        { _ref: 'moment-2' },      // REFERENCE to moment document
      ]
    },
    {
      phase: { _ref: 'phase-2' },
      moments: [
        { _ref: 'moment-3' },
        { _ref: 'moment-4' },
      ]
    }
  ]
}

// storyPhase document
{
  _id: 'phase-1',
  _type: 'storyPhase',
  title: "Os Primeiros Dias",
  dayRange: "Dia 1 - 100",
  subtitle: "Do match ao primeiro encontro",
  displayOrder: 1,
}

// storyMoment documents (reusable!)
{
  _id: 'moment-1',
  _type: 'storyMoment',
  title: "Do Tinder ao WhatsApp",
  phase: { _ref: 'phase-1' },
  showInPreview: true,    // ✅ Used on homepage
  showInTimeline: true,   // ✅ Used on timeline
}

{
  _id: 'moment-2',
  _type: 'storyMoment',
  title: "Primeira Viagem",
  phase: { _ref: 'phase-1' },
  showInPreview: false,   // ❌ NOT on homepage
  showInTimeline: true,   // ✅ Only on timeline
}
```

**Benefits**:
- ✅ Moments are standalone documents (reusable)
- ✅ Easy to query: "Get all moments for phase 1"
- ✅ Easy to filter: "Get moments where showInPreview == true"
- ✅ Clear relationship between phases and moments
- ✅ Edit moment once, updates everywhere

---

## Content Editor Experience

### BEFORE: Adding "Pedido de Casamento" Story

**Task**: Add the proposal story to both homepage preview and full timeline

#### Editor Mental Process:
```
1. Where do I add this?
   - "Story Cards" for homepage?
   - "Nossa História (Timeline)" for timeline?
   - Both? (Confused)

2. Let me add to homepage first:
   - Navigate: Conteúdo > Story Cards
   - Create: Title, description, image
   - ❓ "Will this show on timeline too?" (No indication)

3. Now add to timeline:
   - Navigate: Páginas > Nossa História (Timeline)
   - Find: Correct phase
   - Add: Inline event
   - Copy: Title, description from Story Cards
   - Upload: Image again (duplication)
   - 😫 "Why am I doing this twice?"

4. Later, need to change description:
   - Edit: Story Cards version
   - ❓ "Do I need to edit timeline too?" (Yes!)
   - Find: Timeline page, find phase, find event
   - Edit: Again (frustration)
```

**Time**: ~10 minutes per story
**Frustration**: High
**Risk**: Inconsistency between homepage and timeline

---

### AFTER: Adding "Pedido de Casamento" Story

**Task**: Add the proposal story to both homepage preview and full timeline

#### Editor Mental Process:
```
1. Where do I add this?
   - Navigate: Páginas > Nossa História > ❤️ Momentos da História
   - ✅ "All story content is here!"

2. Create moment:
   - Add New Story Moment
   - Fill: Title, date, description, image
   - Day: 434 (auto-suggests phase based on day range)
   - Phase: "Construindo Juntos" (auto-selected)
   - ✅ Show on Homepage (toggle on)
   - ✅ Show on Timeline (toggle on)
   - Save & Publish

3. Preview:
   - Badge shows: "📍 Homepage + Timeline"
   - 😊 "Perfect! I can see where it's used"

4. Later, need to change description:
   - Navigate: Páginas > Nossa História > ❤️ Momentos da História
   - Find: "Dia 434: Pedido de Casamento"
   - Edit: Description
   - Save
   - ✅ Automatically updates on homepage AND timeline!
```

**Time**: ~3 minutes per story
**Frustration**: None
**Risk**: Zero inconsistency (single source of truth)

---

## Developer Benefits

### BEFORE: Complex Queries

```typescript
// Homepage: Fetch story cards
const storyCards = await client.fetch(`
  *[_type == "storyCard" && isVisible == true]
  | order(displayOrder asc)
  [0...5]
`)

// Timeline: Data is inline (no query needed, but not reusable)
const timeline = await client.fetch(`
  *[_type == "timelinePage"][0] {
    phases[] {
      title,
      dayRange,
      events[] {
        dayNumber,
        date,
        title,
        description,
        image
      }
    }
  }
`)

// Problem: Same content in two different structures
// Can't query "all story content" in one place
```

---

### AFTER: Simple, Consistent Queries

```typescript
// Homepage: Fetch moments for preview
const previewMoments = await client.fetch(`
  *[_type == "storyMoment"
    && showInPreview == true
    && isVisible == true]
  | order(dayNumber asc)
  [0...5] {
    ...,
    phase->
  }
`)

// Timeline: Fetch moments by phase
const timelineMoments = await client.fetch(`
  *[_type == "storyMoment"
    && showInTimeline == true
    && isVisible == true]
  | order(dayNumber asc) {
    ...,
    phase->
  }
`)

// OR: Fetch timeline with populated moments
const timeline = await client.fetch(`
  *[_type == "timelinePage"][0] {
    phases[] {
      "phaseData": phase->,
      "moments": moments[]-> {
        ...,
        phase->
      }
    }
  }
`)

// Benefit: Same content structure everywhere
// Easy to query, filter, sort by any field
```

---

## Migration Safety

### Data Preservation

**Before Migration**:
```json
// storyCard document
{
  "_id": "story-1",
  "_type": "storyCard",
  "title": "Do Tinder ao WhatsApp",
  "date": "6 de janeiro de 2023",
  "description": "Nossa primeira conversa...",
  "image": {...},
  "dayNumber": 1,
  "displayOrder": 1
}
```

**After Migration**:
```json
// storyMoment document (enhanced, not replaced)
{
  "_id": "story-1",  // SAME ID
  "_type": "storyMoment",  // NEW TYPE
  "title": "Do Tinder ao WhatsApp",  // PRESERVED
  "date": "2023-01-06",  // CONVERTED to date type
  "description": "Nossa primeira conversa...",  // PRESERVED
  "image": {...},  // PRESERVED
  "dayNumber": 1,  // PRESERVED
  "displayOrder": 1,  // PRESERVED

  // NEW FIELDS
  "phase": {"_ref": "phase-1"},
  "showInPreview": true,
  "showInTimeline": true,
  "contentAlign": "left"
}
```

**Rollback Strategy**:
1. Keep both schemas during migration
2. Test thoroughly before deleting old content
3. Migration script can be reversed
4. Sanity dataset backed up before migration

---

## Summary: Why This Change Matters

### For Hel & Ylana (Content Editors)
| Before | After |
|--------|-------|
| Add story to 2 places (homepage + timeline) | Add story once, choose where it appears |
| Edit in 2 places when content changes | Edit once, updates everywhere |
| Confusing structure (why is "Story Cards" in "Conteúdo"?) | Clear structure (all story content under "Nossa História") |
| No visual indication of where content is used | Preview badges show: "📍 Homepage + Timeline" |
| Manual phase organization in timeline | Automatic phase assignment based on day number |

### For Developers
| Before | After |
|--------|-------|
| Two different content structures (cards vs events) | One unified structure (moments) |
| Can't reuse content between homepage/timeline | Content reused via references |
| Inline events hard to query | Moments easy to query/filter |
| Date as string (not sortable) | Date as proper date type |
| No relationship between content | Clear relationships (moments → phases) |

### For Wedding Guests (End Users)
| Before | After |
|--------|-------|
| Risk of inconsistent stories (if editors forget to update both) | Consistent stories across site |
| Limited content (no videos in timeline events) | Richer content (videos, better layouts) |
| Basic timeline | Well-organized timeline with phases |

---

## Decision Points

Before proceeding, confirm:

1. **Phase Structure**: Are 3 default phases good? ("Primeiros Dias", "Construindo Juntos", "Rumo ao Altar")
2. **Migration**: Should existing timeline inline events be migrated or kept separate?
3. **Visibility**: Default all existing moments to show in both homepage + timeline?
4. **Breaking Changes**: Okay to update frontend queries after migration?
5. **Timeline**: Acceptable to spend 1 day on this restructure?

---

**Ready to proceed?** The implementation plan is in `SANITY_CMS_RESTRUCTURE_PLAN.md`
