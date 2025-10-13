# Bulk Upload Gallery Images - Quick Guide

## What This Does

Uploads all 115 images from `~/Downloads/casamento-hy` to Sanity CMS automatically!

---

## Quick Start (3 Commands)

```bash
# 1. Navigate to project
cd /Users/helrabelo/code/personal/thousanddaysoflove

# 2. Run the bulk upload script
npx tsx scripts/bulk-upload-gallery.ts

# 3. Open Sanity Studio to see your images
npm run dev
# Then visit: http://localhost:3000/studio
```

**That's it!** ✨

---

## What the Script Does

### Automatic Processing

1. **Reads all 115 images** from `~/Downloads/casamento-hy`
2. **Uploads to Sanity** (5 images at a time to avoid rate limits)
3. **Creates gallery documents** with:
   - Title: "Momento 1", "Momento 2", etc.
   - Category: Auto-assigned based on image number
   - Description: Auto-generated
   - All set to public
   - Proper display order

### Category Assignment

The script auto-categorizes images based on their number:

- **Images 1-15**: Engagement (Noivado)
- **Images 16-30**: Dates (Encontros)
- **Images 31-45**: Travel (Viagens)
- **Images 46-60**: Special Moments (Momentos Especiais)
- **Images 61-75**: Friends (Amigos)
- **Images 76-90**: Family (Família)
- **Images 91-105**: Wedding Prep (Preparativos)
- **Images 106+**: Professional (Profissionais)

**Note**: You can easily change categories later in Sanity Studio!

---

## Script Features

### Smart Upload
- ✅ Uploads 5 images at a time (batch processing)
- ✅ 2-second delay between batches (avoid rate limiting)
- ✅ Progress tracking for each image
- ✅ Error handling with detailed error logs
- ✅ Final summary statistics

### Auto-Generated Data
- **Title**: "Momento 1", "Momento 2", etc. (from filename)
- **Description**: "Foto X da galeria de casamento"
- **Category**: Auto-assigned by image number range
- **Tags**: "casamento", "Casa HY", "1000 dias"
- **Display Order**: Matches image number for proper sorting
- **Public**: All images set to visible by default
- **Featured**: None featured (you choose later)

---

## Expected Output

When you run the script, you'll see:

```
🚀 Starting bulk gallery upload to Sanity...

📁 Images directory: /Users/helrabelo/Downloads/casamento-hy
📷 Found 115 images to upload

📦 Processing batch 1 of 23
   Images 1-5 of 115
   ⬆️  Uploading: Casamento H❤️Y - 1 of 117.jpeg
   ✅ Created: Momento 1 (engagement)
   ⬆️  Uploading: Casamento H❤️Y - 2 of 117.jpeg
   ✅ Created: Momento 2 (engagement)
   ...
   ⏸️  Waiting 2s before next batch...

📦 Processing batch 2 of 23
   Images 6-10 of 115
   ...

============================================================
📊 Upload Summary
============================================================
✅ Successfully uploaded: 115 images
⏭️  Skipped: 0 images
❌ Errors: 0 images
📁 Total processed: 115 images
============================================================

✨ Upload complete!

🎨 Next steps:
   1. Open Sanity Studio: http://localhost:3000/studio
   2. Navigate to: 📷 Galeria → Todas as Imagens
   3. Review uploaded images
   4. Edit descriptions, categories, and feature special images
   5. Visit gallery page: http://localhost:3000/galeria
```

---

## Estimated Time

- **Upload Speed**: ~5 images per batch, 2 seconds between batches
- **Total Batches**: 23 batches (115 images ÷ 5)
- **Estimated Time**: **~2-3 minutes** for all 115 images

Progress is shown in real-time!

---

## After Upload

### 1. Review in Sanity Studio

```bash
npm run dev
# Visit: http://localhost:3000/studio
```

Navigate to **📷 Galeria → Todas as Imagens**

You'll see all 115 images organized by display order!

### 2. Customize Images

For each image, you can:
- ✏️ **Edit Title**: Change from "Momento X" to meaningful titles
- 📝 **Add Descriptions**: Tell the story behind each photo
- 🏷️ **Update Categories**: Move to correct category if auto-assignment was wrong
- ⭐ **Feature Special Images**: Mark favorites to appear in Featured section
- 📅 **Add Dates**: When was the photo taken?
- 📍 **Add Locations**: Where was it taken?
- 🏆 **Set Display Order**: Change ordering if needed

### 3. Batch Editing

**Tip**: Use Sanity Studio's filters to edit images by category:

1. Click **📂 Por Categoria**
2. Choose category (e.g., "✈️ Viagens")
3. Edit all travel photos at once

### 4. View Gallery Page

Visit: **http://localhost:3000/galeria**

You should see:
- ✅ All 115 images in masonry layout
- ✅ Organized by display order
- ✅ Lightbox for full-size viewing
- ✅ Featured section (when you mark images as featured)
- ✅ Beautiful responsive design

---

## Customizing the Script

### Change Image Directory

Edit `scripts/bulk-upload-gallery.ts`:

```typescript
const IMAGES_DIR = path.join(process.env.HOME || '', 'Downloads', 'casamento-hy')
// Change to your directory ↑
```

### Change Batch Size

```typescript
const BATCH_SIZE = 5 // Upload 5 images at a time
// Increase for faster uploads (but risk rate limiting)
// Decrease for more conservative uploads
```

### Change Delay Between Batches

```typescript
const DELAY_BETWEEN_BATCHES = 2000 // 2 seconds
// Increase if you hit rate limits
// Decrease for faster uploads
```

### Customize Category Logic

Edit the `determineCategory` function to match your actual photo content:

```typescript
function determineCategory(imageNumber: number): string {
  // Example: First 20 are engagement, next 30 are travel, etc.
  if (imageNumber <= 20) return 'engagement'
  if (imageNumber <= 50) return 'travel'
  if (imageNumber <= 80) return 'dates'
  // ... customize as needed
  return 'special_moments'
}
```

### Customize Titles

Edit the `generateTitle` function:

```typescript
function generateTitle(filename: string): string {
  const number = extractImageNumber(filename)
  return `Nossa Foto ${number}` // Custom title format
}
```

---

## Troubleshooting

### Error: SANITY_API_WRITE_TOKEN not found

**Solution**: Check `.env.local` has the token:

```bash
cat .env.local | grep SANITY_API_WRITE_TOKEN
```

If missing, get it from Sanity.io dashboard.

### Error: Images directory not found

**Solution**: Verify the directory exists:

```bash
ls ~/Downloads/casamento-hy
```

If it's elsewhere, update `IMAGES_DIR` in the script.

### Rate Limit Errors

**Solution**: The script already handles this with batching and delays. If you still hit limits:

1. Decrease `BATCH_SIZE` (try 3 instead of 5)
2. Increase `DELAY_BETWEEN_BATCHES` (try 3000ms instead of 2000ms)

### Upload Stalls

**Solution**: The script will show which image failed. You can:

1. Fix the specific image file
2. Re-run the script (it will skip duplicates if you add logic)
3. Or manually upload failed images via Sanity Studio

---

## Manual Upload (Alternative)

If you prefer manual control:

1. Open Sanity Studio: http://localhost:3000/studio
2. Navigate to **📷 Galeria**
3. Click **"+ Create"**
4. Drag & drop multiple images
5. Fill in details for each
6. Click **"Publish"**

Sanity Studio supports multi-file upload with drag & drop!

---

## Technical Details

### Script Stack
- **TypeScript**: Type-safe upload logic
- **@sanity/client**: Official Sanity JavaScript client
- **Node.js fs/path**: File system operations
- **Batch Processing**: 5 images per batch with 2s delays

### Sanity API
- **Assets API**: Uploads image files to Sanity CDN
- **Documents API**: Creates galleryImage documents
- **Authentication**: Uses SANITY_API_WRITE_TOKEN from env

### Error Handling
- Try/catch for each image upload
- Detailed error logging
- Continues on errors (won't stop entire batch)
- Summary statistics at end

---

## What Gets Uploaded

Each image becomes a complete `galleryImage` document with:

```typescript
{
  _type: 'galleryImage',
  title: 'Momento 1',
  description: 'Foto 1 da galeria de casamento',
  image: {
    asset: { _ref: 'image-abc123...' }  // Sanity CDN asset
  },
  mediaType: 'photo',
  category: 'engagement',  // Auto-assigned
  tags: ['casamento', 'Casa HY', '1000 dias'],
  isFeatured: false,
  isPublic: true,
  displayOrder: 1
}
```

You can edit all these fields later in Sanity Studio!

---

## Summary

**Single Command Upload**:
```bash
npx tsx scripts/bulk-upload-gallery.ts
```

**Time**: ~2-3 minutes for 115 images

**Result**:
- ✅ All images uploaded to Sanity
- ✅ Organized by categories
- ✅ Ready to view in gallery page
- ✅ Easy to customize in Studio

**Next**: Edit titles/descriptions/categories in Sanity Studio to personalize your gallery! 🎉
