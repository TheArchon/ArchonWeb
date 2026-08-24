#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v docker >/dev/null 2>&1 || { echo "Docker is required."; exit 1; }
docker compose up -d --build
docker compose ps
echo "Open http://YOUR_VPS_IP/"
