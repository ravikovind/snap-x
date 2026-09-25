# Kite image pack plan (source: a written brief only — no repo, no website)

A /snap-x example built by a fresh agent that had only the skill files: App Store screenshots, a Google Play feature graphic and a YouTube thumbnail with an emoji.

Regenerate: `npm run examples` (or `npx -y @snap-x/cli render examples/kite/designs --out examples/kite`)

## Rubric
1. Name: Kite
2. Description: weekend hiking-trip planner app for groups of friends
3. Domain: none given -> omitted
4. Tags/proof: none invented; only the tagline and the three screens named in the brief
5. Surface: mobile app; shared itinerary, group trail vote, packing checklist
6. Font: Nunito (rounded, friendly) 400/700/900
7. Accent: sunrise orange #FF8A1F (brief: "warm sunrise orange")
8. Theme: dark deep forest green bg #0E3B2C, cream text #FFF3DE, lighter green panels #17513C
9. Logo: none exists -> text wordmark "Kite" in Nunito 900 (no redrawn logo)

## Hook
"Plan the hike, skip the group chat." (tagline, from brief)

## Formats (ids from `formats`)
- app-store-iphone-6.9 x3 (1320x2868, alpha:false): required iPhone size. Headline top ~20%, mock phone below.
  1 "Plan the trip together" -> itinerary screen
  2 "Vote on the trail" -> vote screen
  3 "Tick off the packing" -> packing screen
- google-play-feature-graphic (1024x500, alpha:false): tagline left, mock phone right, centred-ish short headline (no placement zones listed).
- youtube-thumbnail (1280x720): "Plan the / hike 🥾" huge type, nothing in bottom-right badge zone (x1100 y648 160x56). Placement check with `guides`.

## Assumptions / mock
- No app screenshots: phone screens are generic MOCK built from shapes. Labels like "Trail A/B/C", "Saturday", "Water", "Vote for Trail B" are placeholders, no numbers/stats/names.
- Contrast: cream #FFF3DE on #0E3B2C ~ 11:1; orange #FF8A1F on #0E3B2C ~ 5.5:1 (large text only).
- No domain/URL/logo in brief -> none shown.
