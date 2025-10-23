# Payment Configuration

## Minimum Payment Amount Feature Flag

The minimum payment amount can be configured via environment variable to support different testing and production scenarios.

### Environment Variable

```bash
NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=50
```

### Usage

#### Production Environment (Default)
```bash
# .env.production or .env.local
NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=50
```
- Enforces R$50 minimum for all payments
- Recommended for production to avoid small test payments

#### Testing Environment
```bash
# .env.local (for local testing)
NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=1
```
- Allows R$1 minimum payments
- Perfect for testing Mercado Pago integration without spending R$50 each time

### How It Works

The configuration is centralized in `src/lib/config/payments.ts`:

```typescript
export const MIN_PAYMENT_AMOUNT = parseInt(
  process.env.NEXT_PUBLIC_MIN_PAYMENT_AMOUNT || '50',
  10
)
```

This value is used across:
- ✅ **PaymentModal** - Frontend validation and UI
- ✅ **Credit Card Form** - Payment validation
- ✅ **Input fields** - HTML min attribute
- ✅ **Error messages** - Dynamic minimum amount text
- ✅ **Gift Filtering** - Hides gifts below minimum from frontend display

### Quick Switch Guide

**To test with R$1 payments:**
1. Add to your `.env.local`: `NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=1`
2. Restart dev server: `npm run dev`
3. Run test gift script: `npx tsx scripts/create-test-gifts.ts` (creates R$1, R$2, R$5 gifts)
4. Test payment flow with minimal cost

**Test Gifts Available:**
- Run `npx tsx scripts/create-test-gifts.ts` to create 3 test gifts:
  - [TESTE] Café Pilão 500g - R$1 (PIX testing)
  - [TESTE] Pano de Prato - R$2 (Credit card testing)
  - [TESTE] Tigela Pequena - R$5 (Partial payment testing)

**To switch back to production:**
1. Change to: `NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=50`
2. Restart server
3. Or remove the variable entirely (defaults to 50)

### Important Notes

⚠️ **Production Safety**: The default is 50, so if you forget to set the env var in production, it will use the safer R$50 minimum.

💡 **Automatic Filtering**: Test gifts (< R$50) are automatically hidden from the frontend when `MIN_PAYMENT_AMOUNT=50`. This means you can safely have test gifts in Sanity CMS without them appearing in production.

📊 **How Filtering Works**:
- Local (NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=1): Shows all gifts including test gifts (R$1, R$2, R$5)
- Production (NEXT_PUBLIC_MIN_PAYMENT_AMOUNT=50): Only shows gifts R$50+ (test gifts hidden)

🔄 **Server Restart Required**: Changes to `NEXT_PUBLIC_*` variables require a server restart to take effect.

### Related Files

- `src/lib/config/payments.ts` - Configuration and helpers
- `src/lib/services/gifts.ts` - Gift filtering logic using MIN_PAYMENT_AMOUNT
- `src/components/payments/PaymentModal.tsx` - Uses MIN_PAYMENT_AMOUNT
- `scripts/create-test-gifts.ts` - Creates test gifts for payment testing
- `.env.local.example` - Environment variable template
- `src/sanity/schemas/documents/giftItem.ts` - CMS schema (references env var in description)
