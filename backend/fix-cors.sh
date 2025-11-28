#!/bin/bash

# Quick fix script for CORS issue on VPS
# Run this on your VPS: ssh dev@31.97.203.109

echo "🔧 Fixing CORS configuration for Zyfar Pulse..."

# Navigate to backend directory
cd /var/www/zyfar-pulse/backend

# Backup current files
cp server.js server.js.backup
cp ecosystem.config.cjs ecosystem.config.cjs.backup

# Update ecosystem.config.cjs with correct CORS origin
cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'zyfar-pulse',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      DATA_DIR: '/var/zyfar_pulse/data',
      CORS_ORIGIN: 'https://zyfar-pulse-travel-insights-fronten.vercel.app'
    },
    error_file: '/var/log/zyfar-pulse-error.log',
    out_file: '/var/log/zyfar-pulse-out.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    min_uptime: '10s',
    max_restarts: 10
  }]
};
EOF

# Update the CORS configuration in server.js
# Find the line with allowedOrigins and replace it
sed -i "s|: \['http://localhost:3003', 'http://localhost:5173'\];|: ['http://localhost:3003', 'http://localhost:5173', 'https://zyfar-pulse-travel-insights-fronten.vercel.app'];|g" server.js

echo "✅ Configuration updated!"
echo "📍 Updated files:"
echo "   - ecosystem.config.cjs"
echo "   - server.js (CORS origins)"

echo ""
echo "🔄 Restarting PM2 application..."
pm2 restart zyfar-pulse

echo ""
echo "📊 Current PM2 status:"
pm2 status

echo ""
echo "🧪 Testing health endpoint..."
sleep 3
curl -s http://localhost:4000/health | jq '.'

echo ""
echo "🌐 Testing CORS with your frontend URL..."
curl -I -H "Origin: https://zyfar-pulse-travel-insights-fronten.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:4000/api/surveys/submit

echo ""
echo "✅ CORS fix complete!"
echo "🚀 Your backend should now accept requests from:"
echo "   https://zyfar-pulse-travel-insights-fronten.vercel.app"