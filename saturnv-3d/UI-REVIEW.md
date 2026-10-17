# UI Review — saturnv-3d

Retroactive 6-pillar visual audit. Scope is the shipped frontend in `saturnv-3d/`
(Vite + React 19 + react-three-fiber + GSAP + Lenis + shadcn/ui).

## Audit Baselines

| Item | Value |
|---|---|
| Phase / UI-SPEC | None — no GSD phase directory or `*-UI-SPEC.md` exists, so the audit runs against the abstract 6-pillar standard plus the repo-local `ui-ux-pro-max` guidance |
| Execution summaries | None (`REMAINING-WORK.md` used as the change log instead) |
| Playwright-MCP | Not available in this session — automated screenshot pass skipped, code-only fallback used |
| Method | Full read of `src/`, `index.html`, `components.json`, `eslint.config.js`, `REMAINING-WORK.md`; the compiled `dist/assets/index-CZZAS4Dr.css`; and the installed `lenis@1.3.26` source |

## Findings Summary

| Pillar | Score | Verdict |
|--------|-------|---------|
| Copywriting | 3/4 | Strong, sourced voice. One factual mislabel ("STAGE" = scroll index). |
| Visuals | 3/4 | Coherent aesthetic; card surface silently falls back to vendor defaults. |
| Color | 3/4 | Excellent, documented, accessible palette — but the shipped card ignores it. |
| Typography | 2/4 | **The declared fonts are never loaded.** Type identity does not render. |
| Spacing | 3/4 | Mostly systematic; card padding and nav rhythm are off. |
| Experience Design | 2/4 | **Scroll is harsh** — four compounding causes, diagnosed below. |
| **Overall** | **16/24** | |

Relevant context from `REMAINING-WORK.md` §1: "scroll is smooth, with no jitter and no
double-rAF stutter" and "DevTools FPS at 55+" are listed as **unverified**. The §2
"UI/UX audit pass" fixed six defects, none of which concerned scroll feel or font
loading. The reported symptom is exactly the untested item.

## Implementation Status — post-audit

The scorecard above and every finding below describe the code **as audited**. The fixes
listed here were then implemented in the same session; the scorecard is kept as the
record of the pre-fix state rather than rewritten to hide what was wrong.

### Done

| Ref | Change |
|---|---|
| E2, E4 | Lenis switched from `duration` + `easing` to `lerp: 0.1`; `gsap.ticker.lagSmoothing(0)` replaced with GSAP's own guard `(500, 33)`; Lenis is fed a monotonic clock that advances at most 50 ms per frame, so a long frame is absorbed instead of jumped |
| E3 | All four `scrub` numbers are now `scrub: true` (`App.tsx` ×3, `Hero.tsx` ×1), and `CameraRig` applies the sampled pose directly — the `lerp(dt * 6)` / `lerp(dt * 4)` lag is gone, `idleDrift` kept |
| E5 | `backdrop-blur-md` and `shadow-2xl` removed from the card; it is now `bg-hull/95`, so its contrast no longer depends on the live canvas; spec tiles `bg-void/40` → `bg-void/70` |
| E6 | `transition-all` → `transition-[opacity,transform]` |
| E7 | `touchMultiplier: 1.2` removed |
| E8 | Nav rail targets ~23px → ~44px (`py-1.5` → `py-2.5`, `gap-1` → `gap-0.5`) |
| E9 | Mobile nav trigger `size-11` (44px), resolved against the variant's `size-8` by `cn()` |
| E1 (partial) | `dpr` capped `[1, 2]` → `[1, 1.5]` |
| T1 | `@fontsource-variable/inter` + `@fontsource-variable/jetbrains-mono` (wght axis) self-hosted via `main.tsx`; the tokens now name `'Inter Variable'` / `'JetBrains Mono Variable'` first. 13 `@font-face` blocks in the build, and only the two latin files are ever fetched |
| T2 | The one sub-10px site raised to 10px |
| T3, V4 | Hero display `leading-[0.85]` → `[0.9]`; the `clamp()` cap `11rem` → `10rem` |
| V1, S1, CO1 | `SpotlightCard` now composes its own classes with `cn()` and no longer ships neutral-background, neutral-border and `p-8` defaults, so the call site's palette, border and padding win |
| V2 (partial) | The card is a flat hull surface with a hairline border; blur and shadow dropped. The hover spotlight is kept |
| V3 | Only the active card pulses |
| C1 | `STAGE {nn}` → `SECTION {nn}` |
| C2 | The static "EXPLODED VIEW" is replaced by the part's real axial band (`PART_BAND`, derived from the generated `geometry.json`), which is true at every scroll position |

**Also fixed while implementing** (not raised by the audit): the repo-root Markdown docs
were being scanned by Tailwind as content, so class names quoted in prose were compiled
into the stylesheet as rules for classes no source file uses. `@source not '../*.md'`
took the CSS from 53.73 kB to 50.20 kB (gzip 11.94 → 11.63 kB).

### Deliberately not done

| Ref | Why |
|---|---|
| E1 (`frameloop="demand"` + visibility pause) | Needs an `invalidate()` path for scroll state, camera drift *and* the starfield, and cannot be validated without a browser. The highest regression risk in the set |
| E1 (gate Bloom) | Device-dependent and cosmetic; needs a hardware heuristic that is not yet justified |
| E10 | Requires splitting the trigger out of the lazy chunk — a component refactor, not a one-liner |
| E11 | `Reveal`'s no-JS fallback; vendored, and behaviourally subtle |
| S3, S4 | Design-system refactors with no defect to fix — spacing tiers and one gutter token |

---

## Why the Scroll Feels Harsh — Root Cause

Four compounding causes, ranked by impact. This is not a single bug.

### 1. Lenis's frame delta is unclamped, and `lagSmoothing(0)` removes the guard

`src/App.tsx:93-95` drives Lenis from GSAP's ticker and explicitly disables GSAP's
long-frame protection:

```ts
const update = (time: number) => lenis?.raf(time * 1000)
gsap.ticker.add(update)
gsap.ticker.lagSmoothing(0)
```

In `lenis.mjs`:

```js
raf = (time) => {
  const deltaTime = time - (this.time || time)   // no clamp
  this.time = time
  this.animate.advance(deltaTime * .001)
}

advance(deltaTime) {
  if (this.duration && this.easing) {
    this.currentTime += deltaTime               // straight into progress
    const linearProgress = clamp(0, this.currentTime / this.duration, 1)
    const easedProgress = completed ? 1 : this.easing(linearProgress)
```

With the configured easing `Math.min(1, 1.001 - 2 ** (-10 * t))`, a single 250 ms
stall advances `t` to ~0.29, so eased progress reaches **0.875**: the page leaps 87%
of the way to its target in one frame. Every time the frame rate dips, the scroll
snaps. This is the most likely direct cause of "harsh".

### 2. Duration-based wheel scrolling retargets into the curve's steep head

Lenis defaults to `lerp: 0.1`, and `advance()` prefers duration-based whenever both
`duration` and `easing` are set — which they are (`src/App.tsx:185,192`). Every wheel
event calls `animate.fromTo(...)`, which resets `currentTime` to 0. While the reader
keeps scrolling, progress never escapes the steep part of the curve:
`t = 0.1 → 0.5`, `t = 0.3 → 0.875`. The page moves in fast bursts then creeps —
snappy at the start, floaty at the end, retargeted on every tick.

### 3. Three smoothing authorities on three different curves

| Layer | Smoothing | Source |
|---|---|---|
| Document text | Lenis `duration: 0.85` | `src/App.tsx:185` |
| Scene state / camera T | ScrollTrigger `scrub: 0.3` / `0.5` | `src/App.tsx:106,131,145` |
| Camera position | `lerp(dt * 6)` / `lerp(dt * 4)` | `src/three/CameraRig.tsx:57-58` |
| Part explode | `lerp(dt * 5)` | `src/three/Vehicle.tsx:92` |
| Starfield | `lerp(dt * 2.4)` | `src/three/Starfield.tsx:90` |

The 3D lags the DOM by well over a second and does not move on the same curve. The
vehicle and the copy read as two disconnected layers even when both are "smooth".

### 4. The frame budget is spent before the scroll gets it

While Lenis, ScrollTrigger and GSAP animate the DOM, the R3F canvas also renders
every frame and never idles:

- `src/three/Scene.tsx:38` — `dpr={[1, 2]}`: up to 4x the pixels, compounded by
  `EffectComposer`.
- `src/three/Lighting.tsx:48-56` — Bloom + Vignette postprocessing, always enabled.
- `src/three/Starfield.tsx:24-26` — 1,820 additive-blended points across 3 layers.
- `src/three/CameraRig.tsx:54-55` — `idleDrift` every frame: the scene never stops.
- `src/ui/PartSection.tsx:57` — `backdrop-blur-md` on 8 always-mounted cards, plus the
  footer's `backdrop-blur-sm`. The backdrop of those filters is the fixed canvas, which
  repaints every frame, so up to 8 backdrop filters must recompute continuously.

This closes a feedback loop: the 3D work steals frames, frames get long, and cause #1
turns each long frame into a scroll snap.

### Also inert

`touchMultiplier: 1.2` (`src/App.tsx:191`) has no effect. `touchMultiplier` is only
consumed on Lenis's `syncTouch` path (`lenis.mjs:617`), and `syncTouch` is off by
default and unset here, so touch scrolling stays native. The option is dead config.

---

## Pillar Findings

### Experience Design — 2/4

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| E1 | Critical | Frame budget starved, feeding the scroll-snap loop | `Scene.tsx:38`, `Lighting.tsx:48-56`, `Starfield.tsx:24-26,92-94`, `CameraRig.tsx:54` | `frameloop="demand"` + `invalidate()` on scroll-state change; pause on `visibilitychange`; cap `dpr` to `[1, 1.5]`; gate Bloom on device or drop it |
| E2 | Critical | Unclamped Lenis delta plus `lagSmoothing(0)` | `App.tsx:95`; `lenis.mjs` `raf()` / `advance()` | Remove `lagSmoothing(0)`; switch Lenis to `lerp: 0.08–0.12` (frame-rate independent via `damp`) |
| E3 | High | Triple-smoothed, desynced layers | `App.tsx:106,131,145`; `CameraRig.tsx:57-58`; `Vehicle.tsx:92` | One smoothing authority: Lenis smooths, ScrollTrigger uses `scrub: true`, camera reads `sceneState` with no lerp |
| E4 | High | Duration + easing retargets into the steep head | `App.tsx:185,192`; `lenis.mjs` `fromTo()` / `advance()` | Prefer `lerp` over `duration` + `easing`, or use a gentler easing |
| E5 | High | 8 backdrop-blurs layered over a per-frame canvas | `PartSection.tsx:57`; 11 `backdrop-filter` rules in the shipped CSS | Drop `backdrop-blur` (the card already has `bg-hull/75`), or freeze the canvas when not scrolling |
| E6 | Medium | `transition-all` on every panel wrapper animates all properties | `PartSection.tsx:33` | `transition-[opacity,transform] duration-500` |
| E7 | Medium | `touchMultiplier: 1.2` is dead config | `App.tsx:191`; `lenis.mjs:617` | Remove it |
| E8 | Medium | Nav rail hit targets ~23px tall (`py-1.5` + 11px text, `gap-1`) | `PartNav.tsx:32,42` | `py-2.5`–`py-3`, `gap-0.5` |
| E9 | Medium | Mobile nav trigger is 32x32px, below the 44px touch minimum, and is the only nav on phones | `PartNavMobile.tsx:46` -> `button.tsx:28` (`size-8`) | `size="icon-lg"` or explicit `size-11` |
| E10 | Medium | `PartNavMobile` is lazy with `fallback={null}`, so on a slow connection the sole mobile navigation does not exist | `App.tsx:229-231` | Ship the trigger eagerly; lazy-load only the drawer body |
| E11 | Low | `Reveal` ships `invisible` and reveals via `once: true`; no no-JS / already-in-view fallback | `AnimatedContent.tsx:104-106,132` | Reveal via CSS, or force-reveal anything already past `start` on refresh |

### Typography — 2/4

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| T1 | **Critical** | **The declared fonts are never loaded.** `--font-sans: 'Inter'` and `--font-mono: 'JetBrains Mono'` are referenced by `body` and the `telemetry` utility, but there is no `@font-face`, no Google Fonts `<link>`, no `@fontsource*` dependency, and no font file in `public/` or `dist/`. The site renders in Segoe UI / Cascadia Mono (or the OS default), and `SplitText`'s `document.fonts.ready` gate resolves instantly. The entire NASA-technical type identity never appears. | `index.html` (none), `index.css:25-26,124-130`, `package.json`, no `.woff*` found anywhere | Self-host `@fontsource-variable/inter` + `@fontsource-variable/jetbrains-mono` (or `<link>` both); then re-check telemetry metrics |
| T2 | High | 9px and 10px telemetry type: `text-[9px]` on the vertical part code and `text-[10px]` at five sites, over an already-small 11px utility | `PartSection.tsx:47,64,66,83,92,95`; `index.css:124-130` | Floor at 10px, prefer 11–12px; carry hierarchy with tracking and weight, not size |
| T3 | Low | `leading-[0.85]` with `tracking-[-0.03em]` on the hero display line is very tight for a semibold sans | `Hero.tsx:63` | `leading-[0.9]` if clipping appears |

Positive: the `clamp()` display scale, the two-family mono/sans split, and
`text-rendering: optimizeLegibility` are all correct choices — they just never render.

### Visuals — 3/4

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| V1 | High | **Vendor classes resolve against the project's intent.** `SpotlightCard` hardcodes `rounded-3xl border border-neutral-800 bg-neutral-900 ... p-8`, and the call site concatenates raw strings instead of using `cn()`. Verified in the shipped stylesheet by byte offset: `.rounded-sm` (14011) after `.rounded-3xl` (13633), so the radius is right by luck; **`.border-neutral-800` (14837) after `.border-edge\/70` (14749)** and **`.bg-neutral-900` (15816) after `.bg-hull\/75` (15515)**, so the card's background and border are stock Tailwind greys, not the palette; **`p-8` (18300) after `p-6` (18262)**, so 2rem padding, not 1.5rem. `src/lib/utils.ts` already exports `cn()`. | `SpotlightCard.tsx:58` + `PartSection.tsx:57`; `dist/assets/index-CZZAS4Dr.css` | `className={cn('relative overflow-hidden', className)}` in `SpotlightCard`, drop the neutral defaults; or wrap the card |
| V2 | Medium | The card reads as a generic glass + blur + shadow template (`shadow-2xl`, `backdrop-blur-md`, hover spotlight) and fights the diagram/telemetry aesthetic used everywhere else | `PartSection.tsx:57`, `SpotlightCard.tsx:50-66` | Flat hull surface, hairline border, reuse the existing grain |
| V3 | Medium | 8 simultaneous `animate-pulse` red dots | `PartSection.tsx:61` | Static indicator, or pulse only the active card |
| V4 | Low | `clamp(3rem, 13vw, 11rem)` hero title at 176px is tight between gutters on ultrawide | `Hero.tsx:63` | Cap at `10rem` |

### Color — 3/4

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| CO1 | High | The V1 leak means the shipped card colours are `--color-neutral-900` / `--color-neutral-800`, not `--color-hull` / `--color-edge` — the documented single-source-of-truth palette is not what renders | same as V1 | same `cn()` fix |
| CO2 | Medium | Spec tiles are `bg-void/40` on `bg-hull/75` on the canvas — three stacked translucencies whose effective surface is not a token, over a moving backdrop, so text contrast is not a fixed value | `PartSection.tsx:82` | Opaque surface token for text-bearing tiles |

Everything else is genuinely well done and should be kept: `--color-faint` at ~5.2:1,
NASA red at ~5.4:1 on the card, `text-muted` at ~6.5:1, a single accent, and a
documented rationale at `index.css:13-20`. Dark-only by design, so no light/dark parity
issue. No additional contrast defects found.

### Spacing — 3/4

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| S1 | High | The shipped card padding is `p-8`, not `p-6 sm:p-7` (same conflict as V1) | verified byte offsets | `cn()` |
| S2 | Medium | Nav rail interactive rhythm is too tight (~23px targets) | `PartNav.tsx:32,42` | see E8 |
| S3 | Medium | Section rhythm drifts into one-offs: `mt-8/14/16/20`, `my-5`, `gap-x-10 gap-y-8` | `Hero.tsx`, `StatsOutro.tsx:14,29`, `ScrollFloat.tsx:81` | Define 3–4 section tiers in the theme |
| S4 | Low | Left gutter is inconsistent: `px-4 sm:px-8 lg:px-16` (sections) vs `px-6` (hero/outro) vs `px-4` plus `left-4` / `right-4` (nav) | `PartSection.tsx:30`, `Hero.tsx:54`, `PartNav.tsx:30` | One gutter token |

### Copywriting — 3/4

The writing is genuinely strong: specific, sourced, non-generic. Two real issues.

| # | Severity | Finding | Evidence | Fix |
|---|---|---|---|---|
| C1 | High | **"STAGE {nn}" mislabels scroll position as stage number.** `stepNumber` comes from the scroll index, so the Launch Escape System reads "STAGE 01" and the first stage (S-IC) reads "STAGE 08" — the inverse of the vehicle's real stage numbers — and IU/SLA/SM/CM/LES are not stages at all. It is also redundant with the `nn / 08` counter beside it. | `PartSection.tsx:24,64,66-68` | Use "SECTION", or the real designations from `PARTS[].order` |
| C2 | Medium | Every card statically reads "EXPLODED VIEW" whether or not the stack is exploded at that scroll position | `PartSection.tsx:95-97` | Drive it from `sceneState.reveal`, or drop it |

`C3` was raised during the audit and **retracted on implementation**: the "Scroll"
affordance is the last child of the hero's *sticky*, vertically-centred column
(`Hero.tsx:52-74`), so it sits inside the first viewport from the first paint. The
`aria-hidden` is correct for a decorative cue. No defect.

---

## Top Fixes

1. **Make the scroll single-authority and long-frame-safe.** Remove `lagSmoothing(0)`,
   switch Lenis from `duration` + `easing` to `lerp`, set both ScrollTriggers'
   `scrub: true`, and delete the `CameraRig` lag lerp. — E2, E3, E4
2. **Buy back the frame budget.** `frameloop="demand"` with `invalidate()` on scroll
   change, pause on hidden, cap `dpr` to `[1, 1.5]`, and remove `backdrop-blur` from the
   8 cards. — E1, E5
3. **Load the fonts.** The declared type identity currently never renders. — T1
4. **Use `cn()` in `SpotlightCard`.** A two-line change with a verified render
   difference in background, border, and padding. — V1, S1, CO1

## What Is Working Well

Worth stating explicitly, so it is not refactored away: the content copy and its
sourcing; the color token architecture and its documented contrast work; the
`heroscreen`/`svh` sizing decision and the reason it exists (`REMAINING-WORK.md` §2);
the reduced-motion wrappers in `src/ui/motion.tsx` that render finished state as plain
markup; the error boundaries (`WebGLBoundary`, `SceneBoundary`) with their reasoning;
the removal of the miswired `Noise` rAF loop; the deterministic starfield PRNG; and the
per-frame allocation discipline (module-level scratch vectors, `sampleCamera` writing
into caller-supplied vectors).

---

*Audit produced by `gsd-ui-review` (6-pillar). Code-only pass — no browser/Playwright
verification was possible in this session, so every runtime claim above is derived from
source and the compiled stylesheet. The implementation pass that followed is recorded
under "Implementation Status — post-audit", and was verified with `npm run typecheck`,
`npm run lint`, `npm test` (42/42) and `npm run build` — all passing. Scroll feel and
frame rate still need a dev-server check before this review can be considered closed.*
