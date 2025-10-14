/**
 * Two-Tier Moderation System E2E Tests
 *
 * Tests the complete flow of:
 * 1. Authenticated guests (via invitation code) → auto-approved content
 * 2. Anonymous guests (via shared password) → manual approval required
 * 3. Admin moderation workflows (approve, reject, bulk operations)
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'HelYlana1000Dias!';
const GUEST_SHARED_PASSWORD = process.env.GUEST_SHARED_PASSWORD || '1000dias';

// Test invitation codes (should exist in your test database)
const TEST_INVITATION_CODES = {
  FAMILY: 'FAMILY001', // João Silva
  FRIEND: 'FRIEND002', // Maria Santos
  COLLEAGUE: 'WORK004', // Ana Oliveira
};

/**
 * Helper: Login as authenticated guest (invitation code)
 */
async function loginAsAuthenticatedGuest(page: Page, invitationCode: string) {
  await page.goto(`${BASE_URL}/convite/${invitationCode}`);

  // Wait for personalized greeting to appear
  await expect(page.locator('text=/Olá,.*!/i')).toBeVisible({ timeout: 15000 });

  // Wait for session to be established
  await page.waitForTimeout(1500);
}

/**
 * Helper: Login as anonymous guest (shared password)
 */
async function loginAsAnonymousGuest(page: Page, guestName: string) {
  await page.goto(`${BASE_URL}/dia-1000/login`);

  // Fill in password
  await page.fill('input[type="password"]', GUEST_SHARED_PASSWORD);

  // Fill in optional guest name
  const nameInput = page.locator('input[placeholder*="nome"]');
  if (await nameInput.isVisible()) {
    await nameInput.fill(guestName);
  }

  // Submit
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL(/\/(mensagens|dia-1000\/upload)/, { timeout: 10000 });
  await page.waitForTimeout(1000);
}

/**
 * Helper: Login as admin
 */
async function loginAsAdmin(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/admin/, { timeout: 10000 });
}

/**
 * Helper: Create a text post
 */
async function createTextPost(page: Page, content: string, emoji?: string) {
  await page.goto(`${BASE_URL}/mensagens`);
  await page.waitForLoadState('networkidle');

  // Wait for composer to be visible
  await expect(page.locator('textarea').first()).toBeVisible({ timeout: 10000 });

  // Fill in content
  await page.fill('textarea', content);

  // Add emoji if specified
  if (emoji) {
    await page.click('button[title*="emoji"]');
    await page.click(`button:has-text("${emoji}")`);
  }

  // Submit
  await page.click('button:has-text("Enviar")');
  await page.waitForTimeout(2000);
}

/**
 * Helper: Create post with image
 */
async function createPostWithImage(page: Page, content: string, imagePath: string) {
  await page.goto(`${BASE_URL}/mensagens`);
  await page.waitForLoadState('networkidle');

  // Fill in content
  await page.fill('textarea', content);

  // Upload image
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(imagePath);
  await page.waitForTimeout(1000);

  // Verify preview
  await expect(page.locator('img[alt="Preview"]')).toBeVisible();

  // Submit
  await page.click('button:has-text("Enviar")');
  await page.waitForTimeout(2000);
}

/**
 * Helper: Create post with video
 */
async function createPostWithVideo(page: Page, content: string, videoPath: string) {
  await page.goto(`${BASE_URL}/mensagens`);
  await page.waitForLoadState('networkidle');

  // Fill in content
  await page.fill('textarea', content);

  // Upload video
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(videoPath);
  await page.waitForTimeout(2000);

  // Verify video icon
  await expect(page.locator('svg').filter({ hasText: /video/i }).first()).toBeVisible();

  // Submit
  await page.click('button:has-text("Enviar")');
  await page.waitForTimeout(3000);
}

/**
 * Helper: Upload photo
 */
async function uploadPhoto(page: Page, imagePath: string, phase: 'before' | 'during' | 'after', caption?: string) {
  await page.goto(`${BASE_URL}/dia-1000/upload`);
  await page.waitForLoadState('networkidle');

  // Select phase
  await page.click(`button:has-text("${phase === 'before' ? 'Antes' : phase === 'during' ? 'Durante' : 'Depois'}")`);

  // Add caption if provided
  if (caption) {
    await page.fill('textarea[placeholder*="legenda"]', caption);
  }

  // Upload file
  const fileInput = page.locator('input[type="file"][accept*="image"]');
  await fileInput.setInputFiles(imagePath);
  await page.waitForTimeout(1000);

  // Click upload button
  await page.click('button:has-text(/Enviar.*arquivo/)');
  await page.waitForTimeout(2000);
}

// =====================================================
// TEST SUITE: Authenticated Guest Flow (Auto-Approval)
// =====================================================

test.describe('Authenticated Guest - Auto-Approved Content', () => {
  test('should auto-approve text post from authenticated guest', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);

    const postContent = `Test auto-approved text post ${Date.now()}`;
    await createTextPost(page, postContent);

    // Verify success alert mentions immediate publication
    await expect(page.locator('text=/publicada imediatamente|já está visível/i')).toBeVisible();

    // Verify post appears in feed immediately
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${postContent}`)).toBeVisible({ timeout: 5000 });
  });

  test('should auto-approve post with emoji from authenticated guest', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FRIEND);

    const postContent = `Congratulations! 🎉 ${Date.now()}`;
    await createTextPost(page, postContent, '❤️');

    // Verify post appears with emoji
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=/${postContent.slice(0, 20)}/`)).toBeVisible({ timeout: 5000 });
  });

  test('should show green success message for authenticated guest', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);
    await page.goto(`${BASE_URL}/mensagens`);

    // Verify green success banner is shown
    await expect(page.locator('text=/autenticado.*imediatamente/i')).toBeVisible();

    // Verify it has green styling
    const banner = page.locator('div.bg-green-50');
    await expect(banner).toBeVisible();
  });

  test('should auto-approve photo upload from authenticated guest', async ({ page, context }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FRIEND);

    // Create a test image file
    const testImagePath = 'tests/fixtures/test-image.jpg';
    await uploadPhoto(page, testImagePath, 'during', 'Test auto-approved photo');

    // Verify success message mentions immediate visibility
    await expect(page.locator('text=/já está visível na galeria/i')).toBeVisible({ timeout: 10000 });

    // Verify photo appears in gallery immediately
    await page.goto(`${BASE_URL}/galeria`);
    await page.waitForLoadState('networkidle');
    // Check that approved photos are visible (implementation-specific selector)
    const photoCount = await page.locator('[data-testid="gallery-photo"]').count();
    expect(photoCount).toBeGreaterThan(0);
  });
});

// =====================================================
// TEST SUITE: Anonymous Guest Flow (Manual Approval)
// =====================================================

test.describe('Anonymous Guest - Manual Approval Required', () => {
  test('should NOT auto-approve text post from anonymous guest', async ({ page }) => {
    await loginAsAnonymousGuest(page, 'Anonymous Test User');

    const postContent = `Test pending text post ${Date.now()}`;
    await createTextPost(page, postContent);

    // Verify pending alert
    await expect(page.locator('text=/será revisada.*aprovação/i')).toBeVisible();

    // Verify post does NOT appear in feed
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${postContent}`)).not.toBeVisible({ timeout: 3000 });
  });

  test('should show pending message for anonymous guest', async ({ page }) => {
    await loginAsAnonymousGuest(page, 'Test Anonymous');
    await page.goto(`${BASE_URL}/mensagens`);

    // Verify pending notice is shown (not green success)
    await expect(page.locator('text=/será revisada/i')).toBeVisible();

    // Verify it does NOT have green styling
    const greenBanner = page.locator('div.bg-green-50');
    await expect(greenBanner).not.toBeVisible();
  });

  test('should require approval for anonymous photo upload', async ({ page }) => {
    await loginAsAnonymousGuest(page, 'Anonymous Photo Tester');

    const testImagePath = 'tests/fixtures/test-image.jpg';
    await uploadPhoto(page, testImagePath, 'before', 'Test pending photo');

    // Verify pending message
    await expect(page.locator('text=/Aguardando aprovação/i')).toBeVisible({ timeout: 10000 });

    // Photo should NOT be visible in public gallery yet
    await page.goto(`${BASE_URL}/galeria`);
    await page.waitForLoadState('networkidle');
    // This is implementation-specific - adjust based on your gallery structure
  });
});

// =====================================================
// TEST SUITE: Admin Moderation Workflows
// =====================================================

test.describe('Admin Moderation - Posts', () => {
  test('should display pending posts in admin panel', async ({ page }) => {
    // First, create pending post as anonymous guest
    await loginAsAnonymousGuest(page, 'Pending Post Creator');
    const pendingContent = `Admin test pending post ${Date.now()}`;
    await createTextPost(page, pendingContent);

    // Login as admin
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Verify pending posts section exists
    await expect(page.locator('text=/pending|pendente/i')).toBeVisible();

    // Verify our pending post is visible
    await expect(page.locator(`text=${pendingContent}`)).toBeVisible({ timeout: 5000 });
  });

  test('should approve individual pending post', async ({ page }) => {
    // Create pending post
    await loginAsAnonymousGuest(page, 'Approval Test User');
    const testContent = `Approve this post ${Date.now()}`;
    await createTextPost(page, testContent);

    // Admin login and approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Find the post and click approve button
    const postCard = page.locator(`text=${testContent}`).locator('..').locator('..');
    await postCard.locator('button:has-text(/approve|aprovar/i)').first().click();

    // Alternative: use keyboard shortcut 'A'
    // await page.keyboard.press('a');

    await page.waitForTimeout(1000);

    // Verify post moved to approved section
    await expect(page.locator('text=/approved|aprovado/i')).toBeVisible();
  });

  test('should reject individual pending post', async ({ page }) => {
    // Create pending post
    await loginAsAnonymousGuest(page, 'Rejection Test User');
    const testContent = `Reject this post ${Date.now()}`;
    await createTextPost(page, testContent);

    // Admin login and reject
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Find the post and click reject button
    const postCard = page.locator(`text=${testContent}`).locator('..').locator('..');
    await postCard.locator('button:has-text(/reject|rejeitar/i)').first().click();

    // Alternative: use keyboard shortcut 'R'
    // await page.keyboard.press('r');

    await page.waitForTimeout(1000);

    // Verify post moved to rejected section
    await expect(page.locator('text=/rejected|rejeitado/i')).toBeVisible();
  });

  test('should bulk approve multiple pending posts', async ({ page }) => {
    // Create multiple pending posts
    await loginAsAnonymousGuest(page, 'Bulk Test User');

    for (let i = 0; i < 3; i++) {
      await createTextPost(page, `Bulk test post ${i} - ${Date.now()}`);
      await page.waitForTimeout(500);
    }

    // Admin bulk approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Select multiple posts (implementation-specific)
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      await checkboxes.nth(i).check();
    }

    // Click bulk approve button
    await page.click('button:has-text(/bulk.*approve|aprovar.*selecionados/i)');
    await page.waitForTimeout(2000);

    // Verify success message
    await expect(page.locator('text=/aprovados com sucesso|approved successfully/i')).toBeVisible();
  });

  test('should bulk reject multiple pending posts', async ({ page }) => {
    // Create multiple pending posts
    await loginAsAnonymousGuest(page, 'Bulk Reject Test');

    for (let i = 0; i < 3; i++) {
      await createTextPost(page, `Bulk reject post ${i} - ${Date.now()}`);
      await page.waitForTimeout(500);
    }

    // Admin bulk reject
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Select multiple posts
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      await checkboxes.nth(i).check();
    }

    // Click bulk reject button
    await page.click('button:has-text(/bulk.*reject|rejeitar.*selecionados/i)');
    await page.waitForTimeout(2000);

    // Verify success message
    await expect(page.locator('text=/rejeitados com sucesso|rejected successfully/i')).toBeVisible();
  });

  test('should use keyboard shortcuts for moderation', async ({ page }) => {
    // Create pending post
    await loginAsAnonymousGuest(page, 'Keyboard Test User');
    await createTextPost(page, `Keyboard shortcut test ${Date.now()}`);

    // Admin login
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Select first post
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();

    // Test 'A' for approve
    await page.keyboard.press('a');
    await page.waitForTimeout(1000);

    // Should show approval confirmation
    await expect(page.locator('text=/approved|aprovado/i')).toBeVisible();
  });
});

// =====================================================
// TEST SUITE: Admin Moderation - Photos
// =====================================================

test.describe('Admin Moderation - Photos', () => {
  test('should display pending photos in admin panel', async ({ page }) => {
    // Create pending photo as anonymous guest
    await loginAsAnonymousGuest(page, 'Photo Moderator Test');
    const testImagePath = 'tests/fixtures/test-image.jpg';
    await uploadPhoto(page, testImagePath, 'during');

    // Admin login
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/photos`);

    // Verify pending photos section
    await expect(page.locator('text=/pending|pendente/i')).toBeVisible();
  });

  test('should approve individual pending photo', async ({ page }) => {
    // Create pending photo
    await loginAsAnonymousGuest(page, 'Photo Approval Test');
    const testImagePath = 'tests/fixtures/test-image.jpg';
    await uploadPhoto(page, testImagePath, 'before', 'Test approval photo');

    // Admin approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/photos`);

    // Click approve on first pending photo
    await page.locator('button:has-text(/approve|aprovar/i)').first().click();
    await page.waitForTimeout(1000);

    // Verify moved to approved
    await expect(page.locator('text=/approved|aprovado/i')).toBeVisible();
  });

  test('should bulk approve multiple pending photos', async ({ page }) => {
    // Create multiple pending photos
    await loginAsAnonymousGuest(page, 'Bulk Photo Test');
    const testImagePath = 'tests/fixtures/test-image.jpg';

    for (let i = 0; i < 3; i++) {
      await uploadPhoto(page, testImagePath, 'during', `Bulk photo ${i}`);
      await page.waitForTimeout(1000);
    }

    // Admin bulk approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/photos`);

    // Select multiple
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      await checkboxes.nth(i).check();
    }

    // Bulk approve
    await page.click('button:has-text(/bulk.*approve/i)');
    await page.waitForTimeout(2000);

    await expect(page.locator('text=/success|sucesso/i')).toBeVisible();
  });
});

// =====================================================
// TEST SUITE: Multi-Format Posts
// =====================================================

test.describe('Multi-Format Post Creation', () => {
  test('should create text-only post', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);
    await createTextPost(page, `Text only post ${Date.now()}`);

    // Verify appears in feed
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator('text=/Text only post/')).toBeVisible({ timeout: 5000 });
  });

  test('should create post with single image', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FRIEND);
    const testImagePath = 'tests/fixtures/test-image.jpg';
    await createPostWithImage(page, `Image post ${Date.now()}`, testImagePath);

    // Verify appears with image
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator('img[alt="Preview"]')).toBeVisible({ timeout: 5000 });
  });

  test('should create post with video', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.COLLEAGUE);
    const testVideoPath = 'tests/fixtures/test-video.mp4';
    await createPostWithVideo(page, `Video post ${Date.now()}`, testVideoPath);

    // Verify appears with video
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator('video').first()).toBeVisible({ timeout: 5000 });
  });

  test('should create mixed post with image and text', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);
    const testImagePath = 'tests/fixtures/test-image.jpg';
    const content = `Mixed post with image ${Date.now()}`;
    await createPostWithImage(page, content, testImagePath);

    // Verify both content and image appear
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=${content}`)).toBeVisible({ timeout: 5000 });
    await expect(page.locator('img[alt="Preview"]')).toBeVisible();
  });
});

// =====================================================
// TEST SUITE: Complete Flow Integration
// =====================================================

test.describe('Complete Flow - Authenticated vs Anonymous', () => {
  test('should demonstrate full authenticated flow', async ({ page }) => {
    // 1. Login with invitation code
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);

    // 2. Create multiple types of content
    await createTextPost(page, `Auth flow text ${Date.now()}`);
    await page.waitForTimeout(1000);

    // 3. Verify all appear immediately
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator('text=/Auth flow text/')).toBeVisible({ timeout: 5000 });

    // 4. Verify green success indicator
    await expect(page.locator('div.bg-green-50')).toBeVisible();
  });

  test('should demonstrate full anonymous flow', async ({ page }) => {
    // 1. Login with shared password
    await loginAsAnonymousGuest(page, 'Complete Flow Test User');

    // 2. Create post
    const content = `Anonymous flow ${Date.now()}`;
    await createTextPost(page, content);

    // 3. Verify pending message
    await expect(page.locator('text=/será revisada/i')).toBeVisible();

    // 4. Verify NOT in public feed
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=${content}`)).not.toBeVisible({ timeout: 3000 });

    // 5. Admin approves
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);
    await page.locator('button:has-text(/approve/i)').first().click();
    await page.waitForTimeout(1000);

    // 6. NOW visible in public feed
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=${content}`)).toBeVisible({ timeout: 5000 });
  });
});
