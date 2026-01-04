# Using a Custom Domain with Self-Hosting

You can absolutely use your own domain (like `nomnom.com` or `chat.yourdomain.com`) with self-hosting!

## Options Overview

| Method | Difficulty | Cost | SSL | Best For |
|--------|-----------|------|-----|----------|
| **Cloudflare Tunnel** | Easy | Free | Free (auto) | Most people ⭐ |
| **Cloudflare Proxy** | Easy | Free | Free (auto) | Static IP |
| **Direct DNS + Let's Encrypt** | Medium | Free | Free (manual) | Full control |
| **Ngrok** | Very Easy | $0-8/mo | Auto | Testing |

---

## Option 1: Cloudflare Tunnel (Recommended) ⭐

**Best choice because:**
- ✅ No port forwarding needed
- ✅ Free SSL certificate (automatic)
- ✅ DDoS protection
- ✅ Works behind NAT/CGNAT
- ✅ Hides your home IP address
- ✅ No static IP required

### Step 1: Buy a Domain

**Popular registrars:**
- **Cloudflare** - $8-10/year (recommended, easier integration)
- **Namecheap** - $8-12/year
- **Google Domains** - $12/year
- **Porkbun** - $5-10/year

### Step 2: Add Domain to Cloudflare

```bash
# If you didn't buy from Cloudflare:
# 1. Go to https://dash.cloudflare.com
# 2. Click "Add a Site"
# 3. Enter your domain
# 4. Choose Free plan
# 5. Update nameservers at your registrar
#    (copy from Cloudflare: jay.ns.cloudflare.com, etc.)
```

### Step 3: Install Cloudflare Tunnel

**Linux/macOS:**
```bash
# Download cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Or macOS
brew install cloudflare/cloudflare/cloudflared

# Or Windows
# Download from: https://github.com/cloudflare/cloudflared/releases
```

### Step 4: Create and Configure Tunnel

```bash
# 1. Login to Cloudflare
cloudflared tunnel login

# 2. Create a tunnel
cloudflared tunnel create nomnom

# 3. Create config file
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

**config.yml:**
```yaml
url: http://localhost:3000
tunnel: YOUR-TUNNEL-ID
credentials-file: /home/yourusername/.cloudflared/YOUR-TUNNEL-ID.json

ingress:
  - hostname: nomnom.com
    service: http://localhost:3000
  - hostname: www.nomnom.com
    service: http://localhost:3000
  - service: http_status:404
```

```bash
# 4. Route your domain to the tunnel
cloudflared tunnel route dns nomnom nomnom.com
cloudflared tunnel route dns nomnom www.nomnom.com

# 5. Run the tunnel
cloudflared tunnel run nomnom
```

### Step 5: Auto-Start Tunnel

**Using systemd (Linux):**
```bash
# Install as service
sudo cloudflared service install

# Start service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

**Using PM2 (cross-platform):**
```bash
pm2 start cloudflared --name tunnel -- tunnel run nomnom
pm2 save
pm2 startup
```

### Done! ✅

Your site is now live at:
- `https://nomnom.com` 
- `https://www.nomnom.com`

**Free SSL certificate auto-renewed by Cloudflare!**

---

## Option 2: Cloudflare Proxy (If You Have Static IP)

**Requirements:**
- Static IP address from ISP
- Can port forward

### Step 1: Set Up Domain

```bash
# 1. Add domain to Cloudflare (see Option 1, Step 2)
# 2. Go to DNS settings
# 3. Add A record:
```

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| A | @ | YOUR-PUBLIC-IP | ✅ Proxied | Auto |
| A | www | YOUR-PUBLIC-IP | ✅ Proxied | Auto |

### Step 2: Port Forward on Router

Forward these ports to your computer's local IP:
- Port 80 (HTTP) → 192.168.1.XXX:80
- Port 443 (HTTPS) → 192.168.1.XXX:443

### Step 3: Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

**Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/nomnom
```

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name nomnom.com www.nomnom.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/nomnom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Done! ✅

Access at `https://nomnom.com` (SSL handled by Cloudflare)

---

## Option 3: Direct DNS + Let's Encrypt (No Cloudflare)

**Requirements:**
- Static IP
- Port forwarding
- More technical

### Step 1: Configure DNS

At your domain registrar, add A records:

| Type | Name | Value |
|------|------|-------|
| A | @ | YOUR-PUBLIC-IP |
| A | www | YOUR-PUBLIC-IP |

### Step 2: Install Nginx + Certbot

```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx (same as Option 2)
sudo nano /etc/nginx/sites-available/nomnom
# (use same config as above)

sudo ln -s /etc/nginx/sites-available/nomnom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 3: Get SSL Certificate

```bash
# Certbot will auto-configure SSL
sudo certbot --nginx -d nomnom.com -d www.nomnom.com

# Test renewal
sudo certbot renew --dry-run

# Auto-renewal is set up automatically
```

### Done! ✅

Access at `https://nomnom.com`

**Certificate auto-renews every 90 days.**

---

## Option 4: Ngrok (Quick Testing)

**Best for:** Temporary testing, demos, development

```bash
# Install
brew install ngrok  # macOS
# or download from https://ngrok.com

# Sign up at ngrok.com (free)
ngrok authtoken YOUR-TOKEN

# Start tunnel
ngrok http 3000
```

**Get custom domain (paid plan $8/month):**
```bash
ngrok http 3000 --domain=nomnom.ngrok.app
```

**Pros:** Super easy, instant  
**Cons:** Random URL on free plan, costs for custom domain

---

## Dynamic DNS (If No Static IP)

**If your IP changes but you don't want Cloudflare Tunnel:**

Use Dynamic DNS service:
- **No-IP** - Free subdomains, $1.99/month for custom
- **DuckDNS** - Free
- **Cloudflare DDNS** - Free (with Cloudflare domain)

### Cloudflare Dynamic DNS

```bash
# Install ddclient
sudo apt install ddclient

# Or use this simple script
nano ~/update-cloudflare-ip.sh
```

```bash
#!/bin/bash
# Cloudflare Dynamic DNS updater

ZONE_ID="your-zone-id"
RECORD_ID="your-record-id"
API_TOKEN="your-api-token"
DOMAIN="nomnom.com"

IP=$(curl -s https://api.ipify.org)

curl -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
     -H "Authorization: Bearer $API_TOKEN" \
     -H "Content-Type: application/json" \
     --data "{\"type\":\"A\",\"name\":\"$DOMAIN\",\"content\":\"$IP\",\"proxied\":true}"
```

```bash
chmod +x ~/update-cloudflare-ip.sh

# Run every 5 minutes
crontab -e
# Add: */5 * * * * /home/yourusername/update-cloudflare-ip.sh
```

---

## Update Next.js Configuration

**For production with custom domain:**

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://nomnom.com', // Your domain
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

**Update Supabase allowed URLs:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your domain to Site URL: `https://nomnom.com`
3. Add to Redirect URLs: `https://nomnom.com/**`

---

## Cost Breakdown

### Yearly Costs:

**Cloudflare Tunnel (Recommended):**
- Domain: $8-12/year
- Cloudflare: $0 (free plan)
- Tunnel: $0 (free)
- SSL: $0 (included)
- **Total: $8-12/year** ⭐

**Traditional Setup:**
- Domain: $8-12/year
- Static IP: $0-50/year (some ISPs charge)
- SSL: $0 (Let's Encrypt)
- **Total: $8-62/year**

**Ngrok Custom Domain:**
- Domain: $8-12/year
- Ngrok Pro: $96/year
- **Total: $104-108/year**

---

## Complete Self-Hosted Setup Example

**Total one-time cost:** ~$8-12  
**Monthly cost:** ~$2 (electricity)

```bash
# 1. Buy domain (once/year)
# Go to cloudflare.com → Domain Registration → $8.57/year

# 2. Install software
npm install                    # App dependencies
sudo apt install redis-server  # Redis (free)
brew install cloudflared       # Cloudflare Tunnel (free)

# 3. Configure tunnel
cloudflared tunnel create nomnom
cloudflared tunnel route dns nomnom nomnom.com

# 4. Start everything
npm run build
pm2 start npm --name nomnom -- start
pm2 start cloudflared --name tunnel -- tunnel run nomnom
pm2 save

# Done! Live at https://nomnom.com
```

---

## Troubleshooting

**Domain not resolving:**
```bash
# Check DNS propagation (takes up to 48 hours)
dig nomnom.com
nslookup nomnom.com

# Use: https://dnschecker.org
```

**Cloudflare Tunnel not working:**
```bash
# Check tunnel status
cloudflared tunnel list
cloudflared tunnel info nomnom

# Check logs
journalctl -u cloudflared -f
```

**SSL certificate issues:**
```bash
# Check certificate
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

**Port forwarding not working:**
- Check router firewall
- Check if ISP blocks ports (use Cloudflare Tunnel instead)
- Verify with: `nc -zv YOUR-IP 80`

---

## Security Checklist

- [ ] Enable Cloudflare proxy (orange cloud)
- [ ] Set up firewall: `sudo ufw enable && sudo ufw allow 80,443/tcp`
- [ ] Use strong passwords in `.env`
- [ ] Enable Cloudflare Web Application Firewall (WAF)
- [ ] Set up rate limiting in Cloudflare dashboard
- [ ] Regular backups of database
- [ ] Keep software updated: `npm update`, `apt upgrade`

---

## Recommended Setup

**For most people:**
1. Buy domain from Cloudflare ($8.57/year)
2. Use Cloudflare Tunnel (free, secure, easy)
3. Run app on any computer (laptop, Pi, old desktop)
4. Cost: **$8.57/year** + electricity (~$2/month)

**Total: ~$33/year vs $84-624/year for cloud hosting!**

---

## Next Steps

- [ ] Buy domain
- [ ] Set up Cloudflare Tunnel
- [ ] Configure auto-start (PM2/systemd)
- [ ] Set up monitoring (Uptime Kuma)
- [ ] Configure backups
- [ ] Add analytics (optional)

**Questions?** Check `SELF_HOSTING.md` or create an issue!
