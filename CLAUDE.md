# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Context

This is a Next.js (App Router) prototype for **Reto 2: Exoneración de multas** — a tool that helps
Guatemalan citizens who missed renewing their driver's license determine whether they qualify for a
fine exoneration (three causales: haber estado fuera del país, enfermedad/accidente, or prisión), and
what supporting document each causal requires. See `README.md` for the full problem statement.

## Commands

```bash
npm run dev      # start dev server (Next.js, Turbopack default)
npm run build    # production build
npm run start    # run the production build
npm run lint     # ESLint (flat config in eslint.config.mjs)
```

There is no test runner configured in `package.json` yet.

### Database (Prisma 7)

- Schema: `prisma/schema.prisma` (PostgreSQL, generated client output to `generated/prisma`, gitignored).
- Prisma config lives in `prisma7.config.ts` (not `prisma.config.ts`) and reads `DATABASE_URL` from env via `dotenv`.
- Standard Prisma CLI commands (`npx prisma generate`, `npx prisma migrate dev`, etc.) apply; migrations are written to `prisma/migrations`.

## Architecture Overview

Beyond the feature-based structure enforced in `AGENTS.md`, the concrete stack in this repo:

- **Next.js 16 / React 19**, App Router, path alias `@/*` → `src/*` (see `tsconfig.json`).
- **Styling/UI**: Tailwind CSS v4 + shadcn/ui (`components.json`, style `base-nova`, base color `neutral`).
  shadcn primitives live in `src/components/ui/`; import them via `src/components/ui/index.ts` where applicable.
- **AI Agent integration**: `src/lib/bedrock-agent.ts` wraps AWS Bedrock AgentCore
  (`@aws-sdk/client-bedrock-agentcore`, `InvokeHarnessCommand`) and exposes `invokeBedrockAgent()`, which
  streams the agent's response as a `ReadableStream<Uint8Array>`. Configuration:
  - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — AWS credentials/region.
  - `BEDROCK_HARNESS_ARN` — overrides the default hardcoded harness ARN.
  - Session IDs are sanitized/padded to meet Bedrock's 33+ char runtime session ID requirement.
  - Consumed by the Route Handler `src/app/api/agent/route.ts` (`POST /api/agent`, `runtime = "nodejs"`),
    which validates the request body and returns the stream directly as the response body (plain text,
    not SSE/JSON).
- **Database**: Prisma 7 client with `@prisma/adapter-pg` (driver adapter for `pg`), PostgreSQL. Schema
  currently defines only datasource/generator — no models yet.

### Feature modules present

- `src/features/landing/` — the marketing/info page composed in `src/app/page.tsx` via `LandingContainer`
  (Hero, Causales, Pasos, Sedes, FAQ, Footer sections).
- `src/features/agent-chat/` — chat UI + `useAgentChat` hook that talks to `POST /api/agent`
  (`services/agentService.ts`) for the conversational assistant (chat drawer + floating button).
- `src/features/solicitud/` — modal/flow (`SolicitudModal`, `useSolicitud`) for the exoneration
  qualification flow described in the README.

Each feature's `index.ts` is the only import surface other modules/pages may use — respect this boundary
per `AGENTS.md` when wiring new pages or cross-feature code.
