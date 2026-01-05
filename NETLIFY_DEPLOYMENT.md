# 🚀 Deploying Hachiko Token to Netlify

## Quick Deploy

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Initialize and Deploy**
```bash
# From project root
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: hachiko-token (or your preferred name)
# - Build command: pnpm build
# - Publish directory: .next
```

4. **Deploy to Production**
```bash
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `.next`
   - **Node version**: `18`

---

## Required Configuration

### 1. Install Next.js Plugin

The `netlify.toml` file already includes the Next.js plugin. Netlify will automatically install it.

If you need to install it manually:
```bash
npm install -D @netlify/plugin-nextjs
```

### 2. Environment Variables

Set these in **Netlify Dashboard → Site settings → Environment variables**:

#### Required Variables:
```bash
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-anon-key"
```

#### Optional (Recommended for Production):
```bash
# For Upstash Redis rate limiting
KV_REST_API_URL="https://your-redis.upstash.io"
KV_REST_API_TOKEN="your-token"

# OR for standard Redis
REDIS_URL="redis://username:password@host:6379"
```

### 3. Build Settings

Already configured in `netlify.toml`:
- ✅ Build command: `pnpm build`
- ✅ Publish directory: `.next`
- ✅ Node version: 18
- ✅ Next.js plugin enabled
- ✅ Security headers configured
- ✅ Cache headers for static assets

---

## Post-Deployment Steps

### 1. Configure Custom Domain (Optional)

1. Go to **Site settings → Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `hachiko.fun`)
4. Follow DNS configuration instructions
5. Enable HTTPS (automatic with Netlify)

### 2. Update SEO Meta Tags

After deploying, update the domain in `src/app/layout.tsx`:
```typescript
metadataBase: new URL('https://your-actual-domain.netlify.app'),
```

### 3. Enable Netlify Functions (Optional)

If you want to use Netlify Functions for serverless API routes:
1. Create `netlify/functions` directory
2. Move API logic to serverless functions
3. Update API endpoints in your app

---

## Netlify-Specific Features

### Automatic Deployments
- Every push to `main` branch triggers a new deployment
- Preview deployments for pull requests
- Instant rollback to previous deployments

### Build Plugins
The project uses `@netlify/plugin-nextjs` which:
- Optimizes Next.js builds for Netlify
- Handles ISR (Incremental Static Regeneration)
- Manages serverless functions
- Optimizes image delivery

### Edge Functions
For even faster performance, consider using Netlify Edge Functions:
- Deploy functions to edge locations worldwide
- Sub-50ms response times
- Perfect for authentication and API routes

---

## Troubleshooting

### Build Fails

**Issue**: "Module not found" errors
**Solution**: 
```bash
# Clear cache and rebuild
netlify build --clear-cache
```

**Issue**: "Out of memory" during build
**Solution**: Add to `netlify.toml`:
```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Environment Variables Not Working

**Issue**: Variables not accessible in build
**Solution**:
1. Check variable names match exactly (case-sensitive)
2. Ensure `NEXT_PUBLIC_` prefix for client-side variables
3. Redeploy after adding variables

### Database Connection Issues

**Issue**: Can't connect to Supabase
**Solution**:
1. Verify `DATABASE_URL` uses connection pooler
2. Check Supabase project is not paused
3. Whitelist Netlify IPs in Supabase (or use connection pooler)

### Real-time Chat Not Working

**Issue**: WebSocket connections fail
**Solution**:
1. Verify Supabase Realtime is enabled
2. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
3. Ensure RLS policies allow reading messages

---

## Performance Optimization

### 1. Enable Netlify CDN
Already configured via headers in `netlify.toml`:
- Static assets cached for 1 year
- Images served from CDN
- Automatic compression (Brotli/Gzip)

### 2. Image Optimization
Next.js Image component automatically optimized by Netlify:
- WebP conversion
- Responsive images
- Lazy loading

### 3. Caching Strategy
```toml
# Static assets - 1 year cache
/_next/static/* → max-age=31536000

# API routes - no cache
/api/* → no-cache

# Pages - ISR cache
/* → stale-while-revalidate
```

---

## Monitoring & Analytics

### Netlify Analytics
Enable in dashboard for:
- Page views
- Unique visitors
- Top pages
- Traffic sources

### Supabase Monitoring
Monitor in Supabase dashboard:
- Database queries
- Realtime connections
- Storage usage
- API requests

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Datadog for APM

---

## Cost Estimation

### Netlify Free Tier
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ HTTPS included
- ✅ Deploy previews

**Estimated for Hachiko Token:**
- Small community (< 1000 users): Free tier sufficient
- Medium community (1000-10000 users): ~$19/month (Pro plan)
- Large community (> 10000 users): ~$99/month (Business plan)

### Supabase Free Tier
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ✅ 50,000 monthly active users

---

## Deployment Checklist

Before deploying to Netlify:

- [x] `netlify.toml` configured
- [x] `public/_redirects` created
- [x] Environment variables documented
- [x] Build tested locally
- [x] Database migrations ready
- [ ] Set environment variables in Netlify dashboard
- [ ] Enable Supabase Realtime
- [ ] Create Supabase storage bucket
- [ ] Update token contract address (when launched)
- [ ] Update domain in SEO meta tags
- [ ] Test deployment on Netlify preview

---

## Quick Commands

```bash
# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open:site

# View deployment logs
netlify logs

# Run build locally
netlify build

# Test functions locally
netlify dev

# Check site status
netlify status
```

---

## Support

- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/
- **Netlify Support**: https://answers.netlify.com

---

## 🎉 You're Ready to Deploy!

Your Hachiko token website is fully configured for Netlify deployment. Just run:

```bash
netlify deploy --prod
```

And your community platform will be live! 🐕🚀
