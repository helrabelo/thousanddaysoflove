# Timeline Migration Guide - Supabase to Sanity

## Overview

This guide explains how to populate Sanity's `timelinePage` with the timeline data from Supabase.

## What Was Done

### 1. Data Transformation ✅

The migration script (`scripts/migration/migrate-timeline-to-sanity.js`) transforms 15 Supabase timeline events into Sanity's format:

- **Calculated day numbers** - Each event now has a `dayNumber` (days since 2023-01-06)
- **Grouped into phases** - Events organized into 3 meaningful phases:
  - **Os Primeiros Dias** (Days 1-100): 5 events - From Tinder match to becoming a family
  - **Construindo Juntos** (Days 101-500): 4 events - Building home and family together
  - **Rumo ao Para Sempre** (Days 501-1000): 6 events - From engagement to wedding
- **Alternating layout** - Events alternate between left/right alignment for visual variety
- **Complete metadata** - Hero section, SEO, and phase descriptions included

### 2. Day Number Calculations

| Event | Date | Day Number |
|-------|------|------------|
| Do Tinder ao WhatsApp | 2023-01-06 | Day 1 |
| Casa Fontana & Avatar VIP | 2023-01-14 | Day 9 |
| O Gesto que Mudou Tudo | 2023-02-15 | Day 41 |
| Guaramiranga Espontâneo | 2023-02-25 | Day 51 |
| Cacao Se Junta à Linda | 2023-03-01 | Day 55 |
| Primeiro Réveillon Juntos | 2023-12-31 | Day 360 |
| 1º Aniversário Surpresa | 2024-02-25 | Day 416 |
| Linda Nos Deu Olivia e Oliver | 2024-03-10 | Day 430 |
| O Apartamento dos Sonhos | 2024-03-15 | Day 435 |
| Mangue Azul & Rio de Janeiro | 2024-10-25 | Day 659 |
| Natal em Casa Própria | 2024-12-25 | Day 720 |
| Segundo Réveillon em Casa PRÓPRIA | 2024-12-31 | Day 726 |
| Pensando no Futuro Juntos | 2025-04-15 | Day 831 |
| O Pedido Perfeito | 2025-08-30 | Day 968 |
| Mil Dias Viram Para Sempre | 2025-11-20 | Day 1050 |

### 3. Generated Files

- ✅ **Migration script**: `scripts/migration/migrate-timeline-to-sanity.js`
- ✅ **JSON output**: `scripts/migration/sanity-timeline-import.json`

---

## How to Import into Sanity Studio

### Option 1: Manual Copy-Paste (Recommended)

1. **Start Sanity Studio**
   ```bash
   npm run dev
   # Studio available at: http://localhost:3002/studio
   ```

2. **Open Timeline Page**
   - Navigate to **Páginas** → **Nossa História** in the sidebar
   - If the document doesn't exist, create a new `timelinePage` document

3. **Use Vision Plugin to Import**
   - In Studio, open the **Vision** tab (should be in the navigation)
   - Use this GROQ query to create the document:
   ```groq
   // Paste the JSON from sanity-timeline-import.json
   // Then use Sanity's API to create the document
   ```

4. **OR Use API Import Script** (see Option 2 below)

### Option 2: API Import Script (Automated)

Create a simple import script using Sanity's client:

```javascript
// scripts/migration/import-to-sanity.js
const { createClient } = require('@sanity/client');
const timelineData = require('./sanity-timeline-import.json');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN, // Need write token
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function importTimeline() {
  try {
    const result = await client.create(timelineData);
    console.log('✅ Timeline imported successfully!');
    console.log('Document ID:', result._id);
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importTimeline();
```

Run it:
```bash
node scripts/migration/import-to-sanity.js
```

### Option 3: Manual Entry (Most Control)

If you prefer to manually enter each event:

1. Open Sanity Studio
2. Create new **Timeline Page** document
3. Add **Hero Section**:
   - Title: "Mil Dias de Amor"
   - Subtitle: "Do primeiro \"oi\" no WhatsApp ao altar..."

4. Add **3 Phases** and their events using the data from `sanity-timeline-import.json`

---

## After Import

### Add Images to Events

Images were **not included** in the migration (per your request). To add them:

1. Open each event in Sanity Studio
2. Click **"Image"** field
3. Upload or select image from Sanity's media library
4. Add alt text for accessibility
5. Save and publish

### Image Mapping Reference

| Event Title | Original Supabase URL |
|-------------|----------------------|
| Do Tinder ao WhatsApp | `/images/timeline/primeiro-oi.jpg` |
| Casa Fontana & Avatar VIP | `/images/timeline/primeiro-encontro.jpg` |
| O Gesto que Mudou Tudo | `/images/timeline/gesto-carinho.jpg` |
| Guaramiranga Espontâneo | `/images/timeline/guaramiranga.jpg` |
| Cacao Se Junta à Linda | `/images/timeline/cacao.jpg` |
| Primeiro Réveillon Juntos | `/images/timeline/reveillon.jpg` |
| 1º Aniversário Surpresa | `/images/timeline/aniversario1.jpg` |
| Linda Nos Deu Olivia e Oliver | `/images/timeline/filhotes.jpg` |
| O Apartamento dos Sonhos | `/images/timeline/apartamento.jpg` |
| Mangue Azul & Rio de Janeiro | `/images/timeline/aniversario2.jpg` |
| Natal em Casa Própria | `/images/timeline/natal.jpg` |
| Segundo Réveillon em Casa PRÓPRIA | `/images/timeline/reveillon2.jpg` |
| Pensando no Futuro Juntos | `/images/timeline/futuro.jpg` |
| O Pedido Perfeito | `/images/timeline/pedido.jpg` |
| Mil Dias Viram Para Sempre | `/images/timeline/casamento.jpg` |

You can bulk upload these to Sanity's media library, then reference them in each event.

---

## Verification Checklist

After importing, verify:

- [ ] Timeline page exists in Sanity Studio
- [ ] Hero section displays correctly
- [ ] 3 phases are present:
  - [ ] Os Primeiros Dias (5 events)
  - [ ] Construindo Juntos (4 events)
  - [ ] Rumo ao Para Sempre (6 events)
- [ ] All 15 events have correct:
  - [ ] Day numbers
  - [ ] Dates
  - [ ] Titles
  - [ ] Descriptions
  - [ ] Content alignment (left/right alternating)
- [ ] SEO metadata is complete
- [ ] Document is published

---

## Phase Details

### Phase 1: Os Primeiros Dias (Days 1-100)
**Theme**: From Tinder match to becoming a family

Events:
1. Day 1 - Do Tinder ao WhatsApp
2. Day 9 - Casa Fontana & Avatar VIP
3. Day 41 - O Gesto que Mudou Tudo
4. Day 51 - Guaramiranga Espontâneo
5. Day 55 - Cacao Se Junta à Linda

### Phase 2: Construindo Juntos (Days 101-500)
**Theme**: Building home and family together

Events:
1. Day 360 - Primeiro Réveillon Juntos
2. Day 416 - 1º Aniversário Surpresa
3. Day 430 - Linda Nos Deu Olivia e Oliver
4. Day 435 - O Apartamento dos Sonhos

### Phase 3: Rumo ao Para Sempre (Days 501-1000)
**Theme**: From engagement to wedding

Events:
1. Day 659 - Mangue Azul & Rio de Janeiro
2. Day 720 - Natal em Casa Própria
3. Day 726 - Segundo Réveillon em Casa PRÓPRIA
4. Day 831 - Pensando no Futuro Juntos
5. Day 968 - O Pedido Perfeito
6. Day 1050 - Mil Dias Viram Para Sempre

---

## Notes

- **Day 1050 vs 1000**: The calculation shows Day 1050 for the wedding date, but you mentioned it's the "1000th day" - you may want to verify the actual count or adjust the start date if needed
- **Images**: All image references were intentionally omitted from the import
- **Content alignment**: Events alternate left/right for visual variety (can be changed in Studio)
- **Flexibility**: Feel free to reorganize phases, adjust day ranges, or move events between phases as needed

---

## Troubleshooting

**Issue**: Can't find timelinePage in Studio
- **Solution**: Make sure `timelinePage` schema is registered in `src/sanity/schemas/index.ts`

**Issue**: Import fails with validation errors
- **Solution**: Check that all required fields are present (dayNumber, date, title, description)

**Issue**: Want to add more events
- **Solution**: Simply add new events to the appropriate phase in Sanity Studio

---

## Next Steps

1. Import timeline data using one of the methods above
2. Add images to each event
3. Review and adjust phase descriptions if needed
4. Update frontend components to fetch from Sanity (instead of Supabase)
5. Test the timeline page
6. Publish changes

---

## Questions?

Refer to:
- **Sanity docs**: https://www.sanity.io/docs
- **Project docs**: `/docs/SANITY_ARCHITECTURE.md`
- **Schema reference**: `src/sanity/schemas/pages/timelinePage.ts`
