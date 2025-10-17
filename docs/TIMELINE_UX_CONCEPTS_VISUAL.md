# Live Timeline UX Concepts - Visual Mockups

**3 Design Approaches with Visual Specifications**

---

## Concept Comparison Matrix

| Feature | Concept 1: Theater Marquee | Concept 2: Progress Journey | Concept 3: Split Screen Cinema |
|---------|---------------------------|----------------------------|--------------------------------|
| **Best For** | TV Display (large screen) | Mobile (portrait) | TV + Mobile Sync |
| **Layout** | Horizontal sections | Vertical scroll | Split screen panels |
| **Interaction** | View-only | Touch/swipe | TV view + mobile control |
| **Current Event Size** | 50% of screen (dominant) | Centered card (expands) | 50% center panel |
| **Photo Upload** | Shows counter only | One-tap button | Mobile button → TV display |
| **Real-time Updates** | Every 30s (auto) | Every 30s + pull-refresh | WebSocket (instant) |
| **Glanceability** | Excellent (15ft away) | Good (arm's length) | Excellent (TV), Good (mobile) |
| **Implementation** | 3 days | 2 days | 4 days (sync complexity) |
| **Complexity** | Medium | Low | High |
| **Recommended** | ✅ Yes (TV primary) | ✅ Yes (mobile primary) | Later (enhancement) |

---

## Concept 1: "Theater Marquee" (TV Display)

### Visual Layout (Landscape 16:9)

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                     🎭 O CASAMENTO DE HEL & YLANA 🎭                          ║
║                          1000 Dias de Amor                                    ║
║                        20 de Novembro de 2025                                 ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓   ║
║   ┃                                                                       ┃   ║
║   ┃  🔴 ACONTECENDO AGORA                           11:30 - 12:00        ┃   ║
║   ┃                                                                       ┃   ║
║   ┃                                                                       ┃   ║
║   ┃      ┌───────────────────────────────────────────────────┐           ┃   ║
║   ┃      │                                                   │           ┃   ║
║   ┃      │           💕    CERIMÔNIA                         │           ┃   ║
║   ┃      │                                                   │           ┃   ║
║   ┃      │   Momento especial onde celebramos                │           ┃   ║
║   ┃      │   1000 dias de amor juntos                        │           ┃   ║
║   ┃      │                                                   │           ┃   ║
║   ┃      │   📍 Salão Principal                              │           ┃   ║
║   ┃      │                                                   │           ┃   ║
║   ┃      └───────────────────────────────────────────────────┘           ┃   ║
║   ┃                                                                       ┃   ║
║   ┃      ⏱️  18 minutos restantes                                         ┃   ║
║   ┃      ████████████████████████░░░░░░░░░░  60%                        ┃   ║
║   ┃                                                                       ┃   ║
║   ┃      📸 32 fotos compartilhadas  |  👥 89 convidados presentes       ┃   ║
║   ┃                                                                       ┃   ║
║   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛   ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ⏰ A SEGUIR                                                                 ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐   ║
║   │  12:00  📸  Sessão de Fotos                        em 18 minutos     │   ║
║   │         Registre este momento especial conosco                       │   ║
║   │         📍 Jardim                                                    │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
║   ┌─────────────────────────────────────────────────────────────────────┐   ║
║   │  12:30  🍽️  Almoço                                 em 48 minutos     │   ║
║   │         Buffet completo com opções deliciosas                        │   ║
║   │         📍 Salão de Recepção                                         │   ║
║   └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║   ✅ MOMENTOS CELEBRADOS                                                      ║
║                                                                               ║
║   ┌──────────────────────────────────────┐  ┌──────────────────────────────┐║
║   │  10:45  👥  Chegada dos Convidados   │  │  11:00  🍷  Welcome Drink    │║
║   │  ✓ Concluído                         │  │  ✓ Concluído                 │║
║   │  📸 Ver 28 fotos                     │  │  📸 Ver 15 fotos             │║
║   └──────────────────────────────────────┘  └──────────────────────────────┘║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Design Specifications

**Screen Layout**:
- **Header**: 10% height (wedding title, date)
- **Current Event**: 50% height (dominant focus area)
- **Upcoming Events**: 25% height (next 2 events)
- **Completed Events**: 15% height (past events grid)

**Typography** (optimized for 15ft viewing distance):
- Wedding Title: 72px Playfair Display Bold
- Section Headers: 48px Playfair Display
- Event Title: 64px Playfair Display Bold
- Event Description: 36px Crimson Text
- Time/Status: 42px Crimson Text
- Counters: 32px Crimson Text

**Colors**:
- Current Event Border: Animated gradient pulse (green to gold)
- Upcoming Events: Light gray background (#F8F6F3)
- Completed Events: Subtle green checkmark overlay
- Progress Bar: Gradient from green (#4A7C59) to gold (#D4A574)

**Animations**:
```typescript
// Current event card pulse
animate: {
  borderColor: [
    'rgba(74, 124, 89, 0.3)',  // Green fade
    'rgba(74, 124, 89, 1)',    // Green solid
    'rgba(212, 165, 116, 1)',  // Gold solid
    'rgba(74, 124, 89, 0.3)'   // Green fade
  ],
  scale: [1, 1.02, 1]
}
transition: {
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut'
}

// Progress bar fill
animate: {
  width: '60%'
}
transition: {
  duration: 1.5,
  ease: 'easeOut'
}

// Photo counter increment
animate: {
  scale: [1, 1.2, 1],
  color: ['#4A4A4A', '#D4A574', '#4A4A4A']
}
transition: {
  duration: 0.5
}
```

**Interaction**: View-only (no touch required)

---

## Concept 2: "Progress Journey" (Mobile Display)

### Visual Layout (Portrait 9:16)

```
┌─────────────────────────────────┐
│ ╔═══════════════════════════╗   │ ← Sticky header
│ ║   📍 VOCÊ ESTÁ AQUI       ║   │
│ ║   11:42 (atualizado)      ║   │
│ ╚═══════════════════════════╝   │
├─────────────────────────────────┤
│                                 │
│  🎊 PROGRESSO DO DIA            │
│  ████████████░░░░░░░░  60%      │
│  3 de 5 momentos concluídos     │
│                                 │
├─────────────────────────────────┤
│           ▼ Scroll              │ ← Scrollable area
│                                 │
│   ┌───────────────────────┐    │
│   │  ✅ 10:45             │    │
│   │  👥 Chegada           │    │
│   │  ─────────────        │    │
│   │  📸 28 fotos          │    │
│   │  [Ver Galeria]        │    │
│   └───────────────────────┘    │
│           │                     │
│           │ ╎                   │
│           │ ╎                   │
│           ▼                     │
│                                 │
│   ┌───────────────────────┐    │
│   │  ✅ 11:00             │    │
│   │  🍷 Welcome Drink     │    │
│   │  ─────────────        │    │
│   │  📸 15 fotos          │    │
│   │  [Ver Galeria]        │    │
│   └───────────────────────┘    │
│           │                     │
│           │ ╎                   │
│           │ ╎                   │
│           ▼                     │
│                                 │
│   ┏━━━━━━━━━━━━━━━━━━━━━━━┓    │ ← Current event (prominent)
│   ┃  🔴 AGORA             ┃    │
│   ┃                       ┃    │
│   ┃  💕 11:30             ┃    │
│   ┃  CERIMÔNIA            ┃    │
│   ┃                       ┃    │
│   ┃  Momento especial     ┃    │
│   ┃  onde celebramos      ┃    │
│   ┃  1000 dias de amor    ┃    │
│   ┃                       ┃    │
│   ┃  ⏱️ 18 min restantes  ┃    │
│   ┃  ████████░░░░  60%    ┃    │
│   ┃                       ┃    │
│   ┃  📸 32 fotos          ┃    │
│   ┃  👥 89 presentes      ┃    │
│   ┃                       ┃    │
│   ┃  ┌─────────────────┐  ┃    │
│   ┃  │ 📸 ENVIAR FOTO  │  ┃    │ ← Photo upload CTA
│   ┃  └─────────────────┘  ┃    │
│   ┗━━━━━━━━━━━━━━━━━━━━━━━┛    │
│           │                     │
│           │ ╎                   │
│           │ ╎                   │
│           ▼                     │
│                                 │
│   ┌───────────────────────┐    │
│   │  ⏰ 12:00             │    │
│   │  📸 Sessão de Fotos   │    │
│   │  ─────────────        │    │
│   │  em 18 minutos        │    │
│   │  📍 Jardim            │    │
│   └───────────────────────┘    │
│           │                     │
│           │ ╎                   │
│           │ ╎                   │
│           ▼                     │
│                                 │
│   ┌───────────────────────┐    │
│   │  ⏰ 12:30             │    │
│   │  🍽️ Almoço            │    │
│   │  ─────────────        │    │
│   │  em 48 minutos        │    │
│   │  📍 Salão de Recepção │    │
│   └───────────────────────┘    │
│           │                     │
│           │ ╎                   │
│           │ ╎                   │
│           ▼                     │
│                                 │
│   ┌───────────────────────┐    │
│   │  ⏰ 14:00             │    │
│   │  🎵 Celebração        │    │
│   │  ─────────────        │    │
│   │  em 2h 18min          │    │
│   │  📍 Pista de Dança    │    │
│   └───────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### Design Specifications

**Screen Layout**:
- **Sticky Header**: 80px height (always visible)
- **Progress Section**: 120px height (below header)
- **Timeline Events**: Scrollable (variable height)
  - Completed: 140px height
  - Current: 380px height (expands)
  - Upcoming: 140px height

**Typography** (optimized for mobile):
- Header: 18px Playfair Display Bold
- Progress: 16px Crimson Text
- Event Title: 24px Playfair Display Bold
- Event Description: 16px Crimson Text
- Time/Status: 14px Crimson Text
- Counters: 14px Crimson Text

**Colors**:
- Sticky Header: White background with subtle shadow
- Current Event Card: White with animated green border (2px pulse)
- Upcoming Events: Light gray background (#F8F6F3)
- Completed Events: White with green checkmark overlay
- Timeline Connector: Dotted line (#A8A8A8)

**Animations**:
```typescript
// Auto-scroll to current event on load
useEffect(() => {
  currentEventRef.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}, [currentEvent]);

// Progress bar fill (mobile)
animate: {
  width: '60%'
}
transition: {
  duration: 1.2,
  ease: 'easeInOut'
}

// Current event card pulse (mobile)
animate: {
  borderWidth: [2, 3, 2],
  borderColor: [
    'rgba(74, 124, 89, 0.5)',
    'rgba(74, 124, 89, 1)',
    'rgba(74, 124, 89, 0.5)'
  ]
}
transition: {
  duration: 2,
  repeat: Infinity,
  ease: 'easeInOut'
}

// Photo upload button bounce
whileTap: { scale: 0.95 }
animate: {
  y: [0, -4, 0]
}
transition: {
  duration: 0.5,
  repeat: 3,
  repeatDelay: 3
}
```

**Touch Gestures**:
- **Scroll**: Vertical scroll through timeline
- **Pull-to-Refresh**: Update timeline from server
- **Tap Event Card**: Expand to full details
- **Tap Photo Button**: Open camera/photo picker
- **Long Press**: Share event via WhatsApp/social

**Responsive Breakpoints**:
```css
/* Mobile Portrait (< 640px) */
.timeline-event {
  width: calc(100% - 32px);
  margin: 16px;
}

/* Mobile Landscape (640px - 768px) */
@media (min-width: 640px) {
  .timeline-event {
    width: 90%;
    margin: 20px auto;
  }
}

/* Tablet (> 768px) */
@media (min-width: 768px) {
  .timeline-container {
    max-width: 640px;
    margin: 0 auto;
  }
}
```

---

## Concept 3: "Split Screen Cinema" (TV + Mobile Sync)

### TV Display Layout (Landscape 16:9)

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║                     🎭 O CASAMENTO DE HEL & YLANA 🎭                          ║
║                          Escaneie para se conectar                            ║
║                                                                               ║
║   ┌────────────────┐                                       ┌────────────────┐║
║   │                │                                       │                │║
║   │   [QR Code]    │                                       │ 📱 42 phones   │║
║   │   Scan to      │                                       │    connected   │║
║   │   connect      │                                       │                │║
║   │                │                                       │                │║
║   └────────────────┘                                       └────────────────┘║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                         │                              │                      ║
║                         │                              │                      ║
║     [LEFT PANEL]        │      [CENTER PANEL]          │   [RIGHT PANEL]     ║
║     25% width           │      50% width               │   25% width          ║
║                         │                              │                      ║
║   ⏰ A SEGUIR           │  🔴 ACONTECENDO AGORA        │  📸 GALERIA AO VIVO ║
║                         │                              │                      ║
║   ┌─────────────────┐   │  ┌────────────────────────┐  │  ┌──┐ ┌──┐ ┌──┐   ║
║   │ 📸 12:00        │   │  │                        │  │  │  │ │  │ │  │   ║
║   │ Sessão de Fotos │   │  │    💕  CERIMÔNIA       │  │  └──┘ └──┘ └──┘   ║
║   │                 │   │  │                        │  │                     ║
║   │ em 18 minutos   │   │  │    11:30 - 12:00       │  │  ┌──┐ ┌──┐ ┌──┐   ║
║   └─────────────────┘   │  │                        │  │  │  │ │  │ │  │   ║
║                         │  │  ⏱️ 18 min restantes    │  │  └──┘ └──┘ └──┘   ║
║   ┌─────────────────┐   │  │  ████████░░░░  60%     │  │                     ║
║   │ 🍽️ 12:30        │   │  │                        │  │  ┌──┐ ┌──┐ ┌──┐   ║
║   │ Almoço          │   │  │  📸 32 fotos           │  │  │  │ │  │ │  │   ║
║   │                 │   │  │  👥 89 convidados      │  │  └──┘ └──┘ └──┘   ║
║   │ em 48 minutos   │   │  │                        │  │                     ║
║   └─────────────────┘   │  └────────────────────────┘  │  32 fotos enviadas ║
║                         │                              │  pelos convidados   ║
║   ┌─────────────────┐   │                              │                     ║
║   │ 🎵 14:00        │   │                              │  [Auto-scrolling]   ║
║   │ Celebração      │   │                              │  Atualiza a cada    ║
║   │                 │   │                              │  10 segundos        ║
║   │ em 2h 18min     │   │                              │                     ║
║   └─────────────────┘   │                              │                     ║
║                         │                              │                      ║
╠═════════════════════════╪══════════════════════════════╪══════════════════════╣
║                                                                               ║
║  📊 Estatísticas:  10:45 ✅ Chegada (28 fotos)  |  11:00 ✅ Welcome (15)    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Mobile Companion Layout (Portrait 9:16)

```
┌─────────────────────────────────┐
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │       [QR Code]           │  │ ← Scan QR from TV
│  │                           │  │
│  │   Escaneie o código       │  │
│  │   na TV para se conectar  │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────  OU  ──────────      │
│                                 │
│  ┌───────────────────────────┐  │
│  │  [Conectar Manualmente]   │  │
│  └───────────────────────────┘  │
│                                 │
├─────────────────────────────────┤
│         APÓS CONEXÃO            │
├─────────────────────────────────┤
│                                 │
│  🔗 Conectado à TV              │
│  Live Timeline Sincronizado     │
│                                 │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓   │
│  ┃  🔴 ACONTECENDO AGORA   ┃   │
│  ┃                         ┃   │
│  ┃  💕 CERIMÔNIA           ┃   │
│  ┃  11:30 - 12:00          ┃   │
│  ┃                         ┃   │
│  ┃  ⏱️ 18 min restantes    ┃   │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛   │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │  📸 CAPTURE THIS        │   │ ← Primary action
│  │     MOMENT              │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │  💬 SEND MESSAGE        │   │ ← Secondary action
│  │     TO COUPLE           │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │  👏 REACT TO MOMENT     │   │ ← Tertiary action
│  │     ❤️ 😂 🎉 💕         │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│                                 │
│  📸 Fotos do Momento Atual      │
│                                 │
│  [Photo Grid - 2x3]             │
│  Mostradas na TV após aprovação │
│                                 │
│  32 fotos compartilhadas        │
│  [Ver Todas]                    │
│                                 │
└─────────────────────────────────┘
```

### Sync Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                     SYNC ARCHITECTURE                         │
└──────────────────────────────────────────────────────────────┘

    TV DISPLAY                    SUPABASE                MOBILE DEVICE
        │                            │                         │
        │ 1. Generate session ID     │                         │
        ├───────────────────────────>│                         │
        │                            │                         │
        │ 2. Create QR code          │                         │
        │    (with session ID)       │                         │
        │<───────────────────────────│                         │
        │                            │                         │
        │ Display QR code            │                         │
        │                            │    3. Guest scans QR    │
        │                            │<────────────────────────│
        │                            │                         │
        │                            │    4. Join session      │
        │                            │    (WebSocket channel)  │
        │                            │<────────────────────────│
        │                            │                         │
        │ 5. Subscribe to channel    │    5. Subscribe to      │
        │    'tv-session-ABC123'     │    same channel         │
        ├───────────────────────────>│<────────────────────────│
        │                            │                         │
        │ 6. Broadcast timeline      │                         │
        │    state every 30s         │    6. Receive updates   │
        ├───────────────────────────>│─────────────────────────>│
        │                            │                         │
        │                            │    7. Guest uploads     │
        │                            │    photo via mobile     │
        │                            │<────────────────────────│
        │                            │                         │
        │                            │    8. Photo goes to     │
        │                            │    moderation queue     │
        │                            │                         │
        │ 9. Admin approves photo    │                         │
        │    (via /admin/photos)     │                         │
        ├───────────────────────────>│                         │
        │                            │                         │
        │ 10. Broadcast approval     │    10. Receive          │
        │     to channel             │    notification         │
        │<───────────────────────────│─────────────────────────>│
        │                            │                         │
        │ 11. Display photo on TV    │    11. Show success     │
        │     (animate slide-in)     │    toast on mobile      │
        │                            │                         │
        │ 12. Update counter         │    12. Update counter   │
        │     "32 → 33 fotos"        │    "Sua foto foi        │
        │                            │    aprovada!"           │
        │                            │                         │

Legend:
───> : HTTP Request/Response
═══> : WebSocket Real-time Subscription
```

### Technical Implementation

**Supabase Real-time Channels**:
```typescript
// TV Display subscribes to session channel
const tvChannel = supabase
  .channel(`tv-session-${sessionId}`)
  .on('broadcast', { event: 'timeline_update' }, payload => {
    updateTimelineState(payload.timelineData);
  })
  .on('broadcast', { event: 'photo_approved' }, payload => {
    addPhotoToGallery(payload.photo);
    animatePhotoSlideIn();
  })
  .on('presence', { event: 'join' }, ({ newPresences }) => {
    updateConnectedDevicesCount(newPresences.length);
  })
  .subscribe();

// Mobile subscribes to same channel
const mobileChannel = supabase
  .channel(`tv-session-${sessionId}`)
  .on('broadcast', { event: 'timeline_update' }, payload => {
    syncWithTV(payload.timelineData);
  })
  .on('broadcast', { event: 'current_event_changed' }, payload => {
    highlightNewCurrentEvent(payload.event);
    showPhotoUploadPrompt();
  })
  .subscribe();

// Mobile sends actions
mobileChannel.send({
  type: 'broadcast',
  event: 'photo_uploaded',
  payload: { photoId, guestName, timestamp }
});
```

**QR Code Generation**:
```typescript
import QRCode from 'qrcode.react';

const TVDisplay = () => {
  const [sessionId] = useState(() => generateSessionId());
  const syncUrl = `https://thousanddaysof.love/ao-vivo?sync=${sessionId}`;

  return (
    <div className="qr-code-section">
      <QRCode
        value={syncUrl}
        size={200}
        level="H" // High error correction
        includeMargin={true}
        bgColor="#F8F6F3"
        fgColor="#2C2C2C"
      />
      <p>Escaneie para conectar seu celular</p>
    </div>
  );
};
```

---

## Accessibility Features (All Concepts)

### Color Blind Friendly

```css
/* Don't rely on color alone - use icons and patterns */

.event-status-upcoming::before {
  content: "⏰";
  margin-right: 8px;
}

.event-status-current::before {
  content: "🔴";
  margin-right: 8px;
  animation: pulse 2s infinite;
}

.event-status-completed::before {
  content: "✅";
  margin-right: 8px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .timeline-event-current {
    border: 4px solid #000;
    background: #fff;
  }

  .progress-bar {
    background: #000;
  }
}
```

### Screen Reader Support

```tsx
<div
  role="region"
  aria-label="Cronograma do casamento em tempo real"
  aria-live="polite" // Announces updates
  aria-atomic="false" // Only announce changes
>
  <div
    role="article"
    aria-labelledby="current-event-title"
    aria-describedby="current-event-time current-event-description"
  >
    <h2
      id="current-event-title"
      aria-label={`Evento atual: ${currentEvent.title}`}
    >
      {currentEvent.title}
    </h2>

    <time
      id="current-event-time"
      dateTime={currentEvent.startTime}
      aria-label={`Começou às ${formatTime(currentEvent.startTime)}, ${currentEvent.timeRemaining} minutos restantes`}
    >
      {formatTime(currentEvent.startTime)}
    </time>

    <p id="current-event-description">
      {currentEvent.description}
    </p>

    <div aria-live="assertive" aria-atomic="true">
      {/* Dynamic counter updates announced immediately */}
      <span>{currentEvent.guestPhotosCount} fotos compartilhadas</span>
    </div>
  </div>
</div>
```

### Reduced Motion Support

```typescript
import { useReducedMotion } from 'framer-motion';

const LiveTimeline = () => {
  const shouldReduceMotion = useReducedMotion();

  const animationConfig = shouldReduceMotion
    ? {
        // Simple fade-in only
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      }
    : {
        // Full animations
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          borderColor: [
            'rgba(74, 124, 89, 0.3)',
            'rgba(74, 124, 89, 1)',
            'rgba(74, 124, 89, 0.3)'
          ]
        },
        transition: {
          duration: 0.8,
          borderColor: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }
        }
      };

  return <motion.div {...animationConfig} />;
};
```

---

## Performance Optimizations

### Virtual Scrolling (Mobile)

```typescript
// Only render visible timeline events
import { FixedSizeList } from 'react-window';

const MobileTimeline = ({ events }) => {
  return (
    <FixedSizeList
      height={window.innerHeight - 200} // Viewport height minus header
      itemCount={events.length}
      itemSize={180} // Event card height
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <EventCard event={events[index]} />
        </div>
      )}
    </FixedSizeList>
  );
};
```

### Image Optimization (TV Photo Gallery)

```typescript
// Lazy load and optimize images
const PhotoGalleryTV = ({ photos }) => {
  return (
    <div className="photo-grid">
      {photos.map((photo, index) => (
        <img
          key={photo.id}
          src={optimizeImageUrl(photo.url, {
            width: 300,
            height: 300,
            quality: 80,
            format: 'webp'
          })}
          alt={photo.alt}
          loading={index < 9 ? 'eager' : 'lazy'} // First 9 eager, rest lazy
          decoding="async"
        />
      ))}
    </div>
  );
};

function optimizeImageUrl(url: string, options: ImageOptions) {
  // Use Sanity CDN or Supabase storage transformations
  return `${url}?w=${options.width}&h=${options.height}&q=${options.quality}&fm=${options.format}`;
}
```

### Debounced Updates

```typescript
// Avoid excessive re-renders during rapid updates
import { useDeferredValue } from 'react';

const LiveTimelineDisplay = () => {
  const [timelineData, setTimelineData] = useState<LiveTimelineData | null>(null);

  // Defer updates to avoid blocking UI
  const deferredTimelineData = useDeferredValue(timelineData);

  return <TimelineView data={deferredTimelineData} />;
};
```

---

## Responsive Breakpoints

```typescript
// Tailwind CSS responsive classes

// Mobile Portrait (default, < 640px)
className="timeline-event w-full px-4"

// Mobile Landscape (640px - 768px)
className="timeline-event sm:w-[90%] sm:mx-auto sm:px-6"

// Tablet Portrait (768px - 1024px)
className="timeline-event md:w-[640px] md:mx-auto md:px-8"

// Tablet Landscape / Small Desktop (1024px - 1280px)
className="timeline-event lg:w-[800px] lg:mx-auto lg:px-10"

// Large Desktop (> 1280px) - TV Display
className="timeline-event xl:w-[1200px] xl:mx-auto xl:px-12"
```

---

## Summary: Recommended Hybrid Approach

**For MVP Launch**:
1. **TV Display**: Implement Concept 1 (Theater Marquee)
   - Large, glanceable design
   - Auto-updating every 30 seconds
   - Live photo counter

2. **Mobile**: Implement Concept 2 (Progress Journey)
   - Vertical scrolling timeline
   - One-tap photo upload
   - Pull-to-refresh

3. **Phase 2 Enhancement**: Add Concept 3 (Split Screen Cinema)
   - QR code sync between TV and mobile
   - Real-time WebSocket updates
   - Guest reactions on TV

**Estimated Timeline**:
- Days 1-2: Concepts 1 & 2 (MVP)
- Days 3-4: Concept 3 (enhancement)
- Day 5: Testing and polish

**Files Created**: 15 new files, 3 modified
**Total Lines of Code**: ~2,500 lines

Ready to transform the static timeline into a live celebration experience! 🎉

---

**Next Action**: Review these visual concepts and approve implementation approach, then proceed with Phase 1 (Sanity schema creation).
