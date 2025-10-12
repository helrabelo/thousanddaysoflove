# Thousand Days of Love - Documentation Index

## Overview
This directory contains all technical documentation for the wedding website project.

## Current Documentation

### CMS Restructure (Sanity Story Content Organization)
**Status**: Planning Complete, Ready for Review

Comprehensive UX research and restructure plan for improving story content organization in Sanity CMS.

#### Documents

1. **[CMS_RESTRUCTURE_EXECUTIVE_SUMMARY.md](./CMS_RESTRUCTURE_EXECUTIVE_SUMMARY.md)**
   - Target Audience: Stakeholders, Decision Makers
   - Length: 200+ lines
   - Contents: Problem statement, solution overview, benefits, risks, timeline, ROI
   - Purpose: Go/no-go decision making

2. **[SANITY_CMS_RESTRUCTURE_PLAN.md](./SANITY_CMS_RESTRUCTURE_PLAN.md)**
   - Target Audience: Developers
   - Length: 600+ lines
   - Contents: Technical specifications, schema designs, migration strategy, rollback plan
   - Purpose: Implementation blueprint

3. **[SANITY_CMS_BEFORE_AFTER_COMPARISON.md](./SANITY_CMS_BEFORE_AFTER_COMPARISON.md)**
   - Target Audience: All stakeholders
   - Length: 300+ lines
   - Contents: Visual comparisons, workflow changes, schema differences, user experience improvements
   - Purpose: Understanding the changes

4. **[SANITY_CMS_USER_GUIDE.md](./SANITY_CMS_USER_GUIDE.md)**
   - Target Audience: Content Editors (Hel & Ylana)
   - Length: 400+ lines
   - Contents: How-to guides, workflows, troubleshooting, best practices
   - Purpose: Post-implementation training

5. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)**
   - Target Audience: Developers
   - Length: 300+ lines
   - Contents: Step-by-step implementation tasks, testing checklist, deployment steps
   - Purpose: Execution roadmap

#### Quick Links

**For Decision Makers**: Start with [Executive Summary](./CMS_RESTRUCTURE_EXECUTIVE_SUMMARY.md)

**For Developers**: Read [Restructure Plan](./SANITY_CMS_RESTRUCTURE_PLAN.md) → Follow [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)

**For Content Editors**: Bookmark [User Guide](./SANITY_CMS_USER_GUIDE.md)

**For Everyone**: Review [Before/After Comparison](./SANITY_CMS_BEFORE_AFTER_COMPARISON.md)

---

### Gallery Migration (Phase 2)
**Status**: Implementation Complete, Ready for Migration

Complete migration from Supabase Storage to Sanity CMS for gallery feature.

#### Documents

1. **[GALLERY_MIGRATION_GUIDE.md](./GALLERY_MIGRATION_GUIDE.md)**
   - Length: 600+ lines
   - Contents: Migration steps, admin options, testing, rollback
   - Purpose: Complete migration instructions

2. **[GALLERY_MIGRATION_SUMMARY.md](./GALLERY_MIGRATION_SUMMARY.md)**
   - Length: 300+ lines
   - Contents: Quick reference, what was built, troubleshooting
   - Purpose: Quick lookup guide

---

### Archived Documentation

Historical documentation moved to [archive/](./archive/) folder:
- Project planning documents
- Session summaries
- Transformation guides
- Schema audits
- Phase analysis

---

## Project Architecture

### Current State

```
Frontend
├── Next.js 15.5.4
├── TypeScript
├── Tailwind CSS
└── Framer Motion

CMS Layer (Sanity)
├── Marketing content (homepage sections)
├── Gallery images (after Phase 2)
├── Future: Timeline events (Phase 4)
└── Future: Gifts & Pets (Phase 3)

Database Layer (Supabase)
├── Transactional data
│   ├── guests (RSVP)
│   ├── payments (PIX)
│   └── wedding_config
└── Future: Migrate timeline/gifts/pets to Sanity
```

### Architecture Goals

**After All Phases Complete**:
- Sanity CMS: All marketing content, gallery, timeline, gifts, pets
- Supabase: Only transactional data (guests, payments, config)
- Cost Reduction: 82% ($45/mo → $8/mo)
- Performance: 75-80% faster page loads with CDN

---

## Implementation Status

### Phase 1: Project Cleanup
- ✅ Documentation organized (39 → 3 essential files)
- ✅ Admin routes cleaned (14 → 7 routes)
- ✅ Database cleanup (7 duplicate tables dropped)
- ✅ Architecture documented

### Phase 2: Gallery Migration
- ✅ Sanity schema created
- ✅ GROQ queries implemented
- ✅ Frontend updated
- ✅ Migration script ready
- ⏳ Pending: Execute migration with production data

### Phase 3: Story Content Restructure
- ✅ UX research complete
- ✅ Documentation complete (5 docs, 1,500+ lines)
- ✅ Implementation plan ready
- ⏳ Pending: Stakeholder review and go/no-go decision

### Phase 4: Timeline Migration
- ⏳ Planned (after Phase 3)

### Phase 5: Gifts & Pets Migration
- ⏳ Planned (after Phase 4)

### Phase 6: Final Cleanup
- ⏳ Planned (after Phase 5)

---

## Quick Commands

### Development
```bash
npm run dev                  # Start Next.js development server
npm run build                # Build for production
npx sanity start            # Start Sanity Studio (deprecated, use /studio)
```

### Database
```bash
npx supabase start          # Start local Supabase
npx supabase studio         # Open Supabase Studio
npx supabase db reset       # Reset database with fresh data
```

### Sanity
```bash
npx sanity deploy           # Deploy Sanity Studio
npx sanity dataset export   # Export dataset backup
npx sanity dataset import   # Import dataset
```

### Migration Scripts
```bash
npx tsx scripts/migrate-gallery-to-sanity.ts        # Gallery migration
npx tsx scripts/migrate-story-content.ts            # Story restructure (future)
```

---

## Need Help?

### For Technical Questions
- Review relevant documentation in this folder
- Check CLAUDE.md for project history
- See PROJECT_STATUS.md for current state

### For Content Editing
- Use Sanity Studio: `http://localhost:3000/studio`
- Follow guides in SANITY_CMS_USER_GUIDE.md

### For Troubleshooting
- Gallery: See GALLERY_MIGRATION_GUIDE.md troubleshooting section
- Story Content: See SANITY_CMS_USER_GUIDE.md FAQ

---

## Documentation Standards

All documentation in this project follows:
- Clear problem statements
- Step-by-step instructions
- Visual comparisons where helpful
- Testing checklists
- Rollback plans
- Success metrics

---

**Last Updated**: 2025-10-12
**Project Status**: Phase 2 implementation complete, Phase 3 planning complete
**Next Action**: Execute gallery migration OR review story restructure plan
