# The Elder Forge Frontend

The Elder Forge is a Next.js frontend for documenting, managing, and sharing Skyrim modlists. It connects to a Spring Boot backend that handles authentication, modlist ownership, visibility, file uploads, and public browsing.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- ESLint and Prettier

## Features

- Public landing page for The Elder Forge.
- User registration and login.
- Private user modlist vault at `/modlists`.
- Public modlist browsing at `/modlists/browse`.
- SEO-friendly public modlist detail pages at `/modlists/[modlistId]`.
- Modlist creation with optional `modlist.txt` and `loadorder.txt` uploads.
- Public/private visibility toggle for owned modlists.
- Delete action for owned modlists.
- Client-side search inside mod and plugin tables.
- Nexus mod links when backend metadata includes a Nexus id.
- Linked row highlighting between mods and their related plugins.

## Prerequisites

- Node.js 20 or newer.
- npm.
- The Elder Forge backend running and reachable from the frontend.

The default development backend URL is:

```env
http://localhost:8080
```

## Environment Variables

Create or update `.env.development`:

```env
BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

`BACKEND_URL` is used from server-rendered routes. `NEXT_PUBLIC_BACKEND_URL` is used by browser-side client components.

## Installation

```bash
npm install
```

## Running Locally

Start the Spring Boot backend first, then run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server after a successful build.

```bash
npm run lint
```

Runs ESLint.

## Project Structure

```text
src/
  app/                    App Router pages and route layouts
  components/             Shared React components
    layout/               Page layout primitives
    modlists/             Modlist-specific cards, pagination, controls
    ui/                   Reusable UI primitives
  lib/                    API clients and server auth helpers
  types/                  Shared TypeScript interfaces
  util/                   Small utility functions
```

## Routes

| Route                   | Access                  | Description                                                     |
| ----------------------- | ----------------------- | --------------------------------------------------------------- |
| `/`                     | Public                  | Landing page.                                                   |
| `/auth/login`           | Public                  | Login form.                                                     |
| `/auth/register`        | Public                  | Registration form.                                              |
| `/modlists`             | Authenticated           | Current user's modlist vault.                                   |
| `/modlists/add`         | Authenticated           | Create a new modlist and upload MO2 files.                      |
| `/modlists/browse`      | Public                  | Browse public modlists with search and pagination.              |
| `/modlists/[modlistId]` | Public or authenticated | Detail view. Backend decides whether private lists are visible. |

## Backend Integration

API calls are centralized in:

```text
src/lib/auth.ts
src/lib/modlists.ts
src/lib/axios.ts
```

The frontend currently uses these backend endpoints:

| Method   | Endpoint                                    | Purpose                           |
| -------- | ------------------------------------------- | --------------------------------- |
| `POST`   | `/api/v1/users`                             | Register a user.                  |
| `POST`   | `/api/v1/auth`                              | Login.                            |
| `POST`   | `/api/v1/auth/logout`                       | Logout.                           |
| `GET`    | `/api/v1/modlists/user`                     | Fetch current user's modlists.    |
| `GET`    | `/api/v1/modlists?page=&name=`              | Browse public modlists.           |
| `GET`    | `/api/v1/modlists/{modlistId}`              | Fetch a modlist detail page.      |
| `POST`   | `/api/v1/modlists`                          | Create a modlist.                 |
| `PATCH`  | `/api/v1/modlists/{modlistId}/visibility`   | Update public/private visibility. |
| `DELETE` | `/api/v1/modlists/{modlistId}`              | Delete an owned modlist.          |
| `POST`   | `/api/v1/modlists/{modlistId}/mods/file`    | Upload `modlist.txt`.             |
| `POST`   | `/api/v1/modlists/{modlistId}/plugins/file` | Upload `loadorder.txt`.           |

## Authentication Notes

The app relies on backend-managed cookies. Client requests use `withCredentials: true`, and server-rendered authenticated pages forward the incoming cookie header to the backend.

Protected frontend routes:

- `/modlists`
- `/modlists/add`

Public frontend routes:

- `/`
- `/auth/login`
- `/auth/register`
- `/modlists/browse`
- `/modlists/[modlistId]`
