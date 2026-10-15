# Product

<!-- impeccable:product-schema 1 -->

Scope: the Greenhaven wiki only (`greenhaven-wiki/`). The tools hub, the panel and the game client are
other surfaces and are not covered here.

## Platform

web

## Users

- **Players** of Greenhaven, a native 2D MMORPG. They arrive mid-session or between sessions with one
  question ("what level for trout?", "what does GH-104 mean?", "how do I bury bones?") and want the
  answer fast. Players are the primary and, on the main wiki, the only audience.
- **Builders and developers** (map painters, Gear Forge item makers, model makers, server operators)
  are a secondary audience. Their pages live in the Builder Wiki (`builders.html`), reached from one
  "For builders" tab on the top bar, so they never crowd the player wiki.

## Product Purpose

A player reference for Greenhaven that matches the current build: skills, XP curves, items, gear,
creatures, NPCs, world features, settings and crash codes, one topic per page. Success: a player
finds the page that answers their question within a few seconds of landing on the home page, and
the numbers on it are the numbers the game runs on.

## Positioning

Every table is pinned to the shared game rules by the wiki's own test suite
(`tests/wiki.test.mjs` mirrors `server-architecture/crates/shared` and `assets/items.json`), so the
wiki cannot silently drift from the build. It is written by the people who make the game.

## Operating Context

- Served as static files: locally by `serve.mjs` on `:6004`, and on a static host that runs no
  server code. No build step, no npm, Node stdlib only.
- Pages are hand-written HTML; `site.js` builds the shared chrome (header, sidebar, page registry
  `PAGES` / `GROUPS`) so a new article registers in one place.
- The wiki goes public for players soon (around the game's debut). Today it also links the local
  dev tools (`SIBLINGS` in `site.js`); that list empties for the public copy.

## Capabilities and Constraints

- Find: a home-page topic finder and a sidebar page finder; every page sits on one shelf.
- Pages stay ASCII-only, load nothing off-site, name no local ports, scripts or env vars
  (enforced by `tests/wiki.test.mjs`).
- Colours come from the shared theme tokens (`theme.css` / `theme.js`, a copy of
  `developers/theme/`); the wiki does not define its own palette.
- Every page must be listed in `site.js` `PAGES` and reachable from a hub page; the tests enforce it.
- The split is set by each page's shelf in `site.js` (`GROUPS` with `builders: true`): builder pages
  are the painter, forges, atlas, admin panel, tile and prop families, gear layers and effects,
  house rules, theme packs and server internals. Moving a page between books means changing its `group` and moving its catalog row.

## Brand Commitments

- Name: Greenhaven. The wiki's own voice is a traveller's field notebook: plain sentences, sentence
  case, the game's in-world wording for refusals and messages quoted exactly.
- Player shelves: Skills, Gear and coin, Folk and critters, Around the world, Account and help.
  Builder Wiki shelves: Builder tools, World building, House rules, Servers. The newsletter is
  "The Hearth Post".

## Evidence on Hand

- Game art in `greenhaven-wiki/assets/` (menu backdrop painting, gameplay GIF, player previews, map
  style comparisons, tree templates, cursor art).
- Real rule tables mirrored from the shared crate and `assets/items.json`.
- No player testimonials, player counts or press exist; do not invent them.

## Product Principles

1. Answer first: the shortest path from a question to the page that answers it.
2. Players own the main wiki; builder knowledge is one deliberate step away, never mixed in.
3. True to the build: numbers and texts match the game, and the tests prove it.
4. One topic per page, one shelf per topic.

## Accessibility & Inclusion

Keyboard reachable navigation, readable contrast in every theme pack (the shared contrast gate),
reduced-motion respected.
