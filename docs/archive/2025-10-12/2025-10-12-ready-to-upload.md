# 🎉 Ready to Upload Your 115 Wedding Photos!

## Status: ✅ Everything Ready

Your bulk upload script is complete and ready to run!

---

## Quick Start (Single Command)

```bash
npx tsx scripts/bulk-upload-gallery.ts
```

That's it! The script will:
1. Read all 115 images from `~/Downloads/casamento-hy`
2. Upload to Sanity (5 at a time, ~2-3 minutes total)
3. Create gallery documents with titles, categories, tags
4. Show progress for each image

---

## What Happens

### During Upload (2-3 minutes)
```
🚀 Starting bulk gallery upload to Sanity...
📁 Images directory: ~/Downloads/casamento-hy
📷 Found 115 images to upload

📦 Processing batch 1 of 23
   ⬆️  Uploading: Casamento H❤️Y - 1 of 117.jpeg
   ✅ Created: Momento 1 (engagement)
   ...

============================================================
📊 Upload Summary
============================================================
✅ Successfully uploaded: 115 images
============================================================
```

### Auto-Generated Data for Each Image
- **Title**: "Momento 1", "Momento 2", etc.
- **Category**: Auto-assigned based on image number
  - 1-15: Engagement
  - 16-30: Dates
  - 31-45: Travel
  - 46-60: Special Moments
  - 61-75: Friends
  - 76-90: Family
  - 91-105: Wedding Prep
  - 106+: Professional
- **Tags**: "casamento", "Casa HY", "1000 dias"
- **Public**: All visible on website
- **Display Order**: Matches image number

---

## After Upload

### 1. View in Sanity Studio
```bash
npm run dev
```
Then visit: **http://localhost:3000/studio**

Navigate to: **📷 Galeria → Todas as Imagens**

### 2. View on Gallery Page
Visit: **http://localhost:3000/galeria**

You'll see:
- ✅ All 115 images in beautiful masonry layout
- ✅ Lightbox for full-size viewing
- ✅ Responsive design
- ✅ Optimized WebP images from Sanity CDN

### 3. Customize (Optional)
In Sanity Studio, edit images to:
- Add meaningful titles (instead of "Momento X")
- Write descriptions telling the story
- Correct categories if auto-assignment was wrong
- Mark special images as featured (⭐)
- Add dates and locations

---

## Files Created

1. **`scripts/bulk-upload-gallery.ts`** - The upload script
2. **`BULK_UPLOAD_GUIDE.md`** - Detailed documentation
3. **`READY_TO_UPLOAD.md`** - This quick reference

---

## Ready? Let's Go! 🚀

```bash
npx tsx scripts/bulk-upload-gallery.ts
```

See you on the other side with 115 beautiful wedding photos in Sanity! 📷✨
