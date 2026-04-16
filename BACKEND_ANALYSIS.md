# HerbalW — Backend Project Analysis

A bilingual (English / Yorùbá) platform for documenting Yoruba indigenous herbal medicine. This document covers **only the backend layer** — the database schema, server-side data access, mutations, authentication, route protection, and security model.

---

## 1. Project Purpose (Backend Perspective)

The backend is the **system of record** for Yoruba ethnobotanical knowledge. It must:

1. Persist structured data about categories, conditions, diseases, herbal remedies, ingredients, dosages, and bilingual descriptions.
2. Enforce data integrity (unique slugs, valid enums, referential cascades).
3. Authenticate admin users and authorize their actions by role.
4. Serve typed read queries to the rendering layer and accept typed mutations from forms.
5. Maintain an audit trail of administrative activity.
6. Capture engagement signals (contact messages, newsletter subscribers, view/save counts).

---

## 2. Tech Stack (Backend Only)

| Concern | Technology |
|---|---|
| Database | **PostgreSQL** (managed via Supabase) |
| BaaS Platform | **Supabase** (Auth + Postgres + cookie SSR) |
| Server Runtime | **Next.js 16 Server** (Server Components + Server Actions) |
| Auth | **Supabase Auth** via [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side) |
| Language | **TypeScript 6** |
| Schema Management | Versioned SQL migrations under [supabase/migrations/](supabase/migrations/) |
| Security | **Row Level Security (RLS)** on every table |

---

## 3. Folder Structure (Backend Layer)

```
src/
├── middleware.ts                   # Edge middleware: auth gate for /admin & /login
└── lib/
    ├── supabase/
    │   ├── client.ts               # Browser Supabase client
    │   ├── server.ts               # Cookie-bound SSR Supabase client
    │   ├── types.ts                # TypeScript domain models + Database type
    │   ├── schema.sql              # Initial DDL (tables, policies, triggers)
    │   └── seed.sql                # Initial seed data
    │
    ├── actions/                    # Next.js Server Actions (writes)
    │   ├── auth-actions.ts         # Login, logout
    │   ├── category-actions.ts     # CRUD for categories
    │   ├── condition-actions.ts    # CRUD for conditions
    │   ├── disease-actions.ts      # CRUD for diseases
    │   ├── remedy-actions.ts       # CRUD for remedies
    │   ├── team-actions.ts         # Team-member management
    │   ├── settings-actions.ts     # Site-settings updates
    │   ├── contact-actions.ts      # Inbound contact messages
    │   └── newsletter-actions.ts   # Newsletter subscription
    │
    └── queries/                    # Read-side data access
        ├── categories.ts
        ├── conditions.ts
        ├── diseases.ts
        ├── remedies.ts
        ├── team.ts
        ├── users.ts
        ├── settings.ts
        ├── stats.ts                # Dashboard counters/metrics
        └── activity.ts             # Audit-log queries

supabase/
└── migrations/
    ├── 20260414_condition_diseases.sql   # Adds condition <-> disease junction
    ├── 20260415_yoruba_fields.sql        # Adds yoruba_name / yoruba_description
    ├── 20260416_link_orphan_diseases.sql # Backfills relationships
    └── 20260417_seed_yoruba_data.sql     # Seeds Yoruba content
```

---

## 4. Database Schema (12 Tables)

### 4.1 Content Domain
| Table | Purpose | Notable Fields |
|---|---|---|
| `categories` | Top-level grouping | `name`, `yoruba_name`, `slug` (unique), `display_order` |
| `conditions` | Public health conditions | `name`, `yoruba_name`, `yoruba_description`, `safety_note`, `category_id`, `remedy_count` |
| `diseases` | Admin-managed clinical entities | `description TEXT[]`, `symptoms TEXT[]`, `status` enum, `severity 0-100`, `tags`, `views_count`, `saves_count`, `is_featured` |
| `remedies` | Herbal preparations | `ingredients JSONB`, `preparation_steps`, `dosage`, `duration`, `precautions`, `is_active`, `is_featured` |

### 4.2 Junction Tables (Many-to-Many)
| Table | Relationship | Extra Fields |
|---|---|---|
| `disease_remedy` | Diseases ↔ Remedies | `tag` |
| `condition_remedy` | Conditions ↔ Remedies | `display_order`, `icons JSONB` |
| `condition_diseases` | Conditions ↔ Diseases | `created_at` (added in migration `20260414`) |

All junctions use `ON DELETE CASCADE` for referential integrity.

### 4.3 People & Operations
| Table | Purpose |
|---|---|
| `team_members` | About-page profiles (name, role, bio, image) |
| `profiles` | Admin users — 4 roles (`Super Admin`, `Editor`, `Contributor`, `Viewer`), 4 statuses |
| `activity_log` | Audit trail (action, target, icon, user_id) |

### 4.4 Site & Engagement
| Table | Purpose |
|---|---|
| `site_settings` | Singleton row (site name, contact, currency, timezone) |
| `contact_messages` | Inbound contact-form submissions (`is_read` flag) |
| `newsletter_subscribers` | Email list (unique email, `is_active`) |

---

## 5. Data Integrity Mechanisms

- **UNIQUE constraints** on `slug` columns and `email` fields to prevent duplicates.
- **CHECK constraints** on enum fields:
  - `diseases.status IN ('Active','Draft','Archived')`
  - `diseases.severity BETWEEN 0 AND 100`
  - `profiles.role IN ('Super Admin','Editor','Contributor','Viewer')`
- **Foreign keys** with `ON DELETE CASCADE` on junction tables.
- **JSONB** columns (`ingredients`, `icons`) for flexible structured data without schema rigidity.
- **PostgreSQL trigger** `update_updated_at()` automatically maintains `updated_at` timestamps on `categories`, `conditions`, `diseases`, `remedies`, `site_settings`.

---

## 6. Authentication & Authorization

### 6.1 Supabase Auth
- Email/password authentication managed by Supabase.
- Sessions persisted as HTTP-only cookies.
- Two Supabase clients exist:
  - [client.ts](src/lib/supabase/client.ts) — for browser-side use
  - [server.ts](src/lib/supabase/server.ts) — cookie-bound, for Server Components & Server Actions

### 6.2 Edge Middleware (Route Protection)
[middleware.ts](src/middleware.ts) runs on every request matching `/admin/:path*` or `/login`:

1. Reads cookies and reconstructs the Supabase session.
2. Calls `supabase.auth.getUser()` to verify the session.
3. **Redirects unauthenticated users** away from `/admin` → `/login?redirect=…`.
4. **Redirects already-authenticated users** away from `/login` → `/admin`.

This protects every admin route at the edge before any page logic runs.

### 6.3 Role Model
The `profiles` table defines four roles. The schema is in place; per-action role enforcement is a planned hardening step (currently RLS uses `allow_all` policies — see §8).

---

## 7. API Surface — Server Actions vs Queries

This project uses **Next.js Server Actions** instead of a separate REST/GraphQL API.

### 7.1 Reads — `lib/queries/*`
Pure async functions that run inside Server Components. Each module wraps a Supabase query and returns typed rows. Examples:
- `queries/conditions.ts` — list/find conditions with related remedies
- `queries/stats.ts` — aggregate metrics for the admin dashboard
- `queries/activity.ts` — recent admin actions

### 7.2 Writes — `lib/actions/*`
Functions marked `"use server"` that receive `FormData`, validate, call Supabase, and `revalidatePath()` the affected route. Examples:
- `actions/auth-actions.ts` — `login()`, `logout()`
- `actions/remedy-actions.ts` — `createRemedy()`, `updateRemedy()`, `deleteRemedy()`
- `actions/contact-actions.ts` — `submitContactMessage()`
- `actions/newsletter-actions.ts` — `subscribe()`

### 7.3 Type Safety
[types.ts](src/lib/supabase/types.ts) defines:
- One `type` per table (`Category`, `Condition`, `Disease`, `Remedy`, `Profile`, etc.)
- A generic `Database` type used by the Supabase client so queries are end-to-end typed (Postgres column → TypeScript field) with no runtime cost.

---

## 8. Security Posture

### Currently Implemented
- ✅ RLS **enabled** on every table.
- ✅ Cookie-based session management (HTTP-only, SameSite handled by Supabase).
- ✅ Edge-level route protection.
- ✅ Server-only secret usage (`SUPABASE_SERVICE_ROLE_KEY` never reaches the browser).

### Hardening Opportunities (excellent material for your write-up)
- ⚠️ All RLS policies are currently `allow_all` — should be tightened to per-role policies (`auth.uid()` checks, role-based `USING` clauses).
- ⚠️ Server Actions should validate the caller's role before executing destructive operations.
- ⚠️ Add input validation (e.g. with Zod) at the action boundary.
- ⚠️ Rate-limit public endpoints (newsletter, contact form) to prevent abuse.
- ⚠️ Store `created_by` consistently on mutating actions to strengthen the audit trail.

---

## 9. Schema Evolution (Migrations)

The migrations folder tells the story of the project's evolving understanding of the domain:

| Migration | Purpose |
|---|---|
| `20260414_condition_diseases.sql` | Introduced the third junction (conditions ↔ diseases) once the team realized conditions group multiple diseases |
| `20260415_yoruba_fields.sql` | Added `yoruba_name` / `yoruba_description` to make the platform genuinely bilingual |
| `20260416_link_orphan_diseases.sql` | Data fix: backfilled disease→condition relationships for previously orphaned rows |
| `20260417_seed_yoruba_data.sql` | Seeded Yoruba content for the launch dataset |

This migration history is real evidence of iterative development — useful in a methodology chapter.

---

## 10. Suggested Project Write-Up Outline

| Chapter | Content |
|---|---|
| **1. Introduction** | Problem (digital archiving of Yoruba ethnobotanical knowledge), aim, objectives, scope |
| **2. Literature Review** | RDBMS vs NoSQL, BaaS platforms (Supabase / Firebase / Appwrite), RLS security, cultural-heritage knowledge management systems |
| **3. Methodology** | ER modeling, normalization choices, why PostgreSQL + Supabase, migration-driven schema evolution |
| **4. System Design** | ERD diagram, table definitions, relationships, sequence diagrams (login, create-remedy, public read) |
| **5. Implementation** | Schema DDL, migrations, server actions, queries, middleware, type safety strategy |
| **6. Security Analysis** | Auth flow, RLS, role enforcement, threat model, hardening recommendations |
| **7. Testing & Evaluation** | Schema integrity tests, query-performance benchmarks, load testing, audit-log verification |
| **8. Conclusion & Future Work** | Full RBAC enforcement, full-text search (Postgres `tsvector`), public REST API for mobile clients, analytics warehouse, automated backups |

---

## 11. Diagrams to Include in the Write-Up

1. **Entity-Relationship Diagram (ERD)** — all 12 tables with cardinality (1:N, M:N).
2. **Authentication sequence diagram** — Browser → Middleware → Supabase Auth → Cookie → Protected Route.
3. **Mutation sequence diagram** — Admin Form → Server Action → Supabase Postgres → `revalidatePath` → UI refresh.
4. **Layered architecture diagram** — Pages → Server Actions / Queries → Supabase Client → Postgres (with RLS).

---

## 12. Strengths & Improvement Vectors

**Strengths**
- Strongly normalized relational schema with proper junction tables.
- End-to-end TypeScript type safety from database to UI.
- Migrations are versioned and tell a coherent evolution story.
- Edge middleware enforces auth before page rendering — fast and secure.
- Clear separation of read (`queries/`) and write (`actions/`) responsibilities.

**Improvement Vectors**
- Replace `allow_all` RLS policies with per-role, per-action policies.
- Add server-side input validation (Zod / Valibot).
- Add full-text search for remedies and conditions (Yoruba + English).
- Introduce caching (Next.js `unstable_cache`) for hot read paths.
- Add automated backup and point-in-time-recovery documentation.
- Wire up `activity_log` writes inside every mutating server action for a complete audit trail.
