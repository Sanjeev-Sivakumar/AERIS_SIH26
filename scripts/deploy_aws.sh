#!/usr/bin/env bash
set -e

echo "=== AERIS 1-Click AWS Deployment (Free Tier) ==="
echo "Updating packages..."
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
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install uvicorn fastapi

echo "Starting FastAPI backend in background on port 8000..."
pkill -f "uvicorn api.server:app" || true
nohup uvicorn api.server:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
sleep 3

echo "Building React frontend..."
cd "$WORKDIR/dashboard"
npm install
npm run build

echo "Configuring Nginx web server..."
sudo cp -r dist/* /var/www/html/

# Configure Nginx reverse proxy
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

    location /api/ {
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
echo "AERIS is now LIVE and fully deployed!"
echo "Visit your site at: http://$PUBLIC_IP"
echo "API status: http://$PUBLIC_IP/api/state"
echo "=========================================================="
