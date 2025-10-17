# Test Gift Setup Guide - PIX Payment Testing
**For:** Thousand Days of Love Payment System Validation

---

## Overview

Before testing PIX payments, we need **4 test gifts** in Sanity CMS that cover all scenarios:
1. High-value gift with partial payment enabled
2. Mid-value gift with full payment only
3. Low-value gift with partial payment enabled
4. High-priority gift for priority testing

---

## Step 1: Open Sanity Studio

```bash
# Make sure dev server is running
npm run dev

# Open Sanity Studio in browser
open http://localhost:3000/studio
```

**Navigate to:** Content → Presente (Gift Registry)

---

## Step 2: Check Existing Gifts

**Before creating new gifts, check:**
1. How many gifts already exist?
2. Do any have `allowPartialPayment: true`?
3. Are there gifts at different price points?
4. Are all gifts marked as `isActive: true`?

**If you already have 4+ diverse gifts, you can skip to Step 4 (Testing).**

---

## Step 3: Create Test Gifts

### Test Gift #1: High-Value Partial Payment
**Purpose:** Test Scenario 2 (multiple contributors)

```
Nome do Presente: Geladeira Brastemp Frost Free
Descrição: Geladeira moderna com frost free, ideal para nossa família de 6 (incluindo os 4 cachorros barulhentos). Vai guardar toda a comida dos dogs e nossa também!
Preço Total (R$): 3000
Categoria: Eletrônicos
Permitir Pagamento Parcial: ✅ TRUE
Contribuições Sugeridas: [500, 1000, 1500]
Permitir Valor Personalizado: ✅ TRUE
Prioridade: ⭐⭐⭐ Alta (muito importante)
Ativo na Lista: ✅ TRUE
Link da Loja: https://www.brastemp.com.br/geladeira-frost-free
```

**Upload a test image:**
- Use any refrigerator image from Google
- Or use a placeholder from https://via.placeholder.com/400x300.png?text=Geladeira

---

### Test Gift #2: Mid-Value Full Payment Only
**Purpose:** Test Scenario 1 (single full payment)

```
Nome do Presente: Jogo de Panelas Tramontina 10 Peças
Descrição: Jogo completo de panelas antiaderente para fazer comida gostosa. Perfeito para o apê que o Hel passava de bicicleta sonhando e agora é nosso!
Preço Total (R$): 800
Categoria: Cozinha
Permitir Pagamento Parcial: ❌ FALSE
Prioridade: ⭐⭐ Média (gostaríamos de ter)
Ativo na Lista: ✅ TRUE
Link da Loja: https://www.tramontina.com.br/panelas
```

---

### Test Gift #3: Low-Value Partial Payment
**Purpose:** Test edge cases with minimum amount (R$50)

```
Nome do Presente: Kit Potes de Vidro Para Mantimentos
Descrição: Conjunto de potes de vidro para organizar a despensa. Linda 👑, Cacau 🍫, Olivia 🌸 e Oliver ⚡ agradecem pela organização da ração deles!
Preço Total (R$): 200
Categoria: Cozinha
Permitir Pagamento Parcial: ✅ TRUE
Contribuições Sugeridas: [50, 100, 150]
Permitir Valor Personalizado: ✅ TRUE
Prioridade: ⭐ Baixa (seria legal)
Ativo na Lista: ✅ TRUE
```

---

### Test Gift #4: Honeymoon Contribution
**Purpose:** Test high-priority, high-value gift

```
Nome do Presente: Contribuição para Lua de Mel em Fernando de Noronha
Descrição: Ajude a gente a conhecer um dos lugares mais lindos do Brasil! Vamos comemorar 1000 dias juntos e o apartamento próprio depois de anos trabalhando.
Preço Total (R$): 5000
Categoria: Lua de Mel
Permitir Pagamento Parcial: ✅ TRUE
Contribuições Sugeridas: [200, 500, 1000, 2000]
Permitir Valor Personalizado: ✅ TRUE
Prioridade: ⭐⭐⭐ Alta (muito importante)
Ativo na Lista: ✅ TRUE
```

---

## Step 4: Verify Gifts Appear on Website

1. Save all gifts in Sanity Studio
2. Navigate to: http://localhost:3000/presentes
3. Verify all 4 gifts appear in the grid
4. Check that:
   - Images load correctly
   - Prices display properly (R$ formatting)
   - Categories show correct labels
   - Priority stars visible
   - "Permitir Pagamento Parcial" badge shows on partial gifts

**Expected view:**
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│  Geladeira      │  Jogo Panelas   │  Kit Potes      │  Lua de Mel     │
│  R$ 3.000       │  R$ 800         │  R$ 200         │  R$ 5.000       │
│  ⭐⭐⭐           │  ⭐⭐            │  ⭐              │  ⭐⭐⭐           │
│  Parcial ✓      │  Valor Total    │  Parcial ✓      │  Parcial ✓      │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## Step 5: Ready for PIX Testing! 🎉

Once gifts are visible on http://localhost:3000/presentes, you're ready to:

### Test Scenario 1: Full Payment (Jogo de Panelas)
1. Click "Presentear" on **Jogo de Panelas (R$800)**
2. Fill form:
   - Nome: "João Silva Teste"
   - Email: "joao.teste@example.com"
   - Valor: R$800 (default, don't change)
   - Mensagem: "Felicidades Hel & Ylana! 🎉"
3. Click "Gerar PIX"
4. QR code appears
5. Use Mercado Pago **SANDBOX** app to scan
6. Complete test payment
7. Wait ~10-20 seconds for status polling
8. Success modal appears ✅

**Verify in Supabase Studio:**
```sql
SELECT * FROM payments
WHERE sanity_gift_id = 'giftItem-xxxxx'  -- Copy _id from Sanity
ORDER BY created_at DESC;
```

---

### Test Scenario 2: Partial Payments (Geladeira)
**First Contributor:**
1. Click "Presentear" on **Geladeira (R$3000)**
2. Fill form:
   - Nome: "Maria Santos"
   - Email: "maria@example.com"
   - Valor: **R$1000** (change from default)
   - Mensagem: "Primeira parte do presente!"
3. Generate PIX and complete payment
4. Verify gift card shows:
   - Progress bar: 33% (1000/3000)
   - "Faltam R$2000" badge
   - NOT marked as fully funded

**Second Contributor:**
5. Refresh page (Ctrl/Cmd + R)
6. Click same gift again
7. Fill form:
   - Nome: "Pedro Costa"
   - Email: "pedro@example.com"
   - Valor: **R$2000** (complete remaining)
8. Complete PIX payment
9. Verify gift card shows:
   - Progress bar: 100%
   - "Totalmente Conquistado!" badge
   - Marked as fully funded ✅

**Verify in Supabase:**
```sql
SELECT * FROM gift_contributions
WHERE sanity_gift_id = 'giftItem-xxxxx';

-- Should show:
-- total_contributed: 3000
-- contribution_count: 2
-- contributors: [array with 2 objects]
```

---

### Test Scenario 3: Minimum Amount (Kit Potes)
1. Click "Presentear" on **Kit Potes (R$200)**
2. Try amount: **R$25** (below minimum)
3. Verify error: "Valor mínimo de contribuição é R$50,00" ❌
4. Change to: **R$50** (minimum)
5. Should work correctly ✅

---

### Test Scenario 4: Over-Contribution Warning (Kit Potes)
1. Click "Presentear" on **Kit Potes (R$200)**
2. Try amount: **R$500** (2.5x price)
3. Verify error: "Valor muito acima do necessário" ❌
4. Try amount: **R$300** (1.5x price - at limit)
5. Should work correctly ✅

---

## Step 6: Document Results

**Create screenshots of:**
1. ✅ Gifts page showing all 4 gifts
2. ✅ PaymentModal with QR code
3. ✅ Success modal after payment
4. ✅ Gift card showing progress bar
5. ✅ Supabase Studio with payment records

**Save to:** `test-results/pix-payment-testing-YYYY-MM-DD/`

---

## Step 7: Database Cleanup (Optional)

After testing, you may want to clean up test payments:

```sql
-- View all test payments
SELECT
  p.id,
  p.sanity_gift_id,
  p.amount,
  p.status,
  p.created_at
FROM payments p
WHERE p.created_at > NOW() - INTERVAL '1 hour'
ORDER BY p.created_at DESC;

-- Delete test payments (if needed)
-- WARNING: This will affect contribution totals!
DELETE FROM payments
WHERE created_at > NOW() - INTERVAL '1 hour'
AND status = 'pending';  -- Only delete pending, keep completed for history
```

---

## Troubleshooting

### Issue: Gifts don't appear on /presentes
**Check:**
- [ ] All gifts have `isActive: true` in Sanity
- [ ] Images are uploaded and published
- [ ] Browser cache cleared (Ctrl/Cmd + Shift + R)
- [ ] Sanity Studio shows "Published" status (not "Edited")

### Issue: QR code doesn't generate
**Check:**
- [ ] `MERCADO_PAGO_ACCESS_TOKEN` set in `.env.local`
- [ ] Token is valid (not expired)
- [ ] Using sandbox/test token (not production)
- [ ] Check browser console for errors

### Issue: Payment status never updates
**Check:**
- [ ] Status polling is running (see network tab every 5 seconds)
- [ ] Mercado Pago payment completed in sandbox app
- [ ] Check `/api/payments/status` endpoint returns data
- [ ] Verify `mercado_pago_payment_id` in database

### Issue: Contribution progress not updating
**Check:**
- [ ] Payment status = 'completed' (not 'pending')
- [ ] `sanity_gift_id` matches Sanity document `_id`
- [ ] Refresh page to reload gift data
- [ ] Check `gift_contributions` view in Supabase

---

## Success Criteria ✅

**PIX testing is complete when:**
- [x] All 4 test gifts visible on /presentes
- [x] Scenario 1: Full payment R$800 → Success
- [x] Scenario 2: Partial payments (R$1000 + R$2000) → 100% funded
- [x] Edge case: Minimum R$50 validation works
- [x] Edge case: Over-contribution (1.5x) limit works
- [x] Database shows all payments with correct `sanity_gift_id`
- [x] `gift_contributions` view aggregates correctly
- [x] Screenshots captured for documentation

---

## Next: Credit Card Implementation

Once PIX testing is ✅ complete, we'll move to implementing credit card payments:

1. **Payment Method Selector** in PaymentModal
2. **CreditCardForm** component (card number, CVV, expiry, installments)
3. **Mercado Pago Card Tokenization** (SDK integration)
4. **API Route:** `/api/payments/create-credit-card`
5. **Service Method:** `PaymentService.createCreditCardPayment()`
6. **Test Scenarios 3 & 4** with credit cards

**Estimated time:** 2-3 days for complete implementation + testing

---

**Ready to start?** Let me know when gifts are added to Sanity and I'll guide you through the PIX testing step-by-step! 🚀
