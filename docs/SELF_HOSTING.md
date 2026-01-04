# Self-Hosting on Your Own Computer

Yes! You can run this entire application on your own computer/server. Here's how:

## Quick Start (5 minutes)

### Option A: Development Mode (Easiest)

```bash
# 1. Clone the repo
git clone <your-repo>
cd nomnom

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Run migrations
npx prisma migrate dev

# 5. Start the server
npm run dev
```

**Access at:** http://localhost:3000

**No Redis needed!** It uses in-memory rate limiting automatically.

---

## Option B: Production Mode on Your Computer

### Prerequisites
- Node.js 20+ installed
- Redis installed (optional but recommended)

### Step 1: Install Redis (Optional)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Windows (WSL2):**
```bash
# First install WSL2, then:
sudo apt update
sudo apt install redis-server
redis-server --daemonize yes
```

**Verify Redis is running:**
```bash
redis-cli ping
# Should return: PONG
```

### Step 2: Set Up the Application

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
nano .env
```

**Minimal .env for self-hosting:**
```bash
# Database (use your Supabase or local Postgres)
DATABASE_URL="postgresql://user:password@localhost:5432/nomnom?pgbouncer=true"
DIRECT_URL="postgresql://user:password@localhost:5432/nomnom"

# Supabase (or keep using cloud Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-key"

# Redis (local)
REDIS_URL="redis://localhost:6379"

# Optional: Set custom port
PORT=3000
```

### Step 3: Build and Run

```bash
# Build the application
npm run build

# Start production server
npm start
```

**Access at:** http://localhost:3000

---

## Option C: Fully Self-Hosted (Database + App)

### Install PostgreSQL Locally

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

**In PostgreSQL shell:**
```sql
CREATE DATABASE nomnom;
CREATE USER nomnom_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE nomnom TO nomnom_user;
\q
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql

# Create database
createdb nomnom
```

### Configure for Local Database

**Update .env:**
```bash
DATABASE_URL="postgresql://nomnom_user:your-password@localhost:5432/nomnom"
DIRECT_URL="postgresql://nomnom_user:your-password@localhost:5432/nomnom"
REDIS_URL="redis://localhost:6379"

# For auth, you still need Supabase (or implement your own)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="your-key"
```

**Run migrations:**
```bash
npx prisma migrate deploy
npx prisma generate
```

---

## Make It Accessible to Your Network

### Option 1: Access from Other Devices on Your Network

**Find your local IP:**
```bash
# Linux/macOS
hostname -I | awk '{print $1}'
# or
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

**Update next.config.ts:**
```typescript
const nextConfig = {
  // ... existing config
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
```

**Start server with custom host:**
```bash
# Development
npm run dev -- -H 0.0.0.0

# Production
npm run build
npm start
```

**Access from other devices:**
- `http://192.168.1.XXX:3000` (replace with your IP)

### Option 2: Make It Public (Port Forwarding)

**If you want to access from the internet:**

1. **Port forward on your router:**
   - Forward external port 80 → internal 192.168.1.XXX:3000
   - Or use a different external port for security

2. **Get your public IP:**
   ```bash
   curl ifconfig.me
   ```

3. **Access via:**
   - `http://YOUR-PUBLIC-IP:PORT`

**⚠️ Security Warning:**
- Use a reverse proxy (Nginx) for SSL
- Set up firewall rules
- Consider using Cloudflare Tunnel instead (safer)

---

## Using Cloudflare Tunnel (Recommended for Public Access)

**Safest way to expose your local server to the internet:**

```bash
# 1. Install cloudflared
# Download from: https://github.com/cloudflare/cloudflared/releases

# 2. Login
cloudflared tunnel login

# 3. Create tunnel
cloudflared tunnel create nomnom

# 4. Route your domain
cloudflared tunnel route dns nomnom yourdomain.com

# 5. Run tunnel
cloudflared tunnel --url localhost:3000 run nomnom
```

**Now accessible at:** https://yourdomain.com (with free SSL!)

---

## Process Management (Keep Running)

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "nomnom" -- start

# Auto-restart on boot
pm2 startup
pm2 save

# Useful commands
pm2 status          # Check status
pm2 logs nomnom     # View logs
pm2 restart nomnom  # Restart app
pm2 stop nomnom     # Stop app
```

### Using systemd (Linux)

```bash
# Create service file
sudo nano /etc/systemd/system/nomnom.service
```

```ini
[Unit]
Description=Nomnom Chat App
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/nomnom
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable nomnom
sudo systemctl start nomnom
sudo systemctl status nomnom
```

---

## Resource Requirements

**Minimum:**
- CPU: 1 core
- RAM: 512MB (1GB recommended)
- Storage: 500MB
- Network: Any broadband

**Recommended:**
- CPU: 2 cores
- RAM: 2GB
- Storage: 2GB
- Network: Upload speed ≥ 5 Mbps for external access

---

## Performance Tips

1. **Use production build:**
   ```bash
   npm run build
   npm start  # NOT npm run dev
   ```

2. **Enable Redis:**
   - Much faster than in-memory
   - Required for multiple instances

3. **Use Nginx as reverse proxy:**
   - Better performance
   - SSL termination
   - Static file caching

4. **Monitor resources:**
   ```bash
   pm2 monit  # If using PM2
   htop       # System resources
   ```

---

## Backup Strategy

**Database (PostgreSQL):**
```bash
# Backup
pg_dump nomnom > backup.sql

# Restore
psql nomnom < backup.sql
```

**Redis (if using):**
```bash
# Backup (creates dump.rdb)
redis-cli SAVE

# Restore (copy dump.rdb to Redis directory)
```

**Application code:**
```bash
# Already in git!
git push origin main
```

---

## Troubleshooting

**Port 3000 already in use:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

**Can't access from other devices:**
- Check firewall: `sudo ufw allow 3000`
- Verify IP address: `hostname -I`
- Try: `npm run dev -- -H 0.0.0.0`

**Redis connection failed:**
```bash
# Check if running
redis-cli ping

# Restart Redis
sudo systemctl restart redis
```

**Database connection failed:**
```bash
# Check if PostgreSQL running
sudo systemctl status postgresql

# Check connection
psql -U nomnom_user -d nomnom -h localhost
```

---

## Cost Comparison

| Component | Cloud | Self-Hosted |
|-----------|-------|-------------|
| **App hosting** | $7-20/mo | Electricity (~$2/mo) |
| **Database** | $0-25/mo | Included |
| **Redis** | $0-7/mo | Included |
| **Total** | **$7-52/mo** | **~$2/mo** |

**Break-even:** Self-hosting pays for itself immediately if you have:
- Always-on computer (desktop, server)
- Raspberry Pi (uses ~$0.50/month electricity)
- Old laptop

---

## Next Steps

- [ ] Set up automatic backups
- [ ] Configure SSL with Let's Encrypt
- [ ] Set up monitoring (Uptime Kuma, etc.)
- [ ] Configure firewall rules
- [ ] Set up Nginx reverse proxy
- [ ] Add domain name (optional)

**Questions?** Check the other docs or open an issue!
