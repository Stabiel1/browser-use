# GoddessErinSwarm

Private local stack that combines **Open WebUI** (CUDA) + **Ollama**, **OpenClaw** (gateway and computer-control plane), optional **Tabby**, and a small **VoxCPM2** TTS HTTP service from OpenBMB. **FoxCPM2 = VoxCPM2** is only an informal alias—this repo uses the **VoxCPM2** name everywhere.

## Repository privacy (GitHub)

1. On GitHub, click **New repository**.
2. Name it **`GoddessErinSwarm`**, choose **Private**, create the empty repo.
3. From this folder on your machine:

   ```bash
   cd GoddessErinSwarm
   git init
   git remote add origin git@github.com:<your-user>/GoddessErinSwarm.git
   git add .
   git commit -m "Initial GoddessErinSwarm stack"
   git push -u origin main
   ```

Never commit `.env`, API keys, downloaded model weights, voice clones, or chat logs.

## Layout

| Path | Role |
|------|------|
| `docker-compose.yml` | GPU stack: Ollama, Open WebUI (CUDA), OpenClaw, **VoxCPM2** TTS; optional Tabby via profile |
| `docker-compose.cpu.yml` | CPU-only Ollama + Open WebUI + OpenClaw (no TTS image) |
| `now-docker/VoxCPM2/` | Dockerfile + FastAPI server for `/v1/tts` |
| `now-open-web-live/` | Notes for Open WebUI |
| `now-tabby/` | Optional Tabby profile |
| `now-openclaw/` | OpenClaw volume and port notes |
| `now-agents/` | How agents call TTS and relate to Cursor |

## Quick start (NVIDIA)

Prerequisites: [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) and a driver compatible with **CUDA 12.6** runtime images (the TTS image uses `pytorch/pytorch:2.11.0-cuda12.6-cudnn9-runtime`).

```bash
cp .env.example .env
# Set OPENCLAW_GATEWAY_TOKEN to a long random string; optional HUGGING_FACE_HUB_TOKEN
docker compose up -d --build
```

Default URLs:

- Open WebUI: http://localhost:3000  
- Ollama: http://localhost:11434  
- OpenClaw gateway: http://localhost:18789  
- TTS OpenAPI: http://localhost:8890/docs  

Optional Tabby:

```bash
docker compose --profile tabby up -d
```

(Tabby defaults to http://localhost:8088.)

## VoxCPM2 voice — step-by-step

**Goal:** any agent or script can turn model output into speech via one HTTP call, using **voice design** (text-only description) so you do not need reference audio.

1. **Define the voice in `.env` (private)**  
   Set `GODDESS_AURA_VOICE` to a short, natural-language description. VoxCPM2 expects this as a prefix in parentheses before the spoken line; the server adds parentheses if you omit them.  
   Example shape (keep your own wording local): *adult female, warm, confident, steady pace* — store only in `.env`, not in git.

2. **Start the TTS container**  
   With `docker compose up`, the **`voxcpm2-tts`** service builds from `now-docker/VoxCPM2` and downloads **`VOXCPM_MODEL_ID`** (default `openbmb/VoxCPM2`) into the `huggingface_cache` volume on first run. Expect several GB and a few minutes.

3. **Test synthesis**

   ```bash
   curl -sS "http://localhost:8890/v1/tts?text=Hello%20from%20the%20swarm" -o /tmp/goddess.wav
   ```

   Or `POST /v1/tts` with JSON:

   ```json
   {
     "text": "Your line here.",
     "cfg_value": 2.0,
     "inference_timesteps": 10,
     "streaming": false
   }
   ```

4. **Call from agents**  
   After a turn completes, POST the **assistant reply text** to `http://voxcpm2-tts:8890/v1/tts` (same Docker network) or `http://localhost:8890` from the host. Play the WAV with your preferred player or pipe to your voice channel.  
   Override the voice for one-off lines with JSON field `voice_description` (still description-only; no audio upload required).

5. **Open WebUI**  
   Use the UI for chat; wire TTS from a small sidecar script or an OpenClaw skill that hits this API. Keep provider keys inside Open WebUI settings or `.env`, not in the repo.

6. **Safety and consent**  
   Use synthetic voices responsibly; label AI-generated audio where required. Do not use cloning or persona features to impersonate real people without permission.

## Cursor

Open this repository in Cursor on your workstation. Agents and Compose services expose HTTP ports on `localhost` for iteration; treat secrets as **local-only** files ignored by git.

## License

Configuration and glue code in this folder are provided for your private use. Upstream projects (Open WebUI, Ollama, OpenClaw, Tabby, VoxCPM2) have their own licenses — check each upstream when redistributing.
