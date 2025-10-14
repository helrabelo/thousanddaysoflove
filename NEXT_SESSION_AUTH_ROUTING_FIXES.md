# Authentication & Routing Consolidation - Next Session

## 🚨 Current Problems

### 1. **Confusing Duplicate Routes**
- `/convite` - Generic invitation page
- `/convite/[CODE]` - Personalized invitation with code
- `/meu-convite` - "My invitation" dashboard (requires separate login)
- **Problem**: Users don't know which route to use, creates confusion

### 2. **Inconsistent Authentication**
- `/meu-convite` login creates `guest_session_token` cookie ✅
- `/convite/[CODE]` auto-auth DOES NOT create cookie ❌
- `/dia-1000/login` creates cookie ✅
- **Problem**: Three different auth entry points with inconsistent behavior

### 3. **FAB Not Showing**
- Added FAB component to `/dia-1000` page
- Authentication check fails even when logged in
- **Problem**: `isAuthenticated` state remains `false` even after auth

### 4. **Multiple Login Pages**
- `/dia-1000/login` - Login for live feed
- `/meu-convite/login` - Login for invitation dashboard
- `/convite/[CODE]` - Should auto-authenticate but doesn't work
- **Problem**: Too many login flows, user confusion

## 🎯 Desired Solution

### Unified Route Structure

```
/convite/[CODE]          → Personalized invitation (AUTO-AUTH when visited)
                            - Sets guest_session_token cookie
                            - Shows invitation details
                            - Progress tracker
                            - Quick actions

/dia-1000                → Live feed (REQUIRES AUTH)
                            - Redirects to /convite/[CODE] if not authenticated
                            - Shows FAB for authenticated guests only
                            - Real-time posts, photos, celebrations

/mensagens               → Public message feed (OPTIONAL AUTH)
                            - Anonymous guests: name input → sessionStorage
                            - Authenticated guests: use existing session
                            - Posts require approval unless authenticated
```

### Routes to REMOVE/CONSOLIDATE

1. **DELETE `/meu-convite`** - Duplicate of `/convite/[CODE]`, causes confusion
2. **DELETE `/dia-1000/login`** - Use invitation code auth only
3. **KEEP `/convite/[CODE]`** - Primary auth entry point
4. **KEEP `/dia-1000/upload`** - But require auth from invitation

## 🔧 Implementation Tasks

### Task 1: Fix Auto-Authentication in `/convite/[CODE]`
**File**: `src/app/convite/[code]/page.tsx`

**Current Issue**: Auto-auth attempt doesn't create cookie
```typescript
// Lines 117-139 - This doesn't work properly
const authResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    authMethod: 'invitation_code',
    invitationCode: code,
  }),
});
```

**Fix Needed**:
1. Verify `/api/auth/login` returns `Set-Cookie` header with `guest_session_token`
2. Ensure `credentials: 'include'` works properly
3. Add console logs to debug cookie setting
4. Test cookie persists across page navigation

### Task 2: Redirect Unauthenticated Users from `/dia-1000`
**File**: `src/app/dia-1000/LiveFeedPage.tsx`

**Current**: Page loads without auth, FAB hidden
**Fix Needed**:
```typescript
useEffect(() => {
  checkAuthentication()
}, [])

const checkAuthentication = async () => {
  const response = await fetch('/api/auth/verify')

  if (!response.ok) {
    // Redirect to generic invitation page with message
    router.push('/convite?message=authentication_required')
    return
  }

  const data = await response.json()
  if (data.success && data.session) {
    setIsAuthenticated(true)
    setGuestName(data.session.guest?.name || 'Convidado')
  } else {
    router.push('/convite?message=authentication_required')
  }
}
```

### Task 3: Remove `/meu-convite` and `/dia-1000/login`
**Files to DELETE**:
- `src/app/meu-convite/page.tsx`
- `src/app/meu-convite/login/page.tsx`
- `src/app/dia-1000/login/page.tsx`

**Redirect Configuration** (`next.config.ts`):
```typescript
async redirects() {
  return [
    {
      source: '/meu-convite',
      destination: '/convite',
      permanent: true,
    },
    {
      source: '/dia-1000/login',
      destination: '/convite',
      permanent: true,
    },
  ]
}
```

### Task 4: Update Navigation Links
**Files to Update**:
- `src/components/ui/Navigation.tsx` - Remove `/meu-convite` link
- `src/app/convite/[code]/page.tsx` - Update quick action links
- `src/app/dia-1000/upload/page.tsx` - Update back links

**Quick Actions in `/convite/[CODE]`**:
```typescript
const QUICK_ACTIONS = [
  {
    icon: CheckCircle2,
    title: 'Confirmar Presença',
    description: 'Complete seu RSVP',
    href: '/rsvp',
  },
  {
    icon: Gift,
    title: 'Ver Presentes',
    description: 'Escolha um presente',
    href: '/presentes',
  },
  {
    icon: Camera,
    title: 'Feed Ao Vivo',
    description: 'Ver fotos e mensagens',
    href: '/dia-1000', // ← Redirects if not authenticated
  },
  {
    icon: MessageSquare,
    title: 'Enviar Mensagem',
    description: 'Deixe uma mensagem',
    href: '/mensagens',
  },
];
```

### Task 5: Fix FAB Visibility Logic
**File**: `src/app/dia-1000/LiveFeedPage.tsx` (lines 39-73)

**Current Problem**: Authentication check succeeds but `isAuthenticated` stays `false`

**Debug Steps**:
1. Add detailed console logging at each step
2. Verify `fetch('/api/auth/verify')` returns 200
3. Verify `data.success === true`
4. Verify `data.session.guest` exists
5. Check React state updates correctly

**Enhanced Logging**:
```typescript
const checkAuthentication = async () => {
  try {
    const sessionCookie = getGuestSessionCookie()
    console.log('🔍 [AUTH] Step 1: Cookie check', {
      exists: !!sessionCookie,
      value: sessionCookie?.substring(0, 20) + '...'
    })

    if (!sessionCookie) {
      console.log('❌ [AUTH] No session cookie found')
      setIsAuthenticated(false)
      return
    }

    console.log('🔍 [AUTH] Step 2: Calling /api/auth/verify')
    const response = await fetch('/api/auth/verify')

    console.log('🔍 [AUTH] Step 3: Response received', {
      ok: response.ok,
      status: response.status,
    })

    const data = await response.json()
    console.log('🔍 [AUTH] Step 4: Data parsed', {
      success: data.success,
      hasSession: !!data.session,
      hasGuest: !!data.session?.guest,
      guestName: data.session?.guest?.name,
    })

    if (response.ok && data.success && data.session?.guest) {
      console.log('✅ [AUTH] Authentication successful!', {
        guestName: data.session.guest.name,
        authMethod: data.session.auth_method,
      })
      setIsAuthenticated(true)
      setGuestName(data.session.guest.name || 'Convidado')
    } else {
      console.log('❌ [AUTH] Authentication failed', {
        error: data.error || 'Unknown error',
      })
      setIsAuthenticated(false)
    }
  } catch (error) {
    console.error('💥 [AUTH] Exception:', error)
    setIsAuthenticated(false)
  }
}
```

### Task 6: Test Authentication Flow End-to-End

**Test Sequence**:
```bash
# 1. Clear all cookies
# Browser DevTools → Application → Cookies → Clear All

# 2. Visit personalized invitation
http://localhost:3001/convite/FAMILY001

# Expected:
# - Console: "✅ Auto-authenticated with invitation code: FAMILY001"
# - Cookie: guest_session_token is SET
# - Page: Shows personalized invitation

# 3. Navigate to live feed
http://localhost:3001/dia-1000

# Expected:
# - Console: "✅ [AUTH] Authentication successful!"
# - Cookie: guest_session_token exists
# - Page: FAB visible in bottom-right
# - Page: Action buttons visible in sidebar

# 4. Click FAB
# Expected:
# - Menu opens with "Nova Mensagem" and "Enviar Mídia"
# - Clicking opens respective modals

# 5. Test modals
# Expected:
# - PostComposer opens with guest name pre-filled
# - MediaUpload opens with phase selection
# - Both can submit successfully
```

## 🎨 User Experience Flow

### Happy Path (Authenticated Guest)
```
User receives invitation link → /convite/FAMILY001
  ↓
Auto-authenticated (cookie set)
  ↓
Views personalized invitation with progress
  ↓
Clicks "Feed Ao Vivo" → /dia-1000
  ↓
Sees live feed with FAB + action buttons
  ↓
Can post messages/photos instantly (auto-approved)
```

### Anonymous Guest Path
```
User visits /mensagens directly
  ↓
Prompted for name (sessionStorage)
  ↓
Can post messages (requires approval)
  ↓
NO FAB, NO auto-approval
```

## 📝 Verification Checklist

After implementing fixes:

- [ ] `/convite/[CODE]` sets `guest_session_token` cookie
- [ ] Cookie persists when navigating to `/dia-1000`
- [ ] `/dia-1000` shows FAB for authenticated guests
- [ ] `/dia-1000` shows action buttons in sidebar
- [ ] FAB opens menu with 2 options
- [ ] Modals open and function correctly
- [ ] `/meu-convite` redirects to `/convite`
- [ ] `/dia-1000/login` redirects to `/convite`
- [ ] Unauthenticated users redirected from `/dia-1000`
- [ ] Anonymous guests can still use `/mensagens`
- [ ] Navigation updated (no broken links)
- [ ] All console logs working for debugging

## 🚀 Priority Order

1. **CRITICAL**: Fix `/convite/[CODE]` auto-authentication (cookie not setting)
2. **HIGH**: Add redirect from `/dia-1000` for unauthenticated users
3. **HIGH**: Fix FAB visibility logic with enhanced logging
4. **MEDIUM**: Remove `/meu-convite` and `/dia-1000/login` routes
5. **MEDIUM**: Update navigation and links
6. **LOW**: Add user-friendly error messages

## 💡 Additional Considerations

### Cookie Domain Issues
If cookies aren't persisting, check:
```typescript
// In /api/auth/login route.ts
response.cookies.set({
  name: GUEST_SESSION_COOKIE,
  value: result.session.session_token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // ← Try changing from 'strict' to 'lax'
  maxAge: expiresIn,
  path: '/',
})
```

### Browser Console Debugging
Enable verbose logging:
```typescript
// Add to LiveFeedPage.tsx useEffect
console.log('🎬 [LIFECYCLE] Component mounted')
console.log('🎬 [LIFECYCLE] Starting authentication check')

// After checkAuthentication
console.log('🎬 [LIFECYCLE] Authentication check complete', {
  isAuthenticated,
  guestName,
})
```

---

## Summary

**Root Cause**: Multiple authentication entry points with inconsistent cookie handling
**Solution**: Consolidate to single auth flow via `/convite/[CODE]` with proper cookie management
**Goal**: Seamless experience where invitation link = automatic authentication = full access
