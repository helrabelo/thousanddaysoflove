# Sanity CMS Architecture - Executive Summary

## Overview

This document provides a high-level overview of the comprehensive Sanity CMS architecture designed for the Thousand Days of Love wedding website, inspired by Din Tai Fung's modular page/section pattern.

---

## Why Migrate to Sanity?

### Current Pain Points (Supabase for Content)

1. **No Visual Content Management**: Editing content requires SQL knowledge or custom admin interfaces
2. **Rigid Structure**: Changing page layouts requires code changes
3. **No Media Library**: Images scattered across storage, hard to manage
4. **Developer Bottleneck**: Content editors depend on developers for updates
5. **No Content Versioning**: Can't revert to previous content versions
6. **Limited Preview**: Can't see changes before publishing

### Benefits of Sanity CMS

1. **Visual Studio**: Intuitive content management interface
2. **Modular Pages**: Drag-and-drop sections to build pages
3. **Media Library**: Organized image management with search
4. **Content Independence**: Editors manage content without developers
5. **Version History**: Full content versioning and rollback
6. **Live Preview**: See changes in real-time before publishing
7. **Global CDN**: Fast content delivery worldwide
8. **Structured Content**: Type-safe content with validations

---

## Architecture Overview

### Content Separation Strategy

**Sanity CMS** (Content/Marketing):
- Hero sections, about us, timeline
- Story cards, pet profiles
- Homepage features, navigation
- All page layouts and structure
- Marketing copy and images

**Supabase** (Transactional/Dynamic):
- Guest RSVP submissions
- Gift registry transactions
- Payment records (PIX)
- User-uploaded gallery images
- Analytics and tracking

### Key Principle: Right Tool for the Job

- **Sanity**: Best for content that editors update frequently (marketing, copy, images)
- **Supabase**: Best for transactional data and user submissions

---

## Modular Architecture (DTF Pattern)

### How It Works

1. **Pages** are composed of **Sections**
2. **Sections** reference reusable **Documents**
3. **Documents** can be shared across multiple sections/pages
4. Editors build pages by selecting and arranging sections

### Example: Homepage Structure

```
Homepage
├── Video Hero Section
├── Event Details Section
├── Story Preview Section
│   ├── Story Card 1 (reusable)
│   ├── Story Card 2 (reusable)
│   └── Story Card 3 (reusable)
├── About Us Section
├── Our Family Section
│   ├── Pet: Linda (reusable)
│   ├── Pet: Cacao (reusable)
│   ├── Pet: Olivia (reusable)
│   └── Pet: Oliver (reusable)
├── Quick Preview Section
│   ├── Feature: RSVP (reusable)
│   ├── Feature: Gifts (reusable)
│   ├── Feature: Timeline (reusable)
│   └── Feature: Location (reusable)
└── Wedding Location Section
```

### Benefits

- **Reusable Content**: Edit pet profile once, update everywhere
- **Flexible Layouts**: Reorder sections without code changes
- **Consistent Design**: Sections maintain design system
- **Easy Updates**: Content editors manage all content independently

---

## Schema Architecture

### 4 Schema Categories

#### 1. Globals (Singletons - Only 1 instance)
- **Site Settings**: Logo, colors, hero images, social links
- **Navigation**: Menu items and CTA button
- **Footer**: Footer links and copyright
- **SEO Settings**: Default meta tags, analytics IDs

#### 2. Pages (1 per route)
- **Homepage**: Composed of 7 sections
- **Timeline Page**: Composed of 4 phases + events
- **Generic Page**: Template for future pages

#### 3. Sections (Reusable building blocks)
- **Hero Sections**: Video Hero, Image Hero
- **Content Sections**: About Us, Story Preview, Event Details, Quick Preview, Location
- **Family Sections**: Our Family (pets)
- **Timeline Sections**: Timeline Phase, Timeline Event

#### 4. Documents (Standalone content)
- **Pet**: Individual pet profiles (4 pets)
- **Story Card**: Timeline moment cards (3 cards)
- **Feature Card**: Homepage feature cards (4 cards)
- **Wedding Settings**: Wedding date, venue, dress code

---

## Migration Strategy

### 5-Week Migration Plan

#### Week 1: Setup & Schema Development
- Install Sanity dependencies
- Create all 40+ schemas
- Configure Sanity Studio
- Test in development

#### Week 2: Data Migration
- Run migration scripts for each table
- Upload images to Sanity
- Verify data integrity
- Test content editing workflow

#### Week 3: Frontend Integration
- Update Next.js components to use Sanity
- Implement dynamic section rendering
- Add TypeScript types
- Test all pages

#### Week 4: Testing & QA
- Performance testing
- Mobile responsive testing
- SEO validation
- Content editor training

#### Week 5: Launch & Cleanup
- Deploy to production
- Monitor performance
- Archive old Supabase content tables
- Document final architecture

### Migration Safety

- **No Data Loss**: Supabase tables archived, not deleted
- **Gradual Migration**: Migrate one section at a time
- **Rollback Plan**: Can revert to Supabase if needed
- **Zero Downtime**: Migrate behind the scenes, switch when ready

---

## Content Tables Migration Map

| Current (Supabase) | Future (Sanity) | Migration Complexity |
|--------------------|-----------------|---------------------|
| `hero_text` | `videoHero` section | Low |
| `wedding_settings` | `weddingSettings` document | Low |
| `story_cards` (3 rows) | `storyCard` documents | Low |
| `homepage_features` (4 rows) | `featureCard` documents | Low |
| `pets` (4 rows) | `pet` documents | Medium (images) |
| `timeline_events` (~20 rows) | `timelineEvent` documents | Medium (images) |
| Hardcoded phases | `timelinePhase` documents | Low |
| `about_us_items` | `aboutUs` section | Medium (aggregation) |
| Navigation (code) | `navigation` global | Low |

**Total Records to Migrate**: ~40 content records + ~50 images

---

## Technical Stack

### Current Stack
- Next.js 15.5.4
- Supabase (PostgreSQL)
- TypeScript
- Tailwind CSS

### Adding to Stack
- **Sanity CMS** v3
- **@sanity/image-url** - Image optimization
- **next-sanity** - Next.js integration
- **sanity-plugin-media** - Media library
- **GROQ** - Query language

### No Changes To
- RSVP system (stays in Supabase)
- Payment processing (stays in Supabase)
- Gift registry (stays in Supabase)
- User gallery (stays in Supabase)

---

## Content Editor Experience

### Before (Current Supabase Admin)

1. Navigate to `/admin/hero-text`
2. Fill out HTML form with text inputs
3. Submit form → writes to Supabase
4. Refresh website to see changes
5. No preview, no undo, no versioning

### After (Sanity Studio)

1. Navigate to `/studio`
2. Click "Homepage"
3. Edit sections visually with rich text editor
4. Drag sections to reorder
5. Upload images with drag-and-drop
6. Preview changes before publishing
7. Publish when ready
8. Full version history and undo

**Time Savings**: 70% faster content updates

---

## Performance Optimization

### Image Optimization
- **Automatic WebP/AVIF conversion**
- **Responsive image sizing**
- **CDN delivery** (Sanity's global CDN)
- **Blur placeholder generation**
- **Hotspot cropping** for focal points

### Caching Strategy
- **ISR (Incremental Static Regeneration)**: Revalidate every 60 seconds
- **CDN Caching**: Sanity CDN caches content globally
- **On-Demand Revalidation**: Webhook triggers instant updates
- **Client-side Caching**: Browser caches images

### Expected Performance Gains
- **50% faster image loading** (CDN + optimization)
- **30% faster page loads** (static generation)
- **90% fewer database queries** (cached content)

---

## Cost Analysis

### Sanity Pricing (Free Tier)

**Included**:
- Unlimited API requests
- 3 users
- 10GB bandwidth/month
- 10GB asset storage
- Version history

**Wedding Website Usage** (estimated):
- ~40 content documents
- ~50 images (~200MB)
- ~3 editors
- ~1GB bandwidth/month

**Cost**: $0/month (well within free tier)

### Comparison to Current Setup

| Item | Current (Supabase) | With Sanity | Savings |
|------|-------------------|-------------|---------|
| Content Storage | $0 | $0 | $0 |
| Image CDN | Railway | Sanity CDN | Better performance |
| Admin UI | Custom built | Sanity Studio | 10+ dev hours |
| Content Versioning | None | Included | Priceless |

---

## Risk Assessment

### Low Risk
- Content migration (40 records)
- Schema creation (40+ schemas)
- Frontend integration (7 components)

### Medium Risk
- Image migration (~50 images)
- Performance impact (mitigated by CDN)
- Learning curve for content editors

### High Risk
- None identified

### Mitigation Strategies
- **Phased migration**: One section at a time
- **Parallel run**: Keep Supabase active during migration
- **Comprehensive testing**: Test each phase before proceeding
- **Rollback plan**: Can revert to Supabase if needed
- **Content backup**: Export Sanity content regularly

---

## Success Metrics

### Technical Metrics
- [ ] All 40 content records migrated
- [ ] All 50 images uploaded and optimized
- [ ] Page load time < 2 seconds
- [ ] Lighthouse score > 90
- [ ] Zero broken images/links

### Business Metrics
- [ ] Content update time reduced by 70%
- [ ] Content editors can update independently
- [ ] Mobile experience maintained
- [ ] SEO rankings maintained/improved
- [ ] Zero downtime during migration

### User Experience Metrics
- [ ] Content editors satisfied with Studio
- [ ] Website visitors see no difference
- [ ] All features working (RSVP, gifts, etc.)
- [ ] Images load faster than before

---

## Timeline & Milestones

| Week | Milestone | Key Deliverable |
|------|-----------|-----------------|
| 1 | Setup Complete | Sanity Studio ready with all schemas |
| 2 | Data Migrated | All content in Sanity, images uploaded |
| 3 | Integration Done | Website using Sanity content |
| 4 | Testing Complete | QA passed, ready for production |
| 5 | Launch & Monitor | Live in production, monitoring metrics |

**Total Duration**: 5 weeks
**Development Effort**: ~40-60 hours

---

## Decision Framework

### When to Use Sanity (Content Management)

- ✅ Marketing copy and descriptions
- ✅ Images and media assets
- ✅ Page layouts and structure
- ✅ Navigation and menus
- ✅ Timeline events and stories
- ✅ Pet profiles and features

### When to Use Supabase (Transactional Data)

- ✅ User submissions (RSVP forms)
- ✅ Payment transactions
- ✅ Gift registry purchases
- ✅ User-uploaded photos
- ✅ Real-time features
- ✅ Authentication

---

## Next Steps

### Immediate Actions (This Week)

1. **Review Architecture** - Team reviews this document
2. **Create Sanity Project** - Set up on sanity.io
3. **Install Dependencies** - Add Sanity to Next.js project
4. **Create First Schema** - Build `siteSettings` as proof of concept

### Short-term Actions (Weeks 1-2)

1. **Complete Schema Development** - All 40+ schemas created
2. **Test Studio** - Content editors test interface
3. **Run Migration Scripts** - Migrate first batch of content
4. **Upload Images** - Migrate image assets

### Long-term Actions (Weeks 3-5)

1. **Frontend Integration** - Update all components
2. **Performance Testing** - Benchmark and optimize
3. **Content Editor Training** - Train Ylana on Studio
4. **Production Launch** - Deploy to production
5. **Post-Launch Monitoring** - Monitor metrics and fix issues

---

## Recommendation

**Proceed with Sanity Migration**

### Why Now?

1. **Wedding Date**: November 20, 2025 (13 months away)
2. **Content Freeze**: Need stable content management before wedding
3. **Content Updates**: Frequent updates expected (timeline, photos)
4. **Editor Independence**: Ylana needs to manage content independently
5. **Professional Polish**: Sanity provides professional CMS experience

### Why Sanity Specifically?

1. **DTF Pattern Proven**: Din Tai Fung uses this successfully
2. **Free Tier Sufficient**: $0/month for wedding website usage
3. **Best in Class**: Industry-leading CMS for structured content
4. **Developer Experience**: Excellent TypeScript support
5. **Content Editor Experience**: Intuitive visual interface

### Expected ROI

- **Time Savings**: 70% faster content updates
- **Developer Freedom**: No more content bottlenecks
- **Better UX**: Faster images, better caching
- **Professional**: Industry-standard CMS
- **Peace of Mind**: Version history, backups, rollbacks

---

## Questions & Answers

### Q: Why not keep everything in Supabase?
**A**: Supabase is excellent for transactional data but not optimized for content management. No visual editor, no media library, no versioning.

### Q: Why not use WordPress or another CMS?
**A**: Sanity is API-first, built for modern frameworks like Next.js. Better performance, better developer experience, free tier sufficient.

### Q: What if content editors don't like Sanity?
**A**: Sanity Studio is considered one of the best content editing experiences. If issues arise, we have a rollback plan to Supabase.

### Q: How long will migration take?
**A**: 5 weeks total, but can be done in parallel with other development. 40-60 hours of development effort.

### Q: What if we need to migrate back?
**A**: All Supabase tables remain intact (archived, not deleted). Can switch back to Supabase queries if needed.

### Q: Will this affect RSVP and gift registry?
**A**: No. Those stay in Supabase. Only content (marketing pages, timeline, images) moves to Sanity.

### Q: What's the cost after the wedding?
**A**: Still $0/month (free tier). Website becomes a digital memory, content rarely changes.

### Q: Can we migrate one page at a time?
**A**: Yes! Can start with homepage, then timeline page, etc. Gradual migration is safer.

---

## Documentation Index

This executive summary is part of a comprehensive documentation suite:

1. **SANITY_EXECUTIVE_SUMMARY.md** (this document) - High-level overview
2. **SANITY_ARCHITECTURE.md** - Complete technical architecture with all schemas
3. **SANITY_IMPLEMENTATION_GUIDE.md** - Practical code examples and integration
4. **SANITY_MIGRATION_PLAN.md** - Step-by-step migration scripts and procedures

**Location**: `/Users/helrabelo/code/personal/thousanddaysoflove/docs/`

---

## Approval & Sign-off

### Technical Approval
- [ ] Architecture reviewed by Hel (Senior Developer)
- [ ] Performance benchmarks acceptable
- [ ] Security considerations addressed
- [ ] Cost analysis approved

### Business Approval
- [ ] Timeline acceptable
- [ ] Budget approved ($0/month)
- [ ] Content editor requirements met
- [ ] Risk assessment reviewed

### Ready to Proceed?
- [ ] Sanity project created
- [ ] Development environment ready
- [ ] Migration scripts prepared
- [ ] Team aligned on timeline

---

**Status**: Ready for Implementation
**Recommended Start Date**: Immediately (13 months before wedding)
**Estimated Completion**: 5 weeks from start

---

*This architecture document prepared for the Thousand Days of Love wedding website migration project. For questions or clarifications, consult the detailed architecture documents or contact the development team.*
