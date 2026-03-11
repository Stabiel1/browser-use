# AGENTS.md

## Cursor Cloud specific instructions

### Project overview
This is a Pinokio-based launcher that bundles two main products:
1. **Browser-Use WebUI** (`app/`) — A Python/Gradio web app for AI-powered browser automation (cloned from `github.com/browser-use/web-ui`).
2. **Real-Time Speech Avatar** (`index.html`) — A standalone client-side HTML5/Canvas/JS app.

The Pinokio scripts (`install.js`, `start.js`, etc.) are the orchestration layer for end-user setup. For development, replicate the steps manually as described below.

### Key setup notes
- The `app/` directory is **not committed** — it is cloned at install time from `https://github.com/browser-use/web-ui`. If it is empty, run: `git clone https://github.com/browser-use/web-ui app`
- Python 3.11 is required. Install via `uv python install 3.11` if not present.
- The virtual environment lives at `app/env/`. Activate with `source app/env/bin/activate`.
- Dependencies are installed with `uv pip install -r app/requirements.txt` (inside the venv).
- Playwright's bundled Chromium download may fail due to network restrictions. The VM has **Google Chrome 145** pre-installed at `/usr/bin/google-chrome-stable`. Set `BROWSER_PATH=/usr/bin/google-chrome-stable` in `app/.env` to use it.
- `app/.env` is copied from `app/.env.example`. The `BROWSER_PATH` must be set for browser automation to work.

### Running services
- **Browser-Use WebUI**: `cd app && source env/bin/activate && python webui.py --ip 0.0.0.0 --port 7788` (Gradio UI at http://localhost:7788)
- **Speech Avatar**: Serve the repo root with any HTTP server, e.g. `python3 -m http.server 8080` — then open http://localhost:8080/index.html

### Linting
- `ruff` is installed as a dependency. Run `ruff check src/` from the `app/` directory.

### Tests
- Tests in `app/tests/` are integration tests requiring API keys (OpenAI, Azure, etc.) and/or external services (Ollama). They cannot be run without credentials.

### Gotchas
- Ollama is optional for the WebUI to start, but required for local LLM inference. Cloud LLM providers (OpenAI, Anthropic, etc.) are alternatives.
- The `.env` file uses `BROWSER_PATH` (not `CHROME_PATH`) for the browser binary.
- The Gradio server prints the URL to stdout matching the pattern `http://[0-9.:]+`.
