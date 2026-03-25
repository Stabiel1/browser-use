# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This repo contains two products:

1. **Real-Time Speech Avatar** (`index.html`) — A self-contained HTML5/Canvas/JavaScript client-side application. No build step. Serve with any HTTP server (e.g. `python3 -m http.server 8080`).
2. **Browser-Use WebUI** (`app/`) — A Python/Gradio web app cloned from [browser-use/web-ui](https://github.com/browser-use/web-ui). It controls a browser via Playwright and uses LLMs (Ollama, OpenAI, etc.) as the AI reasoning backend. Run with `python webui.py` inside `app/` after activating the venv.

The Pinokio scripts (`install.js`, `start.js`, `pinokio.js`, etc.) are orchestration wrappers for the Pinokio app launcher. They are not needed when running services manually.

### Running the Speech Avatar (index.html)

```bash
cd /workspace && python3 -m http.server 8080
```

Open `http://localhost:8080/index.html` in Chrome. Speech recognition requires microphone permissions (unavailable in headless environments; the app falls back gracefully).

### Running the Browser-Use WebUI (app/)

Prerequisites (once network allows pip/PyPI access):

```bash
# Clone if app/ is empty
[ -d app/.git ] || git clone https://github.com/browser-use/web-ui app

# Create venv & install deps
cd /workspace/app
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
playwright install --with-deps chromium

# Copy env template
cp .env.example .env  # then configure API keys as needed

# Run the WebUI
python webui.py --ip 127.0.0.1 --port 7788
```

The Gradio WebUI will print an HTTP URL when ready (e.g. `http://127.0.0.1:7788`).

### Network restrictions

- PyPI (`pypi.org`, `files.pythonhosted.org`) and npm (`registry.npmjs.org`) are blocked at the TLS layer in the Cloud Agent sandbox.
- GitHub (`github.com`) is reachable — git clone/pull works.
- To install Python dependencies, the user must add `pypi.org` and `files.pythonhosted.org` to the Cloud Agent Network Access allowlist.

### Lint / Test / Build

- No linter, test framework, or build system is configured in the root project. The `index.html` is a standalone file.
- The `app/` (browser-use/web-ui) repo has a `tests/` directory with its own test suite; run with `pytest` from within the activated venv.
- There is no TypeScript, no `package.json`, no Node.js dependency at the project root.

### Gotchas

- The `app/` directory is expected to be empty on first clone of this repo; `install.js` clones `browser-use/web-ui` into it.
- The `install.js` script references `python 3.11` via Pinokio's `venv_python: "3.11"`, but Python 3.12 also works.
- `_ENVIRONMENT` is a template for environment variables used by the Pinokio launcher, not a `.env` for the WebUI. The WebUI uses `app/.env`.
