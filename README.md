# Real Estate CRM System (PropFlow Enterprise)

A modern, high-performance, full-stack **Real Estate CRM** built with Next.js 16 (App Router & Turbopack), TypeScript, Prisma 7, Turso LibSQL Cloud database, and Vanilla CSS Modules.

🌐 **Live Demo App**: [https://real-estate-crm-app-2026.netlify.app](https://real-estate-crm-app-2026.netlify.app)

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `123456` | Full system access, all leads, properties, and analytics |
| **Agent** | `priya@recrm.com` | `agent123` | Lead management, follow-ups, and sales tracking |
| **Agent** | `arjun@recrm.com` | `agent123` | Lead management, follow-ups, and sales tracking |

---

## 🚀 Key Features

* **📊 Real-time Dashboard**:
  - Key performance indicators (Total Leads, New Leads, Site Visits, Bookings, Follow-ups Due).
  - Visual pipeline stage breakdown bar chart and conversion rate metrics.
  - Recent sales leads & booking transaction history.

* **👥 Leads Management Pipeline**:
  - Full CRUD operations connected to backend REST API endpoints (`/api/leads`).
  - Multi-filter toolbar (Stage, Agent, Lead Source, Urgency/Follow-up status).
  - Form validation with inline field errors and format validation for 10-digit phone numbers and Gmail/emails.
  - Top-Right Toast notification system.
  - Responsive table layout for Desktop & mobile card view.

* **🏢 Property Inventory Catalogue**:
  - Property listings with price labels, bedroom specs, location tags, and unit availability progress indicators.
  - Filter by property type (Apartments, Villas, Plots, Commercial), location, availability, and price range.

* **📝 Bookings & Deals**:
  - Record confirmed and pending property booking transactions.
  - Link buyers to specific property units and payment amounts.

* **🔐 Authentication & Security**:
  - Secure login with bcrypt password hashing and JWT tokens.
  - Client-side and server-side route guarding (zero flash of protected content).

* **🎨 Enterprise Design & UX**:
  - Custom glassmorphic 404 page & global error fallback boundary.
  - Fully responsive across Desktop, Tablet, and Mobile viewports.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 16 (App Router + Turbopack), React 19, TypeScript, Vanilla CSS Modules, Lucide React.
* **Backend**: Next.js API Routes, Prisma 7, Zod Validation, JWT Authentication, Bcrypt.js.
* **Database**: Turso LibSQL Cloud / SQLite with `@prisma/adapter-libsql`.
* **Deployment**: Netlify Cloud Platform.

---

## 📦 Getting Started (Local Setup)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/chandramouli2508/real-estate-crm.git
cd real-estate-crm
npm install
```

### 2. Environment Setup
Create a `.env` file in the project root:
```env
# Database Connection (SQLite local or Turso Cloud)
DATABASE_URL="file:./dev.db"

# JWT Secret Key
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Initialize & Seed Database
```bash
# Push schema tables and seed admin user & demo records
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Project Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Generates Prisma Client & builds Next.js production bundle |
| `npm run db:seed` | Re-seeds database with demo users, properties & leads |
| `npm run db:studio` | Launches Prisma Studio GUI for database inspection |
| `npm run db:push` | Pushes Prisma schema changes to the database |

---

## 🌐 Production Netlify Deployment

The project includes pre-configured [`netlify.toml`](file:///e:/freelancing/manju%20groups/crm/real-estate-crm/netlify.toml) and build scripts.

**Environment Variables Required on Netlify**:
* `DATABASE_URL`: `libsql://your-turso-url.turso.io?authToken=YOUR_AUTH_TOKEN`
* `JWT_SECRET`: `your-production-secret-key`

---

© 2026 PropFlow Real Estate CRM. All rights reserved.
