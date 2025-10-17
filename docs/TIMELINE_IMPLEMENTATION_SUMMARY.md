# Live Timeline Implementation Summary

**Quick Reference Guide for Development**

---

## TL;DR: What We're Building

Transform the static wedding timeline into a **live, interactive experience** that:
- Shows "HAPPENING NOW" based on actual time
- Updates automatically every 30 seconds
- Displays on TV at venue + guest mobile devices
- Allows guests to upload photos tied to specific events
- Managed via Sanity CMS (no code changes needed)

---

## Implementation Phases

### Phase 1: Foundation (Day 1)
**Deliverables**: Sanity schema + TypeScript types

```bash
# Files to create
src/sanity/schemas/documents/weddingTimelineEvent.ts  # Schema
src/types/wedding.ts                                  # Add 3 interfaces
src/sanity/schemas/index.ts                          # Register schema
```

**Tasks**:
1. Create `weddingTimelineEvent` Sanity document type
2. Add TypeScript interfaces: `WeddingTimelineEvent`, `TimelineEventState`, `LiveTimelineData`
3. Populate 5 initial events in Sanity Studio

**Success Criteria**: Can create/edit timeline events in Sanity Studio

---

### Phase 2: Service Layer (Day 2)
**Deliverables**: Real-time state calculation logic

```bash
# Files to create
src/lib/sanity/timeline.ts           # GROQ queries
src/lib/services/LiveTimelineService.ts  # State calculations
src/hooks/useTimelineState.ts        # React hook
```

**Key Functions**:
```typescript
// Calculate current event based on real time
calculateTimelineState(events, currentTime): LiveTimelineData

// Auto-update every 30 seconds
startAutoUpdate(events, onUpdate): void

// Get timeline events from Sanity
fetchTimelineEvents(): Promise<WeddingTimelineEvent[]>
```

**Success Criteria**: Can calculate "current event" correctly at any time

---

### Phase 3: TV Display (Day 3)
**Deliverables**: Large screen optimized view (Concept 1 "Theater Marquee")

```bash
# Files to create
src/components/timeline/LiveTimelineTV.tsx      # Main component
src/components/timeline/EventCard.tsx           # Reusable card
src/components/timeline/TimelineBadge.tsx       # Status indicators
src/app/ao-vivo/timeline/tv/page.tsx           # TV-specific page
```

**Layout**:
```
┌────────────────────────────────┐
│    ACONTECENDO AGORA (50%)     │  ← Current event (huge)
├────────────────────────────────┤
│    A SEGUIR (25%)              │  ← Next 2 events
├────────────────────────────────┤
│    MOMENTOS CELEBRADOS (25%)   │  ← Completed events
└────────────────────────────────┘
```

**Success Criteria**: Readable from 15 feet away, auto-updates

---

### Phase 4: Mobile Display (Day 4)
**Deliverables**: Mobile-first timeline (Concept 2 "Progress Journey")

```bash
# Files to create
src/components/timeline/LiveTimelineMobile.tsx   # Mobile view
src/components/timeline/PhotoUploadButton.tsx    # Upload CTA
src/app/ao-vivo/timeline/page.tsx               # Main timeline page
```

**Layout**:
```
[Sticky Header: YOU ARE HERE]
[Progress Bar: 60%]
[Scrollable Timeline]
  ✅ Past events (with photos)
  🔴 Current event (with upload button)
  ⏰ Future events (with countdown)
```

**Success Criteria**: Easy scrolling, one-tap photo upload

---

### Phase 5: Photo Integration (Day 5)
**Deliverables**: Link timeline to existing guest photo system

```bash
# Files to modify
src/lib/supabase/gallery.ts          # Add timeline_event_id filter
src/components/timeline/EventPhotoGallery.tsx  # Photo grid per event
```

**Database Changes**:
```sql
-- Add column to existing guest_photos table
ALTER TABLE guest_photos
ADD COLUMN timeline_event_id TEXT;

-- Create index for performance
CREATE INDEX idx_guest_photos_timeline_event
ON guest_photos(timeline_event_id);
```

**Success Criteria**: Photos uploaded during event show on timeline

---

## Recommended UX Concepts

### TV Display: "Theater Marquee" (Concept 1)
**Best for**: Large screen visibility from across room
- Current event takes 50% screen space
- Next events shown below
- Completed events at bottom
- Auto-updating countdown timers
- Live photo counter per event

### Mobile: "Progress Journey" (Concept 2)
**Best for**: Scrollable mobile interaction
- Vertical timeline (past → present → future)
- "You are here" sticky header
- One-tap photo upload during events
- Progress bar showing overall completion
- Relative time ("em 15 minutos")

### Add Later: "Split Screen Cinema" (Concept 3)
**Best for**: TV + mobile sync via QR code
- QR code on TV screen
- Mobile connects to TV session
- Actions on mobile appear on TV
- Real-time photo gallery sync

---

## Real-Time Logic

### Event Status Calculation

```typescript
// Determine event status based on current time

function getEventStatus(event, currentTime) {
  const start = new Date(event.startTime);
  const end = event.endTime ? new Date(event.endTime) : null;

  if (currentTime < start) {
    return 'upcoming';
  }

  if (end && currentTime > end) {
    return 'completed';
  }

  return 'happening_now';
}
```

### Auto-Update Strategy

```typescript
// Update timeline every 30 seconds

setInterval(() => {
  const currentTime = new Date();
  const newState = calculateTimelineState(events, currentTime);
  setTimelineData(newState);
}, 30000);
```

---

## Edge Cases Handled

### 1. Before First Event
**Display**: Countdown timer + "Enquanto isso" suggestions

### 2. Between Events
**Display**: "✅ Event completed" + "⏰ Next in X minutes"

### 3. After Last Event
**Display**: Celebration summary + total photos + thank you message

### 4. Event Running Late
**Display**: "X min além do previsto (sem pressa!)" - still shows as "happening_now" for 15 min grace period

---

## Quick Start Commands

```bash
# 1. Add Sanity schema
cd src/sanity/schemas/documents
# Create weddingTimelineEvent.ts (copy from research doc)

# 2. Register schema
# Add to src/sanity/schemas/index.ts:
import weddingTimelineEvent from './documents/weddingTimelineEvent'
export const schemaTypes = [..., weddingTimelineEvent]

# 3. Create initial events in Sanity Studio
npm run dev
# Open http://localhost:3000/studio
# Navigate to "Eventos do Dia do Casamento"
# Create 5 events (10:45, 11:30, 12:00, 12:30, 14:00)

# 4. Test queries
# Create src/lib/sanity/timeline.ts with GROQ query
# Test fetching in browser console

# 5. Build components
# Follow phase structure above
```

---

## File Structure

```
thousanddaysoflove/
├── src/
│   ├── sanity/
│   │   └── schemas/
│   │       └── documents/
│   │           └── weddingTimelineEvent.ts          # NEW
│   ├── lib/
│   │   ├── sanity/
│   │   │   └── timeline.ts                          # NEW
│   │   └── services/
│   │       └── LiveTimelineService.ts               # NEW
│   ├── hooks/
│   │   └── useTimelineState.ts                      # NEW
│   ├── components/
│   │   └── timeline/                                # NEW
│   │       ├── LiveTimelineTV.tsx
│   │       ├── LiveTimelineMobile.tsx
│   │       ├── EventCard.tsx
│   │       ├── TimelineBadge.tsx
│   │       ├── PhotoUploadButton.tsx
│   │       └── EventPhotoGallery.tsx
│   ├── app/
│   │   └── ao-vivo/
│   │       └── timeline/
│   │           ├── page.tsx                         # Mobile view
│   │           └── tv/
│   │               └── page.tsx                     # TV view
│   └── types/
│       └── wedding.ts                               # MODIFY (add 3 interfaces)
└── docs/
    ├── UX_RESEARCH_LIVE_TIMELINE.md                # Research doc
    └── TIMELINE_IMPLEMENTATION_SUMMARY.md           # This file
```

---

## Testing Checklist

### Before Wedding (Nov 1-10)

- [ ] Create 5 events in Sanity matching current timeline
- [ ] Verify events display on `/ao-vivo/timeline`
- [ ] Test on phone (portrait orientation)
- [ ] Test on TV (landscape orientation, large screen)
- [ ] Verify current event detection works correctly
- [ ] Test at different times (before/during/between/after events)
- [ ] Verify photo upload links to timeline event
- [ ] Test auto-refresh (wait 30 seconds, confirm update)
- [ ] Verify accessibility (screen reader, keyboard nav)
- [ ] Test reduced motion mode

### Pre-Wedding Checklist (Nov 11-19)

- [ ] Share timeline URL with 5 family members
- [ ] Gather feedback on usability
- [ ] Monitor analytics (view counts, upload rates)
- [ ] Test TV display at venue (if possible)
- [ ] Verify countdown timers accurate
- [ ] Confirm photo moderation workflow
- [ ] Test QR code sync (if implementing)

### Wedding Day Checklist (Nov 20)

- [ ] 09:00 - Turn on TV display
- [ ] 10:00 - Enable real-time updates
- [ ] 10:30 - Verify mobile devices can access
- [ ] Throughout - Monitor admin moderation queue
- [ ] Throughout - Verify timeline transitions correctly
- [ ] Post-event - Check celebration summary displays

---

## Performance Targets

- **TV Display**: 60 FPS animations, < 100ms update latency
- **Mobile**: < 5% battery drain per hour
- **Timeline State Calc**: < 10ms computation time
- **Photo Gallery**: Virtual scrolling (only render visible)
- **Update Frequency**: Every 30 seconds (configurable)

---

## Analytics to Track

```typescript
// Key metrics to monitor

trackEvent('timeline_viewed', {
  device_type: 'mobile' | 'tv',
  current_event: string,
  viewing_duration_seconds: number
});

trackEvent('photo_uploaded_from_timeline', {
  event_id: string,
  event_title: string,
  upload_time_relative_to_event: 'during' | 'after'
});

trackEvent('timeline_interaction', {
  action: 'tap_event' | 'scroll' | 'share',
  event_status: 'upcoming' | 'current' | 'completed'
});
```

**Success Metrics**:
- Timeline view rate: Target 90%+ of guests
- Photo upload rate: Target 60%+ guests upload per event
- Average time on timeline: Target 3+ minutes per session

---

## Admin Controls (Optional Enhancement)

Add to `/admin/timeline`:
- Override current event (if running late)
- Manually mark event as complete
- Adjust event times on-the-fly
- Toggle auto-refresh on/off
- View live stats (connected devices, photo uploads)

---

## Rollout Timeline

| Date | Milestone |
|------|-----------|
| Nov 1 | Schema complete, events in Sanity |
| Nov 3 | Service layer + TV display working |
| Nov 5 | Mobile view + photo upload integrated |
| Nov 7 | Testing with family (5 people) |
| Nov 10 | Iterate based on feedback |
| Nov 11 | Soft launch to all guests |
| Nov 20 | Wedding day - full activation |
| Nov 21+ | Post-wedding gallery (30 days) |

---

## Key Design Principles

1. **Glanceable** - Readable from 15 feet (TV) or quick glance (mobile)
2. **Anticipatory** - Emphasize what's NEXT, not just what's NOW
3. **Celebratory** - Highlight completed moments with photos
4. **Inclusive** - Works for early arrivals and late stayers
5. **Accessible** - Color blind friendly, screen reader support, reduced motion
6. **Performant** - 60 FPS animations, battery conscious

---

## Questions to Answer Before Starting

1. [ ] Are current event times (10:45, 11:30, etc.) final?
2. [ ] Should timeline photos auto-approve or require moderation?
3. [ ] TV orientation: Portrait or landscape?
4. [ ] Enable push notifications when events start?
5. [ ] How long should timeline stay live post-wedding?
6. [ ] Portuguese only or add English toggle?

---

## Dependencies to Install

```json
{
  "dependencies": {
    "date-fns": "^3.0.0",        // Time calculations
    "react-window": "^1.8.10",   // Virtual scrolling
    "qrcode.react": "^3.1.0"     // QR codes (optional)
  }
}
```

Note: `framer-motion` already installed for animations

---

## Next Action

**Start with Phase 1**: Create Sanity schema and populate initial events

```bash
# 1. Copy weddingTimelineEvent.ts from research doc
# 2. Register in schemas/index.ts
# 3. Start dev server: npm run dev
# 4. Open Studio: http://localhost:3000/studio
# 5. Create 5 events matching current timeline
```

Then proceed through phases 2-5 systematically.

---

**Estimated Total Implementation Time**: 4-5 days
**Recommended Start**: November 1st (20 days before wedding)

Ready to transform passive viewing into active celebration! 🎉
