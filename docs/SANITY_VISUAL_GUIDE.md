# Sanity CMS Visual Architecture Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         THOUSAND DAYS OF LOVE                                │
│                         Wedding Website Architecture                         │
└─────────────────────────────────────────────────────────────────────────────┘

                                  ┌─────────────┐
                                  │   Browser   │
                                  │  (Visitor)  │
                                  └──────┬──────┘
                                         │
                         ┌───────────────┴────────────────┐
                         │                                │
                    ┌────▼─────┐                   ┌──────▼────┐
                    │  Next.js │                   │  /studio  │
                    │   App    │                   │  (Editor) │
                    └────┬─────┘                   └──────┬────┘
                         │                                │
        ┌────────────────┼────────────────┐              │
        │                │                │              │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐   ┌─────▼─────┐
   │  Pages  │      │ Sections│     │Components│   │  Sanity   │
   │(/,/historia)   │(Dynamic)│     │  (UI)   │   │  Studio   │
   └────┬────┘      └────┬────┘     └────┬────┘   └─────┬─────┘
        │                │                │              │
        └────────────────┴────────────────┘              │
                         │                                │
                    ┌────▼────────────────────────────────▼────┐
                    │         Sanity CMS (Content)             │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Globals (4):                        │ │
                    │  │ • siteSettings                      │ │
                    │  │ • navigation                        │ │
                    │  │ • footer                            │ │
                    │  │ • seoSettings                       │ │
                    │  └─────────────────────────────────────┘ │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Pages (3):                          │ │
                    │  │ • homePage                          │ │
                    │  │ • timelinePage                      │ │
                    │  │ • page (generic)                    │ │
                    │  └─────────────────────────────────────┘ │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Sections (10+):                     │ │
                    │  │ • videoHero                         │ │
                    │  │ • eventDetails                      │ │
                    │  │ • storyPreview                      │ │
                    │  │ • aboutUs                           │ │
                    │  │ • ourFamily                         │ │
                    │  │ • quickPreview                      │ │
                    │  │ • weddingLocation                   │ │
                    │  │ • timelinePhase                     │ │
                    │  │ • timelineEvent                     │ │
                    │  └─────────────────────────────────────┘ │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Documents (4):                      │ │
                    │  │ • pet (4 pets)                      │ │
                    │  │ • storyCard (3 cards)               │ │
                    │  │ • featureCard (4 cards)             │ │
                    │  │ • weddingSettings                   │ │
                    │  └─────────────────────────────────────┘ │
                    └──────────────────┬──────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │  Sanity CDN     │
                              │  (Global)       │
                              └─────────────────┘

                    ┌──────────────────────────────────────────┐
                    │    Supabase (Transactional Data)         │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ • guests (RSVP submissions)         │ │
                    │  │ • gifts (registry items)            │ │
                    │  │ • gift_contributions (purchases)    │ │
                    │  │ • payments (PIX transactions)       │ │
                    │  │ • gallery_images (user uploads)     │ │
                    │  └─────────────────────────────────────┘ │
                    └──────────────────────────────────────────┘
```

---

## Content Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTENT MANAGEMENT FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

Content Editor (Ylana)                    Website Visitor
        │                                         │
        │                                         │
    ┌───▼────┐                              ┌────▼────┐
    │/studio │                              │    /    │
    │(Login) │                              │Homepage │
    └───┬────┘                              └────┬────┘
        │                                        │
        │ 1. Edit Content                       │ 2. Request Page
        │                                        │
    ┌───▼────────┐                         ┌────▼─────────┐
    │   Sanity   │                         │   Next.js    │
    │   Studio   │                         │   (Server)   │
    └───┬────────┘                         └────┬─────────┘
        │                                       │
        │ 3. Save & Publish                    │ 3. Fetch Content
        │                                       │ (GROQ Query)
    ┌───▼────────────┐                         │
    │  Sanity API    │◄────────────────────────┘
    │  (Write Token) │
    └───┬────────────┘
        │
        │ 4. Store in Dataset
        │
    ┌───▼────────────┐
    │ Sanity Dataset │
    │  (production)  │
    └───┬────────────┘
        │
        │ 5. CDN Cache
        │
    ┌───▼────────────┐
    │  Sanity CDN    │
    │   (Global)     │
    └───┬────────────┘
        │
        │ 6. Deliver to Next.js
        │
    ┌───▼─────────────┐
    │   Next.js ISR   │
    │   (Cache 60s)   │
    └───┬─────────────┘
        │
        │ 7. Render HTML
        │
    ┌───▼─────────────┐
    │  Static HTML    │
    │  (with data)    │
    └───┬─────────────┘
        │
        │ 8. Send to Browser
        │
    ┌───▼─────────────┐
    │    Visitor      │
    │  Sees Content   │
    └─────────────────┘
```

---

## Modular Page Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             HOMEPAGE STRUCTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

homePage
├── sections[] (Array of section objects)
│   │
│   ├─── [0] videoHero (Object)
│   │    ├── monogram: "H ♥ Y"
│   │    ├── brideName: "Ylana"
│   │    ├── groomName: "Hel"
│   │    ├── tagline: "1000 dias..."
│   │    ├── videoFile: (asset reference)
│   │    ├── posterImage: (asset reference)
│   │    ├── primaryCta: {text, link}
│   │    └── secondaryCta: {text, link}
│   │
│   ├─── [1] eventDetails (Object)
│   │    ├── showCountdown: true
│   │    ├── weddingDate: → weddingSettings (reference)
│   │    └── labels: {date, time, location, dressCode}
│   │
│   ├─── [2] storyPreview (Object)
│   │    ├── sectionTitle: "Nossa História"
│   │    ├── description: "..."
│   │    ├── photoUrl: (image asset)
│   │    ├── storyCards[] (Array of references)
│   │    │   ├── → storyCard #1
│   │    │   ├── → storyCard #2
│   │    │   └── → storyCard #3
│   │    └── ctaText, ctaLink
│   │
│   ├─── [3] aboutUs (Object)
│   │    ├── heading: "Sobre Nós"
│   │    ├── description: "..."
│   │    ├── personalityTitle: "..."
│   │    ├── sharedInterests[] (Array of objects)
│   │    └── individualInterests[] (Array of objects)
│   │
│   ├─── [4] ourFamily (Object)
│   │    ├── heading: "A Matilha"
│   │    ├── description: "..."
│   │    └── pets[] (Array of references)
│   │        ├── → pet: Linda
│   │        ├── → pet: Cacao
│   │        ├── → pet: Olivia
│   │        └── → pet: Oliver
│   │
│   ├─── [5] quickPreview (Object)
│   │    ├── sectionTitle: "Tudo Que Você Precisa"
│   │    ├── description: "..."
│   │    ├── features[] (Array of references)
│   │    │   ├── → featureCard: RSVP
│   │    │   ├── → featureCard: Presentes
│   │    │   ├── → featureCard: Cronograma
│   │    │   └── → featureCard: Local
│   │    └── highlightsTitle: "Reserve a Data..."
│   │
│   └─── [6] weddingLocation (Object)
│        ├── heading: "Como Chegar"
│        ├── description: "..."
│        ├── weddingSettings: → weddingSettings (reference)
│        └── showMap: true
│
└── seo (Object)
    ├── metaTitle: "..."
    └── metaDescription: "..."
```

---

## Data Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SANITY CONTENT RELATIONSHIPS                         │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌──────────────────┐
                        │   weddingSettings│ (Singleton)
                        │  (1 document)    │
                        └────────┬─────────┘
                                 │
                                 │ Referenced by:
                 ┌───────────────┼────────────────┐
                 │               │                │
          ┌──────▼─────┐  ┌──────▼──────┐  ┌─────▼──────┐
          │eventDetails│  │weddingLocation│  │Other sections│
          │  section   │  │   section     │  │            │
          └────────────┘  └───────────────┘  └────────────┘


                        ┌──────────────────┐
                        │   timelinePhase  │
                        │  (4 documents)   │
                        └────────┬─────────┘
                                 │
                                 │ Referenced by:
                 ┌───────────────┼────────────────┐
                 │               │                │
          ┌──────▼─────┐  ┌──────▼──────┐  ┌─────▼──────┐
          │timelinePage│  │timelineEvent│  │            │
          │  phases[]  │  │   phase:    │  │            │
          └────────────┘  └─────────────┘  └────────────┘


                        ┌──────────────────┐
                        │      pet         │
                        │  (4 documents)   │
                        │  Linda, Cacao,   │
                        │  Olivia, Oliver  │
                        └────────┬─────────┘
                                 │
                                 │ Referenced by:
                         ┌───────▼────────┐
                         │   ourFamily    │
                         │    section     │
                         │    pets[]      │
                         └────────────────┘


                        ┌──────────────────┐
                        │   storyCard      │
                        │  (3 documents)   │
                        └────────┬─────────┘
                                 │
                                 │ Referenced by:
                         ┌───────▼────────┐
                         │ storyPreview   │
                         │   section      │
                         │ storyCards[]   │
                         └────────────────┘


                        ┌──────────────────┐
                        │  featureCard     │
                        │  (4 documents)   │
                        │  RSVP, Presentes,│
                        │  Cronograma, Local│
                        └────────┬─────────┘
                                 │
                                 │ Referenced by:
                         ┌───────▼────────┐
                         │ quickPreview   │
                         │   section      │
                         │  features[]    │
                         └────────────────┘
```

---

## Migration Timeline Visual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          5-WEEK MIGRATION TIMELINE                           │
└─────────────────────────────────────────────────────────────────────────────┘

WEEK 1: Setup & Schema Development
├── Day 1-2: Environment Setup
│   ├── ✓ Create Sanity project
│   ├── ✓ Install dependencies
│   ├── ✓ Configure /studio route
│   └── ✓ Set environment variables
│
├── Day 3-4: Schema Development
│   ├── ✓ Create 4 global schemas
│   ├── ✓ Create 3 page schemas
│   ├── ✓ Create 10+ section schemas
│   └── ✓ Create 4 document schemas
│
└── Day 5-7: Testing & Validation
    ├── ✓ Test all schemas in Studio
    ├── ✓ Verify validations
    ├── ✓ Configure desk structure
    └── ✓ Generate TypeScript types

WEEK 2: Data Migration
├── Day 1-2: Global Settings
│   ├── ✓ Migrate siteSettings
│   ├── ✓ Migrate weddingSettings
│   └── ✓ Test in Studio
│
├── Day 3-4: Content Documents
│   ├── ✓ Migrate 3 story cards
│   ├── ✓ Migrate 4 feature cards
│   ├── ✓ Migrate 4 pets
│   └── ✓ Upload pet images
│
└── Day 5-7: Timeline Content
    ├── ✓ Create 4 timeline phases
    ├── ✓ Migrate ~20 timeline events
    ├── ✓ Upload timeline images
    └── ✓ Build homepage structure

WEEK 3: Frontend Integration
├── Day 1-2: Component Updates
│   ├── ✓ Update app/page.tsx
│   ├── ✓ Update app/historia/page.tsx
│   └── ✓ Create SectionRenderer
│
├── Day 3-4: Section Components
│   ├── ✓ Update VideoHeroSection
│   ├── ✓ Update StoryPreview
│   ├── ✓ Update OurFamilySection
│   └── ✓ Update all 7 sections
│
└── Day 5-7: Integration Testing
    ├── ✓ Test homepage locally
    ├── ✓ Test timeline page locally
    ├── ✓ Fix TypeScript errors
    └── ✓ Verify all images load

WEEK 4: Testing & QA
├── Day 1-2: Performance Testing
│   ├── ✓ Lighthouse audit
│   ├── ✓ Load time benchmarks
│   └── ✓ Image optimization
│
├── Day 3-4: Content Editor Testing
│   ├── ✓ Train Ylana on Studio
│   ├── ✓ Test content editing
│   └── ✓ Fix UX issues
│
└── Day 5-7: Full QA Testing
    ├── ✓ Mobile responsive testing
    ├── ✓ Cross-browser testing
    ├── ✓ SEO validation
    └── ✓ RSVP/gifts still work

WEEK 5: Launch & Monitor
├── Day 1-2: Production Deploy
│   ├── ✓ Deploy to Vercel
│   ├── ✓ Configure webhooks
│   └── ✓ Test production
│
├── Day 3-4: Monitoring
│   ├── ✓ Monitor page load times
│   ├── ✓ Monitor error rates
│   └── ✓ Monitor Sanity API usage
│
└── Day 5-7: Cleanup & Documentation
    ├── ✓ Archive Supabase tables
    ├── ✓ Update documentation
    └── ✓ Content editor training complete

                        ✅ MIGRATION COMPLETE
```

---

## Content Editor Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTENT EDITOR WORKFLOW (YLANA)                       │
└─────────────────────────────────────────────────────────────────────────────┘

SCENARIO: Update Pet Profile (Linda)
────────────────────────────────────────

Step 1: Login to Studio
    │
    ├── Navigate to https://thousanddaysof.love/studio
    ├── Login with credentials
    └── Sanity Studio opens
    │
Step 2: Navigate to Content
    │
    ├── Click "Content" in sidebar
    ├── Click "Pets"
    └── See list of 4 pets
    │
Step 3: Select Pet
    │
    ├── Click "Linda" in list
    └── Pet editing form opens
    │
Step 4: Edit Content
    │
    ├── Update "Personality" field: "Matriarca Autista 👑"
    ├── Update "Description" field: "Nossa rainha..."
    ├── (Optional) Upload new image
    └── Changes tracked in real-time
    │
Step 5: Preview Changes
    │
    ├── Click "Preview" button
    └── See changes before publishing
    │
Step 6: Publish
    │
    ├── Click "Publish" button
    ├── Sanity saves to dataset
    ├── CDN updates automatically
    └── Webhook triggers revalidation
    │
Step 7: Verify on Website
    │
    ├── Navigate to homepage
    ├── Scroll to "A Matilha" section
    └── See updated Linda profile

TIME: ~2 minutes (vs. 15 minutes with Supabase admin)

────────────────────────────────────────

SCENARIO: Reorder Homepage Sections
────────────────────────────────────────

Step 1: Open Homepage in Studio
    │
    ├── Navigate to /studio
    ├── Click "Homepage" in sidebar
    └── Homepage editor opens
    │
Step 2: Drag Sections
    │
    ├── See "Sections" field with list
    ├── Drag "Our Family" section
    ├── Drop before "Quick Preview"
    └── Sections reorder visually
    │
Step 3: Publish
    │
    ├── Click "Publish"
    └── Homepage section order updates
    │
Step 4: Verify
    │
    ├── Visit homepage
    └── See new section order

TIME: ~30 seconds (impossible with Supabase - requires developer)
```

---

## Performance Optimization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PERFORMANCE OPTIMIZATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

Image Request Flow:
───────────────────

Browser Request
     │
     ├── <img src="/images/linda.jpg" />
     │
     ▼
Sanity Image URL Builder
     │
     ├── urlFor(image)
     ├── .width(800)
     ├── .quality(80)
     ├── .auto('format')
     │
     ▼
Sanity CDN
     │
     ├── Check CDN cache
     ├── If cached → Return immediately
     ├── If not cached:
     │   ├── Fetch original from Sanity dataset
     │   ├── Apply transformations (resize, quality, format)
     │   ├── Convert to WebP/AVIF (if supported)
     │   ├── Cache on CDN (edge locations)
     │   └── Return optimized image
     │
     ▼
Browser
     │
     ├── Receive optimized image (50% smaller)
     ├── Cache locally
     └── Display to user

Result: 50-70% faster image loads


Content Request Flow:
────────────────────

Browser Request
     │
     ├── GET /historia
     │
     ▼
Next.js Server
     │
     ├── Check Static Cache (ISR)
     ├── If cached & fresh (< 60s) → Return immediately
     ├── If stale or missing:
     │   ├── Fetch from Sanity via GROQ query
     │   ├── Sanity CDN returns data (fast)
     │   ├── Next.js renders page (Server Component)
     │   ├── Cache for 60 seconds (ISR)
     │   └── Return HTML to browser
     │
     ▼
Browser
     │
     ├── Receive fully rendered HTML
     ├── No client-side data fetching needed
     └── Instant display

Result: 30-40% faster page loads
```

---

## Decision Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SANITY vs SUPABASE DECISION TREE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    Is this data or content?
                              │
                ┌─────────────┴──────────────┐
                │                            │
          ┌─────▼─────┐              ┌──────▼──────┐
          │   DATA    │              │   CONTENT   │
          │(Dynamic,  │              │ (Static,    │
          │Transactional)            │ Marketing)  │
          └─────┬─────┘              └──────┬──────┘
                │                            │
                │                            │
        Does it change                 Does it need
        frequently based           visual editing?
        on user actions?
                │                            │
           ┌────▼────┐                  ┌────▼────┐
           │   YES   │                  │   YES   │
           └────┬────┘                  └────┬────┘
                │                            │
                │                            │
        ┌───────▼────────┐          ┌────────▼────────┐
        │  USE SUPABASE  │          │   USE SANITY    │
        └───────┬────────┘          └────────┬────────┘
                │                            │
                │                            │
          Examples:                    Examples:
          • RSVP submissions           • Hero text
          • Gift purchases             • Pet profiles
          • Payment records            • Timeline events
          • User gallery               • Page layouts
          • Real-time updates          • Marketing copy

────────────────────────────────────────────────────────────────────────────

Quick Test Questions:
─────────────────────

Q: Hero section text and images?
A: SANITY ✓ (Marketing content, needs visual editing)

Q: Guest RSVP form submission?
A: SUPABASE ✓ (Transactional data, user submission)

Q: Pet profile photos and bios?
A: SANITY ✓ (Content, rarely changes, needs editing)

Q: Gift registry item purchases?
A: SUPABASE ✓ (Transactional, dynamic inventory)

Q: Timeline event photos and stories?
A: SANITY ✓ (Content, storytelling, visual editing)

Q: User-uploaded gallery photos?
A: SUPABASE ✓ (User-generated, dynamic)

Q: Homepage section order?
A: SANITY ✓ (Content structure, visual editor needed)

Q: Payment transaction records?
A: SUPABASE ✓ (Transactional data, sensitive)
```

---

*Visual guide for understanding the Sanity CMS architecture and migration strategy for the Thousand Days of Love wedding website.*
