# OpenClaw

The root `docker-compose.yml` runs the official image `ghcr.io/openclaw/openclaw:2026.4.12-slim` as user `1000:1000` with:

- Config volume: `openclaw_config` → `/home/node/.openclaw`
- Workspace volume: `openclaw_workspace` → `/home/node/workspace`
- **Port** `18789` → gateway / control UI

Set a strong `OPENCLAW_GATEWAY_TOKEN` in `.env` before starting. Do not expose this port to the public internet without a reverse proxy, TLS, and an authentication layer.

Example exec for onboarding (after the container is running):

```bash
docker exec -it ges-openclaw node openclaw.mjs onboard
```

Adjust the container name if you use `docker-compose.cpu.yml` (`ges-openclaw-cpu`).
