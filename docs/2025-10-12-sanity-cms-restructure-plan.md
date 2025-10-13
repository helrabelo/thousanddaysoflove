# Sanity CMS Content Organization - Restructure Plan

## Executive Summary

**Problem**: Users are confused about where to manage story content. There are two places:
1. "Nossa História (Timeline)" under "Páginas" section
2. "Story Cards" under "Conteúdo" section

**Root Cause**: The current structure doesn't clearly communicate the relationship between:
- Homepage preview (shows 3-5 story moments via `storyPreview` section)
- Full timeline page (shows ALL story moments via `timelinePage` with phases/events)
- Story Cards (reusable content referenced by both)

---

## Current Architecture Analysis

### What Exists Today

#### 1. Story Cards (`storyCard` document)
**Location**: Conteúdo > Story Cards
**Purpose**: Reusable story moment content
**Used by**:
- `storyPreview` section (homepage)
- Could potentially be used by `timelinePage` (but currently uses inline events)

**Schema Structure**:
```typescript
{
  title: string          // "Do Tinder ao WhatsApp"
  date: string          // "6 de janeiro de 2023"
  icon: string          // "💑"
  description: text     // Story text
  image: image          // Photo
  dayNumber: number     // Day 1, Day 434
  displayOrder: number  // 1, 2, 3
  isVisible: boolean    // Show/hide
}
```

#### 2. Story Preview Section (`storyPreview`)
**Location**: Referenced by Homepage > Seções
**Purpose**: Homepage section showing 3-6 story moments
**Contains**:
- Section title/description
- Background video/image
- References to 3-6 `storyCard` documents
- CTA button to full timeline page

#### 3. Timeline Page (`timelinePage`)
**Location**: Páginas > Nossa História (Timeline)
**Purpose**: Full relationship timeline at `/historia`
**Contains**:
- Hero section
- Phases (groups of events)
- Events (inline objects, not storyCard references)

**Problem**: Timeline events are INLINE objects, not reusable. This creates duplication:
```typescript
phases: [
  {
    title: "Os Primeiros Dias"
    events: [
      { dayNumber, date, title, description, image } // INLINE
      { dayNumber, date, title, description, image } // INLINE
    ]
  }
]
```

---

## User Confusion Points

### Confusion #1: "Where do I add story moments?"
- **Story Cards** under "Conteúdo" → Used for homepage preview only
- **Timeline Events** under "Páginas > Nossa História" → Used for full timeline only
- **Result**: Users must enter the SAME story twice if they want it in both places

### Confusion #2: "What's the difference?"
- Label "Story Cards" doesn't explain it's for homepage preview
- Label "Nossa História (Timeline)" doesn't explain it's the full page
- No visual indication of relationship between them

### Confusion #3: "Why can't I reuse content?"
- Timeline events are inline objects (not references)
- To show same story on homepage AND timeline, must duplicate content
- No single source of truth for story moments

---

## Proposed Solution: Unified Story Architecture

### Phase 1: Restructure Content Model

#### NEW: Story Moment (`storyMoment` document)
Rename `storyCard` → `storyMoment` for clarity

**Improvements**:
1. Better name reflecting it's a timeline moment
2. Enhanced schema for both preview and full timeline
3. Add phase/category field for grouping

```typescript
{
  // Display
  title: string
  date: date              // Change from string to date type
  icon: string
  description: text
  image: image
  video: file            // NEW: Optional video

  // Timeline Organization
  dayNumber: number
  phase: reference       // NEW: Link to phase
  displayOrder: number

  // Usage Control
  showInPreview: boolean  // NEW: Show on homepage?
  showInTimeline: boolean // NEW: Show on full timeline?
  isVisible: boolean

  // Layout
  contentAlign: 'left' | 'right' // NEW: For timeline layout
}
```

#### NEW: Story Phase (`storyPhase` document)
Create new document type for timeline phases

```typescript
{
  id: string            // "primeiros_dias"
  title: string         // "Os Primeiros Dias"
  dayRange: string      // "Dia 1 - 100"
  subtitle: text
  displayOrder: number
  isVisible: boolean
}
```

### Phase 2: Update Timeline Page

Change `timelinePage` to reference `storyMoment` documents instead of inline events:

```typescript
// BEFORE (inline events)
phases: [
  {
    title: "Os Primeiros Dias"
    events: [{ dayNumber, title, description }] // INLINE
  }
]

// AFTER (references)
phases: [
  {
    phase: reference(storyPhase)
    moments: [
      reference(storyMoment),
      reference(storyMoment),
      reference(storyMoment)
    ]
  }
]
```

**Benefits**:
- Single source of truth for story content
- Reuse same moment on homepage AND timeline
- Edit once, updates everywhere

### Phase 3: Update Story Preview Section

Keep `storyPreview` mostly the same, but:
- Rename references from `storyCards` → `storyMoments`
- Update field descriptions for clarity

```typescript
{
  storyMoments: array<reference(storyMoment)>  // Renamed
  filter: "showInPreview == true"              // NEW: Auto-filter
}
```

### Phase 4: Reorganize Desk Structure

#### NEW Sidebar Organization

```
📄 Páginas
  ├─ 🏠 Homepage
  ├─ 📖 Nossa História [RENAMED]
  │   ├─ ⚙️ Configurar Página       (timelinePage singleton)
  │   ├─ 📚 Fases da História        (storyPhase documents)
  │   └─ ❤️ Momentos da História     (storyMoment documents)
  └─ 📄 Outras Páginas

💾 Conteúdo
  ├─ 🎯 Feature Cards
  ├─ 🐾 Pets
  └─ 💒 Configurações do Casamento

⚙️ Configurações
  ├─ 🌐 Site
  ├─ 🧭 Navegação
  ├─ 📧 Rodapé
  └─ 🔍 SEO
```

**Key Changes**:
1. **Move Story Cards** from "Conteúdo" → "Páginas > Nossa História"
2. **Rename** to "Momentos da História" (clearer purpose)
3. **Add Phases** as sub-item under "Nossa História"
4. **Group** all story-related content together
5. **Remove** from "Conteúdo" (it's not global content, it's timeline-specific)

---

## Detailed Implementation Plan

### Step 1: Create New Schemas (2 hours)

#### 1.1 Create `storyPhase.ts`
**File**: `/src/sanity/schemas/documents/storyPhase.ts`

```typescript
import { defineType, defineField } from 'sanity'
import { Layers } from 'lucide-react'

export default defineType({
  name: 'storyPhase',
  title: 'Fase da História',
  type: 'document',
  icon: Layers,

  fields: [
    defineField({
      name: 'id',
      title: 'ID',
      type: 'slug',
      description: 'Identificador único (ex: primeiros-dias)',
      options: {
        source: 'title',
        maxLength: 50,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'title',
      title: 'Título da Fase',
      type: 'string',
      description: 'Ex: "Os Primeiros Dias"',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'dayRange',
      title: 'Período',
      type: 'string',
      description: 'Ex: "Dia 1 - 100"',
      placeholder: 'Dia 1 - 100',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'subtitle',
      title: 'Descrição',
      type: 'text',
      rows: 2,
      description: 'Breve descrição desta fase',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem cronológica (1, 2, 3)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Exibir esta fase no timeline',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      range: 'dayRange',
      order: 'displayOrder',
    },
    prepare({ title, range, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle: range,
      }
    },
  },
})
```

#### 1.2 Update `storyCard.ts` → `storyMoment.ts`
**File**: `/src/sanity/schemas/documents/storyMoment.ts`

```typescript
import { defineType, defineField } from 'sanity'
import { Heart } from 'lucide-react'

export default defineType({
  name: 'storyMoment',
  title: 'Momento da História',
  type: 'document',
  icon: Heart,

  fields: [
    // Basic Info
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      description: 'Título do momento (ex: "Do Tinder ao WhatsApp")',
      validation: (Rule) => Rule.required().max(100),
    }),

    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      description: 'Data real deste momento',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'icon',
      title: 'Ícone/Emoji',
      type: 'string',
      description: 'Emoji representativo (ex: 💑, 💍, ❤️)',
      validation: (Rule) => Rule.max(10),
      placeholder: '❤️',
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      description: 'História deste momento',
      validation: (Rule) => Rule.required().max(800),
    }),

    // Media
    defineField({
      name: 'image',
      title: 'Imagem',
      type: 'image',
      description: 'Foto deste momento',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Texto Alternativo',
          type: 'string',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'video',
      title: 'Vídeo (Opcional)',
      type: 'file',
      description: 'Vídeo MP4 para este momento',
      options: {
        accept: 'video/mp4',
      },
    }),

    // Timeline Organization
    defineField({
      name: 'dayNumber',
      title: 'Dia',
      type: 'number',
      description: 'Número do dia no relacionamento (ex: 1, 434, 1000)',
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'phase',
      title: 'Fase',
      type: 'reference',
      to: [{ type: 'storyPhase' }],
      description: 'Fase do timeline que este momento pertence',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem na Fase',
      type: 'number',
      description: 'Ordem dentro da fase (1, 2, 3)',
      validation: (Rule) => Rule.required().min(1),
      initialValue: 1,
    }),

    // Layout Options
    defineField({
      name: 'contentAlign',
      title: 'Alinhamento (Timeline)',
      type: 'string',
      description: 'Como exibir este momento no timeline completo',
      options: {
        list: [
          { title: 'Esquerda', value: 'left' },
          { title: 'Direita', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),

    // Visibility Control
    defineField({
      name: 'showInPreview',
      title: 'Mostrar na Homepage',
      type: 'boolean',
      description: 'Exibir este momento no preview da homepage',
      initialValue: true,
    }),

    defineField({
      name: 'showInTimeline',
      title: 'Mostrar no Timeline',
      type: 'boolean',
      description: 'Exibir este momento no timeline completo',
      initialValue: true,
    }),

    defineField({
      name: 'isVisible',
      title: 'Visível',
      type: 'boolean',
      description: 'Visibilidade geral (desabilita ambos)',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Dia do Relacionamento',
      name: 'dayNumber',
      by: [{ field: 'dayNumber', direction: 'asc' }],
    },
    {
      title: 'Data Real',
      name: 'date',
      by: [{ field: 'date', direction: 'asc' }],
    },
    {
      title: 'Fase e Ordem',
      name: 'phaseOrder',
      by: [
        { field: 'phase', direction: 'asc' },
        { field: 'displayOrder', direction: 'asc' },
      ],
    },
  ],

  preview: {
    select: {
      title: 'title',
      day: 'dayNumber',
      icon: 'icon',
      date: 'date',
      preview: 'showInPreview',
      timeline: 'showInTimeline',
      image: 'image',
    },
    prepare({ title, day, icon, date, preview, timeline, image }) {
      const badges = []
      if (preview) badges.push('Homepage')
      if (timeline) badges.push('Timeline')

      return {
        title: `${icon || '❤️'} Dia ${day}: ${title}`,
        subtitle: badges.length > 0 ? `📍 ${badges.join(' + ')}` : 'Não visível',
        media: image,
      }
    },
  },
})
```

### Step 2: Update Timeline Page Schema (1 hour)

**File**: `/src/sanity/schemas/pages/timelinePage.ts`

Replace inline events with references:

```typescript
// Replace this field
defineField({
  name: 'phases',
  title: 'Fases da Timeline',
  type: 'array',
  description: 'Organize a história em fases cronológicas',
  of: [
    {
      type: 'object',
      name: 'phaseSection',
      fields: [
        {
          name: 'phase',
          title: 'Fase',
          type: 'reference',
          to: [{ type: 'storyPhase' }],
          description: 'Selecione uma fase',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'moments',
          title: 'Momentos',
          type: 'array',
          description: 'Momentos desta fase (arraste para reordenar)',
          of: [
            {
              type: 'reference',
              to: [{ type: 'storyMoment' }],
              options: {
                filter: ({ parent }) => ({
                  filter: 'phase._ref == $phaseId && showInTimeline == true',
                  params: { phaseId: parent?.phase?._ref },
                }),
              },
            },
          ],
        },
      ],
      preview: {
        select: {
          phase: 'phase.title',
          range: 'phase.dayRange',
          moments: 'moments',
        },
        prepare({ phase, range, moments }) {
          return {
            title: phase || 'Fase não selecionada',
            subtitle: `${range || ''} • ${moments?.length || 0} momentos`,
          }
        },
      },
    },
  ],
})
```

### Step 3: Update Story Preview Section (30 min)

**File**: `/src/sanity/schemas/sections/storyPreview.ts`

```typescript
// Update this field
defineField({
  name: 'storyMoments',  // RENAMED from storyCards
  title: 'Momentos da História',
  type: 'array',
  description: 'Momentos-chave da jornada do casal (3-6 recomendado)',
  of: [
    {
      type: 'reference',
      to: [{ type: 'storyMoment' }],  // UPDATED reference
      options: {
        filter: 'showInPreview == true && isVisible == true',
      },
    },
  ],
  validation: (Rule) => Rule.required().min(1).max(6),
})
```

### Step 4: Update Schema Registry (15 min)

**File**: `/src/sanity/schemas/documents/index.ts`

```typescript
import featureCard from './featureCard'
import pet from './pet'
import storyMoment from './storyMoment'      // RENAMED
import storyPhase from './storyPhase'        // NEW
import weddingSettings from './weddingSettings'

export const documentSchemas = [
  featureCard,
  pet,
  storyMoment,    // RENAMED
  storyPhase,     // NEW
  weddingSettings,
]
```

### Step 5: Update Desk Structure (1 hour)

**File**: `/src/sanity/desk/index.ts`

```typescript
// Replace "Nossa História (Timeline)" section
S.listItem()
  .title('Nossa História')
  .icon(Clock)
  .child(
    S.list()
      .title('Nossa História')
      .items([
        // Timeline Page Configuration
        S.listItem()
          .title('⚙️ Configurar Página')
          .icon(Settings)
          .child(
            S.document()
              .schemaType('timelinePage')
              .documentId('timelinePage')
              .title('Configurações do Timeline')
          ),

        S.divider(),

        // Story Phases
        S.listItem()
          .title('📚 Fases da História')
          .icon(Layers)
          .child(
            S.documentTypeList('storyPhase')
              .title('Fases da História')
              .filter('_type == "storyPhase"')
              .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
          ),

        // Story Moments
        S.listItem()
          .title('❤️ Momentos da História')
          .icon(Heart)
          .child(
            S.documentTypeList('storyMoment')
              .title('Momentos da História')
              .filter('_type == "storyMoment"')
              .defaultOrdering([{ field: 'dayNumber', direction: 'asc' }])
          ),
      ])
  ),

// Remove Story Cards from Content section
S.listItem()
  .title('Conteúdo')
  .icon(Database)
  .child(
    S.list()
      .title('Conteúdo')
      .items([
        // Feature Cards
        S.listItem()
          .title('Feature Cards')
          .icon(LayoutGrid)
          .child(
            S.documentTypeList('featureCard')
              .title('Feature Cards')
              .filter('_type == "featureCard"')
              .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
          ),

        // Pets
        S.listItem()
          .title('Pets')
          .icon(Dog)
          .child(
            S.documentTypeList('pet')
              .title('Pets')
              .filter('_type == "pet"')
              .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
          ),

        S.divider(),

        // Wedding Settings (singleton)
        S.listItem()
          .title('Configurações do Casamento')
          .icon(Church)
          .child(
            S.document()
              .schemaType('weddingSettings')
              .documentId('weddingSettings')
              .title('Configurações do Casamento')
          ),
      ])
  ),
```

### Step 6: Data Migration Script (1 hour)

Create migration script to:
1. Rename `storyCard` → `storyMoment`
2. Create default phases
3. Assign existing moments to phases

**File**: `/scripts/migrate-story-content.ts`

```typescript
import { client } from '../src/lib/sanity.client'

async function migrateStoryContent() {
  console.log('Starting story content migration...')

  // Step 1: Create default phases
  const phases = [
    {
      _type: 'storyPhase',
      _id: 'phase-1',
      id: { current: 'primeiros-dias' },
      title: 'Os Primeiros Dias',
      dayRange: 'Dia 1 - 100',
      subtitle: 'Do match ao primeiro encontro',
      displayOrder: 1,
      isVisible: true,
    },
    {
      _type: 'storyPhase',
      _id: 'phase-2',
      id: { current: 'construindo-juntos' },
      title: 'Construindo Juntos',
      dayRange: 'Dia 101 - 500',
      subtitle: 'Crescendo como casal',
      displayOrder: 2,
      isVisible: true,
    },
    {
      _type: 'storyPhase',
      _id: 'phase-3',
      id: { current: 'rumo-ao-altar' },
      title: 'Rumo ao Altar',
      dayRange: 'Dia 501 - 1000',
      subtitle: 'Preparando nosso futuro',
      displayOrder: 3,
      isVisible: true,
    },
  ]

  for (const phase of phases) {
    await client.createOrReplace(phase)
    console.log(`Created phase: ${phase.title}`)
  }

  // Step 2: Migrate storyCard → storyMoment
  const storyCards = await client.fetch(`*[_type == "storyCard"]`)

  for (const card of storyCards) {
    // Determine phase based on day number
    let phaseRef
    if (card.dayNumber <= 100) phaseRef = { _ref: 'phase-1', _type: 'reference' }
    else if (card.dayNumber <= 500) phaseRef = { _ref: 'phase-2', _type: 'reference' }
    else phaseRef = { _ref: 'phase-3', _type: 'reference' }

    const moment = {
      ...card,
      _type: 'storyMoment',
      phase: phaseRef,
      date: card.date || new Date().toISOString().split('T')[0],
      showInPreview: true,
      showInTimeline: true,
      contentAlign: 'left',
    }

    await client.createOrReplace(moment)
    console.log(`Migrated: ${card.title}`)
  }

  console.log('Migration complete!')
}

migrateStoryContent()
```

### Step 7: Update Frontend Components (2 hours)

#### 7.1 Update Story Preview Component
**File**: `/src/components/sections/StoryPreview.tsx`

Change query from `storyCards` → `storyMoments`

#### 7.2 Create New Timeline Component
**File**: `/src/components/pages/TimelinePage.tsx`

Update to fetch phases and moments via references

---

## Testing Checklist

### Content Migration
- [ ] All existing story cards migrated to story moments
- [ ] Default phases created
- [ ] Moments correctly assigned to phases
- [ ] Images/videos preserved

### Studio Interface
- [ ] "Story Cards" removed from "Conteúdo" section
- [ ] "Nossa História" expanded with sub-items
- [ ] Phases list working with drag-and-drop ordering
- [ ] Moments list working with filtering
- [ ] Preview shows correct badges (Homepage + Timeline)

### Content Editing
- [ ] Can create new phase
- [ ] Can create new moment
- [ ] Can assign moment to phase
- [ ] Can toggle visibility (homepage/timeline)
- [ ] Can reorder moments within phase

### Frontend Display
- [ ] Homepage preview shows correct moments
- [ ] Timeline page shows phases and moments
- [ ] Filtering works (showInPreview, showInTimeline)
- [ ] No broken references

---

## Rollback Plan

If issues occur:

1. **Keep old schemas** in place during migration
2. **Deploy new schemas** alongside old ones (storyCard + storyMoment)
3. **Test thoroughly** before deleting old content
4. **Migration script** should be reversible
5. **Backup Sanity dataset** before migration

---

## Benefits Summary

### For Content Editors (Hel & Ylana)
- ✅ Clear organization: All story content under "Nossa História"
- ✅ Single source of truth: Edit once, updates everywhere
- ✅ Easy visibility control: Toggle where moments appear
- ✅ Intuitive grouping: Phases organize timeline logically
- ✅ Better previews: See where each moment is used

### For Developers
- ✅ No content duplication
- ✅ Consistent schema structure
- ✅ Reusable references
- ✅ Easier to maintain
- ✅ Better data model

### For Users (Wedding Guests)
- ✅ Consistent story across site
- ✅ Better organized timeline
- ✅ Richer content (videos, better layouts)

---

## Estimated Implementation Time

- **Schema Creation**: 2 hours
- **Desk Structure**: 1 hour
- **Migration Script**: 1 hour
- **Frontend Updates**: 2 hours
- **Testing**: 1 hour
- **Documentation**: 1 hour

**Total**: ~8 hours (1 work day)

---

## Next Steps

1. **Review this plan** with Hel
2. **Backup Sanity dataset**
3. **Create feature branch** `feature/story-content-restructure`
4. **Implement schemas** (Step 1-4)
5. **Test in Studio** before migration
6. **Run migration script** (Step 6)
7. **Update frontend** (Step 7)
8. **Test thoroughly**
9. **Deploy to production**
10. **Update documentation**

---

## Questions to Resolve

1. Should existing inline timeline events be preserved or migrated?
2. What default phases make sense? (Currently suggested 3)
3. Should phases be required for moments?
4. Any additional fields needed for moments?
5. Should we support multiple content types (photos, videos, text-only)?
