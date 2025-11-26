# Zyfar Pulse - Quick Setup Script for Windows (PowerShell)

Write-Host "🚀 Zyfar Pulse Survey System - Setup Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Select setup option:" -ForegroundColor Cyan
Write-Host "1. Setup Backend only"
Write-Host "2. Setup Frontend only"
Write-Host "3. Setup Both (Backend + Frontend)"
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

function Setup-Backend {
    Write-Host ""
    Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
    
    if (Test-Path "backend") {
        Set-Location backend
        
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        if (!(Test-Path ".env")) {
            Write-Host "Creating .env file..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
            Write-Host "✓ Created .env file. Please update it with your settings." -ForegroundColor Green
        }
        
        if (!(Test-Path "data")) {
            New-Item -ItemType Directory -Path "data" | Out-Null
            Write-Host "✓ Created data directory" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✓ Backend setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start the backend server:" -ForegroundColor Cyan
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        
        Set-Location ..
    } else {
        Write-Host "✗ Backend directory not found!" -ForegroundColor Red
    }
}

function Setup-Frontend {
    Write-Host ""
    Write-Host "📦 Setting up Frontend..." -ForegroundColor Cyan
    
    if (Test-Path "frontend") {
        Set-Location frontend
        
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        npm install
        
        if (!(Test-Path ".env")) {
            Write-Host "Creating .env file..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
            Write-Host "✓ Created .env file" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "✓ Frontend setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start the frontend server:" -ForegroundColor Cyan
        Write-Host "  cd frontend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        
        Set-Location ..
    } else {
        Write-Host "✗ Frontend directory not found!" -ForegroundColor Red
    }
}

switch ($choice) {
    "1" {
        Setup-Backend
    }
    "2" {
        Setup-Frontend
    }
    "3" {
        Setup-Backend
        Setup-Frontend
        
        Write-Host ""
        Write-Host "🎉 Complete setup finished!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Start backend:  cd backend && npm run dev" -ForegroundColor White
        Write-Host "2. Start frontend: cd frontend && npm run dev" -ForegroundColor White
        Write-Host "3. Open browser:   http://localhost:3000" -ForegroundColor White
        Write-Host ""
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "For deployment to VPS, see DEPLOY.md" -ForegroundColor Yellow
Write-Host ""
