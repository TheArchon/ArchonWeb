# ARCHON Session Labs — Final Run Guide

## 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Redis must be available at the URL configured in `.env`.

## 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Then open:

http://127.0.0.1:3000

## 3. Production

Use the supplied Nginx and Supervisor configs after changing:
- domain name
- filesystem paths
- allowed CORS origin
- production environment variables

Use HTTPS before exposing the application publicly.

## 4. Security

Do not commit:
- `.env`
- Telegram API secrets
- OTPs
- 2FA passwords
- session strings
- `.session` files
