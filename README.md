# Greenhaven Wiki (`greenhaven-wiki/`)

A small static wiki for Greenhaven, built in the same pattern as the public porch site ([github.com/Otterdays/Greenhaven](https://github.com/Otterdays/Greenhaven)): plain HTML, one shared stylesheet, one tiny script, root-absolute links. No build step, no npm packages, no external fonts or scripts.

## Files

| File | Role |
| --- | --- |
| `index.html` | Hub listing the available topics |
| `woodcutting.html` | Woodcutting article (the nine-tree ladder) |
| `mining.html` | Mining article (the twenty-rock ladder) |
| `fishing.html` | Fishing article (the six-tier fish ladder, casts, empty spots) |
| `smithing.html` | Smithing article (furnace and anvil stations, the bronze recipe ladder) |
| `firemaking.html` | Firemaking article (flint and steel, the ten-log ladder, fire caps) |
| `cooking.html` | Cooking article (fire, campfire and stove, the cooked fish ladder, burn chance) |
| `holy.html` | Holy article (bones from every mob, burying for Holy XP, refusal texts) |
| `combat.html` | Combat article (the six combat skills, long curve, styles, moves) |
| `digging.html` | Digging article (sand and clay tiles, dedicated counters, no level curve) |
| `equipment.html` | Equipment article (twenty-slot paper doll, bronze set, armour totals) |
| `capes.html` | Capes article (the four-piece catalog, coins vs crystals, DEBUG store) |
| `coins.html` | Coins article (the bag, five tiers Bronze to Diamond, ground piles) |
| `npcs.html` | NPCs and Shops article (branching dialogue, merchant stock, goods) |
| `creatures.html` | Creatures and Mobs article (the creature and mob registries) |
| `pets.html` | Pets article (Rudolph, the pet curve, harvest and combat share) |
| `crouch.html` | Crouch article (half speed, sprint veto, world-owned slowdown) |
| `chat.html` | Chat and Commands article (glance / review / compose, /time /w /clear) |
| `guilds.html` | Guilds and Friends article (names, tags, caps, whispers) |
| `items.html` | Items article (the shared item registry and the eight families) |
| `seasonal.html` | Seasonal Content article (Christmas props, festive set, Rudolph) |
| `character-forge.html` | Character Forge article (the model maker and the agent CLI) |
| `gallery.html` | Gallery article (bundled previews: brand, menu, characters, world) |
| `terrain.html` | Terrain and Tiles article (the twelve tile families, height, walkability) |
| `props.html` | Signs, Chests and Campfires article (the per-cell sidecar pattern) |
| `first-person.html` | First Person article (F5 view, mouse look, living sky) |
| `account.html` | Accounts and Characters article (world picker, register, login, save fields) |
| `settings.html` | Settings article (five tabs, twelve rebinds, safe reset) |
| `music.html` | Music and Audio article (six shipped songs, the music player, the Python workshop) |
| `map-maker.html` | The Map Painter article (twelve tools, node panel, stamp ghost) |
| `contributing.html` | Contributing to the Wiki article (source of truth, ASCII rule, tests) |
| `themes.html` | Theme Packs article (fifty-nine packs, contrast gate) |
| `wake-up.html` | The Wake-Up Arrival article (3.5 s arrival sequence, motes and leaves) |
| `cursors.html` | Cursors article (three shipped custom cursors, Cursor Maker) |
| `remis.html` | Remis Rots and Tots article (the buy / steal / defend minigame) |
| `monetization.html` | Monetization article (two wallets, three crystal packs, the DEBUG flag) |
| `props-packs.html` | Prop Packs article (market, home and green, camp furniture, festive) |
| `wood-and-ramps.html` | Wood, Ramps and Height article (boardwalk, dock, corduroy, ramp) |
| `atlas.html` | Live Atlas article (read-only view of a running world) |
| `floors-and-walls.html` | Floors, Walls and Crafted Grounds article (link families, twelve grounds) |
| `gear-forge.html` | Gear Forge article (the item authoring tool and the parts synthesiser) |
| `gui-first.html` | The GUI-first Law article (the operator's rule that every content workflow is clickable) |
| `admin-panel.html` | The Admin Panel article (give, take, moderation, audit) |
| `bosses.html` | Bosses article (Thornmother, Wyvern, Barrow King) |
| `layers.html` | Worn Gear Layers article (the twenty-layer paint order) |
| `worlds.html` | Worlds and Multi-world article (shared accounts, per-world state, save locks) |
| `shipping-map.html` | Where the River Bends article (the 250 x 250 shipping map) |
| `auth.html` | Accounts, Passwords and Sessions article (Argon2id, session tokens, remember-me) |
| `friends.html` | Friends article (live presence, row menu, /friend /unfriend) |
| `crash-codes.html` | Crash Codes article (every GH-xxx code and its fix) |
| `transmog.html` | Change Look (Transmog) article (`SetLook`, `shown_gear`, `look:<slot>`) |
| `gear-fx.html` | Gear Effects article (glow, swing trail, hit pop / sparks / dust) |
| `player-menu.html` | The Player Menu article (right-click, Whisper / Add friend) |
| `player-sheet.html` | The Player Sheet article (Skills / Inventory / Equipment / Pets / hidden Shop) |
| `stride.html` | Stride article (Shift sprint, Dust Lungs / Warm Trail) |
| `experience.html` | Experience article (XP curves, level thresholds, cap 99) |
| `style.css` | Shared styles: theme tokens with Meadow `:root` fallbacks |
| `site.js` | Brand jump dropdown, centred icon rail, and sibling-page cluster; footer year |
| `serve.mjs` / `serve.bat` | Local viewer (Node stdlib; also serves the shared theme files) |
| `tests/wiki.test.mjs` | Contract test for the pages |
| `assets/` | Wiki-bundled images (brand, menu backdrop, character previews, tree templates, cursor, concept maps, one gameplay clip). Copied from the game's own `assets/` folder so the wiki serves itself without reaching outside. |

## Source of truth

The woodcutting article mirrors the `TREE_KINDS` registry in `server-architecture/crates/shared/src/lib.rs`. Tile IDs, level gates, XP per chop, chop range and the scenery refusal text must keep matching that shared code. When the ladder changes, update the shared registry, the article and the pins in `tests/wiki.test.mjs` in the same change.

The mining article mirrors the `ROCK_KINDS` registry in the same shared file - all twenty entries, including the granite boulder and the rock cluster. Tile IDs, level gates, XP per mine and mine range must keep matching; update registry, article and `ROCKS` pins together.

The smithing article mirrors `RECIPES`, `Station` (furnace `113`, anvil `101`) and `EQUIPMENT` in the same shared file. Recipe ids, level gates, XP and inputs must keep matching; update registry, article and `RECIPES` pins together.

The combat article mirrors `CombatSkill`, `combat_xp_for_level`, `AttackStyle`, `MOVES` and `WEAPONS` in the same shared file. Skill ids, start levels, curve checkpoints, style boosts and move timings must keep matching; update registry, article and `COMBAT_LEVELS` / `MOVES` pins together.

The fishing article mirrors `FISHING_TIERS` in the same shared file. Tier names, level gates, XP per catch and cast seconds must keep matching; update registry, article and the `FISHING_TIERS` pins together.

The stride article mirrors `stride_tick`, `stride_xp_to_next` (`40 x level`), `SPRINT_MULT`, `WARM_TRAIL_SECS` and `STRIDE_XP_PER_FRESH_CELL` in the same shared file. When those rules change, update the article and the `STRIDE_LEVELS` / Dust Lungs pins together.

The experience article mirrors `woodcutting_xp_to_next` / `mining_xp_to_next` / `fishing_xp_to_next` / `smithing_xp_to_next` (same `50 x level` curve), their `*_level` helpers, the max-level caps and `Skills::total_level` (every gathering skill plus Smithing plus the six combat skills; fresh reads 20) in the same shared file. It also links Stride's separate `40 x level` curve and the combat long curve (`combat_xp_for_level`). The thresholds and the cap (99) must keep matching that code; update all three in the same change.

The digging article mirrors `DIG_KINDS` (sand tile 35 at 5 xp, clay tile 36 at 8 xp), `DIG_RANGE` and the sand/clay counters on `Skills` in the same shared file. When either band moves, update `DIGGABLE` in `tests/wiki.test.mjs` and the article together.

The equipment article mirrors `EquipSlot::ALL` / `EquipSlot::LAYERS`, `EQUIPMENT` (bronze helm, platebody, platelegs, candy cane sword) and the armour totals they carry. Slot ids are on the wire and in saves, so they never renumber.

The capes article mirrors `CAPE_DEFS` (four rows), `Currency` (Coins vs Crystals), `MONETIZATION_ENABLED` / `MONETIZATION_DEBUG` and `CRYSTAL_PACKS`. Ids are persisted, so a new cape is always appended; the DEBUG flag is what keeps the store from charging real money today.

The coins article mirrors `COIN_BAG_MAX` (100,000,000), `STARTER_COINS` (100), `CoinTier::floor` (Bronze / Silver 10,000 / Gold 100,001 / Platinum 1,000,001 / Diamond 10,000,001), `COIN_PICKUP_RANGE` (1.5), `COIN_OWNER_WAIT_MS` (2000) and `COIN_PILE_LIFE_MS` (180,000). Bands are operator-declared; change them together.

The npcs article mirrors `Dialogue` / `DialogueNode` / `DialogueOption`, `Shop` / `ShopRow`, `good_kind` (any item id - there is no fixed goods list any more) and the caps `NPC_NAME_MAX`, `DIALOGUE_NODE_MAX`, `DIALOGUE_TEXT_MAX`, `DIALOGUE_OPTION_MAX`, `SHOP_ROW_MAX`, `PRICE_MAX`, `STOCK_MAX`, `STOCK_DEFAULT`, `TRADE_QTY_MAX` (1,000 - the shop's quantity box) and `TRADE_RANGE`. Every cap is enforced on the wire; move them together.

The creatures article mirrors `assets/creatures.json` (kind, label, role, animation sheet) and `assets/mob-stats.json` (level, hp, attack, strength, defense, armor, respawn_secs, xp, hostility, style). The painter groups the same list into families. A new mob is one row in each file, plus its sheet.

The pets article mirrors `PETS`, `PetKind` (Rudolph today), `PET_MAX_LEVEL` (50), `pet_xp_to_next` (`30 x level`), `pet_harvest_share` (a tenth, rounded up, minimum 1) and `pet_xp_for_damage` (4 XP per damage).

The crouch article mirrors `CROUCH_MULT` (0.5), the `crouch` field on `Player` and `stride_tick`'s sprint veto. Half speed is the number; the world owns the check.

The chat article mirrors the compose body cap (160 characters), `ClientMessage::Chat`, `ClientMessage::Time` / `ServerMessage::Clock`, the whisper path, and the three slash commands (`/time`, `/w`, `/clear`). The admin `/give` cap (1 to 10,000) lives beside them.

The guilds article mirrors `GUILD_NAME_MIN` (3) / `GUILD_NAME_MAX` (24), `GUILD_TAG_MIN` (2) / `GUILD_TAG_MAX` (4), `GUILD_MEMBERS_MAX` (24), `GUILDS_PER_WORLD_MAX` (32) and `FRIENDS_MAX` (100) in the same shared file.

The items article mirrors `ITEMS` (the item list, 52 built-ins today) and the eight-row `ItemFamily` enum. Ids are permanent, so a new item is appended, never renumbered. The `item_family` suffix rule (a `_potion` or `_elixir` is always a Potion, checked first, and a `_log` is always a Log) is the sort contract. The three built-in doses live in `POTIONS`, mirrored in the painter's `dist/map.js`.

The seasonal article mirrors the festive slice of `MARKET_TILES` (Christmas tree 114 through Gingerbread house 119), the four `GIVEN_ONLY` festive wearables on `EQUIPMENT`, and the `TOOL_STANDINS` row that lets the Nutcracker hammer cover for the plain hammer at the anvil.

The character-forge article is documentation for `developers/map-maker/` (the model maker's Character Forge), the CLI at `developers/map-maker/scripts/` (frame inspection, detail layer, `--new-kind`), and the shared sheet contract the game client reads.

The gallery page is the only page that embeds `<img>` tags. Its images live in `assets/` inside this folder and are served by `serve.mjs` (image mime types are registered beside the text ones). Every `src` on the gallery page must exist on disk - a wiki test walks the pages and enforces it.

The terrain article mirrors the twelve tile families in the shared file: `is_water`, `is_wood`, `is_stone`, `is_wall_link`, `is_building_floor`, `is_crafted_ground`, `is_flower`, `is_tree`, `is_mineable`, `is_fence_link`, `is_hedge_link`, `is_market_prop`, `MAX_TILE` and `MAX_HEIGHT`. When a new tile family appears, add both the family predicate and the article row.

The props article mirrors `SignMeta` (text, clickable, readable), `SIGN_TEXT_MAX` (120), `SIGN_WORN`, `ChestMeta` (usable), `Map.signs`, `Map.chests` and `Map.campfire_sizes`. The sidecar pattern is what lets these three tiles carry per-cell authorship without inventing a new id per variant.

The first-person article documents the client's `crates/client/src/first_person.rs`: `TOGGLE_KEY` (F5), the pad East binding, the `PROJ` and `MOUSE_YAW` / `MOUSE_PITCH` numbers, the calm (reduced-motion) mode, and the `FirstPerson` resource's session-only scope. It is client presentation, not wire truth.

The account article documents the client's `crates/client/src/menu.rs`, `account.rs` and the world's `select_character` path: the case-sensitive credential rule, the remember-me flag, the `save_version` load that stops the conflict-and-drop bug, and the full list of fields that ride on a save row.

The settings article documents the client's `crates/client/src/settings.rs`: the twelve `BIND_*` slots, the resolution presets, the `FpsCap` enum, the cursor size, the mute-when-unfocused flag, and the Alt-fresh window on `Alt+Enter` fullscreen.

The music article lists every WAV in `assets/audio/` and the six `make_*.py` scripts in `developers/music-maker/` that generate them. If a song is added or a script renamed, update this page and the shipped table together.

The map-maker article documents the twelve painter tools in `developers/map-maker/dist/editor.js`: hand, brush, fill, rect, eyedrop, spawn, respawn, npc, raise, node, scatter and stamp. A new tool appears in the hotkey map and needs a row here.

The contributing article is the wiki's own contract with a future author. Everything it states is enforced by a test - ASCII, one-list chrome, image-exists, no external URLs, no port or launch-script names.

The themes article mirrors the `THEMES` array and the `GAMES` list in `developers/theme/theme.js`, and the `html[data-theme="<id>"]` blocks in `theme.css`. A new pack appends to both files; the count on the wiki and the contrast test pin it together.

The wake-up article mirrors the client's `crates/client/src/play.rs`: `WAKE_SECS` (3.5), the eighteen-mote / six-leaf split, the two-layer `WakeGlow`, the `WakeMote` component, and the two settings (`reduced_motion` and `particles`) that quiet it.

The cursors article mirrors the three JSON models in `assets/cursors/` (classic-arrow, dot-pointer, twig-ladybug) and the Cursor Maker at `developers/cursor-maker/`.

The remis article documents the minigame's own crate under `easter-eggs/remis-rots-and-tots/`, its scoped `AGENTS.md`, and the six-rot rarity / cost / income table the minigame owns. Its rules never touch the world server.

The monetization article mirrors `MONETIZATION_ENABLED` / `MONETIZATION_DEBUG`, `Currency`, `CRYSTAL_PACKS`, and the `cape_buy` / `crystal_topup` / `grant_crystals` path in the shared crate. Two flags on / off define what a real charge means; a payment provider replaces the DEBUG grant before DEBUG moves.

The props-packs article mirrors the `MARKET_TILES` array (tiles 91 through 119) and the `CAMP_TILES` array (70 through 76). Every prop is a single-cell, blocked-scenery tile; the two stations (Anvil 101, Furnace 113) are documented beside them because `station_at` reads exactly those tiles.

The wood-and-ramps article mirrors `BOARDWALK` (7), `DOCK` (8), `CORDUROY` (9), `RAMP` (24), `RAMP_DIRECTIONS` (4) and `MAX_HEIGHT` (3) in the shared file. `is_wood` covers the walkable family; `is_ramp` singles out the one rise tile.

The atlas article documents the read-only atlas viewer at `developers/map-maker/dist/atlas.{html,js}`. It fetches the world's snapshot the same way the client does, so a tile colour on the atlas is the tile colour the game reads.

The floors-and-walls article mirrors the wall-link family (`is_wall_link`, `wall_link_mask`), the fence-link family (`is_fence_link`, `fence_link_mask`), the hedge family (`is_hedge_link`), the crafted grounds (`is_crafted_ground`, wood 51-56 and stone 57-62), and the interior floor family.

The gear-forge article documents the Gear Forge at `developers/map-maker/dist/gear-forge.{html,js}`, its parts library at `assets/gear/parts.json` (4 hafts, 8 heads, 2 pommels), the pure synth engine at `developers/map-maker/dist/gear-synth.js`, and the item-icon and gear-overlay outputs under `assets/models/gear/`. A new kind or a new part is a data row, not a code path.

The gui-first article documents the operator's Absolute 14 law: every content workflow is fully usable from a GUI. No raw-JSON text boxes, no "run a script to build", no code access for a builder. Scripts are engines behind buttons. Written in `AGENTS.md`, `CLAUDE.md` and `.cursor/rules/gui-first.mdc`.

The admin-panel article documents the Greenhaven Panel at `developers/panel/`: the character search, the inspector drawer, the one give-or-take control that reaches `admin.rs::apply_gift` / `apply_take`, the wallet and pet cards, and the audit list. It shares its endpoint with the in-game `/give` command.

The bosses article mirrors the boss rows in `assets/creatures.json` (Thornmother, Wyvern, Barrow King) and their stat lines in `assets/mob-stats.json`. A new boss is one row in each, plus its sprite sheet.

The layers article mirrors `EquipSlot::LAYERS` in the shared crate - the twenty-entry paint order a worn piece rides. Adding a slot appends at the position it should paint in; existing saves are untouched.

The worlds article describes the multi-world schema in `server-architecture/migrations/0004_multi_world_columns.sql` (`save_version`, `last_heartbeat`) and the account / character columns in `0003_account_system.sql` (`current_world`, `locked_by_world`, `online`). It does not name a port, an environment variable or a config file - the wiki's own rule.

The shipping-map article is a walking tour of `assets/maps/greenhaven.json` (250 x 250, `MAX_DIM` 256). Every tile id, spawn point and NPC named there is documented on another page; this one only joins them into a place.

The auth article mirrors the `accounts` and `characters` tables in `server-architecture/migrations/0001_initial_tables.sql`, the Argon2id hash the server computes on register and login, and the `ResumeSession { session_token, version }` wire message. No secret is stored on the wiki side; the page describes what the world stores.

The friends article mirrors the client's `crates/client/src/friends.rs` panel (live presence dots, dim offline names, `FriendsState::scroll`, `reachable`, the row Whisper / Remove menu), the `friend_watchers` and `announce_presence` path in the world, and the two new chat commands `/friend <name>` and `/unfriend <name>`.

The crash-codes article mirrors `crates/client/src/crash.rs`: the `CrashKind` table (GH-101 GPU, GH-201 files, GH-202 folder access, GH-301 memory, GH-401 audio, GH-501 network, GH-999 unknown, plus the GH-90x native Windows codes) and the `classify` keyword order. Codes are stable strings; a new cause adds a row, never renumbers.

The transmog article mirrors `ClientMessage::SetLook`, `Skills::shown_gear`, and the shared `look_options`, `next_look`, `set_look` and `look_key` path in the shared crate (a look lives under `look:<slot>` in `Skills.equipped`, so no migration was needed). The `ServerMessage::Welcome.items` fingerprint field is documented on the same page.

The gear-fx article mirrors `assets/gear-fx.json` (the shared effects file, keyed by item id) and the Gear Forge's Effects panel at `developers/map-maker/dist/gear-forge-effects.js`. A new effect kind is one row on the file and one client painter path; both are already wired through live reload.

The player-menu article mirrors `crates/client/src/friends.rs`: the `PlayerMenu` resource, the 24 x 36 pixel `avatar_hit` box, and the popup's three buttons (Whisper, Add friend, Remove friend). The F panel bind is fixed (like Tab), the menu hides Whisper for an unreachable target, and the client keeps the popup inside the window.

The player-sheet article mirrors `crates/client/src/player.rs`: the `SheetTab` enum (Skills, Inventory, Equipment, Pets, hidden Shop), the fixed binds `P` / `I` / `E` / `Y`, the `SkillGuide` block on the Skills tab, the `spawn_capes_section(.., shop)` split between Equipment and the hidden Shop, and the `Panels::open_shop` route from the pause menu's `Action::PremiumShop`.

## Tests

From the repo root:

```sh
node --test tests/wiki.test.mjs
```

The contract runners also execute this suite next to the other Node checks.

## Viewing locally

The pages use root-absolute links (`/style.css`, `/site.js`), so opening the files on disk does not render them. Serve the folder instead: on Windows, run `serve.bat` (or double-click it), or start the **Wiki** card in the launch panel (`batch/launch-panel.bat`). Both serve this folder with the Node standard library, free their bind port through `batch/kill-port.bat`, and are otherwise identical.

The header also carries the shared theme picker. `theme.css` and `theme.js` are bundled in this folder (copies of `developers/theme/`) and served alongside every other file, so the same chrome works locally (`serve.mjs` revalidates them through a fixed allowlist) and on a static host that runs no server code. When the shared theme changes, re-copy those two files here. A copy that is missing them keeps the Meadow fallback colours and shows no picker.

## Private wiki

This wiki is private for now. The header rail and the brand dropdown also reach the sibling local Greenhaven pages (tools hub, map painter, live atlas, launch panel). Their host comes from `location.hostname` in `site.js`, never a hardcoded loopback literal, so a copy on another host still reaches its neighbours on the default local band. The dev links live in the JS chrome only: every page stays free of listener URLs, so flipping `SIBLINGS` in `site.js` back to an empty list returns the wiki to publish-ready without touching a page.

The tools hub reciprocates: `developers/map-maker/dist/tools-jump.js` carries a Wiki entry in its rail and the hub card list links `http://127.0.0.1:6004`.

## Editing rules

- Keep every page ASCII-only: straight quotes, `-` for dashes, `...` for ellipses, `(c)` for copyright.
- No Unicode glyphs as icons in wiki files: use inline SVG instead (the ASCII-only guard covers HTML, CSS and JS).
- No external fonts, scripts, or URLs; everything stays same-origin. Images must come from `/assets/` inside this folder - copy the file in rather than reach out.
- Root-absolute links only (`/style.css`, `/woodcutting.html`); the site is served from a site root.
- Do not document launch scripts, local ports, or environment variables on these pages.
- Colour tokens (`--bg`, `--header`, `--panel`, `--line`, `--btn`, `--muted-accent`, `--accent`, `--accent-soft`) come from the shared theme, bundled here as `theme.css` (a copy of `developers/theme/theme.css`). Load it before `style.css` and keep the `:root` Meadow fallbacks so a copy served without it still renders.
