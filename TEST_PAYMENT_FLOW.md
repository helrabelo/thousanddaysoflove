# Test Payment Flow - Debugging Guide

**Date**: 2025-10-16
**Status**: Logging Added - Ready for Testing

## Changes Made

### 1. Comprehensive Logging Added ✅

**File**: `src/lib/services/payments.ts`
- ✅ Added step-by-step logging (1/4, 2/4, 3/4, 4/4) in `createPixPayment()`
- ✅ Log payment record creation with internal ID
- ✅ Log Mercado Pago API response with full details
- ✅ Log payment ID type (number vs string)
- ✅ Log database update result with verification
- ✅ Warning if Mercado Pago ID is not saved

**File**: `src/app/api/payments/status/route.ts`
- ✅ Added logging for status check requests
- ✅ Log payment found in database with Mercado Pago ID
- ✅ Log Mercado Pago status check
- ✅ Error logging when payment not found

**File**: `src/lib/services/payments.ts` (processMercadoPagoPayment)
- ✅ Full Mercado Pago API response logging
- ✅ QR code existence verification

### 2. Payment ID Type Handling ✅

**Fixed**: Convert Mercado Pago payment ID to string explicitly
```typescript
const mercadoPagoIdString = String(mercadoPagoResult.id)
```

This ensures both number and string IDs from Mercado Pago are handled correctly.

### 3. Database Update Verification ✅

**Added**: Verification that Mercado Pago ID is saved
```typescript
if (!updatedPayment?.mercado_pago_payment_id) {
  console.error('⚠️ WARNING: Mercado Pago ID was NOT saved to database!')
}
```

## Testing Instructions

### Prerequisites
1. ✅ Production Mercado Pago keys configured in `.env.local`
2. ✅ Supabase connection configured
3. ✅ At least one test gift in Sanity CMS
4. ✅ Dev server running: `npm run dev`

### Test Case 1: PIX Payment Creation

**Objective**: Verify payment creation succeeds and Mercado Pago ID is saved

**Steps**:
1. Open browser developer console (F12)
2. Navigate to `/presentes` page
3. Select a gift and click "Contribute with PIX"
4. Fill in form:
   - Name: Test User
   - Email: test@test.com
   - Amount: R$ 50 (or min amount)
5. Click "Gerar PIX"

**Expected Console Output**:
```
🎯 [1/4] Creating payment record in database...
✅ [1/4] Payment record created: {internalId: "...", amount: 50, status: "pending"}
🎯 [2/4] Calling Mercado Pago API...
🔍 Full Mercado Pago API response: {id: 123456789, idType: "number", status: "pending", ...}
✅ [2/4] Mercado Pago response received: {mercadoPagoId: 123456789, ...}
🎯 [3/4] Updating payment with Mercado Pago ID...
✅ [3/4] Payment updated with Mercado Pago ID: {internalId: "...", mercadoPagoIdSaved: "123456789", idMatches: true}
✅ [4/4] Payment creation complete. Returning QR code data.
```

**Red Flags** (what to look for):
- ❌ `⚠️ WARNING: No Mercado Pago ID in response!`
- ❌ `⚠️ WARNING: Mercado Pago ID was NOT saved to database!`
- ❌ `idMatches: false` in step 3/4
- ❌ Any error messages

### Test Case 2: Payment Status Polling

**Objective**: Verify status polling can find the payment and check Mercado Pago

**Steps**:
1. After creating payment (Test Case 1), watch the console for polling requests
2. Should automatically poll every 5 seconds

**Expected Console Output** (every 5 seconds):
```
🔍 Status check requested: {paymentId: "...", mercadoPagoId: null}
📋 Payment found in database: {id: "...", status: "pending", mercadoPagoId: "123456789", hasMercadoPagoId: true}
🎯 Checking Mercado Pago status for ID: 123456789
✅ Mercado Pago status received: {id: 123456789, status: "pending", statusDetail: "pending_waiting_transfer"}
✅ Status check complete. Returning payment data.
```

**Red Flags**:
- ❌ `❌ Payment not found in database`
- ❌ `hasMercadoPagoId: false`
- ❌ Error from Mercado Pago API (404, 401, etc.)
- ❌ `mercadoPagoId: null` in database

### Test Case 3: Database Verification

**Objective**: Manually verify payment record in database

**SQL Query**:
```sql
SELECT
  id,
  sanity_gift_id,
  amount,
  status,
  payment_method,
  mercado_pago_payment_id,
  created_at,
  updated_at
FROM payments
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result**:
- `mercado_pago_payment_id` should NOT be NULL
- `status` should be 'pending'
- `payment_method` should be 'pix'

## Common Issues & Solutions

### Issue 1: Mercado Pago ID Not Saved

**Symptoms**:
```
⚠️ WARNING: Mercado Pago ID was NOT saved to database!
```

**Possible Causes**:
1. RLS policy blocking admin client update
2. Database connection issue
3. Constraint violation

**Solution**:
Check `updatePaymentStatus` error logs for Supabase error details

### Issue 2: Payment Not Found During Polling

**Symptoms**:
```
❌ Payment not found in database: {paymentId: "...", mercadoPagoId: null}
```

**Possible Causes**:
1. Frontend passing wrong payment ID
2. Payment wasn't created successfully
3. RLS policy blocking read access

**Solution**:
1. Verify payment ID in step 1/4 matches polling request
2. Check if payment exists in database (Test Case 3)

### Issue 3: Mercado Pago API 404

**Symptoms**:
```
Mercado Pago API error: 404
```

**Possible Causes**:
1. Using test keys with production payment ID (or vice versa)
2. Payment ID format incorrect
3. Payment doesn't exist in Mercado Pago

**Solution**:
1. Verify production keys are being used: `echo $MERCADO_PAGO_ACCESS_TOKEN | grep APP_USR`
2. Check Mercado Pago dashboard for payment
3. Try using Mercado Pago's test payment ID for testing

## Next Steps After Testing

Based on console logs, identify which step is failing:

### If Step 1/4 Fails (Payment Creation)
- Check Supabase connection
- Verify `sanity_gift_id` exists
- Check RLS policies on `payments` table

### If Step 2/4 Fails (Mercado Pago API)
- Verify `MERCADO_PAGO_ACCESS_TOKEN` is correct
- Check Mercado Pago account status
- Try with test keys first
- Verify PIX is enabled in your Mercado Pago account

### If Step 3/4 Fails (Database Update)
- Check admin client has proper permissions
- Verify RLS policies allow UPDATE with admin role
- Check database constraints

### If Step 4/4 Succeeds But Polling Fails
- Frontend may be using wrong payment ID format
- Check `PaymentModal.tsx` line 52 polling URL
- Verify payment ID in database matches frontend ID

## Production Testing Checklist

Before deploying to production:
- [ ] Test with R$ 1.00 payment (minimum amount)
- [ ] Verify QR code displays correctly
- [ ] Confirm copy PIX code works
- [ ] Test payment status polling (wait 5-10 seconds)
- [ ] Check webhook receives updates (if configured)
- [ ] Verify email notifications (if configured)
- [ ] Test on mobile device
- [ ] Check payment appears in admin dashboard

## Reference Documents

- **Full analysis**: `NEXT_SESSION_FIX_PAYMENTS.md`
- **Mercado Pago docs**: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix
- **API reference**: https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post

---

**Last Updated**: 2025-10-16
**Status**: Ready for testing with comprehensive logging
