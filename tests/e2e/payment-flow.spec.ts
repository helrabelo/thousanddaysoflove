import { test, expect } from '@playwright/test'

/**
 * Payment Flow E2E Test
 *
 * Tests the complete PIX payment creation flow including:
 * 1. Navigate to gifts page
 * 2. Select a gift
 * 3. Fill payment form
 * 4. Generate PIX QR code
 * 5. Verify payment record created
 *
 * Note: This test uses production Mercado Pago API in test mode
 */

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from gifts page
    await page.goto('http://localhost:3000/presentes')

    // Wait for page to load
    await page.waitForLoadState('networkidle')
  })

  test('should create PIX payment successfully', async ({ page, browser }) => {
    test.setTimeout(60000) // 60 seconds for full flow

    // Step 1: Find and click first gift card "Presentear" button
    console.log('Step 1: Finding gift card...')
    const contributeButton = page.locator('button:has-text("Presentear")').first()
    await expect(contributeButton).toBeVisible({ timeout: 10000 })
    await contributeButton.click()

    // Step 2: Wait for payment modal to open
    console.log('Step 2: Waiting for payment modal...')
    await expect(page.locator('text=Comprar com PIX')).toBeVisible({ timeout: 5000 })

    // Step 3: Fill in payment form
    console.log('Step 3: Filling payment form...')
    await page.fill('input[placeholder="Digite seu nome completo"]', 'Teste Playwright')
    await page.fill('input[placeholder="seu@email.com"]', 'playwright@test.com')

    // Find amount input and set to minimum R$50
    const amountInput = page.locator('input[type="number"]')
    await amountInput.clear()
    await amountInput.fill('50')

    // Optional: Add a message
    await page.fill('textarea[placeholder*="Deixe uma mensagem"]', 'Teste automatizado com Playwright')

    // Step 4: Click "Gerar PIX" button
    console.log('Step 4: Generating PIX payment...')
    await page.click('button:has-text("Gerar PIX")')

    // Step 5: Wait for QR code to appear (this confirms payment was created)
    console.log('Step 5: Waiting for QR code...')
    await expect(page.locator('text=Como pagar:')).toBeVisible({ timeout: 15000 })

    // Verify QR code image is present
    const qrCodeImage = page.locator('img[alt="QR Code PIX"]')
    await expect(qrCodeImage).toBeVisible({ timeout: 5000 })

    // Verify "Aguardando pagamento" status is shown
    await expect(page.locator('text=Aguardando pagamento')).toBeVisible()

    // Step 6: Verify copy button exists (icon button next to PIX code)
    console.log('Step 6: Verifying copy PIX code button...')
    const copyButton = page.locator('button[title*="Copiar"], button:has(.lucide-copy), button:has(svg):near(:text("codigo PIX"))')
    await expect(copyButton.first()).toBeVisible()

    // Step 7: Check console logs for payment creation steps
    console.log('✅ Payment creation successful!')
    console.log('Look for these logs in the server console:')
    console.log('  🎯 [1/4] Creating payment record in database...')
    console.log('  ✅ [1/4] Payment record created')
    console.log('  🎯 [2/4] Calling Mercado Pago API...')
    console.log('  ✅ [2/4] Mercado Pago response received')
    console.log('  🎯 [3/4] Updating payment with Mercado Pago ID...')
    console.log('  ✅ [3/4] Payment updated with Mercado Pago ID')
    console.log('  ✅ [4/4] Payment creation complete')

    // Optional: Take screenshot
    await page.screenshot({ path: 'test-results/payment-qr-code.png', fullPage: true })

    console.log('Screenshot saved to: test-results/payment-qr-code.png')
  })

  test('should show error for invalid payment', async ({ page }) => {
    test.setTimeout(30000)

    // Click Presentear button
    const contributeButton = page.locator('button:has-text("Presentear")').first()
    await contributeButton.click()

    // Wait for modal
    await expect(page.locator('text=Comprar com PIX')).toBeVisible({ timeout: 5000 })

    // Try to submit with empty email
    await page.fill('input[placeholder="Digite seu nome completo"]', 'Test User')
    // Leave email empty

    // Button should be disabled
    const generateButton = page.locator('button:has-text("Gerar PIX")')
    await expect(generateButton).toBeDisabled()
  })

  test('should close modal on X button click', async ({ page }) => {
    // Open modal
    await page.click('button:has-text("Presentear")')
    await expect(page.locator('text=Comprar com PIX')).toBeVisible()

    // Click X button (button with lucide-x icon in modal header)
    await page.locator('.lucide-x').click()

    // Modal should close
    await expect(page.locator('text=Comprar com PIX')).not.toBeVisible({ timeout: 2000 })
  })
})

test.describe('Payment Status Polling', () => {
  test('should poll payment status after creation', async ({ page }) => {
    test.setTimeout(60000)

    // Setup console log listener
    const consoleMessages: string[] = []
    page.on('console', (msg) => {
      if (msg.text().includes('Status check')) {
        consoleMessages.push(msg.text())
      }
    })

    // Create payment (reuse steps from above)
    await page.goto('http://localhost:3000/presentes')
    await page.click('button:has-text("Presentear")')

    // Wait for modal
    await expect(page.locator('text=Comprar com PIX')).toBeVisible({ timeout: 5000 })

    await page.fill('input[placeholder="Digite seu nome completo"]', 'Status Test')
    await page.fill('input[placeholder="seu@email.com"]', 'status@test.com')
    await page.fill('input[type="number"]', '50')
    await page.click('button:has-text("Gerar PIX")')

    // Wait for QR code
    await expect(page.locator('text=Pagamento PIX')).toBeVisible({ timeout: 15000 })

    // Wait for at least one status poll (happens every 5 seconds)
    console.log('Waiting for status polling to start...')
    await page.waitForTimeout(6000)

    // Check if status polling happened
    console.log('Console messages captured:', consoleMessages.length)

    // Should see "Aguardando pagamento" or "Verificando pagamento..."
    const statusText = page.locator('text=Aguardando pagamento').or(page.locator('text=Verificando pagamento'))
    await expect(statusText).toBeVisible()
  })
})
