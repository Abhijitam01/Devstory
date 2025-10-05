# DevStory

A modern web application that visualizes GitHub repository development history. See how a project was built step by step with detailed commit timelines, file change analysis, and contributor insights.

![DevStory Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=DevStory+Preview)

## ✨ Features

- **📊 Timeline Visualization** - See how your repository evolved over time
- **👥 Contributor Insights** - Understand who contributed what and when
- **📁 File Analysis** - Categorize changes by type (Frontend, Backend, Infrastructure)
- **🔍 Advanced Filtering** - Search commits, filter by file types, and sort results
- **🌙 Dark Mode** - Beautiful dark and light themes
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **⚡ Real-time Analysis** - Fast GitHub API integration with rate limiting

## 🏗️ Architecture

This is a **Next.js monorepo** built with modern technologies:

- **Frontend**: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Shared**: Common types and utilities
- **API**: GitHub REST API integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- GitHub Personal Access Token (optional, for higher rate limits)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devstory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your GitHub token:
   ```env
   GITHUB_TOKEN=your_github_token_here
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both frontend (http://localhost:3000) and backend (http://localhost:4000)

### GitHub Token Setup

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `public_repo` scope
3. Add it to your `.env` file

**Note**: The app works without a token, but you'll have lower rate limits (60 requests/hour vs 5000/hour).

## 📁 Project Structure

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
│       │   ├── services/  # GitHub API service
│       │   ├── types/     # TypeScript types
│       │   └── server.ts  # Express server
│       └── package.json
├── packages/
│   └── shared/            # Shared types and utilities
│       ├── src/
│       │   ├── types.ts   # Common TypeScript types
│       │   └── utils.ts   # Shared utility functions
│       └── package.json
├── package.json           # Root package.json (monorepo)
└── tsconfig.json          # Root TypeScript config
```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build all applications
- `npm run start` - Start all applications in production mode
- `npm run lint` - Lint all applications
- `npm run type-check` - Type check all applications

### Frontend Only
- `npm run dev:frontend` - Start only the frontend
- `npm run build --workspace=frontend` - Build only the frontend

### Backend Only
- `npm run dev:backend` - Start only the backend
- `npm run build --workspace=backend` - Build only the backend

## 🎨 UI Components

The frontend uses a custom component library built with:

- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Custom Components** - Button, Card, Input, Badge, Alert, etc.
- **Dark Mode** - Automatic theme switching

## 🔧 API Endpoints

### Backend API

- `GET /health` - Health check
- `GET /api/info` - API information
- `POST /api/analyze` - Analyze a GitHub repository

### Analyze Request
```json
{
  "url": "https://github.com/username/repository",
  "maxCommits": 50
}
```

### Analyze Response
```json
{
  "repoUrl": "https://github.com/username/repository",
  "count": 25,
  "commits": [
    {
      "commit": "abc1234",
      "author": "John Doe",
      "date": "2024-01-15",
      "timestamp": "2024-01-15T10:30:00Z",
      "message": "Add new feature",
      "changes": [
        {
          "status": "A",
          "file": "src/components/Feature.tsx"
        }
      ]
    }
  ]
}
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build --workspace=frontend
```

### Backend (Railway/Render)
```bash
npm run build --workspace=backend
```

### Environment Variables for Production
- `NEXT_PUBLIC_BACKEND_URL` - Your deployed backend URL
- `GITHUB_TOKEN` - Your GitHub token
- `CORS_ORIGIN` - Your frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub API](https://docs.github.com/en/rest) for repository data
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Lucide](https://lucide.dev/) for the beautiful icons

---

Built with ❤️ for developers who love to understand how projects evolve.