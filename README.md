# GitHub Rate Limit Viewer

A real-time GitHub API rate limit monitoring tool built with React, TypeScript, and Vite. Monitor your GitHub API usage with live charts and configurable polling intervals.

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-success)
![CI Status](https://github.com/nsheaps/github-rate-limit-viewer/workflows/CI%20-%20Validate/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- 🔐 **GitHub OAuth Authentication** - Secure login with Personal Access Tokens
- 📊 **Real-time Charts** - Live visualization of rate limit consumption over time
- ⚡ **Configurable Polling** - Choose update intervals (5s, 10s, 30s, 60s)
- 📈 **Multi-API Tracking** - Monitor Core, Search, and GraphQL APIs simultaneously
- 💾 **Auto-Login** - Remember authentication for seamless revisits
- 🎨 **Modern UI** - Clean, responsive interface
- 📱 **Mobile Friendly** - Works on all devices

## Live Demo

Visit the live application: [GitHub Rate Limit Viewer](https://nsheaps.github.io/github-rate-limit-viewer/)

## Quick Start

### Prerequisites

- Node.js 18+ or npm
- A GitHub Personal Access Token (see [Setup Guide](#getting-a-github-token))

### Installation

```bash
# Clone the repository
git clone https://github.com/nsheaps/github-rate-limit-viewer.git
cd github-rate-limit-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Getting a GitHub Token

1. Go to [GitHub Token Settings](https://github.com/settings/tokens/new)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "Rate Limit Viewer")
4. Select scopes (optional - `read:user` for authenticated rate limits)
5. Click "Generate token"
6. Copy the token and use it to login to the application

**Important:** Never share your token! It's stored locally in your browser.

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Run all linters
npm run lint

# Run individual linters
npm run lint:eslint      # TypeScript/JavaScript linting
npm run lint:prettier    # Code formatting check
npm run lint:md          # Markdown linting
npm run lint:yaml        # YAML linting

# Format code
npm run format

# Run tests
npm test                 # Run once
npm run test:watch       # Watch mode
npm run test:ui          # UI mode

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```text
github-rate-limit-viewer/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
│       ├── ci.yml          # Validation workflow
│       └── deploy.yml      # Deployment workflow
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── RateLimitChart.tsx
│   │   └── RateLimitStats.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useRateLimitPolling.ts
│   ├── services/           # API services
│   │   ├── auth.ts
│   │   └── github.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── test/               # Test utilities
│   │   └── setup.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── dist/                   # Build output
└── package.json
```

## CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

1. **CI - Validate** (`ci.yml`)
   - Runs on all pushes and pull requests
   - Executes linting, testing, and builds
   - Ensures code quality

2. **Deploy to GitHub Pages** (`deploy.yml`)
   - Runs on pushes to `main` branch
   - Builds and deploys to GitHub Pages
   - Automatic deployment

### Setting Up GitHub Pages

1. Go to your repository settings
2. Navigate to **Pages** section
3. Under **Source**, select **GitHub Actions**
4. Push to `main` branch to trigger deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## Technology Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Charts:** Recharts
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint, Prettier, Markdownlint
- **CI/CD:** GitHub Actions
- **Hosting:** GitHub Pages

## Architecture

This is a client-side only application (SPA) that communicates directly with the GitHub API:

```text
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│   React App  │────────▶│  GitHub API │
│  (Storage)  │◀────────│  (Services)  │◀────────│             │
└─────────────┘         └──────────────┘         └─────────────┘
```

- **Authentication:** Personal Access Tokens stored in localStorage
- **API Calls:** Direct to GitHub's REST API
- **State Management:** React hooks (useState, useEffect)
- **Polling:** Configurable intervals via custom hooks

## Security Considerations

- Tokens are stored in browser localStorage (client-side only)
- Never commit tokens to the repository
- Tokens are never sent to any backend server
- All API calls go directly to GitHub
- Use token scopes judiciously

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- All linters pass (`npm run lint`)
- All tests pass (`npm test`)
- Code is formatted (`npm run format`)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Inspired by the [Astro deployment guide](https://xebia.com/blog/deploy-an-astro-site-to-github-pages-using-github-actions/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## Roadmap

- [ ] Add more API endpoints monitoring
- [ ] Export data to CSV/JSON
- [ ] Dark mode support
- [ ] Alert notifications for low limits
- [ ] React Native mobile app (future consideration)

## Support

For issues, questions, or suggestions:

- Open an [issue](https://github.com/nsheaps/github-rate-limit-viewer/issues)
- Check existing [discussions](https://github.com/nsheaps/github-rate-limit-viewer/discussions)
