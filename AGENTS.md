<!-- BEGIN:nextjs-agent-rules -->

# Architectural Rules & Skill: Feature-Based Next.js (App Router)

## Project Philosophy
This project strictly enforces a Feature-Based Modular Architecture.
The codebase is domain-centric, scalable, and decoupled.

## Directory Boundaries & Responsibilities

### 1. `src/app/` (Routing & Composition Only)
- Purpose: Next.js pages, layouts, and route handlers only.
- RULE: MUST remain thin. NEVER declare complex business logic, forms, or domain state directly in `page.tsx`.
- RULE: A page simply imports and composes containers from `src/features/*` and components from `src/components/*`.
- Route Handlers (`src/app/api/*`): Call shared services from `src/lib/` or feature services.

### 2. `src/features/<feature-name>/` (Core Business Modules)
- Every business domain (e.g., `auth`, `agent-chat`, `billing`) is self-contained:
  - `components/`: Domain-specific UI (e.g., `ChatWindow.tsx`, `LoginForm.tsx`).
  - `hooks/`: Custom hooks handling state and domain logic (e.g., `useAgentChat.ts`).
  - `services/`: API calls, fetchers, and external communication for this feature.
  - `actions/`: Next.js Server Actions scoped to this feature.
  - `types/`: Type definitions and interfaces exclusive to this feature.
  - `index.ts`: **THE PUBLIC API**.

#### Strict Encapsulation Rule
- Other parts of the app (pages, other features) **MUST ONLY** import from the feature's `index.ts`.
- NEVER import internal subpaths across modules (e.g., BAD: `@/features/auth/components/LoginForm`).
- GOOD: `import { LoginForm } from '@/features/auth'`.

### 3. `src/components/` (Global & Atomic UI)
- `components/ui/`: Dumb, presentation-only components (buttons, dialogs, inputs - e.g., shadcn/ui).
- `components/feedback/`: App-wide loaders, toasts, error boundaries.
- RULE: Components here MUST NOT contain business rules or specific domain knowledge.

### 4. `src/lib/` (Shared Clients & Infrastructure)
- SDK singletons, third-party clients, database connectors (e.g., `aws-bedrock.ts`, `prisma.ts`, `axios.ts`).

## Code Generation Guidelines for LLM
When asked to create or modify code:
1. **New Feature:** Scaffold under `src/features/<feature-name>/` including `components/`, `hooks/`, `types/`, and `index.ts`.
2. **New Page:** Create the minimal route in `src/app/.../page.tsx` and immediately delegate the body to an exported container from `src/features/<name>`.
3. **Cross-Feature Communication:** Always respect the `index.ts` boundary. Do not create circular dependencies.

<!-- END:nextjs-agent-rules -->
