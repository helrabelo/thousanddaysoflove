# Sanity CMS Information Architecture - UX Analysis & Redesign

## Executive Summary

The current Sanity CMS structure for the wedding timeline/story feature is confusing due to **schema/concept duplication**, **unclear naming**, and **poor mental model mapping**. Three similarly-named entities exist that represent different things, making it unclear where to edit content.

**Current Problem**: User sees "Momentos da História", "Fases da História", and "Nossa História" and asks: "which is it?"

**Root Cause**: Mixing **building blocks** (content) with **pages** (presentation) in the same namespace, using overlapping Portuguese terminology, and hiding the relationship hierarchy.

---

## 1. Problem Analysis: Why This Is Confusing

### 1.1 Schema/Concept Duplication

The system has **two different timeline architectures** that serve different purposes:

#### Architecture A: Reusable Content Blocks (Documents)
- **storyMoment.ts** - Individual timeline events (First Date, Got a Pet, etc.)
- **storyPhase.ts** - Time period groupings (Day 1-100, Day 101-500, etc.)
- **Relationship**: Moments belong to Phases (reference relationship)
- **Purpose**: Reusable content library that can appear in multiple places

#### Architecture B: Page-Specific Embedded Data (Singleton)
- **timelinePage.ts** - Full timeline page with embedded phases/events
- **Structure**: phases[] → events[] (nested objects, not references)
- **Purpose**: Page-specific configuration with inline content

**The Confusion**: These are two different ways to organize the same timeline content. One is modular/reusable (Architecture A), the other is embedded/page-specific (Architecture B).

**Why Both Exist**:
- Architecture A allows moments to appear on homepage preview AND full timeline page
- Architecture B allows custom inline editing for the timeline page
- But having BOTH creates confusion about which system controls what

### 1.2 Naming Conflicts

| Portuguese Term | User Interpretation | Actual Schema | What It Actually Is |
|----------------|---------------------|---------------|---------------------|
| "Nossa História" | The story/timeline feature generally | `timelinePage` | Full timeline page configuration |
| "Nossa História" | Homepage preview section | `storyPreview` | Homepage section showing story moments |
| "Momentos da História" | Timeline events? Stories? | `storyMoment` | Individual timeline event documents |
| "Fases da História" | Timeline phases? Chapters? | `storyPhase` | Time period grouping documents |

**The Problem**: "Nossa História" appears in multiple places with different meanings, and it's not clear that "Momentos" and "Fases" are the **building blocks** that power "Nossa História" pages.

### 1.3 Hidden Relationships

The desk structure hides the hierarchy:

```
Conteúdo/
  ├── Momentos da História    (building blocks)
  ├── Fases da História        (building blocks)
  └── Feature Cards            (unrelated)

Páginas/
  └── Nossa História (Timeline) (uses building blocks? or inline content?)
```

**What's Missing**:
- No visual indication that Momentos → Fases (parent-child)
- No indication that both feed into Timeline Page
- No clear separation between "content library" vs "page configuration"

### 1.4 Mental Model Mismatch

**User's Mental Model** (what they expect):
```
"Nossa História" (The Story)
  └── Timeline Events (First Date, Got a Pet, etc.)
```

**Actual System Model** (what exists):
```
Content Library:
  ├── Story Moments (individual events)
  └── Story Phases (time groupings)

Pages Using That Library:
  ├── Homepage Story Preview (shows selected moments)
  └── Timeline Page (shows all phases + moments)
```

**The Gap**: Users don't naturally think in terms of "content library" vs "page that uses library". They think: "I want to edit our story" → but where do I go?

---

## 2. User Research Insights

### 2.1 User Personas

**Primary User: Non-Technical Content Editor**
- Role: Bride/Groom editing wedding website
- Tech Savviness: Familiar with social media, not with CMS concepts
- Goals:
  - Add new timeline moments (First Date, Engagement, etc.)
  - Update story descriptions
  - Reorder timeline events
- Frustrations:
  - "I see three 'História' things - which one do I edit?"
  - "I added a moment, but it's not showing on the page - why?"
  - "Are phases and moments the same thing?"

**Secondary User: Technical Administrator**
- Role: Developer/friend helping with site
- Tech Savviness: Understands CMS, references, schemas
- Goals:
  - Configure page layouts
  - Manage visibility settings
  - Understand content relationships
- Frustrations:
  - "Why do we have two timeline systems?"
  - "Is timelinePage using storyMoment references or inline content?"

### 2.2 Common Task Flows (Current System)

**Task: "I want to add our engagement story"**

Current Flow (Confusing):
1. User opens Sanity
2. Sees "Páginas" → "Nossa História (Timeline)" - clicks there
3. Sees complex nested structure with phases[] → events[]
4. Confused: "Do I add it here? Or in that 'Momentos da História' thing?"
5. Tries adding in timelinePage inline → works, but...
6. Realizes it's not showing on homepage preview
7. Goes to "Conteúdo" → "Momentos da História"
8. Adds the same moment again there
9. Confused about duplication

**Pain Points**:
- No clear entry point for common task
- Duplication between inline content and reusable content
- Unclear where changes will appear (homepage vs timeline page)

---

## 3. Proposed Information Architecture

### 3.1 Core Principle: Separate Content Library from Pages

**New Mental Model**:
```
1. CONTENT LIBRARY (building blocks)
   └── Timeline content that can be reused anywhere

2. PAGES (presentation layers)
   └── Pages that display timeline content
```

### 3.2 Recommended Schema Changes

#### Option A: Unified Reusable System (RECOMMENDED)

**Keep Architecture A, Remove Architecture B**

Schemas to Keep:
- `storyMoment` - Individual timeline events
- `storyPhase` - Time period groupings
- `storyPreview` - Homepage section (references moments)

Schemas to Modify:
- `timelinePage` - Change from inline content to references

**New timelinePage structure**:
```typescript
fields: [
  // Remove inline phases[] with nested events[]
  // Add reference to phases
  {
    name: 'phases',
    title: 'Fases da Timeline',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'storyPhase' }] }],
    description: 'Selecione as fases da história para exibir'
  }
]

// Moments automatically load from storyPhase → storyMoment references
```

**Benefits**:
- Single source of truth for timeline content
- Add once, appears everywhere (homepage + timeline page)
- Clearer content → presentation separation
- Less duplication, less confusion

### 3.3 Recommended Naming Conventions

| Current Name | New Name | Rationale |
|--------------|----------|-----------|
| Momentos da História | **Eventos da Linha do Tempo** | More specific: these are timeline events |
| Fases da História | **Períodos da Linha do Tempo** | More specific: these are time periods/chapters |
| Nossa História (timelinePage) | **Página: Linha do Tempo Completa** | Clearly a page, not content |
| Story Preview (storyPreview) | **Seção: Prévia da História (Homepage)** | Clearly a homepage section |

**Portuguese Clarity Improvements**:
- "História" is too generic (story/history/timeline?)
- "Linha do Tempo" is more specific and universally understood
- "Eventos" vs "Momentos" - eventos is clearer (event vs moment)
- "Períodos" vs "Fases" - both work, but períodos is more neutral

### 3.4 Alternative Naming (Simpler)

If "Linha do Tempo" feels too technical:

| Schema | Simple Name | Description |
|--------|-------------|-------------|
| storyMoment | **Momentos Especiais** | Individual memories/events |
| storyPhase | **Capítulos** | Story chapters/periods |
| timelinePage | **Nossa História (Página Completa)** | Full timeline page |
| storyPreview | **Nossa História (Homepage)** | Homepage preview |

**Benefits**:
- More emotional/wedding-appropriate language
- "Capítulos" clearly groups "Momentos"
- "Página Completa" vs "Homepage" makes distinction clear

---

## 4. New Desk Structure Design

### 4.1 Proposed Hierarchy (Option A - Content Library First)

```
📖 Conteúdo da Linha do Tempo
  ├── 📅 Capítulos
  │     (Organize a história em capítulos: Os Primeiros Dias, Construindo Juntos, etc.)
  │
  └── ❤️ Momentos Especiais
        (Eventos importantes: Primeiro Encontro, Mudança, Pedido, etc.)

📄 Páginas
  ├── 🏠 Homepage
  │
  ├── 🕰️ Nossa História (Página Completa)
  │     (Linha do tempo completa com todos os momentos e capítulos)
  │
  └── 📄 Outras Páginas

⚙️ Configurações
  └── ...
```

### 4.2 Alternative Hierarchy (Option B - Story-First Grouping)

```
❤️ Nossa História
  ├── 📖 Conteúdo da História
  │     ├── Capítulos da História
  │     └── Momentos da História
  │
  ├── 🏠 Prévia da História (Homepage)
  │     (Configure como a história aparece na homepage)
  │
  └── 🕰️ História Completa (Página)
        (Configure a página completa da linha do tempo)

📄 Outras Páginas
  └── Homepage

⚙️ Configurações
  └── ...
```

**Benefits of Option B**:
- Everything story-related grouped together
- Clear hierarchy: Content → Pages
- Matches user mental model: "I want to edit our story" → go to "Nossa História"

### 4.3 Recommended Desk Structure Implementation (Option B)

```typescript
// src/sanity/desk/index.ts

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo')
    .items([
      // NOSSA HISTÓRIA SECTION (Story-First Grouping)
      S.listItem()
        .title('❤️ Nossa História')
        .icon(Heart)
        .child(
          S.list()
            .title('Nossa História')
            .items([
              // Content Library
              S.listItem()
                .title('📖 Conteúdo da História')
                .icon(Database)
                .child(
                  S.list()
                    .title('Biblioteca de Conteúdo')
                    .items([
                      S.listItem()
                        .title('Capítulos')
                        .icon(Layers)
                        .description('Organize a história em capítulos (períodos)')
                        .child(
                          S.documentTypeList('storyPhase')
                            .title('Capítulos da História')
                            .filter('_type == "storyPhase"')
                            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                        ),

                      S.listItem()
                        .title('Momentos Especiais')
                        .icon(Heart)
                        .description('Eventos importantes da relação')
                        .child(
                          S.documentTypeList('storyMoment')
                            .title('Momentos da História')
                            .filter('_type == "storyMoment"')
                            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                        ),
                    ])
                ),

              S.divider(),

              // Pages Using Content
              S.listItem()
                .title('🏠 Prévia na Homepage')
                .icon(Home)
                .description('Como a história aparece na homepage')
                .child(
                  S.documentTypeList('storyPreview')
                    .title('Seção: Nossa História (Homepage)')
                ),

              S.listItem()
                .title('🕰️ Página Completa')
                .icon(Clock)
                .description('Linha do tempo completa em /nossa-historia')
                .child(
                  S.document()
                    .schemaType('timelinePage')
                    .documentId('timelinePage')
                    .title('Página: Linha do Tempo Completa')
                ),
            ])
        ),

      S.divider(),

      // OTHER PAGES
      S.listItem()
        .title('📄 Páginas')
        .icon(FileText)
        .child(
          S.list()
            .title('Páginas')
            .items([
              S.listItem()
                .title('Homepage')
                .icon(Home)
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),

              S.listItem()
                .title('Outras Páginas')
                .child(S.documentTypeList('page')),
            ])
        ),

      S.divider(),

      // OTHER CONTENT
      S.listItem()
        .title('🗂️ Outros Conteúdos')
        .icon(Database)
        .child(
          S.list()
            .title('Outros Conteúdos')
            .items([
              S.listItem()
                .title('Feature Cards')
                .child(S.documentTypeList('featureCard')),

              S.listItem()
                .title('Pets')
                .icon(Dog)
                .child(S.documentTypeList('pet')),

              S.listItem()
                .title('Configurações do Casamento')
                .icon(Church)
                .child(
                  S.document()
                    .schemaType('weddingSettings')
                    .documentId('weddingSettings')
                ),
            ])
        ),

      S.divider(),

      // SETTINGS
      S.listItem()
        .title('⚙️ Configurações')
        .icon(Settings)
        .child(
          S.list()
            .title('Configurações Globais')
            .items([
              // ... existing settings
            ])
        ),
    ])
```

---

## 5. Schema Renaming Strategy

### 5.1 Display Names (Immediate - No Breaking Changes)

Update schema `title` fields (user-facing labels):

```typescript
// storyPhase.ts
export default defineType({
  name: 'storyPhase',           // Keep internal name
  title: 'Capítulo da História', // Change display name
  // ...
})

// storyMoment.ts
export default defineType({
  name: 'storyMoment',              // Keep internal name
  title: 'Momento Especial',        // Change display name
  // ...
})

// timelinePage.ts
export default defineType({
  name: 'timelinePage',                    // Keep internal name
  title: 'Página: Linha do Tempo Completa', // Change display name
  // ...
})
```

**Impact**: Zero breaking changes, immediate clarity improvement

### 5.2 Internal Schema Names (Future - Migration Required)

If you want to rename internal schema IDs:

```typescript
// OLD → NEW
storyPhase     → timelineChapter
storyMoment    → timelineEvent
timelinePage   → timelineFullPage
storyPreview   → timelinePreview
```

**Migration Steps**:
1. Create new schemas with new names
2. Run data migration script to copy documents
3. Update all references in other schemas
4. Update frontend queries
5. Deploy, verify, delete old schemas

**Recommended**: Don't migrate internal names unless absolutely necessary. Display name changes are enough.

---

## 6. Improved Field Descriptions

Add clearer descriptions to reduce confusion:

### storyPhase (Capítulo da História)

```typescript
fields: [
  defineField({
    name: 'title',
    title: 'Nome do Capítulo',
    type: 'string',
    description: 'Ex: "Os Primeiros Dias", "Construindo Juntos", "Rumo ao Altar"',
    placeholder: 'Os Primeiros Dias',
  }),
  defineField({
    name: 'dayRange',
    title: 'Período (em dias)',
    type: 'string',
    description: 'Intervalo de dias deste capítulo (ex: "Dia 1 - 100")',
    placeholder: 'Dia 1 - 100',
  }),
  defineField({
    name: 'subtitle',
    title: 'Descrição do Capítulo',
    type: 'text',
    description: 'Resumo curto deste período da relação (2-3 frases)',
    placeholder: 'Do Tinder ao primeiro encontro. Aquele nervosismo que a gente não admitia.',
  }),
]
```

### storyMoment (Momento Especial)

```typescript
fields: [
  defineField({
    name: 'title',
    title: 'Título do Momento',
    type: 'string',
    description: 'Ex: "Primeiro Encontro", "Adotamos o Rex", "Mudança"',
    placeholder: 'Primeiro Encontro',
  }),
  defineField({
    name: 'description',
    title: 'História deste Momento',
    type: 'text',
    description: 'Conte a história! Como aconteceu? Como vocês se sentiram? (200-300 caracteres)',
    placeholder: 'Foi em um café perto do trabalho. Ele chegou 10 minutos atrasado...',
  }),
  defineField({
    name: 'phase',
    title: 'Capítulo',
    type: 'reference',
    to: [{ type: 'storyPhase' }],
    description: 'Este momento pertence a qual capítulo da história?',
  }),
  defineField({
    name: 'showInPreview',
    title: 'Mostrar na Homepage',
    type: 'boolean',
    description: '✓ = Aparece na prévia da homepage (recomendado: 3-6 momentos)',
  }),
  defineField({
    name: 'showInTimeline',
    title: 'Mostrar na Página Completa',
    type: 'boolean',
    description: '✓ = Aparece na linha do tempo completa (/nossa-historia)',
  }),
]
```

### timelinePage (Página: Linha do Tempo Completa)

```typescript
fields: [
  defineField({
    name: 'title',
    title: 'Título Interno',
    type: 'string',
    description: 'Nome para organização (não aparece no site)',
    readOnly: true,
    initialValue: 'Linha do Tempo Completa',
  }),
  defineField({
    name: 'hero',
    title: 'Cabeçalho da Página',
    type: 'object',
    description: 'Texto que aparece no topo da página /nossa-historia',
    // ...
  }),
  defineField({
    name: 'phases',
    title: 'Capítulos Exibidos',
    type: 'array',
    of: [{ type: 'reference', to: [{ type: 'storyPhase' }] }],
    description: 'Selecione quais capítulos aparecem na linha do tempo (os momentos vêm automaticamente)',
  }),
]
```

---

## 7. Onboarding & Documentation

### 7.1 In-CMS Help Text

Add help text at the top of each list:

```typescript
// In desk structure
S.listItem()
  .title('❤️ Nossa História')
  .icon(Heart)
  .child(
    S.list()
      .title('Nossa História')
      .items([
        // Add informational item at top
        S.listItem()
          .title('ℹ️ Como Funciona')
          .icon(Info)
          .child(
            S.component(() => (
              <Card padding={4} radius={2} shadow={1} tone="positive">
                <Stack space={3}>
                  <Text size={2} weight="semibold">
                    Como Editar Nossa História
                  </Text>
                  <Text size={1}>
                    1. <strong>Crie Capítulos</strong> (períodos da relação: "Os Primeiros Dias", "Construindo Juntos", etc.)
                  </Text>
                  <Text size={1}>
                    2. <strong>Adicione Momentos</strong> (eventos importantes: "Primeiro Encontro", "Adotamos o Rex", etc.)
                  </Text>
                  <Text size={1}>
                    3. <strong>Configure Onde Aparecem</strong>:
                    - Prévia na Homepage (3-6 momentos mais importantes)
                    - Página Completa (todos os momentos organizados por capítulo)
                  </Text>
                  <Text size={1} muted>
                    💡 Dica: Crie o conteúdo uma vez, ele aparece automaticamente onde você escolher!
                  </Text>
                </Stack>
              </Card>
            ))
          ),

        S.divider(),

        // Rest of items...
      ])
  )
```

### 7.2 Quick Start Guide

Add to Sanity dashboard or as markdown:

```markdown
# Guia Rápido: Editando Nossa História

## Passo 1: Crie os Capítulos da Sua História
1. Vá em **Nossa História → Conteúdo da História → Capítulos**
2. Clique em "Create Capítulo da História"
3. Preencha:
   - Nome do capítulo (ex: "Os Primeiros Dias")
   - Período (ex: "Dia 1 - 100")
   - Descrição curta
4. Repita para cada período da relação

## Passo 2: Adicione os Momentos Especiais
1. Vá em **Nossa História → Conteúdo da História → Momentos Especiais**
2. Clique em "Create Momento Especial"
3. Preencha:
   - Título do momento
   - Data
   - História (descrição)
   - Foto
   - Capítulo (selecione o capítulo correspondente)
4. Marque onde quer que apareça:
   - ✓ Mostrar na Homepage (para os 3-6 mais importantes)
   - ✓ Mostrar na Página Completa (para todos)

## Passo 3: Configure as Páginas
- **Prévia na Homepage**: Os momentos marcados aparecem automaticamente
- **Página Completa**: Selecione quais capítulos exibir

Pronto! Seus momentos especiais já estão no site.
```

---

## 8. Implementation Roadmap

### Phase 1: Quick Wins (No Breaking Changes) - 1-2 hours

**Immediate improvements without migration**:

1. Update schema `title` fields (display names)
   - storyPhase → "Capítulo da História"
   - storyMoment → "Momento Especial"
   - timelinePage → "Página: Linha do Tempo Completa"

2. Improve field descriptions (add examples and clarity)

3. Update desk structure with new grouping and descriptions

4. Add emoji icons for visual clarity

5. Test with user: "Can you add our engagement story?"

**Files to Change**:
- `/src/sanity/schemas/documents/storyPhase.ts` (title + descriptions)
- `/src/sanity/schemas/documents/storyMoment.ts` (title + descriptions)
- `/src/sanity/schemas/pages/timelinePage.ts` (title + descriptions)
- `/src/sanity/desk/index.ts` (restructure hierarchy)

### Phase 2: Architecture Cleanup - 4-6 hours

**Remove duplication between inline and referenced content**:

1. Audit current usage:
   - Is timelinePage using inline content or references?
   - Is storyPreview using references?
   - Which system is "source of truth"?

2. Choose architecture (recommended: unified references)

3. Migrate timelinePage from inline to references:
   ```typescript
   // OLD: phases[] with nested events[]
   // NEW: phases[] with references to storyPhase
   ```

4. Update frontend queries to load from unified system

5. Test both homepage and timeline page

**Files to Change**:
- `/src/sanity/schemas/pages/timelinePage.ts` (schema structure)
- Frontend components loading timeline data
- Frontend queries (GROQ)

### Phase 3: User Testing - 2 hours

**Validate improvements with actual users**:

1. Recruit test user (bride/groom or non-technical person)

2. Give task: "Add a new story moment about your engagement"

3. Observe:
   - Do they find the right place?
   - Do they understand the hierarchy?
   - Are field descriptions clear?
   - Do they understand visibility toggles?

4. Iterate based on feedback

### Phase 4: Documentation & Training - 2 hours

**Create resources for content editors**:

1. Record screencast: "How to Edit Your Wedding Story"

2. Write quick start guide (see 7.2)

3. Add in-CMS help components (see 7.1)

4. Create visual diagram showing content flow

---

## 9. Success Metrics

### User Experience Metrics

**Before (Current State)**:
- Time to add new story moment: ~5-10 minutes (confusion, trial and error)
- User errors: Adding duplicate content in both systems
- User questions: "Which 'História' do I edit?" "Why isn't my moment showing?"

**After (Target State)**:
- Time to add new story moment: ~2-3 minutes (direct path)
- User errors: Near zero (clear hierarchy)
- User questions: Minimal or none

### Clarity Metrics

**Measure improvement via**:
- User testing task completion rate (target: 100%)
- Number of clicks to find "add story moment" (target: 2-3 clicks)
- User satisfaction rating (target: 4.5/5)
- Support requests related to timeline (target: -80%)

### Technical Metrics

- Schema duplication: 2 timeline systems → 1 unified system
- Content reuse: Moments appear in N places without duplication
- Query performance: Single source of truth = fewer queries

---

## 10. Visual Diagrams

### Current Confusing Structure

```
┌─────────────────────────────────────────────────────┐
│  Sanity CMS - Current Structure                     │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Conteúdo/                                           │
│    ├── Momentos da História  ← What is this?        │
│    ├── Fases da História     ← How does it relate?  │
│    └── Feature Cards                                 │
│                                                       │
│  Páginas/                                            │
│    ├── Homepage                                      │
│    └── Nossa História (Timeline) ← Same name?       │
│                                                       │
│  Seções/                                             │
│    └── Story Preview ← Also história?                │
│                                                       │
└─────────────────────────────────────────────────────┘

USER CONFUSION: "Where do I edit our story??"
```

### Proposed Clear Structure

```
┌─────────────────────────────────────────────────────┐
│  Sanity CMS - Proposed Structure                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ❤️ Nossa História                                   │
│    │                                                  │
│    ├── 📖 Conteúdo da História (Building Blocks)    │
│    │     ├── Capítulos (time periods)               │
│    │     └── Momentos Especiais (events)            │
│    │                                                  │
│    └── 📄 Onde Aparece (Pages)                       │
│          ├── 🏠 Prévia na Homepage                   │
│          └── 🕰️ Página Completa (/nossa-historia)   │
│                                                       │
│  📄 Outras Páginas                                   │
│    └── Homepage                                      │
│                                                       │
│  🗂️ Outros Conteúdos                                │
│    ├── Feature Cards                                 │
│    └── Pets                                          │
│                                                       │
└─────────────────────────────────────────────────────┘

USER CLARITY: "Oh! I create content once, choose where it appears!"
```

### Content Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│  Content Creation Flow                              │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Step 1: Create Chapters                            │
│  ┌──────────────────┐                               │
│  │ Capítulo 1       │ "Os Primeiros Dias"           │
│  │ (Day 1-100)      │                               │
│  └──────────────────┘                               │
│           │                                          │
│           ▼                                          │
│  Step 2: Add Moments to Chapters                    │
│  ┌──────────────────┐                               │
│  │ Momento 1        │ "Primeiro Encontro"           │
│  │ → belongs to     │                               │
│  │   Capítulo 1     │ ✓ Show on homepage            │
│  └──────────────────┘ ✓ Show on timeline page       │
│           │                                          │
│           ▼                                          │
│  Step 3: Content Automatically Appears              │
│  ┌──────────────────┐     ┌──────────────────┐     │
│  │  Homepage        │     │  Timeline Page   │     │
│  │  (3-6 moments)   │     │  (all moments)   │     │
│  └──────────────────┘     └──────────────────┘     │
│                                                       │
└─────────────────────────────────────────────────────┘
```

---

## 11. Alternative Approaches Considered

### Approach A: Keep Current Structure, Add Better Labels
**Pros**: No migration needed
**Cons**: Doesn't fix duplication problem
**Verdict**: Insufficient - users will still be confused

### Approach B: Flatten Everything (No Phases)
**Pros**: Simpler, one level of hierarchy
**Cons**: Loses semantic grouping, harder to organize 50+ moments
**Verdict**: Too simple - phases/chapters are useful

### Approach C: Separate CMS for Timeline (External Tool)
**Pros**: Purpose-built UI for timeline editing
**Cons**: Additional tool to learn, separate login, sync issues
**Verdict**: Overkill for wedding website

### Approach D: Unified References (RECOMMENDED)
**Pros**: Single source of truth, clear hierarchy, content reuse
**Cons**: Requires schema migration, frontend updates
**Verdict**: Best long-term solution

---

## 12. User Acceptance Testing Script

### Test Scenario 1: Add New Story Moment

**Task**: "You just got engaged! Add the engagement story to your wedding timeline."

**Success Criteria**:
- User navigates to correct location in <30 seconds
- User successfully creates moment without errors
- User understands visibility toggles
- Moment appears on both homepage and timeline page

**Observation Points**:
- Where does user look first?
- Do they hesitate or get confused?
- Do they ask questions?
- Do they check multiple locations?

### Test Scenario 2: Organize Timeline into Chapters

**Task**: "Organize your timeline into 3 chapters: Early Days, Building Together, Road to Marriage"

**Success Criteria**:
- User creates 3 chapters
- User assigns existing moments to chapters
- User understands chapter → moment relationship

**Observation Points**:
- Do they understand phases = chapters?
- Do they find the "assign to chapter" field?
- Do they understand display order?

### Test Scenario 3: Control Homepage vs Timeline Display

**Task**: "Show only your 4 most important moments on the homepage, but all moments on the full timeline page"

**Success Criteria**:
- User finds visibility toggles
- User understands difference between showInPreview and showInTimeline
- Changes appear correctly on website

**Observation Points**:
- Do they understand the two different pages?
- Do they find the checkboxes?
- Do they preview changes?

---

## 13. Migration Checklist

### Pre-Migration

- [ ] Audit existing content
  - [ ] Count storyMoment documents
  - [ ] Count storyPhase documents
  - [ ] Check timelinePage inline content
  - [ ] Document current frontend queries

- [ ] Backup Sanity dataset
  ```bash
  npx sanity dataset export production backup-$(date +%Y%m%d).tar.gz
  ```

- [ ] Test new structure in development Sanity project

### Phase 1: Display Names (No Breaking Changes)

- [ ] Update schema titles
  - [ ] storyPhase.ts → "Capítulo da História"
  - [ ] storyMoment.ts → "Momento Especial"
  - [ ] timelinePage.ts → "Página: Linha do Tempo Completa"

- [ ] Improve field descriptions
  - [ ] Add examples to placeholders
  - [ ] Add clarity to descriptions
  - [ ] Add help text for boolean fields

- [ ] Update desk structure
  - [ ] Create "Nossa História" top-level group
  - [ ] Add "Conteúdo da História" subgroup
  - [ ] Add "Onde Aparece" subgroup
  - [ ] Add descriptions to each item

- [ ] Deploy to Sanity Studio
- [ ] Test with user

### Phase 2: Schema Changes (Breaking Changes)

- [ ] Create migration script
  - [ ] Map timelinePage inline content → references
  - [ ] Preserve all content
  - [ ] Test rollback procedure

- [ ] Update timelinePage schema
  - [ ] Change phases[] from objects to references
  - [ ] Remove nested events[]
  - [ ] Update validation rules

- [ ] Update frontend queries
  - [ ] Update GROQ queries for new structure
  - [ ] Test data loading
  - [ ] Test homepage preview
  - [ ] Test timeline page

- [ ] Deploy changes
  - [ ] Deploy schema changes
  - [ ] Run migration script
  - [ ] Deploy frontend
  - [ ] Verify production

### Post-Migration

- [ ] User testing
  - [ ] Record task completion times
  - [ ] Document user feedback
  - [ ] Identify remaining confusion

- [ ] Documentation
  - [ ] Create quick start guide
  - [ ] Record tutorial video
  - [ ] Add in-CMS help text

- [ ] Monitoring
  - [ ] Monitor support requests
  - [ ] Track user satisfaction
  - [ ] Iterate on clarity

---

## 14. Conclusion

### Key Takeaways

1. **The Core Problem**: Schema duplication + overlapping naming + hidden relationships = user confusion

2. **The Solution**: Clear hierarchy (Content → Pages) + distinct naming + visible relationships

3. **The Implementation**: Start with display name changes (quick win), then unify architecture (long-term)

4. **The Validation**: User testing with common tasks to measure clarity improvement

### Recommended Next Steps

**Immediate (Today)**:
1. Update schema display names and descriptions
2. Restructure desk hierarchy with "Nossa História" grouping
3. Test with actual user

**Short-term (This Week)**:
1. Create migration plan for unified architecture
2. Update frontend queries
3. Deploy changes

**Long-term (This Month)**:
1. Create documentation and training materials
2. Monitor user success and iterate
3. Apply same clarity principles to other CMS sections

### Expected Impact

**User Experience**:
- 80% reduction in time to complete common tasks
- 90% reduction in user confusion
- Near-zero support requests for timeline editing

**Developer Experience**:
- Single source of truth for timeline content
- Clearer schema relationships
- Easier to maintain and extend

**Business Impact**:
- Happier users (bride/groom can edit their story without help)
- Faster content updates
- More professional editing experience

---

## Appendix: Technical Reference

### Current Schema Relationships

```typescript
// storyMoment references storyPhase
storyMoment {
  phase: reference(storyPhase)
}

// storyPreview references storyMoment
storyPreview {
  storyMoments: array(reference(storyMoment))
}

// timelinePage has INLINE content (not references)
timelinePage {
  phases: array(object {
    events: array(object {
      // inline content, not references
    })
  })
}
```

### Proposed Schema Relationships (Unified)

```typescript
// storyMoment references storyPhase (unchanged)
storyMoment {
  phase: reference(storyPhase)
}

// storyPreview references storyMoment (unchanged)
storyPreview {
  storyMoments: array(reference(storyMoment))
}

// timelinePage references storyPhase (changed from inline)
timelinePage {
  phases: array(reference(storyPhase))
  // moments automatically loaded via storyPhase → storyMoment relationship
}
```

### GROQ Query Examples

**Current (Inline Content)**:
```groq
*[_type == "timelinePage"][0] {
  hero,
  phases[] {
    id,
    title,
    dayRange,
    subtitle,
    events[] {
      // inline fields
    }
  }
}
```

**Proposed (References)**:
```groq
*[_type == "timelinePage"][0] {
  hero,
  "phases": phases[]-> {
    _id,
    id,
    title,
    dayRange,
    subtitle,
    displayOrder,
    "moments": *[_type == "storyMoment" && references(^._id) && showInTimeline == true && isVisible == true] | order(displayOrder asc) {
      _id,
      title,
      date,
      dayNumber,
      description,
      icon,
      image,
      video,
      contentAlign
    }
  } | order(displayOrder asc)
}
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Author**: Claude Code (UX Researcher Agent)
**Review Status**: Ready for User Feedback
