# VOICE REWRITE IMPLEMENTATION GUIDE

## Quick Reference: File Locations & Line Numbers

### 1. HeroSection.tsx
**File**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/sections/HeroSection.tsx`

**Line 78** (DELETE):
```diff
- <span style={{ fontSize: '1.1em', fontWeight: 500, color: 'var(--primary-text)' }}>1000 dias de puro amor</span><br />
+ <span style={{ fontSize: '1.1em', fontWeight: 500, color: 'var(--primary-text)' }}>1000 dias. Fiz a conta.</span><br />
```

**Line 79** (ADD CONTEXT):
```diff
- <span style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '0.5rem', display: 'block' }}>"O que temos entre nós é muito maior do que qualquer um pode imaginar"</span>
+ <span style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '0.5rem', display: 'block' }}>"O que temos entre nós é muito maior do que qualquer um pode imaginar"<br />— Hel, em um momento raro de filosofia</span>
```

**Line 139** (UPDATE):
```diff
- <span style={{ color: 'var(--decorative)' }}>Exatamente 1000 dias desde 6 de janeiro de 2023</span>
+ <span style={{ color: 'var(--decorative)' }}>Mil dias exatos desde 6 de janeiro de 2023. Matemática perfeita.</span>
```

**Line 193** (UPDATE TAGLINE):
```diff
- <span style={{ color: 'var(--decorative)' }}>Onde a arte encontra o amor</span>
+ <span style={{ color: 'var(--decorative)' }}>Uma galeria de arte no bairro nobre. É tipo nosso estilo.</span>
```

---

### 2. StoryPreview.tsx
**File**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/sections/StoryPreview.tsx`

**Lines 43-44** (INTRO - CRITICAL):
```diff
- Caseiros e introvertidos por natureza, mas com corações que transbordam amor. Unidos por boa comida, vinhos especiais, viagens inesquecíveis e nossa família de 4 pets que completam nosso universo particular.
+ Caseiros pra caramba. Introvertidos assumidos. Nossa ideia de programa perfeito?
+ Amigos em casa, comida boa, vinhos que valem a pena, e uma família de 4 cachorros fazendo barulho ao fundo.
+ É o nosso estilo.
```

**Lines 91-92** (CARD 1):
```diff
- 6 de janeiro de 2023 - Quem diria que um simples match se tornaria a mais linda história de amor? O primeiro "oi" que mudou nossas vidas para sempre.
+ 6 de janeiro de 2023 - Match no Tinder. Conversa que migrou pro WhatsApp.
+ Aquele primeiro "oi" meio sem graça. A gente quase nem respondeu.
+ Três anos depois, casamento.
```

**Lines 137-138** (CARD 2 - KEEP CORE, CUT LESSON):
```diff
- Ylana levando remédio e chá quando Hel ficou doente. "Na hora eu já sabia: 'é ela'". Às vezes o amor se revela nos gestos mais simples.
+ Ylana apareceu com remédio e chá quando eu tava doente.
+ Na hora eu já sabia: "é ela".
```

**Lines 185-186** (CARD 3 - ADD PHILOSOPHY):
```diff
- O apartamento que Hel passava de bicicleta na faculdade sonhando em morar. Anos de trabalho duro para realizar o sonho de uma casa própria para nossa família de 6.
+ Esse apartamento? Eu passava de bicicleta aqui indo pra faculdade.
+ Anos imaginando morar nele. Literalmente anos trabalhando pra isso.
+ Agora é nosso. Primeira casa própria. Família de 6.
+ Primeira vez na vida que eu não quero chegar no próximo nível.
```

---

### 3. AboutUsSection.tsx
**File**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/sections/AboutUsSection.tsx`

**Lines 43-45** (ADD CONTEXT TO QUOTE):
```diff
  "Tem o que as pessoas sabem de nós, tem o que elas veem de nós, e tem o que nós temos entre nós.<br />
- E o que nós temos entre nós é muito maior do que qualquer um pode imaginar."
+ E o que nós temos entre nós é muito maior do que qualquer um pode imaginar."<br />
+ — Hel, tentando explicar o inexplicável
```

**Lines 91** (CARD 1 - CRITICAL DELETE):
```diff
- Nosso universo particular é onde o amor floresce. Adoramos receber amigos em casa, criar memórias íntimas e curtir a companhia um do outro. Para nós, lar é onde está o coração.
+ A gente é caseiro pra caramba. Introvertidos de carteirinha.
+ Nossa ideia de programa ideal? Amigos em casa, comida boa, conversa melhor.
+ Nada de balada. Nada de multidão.
+ Nosso apartamento é nosso lugar favorito no mundo.
```

**Lines 137-138** (CARD 2 - PASSIONS):
```diff
- Boa comida (especialmente no nosso querido Mangue Azul), vinhos que acompanham nossas conversas, viagens que expandem nossos horizontes, e fitness que fortalece nossos corpos e nossa parceria.
+ Comida boa. Mangue Azul é nosso segundo lar.
+ Vinhos que valem a pena. Academia juntos.
+ Viagens quando conseguimos sair de casa (lembra que somos introvertidos?).
+ Rotina simples. Qualidade alta.
```

**Lines 348** (PETS INTRO - THE BIG ONE):
```diff
- Linda chegou primeiro, autista e perfeita. Cacao se juntou após o namoro. Olivia e Oliver nasceram da Linda - de 2 para 4 pets! Nossa casa nunca foi tão cheia de amor e travessuras.
+ De 2 cachorros pra 4 em menos de 2 anos.
+ Linda veio primeiro. Depois Cacao. Daí Linda teve filhotes e a gente ficou com Olivia e Oliver.
+ A conta de ração triplicou. O barulho também. Vale a pena.
```

**Line 382** (LINDA):
```diff
- A primeira, autista, mongol, perfeita
+ A rainha. Autista, tem síndrome de Down, completamente perfeita.
+ Hel trouxe ela antes de conhecer Ylana. Foi amor à primeira vista.
```

**Line 407** (CACAO - MAXIMUM IMPACT):
```diff
- Chegou março 2023, companhia da Linda
+ A prova de que amor é aceitar as decisões questionáveis da parceira.
+ 1 libra de Spitz Alemão. Volume no máximo o tempo todo.
+ Ylana trouxe ela. Eu pago o aluguel dela. Eu limpo a merda dela.
+ Casamento, né?
```

**Line 448** (OLIVIA):
```diff
- Filha da Linda, nossa princesinha
+ Filha da Linda. A calma da ninhada.
+ Não late muito. A gente agradece.
```

**Line 481** (OLIVER):
```diff
- Filho da Linda, pura energia
+ Filho da Linda. Pura energia.
+ Basicamente Cacao, mas macho e maior.
+ A gente sabia no que tava se metendo e escolheu ficar com ele mesmo assim.
```

---

### 4. WeddingLocation.tsx
**File**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/components/sections/WeddingLocation.tsx`

**Line 319** (DELETE CRINGE HEADING):
```diff
- 💕 Com Todo Nosso Amor
+ 💕 Informações Práticas
```

**Lines 329-330** (REWRITE):
```diff
- O local fica na região nobre de Eng. Luciano Cavalcante.
- Como sempre recebemos nossos amigos em casa, cheguem 15-20 minutos antes para aproveitar cada momento de nossa celebração dos mil dias! ✨
+ Casa HY fica no Eng. Luciano Cavalcante, região nobre de Fortaleza.
+ A gente sempre trata evento como se tivesse recebendo em casa.
+ Cheguem 15-20 minutos antes. Aproveitem cada minuto com a gente.
```

**Line 365** (DELETE):
```diff
- Nosso Grande Momento
+ Horário
```

**Lines 367-368** (DELETE "PURO AMOR"):
```diff
- Início às 10:30h da manhã
- Celebração dos mil dias: 2-3 horas de puro amor
+ Cerimônia: 10:30h da manhã
+ Duração: 2-3 horas de celebração
```

**Line 393** (DELETE MAXIMUM CRINGE):
```diff
- Vista-se com Amor
+ Dress Code
```

**Lines 395-396** (CRITICAL DELETE):
```diff
- Traje social elegante
- Cores claras para combinar com nossa felicidade ✨
+ Traje social
+ Cores claras (combinam com o espaço e a vibe)
```

---

### 5. /historia/page.tsx
**File**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/app/historia/page.tsx`

**Lines 124-125** (HERO):
```diff
- De um simples "oi" no WhatsApp até o altar - a jornada de 1000 dias que nos trouxe até aqui.
- Cada momento, cada marco, cada descoberta que construiu nosso amor.
+ Do "oi" no WhatsApp até o altar. 1000 dias que a gente fez questão de contar.
```

**Lines 139-140** (TIMELINE HEADING):
```diff
- 1000 Dias de Amor
- Cada dia nos trouxe mais perto do para sempre
+ 1000 Dias. Cronologia Completa.
+ Do primeiro match até hoje.
```

---

### 6. /presentes/page.tsx (Minor Tweaks)
**File**: `/Users/helrabelo/code/personal/thousanddaysoflove/src/app/presentes/page.tsx`

**Line 146** (ADD HUMOR):
```diff
- Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡ também agradecem cada gesto de carinho.
+ Linda 👑, Cacao 🍫, Olivia 🌸 e Oliver ⚡ também agradecem.
+ (Principalmente Oliver e Cacao, que são os caros de manter.)
```

**Lines 346-347** (BOTTOM CTA):
```diff
- Cada presente nos ajuda a transformar nossa casa própria em um lar ainda mais especial.
- Linda, Cacao, Olivia e Oliver também agradecem! Nos vemos na Casa HY em 20 de novembro de 2025!
+ Esse apartamento que eu passava de bicicleta na faculdade? Agora é nosso.
+ Cada presente ajuda a transformar ele em lar de verdade.
+ Linda, Cacao, Olivia e Oliver também agradecem (especialmente pela ração).
+ Nos vemos na Casa HY em 20 de novembro!
```

---

## PRIORITY ORDER FOR IMPLEMENTATION

### NUCLEAR TIER (Do First - Maximum Cringe Removal):
1. **WeddingLocation.tsx Line 395-396**: "cores claras para combinar com nossa felicidade" ← DELETE THIS FIRST
2. **HeroSection.tsx Line 78**: "puro amor" → "Fiz a conta"
3. **StoryPreview.tsx Lines 43-44**: Intro paragraph with "transbordam amor"
4. **WeddingLocation.tsx Line 368**: "puro amor" in duration

### HIGH IMPACT (Core Voice Transformation):
1. **AboutUsSection.tsx Line 407**: Cacao description (MAXIMUM HEL VOICE)
2. **StoryPreview.tsx Lines 185-186**: Apartment + philosophy line
3. **StoryPreview.tsx Line 138**: Tea/medicine story cleanup
4. **AboutUsSection.tsx Line 91**: "amor floresce" deletion

### MEDIUM IMPACT (Polish):
1. All remaining pet descriptions
2. Historia page hero text
3. Quick Preview tone adjustments
4. Gift page humor additions

---

## TESTING CHECKLIST

After making changes, verify:

- [ ] No "puro amor" anywhere on site
- [ ] No "transbordam amor" anywhere
- [ ] No "amor floresce" anywhere
- [ ] No "universo particular" anywhere
- [ ] Dress code line has ZERO cringe
- [ ] Cacao description makes you laugh
- [ ] Philosophy line about "próximo nível" is included
- [ ] Tea/medicine story is punchy (kept the gold, removed the lesson)
- [ ] All specific names/places still present (Mangue Azul, etc.)
- [ ] Pet emojis still there
- [ ] Dates and numbers unchanged

---

## ONE-LINER SUMMARY OF EACH CHANGE

**Hero**: Removed dramatic poetry, added math pride and self-awareness
**Story Preview**: Cut generic romance, added vulnerability and philosophy
**About Us**: Deleted flowery language, embraced introverted pride
**Pets**: Financial reality + maximum humor (especially Cacao)
**Location**: Removed cringe dress code line, made everything practical
**Historia**: Cut dramatic framing, let facts speak
**Gifts**: Added context about apartment dream, pet cost humor

---

## VOICE BEFORE & AFTER

### BEFORE (Generic Wedding Site):
"Caseiros e introvertidos por natureza, mas com corações que transbordam amor. Nossa casa nunca foi tão cheia de amor e travessuras. Cores claras para combinar com nossa felicidade."

**Meloso Score**: 9/10
**Could Be Any Couple**: Yes
**Hel's Voice**: 2/10

### AFTER (Authentic Hel):
"Caseiros pra caramba. Introvertidos de carteirinha. De 2 cachorros pra 4 - a conta de ração triplicou. Vale a pena. Cacao? Decisão questionável da Ylana que eu pago aluguel. Casamento, né?"

**Meloso Score**: 1/10 ✓
**Could Be Any Couple**: No - uniquely theirs
**Hel's Voice**: 10/10 ✓

---

## FINAL NOTE

The goal isn't to remove ALL warmth or romance. It's to make it EARNED through specificity, conversational honesty, and Hel's actual personality.

The most touching moments in the new copy are the ones where emotion shows through matter-of-fact delivery:
- "Na hora eu já sabia: 'é ela'" (kept perfect as is)
- "Primeira vez na vida que eu não quero chegar no próximo nível" (added)
- "Vale a pena" (after listing pet chaos)

These hit harder BECAUSE they're surrounded by conversational, self-aware, occasionally sarcastic content. That's Hel's voice. That's the goal.

---

END IMPLEMENTATION GUIDE
