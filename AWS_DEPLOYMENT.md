# TradeLeague — AWS Deployment Guide (EC2 + RDS + ElastiCache)

This guide deploys TradeLeague on **AWS** using:

| Service | Purpose |
|---------|---------|
| **EC2** (t3.small) | Runs Docker containers (Django + Nginx + Redis) |
| **RDS** (PostgreSQL) | Production database |
| **ElastiCache** (Redis) | Django Channels WebSocket layer (optional) |
| **Elastic IP** | Fixed public IP for the EC2 instance |

> **Estimated cost**: ~$25–40/month (t3.small + db.t3.micro free-tier eligible).

---

## Prerequisites

- An **AWS account** (with billing enabled)
- **AWS CLI** installed on your local machine → [Install guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- A **GitHub** repo with your code pushed (or you can SCP the code)

---

## STEP 1 — Push Code to GitHub

```bash
cd 4Guys1Code
git add -A
git commit -m "production-ready: Docker, Nginx, Daphne, PostgreSQL support"
git push origin main
```

---

## STEP 2 — Create AWS Infrastructure

### 2A. Create a Security Group

1. Go to **AWS Console → EC2 → Security Groups → Create Security Group**
2. Name: `tradeleague-sg`
3. Add **Inbound Rules**:

| Type | Port | Source | Purpose |
|------|------|--------|---------|
| SSH | 22 | My IP | SSH access |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Web traffic (future SSL) |
| Custom TCP | 8000 | 0.0.0.0/0 | Direct Django access (testing only) |

4. Click **Create security group**

### 2B. Create an RDS PostgreSQL Instance

1. Go to **AWS Console → RDS → Create database**
2. Settings:
   - **Engine**: PostgreSQL 15
   - **Template**: Free tier
   - **DB instance identifier**: `tradeleague-db`
   - **Master username**: `postgres`
   - **Master password**: (choose a strong password, save it)
   - **DB instance class**: `db.t3.micro` (free-tier)
   - **Storage**: 20 GB gp3
   - **Public access**: **No**
   - **VPC security group**: Create new or use `tradeleague-sg`
     - Add inbound rule: PostgreSQL (5432) from `tradeleague-sg`
   - **Initial database name**: `tradeleague`
3. Click **Create database**
4. Wait ~5 min. Copy the **Endpoint** (e.g., `tradeleague-db.xxxx.us-east-1.rds.amazonaws.com`)

### 2C. Launch an EC2 Instance

1. Go to **AWS Console → EC2 → Launch Instance**
2. Settings:
   - **Name**: `tradeleague-server`
   - **AMI**: Amazon Linux 2023 (or Ubuntu 22.04 LTS)
   - **Instance type**: `t3.small` (2 vCPU, 2 GB RAM)
   - **Key pair**: Create new → name it `tradeleague-key` → Download `.pem` file
   - **Security group**: Select `tradeleague-sg`
   - **Storage**: 20 GB gp3
3. Click **Launch instance**

### 2D. Allocate Elastic IP

1. Go to **EC2 → Elastic IPs → Allocate Elastic IP address**
2. Click **Allocate**
3. Select the new IP → **Actions → Associate Elastic IP address**
4. Choose your `tradeleague-server` instance → **Associate**
5. Note the **Elastic IP** (e.g., `54.xxx.xxx.xxx`)

---

## STEP 3 — SSH into EC2 and Set Up

### 3A. Connect to EC2

```bash
# On your local machine (Windows PowerShell or Git Bash)
chmod 400 tradeleague-key.pem       # Linux/Mac only
ssh -i tradeleague-key.pem ec2-user@<YOUR_ELASTIC_IP>
```

> On **Windows**, use PuTTY or:
> ```powershell
> ssh -i tradeleague-key.pem ec2-user@54.xxx.xxx.xxx
> ```
> If using Ubuntu AMI, replace `ec2-user` with `ubuntu`.

### 3B. Install Docker & Docker Compose

**For Amazon Linux 2023:**
```bash
# Update system
sudo dnf update -y

# Install Docker
sudo dnf install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose v2
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# Install Git
sudo dnf install -y git

# IMPORTANT: Log out and back in for docker group to take effect
exit
```

**For Ubuntu 22.04:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
exit
```

SSH back in:
```bash
ssh -i tradeleague-key.pem ec2-user@<YOUR_ELASTIC_IP>
```

Verify Docker:
```bash
docker --version
docker compose version
```

---

## STEP 4 — Deploy the Application

### 4A. Clone Your Repository

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git tradeleague
cd tradeleague
```

> **Alternative** (if not on GitHub) — SCP from your local machine:
> ```powershell
> scp -i tradeleague-key.pem -r .\4Guys1Code\ ec2-user@<ELASTIC_IP>:~/tradeleague
> ```

### 4B. Create the Production `.env` File

```bash
cat > .env << 'EOF'
# Django
SECRET_KEY=put-a-random-50-character-string-here-abc123xyz
DEBUG=False
ALLOWED_HOSTS=<YOUR_ELASTIC_IP>,<YOUR_DOMAIN_IF_ANY>
CSRF_TRUSTED_ORIGINS=http://<YOUR_ELASTIC_IP>

# Database (RDS PostgreSQL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=tradeleague
DB_USER=postgres
DB_PASSWORD=<YOUR_RDS_PASSWORD>
DB_HOST=<YOUR_RDS_ENDPOINT>
DB_PORT=5432

# Redis (using local Docker Redis)
REDIS_URL=redis://redis:6379/0

# CORS
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=http://<YOUR_ELASTIC_IP>
EOF
```

**Replace the placeholders:**
- `<YOUR_ELASTIC_IP>` → your actual Elastic IP (e.g., `54.123.45.67`)
- `<YOUR_RDS_PASSWORD>` → the password you set in Step 2B
- `<YOUR_RDS_ENDPOINT>` → the RDS endpoint (e.g., `tradeleague-db.xxxx.us-east-1.rds.amazonaws.com`)

**Generate a real SECRET_KEY:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 4C. Build and Start the Containers

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

This will:
1. Build the Django app image (with Daphne ASGI server)
2. Start Redis container
3. Start Nginx reverse proxy on port 80
4. Run migrations automatically
5. Collect static files
6. Seed initial assets

### 4D. Verify Deployment

```bash
# Check all containers are running
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs nginx

# Test health endpoint
curl http://localhost/api/health/
```

Expected output:
```json
{"status": "backend running", "service": "fintech trading league api"}
```

### 4E. Create a Superuser

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

---

## STEP 5 — Open in Browser

Navigate to:
```
http://<YOUR_ELASTIC_IP>/
```

You should see your TradeLeague app running!

- **Admin panel**: `http://<YOUR_ELASTIC_IP>/admin/`
- **API health**: `http://<YOUR_ELASTIC_IP>/api/health/`
- **Dashboard**: `http://<YOUR_ELASTIC_IP>/dashboard/`

---

## STEP 6 — Set Up a Domain Name (Optional but Recommended)

### 6A. Register/Use a Domain

1. Go to **AWS Route 53** (or any registrar like Namecheap, GoDaddy)
2. Create a **Hosted Zone** for your domain
3. Add an **A Record**:
   - Name: `@` (or `tradeleague`)
   - Type: A
   - Value: `<YOUR_ELASTIC_IP>`
   - TTL: 300

### 6B. Update `.env`

```bash
# Update ALLOWED_HOSTS and CSRF
nano .env
```

Add your domain:
```
ALLOWED_HOSTS=<ELASTIC_IP>,yourdomain.com,www.yourdomain.com
CSRF_TRUSTED_ORIGINS=http://yourdomain.com,https://yourdomain.com
CORS_ALLOWED_ORIGINS=http://yourdomain.com,https://yourdomain.com
```

Restart:
```bash
docker compose -f docker-compose.prod.yml up -d
```

### 6C. Add Free SSL with Let's Encrypt (HTTPS)

```bash
# Install Certbot on EC2
sudo dnf install -y certbot    # Amazon Linux 2023
# or
sudo apt install -y certbot    # Ubuntu

# Stop Nginx temporarily (to free port 80)
docker compose -f docker-compose.prod.yml stop nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificate files will be at:
#   /etc/letsencrypt/live/yourdomain.com/fullchain.pem
#   /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

Then update `nginx/nginx.conf` to add HTTPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # ... rest of the config (same location blocks) ...
}
```

Mount the certs in `docker-compose.prod.yml` under the nginx service:
```yaml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

Restart:
```bash
docker compose -f docker-compose.prod.yml up -d
```

Set up auto-renewal:
```bash
sudo crontab -e
# Add this line:
0 3 * * * certbot renew --pre-hook "docker compose -f /home/ec2-user/tradeleague/docker-compose.prod.yml stop nginx" --post-hook "docker compose -f /home/ec2-user/tradeleague/docker-compose.prod.yml start nginx"
```

---

## Common Operations

### View Logs
```bash
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Restart After Code Update
```bash
cd ~/tradeleague
git pull origin main
docker compose -f docker-compose.prod.yml up --build -d
```

### Run Django Management Commands
```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py <command>
```

### Database Backup (RDS)
```bash
# Create RDS snapshot via AWS Console or CLI:
aws rds create-db-snapshot \
  --db-instance-identifier tradeleague-db \
  --db-snapshot-identifier tradeleague-backup-$(date +%Y%m%d)
```

### Stop Everything
```bash
docker compose -f docker-compose.prod.yml down
```

### Full Reset (wipe data)
```bash
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        AWS Cloud                         │
│                                                          │
│  ┌──────────── EC2 (t3.small) ───────────────────────┐  │
│  │                                                     │  │
│  │  ┌─────────┐    ┌──────────┐    ┌───────────────┐ │  │
│  │  │  Nginx  │───►│  Daphne  │───►│ Django App    │ │  │
│  │  │ :80/443 │    │  :8000   │    │ (ASGI)        │ │  │
│  │  └─────────┘    └──────────┘    └───────┬───────┘ │  │
│  │                                          │         │  │
│  │                 ┌─────────┐              │         │  │
│  │                 │  Redis  │◄─────────────┤         │  │
│  │                 │  :6379  │  (WebSocket) │         │  │
│  │                 └─────────┘              │         │  │
│  └──────────────────────────────────────────┼─────────┘  │
│                                              │            │
│            ┌─────────────────────┐           │            │
│            │    RDS PostgreSQL   │◄──────────┘            │
│            │   (db.t3.micro)    │                         │
│            └─────────────────────┘                        │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `502 Bad Gateway` | Check backend logs: `docker compose -f docker-compose.prod.yml logs backend` |
| `Database connection refused` | Verify RDS security group allows port 5432 from EC2's security group |
| WebSocket not connecting | Ensure Nginx config has the `/ws/` location block with upgrade headers |
| Static files 404 | Run `docker compose -f docker-compose.prod.yml exec backend python manage.py collectstatic` |
| Permission denied (Docker) | Re-login after `usermod -aG docker ec2-user` or prefix with `sudo` |
| `CSRF verification failed` | Ensure `CSRF_TRUSTED_ORIGINS` in `.env` includes your domain with protocol |

---

## Budget-Friendly Alternative: Skip RDS

If you want to keep costs minimal, you can use the Docker Redis container (already in docker-compose.prod.yml) and **SQLite** instead of RDS:

1. In `.env`, don't set `DB_ENGINE` — it will default to SQLite
2. Remove the RDS instructions above
3. Add a volume for the SQLite file in `docker-compose.prod.yml`:
   ```yaml
   backend:
     volumes:
       - sqlite_data:/app
   ```

> **Warning**: SQLite is not recommended for production with concurrent users, but it works for demos/small deployments.
