# DevStory Architecture Documentation

## Overview

DevStory is a monorepo application built with Next.js and Express.js that visualizes GitHub repository development history. The application follows a modern, scalable architecture with clear separation of concerns.

## Project Structure

```
devstory/
├── apps/
│   ├── frontend/          # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/       # App router pages
│   │   │   ├── components/ # React components
│   │   │   └── lib/       # Utilities and API client
│   │   └── package.json
│   └── backend/           # Express API server
│       ├── src/
│       │   ├── services/  # Business logic
│       │   ├── middleware/ # Express middleware
│       │   ├── types/     # TypeScript types
│       │   └── server.ts  # Express server
│       └── package.json
├── packages/
│   └── shared/            # Shared types and utilities
│       ├── src/
│       │   ├── types.ts   # Common TypeScript types
│       │   └── utils.ts   # Shared utility functions
│       └── package.json
└── package.json           # Root package.json (monorepo)
```

## Architecture Layers

### Frontend (Next.js)

**Technology Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (icons)

**Key Components:**
- `ModernHero`: Landing page with repository input form
- `ModernTimeline`: Commit timeline visualization
- `CodebaseInsights`: Statistics and analytics display
- `FileViewer`: File content viewer with syntax highlighting

**State Management:**
- React hooks (useState, useEffect)
- Context API for toast notifications
- Local storage for caching

**Features:**
- Server-side rendering (SSR)
- Client-side caching
- Lazy loading for heavy components
- Responsive design
- Dark mode support

### Backend (Express.js)

**Technology Stack:**
- Express.js
- TypeScript
- Axios (HTTP client)
- p-limit (concurrency control)

**Key Services:**
- `github.ts`: GitHub API integration
- `cache.ts`: In-memory caching
- `developer-tools.ts`: Package.json and project structure analysis

**Middleware:**
- `security.ts`: Security headers
- `rate-limit.ts`: Rate limiting
- `validation.ts`: Input validation
- `logging.ts`: Request/error logging

**API Endpoints:**
- `GET /health`: Health check
- `GET /api/info`: API information
- `POST /api/analyze`: Repository analysis
- `GET /api/commit/:owner/:repo/:sha`: Commit details

### Shared Package

Contains common types and utilities used by both frontend and backend:
- Type definitions (CommitItem, AnalyzeResponse, etc.)
- Utility functions (formatDate, getFileType, etc.)

## Data Flow

1. **User Input**: User enters GitHub repository URL
2. **Frontend**: Validates URL and sends request to backend
3. **Backend**: 
   - Checks cache
   - Fetches commits from GitHub API
   - Processes and analyzes data
   - Generates statistics
   - Caches response
4. **Frontend**: Receives response and displays timeline
5. **User Interaction**: User can filter, search, export, or view file contents

## Caching Strategy

### Server-Side (Backend)
- In-memory cache with 5-minute TTL
- Cache key: `repo:{url}:{maxCommits}`
- Automatic cleanup of expired entries

### Client-Side (Frontend)
- localStorage cache with 5-minute TTL
- Cache key: Base64 encoded URL + maxCommits
- Automatic cleanup on page load

## Security

### Backend Security
- Rate limiting (100 req/15min general, 10 req/hour analyze)
- Input validation middleware
- Security headers (X-Frame-Options, CSP, etc.)
- CORS configuration
- Request size limits (1MB)

### Frontend Security
- Security headers via Next.js config
- Input sanitization
- XSS protection
- Content Security Policy

## Performance Optimizations

1. **Caching**: Reduces API calls and improves response times
2. **Lazy Loading**: Code splitting for heavy components
3. **Concurrency Control**: Limits concurrent GitHub API requests
4. **Pagination**: (Future) For large repositories
5. **Virtual Scrolling**: (Future) For large commit lists

## Error Handling

### Backend
- Structured logging with context
- Error middleware for global error handling
- User-friendly error messages
- Rate limit error handling

### Frontend
- Toast notifications for errors
- Retry logic with exponential backoff
- User-friendly error messages with tips
- Network error recovery

## Development Workflow

1. **Local Development**: 
   - `npm run dev` starts both frontend and backend
   - Hot reload enabled
   - Development logging enabled

2. **Type Checking**:
   - TypeScript strict mode
   - Shared types ensure consistency

3. **Code Quality**:
   - ESLint for linting
   - TypeScript for type safety
   - Consistent code formatting

## Deployment

### Frontend
- Build: `npm run build --workspace=frontend`
- Deploy to: Vercel, Netlify, or similar
- Environment variables: `NEXT_PUBLIC_BACKEND_URL`

### Backend
- Build: `npm run build --workspace=backend`
- Deploy to: Railway, Render, Heroku, or similar
- Environment variables: `PORT`, `GITHUB_TOKEN`, `CORS_ORIGIN`

## Future Enhancements

- Database integration for persistent caching
- Redis for distributed caching
- WebSocket support for real-time updates
- GraphQL API option
- Advanced analytics and insights
- User authentication and saved repositories

