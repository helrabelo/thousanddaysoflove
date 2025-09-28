# Supabase Local Development Guide
## Mil Dias de Amor - Brazilian Wedding Website

Complete guide for setting up and using Supabase local development environment for the Brazilian wedding website.

## 🚀 Quick Start

### One-Command Setup
```bash
./supabase-setup.sh
```

### Manual Setup
```bash
# 1. Install Supabase CLI (if not installed)
brew install supabase/tap/supabase

# 2. Start local environment
npm run supabase:start

# 3. Generate TypeScript types
npm run db:generate

# 4. Start development server
npm run dev
```

## 📋 Development Workflow

### Daily Development Commands
```bash
# Start everything for development
npm run dev:full              # Starts Supabase + Next.js

# Individual services
npm run supabase:start         # Start Supabase only
npm run dev                    # Start Next.js only
npm run supabase:studio        # Open database admin
npm run mailpit                # Open email testing
```

### Database Management
```bash
# Reset database with fresh data
npm run db:reset

# Apply new migrations
npm run db:migrate

# Generate TypeScript types
npm run db:generate

# Check database status
npm run supabase:status
```

### Environment Management
```bash
# Stop all services
npm run supabase:stop

# Restart services
npm run supabase:restart

# Check status
npm run supabase:status
```

## 🌐 Local Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Wedding Website** | http://localhost:3000 | Next.js development server |
| **Supabase Studio** | http://127.0.0.1:54323 | Database admin interface |
| **Email Testing** | http://127.0.0.1:54324 | Mailpit email capture |
| **API Endpoint** | http://127.0.0.1:54321 | Supabase REST API |
| **GraphQL** | http://127.0.0.1:54321/graphql/v1 | GraphQL endpoint |

## 🗄️ Database Configuration

### Brazilian Locale Settings
- **Timezone**: `America/Sao_Paulo`
- **Locale**: `pt-BR`
- **Currency**: BRL (Brazilian Real)
- **Phone Format**: `+55 (11) 99999-9999`

### Database Schema
```sql
-- Core tables
guests           -- Wedding guests with RSVP info
gifts            -- Gift registry with PIX payments
payments         -- Mercado Pago payment tracking
wedding_config   -- Wedding configuration
```

### Sample Data
The local environment includes comprehensive Brazilian sample data:
- **10 Test Guests** with realistic Brazilian names and phone numbers
- **21 Wedding Gifts** across 5 categories (Casa, Cozinha, Eletrônicos, Experiências, PIX)
- **5 Sample Payments** with different statuses
- **Wedding Configuration** for November 11th, 2025

## 🇧🇷 Brazilian Integration Features

### PIX Payment Support
- Mercado Pago integration with test credentials
- PIX payment creation and webhook handling
- Brazilian price formatting (R$ 999,99)

### Email System
- SendGrid integration for Portuguese emails
- RSVP confirmations in Brazilian Portuguese
- Payment notifications with Brazilian formatting

### Phone Number Validation
- Brazilian format: `+55 (11) 99999-9999`
- Area code validation for major Brazilian cities
- Mobile number format enforcement

## 🔒 Environment Variables

### Local Development (.env.local)
```bash
# Supabase Local
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_[local_key]
SUPABASE_SERVICE_ROLE_KEY=sb_secret_[local_key]

# Database
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Brazilian Settings
TIMEZONE=America/Sao_Paulo
LOCALE=pt-BR
CURRENCY=BRL
```

### Production (.env)
```bash
# Supabase Cloud
NEXT_PUBLIC_SUPABASE_URL=https://uottcbjzpiudgmqzhuii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[production_service_key]

# Mercado Pago (Production)
MERCADO_PAGO_ACCESS_TOKEN=[production_token]
MERCADO_PAGO_PUBLIC_KEY=[production_key]

# SendGrid (Production)
SENDGRID_API_KEY=[production_key]
SENDGRID_FROM_EMAIL=noreply@thousandaysof.love
```

## 🧪 Testing

### Database Testing
```bash
# Test database connection
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Test REST API
curl http://127.0.0.1:54321/rest/v1/guests \
  -H "apikey: sb_publishable_[local_key]"

# Test GraphQL
curl -X POST http://127.0.0.1:54321/graphql/v1 \
  -H "Content-Type: application/json" \
  -H "apikey: sb_publishable_[local_key]" \
  -d '{"query": "{ guests { id name email } }"}'
```

### Email Testing
1. Visit http://127.0.0.1:54324 (Mailpit)
2. Trigger RSVP confirmation from website
3. Check captured emails in Mailpit interface

## 🚀 Deployment Workflow

### Development → Production
```bash
# 1. Test locally
npm run supabase:start
npm run dev

# 2. Generate migration for new changes
supabase db diff --local --schema public

# 3. Apply to production (when ready)
supabase db push --linked

# 4. Deploy to Vercel
npm run build
vercel deploy
```

### Migration Management
```bash
# Create new migration
supabase migration new [migration_name]

# Apply local migrations
supabase db reset

# Push to production
supabase db push --linked
```

## 🐛 Troubleshooting

### Common Issues

#### Docker Not Running
```bash
# Error: Cannot connect to Docker daemon
# Solution: Start Docker Desktop
open -a Docker
```

#### Port Conflicts
```bash
# Error: Port 54321 already in use
# Solution: Stop conflicting services
npm run supabase:stop
lsof -ti:54321 | xargs kill
```

#### Database Connection Issues
```bash
# Reset local database
npm run supabase:stop
npm run supabase:start

# Check container status
docker ps | grep supabase
```

#### TypeScript Type Errors
```bash
# Regenerate types
npm run db:generate

# Check schema changes
supabase db diff --local --schema public
```

### Debug Mode
```bash
# Start with debug output
supabase start --debug

# Check service logs
supabase logs --follow
```

## 📝 Git Integration

### Tracked Files
```
supabase/
├── config.toml          # Supabase configuration
├── migrations/          # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_sample_data.sql
└── seed.sql            # Development seed data
```

### Ignored Files
```
supabase/.branches/      # Local branch data
supabase/.temp/          # Temporary files
supabase/logs/           # Service logs
src/types/supabase.ts    # Generated types (regenerate)
```

## 🎊 Brazilian Wedding Features

### RSVP System
- Invitation code lookup
- Guest information collection
- Plus-one management
- Dietary restrictions in Portuguese
- RSVP deadline enforcement

### Gift Registry
- Brazilian wedding gift categories
- PIX payment integration
- Price display in BRL
- Gift availability tracking
- Purchase confirmation emails

### Admin Dashboard
- Guest management with Brazilian formatting
- Payment tracking with Mercado Pago
- CSV export for wedding planning
- Real-time statistics
- Email template management

---

## 💕 Para Hel e Ylana

Este sistema foi criado especialmente para celebrar os mil dias de amor de vocês! Que cada linha de código represente o carinho e dedicação para tornar seu dia especial ainda mais mágico.

**Wedding Date**: 11 de Novembro de 2025
**Countdown**: A partir do dia 1.000 até o para sempre 💍

---

*Made with ❤️ for a thousand days of love turning into forever*