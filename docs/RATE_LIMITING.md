# Rate Limiting Implementation

## Overview

The chat API uses Redis-based rate limiting via Vercel KV in production, with an automatic fallback to in-memory storage for local development.

## Configuration

### Production (Vercel KV - Recommended)

1. Create a Vercel KV store:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard) → Storage → Create KV Database
   - Copy the credentials

2. Add to your environment variables:
   ```bash
   KV_REST_API_URL="https://your-kv-store.upstash.io"
   KV_REST_API_TOKEN="your-token-here"
   ```

3. Deploy - rate limiting will automatically use Redis

### Development (In-Memory Fallback)

If `KV_REST_API_URL` and `KV_REST_API_TOKEN` are not set, the system automatically falls back to an in-memory store.

**⚠️ Warning:** In-memory rate limiting:
- Resets on server restart
- Doesn't work across multiple server instances
- Not suitable for production

## Rate Limit Settings

- **Window:** 60 seconds
- **Max Requests:** 5 per user per window
- **Scope:** Per `userId`

## Implementation Details

### Architecture

```
src/lib/kv.ts          # KV store abstraction layer
src/lib/chat-service.ts # Rate limiting logic
```

### How It Works

1. Each request increments a counter in Redis: `ratelimit:chat:{userId}`
2. On first request, the key expires after 60 seconds
3. Requests beyond the limit return HTTP 429

### Code Example

```typescript
import { kv } from '@/lib/kv';

const count = await kv.incr(`ratelimit:chat:${userId}`);
if (count === 1) {
  await kv.expire(`ratelimit:chat:${userId}`, 60);
}
return count > 5; // Rate limited if true
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

### Verify Redis Usage

Check server logs on startup:
- Production: `Using Vercel KV for rate limiting`
- Development: `Using in-memory store for rate limiting`

## Monitoring

Rate limiting errors are logged but **fail open** (allow the request) to prevent denial of service if Redis is down.

```typescript
catch (error) {
  console.error('Rate limiting error:', error);
  return false; // Allow request
}
```

## Future Improvements

- [ ] Add per-IP rate limiting for unauthenticated users
- [ ] Implement different limits for authenticated vs anonymous
- [ ] Add rate limit headers (`X-RateLimit-Remaining`, etc.)
- [ ] Dashboard for monitoring abuse
