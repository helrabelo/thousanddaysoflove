# DRY Improvements Roadmap
**Project**: Thousand Days of Love Wedding Website
**Analysis Date**: October 25, 2025
**Status**: ✅ **PHASE 1 & 2 COMPLETE** - 2/3 Critical Issues Resolved!

## Progress Summary

**Completed**: 3 of 3 critical priority issues ✅✅✅
- ✅ **Phase 1 Complete**: Gift messaging consolidation (-708 lines)
- ✅ **Phase 2 Complete**: Admin auth centralization (-60 lines, +140 utility)
- ✅ **Phase 3 Complete**: Moderation type centralization (+190 utility, -14 scattered)

**Total Impact**: ~782 lines eliminated, 3 single sources of truth established
**All Critical Issues Resolved!** 🎉

---

## Executive Summary

Comprehensive analysis identified **12 major DRY violations** across the codebase:
- **Critical**: Gift messaging duplication (✅ DONE), auth patterns (✅ DONE), scattered types (✅ DONE)
- **Medium**: Service layer CRUD patterns, moderation responses, error messages
- **Original Estimate**: ~40% reduction in gift messaging code, unified auth, single source of truth for types
- **Actual Results**: 65% reduction achieved, auth fully unified, moderation centralized

---

## Critical Priority Issues

### 1. Gift Messaging System Duplication ✅ COMPLETE

**Status**: ✅ **COMPLETED** - Phase 1 (October 25, 2025)
**Commit**: `d05fbb2` - refactor: consolidate gift messaging system and remove duplication

**Problem**: Two nearly identical implementations of gift contribution messaging

**Files**:
- `src/lib/utils/giftMessages.ts` (438 lines)
- `src/lib/utils/giftMessaging.ts` (230 lines)

**Duplication Details**:
- Identical interfaces: `GiftMessageOptions`, `PersonalizationContext`, etc.
- Same message templates: "Já conseguimos {X}% do nosso objetivo!"
- Duplicate currency formatting logic
- Psychology-driven messaging duplicated

**Impact**:
- 300+ lines of pure duplication
- Maintenance burden (update 2 places)
- Risk of inconsistency

**Recommended Solution**:

```typescript
// Merge into single file: src/lib/utils/giftMessaging.ts
// Delete: src/lib/utils/giftMessages.ts

// Unified exports:
export {
  generateGiftMessage,
  generateContributionMessage,
  type GiftMessageOptions,
  type PersonalizationContext
}
```

**Migration Steps**:
1. Review both files, choose best implementation (likely `giftMessaging.ts` - newer)
2. Ensure all consumers import from unified file
3. Add deprecation notice to old file
4. Delete old file after migration
5. Update tests

**Actual Results**:
- ✅ Deleted unused `giftMessages.ts` (438 lines) - had zero imports
- ✅ Kept `giftMessaging.ts` (230 lines) - actively used by 3 components
- ✅ Added `formatBRL()` and `formatBRLNumber()` to centralized `format.ts`
- ✅ Removed unused `GiftContributionCard.tsx` component (291 lines)
- ✅ Exported `ContributorMessage` type for proper TypeScript support
- **Total**: -708 lines eliminated, 65% reduction achieved

---

### 2. Admin Authentication Pattern Duplication ✅ COMPLETE

**Status**: ✅ **COMPLETED** - Phase 2 (October 25, 2025)
**Commit**: `dcaa7e1` - refactor: centralize admin authentication with type-safe utilities

**Problem**: 6+ different implementations of admin session checking

**Locations**:
1. `src/app/admin/photos/page.tsx:14-19`
2. `src/app/api/admin/photos/route.ts:34-39`
3. `src/app/api/admin/photos/[id]/route.ts:18-25`
4. `src/app/api/admin/posts/route.ts:21-24`
5. `src/app/api/admin/posts/[id]/route.ts:31-35`
6. `src/app/api/admin/posts/batch/route.ts`

**Current Pattern** (repeated 6 times):
```typescript
const cookieStore = await cookies()
const adminSession = cookieStore.get('admin_session')?.value
if (adminSession !== process.env.ADMIN_SESSION_SECRET) {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}
```

**Recommended Solution**:

```typescript
// Create: src/lib/auth/adminAuth.ts

import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function requireAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')?.value
  return adminSession === process.env.ADMIN_SESSION_SECRET
}

export async function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Não autorizado' },
    { status: 401 }
  )
}

// Usage in API routes:
export async function POST(request: Request) {
  if (!(await requireAdminAuth())) {
    return unauthorizedResponse()
  }
  // ... rest of handler
}
```

**Actual Results**:
- ✅ Created `src/lib/auth/adminAuth.ts` (140 lines of reusable utilities)
- ✅ Added type-safe response helpers: `unauthorizedResponse()`, `badRequestResponse()`, etc.
- ✅ Updated 1 admin page (photos) to use `isAdminAuthenticated()`
- ✅ Updated 5 API routes to use `isAdminAuthenticatedFromRequest()`
- ✅ Added comprehensive JSDoc documentation with usage examples
- ✅ All responses now properly typed with `NextResponse<T>`
- **Total**: 6 scattered implementations → 1 unified utility module

**Benefits Achieved**:
- Single source of truth for admin authentication
- Consistent error messages ("Não autorizado" everywhere)
- Type-safe responses prevent API contract bugs
- Easy to add logging/audit trail in one place
- Simplified testing (mock once, test everywhere)
- ~60 lines of duplicate code eliminated

---

### 3. Moderation Status Types Scattered ✅ COMPLETE

**Status**: ✅ **COMPLETED** - Phase 3 (October 25, 2025)
**Commit**: `f100c86` - refactor: centralize moderation status types and utilities

**Problem**: No single source of truth for moderation statuses

**Locations**:
1. `src/app/api/admin/photos/route.ts:21-29`
2. `src/lib/supabase/messages/admin.ts:11`
3. `src/lib/supabase/gallery.ts:25`
4. `src/lib/supabase/live.ts:32`

**Current Duplication**:
```typescript
// Location 1
type ModerationStatus = 'pending' | 'approved' | 'rejected'

// Location 2 (slightly different)
type PostStatus = 'pending' | 'approved' | 'rejected'

// Location 3 (same but redefined)
type PhotoStatus = 'pending' | 'approved' | 'rejected'
```

**Recommended Solution**:

```typescript
// Create: src/lib/constants/moderation.ts

export const MODERATION_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export type ModerationStatus = typeof MODERATION_STATUSES[keyof typeof MODERATION_STATUSES]

export const MODERATION_STATUS_LABELS: Record<ModerationStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
}

export const MODERATION_STATUS_COLORS: Record<ModerationStatus, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  approved: 'text-green-600 bg-green-50',
  rejected: 'text-red-600 bg-red-50',
}

// Validation helper
export function isValidModerationStatus(status: string): status is ModerationStatus {
  return Object.values(MODERATION_STATUSES).includes(status as ModerationStatus)
}
```

**Actual Results**:
- ✅ Created `src/lib/constants/moderation.ts` (190 lines)
- ✅ Comprehensive constants module with:
  - `VALID_MODERATION_STATUSES` array
  - `MODERATION_STATUS_LABELS` (Portuguese labels)
  - `MODERATION_STATUS_BADGE_COLORS` (Tailwind classes)
  - `MODERATION_STATUS_TEXT_COLORS` and `BG_COLORS`
  - `isValidModerationStatus()` type guard
  - `mapToModerationStatus()` with fallback
  - `StatusFilter` type for admin dashboards
- ✅ Updated `src/app/api/admin/photos/route.ts` to use centralized types
- ✅ Updated `src/app/admin/posts/page.tsx` to use StatusFilter type
- ✅ Removed 4 local type definitions
- **Total**: 4 scattered definitions → 1 central module with utilities

**Benefits Achieved**:
- Single source of truth for moderation statuses
- Consistent labels ("Pendente", "Aprovado", "Rejeitado") everywhere
- Consistent colors and styling across all admin interfaces
- Easy to add new statuses (e.g., 'flagged', 'archived') in one place
- Type-safe validation and mapping functions
- Reusable across photos, posts, and future moderated features
- ~14 lines of scattered code eliminated

---

## Medium Priority Issues

### 4. Service Layer CRUD Pattern Duplication

**Problem**: Repeated Supabase query patterns across service files

**Files**:
- `src/lib/supabase/messages/admin.ts`
- `src/lib/supabase/messages/client.ts`
- `src/lib/supabase/gallery.ts`
- `src/lib/supabase/invitations.ts`

**Common Patterns**:
1. **Error Handling** (45+ instances):
```typescript
const { data, error } = await supabase.from('table').select()
if (error) {
  console.error('Error:', error)
  throw error
}
return data
```

2. **Filter Patterns** (5+ instances):
```typescript
let query = supabase.from('table').select()
if (filters.status) {
  query = query.eq('status', filters.status)
}
```

3. **Pagination** (3+ instances):
```typescript
const { from, to } = getPagination(page, pageSize)
query = query.range(from, to)
```

**Recommended Solution**:

```typescript
// Create: src/lib/supabase/base/BaseService.ts

export abstract class BaseService<T> {
  constructor(
    protected supabase: SupabaseClient,
    protected tableName: string
  ) {}

  async getAll(filters?: Record<string, any>): Promise<T[]> {
    let query = this.supabase.from(this.tableName).select()

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value)
        }
      })
    }

    const { data, error } = await query
    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error)
      throw error
    }
    return data as T[]
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select()
      .eq('id', id)
      .single()

    if (error) {
      console.error(`Error fetching ${this.tableName} by id:`, error)
      throw error
    }
    return data as T
  }

  async create(item: Partial<T>): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error)
      throw error
    }
    return data as T
  }

  // ... update, delete, etc.
}

// Usage:
export class InvitationsService extends BaseService<Invitation> {
  constructor(supabase: SupabaseClient) {
    super(supabase, 'invitations')
  }

  // Add invitation-specific methods
  async getByCode(code: string): Promise<Invitation | null> {
    return super.getAll({ invite_code: code }).then(data => data[0] || null)
  }
}
```

**Migration Steps**:
1. Create base service class
2. Migrate one service (e.g., invitations) as proof of concept
3. Test thoroughly
4. Migrate remaining services
5. Document patterns

**Impact**:
- ~1000 lines of duplicated CRUD logic → single base class
- Consistent error handling
- Easier to add features (logging, caching, etc.)
- Type-safe queries

---

### 5. Currency Formatting Duplication

**Problem**: Identical BRL formatting in 2 files

**Files**:
- `src/lib/utils/giftMessages.ts:153-158`
- `src/lib/utils/giftMessaging.ts:192-197`

**Current Code** (duplicated):
```typescript
const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
return formatter.format(value)
```

**Recommended Solution**:

```typescript
// Add to: src/lib/utils/format.ts

/**
 * Formats number as Brazilian Real (BRL) currency
 * @example formatBRL(1234.56) // "R$ 1.234,56"
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formats number as Brazilian Real without currency symbol
 * @example formatBRLNumber(1234.56) // "1.234,56"
 */
export function formatBRLNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
```

**Migration Steps**:
1. Add functions to `format.ts`
2. Update both gift messaging files to import
3. Remove inline formatters
4. Use throughout app (presentes page, etc.)

**Impact**:
- Consistent currency formatting
- Easy to update locale if needed
- Reusable across app

---

### 6. Moderation Response Patterns

**Problem**: Inconsistent API response contracts between photo/post moderation

**Files**:
- `src/app/api/admin/photos/[id]/route.ts`
- `src/app/api/admin/posts/[id]/route.ts`

**Current Inconsistency**:
```typescript
// Photos API
return NextResponse.json({
  message: 'Foto aprovada',
  photo: updatedPhoto
})

// Posts API
return NextResponse.json({
  success: true,
  message: 'Post aprovado',
  post: updatedPost
})
```

**Recommended Solution**:

```typescript
// Create: src/lib/api/responses.ts

export interface ApiSuccessResponse<T = any> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: any
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse

export function successResponse<T>(message: string, data: T): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    data,
  })
}

export function errorResponse(error: string, status = 400, details?: any): NextResponse {
  return NextResponse.json({
    success: false,
    error,
    details,
  }, { status })
}

// Usage:
return successResponse('Foto aprovada', updatedPhoto)
return errorResponse('Foto não encontrada', 404)
```

**Migration Steps**:
1. Create response utilities
2. Update all API routes to use helpers
3. Update frontend to expect consistent structure
4. Add TypeScript types for responses

**Impact**:
- Consistent API contracts
- Type-safe responses
- Easier frontend error handling

---

## Lower Priority (Polish)

### 7. Error Messages Localization

**Problem**: Portuguese error messages scattered throughout codebase

**Recommendation**: Create `src/lib/constants/errorMessages.ts`

```typescript
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Não autorizado',
  NOT_FOUND: 'Não encontrado',
  INVALID_INPUT: 'Entrada inválida',
  SERVER_ERROR: 'Erro interno do servidor',
  // ... more messages
}
```

### 8. Status Filter Mapping Functions

**Problem**: Similar filter validation repeated in photo/post admin pages

**Recommendation**: Extract to shared utility in `src/lib/utils/filters.ts`

### 9. Photo Transformation Functions

**Problem**: Guest photo converters duplicated

**Recommendation**: Consolidate in `src/lib/utils/photoTransformers.ts`

### 10. Type Assertions

**Problem**: Repeated `as unknown as Type` casts in services

**Recommendation**: Use proper type guards and schema validation (Zod)

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1) - High ROI

**Tasks**:
1. ✅ Merge gift messaging files → Save 300+ lines
2. ✅ Extract admin auth utility → Save 60+ lines, fix 6 inconsistencies
3. ✅ Centralize moderation types → Single source of truth

**Estimated Time**: 4-6 hours
**Impact**: 400+ lines reduction, major consistency improvements

### Phase 2: Service Layer (Week 2) - Foundation

**Tasks**:
1. Create base service class
2. Migrate invitations service (proof of concept)
3. Migrate remaining services
4. Add comprehensive tests

**Estimated Time**: 8-10 hours
**Impact**: ~1000 lines consolidation, future-proof architecture

### Phase 3: Polish (Week 3) - Clean Up

**Tasks**:
1. Standardize API responses
2. Extract error messages
3. Consolidate filter utilities
4. Add missing type guards

**Estimated Time**: 4-6 hours
**Impact**: Professional consistency, easier maintenance

---

## Success Metrics

### Before Refactoring
- Gift messaging: 668 lines across 2 files
- Admin auth: 6 different implementations
- Moderation types: 4 scattered definitions
- CRUD patterns: ~1500 lines of duplicated logic

### After Refactoring (Target)
- Gift messaging: ~400 lines (40% reduction)
- Admin auth: 1 utility (83% reduction)
- Moderation types: 1 source of truth (75% reduction)
- CRUD patterns: Base class + specific methods (~60% reduction)

### Overall Impact
- **Total Lines Saved**: 800-1000 lines
- **Maintenance Burden**: Reduced by ~50%
- **Consistency**: Single source of truth for all patterns
- **Test Coverage**: Easier with centralized utilities

---

## Testing Checklist

After each phase, verify:

- [ ] All admin pages still work (photos, posts, invitations, presentes)
- [ ] Gift messaging displays correctly
- [ ] Moderation workflows function
- [ ] API responses maintain backwards compatibility
- [ ] Type safety maintained throughout
- [ ] No new TypeScript errors
- [ ] Lighthouse score remains 90+

---

## Risk Mitigation

**Risks**:
1. Breaking changes during migration
2. Missed import updates
3. Type compatibility issues

**Mitigation**:
1. Create feature branch for each phase
2. Comprehensive testing before merge
3. Use TypeScript strict mode
4. Git commit after each file migration
5. Keep old files with deprecation notices initially

---

## Next Steps

Ready to start? Choose your approach:

**Option A - Quick Wins First** (Recommended):
```bash
git checkout -b refactor/dry-phase-1-critical
# Start with gift messaging merge (biggest impact)
```

**Option B - Foundation First**:
```bash
git checkout -b refactor/dry-service-layer
# Start with base service class (biggest architecture improvement)
```

**Option C - Incremental**:
```bash
git checkout -b refactor/dry-incremental
# Fix issues one by one as you encounter them
```

---

## Questions?

- Want to prioritize differently? Let me know!
- Need code examples for any pattern? Just ask!
- Ready to start implementation? Pick a phase and let's go!

This roadmap provides a clear path to eliminate duplication while maintaining stability and wedding day readiness. 🎉
