# CaseForge

PI evidence certification platform. Court-proof surveillance reports assembled by software — zero AI-generated content.

## What It Does

CaseForge automates surveillance report assembly for private investigators:

1. **Evidence intake** — Video files are SHA-256 fingerprinted server-side at upload. Timestamps, GPS, and device metadata extracted automatically.
2. **Investigator observations** — The PI writes what they saw. No AI fills in observations. Ever.
3. **Report generation** — Software assembles a court-ready PDF from structured data: case info (synced from Trackops), evidence log, observations, chain of custody, and a No-AI certification referencing Federal Rule of Evidence 707.

## Architecture

```
LAYER 1: INPUT          Camera, GPS, timestamps, case intake, observation notes
LAYER 2: SOFTWARE       SHA-256 hash engine, metadata extractor, template engine, audit logger
LAYER 3: STORAGE        Postgres (Supabase), file storage (R2), append-only audit log
LAYER 4: OUTPUT         Surveillance report PDF, evidence certificate, no-AI certification
```

**Key constraint:** No AI language model writes any report content. All narrative is human-authored. All assembly is deterministic template logic.

## Demo

- `/` — Marketing landing page
- `/demo` — Interactive dashboard with mock case data, evidence log, and real PDF generation

## Tech Stack

- Next.js (App Router)
- pdf-lib (server-side PDF generation)
- Supabase (Postgres + Auth + Storage) — schema ready, not wired in demo
- Cloudflare R2 (video file storage) — planned

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, or [http://localhost:3000/demo](http://localhost:3000/demo) for the dashboard.

## Deploy

Deploy to Vercel — framework auto-detected, zero config:

```bash
vercel
```

## API Endpoints

- `POST /api/reports/generate` — Accepts `{ narratives }` JSON, returns assembled PDF
- `POST /api/evidence/hash` — Accepts file upload (multipart), returns SHA-256 hash computed server-side

## Database Schema

Full Postgres schema with append-only audit log enforcement is at `supabase/migrations/001_initial_schema.sql`. Not connected in the demo — uses mock data.
