# DevStory Deployment Guide

## Prerequisites

- Node.js 18+ and npm 9+
- GitHub Personal Access Token (optional, for higher rate limits)
- Deployment platform accounts (Vercel, Railway, etc.)

## Environment Variables

### Backend

Create a `.env` file in the `apps/backend` directory:

```env
PORT=4000
GITHUB_TOKEN=your_github_token_here
CORS_ORIGIN=https://your-frontend-domain.com
NODE_ENV=production
```

### Frontend

Create a `.env.local` file in the `apps/frontend` directory:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Select the `apps/frontend` directory as root

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Root Directory: `apps/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables**
   - Add `NEXT_PUBLIC_BACKEND_URL` with your backend URL

4. **Deploy**
   - Click Deploy
   - Vercel will automatically build and deploy

#### Backend Deployment (Railway)

1. **Create Project**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repository
   - Select the repository

2. **Configure Service**
   - Root Directory: `apps/backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Environment Variables**
   - Add `PORT` (Railway sets this automatically)
   - Add `GITHUB_TOKEN`
   - Add `CORS_ORIGIN` (your Vercel frontend URL)
   - Add `NODE_ENV=production`

4. **Deploy**
   - Railway will automatically deploy on push

### Option 2: Docker Deployment

#### Create Dockerfile for Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build --workspace=backend

# Expose port
EXPOSE 4000

# Start server
CMD ["npm", "start", "--workspace=backend"]
```

#### Create Dockerfile for Frontend

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build --workspace=frontend

# Production image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/package.json ./
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start", "--workspace=frontend"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "4000:4000"
    environment:
      - PORT=4000
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - CORS_ORIGIN=http://localhost:3000
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: apps/frontend/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
    depends_on:
      - backend
    restart: unless-stopped
```

### Option 3: Manual Deployment

#### Backend

1. **Build**
   ```bash
   cd apps/backend
   npm run build
   ```

2. **Start**
   ```bash
   npm start
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name devstory-backend
   pm2 save
   pm2 startup
   ```

#### Frontend

1. **Build**
   ```bash
   cd apps/frontend
   npm run build
   ```

2. **Start**
   ```bash
   npm start
   ```

## GitHub Token Setup

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate new token (classic) with `public_repo` scope
3. Add to backend environment variables as `GITHUB_TOKEN`

**Note**: Without a token, you'll have lower rate limits (60 requests/hour vs 5000/hour).

## Health Checks

After deployment, verify:

1. **Backend Health**
   ```bash
   curl https://your-backend-domain.com/health
   ```

2. **Frontend**
   - Visit your frontend URL
   - Check browser console for errors
   - Test repository analysis

## Monitoring

### Backend Monitoring

- Check `/health` endpoint regularly
- Monitor rate limit headers
- Check logs for errors
- Monitor memory usage

### Frontend Monitoring

- Use Vercel Analytics (if using Vercel)
- Monitor error rates
- Check Core Web Vitals
- Monitor API response times

## Troubleshooting

### Backend Issues

1. **Port Already in Use**
   - Change `PORT` environment variable
   - Or kill process using the port

2. **Rate Limit Errors**
   - Add GitHub token
   - Implement request queuing
   - Increase cache TTL

3. **CORS Errors**
   - Verify `CORS_ORIGIN` matches frontend URL
   - Check for trailing slashes

### Frontend Issues

1. **API Connection Errors**
   - Verify `NEXT_PUBLIC_BACKEND_URL` is correct
   - Check backend is running
   - Verify CORS configuration

2. **Build Errors**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check environment variables

## Scaling Considerations

1. **Backend Scaling**
   - Use Redis for distributed caching
   - Implement request queuing
   - Add load balancing
   - Use CDN for static assets

2. **Frontend Scaling**
   - Use CDN (Vercel/Netlify provide this)
   - Enable edge caching
   - Optimize bundle size
   - Use image optimization

## Security Checklist

- [ ] GitHub token is secure (not in code)
- [ ] CORS origin is restricted
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] Input validation is in place
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS is enabled
- [ ] Environment variables are secure

## Post-Deployment

1. Test all endpoints
2. Verify caching works
3. Check rate limiting
4. Test error handling
5. Verify security headers
6. Monitor performance
7. Set up alerts for errors

