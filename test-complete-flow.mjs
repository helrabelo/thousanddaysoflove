/**
 * Playwright Test - Complete Message Flow
 * Tests: Guest submit message → Admin sees it in moderation panel
 */

import { chromium } from 'playwright';

const PRODUCTION_URL = 'https://thousanddaysof.love';
const ADMIN_PASSWORD = 'HelYlana1000Dias!';
const TEST_MESSAGE = `Test message ${Date.now()} - Complete flow verification 🎉`;

async function testCompleteFlow() {
  console.log('🚀 Testing complete message flow...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to API calls
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('guest_posts') || url.includes('admin')) {
      const status = response.status();
      const method = response.request().method();
      console.log(`${status >= 400 ? '❌' : '✅'} ${status} ${method} - ${url.split('?')[0]}`);
    }
  });

  try {
    // ============================================
    // PART 1: GUEST SUBMITS MESSAGE
    // ============================================
    console.log('📝 PART 1: Guest submitting message...\n');

    await page.goto(`${PRODUCTION_URL}/mensagens`);
    await page.waitForTimeout(2000);

    // Fill guest name
    const nameInput = await page.locator('input[name="guest_name"]').first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Playwright End-to-End Test');
      const continueBtn = await page.locator('button:has-text("Continuar")').first();
      await continueBtn.click();
      await page.waitForTimeout(2000);
      console.log('   ✅ Guest name submitted');
    }

    // Fill message
    const textarea = await page.locator('textarea').first();
    await textarea.fill(TEST_MESSAGE);
    console.log(`   ✅ Message entered: "${TEST_MESSAGE.substring(0, 50)}..."`);

    // Submit
    const submitBtn = await page.locator('button:has-text("Enviar")').first();
    await submitBtn.click();
    console.log('   ✅ Submit button clicked');

    await page.waitForTimeout(3000);

    // Check for success/error
    const pageContent = await page.content();
    if (pageContent.includes('sucesso') || pageContent.includes('enviado')) {
      console.log('   ✅ Success message detected on page');
    } else if (pageContent.includes('erro') || pageContent.includes('Error')) {
      console.log('   ❌ Error message detected on page');
      await page.screenshot({ path: 'debug-submit-error.png' });
    }

    // ============================================
    // PART 2: ADMIN CHECKS MODERATION PANEL
    // ============================================
    console.log('\n🔐 PART 2: Admin checking moderation panel...\n');

    // Login
    await page.goto(`${PRODUCTION_URL}/admin/login`);
    await page.waitForTimeout(2000);

    const passwordInput = await page.locator('input[type="password"]').first();
    await passwordInput.fill(ADMIN_PASSWORD);

    const loginBtn = await page.locator('button[type="submit"]').first();
    await loginBtn.click();
    console.log('   ✅ Admin logged in');

    await page.waitForTimeout(3000);

    // Go to posts moderation
    await page.goto(`${PRODUCTION_URL}/admin/posts`);
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    if (currentUrl.includes('/admin/posts')) {
      console.log('   ✅ Successfully accessed /admin/posts');

      // Wait for posts to load
      await page.waitForTimeout(2000);

      // Check if our test message appears
      const pageText = await page.textContent('body');

      if (pageText.includes(TEST_MESSAGE)) {
        console.log('   ✅ ✅ ✅ TEST MESSAGE FOUND IN ADMIN PANEL!');
        console.log('   🎉 COMPLETE FLOW WORKING!');
      } else if (pageText.includes('Playwright End-to-End Test')) {
        console.log('   ✅ Guest name found, but not the exact message');
        console.log('   ℹ️  This might be okay if message is truncated');
      } else {
        console.log('   ❌ Test message NOT found in admin panel');
        console.log('   Checking for any posts...');

        if (pageText.includes('Nenhuma mensagem encontrada') || pageText.includes('Carregando')) {
          console.log('   ⚠️  No posts visible - might be loading or empty');
        } else if (pageText.includes('Error') || pageText.includes('erro')) {
          console.log('   ❌ Error detected on admin page');
        }
      }

      // Take screenshot
      await page.screenshot({ path: 'debug-admin-posts.png', fullPage: true });
      console.log('   📸 Screenshot saved: debug-admin-posts.png');

    } else {
      console.log('   ❌ Redirected away from /admin/posts');
      console.log(`   Final URL: ${currentUrl}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'debug-complete-flow-error.png' });
  } finally {
    await browser.close();
  }
}

testCompleteFlow()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
