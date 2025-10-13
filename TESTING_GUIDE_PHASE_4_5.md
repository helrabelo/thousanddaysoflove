# Testing Guide - Phases 4 & 5

## Quick Start
```bash
cd /Users/helrabelo/code/personal/thousanddaysoflove
npm run dev
```

Dev server will start on **http://localhost:3000** (or next available port)

---

## Phase 4: Admin Invitation Management

### 1. Access Admin Panel
**URL**: http://localhost:3000/admin/convites
**Login**: Use admin password from `.env.local` (`ADMIN_PASSWORD`)

### 2. Test Analytics Dashboard
- ✅ Verify 4 stat cards show correct counts
- ✅ Check open rate, RSVP rate, gift rate, photo rate percentages
- ✅ Observe gradient color schemes (purple, green, blue, pink)

### 3. Test Search & Filters
- ✅ Search by guest name (try: "João", "Maria")
- ✅ Search by email
- ✅ Search by invitation code (try: "FAMILY001")
- ✅ Click filter buttons: All / Opened / RSVP / Presentes
- ✅ Verify filtered count updates

### 4. Test Create Invitation Modal
- ✅ Click "Novo Convite" button
- ✅ Fill in guest name (required field)
- ✅ Select relationship type (family/friend/colleague/other)
- ✅ Watch code preview update automatically (e.g., FAMILY042, FRIEND019)
- ✅ Check/uncheck "Permitir acompanhante"
- ✅ Add plus one name (if allowed)
- ✅ Add custom message
- ✅ Add table number and dietary restrictions
- ✅ Click "Criar Convite"
- ✅ Verify success message and table refresh

### 5. Test Edit Invitation Modal
- ✅ Click edit icon (pencil) on any invitation row
- ✅ Verify form pre-populates with existing data
- ✅ Change guest name
- ✅ Toggle plus one checkbox
- ✅ Update custom message
- ✅ Check "Última atualização" timestamp
- ✅ Click "Salvar Alterações"
- ✅ Verify changes appear in table

### 6. Test Detail View Modal
- ✅ Click eye icon on any invitation row
- ✅ Verify all sections display:
  - Guest Information card (purple gradient)
  - Plus One Information (blue gradient, if applicable)
  - Additional Details (custom message, table, restrictions)
  - Progress card (green gradient with completion %)
  - Tracking stats (first open, open count, created date)
  - QR code preview
- ✅ Click "Baixar" to download QR code
- ✅ Click "Copiar Link" to copy invitation URL
- ✅ Click "Abrir Convite" to open in new tab
- ✅ Click "Editar" to switch to edit modal

### 7. Test Table Actions
- ✅ Click copy icon to copy invitation link
- ✅ Click QR code icon to download QR code
- ✅ Click delete icon and confirm deletion
- ✅ Verify row disappears and analytics update

### 8. Test CSV Export
- ✅ Click "Exportar CSV" button
- ✅ Verify CSV file downloads with today's date
- ✅ Open CSV and check all invitation data

### 9. Test Animations
- ✅ Observe staggered row entrance animations
- ✅ Check modal fade and scale animations
- ✅ Hover over action buttons for scale effects

---

## Phase 5: Live Wedding Day Feed

### 1. Access Live Feed
**URL**: http://localhost:3000/ao-vivo

### 2. Test Hero Section
- ✅ Observe animated sparkles rotating
- ✅ Check gradient background (purple → pink → red)
- ✅ Verify connection status indicator (green dot pulsing)
- ✅ See "Ao Vivo" or "Atualizando..." status

### 3. Test Live Statistics
- ✅ Verify 4 stat cards display:
  - Mensagens Hoje (purple)
  - Fotos Enviadas (pink)
  - Convidados (blue)
  - Reações (red)
- ✅ Check animated number transitions
- ✅ Verify "Atividade Recente" feed shows last 10 actions
- ✅ Check activity icons match types (post/photo/reaction/comment)

### 4. Test Pinned Special Moments
**Note**: Only appears if posts are pinned via `/admin/posts`
- ✅ Observe shimmer effect animation
- ✅ See star badge on pinned posts
- ✅ Check gradient border (yellow to pink)
- ✅ Verify larger card size than regular posts

### 5. Test Live Post Stream
- ✅ Scroll through approved posts
- ✅ Check post display: avatar, name, timestamp, content
- ✅ See media preview grid (2x2 for 4 images)
- ✅ Verify engagement counts (hearts, comments)
- ✅ Test scroll detection (scroll away from top)
- ✅ Look for "Novas mensagens disponíveis" banner
- ✅ Click banner to scroll to top

### 6. Test Real-Time Updates
**Setup**: Open `/admin/posts` in another tab
- ✅ Approve a pending post in admin
- ✅ Watch it appear in live feed within 2 seconds
- ✅ Verify smooth entrance animation
- ✅ Check connection status stays "Ao Vivo"

### 7. Test Confirmed Guests Grid
- ✅ See avatar circles with first letter initials
- ✅ Check color coding by relationship type:
  - Purple = Family
  - Blue = Friends
  - Green = Colleagues
  - Gray = Other
- ✅ Hover over avatars to see tooltip with full name
- ✅ Look for plus one indicator (UserPlus icon)
- ✅ Click filter buttons: Todos / Família / Amigos / Colegas
- ✅ Verify grid updates with filter

### 8. Test Live Photo Gallery
- ✅ Watch slideshow auto-advance every 5 seconds
- ✅ Click pause button to stop auto-play
- ✅ Use prev/next arrows for manual navigation
- ✅ Click thumbnail strip to jump to specific photo
- ✅ Click main image to open fullscreen mode
- ✅ In fullscreen: use arrows, ESC to close
- ✅ Verify guest attribution overlay

### 9. Test Call-to-Action Section
- ✅ Click "Enviar Mensagem" → navigates to `/mensagens`
- ✅ Click "Enviar Fotos" → navigates to `/dia-1000/upload`
- ✅ Check button hover scale effects

### 10. Test Mobile Responsiveness
- ✅ Resize browser to mobile width (< 768px)
- ✅ Verify two-column layout becomes single column
- ✅ Check stats stack vertically
- ✅ Verify guests grid adjusts columns (fewer on mobile)
- ✅ Test slideshow on mobile (swipe gestures)

### 11. Test Performance
- ✅ Open dev tools Network tab
- ✅ Watch for WebSocket connection (wss://)
- ✅ Monitor real-time message traffic
- ✅ Verify no console errors
- ✅ Check smooth 60fps animations

---

## Integration Testing

### Test Workflow: Guest Journey
1. **Admin creates invitation** → `/admin/convites`
2. **Guest opens invitation** → `/convite/[CODE]`
3. **Guest posts message** → `/mensagens`
4. **Admin moderates post** → `/admin/posts`
5. **Post appears live** → `/ao-vivo` (real-time!)

### Test Workflow: Admin Moderation
1. **Open live feed** → `/ao-vivo` (keep this open)
2. **Open admin posts** → `/admin/posts` (in another tab)
3. **Approve a post** → Click "A" or Approve button
4. **Watch live feed** → Post appears within 2 seconds!
5. **Pin the post** → Click star icon in admin
6. **Watch live feed** → Post moves to "Momentos Especiais"

---

## Sample Test Data

The database already has these invitations (from previous sessions):
- **FAMILY001** - João Silva (family, plus one)
- **FRIEND002** - Maria Santos (friend, plus one)
- **FRIEND003** - Pedro Costa (friend, no plus one)
- **WORK004** - Ana Oliveira (colleague, no plus one)

**Test with these codes**:
- http://localhost:3000/convite/FAMILY001
- http://localhost:3000/convite/FRIEND002

---

## Common Issues & Solutions

### Issue: "Export doesn't exist"
**Solution**: Clear `.next` cache and restart dev server
```bash
rm -rf .next
npm run dev
```

### Issue: Real-time not working
**Solution**: Check Supabase connection
- Verify `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check browser console for WebSocket errors
- Try refreshing the page

### Issue: QR code not generating
**Solution**: Check qrcode library
```bash
npm list qrcode
# Should show: qrcode@1.5.3
```

### Issue: Animations choppy
**Solution**: Check Framer Motion
```bash
npm list framer-motion
# Should show: framer-motion@11.x.x
```

---

## What to Look For

### ✅ Good Signs
- Modal animations are smooth
- QR codes generate instantly
- Real-time updates appear within 2 seconds
- No console errors
- Stats update automatically
- Hover effects work
- Mobile layout adjusts properly

### ⚠️ Red Flags
- Console errors (TypeScript/import errors)
- Modals don't open/close
- Real-time updates take > 5 seconds
- QR codes show "undefined"
- Stats show 0 when data exists
- Animations stutter/freeze
- Layout breaks on mobile

---

## Performance Benchmarks

**Admin Panel** (`/admin/convites`):
- Initial load: < 2s
- Modal open: < 100ms
- QR generation: < 500ms
- CSV export: < 2s (100 invitations)

**Live Feed** (`/ao-vivo`):
- Initial load: < 3s
- Real-time latency: < 2s
- Slideshow advance: Smooth 60fps
- Scroll performance: Smooth 60fps

---

## Next Steps After Testing

If everything works:
1. ✅ Test on mobile device (not just browser resize)
2. ✅ Test on different browsers (Chrome, Safari, Firefox)
3. ✅ Load test with multiple browser tabs open
4. ✅ Verify real-time with 2+ concurrent users
5. ✅ Consider Phase 6: Guest Dashboard (`/meu-convite`)

If issues found:
1. 🐛 Document the bug with screenshots
2. 🐛 Check browser console for errors
3. 🐛 Test in incognito mode (clear cache)
4. 🐛 Provide error messages to debug

---

## Support

**Documentation**:
- Full roadmap: `/docs/GUEST_EXPERIENCE_ROADMAP.md`
- Session prompt: `SESSION_PROMPT_PHASES_4_5_6.md`
- Project docs: `CLAUDE.md`

**Key Files**:
- Admin modals: `src/app/admin/convites/page.tsx` (lines 660-1644)
- Live service: `src/lib/supabase/live.ts` (520 lines)
- Live components: `src/components/live/*.tsx`

Enjoy testing! 🎉
