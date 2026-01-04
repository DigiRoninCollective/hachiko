# Deployment Without Vercel

This guide shows how to deploy your app to various platforms without using Vercel.

## Quick Comparison

| Platform | Best For | Redis Option | Price |
|----------|----------|--------------|-------|
| **Railway** | Easiest non-Vercel | Built-in Redis plugin | $5/month |
| **Render** | Simple deploys | Managed Redis | $7/month (app) + $7 (Redis) |
| **Fly.io** | Global edge | Upstash or self-hosted | ~$5/month |
| **Cloudflare Pages** | Static/SSG | Upstash (REST) | Free tier available |
| **AWS/DigitalOcean** | Full control | ElastiCache/Managed | Variable |
| **Self-hosted VPS** | Maximum control | Self-hosted Redis | $5-20/month |

---

## Option 1: Railway ⭐ **Recommended**

**Pros:** Easy setup, built-in Redis, automatic HTTPS, zero-config deploys

### Setup
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create new project
railway init

# 4. Add Redis plugin
railway add redis

# 5. Link environment variables
railway variables
# Copy REDIS_URL to your .env

# 6. Deploy
railway up
```

### Environment Variables
```bash
# Railway auto-provides:
DATABASE_URL=postgresql://...  # If you add Postgres
REDIS_URL=redis://...          # From Redis plugin

# You need to add:
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
DIRECT_URL=postgresql://...
```

**Cost:** ~$5/month for hobby plan

---

## Option 2: Render

**Pros:** Simple UI, good documentation, built-in SSL

### Setup
```bash
# 1. Create account at render.com
# 2. Click "New +" → "Web Service"
# 3. Connect your GitHub repo
# 4. Configure:
```

**Build Command:** `npm install && npm run build`  
**Start Command:** `npm start`  
**Environment:** Node 20+

### Add Redis
1. Click "New +" → "Redis"
2. Copy the Internal Redis URL
3. Add to environment variables as `REDIS_URL`

**Cost:** $7/month (web service) + $7/month (Redis)

---

## Option 3: Fly.io

**Pros:** Global edge network, generous free tier, Docker-based

### Setup
```bash
# 1. Install flyctl
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Launch app
fly launch

# 4. Use Upstash for Redis (free tier)
# Get credentials from https://console.upstash.com
fly secrets set KV_REST_API_URL=https://... KV_REST_API_TOKEN=...
```

### Dockerfile (auto-generated)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**Cost:** Free tier → ~$5/month

---

## Option 4: Self-Hosted VPS (DigitalOcean, Linode, etc.)

**Pros:** Full control, cheapest for high traffic

### Setup (Ubuntu 22.04)
```bash
# 1. SSH into server
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Redis
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 4. Clone your repo
git clone https://github.com/yourusername/nomnom.git
cd nomnom

# 5. Install dependencies
npm install

# 6. Set environment variables
nano .env
# Add all required vars including:
# REDIS_URL=redis://localhost:6379

# 7. Build
npm run build

# 8. Install PM2 for process management
npm install -g pm2
pm2 start npm --name "nomnom" -- start
pm2 startup
pm2 save

# 9. Setup Nginx reverse proxy
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/nomnom
```

**Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nomnom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. Setup SSL with Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

**Cost:** $5-20/month (VPS) + domain ($10/year)

---

## Option 5: Cloudflare Pages + Workers

**Pros:** Global CDN, generous free tier, built-in DDoS protection

### Setup
```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login
wrangler login

# 3. Configure
# Create wrangler.toml:
```

```toml
name = "nomnom"
compatibility_date = "2024-01-01"

[build]
command = "npm run build"

[env.production]
# Add your environment variables
```

### Use Upstash for Redis
```bash
# Get from https://console.upstash.com (free tier)
wrangler secret put KV_REST_API_URL
wrangler secret put KV_REST_API_TOKEN
```

**Cost:** Free for most use cases

---

## Environment Variables Checklist

All platforms need these:
```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...

# Redis (choose one)
REDIS_URL=redis://...                    # Standard Redis
# OR
KV_REST_API_URL=https://...              # Upstash
KV_REST_API_TOKEN=...
```

---

## Which Should You Choose?

**Just want it to work?** → Railway  
**Need global edge?** → Fly.io or Cloudflare  
**Maximum control?** → Self-hosted VPS  
**Tightest budget?** → Fly.io free tier + Upstash free tier  
**Scale to millions?** → AWS/GCP (not covered here)

---

## Redis Providers (if platform doesn't include)

1. **Upstash** (REST API) - Free tier, serverless-friendly
   - Get from: https://console.upstash.com
   - Works everywhere (no TCP needed)

2. **Railway Redis** - $1-5/month
   - Built into Railway platform

3. **Render Redis** - $7/month
   - Built into Render platform

4. **Self-hosted** - Free
   - `sudo apt install redis-server`
   - Best for VPS deployments
