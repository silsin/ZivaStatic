# Static IP VPN SaaS Platform

A platform where users purchase a dedicated static IP VPN on a Hetzner Cloud server of their choice. After payment, the server is provisioned automatically and VPN configurations for four protocols are generated and made available for download.

---

## Architecture

| Layer | Technology |
|---|---|
| Backend | Python FastAPI + SQLAlchemy (async) + Alembic |
| Frontend | React (Vite) + Tailwind CSS |
| Database | PostgreSQL 15 |
| Task Queue | Celery + Redis |
| Payments | Stripe Checkout |
| Server Provisioning | Hetzner Cloud API (`hcloud`) |
| VPN Protocols | OpenVPN, WireGuard, IKEv2/StrongSwan, V2Ray |

---

## Setup

### Prerequisites

- Docker and Docker Compose
- A [Hetzner Cloud](https://console.hetzner.cloud/) account with an API token
- A [Stripe](https://dashboard.stripe.com/) account with a secret key, webhook secret, and a price ID

### Steps

**1. Clone the repository**

```bash
git clone <repo-url>
cd static-ip-vpn
```

**2. Copy the example environment file**

```bash
cp .env.example .env
```

**3. Fill in the required values in `.env`**

| Variable | Where to get it |
|---|---|
| `HETZNER_API_TOKEN` | Hetzner Cloud Console → Security → API Tokens |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks (see local dev note below) |
| `STRIPE_PRICE_ID` | Create a recurring product at $9.99/mo in the Stripe Dashboard |
| `SECRET_KEY` | Any random string of 32+ characters |

**4. Start all services**

```bash
docker-compose up --build
```

**5. Run database migrations** (in a separate terminal)

```bash
docker-compose exec backend alembic upgrade head
```

**6. Access the platform**

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Interactive API Docs | http://localhost:8000/docs |

### Local Stripe Webhook Setup

Stripe cannot reach `localhost` directly. Use the Stripe CLI to forward events:

```bash
stripe listen --forward-to http://localhost:8000/api/v1/webhooks/stripe
```

Copy the webhook signing secret printed by that command and set it as `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## User Flow

1. **Register / Login** at the frontend.
2. Go to the **Order** page, select a Hetzner datacenter location, and click **Buy Now**.
3. Complete payment on the Stripe Checkout page.
4. You are redirected to the **Dashboard** — your server shows status `provisioning`.
5. Wait approximately 5 minutes for automatic server setup and VPN configuration.
6. Click the server card to open the detail page and download VPN configs for **OpenVPN**, **WireGuard**, **IKEv2**, or **V2Ray**.

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new account; returns a JWT |
| `POST` | `/auth/login` | No | Log in with email + password; returns a JWT |
| `GET` | `/auth/me` | Yes | Return the current user's profile |

### Locations — `/locations`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/locations/` | No | List all available Hetzner datacenter locations |

### Subscriptions — `/subscriptions`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/subscriptions/` | Yes | Create a pending subscription and return a Stripe Checkout URL |
| `GET` | `/subscriptions/` | Yes | List the current user's subscriptions |
| `DELETE` | `/subscriptions/{id}` | Yes | Cancel a subscription (cancels on Stripe too) |

### Servers — `/servers`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/servers/` | Yes | List the current user's servers |
| `GET` | `/servers/{server_id}` | Yes | Get details for a specific server |

### VPN Configs — `/vpn-configs`

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/vpn-configs/{server_id}` | Yes | List all VPN configs available for a server |
| `GET` | `/vpn-configs/{server_id}/{protocol}` | Yes | Download a config file (`openvpn`, `wireguard`, `ikev2`, `v2ray`) |
| `GET` | `/vpn-configs/{server_id}/{protocol}/qr` | Yes | Download a QR-code PNG of a config |

### Webhooks — `/webhooks`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/webhooks/stripe` | Stripe signature | Receive Stripe events; triggers server provisioning on `checkout.session.completed` |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Async PostgreSQL connection string (`postgresql+asyncpg://...`) |
| `REDIS_URL` | Yes | Redis connection string (`redis://...`) |
| `SECRET_KEY` | Yes | JWT signing secret — use a random 32+ character string |
| `HETZNER_API_TOKEN` | Yes | Hetzner Cloud API token used to create and manage servers |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_PRICE_ID` | Yes | Stripe Price ID for the recurring VPN subscription product |
| `FRONTEND_URL` | Yes | Base URL of the frontend (used for CORS and Stripe redirect URLs) |

---

## Project Structure

```
static-ip-vpn/
├── .env.example                    # Template for required environment variables
├── docker-compose.yml              # Orchestrates all five services
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py                  # Async Alembic migration runner
│   │   └── versions/               # Auto-generated migration scripts
│   └── app/
│       ├── main.py                 # FastAPI application entry point
│       ├── config.py               # Settings loaded from environment
│       ├── database.py             # Async SQLAlchemy engine + session factory
│       ├── api/
│       │   ├── deps.py             # Shared dependencies (get_current_user)
│       │   └── v1/
│       │       ├── router.py       # Mounts all v1 sub-routers
│       │       ├── auth.py         # Register / login / me
│       │       ├── locations.py    # Hetzner location listing
│       │       ├── subscriptions.py# Subscription + Stripe checkout
│       │       ├── servers.py      # Server listing + detail
│       │       ├── vpn_configs.py  # Config download + QR code
│       │       └── webhooks.py     # Stripe webhook handler + provisioning trigger
│       ├── models/
│       │   ├── __init__.py         # Exports Base and all models
│       │   ├── user.py
│       │   ├── subscription.py
│       │   ├── server.py
│       │   └── vpn_config.py
│       ├── schemas/
│       │   ├── user.py
│       │   ├── subscription.py
│       │   ├── server.py
│       │   └── vpn_config.py
│       ├── services/
│       │   ├── hetzner.py          # Hetzner Cloud API client
│       │   ├── stripe_service.py   # Stripe session creation + webhook verification
│       │   ├── provisioning.py     # SSH-based server setup orchestrator
│       │   └── vpn/
│       │       ├── openvpn.py
│       │       ├── wireguard.py
│       │       ├── ikev2.py
│       │       └── v2ray.py
│       ├── tasks/
│       │   └── provision_server.py # Celery task — sync DB session + provisioning call
│       └── utils/
│           └── security.py         # Password hashing + JWT creation/verification
│
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── api/
│       │   └── client.js           # Axios instance with JWT interceptor
│       ├── store/
│       │   └── authStore.js        # Zustand auth state
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── LocationCard.jsx
│       │   ├── ServerCard.jsx
│       │   └── VpnConfigCard.jsx
│       └── pages/
│           ├── LandingPage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── OrderPage.jsx
│           ├── DashboardPage.jsx
│           └── ServerDetailPage.jsx
│
└── backend/scripts/                # Shell scripts uploaded to servers during provisioning
    ├── setup_openvpn.sh
    ├── setup_wireguard.sh
    ├── setup_ikev2.sh
    └── setup_v2ray.sh
```
