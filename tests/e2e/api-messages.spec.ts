/**
 * API contract tests for /api/messages
 */

import { test, expect, type Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const GUEST_SHARED_PASSWORD = process.env.GUEST_SHARED_PASSWORD || '1000dias'

const TEST_INVITATION_CODE = process.env.TEST_INVITATION_CODE || 'FAMILY001'

async function loginWithInvitation(page: Page, invitationCode: string) {
  await page.goto(`${BASE_URL}/dia-1000/login`)
  await page.fill('#invitation-code', invitationCode)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dia-1000\/upload/, { timeout: 10000 })
}

async function loginWithSharedPassword(page: Page, guestName: string) {
  await page.goto(`${BASE_URL}/dia-1000/login`)
  await page.click('button:has-text("Senha Compartilhada")')
  await page.fill('#guest-name', guestName)
  await page.fill('#password', GUEST_SHARED_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dia-1000\/upload/, { timeout: 10000 })
}

test.describe('/api/messages', () => {
  test('rejects anonymous request without guest name', async ({ request }) => {
    const response = await request.post('/api/messages', {
      data: {
        content: `Anonymous post ${Date.now()}`,
      },
    })

    expect(response.status()).toBe(400)
    const payload = await response.json()
    expect(payload.error).toMatch(/nome do convidado/i)
  })

  test('creates pending post for anonymous guest', async ({ request }) => {
    const response = await request.post('/api/messages', {
      data: {
        guestName: `Anon ${Date.now()}`,
        content: `Anonymous API post ${Date.now()}`,
      },
    })

    expect(response.status()).toBe(201)
    const payload = await response.json()
    expect(payload.success).toBeTruthy()
    expect(payload.autoApproved).toBeFalsy()
    expect(payload.post.status).toBe('pending')
  })

  test('auto-approves when authenticated via invitation code', async ({ page }) => {
    await loginWithInvitation(page, TEST_INVITATION_CODE)

    const result = await page.evaluate(async () => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: 'Tampered Name',
          content: `Authenticated API post ${Date.now()}`,
        }),
      })

      return {
        status: response.status,
        body: await response.json(),
      }
    })

    expect(result.status).toBe(201)
    expect(result.body.success).toBeTruthy()
    expect(result.body.autoApproved).toBeTruthy()
    expect(result.body.post.status).toBe('approved')
  })

  test('keeps shared password sessions pending', async ({ page }) => {
    await loginWithSharedPassword(page, 'Shared Password API Tester')

    const result = await page.evaluate(async () => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: 'Another Tampered Name',
          content: `Shared password API post ${Date.now()}`,
        }),
      })

      return {
        status: response.status,
        body: await response.json(),
      }
    })

    expect(result.status).toBe(201)
    expect(result.body.success).toBeTruthy()
    expect(result.body.autoApproved).toBeFalsy()
    expect(result.body.post.status).toBe('pending')
  })
})
