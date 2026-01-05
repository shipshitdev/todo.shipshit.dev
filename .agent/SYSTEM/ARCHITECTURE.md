# Architecture - TaskFlow

**Purpose:** Document what IS implemented (not what WILL BE).
**Last Updated:** 2025-01-27

---

## Overview

TaskFlow is a full-stack task management application (Todoist clone) with cross-platform support. Built as a monorepo with Next.js web app, Expo mobile app, Electron desktop app, and NestJS backend API. All platforms sync via MongoDB and use Clerk for authentication.

---

## Tech Stack

- **Package Manager:** Bun
- **Web:** Next.js 16+, React 19, TypeScript, Tailwind CSS, @agenticindiedev/ui
- **Mobile:** Expo ~52, React Native 0.76, Expo Router
- **Desktop:** Electron
- **Backend:** NestJS 11+, MongoDB, Mongoose
- **Auth:** Clerk
- **Linting/Formatting:** Biome

---

## Project Structure

```
taskflowcom/
├── apps/
│   ├── api/                     # NestJS backend
│   │   ├── src/
│   │   │   ├── main.ts          # Bootstrap
│   │   │   ├── app.module.ts    # Root module
│   │   │   ├── auth/            # Authentication module
│   │   │   │   ├── guards/      # Clerk auth guard
│   │   │   │   ├── decorators/  # @CurrentUser decorator
│   │   │   │   └── schemas/     # User schema
│   │   │   ├── projects/        # Projects module
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   ├── projects.module.ts
│   │   │   │   ├── schemas/
│   │   │   │   └── dto/
│   │   │   ├── tasks/           # Tasks module
│   │   │   │   ├── tasks.controller.ts
│   │   │   │   ├── tasks.service.ts
│   │   │   │   ├── tasks.module.ts
│   │   │   │   ├── schemas/
│   │   │   │   └── dto/
│   │   │   └── history/         # Task history module
│   │   │       ├── history.controller.ts
│   │   │       ├── history.service.ts
│   │   │       └── history.module.ts
│   │   └── package.json
│   ├── web/                     # Next.js web app
│   │   ├── src/
│   │   │   ├── app/             # App Router
│   │   │   │   ├── (app)/       # Protected routes
│   │   │   │   │   ├── inbox/
│   │   │   │   │   ├── today/
│   │   │   │   │   ├── upcoming/
│   │   │   │   │   ├── projects/
│   │   │   │   │   └── history/
│   │   │   │   ├── sign-in/
│   │   │   │   └── sign-up/
│   │   │   ├── components/      # React components
│   │   │   │   ├── kanban-board.tsx
│   │   │   │   ├── task-card.tsx
│   │   │   │   ├── task-form.tsx
│   │   │   │   ├── task-list.tsx
│   │   │   │   └── project-form.tsx
│   │   │   └── lib/
│   │   │       └── api.ts       # API client
│   │   └── package.json
│   ├── mobile/                   # Expo React Native app
│   │   ├── app/                  # Expo Router
│   │   │   ├── _layout.tsx
│   │   │   ├── (tabs)/           # Tab navigation
│   │   │   │   ├── inbox.tsx
│   │   │   │   ├── today.tsx
│   │   │   │   ├── upcoming.tsx
│   │   │   │   ├── projects.tsx
│   │   │   │   └── history.tsx
│   │   │   ├── sign-in.tsx
│   │   │   └── sign-up.tsx
│   │   ├── app.json
│   │   └── package.json
│   └── desktop/                  # Electron desktop app
│       ├── src/
│       │   ├── main.ts           # Electron main process
│       │   └── preload.ts       # Preload script
│       └── package.json
├── packages/
│   └── shared/                   # Shared types and utilities
│       ├── src/
│       │   ├── types/            # TypeScript types
│       │   └── utils/            # Utility functions
│       └── package.json
└── package.json                  # Monorepo root
```

---

## Key Components

### Backend API (`apps/api/`)

**Purpose:** REST API for tasks, projects, and history
**Location:** `apps/api/src/`
**Dependencies:** NestJS, Mongoose, MongoDB, Clerk

**Modules:**

#### Auth Module
- **Guard:** `clerk-auth.guard.ts` - Clerk JWT validation
- **Decorator:** `@CurrentUser()` - Extract user from request
- **Schema:** User schema (linked to Clerk user ID)

#### Projects Module
- **Controller:** `projects.controller.ts` - REST endpoints
- **Service:** `projects.service.ts` - Business logic
- **Schema:** Project schema (name, color, userId)

#### Tasks Module
- **Controller:** `tasks.controller.ts` - REST endpoints
- **Service:** `tasks.service.ts` - Business logic
- **Schema:** Task schema (title, description, dueDate, projectId, status, priority, etc.)

#### History Module
- **Controller:** `history.controller.ts` - Completed tasks
- **Service:** `history.service.ts` - History queries
- **Features:** Completed task tracking, filtering

**API Endpoints:**
- Projects: CRUD operations
- Tasks: CRUD operations, status updates
- History: List completed tasks

### Web App (`apps/web/`)

**Purpose:** Next.js web application
**Location:** `apps/web/src/`
**Dependencies:** Next.js, React, Tailwind CSS, Clerk

**Views:**
- `/inbox` - Unassigned tasks
- `/today` - Today's tasks
- `/upcoming` - Upcoming tasks
- `/projects` - Projects list
- `/projects/[id]` - Project detail with tasks
- `/history` - Completed tasks

**Components:**
- `kanban-board.tsx` - Kanban view (with list as default)
- `task-card.tsx` - Task card component
- `task-form.tsx` - Task creation/editing
- `task-list.tsx` - List view
- `project-form.tsx` - Project creation/editing

**Features:**
- Kanban board with drag-and-drop
- List view (default)
- Task filtering and sorting
- Due dates with time support
- Project and category organization

### Mobile App (`apps/mobile/`)

**Purpose:** React Native mobile application
**Location:** `apps/mobile/`
**Dependencies:** Expo, React Native, Expo Router, Clerk

**Navigation:**
- Tab-based navigation (Expo Router)
- Tabs: Inbox, Today, Upcoming, Projects, History
- Auth screens: Sign-in, Sign-up

**Features:**
- Cross-platform sync via API
- Offline support (Expo)
- Native mobile UI

### Desktop App (`apps/desktop/`)

**Purpose:** Electron desktop application
**Location:** `apps/desktop/`
**Dependencies:** Electron

**Structure:**
- `main.ts` - Electron main process
- `preload.ts` - Preload script for security
- Renders web app in Electron window

**Features:**
- Native desktop window
- System tray integration (potential)
- Auto-updater (potential)

### Shared Package (`packages/shared/`)

**Purpose:** Shared types and utilities across platforms
**Location:** `packages/shared/src/`
**Dependencies:** None (pure TypeScript)

**Contents:**
- `types/` - TypeScript interfaces (Task, Project, etc.)
- `utils/` - Utility functions

---

## Data Flow

### Task Creation Flow

```
1. User creates task in web/mobile/desktop
   ↓
2. POST /api/tasks → TasksService.create()
   ↓
3. Validate with Clerk auth guard
   ↓
4. Save to MongoDB with userId
   ↓
5. Return task data
   ↓
6. UI updates across all platforms (sync)
```

### Cross-Platform Sync Flow

```
1. User updates task on web
   ↓
2. PATCH /api/tasks/:id → TasksService.update()
   ↓
3. Save to MongoDB
   ↓
4. Mobile/Desktop apps poll or use WebSocket (future)
   ↓
5. All platforms show updated data
```

### Authentication Flow

```
1. User signs in via Clerk
   ↓
2. Clerk returns JWT token
   ↓
3. Token sent in API requests (Authorization header)
   ↓
4. ClerkAuthGuard validates token
   ↓
5. @CurrentUser() decorator extracts user
   ↓
6. API returns user-specific data
```

---

## External Services

| Service | Purpose | Documentation | Authentication |
|---------|---------|---------------|----------------|
| Clerk | Authentication | https://clerk.com/docs | API keys |
| MongoDB | Database | https://www.mongodb.com/docs | Connection string |

---

## Configuration

### Environment Variables

**Backend (`apps/api/.env`):**
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | MongoDB connection string | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `JWT_SECRET` | JWT secret (if needed) | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ |
| `PORT` | API server port | ❌ (default: 4000) |

**Web (`apps/web/.env.local`):**
| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ |
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |

**Mobile (`apps/mobile/.env`):**
| Variable | Purpose | Required |
|----------|---------|----------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | ✅ |
| `EXPO_PUBLIC_API_URL` | Backend API URL | ✅ |

---

## Deployment

### Web (Vercel)

```bash
cd apps/web
vercel
```

### Mobile (Expo)

```bash
cd apps/mobile
expo build:ios
expo build:android
# or
eas build
```

### Desktop (Electron)

```bash
cd apps/desktop
npm run build:mac
npm run build:win
npm run build:linux
```

### Backend

Deploy NestJS API to:
- Railway
- Render
- EC2
- Any Node.js hosting

---

## Security

See `quality/SECURITY-CHECKLIST.md` for security considerations.

**Key Security Features:**
- Clerk authentication (JWT tokens)
- User isolation (all queries filtered by userId)
- CORS configuration
- Electron preload script for security

---

## Related Documentation

- `RULES.md` - Coding standards
- `architecture/DECISIONS.md` - Architectural decisions
- `architecture/PROJECT-MAP.md` - Project map
- `README.md` - User-facing documentation
