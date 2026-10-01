# Saturn V 3D — remaining execution work

Status: **all code work is complete and every automated gate passes.** What is left is
the browser verification that cannot be done without opening the page — see section 1.

```
npm run typecheck   # clean
npm run lint        # clean
npm run test        # 42 passing
npm run build       # succeeds
```

---

## 1. What still needs a human in a browser

Everything above is static analysis, unit tests, and a successful bundle. None of it
observes a WebGL context. These checks are unperformed and are the real remaining work:

1. First frame loads and the vehicle is visible from above.
2. Scroll is smooth, with no jitter and no double-rAF stutter.
3. Each of the eight parts separates, dims the others, and shows its panel.
4. The nav rail jumps to the right section.
5. Reduced motion produces no animation.
6. Mobile viewport (375px) — panels readable, drawer reachable and correct.
7. DevTools FPS at 55+ on a mid-range laptop.
8. Production `npm run build && npm run preview`.

If these need to be automated rather than checked by hand, adding Playwright is the only
route — the project has no browser tooling today.

Just run `npm run dev` and go through them in order.

To watch the scene state live while checking 2,  3 and 4, add this line temporarily to
`src/App.tsx` inside the existing `useEffect` that copies `reducedMotion`:

```ts
;(window as unknown as { sceneState: typeof sceneState }).sceneState = sceneState
```

That object is the single source of truth the canvas reads every frame, so `progress`,
`activeIndex`, `reveal` and `velocity` are all inspectable from the console. Remove the
line afterwards — the state is deliberately not exposed in the shipped build.

---

## 2. What changed in this pass

### The scroll blocker (was: the page did not scroll at all)

`src/App.tsx` configured Lenis with `autoRaf: false` but nothing ever called
`lenis.raf()`, so the page could not be scrolled. Fixed by driving Lenis from GSAP's
ticker inside the existing `gsap.context(...)`, so it is torn down with everything else:

```ts
const lenis = lenisRef.current?.lenis
const update = (time: number) => lenis?.raf(time * 1000)
gsap.ticker.add(update)
gsap.ticker.lagSmoothing(0)
const unsubscribe = lenis?.on('scroll', ScrollTrigger.update)
```

`lenisRef` is now typed `LenisRef` from `lenis/react`, which replaces an
`as unknown as` cast. `LenisRef` is `{ wrapper, content, lenis?: Lenis }`, so the real
instance is `.lenis` — this was verified against the installed types, not assumed.
`lenis.on('scroll', …)` returns its own unsubscribe function, which is used in cleanup
rather than a manual `off` call.

No `scrollerProxy` is needed: `root` mode makes Lenis wrap the native window scroll, so
ScrollTrigger keeps working off the real scroll position.

### Two scene-state fields that were read but never written

`sceneState.reveal` (`Vehicle.tsx`) and `sceneState.velocity` (`Starfield.tsx`) had
readers and **no writers at all**, so the exploded view and the parallax layers were
permanently static. Both are now written in the ScrollTrigger `onUpdate`.

The mapping logic lives in a new `src/lib/scroll-track.ts` rather than inline in
`App.tsx`, because three things now need to agree on where the section boundaries are:
the nav highlight, the exploded view, and the tests.

`sceneState.ready` was declared, never written and never read. Removed.

### Scroll-to-section mapping

`revealForProgress` is a **symmetric window** over each part's own section — assembled on
arrival, fully apart while the panel is centred, reassembled before the next part takes
over. Symmetry is load-bearing, not cosmetic: the active part changes exactly on a
section boundary, so an asymmetric ramp would leave the stack fully exploded right up to
that boundary and then rearrange the whole vehicle in a single frame. A test asserts the
value is continuous across every boundary.

`indexForProgress` and friends clamp out-of-range progress. `velocityFor` clips
ScrollTrigger's raw px/s to ±8000, because a nav-rail jump is reported as an enormous
instantaneous velocity and `Starfield`'s `0.0006` parallax multiplier is tuned for hand
scrolling.

### Model-load failure is now handled

The previous `WebGLBoundary` sat *outside* `<Canvas>` and therefore could not catch a
failed `useGLTF`: R3F renders the scene into its own reconciler root, so errors in the
scene do not propagate to boundaries in the surrounding tree. A model-fetch failure would
have left a blank canvas, an unhandled rejection, and a boot overlay that never lifted.

- New `src/three/SceneBoundary.tsx` sits *inside* the canvas, directly above the scene
  contents, so it is in the same React root as whatever throws. It reports up via
  `onError` and `App` swaps in `FallbackList`.
- `FallbackList` is exported from `WebGLBoundary.tsx` so it can also be rendered
  directly, without first trying and failing to create a context.
- New `src/lib/webgl.ts` probes for a WebGL2 context once at mount. A browser with no
  WebGL now renders the text breakdown immediately rather than via a caught error.
- The boot overlay is removed when the model loads, when the scene fails, *or* when WebGL
  is unavailable.

### Reduced motion

`index.css` only collapses CSS transitions and animations. Every React Bits component
animates from JavaScript, so the preference never reached them — `SplitText` still flew
in, `DecryptedText` still scrambled, `CountUp` still counted.

`src/ui/motion.tsx` adds reduced-motion-aware wrappers (`SplitHeading`, `Reveal`,
`FloatIn`, `Tally`, `Scramble`) that render the component's *finished* state as plain
markup when the preference is set. The vendored files are not edited, so they stay
replaceable by the shadcn CLI. `App` supplies the preference through a context provider.

`Tally` formats with the same `Intl.NumberFormat` rules `CountUp` uses internally, so
"2,970" stays grouped and "34" stays whole — static and animated versions do not disagree.

`Lenis`'s `smoothWheel`/`duration` were already re-evaluated on preference change, because
the options object is rebuilt on re-render. `Vehicle` and `CameraRig` already gated on
`sceneState.reducedMotion`. No changes needed in those three places.

### Tokens, mobile nav, dead code

- shadcn's semantic tokens (`--color-background`, `--color-popover`, `--color-primary`,
  `--color-border`, `--color-ring`, …) are now mapped onto the existing palette via
  `@theme inline`, so vendored components render in the project's colours instead of
  shadcn's light defaults. No existing utility class changed.
  **`--color-muted` is deliberately *not* remapped**: this project uses it as a text
  colour (`text-muted`, seven call sites) while shadcn expects a surface. The one
  vendored component that wants a muted background overrides it at the call site.
- New `PartNavMobile` — a Radix dialog drawer, because `PartNav` is `hidden md:block` and
  small screens previously had no navigation at all. Radix rather than a hand-rolled
  disclosure, for focus trapping, Escape handling and dialog semantics.
- Deleted 7 unused vendored components: `GlassSurface`, `ScrollReveal`, `AnimatedList`,
  and shadcn's `badge`, `card`, `scroll-area`, `separator`. `sheet` and `button` were
  **kept** because `sheet.tsx` imports `button.tsx`, and both are now genuinely used.
- Removed 4 orphaned dependencies: `@radix-ui/react-separator`, `-slot`, `-dialog`,
  `-tooltip`. The components import from the `radix-ui` umbrella package; the individual
  packages were leftovers and remain only as its transitive dependencies.
- `PartSection` fades inactive panels in CSS (opacity/visibility on the wrapper) so it
  does not fight the entrance animation on the contents, which owns transform only. Its
  hardcoded `/ 08` counter is now derived from `SCROLL_PART_ORDER.length`.

### Bundle

Both heavy things are now split out of the critical path:

| Chunk | Size | gzip |
|---|---|---|
| `index` (app, content, all copy) | 236 kB | 82 kB |
| `PartNavMobile` (deferred) | 78 kB | 28 kB |
| `Scene` (deferred) | 6 kB | 3 kB |
| `gsap` | 80 kB | 32 kB |
| `three` (on demand) | 747 kB | 192 kB |
| `r3f` (on demand) | 608 kB | 188 kB |
| `css` | 40 kB | 8 kB |

The document's copy paints before WebGL initialises. `three` and `r3f` are unchanged and
still exceed Vite's 500 kB warning; the GLB is still uncompressed. Neither was in scope
here — see section 5.

---

## 3. Tests

`npm run test` — 42 tests over the logic that can be verified without a browser. This is
the only automated correctness gate beyond typecheck and lint.

| File | Covers |
|---|---|
| `src/lib/scroll-track.test.ts` | section boundaries, part mapping, reveal bell shape and boundary continuity, velocity clipping |
| `src/data/parts.test.ts` | generated geometry integrity, the centring offset, camera keyframe interpolation and clamping, scroll-state pub/sub |
| `src/lib/webgl.test.ts` | the probe returns false rather than throwing with no document |

The centring-offset tests are the important ones. `Vehicle.tsx` translates the model by
`VEHICLE_Y_OFFSET` while `PART_CENTER` bakes the same offset into the camera and explode
targets. If it were applied twice or omitted from one of the two, every camera keyframe
would aim at empty space — with no type error and no console warning, only a wrong
picture. That class of bug is now pinned by test.

House style for these files: explicit `import { describe, it, expect } from 'vitest'` with
no globals, so `tsconfig.app.json` covers them and no config surgery is needed.

---

## 4. Environment — the previous notes here were wrong

**Node is v22.18.0, not v21.6.2.** The old constraints below no longer apply: Node 21.7
added `node:util`'s `styleText`, which Vite 8 (rolldown) requires, and this machine is
well past that. `eslint@10` and `typescript@8` would also install cleanly.

The existing pins were deliberately left alone — `vite@6`, `eslint@9`, `typescript@5.9`
all work correctly here, and bumping a major version is not a change worth making
without a reason. Revisit only if something actually requires it.

**npm 11.5.2 has a `#loadPeerSet` crash.** Installing `vitest@4` fails with
`Cannot read properties of null (reading 'edgesOut')` — an npm bug in peer-set resolution,
not a project problem. Workaround:

```bash
npm install <pkg> --legacy-peer-deps
```

`vitest@3` installs without the flag if that is ever simpler. Note that
`--legacy-peer-deps` skips auto-install-peers, which **removed `postprocessing`**, a
required peer of `@react-three/postprocessing`, and broke the production build with
`Rollup failed to resolve import "postprocessing"`. It is now declared explicitly as a
direct dependency, which is where it belonged.

**The parent folder name contains `&`** (`S004_AARYAN_RAORANE_AI&DS_SY`). `&` is a
command separator in `cmd.exe`, which truncates every npm-generated `.bin` shim. All
`package.json` scripts invoke tools via relative paths
(`node ./node_modules/vite/bin/vite.js`) to avoid this. **Do not reintroduce bare binary
names** (`vite`, `tsc`, `eslint`, `shadcn`, `vitest`) into scripts.

**21st.dev was excluded** because retrieving component code requires a paid membership;
everything came from React Bits and shadcn/ui. `tw-animate-css` was added because shadcn
components' `animate-in` / `slide-in-from-*` classes are silent no-ops without it.

---

## 5. Deliberately not done

- **GLB compression.** `gltf-transform/extensions` is installed and `EXT_meshopt_compression`
  is unused. Worth ~1 MB but it touches `prepare-model.mjs`, which currently self-verifies
  on every run — worth doing deliberately, not as a side effect.
- **Draco.** Same reasoning, with a runtime decoder cost to weigh.
- **Canvas visibility pause.** The canvas is `position: fixed` and always on screen, so an
  `IntersectionObserver` would never fire. Revisit only if the layout changes.
- **Panel occlusion at ≥1280px.** `PartSection` uses `lg:ml-auto`, so panels sit right on
  wide screens and may cover the vehicle. This needs a visual check — see section 1.

---

## 6. Model pipeline

Unchanged. The NASA model is split by script so geometry and copy cannot drift apart.
Re-run after changing anything in `scripts/prepare-model.mjs`:

```bash
npm run model:fetch    # downloads the NASA source GLB (once after clone)
npm run model:inspect  # structure, materials, textures, primitive inventory
npm run model:profile  # radius-vs-height, used to find stage shoulders
npm run model:prepare  # writes public/models/SaturnV-parts.glb + src/data/generated/geometry.json
```

`prepare-model.mjs` self-verifies on every run: it reads the output back and exits
non-zero if the part count, the base/tip heights, or any bbox is wrong.

`assets/source/SaturnV-raw.glb` is gitignored — it is a public-domain third-party
download, so it is re-fetched rather than stored in history, and kept outside `public/`
so it is not copied into the build.

The *generated* `public/models/SaturnV-parts.glb` (1.2 MB) and
`src/data/generated/geometry.json` are committed on purpose, so a fresh clone can run
`npm run dev` and `npm run build` offline. `geometry.json` must stay committed:
`src/data/parts.ts` imports it, so `npm run typecheck` fails without it.

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

Total 34,814 triangles, matching NASA's published count. The model is a stylised low-poly
Saturn V with default Maya names, so part boundaries come from assigning each triangle to
a band by centroid height using real stage proportions as the edges. On a coarse mesh some
triangles straddle a boundary, so extents overshoot by roughly half a metre — the widths
above are wider than the published figures for that reason. Copy quotes published figures
and labels them nominal; `PART_TRIANGLES` shows what the mesh actually contains.

---

## 7. File map

```
saturnv-3d/
├── assets/source/SaturnV-raw.glb     NASA source model, not shipped
├── public/models/SaturnV-parts.glb    generated, 8 part nodes
├── scripts/                           fetch / inspect / profile / prepare
└── src/
    ├── App.tsx                        Lenis root, ticker bridge, scroll track
    ├── data/
    │   ├── parts.ts                    copy, specs, part order, geometry accessors
    │   ├── parts.test.ts
    │   └── generated/geometry.json     written by prepare-model.mjs
    ├── lib/
    │   ├── scroll-state.ts             mutable per-frame state + pub/sub
    │   ├── scroll-track.ts             progress → section / index / reveal / velocity
    │   ├── scroll-track.test.ts
    │   ├── camera.ts                   generated keyframes + interpolation
    │   ├── webgl.ts                    capability probe
    │   ├── webgl.test.ts
    │   └── utils.ts                    cn() helper
    ├── hooks/useReducedMotion.ts       live matchMedia
    ├── three/
    │   ├── Scene.tsx                   <Canvas> wrapper
    │   ├── SceneBoundary.tsx           error boundary inside the R3F root
    │   ├── Vehicle.tsx                 per-part material clones, explode + dim
    │   ├── Starfield.tsx               3 parallax layers
    │   ├── CameraRig.tsx               applies camera path each frame
    │   └── Lighting.tsx                lights, procedural env, postprocessing
    ├── ui/                             our components
    │   ├── Hero, PartSection, PartNav, PartNavMobile, StatsOutro
    │   ├── Grain, WebGLBoundary
    │   └── motion.tsx                  reduced-motion wrappers + provider
    └── components/                     vendored React Bits / shadcn (see eslint.config.js)
```

`src/components/*.tsx` is third-party source installed by the shadcn CLI, not ours.
`eslint.config.js` carries scoped exemptions for `src/components/ui/` and `src/three/`.
Prefer adding new code to `src/ui/`, `src/lib/` and `src/data/`. When a vendored component
needs project-specific behaviour, wrap it rather than patching the file — `motion.tsx`
and `PartNavMobile` both do this.

### Conventions

No semicolons, single quotes, 2-space indent, ~100-column width, trailing commas. Named
exports everywhere except `App`. Comments explain *why*, not *what*, and cite evidence
where there is any. Per-frame code allocates nothing: scratch vectors are module-level
singletons and `sampleCamera` writes into vectors the caller supplies. All motion is
frame-rate independent via `Math.min(delta, 0.1)` and exponential smoothing.