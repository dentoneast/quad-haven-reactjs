# Deployment Guide

This guide covers deploying the Homely Quad monorepo applications to various environments. The project was migrated from the monolithic Rently Mobile application into a scalable monorepo structure.

## 🚀 Replit Deployment (Recommended for Development)

Homely Quad is fully configured to run on Replit with minimal setup.

### Prerequisites
- Active Replit account
- Replit PostgreSQL database enabled

### Quick Start on Replit

1. **Import Project to Replit**
   - Fork or import this repository to Replit
   - Replit will automatically detect the Node.js environment

2. **Database Setup**
   The project uses Replit's built-in PostgreSQL database:
   ```bash
   # Database is automatically connected via DATABASE_URL
   # Push schema and seed data
   npm run db:reset
   ```

3. **Workflow Configuration**
   The project has two pre-configured workflows:
   
   - **Server Workflow**: Backend API (port 3001, internal)
     ```bash
     cd homely-quad-next/packages/server && npm run dev
     ```
   
   - **Web Workflow**: Frontend (port 5000, public)
     ```bash
     cd homely-quad-next/packages/web && NEXT_PUBLIC_API_URL=/api npm run dev
     ```

4. **Start the Application**
   - Both workflows start automatically when you run the Repl
   - Access the application at the Replit webview URL (port 5000)

### Important Replit Configuration

**Environment Variables:**
- `DATABASE_URL` - Automatically provided by Replit PostgreSQL
- `JWT_SECRET` - Auto-generated, stored in Replit Secrets
- `JWT_REFRESH_SECRET` - Auto-generated, stored in Replit Secrets
- `NEXT_PUBLIC_API_URL` - Set to `/api` in web workflow command

**Port Configuration:**
- Port 5000: Public (Next.js frontend)
- Port 3001: Internal only (Express backend)
- Frontend uses Next.js API proxy at `/api/[...proxy]` to access backend

**API Proxy Setup:**
The frontend cannot directly access port 3001 from the browser on Replit. Instead:
1. Browser sends requests to `/api/*` 
2. Next.js API route at `/api/[...proxy]` forwards to `http://localhost:3001/api/*`
3. Backend processes the request and returns response
4. Next.js proxy returns response to browser

### Testing on Replit

Login with these test credentials (password: `password123`):

| Role | Email | Features |
|------|-------|----------|
| Landlord | sarah.landlord@example.com | Full property management |
| Tenant | mike.tenant@example.com | View leases, submit requests |
| Admin | admin@homelyquad.com | System administration |
| Workman | bob.workman@example.com | Work order management |

### Database Management on Replit

```bash
# Reset database and reseed
npm run db:reset

# Push schema changes only (preserves data)
npm run db:push

# Force push schema changes
npm run db:push --force
```

### Troubleshooting on Replit

**Login Not Working:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify both workflows are running
3. Check browser console for errors

**API Errors:**
1. Ensure `NEXT_PUBLIC_API_URL=/api` is in web workflow command
2. Restart workflows after code changes
3. Check server logs for detailed error messages

**Database Connection Issues:**
1. Verify `DATABASE_URL` environment variable exists
2. Check PostgreSQL database is enabled in Replit
3. Try restarting the Repl

### Deployment to Production from Replit

To publish your Replit to production:
1. Click the "Publish" button in Replit
2. Configure custom domain (optional)
3. Replit will handle HTTPS automatically

---

## Production Deployment (Other Platforms)

## Overview

The Homely Quad monorepo consists of four main packages:
- **Shared Package** - Common business logic, types, and utilities
- **Web App** - Next.js responsive web application with public pages
- **Mobile App** - React Native/Expo application (migrated from Rently Mobile)
- **Backend Server** - Node.js/Express API server with PostgreSQL database

## Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional)
- Cloud provider accounts (AWS, Vercel, etc.)

## Environment Setup

### Environment Variables

#### Server Environment
```env
NODE_ENV=production
PORT=3001
DB_USER=postgres
DB_HOST=your-database-host
DB_NAME=homely_quad
DB_PASSWORD=your-database-password
DB_PORT=5432
JWT_SECRET=your-super-secret-jwt-key
```

#### Web Environment
```env
NEXT_PUBLIC_API_URL=https://api.homelyquad.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

#### Mobile Environment
```env
EXPO_PUBLIC_API_URL=https://api.homelyquad.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## Deployment Strategies

### 1. Manual Deployment

#### Build All Applications
```bash
# Install dependencies
npm ci

# Build shared package
npm run build:shared

# Build all applications
npm run build
```

#### Deploy Individual Applications
```bash
# Deploy web app
cd packages/web
npm run build
# Upload .next folder to your hosting service

# Deploy server
cd packages/server
npm run build
# Upload dist folder to your server

# Deploy mobile app
cd packages/mobile
npx eas build --platform all
npx eas submit --platform all
```

### 2. Automated Deployment with Scripts

#### Using Deployment Script
```bash
# Deploy to staging
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

### 3. CI/CD Pipeline Deployment

The project includes GitHub Actions workflows for automated deployment:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        run: |
          npm ci
          npm run build
          # Add your deployment commands
```

## Platform-Specific Deployment

### Web App (Next.js)

#### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build:web`
3. Set publish directory: `packages/web/.next`
4. Set environment variables

#### AWS S3 + CloudFront
```bash
# Build web app
cd packages/web
npm run build

# Upload to S3
aws s3 sync .next/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Mobile App (React Native/Expo)

#### Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

#### App Store Connect (iOS)
1. Build iOS app with EAS
2. Upload to App Store Connect
3. Submit for review

#### Google Play Console (Android)
1. Build Android app with EAS
2. Upload to Google Play Console
3. Submit for review

### Backend Server (Node.js)

#### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY packages/server/dist ./packages/server/dist
COPY packages/shared/dist ./packages/shared/dist

EXPOSE 3001

CMD ["node", "packages/server/dist/index.js"]
```

```bash
# Build Docker image
docker build -t homely-quad-server .

# Run container
docker run -p 3001:3001 homely-quad-server
```

#### AWS EC2 Deployment
1. Launch EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Build and start application

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start packages/server/dist/index.js --name "homely-quad-server"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create homely-quad-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your-database-url

# Deploy
git push heroku main
```

#### Railway Deployment
1. Connect GitHub repository to Railway
2. Set environment variables
3. Deploy automatically

## Database Deployment

### PostgreSQL
```bash
# Create database
createdb homely_quad_production

# Set up database tables
npm run db:setup

# Seed database with sample data
npm run db:seed

# Or run both in one command
npm run db:push
```

### MongoDB
```bash
# Connect to MongoDB
mongo

# Create database
use homely_quad_production

# Import data
mongoimport --db homely_quad_production --collection users --file users.json
```

## Monitoring and Logging

### Application Monitoring
- **New Relic** - Application performance monitoring
- **DataDog** - Infrastructure and application monitoring
- **Sentry** - Error tracking and performance monitoring

### Logging
- **Winston** - Structured logging
- **LogRocket** - Session replay and logging
- **CloudWatch** - AWS logging service

### Health Checks
```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});
```

## Security Considerations

### SSL/TLS Certificates
- Use Let's Encrypt for free SSL certificates
- Configure HTTPS redirects
- Use HSTS headers

### Environment Variables
- Never commit sensitive data to version control
- Use secure secret management (AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly

### API Security
- Implement rate limiting
- Use CORS properly
- Validate all inputs
- Use HTTPS only

### Database Security
- Use connection pooling
- Encrypt data at rest
- Regular security updates
- Access control and authentication

## Backup and Recovery

### Database Backups
```bash
# PostgreSQL backup
pg_dump homely_quad_production > backup.sql

# Restore from backup
psql homely_quad_production < backup.sql
```

### Application Backups
- Regular code backups to version control
- Infrastructure as Code (Terraform, CloudFormation)
- Configuration backups

## Rollback Procedures

### Web App Rollback
```bash
# Revert to previous deployment
vercel rollback

# Or deploy specific commit
vercel --prod --confirm
```

### Server Rollback
```bash
# Revert to previous version
pm2 restart homely-quad-server

# Or rollback database migrations
npm run db:migrate:rollback
```

### Mobile App Rollback
- Use app store rollback features
- Deploy previous version
- Update app store listing

## Performance Optimization

### Web App
- Enable CDN (CloudFront, CloudFlare)
- Optimize images
- Enable compression
- Use caching strategies

### Mobile App
- Optimize bundle size
- Use lazy loading
- Implement proper caching
- Optimize images

### Server
- Use connection pooling
- Implement caching (Redis)
- Optimize database queries
- Use load balancing

## Troubleshooting

### Common Issues
1. **Build failures** - Check Node.js version and dependencies
2. **Environment variables** - Verify all required variables are set
3. **Database connections** - Check connection strings and credentials
4. **CORS issues** - Verify allowed origins configuration
5. **Memory issues** - Monitor memory usage and optimize

### Debugging
```bash
# Check application logs
pm2 logs homely-quad-server

# Check system resources
htop
df -h

# Check network connectivity
curl -I https://api.homelyquad.com/health
```

## Maintenance

### Regular Tasks
- Update dependencies
- Security patches
- Performance monitoring
- Backup verification
- Log rotation

### Monitoring
- Set up alerts for critical issues
- Monitor performance metrics
- Track error rates
- Monitor resource usage

## Support

For deployment issues:
1. Check logs and error messages
2. Verify environment configuration
3. Test locally first
4. Check documentation
5. Contact support team

---

**Remember**: Always test deployments in staging environment before production!
