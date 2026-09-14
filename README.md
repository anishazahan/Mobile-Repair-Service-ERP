# GadgetFIX — Repair Shop Website & ERP System

A complete frontend prototype for a mobile & gadget repair business, built for a Developer Hiring Assessment.

It has two parts:

1. **Public marketing website** — the storefront customers see: home page, services, pricing, team, testimonials, and contact information.
2. **ERP Dashboard** (`/app`) — the internal system the shop's staff use to run day-to-day operations: service orders, customers, devices, inventory, billing, technicians, staff, and reports.

There is intentionally **no real backend**. All data lives in an in-memory mock database, seeded from JSON fixtures and mutated by a mock API layer with artificial network latency — every module behaves like it's talking to a real server, loading states and all, without one existing.

---

## Highlights

- **A real, enforced business workflow**, not just a CRUD wrapper — the Service Order state machine only ever allows valid transitions, and closing an order automatically generates a real, itemized, tax-applied invoice.
- **Ten interconnected ERP modules** where every reference — a customer, a device, a technician, a part, an invoice — is a live link into that record's own detail page, not a dead label.
- **Role-based access control** driven by a single configuration file, so the "what can this role see" summary shown on a staff profile can never drift out of sync with the actual sidebar.
- **A functional, debounced global search** in both the ERP topbar and the public site header, backed by the same data the rest of the app uses.
- **Cross-module data sync** — e.g. logging parts used on a repair immediately updates inventory stock counts elsewhere in the app, with no page refresh.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Project Architecture](#project-architecture)
- [Public Website](#public-website)
- [ERP Dashboard](#erp-dashboard)
  - [Dashboard (Home)](#1-dashboard-home)
  - [Service Orders](#2-service-orders--the-core-workflow)
  - [Customers](#3-customers)
  - [Devices](#4-devices)
  - [Spare Parts (Inventory)](#5-spare-parts-inventory)
  - [Suppliers](#6-suppliers)
  - [Billing](#7-billing)
  - [Reports](#8-reports)
  - [Technicians](#9-technicians)
  - [Staff & Users](#10-staff--users)
  - [Settings](#11-settings)
- [Roles & Permissions](#roles--permissions)
- [Cross-Module Business Policies](#cross-module-business-policies)
- [Data Persistence Notes](#data-persistence-notes)
- [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript (strict mode) + Vite |
| Routing | React Router v7 |
| Server state | TanStack Query v5 (every mock "API" call goes through this) |
| Client state | Zustand (auth session only, persisted to `localStorage`) |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS v3, hand-built shadcn/ui-style primitives on Radix UI |
| Charts | Recharts |
| Icons | Lucide |

---

## Getting Started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run lint      # oxlint
```

## Demo Accounts

The login page (`/login`) has one-click demo account buttons. Any password works (mock authentication, no real credential check).

| Role | Email | Access |
|---|---|---|
| Admin | `admin@gadgetfix.shop` | Every module |
| Manager | `manager@gadgetfix.shop` | Every module |
| Front Desk | `frontdesk@gadgetfix.shop` | Everything except Reports, Staff & Users, Settings |
| Technician | `ahmed.karim@gadgetfix.shop` | Everything except Billing, Reports, Staff & Users, Settings |

See [Roles & Permissions](#roles--permissions) for the full matrix.

---

## Project Architecture

```
src/
  pages/public/        # marketing site pages (Home + "Coming Soon" placeholders)
  pages/erp/           # one folder per ERP module (list + detail pages)
  features/<name>/     # per-module: api.ts, hooks.ts, schema.ts, components/
  components/          # shared UI: ui/ (primitives), layout/, feedback/, charts/, motion/
  mocks/               # db.ts (the "database"), server.ts (fake network), data/*.json (seed data)
  types/               # single source of truth for every domain shape (Customer, ServiceOrder, ...)
```

**Mock data flow**: every feature's `api.ts` reads and writes a single shared `db` object directly — never the raw JSON fixtures. `simulateRequest()` wraps each call with a randomized 350–950ms delay so loading states behave like a real API. Each feature's `hooks.ts` wraps its `api.ts` functions in a TanStack Query hook, and every mutation invalidates the query keys of every module it affects. That's the mechanism behind, for example, logging parts used on a service order instantly updating the Spare Parts module's stock count elsewhere in the app without a refresh.

---

## Public Website

Designed to match the Envato "GadgetFIX" template's layout, in the app's primary brand color, with a consistent low border-radius applied across the entire site — including the dashboard.

- **Home page** sections: Hero, Quick Actions (Repair/Replace + a "Quality Repair" intro), About Us (image collage), Testimonials (customer reviews with star ratings, a device-repaired chip per review, and a trust/rating summary), Team preview, Pricing preview, Appointment banner, FAQ accordion, a brand/device logos strip, a closing CTA banner, and a Footer.
- **"Coming Soon" pages**: Services directory, full Pricing, Book a Service, About, Team, and Contact — each a centered, on-brand placeholder with a real photo and a working "Call Us Now" button using the shop's live phone number.
- **A functional global search** in the header, searching the live Service & Pricing Catalog and jumping to any page on the site.
- **Live contact info** — the footer and header don't hardcode the shop's address, phone, or email; they read the same Shop Profile record the ERP's Settings module manages, so a change there updates the whole public site immediately.
- **Staff Login** link routes into the ERP's `/login`.

---

## ERP Dashboard

Everything below lives behind `/app` and requires login. The sidebar only ever shows the modules the signed-in role is permitted to see.

### 1. Dashboard (Home)

The at-a-glance view of what's happening at the shop today.

- **KPI tiles**: Jobs Received Today, In Progress, Ready for Pickup, Revenue Today, Revenue This Month, Pending Payments (links to Billing), Low Stock Alerts (links to Spare Parts), Overdue Jobs.
- **Revenue trend chart** — last 14 days, built from real payment records.
- **Today's Service Queue** — every order created today; click a row, or its customer/device/technician, to jump straight to that record.
- **Recent Activity** — a live feed pulled from every order's own timeline.
- **Low Stock Alerts** — parts at or below their reorder level, clickable.
- **Technician Workload chart** — active job count per technician.

---

### 2. Service Orders — the core workflow

The heart of the whole system: the full lifecycle of a single repair, from intake to money collected.

**Three views:**
- **List** — every order, searchable and filterable by status, technician, and priority.
- **Repair Board** — a Kanban board spanning every pipeline stage; dragging a card between columns changes its status, and invalid moves are rejected.
- **Detail page** — full history, cost summary, timeline, parts used, notes, and a status-transition menu that only ever offers the *valid* next actions for the order's current status.

**The state machine** — this is the actual business rule; every screen enforces it, and no step can be skipped:

```
RECEIVED
  → INITIAL_INSPECTION
    → DIAGNOSING
      → AWAITING_APPROVAL   (diagnosis + labor estimate submitted)
        → APPROVED           (customer approved the quote)
          → IN_REPAIR
            → AWAITING_PARTS  ⇄  IN_REPAIR   (pause/resume if a part is missing)
            → AWAITING_APPROVAL              (a new issue found mid-repair, re-quote)
            → QUALITY_CHECK
              → READY_FOR_PICKUP   (QC passed)
              → IN_REPAIR          (QC failed → rework)
                → DELIVERED         (customer picked up the device)
                  → CLOSED          (payment settled — invoice generated)

CANCELLED — reachable from RECEIVED through APPROVED, always requires a reason.
```

**Business rules enforced in code, not just hidden in the UI:**
1. **Closing is payment-gated.** The Close Order dialog requires an explicit confirmation that payment was received in full before the button is even enabled.
2. **Closing auto-generates the invoice.** The moment an order is closed, a real, itemized `Invoice` (parts + labor line items) and a matching `Payment` record are created automatically, with the shop's current tax rate applied — idempotently, so re-testing never produces a duplicate invoice for the same order.
3. **Using parts live-decrements stock.** Logging a part against an order immediately reduces that part's quantity in Spare Parts, visible without a refresh.
4. **A technician can be assigned or reassigned at any point** before delivery, with an optional reason logged on reassignment.
5. **Every action is timestamped and attributed** in the order's own timeline.

---

### 3. Customers

- **List**: search by name, phone, or email; filter by type (Walk-in / Regular) and status (Active / Archived).
- **Detail**: contact information, every device they own, full service-order history, and computed stats — total orders, open orders, total spent.
- Customers are archived, never deleted — a reversible status change, not a destructive action.
- Every customer reference elsewhere in the app (Orders, Devices, Billing, Reports) links back to this profile.

---

### 4. Devices

- A cross-customer device registry — its own module, not nested inside Customers.
- The detail page shows a device's complete repair history and links back to its owner.
- Add a device standalone (choosing any existing customer as the owner) or directly from a customer's profile — both flows share the exact same dialog component.

---

### 5. Spare Parts (Inventory)

- Each part's stock status is computed live: **In Stock**, **Low Stock** (at or below its reorder level), or **Out of Stock**.
- **"Used In"** on a part's detail page lists every service order that has ever consumed it — real traceability, not a static field.
- **Restock** adds received quantity to stock.
- Each part can be linked to a supplier, with category, SKU, compatible models, and unit cost vs. selling price (margin shown).

---

### 6. Suppliers

- Active / Inactive status.
- The detail page lists every part a supplier provides, plus the current stock value of those parts (quantity × unit cost).

---

### 7. Billing

- **Invoices are created exactly one way: automatically, when a Service Order is closed.** There's no "create invoice from scratch" flow — billing stays strictly tied to real repair work.
- Each invoice carries itemized line items (parts + labor), subtotal, tax (from Settings), total, amount paid, and balance due.
- **Record Payment** supports partial payments — the amount can't exceed the balance due, and status moves automatically through `unpaid → partially_paid → paid`.
- Every invoice links back to its customer and its originating service order.

---

### 8. Reports

*Admin/Manager only.*

- KPIs: Total Revenue, Total Orders, Average Order Value, Outstanding Balance.
- A 30-day revenue trend and the active pipeline breakdown.
- **Top Customers** (by total spend), **Technician Performance** (completed jobs + revenue generated), and **Top Parts by Usage** — every row links into its source module.

---

### 9. Technicians

- Specialties (screen, battery, motherboard, software, water damage, and more) and status (Active / On Leave / Inactive).
- **Active Jobs**, **Completed Jobs**, and **Revenue Generated** are computed live from assigned orders — assigning or reassigning a technician anywhere in Service Orders keeps these figures accurate everywhere, automatically.
- Can be linked bidirectionally to a Staff & Users login account.

---

### 10. Staff & Users

*Admin/Manager only.*

- Every login account, its role, and status (Active / Inactive / Suspended).
- A **Module Access panel** on each profile shows exactly which sidebar modules that role can see, computed live from the same permission config driving the real sidebar.
- **Self-protection rule**: no account can deactivate or suspend itself — enforced at the data layer, not just hidden in a menu.
- **My Profile**: any signed-in user can edit their own name and email; it updates their session immediately and the same underlying record shown in this list.

---

### 11. Settings

- **Shop Profile** *(Admin/Manager)*: shop name, address, phone, email, and **tax rate** — the tax rate is genuinely applied to every invoice generated afterward when an order is closed. This is the one piece of data persisted to `localStorage`, surviving a page reload (see [Data Persistence](#data-persistence-notes)).
- **Service & Pricing Catalog** *(Admin/Manager)*: a full CRUD reference price list for repair services, also surfaced through the public site's search.
- **My Profile** *(every role)*: the same self-service profile editing described above. Non-admin roles land directly on this tab with no other tabs shown.

---

## Roles & Permissions

Every role's sidebar access is driven by a single file: `src/components/layout/nav-config.ts`. Nothing else decides visibility — the Staff & Users "Module Access" panel reads this exact same config, so it's always accurate.

| Module | Admin | Manager | Front Desk | Technician |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Service Orders | ✅ | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | ✅ | ✅ |
| Devices | ✅ | ✅ | ✅ | ✅ |
| Spare Parts | ✅ | ✅ | ✅ | ✅ |
| Suppliers | ✅ | ✅ | ✅ | ✅ |
| Billing | ✅ | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ | ❌ |
| Technicians | ✅ | ✅ | ✅ | ✅ |
| Staff & Users | ✅ | ✅ | ❌ | ❌ |
| Settings (full) | ✅ | ✅ | My Profile only | My Profile only |

---

## Cross-Module Business Policies

Rules enforced in the mock API layer itself, not merely hidden buttons in the UI:

1. **Payment-gated closing** — a Service Order cannot be closed without confirming payment in full.
2. **Automatic, idempotent invoicing** — closing an order generates exactly one invoice, applying the shop's current tax rate.
3. **Live inventory sync** — parts used on an order immediately reduce Spare Parts stock, with that module's cache invalidated and refetched automatically.
4. **Self-account protection** — no user can deactivate or suspend their own account.
5. **Single source of truth for permissions** — role-based sidebar access and the "what can this role see" summary read the same configuration.
6. **Everything is a link** — every order, customer, device, technician, part, supplier, invoice, or staff reference anywhere in the app is clickable and leads to that record's own detail page.

---

## Data Persistence Notes

This is a frontend-only prototype with **no backend**, so almost all data lives in memory and **resets on a full page reload** (not on ordinary in-app navigation — only a hard refresh or a new tab). This is intentional for transactional demo data (orders, customers, payments) so the seed dataset always starts clean.

**The one exception**: **Shop Settings** (name, address, phone, email, tax rate) is persisted to `localStorage` and survives a reload, because a real user expects a settings change to actually stick, and because the public website reads it live.

---

## Known Limitations

- No real backend, database, or authentication — this is a frontend-only prototype built on mock data.
- The Service & Pricing Catalog (Settings) isn't yet wired into the New Service Order wizard's estimate step.
- The public site's "Coming Soon" pages (Services directory, full Pricing, Book a Service, About, Team, Contact) are placeholders, not complete pages.
- No automated test suite — verification throughout development was manual and Playwright-driven exploratory testing.

---

Built with React, TypeScript, and Tailwind CSS.
