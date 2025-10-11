# Hero Section Setup Guide

## Current Setup
✅ **VideoHeroSection** is currently active on the homepage

## Mock Content Provided
The following placeholder files are ready for you to replace:

```
public/
├── videos/
│   └── hero-couple.mp4          (10-second placeholder - REPLACE THIS)
└── images/
    ├── hero-poster.jpg          (Video loading poster)
    └── hero-couple.jpg          (Reduced motion fallback)
```

## How to Replace with Your Content

### Option 1: Use Your Own Video (Recommended)
1. **Prepare your video:**
   - Format: MP4 (H.264 codec)
   - Resolution: 1920x1080 (desktop)
   - Duration: 10-20 seconds (loops seamlessly)
   - File size: Under 5MB
   - Subject: You two together (candid, romantic)

2. **Optimize your video:**
   ```bash
   ffmpeg -i your-video.mov \
     -vcodec libx264 \
     -crf 28 \
     -preset slow \
     -vf "scale=1920:1080" \
     -r 30 \
     public/videos/hero-couple.mp4
   ```

3. **Extract poster frame:**
   ```bash
   ffmpeg -i public/videos/hero-couple.mp4 \
     -ss 00:00:02 \
     -vframes 1 \
     public/images/hero-poster.jpg
   ```

4. **Create fallback image:**
   - Export a high-quality frame as JPG
   - Place in: `public/images/hero-couple.jpg`

### Option 2: Use a High-Quality Photo Instead
If you prefer the **ImageHeroSection** with a stunning photo:

1. **Update homepage** (`src/app/page.tsx`):
   ```tsx
   // Change this line:
   import VideoHeroSection from '@/components/sections/VideoHeroSection'

   // To this:
   import ImageHeroSection from '@/components/sections/ImageHeroSection'

   // And in the JSX:
   <ImageHeroSection /> // instead of <VideoHeroSection />
   ```

2. **Add your photo:**
   - Format: JPG or WebP
   - Resolution: Minimum 2560x1440
   - Subject: You two together (romantic, good lighting)
   - Place in: `public/images/hero-couple.jpg`

## Quick Switch Commands

### Switch to Video Hero
```tsx
// src/app/page.tsx
import VideoHeroSection from '@/components/sections/VideoHeroSection'
// ...
<VideoHeroSection />
```

### Switch to Image Hero
```tsx
// src/app/page.tsx
import ImageHeroSection from '@/components/sections/ImageHeroSection'
// ...
<ImageHeroSection />
```

## Testing Your Changes

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000

3. **Check:**
   - ✅ Video autoplays (or image displays)
   - ✅ Text is readable over the background
   - ✅ CTAs work (RSVP, Nossa História)
   - ✅ Scroll indicator bounces
   - ✅ Mobile responsive (test on phone)

## What Makes These DTF-Inspired?

Both hero options follow Din Tai Fung's design principles:

1. **Full-Bleed Visuals** - No cards/boxes, immersive content
2. **Text Overlay** - Large, dramatic typography
3. **Dark Gradient** - Ensures text readability
4. **Minimal Content** - Only essential info in hero
5. **Scroll Indicator** - Guides exploration
6. **Cinematic Feel** - Like opening a film

## Need Help?

**Video won't play?**
- Check file size (should be under 5MB)
- Verify codec: `ffmpeg -i hero-couple.mp4` (should show H.264)
- Check browser console for errors

**Text not readable?**
- Adjust gradient opacity in component file
- Try using a darker/lighter overlay

**Want different text?**
- Edit: `src/components/sections/VideoHeroSection.tsx` (or ImageHeroSection)
- Look for the text content sections (Monogram, Names, Tagline, Date)

**Performance issues?**
- Compress video more: increase `-crf` value (try 30)
- Create mobile version: reduce resolution to 1280x720
- Switch to ImageHero (faster loading)
