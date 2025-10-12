# Sanity Migration Plan - Supabase to Sanity CMS

## Overview

This document provides a detailed step-by-step migration plan from Supabase content tables to Sanity CMS, including data transformation scripts, validation strategies, and rollback procedures.

---

## Migration Phases

### Phase 1: Setup & Preparation (Week 1)

#### Day 1-2: Environment Setup
- [ ] Create Sanity project on sanity.io
- [ ] Install Sanity dependencies in Next.js project
- [ ] Configure environment variables
- [ ] Set up Sanity Studio route (`/studio`)
- [ ] Configure CORS for localhost and production

#### Day 3-4: Schema Development
- [ ] Create global settings schemas (4 schemas)
- [ ] Create page schemas (3 schemas)
- [ ] Create section schemas (10+ schemas)
- [ ] Create document schemas (4 schemas)

#### Day 5-7: Testing & Validation
- [ ] Test all schemas in Sanity Studio
- [ ] Verify field validations work
- [ ] Test references between documents
- [ ] Configure desk structure
- [ ] Run TypeScript type generation

**Deliverables**: Fully configured Sanity Studio with all schemas

---

### Phase 2: Data Migration (Week 2)

#### Migration Script Structure

```typescript
// scripts/migrate-to-sanity.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

// Initialize clients
const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Migration tracking
interface MigrationLog {
  timestamp: string
  table: string
  recordsProcessed: number
  recordsSuccess: number
  recordsFailed: number
  errors: string[]
}

const migrationLogs: MigrationLog[] = []

function logMigration(log: MigrationLog) {
  migrationLogs.push(log)
  console.log(`✅ ${log.table}: ${log.recordsSuccess}/${log.recordsProcessed} migrated`)
  if (log.recordsFailed > 0) {
    console.error(`❌ ${log.table}: ${log.recordsFailed} failed`)
    log.errors.forEach((err) => console.error(`   - ${err}`))
  }
}

// Save migration report
function saveMigrationReport() {
  const report = {
    migrationDate: new Date().toISOString(),
    totalTables: migrationLogs.length,
    totalRecords: migrationLogs.reduce((sum, log) => sum + log.recordsProcessed, 0),
    successfulRecords: migrationLogs.reduce((sum, log) => sum + log.recordsSuccess, 0),
    failedRecords: migrationLogs.reduce((sum, log) => sum + log.recordsFailed, 0),
    logs: migrationLogs,
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'migration-report.json'),
    JSON.stringify(report, null, 2)
  )

  console.log('\n📊 Migration Report saved to migration-report.json')
}
```

---

#### Step 1: Migrate Global Settings

```typescript
// scripts/migrations/01-migrate-site-settings.ts

async function migrateSiteSettings() {
  console.log('\n🚀 Migrating Site Settings...')
  const errors: string[] = []

  try {
    // Fetch from Supabase
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('*')
      .in('setting_key', ['hero_poster_url', 'hero_couple_url'])

    const posterUrl = siteSettings?.find((s) => s.setting_key === 'hero_poster_url')?.setting_value
    const coupleUrl = siteSettings?.find((s) => s.setting_key === 'hero_couple_url')?.setting_value

    // Create in Sanity
    const doc = await sanity.createOrReplace({
      _id: 'siteSettings',
      _type: 'siteSettings',
      siteTitle: 'Thousand Days of Love',
      siteDescription: 'Hel & Ylana - 1000 dias, 1 casamento',
      domain: 'https://thousanddaysof.love',
      language: 'pt-BR',
      // Note: Images need manual upload to Sanity Studio
      // After uploading, reference them here:
      // heroPosterImage: { _type: 'image', asset: { _ref: 'image-abc123' } }
    })

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'site_settings',
      recordsProcessed: 1,
      recordsSuccess: 1,
      recordsFailed: 0,
      errors: [],
    })

    return doc
  } catch (error) {
    errors.push(`Site Settings: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'site_settings',
      recordsProcessed: 1,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 2: Migrate Wedding Settings

```typescript
// scripts/migrations/02-migrate-wedding-settings.ts

async function migrateWeddingSettings() {
  console.log('\n🚀 Migrating Wedding Settings...')
  const errors: string[] = []

  try {
    // Fetch from Supabase
    const { data: weddingSettings, error } = await supabase
      .from('wedding_settings')
      .select('*')
      .single()

    if (error) throw error

    // Transform and create in Sanity
    const doc = await sanity.createOrReplace({
      _id: 'weddingSettings',
      _type: 'weddingSettings',
      weddingDate: weddingSettings.wedding_date,
      ceremonyTime: weddingSettings.wedding_time,
      receptionTime: weddingSettings.reception_time || null,
      timezone: weddingSettings.wedding_timezone,
      brideName: weddingSettings.bride_name,
      groomName: weddingSettings.groom_name,
      venueName: weddingSettings.venue_name,
      venueAddress: weddingSettings.venue_address,
      venueCity: weddingSettings.venue_city,
      venueState: weddingSettings.venue_state,
      venueZip: weddingSettings.venue_zip || null,
      venueCountry: weddingSettings.venue_country || 'Brasil',
      venueCoordinates: {
        _type: 'object',
        lat: weddingSettings.venue_lat,
        lng: weddingSettings.venue_lng,
      },
      googleMapsPlaceId: weddingSettings.google_maps_place_id || null,
      dressCode: weddingSettings.dress_code,
      dressCodeDescription: weddingSettings.dress_code_description || null,
      rsvpDeadline: weddingSettings.rsvp_deadline || null,
      guestLimit: weddingSettings.guest_limit || null,
      isPublished: weddingSettings.is_published,
    })

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'wedding_settings',
      recordsProcessed: 1,
      recordsSuccess: 1,
      recordsFailed: 0,
      errors: [],
    })

    return doc
  } catch (error) {
    errors.push(`Wedding Settings: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'wedding_settings',
      recordsProcessed: 1,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 3: Migrate Story Cards

```typescript
// scripts/migrations/03-migrate-story-cards.ts

async function migrateStoryCards() {
  console.log('\n🚀 Migrating Story Cards...')
  const errors: string[] = []
  let successCount = 0
  let failedCount = 0

  try {
    // Fetch from Supabase
    const { data: storyCards, error } = await supabase
      .from('story_cards')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')

    if (error) throw error

    const cardRefs: string[] = []

    // Migrate each card
    for (const card of storyCards || []) {
      try {
        const doc = await sanity.create({
          _type: 'storyCard',
          title: card.title,
          description: card.description,
          dayNumber: card.day_number || null,
          displayOrder: card.display_order,
          isVisible: card.is_visible,
        })

        cardRefs.push(doc._id)
        successCount++
      } catch (error) {
        errors.push(`Story Card "${card.title}": ${error}`)
        failedCount++
      }
    }

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'story_cards',
      recordsProcessed: storyCards?.length || 0,
      recordsSuccess: successCount,
      recordsFailed: failedCount,
      errors,
    })

    return cardRefs
  } catch (error) {
    errors.push(`Story Cards: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'story_cards',
      recordsProcessed: 0,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 4: Migrate Homepage Features

```typescript
// scripts/migrations/04-migrate-homepage-features.ts

async function migrateHomepageFeatures() {
  console.log('\n🚀 Migrating Homepage Features...')
  const errors: string[] = []
  let successCount = 0
  let failedCount = 0

  try {
    // Fetch from Supabase
    const { data: features, error } = await supabase
      .from('homepage_features')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')

    if (error) throw error

    const featureRefs: string[] = []

    // Migrate each feature
    for (const feature of features || []) {
      try {
        const doc = await sanity.create({
          _type: 'featureCard',
          title: feature.title,
          description: feature.description,
          iconName: feature.icon_name,
          linkUrl: feature.link_url,
          linkText: feature.link_text || null,
          displayOrder: feature.display_order,
          isVisible: feature.is_visible,
        })

        featureRefs.push(doc._id)
        successCount++
      } catch (error) {
        errors.push(`Feature "${feature.title}": ${error}`)
        failedCount++
      }
    }

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'homepage_features',
      recordsProcessed: features?.length || 0,
      recordsSuccess: successCount,
      recordsFailed: failedCount,
      errors,
    })

    return featureRefs
  } catch (error) {
    errors.push(`Homepage Features: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'homepage_features',
      recordsProcessed: 0,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 5: Migrate Pets

```typescript
// scripts/migrations/05-migrate-pets.ts

async function migratePets() {
  console.log('\n🚀 Migrating Pets...')
  const errors: string[] = []
  let successCount = 0
  let failedCount = 0

  try {
    // Fetch from Supabase
    const { data: pets, error } = await supabase
      .from('pets')
      .select('*')
      .eq('is_visible', true)
      .order('display_order')

    if (error) throw error

    const petRefs: string[] = []

    // Migrate each pet
    for (const pet of pets || []) {
      try {
        const doc = await sanity.create({
          _type: 'pet',
          name: pet.name,
          nickname: pet.nickname || null,
          species: pet.species,
          breed: pet.breed || null,
          personality: pet.personality || null,
          description: pet.description || null,
          dateJoined: pet.date_joined || null,
          displayOrder: pet.display_order,
          isVisible: pet.is_visible,
          // Note: Images need manual upload to Sanity Studio
          // After uploading, add references:
          // image: { _type: 'image', asset: { _ref: 'image-xyz' } }
          // thumbnail: { _type: 'image', asset: { _ref: 'image-abc' } }
        })

        petRefs.push(doc._id)
        successCount++

        console.log(`   ✅ Migrated pet: ${pet.name}`)
      } catch (error) {
        errors.push(`Pet "${pet.name}": ${error}`)
        failedCount++
      }
    }

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'pets',
      recordsProcessed: pets?.length || 0,
      recordsSuccess: successCount,
      recordsFailed: failedCount,
      errors,
    })

    return petRefs
  } catch (error) {
    errors.push(`Pets: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'pets',
      recordsProcessed: 0,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 6: Migrate Timeline Phases

```typescript
// scripts/migrations/06-migrate-timeline-phases.ts

async function migrateTimelinePhases() {
  console.log('\n🚀 Migrating Timeline Phases...')
  const errors: string[] = []

  // Hardcoded phase configuration from code
  const phases = [
    {
      _id: 'phase-primeiros-dias',
      phaseId: 'primeiros_dias',
      title: 'Os Primeiros Dias',
      dayRange: 'Dia 1 - 100',
      subtitle: 'Do Tinder ao primeiro encontro. Aquele nervosismo que a gente não admitia.',
      displayOrder: 1,
    },
    {
      _id: 'phase-construindo-juntos',
      phaseId: 'construindo_juntos',
      title: 'Construindo Juntos',
      dayRange: 'Dia 100 - 500',
      subtitle: 'Quando a gente percebeu que isso aqui era pra valer. Casa própria, primeira dog, e muitas cervejas no Mangue Azul.',
      displayOrder: 2,
    },
    {
      _id: 'phase-nossa-familia',
      phaseId: 'nossa_familia',
      title: 'Nossa Família',
      dayRange: 'Dia 500 - 900',
      subtitle: 'De 1 pra 4 cachorros. Caos total. A gente ama cada segundo.',
      displayOrder: 3,
    },
    {
      _id: 'phase-caminhando-altar',
      phaseId: 'caminhando_altar',
      title: 'Caminhando Pro Altar',
      dayRange: 'Dia 900 - 1000',
      subtitle: 'O pedido em Icaraí. Planejamento do casamento. E a gente aqui, prestes a celebrar 1000 dias juntos.',
      displayOrder: 4,
    },
  ]

  let successCount = 0
  let failedCount = 0

  for (const phase of phases) {
    try {
      await sanity.createOrReplace({
        _type: 'timelinePhase',
        ...phase,
      })
      successCount++
      console.log(`   ✅ Created phase: ${phase.title}`)
    } catch (error) {
      errors.push(`Phase "${phase.title}": ${error}`)
      failedCount++
    }
  }

  logMigration({
    timestamp: new Date().toISOString(),
    table: 'timeline_phases',
    recordsProcessed: phases.length,
    recordsSuccess: successCount,
    recordsFailed: failedCount,
    errors,
  })
}
```

---

#### Step 7: Migrate Timeline Events

```typescript
// scripts/migrations/07-migrate-timeline-events.ts

async function migrateTimelineEvents() {
  console.log('\n🚀 Migrating Timeline Events...')
  const errors: string[] = []
  let successCount = 0
  let failedCount = 0

  try {
    // Fetch from Supabase
    const { data: events, error } = await supabase
      .from('timeline_events')
      .select('*')
      .eq('is_visible', true)
      .order('day_number')

    if (error) throw error

    // Migrate each event
    for (const event of events || []) {
      try {
        const doc = await sanity.create({
          _type: 'timelineEvent',
          dayNumber: event.day_number,
          date: event.date,
          title: event.title,
          description: event.description,
          videoUrl: event.video_url || null,
          contentAlign: event.content_align || 'left',
          layoutType: event.layout_type || 'standard',
          fullbleedImageHeight: event.fullbleed_image_height || 'medium',
          isVisible: event.is_visible,
          phase: {
            _type: 'reference',
            _ref: `phase-${event.phase}`,
          },
          // Note: Images need manual upload to Sanity Studio
          // image: { _type: 'image', asset: { _ref: 'image-xyz' }, alt: event.image_alt }
        })

        successCount++
        console.log(`   ✅ Migrated event: Dia ${event.day_number} - ${event.title}`)
      } catch (error) {
        errors.push(`Event "${event.title}": ${error}`)
        failedCount++
      }
    }

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'timeline_events',
      recordsProcessed: events?.length || 0,
      recordsSuccess: successCount,
      recordsFailed: failedCount,
      errors,
    })
  } catch (error) {
    errors.push(`Timeline Events: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'timeline_events',
      recordsProcessed: 0,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 8: Build Homepage Structure

```typescript
// scripts/migrations/08-build-homepage.ts

async function buildHomepage(
  storyCardRefs: string[],
  petRefs: string[],
  featureRefs: string[]
) {
  console.log('\n🚀 Building Homepage Structure...')
  const errors: string[] = []

  try {
    // Fetch hero text from Supabase
    const { data: heroText } = await supabase
      .from('hero_text')
      .select('*')
      .single()

    // Fetch story preview settings
    const { data: storySettings } = await supabase
      .from('story_preview_settings')
      .select('*')
      .single()

    // Fetch about us content
    const { data: aboutUs } = await supabase
      .from('about_us_items')
      .select('*')
      .eq('is_active', true)

    // Fetch homepage section settings
    const { data: homepageSettings } = await supabase
      .from('homepage_section_settings')
      .select('*')
      .single()

    // Build sections array
    const sections = [
      // 1. Video Hero
      {
        _type: 'videoHero',
        _key: 'videoHero',
        monogram: heroText.monogram,
        brideName: heroText.bride_name,
        groomName: heroText.groom_name,
        namesSeparator: heroText.names_separator,
        tagline: heroText.tagline,
        dateBadge: heroText.date_badge,
        primaryCta: {
          text: heroText.primary_cta_text,
          link: heroText.primary_cta_link,
        },
        secondaryCta: {
          text: heroText.secondary_cta_text,
          link: heroText.secondary_cta_link,
        },
        scrollText: heroText.scroll_text,
      },

      // 2. Event Details
      {
        _type: 'eventDetails',
        _key: 'eventDetails',
        showCountdown: true,
        weddingDate: {
          _type: 'reference',
          _ref: 'weddingSettings',
        },
        dateLabel: 'A Data',
        timeLabel: 'O Horário',
        locationLabel: 'O Local',
        dressCodeLabel: 'O Traje',
      },

      // 3. Story Preview
      {
        _type: 'storyPreview',
        _key: 'storyPreview',
        sectionTitle: storySettings.section_title,
        description: storySettings.section_description,
        photoAlt: storySettings.photo_alt,
        photoCaption: storySettings.photo_caption,
        storyCards: storyCardRefs.map((ref) => ({
          _type: 'reference',
          _ref: ref,
          _key: ref,
        })),
        ctaText: storySettings.cta_text,
        ctaLink: storySettings.cta_link,
      },

      // 4. About Us
      {
        _type: 'aboutUs',
        _key: 'aboutUs',
        heading: aboutUs.find((i) => i.section === 'header')?.title || 'Sobre Nós',
        description: aboutUs.find((i) => i.section === 'header')?.description || '',
        personalityTitle: aboutUs.find((i) => i.section === 'personality')?.title || '',
        personalityDescription: aboutUs.find((i) => i.section === 'personality')?.description || '',
        personalityIcon: aboutUs.find((i) => i.section === 'personality')?.icon || 'Home',
        sharedInterests: aboutUs
          .filter((i) => i.section === 'shared')
          .sort((a, b) => a.display_order - b.display_order)
          .map((i) => ({
            title: i.title,
            description: i.description,
            icon: i.icon,
          })),
        individualInterests: aboutUs
          .filter((i) => i.section === 'individual')
          .sort((a, b) => a.display_order - b.display_order)
          .map((i) => ({
            title: i.title,
            description: i.description,
            icon: i.icon,
          })),
      },

      // 5. Our Family
      {
        _type: 'ourFamily',
        _key: 'ourFamily',
        heading: 'A Matilha',
        description: '4 cachorros que fazem parte da nossa família',
        pets: petRefs.map((ref) => ({
          _type: 'reference',
          _ref: ref,
          _key: ref,
        })),
      },

      // 6. Quick Preview
      {
        _type: 'quickPreview',
        _key: 'quickPreview',
        sectionTitle: homepageSettings.section_title,
        description: homepageSettings.section_description,
        features: featureRefs.map((ref) => ({
          _type: 'reference',
          _ref: ref,
          _key: ref,
        })),
        showHighlights: homepageSettings.show_highlights,
        highlightsTitle: homepageSettings.highlights_title,
      },

      // 7. Wedding Location
      {
        _type: 'weddingLocation',
        _key: 'weddingLocation',
        sectionId: 'location',
        heading: 'Como Chegar',
        description: 'Nosso local de celebração',
        weddingSettings: {
          _type: 'reference',
          _ref: 'weddingSettings',
        },
        showMap: true,
        mapHeight: 500,
      },
    ]

    // Create homepage document
    const homepage = await sanity.createOrReplace({
      _id: 'homePage',
      _type: 'homePage',
      title: 'Homepage',
      sections,
      seo: {
        metaTitle: 'Hel & Ylana - 1000 Dias de Amor',
        metaDescription: '1000 dias. Sim, a gente fez a conta. Celebre conosco no dia 20 de novembro de 2025.',
      },
    })

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'homepage',
      recordsProcessed: 1,
      recordsSuccess: 1,
      recordsFailed: 0,
      errors: [],
    })

    console.log('   ✅ Homepage structure created with 7 sections')
    return homepage
  } catch (error) {
    errors.push(`Homepage: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'homepage',
      recordsProcessed: 1,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Step 9: Build Timeline Page

```typescript
// scripts/migrations/09-build-timeline-page.ts

async function buildTimelinePage() {
  console.log('\n🚀 Building Timeline Page Structure...')
  const errors: string[] = []

  try {
    const timelinePage = await sanity.createOrReplace({
      _id: 'timelinePage',
      _type: 'timelinePage',
      title: 'Nossa História',
      hero: {
        icon: 'Heart',
        heading: 'Nossa História Completa',
        description: 'Daquele "oi" no WhatsApp até o casamento. 1000 dias, muitas histórias, e a gente aqui.',
      },
      phases: [
        { _type: 'reference', _ref: 'phase-primeiros-dias', _key: 'phase1' },
        { _type: 'reference', _ref: 'phase-construindo-juntos', _key: 'phase2' },
        { _type: 'reference', _ref: 'phase-nossa-familia', _key: 'phase3' },
        { _type: 'reference', _ref: 'phase-caminhando-altar', _key: 'phase4' },
      ],
      seo: {
        metaTitle: 'Nossa História - Hel & Ylana',
        metaDescription: '1000 dias juntos, contados dia a dia. Do primeiro encontro ao casamento.',
      },
    })

    logMigration({
      timestamp: new Date().toISOString(),
      table: 'timelinePage',
      recordsProcessed: 1,
      recordsSuccess: 1,
      recordsFailed: 0,
      errors: [],
    })

    console.log('   ✅ Timeline page structure created with 4 phases')
    return timelinePage
  } catch (error) {
    errors.push(`Timeline Page: ${error}`)
    logMigration({
      timestamp: new Date().toISOString(),
      table: 'timelinePage',
      recordsProcessed: 1,
      recordsSuccess: 0,
      recordsFailed: 1,
      errors,
    })
    throw error
  }
}
```

---

#### Master Migration Script

```typescript
// scripts/run-migration.ts

async function runFullMigration() {
  console.log('🚀 Starting Full Migration: Supabase → Sanity\n')
  console.log('=' .repeat(60))

  try {
    // Phase 1: Global Settings
    console.log('\n📦 PHASE 1: Global Settings')
    await migrateSiteSettings()
    await migrateWeddingSettings()

    // Phase 2: Content Documents
    console.log('\n📦 PHASE 2: Content Documents')
    const storyCardRefs = await migrateStoryCards()
    const featureRefs = await migrateHomepageFeatures()
    const petRefs = await migratePets()

    // Phase 3: Timeline
    console.log('\n📦 PHASE 3: Timeline Structure')
    await migrateTimelinePhases()
    await migrateTimelineEvents()

    // Phase 4: Page Structure
    console.log('\n📦 PHASE 4: Page Structure')
    await buildHomepage(storyCardRefs, petRefs, featureRefs)
    await buildTimelinePage()

    // Save migration report
    saveMigrationReport()

    console.log('\n' + '='.repeat(60))
    console.log('✅ MIGRATION COMPLETE!')
    console.log('=' .repeat(60))
    console.log('\n📝 Next Steps:')
    console.log('   1. Upload images to Sanity Studio')
    console.log('   2. Update document image references')
    console.log('   3. Test content in Sanity Studio')
    console.log('   4. Update Next.js components to use Sanity')
    console.log('   5. Test full site with Sanity content\n')
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error)
    saveMigrationReport()
    process.exit(1)
  }
}

// Run migration
runFullMigration()
```

---

### Phase 3: Image Migration (Week 2-3)

#### Image Migration Strategy

**Option 1: Manual Upload** (Recommended for ~50 images)

1. Download all images from Supabase Storage:
```bash
# Download images
node scripts/download-supabase-images.js
```

2. Upload to Sanity Studio:
- Go to Sanity Studio → Media Library
- Drag and drop images
- Organize into folders (pets, timeline, hero, etc.)
- Copy image IDs for document references

3. Update documents with image references:
```typescript
// Update pet with image reference
await sanity
  .patch('pet-linda-id')
  .set({
    image: {
      _type: 'image',
      asset: {
        _ref: 'image-abc123xyz', // From Sanity Media Library
      },
    },
  })
  .commit()
```

**Option 2: Automated Upload** (For 100+ images)

```typescript
// scripts/upload-images-to-sanity.ts
import { createClient } from '@sanity/client'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import axios from 'axios'

async function uploadImageFromUrl(imageUrl: string, filename: string) {
  try {
    // Download image from Supabase
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)

    // Upload to Sanity
    const asset = await sanity.assets.upload('image', buffer, {
      filename,
      contentType: response.headers['content-type'],
    })

    console.log(`✅ Uploaded: ${filename} → ${asset._id}`)
    return asset._id
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error)
    return null
  }
}

async function migrateAllImages() {
  // Get all image URLs from Supabase Storage
  const { data: files } = await supabase.storage.from('wedding-media').list()

  const imageMap: Record<string, string> = {}

  for (const file of files || []) {
    const { data } = supabase.storage.from('wedding-media').getPublicUrl(file.name)
    const assetId = await uploadImageFromUrl(data.publicUrl, file.name)

    if (assetId) {
      imageMap[file.name] = assetId
    }
  }

  // Save mapping for reference updates
  fs.writeFileSync('image-mapping.json', JSON.stringify(imageMap, null, 2))
  console.log('\n✅ Image mapping saved to image-mapping.json')
}
```

---

### Phase 4: Frontend Integration (Week 3-4)

#### Update Components Checklist

- [ ] Update `app/page.tsx` to fetch from Sanity
- [ ] Update `app/historia/page.tsx` to fetch from Sanity
- [ ] Update all section components to use Sanity data structure
- [ ] Create `SectionRenderer` component
- [ ] Add TypeScript types from Sanity
- [ ] Test all pages locally
- [ ] Deploy to staging environment
- [ ] QA testing with real content

---

### Phase 5: Validation & Cleanup (Week 4-5)

#### Validation Checklist

- [ ] All content visible in Sanity Studio
- [ ] All images uploaded and referenced
- [ ] Homepage renders correctly
- [ ] Timeline page renders correctly
- [ ] All sections display properly
- [ ] Mobile responsive design intact
- [ ] Performance metrics acceptable
- [ ] SEO metadata correct

#### Supabase Cleanup

**DO NOT DELETE** (Keep for transactional data):
- `guests`
- `gifts`
- `gift_contributions`
- `payments`
- `gallery_images` (user-uploaded)

**ARCHIVE** (Content tables - no longer needed):
- `hero_text`
- `site_settings`
- `wedding_settings`
- `story_preview_settings`
- `story_cards`
- `homepage_section_settings`
- `homepage_features`
- `about_us_items`
- `pets`
- `timeline_events`

**Archive Strategy**:
```sql
-- Create archive schema
CREATE SCHEMA IF NOT EXISTS archived;

-- Move tables to archive
ALTER TABLE public.hero_text SET SCHEMA archived;
ALTER TABLE public.site_settings SET SCHEMA archived;
ALTER TABLE public.wedding_settings SET SCHEMA archived;
-- ... etc

-- Keep for 3 months before deletion
COMMENT ON SCHEMA archived IS 'Archived content tables - migrated to Sanity CMS on 2025-10-11';
```

---

## Rollback Strategy

### If Migration Fails

**Immediate Rollback** (Within 24 hours):

1. Keep Supabase content tables intact
2. Revert Next.js components to Supabase queries
3. Delete Sanity documents if needed
4. Document issues for retry

**Partial Migration** (Hybrid Approach):

1. Keep using Supabase for some content
2. Migrate specific sections to Sanity
3. Gradually transition over weeks
4. Test each section before full cutover

---

## Post-Migration Monitoring

### Week 1 After Migration

- [ ] Monitor Sanity API usage
- [ ] Check CDN cache hit rates
- [ ] Monitor page load times
- [ ] Track content editor feedback
- [ ] Watch for any missing content
- [ ] Monitor error logs
- [ ] Verify ISR revalidation working
- [ ] Check webhook triggers

### Performance Benchmarks

| Metric | Before (Supabase) | After (Sanity) | Target |
|--------|-------------------|----------------|--------|
| Homepage Load Time | TBD | TBD | < 2s |
| Timeline Load Time | TBD | TBD | < 3s |
| Image Load Time | TBD | TBD | < 1s |
| Time to Interactive | TBD | TBD | < 3s |

---

## Success Criteria

Migration is considered successful when:

- [ ] All content visible in production
- [ ] No broken images or links
- [ ] Content editors can manage content in Sanity Studio
- [ ] Page load times within acceptable range
- [ ] No increase in error rates
- [ ] SEO rankings maintained
- [ ] Mobile experience intact
- [ ] All functionality working (RSVP, gifts, gallery still use Supabase)

---

## Support & Resources

### During Migration

- **Migration Lead**: Hel (Senior Developer)
- **Testing Lead**: TBD
- **Content Editor**: Ylana
- **Sanity Support**: [Slack](https://slack.sanity.io/)

### Post-Migration

- **Documentation**: `/docs/SANITY_ARCHITECTURE.md`
- **Implementation Guide**: `/docs/SANITY_IMPLEMENTATION_GUIDE.md`
- **Content Editor Guide**: Create after migration
- **Troubleshooting Guide**: Document common issues

---

## Timeline Summary

| Week | Phase | Tasks | Deliverable |
|------|-------|-------|-------------|
| 1 | Setup | Install, configure, create schemas | Sanity Studio ready |
| 2 | Migration | Run migration scripts, upload images | All content in Sanity |
| 3 | Integration | Update components, test locally | Frontend using Sanity |
| 4 | Testing | QA, performance testing, fixes | Production ready |
| 5 | Cleanup | Archive Supabase tables, monitoring | Migration complete |

---

## Final Notes

This migration plan provides a structured, phased approach to moving from Supabase to Sanity CMS while maintaining system stability and minimizing downtime. The key is thorough testing at each phase before proceeding to the next.

Remember: **Keep Supabase transactional tables** (guests, gifts, payments) - only migrate **content/marketing tables** to Sanity.
