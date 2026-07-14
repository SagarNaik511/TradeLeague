# TradeLeague — Complete AWS Deployment Guide (Beginner-Friendly)

> **Who is this for?** You've never deployed anything to AWS before. This guide holds your hand through every single click.

---

## What Are We Doing?

We're putting your Django app on the internet so anyone in the world can access it. Think of AWS as renting a computer in a data center that runs 24/7.

**What we'll use:**

| AWS Service | What It Is (Plain English) | Why We Need It |
|-------------|---------------------------|----------------|
| **EC2** | A virtual computer (server) running Linux in AWS's data center | Runs your Django app |
| **RDS** | A managed PostgreSQL database | Stores your app's data (users, trades, rooms, etc.) |
| **Elastic IP** | A permanent public IP address | So your app's address doesn't change every time the server restarts |
| **Security Group** | A firewall / set of rules | Controls who can access your server and on which ports |

**Estimated cost:** ~$15–25/month (both EC2 and RDS have 12-month free-tier options for new accounts).

---

## What You Need Before Starting

1. A **credit/debit card** (AWS requires one even for free tier)
2. Your **code pushed to GitHub** (you already did this)
3. About **45 minutes** of time

---

## STEP 1 — Create an AWS Account

> Skip this if you already have an AWS account.

1. Open your browser and go to: **https://aws.amazon.com/**
2. Click the orange **"Create an AWS Account"** button (top-right)
3. Fill in:
   - **Email address**: Use your real email
   - **AWS account name**: `TradeLeague` (or anything you want)
4. Click **Verify email address** — check your inbox for a verification code
5. Enter the code
6. Set a **Root user password** (save this somewhere safe!)
7. Choose **Personal** account type
8. Enter your **real name, phone number, and address**
9. Enter **credit/debit card info** (they charge $1 to verify, then refund it)
10. **Phone verification**: Choose Text message, enter the code you receive
11. Select **Basic support — Free**
12. Click **Complete sign up**

You'll get a "Congratulations" page. Click **Go to the AWS Management Console**.

---

## STEP 2 — Sign In and Choose a Region

1. Go to **https://console.aws.amazon.com/**
2. Sign in as **Root user** with the email and password from Step 1
3. In the **top-right corner**, you'll see a region name (e.g., "N. Virginia"). Click it.
4. Choose a region close to your users. Good default choices:
   - **US East (N. Virginia)** → `us-east-1` (cheapest, most services)
   - **Asia Pacific (Mumbai)** → `ap-south-1` (if your users are in India)

> **IMPORTANT**: Remember your region. Everything you create must be in the SAME region.

---

## STEP 3 — Create a Key Pair (Your SSH Password File)

> A key pair is like a password file that lets you log into your server. You CANNOT log in without it.

1. In the top search bar, type **"EC2"** and click on **EC2**
2. In the left sidebar, scroll down and click **"Key Pairs"** (under "Network & Security")
3. Click the orange **"Create key pair"** button
4. Fill in:
   - **Name**: `tradeleague-key`
   - **Key pair type**: RSA
   - **Private key file format**: `.pem` (if you use PowerShell/Terminal) or `.ppk` (if you use PuTTY)
   - **For Windows users**: Choose `.pem` — Windows 10/11 has built-in SSH
5. Click **"Create key pair"**
6. A file called `tradeleague-key.pem` will **automatically download**

> **CRITICAL: Save this file somewhere safe! You can never download it again.** 
> Move it to a known location, e.g., `C:\Users\sagar\Downloads\tradeleague-key.pem`

---

## STEP 4 — Create a Security Group (Firewall Rules)

> A security group controls which traffic is allowed in and out of your server. Without this, nobody (including you) can reach your app.

1. You should still be in the **EC2 Dashboard**. If not, search "EC2" in the top bar.
2. In the left sidebar, click **"Security Groups"** (under "Network & Security")
3. Click the orange **"Create security group"** button
4. Fill in:
   - **Security group name**: `tradeleague-sg`
   - **Description**: `Security group for TradeLeague app`
   - **VPC**: Leave the default (it's already selected)

5. Under **"Inbound rules"**, click **"Add rule"** four times and fill in each row:

   **Rule 1 — SSH (so you can connect to the server):**
   - Type: **SSH**
   - Port range: (auto-fills to **22**)
   - Source: **My IP** (dropdown — this auto-detects your current IP)
   
   **Rule 2 — HTTP (so people can visit your website):**
   - Type: **HTTP**
   - Port range: (auto-fills to **80**)
   - Source: **Anywhere-IPv4** (`0.0.0.0/0`)
   
   **Rule 3 — HTTPS (for future SSL):**
   - Type: **HTTPS**
   - Port range: (auto-fills to **443**)
   - Source: **Anywhere-IPv4** (`0.0.0.0/0`)

   **Rule 4 — PostgreSQL (so EC2 can talk to the database):**
   - Type: **PostgreSQL**
   - Port range: (auto-fills to **5432**)
   - Source: **Custom** → type `tradeleague-sg` in the search box and select your own security group
   
6. **Outbound rules**: Leave as default (Allow all traffic)
7. Click **"Create security group"**

> You'll see your new security group with an ID like `sg-0abc123def456`. You'll need this later.

---

## STEP 5 — Create the Database (RDS PostgreSQL)

> RDS is a database that AWS manages for you. You don't have to install PostgreSQL or worry about backups — AWS handles it.

1. In the top search bar, type **"RDS"** and click on **RDS**
2. Click the orange **"Create database"** button
3. Fill in each section:

   **Choose a database creation method:**
   - Select: **Standard create**

   **Engine options:**
   - Engine type: **PostgreSQL**
   - Engine version: **PostgreSQL 15** (or the latest available)

   **Templates:**
   - Select: **Free tier** (this keeps it free for 12 months!)

   **Settings:**
   - DB instance identifier: `tradeleague-db`
   - Master username: `postgres`
   - **Credentials management**: Self managed
   - Master password: Enter a strong password (e.g., `TradeL3ague$2026`)
   - Confirm password: Same password again
   
   > **WRITE THIS PASSWORD DOWN — you'll need it later!**

   **Instance configuration:**
   - DB instance class: **db.t3.micro** (should be pre-selected for free tier)

   **Storage:**
   - Storage type: **gp3**
   - Allocated storage: **20** GB
   - **UNcheck** "Enable storage autoscaling" (to avoid surprise costs)

   **Connectivity:**
   - Compute resource: **Don't connect to an EC2 compute resource** (we'll do this manually)
   - Network type: **IPv4**
   - VPC: **Default VPC**
   - DB subnet group: **default**
   - Public access: **No** (important for security!)
   - VPC security group: **Choose existing** → select **tradeleague-sg**
   - Remove the "default" security group if it was auto-added
   - Availability Zone: **No preference**

   **Database authentication:**
   - Select: **Password authentication**

   **Additional configuration** (click to expand):
   - Initial database name: `tradeleague`
   - **UNcheck** "Enable automated backups" (saves cost on free tier)
   - **UNcheck** "Enable encryption" (not needed for a small project)
   - **UNcheck** all Monitoring options (saves cost)

4. Click **"Create database"**

5. **Wait 5–10 minutes** for the database to be created. You'll see the status change from "Creating" to "Available".

6. **Copy the Endpoint:**
   - Click on your database name `tradeleague-db`
   - Under **"Connectivity & security"** tab, find **Endpoint**
   - It looks like: `tradeleague-db.c9abcdef1234.us-east-1.rds.amazonaws.com`
   - **Copy this — you'll need it later!**

---

## STEP 6 — Launch the EC2 Instance (Your Server)

> This is the virtual computer that will run your Django app.

1. In the top search bar, type **"EC2"** and click on **EC2**
2. Click the orange **"Launch instance"** button

3. Fill in each section:

   **Name and tags:**
   - Name: `tradeleague-server`

   **Application and OS images (AMI):**
   - Click **"Ubuntu"** (the orange Ubuntu logo)
   - Select: **Ubuntu Server 24.04 LTS** (or 22.04 LTS)
   - Architecture: **64-bit (x86)**

   **Instance type:**
   - Select: **t3.small** (2 vCPU, 2 GB RAM — costs ~$0.02/hour ≈ $15/month)
   - If you want free-tier: **t2.micro** (1 vCPU, 1 GB RAM — free for 12 months, but tight on memory)

   **Key pair (login):**
   - Select: **tradeleague-key** (the one you created in Step 3)

   **Network settings:**
   - Click **"Edit"** (top-right of the Network settings section)
   - Firewall (security groups): **Select existing security group**
   - Common security groups: Select **tradeleague-sg**
   
   **Configure storage:**
   - Change to **20 GiB** gp3

4. **Review the "Summary" panel** on the right side:
   - Instance type: t3.small (or t2.micro)
   - AMI: Ubuntu
   - Key pair: tradeleague-key
   - Security group: tradeleague-sg

5. Click **"Launch instance"**

6. You'll see a green "Success" message. Click **"View all instances"**.

7. Wait for the **Instance state** to show **"Running"** and **Status check** to show **"2/2 checks passed"** (takes 1-2 minutes).

---

## STEP 7 — Get a Permanent IP Address (Elastic IP)

> Without this, your server gets a new IP every time it restarts. An Elastic IP is a fixed address.

1. In the EC2 left sidebar, click **"Elastic IPs"** (under "Network & Security")
2. Click **"Allocate Elastic IP address"**
3. Leave everything default, click **"Allocate"**
4. You'll see a new IP address (e.g., `54.198.42.156`). **Write this down!**
5. Select the checkbox next to the new IP
6. Click **"Actions"** (top-right) → **"Associate Elastic IP address"**
7. In the form:
   - Resource type: **Instance**
   - Instance: Click the search box and select **tradeleague-server**
   - Private IP address: Leave default
8. Click **"Associate"**

Your server now has a permanent IP address!

---

## STEP 8 — Connect to Your Server (SSH from Windows)

> SSH is how you talk to/control your Linux server from your Windows PC. It's like a remote command prompt.

### Option A: Using Windows PowerShell (Recommended)

1. Open **Windows PowerShell** (search "PowerShell" in Start menu)

2. Navigate to where your key file is:
   ```powershell
   cd C:\Users\sagar\Downloads
   ```
   (or wherever you saved `tradeleague-key.pem`)

3. Connect to your server:
   ```powershell
   ssh -i tradeleague-key.pem ubuntu@YOUR_ELASTIC_IP
   ```
   Replace `YOUR_ELASTIC_IP` with your actual IP from Step 7 (e.g., `54.198.42.156`)

   **Example:**
   ```powershell
   ssh -i tradeleague-key.pem ubuntu@54.198.42.156
   ```

4. If you see: `Are you sure you want to continue connecting (yes/no/[fingerprint])?`
   - Type `yes` and press Enter

5. You should now see something like:
   ```
   ubuntu@ip-172-31-xx-xx:~$
   ```
   **Congratulations — you're inside your AWS server!**

### Option B: Using AWS Console (If SSH Doesn't Work)

1. Go to **EC2 → Instances**
2. Select your **tradeleague-server** instance
3. Click **"Connect"** (top bar)
4. Choose **"EC2 Instance Connect"** tab
5. Click **"Connect"** — this opens a browser-based terminal

### If SSH gives "Permission denied":
```powershell
# On Windows, you may need to fix key permissions:
icacls tradeleague-key.pem /inheritance:r
icacls tradeleague-key.pem /grant:r "%USERNAME%:R"
```
Then try the ssh command again.

---

## STEP 9 — Install Docker on Your Server

> Docker lets you run your app in containers (like lightweight virtual machines). It packages your Django app with everything it needs.

**Run these commands one by one on the server (you should be SSH'd in from Step 8):**

```bash
# 1. Update the system
sudo apt update && sudo apt upgrade -y
```

```bash
# 2. Install Docker
sudo apt install -y docker.io
```

```bash
# 3. Start Docker and make it start automatically on boot
sudo systemctl start docker
sudo systemctl enable docker
```

```bash
# 4. Let your user run Docker without "sudo"
sudo usermod -aG docker ubuntu
```

```bash
# 5. Install Docker Compose (the tool that runs multiple containers)
sudo apt install -y docker-compose-v2
```

```bash
# 6. Install Git (to download your code)
sudo apt install -y git
```

```bash
# 7. IMPORTANT: Log out so the Docker permission takes effect
exit
```

**SSH back in:**
```powershell
ssh -i tradeleague-key.pem ubuntu@YOUR_ELASTIC_IP
```

**Verify Docker is working:**
```bash
docker --version
```
Expected: `Docker version 24.x.x` (or newer)

```bash
docker compose version
```
Expected: `Docker Compose version v2.x.x`

If both commands show version numbers, Docker is ready!

---

## STEP 10 — Download Your Code to the Server

```bash
# Go to your home directory
cd ~

# Clone your GitHub repo (replace with YOUR actual GitHub URL)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git tradeleague
```

**Example (replace with your real URL):**
```bash
git clone https://github.com/sagar/TradeLeague.git tradeleague
```

> **If your repo is private**, GitHub will ask for credentials. Use a Personal Access Token:
> 1. Go to https://github.com/settings/tokens
> 2. Click "Generate new token (classic)"
> 3. Give it "repo" permission, generate it, copy the token
> 4. When git asks for password, paste the token (not your GitHub password)

Now enter the project directory:
```bash
cd tradeleague
```

Check the files are there:
```bash
ls -la
```
You should see `Dockerfile`, `docker-compose.prod.yml`, `manage.py`, etc.

---

## STEP 11 — Create the Environment File

> The `.env` file contains sensitive configuration (passwords, secret keys). We create this directly on the server so it's never pushed to GitHub.

### 11A. Generate a Secret Key

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```
This outputs a random string like: `Kj9x2bR7mN3pQ5w_Yt8vL1cF6hD4gA0sE...`

**Copy this string** — you'll paste it below.

### 11B. Create the .env file

```bash
nano .env
```

This opens a text editor in the terminal. Type (or paste) the following, replacing the placeholders:

```
SECRET_KEY=PASTE_YOUR_GENERATED_SECRET_KEY_HERE
DEBUG=False
ALLOWED_HOSTS=YOUR_ELASTIC_IP
CSRF_TRUSTED_ORIGINS=http://YOUR_ELASTIC_IP

DB_ENGINE=django.db.backends.postgresql
DB_NAME=tradeleague
DB_USER=postgres
DB_PASSWORD=YOUR_RDS_PASSWORD_FROM_STEP_5
DB_HOST=YOUR_RDS_ENDPOINT_FROM_STEP_5
DB_PORT=5432

REDIS_URL=redis://redis:6379/0

CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=http://YOUR_ELASTIC_IP
```

**Replace these values:**

| Placeholder | What to Put | Example |
|-------------|-------------|---------|
| `PASTE_YOUR_GENERATED_SECRET_KEY_HERE` | The string from Step 11A | `Kj9x2bR7mN3pQ5w_Yt8vL1cF6hD4gA0sE` |
| `YOUR_ELASTIC_IP` | Your IP from Step 7 (3 places!) | `54.198.42.156` |
| `YOUR_RDS_PASSWORD_FROM_STEP_5` | The password you chose for the database | `TradeL3ague$2026` |
| `YOUR_RDS_ENDPOINT_FROM_STEP_5` | The endpoint from Step 5.6 | `tradeleague-db.c9abcdef1234.us-east-1.rds.amazonaws.com` |

**Example of a completed .env file:**
```
SECRET_KEY=Kj9x2bR7mN3pQ5w_Yt8vL1cF6hD4gA0sEaBcDeFgHiJkLmNoPqRsTuVw
DEBUG=False
ALLOWED_HOSTS=54.198.42.156
CSRF_TRUSTED_ORIGINS=http://54.198.42.156

DB_ENGINE=django.db.backends.postgresql
DB_NAME=tradeleague
DB_USER=postgres
DB_PASSWORD=TradeL3ague$2026
DB_HOST=tradeleague-db.c9abcdef1234.us-east-1.rds.amazonaws.com
DB_PORT=5432

REDIS_URL=redis://redis:6379/0

CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=http://54.198.42.156
```

### 11C. Save and exit nano:
1. Press **Ctrl + O** (that's the letter O, not zero) → press **Enter** to save
2. Press **Ctrl + X** to exit

### 11D. Verify the file was saved:
```bash
cat .env
```
You should see your configuration printed.

---

## STEP 12 — Build and Launch the App!

> This is the exciting part. One command builds everything and starts your app.

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

**What this does:**
- `docker compose` — the tool that manages multiple containers
- `-f docker-compose.prod.yml` — use the production config file
- `up` — start the containers
- `--build` — build the Docker images from scratch
- `-d` — run in the background (detached mode), so it keeps running after you close the terminal

**This will take 3–5 minutes** the first time (downloading images, installing packages).

You'll see output like:
```
[+] Building 120.5s (12/12) FINISHED
[+] Running 3/3
 ✔ Container tradeleague-redis-1    Started
 ✔ Container tradeleague-backend-1  Started
 ✔ Container tradeleague-nginx-1    Started
```

### 12A. Verify Everything Is Running

```bash
docker compose -f docker-compose.prod.yml ps
```

You should see **3 containers**, all with status **"Up"**:
```
NAME                        STATUS
tradeleague-backend-1       Up
tradeleague-nginx-1         Up
tradeleague-redis-1         Up
```

### 12B. Check the Backend Logs (Important!)

```bash
docker compose -f docker-compose.prod.yml logs backend
```

Look for these success messages:
```
Database ready!
Running migrations...
Collecting static files...
Starting Daphne (ASGI) server...
```

**If you see errors**, see the Troubleshooting section at the bottom.

### 12C. Test the Health Endpoint

```bash
curl http://localhost/api/health/
```

Expected output:
```json
{"status": "backend running", "service": "fintech trading league api"}
```

If you see this, your app is running!

---

## STEP 13 — Create an Admin User

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

It will ask you:
```
Username: admin
Email address: your@email.com
Password: (type a password, it won't show on screen)
Password (again): (same password)
```

---

## STEP 14 — Open Your App in the Browser!

On your local computer (not the server), open your browser and go to:

```
http://YOUR_ELASTIC_IP/
```

**Example:** `http://54.198.42.156/`

You should see your TradeLeague app!

**Other pages to try:**
- Login: `http://54.198.42.156/login/`
- Admin panel: `http://54.198.42.156/admin/` (use the superuser from Step 13)
- API health check: `http://54.198.42.156/api/health/`

---

## You're DONE! Your App Is Live on the Internet!

Anyone in the world can now visit `http://YOUR_ELASTIC_IP/` to use your app.

---

---

## EXTRA STEPS (Optional but Recommended)

---

### EXTRA A — Add a Custom Domain Name (e.g., tradeleague.com)

> Instead of people typing an IP address, they can type a nice domain name.

1. **Buy a domain** from any registrar:
   - [Namecheap](https://namecheap.com) (~$9/year for .com)
   - [GoDaddy](https://godaddy.com)
   - [AWS Route 53](https://aws.amazon.com/route53/) (~$12/year for .com)

2. **Point the domain to your server:**
   - Go to your domain registrar's DNS settings
   - Add an **A Record**:
     - **Host/Name**: `@` (means the root domain)
     - **Value/Points to**: `YOUR_ELASTIC_IP` (e.g., `54.198.42.156`)
     - **TTL**: 300 (or "Automatic")
   - If you want `www.yourdomain.com` too, add another A Record:
     - **Host/Name**: `www`
     - **Value**: same Elastic IP

3. **Wait 5–30 minutes** for DNS to propagate

4. **Update your .env file** on the server:
   ```bash
   cd ~/tradeleague
   nano .env
   ```
   
   Change these lines:
   ```
   ALLOWED_HOSTS=54.198.42.156,yourdomain.com,www.yourdomain.com
   CSRF_TRUSTED_ORIGINS=http://54.198.42.156,http://yourdomain.com
   CORS_ALLOWED_ORIGINS=http://54.198.42.156,http://yourdomain.com
   ```
   
   Save: Ctrl+O, Enter, Ctrl+X

5. **Restart the app:**
   ```bash
   docker compose -f docker-compose.prod.yml down
   docker compose -f docker-compose.prod.yml up -d
   ```

6. **Test:** Go to `http://yourdomain.com` in your browser

---

### EXTRA B — Add Free HTTPS (SSL Certificate with Let's Encrypt)

> The lock icon in the browser. Encrypts traffic. Required for production apps.

**On your server (SSH in first):**

```bash
# 1. Install Certbot
sudo apt install -y certbot
```

```bash
# 2. Stop Nginx temporarily (Certbot needs port 80)
cd ~/tradeleague
docker compose -f docker-compose.prod.yml stop nginx
```

```bash
# 3. Get the certificate (replace yourdomain.com with your actual domain)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

Certbot will ask:
- **Email**: Enter your email (for renewal reminders)
- **Terms of service**: Type `Y`
- **Share email with EFF**: Type `N` (optional)

If successful, you'll see:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/yourdomain.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

```bash
# 4. Update Nginx config for HTTPS
nano ~/tradeleague/nginx/nginx.conf
```

**Delete everything in the file** and paste this (replace `yourdomain.com` everywhere):

```nginx
upstream django {
    server backend:8000;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 10M;

    location /static/ {
        alias /app/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /ws/ {
        proxy_pass http://django;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    location / {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

Save: Ctrl+O, Enter, Ctrl+X

```bash
# 5. Mount the certificate in docker-compose.prod.yml
nano ~/tradeleague/docker-compose.prod.yml
```

Under the `nginx` service, update the `ports` and `volumes` section:
```yaml
  nginx:
    image: nginx:1.25-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - static_data:/app/staticfiles:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

Save: Ctrl+O, Enter, Ctrl+X

```bash
# 6. Update .env
nano ~/tradeleague/.env
```

Change the CSRF and CORS lines to use `https://`:
```
CSRF_TRUSTED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Save: Ctrl+O, Enter, Ctrl+X

```bash
# 7. Restart everything
docker compose -f docker-compose.prod.yml up -d
```

```bash
# 8. Set up auto-renewal (certificates expire every 90 days)
sudo crontab -e
```
If it asks which editor, choose **1** (nano).

Add this line at the bottom:
```
0 3 1,15 * * certbot renew --pre-hook "cd /home/ubuntu/tradeleague && docker compose -f docker-compose.prod.yml stop nginx" --post-hook "cd /home/ubuntu/tradeleague && docker compose -f docker-compose.prod.yml start nginx"
```
Save: Ctrl+O, Enter, Ctrl+X

Now visit `https://yourdomain.com` — you should see the lock icon!

---

## Day-to-Day Operations (Reference)

### How to Update Your App After Code Changes

**On your local PC:**
```powershell
cd C:\Users\sagar\OneDrive\Desktop\TradeLeague\4Guys1Code
git add -A
git commit -m "your change description"
git push origin main
```

**On the server (SSH in):**
```bash
cd ~/tradeleague
git pull origin main
docker compose -f docker-compose.prod.yml up --build -d
```

That's it — your app is updated!

### How to View Logs (If Something Goes Wrong)

```bash
# See Django app logs
docker compose -f docker-compose.prod.yml logs -f backend

# See Nginx (web server) logs
docker compose -f docker-compose.prod.yml logs -f nginx

# See all logs
docker compose -f docker-compose.prod.yml logs -f

# Press Ctrl+C to stop watching logs
```

### How to Restart the App

```bash
cd ~/tradeleague
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d
```

### How to Run Django Commands

```bash
# Examples:
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker compose -f docker-compose.prod.yml exec backend python manage.py seed_assets
docker compose -f docker-compose.prod.yml exec backend python manage.py shell
```

### How to Stop the App (Save Money)

```bash
docker compose -f docker-compose.prod.yml down
```

Also stop the EC2 instance in AWS Console:
- Go to EC2 → Instances → Select your instance → Instance state → **Stop instance**
- (You can **Start** it again later. The Elastic IP stays.)

### How to Completely Delete Everything (Avoid Ongoing Charges)

1. **Terminate EC2**: EC2 → Instances → Select → Instance state → Terminate
2. **Delete RDS**: RDS → Databases → Select → Actions → Delete (uncheck "Create final snapshot")
3. **Release Elastic IP**: EC2 → Elastic IPs → Select → Actions → Release
4. **Delete Security Group**: EC2 → Security Groups → Select `tradeleague-sg` → Actions → Delete

---

## Architecture Diagram

```
    Your Browser
         |
         | http://YOUR_IP (port 80)
         v
┌─────────────────────────────────────────────────────────┐
│                    AWS Cloud (EC2)                        │
│                                                           │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐ │
│  │    Nginx     │───►│   Daphne     │───►│  Django App  │ │
│  │  (port 80)   │    │  (port 8000) │    │  (your code) │ │
│  │  web server   │    │  ASGI server │    │              │ │
│  └─────────────┘    └──────────────┘    └──────┬───────┘ │
│                                                 │         │
│                    ┌─────────────┐              │         │
│                    │    Redis    │◄─────────────┤         │
│                    │  (port 6379)│  WebSockets  │         │
│                    └─────────────┘              │         │
│                                                 │         │
└─────────────────────────────────────────────────┼─────────┘
                                                  │
                    ┌─────────────────┐           │
                    │  AWS RDS        │◄──────────┘
                    │  PostgreSQL     │
                    │  (your data)    │
                    └─────────────────┘
```

---

## Troubleshooting

### "I can't connect via SSH"
- Make sure your Security Group has **SSH (port 22)** open to **My IP**
- If your home IP changed: Go to Security Groups → Edit inbound rules → Change SSH source to "My IP" again
- Make sure you're using the right username: `ubuntu` (not `ec2-user`)
- Check the key file permissions (see Step 8)

### "502 Bad Gateway" in browser
- The Django app hasn't started yet. Check logs:
  ```bash
  docker compose -f docker-compose.prod.yml logs backend
  ```
- Common cause: Database connection failed. Verify:
  - Your RDS endpoint is correct in `.env`
  - Your RDS password is correct
  - Your Security Group allows PostgreSQL (5432) from itself

### "Database connection refused" in logs
- Verify the RDS instance is in **"Available"** state in the AWS Console
- Check that the RDS Security Group allows port 5432 from `tradeleague-sg`
- Double-check `DB_HOST` in your `.env` file (it should be the full endpoint URL)

### "CSRF verification failed" when submitting forms
- Make sure `CSRF_TRUSTED_ORIGINS` in `.env` includes your URL with the protocol:
  - Correct: `http://54.198.42.156`
  - Wrong: `54.198.42.156`

### "Static files are not loading (broken CSS/images)"
```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
docker compose -f docker-compose.prod.yml restart nginx
```

### "I want to start over completely"
```bash
cd ~/tradeleague
docker compose -f docker-compose.prod.yml down -v
docker compose -f docker-compose.prod.yml up --build -d
```

### "How do I check if my server is costing me money?"
- Go to: https://console.aws.amazon.com/billing/
- Click "Bills" in the left sidebar to see current charges
- Set up a **billing alert**: Billing → Budgets → Create budget → (set $20 threshold)
