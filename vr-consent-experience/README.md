# VR consent experience (prototype)

Fictional, **in-app-only** scene flow for adults who negotiate clear boundaries. Nothing here hijacks the OS, mouse, keyboard, or real files.

## Contents

- `DEVELOPMENT_PLAN.md` — Unity + OpenXR setup and feature order
- `CONSENT_AND_SAFETY_TEMPLATE.md` — negotiation checklist, safeword, aftercare
- `UnityScripts/` — starter C# for consent gate, safeword, in-headset tasks, optional haptics

## Safety principles

- **Visible session state** — always clear when the experience is active
- **Instant stop** — hardware/system quit always works; in-app safeword stops the scene
- **No deception** — no fake data loss, no hidden recording, no surprise 3am automation
- **No OS control** — tasks and “locks” exist only inside the VR application

## Requirements (recommended)

- Unity 2022.3 LTS or newer
- XR Interaction Toolkit 2.x
- OpenXR plugin + your headset’s runtime (Meta, SteamVR, etc.)
