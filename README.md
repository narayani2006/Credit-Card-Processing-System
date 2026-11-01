# PayFlow — Credit Card Processing System

A complete full-stack web application for processing credit card payments, managing transaction lifecycles, issuing refunds, and governing user accounts, built to closely mirror modern fintech UI/UX design specifications.

---

## 🔑 Default Admin Account Credentials

When the application is installed and run for the first time, **ONLY ONE ADMIN ACCOUNT** is seeded into the database. No fake/demo data or sample transactions are inserted.

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@example.com` | `Admin@123` |

> Configurable via environment variables in `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Local daemon running on `mongodb://127.0.0.1:27017`

### Installation & Execution

1. **Install Dependencies** (root, backend, and frontend):
   ```bash
   npm run install:all
   ```

2. **Start Backend & Frontend Concurrently**:
   ```bash
   npm run dev
   ```

3. **Access Application**:
   Open your browser to:
   [http://localhost:5173](http://localhost:5173)

   > **First Page Notice**: Unauthenticated users are automatically redirected to `/login`.

---

## 🛠️ Features & Architecture Overview

- **Authentic Figma UI/UX Design**:
  - Dark navy navigation sidebar (`#0F172A`)
  - Clean light dashboard & table views (`#F8FAFC`, `#FFFFFF`)
  - Purple/indigo primary action buttons (`#4F46E5`)
  - Responsive cards, badges, and modals
- **Authentication & Security**:
  - Single-step Email & Password authentication (No forced 2-step OTP during login)
  - JWT Token authorization header (`Bearer <token>`)
  - Bcrypt password hashing
  - Sensitive credit card data tokenization (only last 4 digits and card brand stored; CVV never stored)
- **Role-Based Access Control (RBAC)**:
  - `admin`: Access to Dashboard, Virtual Terminal, Transactions, Transaction Details, Settings, and **User Management** (`/admin/users`).
  - `user`: Access to standard merchant payment features. Access to Admin-only endpoints/pages is strictly blocked at both frontend and API middleware levels.
  - Self-registered accounts automatically receive `role = "user"`.
- **Empty-State Dashboard**:
  - Starts with zero transactions: Total Volume `$0.00`, Successful `0`, Failed `0`, Refunds `$0.00`.
  - Dynamic empty state visual cards for revenue charts and transaction tables.
- **Virtual Terminal / New Payment**:
  - Interactive payment form with real-time card brand detection (Visa, Mastercard, Amex, Discover).
  - Validates card inputs, computes subtotal and processing fee (2.9% + $0.30), generates mock authorization codes and PayFlow Radar risk scores.
  - Displays instant payment confirmation card with printable/downloadable receipt.
- **Transactions & Lifecycle Management**:
  - Filtering by search query, status (Approved, Pending, Declined, Refunded), card type, and date range.
  - Export transactions to CSV file format.
  - Individual transaction detail view (`/transactions/:id`) featuring payment timelines, card info, customer records, fraud risk meters, and activity audit logs.
  - Full and partial refund processing modal with real-time DB status updates.
- **Admin User Management (`/admin/users`)**:
  - Admin view to manage registered user accounts, toggle active/inactive status, and delete accounts.
  - Protected against deleting or deactivating the primary system administrator account.

---

## 📁 Project Structure

```
credit card/
├── .env
├── .env.example
├── package.json
├── README.md
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── adminOnly.js
│   │   └── auth.js
│   ├── models/
│   │   ├── ApiKey.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── seedAdmin.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── api/
        │   └── axiosClient.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── common/
        │   │   ├── EmptyState.jsx
        │   │   ├── LoadingSpinner.jsx
        │   │   ├── Modal.jsx
        │   │   ├── Sidebar.jsx
        │   │   ├── StatCard.jsx
        │   │   ├── StatusBadge.jsx
        │   │   ├── Toast.jsx
        │   │   └── Topbar.jsx
        │   ├── dashboard/
        │   │   ├── PaymentMethodsChart.jsx
        │   │   └── RevenueChart.jsx
        │   └── transactions/
        │       ├── ReceiptModal.jsx
        │       └── RefundModal.jsx
        └── pages/
            ├── AdminUsersPage.jsx
            ├── DashboardPage.jsx
            ├── LoginPage.jsx
            ├── NewPaymentPage.jsx
            ├── NotFoundPage.jsx
            ├── SettingsPage.jsx
            ├── TransactionDetailsPage.jsx
            └── TransactionsPage.jsx
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/credit_card_system
JWT_SECRET=super_secret_payflow_jwt_key_2026
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
ADMIN_NAME=System Administrator
```

---

## 🧪 Verification & Testing Flow

1. Open `http://localhost:5173` -> Confirm redirect to `/login`.
2. Login with `admin@example.com` / `Admin@123` -> Redirect to `/dashboard`.
3. Verify Dashboard stats are `$0.00` and empty state components display.
4. Go to **New Payment** -> Fill card details (e.g. $100.00, Visa 4242 4242 4242 4242, 12/28, 123) -> Process Payment.
5. Confirm payment success, check updated Dashboard metrics ($100.00 volume, 1 successful payment).
6. Go to **Transactions** -> Click transaction ID -> View details & click **Issue Refund**.
7. Confirm status changes to `Refunded` and refund amount updates on Dashboard.
8. Go to **Sign Up** on Login screen -> Register new account -> Confirm role is `user`.
9. Login as Admin -> Navigate to `/admin/users` -> Verify registered user appears.
