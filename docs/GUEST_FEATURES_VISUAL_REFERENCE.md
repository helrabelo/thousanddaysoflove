# Guest Experience Features - Visual Reference
## Quick Overview of 4 New Pages

---

## Page 1: /convite - Personalized Invitation

```
┌─────────────────────────────────────────┐
│                                         │
│         Hel & Ylana                     │
│      20 de Novembro, 2025               │
│                                         │
│    ┌──────────────────────────┐        │
│    │  Olá, Maria Silva!        │        │
│    │  Você está convidado(a)   │        │
│    │  para o nosso grande dia! │        │
│    └──────────────────────────┘        │
│                                         │
│    ┌────────────────────────────────┐  │
│    │ Progresso do Convidado         │  │
│    │ ✓ RSVP confirmado              │  │
│    │ ✓ Presente selecionado         │  │
│    │ ○ Fotos enviadas               │  │
│    │ ○ Mensagens publicadas         │  │
│    │ ━━━━━━━━━━━━━━━━ 50%          │  │
│    └────────────────────────────────┘  │
│                                         │
│    📍 Local da Cerimônia                │
│    🗓️ Timeline do Evento                │
│    👔 Dress Code                         │
│    📱 Guia do Site                       │
│                                         │
│    [Confirmar Presença] [Ver Presentes] │
│                                         │
└─────────────────────────────────────────┘
```

**Key Features**:
- Personalized greeting with guest name
- Progress tracker (gamification)
- Event details and timeline
- Interactive website guide
- QR code for easy sharing
- WhatsApp share button

**URL Patterns**:
- Generic: `/convite`
- Personalized: `/convite/ABC123XYZ`

---

## Page 2: /mensagens - Guest Social Feed

```
┌─────────────────────────────────────────┐
│  Mensagens dos Convidados               │
│                                         │
│  [Filtros: Todas | Texto | Fotos | Vídeos] │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✍️ Compartilhe suas mensagens... │   │
│  │ [😀 Emoji] [📷 Upload]           │   │
│  │               [Publicar]          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 João Silva • há 2 horas       │   │
│  │                                  │   │
│  │ "Parabéns ao casal! Mal posso   │   │
│  │  esperar para celebrar com vocês!"│  │
│  │                                  │   │
│  │ [📷 3 fotos anexadas]            │   │
│  │                                  │   │
│  │ ❤️ 12  👏 5  💬 3                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👤 Maria Santos • há 5 horas     │   │
│  │                                  │   │
│  │ "Que casal lindo! 💕"            │   │
│  │                                  │   │
│  │ ❤️ 8  🎉 3  💬 1                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [Carregar mais]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Key Features**:
- Post composer with emoji picker
- Multi-file upload (images + videos)
- Like/reaction system (❤️ 👏 😂 🎉)
- Comment threads
- Filter by post type
- Infinite scroll

**Admin Moderation**:
- All posts require approval
- Keyboard shortcuts (A/R)
- Batch operations

---

## Page 3: /ao-vivo - Wedding Day Live Feed

```
┌─────────────────────────────────────────┐
│  🔴 AO VIVO - Estamos Casando!          │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 📊 Estatísticas do Dia           │   │
│  │                                  │   │
│  │ 47 Mensagens  |  89 Fotos       │   │
│  │ 125 Convidados Presentes         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ⭐ MOMENTO ESPECIAL               │   │
│  │                                  │   │
│  │ 💑 Primeira Dança                │   │
│  │ [Foto/Vídeo]                     │   │
│  │                                  │   │
│  │ ❤️ 156  👏 89                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌────────┬──────────┬──────────┐      │
│  │ Posts  │  Fotos   │ Convidados│      │
│  │ Live   │  Live    │  Grid     │      │
│  │        │          │           │      │
│  │ 📝 New │ 📷 New   │ 👤👤👤    │      │
│  │ 📝 New │ 📷 New   │ 👤👤👤    │      │
│  │ 📝     │ 📷       │ 👤👤👤    │      │
│  └────────┴──────────┴──────────┘      │
│                                         │
│  ⚡ Atualizando em tempo real...        │
│                                         │
└─────────────────────────────────────────┘
```

**Key Features**:
- Real-time post stream (Supabase subscriptions)
- Live photo gallery
- Confirmed guests grid with avatars
- Admin-pinned special moments
- Celebration statistics
- Auto-refresh fallback

**Admin Controls**:
- Pin/unpin posts
- Quick moderation
- Mobile-optimized

---

## Page 4: /meu-convite - Guest Dashboard

```
┌─────────────────────────────────────────┐
│  Olá, Maria Silva! 👋                   │
│                                         │
│  ⏰ Faltam 45 dias para o casamento     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Seu Progresso                    │   │
│  │                                  │   │
│  │ ✅ RSVP Confirmado               │   │
│  │    Você + 1 convidado            │   │
│  │                                  │   │
│  │ ✅ Presente Selecionado          │   │
│  │    Jogo de Panelas - R$ 450      │   │
│  │                                  │   │
│  │ ✅ Fotos Enviadas                │   │
│  │    3 fotos aprovadas             │   │
│  │                                  │   │
│  │ ⚠️  Mensagens Pendentes           │   │
│  │    Compartilhe seus desejos!     │   │
│  │                                  │   │
│  │ ━━━━━━━━━━━━━━━━━ 75%           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌────────────────────────────────┐    │
│  │ Ações Rápidas                   │    │
│  │                                 │    │
│  │ [✏️ Editar RSVP]                │    │
│  │ [🎁 Ver Presentes]               │    │
│  │ [📷 Enviar Mais Fotos]          │    │
│  │ [💬 Postar Mensagem]            │    │
│  └────────────────────────────────┘    │
│                                         │
│  ┌────────────────────────────────┐    │
│  │ Seu Código de Convite           │    │
│  │                                 │    │
│  │ [QR Code]    ABC123XYZ          │    │
│  │                                 │    │
│  │ [📱 Compartilhar via WhatsApp]  │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Key Features**:
- Personalized welcome
- Completion checklist with progress bar
- Event countdown timer
- Quick action buttons
- Recent activity feed
- Invite code with QR code
- WhatsApp share

---

## Mobile Navigation Enhancement

```
Desktop Navigation (Top Bar):
┌──────────────────────────────────────┐
│ [Logo] Início | História | Galeria | │
│ Presentes | Mensagens | Meu Convite  │
└──────────────────────────────────────┘

Mobile Navigation (Bottom Bar):
┌──────────────────────────────────────┐
│ [🏠]  [📖]  [📷]  [💬]  [👤 75%]    │
│ Início História Galeria Msg  Perfil  │
└──────────────────────────────────────┘

Floating Action Button (Mobile):
        ┌────┐
        │ + │  ← Upload, Post, Share
        └────┘
```

**Navigation Features**:
- Desktop: Traditional top navigation
- Mobile: Bottom navigation bar (sticky)
- Progress badge on profile icon
- Floating action button (FAB) for quick actions

---

## Database Architecture

```
┌─────────────────────────────────────────┐
│           SUPABASE TABLES               │
│                                         │
│  invitations                            │
│  ├─ code (unique)                       │
│  ├─ guest_id                            │
│  ├─ relationship_type                   │
│  ├─ custom_message                      │
│  ├─ qr_code_url                         │
│  └─ tracking (opened, times_opened)     │
│                                         │
│  guest_posts                            │
│  ├─ content (max 500 chars)             │
│  ├─ media_urls[] (array)                │
│  ├─ post_type (text/image/video/mixed) │
│  ├─ status (pending/approved/rejected)  │
│  ├─ likes_count, comments_count         │
│  └─ moderation (reason, moderated_by)   │
│                                         │
│  post_reactions                         │
│  ├─ post_id                             │
│  ├─ guest_session_id                    │
│  └─ reaction_type (heart/clap/laugh)    │
│                                         │
│  post_comments                          │
│  ├─ post_id                             │
│  ├─ parent_comment_id (nested replies)  │
│  ├─ content (max 300 chars)             │
│  └─ guest_session_id                    │
│                                         │
│  pinned_posts                           │
│  ├─ post_id                             │
│  ├─ moment_category (ceremony/dance)    │
│  └─ display_order                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## Admin Pages Architecture

```
┌─────────────────────────────────────────┐
│         ADMIN DASHBOARD (/admin)        │
│                                         │
│  Existing Pages:                        │
│  ├─ /admin/guests      (Guest RSVP)     │
│  ├─ /admin/photos      (Photo Moderation)│
│  ├─ /admin/presentes   (Gift Registry)  │
│  ├─ /admin/pagamentos  (Payments)       │
│  └─ /admin/analytics   (Stats)          │
│                                         │
│  New Pages:                             │
│  ├─ /admin/convites    (Invitations)    │
│  │   ├─ Generate codes                  │
│  │   ├─ CSV import                      │
│  │   ├─ Track opens                     │
│  │   └─ Send emails                     │
│  │                                      │
│  └─ /admin/posts       (Post Moderation)│
│      ├─ Approve/reject (A/R shortcuts)  │
│      ├─ Batch operations                │
│      ├─ Pin special moments             │
│      └─ View comments/reactions         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Implementation Flow Diagram

```
Phase 1 (Week 1): Foundation
┌──────────────────────────────────┐
│ 1. Database Migrations           │
│    ├─ invitations table          │
│    ├─ guest_posts table          │
│    ├─ reactions/comments tables  │
│    └─ pinned_posts table         │
│                                  │
│ 2. /convite Page                 │
│    ├─ Generic version            │
│    ├─ Personalized version       │
│    ├─ Invite code validation     │
│    └─ Progress tracker           │
│                                  │
│ 3. /admin/convites               │
│    ├─ Code generation            │
│    ├─ CSV import                 │
│    └─ Analytics                  │
└──────────────────────────────────┘
              ↓
Phase 2 (Week 2): Social Features
┌──────────────────────────────────┐
│ 1. Post Composer                 │
│    ├─ Rich text editor           │
│    ├─ Emoji picker               │
│    └─ File upload                │
│                                  │
│ 2. /mensagens Page               │
│    ├─ Post feed                  │
│    ├─ Filters                    │
│    ├─ Reactions                  │
│    └─ Comments                   │
│                                  │
│ 3. /admin/posts                  │
│    ├─ Moderation queue           │
│    └─ Batch operations           │
└──────────────────────────────────┘
              ↓
Phase 3 (Week 3): Live Feed
┌──────────────────────────────────┐
│ 1. Real-time Setup               │
│    ├─ Supabase subscriptions     │
│    └─ Fallback polling           │
│                                  │
│ 2. /ao-vivo Page                 │
│    ├─ Live post stream           │
│    ├─ Live photo gallery         │
│    ├─ Guests grid                │
│    └─ Special moments            │
│                                  │
│ 3. Admin Controls                │
│    └─ Pin/unpin system           │
└──────────────────────────────────┘
              ↓
Phase 4 (Week 4): Polish
┌──────────────────────────────────┐
│ 1. /meu-convite Dashboard        │
│    ├─ Progress checklist         │
│    ├─ Quick actions              │
│    └─ QR code                    │
│                                  │
│ 2. Enhanced Navigation           │
│    ├─ Mobile bottom nav          │
│    └─ FAB                        │
│                                  │
│ 3. Testing & Launch              │
│    ├─ E2E tests                  │
│    ├─ Mobile testing             │
│    └─ Rollout plan               │
└──────────────────────────────────┘
```

---

## User Journey Flow

```
Guest Receives Invitation Email
    ↓
Opens Link → /convite/ABC123XYZ
    ↓
Sees Personalized Welcome
    ↓
┌─────────────────────────────┐
│ Completes RSVP (25% done)   │
│     ↓                       │
│ Selects Gift (50% done)     │
│     ↓                       │
│ Uploads Photos (75% done)   │
│     ↓                       │
│ Posts Message (100% done!)  │
└─────────────────────────────┘
    ↓
Views /meu-convite Dashboard
    ↓
Tracks Progress Until Wedding
    ↓
Wedding Day → /ao-vivo Live Feed
    ↓
Posts Real-time Messages/Photos
    ↓
Post-Wedding → Receives Thank You
```

---

## Key Metrics Dashboard

```
┌───────────────────────────────────────┐
│    GUEST ENGAGEMENT METRICS           │
│                                       │
│  Invitation Metrics:                  │
│  ├─ 85% Open Rate                     │
│  ├─ Avg 36hrs Time to RSVP            │
│  └─ 92% Completion Rate               │
│                                       │
│  Social Activity:                     │
│  ├─ 47% Guests Posted Messages        │
│  ├─ 2.3 Avg Posts per Guest           │
│  ├─ 68% Guests Uploaded Photos        │
│  └─ 4.1 Avg Photos per Guest          │
│                                       │
│  Wedding Day:                         │
│  ├─ 78% Concurrent Users              │
│  ├─ 23 Posts per Hour                 │
│  ├─ 156 Total Photos Uploaded         │
│  └─ 99.2% Real-time Success Rate      │
│                                       │
│  Dashboard Engagement:                │
│  ├─ 54% Completed All Actions         │
│  ├─ 3.2 Avg Return Visits             │
│  └─ 12min Avg Session Duration        │
│                                       │
└───────────────────────────────────────┘
```

---

## Quick Start Commands

```bash
# Review full documentation
cat docs/GUEST_EXPERIENCE_ROADMAP.md
cat docs/IMPLEMENTATION_SUMMARY.md

# Create feature branch
git checkout -b feature/guest-experience-phase-1

# Create database migrations
npm run db:generate

# Start development
npm run dev

# Open Supabase Studio
npm run supabase:studio
```

---

**Ready to transform your wedding website?**

Start with Phase 1 (/convite page) and ship incrementally!

All detailed specifications in: `/docs/GUEST_EXPERIENCE_ROADMAP.md`
