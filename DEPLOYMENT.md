# Thousand Days of Love - Production Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Domain Setup (thousandaysof.love)

**DNS Configuration:**
```
Type: A Record
Name: @
Value: 76.76.19.51 (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Vercel Domain Setup:**
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add domain: `thousandaysof.love`
3. Add domain: `www.thousandaysof.love`
4. Configure DNS as shown above

### 2. Supabase Production Setup

**Create Production Project:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project: "Thousand Days of Love"
3. Choose region: South America (São Paulo)
4. Save project URL and keys

**Database Migration:**
```bash
# Link to production project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to production
supabase db push --linked

# Verify migration
supabase db remote commit
```

### 3. Environment Variables Setup

**Vercel Environment Variables:**
Copy from `.env.production` template:

```bash
# Required Production Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SENDGRID_API_KEY=your_sendgrid_key
MERCADO_PAGO_ACCESS_TOKEN=your_mp_token
MERCADO_PAGO_PUBLIC_KEY=your_mp_public_key
NEXT_PUBLIC_SITE_URL=https://thousandaysof.love
```

### 4. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
```bash
# Push to GitHub
git add .
git commit -m "feat: production deployment ready"
git push origin main

# Import to Vercel
# 1. Go to vercel.com/import
# 2. Connect GitHub repository
# 3. Configure environment variables
# 4. Deploy
```

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Production Configuration

### Vercel Settings
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node Version**: 18.x

### Security Headers
Configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Performance Optimizations
- **Region**: GRU1 (São Paulo) for Brazilian users
- **Edge Functions**: API routes optimized
- **CDN**: Global distribution via Vercel

## 📧 Email Configuration

### SendGrid Setup
1. Verify domain: `thousandaysof.love`
2. Configure DKIM records
3. Set up email templates in Portuguese
4. Test RSVP confirmations

### Email Templates Required
- RSVP Confirmation (Portuguese)
- Payment Confirmation (Portuguese)
- RSVP Reminder (Portuguese)

## 💳 Mercado Pago Configuration

### Production Setup
1. Switch to production credentials
2. Configure webhook URL: `https://thousandaysof.love/api/webhooks/mercado-pago`
3. Test PIX payments
4. Enable real payment processing

### Webhook Configuration
```
URL: https://thousandaysof.love/api/webhooks/mercado-pago
Events: payment.created, payment.updated
```

## 🔍 Post-Deployment Checklist

### Functional Testing
- [ ] Homepage loads correctly
- [ ] RSVP system works
- [ ] Admin dashboard accessible
- [ ] Email confirmations sent
- [ ] PIX payments process
- [ ] Database connections work
- [ ] Mobile responsiveness

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Brazilian server response < 2s
- [ ] API endpoints responsive

### Security Testing
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Database RLS policies active
- [ ] Admin routes protected

## 🚨 Monitoring & Maintenance

### Error Tracking
- Vercel Analytics enabled
- Database monitoring via Supabase
- Email delivery tracking via SendGrid

### Backup Strategy
- Database: Automatic Supabase backups
- Code: GitHub repository
- Environment: Documented in team vault

## 📞 Support Contacts

**Technical Issues:**
- Vercel: vercel.com/support
- Supabase: supabase.com/support
- SendGrid: sendgrid.com/support

**Domain Issues:**
- Domain registrar support
- DNS provider support

---

## 🎊 Ready for November 11th, 2025!

This deployment guide ensures your wedding website is production-ready for Hel and Ylana's celebration of their 1000 days of love!