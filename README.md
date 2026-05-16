<div align="center">

# Activate Rights

**Digital rights and internet freedom — built for Bangladesh, readable in English and Bangla.**

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/Sanity-CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

[Live site](https://activaterights.org)

</div>

---

## Overview

**Activate Rights** is the public website for a Bangladesh-based organisation working on internet freedom, digital rights, privacy, censorship resistance, shutdown monitoring, and human rights online and offline.

This repository contains the **marketing site and content platform**: a bilingual (English / Bangla) front end backed by **Sanity CMS**, with editorial workflows for articles, reports, projects, events, and team profiles.

## Highlights

| Area | What you get |
|------|----------------|
| **Content** | Articles, published reports, projects, events, campaigns, and team — all editable in Sanity Studio |
| **Locales** | `en` and `bn` routes via **next-intl** (`/en/...`, `/bn/...`) |
| **Publications** | Rich portable text plus **Files & media** attachments (PDF, image, video, audio, downloads) |
| **Design** | Figma-aligned layouts, custom typography (Stack Sans), film-grain textures, responsive home and listing pages |
| **SEO** | Per-page metadata, Open Graph images, sitemap-friendly structure |

## Tech stack

- **Framework** — [Next.js 14](https://nextjs.org/) (App Router, React Server Components)
- **CMS** — [Sanity v3](https://www.sanity.io/) with embedded Studio at `/studio`
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) + project design tokens in `globals.css`
- **i18n** — [next-intl](https://next-intl-docs.vercel.app/)
- **Monorepo** — [Turborepo](https://turbo.build/) + **pnpm** workspaces

## Repository layout

```
.
├── README.md
├── package.json              # Root scripts -> activaterights/
└── activaterights/
    ├── package.json          # Turbo orchestration
    └── apps/
        └── web/              # Next.js application
            ├── app/          # Routes ([locale], studio, API)
            ├── components/   # UI, sections, layouts
            ├── i18n/         # en.json, bn.json
            ├── lib/          # Sanity client, queries, SEO helpers
            ├── sanity/       # Schemas & Studio config
            └── public/       # Static assets & images
```

## Getting started

### Prerequisites

- **Node.js** 20+
- **pnpm** 10 (`corepack enable` recommended)

### 1. Install dependencies

From the repository root:

```bash
pnpm install
```

### 2. Configure environment

Copy the example env file and fill in your Sanity project values:

```bash
cp activaterights/apps/web/.env.local.example activaterights/apps/web/.env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name (e.g. `production`) |
| `SANITY_API_TOKEN` | For previews / private reads | Read token |
| `SANITY_API_WRITE_TOKEN` | For import scripts only | Write token — **never commit** |
| `NEXT_PUBLIC_BASE_URL` | Yes (prod) | Canonical site URL for SEO |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Search Console verification |
| `SANITY_WEBHOOK_SECRET` | No | Revalidation webhooks |

> Keep secrets in `.env.local` only. Do not commit real tokens to git.

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to a locale (e.g. `/en`).

### 4. Sanity Studio (CMS)

Studio is embedded in the app:

```text
http://localhost:3000/studio
```

First-time setup:

```bash
pnpm sanity login
pnpm sanity cors:local   # allow localhost:3000
```

## Scripts

Run from the **repository root**:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js in development |
| `pnpm build` | Production build (Turbo) |
| `pnpm lint` | ESLint across the monorepo |
| `pnpm typecheck` | TypeScript check |
| `pnpm sanity` | Sanity CLI (delegates to `apps/web`) |

**Web app only** (`activaterights/apps/web`):

| Command | Description |
|---------|-------------|
| `pnpm import:wp-articles` | Import articles from WordPress export |
| `pnpm seed:events` | Seed events from `data/events-seed.json` |
| `pnpm seed:events:dry` | Dry-run event seed |

## Main routes

| Path | Page |
|------|------|
| `/[locale]` | Home |
| `/[locale]/about` | About and team |
| `/[locale]/articles` | Articles listing |
| `/[locale]/articles/[slug]` | Article detail |
| `/[locale]/reports` | Reports listing |
| `/[locale]/reports/[slug]` | Report publication |
| `/[locale]/projects` | Projects |
| `/[locale]/projects/[slug]` | Project detail |
| `/[locale]/events` | Events |
| `/[locale]/events/[slug]` | Event detail |
| `/studio` | Sanity Studio |

`locale` is `en` or `bn`.

## Content model (Sanity)

Document types include **Article**, **Report**, **Project**, **Event**, **Campaign**, **Team member**, and singletons such as **Site settings** and **Reports on home** (curated home-page ordering).

Publications support:

- Localized title, summary, and portable-text body
- Cover images
- **Files & media** — PDF viewer, inline images, video/audio players, and generic file download cards

## Deployment

The app is a standard **Next.js** deployment (Vercel, Azure Static Web Apps, Node host, etc.):

1. Set all `NEXT_PUBLIC_*` and Sanity env vars in the host dashboard.
2. Run `pnpm build` with `NEXT_PUBLIC_BASE_URL` pointing at production.
3. Optionally configure Sanity webhooks and `SANITY_WEBHOOK_SECRET` for on-demand revalidation.

## Contributing

1. Fork the repository and create a branch from `main`.
2. Make focused changes; match existing patterns in `components/` and `sanity/schemas/`.
3. Run `pnpm lint` and `pnpm typecheck` before opening a PR.
4. Describe content/schema changes so editors know what to update in Studio.

## License

Proprietary — (c) Activate Rights. All rights reserved unless otherwise noted by the repository owner.

---

<p align="center">
  <sub>Built with care for an open, safe, and rights-respecting internet.</sub>
</p>
