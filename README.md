# OKAYiT

A digital wellbeing platform for looked-after young people in children's residential homes. OKAYiT gives each young person a warm, age-appropriate welcome to their home, everyday wellbeing tools, and safe routes to support, while giving staff a private workspace for key-work, safeguarding, and home management.

Built with Next.js 14 (App Router), TypeScript, Prisma and PostgreSQL, and Tailwind CSS.

> **Note:** This repository is a source export. The application was originally built and is hosted on the Abacus.AI platform, which provides the database, file storage, authentication secrets, and the LLM / notification / PDF / FFmpeg APIs used at runtime. To run it elsewhere you will need to supply equivalents for those services via the environment variables listed below.

---

## Features

- **Young person experience** - personalised welcome guide, house tour, daily wellbeing check-ins, calm corner, safety plan, and support resources, all in a single consistent design.
- **Staff workspace** - key-work tools, an interactive online-safety key-work module, safeguarding flags, invite-code management, and guide-link management.
- **Guide links (OK-14 containment)** - personalised welcome guides are reachable only through signed, expiring, single-use, revocable links or an authenticated session. No publicly reachable URL ever carries information identifying an individual child. Public house tours live separately at `/tour/[homeSlug]` and contain no child data.
- **Safeguarding first** - mandatory safeguarding notifications, neutral failure pages, strict no-index/no-store headers on sensitive routes, and full audit logging.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Radix primitives |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth (credentials + optional Google SSO) |
| File storage | AWS S3 (UK region) |

## Project structure

```
.
|-- app/                  # Next.js App Router routes (pages + API routes)
|   |-- api/             # API route handlers
|   |-- g/               # Personalised guide: /g/[token], /g/view, /g/unavailable
|   |-- tour/            # Public house tour: /tour/[homeSlug]
|   `-- ...              # login, dashboard, safeguarding, etc.
|-- components/           # React components (young person, staff, key-work, ui)
|-- lib/                  # Server utilities (db, s3, guide-links, auth)
|-- prisma/               # Prisma schema
|-- scripts/              # Database seed scripts
|-- public/               # Static assets
|-- middleware.ts         # Route protection + security headers
`-- .env.example          # Environment variable template
```

## Getting started

### Prerequisites

- Node.js 18+
- Yarn
- A PostgreSQL database

### 1. Install dependencies

```bash
yarn install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then fill in the values in `.env`. See the table below for what each variable is.

### 3. Set up the database

```bash
yarn prisma generate
yarn prisma db push        # create tables from the schema
yarn prisma db seed        # optional: seed demo accounts and content
```

The seed script reads `SEED_ADMIN_PASSWORD` from your environment for the demo accounts. No real password is stored in source.

### 4. Run the app

```bash
yarn dev
```

The app runs at http://localhost:3000.

### 5. Production build

```bash
yarn build
yarn start
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Base URL of the running app |
| `NEXTAUTH_SECRET` | NextAuth session encryption secret (`openssl rand -base64 32`) |
| `ADMIN_JWT_SECRET` | Secret for admin JWT signing |
| `STAFF_ADMIN_PASSWORD` | Staff admin access password |
| `SEED_ADMIN_PASSWORD` | Password used by the seed script for demo accounts |
| `ABACUSAI_API_KEY` | Key for platform LLM / notification / PDF / FFmpeg APIs |
| `WEB_APP_ID` | Platform app identifier |
| `NOTIF_ID_*` | Notification type IDs for the various email notifications |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google SSO (optional) |
| `AWS_PROFILE` / `AWS_REGION` / `AWS_BUCKET_NAME` / `AWS_FOLDER_PREFIX` | S3 file storage (UK region) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL used in metadata |

All secrets are read from the environment. Never commit a real `.env` file.

## Security & data handling notes

- No publicly reachable URL exposes information identifying an individual child.
- Personalised guide links are hashed (SHA-256) before storage; raw tokens are never stored or logged.
- Sensitive routes send no-store and no-index headers and are excluded in `robots.ts`.
- Data is intended to be held in the United Kingdom only.

## Deployment

The canonical deployment is hosted on the Abacus.AI platform. To deploy on your own infrastructure, host the Next.js app (for example on a Node server) with the environment variables above configured, a reachable PostgreSQL database, and an S3-compatible bucket for uploads. Run `yarn build` then `yarn start`, and put the app behind HTTPS.

## License

Proprietary. All rights reserved.
