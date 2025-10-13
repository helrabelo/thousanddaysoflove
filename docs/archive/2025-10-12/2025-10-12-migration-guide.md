# Timeline Migration Guide

This guide will help you migrate your 15 timeline events from Supabase to Sanity.

## Prerequisites

1. **Get your Sanity API Token**:
   ```bash
   # Open Sanity Management Console
   open https://sanity.io/manage

   # Steps:
   # 1. Select your project: "Thousand Days of Love"
   # 2. Go to "API" tab
   # 3. Click "Add API token"
   # 4. Name: "Migration Script"
   # 5. Permissions: "Editor" (can create/update documents)
   # 6. Copy the token (you'll only see it once!)
   ```

2. **Add token to .env.local**:
   ```bash
   # Open your .env.local file
   nano .env.local

   # Add this line (paste your token):
   SANITY_API_TOKEN=your-token-here
   ```

## Migration Steps

### Step 1: Run the Migration Script

```bash
npm run migrate:timeline
```

This will:
- ✅ Create 3 default story phases:
  - "Os Primeiros Dias" (Day 1-100)
  - "Construindo Juntos" (Day 101-500)
  - "Caminhando Pro Altar" (Day 501-1000)
- ✅ Migrate all 15 timeline events to storyMoments
- ✅ Calculate day numbers from start date (2023-01-06 = Day 1)
- ✅ Assign each moment to appropriate phase
- ✅ Set first 5 moments to show in homepage preview
- ✅ Add emojis based on milestone type

### Step 2: Verify in Sanity Studio

```bash
# Start dev server (if not running)
npm run dev

# Open Sanity Studio
open http://localhost:3000/studio
```

Navigate to: **Páginas > Nossa História**

You should see:
- 📚 **Fases da História**: 3 phases
- ❤️ **Momentos da História**: 15 moments

### Step 3: Upload Images

The migration script creates all the moments, but **images need to be uploaded manually** in Sanity Studio:

1. Go to: **Páginas > Nossa História > Momentos da História**
2. Open each moment
3. Upload the image (find them in `/public/images/timeline/`)
4. Click "Publish"

**Tip**: You can upload images in bulk by opening multiple moments in tabs.

## What Gets Migrated

### Story Phases (Auto-created)
- ✅ Phase 1: Os Primeiros Dias (Day 1-100)
- ✅ Phase 2: Construindo Juntos (Day 101-500)
- ✅ Phase 3: Caminhando Pro Altar (Day 501-1000)

### Story Moments (From JSON)
All 15 events get migrated with:

| Field | Source | Transformation |
|-------|--------|----------------|
| title | `event.title` | Direct copy |
| date | `event.date` | Converted to Sanity date type |
| icon | `event.milestone_type` | Mapped to emoji (💑, 💖, 🐾, 💍, ❤️) |
| description | `event.description` | Direct copy |
| phase | Calculated | Based on day number |
| dayNumber | Calculated | Days since 2023-01-06 |
| contentAlign | Calculated | Alternating left/right |
| displayOrder | `event.display_order` | Direct copy |
| showInPreview | Calculated | true for first 5 moments |
| showInTimeline | Fixed | true for all |
| isVisible | `event.is_visible` | Direct copy |

### Phase Assignment Logic

```typescript
Day 1-100   → "Os Primeiros Dias"
Day 101-500 → "Construindo Juntos"
Day 501+    → "Caminhando Pro Altar"
```

### Homepage Preview Logic

First 5 moments (by `display_order`) will appear on homepage:
1. Do Tinder ao WhatsApp
2. Casa Fontana & Avatar VIP
3. O Gesto que Mudou Tudo
4. Guaramiranga Espontâneo
5. Cacao Se Junta à Linda

## Verification Checklist

After migration, verify:

- [ ] All 3 phases created and visible
- [ ] All 15 moments created
- [ ] Each moment assigned to correct phase
- [ ] Day numbers calculated correctly
- [ ] Emojis match milestone types
- [ ] First 5 moments have `showInPreview = true`
- [ ] Images uploaded to each moment
- [ ] Homepage preview shows 5 moments
- [ ] Timeline page (`/historia`) shows all moments grouped by phase

## Testing

### Test Homepage Preview
```bash
npm run dev
open http://localhost:3000
```

Scroll to "Nossa História" section - should show 5 moments

### Test Timeline Page
```bash
open http://localhost:3000/historia
```

Should show all 15 moments grouped by 3 phases

## Troubleshooting

### Error: "Missing SANITY_API_TOKEN"
- Make sure you added `SANITY_API_TOKEN` to `.env.local`
- Restart dev server after adding env variables

### Error: "File not found"
- The script expects JSON at: `~/Downloads/timeline_events_rows.json`
- Make sure the file exists at that location

### Images not showing
- Images need to be uploaded manually in Sanity Studio
- The migration script only creates the document structure

### Day numbers seem wrong
- Start date is 2023-01-06 (Day 1)
- Check if timeline event dates are correct in JSON

## Rollback

If something goes wrong:

```bash
# Delete all migrated documents in Sanity Studio
# Navigate to: Páginas > Nossa História
# Select all moments → Delete
# Select all phases → Delete
```

Or use Sanity Vision (GROQ):
```groq
// Delete all story moments
*[_type == "storyMoment"] { _id }

// Delete all story phases
*[_type == "storyPhase"] { _id }
```

## Next Steps

After successful migration:

1. Update the "Nossa História (Preview)" section in homepage to reference the new moments
2. Test visibility toggles work correctly
3. Verify mobile responsive design
4. Update CLAUDE.md with migration completion notes
5. Consider retiring the Supabase timeline_events table

## Support

If you encounter issues:
1. Check console output for specific error messages
2. Verify all prerequisites are met
3. Review this guide's troubleshooting section
4. Check Sanity Studio for any validation errors
