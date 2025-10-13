/**
 * Playwright Test - Guest Message Sending Investigation
 * Tests the complete flow: guest auth -> compose message -> submit
 */

import { chromium } from 'playwright';

const PRODUCTION_URL = 'https://thousanddaysof.love';
const LOCAL_URL = 'http://localhost:3000';
const BASE_URL = process.env.TEST_URL || LOCAL_URL;

async function testMessageSending() {
  console.log('🚀 Starting message sending investigation...\n');
  console.log(`Testing against: ${BASE_URL}\n`);

  const browser = await chromium.launch({
    headless: false, // Show browser for debugging
    slowMo: 500 // Slow down actions to see what's happening
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ Browser Error: ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️  Browser Warning: ${text}`);
    }
  });

  // Listen to network failures
  page.on('requestfailed', request => {
    console.log(`❌ Network Failed: ${request.url()}`);
    console.log(`   Failure: ${request.failure()?.errorText || 'Unknown'}`);
  });

  // Listen to API responses
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/') || url.includes('supabase.co')) {
      const status = response.status();
      const statusText = response.statusText();

      if (status >= 400) {
        console.log(`❌ API Error: ${status} ${statusText}`);
        console.log(`   URL: ${url}`);

        try {
          const body = await response.text();
          console.log(`   Response: ${body.substring(0, 200)}`);
        } catch (e) {
          // Ignore if can't read body
        }
      } else {
        console.log(`✅ API Success: ${status} - ${url.split('?')[0]}`);
      }
    }
  });

  try {
    // Step 1: Navigate to messages page
    console.log('📍 Step 1: Navigating to /mensagens...');
    await page.goto(`${BASE_URL}/mensagens`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    console.log(`   Current URL: ${currentUrl}`);

    // Step 2: Fill in guest name (required before posting)
    console.log('\n👤 Step 2: Checking for guest name form...');

    const guestNameForm = await page.locator('form:has(input[name="guest_name"])').first();
    const formCount = await guestNameForm.count();

    if (formCount > 0) {
      console.log('   Found guest name form, filling it in...');

      const nameInput = await page.locator('input[name="guest_name"]').first();
      await nameInput.fill('Playwright Test User');
      console.log('   ✅ Name filled: "Playwright Test User"');

      const continueButton = await page.locator('button:has-text("Continuar")').first();
      await continueButton.click();
      console.log('   ✅ Continue button clicked');

      // Wait for composer to appear
      await page.waitForTimeout(2000);
    } else {
      console.log('   ✅ Guest name already set (no form visible)');
    }

    await page.waitForTimeout(1000);

    // Step 3: Locate the post composer
    console.log('\n📝 Step 3: Locating post composer...');

    // Try to find textarea
    const textarea = await page.locator('textarea[placeholder*="Compartilhe"], textarea[placeholder*="mensagem"]').first();
    const textareaCount = await textarea.count();
    console.log(`   Found ${textareaCount} textarea(s)`);

    if (textareaCount === 0) {
      console.log('   ❌ No textarea found! Taking screenshot...');
      await page.screenshot({ path: 'debug-no-textarea.png', fullPage: true });
      console.log('   Screenshot saved: debug-no-textarea.png');

      // Check what's on the page
      const bodyText = await page.locator('body').innerText();
      console.log('\n   Page content preview:');
      console.log(bodyText.substring(0, 500));

      throw new Error('Textarea not found on messages page');
    }

    // Step 4: Fill in message
    console.log('\n✏️  Step 4: Composing message...');
    await textarea.fill('Test message from Playwright automation 🎉');
    console.log('   ✅ Message text entered');

    await page.waitForTimeout(1000);

    // Step 5: Locate and click submit button
    console.log('\n📤 Step 5: Submitting message...');

    // Try different button selectors (PostComposer uses "Enviar")
    const submitButton = await page.locator('button:has-text("Enviar")').first();
    const submitButtonCount = await submitButton.count();
    console.log(`   Found ${submitButtonCount} submit button(s)`);

    if (submitButtonCount === 0) {
      console.log('   ❌ No submit button found! Taking screenshot...');
      await page.screenshot({ path: 'debug-no-button.png', fullPage: true });
      console.log('   Screenshot saved: debug-no-button.png');
      throw new Error('Submit button not found');
    }

    // Check if button is enabled
    const isDisabled = await submitButton.isDisabled();
    console.log(`   Button disabled: ${isDisabled}`);

    if (isDisabled) {
      console.log('   ⚠️  Submit button is disabled, checking requirements...');

      // Take screenshot to see state
      await page.screenshot({ path: 'debug-button-disabled.png', fullPage: true });
      console.log('   Screenshot saved: debug-button-disabled.png');
    }

    // Click the button anyway to see what happens
    console.log('   Clicking submit button...');
    await submitButton.click();
    console.log('   ✅ Submit button clicked');

    // Wait for API response
    await page.waitForTimeout(3000);

    // Step 6: Check for success/error messages
    console.log('\n✔️  Step 6: Checking result...');

    // Look for success message
    const successMessage = await page.locator('text=/sucesso|enviado|publicado/i').first();
    if (await successMessage.count() > 0) {
      console.log('   ✅ Success message found!');
      console.log(`   Message: ${await successMessage.innerText()}`);
    }

    // Look for error message
    const errorMessage = await page.locator('text=/erro|falha|error/i, [class*="error"], [class*="alert"]').first();
    if (await errorMessage.count() > 0) {
      console.log('   ❌ Error message found:');
      console.log(`   Message: ${await errorMessage.innerText()}`);
    }

    // Check if message appears in feed (might need approval)
    const messageInFeed = await page.locator('text=/Test message from Playwright/').first();
    if (await messageInFeed.count() > 0) {
      console.log('   ✅ Message appears in feed immediately (no approval needed)');
    } else {
      console.log('   ℹ️  Message not in feed (likely pending admin approval)');
    }

    // Take final screenshot
    await page.screenshot({ path: 'debug-final-state.png', fullPage: true });
    console.log('\n📸 Final screenshot saved: debug-final-state.png');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Test completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);

    // Take error screenshot
    try {
      await page.screenshot({ path: 'debug-error.png', fullPage: true });
      console.log('📸 Error screenshot saved: debug-error.png');
    } catch (e) {
      // Ignore screenshot errors
    }

    throw error;
  } finally {
    await browser.close();
  }
}

// Run the test
testMessageSending()
  .then(() => {
    console.log('\n✅ Investigation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Investigation failed:', error.message);
    process.exit(1);
  });
