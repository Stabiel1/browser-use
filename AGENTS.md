# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

This is a Pinokio-orchestrated project containing two products:
1. **Browser-Use Web UI** (`app/`) — A Gradio-based Python web app for AI browser automation, cloned from [browser-use/web-ui](https://github.com/browser-use/web-ui). This is the primary service.
2. **Real-Time Speech Avatar** (`index.html`) — A standalone client-side HTML5 page with no backend dependencies.

The Pinokio scripts (`install.js`, `start.js`, `update.js`, etc.) are orchestration-only and are **not** run directly in this environment. Instead, replicate their steps manually.

### Running the Browser-Use Web UI

```bash
cd /workspace/app
source env/bin/activate
python webui.py --ip 0.0.0.0 --port 7788
```

Access at `http://localhost:7788`. The `--ip 0.0.0.0` flag is needed for the URL to be reachable from the Desktop pane.

### Key caveats

- **Python 3.11 required.** The venv at `app/env/` is pinned to Python 3.11 (installed via `uv python install 3.11`). Do not use the system Python 3.12.
- **Playwright browser download is blocked** by network egress restrictions. The app is configured to use the system-installed Google Chrome (`/usr/bin/google-chrome-stable`) via the `BROWSER_PATH` setting in `app/.env`.
- **No standard pytest suite.** The `app/tests/` directory contains interactive test scripts (requiring user input and external services), not automated pytest tests.
- **Lint:** `ruff` is installed in the venv and can be run with `ruff check src/ webui.py` from `app/`. Pre-existing upstream lint warnings exist (E402, etc.).
- **LLM API keys are required** to actually run browser automation tasks. Without API keys (OpenAI, Anthropic, Ollama, etc.), the Web UI loads and is fully interactive but cannot execute agent tasks.
- **`app/` is a separate git repo** (cloned from GitHub). Changes inside `app/` are tracked by its own `.git`; the parent repo at `/workspace` tracks the Pinokio orchestration layer.
- **uv** is installed at `~/.local/bin/uv`. Ensure `PATH` includes `$HOME/.local/bin`.
