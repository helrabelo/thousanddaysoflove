# 🎯 RUN THIS NOW - Clean Database Reset

## Your Situation

Your migrations have been **partially run** with the old broken files. The cleanest solution is to **reset and run fresh**.

---

## Option 1: Clean Reset (Recommended) ⭐

This gives you a fresh start with all the fixed migrations:

```bash
# 1. Backup your current data (if you have important data)
supabase db dump -f backup-before-reset-$(date +%Y%m%d).sql

# 2. Reset database to clean state
npm run db:reset

# 3. Test your app
npm run dev

# 4. Verify everything works
open http://localhost:3000/admin/analytics
```

**This will:**
- Drop all tables
- Run ALL migrations in the correct order (001-030 + timestamp migrations)
- Give you a clean, working database

---

## Option 2: Continue with Fixes (If You Have Important Data)

If you have data you can't lose, the migration 023 is now fixed to handle existing policies:

```bash
# Just run migrations
supabase migration up

# Test
npm run dev
```

**Note:** You might still hit other conflicts if old migrations partially ran. If you see errors, go with Option 1.

---

## What You'll Get After Reset

### Clean Migration Order:
```
001-022: Foundation tables
023: Auth config + sessions (FIXED - drops policies before creating)
024-027: Guest posts + fixes
028: Drop old guest system tables
029: Drop old messaging tables
030: Drop old config tables
20251013061016: Interactive features (photos, messages)
20251013100000: Helper functions
20251014000000: Invitation codes
```

### Active Tables (After Cleanup):
✅ simple_guests, invitations, guest_sessions
✅ guest_photos, guest_posts, post_reactions, post_comments, pinned_posts
✅ gifts, payments, wedding_settings, wedding_auth_config
✅ activity_feed

### Removed Tables:
❌ guests, family_groups, invitation_codes, email_logs, rsvp_analytics
❌ guest_messages, message_likes, moderation_queue
❌ wedding_config, timeline_events, media_items, about_us_items, etc.

---

## Quick Command

```bash
# Fresh start (recommended)
npm run db:reset && npm run dev
```

That's it! Your database will be clean and working.

---

## Success Checklist

After reset, verify:
- [ ] No errors in migration output
- [ ] `/admin/analytics` loads
- [ ] `/admin/guests` shows guest list
- [ ] `/convite/FAMILY001` works
- [ ] `/mensagens` loads
- [ ] `/galeria` loads

---

**My Recommendation:** Go with Option 1 (clean reset). It's faster and guarantees no hidden conflicts.
