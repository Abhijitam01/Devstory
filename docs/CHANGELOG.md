# Changelog

All notable changes to DevStory will be documented in this file.

## [Unreleased]

### Added
- **codebaseStats Generation**: Backend now generates comprehensive codebase statistics including:
  - Total files and lines of code
  - Language distribution with percentages
  - File type categorization (Frontend, Backend, Schema, Infra, Other)
  - Contributor statistics with commit counts and line changes
  - Commit frequency (daily, weekly, monthly)
  - Most active day and hour
  - Largest commit identification
  - Average commit size

- **Toast Notification System**: Beautiful toast notifications for success, error, info, and warning messages
- **Skeleton Loaders**: Improved loading states with skeleton loaders for better UX
- **Syntax Highlighting**: File viewer now includes syntax highlighting using react-syntax-highlighter
- **Export Functionality**: Export analysis data to CSV or JSON formats
- **Share Functionality**: Share analysis results with native share API or clipboard fallback
- **Contributor Avatars**: Display GitHub avatars for commit authors
- **Pagination**: Paginated commit lists with configurable page size (default 50 commits per page)
- **Caching**: 
  - Server-side in-memory caching (5-minute TTL)
  - Client-side localStorage caching (5-minute TTL)
  - Cache headers in API responses

- **Error Handling Improvements**:
  - User-friendly error messages with actionable tips
  - Better error parsing in API client
  - Retry logic with exponential backoff
  - Rate limit detection and warnings

- **File Content Handling**:
  - File size limits (1MB max, 500KB for display)
  - Binary file detection and handling
  - Better error messages for file fetching failures

- **Security Enhancements**:
  - Rate limiting (100 req/15min general, 10 req/hour analyze)
  - Input validation middleware
  - Security headers (X-Frame-Options, CSP, etc.)
  - CORS configuration

- **Logging**:
  - Structured logging with context
  - Request logging middleware
  - Error tracking

- **Accessibility**:
  - ARIA labels on interactive elements
  - Keyboard navigation support
  - Screen reader compatibility
  - Semantic HTML structure

- **Performance Optimizations**:
  - Lazy loading for heavy components
  - Code splitting
  - Client-side caching
  - Server-side caching

- **Testing Infrastructure**:
  - Jest configuration
  - React Testing Library setup
  - Sample test files
  - Test scripts in package.json

- **CI/CD**:
  - GitHub Actions workflow for CI
  - Automated linting and type checking
  - Automated testing
  - Build verification

- **Documentation**:
  - API documentation
  - Architecture documentation
  - Deployment guide
  - Changelog

### Changed
- Improved error messages throughout the application
- Enhanced mobile responsiveness
- Better loading states and animations
- Improved file content display with syntax highlighting

### Fixed
- Fixed missing codebaseStats in API responses
- Fixed file content fetching for large files
- Fixed error handling for binary files
- Improved rate limit handling

## [1.0.0] - Initial Release

### Features
- GitHub repository analysis
- Commit timeline visualization
- File change tracking
- Basic filtering and search
- Dark mode support
- Responsive design

