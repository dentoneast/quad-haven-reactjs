#!/bin/bash

# Homely Quad Deployment Script
# This script handles deployment of the Homely Quad monorepo

set -e

# Configuration
ENVIRONMENT=${1:-staging}
BUILD_DIR="dist"
PACKAGE_DIR="packages"

echo "🚀 Deploying Homely Quad to $ENVIRONMENT environment..."

# Check if environment is valid
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build shared package
echo "🔨 Building shared package..."
npm run build:shared

# Build all packages
echo "🔨 Building all packages..."
npm run build

# Create deployment package
echo "📦 Creating deployment package..."
cp -r $PACKAGE_DIR $BUILD_DIR/
cp package.json $BUILD_DIR/
cp package-lock.json $BUILD_DIR/

# Environment-specific deployment
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "🚀 Deploying to staging..."
    # Add staging deployment commands here
    echo "✅ Staging deployment complete"
elif [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Deploying to production..."
    # Add production deployment commands here
    echo "✅ Production deployment complete"
fi

echo ""
echo "🎉 Deployment to $ENVIRONMENT complete!"
echo ""
echo "Deployed packages:"
echo "- Web app: https://staging.homelyquad.com (staging) / https://homelyquad.com (production)"
echo "- API: https://api-staging.homelyquad.com (staging) / https://api.homelyquad.com (production)"
echo "- Mobile app: Available in app stores"
