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
