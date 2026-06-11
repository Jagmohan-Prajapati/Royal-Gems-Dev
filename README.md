<div align="center">

# Royal Gems

### India's Heritage. The World's Finest Gems.

A luxury gemstone e-commerce platform — India-based, INR currency, heritage Indian modernism aesthetic.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.1-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21.2-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-4169E1?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

## Features

- **Full Gemstone Catalogue** — Browse rubies, emeralds, sapphires, diamonds, pearls, and coral with rich product detail pages
- **OTP-Based Authentication** — Secure email OTP registration and forgot-password flow (no plain-text passwords ever sent)
- **JWT + httpOnly Cookie Auth** — Session management via signed JWT stored in a secure httpOnly cookie
- **Zustand Cart with Persistence** — Cart state persists across page refreshes
- **Checkout with Saved Addresses** — Users manage multiple delivery addresses; select at checkout
- **Paytm Payment Gateway** — INR-denominated payments with server-side signature verification
- **Cloudinary Image Management** — Admin uploads product images; old images are cleaned up automatically
- **Admin Dashboard** — KPI overview, product CRUD, order management with status updates
- **Search Modal** — Live search across product catalogue from any page
- **Policy Pages** — Privacy Policy, Refund Policy, Shipping Policy
- **Fully Responsive** — Desktop (1200px+), tablet (768px), and mobile (375px) layouts

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 19.0.1 |
| Build Tool | Vite | 6.2.3 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | 4.x |
| Animations | Motion (Framer Motion) | 12.23.24 |
| Icons | Lucide React | 0.546.0 |
| Routing | React Router DOM | 7.15.1 |
| State | Zustand | 5.0.13 |
| Backend | Express.js + TypeScript | 4.21.2 |
| ORM | Prisma | 6.19.3 |
| Database | PostgreSQL (Railway) | — |
| Auth | jose (JWT) + bcrypt | 6.2.3 / 6.0.0 |
| Payments | Paytm Gateway (INR) | — |
| Images | Cloudinary SDK v2 | 2.10.0 |
| Email (OTP) | Nodemailer (Gmail) | 8.0.7 |
| Build (server) | esbuild | 0.25.0 |
| Dev runner | tsx | 4.21.0 |
| Language | TypeScript | 5.8.2 |

---

## Project Structure

```
royal-gems/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── App.tsx                # Root component + route definitions
│   ├── main.tsx               # Entry point
│   ├── index.css              # Tailwind v4 + Royal Gems design tokens
│   ├── components/
│   │   ├── Navbar.tsx         # Transparent/solid sticky navbar
│   │   ├── Footer.tsx         # Site footer with policy links
│   │   ├── ProtectedRoute.tsx # AuthRoute + AdminRoute wrappers
│   │   ├── AdminSidebar.tsx   # Admin navigation sidebar
│   │   └── SearchModal.tsx    # Full-overlay search
│   ├── context/
│   │   └── AuthContext.tsx    # useAuth + AuthProvider
│   ├── lib/
│   │   ├── utils.ts           # cn() + formatPrice() for INR
│   │   └── prisma.ts          # getPrisma() singleton
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── Login.tsx
│   │   ├── Account.tsx
│   │   ├── NotFound.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   ├── RefundPolicy.tsx
│   │   ├── ShippingPolicy.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProducts.tsx
│   │   └── AdminOrders.tsx
│   └── store/
│       └── cartStore.ts       # Zustand cart with persist
├── server.ts                  # Express server entry point
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or Railway)
- Cloudinary account
- Paytm merchant account (staging for development)
- Gmail account for OTP emails

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/royal-gems.git
cd royal-gems
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

See the [Environment Variables](#-environment-variables) section below for all required fields.

### 4. Generate Admin Password Hash

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('your_admin_password', 10).then(h => console.log(h))"
```

Paste the output as `ADMIN_PASSWORD_HASH` in your `.env`.

### 5. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 6. Start Development Server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# App
APP_URL="http://localhost:3000"
NODE_ENV="development"

# Database (Railway PostgreSQL or local)
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Auth
JWT_SECRET="your-very-long-random-jwt-secret"

# Admin credentials (NOT stored in DB)
ADMIN_EMAIL="admin@royalgems.com"
ADMIN_PASSWORD_HASH="bcrypt-hash-of-your-admin-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Paytm Payment Gateway
PAYTM_MID="your-paytm-merchant-id"
PAYTM_MERCHANT_KEY="your-paytm-merchant-key"
PAYTM_WEBSITE="WEBSTAGING"           # or DEFAULT for production
PAYTM_ENV="staging"                   # staging | production
PAYTM_CALLBACK_URL="${APP_URL}/api/orders/verify"

# Email (Gmail SMTP for OTP)
EMAIL_USER="royalgems@gmail.com"
EMAIL_PASS="your-gmail-app-password"
```

> **Note:** Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular account password.

---

## 🔐 Authentication Flow

### Registration (OTP-based)
1. User enters email → POST `/api/auth/send-otp` (type: `VERIFY_EMAIL`)
2. OTP delivered to email (6 digits, valid 10 minutes)
3. User submits OTP → POST `/api/auth/verify-otp` → account created + JWT cookie set

### Login
- POST `/api/auth/login` with email + password → JWT cookie set

### Forgot Password
1. POST `/api/auth/forgot-password` → OTP sent (type: `RESET_PASSWORD`)
2. POST `/api/auth/reset-password` with OTP + new password

### Admin Login
- Admin credentials are verified against `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` **env vars only**
- Admin is never stored in the `User` table
- Admin JWT has `role: 'ADMIN'`

---

## 💳 Payment Flow (Paytm)

1. User places order → POST `/api/orders/create`
   - Order record created with status `PENDING` and currency `INR`
   - Paytm transaction initiated, payload returned to frontend
2. Frontend launches Paytm payment
3. Paytm redirects/callbacks → POST `/api/orders/verify`
   - Signature verified server-side
   - On success: order marked as paid, status updated
   - On failure: order remains unpaid

---

## 🛒 Cart Logic

| Subtotal | Shipping |
|---|---|
| ₹0 (empty) | ₹0 |
| Below ₹4,000 | ₹299 |
| ₹4,000 and above | Free |

Cart is persisted to `localStorage` under the key `royalgems-cart` via Zustand persist.

---

## 🔗 API Routes

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Email + password login |
| POST | `/api/auth/logout` | Public | Clear auth cookie |
| POST | `/api/auth/send-otp` | Public | Send VERIFY_EMAIL or RESET_PASSWORD OTP |
| POST | `/api/auth/verify-otp` | Public | Verify OTP + create account |
| POST | `/api/auth/forgot-password` | Public | Initiate password reset |
| POST | `/api/auth/reset-password` | Public | Verify OTP + update password |
| GET | `/api/auth/me` | Auth | Return current user |

### User
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/user/profile` | Auth | Get profile |
| PATCH | `/api/user/profile` | Auth | Update profile |
| PATCH | `/api/user/change-password` | Auth | Change password |
| GET | `/api/user/addresses` | Auth | List addresses |
| POST | `/api/user/addresses` | Auth | Add address |
| PATCH | `/api/user/addresses/:id` | Auth | Update address |
| DELETE | `/api/user/addresses/:id` | Auth | Delete address |

### Products
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | List with filters |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin | Create product |
| PATCH | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/upload` | Admin | Upload image to Cloudinary |

### Orders
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/orders/create` | Auth | Create order + init Paytm |
| POST | `/api/orders/verify` | Auth / Callback | Verify payment + mark paid |
| GET | `/api/orders/my` | Auth | User's orders |
| GET | `/api/orders/:id` | Auth | Single order |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update order status |

---

## 🏗️ Build & Deployment

### Development

```bash
npm run dev         # Run Express + Vite dev server
npm run lint        # TypeScript type check
```

### Production Build

```bash
npm run build       # Vite frontend + esbuild server bundle
npm start           # Run bundled server
```

### Railway Deployment

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Start Command | `npx prisma migrate deploy && npm start` |
| Healthcheck | `/` |

**Hostinger DNS (Custom Domain):**

| Type | Name | Value |
|---|---|---|
| ALIAS | `@` | Railway subdomain |
| CNAME | `www` | Railway subdomain |
| TXT | `_railway-verify` | Railway-provided value |

> Delete any conflicting A records on `@` before adding the ALIAS.

---

## 🗄️ Database Schema Overview

```
User          — id, email, name, phone, passwordHash, role
Product       — id, name, description, price, stoneType, stoneColor, category, origin, weight, imageUrl, featured
Order         — id, userId, status, currency(INR), total, isPaid, paymentRef
OrderItem     — id, orderId, productId, quantity, price
Address       — id, userId, fullName, phone, line1, line2, city, state, pin, country(India), isDefault
OtpCode       — id, email, code, type, expiresAt, used
```

---

## 📜 Scripts Reference

```bash
npm run dev         # tsx server.ts — dev mode with Vite HMR
npm run build       # vite build + esbuild server bundle
npm start           # node dist/server.cjs — production
npm run clean       # rm -rf dist
npm run lint        # tsc --noEmit — type check only
```

---

## 🎨 Design System

Royal Gems uses the **Heritage Luxe** design system:

- **Palette:** Ruby Crimson `#69001b` + Antique Gold `#7e5700` + Deep Ivory `#fff8f6`
- **Typography:** Cormorant SC (headings 24px+) + Jost (body and UI)
- **Shape Language:** Sharp 0px corners — precision-cut like gemstones
- **Spacing:** 80px section padding, 1200px max container, generous editorial whitespace
- **Depth:** Tonal surface layering + 1px hairline gold borders + subtle 5% opacity emboss shadows

---

## 📄 License

This project is proprietary. All rights reserved — Royal Gems.

---

<div align="center">
Built with ♥ in India &nbsp;|&nbsp; Powered by Railway &nbsp;|&nbsp; Secured by Paytm
</div>
