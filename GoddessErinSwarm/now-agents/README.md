# Agents / swarm notes

**OpenClaw** provides the gateway, tools, and multi-session routing for a persistent agent plane. **Open WebUI** is the chat surface for local models via Ollama. **Cursor** (on your workstation) edits this repo and can call the same HTTP APIs the agents use.

## Wiring TTS into an agent flow

1. Ensure `foxcpm2-tts` is up (`http://localhost:8890`).
2. From any tool or script running on the host or in another container on the same Docker network, `POST http://foxcpm2-tts:8890/v1/tts` with JSON `{"text":"..."}` (optional `voice_description`) and write the returned WAV to disk or stream to your player.
3. Keep **voice-design text** and any explicit persona copy in **private** `.env` or local-only config — do not commit.

## OpenClaw onboarding

After the gateway is healthy on port **18789**, use the upstream docs for `openclaw onboard`, pairing, and channel setup. Treat the gateway as **trusted-network only** unless you add TLS and auth in front of it.
