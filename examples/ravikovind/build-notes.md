# Build notes — Ravi Kovind LinkedIn cover

Built from [`plan.md`](plan.md) with snap-x. Source of truth for copy and layout is the plan; this file records how it was executed and what differed.

## How it was built
- `designs/_cover.mjs` — the whole 1584×396 composition (dot grid, profile-echo rings, orbit system, node graph, text block) as one builder. The `_` prefix marks it as a helper, so `snap-x render` skips it and only renders the four entry files.
- `designs/cover.mjs` → `ravi-kovind-linkedin-cover.png` (1584×396)
- `designs/cover-2x.mjs` → `…@2x.png` (3168×792): the same vector tree with `transform: scale(2)` — equivalent to `deviceScaleFactor: 2`.
- `designs/qa-overlay.mjs`, `designs/qa-mobile.mjs` — the QA views the plan asks for.
- Fonts: Inter 400/500/600/700 and JetBrains Mono 400 (via `FONTS`); no fallback font was used.

## Deviations from the plan (and why)
1. **snap-x (Satori → PNG) instead of HTML + Playwright** (plan §6) — this is a snap-x example. No `cover.html`.
2. **No `.jpg` export** — snap-x outputs PNG only. LinkedIn accepts PNG.
3. **Philosophy line colour `#8B8B95` instead of `#71717A`** — `#71717A` measures 4.09:1 on `#0A0A0B`, which fails the plan's own QA rule (secondary text ≥ 4.5:1). `#8B8B95` is 5.87:1.
4. **`★` and `●` are drawn as shapes** (inline SVG star, CSS circle) rather than font glyphs, so they can't fall back to a blank box.
5. **Stats are stacked** (number over label) — the plan allows either, and stacked keeps the block within `x ≤ 1080`.

## QA checklist (plan §7)
- [x] Dimensions exactly 1584×396 and 3168×792
- [x] No text inside the danger zones — see `qa-overlay.png` (avatar circle, x<200, x>1384, top/bottom edges). The optional footer tag sits at the plan's spec'd position at the very bottom of the safe area.
- [x] Name is the most prominent element; legible at 50% zoom
- [x] One accent (cyan) dominates; violet appears once (the 150 px ring gradient)
- [x] Copy matches plan §2 exactly ("Ravi Kovind", "0 → 1", "6.8K")
- [x] Contrast: primary 18.1:1, secondary 7.7:1, scope line 6.0:1, philosophy 5.9:1. (Decorative node labels use the plan's `#52525B`, 2.6:1 — ornamental only.)
- [x] Mobile crop keeps name + title fully visible — `qa-mobile-crop.png`
- [x] No font fallback — Inter and JetBrains Mono load from Google Fonts
- [x] No phone/email, no photo, no tech logos, no "Open to Work"
