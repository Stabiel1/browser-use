# Development plan: consensual in-VR experience

This plan builds a **game-like** experience. All rules, tasks, and consequences run inside your Unity build.

## Phase 1 — Project and XR

1. Create a **3D (URP)** Unity project (2022.3 LTS recommended).
2. Install packages: **XR Plugin Management**, **OpenXR**, **XR Interaction Toolkit** (XRI).
3. In **Project Settings → XR Plug-in Management**, enable OpenXR for your target (PC VR / Android).
4. Add an **XR Origin (XR Rig)** from XRI samples or the setup wizard.
5. Verify tracking and controllers in a blank scene on device.

## Phase 2 — Consent and session lifecycle

1. Add a **session start** flow: user must perform an intentional action (e.g. both grips + confirm UI) after reading on-screen boundaries.
2. Implement **safeword** (voice or button): immediately fade to neutral space, stop tasks/timers, disable haptics.
3. Add **session end** UI and optional short **aftercare** screen (breathing cue, calm environment).
4. Log session start/end locally only if the user opts in (no cloud requirement).

## Phase 3 — Avatar and presentation

1. Import or rig your avatar (VRM, Ready Player Me, or custom FBX).
2. Place avatar as a world-space or floating reference; animate with idle/state blend tree.
3. Keep performance budget: LOD, single real-time light where possible, baked probes.

## Phase 4 — In-app “tasks” (no OS access)

1. **Task queue** as ScriptableObjects or JSON loaded from `StreamingAssets` (editable before play).
2. Present tasks on a **world-space canvas** or wrist UI; validate completion with in-VR buttons, gestures, or typed input **inside the app** only.
3. Optional: screenshot to **player-accessible gallery** folder with explicit “Save screenshot” consent toggle.

## Phase 5 — Voice (optional)

1. Use **Unity’s** or a **platform** speech API with **offline** preference if privacy matters.
2. Map phrases to **in-game** actions only (e.g. play animation, trigger approved haptic pulse).
3. Always gate voice actions behind **session active + consent flags**; safeword bypasses all commands.

## Phase 6 — Haptics

1. Via **XRController** / **InputDevice** send short, bounded haptic impulses (document intensity caps in your consent doc).
2. Never drive haptics when safeword fired or session paused.

## Phase 7 — Polish and testing

1. Comfort: vignette option, snap/smooth turn, seated mode.
2. **Playtest** with a partner using the written boundaries; revise task list and intensities.
3. Build for your target store or sideload; disclose data use if you add analytics.

## Out of scope (do not implement as “features”)

- Global input capture, locking unrelated apps, or blocking websites at the OS level  
- Fake security events (data wipe, ransomware-style countdown)  
- Scheduled wake-ups or notifications designed to startle or sleep-deprive  

If you need device limits for digital wellbeing, use **transparent OS tools** the user controls themselves.
