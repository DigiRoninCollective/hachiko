# Supabase Realtime Setup Guide

This guide will help you enable real-time chat functionality for your Hachiko token community.

## What is Realtime?

Supabase Realtime allows your chat to update instantly across all users without page refreshes. When someone sends a message, everyone sees it immediately via WebSocket connections.

## Setup Steps

### 1. Enable Realtime in Supabase Dashboard

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **Database** → **Replication**
3. Find the `Message` table in the list
4. Toggle **Realtime** to **ON** for the Message table
5. Click **Save**

### 2. Verify Database Permissions

Make sure your Message table has proper Row Level Security (RLS) policies:

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

To add these policies:
1. Go to **Database** → **Tables** → **Message**
2. Click on **Policies** tab
3. Add the policies above if they don't exist

### 3. Test Realtime Connection

Open your browser console and run:

```javascript
// Check if Realtime is working
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

const channel = supabase
  .channel('test')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'Message'
  }, payload => {
    console.log('New message!', payload);
  })
  .subscribe();

// You should see: "SUBSCRIBED" status
```

### 4. Configure Storage for File Uploads

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name it: `uploads`
4. Set **Public bucket** to **ON**
5. Click **Create bucket**

Add storage policies:

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

### 5. Environment Variables

Make sure your `.env` file has:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-anon-key"

# Database (Required)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

## How It Works

### Client-Side (ChartChatView.tsx)

```typescript
// 1. Initialize realtime connection
const realtime = new RealtimeChat();

// 2. Subscribe to new messages
const unsubscribe = realtime.subscribe((newMessage) => {
  // Add message to chat instantly
  setMessages(prev => [...prev, newMessage]);
});

// 3. Cleanup on unmount
return () => unsubscribe();
```

### Server-Side (Realtime.ts)

```typescript
// Listen for INSERT events on Message table
this.channel = this.supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'Message',
  }, (payload) => {
    // Transform and send to callback
    onMessage(transformedMessage);
  })
  .subscribe();
```

## Testing Realtime

### Test 1: Open Two Browser Windows

1. Open your site in two different browser windows
2. Send a message in one window
3. You should see it appear instantly in both windows

### Test 2: Check Console

Open browser DevTools → Console, you should see:

```
Realtime: SUBSCRIBED
```

If you see errors, check:
- Supabase URL and keys are correct
- Realtime is enabled for Message table
- RLS policies allow reading messages

### Test 3: Send a Message

```bash
# Use the API to send a test message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user-123",
    "username": "TestUser",
    "message": "Hello Hachiko community!"
  }'
```

All connected clients should see the message appear instantly.

## Troubleshooting

### Messages don't appear in real-time

**Check:**
1. Realtime is enabled in Supabase Dashboard
2. Browser console for connection errors
3. RLS policies allow SELECT on Message table
4. Environment variables are correct

**Solution:**
```bash
# Restart your dev server
pnpm dev
```

### "Realtime not enabled" error

**Solution:**
1. Go to Supabase Dashboard → Database → Replication
2. Enable Realtime for Message table
3. Wait 1-2 minutes for changes to propagate

### File uploads fail

**Check:**
1. Storage bucket named "uploads" exists
2. Bucket is set to public
3. Storage policies are configured
4. User is authenticated

**Solution:**
```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'uploads';

-- If not, create it via Dashboard or SQL
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true);
```

### Rate limiting kicks in too fast

**Check:**
- Current limit: 5 messages per minute per user
- Using in-memory store (dev) or Redis (production)

**Solution:**
```typescript
// Adjust in src/lib/chat-service.ts
const RATE_LIMIT_MAX_REQUESTS = 10; // Increase limit
const RATE_LIMIT_WINDOW = 60; // Keep 60 seconds
```

## Production Checklist

Before going live:

- [ ] Realtime enabled for Message table
- [ ] Storage bucket "uploads" created and public
- [ ] RLS policies configured for Message and Storage
- [ ] Environment variables set in production
- [ ] Redis configured for rate limiting (optional but recommended)
- [ ] Test with multiple users simultaneously
- [ ] Monitor Supabase dashboard for connection count

## Performance Tips

1. **Limit message history**: Only load last 50-100 messages
2. **Pagination**: Add "Load more" for older messages
3. **Connection pooling**: Supabase handles this automatically
4. **Rate limiting**: Prevents spam and abuse

## Cost Considerations

Supabase Realtime is included in all plans:

- **Free tier**: 200 concurrent connections, 2GB bandwidth
- **Pro tier**: 500 concurrent connections, 8GB bandwidth
- **Enterprise**: Unlimited

For a token community, the free tier should handle hundreds of active users.

## Next Steps

1. Enable Realtime in Supabase Dashboard
2. Create uploads storage bucket
3. Test with multiple browser windows
4. Deploy to production
5. Monitor usage in Supabase Dashboard

Your real-time chat is now ready for the Hachiko community! 🐕✨
