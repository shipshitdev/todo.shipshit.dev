# Todoist Clone - Full Stack Monorepo

![Project Type](https://img.shields.io/badge/Project-Tool-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A complete task management application with cross-platform support (Web, Mobile, Desktop).

## Features

- ✅ Projects & Categories
- ✅ Inbox for unassigned tasks
- ✅ Today view
- ✅ Upcoming days view
- ✅ Kanban view (with list view as default)
- ✅ Task history (completed tasks)
- ✅ Due dates with time support
- ✅ Mobile app (Expo)
- ✅ Desktop app (Electron)
- ✅ Clerk authentication
- ✅ Cross-platform sync via MongoDB

## Tech Stack

- **Package Manager**: Bun
- **Web**: Next.js 16+, React 19, TypeScript, Tailwind CSS, @agenticindiedev/ui
- **Mobile**: Expo ~52, React Native 0.76, Expo Router
- **Desktop**: Electron
- **Backend**: NestJS 11+, MongoDB, Mongoose
- **Auth**: Clerk

## Getting Started

### Prerequisites

- Bun installed
- MongoDB running (local or remote)
- Clerk account with API keys

### Installation

```bash
# Install all dependencies
bun install
```

### Environment Variables

Create `.env` files in each app:

**apps/api/.env:**
```
DATABASE_URL=mongodb://localhost:27017/todoist
CLERK_SECRET_KEY=sk_test_...
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
PORT=4000
```

**apps/web/.env.local:**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**apps/mobile/.env:**
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

### Running the Apps

```bash
# Run all apps in development
bun run dev

# Or run individually
bun run dev:api      # Backend API on http://localhost:4000
bun run dev:web      # Web app on http://localhost:3000
bun run dev:mobile   # Mobile app (Expo)
bun run dev:desktop  # Desktop app (Electron)
```

## Project Structure

```
apps/todoist/
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js web app
│   ├── mobile/       # Expo React Native app
│   └── desktop/      # Electron desktop app
├── packages/
│   └── shared/       # Shared types and utilities
└── package.json      # Root workspace
```

## API Documentation

Once the API is running, visit:
- Swagger Docs: http://localhost:4000/api/docs

## Building for Production

```bash
# Build all apps
bun run build

# Build desktop app for specific platform
cd apps/desktop
bun run build:mac
bun run build:win
bun run build:linux
```

## License

MIT

