# Sanity CMS User Guide - Nossa História Content

## Quick Start: Where to Find Story Content

**After the restructure**, all story-related content is in one place:

```
📄 Páginas > 📖 Nossa História
├─ ⚙️ Configurar Página     ← Timeline page settings
├─ 📚 Fases da História      ← Timeline phases (groups)
└─ ❤️ Momentos da História   ← Individual story moments
```

---

## 1. Story Moments (Momentos da História)

### What Are Story Moments?
Individual moments in your relationship journey (first date, first trip, proposal, etc.)

### Where Are They Used?
- Homepage preview section (first 3-6 moments)
- Full timeline page at `/historia` (all moments)

### How to Add a Story Moment

1. **Navigate**: Páginas > Nossa História > ❤️ Momentos da História
2. **Click**: "Create" button
3. **Fill Required Fields**:
   - **Título**: Short title (ex: "Do Tinder ao WhatsApp")
   - **Data**: Actual date it happened (ex: 2023-01-06)
   - **Dia**: Day number in relationship (ex: 1, 50, 434)
   - **Descrição**: Story description (200-800 characters)
   - **Imagem**: Photo from that moment

4. **Optional Fields**:
   - **Ícone/Emoji**: Emoji to represent moment (ex: 💑, 🎂, 💍)
   - **Vídeo**: Video file for this moment (MP4)
   - **Fase**: Which timeline phase this belongs to
   - **Alinhamento**: Left or right on timeline page

5. **Visibility Controls**:
   - **Mostrar na Homepage**: ✅ Show in homepage preview?
   - **Mostrar no Timeline**: ✅ Show in full timeline?
   - **Visível**: Master on/off switch

6. **Click**: "Publish"

### Preview Indicators

After saving, you'll see badges showing where the moment appears:

- **📍 Homepage + Timeline** → Shows in both places
- **📍 Timeline** → Only in full timeline
- **📍 Homepage** → Only in homepage preview
- **Não visível** → Hidden everywhere

### Tips

- Use **Dia** (day number) to automatically organize moments chronologically
- Toggle **Mostrar na Homepage** for your best 3-6 moments
- Keep **Mostrar no Timeline** on for all moments (full story)
- Use **Fase** to group related moments (auto-suggested based on day number)

---

## 2. Story Phases (Fases da História)

### What Are Story Phases?
Phases group story moments into chapters of your relationship.

**Example Phases**:
1. Os Primeiros Dias (Day 1-100) - "From match to first date"
2. Construindo Juntos (Day 101-500) - "Growing as a couple"
3. Rumo ao Altar (Day 501-1000) - "Planning our future"

### How to Add a Phase

1. **Navigate**: Páginas > Nossa História > 📚 Fases da História
2. **Click**: "Create" button
3. **Fill Fields**:
   - **Título da Fase**: Phase name (ex: "Os Primeiros Dias")
   - **Período**: Day range (ex: "Dia 1 - 100")
   - **Descrição**: Short phase description
   - **Ordem de Exibição**: Order number (1, 2, 3)
   - **Visível**: Show/hide this phase

4. **Click**: "Publish"

### Tips

- Create 3-5 phases maximum (too many = overwhelming)
- Day ranges should cover your entire relationship timeline
- Phases automatically organize moments by day number

---

## 3. Timeline Page Configuration

### What Is This?
Settings for the full timeline page at `/historia`

### How to Configure

1. **Navigate**: Páginas > Nossa História > ⚙️ Configurar Página
2. **Edit Fields**:
   - **Hero Title**: Page title (ex: "Nossa História")
   - **Hero Subtitle**: Page description
   - **Phases**: Array of phase sections

3. **Add Phase Section**:
   - Select **Fase**: Choose from your created phases
   - Select **Momentos**: Drag moments into this phase
   - Reorder: Drag to change order

4. **SEO Settings** (optional):
   - Title, description, Open Graph image

5. **Click**: "Publish"

### Tips

- Phases automatically show moments assigned to them
- Can override by manually selecting specific moments
- Leave empty to auto-populate from moment's phase field

---

## Common Workflows

### Workflow 1: Add New Story to Homepage AND Timeline

**Goal**: Share a moment on both homepage preview and full timeline

1. Navigate: Páginas > Nossa História > ❤️ Momentos da História
2. Create new moment with all details
3. Set day number (auto-suggests phase)
4. Toggle ON: ✅ Mostrar na Homepage
5. Toggle ON: ✅ Mostrar no Timeline
6. Publish
7. Result: Shows on homepage + timeline automatically

**Preview**: Badge shows "📍 Homepage + Timeline"

---

### Workflow 2: Add Story Only to Timeline (Not Homepage)

**Goal**: Include a moment in full timeline but not homepage preview

1. Navigate: Páginas > Nossa História > ❤️ Momentos da História
2. Create new moment with all details
3. Set day number
4. Toggle OFF: ❌ Mostrar na Homepage
5. Toggle ON: ✅ Mostrar no Timeline
6. Publish
7. Result: Shows only on `/historia` page

**Preview**: Badge shows "📍 Timeline"

---

### Workflow 3: Feature Moment on Homepage Only

**Goal**: Show teaser on homepage but not full timeline

1. Navigate: Páginas > Nossa História > ❤️ Momentos da História
2. Create new moment
3. Toggle ON: ✅ Mostrar na Homepage
4. Toggle OFF: ❌ Mostrar no Timeline
5. Publish
6. Result: Shows only on homepage preview

**Use Case**: Teasers, quotes, or highlights

---

### Workflow 4: Temporarily Hide a Moment

**Goal**: Remove moment from site without deleting

1. Navigate: Páginas > Nossa História > ❤️ Momentos da História
2. Find moment
3. Click to edit
4. Toggle OFF: ❌ Visível
5. Publish
6. Result: Hidden from homepage AND timeline

**Note**: This overrides homepage/timeline toggles

---

### Workflow 5: Reorganize Timeline Phases

**Goal**: Change phase titles, day ranges, or order

1. Navigate: Páginas > Nossa História > 📚 Fases da História
2. Click phase to edit
3. Update: Title, day range, description, order
4. Publish
5. Result: Changes reflect on timeline page

**Tip**: Reorder by changing "Ordem de Exibição" number

---

### Workflow 6: Edit Story Content

**Goal**: Update story title, description, or image

1. Navigate: Páginas > Nossa História > ❤️ Momentos da História
2. Find moment (search by title or day number)
3. Click to edit
4. Update: Title, description, image, etc.
5. Publish
6. Result: ✅ Updates EVERYWHERE automatically
   - Homepage preview (if enabled)
   - Timeline page (if enabled)
   - No need to edit in multiple places!

---

## Visibility Matrix

| Toggle Combination | Homepage | Timeline | Use Case |
|-------------------|----------|----------|----------|
| ✅ Homepage + ✅ Timeline + ✅ Visível | ✅ | ✅ | **Most common** - Full visibility |
| ❌ Homepage + ✅ Timeline + ✅ Visível | ❌ | ✅ | Timeline-only moments |
| ✅ Homepage + ❌ Timeline + ✅ Visível | ✅ | ❌ | Teasers/highlights |
| ❌ Homepage + ❌ Timeline + ✅ Visível | ❌ | ❌ | Draft state |
| Any + Any + ❌ Visível | ❌ | ❌ | Temporarily hidden |

---

## Best Practices

### Content Strategy

1. **Homepage Preview** (3-6 moments):
   - Show your BEST/most meaningful moments
   - Mix photos and videos
   - Include variety (first date, trips, proposal, etc.)
   - Update seasonally if desired

2. **Full Timeline** (10-30+ moments):
   - Include all significant moments
   - More detailed than homepage
   - Can include "smaller" moments (birthdays, anniversaries)
   - Organize by phases for better storytelling

### Photo Guidelines

- **Resolution**: 1200px+ width recommended
- **Aspect Ratio**: 16:9 or 4:3 works best
- **File Size**: Keep under 2MB each
- **Format**: JPG or PNG
- **Alt Text**: Add description for accessibility

### Video Guidelines

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080p or 720p
- **Length**: 10-30 seconds recommended
- **File Size**: Keep under 50MB
- **Orientation**: Landscape preferred

### Writing Style

- **Titles**: Short, memorable (3-5 words)
- **Descriptions**: 200-400 characters
- **Tone**: Personal, warm, authentic
- **Emojis**: Use sparingly for visual interest

---

## Troubleshooting

### "My moment isn't showing on homepage"

**Check**:
1. Is **Visível** toggled ON?
2. Is **Mostrar na Homepage** toggled ON?
3. Did you publish (not just save draft)?
4. Is it within first 6 moments by day number?

**Solution**: Edit moment, verify toggles, republish

---

### "Phase not appearing on timeline"

**Check**:
1. Is phase marked as **Visível**?
2. Does phase have any moments assigned?
3. Are moments toggled to show in timeline?
4. Is timeline page configuration correct?

**Solution**: Edit phase settings, assign moments, republish

---

### "Need to reorder moments in phase"

**Two ways**:

**Option 1**: Change day number
- Moments auto-sort by day number
- Edit moment, change day number, publish

**Option 2**: Change display order
- Edit moment, update "Ordem na Fase" field
- Lower numbers appear first

---

### "Want to move moment to different phase"

**Solution**:
1. Navigate to moment
2. Change **Fase** dropdown to new phase
3. Optionally adjust **Ordem na Fase**
4. Publish
5. Result: Moment appears in new phase

---

### "Accidentally deleted a moment"

**Solution**:
1. Sanity keeps revision history
2. Navigate to moment type
3. Click "Deleted" filter
4. Find moment, click "Restore"
5. Moment recovers with all content

---

## Quick Reference: Field Descriptions

| Field | Required? | Purpose | Example |
|-------|-----------|---------|---------|
| Título | ✅ | Moment name | "Do Tinder ao WhatsApp" |
| Data | ✅ | Actual date | 2023-01-06 |
| Dia | ✅ | Day number | 1, 434, 1000 |
| Descrição | ✅ | Story text | "Nossa primeira conversa..." |
| Imagem | ✅ | Photo | Upload JPG/PNG |
| Ícone/Emoji | ❌ | Visual icon | 💑, 🎂, 💍 |
| Vídeo | ❌ | Video file | Upload MP4 |
| Fase | ❌ | Timeline phase | Auto-suggested by day |
| Alinhamento | ❌ | Layout position | Left or Right |
| Ordem na Fase | ✅ | Phase order | 1, 2, 3 |
| Mostrar na Homepage | ❌ | Homepage toggle | ON/OFF |
| Mostrar no Timeline | ❌ | Timeline toggle | ON/OFF |
| Visível | ❌ | Master toggle | ON/OFF |

---

## FAQ

### Q: How many moments should be on homepage?
**A**: 3-6 works best. Too many = overwhelming. Show your best moments.

### Q: How many total moments should timeline have?
**A**: 10-30+ is normal. Tell your complete story.

### Q: Should every moment have a phase?
**A**: Optional but recommended. Phases help organize timeline.

### Q: Can I change phase names later?
**A**: Yes! Edit phase anytime. Changes reflect immediately.

### Q: What if I want moment to appear twice on timeline?
**A**: Can't duplicate. Create separate moment with same content.

### Q: Can guests see draft moments?
**A**: No. Only published moments appear on site.

### Q: How do I preview changes before publishing?
**A**: Use Sanity's preview mode (opens new tab with draft content).

### Q: What happens if I unpublish homepage?
**A**: Timeline and moments still work. Only homepage goes offline.

### Q: Can I export all story content?
**A**: Yes! Sanity CLI: `sanity dataset export production backup.tar.gz`

### Q: How do I backup before major changes?
**A**: Dataset export (above) or use Sanity's built-in history/rollback.

---

## Need Help?

- **Sanity Documentation**: https://www.sanity.io/docs
- **Preview Site**: Click "Open Preview" in Studio
- **Rollback Changes**: Use History tab in document editor
- **Contact Developer**: [Your contact info]

---

**Last Updated**: After CMS restructure
**Version**: 2.0 (Unified Story Content)
