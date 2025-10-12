# Homepage Hero Fix Summary

## Issues Identified

### 1. **Schema/Query Mismatch** ✅ FIXED
**Problem**: Sanity query was looking for `videoUrl` but schema had `backgroundVideo` and `backgroundImage`

**Solution**: Updated `/src/sanity/queries/homepage.ts` to fetch:
```typescript
backgroundVideo {
  asset-> { url }
},
backgroundImage {
  asset-> { url },
  alt
},
posterImage {
  asset-> { url },
  alt
}
```

### 2. **Component Props Mismatch** ✅ FIXED
**Problem**: VideoHeroSection component expected wrong data structure

**Solution**: Updated `VideoHeroSection.tsx` interface and fallback logic:
```typescript
const posterUrl = data?.posterImage?.asset?.url || data?.backgroundImage?.asset?.url || '/images/hero-poster.jpg'
const videoUrl = data?.backgroundVideo?.asset?.url || '/videos/hero-couple.mp4'
```

### 3. **Homepage Sections Not Referencing Properly** ✅ FIXED
**Problem**: Sanity Studio showing "Item of type reference not valid for this list" errors

**Solution**: Updated `/src/sanity/schemas/pages/homePage.ts` to use proper references:
```typescript
sections: [
  { type: 'reference', to: [{ type: 'videoHero' }] },
  { type: 'reference', to: [{ type: 'eventDetails' }] },
  // ... etc
]
```

### 4. **Turbopack/Styled-Components Resolution Issue** ⚠️ IN PROGRESS
**Problem**: Turbopack having trouble resolving `styled-components` dependency for Sanity Studio

**Workaround Options**:
1. Run without Turbopack: `next dev` (remove --turbopack flag)
2. Clear `.next` cache: `rm -rf .next && npm run dev`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

## Files Changed

1. ✅ `/src/sanity/queries/homepage.ts` - Fixed video/image field queries
2. ✅ `/src/components/sections/VideoHeroSection.tsx` - Fixed component props and data structure
3. ✅ `/src/sanity/schemas/pages/homePage.ts` - Fixed sections array to use references
4. ✅ `/scripts/setup-sanity-homepage.ts` - Created setup script for Sanity sections

## Next Steps

### Immediate (Fix Hero)

1. **Setup Sanity Homepage Content**:
   ```bash
   # Make sure you have a SANITY_API_TOKEN in .env.local
   npx tsx scripts/setup-sanity-homepage.ts
   ```

2. **Open Sanity Studio**:
   ```
   http://localhost:3000/studio
   # Or try: http://localhost:3001/studio
   ```

3. **Configure Video Hero Section**:
   - Navigate to "Páginas" → "Homepage"
   - Click on the "Hero com Vídeo" section
   - Upload your video to "Vídeo de Fundo"
   - Upload your poster image to "Imagem de Fundo"
   - Verify all text fields are correct
   - **Publish** the changes

4. **Test Homepage**:
   ```
   http://localhost:3001
   ```

### If Styled-Components Error Persists

**Option A: Run without Turbopack**
```bash
# Edit package.json, change:
"dev": "next dev"
# Instead of:
"dev": "next dev --turbopack"

# Then:
npm run dev
```

**Option B: Clear Cache**
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

**Option C: Check Next.js Config**
The warnings suggest updating `next.config.ts`. Try running:
```bash
npx @next/codemod@latest next-experimental-turbo-to-turbopack .
```

## Architecture Plan Created

I've also created comprehensive migration documentation in `/docs/`:

- **MIGRATION_SUMMARY.md** - Executive summary (12 pages)
- **ARCHITECTURE_COMPARISON.md** - Before/after comparison (25 pages)
- **CMS_CONSOLIDATION_PLAN.md** - Complete technical spec (40+ pages)
- **QUICK_START_MIGRATION.md** - Implementation guide (20 pages)

**Key Recommendation**: Move Gallery and Gifts from Supabase to Sanity CMS, keep only RSVPs in Supabase.

## Testing Checklist

- [ ] Sanity Studio loads at `/studio`
- [ ] Homepage sections array shows 7 references
- [ ] Video Hero section has video and images uploaded
- [ ] All sections are published in Sanity
- [ ] Homepage at `/` shows video/images
- [ ] Hero text (names, tagline, date) is visible
- [ ] CTA buttons ("Confirmar Presença", "Nossa História") are visible and clickable
- [ ] Video plays automatically (if not in reduced motion mode)

## Dev Server Status

**Current Running Servers**:
- Main site: http://localhost:3001 (Next.js)
- Sanity Studio: http://localhost:3001/studio
- Supabase Studio: http://127.0.0.1:54323

## Support

If issues persist, check:
1. Browser console for JavaScript errors
2. Network tab for failed image/video requests
3. Sanity Studio console for GraphQL/GROQ errors
4. Next.js server logs for build errors

---
**Fixed**: October 12, 2025
**Schema Fixes**: ✅ Complete
**Component Fixes**: ✅ Complete
**Turbopack Issue**: ⚠️ In Progress
