# Sistema de Mídias - Roadmap & Arquitetura

## Status Atual (v1.0)

### ✅ Implementado
- Upload de **1 imagem** por evento da timeline
- Suporte para **fotos** (PNG, JPG, JPEG)
- Suporte para **vídeos** (MP4, MOV)
- **Compressão automática** de imagens grandes (>2MB)
- Redimensionamento para max 1920x1080
- **Progress bar** durante upload
- Limite de **15MB** por arquivo
- Preview em tempo real
- Storage no Supabase (`wedding-photos` bucket)
- Fallback para URLs externas

### Componente Atual
```typescript
<MediaManager
  currentMediaUrl={image_url}
  currentMediaType="image"
  onMediaUploaded={(url, type) => setEditForm({ ...editForm, image_url: url })}
  allowVideo={true}
  folder="timeline"
  maxSizeMB={15}
/>
```

---

## Roadmap Futuro

### v2.0 - Múltiplas Mídias por Evento

#### Schema Changes Needed
```sql
-- Criar nova tabela para múltiplas mídias
CREATE TABLE timeline_event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
  media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
  media_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manter image_url em timeline_events como mídia principal (backward compatibility)
```

#### Novo Componente: `MultiMediaManager`
```typescript
<MultiMediaManager
  eventId={event.id}
  maxMedia={10}
  autoCarousel={true}
  carouselInterval={5000}
  onMediaUpdated={(mediaList) => { /* callback */ }}
/>
```

**Features:**
- Upload de múltiplas fotos/vídeos
- Drag & drop para reordenar
- Caption por mídia
- Definir mídia principal
- Preview em grid

### v3.0 - Carousel Automático no Frontend

#### Timeline Display Enhancement
```typescript
<TimelineEventCard event={event}>
  {event.media.length > 1 ? (
    <AutoCarousel media={event.media} interval={5000} />
  ) : (
    <SingleMedia url={event.image_url} type={event.media_type} />
  )}
</TimelineEventCard>
```

**Features:**
- Transições suaves entre mídias
- Indicadores de posição (dots)
- Auto-play opcional
- Pausa ao hover
- Swipe gesture em mobile

---

## Arquitetura Proposta

### Database Schema Evolution

```sql
-- FASE 1: Adicionar suporte a múltiplas mídias (mantém compatibilidade)
ALTER TABLE timeline_events
  ADD COLUMN media_type VARCHAR(10) DEFAULT 'photo'
  CHECK (media_type IN ('photo', 'video'));

-- FASE 2: Nova tabela para mídias adicionais
CREATE TABLE timeline_event_media (...);

-- FASE 3: Migration gradual
-- 1. Copiar image_url existentes para timeline_event_media
-- 2. Manter image_url como mídia principal por compatibilidade
-- 3. Frontend decide: usar image_url OU timeline_event_media
```

### Component Hierarchy

```
MediaManager (atual - 1 mídia)
    ↓
MultiMediaManager (futuro - múltiplas mídias)
    ├── MediaUploadZone
    ├── MediaGrid (preview)
    │   ├── MediaCard
    │   │   ├── RemoveButton
    │   │   ├── CaptionInput
    │   │   └── DragHandle
    │   └── AddMoreButton
    └── MediaReorder (drag & drop)

AutoCarousel (frontend display)
    ├── MediaSlide
    ├── NavigationDots
    ├── PrevNextButtons
    └── AutoPlayControl
```

---

## Migration Strategy (Sem Breaking Changes)

### Fase 1: Add Video Support (✅ DONE)
- Timeline já aceita vídeos
- Campo `media_type` futuro preparado
- Storage configurado

### Fase 2: Múltiplas Mídias (Futuro)
1. Criar `timeline_event_media` table
2. Backend: Endpoint para gerenciar múltiplas mídias
3. Admin: Novo componente `MultiMediaManager`
4. Manter `image_url` como fallback

### Fase 3: Carousel Frontend (Futuro)
1. Componente `AutoCarousel`
2. Timeline detecta: `media.length > 1` → carousel
3. Mobile: Swipe gestures
4. Desktop: Auto-play com hover pause

---

## Estimativa de Esforço

| Feature | Complexidade | Tempo Estimado |
|---------|--------------|----------------|
| v2.0 - Múltiplas Mídias | Média | 6-8 horas |
| v3.0 - Carousel Automático | Baixa | 3-4 horas |
| Migration + Testing | Média | 4 horas |
| **Total** | - | **~15 horas** |

---

## Melhorias Imediatas Possíveis

### Compressão de Vídeos
```typescript
// Usar ffmpeg.wasm para comprimir vídeos grandes
import { createFFmpeg } from '@ffmpeg/ffmpeg'

const compressVideo = async (file: File) => {
  const ffmpeg = createFFmpeg({ log: true })
  await ffmpeg.load()
  // Compress to 720p, 2Mbps
  await ffmpeg.run('-i', 'input.mp4', '-vf', 'scale=1280:720', '-b:v', '2M', 'output.mp4')
}
```

### Lazy Loading
```typescript
// Carregar mídias sob demanda
<img
  src={mediaUrl}
  loading="lazy"
  decoding="async"
/>
```

### Progressive Image Loading
```typescript
// Mostrar blur placeholder primeiro
<Image
  src={mediaUrl}
  placeholder="blur"
  blurDataURL={thumbnailUrl}
/>
```

---

## Considerações de Performance

### Storage Costs
- Bucket público: Grátis até 1GB
- Transfer: Grátis até 2GB/mês
- **Estimativa**: 15 eventos × 3 fotos × 2MB = ~90MB (OK)

### Load Times
- Imagem comprimida: ~500KB → ~500ms (4G)
- Vídeo 1min 720p: ~10MB → precisa lazy loading
- **Solução**: Progressive loading + thumbnails

---

## Decisão Atual

**Por hora: Manter 1 mídia por evento**

Motivos:
1. ✅ Arquitetura preparada para expansão
2. ✅ Compressão automática implementada
3. ✅ Suporte a vídeo já funciona
4. ⏳ Múltiplas mídias quando precisar (15h implementação)
5. ⏳ Carousel quando tiver conteúdo suficiente

**Próximo passo quando necessário:**
1. Criar `timeline_event_media` table
2. Implementar `MultiMediaManager`
3. Frontend carousel automático