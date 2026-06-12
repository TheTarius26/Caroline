# Caroline — Ideas Platform

AI-powered project idea generator with community features. Get fresh project ideas, validate them with the community, showcase your implementations, and collaborate with others.

## Features

### AI Idea Generation
- Generate project ideas daily/weekly via OpenRouter AI (deepseek-v4-flash)
- Ideas saved to PostgreSQL and displayed with category filtering & search
- AI avoids duplicate ideas by cross-referencing existing projects in the database

### Community Features
- **Browse & Filter** — Search ideas by keyword or filter by category
- **Vote** — Upvote/downvote ideas (Reddit-style validation)
- **Discuss** — Nested comments/replies per idea for community feedback
- **Rate** — 1–5 star rating per idea
- **Collaborators** — Submit your GitHub repo to showcase an idea you built
- **User Profiles** — Track your contributions, ideas, and showcased projects

### Authentication
- Email/password login
- GitHub OAuth
- Session management via Better Auth

### Tech Stack
| Layer | Technology |
|---|---|
| Framework | SvelteKit 5 (Runes mode) |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| AI | OpenRouter Agent (deepseek-v4-flash) |
| i18n | Paraglide (en, id) |
| Testing | Vitest + Playwright |
| Package Manager | pnpm |

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm
- PostgreSQL database

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/caroline

# App
ORIGIN=http://localhost:5173

# Better Auth (generate with: openssl rand -hex 32)
BETTER_AUTH_SECRET="your-secret-here"

# GitHub OAuth (https://github.com/settings/developers)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# OpenRouter (https://openrouter.ai/keys)
OPENROUTER_API_KEY=""
```

### Database

```bash
# Push schema to database
pnpm db:push

# Or generate + run migrations
pnpm db:generate
pnpm db:migrate

# Open Drizzle Studio (GUI)
pnpm db:studio
```

### Seed Data

```bash
pnpm db:seed
```

Populates the database with:
- 5 sample users
- 12 AI-generated project ideas
- Comments, replies, votes, and ratings

### Development

```bash
pnpm dev
# or with open browser
pnpm dev -- --open
```

### Build & Preview

```bash
pnpm build
pnpm preview
```

## Project Structure

```
src/
├── lib/
│   ├── components/       # Svelte components
│   ├── openrouter/       # AI agent integration
│   │   └── agent.ts      # OpenRouter client + project idea generator
│   ├── paraglide/        # Auto-generated i18n
│   └── server/
│       ├── auth.ts       # Better Auth configuration
│       └── db/
│           ├── index.ts            # Drizzle client
│           ├── seed.ts             # Database seeder
│           └── schema/
│               ├── schema.ts          # Barrel exports
│               ├── auth.schema.ts     # User, session, account tables
│               ├── projects.schema.ts # Project ideas
│               ├── comments.schema.ts # Nested comments
│               ├── collaborators.schema.ts  # Repo showcases
│               └── ratings.schema.ts  # Star ratings
├── routes/
│   ├── +page.svelte      # Homepage — browse & filter ideas
│   ├── +page.server.ts   # Server load with search/filter
│   ├── +layout.svelte    # Root layout
│   ├── layout.css        # Global styles
│   └── api/
│       └── agent/        # AI idea generation endpoint
└── hooks.server.ts       # Auth + i18n middleware
```

## Database Schema

### `projects`
| Column | Type | Description |
|---|---|---|
| id | text (PK) | UUID |
| name | text | Idea title |
| description | text | Detailed description |
| features | text | Comma-separated features |
| category | text | AI, Health, Education, etc. |
| difficulty | integer | 1 (beginner) - 3 (advanced) |
| status | text | active, in_progress, showcased, completed |
| upvotes / downvotes | integer | Vote counters |
| views | integer | Page view counter |

### `comments`
Nested replies via `parentId` self-referencing FK. Supports threaded discussions per project.

### `ratings`
1–5 star ratings per user per project, with optional review comment.

### `collaborators`
Links a GitHub repository to a project idea, showing who built what.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm check` | Type-check with svelte-check |
| `pnpm lint` | Lint with ESLint + Prettier |
| `pnpm test` | Run unit tests |
| `pnpm db:push` | Push schema to database |
| `pnpm db:generate` | Generate migration |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed database with sample data |

## License

[MIT](LICENSE) — feel free to use, modify, and distribute.