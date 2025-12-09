# Partner Invite Service - Unified Application

A unified Express + React application for managing partnership invitations, featuring email-based invitations, daily questions, and mood tracking.

## Architecture

This is a **monolithic application** combining:
- **Express backend** (`server/`) - API routes for invitation management
- **React frontend** (`client/`) - Vite + React + TypeScript UI

### Development Mode

- **Express API**: Runs on `http://localhost:3000`
- **Vite Dev Server**: Runs on `http://localhost:5173`
- **Proxy**: Vite proxies `/api/*` requests to Express

### Production Mode

- **Express**: Serves both API routes and static React build
- **Single port**: Everything runs on port 3000 (or PORT env var)

## Project Structure

```
├── server/                 # Express backend
│   ├── routes/            # API route handlers
│   │   └── invitations.js
│   ├── templates/         # Email templates
│   ├── config.js          # Configuration
│   └── index.js          # Express app entry
├── client/                # React frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # React hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── index.html        # HTML entry
├── dist/                  # Production build (generated)
├── vite.config.ts        # Vite configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Base URL (used for email links - must be absolute URLs)
# In production: https://yourdomain.com
# In development: http://localhost:3000 (defaults to this if not set)
BASE_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_SERVICE_ANON_KEY=your_anon_key

# Resend (for email invitations)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=invites@yourdomain.com

# Frontend Supabase (for client-side auth)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Development

Run both Express and Vite in parallel:

```bash
npm run dev
```

This starts:
- Express API on `http://localhost:3000`
- Vite dev server on `http://localhost:5173`

Access the app at `http://localhost:5173` - API calls to `/api/*` are automatically proxied to Express.

### Production Build

```bash
npm run build
npm start
```

The Express server will serve the React app and handle API routes on a single port.

## API Routes

All API routes are prefixed with `/api`:

- `POST /api/invitations` - Send email invitation (requires auth)
- `GET /api/invitations/accept/:token` - Accept invitation via email link
- `GET /api/invitations/decline/:token` - Decline invitation via email link
- `GET /api/invitations/partnerships` - Get user's partnerships (requires auth)
- `GET /api/invitations/pending` - Get pending invitations (requires auth)

## Frontend Routes

- `/` - Redirects to `/dashboard`
- `/login` - Login page
- `/signup` - Signup page (supports `?invitation=token&email=email` query params)
- `/dashboard` - Main dashboard (handles `?partnership_accepted=true` query param)
- `/partnerships` - Manage partnerships
- `/settings` - User settings

## Key Features

### Email Invitations

1. User sends invitation via API (`POST /api/invitations`)
2. Email sent with accept/decline links
3. Recipient clicks link → redirected to `/signup` if no account, or accepts directly
4. After signup/acceptance → redirected to dashboard with success message

### Internal Redirects

- Invitation accept redirects: `/signup?invitation=token&email=email`
- After acceptance: `/?partnership_accepted=true`
- All redirects are internal (no external URLs)

## Scripts

- `npm run dev` - Start both Express and Vite in development
- `npm run dev:server` - Start only Express server
- `npm run dev:client` - Start only Vite dev server
- `npm run build` - Build React app for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code

## Technologies

### Backend
- Express.js
- Supabase (database & auth)
- Resend (email)

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- React Query
- Tailwind CSS
- Zustand

## Development Workflow

1. **Development**: Use `npm run dev` to run both servers
2. **API Changes**: Modify files in `server/`
3. **Frontend Changes**: Modify files in `client/src/`
4. **Hot Reload**: Both servers support hot reload
5. **API Proxy**: Vite automatically proxies `/api/*` to Express

## Deployment

The application can be deployed as a single Node.js application:

1. Set `NODE_ENV=production`
2. Run `npm run build` to create the React build
3. Run `npm start` to start the Express server
4. Express serves both API and static files

## Notes

- The invitation service uses Supabase service role key for admin operations
- Frontend uses Supabase anon key for client-side auth
- Email invitations are sent via Resend API
- All redirects are now internal (no external URLs needed)

