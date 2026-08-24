# ARCHON Session Labs — FINAL

This is the consolidated final project package.

## Structure

- `frontend/` — Next.js ARCHON UI and API client
- `backend/` — FastAPI backend, Redis temporary-state layer, security middleware and tests
- `deploy/` — Supervisor configuration
- `nginx/` — Nginx reverse-proxy configuration
- `.env.example` — backend environment template
- `TEST_REPORT.md` — Phase 4 test/audit report

## Local setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Redis must be running locally.

### Frontend

In another terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://127.0.0.1:3000`.

## Important security boundary

The current final package intentionally does **not** implement a server endpoint
that collects Telegram OTP/2FA credentials and exports a reusable Telegram
bearer session credential. The Telegram integration remains an isolated,
disabled boundary.

Never put real Telegram credentials, OTPs, 2FA passwords, session strings,
API hashes, or private keys into logs, GitHub, `.env` committed to Git, or
client-side storage.

## Production

Use HTTPS, a restricted CORS origin, Redis authentication/network isolation,
secret management, Nginx, and Supervisor/systemd. Review the deployment
configuration before exposing the service publicly.
