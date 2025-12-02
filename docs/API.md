# DevStory API Documentation

## Base URL

- Development: `http://localhost:4000`
- Production: (configure via `NEXT_PUBLIC_BACKEND_URL`)

## Authentication

The API supports optional GitHub Personal Access Token authentication via the `GITHUB_TOKEN` environment variable. Without a token, you'll have lower rate limits (60 requests/hour vs 5000/hour).

## Endpoints

### Health Check

**GET** `/health`

Check if the API server is running and healthy.

**Response:**
```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "memory": {
    "used": 45,
    "total": 128
  },
  "cache": {
    "total": 5,
    "valid": 5,
    "expired": 0
  },
  "githubApi": {
    "status": 200,
    "accessible": true
  }
}
```

### API Information

**GET** `/api/info`

Get information about the API and available endpoints.

**Response:**
```json
{
  "name": "DevStory API",
  "version": "1.0.0",
  "description": "GitHub repository analysis API",
  "endpoints": {
    "health": "GET /health",
    "analyze": "POST /api/analyze",
    "commit": "GET /api/commit/:owner/:repo/:sha?includeContent=true",
    "info": "GET /api/info"
  }
}
```

### Analyze Repository

**POST** `/api/analyze`

Analyze a GitHub repository and return commit timeline with statistics.

**Request Body:**
```json
{
  "url": "https://github.com/username/repository",
  "maxCommits": 50,
  "page": 1,
  "pageSize": 50
}
```

**Parameters:**
- `url` (required, string): GitHub repository URL
- `maxCommits` (optional, number): Maximum number of commits to analyze (1-1000, default: all)
- `page` (optional, number): Page number for pagination (default: 1)
- `pageSize` (optional, number): Number of commits per page (1-100, default: 50)

**Response:**
```json
{
  "repoUrl": "https://github.com/username/repository",
  "count": 25,
  "commits": [
    {
      "commit": "abc1234",
      "author": "John Doe",
      "authorAvatar": "https://avatars.githubusercontent.com/u/12345",
      "date": "2024-01-15",
      "timestamp": "2024-01-15T10:30:00Z",
      "message": "Add new feature",
      "changes": [
        {
          "status": "A",
          "file": "src/components/Feature.tsx",
          "additions": 50,
          "deletions": 0,
          "changes": 50
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalPages": 5,
    "totalCommits": 250
  },
  "codebaseStats": {
    "totalFiles": 150,
    "totalLines": 5000,
    "languages": [
      {
        "language": "TypeScript",
        "files": 80,
        "lines": 3000,
        "percentage": 60
      }
    ],
    "fileTypes": [
      {
        "type": "Frontend",
        "count": 100,
        "percentage": 66.7
      }
    ],
    "contributors": [
      {
        "author": "John Doe",
        "commits": 15,
        "linesAdded": 2000,
        "linesDeleted": 500,
        "percentage": 60
      }
    ],
    "commitFrequency": {
      "daily": 2.5,
      "weekly": 17.5,
      "monthly": 75
    },
    "averageCommitSize": 3.2,
    "largestCommit": {
      "sha": "abc1234",
      "files": 25,
      "lines": 500
    },
    "mostActiveDay": "1",
    "mostActiveHour": 14
  }
}
```

**Rate Limiting:**
- 10 requests per hour per IP address
- Rate limit headers included in response:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

**Caching:**
- Responses are cached for 5 minutes
- Cache status indicated by `X-Cache` header: `HIT` or `MISS`

### Get Commit Details

**GET** `/api/commit/:owner/:repo/:sha?includeContent=true`

Get detailed information about a specific commit, optionally including file contents.

**Parameters:**
- `owner` (required, string): Repository owner
- `repo` (required, string): Repository name
- `sha` (required, string): Commit SHA (7-40 characters)
- `includeContent` (optional, boolean): Include file contents in response

**Response:**
```json
{
  "sha": "abc1234...",
  "commit": {
    "author": {
      "name": "John Doe",
      "email": "john@example.com",
      "date": "2024-01-15T10:30:00Z"
    },
    "message": "Add new feature"
  },
  "files": [
    {
      "filename": "src/components/Feature.tsx",
      "status": "added",
      "additions": 50,
      "deletions": 0,
      "changes": 50,
      "content": "// File content here...",
      "size": 2048,
      "error": null
    }
  ]
}
```

**File Content Limits:**
- Maximum file size: 1MB
- Display limit: 500KB (truncated if larger)
- Binary files are not included in content

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here",
  "status": 400
}
```

**Common Error Codes:**
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Invalid GitHub token
- `403`: Forbidden - Rate limit exceeded or access denied
- `404`: Not Found - Repository not found
- `422`: Unprocessable Entity - Invalid repository URL
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Server error

## Rate Limiting

- General API: 100 requests per 15 minutes per IP
- Analyze endpoint: 10 requests per hour per IP
- Rate limit information included in response headers

## Security Headers

All responses include security headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: (configured per endpoint)

## Caching

- Server-side: In-memory cache with 5-minute TTL
- Client-side: localStorage cache with 5-minute TTL
- Cache keys based on repository URL and maxCommits parameter

