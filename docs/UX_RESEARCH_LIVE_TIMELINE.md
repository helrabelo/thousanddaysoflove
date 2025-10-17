# UX Research: Interactive Real-Time Wedding Day Timeline

**Research Date**: October 17, 2025
**Target Launch**: Wedding Day - November 20, 2025
**Primary Display**: TV at venue + Guest mobile devices
**Current Implementation**: Static EventTimeline component on `/detalhes` and `/convite/[CODE]`

---

## Executive Summary

This document presents UX research and design concepts for transforming the static wedding day timeline into an **interactive, real-time experience** that updates dynamically based on the actual time during the wedding. The timeline will be displayed on a TV at the venue while also being accessible to guests on their mobile devices, creating a unified celebration experience.

**Key Objectives**:
1. Keep guests informed about what's happening NOW
2. Create anticipation for upcoming moments
3. Celebrate completed moments with photos
4. Enable guest photo contributions tied to specific timeline events
5. Provide seamless TV display + mobile responsive experience

---

## Research Findings

### Current State Analysis

**Existing Timeline** (`/components/invitations/EventTimeline.tsx`):
- **Static hardcoded events** (5 events from 10:45 to 14:00)
- Vertical zigzag layout (alternating left/right on desktop)
- Beautiful wedding aesthetic with gradient icons
- No real-time awareness or interactivity
- No connection to guest photos or activities

**Current Events**:
1. 10:45 - Chegada dos Convidados (45 min)
2. 11:30 - Cerimonia (30 min)
3. 12:00 - Sessao de Fotos (30 min)
4. 12:30 - Almoco (90 min)
5. 14:00 - Celebracao (3 horas)

### User Needs Research

**Guest Personas & Needs**:

1. **The Anxious Guest** (arrives early)
   - Need: Know when ceremony actually starts
   - Pain: Worrying about being late
   - Solution: Clear "NEXT UP" indicator with countdown

2. **The Social Photographer** (active on social media)
   - Need: Know best moments to capture photos
   - Pain: Missing key photo opportunities
   - Solution: Photo contribution prompts per event

3. **The Timeline Confused** (doesn't know what's happening)
   - Need: Clear "NOW" indicator
   - Pain: Missing important moments
   - Solution: Prominent current event highlight

4. **The Remote Viewer** (watching from home)
   - Need: Feel connected to live celebration
   - Pain: FOMO (Fear of Missing Out)
   - Solution: Live photo feed tied to events

**Venue Context Research**:

**TV Display Requirements**:
- Large screen (55-65 inches typical)
- Viewing distance: 10-15 feet
- Ambient lighting: varies throughout day
- Portrait OR landscape orientation possible
- No touch interaction (view only)
- Should be instantly readable from across room

**Mobile Requirements**:
- 375px - 428px viewport width (iPhone)
- Touch-based interaction
- Portrait orientation primary
- May be used outdoors (bright sunlight)
- Should enable photo uploads
- Quick glanceable updates

---

## Behavioral Psychology Principles

1. **Temporal Awareness**: Humans naturally track time relative to events (not abstract hours)
   - Design: Use "starting in 15 minutes" vs "starts at 11:30"

2. **Social Proof**: People want to know what others are doing
   - Design: Show live guest activity counts per event

3. **Anticipation > Completion**: Excitement peaks before events, not after
   - Design: Emphasize upcoming events more than past

4. **Visual Hierarchy**: Eye naturally scans top-to-bottom, large-to-small
   - Design: Current event should dominate visual space

5. **Progress Satisfaction**: People enjoy seeing completion
   - Design: Show timeline progress bar (40% complete)

---

## Sanity CMS Schema Design

### New Document Type: `weddingTimelineEvent`

```typescript
// File: src/sanity/schemas/documents/weddingTimelineEvent.ts

import { defineField, defineType } from 'sanity';
import { Clock } from 'lucide-react';

export default defineType({
  name: 'weddingTimelineEvent',
  title: 'Eventos do Dia do Casamento',
  type: 'document',
  icon: Clock,

  fields: [
    // Basic Event Information
    defineField({
      name: 'title',
      title: 'Nome do Evento',
      type: 'string',
      description: 'Nome curto do momento (ex: "Cerimônia", "Almoço")',
      validation: (Rule) => Rule.required().max(60),
    }),

    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      description: 'Detalhe o que acontecerá neste momento',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),

    // Timing
    defineField({
      name: 'startTime',
      title: 'Horário de Início',
      type: 'datetime',
      description: 'Data e hora de início deste evento',
      validation: (Rule) => Rule.required(),
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
    }),

    defineField({
      name: 'endTime',
      title: 'Horário de Término',
      type: 'datetime',
      description: 'Data e hora de término (opcional para eventos abertos)',
      options: {
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
      },
    }),

    defineField({
      name: 'estimatedDuration',
      title: 'Duração Estimada',
      type: 'number',
      description: 'Duração em minutos',
      validation: (Rule) => Rule.positive().integer(),
      initialValue: 30,
    }),

    // Visual Design
    defineField({
      name: 'icon',
      title: 'Ícone',
      type: 'string',
      description: 'Escolha um ícone Lucide React',
      options: {
        list: [
          { title: '👥 Convidados', value: 'Users' },
          { title: '💕 Cerimônia', value: 'Heart' },
          { title: '📸 Fotos', value: 'Camera' },
          { title: '🍽️ Refeição', value: 'Utensils' },
          { title: '🎵 Música', value: 'Music' },
          { title: '🍰 Bolo', value: 'Cake' },
          { title: '💐 Buquê', value: 'Flower' },
          { title: '🎉 Celebração', value: 'PartyPopper' },
          { title: '⏰ Relógio', value: 'Clock' },
          { title: '✨ Especial', value: 'Sparkles' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'Clock',
    }),

    defineField({
      name: 'colorGradient',
      title: 'Gradiente de Cor',
      type: 'string',
      description: 'Gradiente Tailwind para o ícone',
      options: {
        list: [
          { title: '💚 Verde (Natureza)', value: 'from-[#4A7C59] to-[#5A8C69]' },
          { title: '🟤 Dourado (Elegância)', value: 'from-[#D4A574] to-[#C19A6B]' },
          { title: '🤎 Bronze (Clássico)', value: 'from-[#8B7355] to-[#A0826D]' },
          { title: '💙 Azul (Serenidade)', value: 'from-[#4A7C9B] to-[#5A8CAB]' },
          { title: '💗 Rosa (Romance)', value: 'from-[#D4749B] to-[#C16B8A]' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'from-[#4A7C59] to-[#5A8C69]',
    }),

    // Location
    defineField({
      name: 'location',
      title: 'Localização',
      type: 'string',
      description: 'Onde este evento acontece (ex: "Salão Principal", "Jardim")',
      validation: (Rule) => Rule.max(100),
    }),

    // Event Type Classification
    defineField({
      name: 'eventType',
      title: 'Tipo de Evento',
      type: 'string',
      description: 'Categoria do evento para organização',
      options: {
        list: [
          { title: 'Pre-Ceremony', value: 'pre_ceremony' },
          { title: 'Ceremony', value: 'ceremony' },
          { title: 'Post-Ceremony', value: 'post_ceremony' },
          { title: 'Reception', value: 'reception' },
          { title: 'Entertainment', value: 'entertainment' },
          { title: 'Special Moment', value: 'special_moment' },
          { title: 'Closing', value: 'closing' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // Guest Interaction Settings
    defineField({
      name: 'allowPhotoUploads',
      title: 'Permitir Upload de Fotos',
      type: 'boolean',
      description: 'Convidados podem enviar fotos durante este evento?',
      initialValue: true,
    }),

    defineField({
      name: 'photoUploadPrompt',
      title: 'Mensagem de Upload',
      type: 'string',
      description: 'Texto incentivando fotos (ex: "Capture este momento!")',
      hidden: ({ document }) => !document?.allowPhotoUploads,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const doc = context.document as any;
          if (doc?.allowPhotoUploads && !value) {
            return 'Mensagem é necessária quando uploads estão permitidos';
          }
          return true;
        }),
    }),

    // Display Settings
    defineField({
      name: 'isHighlight',
      title: 'Evento de Destaque',
      type: 'boolean',
      description: 'Mostrar com destaque visual extra (ex: cerimônia)',
      initialValue: false,
    }),

    defineField({
      name: 'showOnTVDisplay',
      title: 'Mostrar na TV',
      type: 'boolean',
      description: 'Exibir este evento no display da TV',
      initialValue: true,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Ordem de Exibição',
      type: 'number',
      description: 'Ordem deste evento (1, 2, 3...)',
      validation: (Rule) => Rule.required().integer().positive(),
      initialValue: 1,
    }),

    // Status & Notifications
    defineField({
      name: 'isActive',
      title: 'Ativo',
      type: 'boolean',
      description: 'Este evento está ativo no cronograma?',
      initialValue: true,
    }),

    defineField({
      name: 'sendNotifications',
      title: 'Enviar Notificações',
      type: 'boolean',
      description: 'Notificar convidados quando este evento começar?',
      initialValue: false,
    }),

    defineField({
      name: 'notificationLeadTime',
      title: 'Antecedência da Notificação',
      type: 'number',
      description: 'Minutos antes do evento para enviar notificação',
      hidden: ({ document }) => !document?.sendNotifications,
      validation: (Rule) => Rule.integer().positive(),
      initialValue: 10,
    }),

    // Activity Tracking (read-only, populated by system)
    defineField({
      name: 'guestPhotosCount',
      title: 'Fotos de Convidados',
      type: 'number',
      description: 'Total de fotos enviadas para este evento',
      readOnly: true,
      initialValue: 0,
    }),

    defineField({
      name: 'viewCount',
      title: 'Visualizações',
      type: 'number',
      description: 'Quantas vezes este evento foi visualizado',
      readOnly: true,
      initialValue: 0,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      startTime: 'startTime',
      eventType: 'eventType',
      isActive: 'isActive',
      isHighlight: 'isHighlight',
      displayOrder: 'displayOrder',
    },
    prepare({ title, startTime, eventType, isActive, isHighlight, displayOrder }) {
      const time = startTime
        ? new Date(startTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Sem horário';

      const badges = [];
      if (isHighlight) badges.push('⭐');
      if (!isActive) badges.push('🔒');

      const typeEmojis: Record<string, string> = {
        pre_ceremony: '📋',
        ceremony: '💍',
        post_ceremony: '📸',
        reception: '🍽️',
        entertainment: '🎵',
        special_moment: '✨',
        closing: '👋',
      };

      const emoji = typeEmojis[eventType] || '⏰';

      return {
        title: `${displayOrder}. ${time} - ${title}`,
        subtitle: `${emoji} ${eventType}${badges.length > 0 ? ` ${badges.join(' ')}` : ''}`,
      };
    },
  },

  orderings: [
    {
      title: 'Ordem de Exibição',
      name: 'displayOrder',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Horário de Início',
      name: 'startTime',
      by: [{ field: 'startTime', direction: 'asc' }],
    },
    {
      title: 'Tipo de Evento',
      name: 'eventType',
      by: [{ field: 'eventType', direction: 'asc' }],
    },
  ],
});
```

### TypeScript Interface

```typescript
// Add to src/types/wedding.ts

/**
 * Wedding Timeline Event (Sanity CMS)
 * Represents a scheduled event during the wedding day
 */
export interface WeddingTimelineEvent {
  _id: string;
  title: string;
  description: string;
  startTime: string; // ISO 8601 datetime
  endTime?: string;
  estimatedDuration: number; // minutes
  icon: string; // Lucide icon name
  colorGradient: string;
  location?: string;
  eventType: 'pre_ceremony' | 'ceremony' | 'post_ceremony' | 'reception' | 'entertainment' | 'special_moment' | 'closing';
  allowPhotoUploads: boolean;
  photoUploadPrompt?: string;
  isHighlight: boolean;
  showOnTVDisplay: boolean;
  displayOrder: number;
  isActive: boolean;
  sendNotifications: boolean;
  notificationLeadTime?: number;
  guestPhotosCount: number;
  viewCount: number;
}

/**
 * Timeline Event State
 * Real-time state calculation for each event
 */
export interface TimelineEventState {
  event: WeddingTimelineEvent;
  status: 'upcoming' | 'happening_now' | 'completed';
  timeUntilStart?: number; // minutes
  timeRemaining?: number; // minutes
  progressPercentage?: number; // 0-100
  isNext: boolean; // Next event to start
  guestPhotos: GuestPhoto[]; // Photos uploaded for this event
}

/**
 * Live Timeline Data
 * Complete timeline with real-time calculations
 */
export interface LiveTimelineData {
  events: TimelineEventState[];
  currentEvent?: TimelineEventState;
  nextEvent?: TimelineEventState;
  overallProgress: number; // 0-100 (percentage through wedding day)
  totalEvents: number;
  completedEvents: number;
  currentTime: string; // ISO 8601
  weddingStartTime: string;
  weddingEndTime: string;
}
```

---

## UX Concept 1: "Theater Marquee" (Recommended for TV)

### Visual Design Philosophy
**Inspiration**: Broadway theater marquee + airport departure board
**Key Principle**: Glanceable from 15 feet away

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                                                       │
│        🎭 O CASAMENTO DE HEL & YLANA 🎭             │
│           1000 Dias de Amor                          │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│   ┌─────────────────────────────────────────────┐   │
│   │  🔴 ACONTECENDO AGORA                       │   │
│   │                                             │   │
│   │  💕 CERIMÔNIA                               │   │
│   │  11:30 - 12:00  |  Salão Principal         │   │
│   │                                             │   │
│   │  Momento especial onde celebramos          │   │
│   │  1000 dias de amor                         │   │
│   │                                             │   │
│   │  ⏱️ 18 minutos restantes                    │   │
│   │  ████████████░░░░  60%                     │   │
│   │                                             │   │
│   │  📸 32 fotos compartilhadas                │   │
│   └─────────────────────────────────────────────┘   │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│   ⏰ A SEGUIR                                        │
│                                                       │
│   12:00 📸 Sessão de Fotos  ─────  em 18 min       │
│   12:30 🍽️ Almoço  ─────────────  em 48 min       │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│   ✅ MOMENTOS CELEBRADOS                             │
│                                                       │
│   10:45 👥 Chegada dos Convidados  ✓               │
│        📸 Ver 28 fotos                              │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Key Features

**1. Current Event Dominance**
- Takes 50% of screen real estate
- Bright animated border (pulsing effect)
- Large text (80px title, readable from 20ft)
- Live countdown timer
- Progress bar with visual percentage

**2. Time Representation**
- "em 18 min" (relative time, not absolute)
- Color coding: Green (upcoming), Red (happening), Gray (completed)
- Auto-updates every 30 seconds

**3. Guest Engagement Display**
- Live photo counter: "📸 32 fotos compartilhadas"
- Scrolling photo carousel for current event
- Guest activity animation (new photo pop-in)

**4. Anticipation Design**
- "A SEGUIR" section shows next 2 events
- Countdown creates urgency
- Visual hierarchy: bigger = sooner

**5. Celebration of Completion**
- "MOMENTOS CELEBRADOS" at bottom
- Checkmark icons
- Link to view guest photos

### Animation Strategy

```typescript
// Framer Motion animations for TV display

// Current event card
const currentEventAnimation = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    border: [
      '4px solid rgba(74, 124, 89, 0.3)',
      '4px solid rgba(74, 124, 89, 1)',
      '4px solid rgba(74, 124, 89, 0.3)',
    ]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: 'loop'
  }
};

// New photo pop-in
const photoPopIn = {
  initial: { scale: 0, rotate: -10 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// Countdown timer pulse
const timerPulse = {
  animate: {
    scale: [1, 1.05, 1],
    color: ['#4A4A4A', '#D4A574', '#4A4A4A']
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'loop'
  }
};
```

### Real-Time Update Mechanism

```typescript
// Service layer for real-time timeline state

export class LiveTimelineService {
  private updateInterval: NodeJS.Timeout | null = null;

  /**
   * Calculate current timeline state based on real time
   */
  calculateTimelineState(
    events: WeddingTimelineEvent[],
    currentTime: Date = new Date()
  ): LiveTimelineData {
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    let currentEvent: TimelineEventState | undefined;
    let nextEvent: TimelineEventState | undefined;
    let completedCount = 0;

    const eventStates: TimelineEventState[] = sortedEvents.map((event, index) => {
      const startTime = new Date(event.startTime);
      const endTime = event.endTime ? new Date(event.endTime) : null;

      // Calculate time differences in minutes
      const timeUntilStart = Math.max(0,
        (startTime.getTime() - currentTime.getTime()) / 60000
      );

      let status: 'upcoming' | 'happening_now' | 'completed';
      let timeRemaining: number | undefined;
      let progressPercentage: number | undefined;

      // Determine status
      if (currentTime < startTime) {
        status = 'upcoming';
      } else if (endTime && currentTime > endTime) {
        status = 'completed';
        completedCount++;
      } else {
        status = 'happening_now';
        currentEvent = undefined; // Will be set below

        if (endTime) {
          const totalDuration = endTime.getTime() - startTime.getTime();
          const elapsed = currentTime.getTime() - startTime.getTime();
          progressPercentage = Math.min(100, (elapsed / totalDuration) * 100);
          timeRemaining = (endTime.getTime() - currentTime.getTime()) / 60000;
        }
      }

      // Find next upcoming event
      if (status === 'upcoming' && !nextEvent) {
        nextEvent = { ...eventState, isNext: true };
      }

      const eventState: TimelineEventState = {
        event,
        status,
        timeUntilStart,
        timeRemaining,
        progressPercentage,
        isNext: false,
        guestPhotos: [], // Populated from Supabase
      };

      if (status === 'happening_now') {
        currentEvent = eventState;
      }

      return eventState;
    });

    const overallProgress = (completedCount / sortedEvents.length) * 100;

    return {
      events: eventStates,
      currentEvent,
      nextEvent,
      overallProgress,
      totalEvents: sortedEvents.length,
      completedEvents: completedCount,
      currentTime: currentTime.toISOString(),
      weddingStartTime: sortedEvents[0].startTime,
      weddingEndTime: sortedEvents[sortedEvents.length - 1].endTime ||
                      sortedEvents[sortedEvents.length - 1].startTime,
    };
  }

  /**
   * Start auto-updating timeline every 30 seconds
   */
  startAutoUpdate(
    events: WeddingTimelineEvent[],
    onUpdate: (data: LiveTimelineData) => void
  ) {
    // Initial calculation
    onUpdate(this.calculateTimelineState(events));

    // Update every 30 seconds
    this.updateInterval = setInterval(() => {
      onUpdate(this.calculateTimelineState(events));
    }, 30000);
  }

  /**
   * Stop auto-updates
   */
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}
```

### Mobile Responsive Adaptation

On mobile (< 768px):
- Current event card becomes vertical
- Single column layout
- Swipe between upcoming/current/completed
- Floating "Upload Photo" FAB button
- Reduced text sizes but maintaining hierarchy

---

## UX Concept 2: "Progress Journey" (Best for Mobile)

### Visual Design Philosophy
**Inspiration**: Fitness app progress tracker + Waze navigation
**Key Principle**: Scrollable journey with clear waypoints

### Layout Structure (Mobile Portrait)

```
┌───────────────────────┐
│  ╔═══════════════╗   │
│  ║  📍 VOCÊ ESTÁ ║   │ ← Sticky Header
│  ║  AQUI AGORA   ║   │
│  ╚═══════════════╝   │
├───────────────────────┤
│                       │
│  🎊 PROGRESSO         │
│  ████████░░░░░  60%   │
│  3 de 5 momentos      │
│                       │
├───────────────────────┤
│                       │ ← Scrollable Timeline
│   ✅ 10:45            │
│   👥 Chegada          │
│   ─────────────       │
│   📸 28 fotos         │
│                       │
│   ✅ 11:00            │
│   🍷 Welcome Drink    │
│   ─────────────       │
│   📸 15 fotos         │
│                       │
│   ┏━━━━━━━━━━━━━┓    │
│   ┃ 🔴 AGORA    ┃    │ ← Current Event
│   ┃             ┃    │
│   ┃ 💕 11:30    ┃    │
│   ┃ CERIMÔNIA   ┃    │
│   ┃             ┃    │
│   ┃ ⏱️ 18 min   ┃    │
│   ┃ restantes   ┃    │
│   ┃             ┃    │
│   ┃ ┌─────────┐ ┃    │
│   ┃ │ 📸 ENVIAR│ ┃    │ ← Photo Upload
│   ┃ │   FOTO   │ ┃    │
│   ┃ └─────────┘ ┃    │
│   ┗━━━━━━━━━━━━━┛    │
│                       │
│   ⏰ 12:00            │
│   📸 Fotos            │
│   em 18 minutos       │
│                       │
│   ⏰ 12:30            │
│   🍽️ Almoço          │
│   em 48 minutos       │
│                       │
│   ⏰ 14:00            │
│   🎵 Celebração       │
│   em 2h 18min         │
│                       │
└───────────────────────┘
```

### Key Features

**1. Vertical Scrolling Timeline**
- Natural mobile interaction pattern
- Scroll to see past/future events
- Current event auto-scrolls into view

**2. Visual Progress Indicators**
- Checkmarks (✅) for completed
- Pulsing red dot (🔴) for current
- Clock emoji (⏰) for upcoming
- Connecting lines show journey

**3. Context-Aware Actions**
- "📸 ENVIAR FOTO" button appears only for events allowing uploads
- Shows during + 30 min after event
- Opens camera/photo picker directly

**4. Sticky "You Are Here" Header**
- Always visible at top
- Quick orientation
- Shows overall progress percentage

**5. Relative Time Display**
- "em 18 minutos" (upcoming)
- "há 15 minutos" (past)
- Speaks natural language

### Interaction Patterns

```typescript
// Touch gestures for mobile timeline

// Pull-to-refresh (updates timeline from Sanity)
const handleRefresh = async () => {
  await refetchTimelineEvents();
  showToast('Timeline atualizada!');
};

// Tap event to expand details
const handleEventTap = (event: TimelineEventState) => {
  if (event.status === 'completed') {
    // Show photo gallery modal
    openPhotoGallery(event.guestPhotos);
  } else if (event.status === 'happening_now') {
    // Show upload photo prompt
    if (event.event.allowPhotoUploads) {
      openPhotoUpload(event.event.id);
    }
  } else {
    // Show event details
    openEventDetails(event.event);
  }
};

// Long press to share event
const handleLongPress = (event: TimelineEventState) => {
  shareEvent({
    title: event.event.title,
    time: event.event.startTime,
    url: `https://thousanddaysof.love/ao-vivo?event=${event.event._id}`
  });
};
```

### Photo Upload Flow

```
User taps "📸 ENVIAR FOTO"
         ↓
┌──────────────────────┐
│ Capture this moment! │
│                      │
│  [Camera] [Library]  │
│                      │
│ 💕 Cerimônia         │
│ 11:30 - 12:00        │
└──────────────────────┘
         ↓
  User selects photo
         ↓
┌──────────────────────┐
│ [Photo Preview]      │
│                      │
│ Add a message? (opt) │
│ [_______________]    │
│                      │
│ [Cancel] [Share]     │
└──────────────────────┘
         ↓
   Photo uploads
         ↓
┌──────────────────────┐
│  ✨ Shared! ✨       │
│                      │
│ Your photo will be   │
│ added to the live    │
│ gallery after        │
│ approval             │
└──────────────────────┘
```

### Real-Time Sync Strategy

```typescript
// Supabase real-time subscription for timeline updates

export const useTimelineRealtime = (eventId: string) => {
  const [timelineData, setTimelineData] = useState<LiveTimelineData | null>(null);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Subscribe to guest photo uploads
    const channel = supabase
      .channel(`timeline-event-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guest_photos',
          filter: `timeline_event_id=eq.${eventId}`
        },
        (payload) => {
          // New photo uploaded - update count
          setTimelineData(prev => {
            if (!prev) return null;

            return {
              ...prev,
              events: prev.events.map(evt =>
                evt.event._id === eventId
                  ? {
                      ...evt,
                      event: {
                        ...evt.event,
                        guestPhotosCount: evt.event.guestPhotosCount + 1
                      }
                    }
                  : evt
              )
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  return timelineData;
};
```

---

## UX Concept 3: "Split Screen Cinema" (Hybrid TV + Mobile)

### Visual Design Philosophy
**Inspiration**: Sports broadcast split-screen + concert jumbotron
**Key Principle**: TV shows overview, mobile enables interaction

### TV Display (Landscape Orientation)

```
┌────────────────────────────────────────────────────────────────┐
│                        HEL & YLANA                              │
│              ╔═══════════════════════════════════════╗          │
│   [LEFT]     ║         [CENTER]          ║   [RIGHT]           │
│              ║                           ║                      │
│   NEXT UP    ║      HAPPENING NOW        ║  LIVE PHOTOS        │
│              ║                           ║                      │
│   📸 12:00   ║      💕 CERIMÔNIA         ║  ┌──┐ ┌──┐ ┌──┐    │
│   Fotos      ║      11:30 - 12:00        ║  │  │ │  │ │  │    │
│              ║                           ║  └──┘ └──┘ └──┘    │
│   in 15 min  ║      ⏱️ 18 min left       ║                      │
│              ║      ████████░░░░         ║  ┌──┐ ┌──┐ ┌──┐    │
│   🍽️ 12:30   ║                           ║  │  │ │  │ │  │    │
│   Almoço     ║      📸 32 photos         ║  └──┘ └──┘ └──┘    │
│              ║      👥 89 guests         ║                      │
│   in 45 min  ║                           ║  32 photos          │
│              ║                           ║  from guests        │
│              ╚═══════════════════════════╝                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  10:45 ✅ Chegada  |  11:00 ✅ Welcome  |  14:00 ⏰ Celebração  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Mobile Companion App

```
┌───────────────────────┐
│  ┌─────────────────┐  │
│  │  [QR Code]      │  │ ← Scan to sync with TV
│  └─────────────────┘  │
│                       │
│  🔗 Connected to TV   │
│  Live Timeline        │
│                       │
├───────────────────────┤
│                       │
│  🔴 HAPPENING NOW     │
│                       │
│  💕 CERIMÔNIA         │
│  ⏱️ 18 min left       │
│                       │
│  ┌─────────────────┐  │
│  │ 📸 CAPTURE THIS │  │ ← Primary action
│  │    MOMENT       │  │
│  └─────────────────┘  │
│                       │
│  ┌─────────────────┐  │
│  │ 💬 SEND MESSAGE │  │ ← Secondary action
│  └─────────────────┘  │
│                       │
├───────────────────────┤
│                       │
│  📸 View 32 photos    │
│  from other guests    │
│                       │
│  [Photo Grid]         │
│                       │
└───────────────────────┘
```

### Key Features

**1. Synchronized Experience**
- QR code on TV screen → guests scan → mobile syncs
- Mobile knows which event is "NOW" from TV display
- Actions on mobile appear on TV (with delay for moderation)

**2. Three-Panel TV Layout**
- **LEFT**: Next 2 upcoming events (anticipation)
- **CENTER**: Current event (dominant, 50% width)
- **RIGHT**: Live scrolling photo gallery

**3. Mobile as Remote Control**
- Upload photos → appear on TV after approval
- Send messages → display on TV ticker
- React to moments → see reactions bubble up on TV

**4. Photo Gallery Carousel**
- Auto-scrolling grid on TV
- New photos slide in from top
- Guest name attribution below each photo
- 3x3 grid updates every 10 seconds

**5. Social Presence Indicators**
- "👥 89 guests viewing" on TV
- "📱 42 phones connected" counter
- Creates FOMO for guests not connected

### Technical Architecture

```typescript
// WebSocket connection between TV display and mobile devices

interface TVMobileSync {
  // TV broadcasts current state
  broadcastTimeline: (state: LiveTimelineData) => void;

  // Mobile sends actions
  onMobilePhotoUpload: (photo: GuestPhotoUpload) => void;
  onMobileMessage: (message: GuestMessage) => void;
  onMobileReaction: (reaction: GuestReaction) => void;

  // TV receives and displays
  onNewApprovedPhoto: (photo: ApprovedPhoto) => void;
  onNewMessage: (message: ApprovedMessage) => void;
}

// Supabase real-time channels for sync
const tvChannel = supabase.channel('tv-display');
const mobileChannel = supabase.channel('mobile-sync');

// TV subscribes to approved content
tvChannel.on('broadcast', { event: 'photo_approved' }, payload => {
  addPhotoToGallery(payload);
  animatePhotoSlideIn();
});

// Mobile subscribes to timeline state
mobileChannel.on('broadcast', { event: 'timeline_update' }, payload => {
  updateTimelineState(payload);
});
```

### QR Code Sync Flow

```
TV Display shows QR Code
         ↓
Guest opens camera/app
         ↓
Scans QR Code
         ↓
Deep link opens: thousanddaysof.love/ao-vivo?sync=TV_SESSION_ID
         ↓
Mobile app connects to TV channel
         ↓
Mobile receives current timeline state
         ↓
Mobile highlights "ACONTECENDO AGORA"
         ↓
Guest uploads photo
         ↓
Photo goes to moderation queue
         ↓
Admin approves (via /admin/photos)
         ↓
Photo appears on TV + in mobile gallery
         ↓
Counter updates: "32 → 33 photos"
```

---

## Edge Case Handling

### Before First Event (Early Arrivals)

**Scenario**: Guest arrives at 10:00, first event at 10:45

**Display**:
```
┌───────────────────────────────┐
│  Bem-vindo ao Casamento!      │
│  de Hel & Ylana               │
│                               │
│  ⏰ O evento começa em:       │
│                               │
│  ┌─────────────────────────┐  │
│  │        45 MINUTOS       │  │
│  │     (às 10:45)          │  │
│  └─────────────────────────┘  │
│                               │
│  💡 Enquanto isso:            │
│                               │
│  • Conheça outros convidados  │
│  • Veja nossa galeria         │
│  • Envie mensagens ao casal   │
│                               │
└───────────────────────────────┘
```

### Between Events (Transition Period)

**Scenario**: Ceremony ends at 12:00, next event at 12:30

**Display**:
```
┌───────────────────────────────┐
│  ✅ CERIMÔNIA CONCLUÍDA       │
│                               │
│  📸 Ver 47 fotos              │
│  compartilhadas               │
│                               │
│  ─────────────────────        │
│                               │
│  ⏰ PRÓXIMO                   │
│                               │
│  🍽️ ALMOÇO                    │
│  Começa em 30 minutos         │
│                               │
│  💡 Aproveite para:           │
│  • Cumprimentar os noivos     │
│  • Tirar fotos no jardim      │
│                               │
└───────────────────────────────┘
```

### After Last Event (Post-Wedding)

**Scenario**: All events completed, currently 17:30

**Display**:
```
┌───────────────────────────────┐
│  🎉 OBRIGADO POR CELEBRAR     │
│     CONOSCO!                  │
│                               │
│  Relembre os melhores         │
│  momentos do dia:             │
│                               │
│  ✅ 10:45 Chegada (28 fotos)  │
│  ✅ 11:30 Cerimônia (47)      │
│  ✅ 12:00 Fotos (65)          │
│  ✅ 12:30 Almoço (34)         │
│  ✅ 14:00 Celebração (89)     │
│                               │
│  📊 Total: 263 fotos          │
│  👥 95 convidados presentes   │
│                               │
│  💕 1000 dias de amor!        │
│                               │
└───────────────────────────────┘
```

### Time Overrun (Event Running Late)

**Scenario**: Event scheduled 11:30-12:00, but it's 12:05 and still happening

**Display**:
```
┌───────────────────────────────┐
│  🔴 AINDA ACONTECENDO         │
│                               │
│  💕 CERIMÔNIA                 │
│  11:30 - ~12:00               │
│                               │
│  ⏱️ 5 minutos além do previsto│
│  (sem pressa, aproveite!)     │
│                               │
│  ⏰ PRÓXIMO                   │
│  📸 Fotos - começará em breve │
│                               │
└───────────────────────────────┘
```

**Technical Implementation**:
```typescript
// Handle time overrun gracefully
const calculateEventStatus = (event: WeddingTimelineEvent, currentTime: Date) => {
  const startTime = new Date(event.startTime);
  const endTime = event.endTime ? new Date(event.endTime) : null;

  if (currentTime < startTime) {
    return { status: 'upcoming', message: null };
  }

  if (endTime) {
    if (currentTime <= endTime) {
      return { status: 'happening_now', message: null };
    } else {
      const overrunMinutes = Math.floor((currentTime.getTime() - endTime.getTime()) / 60000);

      // If within 15 minutes past scheduled end, consider still happening
      if (overrunMinutes <= 15) {
        return {
          status: 'happening_now',
          message: `${overrunMinutes} min além do previsto (sem pressa!)`
        };
      } else {
        return { status: 'completed', message: null };
      }
    }
  }

  // No end time defined - must manually mark as complete
  return { status: 'happening_now', message: null };
};
```

---

## Accessibility Considerations

### Visual Accessibility

1. **Color Blind Friendly**
   - Don't rely on color alone for status
   - Use icons: ⏰ (upcoming), 🔴 (current), ✅ (completed)
   - Patterns: solid border (current), dashed (upcoming), none (completed)

2. **High Contrast Mode**
   ```css
   @media (prefers-contrast: high) {
     .timeline-event-current {
       border: 4px solid #000;
       background: #fff;
     }
   }
   ```

3. **Large Text Mode**
   - Support dynamic text sizing
   - Minimum 18px body text
   - 48px+ for current event title (TV)

### Screen Reader Support

```tsx
// ARIA labels for timeline events

<div
  role="region"
  aria-label="Cronograma do casamento"
  aria-live="polite" // Updates announced
>
  <div
    role="article"
    aria-label={`Evento atual: ${currentEvent.title}, começou às ${formatTime(currentEvent.startTime)}, ${currentEvent.timeRemaining} minutos restantes`}
  >
    <h2 id="current-event-title">{currentEvent.title}</h2>
    <time dateTime={currentEvent.startTime}>
      {formatTime(currentEvent.startTime)}
    </time>
    <p>{currentEvent.description}</p>
  </div>
</div>
```

### Motion Sensitivity

```typescript
// Respect prefers-reduced-motion
import { useReducedMotion } from 'framer-motion';

const LiveTimeline = () => {
  const shouldReduceMotion = useReducedMotion();

  const animation = shouldReduceMotion
    ? { animate: { opacity: 1 } } // Simple fade
    : {
        animate: {
          opacity: 1,
          scale: [0.95, 1],
          borderColor: ['rgba(74,124,89,0.3)', 'rgba(74,124,89,1)']
        }
      }; // Full animations

  return <motion.div {...animation} />;
};
```

---

## Performance Requirements

### TV Display (Critical Path)

**Target**: 60 FPS for animations, < 100ms update latency

```typescript
// Performance optimizations

// 1. Memoize timeline calculations
const timelineState = useMemo(() =>
  calculateTimelineState(events, currentTime),
  [events, Math.floor(currentTime.getTime() / 30000)] // Recalc every 30s
);

// 2. Virtual scrolling for photo gallery (only render visible)
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={3}
  columnWidth={200}
  height={600}
  rowCount={Math.ceil(photos.length / 3)}
  rowHeight={200}
  width={640}
>
  {PhotoCell}
</FixedSizeGrid>

// 3. Debounce real-time updates
const debouncedUpdate = useDeferredValue(timelineData);

// 4. GPU-accelerated animations
const animationConfig = {
  // Use transform and opacity (GPU-accelerated)
  animate: {
    transform: 'scale(1)',
    opacity: 1
  },
  // Avoid: width, height, margin (CPU-bound)
};
```

### Mobile (Battery Conscious)

**Target**: < 5% battery drain per hour

```typescript
// Battery-saving strategies

// 1. Reduce update frequency when app in background
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Reduce to 2-minute updates
    setUpdateInterval(120000);
  } else {
    // Normal 30-second updates
    setUpdateInterval(30000);
  }
});

// 2. Lazy load images
<img
  loading="lazy"
  decoding="async"
  src={photoUrl}
  alt={photoAlt}
/>

// 3. Compress images for mobile
const mobileImageUrl = sanityImageBuilder
  .image(photo)
  .width(400) // Mobile width
  .quality(70) // Reduced quality
  .format('webp')
  .url();
```

---

## Guest Engagement Metrics

### Success Metrics

**Primary KPIs**:
- Timeline view count: Target 90%+ of guests view timeline
- Photo upload rate: Target 60%+ guests upload at least 1 photo per event
- Average time on timeline: Target 3+ minutes per session
- Real-time sync rate: Target 80%+ mobile devices synced to TV

**Engagement Tracking**:
```typescript
// Analytics events to track

trackEvent('timeline_viewed', {
  device_type: 'mobile' | 'tv',
  current_event: currentEvent?.title,
  viewing_duration_seconds: 180
});

trackEvent('photo_uploaded_from_timeline', {
  event_id: event._id,
  event_title: event.title,
  upload_time_relative_to_event: 'during' | 'after', // within 30 min
  upload_source: 'camera' | 'library'
});

trackEvent('timeline_interaction', {
  action: 'tap_event' | 'scroll' | 'swipe' | 'share',
  event_status: 'upcoming' | 'current' | 'completed'
});
```

### A/B Testing Opportunities

**Test 1**: Relative vs Absolute Time
- **A**: "em 15 minutos"
- **B**: "às 12:00"
- **Metric**: Which leads to more on-time arrivals?

**Test 2**: Photo Upload Prompts
- **A**: "📸 Capture this moment!"
- **B**: "📸 Tire uma foto especial"
- **C**: "📸 Compartilhe sua foto"
- **Metric**: Which has highest upload conversion?

**Test 3**: Progress Display
- **A**: Percentage bar (60%)
- **B**: Fraction (3 of 5)
- **C**: Both
- **Metric**: Which creates most engagement?

---

## Rollout Strategy

### Phase 1: Pre-Wedding Testing (Nov 1-10)
- Deploy timeline to `/ao-vivo/timeline` test route
- Invite 5 close family members to test on their phones
- Test TV display at home on large screen
- Gather feedback on readability and usability

### Phase 2: Soft Launch (Nov 11-19)
- Add timeline to `/ao-vivo` main page
- Send WhatsApp to all confirmed guests with link
- Monitor analytics for adoption rate
- Iterate based on early feedback

### Phase 3: Wedding Day Activation (Nov 20)
- 09:00: Turn on TV display at venue
- 10:00: Enable real-time updates
- 10:30: QR codes displayed for mobile sync
- Throughout: Admin monitors moderation queue
- Post-event: Timeline shows celebration summary

### Phase 4: Post-Wedding (Nov 21+)
- Timeline remains live for 30 days
- Guests can continue uploading photos
- Gallery transitions to "Relive the moments"
- Export analytics report for learnings

---

## Recommendation: Hybrid Approach

After analyzing all three concepts, I recommend a **hybrid implementation**:

### For TV Display: Concept 1 "Theater Marquee"
- Best for large screen visibility
- Clear hierarchy and glanceability
- Celebration-focused aesthetic

### For Mobile: Concept 2 "Progress Journey"
- Natural mobile interaction patterns
- Easy scrolling and photo uploads
- Personal progress tracking

### Add From Concept 3: Real-Time Sync
- QR code connection between TV and mobile
- Live photo gallery updates
- Social presence indicators

### Implementation Priority

**Must Have (MVP)**:
1. Real-time current event detection ✅
2. TV display with current/next/completed sections ✅
3. Mobile responsive timeline with photo upload ✅
4. Sanity CMS event management ✅
5. 30-second auto-refresh ✅

**Should Have (Launch)**:
1. Live photo gallery on TV ✅
2. Guest photo counters ✅
3. Progress bar visualization ✅
4. Edge case handling (before/between/after) ✅
5. Accessibility features ✅

**Nice to Have (Post-Launch)**:
1. QR code mobile sync
2. WebSocket real-time (vs polling)
3. Guest reactions/emojis
4. Admin timeline override controls
5. Multi-language support (PT/EN)

---

## Technical Requirements Summary

### Frontend Dependencies
```json
{
  "dependencies": {
    "date-fns": "^3.0.0", // Time calculations
    "framer-motion": "^10.16.0", // Already installed
    "react-window": "^1.8.10", // Virtual scrolling for photos
    "qrcode.react": "^3.1.0" // QR code generation
  }
}
```

### Sanity Configuration
- Add `weddingTimelineEvent` schema (provided above)
- Create initial 5 events matching current hardcoded timeline
- Configure icon mapping for Lucide React icons

### Supabase Changes
```sql
-- Add timeline_event_id to guest_photos table
ALTER TABLE guest_photos
ADD COLUMN timeline_event_id TEXT REFERENCES wedding_timeline_events(id);

-- Create timeline_views tracking table
CREATE TABLE timeline_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_session_id UUID REFERENCES guest_sessions(id),
  device_type TEXT NOT NULL CHECK (device_type IN ('mobile', 'tv', 'tablet', 'desktop')),
  current_event_id TEXT,
  viewing_duration_seconds INTEGER,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX idx_timeline_views_viewed_at ON timeline_views(viewed_at DESC);
CREATE INDEX idx_guest_photos_timeline_event ON guest_photos(timeline_event_id);
```

### Environment Variables
```env
# Wedding Timeline Configuration
NEXT_PUBLIC_WEDDING_DATE="2025-11-20T11:30:00-03:00"
NEXT_PUBLIC_TIMELINE_UPDATE_INTERVAL_MS=30000
NEXT_PUBLIC_TV_DISPLAY_MODE=true # For TV-specific optimizations
```

---

## User Flows

### Guest Flow: Viewing Timeline on Mobile

```
1. Guest opens thousanddaysof.love/ao-vivo
   ↓
2. Sees "ACONTECENDO AGORA" prominently
   ↓
3. Scrolls down to see upcoming events
   ↓
4. Taps on current event card
   ↓
5. Sees "📸 ENVIAR FOTO" button (if allowed)
   ↓
6. Taps button → Opens camera/library
   ↓
7. Selects photo → Adds optional message
   ↓
8. Uploads → Shows success confirmation
   ↓
9. Photo appears in timeline (after admin approval)
   ↓
10. Counter updates: "32 → 33 fotos"
```

### Admin Flow: Managing Timeline Events

```
1. Admin opens Sanity Studio
   ↓
2. Navigates to "Eventos do Dia do Casamento"
   ↓
3. Creates new event:
   - Title: "Corte do Bolo"
   - Time: 15:30
   - Icon: Cake
   - Allow photos: Yes
   ↓
4. Saves and publishes
   ↓
5. Event appears in timeline automatically
   ↓
6. During wedding, admin monitors /admin/photos
   ↓
7. Approves/rejects guest photos in real-time
   ↓
8. Approved photos appear on TV display
```

### TV Display Flow: Auto-Update Loop

```
1. TV loads /ao-vivo?display=tv
   ↓
2. Fetches timeline events from Sanity
   ↓
3. Calculates current time vs event times
   ↓
4. Renders current event (large) + next events (small)
   ↓
5. Subscribes to guest_photos INSERT events
   ↓
6. Every 30 seconds:
   - Recalculate timeline state
   - Update countdown timers
   - Refresh photo gallery
   ↓
7. When new photo approved:
   - Animate photo slide-in
   - Update counter
   - Scroll photo gallery
   ↓
8. When event transitions (12:00 → next event):
   - Animate transition
   - Move completed event to bottom
   - Promote next event to "ACONTECENDO AGORA"
```

---

## Files to Create/Modify

### New Files

1. **Sanity Schema**
   - `/src/sanity/schemas/documents/weddingTimelineEvent.ts` (provided above)
   - Add to `/src/sanity/schemas/index.ts`

2. **Service Layer**
   - `/src/lib/sanity/timeline.ts` - GROQ queries for timeline events
   - `/src/lib/services/LiveTimelineService.ts` - Real-time state calculations

3. **Components**
   - `/src/components/timeline/LiveTimelineTV.tsx` - TV display (Concept 1)
   - `/src/components/timeline/LiveTimelineMobile.tsx` - Mobile display (Concept 2)
   - `/src/components/timeline/EventCard.tsx` - Reusable event card
   - `/src/components/timeline/TimelineBadge.tsx` - Status badges
   - `/src/components/timeline/PhotoUploadButton.tsx` - Upload CTA
   - `/src/components/timeline/EventPhotoGallery.tsx` - Photo grid per event

4. **Pages**
   - `/src/app/ao-vivo/timeline/page.tsx` - Main timeline page
   - `/src/app/ao-vivo/timeline/tv/page.tsx` - TV-optimized view

5. **Hooks**
   - `/src/hooks/useTimelineState.ts` - Real-time state management
   - `/src/hooks/useTimelineSync.ts` - TV-mobile sync (Phase 3)

6. **Database Migrations**
   - `/supabase/migrations/026_timeline_events.sql` - Timeline tables
   - `/supabase/migrations/027_timeline_views.sql` - Analytics tracking

### Modified Files

1. **Types**
   - `/src/types/wedding.ts` - Add `WeddingTimelineEvent`, `TimelineEventState`, `LiveTimelineData`

2. **Navigation**
   - `/src/components/ui/Navigation.tsx` - Add link to timeline (if not already in /ao-vivo)

3. **Existing Timeline**
   - `/src/components/invitations/EventTimeline.tsx` - Keep as fallback, add link to live timeline

4. **Admin**
   - `/src/app/admin/timeline/page.tsx` - Timeline event override controls (optional)

---

## Next Steps

To begin implementation:

1. **Review & Approve UX Concepts** ✅ (This document)
2. **Create Sanity Schema** - Add `weddingTimelineEvent` document type
3. **Populate Initial Events** - Migrate 5 existing events to Sanity
4. **Build Service Layer** - Timeline state calculations and queries
5. **Implement TV Display** - Concept 1 layout with auto-updates
6. **Implement Mobile View** - Concept 2 scrollable timeline
7. **Add Photo Upload** - Link to existing guest photo system
8. **Test & Iterate** - Pre-wedding testing with family
9. **Launch** - Enable for all guests 1 week before wedding
10. **Monitor & Optimize** - Real-time adjustments on wedding day

---

## Questions for Stakeholders

1. **Event Timing**: Are the 5 current event times final or subject to change?
2. **Photo Moderation**: Should timeline photos require admin approval or auto-approve?
3. **TV Setup**: Will TV be portrait or landscape? What size screen?
4. **Notifications**: Do you want push notifications when events start?
5. **Post-Wedding**: How long should timeline remain active after wedding?
6. **Language**: Portuguese only or support English toggle?
7. **Guest Access**: Should timeline be public or require invitation code?

---

## Conclusion

This research presents a comprehensive UX strategy for transforming a static timeline into an **engaging, real-time celebration platform**. By combining the best elements of all three concepts—glanceable TV display, interactive mobile experience, and real-time synchronization—we create a unified system that:

- Keeps guests informed and engaged throughout the wedding
- Celebrates shared moments through photo contributions
- Creates anticipation for upcoming events
- Provides a seamless cross-device experience
- Respects accessibility and performance requirements

The recommended hybrid approach balances ambition with feasibility, ensuring a launch-ready feature that can evolve post-wedding based on actual usage data.

**Estimated Implementation Time**: 4-5 days (1 day schema + 2 days components + 1 day integration + 1 day testing)

**Recommended Start Date**: November 1st (20 days before wedding for testing and iteration)

Ready to transform the wedding day experience from passive viewing to active celebration! 🎊
