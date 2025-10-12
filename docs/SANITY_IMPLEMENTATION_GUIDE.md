# Sanity Implementation Guide - Practical Examples

## Quick Start Guide

### 1. Install Sanity

```bash
cd /Users/helrabelo/code/personal/thousanddaysoflove

# Install Sanity dependencies
npm install sanity @sanity/vision @sanity/image-url next-sanity
npm install --save-dev @sanity/cli sanity-codegen

# Install recommended plugins
npm install sanity-plugin-media
```

### 2. Initialize Sanity Project

```bash
# Login to Sanity
npx sanity login

# Initialize project (if not already created on sanity.io)
npx sanity init --project-id YOUR_PROJECT_ID --dataset production

# Or create new project
npx sanity init
```

### 3. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_write_token
```

### 4. Create Studio Route

```typescript
// app/studio/[[...index]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

---

## Component Integration Examples

### 1. VideoHeroSection with Sanity

**Before (Supabase)**:
```typescript
// components/sections/VideoHeroSection.tsx (current)
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HeroText {
  monogram: string
  bride_name: string
  groom_name: string
  tagline: string
  // ...
}

export default function VideoHeroSection() {
  const [heroText, setHeroText] = useState<HeroText | null>(null)

  useEffect(() => {
    async function loadHeroText() {
      const supabase = createClient()
      const { data } = await supabase
        .from('hero_text')
        .select('*')
        .single()
      setHeroText(data)
    }
    loadHeroText()
  }, [])

  if (!heroText) return <div>Loading...</div>

  return (
    <section className="hero">
      <p>{heroText.monogram}</p>
      <h1>{heroText.bride_name} & {heroText.groom_name}</h1>
      {/* ... */}
    </section>
  )
}
```

**After (Sanity with Server Components)**:
```typescript
// components/sections/VideoHeroSection.tsx (new)
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'

interface VideoHeroProps {
  data: {
    monogram: string
    brideName: string
    groomName: string
    namesSeparator: string
    tagline: string
    dateBadge: string
    videoUrl?: string
    posterImage?: string
    fallbackImage?: string
    primaryCta: {
      text: string
      link: string
    }
    secondaryCta: {
      text: string
      link: string
    }
    scrollText: string
  }
}

export default function VideoHeroSection({ data }: VideoHeroProps) {
  return (
    <section className="hero relative min-h-screen flex items-center justify-center">
      {/* Video Background */}
      {data.videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={data.posterImage}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={data.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Fallback Image for Reduced Motion */}
      {data.fallbackImage && (
        <img
          src={data.fallbackImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover motion-reduce:block hidden"
        />
      )}

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white">
        <p className="monogram text-2xl mb-4">{data.monogram}</p>

        <h1 className="names text-6xl font-playfair mb-6">
          {data.brideName} {data.namesSeparator} {data.groomName}
        </h1>

        <p className="tagline text-xl font-crimson italic mb-8">
          {data.tagline}
        </p>

        <div className="date-badge inline-block px-6 py-2 border-2 border-white mb-12">
          {data.dateBadge}
        </div>

        <div className="cta-buttons flex gap-4 justify-center">
          <Link
            href={data.primaryCta.link}
            className="btn-primary px-8 py-3 bg-white text-black"
          >
            {data.primaryCta.text}
          </Link>

          <Link
            href={data.secondaryCta.link}
            className="btn-secondary px-8 py-3 border-2 border-white"
          >
            {data.secondaryCta.text}
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-white text-sm">{data.scrollText}</p>
        <div className="scroll-arrow mt-2">↓</div>
      </div>
    </section>
  )
}
```

---

### 2. StoryPreview with Sanity References

```typescript
// components/sections/StoryPreview.tsx (new)
import Image from 'next/image'
import Link from 'next/link'

interface StoryCard {
  _id: string
  title: string
  description: string
  dayNumber?: number
  displayOrder: number
}

interface StoryPreviewProps {
  data: {
    sectionTitle: string
    description: string
    photoUrl?: string
    photoAlt?: string
    photoCaption?: string
    storyCards: StoryCard[]
    ctaText: string
    ctaLink: string
  }
}

export default function StoryPreview({ data }: StoryPreviewProps) {
  return (
    <section className="story-preview py-20 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair mb-6">
            {data.sectionTitle}
          </h2>
          <p className="text-xl font-crimson max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Proposal Photo */}
          {data.photoUrl && (
            <div className="proposal-photo">
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                <Image
                  src={data.photoUrl}
                  alt={data.photoAlt || 'Proposal photo'}
                  fill
                  className="object-cover"
                />
              </div>
              {data.photoCaption && (
                <p className="text-center mt-4 font-crimson italic text-gray-600">
                  {data.photoCaption}
                </p>
              )}
            </div>
          )}

          {/* Right: Story Cards Timeline */}
          <div className="story-timeline space-y-8">
            {data.storyCards.map((card, index) => (
              <div
                key={card._id}
                className="story-card p-6 border-l-4 border-decorative"
              >
                <h3 className="text-2xl font-playfair mb-3">
                  {card.title}
                </h3>
                <p className="font-crimson text-gray-700 leading-relaxed">
                  {card.description}
                </p>
                {card.dayNumber && (
                  <p className="text-sm text-gray-500 mt-2">
                    Dia {card.dayNumber}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Link
            href={data.ctaLink}
            className="inline-block px-8 py-3 border-2 border-primary-text hover:bg-primary-text hover:text-white transition-colors"
          >
            {data.ctaText}
          </Link>
        </div>
      </div>
    </section>
  )
}
```

---

### 3. OurFamilySection with Pet References

```typescript
// components/sections/OurFamilySection.tsx (new)
import Image from 'next/image'

interface Pet {
  _id: string
  name: string
  nickname?: string
  species: string
  breed?: string
  personality?: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  dateJoined?: string
  displayOrder: number
}

interface OurFamilySectionProps {
  data: {
    heading: string
    description: string
    pets: Pet[]
  }
}

export default function OurFamilySection({ data }: OurFamilySectionProps) {
  return (
    <section className="our-family py-20 px-8 bg-accent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-playfair mb-6">
            {data.heading}
          </h2>
          <p className="text-xl font-crimson max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Pet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.pets.map((pet) => (
            <div
              key={pet._id}
              className="pet-card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Pet Image */}
              <div className="relative aspect-square">
                <Image
                  src={pet.thumbnailUrl || pet.imageUrl}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Pet Info */}
              <div className="p-6">
                <h3 className="text-2xl font-playfair mb-2">
                  {pet.name}
                </h3>

                {pet.personality && (
                  <p className="text-sm font-crimson text-decorative mb-3">
                    {pet.personality}
                  </p>
                )}

                {pet.description && (
                  <p className="font-crimson text-gray-700 leading-relaxed">
                    {pet.description}
                  </p>
                )}

                {pet.breed && (
                  <p className="text-xs text-gray-500 mt-3">
                    {pet.breed}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

### 4. Timeline Page with Phases and Events

```typescript
// app/historia/page.tsx (new)
import { client } from '@/sanity/lib/client'
import { TIMELINE_PAGE_QUERY } from '@/sanity/lib/queries'
import Navigation from '@/components/ui/Navigation'
import TimelinePhaseHeader from '@/components/timeline/TimelinePhaseHeader'
import TimelineMomentCard from '@/components/timeline/TimelineMomentCard'
import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function HistoriaPage() {
  const timelinePage = await client.fetch(TIMELINE_PAGE_QUERY)

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center px-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-12 bg-decorative">
            <Heart className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-6xl font-playfair mb-8">
            {timelinePage.hero.heading}
          </h1>

          <p className="text-xl font-crimson italic max-w-3xl mx-auto">
            {timelinePage.hero.description}
          </p>

          <div className="w-32 h-px mx-auto mt-12 bg-decorative" />
        </div>
      </section>

      {/* Timeline Phases */}
      {timelinePage.phases?.map((phase: any) => (
        <div key={phase._id}>
          <TimelinePhaseHeader
            title={phase.title}
            dayRange={phase.dayRange}
            subtitle={phase.subtitle}
          />

          {phase.events?.map((event: any) => (
            <TimelineMomentCard
              key={event._id}
              day={event.dayNumber}
              date={new Date(event.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
              title={event.title}
              description={event.description}
              imageUrl={event.imageUrl}
              imageAlt={event.imageAlt}
              contentAlign={event.contentAlign}
              videoUrl={event.videoUrl}
              layoutType={event.layoutType}
              fullbleedImageHeight={event.fullbleedImageHeight}
            />
          ))}
        </div>
      ))}

      {/* Back Button */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 border-2 border-primary-text hover:bg-primary-text hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            Voltar ao Início
          </Link>
        </div>
      </section>
    </div>
  )
}
```

---

## Advanced Patterns

### 1. Conditional Section Rendering

```typescript
// components/SectionRenderer.tsx (advanced)
import dynamic from 'next/dynamic'

// Lazy-load section components
const VideoHeroSection = dynamic(() => import('@/components/sections/VideoHeroSection'))
const EventDetailsSection = dynamic(() => import('@/components/sections/EventDetailsSection'))
const StoryPreview = dynamic(() => import('@/components/sections/StoryPreview'))
// ... other imports

const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  videoHero: VideoHeroSection,
  imageHero: ImageHeroSection,
  eventDetails: EventDetailsSection,
  storyPreview: StoryPreview,
  aboutUs: AboutUsSection,
  ourFamily: OurFamilySection,
  quickPreview: QuickPreview,
  weddingLocation: WeddingLocation,
}

interface SectionRendererProps {
  section: any
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const Component = SECTION_COMPONENTS[section._type]

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ No component found for section type: ${section._type}`)
      return (
        <div className="p-8 bg-yellow-100 border-2 border-yellow-500">
          <p className="font-mono text-sm">
            Missing component for section type: <code>{section._type}</code>
          </p>
        </div>
      )
    }
    return null
  }

  // Optional: Add section wrapper for analytics tracking
  return (
    <div
      data-section-type={section._type}
      data-section-id={section._key}
      id={section.sectionId}
    >
      <Component data={section} />
    </div>
  )
}
```

---

### 2. Image Optimization Helper

```typescript
// sanity/lib/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

// Usage examples:
// 1. Basic image
// <img src={urlFor(image).url()} alt="..." />

// 2. Responsive image with width
// <img src={urlFor(image).width(800).url()} alt="..." />

// 3. Thumbnail with quality
// <img src={urlFor(image).width(400).quality(80).url()} alt="..." />

// 4. Crop and fit
// <img src={urlFor(image).width(800).height(600).fit('crop').url()} alt="..." />

// 5. Auto format (WebP/AVIF)
// <img src={urlFor(image).width(800).auto('format').url()} alt="..." />

// 6. Blur placeholder
// const blurDataUrl = urlFor(image).width(20).blur(50).url()
```

---

### 3. Incremental Static Regeneration (ISR)

```typescript
// app/page.tsx (with ISR)
import { client } from '@/sanity/lib/client'
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries'
import Navigation from '@/components/ui/Navigation'
import SectionRenderer from '@/components/SectionRenderer'

// Revalidate every 60 seconds
export const revalidate = 60

export default async function Home() {
  const homePage = await client.fetch(
    HOME_PAGE_QUERY,
    {},
    {
      // Use CDN for faster reads in production
      useCdn: process.env.NODE_ENV === 'production',
      // Add cache tags for on-demand revalidation
      next: { tags: ['homepage'] },
    }
  )

  if (!homePage) {
    return <div>Page not found</div>
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      {homePage.sections?.map((section: any) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </main>
  )
}

// Generate metadata for SEO
export async function generateMetadata() {
  const homePage = await client.fetch(HOME_PAGE_QUERY)

  return {
    title: homePage.seo?.metaTitle || 'Thousand Days of Love',
    description: homePage.seo?.metaDescription || 'Our wedding website',
    openGraph: {
      title: homePage.seo?.metaTitle || 'Thousand Days of Love',
      description: homePage.seo?.metaDescription || 'Our wedding website',
      images: [homePage.seo?.ogImage || '/og-default.jpg'],
    },
  }
}
```

---

### 4. On-Demand Revalidation API Route

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Verify secret token
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { tag } = body

    // Revalidate specific tag
    if (tag) {
      revalidateTag(tag)
      return Response.json({ revalidated: true, tag, now: Date.now() })
    }

    return Response.json({ message: 'Missing tag parameter' }, { status: 400 })
  } catch (err) {
    return Response.json({ message: 'Error revalidating' }, { status: 500 })
  }
}

// Usage from Sanity webhook:
// POST /api/revalidate?secret=YOUR_SECRET
// Body: { "tag": "homepage" }
```

---

### 5. Sanity Webhook for Auto-Revalidation

Configure in Sanity Studio:

```
https://your-domain.com/api/revalidate?secret=YOUR_SECRET

Trigger on:
- Create
- Update
- Delete

For datasets:
- production

Filter:
_type in ["homePage", "timelinePage", "pet", "storyCard", "featureCard"]
```

---

## Content Editor Best Practices

### 1. Creating Reusable Story Cards

1. Go to **Content > Story Cards**
2. Click **Create** → **Story Card**
3. Fill in:
   - **Title**: "Do Tinder ao WhatsApp"
   - **Description**: "6 de janeiro de 2023. Aquele primeiro..."
   - **Day Number**: 1 (optional reference)
   - **Display Order**: 1
   - **Visible**: Yes
4. Save and publish
5. Use in multiple pages by referencing

### 2. Building Homepage Layout

1. Go to **Homepage**
2. In **Sections** field, click **Add item**
3. Select section type (e.g., "Video Hero Section")
4. Fill in section fields
5. Drag sections to reorder
6. Preview before publishing

### 3. Managing Timeline Events

1. Go to **Timeline > Timeline Events**
2. Create event with:
   - Day number
   - Date
   - Title and description
   - Upload image
   - Select phase (reference)
3. Events automatically appear in correct phase

---

## Performance Optimization

### 1. Image Optimization Strategy

```typescript
// Use Next.js Image component with Sanity
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

function OptimizedHeroImage({ image }: { image: any }) {
  return (
    <Image
      src={urlFor(image).width(1920).height(1080).auto('format').url()}
      alt={image.alt || ''}
      width={1920}
      height={1080}
      priority // For above-the-fold images
      placeholder="blur"
      blurDataURL={urlFor(image).width(20).blur(50).url()}
    />
  )
}
```

### 2. GROQ Query Optimization

```typescript
// BAD: Over-fetching
const query = groq`*[_type == "pet"]`

// GOOD: Specific fields only
const query = groq`
  *[_type == "pet" && isVisible == true] | order(displayOrder) {
    _id,
    name,
    personality,
    "imageUrl": image.asset->url
  }
`

// BETTER: With projections and filters
const query = groq`
  *[_type == "pet" && isVisible == true] | order(displayOrder) [0...4] {
    _id,
    name,
    personality,
    "imageUrl": image.asset->url,
    "thumbnailUrl": thumbnail.asset->url
  }
`
```

### 3. Caching Strategy

```typescript
// lib/sanity-fetch.ts
import { client } from '@/sanity/lib/client'

export async function fetchWithCache<T>(
  query: string,
  params: any = {},
  options: {
    revalidate?: number
    tags?: string[]
  } = {}
): Promise<T> {
  const { revalidate = 60, tags = [] } = options

  return client.fetch<T>(
    query,
    params,
    {
      useCdn: true,
      next: {
        revalidate,
        tags,
      },
    }
  )
}

// Usage
const homePage = await fetchWithCache(
  HOME_PAGE_QUERY,
  {},
  { revalidate: 300, tags: ['homepage'] }
)
```

---

## Testing Strategy

### 1. Schema Validation Testing

```typescript
// sanity/test/schema.test.ts
import { describe, it, expect } from 'vitest'
import schemas from '../schema'

describe('Sanity Schema Validation', () => {
  it('should have all required section types', () => {
    const sectionTypes = schemas
      .filter((s) => s.type === 'object')
      .map((s) => s.name)

    expect(sectionTypes).toContain('videoHero')
    expect(sectionTypes).toContain('storyPreview')
    expect(sectionTypes).toContain('ourFamily')
  })

  it('should have proper field validations', () => {
    const videoHero = schemas.find((s) => s.name === 'videoHero')
    const brideNameField = videoHero?.fields.find((f) => f.name === 'brideName')

    expect(brideNameField?.validation).toBeDefined()
  })
})
```

### 2. Query Testing

```typescript
// lib/__tests__/queries.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { client } from '@/sanity/lib/client'
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries'

describe('Sanity Queries', () => {
  it('should fetch homepage data', async () => {
    const data = await client.fetch(HOME_PAGE_QUERY)

    expect(data).toBeDefined()
    expect(data.sections).toBeInstanceOf(Array)
    expect(data.sections.length).toBeGreaterThan(0)
  })

  it('should have valid section structure', async () => {
    const data = await client.fetch(HOME_PAGE_QUERY)
    const videoHero = data.sections.find((s: any) => s._type === 'videoHero')

    expect(videoHero).toBeDefined()
    expect(videoHero.brideName).toBeDefined()
    expect(videoHero.groomName).toBeDefined()
  })
})
```

---

## Troubleshooting

### Common Issues

#### 1. Images Not Loading

**Problem**: Sanity images showing 404 errors

**Solution**:
```typescript
// Check CORS configuration in Sanity Studio
// sanity.config.ts
export default defineConfig({
  // ...
  cors: {
    allowOrigins: ['http://localhost:3000', 'https://your-domain.com'],
  },
})
```

#### 2. Slow Query Performance

**Problem**: GROQ queries taking >2 seconds

**Solution**:
```typescript
// Add indexes in Sanity Studio
// Go to Vision tool and run:
// groq-cli index create --field="displayOrder" --type="pet"

// Or optimize query with projections
const query = groq`
  *[_type == "pet"][0...10] {
    _id,
    name,
    "imageUrl": image.asset->url
  }
`
```

#### 3. TypeScript Type Errors

**Problem**: TypeScript complaining about Sanity types

**Solution**:
```bash
# Regenerate types
npx sanity-codegen

# Or use type assertions
const homePage = await client.fetch(HOME_PAGE_QUERY) as HomePage
```

---

## Deployment Checklist

- [ ] Set environment variables in Vercel
- [ ] Configure Sanity CORS for production domain
- [ ] Set up Sanity webhooks for auto-revalidation
- [ ] Test ISR revalidation in production
- [ ] Verify image optimization and CDN
- [ ] Test Studio access at /studio route
- [ ] Configure Sanity project permissions
- [ ] Set up monitoring for Sanity API usage
- [ ] Document content editing workflow for editors
- [ ] Test all pages with real Sanity content

---

## Resources

### Documentation
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Image URLs](https://www.sanity.io/docs/image-url)

### Community
- [Sanity Slack Community](https://slack.sanity.io/)
- [Sanity Exchange](https://www.sanity.io/exchange)

### Tools
- [Vision Tool](https://www.sanity.io/docs/the-vision-plugin) - Test GROQ queries
- [Sanity CLI](https://www.sanity.io/docs/cli) - Command line tools
- [Presentation Tool](https://www.sanity.io/docs/presentation) - Live preview

---

## Next Steps

1. **Start with globals** - Implement siteSettings, navigation, footer
2. **Build one section** - VideoHero as proof of concept
3. **Create homepage** - Compose sections to build full page
4. **Test content editing** - Have non-technical editor test Studio
5. **Optimize queries** - Profile and optimize GROQ queries
6. **Full migration** - Migrate all content from Supabase
7. **Deploy to production** - Test with real traffic

---

This implementation guide provides practical, copy-paste examples for integrating Sanity CMS with your wedding website. All examples follow Next.js 15 Server Components best practices and maintain the elegant design system you've established.
