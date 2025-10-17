# Mercado Pago Production Error - Troubleshooting Guide

**Date**: 2025-10-16
**Error**: `"http is unavailable for request create_ti"` - Status 500

---

## Error Analysis

### What the Error Means
- **Source**: Mercado Pago API (not our code)
- **Type**: 500 Internal Server Error
- **Message**: `"http is unavailable for request create_ti"`
  - "create_ti" is likely truncated from "create_ticket" or similar Mercado Pago internal method
  - Indicates their internal HTTP service is unavailable

### This is NOT Our Code
Our code (`src/lib/services/payments.ts:354`) correctly calls:
```typescript
fetch('https://api.mercadopago.com/v1/payments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    'X-Idempotency-Key': `wedding-${paymentData.paymentId}-${Date.now()}`
  },
  body: JSON.stringify(requestBody)
})
```

This works perfectly in local development and tests.

---

## Checklist: What to Verify

### 1. Access Token Type ⚠️ CRITICAL

**Problem**: Using TEST token in production will cause API errors

**Check**:
```bash
# In your production environment (Vercel/Railway/etc)
echo $MERCADO_PAGO_ACCESS_TOKEN | head -c 20

# Should output:
# APP_USR-xxxxxxxxxxxx    ✅ CORRECT (production token)
# TEST-xxxxxxxxxxxx       ❌ WRONG (test token - will fail in production)
```

**Fix**: Get production credentials from:
1. Log in to https://www.mercadopago.com.br/developers
2. Navigate to "Suas integrações" (Your integrations)
3. Select your application
4. Go to "Credenciais de produção" (Production credentials)
5. Copy "Access Token de produção"
6. Update `MERCADO_PAGO_ACCESS_TOKEN` in production environment

### 2. Token Permissions

**Required Permissions**:
- ✅ `write` - Create payments
- ✅ `read` - Check payment status
- ✅ PIX enabled

**Check**: In Mercado Pago dashboard under "Configurações" → "Meios de pagamento"
- Verify PIX is enabled
- Verify account is fully activated (not sandbox mode)

### 3. Account Status

**Verify**:
- Account is not in sandbox/test mode
- Account is fully verified and activated
- No restrictions or warnings in dashboard
- Business information complete

### 4. Mercado Pago Service Status

**500 errors often indicate**:
- Temporary API outage
- Maintenance window
- Regional service issues

**Check**:
1. https://status.mercadopago.com.br (if available)
2. https://www.mercadopagostatus.com
3. Try payment again after 5-10 minutes
4. Check Mercado Pago Twitter/status updates

### 5. Rate Limiting

**Mercado Pago Limits**:
- Test: 10 requests/minute
- Production: Higher limits (check your plan)

**Check**: Is this error happening on:
- First request: Likely token/permission issue
- After many requests: Likely rate limiting

---

## Quick Test: Verify Token Works

**Test your production token locally**:

```bash
# Replace YOUR_PRODUCTION_TOKEN with actual token from production env
curl -X POST \
  https://api.mercadopago.com/v1/payments \
  -H "Authorization: Bearer YOUR_PRODUCTION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_amount": 1,
    "description": "Test Payment",
    "payment_method_id": "pix",
    "payer": {
      "email": "test@test.com",
      "first_name": "Test",
      "last_name": "User"
    }
  }'
```

**Expected responses**:
- **200 OK** with payment object → Token works ✅
- **401 Unauthorized** → Token is invalid ❌
- **403 Forbidden** → Token lacks permissions ❌
- **500 Internal Server Error** → Mercado Pago service issue ⚠️

---

## Code Review: What We're Sending

Our request body (see `src/lib/services/payments.ts:329-351`):

```typescript
const requestBody = {
  transaction_amount: 50,              // Amount in BRL
  description: "Casamento Hel & Ylana - Gift Name",
  payment_method_id: "pix",            // PIX payment
  payer: {
    email: "guest@email.com",
    first_name: "Guest",
    last_name: "Name"
  },
  external_reference: "payment-uuid",  // Our internal payment ID
  notification_url: "https://site.com/api/webhooks/mercado-pago", // Only if HTTPS
  metadata: {
    payment_id: "uuid",
    gift_name: "Gift Name",
    buyer_name: "Full Name",
    wedding_couple: "Hel & Ylana",
    wedding_date: "2025-11-20"
  }
}
```

**This format is correct** according to Mercado Pago docs.

---

## Environment Variables Required in Production

```env
# Required
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxx  # MUST be production token

# For webhooks
NEXT_PUBLIC_SITE_URL=https://thousanddaysoflove.com  # MUST be HTTPS

# Optional
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxx
MERCADO_PAGO_WEBHOOK_SECRET=your-secret
```

---

## Next Steps

1. **Verify token type** (most likely cause):
   - Check production env vars
   - Ensure using `APP_USR-` token, not `TEST-` token

2. **Test token with curl** (see command above):
   - If 401/403: Token is wrong
   - If 500: Mercado Pago service issue

3. **Check Mercado Pago dashboard**:
   - Verify account fully activated
   - Check PIX is enabled
   - No warnings or restrictions

4. **Try again**:
   - If 500 error persists, wait 10-15 minutes
   - Mercado Pago may be experiencing temporary issues

5. **Contact Mercado Pago support** if error persists:
   - Provide error message: "http is unavailable for request create_ti"
   - Provide timestamp: 2025-10-16T12:27:09.781Z
   - Request investigation of their API service

---

## Monitoring

Add this to production logs to help debug:

```typescript
// In src/lib/services/payments.ts:367
console.error('Mercado Pago API error:', {
  status: response.status,
  statusText: response.statusText,
  error: errorData,
  timestamp: new Date().toISOString(),
  tokenPrefix: accessToken?.substring(0, 10), // Don't log full token!
  hasNotificationUrl: !!requestBody.notification_url,
  notificationUrl: requestBody.notification_url
})
```

---

## Summary

**Most Likely Cause**: Wrong token type (TEST token in production)
**Second Most Likely**: Mercado Pago temporary service outage
**Least Likely**: Our code (tests pass, local dev works perfectly)

**Action Plan**:
1. Check production token type immediately
2. Test token with curl
3. Wait 15 minutes and try again if 500 persists
4. Contact Mercado Pago support if issue continues
