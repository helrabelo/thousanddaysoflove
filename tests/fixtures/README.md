# Test Fixtures

This directory contains test assets for Playwright E2E tests.

## Required Files

### Images
- `test-image.jpg` - A small JPEG image (< 1MB) for testing photo uploads
  - Recommended: 800x600px, < 500KB
  - You can use any generic photo

### Videos
- `test-video.mp4` - A short MP4 video (< 10MB) for testing video uploads
  - Recommended: 10 seconds, 720p, < 5MB
  - You can use any generic video clip

## Generating Test Assets

### Create Test Image (macOS/Linux)
```bash
# Using ImageMagick
convert -size 800x600 xc:blue -fill white -pointsize 72 -gravity center \
  -annotate +0+0 "Test Image" tests/fixtures/test-image.jpg

# Or download a sample image
curl -o tests/fixtures/test-image.jpg https://via.placeholder.com/800x600.jpg
```

### Create Test Video (macOS/Linux)
```bash
# Using FFmpeg - create a 10-second test video
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 \
  -pix_fmt yuv420p tests/fixtures/test-video.mp4

# Or download a sample video
# Find any 10-second MP4 video and save as test-video.mp4
```

### Quick Setup Script
```bash
# Create test image with ImageMagick
convert -size 800x600 xc:#4A90E2 -fill white -pointsize 48 \
  -gravity center -annotate +0+0 "Wedding Test Photo\\n$(date)" \
  tests/fixtures/test-image.jpg

# Create test video with FFmpeg
ffmpeg -f lavfi -i color=c=pink:s=1280x720:d=10 \
  -vf "drawtext=text='Wedding Test Video':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -pix_fmt yuv420p tests/fixtures/test-video.mp4
```

## Usage in Tests

```typescript
import { test } from '@playwright/test';

test('should upload photo', async ({ page }) => {
  const imagePath = 'tests/fixtures/test-image.jpg';
  await page.setInputFiles('input[type="file"]', imagePath);
  // ... rest of test
});
```

## Notes

- These files are **not committed** to Git (see `.gitignore`)
- Each developer must generate their own test fixtures
- Files should be small to keep tests fast
- Use realistic file sizes and formats that match production
