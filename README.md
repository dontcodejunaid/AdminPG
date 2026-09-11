# 🌴 KeralaPG — Admin & Seeker Management Platform

> A modern, full-stack Paying Guest (PG) and Hostel discovery, operations, and administration portal built for Kerala and major South Indian tech hubs (Kochi Infopark, Trivandrum Technopark, Kozhikode Cyberpark, Bangalore Electronic City, etc.).

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Modules & Features](#-key-modules--features)
- [Testing Credentials (All 4 Roles)](#-testing-credentials-all-4-roles)
- [Role-Based Access Control (RBAC) Matrix](#-role-based-access-control-rbac-matrix)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Directory Structure](#-directory-structure)
- [Getting Started & Installation](#-getting-started--installation)
- [Available Scripts](#-available-scripts)
- [API Endpoints Overview](#-api-endpoints-overview)
- [Monetization Model](#-monetization-model)

---

## 🌟 Overview

**KeralaPG** bridges the gap between students/IT professionals seeking comfortable accommodation and property owners. The system provides:
1. **Administrative Suite**: A 14-module admin portal for managing listings, verification workflows, locations, customer enquiries, moderation reports, banners, CMS, and team permissions.
2. **Seeker Portal**: A clean, accessible frontend interface for customers to browse verified PGs, filter by gender/budget/amenities, unlock direct owner contact numbers (₹19 direct connect model), and submit instant enquiries.

---

## 🔐 Testing Credentials (All 4 Roles)

You can use the following pre-configured test accounts to explore the application under different authorization levels:

| # | Role | Email | Password | Access Level & Portal View |
|---|---|---|---|---|
| **1** | **Super Admin** | `superadmin@keralapg.com` | `password123` | **Full Unrestricted Access** — Complete control over all 14 admin modules, RBAC user permissions, revenue/payments tracking, and platform settings. |
| **2** | **Admin (Operations Manager)** | `admin@keralapg.com` | `password123` | **Operations Management** — Manage PG listings, verify properties, manage locations/facilities, handle enquiries, moderate reports, and update CMS/banners. (Restricted from financial reports & user administration). |
| **3** | **Staff (Field Executive)** | `staff@keralapg.com` | `password123` | **Field & Listings Entry** — Create and edit PG properties, process and follow up on customer enquiries. (Restricted from delete actions, verifications, CMS, and user management). |
| **4** | **Seeker / Customer** | `salih.rahman@gmail.com` *(or `seeker@keralapg.com`)* | `password123` | **Seeker Portal** — Customer-facing portal to search PGs, view room types, bookmark favorites, unlock owner contacts, and submit booking enquiries. |

> 💡 **Tip:** Any password string works in demo authentication mode for the pre-seeded demo accounts. New users can also be registered directly via the **Sign Up** tab on the login screen.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Module / Action | Super Admin | Admin | Staff | Customer / Seeker |
|---|:---:|:---:|:---:|:---:|
| **Dashboard & Analytics** | ✅ | ✅ | ✅ | ❌ |
| **Add / Edit Properties** | ✅ | ✅ | ✅ | ❌ |
| **Delete Properties** | ✅ | ✅ | ❌ | ❌ |
| **Verify PG Listings** | ✅ | ✅ | ❌ | ❌ |
| **Locations & Areas** | ✅ | ✅ | ❌ | ❌ |
| **Facilities & Amenities** | ✅ | ✅ | ❌ | ❌ |
| **Enquiries Management** | ✅ | ✅ | ✅ | ❌ |
| **Customer Registry** | ✅ | ✅ | ❌ | ❌ |
| **Reported Listings Moderation** | ✅ | ✅ | ❌ | ❌ |
| **Featured Listings Order** | ✅ | ✅ | ❌ | ❌ |
| **Payments & Revenue Tracking** | ✅ | ❌ | ❌ | ❌ |
| **CMS Pages & FAQ Management** | ✅ | ✅ | ❌ | ❌ |
| **Hero & Search Banners** | ✅ | ✅ | ❌ | ❌ |
| **Admin User Roles & Permissions** | ✅ | ❌ | ❌ | ❌ |
| **Seeker Portal (Browse & Book)** | 🔄 | 🔄 | 🔄 | ✅ |

---

## 🚀 Key Modules & Features

1. **Dashboard Home**: High-level KPIs (Total PGs, Active Enquiries, Verified % count, Total Revenue, Recent Activity stream).
2. **Properties Inventory**: Comprehensive PG management with filters (Boys, Girls, Co-living, AC/Non-AC, Cities, Status), room-wise pricing, and deposit details.
3. **Verification Workflow**: Physical & document audit tracker to award the verified shield badge.
4. **Locations Engine**: Hierarchical geo-structure (Country ➔ State ➔ City ➔ Area/Tech Park).
5. **Facilities & Amenities**: Custom icon & tag catalog mapped across property listings.
6. **Enquiries & Leads**: Real-time enquiry CRM with statuses (`New`, `Contacted`, `Interested`, `Visited`, `Closed`) and admin notes.
7. **Customer Base**: Customer profiles with enquiry count, unlocked contacts history, and saved properties.
8. **Reported Content Moderation**: Handle user flags for wrong pricing, unavailable beds, or inaccurate media.
9. **Featured Listings Manager**: Pin and re-order properties on the top banner or hero sections.
10. **Payments & Transactions**: Tracking ₹19 owner contact unlock transactions via UPI, Cards, and Net Banking.
11. **CMS & Static Pages**: Live editor for About Us, Contact Details, FAQ accordions, Terms, and Privacy Policies.
12. **Promotional Banners**: Campaign manager with date scheduling and city-targeted banners.
13. **Notifications Center**: Instant alerts for new bookings, enquiries, flags, and payments.
14. **Team & Permissions**: Invite team members and customize 13 individual granular capabilities.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Framework**: React 18 with Vite 5 (Fast HMR)
- **Styling**: TailwindCSS with custom design system and dark theme support
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives, animated slide-over modals, responsive tables, and custom badges
- **State Management**: React Context API (`AppContext`) with persistent session storage

### **Backend**
- **Runtime**: Node.js (ES Modules `import/export`)
- **Web Framework**: Express.js
- **Data Layer**: Decoupled JSON Data Store with Repository pattern (easily swappable with MongoDB / Mongoose / PostgreSQL)
- **Security & Utilities**: CORS, UUIDv4, Dotenv

---

## 📂 Directory Structure

```text
AdminPG/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   ├── seedData.js        # Initial test fixtures & seed data
│   │   │   └── store.json         # Active JSON persistence store
│   │   ├── routes/
│   │   │   ├── banners.js         # Banner management endpoints
│   │   │   ├── cms.js             # CMS & FAQ endpoints
│   │   │   ├── customers.js       # Customer registry endpoints
│   │   │   ├── enquiries.js       # Lead & enquiry endpoints
│   │   │   ├── facilities.js      # Amenity catalog endpoints
│   │   │   ├── locations.js       # Geo hierarchy endpoints
│   │   │   ├── notifications.js   # Notification alerts
│   │   │   ├── payments.js        # Transaction history
│   │   │   ├── properties.js      # PG CRUD & filters
│   │   │   ├── reports.js         # Flagged listing moderation
│   │   │   ├── stats.js           # Dashboard metrics
│   │   │   └── users.js           # Auth (Login/Register) & RBAC
│   │   ├── services/
│   │   │   └── store.js           # Asynchronous File Store Driver
│   │   └── index.js               # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/                    # Logos, background imagery & static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Badges, Modals, StatCards, Toasts
│   │   │   ├── forms/             # PG Add/Edit modal & room dynamic forms
│   │   │   ├── layout/            # Sidebar, Header, Mobile Nav
│   │   │   └── ui/                # UI widgets & auth switches
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Global authentication & data context
│   │   ├── pages/                 # 14 Admin Pages + Seeker Portal + Login
│   │   ├── services/
│   │   │   └── api.js             # Centralized frontend API client
│   │   ├── App.jsx                # Router & role conditional view renderer
│   │   └── main.jsx               # React DOM root
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── package.json                   # Root orchestrator (Concurrently dev runner)
└── README.md
```

---

## ⚡ Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) version `18.x` or higher
- [npm](https://www.npmjs.com/) version `9.x` or higher

### 1. Clone & Install Dependencies

You can install dependencies across both frontend and backend using the root build script:

```bash
# Install root dependencies
npm install

# Install both frontend and backend dependencies
npm run build
```

Or install them individually:
```bash
# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..
```

---

## 💻 Available Scripts

Run commands from the root directory:

| Command | Action |
|---|---|
| `npm run dev` | **Runs both Frontend & Backend concurrently** (Default Development mode) |
| `npm run backend` | Starts the Express API server on `http://localhost:5001` with auto-reload |
| `npm run frontend` | Starts the Vite React frontend on `http://localhost:3000` |
| `npm run build` | Builds the frontend production bundle and installs dependencies |
| `npm run start` | Runs the backend production entry point |

### Service URLs
- 💻 **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- 🚀 **Backend API Server**: [http://localhost:5001](http://localhost:5001)
- 🩺 **Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and uptime |
| `POST` | `/api/users/login` | Universal Login (Admin, Staff, Customer) |
| `POST` | `/api/users/register` | Customer / Seeker registration |
| `GET/POST` | `/api/properties` | Fetch list / Create new PG listing |
| `PUT/DELETE` | `/api/properties/:id` | Update / Remove PG listing |
| `GET` | `/api/stats` | Dashboard aggregated analytics |
| `GET/POST` | `/api/locations` | Geo hierarchy retrieval / updates |
| `GET/POST` | `/api/facilities` | Amenities catalog management |
| `GET/POST` | `/api/enquiries` | Customer lead submissions & status |
| `GET/POST` | `/api/reports` | Listing issue flags & moderation |
| `GET/POST` | `/api/payments` | Payment unlocks & revenue logs |
| `GET/PUT` | `/api/cms` | Content pages & FAQ data |
| `GET/POST` | `/api/banners` | Marketing promotional banners |
| `GET` | `/api/notifications` | Admin alerts & notifications |
| `GET/POST/PUT`| `/api/users` | Admin user accounts & permission toggles |

---

## 💰 Monetization Model

KeralaPG implements a **Direct Owner Connect Fee (₹19)**:
- Users browse verified PGs without commission fees.
- A nominal ₹19 unlock fee prevents spam and telemarketers while connecting genuine tenants directly to PG managers.
- Admin dashboard provides real-time tracking of unlocked leads and transaction gateways (Razorpay, UPI, PhonePe, GPay).

---

## 📄 License
This project is private and proprietary to **KeralaPG.com**. All rights reserved.
