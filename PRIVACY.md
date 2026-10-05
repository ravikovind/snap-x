# Privacy policy

snap-x is a rendering tool: a CLI, an MCP server, and a Claude Code skill that write image files on your own machine. It doesn't collect analytics, doesn't require an account, and doesn't have a backend of its own that your data passes through.

## What it sends over the network

- **Fonts.** The first time a design uses a Google Font family, snap-x downloads the font file from Google Fonts and caches it on disk so later renders work offline.
- **Emoji.** A design containing an emoji character fetches the matching image from the Twemoji CDN (jsdelivr/twitter), cached the same way.
- **Images you explicitly ask for.** If a design needs a real photo you haven't supplied, the skill asks you for one first. Only if you decline, or tell it to search, does your AI agent fetch an image from the web on your behalf — and only images cleared for commercial use.

None of these requests carry your project's content, your prompts, or anything else identifying — they're plain file downloads (a font family name, an emoji code point, or a search query you provided).

## What it stores

Fonts and emoji images are cached locally in your own filesystem (not sent anywhere else). Design files, rendered images, and any assets you or your agent save all live in your own project directory. snap-x doesn't read, store, or transmit this data anywhere beyond that.

## Third-party services

- [Google Fonts](https://developers.google.com/fonts/faq/privacy) — font file hosting
- [jsDelivr](https://www.jsdelivr.com/) / [Twemoji](https://github.com/jdecked/twemoji) — emoji image hosting
- Whatever search or fetch capability your AI agent already has, only when you ask it to find an image

Each is subject to its own provider's privacy policy.

## Contact

Questions about this policy: open an issue at [github.com/ravikovind/snap-x](https://github.com/ravikovind/snap-x/issues).

_Last updated: 2026-10-05._
