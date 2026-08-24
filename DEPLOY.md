# ARCHON Session Labs — VPS Deployment

## Requirements
Ubuntu VPS, Docker Engine + Compose plugin, TCP 80 open.

## Deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

Then open `http://YOUR_VPS_IP/`.

## Check
```bash
docker compose ps
docker compose logs --tail=100 backend
curl http://YOUR_VPS_IP/api/health
```

For a public production domain, configure HTTPS before enabling any authentication-related functionality.

### Credential boundary
This project does not implement server-side Telegram OTP/2FA collection or reusable Telegram session-string export. Sensitive Telegram credentials are not sent to the ARCHON server.
