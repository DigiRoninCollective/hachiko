# 🚀 Hachiko Token - Deployment Checklist

## Pre-Deployment Verification ✅

### Build Status
- [x] Production build successful
- [x] All routes compiled
- [x] No TypeScript errors
- [x] No critical lint errors
- [x] Database migrations up to date (5 migrations applied)

### Core Features
- [x] Real-time chat with WebSocket
- [x] File upload system (images, PDFs, docs)
- [x] Jupiter swap integration
- [x] Admin dashboard
- [x] Todo CRUD API
- [x] Rate limiting (in-memory fallback ready)
- [x] SEO meta tags & Open Graph
- [x] Sitemap & robots.txt
- [x] Mobile responsive design

### Security
- [x] Supabase authentication
- [x] Row Level Security policies
- [x] Rate limiting on chat API
- [x] Content moderation
- [x] File upload validation
- [x] Admin route protection

---

## Deployment Steps

### 1. Environment Setup

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-anon-key"
```

**Optional (Recommended for Production):**
```bash
# Redis Rate Limiting - Choose ONE:
# Option A: Upstash (Vercel/Cloudflare)
KV_REST_API_URL="https://your-redis.upstash.io"
KV_REST_API_TOKEN="your-token"

# Option B: Standard Redis
REDIS_URL="redis://username:password@host:6379"
```

### 2. Supabase Configuration

#### A. Enable Realtime
1. Go to Supabase Dashboard → Database → Replication
2. Find `Message` table
3. Toggle **Realtime** to **ON**
4. Click **Save**

#### B. Create Storage Bucket
1. Go to Storage
2. Click **New bucket**
3. Name: `uploads`
4. Set **Public bucket** to **ON**
5. Click **Create bucket**

#### C. Storage Policies
Run in SQL Editor:
```sql
-- Allow anyone to read uploaded files
CREATE POLICY "Anyone can read uploads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');
```

#### D. Message Table RLS Policies
```sql
-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages"
ON public."Message"
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert messages
CREATE POLICY "Authenticated users can insert messages"
ON public."Message"
FOR INSERT
TO authenticated
WITH CHECK (true);
```

### 3. Database Migration

Run on your production database:
```bash
npx prisma migrate deploy
```

### 4. Update Token Contract Address

When your token launches, update in:
- `src/app/page.tsx` - Line 31: `contractAddress` constant
- `src/components/JupiterSwap.tsx` - Default prop value

### 5. Update Domain in SEO

Update in `src/app/layout.tsx`:
- Change `https://hachiko.fun` to your actual domain
- Update Twitter handle `@HachikoToken` if different

### 6. Deploy to Platform

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Other Platforms
- Ensure Node.js 18+ runtime
- Set all environment variables
- Build command: `pnpm build`
- Start command: `pnpm start`
- Output directory: `.next`

---

## Post-Deployment Verification

### Test Checklist

1. **Homepage**
   - [ ] Loads without errors
   - [ ] Jupiter swap button appears
   - [ ] Images load correctly
   - [ ] Mobile responsive

2. **Chat**
   - [ ] Can send messages
   - [ ] Messages appear in real-time
   - [ ] File upload works
   - [ ] Rate limiting activates after 5 messages

3. **Authentication**
   - [ ] Login page works
   - [ ] Supabase auth flow completes
   - [ ] Admin dashboard requires auth

4. **Admin Dashboard** (requires auth)
   - [ ] Stats display correctly
   - [ ] Can view users
   - [ ] Can view/delete messages
   - [ ] Can manage todos

5. **SEO**
   - [ ] Meta tags appear in page source
   - [ ] Open Graph preview works (test with Twitter/Discord)
   - [ ] Sitemap accessible at `/sitemap.xml`
   - [ ] Robots.txt accessible at `/robots.txt`

6. **Performance**
   - [ ] Lighthouse score > 90
   - [ ] First Contentful Paint < 2s
   - [ ] Time to Interactive < 3s

---

## Optional Enhancements

### Production Rate Limiting
Install Redis for better rate limiting:
```bash
pnpm add ioredis
```

Then set `REDIS_URL` or Upstash credentials in environment variables.

### Analytics
Add Google Analytics or Plausible:
1. Get tracking ID
2. Add to `src/app/layout.tsx`

### Monitoring
Consider adding:
- Sentry for error tracking
- Vercel Analytics
- Supabase monitoring dashboard

---

## Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify database connection
- Run `pnpm install` to ensure dependencies

### Chat Not Real-Time
- Verify Realtime is enabled in Supabase
- Check browser console for WebSocket errors
- Confirm RLS policies allow reading messages

### File Uploads Fail
- Verify `uploads` bucket exists and is public
- Check storage policies are configured
- Confirm file size < 10MB

### Rate Limiting Too Aggressive
- Adjust limits in `src/lib/chat-service.ts`
- Consider adding Redis for production

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Jupiter Docs**: https://station.jup.ag/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

## Final Notes

✅ **Your Hachiko token website is production-ready!**

All core features are implemented and tested:
- Real-time community chat
- Direct token swaps via Jupiter
- File sharing capabilities
- Admin moderation tools
- SEO optimized for social sharing
- Mobile-first responsive design

When your token launches, just update the contract address and you're live! 🐕🚀

**Good luck with your launch!**
