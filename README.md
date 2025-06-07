# Math Practice

[![Build, Test, and Deploy](https://github.com/marcusholmgren/math-practice/actions/workflows/ci.yml/badge.svg)](https://github.com/marcusholmgren/math-practice/actions/workflows/ci.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://marcusholmgren.github.io/math-practice/)

A simple math practice application for students to practice basic operations.

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Environment Configuration

The application uses environment variables for configuration:

- `BASE_URL`: Sets the base URL path (default: `/` for development, `/math-practice/` for production)

Environment files:
- `.env`: Default configuration
- `.env.development`: Development-specific settings
- `.env.production`: Production settings for GitHub Pages

### Deployment to GitHub Pages

The application is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch.

For manual deployment:

```bash
# Build with proper base URL for GitHub Pages
BASE_URL=/math-practice/ npm run build

# Deploy to GitHub Pages using gh-pages package
npx gh-pages -d build/client
```

### Testing

Run the test suite:

```bash
npm test
```

---

Built with ❤️ using React Router.
