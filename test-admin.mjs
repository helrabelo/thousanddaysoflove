/**
 * Playwright Test - Admin Login and Access
 * Tests admin authentication and /admin/posts access
 */

import { chromium } from 'playwright';

const PRODUCTION_URL = 'https://thousanddaysof.love';
const ADMIN_PASSWORD = 'HelYlana1000Dias!';

async function testAdminAccess() {
  console.log('🚀 Testing admin login and access...\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`❌ Browser Error: ${msg.text()}`);
    }
  });

  // Listen to network
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/admin/login') || url.includes('/admin')) {
      const status = response.status();
      console.log(`${status >= 400 ? '❌' : '✅'} ${status} - ${url}`);

      if (url.includes('/api/admin/login')) {
        try {
          const body = await response.text();
          console.log(`   Response: ${body.substring(0, 200)}`);
        } catch (e) {
          // Ignore
          console.log({ e });
        }
      }
    }
  });

  try {
    // Step 1: Go to admin login
    console.log('📍 Step 1: Navigating to /admin/login...');
    await page.goto(`${PRODUCTION_URL}/admin/login`);
    await page.waitForTimeout(2000);

    console.log(`   Current URL: ${page.url()}`);

    // Step 2: Fill password and login
    console.log('\n🔐 Step 2: Logging in...');

    const passwordInput = await page.locator('input[type="password"]').first();
    await passwordInput.fill(ADMIN_PASSWORD);
    console.log('   ✅ Password filled');

    const loginButton = await page.locator('button[type="submit"]').first();
    await loginButton.click();
    console.log('   ✅ Login button clicked');

    // Wait for redirect
    await page.waitForTimeout(3000);
    console.log(`   Current URL after login: ${page.url()}`);

    // Step 3: Check cookies
    console.log('\n🍪 Step 3: Checking cookies...');
    const cookies = await context.cookies();
    const adminCookie = cookies.find(c => c.name === 'admin_session');

    if (adminCookie) {
      console.log('   ✅ admin_session cookie found');
      console.log(`   Value: ${adminCookie.value.substring(0, 20)}...`);
      console.log(`   Path: ${adminCookie.path}`);
      console.log(`   Secure: ${adminCookie.secure}`);
      console.log(`   HttpOnly: ${adminCookie.httpOnly}`);
      console.log(`   SameSite: ${adminCookie.sameSite}`);
    } else {
      console.log('   ❌ admin_session cookie NOT found');
      console.log('   Available cookies:', cookies.map(c => c.name).join(', '));
    }

    // Step 4: Try to access /admin/posts
    console.log('\n📝 Step 4: Accessing /admin/posts...');
    await page.goto(`${PRODUCTION_URL}/admin/posts`);
    await page.waitForTimeout(3000);

    const finalUrl = page.url();
    console.log(`   Final URL: ${finalUrl}`);

    if (finalUrl.includes('/admin/posts')) {
      console.log('   ✅ Successfully accessed /admin/posts');
    } else if (finalUrl.includes('/admin/login')) {
      console.log('   ❌ Redirected back to login - Authentication failed');
    } else {
      console.log(`   ⚠️  Unexpected redirect to: ${finalUrl}`);
    }

    // Take screenshot
    await page.screenshot({ path: 'debug-admin-access.png', fullPage: true });
    console.log('\n📸 Screenshot saved: debug-admin-access.png');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await page.screenshot({ path: 'debug-admin-error.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testAdminAccess()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
