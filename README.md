# NomNom - Real-time Chat Application

A modern, production-ready chat application built with Next.js, featuring real-time messaging, rate limiting, and flexible deployment options.

## ✨ Features

- 🔐 **Supabase Authentication** - Secure user authentication
- 💬 **Real-time Chat** - Persistent message history with PostgreSQL
- 🛡️ **Rate Limiting** - Multi-provider Redis support (Upstash, ioredis, or in-memory)
- 📊 **Token Stats Integration** - DexScreener API integration
- 🎨 **Modern UI** - Tailwind CSS with Radix UI components
- 🚀 **Production Ready** - Optimized database queries, indexes, and caching
- 🌍 **Platform Agnostic** - Deploy anywhere (Vercel, Railway, self-hosted)
- 🏠 **Self-Hosting** - Complete guides for running on your own hardware

## 🚀 Quick Start

### Local Development (5 minutes)

```bash
# 1. Clone and install
git clone <your-repo>
cd nomnom
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Run migrations
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

**Access at:** http://localhost:3000

**No external dependencies needed!** Redis rate limiting automatically falls back to in-memory for development.

📖 **[Full Quick Start Guide →](docs/QUICK_START.md)**

---

## 📚 Documentation

### Deployment Options

- **[Quick Start](docs/QUICK_START.md)** - Get running in 5 minutes
- **[Self-Hosting Guide](docs/SELF_HOSTING.md)** - Run on your own computer/server
- **[Custom Domain Setup](docs/CUSTOM_DOMAIN.md)** - Use your own domain (nomnom.com)
- **[Non-Vercel Deployment](docs/DEPLOYMENT_NON_VERCEL.md)** - Railway, Render, Fly.io, etc.

### Technical Guides

- **[Rate Limiting](docs/RATE_LIMITING.md)** - Redis configuration for all providers
- **[Database Schema](prisma/schema.prisma)** - PostgreSQL with Prisma ORM

---

## 🏗️ Architecture

### Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database:** PostgreSQL (Supabase) with Prisma ORM
- **Authentication:** Supabase Auth
- **Rate Limiting:** Redis (Upstash/ioredis) or in-memory fallback
- **Deployment:** Platform-agnostic (Vercel, Railway, self-hosted)

### Database Schema

```
User (id, username, createdAt, updatedAt)
  ├── Messages (id, userId, message, timestamp, ip)
  └── [indexes on username, timestamp]

Todo (id, title, isCompleted, createdAt)

Rate Limiting: Redis KV store
  └── Key pattern: ratelimit:chat:{userId}
```

---

## 💰 Deployment Cost Comparison

| Option | Monthly Cost | Setup Time | Best For |
|--------|-------------|------------|----------|
| **Self-hosted** | ~$2 (electricity) | 15 min | Maximum savings |
| **Self-hosted + Domain** | ~$3 (domain + electricity) | 20 min | Professional setup |
| **Railway** | $5 | 5 min | Easy cloud hosting |
| **Vercel** | $0-20 | 2 min | Fastest deployment |
| **Render** | $7-14 | 10 min | Simple cloud option |

**📊 Self-hosting saves $84-624/year vs cloud providers!**

---

## 🌐 Deployment Options

### Option 1: Vercel (Easiest)

```bash
vercel
# Add Vercel KV in dashboard
```

### Option 2: Railway (Best Non-Vercel)

```bash
railway init
railway add redis
railway up
```

### Option 3: Self-Hosted with Custom Domain

```bash
# Install Cloudflare Tunnel (free SSL + no port forwarding)
cloudflared tunnel create nomnom
cloudflared tunnel route dns nomnom yourdomain.com
cloudflared tunnel run nomnom
```

**Live at:** `https://yourdomain.com` 🎉

📖 **[Complete Deployment Guides →](docs/)**

---

## 🔧 Environment Variables

### Required (All Deployments)

```bash
DATABASE_URL="postgresql://..."           # Supabase pooled connection
DIRECT_URL="postgresql://..."             # Supabase direct connection
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="..."
```

### Optional (Production Rate Limiting)

**Choose ONE:**

```bash
# Option 1: Upstash Redis (REST) - Vercel KV, Cloudflare, etc.
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."

# Option 2: Standard Redis (TCP) - Railway, self-hosted, etc.
REDIS_URL="redis://localhost:6379"
```

**If neither is set:** Falls back to in-memory (development only)

---

## 🛠️ Development

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server

# Database
npx prisma migrate dev   # Create migration
npx prisma studio        # Database GUI
npx prisma generate      # Regenerate client

# Deployment
vercel                   # Deploy to Vercel
railway up               # Deploy to Railway
```

### Project Structure

```
nomnom/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes (chat, token-data)
│   │   ├── auth/         # Authentication pages
│   │   └── page.tsx      # Main chat interface
│   ├── components/       # React components
│   ├── lib/              # Business logic
│   │   ├── chat-service.ts   # Chat & rate limiting
│   │   ├── kv.ts            # Multi-provider Redis abstraction
│   │   └── prisma.ts        # Database client
│   └── utils/            # Supabase utilities
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration history
├── docs/                 # Complete documentation
└── public/               # Static assets
```

---

## 🔒 Security Features

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **Rate limiting** - 5 requests/minute per user
- ✅ **Input validation** - Username and message sanitization
- ✅ **Content moderation** - Spam and inappropriate content filtering
- ✅ **SQL injection protection** - Prisma ORM with parameterized queries
- ✅ **HTTPS** - Automatic SSL with Cloudflare/Let's Encrypt

---

## 📈 Performance Optimizations

- ⚡ **Database indexes** on frequently queried fields
- ⚡ **Optimized queries** - Single upsert instead of 3 queries
- ⚡ **Connection pooling** - PgBouncer for serverless
- ⚡ **Redis caching** - Optional for rate limiting
- ⚡ **Static generation** - Pre-rendered pages where possible

---

## 🧪 Testing

```bash
# Test rate limiting
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"userId": "test", "username": "user", "message": "Test '$i'"}'
done

# Expected: 5 success (200), 2 rate limited (429)
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

[Your License Here]

---

## 🆘 Support

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](your-repo/issues)
- **Discussions:** [GitHub Discussions](your-repo/discussions)

---

## 🎯 Roadmap

- [x] Supabase + Prisma integration
- [x] Multi-provider Redis support
- [x] Self-hosting documentation
- [x] Custom domain setup
- [ ] Supabase Realtime (WebSocket) chat
- [ ] File upload support
- [ ] Todo CRUD API
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

---

## ⭐ Star History

If this project helped you, please consider giving it a star!

---

**Built with ❤️ using Next.js, Supabase, and Prisma**