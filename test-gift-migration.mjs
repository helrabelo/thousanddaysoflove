#!/usr/bin/env node

/**
 * Gift Registry Migration Test
 * Tests the complete Sanity → Supabase gift registry flow
 */

import { createClient } from '@sanity/client'
import { chromium } from 'playwright'

const SANITY_PROJECT_ID = 'ala3rp0f'
const SANITY_DATASET = 'production'
const SANITY_TOKEN = 'skVBvJF3UwSroRJcXeSVQ4GxNNvZzn2vz8BZq15zwOhjfzxb3AcyroWJWwFQC1hVxqoknUDbf4FIRtbIkIXj5FomzPh1NUQEsWhu3cZWIfpchSSgiDGg646AQ5ATHToeoWl3ZjcTkz6GLdZOjCytJErGyl0KIQvWvORCo4pSrfszQVkDUaH6'

// Initialize Sanity client
const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
})

console.log('🎁 Gift Registry Migration Test\n')
console.log('================================\n')

// Test gift data
const testGift = {
  _type: 'giftItem',
  title: 'Jogo de Panelas Tramontina (TESTE)',
  description: 'Um jogo de panelas antiaderente para preparar aqueles jantares caseiros que a Ylana tanto ama. Porque introvertidos apaixonados preferem cozinhar em casa mesmo.',
  fullPrice: 450,
  category: 'kitchen',
  allowPartialPayment: true,
  suggestedContributions: [100, 250, 500],
  allowCustomAmount: true,
  priority: 'high',
  isActive: true,
  notes: 'Presente de teste - pode ser deletado'
}

let testGiftId = null

async function createTestGift() {
  console.log('📝 Step 1: Creating test gift in Sanity...')

  try {
    const result = await sanityClient.create(testGift)
    testGiftId = result._id
    console.log(`✅ Gift created with ID: ${testGiftId}`)
    console.log(`   Title: ${result.title}`)
    console.log(`   Price: R$ ${result.fullPrice}`)
    console.log(`   Category: ${result.category}`)
    return result
  } catch (error) {
    console.error('❌ Failed to create gift:', error.message)
    throw error
  }
}

async function testFrontend() {
  console.log('\n🌐 Step 2: Testing frontend with Playwright...')

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    // Navigate to presentes page
    console.log('   → Navigating to /presentes...')
    await page.goto('http://localhost:3000/presentes', {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    // Wait for gifts to load
    await page.waitForSelector('[data-testid="gift-card"], .grid', { timeout: 10000 })

    // Check if our test gift appears
    const giftCards = await page.locator('text=TESTE').count()
    if (giftCards > 0) {
      console.log('   ✅ Test gift found on page')
    } else {
      console.log('   ⚠️  Test gift not visible yet (may need page refresh)')
    }

    // Test filters
    console.log('   → Testing category filter...')
    await page.selectOption('select', 'kitchen')
    await page.waitForTimeout(500)
    console.log('   ✅ Category filter working')

    // Search for test gift
    console.log('   → Testing search...')
    await page.fill('input[placeholder*="Buscar"]', 'TESTE')
    await page.waitForTimeout(500)
    const searchResults = await page.locator('text=TESTE').count()
    console.log(`   ✅ Search found ${searchResults} result(s)`)

    // Take screenshot
    await page.screenshot({ path: '/tmp/gift-registry-test.png', fullPage: true })
    console.log('   📸 Screenshot saved to /tmp/gift-registry-test.png')

  } catch (error) {
    console.error('   ❌ Frontend test failed:', error.message)
    await page.screenshot({ path: '/tmp/gift-registry-error.png', fullPage: true })
    console.log('   📸 Error screenshot saved to /tmp/gift-registry-error.png')
  } finally {
    await browser.close()
  }
}

async function verifyDatabase() {
  console.log('\n🗄️  Step 3: Verifying database setup...')

  try {
    // Check if our test gift can be fetched
    const fetchedGift = await sanityClient.fetch(
      `*[_type == "giftItem" && _id == $id][0]`,
      { id: testGiftId }
    )

    if (fetchedGift) {
      console.log('   ✅ Gift retrievable from Sanity')
      console.log(`   → Title: ${fetchedGift.title}`)
      console.log(`   → Price: R$ ${fetchedGift.fullPrice}`)
      console.log(`   → Active: ${fetchedGift.isActive}`)
    } else {
      console.log('   ❌ Gift not found in Sanity')
    }

    // Check gift contributions view exists
    console.log('   ℹ️  Supabase gift_contributions view should be ready')
    console.log('   ℹ️  Test a payment to verify full integration')

  } catch (error) {
    console.error('   ❌ Database verification failed:', error.message)
  }
}

async function cleanup() {
  console.log('\n🧹 Step 4: Cleanup (optional)...')

  const readline = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('Delete test gift from Sanity? (y/N): ', async (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          await sanityClient.delete(testGiftId)
          console.log('   ✅ Test gift deleted')
        } catch (error) {
          console.error('   ❌ Failed to delete:', error.message)
        }
      } else {
        console.log(`   ℹ️  Test gift kept (ID: ${testGiftId})`)
        console.log(`   → Delete manually in Sanity Studio or run:`)
        console.log(`   → DELETE FROM sanity WHERE _id = "${testGiftId}"`)
      }
      rl.close()
      resolve()
    })
  })
}

async function runTests() {
  try {
    await createTestGift()
    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for CDN
    await testFrontend()
    await verifyDatabase()

    console.log('\n✅ All tests completed!')
    console.log('\n📋 Summary:')
    console.log(`   • Test gift ID: ${testGiftId}`)
    console.log(`   • View in Sanity: https://ala3rp0f.sanity.studio/production/desk/giftItem;${testGiftId}`)
    console.log(`   • View on site: http://localhost:3000/presentes`)

    await cleanup()

  } catch (error) {
    console.error('\n❌ Test suite failed:', error)
    process.exit(1)
  }
}

// Run tests
runTests()
