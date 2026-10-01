# Saturn V 3D — remaining execution work

Status as of handoff: **Phase 1 and Phase 2 are complete and verified.** Phases 3–6 have
code written but have **never been rendered in a browser**. Phase 7 has not started.

Read the blocker section first — one bug in Phase 4's code stops the page scrolling
entirely.

---

## 1. Blockers to fix before anything else

### 1.1 Lenis will not scroll (critical)

`src/App.tsx` configures Lenis with `autoRaf: false`, but the GSAP ticker bridge that
drives `lenis.raf()` was never written. With `autoRaf: false` and no bridge, Lenis never
advances its internal animation and the page does not scroll.

Add the bridge inside the existing `gsap.context(...)` in `src/App.tsx`, so it is torn
down correctly with the rest of the context:

```ts
// One clock for the whole site: GSAP's ticker drives Lenis, ScrollTrigger and
// the R3F render loop. Two competing rAF loops is the usual source of jitter.
const update = (time: number) => {
  lenisRef.current?.lenis?.raf(time * 1000)
}
gsap.ticker.add(update)
gsap.ticker.lagSmoothing(0)

// Lenis wraps native scroll, so this keeps ScrollTrigger in step.
lenisRef.current?.lenis?.on('scroll', ScrollTrigger.update)

return () => {
  gsap.ticker.remove(update)
}
```

The `lenisRef` type in `src/App.tsx` currently only declares `scrollTo`. It needs to
expose `raf` and `on` as well — either widen the type or type it as `Lenis | null`
directly and import the type from `lenis`:

```ts
import type { Lenis } from 'lenis'
const lenisRef = useRef<Lenis | null>(null)
```

`ReactLenis`'s `ref` callback yields the component instance, whose `.lenis` property is
the actual `Lenis` instance. Confirm that shape against the installed types before
relying on it.

**Acceptance:** wheel, trackpad, keyboard (space / arrows / page up-down) and touch all
scroll the page smoothly, and the 3D camera tracks the scroll.

### 1.2 `prefers-reduced-motion` is only half wired

`sceneState.reducedMotion` is set from `useReducedMotion()` and read by `CameraRig`,
`Starfield` and `Vehicle`, but Lenis still initialises its smoothing machinery and the
React Bits components animate unconditionally. When reducing motion:

- Lenis `duration` is already `0.01`, but `smoothWheel` also needs checking against the
  live option rather than only at mount.
- `SplitText`, `ScrollFloat`, `AnimatedContent`, `CountUp` and `DecryptedText` should
  be skipped or collapsed to their final state. Consider a `MotionConfig` wrapper, or
  gate the animated props at each call site.
- `ScrollTrigger` scrubs should fall back to discrete, non-animated states.

**Acceptance:** with the OS setting on, nothing translates, fades, drifts or counts up;
all copy is readable and every part is still reachable from the nav rail.

---

## 2. Phase 3 — verify the 3D scene

Code exists in `src/three/` but has never executed. Expect runtime breakage here first.

| File | Risk to check |
|---|---|
| `Scene.tsx` | `<Canvas>` `camera` prop, `color attach="background"`, `dpr` clamp. Confirm the WebGL context actually initialises. |
| `Lighting.tsx` | `<Environment>` with `<Lightformer>` children renders a procedural env with no CDN fetch. Verify it does not request an HDR and does not throw. |
| `Lighting.tsx` | `@react-three/postprocessing` v3 API: `EffectComposer`, `Bloom`, `Vignette` prop names and `enableNormalPass` removal. Most likely source of a runtime error. |
| `Starfield.tsx` | `points` + `BufferGeometry` with vertex colours; `AdditiveBlending`, `depthWrite={false}`. Confirm the field is visible and not washed out. |
| `Vehicle.tsx` | `useGLTF` resolves `/models/SaturnV-parts.glb`; the `part_*` node names match the eight parts written by `prepare-model.mjs`. |
| `CameraRig.tsx` | Initial camera position must roughly match the first `sampleCamera` keyframe or the first frame will jump. |

Model-load failure currently has no boundary. `WebGLBoundary` catches render errors, but
a failed `useGLTF` fetch inside `<Suspense>` will reject past it. Add an error boundary
around `<Vehicle />` specifically, or an `onError` on the loader.

**Acceptance:** first frame renders the vehicle from above; the camera arcs to a
three-quarter view on scroll; no console errors or unhandled rejections.

---

## 3. Phase 4 — scroll orchestration tuning

`src/lib/scroll-state.ts` and `src/lib/camera.ts` are written. Remaining:

- `indexForProgress` in `src/App.tsx` maps progress to an active index using
  `TOTAL_SECTIONS = SCROLL_PART_ORDER.length + 2` (10). Confirm the maths lines up with the
  actual DOM: hero + 8 part sections + outro, each `h-screen`. If section heights ever
  differ, the mapping silently drifts and the wrong part highlights.
- `sceneState.reveal` is read by `Vehicle.tsx` but **nothing ever writes it**. Compute it
  per-frame from `sceneState.progress` (ramp up over the middle ~50% of a part's section
  and back down at the edges), or add labelled tweens to the scrubbed timeline. Until then
  the exploded view never animates.
- `sceneState.velocity` is read by `Starfield.tsx` and **nothing writes it**. Set it in
  the `ScrollTrigger` `onUpdate` via `self.getVelocity()`. The parallax will be static
  until this is done.
- `PartSection` receives `active` but only uses it to set `pointer-events`; decide whether
  inactive panels should also fade, and if so do it in CSS so it does not fight
  `AnimatedContent`.

---

## 4. Phase 5 — UI/UX polish

Structure exists in `src/ui/`. To finish:

- Confirm the panel column placement reads well next to the 3D at 1280px and up; the
  panels currently sit right on wide screens (`lg:ml-auto`) which may cover the vehicle.
- `GlassSurface`, `ScrollReveal` and `AnimatedList` are installed but unused. Either use
  them or remove them; unused vendored components still ship in `src/components/`.
- Add a mobile nav. `PartNav` is `hidden md:block` and has no small-screen equivalent —
  `AnimatedList` or the installed shadcn `sheet` are both available.
- Verify the NASA-red accent stays the only accent, per the chosen direction. Several
  shadcn components ship default tokens that have not been themed yet, and
  `src/index.css` defines its own `--color-*` set rather than shadcn's
  `--primary` / `--background` variables. The two token systems are currently
  unconnected.

---

## 5. Phase 6 — robustness

- Reduced-motion: see 1.2.
- `WebGLBoundary` renders `FallbackList`. Confirm it triggers by forcing a context loss, and
  confirm the fallback is reachable when WebGL is unavailable entirely.
- Add a real "WebGL unavailable" check before mounting `<Canvas>` so the fallback is not
  gated on a thrown error.
- Keyboard: the nav rail is real buttons, verify tab order and that `aria-current` tracks
  the active part. Confirm the skip link in `src/App.tsx` works.
- Add an `IntersectionObserver`-driven pause so R3F stops rendering when the canvas is not
  visible. Not critical while the canvas is fixed and always on screen.

---

## 6. Phase 7 — verification

```bash
npm run typecheck    # currently clean
npm run lint         # currently clean
npm run build        # currently succeeds
npm run dev
```

Manual checks, none of which have been performed yet:

1. First frame loads and the vehicle is visible from above.
2. Scroll is smooth with no jitter or double-rAF stutter.
3. Each of the eight parts separates, dims the others, and shows its panel.
4. Nav rail jumps to the right section.
5. Reduced motion produces no animation.
6. Mobile viewport (375px) — panels are readable, nav is reachable.
7. DevTools FPS at 55+ on a mid-range laptop.
8. Production `npm run build && npm run preview`.

Known build output: three.js is ~747 kB (192 kB gzipped) and the r3f chunk ~616 kB
(191 kB gzipped). Vite warns about chunks over 500 kB. Consider Draco compression or
`EXT_meshopt_compression` on the model, and lazy-loading the `Canvas` so the DOM copy
paints before WebGL initialises.

---

## 7. Environment constraints

These are properties of the machine, not the project. Do not "fix" them by reverting
dependency choices without reading this first.

**Node is v21.6.2 — not an LTS release.** Two consequences:

- `node:util`'s `styleText` was added in Node 21.7. Vite 8 (rolldown) requires it and
  **cannot run here**. The project is therefore pinned to `vite@6.4.3` (Rollup-based) and
  `@vitejs/plugin-react@4.7.0`.
- `eslint@10` and `typescript-eslint@8.71` also reject Node 21.6.2. Pinned to
  `eslint@9.39.5`.
- `typescript@7.0.2` is the current latest but `typescript-eslint@8.71.0` peers
  `typescript >=4.8.4 <6.1.0`, so the project is pinned to `typescript@~5.9.3`.

If Node is ever upgraded to 22 LTS or 24 LTS, these pins can be revisited and Vite 8
adopted.

**The parent folder name contains `&`:** `S004_AARYAN_RAORANE_AI&DS_SY`.

`&` is a command separator in `cmd.exe`, which breaks every npm-generated `.bin` shim —
`npx vite` and `npm run dev` both fail with a truncated path. Two workarounds are already
in place:

- All `package.json` scripts invoke tools via **relative paths**
  (`node ./node_modules/vite/bin/vite.js`), which avoids the absolute path entirely.
- `shadcn` is installed locally and exposed as `npm run shadcn --` for the same reason.

Do not reintroduce bare binary names (`vite`, `tsc`, `eslint`, `shadcn`) into scripts.

**21st.dev was excluded** because retrieving component code requires a paid membership;
only `search` is free. Everything installed came from React Bits and shadcn/ui.

---

## 8. Model pipeline

The NASA model is split by a script, so geometry and copy cannot drift apart. Re-run it
after changing anything in `scripts/prepare-model.mjs`:

```bash
npm run model:fetch    # downloads the NASA source GLB (needed once after clone)
npm run model:inspect  # structure, materials, textures, primitive inventory
npm run model:profile  # radius-vs-height, used to find stage shoulders
npm run model:prepare  # writes public/models/SaturnV-parts.glb + src/data/generated/geometry.json
```

`prepare-model.mjs` self-verifies on every run: it reads the output back and fails with a
non-zero exit if the part count, the base/tip heights, or any bbox is wrong.

The source GLB lives at `assets/source/SaturnV-raw.glb`. It is **gitignored** — it is a
public-domain third-party download, so it is re-fetched with `npm run model:fetch` rather
than stored in history. It is kept outside `public/` so it is also not copied into the
production build.

The *generated* `public/models/SaturnV-parts.glb` (1.2 MB) and
`src/data/generated/geometry.json` **are committed on purpose**: a fresh clone can then run
`npm run dev` and `npm run build` with no network access and no extra steps. If you would
rather keep generated artifacts out of git, add both to `.gitignore` and add
`npm run model:fetch && npm run model:prepare` to your pre-build step — just be aware
`npm run typecheck` will fail on a fresh clone if `geometry.json` is absent, because
`src/data/parts.ts` imports it.

Current split, for reference:

| Part | Band (m) | Triangles | Width |
|---|---|---|---|
| S-IC | 0–42.1 | 32,154 | 17.2 m (incl. fins) |
| S-II | 42.1–67.0 | 800 | 11.1 m |
| S-IVB | 67.0–84.8 | 360 | 10.6 m |
| IU | 84.8–85.9 | 40 | 7.3 m |
| SLA | 85.9–92.7 | 280 | 7.3 m |
| SM | 92.7–99.2 | 800 | 5.1 m |
| CM | 99.2–102.7 | 80 | 3.8 m |
| LES | 102.7–110.6 | 300 | 0.9 m |

Total 34,814 triangles, matching NASA's published polygon count.

Note that the model is a **stylised low-poly** Saturn V with default Maya names
(`pCylinder1`, `polySurface1`, `group7`). Part boundaries are therefore derived by
assigning each triangle to a band by centroid height, using real stage proportions as the
edges. On a coarse mesh some triangles straddle a boundary, so part extents overshoot by
roughly half a metre. The measured widths in the table are wider than the published
figures for the same reason. Copy quotes published figures and labels them as nominal;
`PART_TRIANGLES` shows what the mesh actually contains.

---

## 9. File map

```
saturnv-3d/
├── assets/source/SaturnV-raw.glb     NASA source model, not shipped
├── public/models/SaturnV-parts.glb    generated, 8 part nodes
├── scripts/
│   ├── inspect-model.mjs              structure + primitive inventory
│   ├── analyze-model.mjs              radius-vs-height profile
│   └── prepare-model.mjs              splits + verifies + emits geometry.json
└── src/
    ├── App.tsx                        Lenis root, ScrollTrigger, scroll track
    ├── data/
    │   ├── parts.ts                    copy, specs, part order
    │   └── generated/geometry.json     written by prepare-model.mjs
    ├── lib/
    │   ├── scroll-state.ts             mutable per-frame state + pub/sub
    │   └── camera.ts                   generated keyframes + interpolation
    ├── three/
    │   ├── Scene.tsx                   <Canvas> wrapper
    │   ├── Vehicle.tsx                 per-part material clones, explode + dim
    │   ├── Starfield.tsx               3 parallax layers
    │   ├── CameraRig.tsx               applies camera path each frame
    │   └── Lighting.tsx                lights, procedural env, postprocessing
    ├── ui/                             Hero, PartSection, PartNav, StatsOutro,
    │                                   Grain, WebGLBoundary
    ├── components/                     vendored React Bits (see eslint.config.js)
    └── components/ui/                  vendored shadcn/ui
```

`src/components/*.tsx` is third-party source installed by the shadcn CLI, not ours.
`eslint.config.js` carries scoped rule exemptions for it, for `src/components/ui/`, and
for `src/three/`. Prefer adding new code to `src/ui/`, `src/lib/` and `src/data/`.