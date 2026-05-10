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
# Agent instructions

This file is for automated coding agents and contributors who need a fast map of the repo and how to work in it safely.

## What this repository is

- **Root**: Product docs and task guides (for example `README.md`, `AGENT_TRAINING_GUIDE.md`, various `*_TASK*.md` files).
- **`app/`**: The runnable Python application — a **Gradio Web UI** on top of **browser-use**, **deep research**, and related tooling (`langchain`, `langgraph`, optional MCP).

Agents should treat **`app/` as the primary codebase** for code changes.

## Layout (`app/`)

| Area | Path |
|------|------|
| Web UI entry | `webui.py` |
| UI composition | `src/webui/` (`interface.py`, `webui_manager.py`, `components/`) |
| Agent implementations | `src/agent/browser_use/`, `src/agent/deep_research/` |
| Browser / controller | `src/browser/`, `src/controller/` |
| LLM and helpers | `src/utils/` (`llm_provider.py`, `config.py`, `mcp_client.py`, …) |
| Tests | `tests/` |
| Dependencies | `requirements.txt` |
| Container | `Dockerfile` |
| CI (Docker image) | `.github/workflows/build.yml` |

## Environment and secrets

1. Copy `app/.env.example` to `app/.env` and fill in keys for the providers you use.
2. **Never commit** `.env` or real API keys. `.env.example` is the template only.
3. LLM routing and keys are driven by env vars (see `DEFAULT_LLM` and provider keys in `.env.example`). Browser-related vars (CDP, VNC, resolution) are also there.

## Setup (local)

From the `app/` directory:

```bash
pip install -r requirements.txt
# optional: pip install pytest ruff  # for tests / lint if not already present
cp .env.example .env   # then edit .env
```

Python **3.11** matches the `Dockerfile`; the host may use another 3.x — prefer 3.11 when possible.

## Run the Web UI

From `app/`:

```bash
python3 webui.py --ip 127.0.0.1 --port 7788
```

Use `--theme` with a name from `theme_map` in `src/webui/interface.py` (default theme is `Ocean`).

## Tests

From `app/` (with `pytest` installed):

```bash
python3 -m pytest tests/ -q
```

Many tests call live LLMs, browsers, or MCP endpoints and **require valid credentials or services**. If a test fails in CI-light environments, check whether the failure is missing config vs. a real regression.
 
## Style and quality

- **Ruff** is configured as the default formatter in `app/.vscode/settings.json`. Prefer Ruff-compatible style when editing Python.
- Match existing patterns in `src/` (imports, naming, Gradio component structure).
- Keep changes scoped: avoid unrelated refactors and do not remove existing comments unless they are wrong.

## Docker / CI

Pushes to `main` trigger a multi-arch **Docker image** build (see `app/.github/workflows/build.yml`). Image build correctness matters for releases; local Python changes should still be validated with tests where feasible.

## Further reading

- **`AGENT_TRAINING_GUIDE.md`**: Training and task-execution notes for long-running agent workflows (not application runtime docs).

When in doubt, search under `app/src/` for the feature (e.g. `BrowserUseAgent`, `DeepResearchAgent`, Gradio tabs) before adding new modules.

## Cursor Cloud specific instructions

### app/ directory bootstrapping

The `app/` directory is **not checked in** to this repo. It is populated at setup time by cloning the upstream [browser-use/web-ui](https://github.com/browser-use/web-ui) repository (see `install.js`). The update script handles this automatically. Do not assume `app/` contents exist at commit time — they are runtime-only.

### Python version

The Dockerfile targets Python 3.11, but the Cloud VM ships Python 3.12. This works fine with one caveat: `setuptools` must be explicitly installed because Python 3.12 removed `distutils` (used by `browser_settings_tab.py`). The update script already covers this.

### Playwright / browser

Playwright CDN downloads are blocked by network egress restrictions in Cloud VMs. However, Google Chrome is pre-installed at `/usr/local/bin/google-chrome`. The app's `channel='chromium'` launch mode in `src/browser/custom_browser.py` will auto-detect system Chrome, so no extra config is needed. Set `BROWSER_PATH` in `app/.env` only if you need to override the default.

### Running the Web UI

```bash
source /workspace/app/env/bin/activate
cd /workspace/app
python3 webui.py --ip 0.0.0.0 --port 7788
```

The UI will be available at `http://localhost:7788`.

### Lint and tests

```bash
cd /workspace/app && source env/bin/activate
ruff check .                     # lint
python3 -m pytest tests/ -q      # tests (require live LLM keys + browser)
```

All 18 tests require live LLM API keys and/or running services (Ollama, MCP servers). They will fail without credentials — this is expected, not a regression.

### Environment variables

Copy `app/.env.example` → `app/.env` and set at least one LLM provider API key (e.g. `OPENAI_API_KEY`, `GOOGLE_API_KEY`) to enable agent functionality. Without any key, the UI loads but agent runs will error.
