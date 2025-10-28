# Unified Media Interactions Implementation

## Overview

This update consolidates guest photo and guest post interactions into polymorphic tables that work across `/galeria`, `/dia-1000`, `/mensagens`, and `/ao-vivo`.

- New `media_reactions` and `media_comments` tables with shared triggers, policies, and migration scripts.
- A single Supabase client module (`src/lib/supabase/media-interactions.ts`) exposes reaction, comment, and realtime helpers for any media type.
- Gallery and live feed components now rely on the unified service, so reactions and comments stay in sync across views.

## Key Changes

- **Database**
  - `supabase/migrations/20251101000000_unified_media_interactions.sql`
  - `supabase/migrations/20251101001000_migrate_existing_interactions.sql`
- **Service Layer**
  - `src/lib/supabase/media-interactions.ts`
  - Legacy helpers (`photo-interactions.ts`, `messages/client.ts`) now delegate to the unified module.
- **Components**
  - `PhotoReactions`, `PhotoComments`, `PostCard`, and `CommentThread` consume the shared service and types.
- **Types**
  - Shared interfaces live in `src/types/media-interactions.ts`.

## Follow-Up

- Validate realtime subscriptions on staging for both gallery and live feed views.
- Plan the removal of legacy tables (`photo_reactions`, `post_reactions`, `photo_comments`, `post_comments`) once production data is verified.
