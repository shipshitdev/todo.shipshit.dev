# TaskFlow - Todoist Clone

## Project Overview

Complete task management application with cross-platform support (Web, Mobile, Desktop).

## Tech Stack

- **Runtime**: Bun
- **Web**: Next.js 16+ + React 19 + Tailwind CSS
- **Mobile**: Expo ~52 + React Native 0.76
- **Desktop**: Electron
- **API**: NestJS 11+ + MongoDB + Mongoose
- **Auth**: Clerk
- **UI**: @agenticindiedev/ui
- **Linting**: Biome

## Project Structure

```
taskflowcom/
├── apps/
│   ├── api/      # NestJS backend
│   ├── web/      # Next.js frontend
│   ├── mobile/   # Expo React Native
│   └── desktop/  # Electron app
└── packages/
    └── shared/   # Shared types
```

## Commands

```bash
bun run dev        # Start all apps
bun run dev:api    # Start API only
bun run dev:web    # Start web only
bun run build      # Build all apps
bun run check:fix  # Fix linting issues
```

## Key Features

- Projects & Categories
- Inbox, Today, Upcoming views
- Kanban and list views
- Task history
- Due dates with time support
- Cross-platform sync

## Documentation

- Session logs: `.agent/SESSIONS/YYYY-MM-DD.md`
