# Real Estate CRM — Foundation

Build the application shell, global styling, design system tokens, typography, spacing, reusable UI components, sidebar, header, and responsive layout for the Real Estate CRM.

---

## Key Technical Decisions

> [!IMPORTANT]
> **CSS strategy**: The prompt asks for CSS Modules / global CSS and **no prebuilt UI libraries**. Tailwind is already installed in this project. We'll keep `@import "tailwindcss"` in globals.css for reset/base normalisation only, then build the entire design system using **CSS custom properties in globals.css** + **CSS Modules per component**. This gives us scoped styles, avoids naming collisions, and matches the brief.

> [!NOTE]
> **Next.js 16 / React 19 App Router** is in use. All layout-level components are **Server Components** by default. Client-only behaviour (state, event handlers, animations) will be in `"use client"` leaf components only — keeping the architecture correct for this version.

> [!NOTE]
> **Font**: We'll use `Inter` from Google Fonts (via `next/font/google`) — professional, widely-used in SaaS dashboards — replacing the current Geist pairing.

---

## Proposed Changes

### Design Tokens & Global Styles

#### [MODIFY] [globals.css](file:///e:/freelancing/manju%20groups/crm/real-estate-crm/src/app/globals.css)

Full rewrite:
- Remove dark-mode auto-toggle (light-only SaaS)
- Add all design tokens as CSS custom properties: colors, radii, shadows, spacing scale, font sizes, line heights, z-indices
- Base resets (box-sizing, scroll behaviour, focus rings)
- Typography scale classes (`.text-xs` → `.text-4xl`)
- Utility classes (`.sr-only`, `.truncate`)

---

### Root Layout

#### [MODIFY] [layout.tsx](file:///e:/freelancing/manju%20groups/crm/real-estate-crm/src/app/layout.tsx)

- Switch font to `Inter`
- Update `<html>` / `<body>` class names to use our design tokens
- Update `metadata` (title, description) to reflect the CRM

---

### Project Structure

New folders to create under `src/`:

```
src/
├── app/
│   ├── globals.css          ← rewritten
│   ├── layout.tsx           ← updated
│   └── page.tsx             ← dashboard redirect / stub
├── components/
│   ├── ui/                  ← pure UI atoms (no business logic)
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Textarea/
│   │   ├── SearchInput/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Avatar/
│   │   ├── Modal/
│   │   ├── Drawer/
│   │   ├── Table/
│   │   ├── EmptyState/
│   │   ├── LoadingState/
│   │   ├── ErrorState/
│   │   ├── Toast/
│   │   ├── Tabs/
│   │   ├── Dropdown/
│   │   ├── DateInput/
│   │   ├── StatusIndicator/
│   │   ├── PageHeader/
│   │   └── StatCard/
│   └── layout/              ← shell components
│       ├── Sidebar/
│       ├── Header/
│       └── AppShell/
└── lib/
    └── cn.ts                ← className merge helper
```

---

### UI Components (src/components/ui/)

Each component gets its own folder with `index.tsx` + `[Name].module.css`.

#### [NEW] Button
Variants: `primary | secondary | ghost | danger`. Sizes: `sm | md | lg`. Loading and icon-left/right slots.

#### [NEW] Input
Label + optional hint text + error state. Controlled, forwarded ref.

#### [NEW] Select
Custom styled `<select>` with chevron icon.

#### [NEW] Textarea
Auto-grow optional. Same label/error pattern as Input.

#### [NEW] SearchInput
Input with magnifier icon prefix and optional clear button.

#### [NEW] Card
Surface container. Props: `padded`, `shadow`, `className`.

#### [NEW] Badge
Variants: `default | success | warning | danger | info | neutral`. Dot variant.

#### [NEW] Avatar
Initials fallback, size variants `sm | md | lg`, optional status ring.

#### [NEW] Modal
Portal-based overlay. Controlled via `isOpen`/`onClose`. Focus trap, ESC key close.

#### [NEW] Drawer
Slides in from the right (side panel). Same portal pattern as Modal.

#### [NEW] Table
Typed columns config, sortable header, stripe rows, loading skeleton rows.

#### [NEW] EmptyState
Icon + title + description + optional action button.

#### [NEW] LoadingState
Skeleton shimmer animation for generic content areas.

#### [NEW] ErrorState
Icon + message + retry button slot.

#### [NEW] Toast
Position: bottom-right stack. Types: success/error/warning/info. Auto-dismiss with progress bar. Context + hook (`useToast`).

#### [NEW] Tabs
Underline-style tabs. Controlled or uncontrolled.

#### [NEW] Dropdown
Trigger + floating menu. Click outside to close.

#### [NEW] DateInput
Styled `<input type="date">` matching the design system.

#### [NEW] StatusIndicator
Coloured dot + label. Maps status strings to colours.

#### [NEW] PageHeader
Title + subtitle + right-side action slot. Used at the top of every page.

#### [NEW] StatCard
KPI card: icon + label + value + delta badge. Used on dashboard.

---

### Layout Shell (src/components/layout/)

#### [NEW] Sidebar
- Fixed left sidebar, 240px wide on desktop
- Logo area at top
- Navigation items (icon + label) with active state
- Bottom section: user avatar + name + settings link
- Collapses to icon-only on tablet
- Hidden (off-canvas drawer) on mobile — toggled by Header hamburger

#### [NEW] Header
- Fixed top bar (height 64px)
- Left: hamburger (mobile/tablet) + page breadcrumb
- Right: search trigger, notifications bell, user avatar dropdown
- Fully responsive

#### [NEW] AppShell
- Server Component wrapper
- Composes `<Sidebar>` + `<Header>` + `<main>`
- Handles CSS grid layout: `sidebar | main` columns
- Responsive breakpoints via CSS

---

### App Entry

#### [MODIFY] [page.tsx](file:///e:/freelancing/manju%20groups/crm/real-estate-crm/src/app/page.tsx)
Replace the default Next.js boilerplate with a proper **Dashboard** stub page that:
- Wraps in `<AppShell>`
- Shows `<PageHeader>` ("Dashboard")
- Shows a grid of 4 `<StatCard>` components with mock data
- Shows a simple "Recent Activity" `<Card>` with an `<EmptyState>`

---

## Verification Plan

### Automated
```bash
npm run build   # no TypeScript or ESLint errors
```

### Manual
- Run `npm run dev` and verify at `localhost:3000`
- Resize browser: desktop → tablet → mobile
- Confirm sidebar collapses on tablet, off-canvas on mobile
- Check all UI components render correctly on the dashboard stub
