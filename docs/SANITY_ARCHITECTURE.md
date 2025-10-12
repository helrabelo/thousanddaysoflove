# Sanity CMS Architecture - Thousand Days of Love

## Overview

This document outlines a comprehensive Sanity CMS architecture for the Thousand Days of Love wedding website, inspired by Din Tai Fung's modular page/section pattern. The architecture follows the principle of **DRY (Don't Repeat Yourself)** with reusable sections that can be composed into pages.

### Architecture Principles

1. **Modular Sections**: Each section component is a reusable Sanity document that can be referenced by multiple pages
2. **Page Composition**: Pages are built by selecting and ordering sections/modules
3. **Global Settings**: Site-wide configurations managed centrally
4. **Type Safety**: Full TypeScript support with generated types
5. **Content Migration**: Clear mapping from Supabase to Sanity
6. **Separation of Concerns**: Content (Sanity) vs. Transactional Data (Supabase)

### What Stays in Supabase

**Transactional/Dynamic Data** (NOT migrating to Sanity):
- `guests` - RSVP submissions and guest management
- `gifts` - Gift registry items and purchase tracking
- `gift_contributions` - Payment transactions
- `payments` - PIX payment records
- `gallery_images` - User-uploaded photos (dynamic)
- Analytics and user interactions

**What Migrates to Sanity** (Content/Marketing):
- All page content and structure
- Hero sections, about us, timeline events
- Story cards, homepage features
- Pet profiles, wedding settings
- Navigation and footer
- Site-wide settings

---

## 1. File Structure

```
sanity/
├── schema/
│   ├── index.ts                    # Schema registry
│   ├── globals/                    # Singleton documents
│   │   ├── siteSettings.ts
│   │   ├── navigation.ts
│   │   ├── footer.ts
│   │   └── seoSettings.ts
│   ├── pages/                      # Page documents
│   │   ├── page.ts                 # Generic page type
│   │   ├── homePage.ts             # Homepage-specific config
│   │   └── timelinePage.ts         # Timeline-specific config
│   ├── sections/                   # Reusable section modules
│   │   ├── heroSections/
│   │   │   ├── videoHero.ts
│   │   │   └── imageHero.ts
│   │   ├── content/
│   │   │   ├── aboutUs.ts
│   │   │   ├── storyPreview.ts
│   │   │   ├── eventDetails.ts
│   │   │   ├── quickPreview.ts
│   │   │   └── weddingLocation.ts
│   │   ├── family/
│   │   │   └── ourFamily.ts
│   │   └── timeline/
│   │       ├── timelinePhase.ts
│   │       └── timelineEvent.ts
│   ├── objects/                    # Reusable field objects
│   │   ├── link.ts
│   │   ├── ctaButton.ts
│   │   ├── richText.ts
│   │   ├── videoAsset.ts
│   │   └── imageAsset.ts
│   └── documents/                  # Standalone documents
│       ├── pet.ts
│       ├── storyCard.ts
│       ├── featureCard.ts
│       └── weddingSettings.ts
├── lib/
│   ├── client.ts                   # Sanity client config
│   ├── queries.ts                  # GROQ queries
│   └── image.ts                    # Image URL builder
├── desk/
│   └── structure.ts                # Studio desk structure
└── sanity.config.ts                # Studio configuration
```

---

## 2. Schema Architecture

### 2.1 Global Settings (Singletons)

#### `siteSettings.ts` - Site-Wide Configuration

```typescript
// sanity/schema/globals/siteSettings.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'media', title: 'Media Assets' },
    { name: 'social', title: 'Social Media' },
  ],
  fields: [
    // General
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'general',
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      group: 'general',
    },
    {
      name: 'domain',
      title: 'Domain',
      type: 'url',
      description: 'Primary domain (e.g., https://thousanddaysof.love)',
      group: 'general',
    },
    {
      name: 'language',
      title: 'Default Language',
      type: 'string',
      options: {
        list: [
          { title: 'Português (Brasil)', value: 'pt-BR' },
          { title: 'English', value: 'en' },
        ],
      },
      initialValue: 'pt-BR',
      group: 'general',
    },

    // Media Assets
    {
      name: 'heroPosterImage',
      title: 'Hero Video Poster',
      type: 'image',
      description: 'Poster image for hero video (1920x1080)',
      options: {
        hotspot: true,
      },
      group: 'media',
    },
    {
      name: 'heroCoupleImage',
      title: 'Hero Couple Image (Reduced Motion)',
      type: 'image',
      description: 'Fallback image for users with reduced motion',
      options: {
        hotspot: true,
      },
      group: 'media',
    },
    {
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      group: 'media',
    },
    {
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: '32x32px .ico or .png',
      group: 'media',
    },
    {
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      description: 'Default social sharing image (1200x630)',
      group: 'media',
    },

    // Social Media
    {
      name: 'instagramHandle',
      title: 'Instagram Handle',
      type: 'string',
      validation: (Rule) => Rule.regex(/^@?[a-zA-Z0-9._]+$/),
      group: 'social',
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code (e.g., +5511999999999)',
      group: 'social',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global site configuration',
      }
    },
  },
})
```

#### `navigation.ts` - Navigation Menu

```typescript
// sanity/schema/globals/navigation.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: () => '🧭',
  fields: [
    {
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      initialValue: 'Main Navigation',
      readOnly: true,
    },
    {
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link',
              type: 'string',
              description: 'Internal link (/historia) or anchor (#location)',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'isExternal',
              title: 'External Link?',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'openInNewTab',
              title: 'Open in New Tab?',
              type: 'boolean',
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        },
      ],
    },
    {
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show CTA Button?',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Confirmar Presença',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          initialValue: '/rsvp',
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Navigation Menu',
        subtitle: 'Site navigation configuration',
      }
    },
  },
})
```

#### `footer.ts` - Footer Configuration

```typescript
// sanity/schema/globals/footer.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: () => '🦶',
  fields: [
    {
      name: 'title',
      title: 'Footer Title',
      type: 'string',
      initialValue: 'Footer',
      readOnly: true,
    },
    {
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      initialValue: '© 2025 Hel & Ylana. Feito com amor.',
    },
    {
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
            },
            {
              name: 'href',
              title: 'Link',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'showSocialLinks',
      title: 'Show Social Links?',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Footer',
        subtitle: 'Footer configuration',
      }
    },
  },
})
```

#### `seoSettings.ts` - SEO Defaults

```typescript
// sanity/schema/globals/seoSettings.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'seoSettings',
  title: 'SEO Settings',
  type: 'document',
  icon: () => '🔍',
  fields: [
    {
      name: 'title',
      title: 'SEO Settings',
      type: 'string',
      initialValue: 'SEO Settings',
      readOnly: true,
    },
    {
      name: 'defaultMetaTitle',
      title: 'Default Meta Title',
      type: 'string',
      description: 'Fallback meta title for pages without custom SEO',
      validation: (Rule) => Rule.max(60),
    },
    {
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      description: 'GA4 Measurement ID (e.g., G-XXXXXXXXXX)',
    },
    {
      name: 'facebookPixelId',
      title: 'Facebook Pixel ID',
      type: 'string',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'SEO Settings',
        subtitle: 'Default SEO configuration',
      }
    },
  },
})
```

---

### 2.2 Page Documents

#### `page.ts` - Generic Page Type (DTF Pattern)

```typescript
// sanity/schema/pages/page.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: () => '📄',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL path (e.g., "/historia")',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    },

    // DTF Pattern: Modular Section Builder
    {
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Build your page by adding sections',
      of: [
        // Hero Sections
        { type: 'videoHero' },
        { type: 'imageHero' },

        // Content Sections
        { type: 'aboutUs' },
        { type: 'storyPreview' },
        { type: 'eventDetails' },
        { type: 'quickPreview' },
        { type: 'weddingLocation' },
        { type: 'ourFamily' },

        // Timeline Sections
        { type: 'timelinePhase' },
      ],
      group: 'content',
    },

    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          description: 'Social sharing image (1200x630)',
        },
        {
          name: 'noIndex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false,
        },
      ],
    },

    // Settings
    {
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      group: 'settings',
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'settings',
    },
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      published: 'isPublished',
    },
    prepare({ title, slug, published }) {
      return {
        title: title,
        subtitle: `/${slug || ''}${published ? '' : ' (Draft)'}`,
      }
    },
  },
})
```

#### `homePage.ts` - Homepage Configuration

```typescript
// sanity/schema/pages/homePage.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: () => '🏠',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Homepage',
      readOnly: true,
    },
    {
      name: 'sections',
      title: 'Homepage Sections',
      description: 'Drag and drop to reorder sections',
      type: 'array',
      of: [
        { type: 'videoHero' },
        { type: 'eventDetails' },
        { type: 'storyPreview' },
        { type: 'aboutUs' },
        { type: 'ourFamily' },
        { type: 'quickPreview' },
        { type: 'weddingLocation' },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Main landing page',
      }
    },
  },
})
```

#### `timelinePage.ts` - Timeline Page Configuration

```typescript
// sanity/schema/pages/timelinePage.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'timelinePage',
  title: 'Timeline Page',
  type: 'document',
  icon: () => '📅',
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'phases', title: 'Timeline Phases' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Nossa História',
      group: 'hero',
    },

    // Hero Section
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      fields: [
        {
          name: 'icon',
          title: 'Icon',
          type: 'string',
          description: 'Lucide icon name (e.g., Heart)',
          initialValue: 'Heart',
        },
        {
          name: 'heading',
          title: 'Heading',
          type: 'string',
          initialValue: 'Nossa História Completa',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        },
      ],
    },

    // Timeline Phases (hardcoded config from code)
    {
      name: 'phases',
      title: 'Timeline Phases',
      type: 'array',
      group: 'phases',
      of: [
        {
          type: 'reference',
          to: [{ type: 'timelinePhase' }],
        },
      ],
      validation: (Rule) => Rule.max(4),
    },

    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Timeline Page',
        subtitle: '/historia',
      }
    },
  },
})
```

---

### 2.3 Section Schemas (Modular Components)

#### Hero Sections

##### `videoHero.ts` - Video Hero Section

```typescript
// sanity/schema/sections/heroSections/videoHero.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'videoHero',
  title: 'Video Hero Section',
  type: 'object',
  icon: () => '🎥',
  groups: [
    { name: 'text', title: 'Text Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'cta', title: 'Call to Actions' },
  ],
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Optional HTML ID for anchor links',
      group: 'text',
    },

    // Text Content
    {
      name: 'monogram',
      title: 'Monogram',
      type: 'string',
      description: 'e.g., "H ♥ Y"',
      initialValue: 'H ♥ Y',
      group: 'text',
    },
    {
      name: 'brideName',
      title: "Bride's Name",
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'text',
    },
    {
      name: 'groomName',
      title: "Groom's Name",
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'text',
    },
    {
      name: 'namesSeparator',
      title: 'Names Separator',
      type: 'string',
      description: 'Character between names',
      initialValue: '&',
      group: 'text',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Subtitle below names',
      group: 'text',
    },
    {
      name: 'dateBadge',
      title: 'Date Badge',
      type: 'string',
      description: 'Wedding date in badge format (e.g., "20.11.2025")',
      group: 'text',
    },

    // Media
    {
      name: 'videoFile',
      title: 'Hero Video',
      type: 'file',
      options: {
        accept: 'video/*',
      },
      group: 'media',
    },
    {
      name: 'posterImage',
      title: 'Video Poster Image',
      type: 'image',
      description: 'Thumbnail shown before video loads',
      options: {
        hotspot: true,
      },
      group: 'media',
    },
    {
      name: 'fallbackImage',
      title: 'Fallback Image (Reduced Motion)',
      type: 'image',
      description: 'Image shown for users with reduced motion preference',
      options: {
        hotspot: true,
      },
      group: 'media',
    },

    // CTAs
    {
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'object',
      group: 'cta',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Confirmar Presença',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          initialValue: '/rsvp',
        },
      ],
    },
    {
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      group: 'cta',
      fields: [
        {
          name: 'text',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Nossa História',
        },
        {
          name: 'link',
          title: 'Button Link',
          type: 'string',
          initialValue: '/historia',
        },
      ],
    },
    {
      name: 'scrollText',
      title: 'Scroll Indicator Text',
      type: 'string',
      initialValue: 'Explorar',
      group: 'cta',
    },
  ],
  preview: {
    select: {
      bride: 'brideName',
      groom: 'groomName',
      tagline: 'tagline',
    },
    prepare({ bride, groom, tagline }) {
      return {
        title: 'Video Hero',
        subtitle: `${bride} & ${groom}${tagline ? ` - ${tagline}` : ''}`,
        media: () => '🎥',
      }
    },
  },
})
```

##### `imageHero.ts` - Image Hero Section

```typescript
// sanity/schema/sections/heroSections/imageHero.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'imageHero',
  title: 'Image Hero Section',
  type: 'object',
  icon: () => '🖼️',
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'overlayOpacity',
      title: 'Overlay Opacity',
      type: 'number',
      description: 'Dark overlay opacity (0-100)',
      initialValue: 50,
      validation: (Rule) => Rule.min(0).max(100),
    },
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'backgroundImage',
    },
    prepare({ title, media }) {
      return {
        title: 'Image Hero',
        subtitle: title,
        media,
      }
    },
  },
})
```

#### Content Sections

##### `eventDetails.ts` - Event Details Section

```typescript
// sanity/schema/sections/content/eventDetails.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'eventDetails',
  title: 'Event Details Section',
  type: 'object',
  icon: () => '🎊',
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    },
    {
      name: 'showCountdown',
      title: 'Show Countdown?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'weddingDate',
      title: 'Wedding Date',
      type: 'reference',
      to: [{ type: 'weddingSettings' }],
      description: 'Reference to wedding settings (date, time, venue)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'dateLabel',
      title: 'Date Label',
      type: 'string',
      initialValue: 'A Data',
    },
    {
      name: 'timeLabel',
      title: 'Time Label',
      type: 'string',
      initialValue: 'O Horário',
    },
    {
      name: 'locationLabel',
      title: 'Location Label',
      type: 'string',
      initialValue: 'O Local',
    },
    {
      name: 'dressCodeLabel',
      title: 'Dress Code Label',
      type: 'string',
      initialValue: 'O Traje',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Event Details',
        subtitle: 'Countdown + Wedding Info',
        media: () => '🎊',
      }
    },
  },
})
```

##### `storyPreview.ts` - Story Preview Section

```typescript
// sanity/schema/sections/content/storyPreview.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'storyPreview',
  title: 'Story Preview Section',
  type: 'object',
  icon: () => '💕',
  groups: [
    { name: 'header', title: 'Header', default: true },
    { name: 'photo', title: 'Proposal Photo' },
    { name: 'cards', title: 'Story Cards' },
  ],
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      group: 'header',
    },

    // Header
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Nossa História',
      group: 'header',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'header',
    },

    // Proposal Photo (Left Side)
    {
      name: 'photoUrl',
      title: 'Proposal Photo',
      type: 'image',
      description: 'Photo displayed on left side',
      options: {
        hotspot: true,
      },
      group: 'photo',
    },
    {
      name: 'photoAlt',
      title: 'Photo Alt Text',
      type: 'string',
      group: 'photo',
    },
    {
      name: 'photoCaption',
      title: 'Photo Caption',
      type: 'string',
      description: 'Caption below photo',
      group: 'photo',
    },

    // Story Cards (Right Side)
    {
      name: 'storyCards',
      title: 'Story Cards',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'storyCard' }],
        },
      ],
      validation: (Rule) => Rule.max(3),
      group: 'cards',
    },

    // CTA Button
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Ver História Completa',
      group: 'header',
    },
    {
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      initialValue: '/historia',
      group: 'header',
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      cards: 'storyCards',
    },
    prepare({ title, cards }) {
      return {
        title: 'Story Preview',
        subtitle: `${title} - ${cards?.length || 0} cards`,
        media: () => '💕',
      }
    },
  },
})
```

##### `aboutUs.ts` - About Us Section

```typescript
// sanity/schema/sections/content/aboutUs.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'aboutUs',
  title: 'About Us Section',
  type: 'object',
  icon: () => '👫',
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Sobre Nós',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },

    // Personality Section
    {
      name: 'personalityTitle',
      title: 'Personality Title',
      type: 'string',
      initialValue: 'Caseiros & Introvertidos por Natureza',
    },
    {
      name: 'personalityDescription',
      title: 'Personality Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'personalityIcon',
      title: 'Personality Icon',
      type: 'string',
      description: 'Lucide icon name (e.g., Home)',
      initialValue: 'Home',
    },

    // Shared Interests
    {
      name: 'sharedInterests',
      title: 'Shared Interests',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name',
            },
          ],
          preview: {
            select: {
              title: 'title',
              icon: 'icon',
            },
            prepare({ title, icon }) {
              return {
                title,
                subtitle: icon,
              }
            },
          },
        },
      ],
    },

    // Individual Interests
    {
      name: 'individualInterests',
      title: 'Individual Interests',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'string',
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({ heading }) {
      return {
        title: 'About Us',
        subtitle: heading,
        media: () => '👫',
      }
    },
  },
})
```

##### `ourFamily.ts` - Our Family (Pets) Section

```typescript
// sanity/schema/sections/family/ourFamily.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'ourFamily',
  title: 'Our Family Section',
  type: 'object',
  icon: () => '🐾',
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'A Matilha',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'pets',
      title: 'Pets',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'pet' }],
        },
      ],
      validation: (Rule) => Rule.max(4),
    },
  ],
  preview: {
    select: {
      heading: 'heading',
      pets: 'pets',
    },
    prepare({ heading, pets }) {
      return {
        title: 'Our Family',
        subtitle: `${heading} - ${pets?.length || 0} pets`,
        media: () => '🐾',
      }
    },
  },
})
```

##### `quickPreview.ts` - Quick Preview (Feature Cards) Section

```typescript
// sanity/schema/sections/content/quickPreview.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'quickPreview',
  title: 'Quick Preview Section',
  type: 'object',
  icon: () => '⚡',
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    },
    {
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Tudo Que Você Precisa',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },

    // Feature Cards
    {
      name: 'features',
      title: 'Feature Cards',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'featureCard' }],
        },
      ],
      validation: (Rule) => Rule.max(4),
    },

    // Highlights Card
    {
      name: 'showHighlights',
      title: 'Show Highlights Card?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'highlightsTitle',
      title: 'Highlights Card Title',
      type: 'string',
      initialValue: 'Reserve a Data: 20 de Novembro de 2025',
    },
  ],
  preview: {
    select: {
      title: 'sectionTitle',
      features: 'features',
    },
    prepare({ title, features }) {
      return {
        title: 'Quick Preview',
        subtitle: `${title} - ${features?.length || 0} features`,
        media: () => '⚡',
      }
    },
  },
})
```

##### `weddingLocation.ts` - Wedding Location Section

```typescript
// sanity/schema/sections/content/weddingLocation.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'weddingLocation',
  title: 'Wedding Location Section',
  type: 'object',
  icon: () => '📍',
  fields: [
    {
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Como Chegar',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'weddingSettings',
      title: 'Wedding Venue',
      type: 'reference',
      to: [{ type: 'weddingSettings' }],
      description: 'Reference to wedding settings for venue details',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'showMap',
      title: 'Show Google Maps?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'mapHeight',
      title: 'Map Height (px)',
      type: 'number',
      initialValue: 500,
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Wedding Location',
        subtitle: 'Venue map and directions',
        media: () => '📍',
      }
    },
  },
})
```

#### Timeline Sections

##### `timelinePhase.ts` - Timeline Phase

```typescript
// sanity/schema/sections/timeline/timelinePhase.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'timelinePhase',
  title: 'Timeline Phase',
  type: 'document',
  icon: () => '📅',
  fields: [
    {
      name: 'phaseId',
      title: 'Phase ID',
      type: 'string',
      description: 'Unique identifier (e.g., primeiros_dias)',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z_]+$/, {
          name: 'lowercase_underscore',
          invert: false,
        }),
    },
    {
      name: 'title',
      title: 'Phase Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'dayRange',
      title: 'Day Range',
      type: 'string',
      description: 'e.g., "Dia 1 - 100"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
    },
    {
      name: 'events',
      title: 'Timeline Events',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'timelineEvent' }],
        },
      ],
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(4),
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      dayRange: 'dayRange',
      order: 'displayOrder',
      events: 'events',
    },
    prepare({ title, dayRange, order, events }) {
      return {
        title: `${order}. ${title}`,
        subtitle: `${dayRange} - ${events?.length || 0} events`,
        media: () => '📅',
      }
    },
  },
})
```

##### `timelineEvent.ts` - Timeline Event

```typescript
// sanity/schema/sections/timeline/timelineEvent.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  icon: () => '⭐',
  fields: [
    {
      name: 'dayNumber',
      title: 'Day Number',
      type: 'number',
      description: 'Day count from relationship start',
      validation: (Rule) => Rule.required().positive(),
    },
    {
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Event Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'videoUrl',
      title: 'Video URL (Optional)',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video URL',
    },
    {
      name: 'contentAlign',
      title: 'Content Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    },
    {
      name: 'phase',
      title: 'Timeline Phase',
      type: 'reference',
      to: [{ type: 'timelinePhase' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    },

    // Fullbleed Layout Options
    {
      name: 'layoutType',
      title: 'Layout Type',
      type: 'string',
      options: {
        list: [
          { title: 'Standard (Side by Side)', value: 'standard' },
          { title: 'Full Bleed (Full Width Image)', value: 'fullbleed' },
        ],
        layout: 'radio',
      },
      initialValue: 'standard',
    },
    {
      name: 'fullbleedImageHeight',
      title: 'Full Bleed Image Height',
      type: 'string',
      description: 'Only applies to fullbleed layout',
      options: {
        list: [
          { title: 'Small (400px)', value: 'small' },
          { title: 'Medium (600px)', value: 'medium' },
          { title: 'Large (800px)', value: 'large' },
          { title: 'Extra Large (1000px)', value: 'xlarge' },
        ],
      },
      initialValue: 'medium',
      hidden: ({ parent }) => parent?.layoutType !== 'fullbleed',
    },
  ],
  orderings: [
    {
      title: 'Day Number',
      name: 'dayNumber',
      by: [{ field: 'dayNumber', direction: 'asc' }],
    },
    {
      title: 'Date',
      name: 'date',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      day: 'dayNumber',
      date: 'date',
      media: 'image',
    },
    prepare({ title, day, date, media }) {
      return {
        title: `Dia ${day}: ${title}`,
        subtitle: date,
        media,
      }
    },
  },
})
```

---

### 2.4 Document Schemas (Standalone Content)

#### `pet.ts` - Pet Profile

```typescript
// sanity/schema/documents/pet.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'pet',
  title: 'Pet',
  type: 'document',
  icon: () => '🐾',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
    },
    {
      name: 'species',
      title: 'Species',
      type: 'string',
      options: {
        list: [
          { title: 'Dog', value: 'dog' },
          { title: 'Cat', value: 'cat' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'breed',
      title: 'Breed',
      type: 'string',
    },
    {
      name: 'personality',
      title: 'Personality Tag',
      type: 'string',
      description: 'Short personality description (e.g., "Matriarca Autista 👑")',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
    {
      name: 'image',
      title: 'Pet Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description: 'Optional smaller thumbnail',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'dateJoined',
      title: 'Date Joined Family',
      type: 'date',
      description: 'When they joined the family',
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    },
    {
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      personality: 'personality',
      media: 'image',
      order: 'displayOrder',
    },
    prepare({ title, personality, media, order }) {
      return {
        title: `${order + 1}. ${title}`,
        subtitle: personality,
        media,
      }
    },
  },
})
```

#### `storyCard.ts` - Story Moment Card

```typescript
// sanity/schema/documents/storyCard.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'storyCard',
  title: 'Story Card',
  type: 'document',
  icon: () => '💕',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'dayNumber',
      title: 'Day Number (Optional)',
      type: 'number',
      description: 'Reference day number (not displayed on frontend)',
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      order: 'displayOrder',
      day: 'dayNumber',
    },
    prepare({ title, order, day }) {
      return {
        title: `${order}. ${title}`,
        subtitle: day ? `Day ${day}` : 'No day reference',
      }
    },
  },
})
```

#### `featureCard.ts` - Homepage Feature Card

```typescript
// sanity/schema/documents/featureCard.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'featureCard',
  title: 'Feature Card',
  type: 'document',
  icon: () => '⭐',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'iconName',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., Users, Gift, Calendar, MapPin)',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
      description: 'Custom link text (defaults to "Saiba Mais")',
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'isVisible',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      icon: 'iconName',
      order: 'displayOrder',
    },
    prepare({ title, icon, order }) {
      return {
        title: `${order}. ${title}`,
        subtitle: `Icon: ${icon}`,
      }
    },
  },
})
```

#### `weddingSettings.ts` - Wedding Configuration

```typescript
// sanity/schema/documents/weddingSettings.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'weddingSettings',
  title: 'Wedding Settings',
  type: 'document',
  icon: () => '💒',
  groups: [
    { name: 'datetime', title: 'Date & Time', default: true },
    { name: 'venue', title: 'Venue Information' },
    { name: 'details', title: 'Event Details' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    // Date & Time
    {
      name: 'weddingDate',
      title: 'Wedding Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
      group: 'datetime',
    },
    {
      name: 'ceremonyTime',
      title: 'Ceremony Time',
      type: 'string',
      description: 'e.g., "10:30"',
      validation: (Rule) => Rule.required(),
      group: 'datetime',
    },
    {
      name: 'receptionTime',
      title: 'Reception Time',
      type: 'string',
      description: 'e.g., "12:00"',
      group: 'datetime',
    },
    {
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      initialValue: 'America/Sao_Paulo',
      group: 'datetime',
    },

    // Couple Names
    {
      name: 'brideName',
      title: "Bride's Name",
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'datetime',
    },
    {
      name: 'groomName',
      title: "Groom's Name",
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'datetime',
    },

    // Venue Information
    {
      name: 'venueName',
      title: 'Venue Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'venue',
    },
    {
      name: 'venueAddress',
      title: 'Venue Address',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'venue',
    },
    {
      name: 'venueCity',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'venue',
    },
    {
      name: 'venueState',
      title: 'State',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'venue',
    },
    {
      name: 'venueZip',
      title: 'ZIP Code',
      type: 'string',
      group: 'venue',
    },
    {
      name: 'venueCountry',
      title: 'Country',
      type: 'string',
      initialValue: 'Brasil',
      group: 'venue',
    },

    // Google Maps Integration
    {
      name: 'venueCoordinates',
      title: 'Venue Coordinates',
      type: 'object',
      group: 'venue',
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required().min(-90).max(90),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required().min(-180).max(180),
        },
      ],
    },
    {
      name: 'googleMapsPlaceId',
      title: 'Google Maps Place ID',
      type: 'string',
      group: 'venue',
    },

    // Event Details
    {
      name: 'dressCode',
      title: 'Dress Code',
      type: 'string',
      description: 'e.g., "Traje Esporte Fino"',
      group: 'details',
    },
    {
      name: 'dressCodeDescription',
      title: 'Dress Code Description',
      type: 'text',
      rows: 2,
      group: 'details',
    },

    // Settings
    {
      name: 'rsvpDeadline',
      title: 'RSVP Deadline',
      type: 'date',
      group: 'settings',
    },
    {
      name: 'guestLimit',
      title: 'Guest Limit',
      type: 'number',
      group: 'settings',
    },
    {
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
      group: 'settings',
    },
  ],
  preview: {
    select: {
      bride: 'brideName',
      groom: 'groomName',
      date: 'weddingDate',
      venue: 'venueName',
    },
    prepare({ bride, groom, date, venue }) {
      return {
        title: `${bride} & ${groom}`,
        subtitle: `${date} - ${venue}`,
        media: () => '💒',
      }
    },
  },
})
```

---

## 3. Studio Configuration

### `sanity.config.ts` - Studio Setup

```typescript
// sanity.config.ts
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import schemas from './sanity/schema'
import deskStructure from './sanity/desk/structure'

export default defineConfig({
  name: 'default',
  title: 'Thousand Days of Love',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [
    deskTool({
      structure: deskStructure,
    }),
    visionTool(),
    media(),
  ],
  schema: {
    types: schemas,
  },
})
```

### `sanity/schema/index.ts` - Schema Registry

```typescript
// sanity/schema/index.ts

// Globals
import siteSettings from './globals/siteSettings'
import navigation from './globals/navigation'
import footer from './globals/footer'
import seoSettings from './globals/seoSettings'

// Pages
import page from './pages/page'
import homePage from './pages/homePage'
import timelinePage from './pages/timelinePage'

// Hero Sections
import videoHero from './sections/heroSections/videoHero'
import imageHero from './sections/heroSections/imageHero'

// Content Sections
import aboutUs from './sections/content/aboutUs'
import storyPreview from './sections/content/storyPreview'
import eventDetails from './sections/content/eventDetails'
import quickPreview from './sections/content/quickPreview'
import weddingLocation from './sections/content/weddingLocation'

// Family Sections
import ourFamily from './sections/family/ourFamily'

// Timeline Sections
import timelinePhase from './sections/timeline/timelinePhase'
import timelineEvent from './sections/timeline/timelineEvent'

// Documents
import pet from './documents/pet'
import storyCard from './documents/storyCard'
import featureCard from './documents/featureCard'
import weddingSettings from './documents/weddingSettings'

export default [
  // Globals (Singletons)
  siteSettings,
  navigation,
  footer,
  seoSettings,

  // Pages
  page,
  homePage,
  timelinePage,

  // Hero Sections
  videoHero,
  imageHero,

  // Content Sections
  aboutUs,
  storyPreview,
  eventDetails,
  quickPreview,
  weddingLocation,
  ourFamily,

  // Timeline Sections
  timelinePhase,
  timelineEvent,

  // Documents
  pet,
  storyCard,
  featureCard,
  weddingSettings,
]
```

### `sanity/desk/structure.ts` - Studio Desk Structure

```typescript
// sanity/desk/structure.ts
import type { StructureResolver } from 'sanity/desk'

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // HOMEPAGE (Singleton)
      S.listItem()
        .title('Homepage')
        .icon(() => '🏠')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Homepage')
        ),

      // PAGES
      S.listItem()
        .title('Pages')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Timeline Page')
                .icon(() => '📅')
                .child(
                  S.document()
                    .schemaType('timelinePage')
                    .documentId('timelinePage')
                    .title('Timeline Page')
                ),
              S.divider(),
              S.documentTypeListItem('page').title('All Pages'),
            ])
        ),

      S.divider(),

      // TIMELINE
      S.listItem()
        .title('Timeline')
        .icon(() => '📅')
        .child(
          S.list()
            .title('Timeline')
            .items([
              S.documentTypeListItem('timelinePhase')
                .title('Timeline Phases')
                .icon(() => '📅'),
              S.documentTypeListItem('timelineEvent')
                .title('Timeline Events')
                .icon(() => '⭐'),
            ])
        ),

      S.divider(),

      // CONTENT
      S.listItem()
        .title('Content')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('storyCard')
                .title('Story Cards')
                .icon(() => '💕'),
              S.documentTypeListItem('featureCard')
                .title('Feature Cards')
                .icon(() => '⭐'),
              S.documentTypeListItem('pet').title('Pets').icon(() => '🐾'),
            ])
        ),

      S.divider(),

      // WEDDING SETTINGS
      S.listItem()
        .title('Wedding Settings')
        .icon(() => '💒')
        .child(
          S.document()
            .schemaType('weddingSettings')
            .documentId('weddingSettings')
            .title('Wedding Settings')
        ),

      S.divider(),

      // SITE SETTINGS
      S.listItem()
        .title('Site Settings')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('Site Settings')
                .icon(() => '⚙️')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Site Settings')
                ),
              S.listItem()
                .title('Navigation')
                .icon(() => '🧭')
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                    .title('Navigation')
                ),
              S.listItem()
                .title('Footer')
                .icon(() => '🦶')
                .child(
                  S.document()
                    .schemaType('footer')
                    .documentId('footer')
                    .title('Footer')
                ),
              S.listItem()
                .title('SEO Settings')
                .icon(() => '🔍')
                .child(
                  S.document()
                    .schemaType('seoSettings')
                    .documentId('seoSettings')
                    .title('SEO Settings')
                ),
            ])
        ),
    ])

export default structure
```

---

## 4. Next.js Integration

### `sanity/lib/client.ts` - Sanity Client

```typescript
// sanity/lib/client.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})
```

### `sanity/lib/queries.ts` - GROQ Queries

```typescript
// sanity/lib/queries.ts
import { groq } from 'next-sanity'

// ============================================
// HOMEPAGE QUERY
// ============================================
export const HOME_PAGE_QUERY = groq`
  *[_type == "homePage" && _id == "homePage"][0] {
    _id,
    title,
    sections[] {
      _type,
      _key,

      // Video Hero
      _type == "videoHero" => {
        sectionId,
        monogram,
        brideName,
        groomName,
        namesSeparator,
        tagline,
        dateBadge,
        "videoUrl": videoFile.asset->url,
        "posterImage": posterImage.asset->url,
        "fallbackImage": fallbackImage.asset->url,
        primaryCta,
        secondaryCta,
        scrollText
      },

      // Event Details
      _type == "eventDetails" => {
        sectionId,
        showCountdown,
        dateLabel,
        timeLabel,
        locationLabel,
        dressCodeLabel,
        weddingDate-> {
          weddingDate,
          ceremonyTime,
          receptionTime,
          venueName,
          venueAddress,
          venueCity,
          dressCode,
          dressCodeDescription
        }
      },

      // Story Preview
      _type == "storyPreview" => {
        sectionId,
        sectionTitle,
        description,
        "photoUrl": photoUrl.asset->url,
        photoAlt,
        photoCaption,
        storyCards[]-> {
          _id,
          title,
          description,
          dayNumber,
          displayOrder
        },
        ctaText,
        ctaLink
      },

      // About Us
      _type == "aboutUs" => {
        sectionId,
        heading,
        description,
        personalityTitle,
        personalityDescription,
        personalityIcon,
        sharedInterests[] {
          title,
          description,
          icon
        },
        individualInterests[] {
          title,
          description,
          icon
        }
      },

      // Our Family
      _type == "ourFamily" => {
        sectionId,
        heading,
        description,
        pets[]-> {
          _id,
          name,
          nickname,
          species,
          breed,
          personality,
          description,
          "imageUrl": image.asset->url,
          "thumbnailUrl": thumbnail.asset->url,
          dateJoined,
          displayOrder
        }
      },

      // Quick Preview
      _type == "quickPreview" => {
        sectionId,
        sectionTitle,
        description,
        features[]-> {
          _id,
          title,
          description,
          iconName,
          linkUrl,
          linkText,
          displayOrder
        },
        showHighlights,
        highlightsTitle
      },

      // Wedding Location
      _type == "weddingLocation" => {
        sectionId,
        heading,
        description,
        weddingSettings-> {
          venueName,
          venueAddress,
          venueCity,
          venueState,
          venueZip,
          venueCoordinates,
          googleMapsPlaceId
        },
        showMap,
        mapHeight
      }
    },
    seo
  }
`

// ============================================
// TIMELINE PAGE QUERY
// ============================================
export const TIMELINE_PAGE_QUERY = groq`
  *[_type == "timelinePage" && _id == "timelinePage"][0] {
    _id,
    title,
    hero,
    phases[]-> {
      _id,
      phaseId,
      title,
      dayRange,
      subtitle,
      displayOrder,
      events[]-> {
        _id,
        dayNumber,
        date,
        title,
        description,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        videoUrl,
        contentAlign,
        layoutType,
        fullbleedImageHeight,
        isVisible
      }
    },
    seo
  }
`

// ============================================
// SITE SETTINGS QUERY
// ============================================
export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    _id,
    siteTitle,
    siteDescription,
    domain,
    language,
    "heroPosterImageUrl": heroPosterImage.asset->url,
    "heroCoupleImageUrl": heroCoupleImage.asset->url,
    "heroVideoUrl": heroVideo.asset->url,
    "faviconUrl": favicon.asset->url,
    "ogImageUrl": ogImage.asset->url,
    instagramHandle,
    whatsappNumber
  }
`

// ============================================
// NAVIGATION QUERY
// ============================================
export const NAVIGATION_QUERY = groq`
  *[_type == "navigation" && _id == "navigation"][0] {
    _id,
    menuItems[] {
      label,
      href,
      isExternal,
      openInNewTab
    },
    ctaButton
  }
`

// ============================================
// FOOTER QUERY
// ============================================
export const FOOTER_QUERY = groq`
  *[_type == "footer" && _id == "footer"][0] {
    _id,
    copyrightText,
    footerLinks[] {
      label,
      href
    },
    showSocialLinks
  }
`

// ============================================
// SEO SETTINGS QUERY
// ============================================
export const SEO_SETTINGS_QUERY = groq`
  *[_type == "seoSettings" && _id == "seoSettings"][0] {
    _id,
    defaultMetaTitle,
    defaultMetaDescription,
    keywords,
    googleAnalyticsId,
    facebookPixelId
  }
`

// ============================================
// WEDDING SETTINGS QUERY
// ============================================
export const WEDDING_SETTINGS_QUERY = groq`
  *[_type == "weddingSettings" && _id == "weddingSettings"][0] {
    _id,
    weddingDate,
    ceremonyTime,
    receptionTime,
    timezone,
    brideName,
    groomName,
    venueName,
    venueAddress,
    venueCity,
    venueState,
    venueZip,
    venueCountry,
    venueCoordinates,
    googleMapsPlaceId,
    dressCode,
    dressCodeDescription,
    rsvpDeadline,
    guestLimit,
    isPublished
  }
`
```

### `app/page.tsx` - Homepage with Sanity Integration

```typescript
// app/page.tsx
import { client } from '@/sanity/lib/client'
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import Navigation from '@/components/ui/Navigation'
import SectionRenderer from '@/components/SectionRenderer'

export default async function Home() {
  const homePage = await client.fetch(HOME_PAGE_QUERY)

  return (
    <main className="min-h-screen">
      <Navigation />
      {homePage.sections?.map((section: any) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </main>
  )
}
```

### `components/SectionRenderer.tsx` - Dynamic Section Rendering

```typescript
// components/SectionRenderer.tsx
import VideoHeroSection from '@/components/sections/VideoHeroSection'
import EventDetailsSection from '@/components/sections/EventDetailsSection'
import StoryPreview from '@/components/sections/StoryPreview'
import AboutUsSection from '@/components/sections/AboutUsSection'
import OurFamilySection from '@/components/sections/OurFamilySection'
import QuickPreview from '@/components/sections/QuickPreview'
import WeddingLocation from '@/components/sections/WeddingLocation'

interface SectionRendererProps {
  section: any
}

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  videoHero: VideoHeroSection,
  eventDetails: EventDetailsSection,
  storyPreview: StoryPreview,
  aboutUs: AboutUsSection,
  ourFamily: OurFamilySection,
  quickPreview: QuickPreview,
  weddingLocation: WeddingLocation,
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = SECTION_COMPONENTS[section._type]

  if (!Component) {
    console.warn(`No component found for section type: ${section._type}`)
    return null
  }

  return <Component data={section} />
}
```

---

## 5. Migration Strategy

### 5.1 Supabase to Sanity Mapping

| Supabase Table | Sanity Schema | Migration Notes |
|----------------|---------------|-----------------|
| `hero_text` | `videoHero` section | Single row → Homepage videoHero section |
| `site_settings` | `siteSettings` global | Map hero images to global settings |
| `wedding_settings` | `weddingSettings` document | Single row → Singleton document |
| `story_preview_settings` | `storyPreview` section | Single row → Homepage storyPreview section |
| `story_cards` | `storyCard` documents | Multiple rows → Referenced documents |
| `homepage_section_settings` | `quickPreview` section | Single row → Homepage quickPreview section |
| `homepage_features` | `featureCard` documents | Multiple rows → Referenced documents |
| `about_us_items` | `aboutUs` section | Aggregate by section → Single aboutUs section |
| `pets` | `pet` documents | Multiple rows → Referenced documents |
| `timeline_events` | `timelineEvent` documents | Multiple rows → Referenced documents |
| N/A (hardcoded) | `timelinePhase` documents | Code config → 4 phase documents |
| Navigation (code) | `navigation` global | Hardcoded menu → Singleton document |
| Footer (code) | `footer` global | Hardcoded footer → Singleton document |

### 5.2 Migration Script Outline

```typescript
// scripts/migrate-supabase-to-sanity.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { client as sanityClient } from '@/sanity/lib/client'

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function migrateHeroText() {
  // Fetch from Supabase
  const { data: heroText } = await supabase
    .from('hero_text')
    .select('*')
    .single()

  // Create Homepage with videoHero section
  await sanityClient.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    title: 'Homepage',
    sections: [
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
    ],
  })

  console.log('✅ Migrated hero_text to homepage videoHero section')
}

async function migrateWeddingSettings() {
  const { data: weddingSettings } = await supabase
    .from('wedding_settings')
    .select('*')
    .single()

  await sanityClient.createOrReplace({
    _id: 'weddingSettings',
    _type: 'weddingSettings',
    weddingDate: weddingSettings.wedding_date,
    ceremonyTime: weddingSettings.wedding_time,
    receptionTime: weddingSettings.reception_time,
    timezone: weddingSettings.wedding_timezone,
    brideName: weddingSettings.bride_name,
    groomName: weddingSettings.groom_name,
    venueName: weddingSettings.venue_name,
    venueAddress: weddingSettings.venue_address,
    venueCity: weddingSettings.venue_city,
    venueState: weddingSettings.venue_state,
    venueZip: weddingSettings.venue_zip,
    venueCountry: weddingSettings.venue_country,
    venueCoordinates: {
      lat: weddingSettings.venue_lat,
      lng: weddingSettings.venue_lng,
    },
    googleMapsPlaceId: weddingSettings.google_maps_place_id,
    dressCode: weddingSettings.dress_code,
    dressCodeDescription: weddingSettings.dress_code_description,
    rsvpDeadline: weddingSettings.rsvp_deadline,
    guestLimit: weddingSettings.guest_limit,
    isPublished: weddingSettings.is_published,
  })

  console.log('✅ Migrated wedding_settings')
}

async function migrateStoryCards() {
  const { data: storyCards } = await supabase
    .from('story_cards')
    .select('*')
    .order('display_order')

  const migratedCards = []

  for (const card of storyCards) {
    const doc = await sanityClient.create({
      _type: 'storyCard',
      title: card.title,
      description: card.description,
      dayNumber: card.day_number,
      displayOrder: card.display_order,
      isVisible: card.is_visible,
    })
    migratedCards.push({ _type: 'reference', _ref: doc._id })
  }

  console.log(`✅ Migrated ${storyCards.length} story cards`)
  return migratedCards
}

async function migratePets() {
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .order('display_order')

  const migratedPets = []

  for (const pet of pets) {
    // Note: Images need to be uploaded to Sanity first
    const doc = await sanityClient.create({
      _type: 'pet',
      name: pet.name,
      nickname: pet.nickname,
      species: pet.species,
      breed: pet.breed,
      personality: pet.personality,
      description: pet.description,
      dateJoined: pet.date_joined,
      displayOrder: pet.display_order,
      isVisible: pet.is_visible,
      // TODO: Upload images to Sanity and reference them
    })
    migratedPets.push({ _type: 'reference', _ref: doc._id })
  }

  console.log(`✅ Migrated ${pets.length} pets`)
  return migratedPets
}

async function migrateTimelineEvents() {
  const { data: events } = await supabase
    .from('timeline_events')
    .select('*')
    .order('day_number')

  // First, create timeline phases
  const phases = [
    {
      _id: 'phase-primeiros-dias',
      phaseId: 'primeiros_dias',
      title: 'Os Primeiros Dias',
      dayRange: 'Dia 1 - 100',
      subtitle: 'Do Tinder ao primeiro encontro...',
      displayOrder: 1,
    },
    {
      _id: 'phase-construindo-juntos',
      phaseId: 'construindo_juntos',
      title: 'Construindo Juntos',
      dayRange: 'Dia 100 - 500',
      subtitle: 'Quando a gente percebeu que isso aqui era pra valer...',
      displayOrder: 2,
    },
    {
      _id: 'phase-nossa-familia',
      phaseId: 'nossa_familia',
      title: 'Nossa Família',
      dayRange: 'Dia 500 - 900',
      subtitle: 'De 1 pra 4 cachorros...',
      displayOrder: 3,
    },
    {
      _id: 'phase-caminhando-altar',
      phaseId: 'caminhando_altar',
      title: 'Caminhando Pro Altar',
      dayRange: 'Dia 900 - 1000',
      subtitle: 'O pedido em Icaraí...',
      displayOrder: 4,
    },
  ]

  for (const phase of phases) {
    await sanityClient.createOrReplace({
      _type: 'timelinePhase',
      ...phase,
    })
  }

  // Migrate timeline events
  for (const event of events) {
    await sanityClient.create({
      _type: 'timelineEvent',
      dayNumber: event.day_number,
      date: event.date,
      title: event.title,
      description: event.description,
      videoUrl: event.video_url,
      contentAlign: event.content_align,
      layoutType: event.layout_type || 'standard',
      fullbleedImageHeight: event.fullbleed_image_height,
      isVisible: event.is_visible,
      phase: {
        _type: 'reference',
        _ref: `phase-${event.phase}`,
      },
      // TODO: Upload images to Sanity
    })
  }

  console.log(`✅ Migrated ${events.length} timeline events and 4 phases`)
}

// Run migration
async function runMigration() {
  console.log('🚀 Starting Supabase → Sanity migration...')

  await migrateWeddingSettings()
  await migrateHeroText()
  const storyCards = await migrateStoryCards()
  const pets = await migratePets()
  await migrateTimelineEvents()

  console.log('✅ Migration complete!')
}

runMigration()
```

### 5.3 Image Migration Strategy

**Manual Upload Approach** (Recommended for ~50 images):

1. Download images from Supabase Storage
2. Upload to Sanity Studio manually via Media Library
3. Reference uploaded images in documents

**Automated Approach** (For large image sets):

```typescript
import { createClient } from '@sanity/client'
import axios from 'axios'

async function uploadImageToSanity(imageUrl: string, filename: string) {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data)

  const asset = await sanityClient.assets.upload('image', buffer, {
    filename,
  })

  return asset._id
}
```

---

## 6. TypeScript Types Generation

### Generate Sanity Types

```bash
npm install --save-dev sanity-codegen

# Generate types
npx sanity-codegen
```

**Example Generated Types**:

```typescript
// sanity.types.ts (auto-generated)
export interface HomePage extends SanityDocument {
  _type: 'homePage'
  title: string
  sections?: Array<
    | VideoHero
    | EventDetails
    | StoryPreview
    | AboutUs
    | OurFamily
    | QuickPreview
    | WeddingLocation
  >
  seo?: SeoMetadata
}

export interface VideoHero {
  _type: 'videoHero'
  _key: string
  sectionId?: string
  monogram: string
  brideName: string
  groomName: string
  namesSeparator: string
  tagline: string
  dateBadge: string
  videoFile?: SanityFile
  posterImage?: SanityImage
  fallbackImage?: SanityImage
  primaryCta: CtaButton
  secondaryCta: CtaButton
  scrollText: string
}
```

---

## 7. Implementation Checklist

### Phase 1: Setup (Week 1)
- [ ] Install Sanity dependencies
- [ ] Configure Sanity project and dataset
- [ ] Set up Studio at `/studio` route
- [ ] Create desk structure with proper organization
- [ ] Configure environment variables

### Phase 2: Schema Development (Week 2)
- [ ] Create global settings schemas (site, navigation, footer, SEO)
- [ ] Create page schemas (page, homePage, timelinePage)
- [ ] Create section schemas (all 10+ section types)
- [ ] Create document schemas (pet, storyCard, featureCard, weddingSettings)
- [ ] Test schema relationships and previews in Studio

### Phase 3: Migration (Week 3)
- [ ] Write migration script for each Supabase table
- [ ] Upload images to Sanity Media Library
- [ ] Run migration and verify data integrity
- [ ] Create initial homepage structure in Studio
- [ ] Test content editing workflow

### Phase 4: Frontend Integration (Week 4)
- [ ] Update Next.js components to use Sanity data
- [ ] Implement SectionRenderer for dynamic sections
- [ ] Add proper TypeScript types
- [ ] Test all pages with Sanity content
- [ ] Deploy to production

### Phase 5: Supabase Cleanup (Week 5)
- [ ] Verify all content migrated successfully
- [ ] Archive content tables (do NOT delete immediately)
- [ ] Update admin dashboard to remove content management
- [ ] Keep transactional tables (guests, gifts, payments)
- [ ] Document final architecture

---

## 8. Benefits of This Architecture

### For Content Editors
- **Visual Editing**: Sanity Studio provides intuitive content management
- **Modular Pages**: Drag-and-drop sections to build pages
- **Live Preview**: See changes before publishing
- **Reusable Content**: Story cards, pets, features shared across pages
- **Media Management**: Organized image library with search

### For Developers
- **Type Safety**: Full TypeScript support with generated types
- **DRY Principle**: Sections defined once, used everywhere
- **Flexible**: Easy to add new section types
- **Scalable**: Sanity CDN handles traffic spikes
- **Version Control**: Content versioning built-in

### For Performance
- **Fast Builds**: Static generation with ISR for fresh content
- **CDN Delivery**: Sanity's global CDN for images
- **Optimized Queries**: GROQ queries only fetch needed data
- **Image Optimization**: Automatic image transformations

---

## 9. Estimated Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Setup | 1 week | Install Sanity, configure Studio, create desk structure |
| Schema Development | 1 week | Create all 40+ schemas with proper fields and validations |
| Migration | 1 week | Write migration scripts, upload images, migrate data |
| Frontend Integration | 1 week | Update components, implement dynamic rendering, TypeScript |
| Testing & Cleanup | 1 week | QA, performance testing, Supabase cleanup |
| **Total** | **5 weeks** | End-to-end migration with testing |

---

## 10. Next Steps

1. **Review this architecture** with the team
2. **Create Sanity project** on sanity.io
3. **Start with globals** (siteSettings, navigation) for quick wins
4. **Build one complete page** (Homepage) as proof of concept
5. **Iterate on schema** based on editor feedback
6. **Full migration** once architecture validated

---

## Conclusion

This Sanity CMS architecture provides a production-ready, scalable, and maintainable content management system for the Thousand Days of Love wedding website. The DTF-inspired modular pattern ensures content editors can build flexible page layouts while developers maintain clean, reusable code.

The clear separation between **content (Sanity)** and **transactional data (Supabase)** ensures each system handles what it does best, resulting in a robust and performant wedding website.
