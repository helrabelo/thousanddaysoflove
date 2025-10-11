# Mock Content Guide - Thousand Days of Love

## 🎨 Overview

This guide documents all the mock/placeholder content generated for the wedding website. All images are elegant SVG placeholders that match the wedding design system aesthetic.

## 📦 What Was Generated

A total of **41 SVG placeholder images** were created:

### Hero Images (2 files)
Located in `public/images/`

| File | Size | Description |
|------|------|-------------|
| `hero-poster.jpg` | 1920x1080 | Video poster/loading state with "Hel & Ylana - 1000 Dias de Amor" |
| `hero-couple.jpg` | 1920x1080 | Fallback image for reduced motion with "H ♥ Y" monogram |

### Timeline Photos (15 files)
Located in `public/images/timeline/`

All timeline images are 800x600px and correspond to the 15 milestone events from your love story:

| File | Event | Icon | Description |
|------|-------|------|-------------|
| `primeiro-oi.jpg` | Do Tinder ao WhatsApp | Heart | First "oi" that changed everything |
| `primeiro-encontro.jpg` | Casa Fontana & Avatar VIP | Couple | First date - instant chemistry |
| `o-gesto-decisivo.jpg` | O Gesto que Mudou Tudo | Heart | Ylana bringing medicine when Hel was sick |
| `guaramiranga-pedido.jpg` | Guaramiranga Espontâneo | Ring | Spontaneous proposal in the mountains |
| `chegada-cacao.jpg` | Cacao Se Junta à Linda | Pets | Family grows to 2 pets |
| `reveillon-juntos.jpg` | Primeiro Réveillon Juntos | Celebration | First New Year's Eve together (2024) |
| `primeiro-aniversario.jpg` | 1º Aniversário Surpresa | Heart | Anniversary surprise with balloons & roses |
| `linda-filhotes.jpg` | Linda Nos Deu Olivia e Oliver | Pets | Family complete with 4 pets |
| `apartamento-proprio.jpg` | O Apartamento dos Sonhos | Home | Dream apartment - own home! |
| `segundo-aniversario.jpg` | Mangue Azul & Rio/Búzios | Travel | 2nd anniversary trip to Rio & Búzios |
| `primeiro-natal.jpg` | Natal em Casa Própria | Home | First Christmas in OWN home |
| `segundo-reveillon.jpg` | Segundo Réveillon em Casa PRÓPRIA | Celebration | New Year's Eve 2025 in own home |
| `ovulos-congelados.jpg` | Pensando no Futuro Juntos | Heart | Planning future family together |
| `pedido-casamento.jpg` | O Pedido Perfeito | Ring | Perfect proposal in Icaraí |
| `mil-dias.jpg` | Mil Dias Viram Para Sempre | Celebration | Wedding day - 1000 days become forever |

### Gallery Photos (16 files: 8 + 8 thumbnails)
Located in `public/images/gallery/`

| File | Size | Description |
|------|------|-------------|
| `primeiro-beijo.jpg` | 1200x900 | First kiss at Casa Fontana |
| `primeiro-beijo-thumb.jpg` | 400x300 | Thumbnail |
| `jantar-romantico.jpg` | 1200x900 | The decisive gesture |
| `jantar-romantico-thumb.jpg` | 400x300 | Thumbnail |
| `praia-juntos.jpg` | 1200x900 | Guaramiranga proposal |
| `praia-juntos-thumb.jpg` | 400x300 | Thumbnail |
| `pedido-video.jpg` | 1200x900 | Proposal video thumbnail |
| `pedido-video-thumb.jpg` | 400x300 | Thumbnail |
| `festa-noivado.jpg` | 1200x900 | 4 pets family photo |
| `festa-noivado-thumb.jpg` | 400x300 | Thumbnail |
| `escolha-vestido.jpg` | 1200x900 | Rio & Búzios anniversary trip |
| `escolha-vestido-thumb.jpg` | 400x300 | Thumbnail |
| `ensaio-pre-wedding.jpg` | 1200x900 | Christmas in own home |
| `ensaio-pre-wedding-thumb.jpg` | 400x300 | Thumbnail |
| `familia-dele.jpg` | 1200x900 | Planning future together |
| `familia-dele-thumb.jpg` | 400x300 | Thumbnail |

### Pet Portraits (8 files: 4 + 4 thumbnails)
Located in `public/images/pets/`

| File | Size | Pet | Description |
|------|------|-----|-------------|
| `linda.jpg` | 600x600 | Linda 👑 | Matriarca Autista |
| `linda-thumb.jpg` | 200x200 | Thumbnail |
| `cacao.jpg` | 600x600 | Cacao 🍫 | Companheiro |
| `cacao-thumb.jpg` | 200x200 | Thumbnail |
| `olivia.jpg` | 600x600 | Olivia 🌸 | Filhote Doce |
| `olivia-thumb.jpg` | 200x200 | Thumbnail |
| `oliver.jpg` | 600x600 | Oliver ⚡ | Filhote Energético |
| `oliver-thumb.jpg` | 200x200 | Thumbnail |

## 🎨 Design System

All SVG placeholders follow the wedding invitation aesthetic:

### Colors
- **Background**: `#F8F6F3` (warm off-white/cream)
- **Primary Text**: `#2C2C2C` (charcoal black)
- **Secondary Text**: `#4A4A4A` (medium gray)
- **Decorative**: `#A8A8A8` (silver-gray)
- **Accent**: `#E8E6E3` (subtle warm gray)

### Typography
- **Primary**: Playfair Display (elegant serif for titles)
- **Body**: Crimson Text (classic serif with italics)
- **Monogram**: Cormorant (for special "H ♥ Y" treatments)

### Visual Elements
Each placeholder includes:
- Gradient or solid background matching design system
- Decorative border (subtle, elegant)
- Relevant icon (heart, couple, ring, pets, home, travel, celebration)
- Title text (event name)
- Subtitle text (location or theme)
- Decorative line divider

## 🔄 How to Replace Mock Content

### Option 1: Replace Individual Files

Simply replace the SVG files with your real photos (JPG/PNG format):

```bash
# Example: Replace hero poster
cp /path/to/your/photo.jpg public/images/hero-poster.jpg

# Example: Replace timeline photo
cp /path/to/first-date.jpg public/images/timeline/primeiro-encontro.jpg
```

**Important**: Keep the same filename so references don't break!

### Option 2: Batch Replace Timeline Photos

If you have 15 photos named by event ID:

```bash
# Copy all timeline photos at once
cp /path/to/photos/primeiro-oi.jpg public/images/timeline/
cp /path/to/photos/primeiro-encontro.jpg public/images/timeline/
# ... and so on
```

### Option 3: Update URLs in Code

If you want to use different filenames or external URLs:

**For Timeline**: Edit `src/data/realTimeline.ts`
```typescript
{
  id: 'primeiro-oi',
  media_url: '/images/timeline/your-custom-name.jpg',
  thumbnail_url: '/images/timeline/your-custom-name-thumb.jpg',
  // ...
}
```

**For Gallery**: Edit `src/app/galeria/page.tsx`
```typescript
const mockMediaItems: MediaItem[] = [
  {
    url: '/images/gallery/your-photo.jpg',
    thumbnail_url: '/images/gallery/your-photo-thumb.jpg',
    // ...
  }
]
```

## 📸 Image Optimization Tips

When replacing with real photos:

### 1. **Hero Images** (1920x1080)
```bash
# Optimize using ImageMagick
convert input.jpg -quality 85 -resize 1920x1080^ -gravity center -extent 1920x1080 output.jpg

# Or using FFmpeg for video poster extraction
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 -q:v 2 hero-poster.jpg
```

### 2. **Timeline Photos** (800x600)
```bash
# Batch resize timeline photos
for img in *.jpg; do
  convert "$img" -quality 85 -resize 800x600^ -gravity center -extent 800x600 "timeline_$img"
done
```

### 3. **Gallery Photos** (1200x900 + 400x300 thumbs)
```bash
# Create full size
convert input.jpg -quality 85 -resize 1200x900^ -gravity center -extent 1200x900 full.jpg

# Create thumbnail
convert input.jpg -quality 80 -resize 400x300^ -gravity center -extent 400x300 thumb.jpg
```

### 4. **Pet Portraits** (600x600 square + 200x200 thumbs)
```bash
# Create square portrait
convert pet.jpg -quality 85 -resize 600x600^ -gravity center -extent 600x600 pet-portrait.jpg

# Create thumbnail
convert pet.jpg -quality 80 -resize 200x200^ -gravity center -extent 200x200 pet-thumb.jpg
```

## 🚀 Testing After Replacement

After replacing mock content with real photos:

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Test pages**:
   - Homepage hero: http://localhost:3000
   - Timeline: http://localhost:3000/historia
   - Gallery: http://localhost:3000/galeria

3. **Check for**:
   - ✅ Images load correctly
   - ✅ Proper aspect ratios maintained
   - ✅ Thumbnails display properly
   - ✅ Mobile responsiveness works
   - ✅ Loading states work smoothly

## 🔧 Regenerating Mock Content

If you need to regenerate the mock placeholders:

```bash
# Run the generator script
node scripts/generate-mock-images.js
```

This will recreate all 41 placeholder images in their proper locations.

## 📁 Directory Structure

```
public/
├── images/
│   ├── hero-poster.jpg
│   ├── hero-couple.jpg
│   ├── timeline/
│   │   ├── primeiro-oi.jpg
│   │   ├── primeiro-encontro.jpg
│   │   ├── o-gesto-decisivo.jpg
│   │   ├── guaramiranga-pedido.jpg
│   │   ├── chegada-cacao.jpg
│   │   ├── reveillon-juntos.jpg
│   │   ├── primeiro-aniversario.jpg
│   │   ├── linda-filhotes.jpg
│   │   ├── apartamento-proprio.jpg
│   │   ├── segundo-aniversario.jpg
│   │   ├── primeiro-natal.jpg
│   │   ├── segundo-reveillon.jpg
│   │   ├── ovulos-congelados.jpg
│   │   ├── pedido-casamento.jpg
│   │   └── mil-dias.jpg
│   ├── gallery/
│   │   ├── primeiro-beijo.jpg
│   │   ├── primeiro-beijo-thumb.jpg
│   │   ├── jantar-romantico.jpg
│   │   ├── jantar-romantico-thumb.jpg
│   │   ├── praia-juntos.jpg
│   │   ├── praia-juntos-thumb.jpg
│   │   ├── pedido-video.jpg
│   │   ├── pedido-video-thumb.jpg
│   │   ├── festa-noivado.jpg
│   │   ├── festa-noivado-thumb.jpg
│   │   ├── escolha-vestido.jpg
│   │   ├── escolha-vestido-thumb.jpg
│   │   ├── ensaio-pre-wedding.jpg
│   │   ├── ensaio-pre-wedding-thumb.jpg
│   │   ├── familia-dele.jpg
│   │   └── familia-dele-thumb.jpg
│   └── pets/
│       ├── linda.jpg
│       ├── linda-thumb.jpg
│       ├── cacao.jpg
│       ├── cacao-thumb.jpg
│       ├── olivia.jpg
│       ├── olivia-thumb.jpg
│       ├── oliver.jpg
│       └── oliver-thumb.jpg
└── videos/
    └── hero-couple.mp4 (placeholder video - 10 seconds)
```

## 💡 Tips & Best Practices

### Image Quality
- Use **JPG** format for photos (better compression)
- Use **PNG** format for graphics with transparency
- Aim for quality 80-85 for web optimization
- Keep file sizes under 500KB for timeline/gallery images
- Keep hero images under 2MB

### Aspect Ratios
- **Hero**: 16:9 (1920x1080)
- **Timeline**: 4:3 (800x600)
- **Gallery**: 4:3 (1200x900)
- **Pets**: 1:1 square (600x600)
- **Thumbnails**: Match parent but smaller

### Accessibility
- Add meaningful `alt` text when implementing
- Ensure proper contrast for text overlays
- Test with screen readers
- Provide fallbacks for failed loads

### Performance
- Use next/image component when possible
- Implement lazy loading for gallery
- Generate WebP versions for modern browsers
- Use proper caching headers in production

## 🎯 Next Steps

1. **Collect Real Photos**: Gather your actual photos from the timeline events
2. **Organize by Event**: Name files to match event IDs for easy replacement
3. **Optimize Images**: Use the optimization commands above
4. **Replace Mocks**: Copy optimized photos to proper directories
5. **Test Thoroughly**: Check all pages and interactions
6. **Deploy**: Push changes to production when satisfied

## 🆘 Troubleshooting

### Images Not Showing
- Check file paths match exactly (case-sensitive!)
- Verify files exist in `public/images/` directories
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
- Check browser console for 404 errors

### Poor Quality
- Increase quality setting: `-quality 85` → `-quality 90`
- Use larger source images
- Avoid upscaling small images

### Wrong Aspect Ratio
- Use `-resize WIDTHxHEIGHT^` to fill (may crop)
- Use `-resize WIDTHxHEIGHT!` to force (may distort)
- Use `-gravity center -extent` to center crop

### Slow Loading
- Reduce file sizes further
- Implement progressive JPEGs: `convert -interlace Plane`
- Use CDN for production deployment
- Enable browser caching

---

**Generated**: October 11, 2025
**Status**: All 41 mock images ready for replacement
**Design System**: Wedding invitation aesthetic maintained
**Ready for**: Real photo integration 📸
