# ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972)
## Gharowa Hotel & Restaurant — Complete Full-Stack Website + ERP / POS / Kitchen Display System

A production-ready, full-stack Bangladeshi luxury restaurant platform and management ecosystem built for the iconic **Gharowa Hotel & Restaurant (Since 1972)** located in Motijheel C/A, Dhaka.

---

## 🏛️ Brand Heritage & Features

- **Heritage**: 50+ Years of Authentic Culinary Excellence (Established 1972)
- **Flagship Location**: 9/C Motijheel C/A, Dhaka-1000 (Next to Motijheel Metro Station & Shapla Chottor)
- **Phone**: ০১৯৭৩২৫৫৮৮৮
- **Signature Dishes**: খাসির ভুনা খিচুড়ি, খাসির লেগ খিচুড়ি, স্পেশাল খাসির কাচ্চি, খাসির পায়া নেহারী, স্পেশাল সরিষা ইলিশ, রূপচাঁদা ফ্রাই, চিকেন বটি কাবাব, স্পেশাল বোরহানি, স্পেশাল ফিরনি.

---

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS (Obsidian Black `#0A0A0C`, Amber Gold `#F59E0B`, Glassmorphic Cards)
- **3D Graphics**: Three.js + React Three Fiber + Drei (Interactive 3D Khichuri Hero Platter)
- **State Management**: Zustand (Persistent LocalStorage Cart & Auth)
- **Realtime**: Socket.IO Client
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas / Mongoose (with fallback)
- **Authentication**: JWT & Secure HTTP-only cookies (Role-based: `super_admin`, `manager`, `cashier`, `kitchen_staff`)
- **Realtime Server**: Socket.IO (`admin`, `kitchen`, `order:<orderId>` rooms)
- **Security**: Helmet, CORS, Rate Limiting, Zod Request Validation, Server-side Price Re-verification

---

## 🔄 Dynamic WhatsApp Order Flow

1. Customer selects dishes and adds to Cart.
2. Applies promo coupons (e.g. `GH1972` or `MOTIJHEEL50`).
3. Enters delivery details & payment method (`Cash on Delivery`, `bKash`, `Nagad`).
4. Frontend sends payload to `POST /api/orders`.
5. Backend verifies menu prices against MongoDB, calculates delivery fee, saves order with unique tracking code `GH-XXXX`, and notifies Kitchen Screen in real-time via Socket.IO.
6. System generates formatted Bengali WhatsApp order message and redirects customer directly to `https://wa.me/8801973255888?text=...`.

---

## 🛠️ Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds iconic menu, admin accounts, and restaurant settings
npm run dev      # Starts Express + Socket.IO server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Next.js App on http://localhost:3000
```

---

## 🔐 Default Credentials

- **Admin Login Portal**: `http://localhost:3000/admin/login`
  - **Email**: `admin@gharowa.com`
  - **Password**: `Admin@Gharowa1972`
- **Kitchen Staff Demo**:
  - **Email**: `kitchen@gharowa.com`
  - **Password**: `Kitchen@Gharowa1972`

---

## 📱 Core Pages & Routes

- `/` — Cinematic 3D Hero, Heritage Timeline, Bestsellers, Reviews
- `/menu` — Live search, category tabs, spice meters, Add-to-Cart & WhatsApp CTA
- `/offers` — Active coupons & corporate lunch combo vouchers
- `/about` — 1972 Motijheel heritage story & kitchen hygiene values
- `/gallery` — Masonry photo gallery with category filter & lightbox modal
- `/locations` — 9/C Motijheel location guide, Metro Rail directions & maps
- `/contact` — Table reservation system & corporate catering inquiries
- `/admin/dashboard` — Live POS overview, revenue metrics & sales trend charts
- `/admin/orders` — Order POS, status manager & printable thermal receipts
- `/admin/kitchen` — Touch-friendly Kanban KDS (`Pending` -> `Cooking` -> `Ready`)
- `/admin/menu` — Menu Item & Category manager
- `/admin/inventory` — Stock levels, low-stock warning & adjustment logs
- `/admin/reservations` — Table bookings manager
- `/admin/customers` — Customer directory with lifetime value (LTV)
- `/admin/coupons` — Coupon code builder
- `/admin/reports` — Financial breakdown & top dish analytics
- `/admin/settings` — Live restaurant phone, WhatsApp and delivery configuration
