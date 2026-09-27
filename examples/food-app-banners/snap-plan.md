# Food app banners plan (source: a written brief only — no repo, no website)

A set of promotional banners for a generic food-delivery app — no brand name is shown in the design
itself (no logo, no domain), just a "50% OFF / ORDER NOW" offer banner. Built to check snap-x on a
shared-template pattern: one layout (`designs/_base.mjs`'s `renderBanner()`) driven by 4 small theme
objects (`banner-1-red.mjs` … `banner-4-gold-green.mjs`), each only supplying a gradient + accent color.

Regenerate: `npm run examples` (or `npx -y @snap-x/cli render examples/food-app-banners/designs --out examples/food-app-banners`)

## Rubric
1. Name: none — generic, unbranded food-delivery promo
2. Description: a limited-time "50% off your first 3 orders" offer banner
3. Domain: none shown
4. Tags/proof: "LIMITED TIME OFFER" / "No coupon needed" only — no invented stats or review counts
5. Surface: a 1200×480 promotional banner (website hero, app store listing graphic, or social banner slot)
6. Font: Saira 300/400/600/700/800/900
7. Accent: 4 variants — red/orange, teal, purple, gold/green (see designs/banner-*.mjs for exact hex values)
8. Theme: a diagonal gradient background, a circular "floating" product photo on the right, offer copy on the left
9. Logo: none — no brand mark shown

## Hook
"FLAT 50% OFF — On your first 3 orders. No coupon needed." (the offer itself, not a brand pitch)

## Formats
- Custom 1200×480 promotional banner, one shared template + 4 color themes (VARIANTS-style reuse, written
  as 4 separate entry files importing a common `_base.mjs` rather than a single VARIANTS array — both are
  valid ways to render "one template, several outputs").

## Assumptions / mock
- No brand name, logo or domain — this is a generic offer banner, not tied to a specific company.
- pasta-photo.jpg is a placeholder product photo; see assets/SOURCES.md — verify its license before
  using this pack publicly.
- "50% off first 3 orders" is placeholder offer copy, not a real, currently-running promotion.
