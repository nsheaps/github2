# GitHub2

A modern, high-performance alternative GitHub UI client built with React, TypeScript, and Vite. GitHub2 provides a faster, more customizable interface for managing your GitHub workflow with advanced features like customizable dashboards, offline support, and cross-device sync.

![CI Status](https://github.com/nsheaps/github2/workflows/CI%20-%20Validate/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

GitHub2 is designed to be a complete reimagining of the GitHub interface with a focus on:

- **Performance**: Client-side caching and WebWorkers for instant page loads
- **Customization**: Draggable, configurable dashboard widgets
- **Efficiency**: Minimize API calls through intelligent caching and batching
- **Cross-Platform**: Web, browser extension, and future native app support

## Current Features

### Rate Limit Viewer
- 🔐 **GitHub OAuth Authentication** - Secure login with Personal Access Tokens
- 📊 **Real-time Charts** - Live visualization of rate limit consumption over time
- ⚡ **Configurable Polling** - Choose update intervals (5s, 10s, 30s, 60s)
- 📈 **Multi-API Tracking** - Monitor Core, Search, and GraphQL APIs simultaneously

## Planned Features

### Core Pages
- **Dashboard**: Customizable widgets for issues, PRs, and more
- **Homepage**: Live rate limits + configurable information panels
- **User/Org Pages**: Profile and repository information
- **Omnisearch**: Fast, fuzzy search across all GitHub resources
- **PR/Issue Review**: Enhanced review interface with advanced features
- **Commit Views**: Individual commits, commit history, and comparisons
- **Settings**: Comprehensive configuration for the client

### Browser Extensions
- Chrome and Firefox extensions for seamless integration with GitHub
- Quick navigation from github.com to github2 pages
- Cross-device data synchronization

### Advanced Capabilities
- Client-side database with WebWorker synchronization
- Intelligent query batching and filtering
- Skeleton screens and progressive loading
- Mobile-friendly responsive design
- Offline support via PWA

## Live Demo

Visit the live application: [GitHub2](https://nsheaps.github.io/github2/)

## Quick Start

### Prerequisites

- Node.js 18+ or npm
- A GitHub Personal Access Token (see [Setup Guide](#getting-a-github-token))

### Installation

```bash
# Clone the repository
git clone https://github.com/nsheaps/github2.git
cd github2

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Getting a GitHub Token

1. Go to [GitHub Token Settings](https://github.com/settings/tokens/new)
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "GitHub2")
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
github2/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── docs/                   # Documentation
│   ├── principles/         # Development principles
│   ├── specs/             # Feature specifications
│   └── guides/            # How-to guides
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   └── workers/            # WebWorkers
├── extensions/             # Browser extensions
│   ├── chrome/
│   └── firefox/
└── package.json
```

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

GitHub2 is a client-side application that communicates directly with the GitHub API:

```text
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│   React App  │────────▶│  GitHub API │
│  (Storage)  │◀────────│  (Services)  │◀────────│             │
└─────────────┘         └──────────────┘         └─────────────┘
       │                       │
       │                       ▼
       │                ┌──────────────┐
       └───────────────▶│  WebWorker   │
                        │  (Sync/Cache)│
                        └──────────────┘
```

- **Authentication:** GitHub OAuth + Personal Access Tokens
- **State Management:** React hooks + Context
- **Caching:** IndexedDB via WebWorkers
- **API Optimization:** Query batching and client-side filtering

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Development Guide](./docs/development.md) - Setup and development workflow
- [Principles](./docs/principles/) - Development principles and patterns
- [Specifications](./docs/specs/) - Feature specifications
- [Deployment](./docs/DEPLOYMENT.md) - Deployment instructions

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

## Roadmap

See [TODO.md](TODO.md) for detailed feature roadmap.

## Support

For issues, questions, or suggestions:

- Open an [issue](https://github.com/nsheaps/github2/issues)
- Check existing [discussions](https://github.com/nsheaps/github2/discussions)

