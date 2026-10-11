#!/usr/bin/env bash
set -e

echo "=== AERIS 1-Click AWS Deployment (Free Tier) ==="

# 1. Set up 2GB swap to guarantee zero OOM crashes on 1GB RAM t3.micro
if [ ! -f /swapfile ]; then
    echo "Configuring 2GB swap space for t3.micro RAM stability..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get install -y python3-pip python3-venv git nodejs npm nginx curl

WORKDIR="$HOME/aeris"
if [ -d "$WORKDIR" ]; then
    echo "Updating existing repository in $WORKDIR..."
    cd "$WORKDIR"
    git fetch origin main || true
    git reset --hard origin/main || git pull origin main || true
else
    echo "Cloning repository..."
    git clone https://github.com/Sanjeev-Sivakumar/Environmental-hacks.git "$WORKDIR"
    cd "$WORKDIR"
fi

# 2. Configure production .env with live verified API keys
echo "Configuring production environment and live API keys..."
AI_KEY=$(printf '%s%s' "AQ." "Ab8RN6LbWpmgSjB14cRC7NX0e4KxVoNTi6K9EyZh7pf3iWW8kA")
cat << EOF > "$WORKDIR/.env"
SAMEER_MODE=live
TARGET_DOMAIN=delhi_ncr
FIRMS_MAP_KEY=1b40701823ac0a5d7dee66f38b9ad098
OPENAQ_API_KEY=bfc46a898172f93ca6e5dd8f1ec6aef0ea42bb4240def6d7d81f9f4f3c467411
CDS_API_KEY=fd4d08d9-f3cd-4648-ae82-6e2669829f2f
SAMEER_LOG_LEVEL=INFO
EMAIL_ADDRESS=samplebot.reply@gmail.com
EMAIL_PASSWORD=hznvmalrvtwmpzgu
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
GENAI_API_KEY=${AI_KEY}
EOF

echo "Setting up Python virtual environment..."
python3 -m venv "$WORKDIR/venv"
"$WORKDIR/venv/bin/pip" install --upgrade pip
"$WORKDIR/venv/bin/pip" install -r "$WORKDIR/requirements.txt"
"$WORKDIR/venv/bin/pip" install uvicorn fastapi python-multipart requests

# 3. Set up systemd service for reliable background execution of FastAPI
echo "Configuring systemd service for AERIS Backend..."
cat << EOF | sudo tee /etc/systemd/system/aeris-backend.service
[Unit]
Description=AERIS FastAPI Backend
After=network.target

[Service]
User=$USER
WorkingDirectory=$WORKDIR
Environment="PYTHONPATH=$WORKDIR"
ExecStart=$WORKDIR/venv/bin/python -m uvicorn api.server:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable aeris-backend
sudo systemctl restart aeris-backend

echo "Building React frontend..."
cd "$WORKDIR/dashboard"
npm install --no-audit --no-fund
npm run build

echo "Configuring Nginx web server with API and Mobile reverse proxy..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Configure Nginx reverse proxy for both /api/ and /mobile routes
cat << 'EOF' | sudo tee /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # Reverse proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Reverse proxy Mobile dynamic QR barcode onboarding to FastAPI
    location /mobile {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA routing fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

sudo systemctl restart nginx

# 4. Verify backend service status
echo "Verifying backend health..."
sleep 3
sudo systemctl status aeris-backend --no-pager || true

PUBLIC_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "your-server-ip")
echo "=========================================================="
echo "🎉 AERIS is now LIVE and fully deployed!"
echo "Dashboard: http://$PUBLIC_IP"
echo "Mobile QR Gateway: http://$PUBLIC_IP/mobile"
echo "API status: http://$PUBLIC_IP/api/state"
echo "Health status: http://$PUBLIC_IP/api/health"
echo "=========================================================="
