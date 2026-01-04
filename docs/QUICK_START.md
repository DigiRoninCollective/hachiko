# Quick Start Guide

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run database migrations
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

**No Redis needed for development!** It automatically falls back to in-memory rate limiting.

---

## Production Deployment

### Option A: Vercel (Easiest)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add Redis (in Vercel Dashboard)
# Storage → Create KV Database
# Environment variables auto-added

# Done! ✅
```

### Option B: Railway (Recommended non-Vercel)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Create project
railway init

# 3. Add Redis plugin
railway add redis

# 4. Deploy
railway up

# Done! ✅
```

### Option C: Any Other Platform

See [DEPLOYMENT_NON_VERCEL.md](./DEPLOYMENT_NON_VERCEL.md) for:
- Render
- Fly.io
- Self-hosted VPS
- Cloudflare Pages

---

## Required Environment Variables

### Always Required
```bash
DATABASE_URL="postgresql://..."           # Supabase Postgres (pooled)
DIRECT_URL="postgresql://..."             # Supabase Postgres (direct)
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="..."
```

### For Production Rate Limiting (Pick ONE)
```bash
# Option 1: Upstash Redis (REST) - Vercel, Cloudflare, etc.
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."

# Option 2: Standard Redis (TCP) - Railway, Render, self-hosted
REDIS_URL="redis://..."
```

---

## Feature Checklist

✅ **Database:** Supabase PostgreSQL with Prisma  
✅ **Rate Limiting:** Redis (multi-provider) or in-memory fallback  
✅ **Authentication:** Supabase Auth ready  
✅ **Real-time:** Chat with message persistence  
✅ **Security:** Rate limiting, input validation, RLS enabled  
✅ **Performance:** Database indexes, query optimization  
✅ **Platform-agnostic:** Works on Vercel, Railway, Render, or self-hosted  

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma migrate dev   # Create and apply migration
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma client

# Deployment
vercel                   # Deploy to Vercel
railway up               # Deploy to Railway

# Self-hosting with custom domain
cloudflared tunnel run   # Run Cloudflare Tunnel (see CUSTOM_DOMAIN.md)
```

---

## Troubleshooting

**Build fails?**
- Check all environment variables are set
- Run `npx prisma generate`

**Chat not working?**
- Check database connection (DATABASE_URL)
- Verify migrations ran: `npx prisma migrate status`

**Rate limiting not working?**
- Check Redis connection (logs on startup)
- For dev: in-memory is fine
- For prod: add REDIS_URL or KV credentials

**Need help?**
- [Rate Limiting Guide](./RATE_LIMITING.md)
- [Non-Vercel Deployment](./DEPLOYMENT_NON_VERCEL.md)
- [Self-Hosting Guide](./SELF_HOSTING.md)
- [Custom Domain Setup](./CUSTOM_DOMAIN.md)
