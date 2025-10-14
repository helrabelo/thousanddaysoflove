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
  // Navigate to login page
  await page.goto(`${BASE_URL}/dia-1000/login`);

  // Click the "Código de Convite" tab (should already be selected by default)
  await page.waitForTimeout(500);

  // Fill in the invitation code
  await page.fill('#invitation-code', invitationCode);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for redirect to upload page
  await page.waitForURL(/\/dia-1000\/upload/, { timeout: 10000 });

  // Wait for page to fully load
  await page.waitForLoadState('networkidle');

  // Verify we're authenticated
  await expect(page.locator('text=/Compartilhe Suas Memórias/i')).toBeVisible({ timeout: 10000 });
}

/**
 * Helper: Login as anonymous guest (shared password)
 */
async function loginAsAnonymousGuest(page: Page, guestName: string) {
  // Navigate to login page
  await page.goto(`${BASE_URL}/dia-1000/login`);

  // Click the "Senha Compartilhada" tab
  await page.click('button:has-text("Senha Compartilhada")');
  await page.waitForTimeout(500);

  // Fill in the guest name field (optional but we provide it)
  await page.fill('#guest-name', guestName);

  // Fill in the password field
  await page.fill('#password', GUEST_SHARED_PASSWORD);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for redirect to upload page
  await page.waitForURL(/\/dia-1000\/upload/, { timeout: 10000 });

  // Wait for page to fully load
  await page.waitForLoadState('networkidle');

  // Verify we're authenticated by checking for upload interface
  await expect(page.locator('text=/Compartilhe Suas Memórias/i')).toBeVisible({ timeout: 10000 });
}

/**
 * Helper: Login as admin
 */
async function loginAsAdmin(page: Page) {
  await page.goto(`${BASE_URL}/admin/login`);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for redirect to admin dashboard (goes to /admin/photos by default)
  await page.waitForURL(/\/admin\/(photos|posts|guests)/, { timeout: 20000 });

  // Wait for admin interface to be visible
  await page.waitForLoadState('networkidle');
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
  page.once('dialog', (dialog) => dialog.accept());
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

  // Submit and wait for API response
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/messages') &&
                (response.status() === 200 || response.status() === 201),
    { timeout: 30000 } // 30 seconds for file upload + storage upload
  );

  await page.click('button:has-text("Enviar")');
  await responsePromise;

  // Wait a bit for UI to update
  await page.waitForTimeout(1000);
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

  // Verify video preview appears (video element should be visible)
  await expect(page.locator('video').first()).toBeVisible({ timeout: 5000 });

  // Submit and wait for API response (videos take longer to upload)
  const responsePromise = page.waitForResponse(
    response => response.url().includes('/api/messages') &&
                (response.status() === 200 || response.status() === 201),
    { timeout: 60000 } // 60 seconds for video upload
  );

  await page.click('button:has-text("Enviar")');
  await responsePromise;

  // Wait a bit for UI to update
  await page.waitForTimeout(1000);
}

/**
 * Helper: Upload photo
 */
async function uploadPhoto(page: Page, imagePath: string, phase: 'before' | 'during' | 'after', caption?: string) {
  await page.goto(`${BASE_URL}/dia-1000/upload`);
  await page.waitForLoadState('networkidle');

  // Select phase
  await page.click(`button:has-text("${phase === 'before' ? 'Antes' : phase === 'during' ? 'Durante' : 'Depois'}")`);
  await page.waitForTimeout(500);

  // Upload file first (caption field only appears after files are selected)
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(imagePath);
  await page.waitForTimeout(1000);

  // Add caption if provided (now that files are uploaded, caption field should be visible)
  if (caption) {
    await page.fill('textarea[placeholder*="legenda"]', caption);
  }

  // Click upload button (use locator with hasText for regex)
  await page.locator('button', { hasText: /Enviar.*arquivo/i }).click();
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

    const uniqueId = Date.now();
    const postContent = `Congratulations! 🎉 ${uniqueId}`;
    await createTextPost(page, postContent, '❤️');

    // Verify post appears with unique ID
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=${uniqueId}`)).toBeVisible({ timeout: 5000 });
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

  test('should auto-approve photo upload from authenticated guest', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FRIEND);

    // Create a test image file
    const testImagePath = 'tests/fixtures/test-image.jpg';
    await uploadPhoto(page, testImagePath, 'during', 'Test auto-approved photo');

    // Verify success message mentions immediate visibility
    await expect(page.locator('text=/já está visível na galeria/i')).toBeVisible({ timeout: 10000 });

    // Verify photo appears in gallery immediately
    await page.goto(`${BASE_URL}/galeria`);
    await page.waitForLoadState('networkidle');
    // Scroll to guest photos section and verify photos are shown
    const guestPhotosSection = page.locator('text=/Fotos dos Convidados/i');
    await expect(guestPhotosSection).toBeVisible();
    await guestPhotosSection.scrollIntoViewIfNeeded();
    // Check that photos were uploaded (look for the photo count message)
    await expect(page.locator('text=/\\d+ fotos? compartilhadas?/i')).toBeVisible({ timeout: 10000 });
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

    // Verify pending alert (actual message: "✨ Sua mensagem será revisada antes de aparecer no feed. Aguarde alguns minutos!")
    await expect(page.locator('text=/será revisada antes de aparecer/i')).toBeVisible();

    // Verify post does NOT appear in feed
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${postContent}`)).not.toBeVisible({ timeout: 3000 });
  });

  test('should show pending message for anonymous guest', async ({ page }) => {
    await loginAsAnonymousGuest(page, 'Test Anonymous');
    await page.goto(`${BASE_URL}/mensagens`);

    // Verify pending notice is shown (actual message: "✨ Sua mensagem será revisada antes de aparecer no feed. Aguarde alguns minutos!")
    await expect(page.locator('text=/será revisada antes de aparecer/i')).toBeVisible();

    // Verify it does NOT have green styling (not auto-approved banner)
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

    // Verify pending filter button is visible
    await expect(page.locator('button:has-text("Pendentes")')).toBeVisible();

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

    // Verify post is in Pendentes filter (default filter)
    await expect(page.locator(`text=${testContent}`)).toBeVisible({ timeout: 5000 });

    // Find the post and click approve button
    const postCard = page.locator(`text=${testContent}`).locator('..').locator('..');
    await postCard.locator('button:has-text("Aprovar")').click();

    // Wait for API call to complete
    await page.waitForResponse(response =>
      response.url().includes('/api/admin/posts/') && response.status() === 200,
      { timeout: 5000 }
    );

    // Switch to Aprovadas filter
    await page.click('button:has-text("Aprovadas")');

    // Wait for the post to appear in Aprovadas filter (no arbitrary timeouts)
    await expect(page.locator(`text=${testContent}`)).toBeVisible({ timeout: 10000 });
  });

  test('should reject individual pending post', async ({ page }) => {
    // Create pending post
    await loginAsAnonymousGuest(page, 'Rejection Test User');
    const testContent = `Reject this post ${Date.now()}`;
    await createTextPost(page, testContent);

    // Admin login and reject
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Verify post is in Pendentes filter
    await expect(page.locator(`text=${testContent}`)).toBeVisible({ timeout: 5000 });

    // Find the post and click reject button (opens input)
    const postCard = page.locator(`text=${testContent}`).locator('..').locator('..');
    await postCard.locator('button:has-text("Rejeitar")').click();

    // Wait for reject input to appear and confirm
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Confirmar Rejeição")').click();

    // Wait for API call to complete
    await page.waitForResponse(response =>
      response.url().includes('/api/admin/posts/') && response.status() === 200,
      { timeout: 5000 }
    );

    // Switch to Rejeitadas filter
    await page.click('button:has-text("Rejeitadas")');

    // Wait for the post to appear in Rejeitadas filter
    await expect(page.locator(`text=${testContent}`)).toBeVisible({ timeout: 10000 });
  });

  test('should bulk approve multiple pending posts', async ({ page }) => {
    // Create multiple pending posts with unique timestamp
    await loginAsAnonymousGuest(page, 'Bulk Test User');

    const timestamp = Date.now();
    const testPosts = [];
    for (let i = 0; i < 3; i++) {
      const content = `Bulk test post ${i} - ${timestamp}`;
      testPosts.push(content);
      await createTextPost(page, content);
      await page.waitForTimeout(500);
    }

    // Admin bulk approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Verify all posts are visible in Pendentes
    for (const content of testPosts) {
      await expect(page.locator(`text=${content}`)).toBeVisible({ timeout: 5000 });
    }

    // Select the 3 checkboxes for our test posts with better wait conditions
    for (const content of testPosts) {
      const postCard = page.locator(`text=${content}`).locator('..').locator('..');
      const checkbox = postCard.locator('input[type="checkbox"]');

      // Wait for checkbox to be stable before checking
      await checkbox.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(300); // Give time for any animations
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.check({ force: true }); // Force check if needed
      await page.waitForTimeout(200);
    }

    // Click bulk approve button (correct text: "Aprovar Todas")
    page.once('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Aprovar Todas")');

    // Wait for batch API call to complete
    await page.waitForResponse(response =>
      response.url().includes('/api/admin/posts/batch') && response.status() === 200,
      { timeout: 10000 }
    );

    // Switch to Aprovadas filter
    await page.click('button:has-text("Aprovadas")');

    // Verify all posts appear in Aprovadas filter
    for (const content of testPosts) {
      await expect(page.locator(`text=${content}`)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should bulk reject multiple pending posts', async ({ page }) => {
    // Create multiple pending posts with unique timestamp
    await loginAsAnonymousGuest(page, 'Bulk Reject Test');

    const timestamp = Date.now();
    const testPosts = [];
    for (let i = 0; i < 3; i++) {
      const content = `Bulk reject post ${i} - ${timestamp}`;
      testPosts.push(content);
      await createTextPost(page, content);
      await page.waitForTimeout(500);
    }

    // Admin bulk reject
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Wait for posts to load
    await page.waitForLoadState('networkidle');

    // Verify all posts are visible in Pendentes
    for (const content of testPosts) {
      await expect(page.locator(`text=${content}`)).toBeVisible({ timeout: 5000 });
    }

    // Select the 3 checkboxes for our test posts with better wait conditions
    for (const content of testPosts) {
      const postCard = page.locator(`text=${content}`).locator('..').locator('..');
      const checkbox = postCard.locator('input[type="checkbox"]');

      // Wait for checkbox to be stable before checking
      await checkbox.waitFor({ state: 'visible', timeout: 5000 });
      await page.waitForTimeout(300); // Give time for any animations
      await checkbox.scrollIntoViewIfNeeded();
      await checkbox.check({ force: true }); // Force check if needed
      await page.waitForTimeout(200);
    }

    // Click bulk reject button (correct text: "Rejeitar Todas")
    page.once('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Rejeitar Todas")');

    // Wait for batch API call to complete
    await page.waitForResponse(response =>
      response.url().includes('/api/admin/posts/batch') && response.status() === 200,
      { timeout: 10000 }
    );

    // Switch to Rejeitadas filter
    await page.click('button:has-text("Rejeitadas")');

    // Verify all posts appear in Rejeitadas filter
    for (const content of testPosts) {
      await expect(page.locator(`text=${content}`)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should use keyboard shortcuts for moderation', async ({ page }) => {
    // Create pending post
    await loginAsAnonymousGuest(page, 'Keyboard Test User');
    const testContent = `Keyboard shortcut test ${Date.now()}`;
    await createTextPost(page, testContent);

    // Admin login
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);

    // Verify post is visible in Pendentes
    await expect(page.locator(`text=${testContent}`)).toBeVisible({ timeout: 5000 });

    // Select the checkbox for our test post
    const postCard = page.locator(`text=${testContent}`).locator('..').locator('..');
    const checkbox = postCard.locator('input[type="checkbox"]');
    await checkbox.check();
    await page.waitForTimeout(500);

    // Ensure focus is not on an input element (keyboard shortcuts don't work when typing)
    await page.click('h1:has-text("Moderação de Mensagens")');
    await page.waitForTimeout(200);

    // Test 'A' for approve (keyboard shortcut)
    // Start listening for the response before pressing the key
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/admin/posts/') && response.status() === 200,
      { timeout: 10000 }
    );

    await page.keyboard.press('a');

    // Wait for API call to complete
    await responsePromise;

    // Switch to Aprovadas filter
    await page.click('button:has-text("Aprovadas")');

    // Wait for the post to appear in Aprovadas filter
    await expect(page.locator(`text=${testContent}`)).toBeVisible({ timeout: 10000 });
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
    await uploadPhoto(page, testImagePath, 'during', 'Test pending photo');

    // Admin login
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/photos`);

    // Verify status filter controls are rendered
    const statusSelect = page
      .locator('select')
      .filter({ has: page.locator('option[value="pending"]') })
      .first();
    await expect(statusSelect).toBeVisible();
    await expect(page.locator('button:has-text("Aplicar Filtros")')).toBeVisible();

    // Verify the test photo caption appears
    await expect(page.locator('text=Test pending photo').first()).toBeVisible({ timeout: 10000 });
  });

  test('should approve individual pending photo', async ({ page }) => {
    // Create pending photo with unique caption
    await loginAsAnonymousGuest(page, 'Photo Approval Test');
    const testImagePath = 'tests/fixtures/test-image.jpg';
    const uniqueCaption = `Test approval photo ${Date.now()}`;
    await uploadPhoto(page, testImagePath, 'before', uniqueCaption);

    // Admin approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/photos`);

    // Find the photo by caption and click approve
    const photoCard = page
      .locator('[data-testid="photo-card"]')
      .filter({ has: page.locator(`text=${uniqueCaption}`) })
      .first();

    await photoCard.locator('button:has-text("Aprovar")').click();

    // Status badge should update to "Aprovado"
    await expect(
      photoCard.locator('[data-testid="photo-status"]:has-text("Aprovado")')
    ).toBeVisible({ timeout: 10000 });
  });

  test('should bulk approve multiple pending photos', async ({ page }) => {
    // Create multiple pending photos with unique captions
    await loginAsAnonymousGuest(page, 'Bulk Photo Test');
    const testImagePath = 'tests/fixtures/test-image.jpg';
    const timestamp = Date.now();
    const photoCaptions = [];

    for (let i = 0; i < 3; i++) {
      const caption = `Bulk photo ${i} - ${timestamp}`;
      photoCaptions.push(caption);
      await uploadPhoto(page, testImagePath, 'during', caption);
      await page.waitForTimeout(1000);
    }

    // Admin bulk approve
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/photos`);

    // Wait for photos to load (wait for apply filters button instead of networkidle)
    await page.waitForSelector('button:has-text("Aplicar Filtros")', { timeout: 10000 });

    // Verify our test photos appear
    for (const caption of photoCaptions) {
      await expect(page.locator(`text=${caption}`)).toBeVisible({ timeout: 5000 });
    }

    // Select the 3 checkboxes for our test photos with better wait conditions
    for (const caption of photoCaptions) {
      const photoCard = page
        .locator('[data-testid="photo-card"]')
        .filter({ has: page.locator(`text=${caption}`) })
        .first();
      const selectToggle = photoCard.locator('[data-testid="photo-select-toggle"]');

      await selectToggle.waitFor({ state: 'visible', timeout: 5000 });
      await selectToggle.scrollIntoViewIfNeeded();
      await selectToggle.click();
      // Wait for selection state to update (visual feedback appears)
      await page.waitForTimeout(300);
    }

    // Click bulk approve button
    await page.locator('button:has-text("Aprovar Selecionadas")').click();
    await page.waitForTimeout(2000);

    // Verify all photos show "Aprovado" status badges
    for (const caption of photoCaptions) {
      const photoCard = page
        .locator('[data-testid="photo-card"]')
        .filter({ has: page.locator(`text=${caption}`) })
        .first();

      await expect(
        photoCard.locator('[data-testid="photo-status"]:has-text("Aprovado")')
      ).toBeVisible({ timeout: 10000 });
    }
  });
});

// =====================================================
// TEST SUITE: Multi-Format Posts
// =====================================================

test.describe('Multi-Format Post Creation', () => {
  test('should create text-only post', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);
    const uniqueContent = `Text only post ${Date.now()}`;
    await createTextPost(page, uniqueContent);

    // Verify appears in feed
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=${uniqueContent}`).first()).toBeVisible({ timeout: 5000 });
  });

  test('should create post with single image', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FRIEND);
    const testImagePath = 'tests/fixtures/test-image.jpg';
    const content = `Image post ${Date.now()}`;
    await createPostWithImage(page, content, testImagePath);

    // Verify appears with image
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    const postCard = page
      .locator('article')
      .filter({ has: page.locator(`text=${content}`) })
      .first();
    // Wait for post card to be visible first
    await expect(postCard).toBeVisible({ timeout: 10000 });
    // Then check for image with alt text
    await expect(postCard.locator('img[alt="Post media"]')).toBeVisible({ timeout: 10000 });
  });

  test('should create post with video', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.COLLEAGUE);
    const testVideoPath = 'tests/fixtures/test-video.mp4';
    const content = `Video post ${Date.now()}`;
    await createPostWithVideo(page, content, testVideoPath);

    // Verify appears with video
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    const postCard = page
      .locator('article')
      .filter({ has: page.locator(`text=${content}`) })
      .first();
    // Wait for post card to be visible first
    await expect(postCard).toBeVisible({ timeout: 10000 });
    // Then check for video element
    await expect(postCard.locator('video').first()).toBeVisible({ timeout: 10000 });
  });

  test('should create mixed post with image and text', async ({ page }) => {
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);
    const testImagePath = 'tests/fixtures/test-image.jpg';
    const content = `Mixed post with image ${Date.now()}`;
    await createPostWithImage(page, content, testImagePath);

    // Verify both content and image appear
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    const postCard = page
      .locator('article')
      .filter({ has: page.locator(`text=${content}`) })
      .first();
    // Wait for post card to be visible first
    await expect(postCard).toBeVisible({ timeout: 10000 });
    // Verify content appears
    await expect(postCard.locator(`text=${content}`)).toBeVisible({ timeout: 5000 });
    // Verify image appears
    await expect(postCard.locator('img[alt="Post media"]')).toBeVisible({ timeout: 10000 });
  });
});

// =====================================================
// TEST SUITE: Complete Flow Integration
// =====================================================

test.describe('Complete Flow - Authenticated vs Anonymous', () => {
  test('should demonstrate full authenticated flow', async ({ page }) => {
    // 1. Login with invitation code
    await loginAsAuthenticatedGuest(page, TEST_INVITATION_CODES.FAMILY);

    // 2. Create multiple types of content with unique timestamp
    const uniqueContent = `Auth flow text ${Date.now()}`;
    await createTextPost(page, uniqueContent);
    await page.waitForTimeout(1000);

    // 3. Verify all appear immediately
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    // Use exact content match with .first() for safety
    await expect(page.locator(`text=${uniqueContent}`).first()).toBeVisible({ timeout: 10000 });

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
    await expect(page.locator('text=/será revisada antes de aparecer/i')).toBeVisible();

    // 4. Verify NOT in public feed
    await page.goto(`${BASE_URL}/mensagens`);
    await expect(page.locator(`text=${content}`)).not.toBeVisible({ timeout: 3000 });

    // 5. Admin approves (using Portuguese button text)
    await loginAsAdmin(page);
    await page.goto(`${BASE_URL}/admin/posts`);
    await page.waitForLoadState('networkidle');
    // Find the specific post and approve it
    const postCard = page.locator(`text=${content}`).locator('..').locator('..');
    await postCard.locator('button:has-text("Aprovar")').click();
    await page.waitForTimeout(2000);

    // 6. NOW visible in public feed
    await page.goto(`${BASE_URL}/mensagens`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${content}`).first()).toBeVisible({ timeout: 10000 });
  });
});
