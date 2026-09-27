# snap-x principles

These decide what fits in snap-x. If a proposal conflicts with one, it probably belongs somewhere else.

1. **Render-only.** The agent (or you) designs; snap-x renders and checks. snap-x never decides copy, colors or layout.
2. **Self-contained design files.** Everything an image needs lives in its `.mjs` file (plus `_`-prefixed helpers it imports). No config files, theme presets or project auto-detection.
3. **Correctness over breadth.** A format ships with its real size, limits and danger zones, verified against the platform's docs where possible. Fewer formats done right beat many done roughly.
4. **Facts only.** The skill uses only facts from the source or the user. No invented stats, customers or testimonials.
5. **Real brand assets.** Logos are embedded from the real file, never redrawn.
6. **Measurable over subjective.** When a design rule can be checked by code (contrast, safe zones, glyphs, alpha), `snap-x check` enforces it.
7. **Deterministic.** Same design file in, same image out. No network surprises after fonts and emoji are cached.
8. **Light and portable.** No browser, no native image dependencies; runs anywhere Node runs.
