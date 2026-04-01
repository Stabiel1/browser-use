# Agent instructions (browser-use Pinokio recipe)

This repository is a **Pinokio** bundle around **[browser-use/web-ui](https://github.com/browser-use/web-ui)**. The runnable app lives in `app/` (cloned or vendored Web UI). Wrapper scripts, patches, and docs live at the repo root.

## Repository layout

| Path | Role |
|------|------|
| `app/` | Browser-use Web UI (Python / Gradio). Entry: `webui.py`. Config: `app/.env` (from `app/.env.example`; **gitignored**). |
| `patches/webui-block-thread.patch` | Patches `app/webui.py` so Gradio keeps the process alive when not attached to a TTY (`prevent_thread_lock` + `block_thread`). |
| `install.js` / `start.js` / `update.js` / `reset.js` / `restart.js` | Pinokio lifecycle. **Install** and **start** apply the patch from `app/` when the patch file exists. |
| `pinokio.js` / `pinokio.json` | Pinokio metadata and menu. |
| `vr-consent-experience/` | Optional Unity-oriented docs and sample scripts (unrelated to Pinokio runtime). |

## Git workflow

- Work on the branch configured for the task (e.g. `cursor/vr-tpe-experience-a15d`).
- **Commit and push** meaningful units of work; use `git push -u origin <branch-name>`.
- Do **not** commit `app/.env` or other secrets. The parent repo may record `app` as a **gitlink** (submodule-style); pushing changes **inside** `app/` requires permission to that remote (often upstream `browser-use/web-ui`).

## Critical: `start.js` URL capture regex

Pinokio **start** waits for Gradio to print a local URL, then sets `local.url` for the **Open Web UI** menu item.

In `start.js`, the `on.event` regex **must** stay aligned with what `python webui.py` prints (Gradio typically emits a line like `http://127.0.0.1:7788` or `http://0.0.0.0:7788`).

**Current mandated pattern** (do not change without verifying Pinokio still captures the URL):

```text
/(http:\/\/[0-9.:]+)/
```

If you change Gradio logging, bind address, or port handling, update this regex and test that `local.url` is set and `pinokio.js` can open the tab.

## Patching `webui.py`

- Prefer **`patches/webui-block-thread.patch`** plus `patch -p1 -N` in `install.js` / `start.js` over committing a fork of `web-ui`, unless the project explicitly tracks a fork.
- `-N` avoids failures when the patch is already applied.

## Running and smoke-testing the Web UI

From `app/` with venv active:

```bash
patch -p1 -N -i ../patches/webui-block-thread.patch   # if not using Pinokio start
python webui.py --ip 127.0.0.1 --port 7788
```

Smoke test: HTTP `200` on the chosen port (e.g. `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:7788/`).

## Pull requests

- If a PR template exists in the repo, follow it.
- Describe **what** changed and **why**; mention Pinokio-only behavior (patch step, regex) when touched.

## Safety and scope

- Do not add tooling that **hijacks OS input**, **locks unrelated apps**, or **deceives users** (e.g. fake data loss). Keep automation transparent and user-controlled.
- The `vr-consent-experience/` docs assume **in-app-only**, consensual fictional experiences; do not merge patterns that violate that.
