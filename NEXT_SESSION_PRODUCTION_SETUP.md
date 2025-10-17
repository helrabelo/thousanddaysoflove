# Next Session: Production Setup + IPN Webhooks

**Date:** 2025-10-16
**Priority:** HIGH - Production credentials configured, need webhook implementation

---

## 🎯 Session Goals

1. ✅ **Verify production Mercado Pago credentials** are working
2. 🔧 **Implement IPN webhooks** for automatic payment status updates
3. 🤔 **Evaluate Mercado Pago MCP server** (is it useful?)
4. 🚀 **Test complete PIX flow with production keys**

---

## 📋 Current Situation

### Production Credentials Added
User has configured production Mercado Pago keys in:
- ✅ `.env` (if exists)
- ✅ `.env.local` (confirmed updated)
- ✅ `.env.production` (for Vercel deployment)

**Keys available:**
```bash
# Production Keys (from .env.local)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-6941960145919710-092814-92ff8ad8fbece2e6c8dd00fa022524db-101188970
MERCADO_PAGO_PUBLIC_KEY=APP_USR-2b49bef0-0c9a-45b2-9de5-9169c0bf9bd9
MERCADO_PAGO_CLIENT_ID=6941960145919710
MERCADO_PAGO_CLIENT_SECRET=vzILjDICq9D9GyR3gqHNLKb2Dt7qB8i1

# Test Keys (for comparison)
# MERCADO_PAGO_ACCESS_TOKEN=TEST-6941960145919710-092814-55425fa9210a0c9da2f815e5fcc3b5fa-101188970
# MERCADO_PAGO_PUBLIC_KEY=TEST-531d4b76-d536-453b-b70a-260ce803bed0
```

### IPN Enabled
User has enabled IPN (Instant Payment Notification) in Mercado Pago dashboard.

**Documentation links:**
- Overview: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications
- IPN Guide: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/ipn

### Mercado Pago MCP Server
User found: https://www.mercadopago.com.br/developers/pt/docs/mcp-server/overview

**Question:** Is this MCP server useful for our implementation?

---

## 🔧 Task 1: Verify Production Keys

### Test Production Credentials
```bash
# Test the access token with Mercado Pago API
curl -X GET \
  'https://api.mercadopago.com/v1/account/settings' \
  -H 'Authorization: Bearer APP_USR-6941960145919710-092814-92ff8ad8fbece2e6c8dd00fa022524db-101188970'
```

**Expected response:**
```json
{
  "id": 101188970,
  "nickname": "USER_NICKNAME",
  "country_id": "BR",
  "site_id": "MLB",
  ...
}
```

### Create Test Payment
Run a small test payment (R$1) to verify:
1. QR code generation works
2. PIX payment can be created
3. Status polling works
4. Payment shows in Mercado Pago dashboard

**Test steps:**
1. Create R$1 test gift in Sanity (or use existing)
2. Generate PIX payment via `/api/payments/create-pix`
3. Complete payment via Mercado Pago app
4. Verify status updates in database

---

## 🔔 Task 2: Implement IPN Webhooks

### Current Situation
**Webhook endpoint exists but is DISABLED:**
- Location: `src/app/api/webhooks/mercado-pago/route.ts` (create if missing)
- Code location: `src/lib/services/payments.ts:334`
- Status: Commented out for local development

**Why webhooks are critical:**
- Status polling (current): Checks every 5 seconds while modal is open
- Problem: If user closes modal, payment status never updates
- Solution: Webhooks notify us automatically when payment completes

### Implementation Steps

#### Step 1: Create Webhook Endpoint

**File:** `src/app/api/webhooks/mercado-pago/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payments'

export async function POST(req: NextRequest) {
  try {
    // Mercado Pago sends IPN notifications as x-www-form-urlencoded
    const body = await req.json()

    console.log('🔔 Webhook received:', body)

    // IPN notification format:
    // {
    //   "id": 12345,
    //   "live_mode": true,
    //   "type": "payment",
    //   "date_created": "2015-03-25T10:04:58.396-04:00",
    //   "user_id": 101188970,
    //   "api_version": "v1",
    //   "action": "payment.created",
    //   "data": {
    //     "id": "999999999"
    //   }
    // }

    // Process webhook
    if (body.type === 'payment') {
      await PaymentService.processWebhookNotification(body)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true, message: 'Not a payment notification' })

  } catch (error) {
    console.error('❌ Webhook error:', error)

    // Return 200 even on error to prevent Mercado Pago retries
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 200 }
    )
  }
}

// GET endpoint for Mercado Pago webhook validation
export async function GET() {
  return NextResponse.json({ status: 'Webhook endpoint active' })
}
```

#### Step 2: Update PaymentService

**File:** `src/lib/services/payments.ts`

**Enable webhook URL in createPixPayment:**
```typescript
// Line ~334 - UNCOMMENT THIS:
notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago`,
```

**Verify processWebhookNotification method exists:**
```typescript
// Lines 475-519 - This method should already exist
static async processWebhookNotification(webhookData: any) {
  try {
    const { data, type } = webhookData

    if (type === 'payment' && data?.id) {
      const paymentStatus = await this.checkPaymentStatus(data.id)

      // Find our payment record by external_reference
      const paymentId = paymentStatus.external_reference

      if (paymentId) {
        let status: 'pending' | 'completed' | 'failed' | 'refunded' = 'pending'

        switch (paymentStatus.status) {
          case 'approved':
            status = 'completed'
            break
          case 'rejected':
          case 'cancelled':
            status = 'failed'
            break
          case 'refunded':
            status = 'refunded'
            break
          default:
            status = 'pending'
        }

        // Update payment status
        await this.updatePaymentStatus(paymentId, status, data.id.toString())

        // TODO: Send email notification
        if (status === 'completed') {
          console.log(`✅ Payment completed via webhook: ${paymentId}`)
        }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing webhook:', error)
    throw error
  }
}
```

#### Step 3: Configure Webhook URL in Mercado Pago

**For Local Development (use ngrok):**
```bash
# Install ngrok if not installed
brew install ngrok

# Start ngrok tunnel
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Set in Mercado Pago dashboard:
https://abc123.ngrok.io/api/webhooks/mercado-pago
```

**For Production (Vercel):**
```
https://thousandaysof.love/api/webhooks/mercado-pago
```

**Configure in Mercado Pago:**
1. Go to: https://www.mercadopago.com.br/developers/panel/ipn
2. Click "Configure notifications"
3. Select "IPN" mode
4. Enter webhook URL
5. Test endpoint (should return 200 OK)

#### Step 4: Test Webhook

**Manual test via curl:**
```bash
curl -X POST http://localhost:3000/api/webhooks/mercado-pago \
  -H "Content-Type: application/json" \
  -d '{
    "id": 12345,
    "live_mode": false,
    "type": "payment",
    "date_created": "2025-10-16T10:00:00Z",
    "user_id": 101188970,
    "api_version": "v1",
    "action": "payment.updated",
    "data": {
      "id": "999999999"
    }
  }'
```

**Expected response:**
```json
{
  "success": true
}
```

**Check logs:**
- Should see "🔔 Webhook received:" in terminal
- Should see payment status update in Supabase

---

## 🤔 Task 3: Evaluate Mercado Pago MCP Server

### What is MCP?
**Model Context Protocol** - A protocol for AI assistants to access external data sources.

**Mercado Pago MCP Server:**
- Provides AI assistants (like Claude) access to Mercado Pago API
- Allows querying payments, transactions, customers
- Useful for debugging and analytics

### Is it Useful for This Project?

**Potential Benefits:**
1. 🔍 **Debugging:** Query payment status directly via Claude
2. 📊 **Analytics:** Get payment statistics without writing SQL
3. 🛠️ **Development:** Test API calls interactively

**Potential Drawbacks:**
1. ⚠️ **Security:** Requires API credentials in MCP config
2. 🐌 **Performance:** Extra API calls (might hit rate limits)
3. 🔧 **Maintenance:** Another tool to maintain

### Decision Matrix

**Use MCP if:**
- ✅ Need frequent payment debugging
- ✅ Want AI to analyze payment patterns
- ✅ Building admin dashboards with AI assistance

**Skip MCP if:**
- ❌ Only need basic payment processing
- ❌ Have direct database access (we do - Supabase)
- ❌ Security concerns with credential sharing

### Recommendation
**SKIP FOR NOW** - We have:
1. Direct Supabase access for payment data
2. Mercado Pago dashboard for production monitoring
3. Admin dashboard in the app (`/admin/pagamentos`)

**Revisit later if:**
- Building AI-powered admin features
- Need automated payment reconciliation
- Want natural language payment queries

---

## 🧪 Task 4: End-to-End Production Test

### Test Scenario: Real R$1 Payment

**Safety measures:**
1. Use R$1 amount (refundable if needed)
2. Test with your own Mercado Pago account
3. Verify refund process works

**Test steps:**

1. **Create R$1 test gift:**
   ```typescript
   // Via Sanity Studio or API
   {
     title: "Café para os Noivos [TESTE PROD]",
     description: "Teste de pagamento em produção - R$1",
     fullPrice: 1,
     category: "other",
     allowPartialPayment: false,
     priority: "low",
     isActive: true
   }
   ```

2. **Generate PIX payment:**
   - Navigate to `/presentes`
   - Click "Presentear" on R$1 gift
   - Fill form with real data
   - Generate PIX QR code

3. **Complete payment:**
   - Scan QR code with Mercado Pago app
   - Use real account (R$1 will be charged)
   - Complete payment

4. **Verify webhook:**
   - Check webhook logs (ngrok/Vercel logs)
   - Verify payment status updated to "completed"
   - Check Supabase `payments` table
   - Check `gift_contributions` view

5. **Verify email (if implemented):**
   - Check inbox for confirmation email
   - Verify email contains correct details

6. **Refund (optional):**
   ```bash
   # Via Mercado Pago dashboard or API
   curl -X POST \
     "https://api.mercadopago.com/v1/payments/{PAYMENT_ID}/refunds" \
     -H "Authorization: Bearer ${MERCADO_PAGO_ACCESS_TOKEN}" \
     -H "Content-Type: application/json"
   ```

---

## 📝 Implementation Checklist

### Pre-Flight Checks
- [ ] Production keys in `.env.local` (verified ✅)
- [ ] `NEXT_PUBLIC_SITE_URL` configured
- [ ] Supabase connection working
- [ ] Dev server running (`npm run dev`)

### Webhook Implementation
- [ ] Create `/api/webhooks/mercado-pago/route.ts`
- [ ] Implement POST handler for IPN
- [ ] Implement GET handler for validation
- [ ] Verify `processWebhookNotification` exists in PaymentService
- [ ] Uncomment `notification_url` in `createPixPayment`
- [ ] Test webhook locally with curl
- [ ] Set up ngrok for local testing
- [ ] Configure webhook URL in Mercado Pago dashboard
- [ ] Test real payment with webhook

### Production Testing
- [ ] Create R$1 test gift
- [ ] Generate PIX payment
- [ ] Complete payment with real account
- [ ] Verify webhook received
- [ ] Verify status updated in database
- [ ] Verify gift contribution view updated
- [ ] Check Mercado Pago dashboard
- [ ] (Optional) Test refund process

### MCP Server Evaluation
- [ ] Read MCP documentation
- [ ] List pros/cons for this project
- [ ] Make decision (implement now / later / skip)
- [ ] Document decision in `PAYMENT_SYSTEM_ASSESSMENT.md`

---

## 🚨 Gotchas & Troubleshooting

### Issue: Webhook Not Received
**Causes:**
1. Local dev without ngrok (no public URL)
2. Firewall blocking ngrok
3. Wrong URL in Mercado Pago config
4. Webhook endpoint crashed

**Solutions:**
1. Use ngrok: `ngrok http 3000`
2. Check ngrok dashboard: http://127.0.0.1:4040
3. Test with curl first
4. Check server logs for errors

### Issue: Status Not Updating
**Causes:**
1. `external_reference` mismatch
2. Payment ID not found in database
3. RLS policies blocking update
4. `updatePaymentStatus` using wrong client

**Solutions:**
1. Verify `external_reference` = payment.id from Supabase
2. Check `payments` table for matching record
3. Use `createAdminClient()` in webhook (bypasses RLS)
4. Add detailed logging to `processWebhookNotification`

### Issue: Duplicate Webhooks
**Cause:** Mercado Pago retries if endpoint returns error

**Solution:**
- Always return 200 OK (even on errors)
- Handle idempotency (check if status already updated)
- Log duplicate webhooks for monitoring

### Issue: Test Keys vs Production Keys
**Problem:** Accidentally using test keys in production

**Solution:**
```typescript
// Add environment check
if (process.env.NODE_ENV === 'production' &&
    process.env.MERCADO_PAGO_ACCESS_TOKEN?.includes('TEST')) {
  throw new Error('Cannot use test keys in production!')
}
```

---

## 📊 Success Criteria

**Webhook implementation is complete when:**
- [x] Production keys configured
- [ ] Webhook endpoint created and deployed
- [ ] Webhook URL configured in Mercado Pago
- [ ] IPN notifications received and processed
- [ ] Payment status updates automatically
- [ ] Database records updated correctly
- [ ] Gift contributions reflect payment
- [ ] Logs show webhook activity
- [ ] R$1 test payment successful
- [ ] Email notifications sent (if implemented)

**Current Progress:** 1/10 (10%)

---

## 🚀 Next Session Prompt

**Copy-paste this to continue:**

```
Continue payment system implementation for thousanddaysoflove wedding website.

Tasks:
1. Verify production Mercado Pago keys are working
2. Implement IPN webhook endpoint for automatic payment status updates
3. Evaluate Mercado Pago MCP server (is it useful?)
4. Test complete PIX flow with production keys

Context:
- Production credentials configured in .env.local
- IPN enabled in Mercado Pago dashboard
- PIX payments working with test keys
- Database schema fixed (gift_id nullable)

Files to read:
- NEXT_SESSION_PRODUCTION_SETUP.md (this file)
- CONTINUE_PAYMENTS_WORK.md (credit card implementation plan)
- PAYMENT_SYSTEM_ASSESSMENT.md (technical assessment)

Priority: HIGH - Need webhooks for production reliability
Estimated time: 3-4 hours
```

---

## 📚 References

**Mercado Pago Docs:**
- IPN Notifications: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/ipn
- Webhooks: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- Payment API: https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post
- MCP Server: https://www.mercadopago.com.br/developers/pt/docs/mcp-server/overview

**Internal Docs:**
- `PAYMENT_SYSTEM_ASSESSMENT.md` - Technical analysis
- `TEST_GIFT_SETUP.md` - Test data creation
- `CONTINUE_PAYMENTS_WORK.md` - Credit card implementation

**Code Locations:**
- Payment service: `src/lib/services/payments.ts`
- PIX API: `src/app/api/payments/create-pix/route.ts`
- Status API: `src/app/api/payments/status/route.ts`
- Webhook API: `src/app/api/webhooks/mercado-pago/route.ts` (to create)

---

**Ready to make payments bulletproof! 🔔🚀**

*- Claude, 2025-10-16*
