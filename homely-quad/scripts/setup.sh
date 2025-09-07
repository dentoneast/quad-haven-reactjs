#!/bin/bash

# Homely Quad Monorepo Setup Script
# This script sets up the development environment for the Homely Quad monorepo

set -e

echo "🚀 Setting up Homely Quad monorepo..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version check passed: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install package dependencies
echo "📦 Installing package dependencies..."
cd packages/shared && npm install && cd ../..
cd packages/mobile && npm install && cd ../..
cd packages/web && npm install && cd ../..
cd packages/server && npm install && cd ../..

# Build shared package
echo "🔨 Building shared package..."
npm run build:shared

# Create environment files
echo "⚙️  Setting up environment files..."

# Server environment
if [ ! -f packages/server/.env ]; then
    cp packages/server/env.example packages/server/.env
    echo "✅ Created packages/server/.env"
else
    echo "⚠️  packages/server/.env already exists"
fi

# Web environment
if [ ! -f packages/web/.env.local ]; then
    cp packages/web/env.example packages/web/.env.local
    echo "✅ Created packages/web/.env.local"
else
    echo "⚠️  packages/web/.env.local already exists"
fi

# Mobile environment
if [ ! -f packages/mobile/.env ]; then
    cp packages/mobile/env.example packages/mobile/.env
    echo "✅ Created packages/mobile/.env"
else
    echo "⚠️  packages/mobile/.env already exists"
fi

# Create logs directory
mkdir -p packages/server/logs
echo "✅ Created logs directory"

# Make scripts executable
chmod +x tools/*.js
chmod +x scripts/*.sh

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment files with your configuration"
echo "2. Run 'npm run dev' to start all applications"
echo "3. Visit http://localhost:3000 for the web app"
echo "4. Visit http://localhost:3001 for the API"
echo "5. Use Expo Go app to scan QR code for mobile app"
echo ""
echo "Happy coding! 🚀"
