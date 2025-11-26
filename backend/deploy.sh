#!/bin/bash

# Deployment script for Zyfar Pulse Backend on Ubuntu VPS
# Run this script on your VPS after initial setup

set -e  # Exit on error

echo "🚀 Starting Zyfar Pulse Backend Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/zyfar-pulse/backend"
DATA_DIR="/var/zyfar_pulse/data"
PM2_APP_NAME="zyfar-pulse"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as the correct user (not root)
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run this script as root"
    exit 1
fi

print_info "Deploying to: $APP_DIR"

# Navigate to app directory
cd $APP_DIR || exit 1

# Pull latest changes if Git is set up
if [ -d ".git" ]; then
    print_info "Pulling latest changes from Git..."
    git pull origin main || print_error "Git pull failed (continuing anyway)"
fi

# Install dependencies
print_info "Installing dependencies..."
npm install --production

# Verify environment file
if [ ! -f ".env" ]; then
    print_error ".env file not found!"
    print_info "Creating .env from .env.example..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_info "Please edit .env file with your configuration"
        exit 1
    else
        print_error ".env.example not found!"
        exit 1
    fi
fi

# Verify data directory exists
if [ ! -d "$DATA_DIR" ]; then
    print_info "Creating data directory..."
    sudo mkdir -p $DATA_DIR
    sudo chown -R $USER:$USER $DATA_DIR
fi

print_success "Data directory: $DATA_DIR"

# Test the application
print_info "Testing application startup..."
timeout 5 node server.js &
sleep 3

if ! pgrep -f "node server.js" > /dev/null; then
    print_error "Application failed to start!"
    exit 1
fi

# Kill test process
pkill -f "node server.js" || true

print_success "Application test passed"

# Manage PM2 process
print_info "Managing PM2 process..."

if pm2 describe $PM2_APP_NAME > /dev/null 2>&1; then
    print_info "Reloading existing PM2 process..."
    pm2 reload $PM2_APP_NAME --update-env
else
    print_info "Starting new PM2 process..."
    pm2 start ecosystem.config.cjs
fi

# Save PM2 process list
pm2 save

print_success "PM2 process updated"

# Show status
print_info "Current PM2 status:"
pm2 status

# Show logs
print_info "Recent logs:"
pm2 logs $PM2_APP_NAME --lines 20 --nostream

print_success "Deployment completed successfully!"

# Test health endpoint
print_info "Testing health endpoint..."
sleep 2

if curl -s http://localhost:4000/health | grep -q "OK"; then
    print_success "Health check passed!"
else
    print_error "Health check failed!"
    print_info "Check logs with: pm2 logs $PM2_APP_NAME"
fi

echo ""
print_success "🎉 Deployment Complete!"
echo ""
print_info "Next steps:"
echo "  1. Test API: curl http://localhost:4000/health"
echo "  2. View logs: pm2 logs $PM2_APP_NAME"
echo "  3. Monitor: pm2 monit"
echo "  4. Update frontend CORS if needed"
echo ""
