# Sanity CMS Quick Reference Guide

## Quick Start Commands

```bash
# Install Sanity
npm install sanity @sanity/vision @sanity/image-url next-sanity

# Login to Sanity
npx sanity login

# Start Studio locally
npm run dev  # Studio runs at /studio route

# Generate TypeScript types
npx sanity-codegen

# Deploy Studio to Sanity.io
npx sanity deploy
```

---

## Essential File Locations

```
thousanddaysoflove/
├── sanity/
│   ├── schema/
│   │   ├── index.ts              # Schema registry
│   │   ├── globals/              # Singleton documents
│   │   ├── pages/                # Page documents
│   │   ├── sections/             # Reusable sections
│   │   └── documents/            # Standalone content
│   ├── lib/
│   │   ├── client.ts             # Sanity client config
│   │   └── queries.ts            # GROQ queries
│   └── desk/
│       └── structure.ts          # Studio organization
├── sanity.config.ts              # Studio configuration
└── docs/
    ├── SANITY_EXECUTIVE_SUMMARY.md
    ├── SANITY_ARCHITECTURE.md
    ├── SANITY_IMPLEMENTATION_GUIDE.md
    └── SANITY_MIGRATION_PLAN.md
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_write_token
REVALIDATE_SECRET=random_secret_string
```

---

## Common GROQ Query Patterns

### 1. Fetch Homepage

```typescript
const query = groq`
  *[_type == "homePage" && _id == "homePage"][0] {
    _id,
    title,
    sections[] {
      _type,
      _key,
      ...,
      storyCards[]-> { ... },
      pets[]-> { ... }
    }
  }
`
```

### 2. Fetch Timeline with Events

```typescript
const query = groq`
  *[_type == "timelinePage"][0] {
    phases[]-> {
      _id,
      title,
      events[]-> {
        dayNumber,
        title,
        "imageUrl": image.asset->url
      }
    }
  }
`
```

### 3. Fetch All Pets

```typescript
const query = groq`
  *[_type == "pet" && isVisible == true] | order(displayOrder) {
    _id,
    name,
    personality,
    "imageUrl": image.asset->url
  }
`
```

### 4. Fetch Wedding Settings

```typescript
const query = groq`
  *[_type == "weddingSettings"][0] {
    weddingDate,
    ceremonyTime,
    venueName,
    venueAddress,
    venueCoordinates
  }
`
```

---

## Image Optimization

```typescript
import { urlFor } from '@/sanity/lib/image'

// Basic usage
<img src={urlFor(image).url()} alt="..." />

// Responsive with width
<img src={urlFor(image).width(800).url()} alt="..." />

// Optimized with quality and format
<img
  src={urlFor(image)
    .width(800)
    .height(600)
    .quality(80)
    .auto('format')
    .url()}
  alt="..."
/>

// Blur placeholder
const blurUrl = urlFor(image).width(20).blur(50).url()
```

---

## Schema Patterns

### Object Schema (Section)

```typescript
export default defineType({
  name: 'videoHero',
  title: 'Video Hero Section',
  type: 'object',  // ← Object, not document
  fields: [
    {
      name: 'heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
})
```

### Document Schema

```typescript
export default defineType({
  name: 'pet',
  title: 'Pet',
  type: 'document',  // ← Document, standalone
  fields: [
    {
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
})
```

### Reference Field

```typescript
{
  name: 'pets',
  type: 'array',
  of: [
    {
      type: 'reference',
      to: [{ type: 'pet' }],
    },
  ],
}
```

### Image Field with Hotspot

```typescript
{
  name: 'heroImage',
  type: 'image',
  options: {
    hotspot: true,  // Allow focal point selection
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
    },
  ],
}
```

---

## Fetching Data in Next.js

### Server Component (Recommended)

```typescript
// app/page.tsx
import { client } from '@/sanity/lib/client'
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries'

export const revalidate = 60  // ISR: revalidate every 60s

export default async function HomePage() {
  const data = await client.fetch(HOME_PAGE_QUERY)

  return <div>{/* Render sections */}</div>
}
```

### Client Component

```typescript
'use client'

import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'

export default function ClientComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    client.fetch(query).then(setData)
  }, [])

  return <div>{/* Render */}</div>
}
```

### With SWR (Client-side)

```typescript
'use client'

import useSWR from 'swr'
import { client } from '@/sanity/lib/client'

const fetcher = (query: string) => client.fetch(query)

export default function Component() {
  const { data, error } = useSWR(query, fetcher)

  if (error) return <div>Error</div>
  if (!data) return <div>Loading...</div>

  return <div>{/* Render */}</div>
}
```

---

## Dynamic Section Rendering

```typescript
// components/SectionRenderer.tsx
const SECTION_COMPONENTS = {
  videoHero: VideoHeroSection,
  storyPreview: StoryPreview,
  ourFamily: OurFamilySection,
  // ... etc
}

export default function SectionRenderer({ section }: { section: any }) {
  const Component = SECTION_COMPONENTS[section._type]

  if (!Component) return null

  return <Component data={section} />
}

// Usage in page
{homePage.sections?.map((section) => (
  <SectionRenderer key={section._key} section={section} />
))}
```

---

## Revalidation & Caching

### Static Generation with ISR

```typescript
// app/page.tsx
export const revalidate = 60  // Revalidate every 60 seconds

export default async function Page() {
  const data = await client.fetch(query)
  return <div>{/* ... */}</div>
}
```

### On-Demand Revalidation

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { tag } = await request.json()

  revalidateTag(tag)

  return Response.json({ revalidated: true })
}

// Usage in fetch
const data = await client.fetch(query, {}, {
  next: { tags: ['homepage'] }
})

// Trigger revalidation
POST /api/revalidate
{ "tag": "homepage" }
```

---

## Common Sanity Studio Customizations

### Custom Desk Structure

```typescript
// sanity/desk/structure.ts
const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton
      S.listItem()
        .title('Homepage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),

      // List
      S.documentTypeListItem('pet').title('Pets'),
    ])
```

### Conditional Fields

```typescript
{
  name: 'fullbleedHeight',
  type: 'string',
  hidden: ({ parent }) => parent?.layoutType !== 'fullbleed',
}
```

### Custom Validation

```typescript
{
  name: 'email',
  type: 'string',
  validation: (Rule) =>
    Rule.required()
      .email()
      .error('Must be a valid email'),
}
```

---

## Troubleshooting

### Studio Not Loading

```bash
# Clear Sanity cache
rm -rf node_modules/.sanity
npm install

# Check environment variables
echo $NEXT_PUBLIC_SANITY_PROJECT_ID
```

### Images Not Showing

```typescript
// Check CORS settings in sanity.config.ts
export default defineConfig({
  cors: {
    allowOrigins: ['http://localhost:3000', 'https://your-domain.com'],
  },
})
```

### TypeScript Errors

```bash
# Regenerate types
npx sanity-codegen

# Or use type assertion
const data = await client.fetch(query) as HomePage
```

### Slow Queries

```typescript
// Add projections to fetch only needed fields
const query = groq`
  *[_type == "pet"][0...10] {
    _id,
    name,
    "imageUrl": image.asset->url
  }
`

// Instead of
const query = groq`*[_type == "pet"]`
```

---

## Migration Checklist

- [ ] Install Sanity dependencies
- [ ] Create Sanity project
- [ ] Set environment variables
- [ ] Create all schemas (40+)
- [ ] Test schemas in Studio
- [ ] Run migration scripts
- [ ] Upload images
- [ ] Update component props
- [ ] Create SectionRenderer
- [ ] Test all pages
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Archive Supabase content tables

---

## Useful Links

### Documentation
- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Next.js + Sanity](https://www.sanity.io/guides/nextjs)
- [Image URLs](https://www.sanity.io/docs/image-url)

### Tools
- [Vision Tool](https://www.sanity.io/docs/the-vision-plugin) - Test queries in Studio
- [GROQ Playground](https://groq.dev/) - Test GROQ syntax
- [Sanity CLI](https://www.sanity.io/docs/cli) - Command line tools

### Community
- [Sanity Slack](https://slack.sanity.io/)
- [Sanity Exchange](https://www.sanity.io/exchange)

---

## Schema Types Quick Reference

| Type | Description | Example |
|------|-------------|---------|
| `string` | Short text | `"Hello World"` |
| `text` | Long text | Multi-line description |
| `number` | Numeric | `42` |
| `boolean` | True/false | `true` |
| `date` | Date only | `"2025-11-20"` |
| `datetime` | Date + time | `"2025-11-20T10:30:00Z"` |
| `url` | URL string | `"https://example.com"` |
| `slug` | URL-friendly | `"about-us"` |
| `image` | Image asset | Reference to image |
| `file` | File asset | Reference to file |
| `array` | List of items | `[item1, item2]` |
| `object` | Nested object | `{ field: value }` |
| `reference` | Link to document | Points to another doc |

---

## GROQ Operators Quick Reference

| Operator | Description | Example |
|----------|-------------|---------|
| `*` | All documents | `*[_type == "pet"]` |
| `[]` | Filter | `*[isVisible == true]` |
| `->` | Dereference | `pets[]->` |
| `\|` | Pipe | `\| order(name)` |
| `order()` | Sort | `order(displayOrder)` |
| `[0]` | First item | `[0]` |
| `[0...10]` | Slice | First 10 items |
| `{ }` | Projection | Select fields |
| `==` | Equals | `_type == "pet"` |
| `!=` | Not equals | `status != "draft"` |
| `&&` | AND | `isVisible && featured` |
| `\|\|` | OR | `type == "dog" \|\| type == "cat"` |

---

## Version History & Rollback

### View Version History

1. Open document in Studio
2. Click "..." menu
3. Select "Revision history"
4. Browse previous versions

### Restore Previous Version

1. In revision history
2. Click version to restore
3. Click "Restore this revision"
4. Publish restored version

### Export Content Backup

```bash
# Export all documents
npx sanity dataset export production backup.tar.gz

# Import backup
npx sanity dataset import backup.tar.gz production
```

---

## Performance Optimization Tips

1. **Use projections** - Only fetch needed fields
2. **Add indexes** - For frequently queried fields
3. **Use ISR** - Cache with revalidation
4. **Optimize images** - Use `width()`, `quality()`, `auto('format')`
5. **Lazy load sections** - Dynamic imports for below-fold content
6. **CDN caching** - Leverage Sanity's CDN
7. **Reduce queries** - Fetch related data in single query with references

---

## Quick Commands Reference

```bash
# Development
npm run dev                    # Start Next.js + Studio

# Sanity Studio
npx sanity manage              # Open project settings
npx sanity deploy              # Deploy Studio to Sanity.io
npx sanity dataset list        # List datasets
npx sanity documents query     # Run GROQ query in CLI

# TypeScript
npx sanity-codegen            # Generate types
npx sanity typegen generate   # Alternative type generation

# Data Management
npx sanity dataset export      # Export dataset
npx sanity dataset import      # Import dataset
npx sanity dataset copy        # Copy dataset

# Project
npx sanity cors add            # Add CORS origin
npx sanity users list          # List project users
npx sanity hook list           # List webhooks
```

---

## Contact & Support

### Internal
- **Developer**: Hel Rabelo
- **Content Editor**: Ylana
- **Documentation**: `/docs/` folder

### External
- **Sanity Support**: [Slack](https://slack.sanity.io/)
- **Bug Reports**: [GitHub Issues](https://github.com/sanity-io/sanity/issues)
- **Feature Requests**: Sanity Slack #feature-requests

---

*Quick reference guide for Sanity CMS integration with Thousand Days of Love wedding website. For detailed information, see the comprehensive architecture and implementation guides.*
