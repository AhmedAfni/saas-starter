# Multi-Tenant SaaS Starter (Laravel 12 + React Inertia)

A modern, production-ready multi-tenant SaaS starter kit built on Laravel 12, Inertia.js (React), Tailwind CSS, and Laravel Cashier (Stripe). It features robust team tenancy, role-based authorization, invitation management, team-scoped billing, hosted invoice receipts, and transaction-safe Stripe webhooks.

---

## Features

- **Multi-Tenant Architecture**: Single shared database with automatic Eloquent global scope isolation per team (`BelongsToTeam`).
- **Team Management & Switching**: Users can create, switch between, and belong to multiple teams with a sticky `current_team_id` session context.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions stored on the `team_user` pivot table:
  - **Owner**: Full control over team settings, member roles, subscription billing, and invoice downloads.
  - **Admin**: Invites members, assigns roles, and manages team projects.
  - **Member**: Accesses and creates team projects with read-only visibility into team administration.
- **Secure Email Invitations**: 7-day token-based invitation links with email verification protection and single-use safeguards.
- **Team-Based Stripe Subscriptions**:
  - Cashier configured at the team level (`Cashier::useCustomerModel(Team::class)`).
  - Stripe Checkout integration for Pro tier upgrades.
  - Customer Billing Portal redirection for card updates and cancellations.
  - **Seat Enforcement**: Free tier capped at 3 seats (active members + pending invitations); unlimited seats for subscribed teams.
- **Invoices & Receipts**: Dedicated owner view for Stripe invoice history and hosted PDF receipts.
- **Transaction-Safe Webhooks**: Idempotent webhook handling with unique event recording and full rollback on processing failure.
- **Automated Pest Feature Test Suite**: 52 tests covering tenancy isolation, roles, billing gates, and webhooks.

---

## Architecture

```
                       ┌─────────────────────────┐
                       │   Incoming HTTP Request │
                       └────────────┬────────────┘
                                    │
                                    ▼
                ┌───────────────────────────────────────┐
                │        Team Context Middleware        │
                │     (Resolves user->currentTeam)      │
                └───────────────────┬───────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│ Team Scoping │             │ Authorization│             │ Team Billing │
│Global Scope: │             │TeamPolicy &  │             │Cashier Team  │
│team_id check │             │ProjectPolicy │             │Customer Model│
└──────┬───────┘             └──────┬───────┘             └──────┬───────┘
       │                            │                            │
       └────────────────────────────┼────────────────────────────┘
                                    ▼
                      ┌───────────────────────────┐
                      │    Single Database (MySQL)│
                      │ users, teams, team_user,  │
                      │ projects, subscriptions   │
                      └───────────────────────────┘
```

### 1. Single Database with Eloquent Global Scope
All tenant data shares a single database schema. Tenant-owned models (e.g., `Project`) use the `BelongsToTeam` trait:
- Automatically filters all queries with `WHERE team_id = current_team_id`.
- Automatically assigns `team_id` when creating models unless explicitly pre-populated.
- Prevents cross-tenant data leaks across all read/write Eloquent operations.

### 2. Per-Team Roles & Policies
User roles (`owner`, `admin`, `member`) are stored on the `team_user` pivot table:
- A user can be an `owner` of Team A while simultaneously being a plain `member` of Team B.
- Controllers strictly enforce policies via `Gate::authorize()` against the requested `{team}` resource, preventing unauthorized cross-team access.

### 3. Team-Level Subscriptions
- Billing belongs to the `Team`, not individual users: `Cashier::useCustomerModel(Team::class)`.
- Cashier columns (`stripe_id`, `pm_type`, `pm_last_four`, `trial_ends_at`) and foreign keys on `subscriptions` belong to `teams`.
- Free plan enforces a ceiling of 3 seats (counting current users + pending invitations). When subscribed, seat limits are lifted.

### 4. Idempotent & Transaction-Safe Webhooks
- Webhook routes execute without an authenticated user context and resolve customers directly with `Team::withoutGlobalScopes()->where('stripe_id', $stripeId)->first()`.
- Event processing and `webhook_events` database records execute inside a single `DB::transaction()`.
- If an exception occurs, the record is rolled back, allowing Stripe's retry mechanisms to succeed.
- Duplicate event deliveries are caught by unique database constraints and return `200 Webhook Already Processed`.

---

## Setup & Installation (Windows / XAMPP)

### Prerequisites
- **PHP 8.2+** (with `pdo_mysql`, `curl`, `mbstring`, `openssl` enabled)
- **Composer** (latest)
- **Node.js 18+** & **npm**
- **XAMPP** (Apache & MySQL running)

### Step-by-Step Setup

1. **Clone & Navigate to the Project**:
   ```powershell
   cd C:\xampp\htdocs\saas-starter
   ```

2. **Install PHP & JavaScript Dependencies**:
   ```powershell
   composer install
   npm install
   ```

3. **Configure Environment File**:
   Copy the example environment file if `.env` does not exist:
   ```powershell
   copy .env.example .env
   php artisan key:generate
   ```

   Verify your database settings in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=saas_starter
   DB_USERNAME=root
   DB_PASSWORD=

   # Stripe Test Credentials
   STRIPE_KEY=pk_test_your_key_here
   STRIPE_SECRET=sk_test_your_secret_here
   STRIPE_PRICE_ID=price_your_price_id_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

4. **Create MySQL Database**:
   Open phpMyAdmin or run in MySQL shell:
   ```sql
   CREATE DATABASE IF NOT EXISTS saas_starter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Run Migrations & Seed Demo Data**:
   ```powershell
   php artisan migrate:fresh --seed
   ```

6. **Build Frontend Assets**:
   ```powershell
   npm run build
   # or for live HMR development:
   npm run dev
   ```

7. **Start the Development Server**:
   ```powershell
   php artisan serve
   ```
   Visit `http://localhost:8000` in your browser.

---

## Demo Accounts

Running `php artisan migrate:fresh --seed` creates two teams with pre-configured accounts:

| Team | Role | Name | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Acme Corp** | Owner | Alice Owner | `owner@acme.com` | `password` |
| **Acme Corp** | Admin | Bob Admin | `admin@acme.com` | `password` |
| **Acme Corp** | Member | Charlie Member | `member@acme.com` | `password` |
| **Stark Industries** | Owner | Tony Owner | `owner@stark.com` | `password` |
| **Stark Industries** | Admin | Pepper Admin | `admin@stark.com` | `password` |
| **Stark Industries** | Member | Peter Member | `member@stark.com` | `password` |

---

## Testing

Run the automated test suite with Pest:

```powershell
# Run the entire test suite
php artisan test --compact

# Run specific feature test suites
php artisan test --filter=TeamInvoiceTest
php artisan test --filter=TeamSubscriptionTest
php artisan test --filter=TeamInvitationTest
php artisan test --filter=TeamScopeTest
```

Code formatting can be verified and applied using Laravel Pint:
```powershell
vendor/bin/pint --format agent
```

---

## Security & Secrets Policy

- `.env` is explicitly ignored by version control in `.gitignore`.
- No live production credentials or API secrets exist in the git history.
- Webhook signature verification and route-level CSRF exemptions are properly scoped.
- All team management actions are guarded by explicit policies (`TeamPolicy`, `ProjectPolicy`).
