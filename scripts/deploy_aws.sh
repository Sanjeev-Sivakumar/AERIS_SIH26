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
    git pull origin main || true
else
    echo "Cloning repository..."
    git clone https://github.com/Sanjeev-Sivakumar/Environmental-hacks.git "$WORKDIR"
    cd "$WORKDIR"
fi

echo "Setting up Python virtual environment..."
python3 -m venv "$WORKDIR/venv"
"$WORKDIR/venv/bin/pip" install --upgrade pip
"$WORKDIR/venv/bin/pip" install -r "$WORKDIR/requirements.txt"
"$WORKDIR/venv/bin/pip" install uvicorn fastapi

# Set up systemd service for reliable background execution of FastAPI
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
RestartSec=5

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
sudo cp -r dist/* /var/www/html/

# Configure Nginx reverse proxy for both /api/ and /mobile routes
cat << 'EOF' | sudo tee /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Reverse proxy Mobile dynamic QR barcode onboarding to FastAPI
    location /mobile {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

sudo systemctl restart nginx

PUBLIC_IP=$(curl -s ifconfig.me || curl -s icanhazip.com || echo "your-server-ip")
echo "=========================================================="
echo "🎉 AERIS is now LIVE and fully deployed!"
echo "Dashboard: http://$PUBLIC_IP"
echo "Mobile QR Gateway: http://$PUBLIC_IP/mobile"
echo "API status: http://$PUBLIC_IP/api/state"
echo "=========================================================="
