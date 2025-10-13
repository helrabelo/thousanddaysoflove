# CMS Consolidation Plan: Sanity vs Supabase Architecture

**Project**: Thousand Days of Love Wedding Website
**Date**: 2025-10-12
**Status**: Planning Phase
**Goal**: Consolidate all marketing content in Sanity CMS, keep only transactional data in Supabase

---

## Executive Summary

This document outlines a comprehensive plan to restructure the wedding website's data architecture, moving from a dual CMS/database approach to a clean separation of concerns:

- **Sanity CMS**: All marketing content (pages, sections, gallery, gifts, timeline)
- **Supabase**: Only transactional data (RSVPs, guest responses, payment tracking, analytics)
- **Admin Interface**: Consolidate into Sanity Studio, deprecate redundant Supabase admin pages

**Current State**: Mixed architecture with content in both Sanity and Supabase
**Target State**: Clean separation with Sanity as single source of truth for content

---

## Current State Analysis

### What's Currently in Supabase (Needs Migration to Sanity)

#### 1. Gallery System (Migration 005)
```sql
-- Tables: media_items, timeline_events
-- 180+ lines of schema
-- Features: Photo/video storage, categories, tags, featured items
-- Admin: /admin/galeria (full CRUD interface)
```

**Issues**:
- Gallery is marketing content, not transactional data
- Complex Supabase service layer (SupabaseGalleryService)
- Custom admin UI duplicating CMS functionality
- Storage in Supabase Storage (should be Sanity Assets)

#### 2. Gift Registry (Migration 001)
```sql
-- Table: gifts
-- Features: Gift items, categories, prices, descriptions, images
-- Admin: /admin/presentes (full CRUD interface)
```

**Issues**:
- Gift registry is marketing content (what gifts exist)
- Only gift purchases are transactional (should stay in Supabase)
- Mixing content (gift items) with transactions (gift purchases)

#### 3. Homepage Sections (Migrations 018-021)
```sql
-- Tables: wedding_settings, story_cards, homepage_features, hero_text
-- 4 migrations, 4 admin pages
-- Recently created (2025-10-11)
```

**Issues**:
- Just migrated FROM Sanity TO Supabase (wrong direction!)
- Duplicates Sanity functionality (sections already exist in Sanity)
- Creates maintenance burden with dual content sources

#### 4. Timeline Management (Migrations 010, 011, 014, 017)
```sql
-- Tables: timeline_events, timeline_event_media
-- Full timeline system with fullbleed images
-- Admin: /admin/timeline
```

**Issues**:
- Timeline is storytelling content, not transactional
- Should be in Sanity like other marketing pages
- Complex media management duplicating Sanity assets

#### 5. About Us Content (Migration 009)
```sql
-- Table: about_us_content
-- Admin: /admin/about-us
```

**Issues**:
- Pure marketing content
- Should be managed in Sanity Studio

#### 6. Hero Images & Pets (Migration 016)
```sql
-- Tables: hero_images, our_family_pets
-- Admin: /admin/hero-images, /admin/pets
```

**Issues**:
- Marketing content and assets
- Pets already have Sanity schema (src/sanity/schemas/documents/pet.ts)
- Duplicating CMS functionality

### What Should Stay in Supabase (Transactional)

#### 1. RSVP System (Migration 001, 004, 008, 015)
```sql
-- Table: guests
-- Features: Guest management, RSVP responses, dietary restrictions, plus-one
-- Admin: /admin/guests
```

**Correct**: This is transactional data tied to user responses.

#### 2. Payment Tracking (Migration 001)
```sql
-- Table: payments
-- Features: Mercado Pago integration, PIX payments, gift purchase tracking
-- Admin: /admin/pagamentos
```

**Correct**: Payment transactions must stay in database.

#### 3. Wedding Analytics (Migration 001)
```sql
-- Table: wedding_config (metadata only)
-- Admin: /admin/analytics
```

**Correct**: Analytics and metrics are transactional data.

### Current Admin Routes Audit

| Route | Purpose | Should Be |
|-------|---------|-----------|
| `/admin/guests` | RSVP management | **Keep in Supabase** |
| `/admin/pagamentos` | Payment tracking | **Keep in Supabase** |
| `/admin/analytics` | Statistics dashboard | **Keep in Supabase** |
| `/admin/galeria` | Gallery management | **Move to Sanity** |
| `/admin/presentes` | Gift registry | **Move to Sanity** |
| `/admin/timeline` | Timeline events | **Move to Sanity** |
| `/admin/about-us` | About content | **Move to Sanity** |
| `/admin/hero-images` | Hero images | **Move to Sanity** |
| `/admin/pets` | Pet profiles | **Move to Sanity** |
| `/admin/wedding-settings` | Wedding config | **Move to Sanity** |
| `/admin/story-cards` | Story moments | **Move to Sanity** |
| `/admin/homepage-features` | Homepage features | **Move to Sanity** |
| `/admin/hero-text` | Hero text | **Move to Sanity** |
| `/studio/*` | Sanity Studio | **Keep (Primary CMS)** |

**Current Split**: 3 Supabase admin (correct) + 10 Supabase admin (should be Sanity) + 1 Sanity Studio
**Target Split**: 3 Supabase admin + 0 redundant admin + 1 Sanity Studio (all content)

---

## Migration Strategy

### Phase 1: Schema Design in Sanity (Week 1)

#### 1.1 Gallery Schema (`galleryImage`, `galleryVideo`)
```typescript
// src/sanity/schemas/documents/galleryImage.ts
export default defineType({
  name: 'galleryImage',
  title: 'Foto da Galeria',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3
    },
    {
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip', 'palette']
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Noivado', value: 'engagement' },
          { title: 'Viagens', value: 'travel' },
          { title: 'Encontros', value: 'dates' },
          { title: 'Família', value: 'family' },
          { title: 'Amigos', value: 'friends' },
          { title: 'Momentos Especiais', value: 'special_moments' },
          { title: 'Pedido', value: 'proposal' },
          { title: 'Preparativos', value: 'wedding_prep' },
          { title: 'Bastidores', value: 'behind_scenes' },
          { title: 'Profissional', value: 'professional' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'dateTaken',
      title: 'Data da Foto',
      type: 'date'
    },
    {
      name: 'location',
      title: 'Localização',
      type: 'string'
    },
    {
      name: 'isFeatured',
      title: 'Imagem Destacada',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'isPublic',
      title: 'Visível ao Público',
      type: 'boolean',
      initialValue: true
    },
    {
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      initialValue: 0
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      category: 'category',
      featured: 'isFeatured'
    },
    prepare({ title, media, category, featured }) {
      return {
        title: title,
        subtitle: `${category || 'Sem categoria'}${featured ? ' • Destacada' : ''}`,
        media
      }
    }
  }
})

// src/sanity/schemas/documents/galleryVideo.ts
export default defineType({
  name: 'galleryVideo',
  title: 'Vídeo da Galeria',
  type: 'document',
  fields: [
    // Similar structure to galleryImage
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3
    },
    {
      name: 'video',
      title: 'Vídeo',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    // ... same fields as galleryImage (category, tags, dateTaken, etc.)
  ]
})
```

#### 1.2 Gift Registry Schema (`giftItem`, `giftCategory`)
```typescript
// src/sanity/schemas/documents/giftItem.ts
export default defineType({
  name: 'giftItem',
  title: 'Item da Lista de Presentes',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nome do Presente',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4
    },
    {
      name: 'price',
      title: 'Preço (BRL)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'image',
      title: 'Imagem do Presente',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'giftCategory' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'priority',
      title: 'Prioridade',
      type: 'string',
      options: {
        list: [
          { title: 'Alta', value: 'high' },
          { title: 'Média', value: 'medium' },
          { title: 'Baixa', value: 'low' }
        ]
      },
      initialValue: 'medium'
    },
    {
      name: 'registryUrl',
      title: 'URL do Registro (opcional)',
      type: 'url',
      description: 'Link para loja externa se aplicável'
    },
    {
      name: 'quantityDesired',
      title: 'Quantidade Desejada',
      type: 'number',
      initialValue: 1,
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'isAvailable',
      title: 'Disponível para Compra',
      type: 'boolean',
      initialValue: true,
      description: 'Desmarque quando todas as unidades forem compradas'
    }
  ],
  preview: {
    select: {
      title: 'title',
      price: 'price',
      media: 'image',
      category: 'category.name'
    },
    prepare({ title, price, media, category }) {
      return {
        title: title,
        subtitle: `R$ ${price.toFixed(2)} • ${category || 'Sem categoria'}`,
        media
      }
    }
  }
})

// src/sanity/schemas/documents/giftCategory.ts
export default defineType({
  name: 'giftCategory',
  title: 'Categoria de Presente',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Nome da Categoria',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 2
    },
    {
      name: 'icon',
      title: 'Ícone',
      type: 'string',
      description: 'Nome do ícone Lucide (ex: Home, Coffee, Bed)'
    },
    {
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      initialValue: 0
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description'
    }
  }
})
```

#### 1.3 Timeline Schema (`timelineEvent`)
```typescript
// src/sanity/schemas/documents/timelineEvent.ts
export default defineType({
  name: 'timelineEvent',
  title: 'Evento da Timeline',
  type: 'document',
  fields: [
    {
      name: 'date',
      title: 'Data do Evento',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required()
    },
    {
      name: 'mediaType',
      title: 'Tipo de Mídia',
      type: 'string',
      options: {
        list: [
          { title: 'Foto', value: 'photo' },
          { title: 'Vídeo', value: 'video' }
        ]
      },
      initialValue: 'photo'
    },
    {
      name: 'image',
      title: 'Imagem',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['blurhash', 'lqip']
      },
      hidden: ({ parent }) => parent?.mediaType === 'video'
    },
    {
      name: 'video',
      title: 'Vídeo',
      type: 'file',
      options: {
        accept: 'video/*'
      },
      hidden: ({ parent }) => parent?.mediaType === 'photo'
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail (para vídeos)',
      type: 'image',
      options: {
        hotspot: true
      },
      hidden: ({ parent }) => parent?.mediaType === 'photo'
    },
    {
      name: 'location',
      title: 'Localização',
      type: 'string'
    },
    {
      name: 'milestoneType',
      title: 'Tipo de Marco',
      type: 'string',
      options: {
        list: [
          { title: 'Primeiro Encontro', value: 'first_date' },
          { title: 'Aniversário', value: 'anniversary' },
          { title: 'Viagem', value: 'travel' },
          { title: 'Pedido', value: 'proposal' },
          { title: 'Família', value: 'family' },
          { title: 'Noivado', value: 'engagement' },
          { title: 'Outro', value: 'other' }
        ]
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'isMajorMilestone',
      title: 'Marco Principal',
      type: 'boolean',
      initialValue: false,
      description: 'Eventos destacados na timeline'
    },
    {
      name: 'isFullBleed',
      title: 'Imagem Fullbleed',
      type: 'boolean',
      initialValue: false,
      description: 'Exibir imagem em tela cheia'
    },
    {
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      validation: Rule => Rule.required()
    }
  ],
  orderings: [
    {
      title: 'Data (mais antiga primeiro)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    },
    {
      title: 'Data (mais recente primeiro)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Ordem de Exibição',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
      milestone: 'isMajorMilestone'
    },
    prepare({ title, date, media, milestone }) {
      return {
        title: title,
        subtitle: `${new Date(date).toLocaleDateString('pt-BR')}${milestone ? ' • Marco Principal' : ''}`,
        media
      }
    }
  }
})
```

#### 1.4 About Us Schema (Enhance existing or create new)
```typescript
// src/sanity/schemas/sections/aboutUsContent.ts
export default defineType({
  name: 'aboutUsContent',
  title: 'Conteúdo Sobre Nós',
  type: 'document',
  fields: [
    {
      name: 'groomName',
      title: 'Nome do Noivo',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'groomBio',
      title: 'Bio do Noivo',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'groomImage',
      title: 'Foto do Noivo',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'brideName',
      title: 'Nome da Noiva',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'brideBio',
      title: 'Bio da Noiva',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'brideImage',
      title: 'Foto da Noiva',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'relationshipStory',
      title: 'História do Relacionamento',
      type: 'array',
      of: [{ type: 'block' }]
    }
  ]
})
```

### Phase 2: Data Migration (Week 1-2)

#### 2.1 Gallery Migration Script
```typescript
// scripts/migration/migrate-gallery-to-sanity.ts
import { createClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-10-12',
  useCdn: false
})

async function migrateGallery() {
  console.log('🚀 Starting gallery migration from Supabase to Sanity...')

  // 1. Fetch all media items from Supabase
  const { data: mediaItems, error } = await supabase
    .from('media_items')
    .select('*')
    .order('upload_date', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch media items: ${error.message}`)
  }

  console.log(`📊 Found ${mediaItems.length} media items to migrate`)

  let successCount = 0
  let errorCount = 0

  // 2. Migrate each item to Sanity
  for (const item of mediaItems) {
    try {
      console.log(`\n📸 Migrating: ${item.title}`)

      // Download file from Supabase Storage
      const fileResponse = await fetch(item.url)
      const fileBuffer = Buffer.from(await fileResponse.arrayBuffer())

      // Upload to Sanity
      let sanityAsset
      if (item.media_type === 'photo') {
        sanityAsset = await sanity.assets.upload('image', fileBuffer, {
          filename: path.basename(item.url),
          contentType: fileResponse.headers.get('content-type') || 'image/jpeg'
        })
      } else {
        sanityAsset = await sanity.assets.upload('file', fileBuffer, {
          filename: path.basename(item.url),
          contentType: fileResponse.headers.get('content-type') || 'video/mp4'
        })
      }

      // Create document in Sanity
      const sanityDoc = {
        _type: item.media_type === 'photo' ? 'galleryImage' : 'galleryVideo',
        title: item.title,
        description: item.description,
        [item.media_type === 'photo' ? 'image' : 'video']: {
          _type: item.media_type === 'photo' ? 'image' : 'file',
          asset: {
            _type: 'reference',
            _ref: sanityAsset._id
          }
        },
        category: item.category,
        tags: item.tags || [],
        dateTaken: item.date_taken,
        location: item.location,
        isFeatured: item.is_featured,
        isPublic: item.is_public,
        displayOrder: 0 // Will need manual reordering in Studio
      }

      const result = await sanity.create(sanityDoc)
      console.log(`✅ Created Sanity document: ${result._id}`)
      successCount++

    } catch (error) {
      console.error(`❌ Error migrating ${item.title}:`, error)
      errorCount++
    }
  }

  console.log(`\n🎉 Migration complete!`)
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
}

// Run migration
migrateGallery().catch(console.error)
```

#### 2.2 Gift Registry Migration Script
```typescript
// scripts/migration/migrate-gifts-to-sanity.ts
import { createClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from '@sanity/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2025-10-12',
  useCdn: false
})

async function migrateGifts() {
  console.log('🎁 Starting gift registry migration from Supabase to Sanity...')

  // 1. Create default categories
  const categories = [
    { name: 'Cozinha', slug: 'cozinha', icon: 'ChefHat' },
    { name: 'Quarto', slug: 'quarto', icon: 'Bed' },
    { name: 'Sala', slug: 'sala', icon: 'Sofa' },
    { name: 'Banheiro', slug: 'banheiro', icon: 'Bath' },
    { name: 'Decoração', slug: 'decoracao', icon: 'Sparkles' }
  ]

  const categoryMap = new Map()

  for (const cat of categories) {
    const doc = await sanity.create({
      _type: 'giftCategory',
      name: cat.name,
      slug: { current: cat.slug },
      icon: cat.icon,
      displayOrder: 0
    })
    categoryMap.set(cat.name, doc._id)
    console.log(`✅ Created category: ${cat.name}`)
  }

  // 2. Fetch all gifts from Supabase
  const { data: gifts, error } = await supabase
    .from('gifts')
    .select('*')
    .order('priority')
    .order('name')

  if (error) {
    throw new Error(`Failed to fetch gifts: ${error.message}`)
  }

  console.log(`📊 Found ${gifts.length} gifts to migrate`)

  let successCount = 0
  let errorCount = 0

  // 3. Migrate each gift to Sanity
  for (const gift of gifts) {
    try {
      console.log(`\n🎁 Migrating: ${gift.name}`)

      // Upload image if exists
      let sanityImage
      if (gift.image_url) {
        const imageResponse = await fetch(gift.image_url)
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
        const imageAsset = await sanity.assets.upload('image', imageBuffer, {
          filename: `${gift.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
        })
        sanityImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      }

      // Create gift document
      const sanityDoc = {
        _type: 'giftItem',
        title: gift.name,
        description: gift.description,
        price: gift.price,
        image: sanityImage,
        category: {
          _type: 'reference',
          _ref: categoryMap.get(gift.category) || categoryMap.get('Decoração')
        },
        priority: gift.priority,
        quantityDesired: gift.quantity_desired,
        isAvailable: gift.is_available,
        displayOrder: 0
      }

      const result = await sanity.create(sanityDoc)
      console.log(`✅ Created Sanity gift: ${result._id}`)
      successCount++

    } catch (error) {
      console.error(`❌ Error migrating ${gift.name}:`, error)
      errorCount++
    }
  }

  console.log(`\n🎉 Migration complete!`)
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
}

// Run migration
migrateGifts().catch(console.error)
```

#### 2.3 Timeline Migration Script
```typescript
// scripts/migration/migrate-timeline-to-sanity.ts
import { createClient } from '@supabase/supabase-js'
import { createClient as createSanityClient } from '@sanity/client'

async function migrateTimeline() {
  console.log('📅 Starting timeline migration from Supabase to Sanity...')

  // 1. Fetch all timeline events from Supabase
  const { data: events, error } = await supabase
    .from('timeline_events')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch timeline events: ${error.message}`)
  }

  console.log(`📊 Found ${events.length} timeline events to migrate`)

  // 2. Migrate each event
  for (const event of events) {
    try {
      console.log(`\n📅 Migrating: ${event.title}`)

      // Upload media
      let sanityMedia
      const mediaResponse = await fetch(event.media_url)
      const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer())

      if (event.media_type === 'photo') {
        const imageAsset = await sanity.assets.upload('image', mediaBuffer, {
          filename: path.basename(event.media_url)
        })
        sanityMedia = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset._id
          }
        }
      } else {
        const videoAsset = await sanity.assets.upload('file', mediaBuffer, {
          filename: path.basename(event.media_url)
        })
        sanityMedia = {
          _type: 'file',
          asset: {
            _type: 'reference',
            _ref: videoAsset._id
          }
        }

        // Upload thumbnail if exists
        if (event.thumbnail_url) {
          const thumbResponse = await fetch(event.thumbnail_url)
          const thumbBuffer = Buffer.from(await thumbResponse.arrayBuffer())
          const thumbAsset = await sanity.assets.upload('image', thumbBuffer)
          sanityMedia.thumbnail = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: thumbAsset._id
            }
          }
        }
      }

      // Create timeline event document
      const sanityDoc = {
        _type: 'timelineEvent',
        date: event.date,
        title: event.title,
        description: event.description,
        mediaType: event.media_type,
        [event.media_type === 'photo' ? 'image' : 'video']: sanityMedia,
        location: event.location,
        milestoneType: event.milestone_type,
        isMajorMilestone: event.is_major_milestone,
        isFullBleed: event.is_fullbleed || false,
        displayOrder: event.order_index
      }

      const result = await sanity.create(sanityDoc)
      console.log(`✅ Created Sanity timeline event: ${result._id}`)

    } catch (error) {
      console.error(`❌ Error migrating ${event.title}:`, error)
    }
  }

  console.log(`\n🎉 Timeline migration complete!`)
}

// Run migration
migrateTimeline().catch(console.error)
```

### Phase 3: Frontend Updates (Week 2)

#### 3.1 Update Gallery Component to Use Sanity
```typescript
// src/components/gallery/MasonryGallery.tsx (updated)
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'

const galleryQuery = `*[_type == "galleryImage" && isPublic == true] | order(displayOrder asc) {
  _id,
  title,
  description,
  image,
  category,
  tags,
  dateTaken,
  location,
  isFeatured
}`

export async function MasonryGallery() {
  const images = await client.fetch(galleryQuery)

  return (
    <div className="masonry-grid">
      {images.map((image) => (
        <div key={image._id} className="masonry-item">
          <img
            src={urlForImage(image.image).width(800).url()}
            alt={image.title}
            className="rounded-lg"
          />
          <h3>{image.title}</h3>
          <p>{image.description}</p>
        </div>
      ))}
    </div>
  )
}
```

#### 3.2 Update Gift Registry Component to Use Sanity
```typescript
// src/components/gifts/GiftRegistry.tsx (updated)
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'

const giftsQuery = `*[_type == "giftItem" && isAvailable == true] | order(priority asc, displayOrder asc) {
  _id,
  title,
  description,
  price,
  image,
  category->{
    name,
    icon
  },
  quantityDesired,
  "quantityPurchased": count(*[_type == "payment" && references(^._id) && status == "completed"])
}`

export async function GiftRegistry() {
  const gifts = await client.fetch(giftsQuery)

  return (
    <div className="gift-grid">
      {gifts.map((gift) => (
        <div key={gift._id} className="gift-card">
          {gift.image && (
            <img
              src={urlForImage(gift.image).width(400).url()}
              alt={gift.title}
            />
          )}
          <h3>{gift.title}</h3>
          <p>{gift.description}</p>
          <p className="price">R$ {gift.price.toFixed(2)}</p>
          <p className="category">{gift.category.name}</p>
          <button>Presentear</button>
        </div>
      ))}
    </div>
  )
}
```

#### 3.3 Update Timeline Component to Use Sanity
```typescript
// src/components/timeline/Timeline.tsx (updated)
import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'

const timelineQuery = `*[_type == "timelineEvent"] | order(displayOrder asc) {
  _id,
  date,
  title,
  description,
  mediaType,
  image,
  video,
  thumbnail,
  location,
  milestoneType,
  isMajorMilestone,
  isFullBleed
}`

export async function Timeline() {
  const events = await client.fetch(timelineQuery)

  return (
    <div className="timeline">
      {events.map((event) => (
        <div
          key={event._id}
          className={`timeline-event ${event.isFullBleed ? 'fullbleed' : ''}`}
        >
          <div className="date">{new Date(event.date).toLocaleDateString('pt-BR')}</div>
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          {event.mediaType === 'photo' && event.image && (
            <img
              src={urlForImage(event.image).width(1200).url()}
              alt={event.title}
              className={event.isFullBleed ? 'fullbleed-image' : ''}
            />
          )}
          {event.location && <p className="location">{event.location}</p>}
        </div>
      ))}
    </div>
  )
}
```

### Phase 4: Admin Cleanup (Week 2)

#### 4.1 Deprecate Supabase Admin Pages

**Remove these admin routes**:
```typescript
// Delete these files:
// src/app/admin/galeria/page.tsx
// src/app/admin/presentes/page.tsx
// src/app/admin/timeline/page.tsx
// src/app/admin/about-us/page.tsx
// src/app/admin/hero-images/page.tsx
// src/app/admin/pets/page.tsx
// src/app/admin/wedding-settings/page.tsx
// src/app/admin/story-cards/page.tsx
// src/app/admin/homepage-features/page.tsx
// src/app/admin/hero-text/page.tsx

// Delete associated components:
// src/components/gallery/GalleryAdmin.tsx
// src/components/gallery/MediaUploader.tsx
// src/components/admin/MediaManager.tsx
// src/components/admin/MultiMediaManager.tsx
// src/components/admin/ImageUpload.tsx
// src/components/admin/WeddingConfigTab.tsx
```

#### 4.2 Update Admin Dashboard
```typescript
// src/app/admin/page.tsx (updated)
export default function AdminPage() {
  const adminSections = [
    // KEEP - Transactional
    {
      href: '/admin/guests',
      icon: Users,
      title: 'Gerenciar Convidados',
      description: 'Adicionar convidados e confirmar RSVPs',
      color: 'blush'
    },
    {
      href: '/admin/pagamentos',
      icon: CreditCard,
      title: 'Pagamentos',
      description: 'Rastrear pagamentos PIX e transações',
      color: 'sage'
    },
    {
      href: '/admin/analytics',
      icon: BarChart3,
      title: 'Analytics',
      description: 'Estatísticas e métricas do casamento',
      color: 'purple'
    },

    // NEW - Link to Sanity Studio
    {
      href: '/studio',
      icon: Layout,
      title: 'Gerenciar Conteúdo',
      description: 'Sanity Studio - Galeria, Presentes, Timeline, Páginas',
      color: 'blue',
      external: true
    }
  ]

  return (
    <div className="admin-dashboard">
      <h1>Admin - Mil Dias de Amor</h1>

      <div className="admin-grid">
        {adminSections.map((section) => (
          <AdminCard key={section.href} {...section} />
        ))}
      </div>

      <div className="admin-help">
        <h2>Como Gerenciar Conteúdo</h2>
        <ul>
          <li><strong>RSVPs & Pagamentos</strong>: Use as páginas de admin aqui</li>
          <li><strong>Fotos, Vídeos, Timeline, Presentes</strong>: Acesse o Sanity Studio</li>
          <li><strong>Textos das Páginas</strong>: Edite no Sanity Studio → Páginas</li>
        </ul>
      </div>
    </div>
  )
}
```

#### 4.3 Enhance Sanity Studio Desk Structure
```typescript
// src/sanity/desk/index.ts (updated)
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Conteúdo do Casamento')
    .items([
      // PAGES SECTION
      S.listItem()
        .title('Páginas')
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
                .title('Nossa História (Timeline)')
                .icon(Clock)
                .child(
                  S.document()
                    .schemaType('timelinePage')
                    .documentId('timelinePage')
                ),
              S.divider(),
              S.listItem()
                .title('Outras Páginas')
                .icon(FileText)
                .child(S.documentTypeList('page')),
            ])
        ),

      S.divider(),

      // GALLERY SECTION (NEW)
      S.listItem()
        .title('Galeria')
        .icon(Image)
        .child(
          S.list()
            .title('Galeria de Fotos e Vídeos')
            .items([
              S.listItem()
                .title('Fotos')
                .icon(Image)
                .child(
                  S.documentTypeList('galleryImage')
                    .title('Fotos da Galeria')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Vídeos')
                .icon(Video)
                .child(
                  S.documentTypeList('galleryVideo')
                    .title('Vídeos da Galeria')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // TIMELINE SECTION (NEW)
      S.listItem()
        .title('Nossa História (Timeline)')
        .icon(Clock)
        .child(
          S.documentTypeList('timelineEvent')
            .title('Eventos da Timeline')
            .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
        ),

      S.divider(),

      // GIFTS SECTION (NEW)
      S.listItem()
        .title('Lista de Presentes')
        .icon(Gift)
        .child(
          S.list()
            .title('Lista de Presentes')
            .items([
              S.listItem()
                .title('Presentes')
                .icon(Gift)
                .child(
                  S.documentTypeList('giftItem')
                    .title('Itens da Lista')
                    .defaultOrdering([{ field: 'priority', direction: 'asc' }])
                ),
              S.listItem()
                .title('Categorias')
                .icon(Folder)
                .child(
                  S.documentTypeList('giftCategory')
                    .title('Categorias de Presentes')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // CONTENT SECTION (existing)
      S.listItem()
        .title('Conteúdo')
        .icon(Database)
        .child(
          S.list()
            .title('Conteúdo')
            .items([
              S.listItem()
                .title('Story Cards')
                .icon(Heart)
                .child(
                  S.documentTypeList('storyCard')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Feature Cards')
                .icon(LayoutGrid)
                .child(
                  S.documentTypeList('featureCard')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),
              S.listItem()
                .title('Pets')
                .icon(Dog)
                .child(
                  S.documentTypeList('pet')
                    .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                ),
              S.divider(),
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

      // SETTINGS SECTION (existing)
      S.listItem()
        .title('Configurações')
        .icon(Settings)
        .child(
          S.list()
            .title('Configurações Globais')
            .items([
              S.listItem()
                .title('Configurações do Site')
                .icon(Cog)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Navegação')
                .icon(Menu)
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                ),
              S.listItem()
                .title('Rodapé')
                .icon(PanelBottom)
                .child(
                  S.document()
                    .schemaType('footer')
                    .documentId('footer')
                ),
              S.listItem()
                .title('Configurações de SEO')
                .icon(Search)
                .child(
                  S.document()
                    .schemaType('seoSettings')
                    .documentId('seoSettings')
                ),
            ])
        ),
    ])
```

### Phase 5: Database Cleanup (Week 3)

#### 5.1 Supabase Migration to Remove Tables
```sql
-- Migration: Remove content tables (keep only transactional)
-- DO NOT RUN until Phase 3 is complete and verified in production!

-- Drop content tables (move to Sanity)
DROP TABLE IF EXISTS public.media_items CASCADE;
DROP TABLE IF EXISTS public.timeline_events CASCADE;
DROP TABLE IF EXISTS public.timeline_event_media CASCADE;
DROP TABLE IF EXISTS public.hero_images CASCADE;
DROP TABLE IF EXISTS public.our_family_pets CASCADE;
DROP TABLE IF EXISTS public.about_us_content CASCADE;
DROP TABLE IF EXISTS public.wedding_settings CASCADE;
DROP TABLE IF EXISTS public.story_cards CASCADE;
DROP TABLE IF EXISTS public.story_preview_settings CASCADE;
DROP TABLE IF EXISTS public.homepage_features CASCADE;
DROP TABLE IF EXISTS public.homepage_section_settings CASCADE;
DROP TABLE IF EXISTS public.hero_text CASCADE;

-- Keep transactional tables
-- ✅ guests (RSVP data)
-- ✅ payments (payment transactions)
-- ✅ wedding_config (wedding metadata for analytics)

-- Update gifts table to only track purchases (not gift items)
ALTER TABLE public.gifts DROP COLUMN name;
ALTER TABLE public.gifts DROP COLUMN description;
ALTER TABLE public.gifts DROP COLUMN price;
ALTER TABLE public.gifts DROP COLUMN image_url;
ALTER TABLE public.gifts DROP COLUMN registry_url;
ALTER TABLE public.gifts DROP COLUMN quantity_desired;
ALTER TABLE public.gifts DROP COLUMN category;
ALTER TABLE public.gifts DROP COLUMN priority;

-- Rename to gift_purchases
ALTER TABLE public.gifts RENAME TO gift_purchases;

-- Add reference to Sanity gift ID
ALTER TABLE public.gift_purchases ADD COLUMN sanity_gift_id VARCHAR(50) NOT NULL;
ALTER TABLE public.gift_purchases ADD COLUMN buyer_name VARCHAR(255);
ALTER TABLE public.gift_purchases ADD COLUMN buyer_email VARCHAR(320);
ALTER TABLE public.gift_purchases ADD COLUMN message TEXT;
ALTER TABLE public.gift_purchases ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';

COMMENT ON TABLE public.gift_purchases IS 'Registro de compras de presentes (os itens estão no Sanity CMS)';
COMMENT ON COLUMN public.gift_purchases.sanity_gift_id IS 'ID do presente no Sanity CMS';
```

#### 5.2 Update TypeScript Types
```typescript
// src/types/wedding.ts (updated)

// REMOVE - These types are now in Sanity
// - MediaItem
// - GalleryStats
// - TimelineEvent
// - GiftItem

// KEEP - Transactional types
export interface Guest {
  id: string
  name: string
  email: string
  phone: string | null
  attending: boolean | null
  dietary_restrictions: string | null
  plus_one: boolean
  plus_one_name: string | null
  invitation_code: string
  rsvp_date: string | null
  special_requests: string | null
  created_at: string
  updated_at: string
}

export interface GiftPurchase {
  id: string
  sanity_gift_id: string // Reference to Sanity CMS
  buyer_name: string
  buyer_email: string
  message: string | null
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
}

export interface Payment {
  id: string
  gift_purchase_id: string
  guest_id: string | null
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: 'pix' | 'credit_card' | 'bank_transfer'
  mercado_pago_payment_id: string | null
  message: string | null
  created_at: string
  updated_at: string
}

// NEW - Sanity types (generated from schemas)
export interface SanityGalleryImage {
  _id: string
  _type: 'galleryImage'
  title: string
  description?: string
  image: SanityImageAsset
  category: string
  tags?: string[]
  dateTaken?: string
  location?: string
  isFeatured: boolean
  isPublic: boolean
  displayOrder: number
}

export interface SanityGiftItem {
  _id: string
  _type: 'giftItem'
  title: string
  description?: string
  price: number
  image?: SanityImageAsset
  category: {
    _ref: string
    name: string
    icon: string
  }
  priority: 'high' | 'medium' | 'low'
  quantityDesired: number
  quantityPurchased: number // Computed from gift_purchases table
  isAvailable: boolean
  displayOrder: number
}

export interface SanityTimelineEvent {
  _id: string
  _type: 'timelineEvent'
  date: string
  title: string
  description: string
  mediaType: 'photo' | 'video'
  image?: SanityImageAsset
  video?: SanityFileAsset
  thumbnail?: SanityImageAsset
  location?: string
  milestoneType: string
  isMajorMilestone: boolean
  isFullBleed: boolean
  displayOrder: number
}
```

---

## Implementation Timeline

### Week 1: Schema Design & Migration Scripts
- **Day 1-2**: Create all Sanity schemas (gallery, gifts, timeline, about us)
- **Day 3-4**: Write and test migration scripts with sample data
- **Day 5**: Run full migration on staging environment

### Week 2: Frontend Updates & Testing
- **Day 1-2**: Update gallery, gifts, and timeline components to use Sanity
- **Day 3**: Update admin dashboard, deprecate old admin pages
- **Day 4**: End-to-end testing in staging
- **Day 5**: Production deployment

### Week 3: Database Cleanup & Monitoring
- **Day 1**: Monitor production for issues
- **Day 2-3**: Run Supabase cleanup migration (drop content tables)
- **Day 4**: Verify all functionality works with new architecture
- **Day 5**: Documentation and handoff

**Total Duration**: 3 weeks (15 working days)

---

## Risk Assessment & Rollback Strategy

### High Risks

#### Risk 1: Data Loss During Migration
**Mitigation**:
- Full Supabase database backup before migration
- Test migration scripts on staging with production data copy
- Keep Supabase tables read-only for 2 weeks after migration
- Verify 100% data integrity before dropping tables

**Rollback**: Restore from Supabase backup, revert frontend code to previous commit

#### Risk 2: Broken Frontend After Sanity Switch
**Mitigation**:
- Comprehensive testing on staging environment
- Feature flags to toggle Sanity/Supabase data sources
- Canary deployment (10% traffic first)
- Monitor error rates and rollback if >1% increase

**Rollback**: Feature flag back to Supabase, investigate issues

#### Risk 3: Performance Degradation
**Mitigation**:
- Benchmark Sanity query performance vs. Supabase
- Implement proper caching strategy (Next.js ISR + Sanity CDN)
- Monitor page load times and Core Web Vitals
- Optimize image delivery with Sanity's image pipeline

**Rollback**: Revert to Supabase if performance drops >20%

### Medium Risks

#### Risk 4: Admin UX Confusion
**Mitigation**:
- Clear documentation in admin dashboard
- Video tutorials for Sanity Studio
- Side-by-side comparison guide
- Training session before migration

**Rollback**: Keep old admin pages in "legacy" mode for 1 month

#### Risk 5: SEO Impact from URL Changes
**Mitigation**:
- Maintain same URL structure
- Implement 301 redirects if URLs change
- Monitor search rankings and traffic
- Update sitemap.xml immediately

**Rollback**: Restore previous URL structure via redirects

---

## Success Criteria

### Phase 1 Success Metrics
- ✅ All Sanity schemas created and validated
- ✅ Migration scripts tested successfully on staging
- ✅ 100% data integrity verified (no data loss)

### Phase 2 Success Metrics
- ✅ All frontend components updated to use Sanity
- ✅ Zero console errors in production
- ✅ Page load times < 2 seconds (same or better than before)
- ✅ Lighthouse scores maintained or improved

### Phase 3 Success Metrics
- ✅ Admin dashboard consolidated (3 Supabase pages + 1 Sanity Studio)
- ✅ Content editors successfully using Sanity Studio
- ✅ Zero support tickets related to admin confusion

### Phase 4 Success Metrics
- ✅ Supabase tables cleaned up (only transactional data)
- ✅ Database size reduced by 60%+ (estimate)
- ✅ Zero runtime errors for 7 days post-cleanup

---

## Post-Migration Benefits

### Developer Experience
- **Single Source of Truth**: No more dual CMS/database confusion
- **Better Type Safety**: Sanity generates TypeScript types automatically
- **Faster Development**: Leverage Sanity's powerful query language (GROQ)
- **Version Control**: Content versioning built into Sanity

### Content Editor Experience
- **Professional CMS**: Sanity Studio is built for content management
- **Rich Media Handling**: Drag-and-drop uploads, automatic image optimization
- **Preview Mode**: Live preview of changes before publishing
- **Collaborative Editing**: Multiple editors without conflicts

### Performance
- **CDN-Backed**: Sanity assets served from global CDN
- **Optimized Images**: Automatic WebP conversion, responsive images
- **Query Caching**: Built-in caching layer for faster page loads
- **Reduced Database Load**: Supabase handles only transactional queries

### Cost Optimization
- **Supabase**: Reduced storage and compute costs (only transactional data)
- **Vercel**: Better edge caching with static Sanity content
- **Sanity**: Free tier sufficient for wedding site (< 10 editors)

---

## Rollback Checklist

If critical issues occur during migration:

1. ⬜ Stop all migration scripts immediately
2. ⬜ Set frontend to read from Supabase (feature flag)
3. ⬜ Verify Supabase data integrity (no writes during migration)
4. ⬜ Restore Supabase backup if data corruption detected
5. ⬜ Revert frontend deployment to previous version
6. ⬜ Investigate root cause before retry
7. ⬜ Communicate status to stakeholders

---

## Dependencies

### Required Before Starting
- ✅ Sanity project configured and deployed
- ✅ Supabase full database backup created
- ✅ Staging environment with production data copy
- ⬜ SANITY_API_TOKEN with write permissions
- ⬜ SUPABASE_SERVICE_ROLE_KEY for migration scripts
- ⬜ All team members trained on Sanity Studio

### External Services
- **Sanity**: Project configured, dataset created, CDN enabled
- **Supabase**: Read-only mode during migration, backups enabled
- **Vercel**: Staging and production environments ready
- **GitHub**: Feature branch for migration code

---

## Next Steps

1. **Review this plan** with technical and content stakeholders
2. **Schedule migration window** (recommend weekend with low traffic)
3. **Create Sanity schemas** following Phase 1 specifications
4. **Test migration scripts** on staging environment
5. **Prepare rollback procedures** and communication plan
6. **Execute migration** following timeline above
7. **Monitor production** for 48 hours post-migration
8. **Run cleanup migration** after 2-week verification period

---

## Questions & Answers

### Q: Why not keep both Supabase and Sanity for content?
**A**: Dual content sources create maintenance burden, data sync issues, and developer confusion. Sanity is purpose-built for content, Supabase for transactions.

### Q: What about the recent migrations (018-021) we just created?
**A**: Those were created on 2025-10-11 to move content FROM hardcoded TO Supabase. This plan reverses that decision to move content TO Sanity (correct architecture).

### Q: Will this affect RSVP functionality?
**A**: No. RSVPs, guest management, and payment tracking stay in Supabase unchanged.

### Q: How do we track gift purchases if gifts are in Sanity?
**A**: Gift *items* (marketing content) go to Sanity. Gift *purchases* (transactions) stay in Supabase with a reference to the Sanity gift ID.

### Q: What's the estimated downtime?
**A**: Zero downtime. Frontend switches data sources seamlessly. Worst case: feature flag rollback takes 2 minutes.

---

**Document Version**: 1.0
**Last Updated**: 2025-10-12
**Author**: Claude Code (Studio Orchestrator)
**Review Status**: Awaiting stakeholder approval
