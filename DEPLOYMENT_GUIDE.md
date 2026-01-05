# 🚀 NomNom Hachiko Token - Render Deployment Guide

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Repository** - Push your code to GitHub
3. **Environment Variables** - Configure as needed

## 🛠️ Step-by-Step Deployment

### 1. Connect GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select the `nomnom` repository

### 2. Configure Build Settings

```yaml
# Render will automatically detect Next.js
Name: nomnom-hachiko
Environment: Node
Build Command: npm run build
Start Command: npm run start
Instance Type: Free (or paid for better performance)
```

### 3. Set Environment Variables

#### Required Variables:
```
NODE_ENV=production
PORT=10000
```

#### Optional but Recommended:
```
# For rate limiting (production)
REDIS_URL=redis://your-redis-instance:6379

# For Solana integration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# For authentication
JWT_SECRET=your-secure-jwt-secret-here
```

### 4. Database Setup (Optional)

If you want persistent chat storage:

1. **Add PostgreSQL Database**
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `nomnom-db`
   - Plan: Free (or paid)

2. **Add Database URL to Environment Variables**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   DIRECT_URL=postgresql://user:password@host:5432/database
   ```

### 5. Redis Setup (Optional - for rate limiting)

1. **Add Redis**
   - Click **"New +"** → **"Redis"**
   - Name: `nomnom-redis`
   - Plan: Free

2. **Add Redis URL to Environment Variables**
   ```
   REDIS_URL=redis://user:password@host:6379
   ```

### 6. Deploy!

Click **"Create Web Service"** and Render will:
- Build your application
- Start the production server
- Provide a public URL

## 🔧 Environment Variables Explained

### Core Variables:
- **NODE_ENV**: Sets environment to production
- **PORT**: Render's default port (10000)

### Database Variables:
- **DATABASE_URL**: PostgreSQL connection string
- **DIRECT_URL**: Direct database connection

### Rate Limiting:
- **REDIS_URL**: Redis connection for production rate limiting
- **KV_REST_API_URL**: Alternative Upstash Redis URL
- **KV_REST_API_TOKEN**: Upstash Redis token

### Optional Enhancements:
- **SOLANA_RPC_URL**: Solana blockchain RPC endpoint
- **JWT_SECRET**: Secret for JWT tokens
- **WEBHOOK_SECRET**: Secret for GitHub webhooks

## 🚀 Post-Deployment Checklist

### ✅ Verify Deployment:
1. [ ] Site loads at provided URL
2. [ ] All sections scroll properly
3. [ ] Chat functionality works
4. [ ] Wisdom generator functions
5. [ ] Responsive design works

### ✅ Test Features:
1. [ ] Wallet connection (if Phantom installed)
2. [ ] Username changes (2 limit)
3. [ ] Rate limiting (if Redis configured)
4. [ ] Image gallery lightbox
5. [ ] External links open correctly

### ✅ Monitor Performance:
1. [ ] Check Render logs for errors
2. [ ] Monitor response times
3. [ ] Verify database connections (if configured)

## 🔍 Troubleshooting

### Common Issues:

#### Build Fails:
- Check `package.json` scripts
- Verify Node version compatibility
- Check for missing dependencies

#### Runtime Errors:
- Check environment variables
- Verify database connections
- Review Render logs

#### Performance Issues:
- Upgrade to paid instance
- Add Redis for rate limiting
- Optimize database queries

## 📱 Access Your Deployed App

Once deployed, your app will be available at:
```
https://nomnom-hachiko.onrender.com
```

## 🔄 Continuous Deployment

Render automatically deploys when you:
- Push to main branch
- Create pull requests
- Update environment variables

## 🛡️ Security Considerations

1. **Environment Variables** - Never commit secrets to Git
2. **Database Security** - Use strong passwords
3. **Rate Limiting** - Implement Redis for production
4. **HTTPS** - Automatically provided by Render

## 📊 Monitoring

Render provides:
- Build logs
- Runtime metrics
- Error tracking
- Performance monitoring

Access via **Render Dashboard** → **Your Service** → **Metrics**.

---

## 🎉 You're Ready!

Your NomNom Hachiko Token application is now deployed and ready for users! 🚀

For support, check [Render Documentation](https://render.com/docs) or review the logs in your Render dashboard.
