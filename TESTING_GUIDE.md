# Testing Guide - Two-Tier Moderation System

## Quick Start

### 1. Install Dependencies
```bash
npm install --save-dev @playwright/test
npx playwright install
```

### 2. Create Test Fixtures
```bash
# Create test image (requires ImageMagick)
convert -size 800x600 xc:#4A90E2 -fill white -pointsize 48 \
  -gravity center -annotate +0+0 "Wedding Test Photo" \
  tests/fixtures/test-image.jpg

# Create test video (requires FFmpeg)
ffmpeg -f lavfi -i color=c=pink:s=1280x720:d=10 \
  -vf "drawtext=text='Test Video':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  -pix_fmt yuv420p tests/fixtures/test-video.mp4
```

Or download sample assets:
```bash
curl -o tests/fixtures/test-image.jpg https://via.placeholder.com/800x600.jpg
# Find a 10-second video and save as test-video.mp4
```

### 3. Set Environment Variables
Create `.env.test`:
```bash
BASE_URL=http://localhost:3000
ADMIN_PASSWORD=HelYlana1000Dias!
GUEST_SHARED_PASSWORD=1000dias
```

### 4. Ensure Test Data Exists
Your database should have these test invitation codes:
- `FAMILY001` - João Silva (family)
- `FRIEND002` - Maria Santos (friend)
- `WORK004` - Ana Oliveira (colleague)

### 5. Run Tests
```bash
# Run all tests
npm run test:e2e

# Run specific test suite
npx playwright test tests/e2e/two-tier-moderation.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test
npx playwright test -g "should auto-approve text post"

# Debug mode
npx playwright test --debug
```

## Test Coverage

### ✅ Authenticated Guest Flow (Auto-Approval)
- [x] Text post auto-approval
- [x] Post with emoji auto-approval
- [x] Green success message displayed
- [x] Photo upload auto-approval
- [x] Immediate visibility in feed/gallery

### ✅ Anonymous Guest Flow (Manual Approval)
- [x] Text post requires approval
- [x] Pending message displayed
- [x] Content NOT visible before approval
- [x] Photo upload requires approval

### ✅ Admin Moderation - Posts
- [x] View pending posts
- [x] Approve individual post
- [x] Reject individual post
- [x] Bulk approve multiple posts
- [x] Bulk reject multiple posts
- [x] Keyboard shortcuts (A/R)

### ✅ Admin Moderation - Photos
- [x] View pending photos
- [x] Approve individual photo
- [x] Bulk approve multiple photos
- [x] Bulk reject (implementation similar to posts)

### ✅ Multi-Format Posts
- [x] Text-only posts
- [x] Posts with images
- [x] Posts with videos
- [x] Mixed posts (text + media)

### ✅ Complete Flow Integration
- [x] Full authenticated guest workflow
- [x] Full anonymous guest workflow
- [x] Admin approval changes visibility

## Test Structure

```
tests/
├── e2e/
│   └── two-tier-moderation.spec.ts  # Main test suite
├── fixtures/
│   ├── test-image.jpg               # Sample image (not committed)
│   ├── test-video.mp4               # Sample video (not committed)
│   └── README.md                    # Fixture generation guide
└── ...
```

## Running Tests in CI/CD

### GitHub Actions Example
```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Create test fixtures
        run: |
          mkdir -p tests/fixtures
          # Create test image
          convert -size 800x600 xc:blue -fill white -pointsize 48 \
            -gravity center -annotate +0+0 "CI Test" \
            tests/fixtures/test-image.jpg
          # Create test video
          ffmpeg -f lavfi -i color=c=pink:s=1280x720:d=10 \
            -pix_fmt yuv420p tests/fixtures/test-video.mp4

      - name: Setup database
        run: npm run db:reset

      - name: Run tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
          GUEST_SHARED_PASSWORD: ${{ secrets.GUEST_SHARED_PASSWORD }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/
```

## Troubleshooting

### Tests Failing on "Login with invitation code"
**Problem**: `FAMILY001` code doesn't exist in database

**Solution**:
```bash
# Reset database with seed data
npm run db:reset

# Or manually insert test invitations
npm run db:seed:test
```

### Tests Failing on Photo Upload
**Problem**: Test fixtures not found

**Solution**:
```bash
# Verify fixtures exist
ls -la tests/fixtures/

# Recreate if missing
convert -size 800x600 xc:blue tests/fixtures/test-image.jpg
```

### Tests Timeout on Admin Login
**Problem**: Admin password incorrect

**Solution**:
```bash
# Check .env.test has correct password
cat .env.test | grep ADMIN_PASSWORD

# Or pass via command line
ADMIN_PASSWORD=YourPassword npx playwright test
```

### Tests Fail with "Element not visible"
**Problem**: Timing issues or selectors changed

**Solution**:
```bash
# Run in headed mode to see what's happening
npx playwright test --headed

# Enable slow motion
npx playwright test --headed --slow-mo=1000

# Debug mode with Playwright Inspector
npx playwright test --debug
```

### Bulk Operations Not Working
**Problem**: Checkboxes not being selected

**Solution**: Check admin panel implementation matches selectors in test:
```typescript
// Test uses: input[type="checkbox"]
// Ensure admin panel has this selector
```

## Best Practices

### 1. Test Data Isolation
Each test should create its own unique data:
```typescript
const uniqueContent = `Test message ${Date.now()}`;
```

### 2. Cleanup After Tests
Tests should be idempotent (can run multiple times):
```typescript
test.afterEach(async ({ page }) => {
  // Logout or clear session
  await page.goto(`${BASE_URL}/api/auth/logout`);
});
```

### 3. Wait for Network Idle
After navigation, wait for network:
```typescript
await page.goto(url);
await page.waitForLoadState('networkidle');
```

### 4. Use Test IDs
In production code, add `data-testid`:
```tsx
<button data-testid="approve-post">Approve</button>
```

Then in tests:
```typescript
await page.click('[data-testid="approve-post"]');
```

### 5. Screenshot on Failure
Already configured in `playwright.config.ts`:
```typescript
screenshot: 'only-on-failure'
```

## Manual Testing Checklist

Before deploying, manually verify:

### Authenticated Guest (Invitation Code)
- [ ] Login via `/convite/FAMILY001`
- [ ] Create text post → appears immediately
- [ ] Green success banner visible
- [ ] Upload photo → appears in gallery immediately
- [ ] No pending approval message

### Anonymous Guest (Shared Password)
- [ ] Login via `/dia-1000/login` with `1000dias`
- [ ] Create text post → pending message shown
- [ ] Post NOT visible in public feed
- [ ] Upload photo → pending message shown
- [ ] Photo NOT visible in gallery

### Admin Moderation
- [ ] Login to `/admin/login`
- [ ] Navigate to `/admin/posts`
- [ ] See pending posts from anonymous guests
- [ ] Approve individual post → visible in feed
- [ ] Select multiple posts → bulk approve → all visible
- [ ] Keyboard shortcut 'A' works for approve
- [ ] Navigate to `/admin/photos`
- [ ] Similar moderation workflow for photos

## Performance Benchmarks

Expected test execution times:
- **Single test**: ~10-15 seconds
- **Full suite**: ~5-10 minutes (depending on test count)
- **CI/CD run**: ~8-12 minutes (including setup)

## Reporting

After test run, view results:
```bash
# HTML report
npx playwright show-report

# JSON report
cat test-results/results.json | jq
```

## Next Steps

1. [ ] Run initial test suite locally
2. [ ] Fix any failing tests
3. [ ] Add tests to CI/CD pipeline
4. [ ] Set up monitoring for test failures
5. [ ] Extend coverage for edge cases
6. [ ] Add visual regression tests (optional)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
