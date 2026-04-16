# HerbalW — Frontend Project Analysis

A bilingual (English / Yorùbá) web platform for documenting and exploring Yoruba indigenous herbal medicine. This document covers **only the frontend layer** — the user-facing pages, admin dashboard UI, components, styling, routing, and client interactions.

---

## 1. Project Purpose (Frontend Perspective)

The frontend delivers two distinct experiences from a single codebase:

1. **Public Site** — lets visitors discover health conditions, diseases, and traditional Yoruba herbal remedies through search, browsing, and category navigation.
2. **Admin Dashboard** — gives content editors a CMS-like workspace to create, update, and manage every entity in the system, with role-based access.

The UI is designed around a creative direction documented in [DESIGN.md](DESIGN.md): *"Clinical Botanical Editorial / The Modern Apothecary"* — a high-end editorial aesthetic that blends scientific rigor with the organic feel of traditional medicine.

---

## 2. Tech Stack (Frontend Only)

| Concern | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) |
| UI Library | **React 19** |
| Language | **TypeScript 6** |
| Styling | **Tailwind CSS v4** + PostCSS |
| Fonts | Playfair Display (display) + Inter (UI) |
| Rendering | Server Components by default; Client Components where interactivity is needed |
| Routing | File-system routing via `/src/app` |

---

## 3. Folder Structure (Frontend Layer)

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, global CSS)
│   ├── globals.css             # Tailwind v4 tokens & design-system variables
│   │
│   ├── (public)/               # Public-facing route group
│   │   ├── layout.tsx          # Public shell (Header + Footer)
│   │   ├── page.tsx            # Homepage
│   │   ├── error.tsx           # Error boundary for public routes
│   │   ├── _components/
│   │   │   ├── HeroSearch.tsx
│   │   │   └── NewsletterForm.tsx
│   │   ├── about/page.tsx
│   │   ├── categories/
│   │   │   ├── page.tsx        # Categories index
│   │   │   ├── _components/
│   │   │   └── [slug]/         # Dynamic category detail
│   │   ├── conditions/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx     # Streaming loading UI
│   │   │   ├── _components/
│   │   │   └── [slug]/
│   │   ├── remedies/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── _components/
│   │   │   └── [slug]/
│   │   ├── contact/, faq/, safety/, terms/
│   │
│   ├── login/
│   │   ├── page.tsx
│   │   └── LoginForm.tsx       # Client component (form interactivity)
│   │
│   └── admin/                  # Authenticated dashboard
│       ├── layout.tsx          # AdminShell wrapper
│       ├── page.tsx            # Dashboard overview
│       ├── error.tsx
│       ├── _components/Pagination.tsx
│       ├── categories/         # CRUD UI
│       ├── conditions/         # List + [slug] + new
│       ├── diseases/           # List + [id] + new
│       ├── remedies/           # List + [slug] + new
│       ├── team/, users/, settings/
│
└── components/
    ├── Header.tsx              # Public header / nav
    ├── Footer.tsx              # Public footer
    └── admin/
        ├── AdminShell.tsx      # Dashboard layout shell
        ├── AdminSidebar.tsx    # Desktop sidebar nav
        ├── AdminMobileNav.tsx  # Mobile drawer nav
        ├── ConfirmModal.tsx    # Reusable confirm dialog
        └── SettingsForm.tsx    # Site-settings client form
```

---

## 4. Architectural Concepts

### 4.1 App Router & Route Groups
The `(public)` folder is a **route group** — it shares one layout (Header + Footer) without affecting the URL. The `admin/` segment uses its own `AdminShell` layout. This cleanly separates two visual contexts in one codebase.

### 4.2 Server Components by Default
Listing/detail pages (e.g. [conditions/page.tsx](src/app/(public)/conditions/page.tsx)) are server components — they fetch data on the server and stream HTML to the browser. This improves SEO and first-paint performance.

### 4.3 Client Components for Interactivity
Only files that need browser APIs or React state are marked `"use client"`:
- [LoginForm.tsx](src/app/login/LoginForm.tsx) — form state + submission
- [SettingsForm.tsx](src/components/admin/SettingsForm.tsx) — form state
- [NewsletterForm.tsx](src/app/(public)/_components/NewsletterForm.tsx)
- [ConfirmModal.tsx](src/components/admin/ConfirmModal.tsx) — UI state
- [AdminMobileNav.tsx](src/components/admin/AdminMobileNav.tsx) — drawer toggle

### 4.4 Dynamic Routes
- `[slug]` for SEO-friendly public URLs (e.g. `/conditions/malaria`, `/remedies/bitter-leaf-tea`)
- `[id]` for admin-only diseases routes where stable identifiers matter

### 4.5 Streaming & Loading States
`loading.tsx` files (in `conditions/`, `remedies/`) leverage React Suspense to show skeleton UIs during data fetch — perceived performance win.

### 4.6 Error Boundaries
`error.tsx` files in `(public)/` and `admin/` provide graceful failure UIs.

---

## 5. Design System

Documented in [DESIGN.md](DESIGN.md). Key principles:

- **No 1px borders** — use background-color shifts (tonal layering) instead of lines.
- **Surface hierarchy** — three "paper-stack" layers (`surface`, `surface-container-low`, `surface-container-lowest`).
- **Typography contrast** — Playfair Display (serif, editorial) vs Inter (sans-serif, functional).
- **Botanical color palette** — earthy greens (`#01261f`, `#1a3c34`, `#446557`) refined for screens.
- **Glassmorphism** for floating elements (tooltips/dropdowns).
- **Generous spacing** (5–6rem between major sections) for the editorial "breathing room" feel.

These tokens are implemented as Tailwind v4 CSS variables in [globals.css](src/app/globals.css).

---

## 6. Bilingual Content Presentation

The UI is intentionally bilingual. Every domain entity (Category, Condition, Disease, Remedy) has both English and **Yoruba** fields (`yoruba_name`, `yoruba_description`) surfaced in cards, lists, and detail pages. This is core to the project's mission of preserving indigenous knowledge in a digitally accessible form.

---

## 7. Two UX Surfaces

### 7.1 Public Site
- Homepage with hero search component
- Browseable taxonomies: Categories → Conditions → Remedies (with cross-links via Diseases)
- Static informational pages: About (with team), FAQ, Safety, Terms, Contact
- Newsletter signup
- Contact form

### 7.2 Admin Dashboard
- Sidebar shell (desktop) + mobile drawer
- Paginated CRUD tables for each entity
- Form pages for create/edit (with rich fields including Yoruba translations)
- Confirm modal for destructive actions
- Site-settings panel
- User management & team management
- Login flow guarded by middleware

---

## 8. Frontend ↔ Backend Boundary

The frontend never talks to the database directly. It consumes:

1. **Server Action functions** from `src/lib/actions/*` (called from form `action` props for mutations).
2. **Query functions** from `src/lib/queries/*` (called inside server components to read data).
3. **Typed domain models** from `src/lib/supabase/types.ts` for end-to-end type safety.

This boundary is what makes the codebase suitable for a clean frontend-vs-backend project split.

---

## 9. Suggested Project Write-Up Outline

| Chapter | Content |
|---|---|
| **1. Introduction** | Problem (preserving Yoruba herbal knowledge digitally), aim, objectives, scope, significance |
| **2. Literature Review** | Cultural-heritage web platforms, ethnobotany apps, design systems, modern React/Next.js architecture |
| **3. Methodology** | Design-system-first process, component-driven development, App Router architecture, accessibility approach |
| **4. System Design** | Wireframes, sitemap, component tree, design tokens, responsive strategy |
| **5. Implementation** | Pages, dynamic routes, server vs client components, forms, styling, bilingual UI |
| **6. Testing & Evaluation** | Usability testing, Lighthouse scores, responsive testing, accessibility (WCAG), user feedback |
| **7. Conclusion & Future Work** | PWA / offline support, language toggle, voice search in Yoruba, mobile app |

---

## 10. Strengths & Improvement Vectors

**Strengths**
- Modern stack (Next.js 16 + React 19) with strong TypeScript discipline
- Clean separation between public site and admin app
- Thoughtful, documented design system
- Bilingual-first content model

**Improvement Vectors (good for "Future Work" chapter)**
- Add a runtime language toggle so users can choose Yoruba-first display
- PWA / offline caching for rural-area access
- Internationalized routing (`/yo/...`)
- Image optimization audit (using `next/image` consistently)
- Accessibility audit (ARIA labels for icon-only buttons, color-contrast verification against design tokens)
- Component testing (Vitest / Playwright)
