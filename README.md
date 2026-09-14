# 🌴 KeralaPG — Enterprise Admin & Seeker Management Platform

> A production-ready, full-stack Paying Guest (PG) and Hostel discovery, operations, and administration platform built for Kerala and South Indian tech hubs (Kochi Infopark, Trivandrum Technopark, Kozhikode Cyberpark, Bangalore Electronic City, etc.).

---

## 📌 Table of Contents
- [🌟 Platform Overview](#-platform-overview)
- [🏗️ System Architecture & Tech Stack](#-system-architecture--tech-stack)
- [⚡ Quick Start & Setup Guide](#-quick-start--setup-guide)
- [🔑 Environment Variables Configuration](#-environment-variables-configuration)
- [👥 User Roles, Testing Credentials & RBAC](#-user-roles-testing-credentials--rbac)
- [🚀 Key Modules & Feature Highlights](#-key-modules--feature-highlights)
- [📡 API Endpoints Reference](#-api-endpoints-reference)
- [🌐 Deployment Guide (Vercel & Render)](#-deployment-guide-vercel--render)
- [📂 Project Structure](#-project-structure)
- [💰 Monetization Model](#-monetization-model)

---

## 🌟 Platform Overview

**KeralaPG** bridges the gap between students/working professionals looking for verified accommodations and property owners/managers. The platform contains two seamlessly integrated experiences:

1. **Enterprise Admin Control Suite (15 Modules)**: Complete management portal for listing verification, granular room pricing & deposit structures, CRM lead pipeline, location hierarchy, dynamic content CMS, revenue tracking, and role-based team management.
2. **Seeker Discovery Portal**: A high-conversion, mobile-responsive portal for customers to explore verified PG listings, filter by amenities/budget/sharing, unlock owner contact info (₹19 direct connect model), and submit instant booking enquiries.

---

## 🏗️ System Architecture & Tech Stack

```mermaid
graph TD
    A[Seeker / Tenant Frontend] -->|Vite React 18 + TailwindCSS| C[Universal Gateway / API]
    B[Admin Control Hub] -->|Vite React 18 + TailwindCSS| C
    C -->|Express.js Node Backend| D[(Supabase PostgreSQL)]
    C -.->|Resilient Fallback| E[(Local JSON Cache)]
```

### **Frontend**
- **Framework**: React 18 with Vite 5 (Lightning-fast HMR)
- **Styling**: Vanilla CSS + TailwindCSS with custom emerald/amber design tokens & sleek dark mode
- **State Management**: React Context API (`AppContext`) with persistent navigation and session state
- **UI Components & Icons**: Radix UI primitives, Lucide React icons, slide-over sheets, dynamic filters, animated badges, and modal dialogs

### **Backend**
- **Runtime**: Node.js (ES Modules `import/export`)
- **Web Framework**: Express.js REST API with CORS and security headers
- **Database Engine**: **Supabase PostgreSQL** with automated table mapping and connection pooling
- **Resilience**: Dual-engine storage pattern (Cloud PostgreSQL with automatic local file fallback)

---

## ⚡ Quick Start & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) `v18.x` or higher
- [npm](https://www.npmjs.com/) `v9.x` or higher
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/dontcodejunaid/AdminPG.git
cd AdminPG
```

### 2. Install Dependencies
You can install dependencies for both the root, frontend, and backend simultaneously:

```bash
# Install root orchestrator dependencies
npm install

# Install all workspace dependencies
cd backend && npm install && cd ../frontend && npm install && cd ..
```

### 3. Configure Environment Variables
Create `.env` files in both `backend/` and `frontend/` (see configuration below).

### 4. Run Development Servers Concurrently
From the root directory, start both the frontend and backend with one command:

```bash
npm run dev
```

### 5. Access the Services Locally
- 💻 **Admin & Seeker Frontend**: [http://localhost:3000](http://localhost:3000)
- 🚀 **Backend API Server**: [http://localhost:5001](http://localhost:5001)
- 🩺 **API Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔑 Environment Variables Configuration

### **Backend (`backend/.env`)**
```env
PORT=5001
NODE_ENV=development

# Supabase PostgreSQL Configuration
SUPABASE_URL=https://foeyyhjcenfkqlyibmvw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZXl5aGpjZW5ma3FseWlibXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwODQ4NTIsImV4cCI6MjA1NzY2MDg1Mn0.e-B78m7_aA47T0W46g1a3ZJ27L8P0rX6pL43T1W4_6c
```

### **Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5001
VITE_SUPABASE_URL=https://foeyyhjcenfkqlyibmvw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZXl5aGpjZW5ma3FseWlibXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwODQ4NTIsImV4cCI6MjA1NzY2MDg1Mn0.e-B78m7_aA47T0W46g1a3ZJ27L8P0rX6pL43T1W4_6c
```

---

## 👥 User Roles, Testing Credentials & RBAC

The system enforces strict **Role-Based Access Control (RBAC)** across 4 distinct user tiers:

| # | Role | Email | Password | Access Scope |
|---|---|---|---|---|
| **1** | **Super Admin** | `superadmin@keralapg.com` | `password123` | **Full Platform Access**: Complete control over all 15 modules, RBAC team roles, revenue logs, and deletions. |
| **2** | **Admin (Operations)** | `admin@keralapg.com` | `password123` | **Operations Management**: Manage PG listings, verification audits, locations/facilities, enquiries, reports, and CMS. |
| **3** | **Staff (Executive)** | `staff@keralapg.com` | `password123` | **Field Listings & CRM**: Create/edit PG listings and process customer enquiry follow-ups. |
| **4** | **Seeker / Customer** | `salih.rahman@gmail.com` | `password123` | **Seeker Portal**: Public discovery, wishlist bookmarks, ₹19 direct owner contact unlock, and enquiries. |

### 🛡️ RBAC Permissions Matrix

| Platform Module | Super Admin | Admin | Staff | Customer / Seeker |
|---|:---:|:---:|:---:|:---:|
| **Dashboard Analytics & KPIs** | ✅ | ✅ | ✅ | ❌ |
| **Add / Edit PG Properties** | ✅ | ✅ | ✅ | ❌ |
| **Delete PG Properties** | ✅ | ✅ | ❌ | ❌ |
| **Verify PG Audit Badges** | ✅ | ✅ | ❌ | ❌ |
| **Locations & Areas Management** | ✅ | ✅ | ❌ | ❌ |
| **Facilities & Amenities Catalog** | ✅ | ✅ | ❌ | ❌ |
| **Enquiries & CRM Pipeline** | ✅ | ✅ | ✅ | ❌ |
| **Customer Registry & Profiles** | ✅ | ✅ | ❌ | ❌ |
| **Reported Listings Moderation** | ✅ | ✅ | ❌ | ❌ |
| **Featured PG Ordering** | ✅ | ✅ | ❌ | ❌ |
| **Payments & Revenue Logs** | ✅ | ❌ | ❌ | ❌ |
| **Pages & CMS Management** | ✅ | ✅ | ❌ | ❌ |
| **Hero & City Banners** | ✅ | ✅ | ❌ | ❌ |
| **Admin User Roles & Permissions** | ✅ | ❌ | ❌ | ❌ |
| **Seeker Portal (Search & Book)** | 🔄 | 🔄 | 🔄 | ✅ |

---

## 🚀 Key Modules & Feature Highlights

1. **Dashboard Home**: Real-time business metrics (Active PGs, Pending Verifications, Converted Leads, Unlocked Contacts, Platform Revenue).
2. **Properties Management**: Multi-room configuration (1/2/3/4/5 sharing, rent pricing, security deposits), video tour URLs, photos, rules, and meal options.
3. **Verification Hub**: 2-step physical and document verification audit process with badge awarding.
4. **Locations Engine**: Atomic country ➔ state ➔ city ➔ locality hierarchy supporting live additions without data loss.
5. **Facilities Catalog**: Categorized amenities (WiFi, Power Backup, AC, Attached Bath, Food) with custom icon tags.
6. **Enquiries CRM**: Status progression (`New` ➔ `Contacted` ➔ `Scheduled Visit` ➔ `Converted` ➔ `Lost`) with admin follow-up notes.
7. **Customer Registry**: Unified customer profiles tracking registered users, enquiry histories, and unlock receipts.
8. **Reported Listings Moderation**: Real-time complaint moderation pipeline with actions to `Resolve`, `Ignore`, or `Deactivate` violating listings.
9. **Featured Listings Manager**: Drag-and-drop pinning and prioritization of premium PG properties on the public search landing page.
10. **Payments & Revenue Log**: Financial ledger recording ₹19 direct owner contact unlocks via UPI, Cards, Net Banking, and Wallets.
11. **Pages & CMS Management**: Zero-code live editor for *About Us*, *Support Contacts*, *FAQ Accordions*, *Terms & Conditions*, and *Privacy Policies*.
12. **Promotional Banners**: Campaign manager with dynamic placement slots, city targeting, and scheduled date windows.
13. **Activity & Alerts**: Live notifications stream with instantaneous "Mark All Read" batch synchronization.
14. **Team & Permissions**: Granular capability toggles for internal operations and staff members.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and uptime |
| `POST` | `/api/users/login` | Universal authentication endpoint (Admin / Staff / Customer) |
| `POST` | `/api/users/register` | Public Seeker / Customer self-registration |
| `GET / POST` | `/api/properties` | Fetch filtered PG listings / Create new PG listing |
| `GET / PUT / DELETE` | `/api/properties/:id` | Retrieve / Full update / Remove PG listing |
| `PATCH` | `/api/properties/:id/quick-update`| Fast in-place status, rent, and verification updates |
| `GET` | `/api/stats/dashboard` | Aggregated executive KPIs and metrics |
| `GET / POST` | `/api/locations` | Hierarchical country/state/city/area retrieval and creation |
| `POST` | `/api/locations/city` | Atomic city creation within a state |
| `POST` | `/api/locations/area` | Atomic locality creation within a city |
| `DELETE` | `/api/locations/city/:cityId` | Remove city and its child localities |
| `GET / POST` | `/api/facilities` | Facilities and amenities catalog CRUD |
| `GET / POST` | `/api/enquiries` | Submit customer lead / Retrieve CRM pipeline |
| `PATCH` | `/api/enquiries/:id/status` | Update enquiry pipeline status and internal notes |
| `GET / POST` | `/api/reports` | Submit user listing flag / Retrieve reported listings |
| `PATCH` | `/api/reports/:id/resolve` | Mark complaint resolved with optional PG deactivation |
| `GET / POST` | `/api/payments` | Record ₹19 contact unlock transaction / Retrieve ledger |
| `GET / PUT` | `/api/cms` | Retrieve / Update live CMS content and FAQ sections |
| `GET / POST` | `/api/banners` | Fetch active promotional banners / Create banner |
| `GET` | `/api/notifications` | Retrieve activity notifications with unread counts |
| `POST` | `/api/notifications/mark-all-read` | Mark all notifications as read in Supabase |
| `GET / POST / PUT`| `/api/users` | Admin user account management and RBAC permissions |

---

## 🌐 Deployment Guide (Vercel & Render)

### **Frontend Deployment (Vercel)**
1. Import the repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://adminkeralapg.onrender.com`)
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
5. Deploy.

### **Backend Deployment (Render / Railway / VPS)**
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Configure Environment Variables:
   - `PORT`: `5001` (or dynamic `$PORT`)
   - `NODE_ENV`: `production`
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key
6. Deploy.

---

## 📂 Project Structure

```text
AdminPG/
├── backend/
│   ├── src/
│   │   ├── config/            # Supabase client configuration
│   │   ├── data/              # Initial seed fixtures and local fallback cache
│   │   ├── routes/            # 12 Modular Express REST controllers
│   │   ├── services/
│   │   │   ├── store.js       # Central data orchestrator
│   │   │   └── supabaseStore.js # Supabase PostgreSQL data layer
│   │   └── index.js           # Express API server entry point
│   └── package.json
│
├── frontend/
│   ├── public/                # Logos, static imagery & assets
│   ├── src/
│   │   ├── components/        # Modals, form wizards, table UI, and badges
│   │   ├── context/           # AppContext (Auth, RBAC, Active Tab state)
│   │   ├── pages/             # 15 Admin Pages + Seeker Portal + Login
│   │   ├── services/          # Centralized Axios/Fetch API client
│   │   ├── App.jsx            # Main view router & role switcher
│   │   └── main.jsx           # Vite React DOM root
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json               # Root orchestrator (concurrently runner)
└── README.md                  # Detailed Documentation & Setup Guide
```

---

## 💰 Monetization Model

KeralaPG implements a **Direct Owner Connect Fee (₹19)**:
- Seekers search and compare all PG listings for free without hidden broker commissions.
- A nominal ₹19 unlock fee connects genuine tenants directly with verified PG owners while eliminating telemarketing spam.
- Integrated payment gateway support (Razorpay, UPI, PhonePe, Google Pay, Cards, Net Banking).

---

## 📄 License
This project is proprietary and maintained for **KeralaPG.com**. All rights reserved.
