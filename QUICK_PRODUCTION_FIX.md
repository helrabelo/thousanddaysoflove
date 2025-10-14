# ⚡ Quick Production Fix (Most Common Scenario)

## TL;DR - Just Reset Production

**If your wedding is still months away and you don't have critical data:**

### 1-Minute Fix:

```bash
# 1. Test locally first
npm run db:reset && npm run dev

# 2. Create production backup
# Go to: Supabase Dashboard → Database → Backups → Create Backup

# 3. Reset production database
# Go to: Supabase Dashboard → Settings → Database → Reset Database → Confirm

# 4. Done! Your production now has all the fixed migrations
```

That's it! Your production database is now clean with all fixes applied.

---

## Verification Steps

After reset, check these pages work:

1. **Analytics**: https://your-domain.com/admin/analytics
2. **Guests**: https://your-domain.com/admin/guests
3. **Invitations**: https://your-domain.com/convite/FAMILY001
4. **Gallery**: https://your-domain.com/galeria
5. **Messages**: https://your-domain.com/mensagens

All should load without errors ✅

---

## When NOT to Use This Approach

⚠️ **Don't reset if:**
- You have real guest RSVPs you can't lose
- You have uploaded photos from guests
- Wedding is less than 2 weeks away
- You have payment transactions

**Instead:** Use **Option B or C** in `PRODUCTION_FIX_GUIDE.md`

---

## Need the Detailed Guide?

See `PRODUCTION_FIX_GUIDE.md` for:
- Manual cleanup SQL (if you have data)
- Hybrid approach (export/reset/import)
- Emergency rollback procedures
- Safety checklists

---

**Most cases:** Just reset production. It's the fastest and cleanest solution! 🚀
