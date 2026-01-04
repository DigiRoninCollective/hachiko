# Rate Limiting Implementation

## Overview

The chat API uses Redis-based rate limiting with support for multiple providers. The system automatically detects your Redis configuration and falls back to in-memory storage for local development.

## Supported Redis Providers

### 1. Upstash (REST API) ⭐ **Easiest**
Works with: Vercel KV, Cloudflare, Railway, Fly.io

**Setup:**
```bash
# Get credentials from https://console.upstash.com or Vercel Dashboard
KV_REST_API_URL="https://your-redis.upstash.io"
KV_REST_API_TOKEN="your-token"
```

**Package:** `@vercel/kv` (already installed)

**Pros:**
- Serverless-friendly (REST API)
- No connection pooling needed
- Works anywhere (no TCP required)
- Free tier available

### 2. Standard Redis (TCP) ⭐ **Most Flexible**
Works with: Any Redis instance - self-hosted, Railway, Render, DigitalOcean, AWS ElastiCache, etc.

**Setup:**
```bash
# Install ioredis
npm install ioredis

# Add Redis URL
REDIS_URL="redis://username:password@host:6379"
```

**Examples:**
- **Local:** `redis://localhost:6379`
- **Railway:** `redis://default:password@containers-us-west-xx.railway.app:6379`
- **Render:** `redis://red-xxxxx:6379`
- **AWS ElastiCache:** `redis://master.xxxxx.cache.amazonaws.com:6379`
- **DigitalOcean:** `redis://default:password@db-redis-xxx.ondigitalocean.com:25061`

**Pros:**
- Works with any Redis provider
- Lower latency (TCP vs REST)
- More features (pub/sub, transactions)
- You own your data

### 3. In-Memory Fallback (Development Only)
Automatically used if no Redis is configured.

**⚠️ Warning:** 
- Resets on server restart
- Doesn't work across multiple instances
- NOT production-safe

## Configuration Priority

The system tries providers in this order:
1. Upstash (if `KV_REST_API_URL` + `KV_REST_API_TOKEN` exist)
2. Standard Redis (if `REDIS_URL` exists)
3. In-Memory (fallback)

## Rate Limit Settings

- **Window:** 60 seconds
- **Max Requests:** 5 per user per window
- **Scope:** Per `userId`

## Platform-Specific Guides

### Vercel
```bash
# Create KV Database in Vercel Dashboard
# Automatically adds KV_REST_API_URL and KV_REST_API_TOKEN
vercel env pull .env.local
```

### Railway
```bash
# Add Redis plugin in Railway dashboard
# Copy REDIS_URL from environment variables
REDIS_URL="redis://default:xxx@containers-us-west-xxx.railway.app:6379"
```

### Self-Hosted / VPS
```bash
# Install Redis
sudo apt install redis-server

# Configure
REDIS_URL="redis://localhost:6379"

# Or with password:
REDIS_URL="redis://:yourpassword@localhost:6379"
```

### Supabase (PostgreSQL as Redis alternative)
While Supabase doesn't provide Redis, you can:
- Use Upstash (free tier)
- Add Railway Redis plugin
- Use DigitalOcean Managed Redis

## Installation

### For Upstash (REST)
```bash
# Already installed
npm install @vercel/kv
```

### For Standard Redis (TCP)
```bash
npm install ioredis
```

## Testing

### Local Testing

```bash
# Run 7 requests - last 2 should be rate limited
for i in {1..7}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"userId": "test", "username": "user", "message": "msg '$i'"}'
done
```

Expected: 5 successful (200), 2 rate limited (429)

### Verify Provider

Check server logs on startup:
- `Using Upstash Redis (REST) for rate limiting`
- `Using Redis (ioredis) for rate limiting`
- `Using in-memory store for rate limiting (development only)`

## Cost Comparison

| Provider | Free Tier | Paid (approx) |
|----------|-----------|---------------|
| **Upstash** | 10k requests/day | $0.20/100k requests |
| **Railway** | $5 credit/month | $5/month for Redis |
| **Render** | None | $7/month |
| **DigitalOcean** | None | $15/month |
| **AWS ElastiCache** | None | ~$15/month |
| **Self-hosted** | Free | Server costs |

## Monitoring

Rate limiting errors are logged but **fail open** (allow the request) to prevent denial of service if Redis is down.

```typescript
catch (error) {
  console.error('Rate limiting error:', error);
  return false; // Allow request
}
```

## Recommendations by Deployment

| Platform | Recommended Solution |
|----------|---------------------|
| **Vercel** | Vercel KV (Upstash) - Native integration |
| **Railway** | Railway Redis plugin |
| **Render** | Render Redis |
| **Cloudflare** | Upstash (REST API) |
| **VPS/Self-hosted** | Local Redis + `REDIS_URL` |
| **AWS** | ElastiCache |
