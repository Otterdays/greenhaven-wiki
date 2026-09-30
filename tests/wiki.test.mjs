// [TRACE: DOCS/TESTING.md] Wiki site contract: pages exist, the woodcutting article matches the shared ladder, pages stay publish-ready.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

// Pull the <td> cells out of every populated table row.
const tableRows = (html) =>
  [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map((match) => [...match[1].matchAll(/<td>([^<]*)<\/td>/g)].map((cell) => cell[1].trim()))
    .filter((cells) => cells.length > 0);

// Tree, tile ID, level gate, XP per chop, painter key. Mirrors TREE_KINDS in
// server-architecture/crates/shared/src/lib.rs (cuttable entries only).
const TREES = [
  ['Young oak', '10', '1', '25', '-'],
  ['Pine', '25', '10', '40', 'J'],
  ['Maple', '26', '20', '60', 'K'],
  ['Ancient oak', '27', '30', '85', 'L'],
  ['Yew', '28', '40', '115', 'G'],
  ['Willow', '29', '50', '150', 'V'],
  ['Redwood', '30', '60', '190', 'T'],
  ['Silverwood', '31', '70', '235', 'Q'],
  ['Elderwood', '32', '80', '285', 'W'],
];

// Rock, tile ID, level gate, XP per mine, painter key. Mirrors ROCK_KINDS in
// server-architecture/crates/shared/src/lib.rs (ladder order).
const ROCKS = [
  ['Rock', '14', '1', '25', ';'],
  ['Copper rock', '15', '1', '30', "'"],
  ['Tin rock', '16', '5', '35', '\\'],
  ['Iron rock', '18', '10', '45', '.'],
  ['Coal rock', '19', '20', '60', '/'],
  ['Silver rock', '64', '25', '72', 'click swatch'],
  ['Gold rock', '33', '30', '85', 'click swatch'],
  ['Ruby rock', '17', '40', '115', ','],
  ['Mithril rock', '65', '45', '132', 'click swatch'],
  ['Emerald rock', '20', '50', '150', '`'],
  ['Topaz rock', '68', '55', '168', 'click swatch'],
  ['Sapphire rock', '21', '60', '190', 'P'],
  ['Adamantite rock', '66', '65', '210', 'click swatch'],
  ['Amethyst rock', '23', '70', '235', 'U'],
  ['Orichalcum rock', '67', '75', '260', 'click swatch'],
  ['Onyx rock', '22', '80', '285', 'O'],
  ['Opal rock', '69', '85', '310', 'click swatch'],
  ['Diamond rock', '34', '90', '340', 'click swatch'],
  ['Granite boulder', '77', '1', '30', 'click swatch'],
  ['Rock cluster', '78', '1', '20', 'click swatch'],
];

// Make, station, level gate, XP per make. Mirrors RECIPES in
// server-architecture/crates/shared/src/lib.rs (station menu order).
const RECIPES = [
  ['Bronze bar', 'Furnace', '1', '20'],
  ['Hammer', 'Furnace', '1', '25'],
  ['Bronze helm', 'Anvil', '1', '30'],
  ['Bronze platelegs', 'Anvil', '4', '90'],
  ['Bronze platebody', 'Anvil', '7', '150'],
];

// Level, total XP. Mirrors combat_xp_for_level (the classic long curve) in
// server-architecture/crates/shared/src/lib.rs.
const COMBAT_LEVELS = [
  ['1', '0'],
  ['2', '83'],
  ['10', '1154'],
  ['20', '4470'],
  ['30', '13363'],
  ['50', '101333'],
  ['70', '737450'],
  ['99', '13034431'],
];

// Tier, level gate, fish, XP per catch, cast time. Mirrors FISHING_TIERS in
// server-architecture/crates/shared/src/lib.rs (fishing ladder order).
const FISHING_TIERS = [
  ['Minnow', '1', 'Minnow', '20', '2.5 s'],
  ['Silverfin', '15', 'Silverfin', '45', '3.0 s'],
  ['Trout', '30', 'Trout', '80', '3.5 s'],
  ['Salmon', '45', 'Salmon', '130', '4.0 s'],
  ['Lanternfish', '60', 'Lanternfish', '190', '4.5 s'],
  ['Mooncale', '80', 'Mooncale', '270', '5.0 s'],
];

// Dig kinds and their XP. Mirrors DIG_KINDS in server-architecture/crates/shared/src/lib.rs.
const DIGGABLE = [
  ['Sand', '35', 'walkable', '5', '+1 Sand'],
  ['Clay', '36', 'blocks movement', '8', '+1 Clay'],
];

// Cape id, wallet, cost. Mirrors CAPE_DEFS in server-architecture/crates/shared/src/lib.rs.
const CAPES = [
  ['Emerald Cape', 'Coins', '250'],
  ['Crimson Cape', 'Crystals', '100'],
  ['Tide Cape', 'Crystals', '200'],
  ['Ember Cape', 'Crystals', '400'],
];

// Coin tier bands. Mirrors CoinTier::floor in server-architecture/crates/shared/src/lib.rs.
const COIN_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];

// Festive tiles and wearables. Mirrors the festive slice of MARKET_TILES, GIVEN_ONLY and the
// EQUIPMENT rows in server-architecture/crates/shared/src/lib.rs.
const FESTIVE_TILES = [
  ['Christmas tree', '114'],
  ['Snowman', '115'],
  ['Gift pile', '116'],
  ['Candy cane post', '117'],
  ['Sleigh', '118'],
  ['Gingerbread house', '119'],
];

// Pet XP curve. Mirrors PET_MAX_LEVEL (50) and pet_xp_to_next (30 x level).
// Total XP to reach level L is 15 * L * (L - 1).
const PET_LEVELS = [
  ['1', '0', '30'],
  ['2', '30', '60'],
  ['10', '1350', '300'],
  ['20', '5700', '600'],
  ['50', '36750', '0'],
];

// Guild and friend caps. Mirrors the shared GUILD_* and FRIENDS_MAX constants.
const GUILD_CAPS = {
  nameMin: 3,
  nameMax: 24,
  tagMin: 2,
  tagMax: 4,
  membersMax: 24,
  perWorldMax: 32,
  friendsMax: 100,
};

// Crash codes. Mirrors crates/client/src/crash.rs - a stable string per row.
const CRASH_CODES = [
  ['GH-101', 'No usable graphics driver'],
  ['GH-201', 'Game files are missing'],
  ['GH-202', 'The game folder cannot be written'],
  ['GH-301', 'Out of memory'],
  ['GH-401', 'Sound device problem'],
  ['GH-501', 'Network setup failed'],
  ['GH-999', 'Unexpected error'],
  ['GH-901', 'Crashed inside a driver (access violation)'],
  ['GH-902', 'This CPU is missing a required instruction'],
  ['GH-903', 'Stack overflow'],
  ['GH-904', 'Out of memory (native)'],
  ['GH-900', 'Native crash'],
];

// Gear Forge parts library counts. Mirrors assets/gear/parts.json (hafts / heads / pommels).
const GEAR_PARTS = { hafts: 4, heads: 8, pommels: 2 };

// Barrow King stat line. Mirrors the boss's row in assets/mob-stats.json.
const BARROW_KING = ['Level', 'Health', 'Attack', 'Strength', 'Defence', 'Armour', 'Attack range', 'Style', 'Leash range', 'Respawn', 'XP'];

// Remis Rots and Tots roster. Mirrors the ROT_RARITY table in easter-eggs/remis-rots-and-tots/.
const REMIS_ROTS = [
  ['Remi Rot', 'Common', '20', '2 / s'],
  ['Polka Tot', 'Uncommon', '55', '5 / s'],
  ['Dotty', 'Rare', '130', '12 / s'],
  ['Sneaky', 'Rare', '180', '16 / s'],
  ['Disco Dumpling', 'Epic', '420', '35 / s'],
  ['King Tater', 'Legendary', '1000', '80 / s'],
];

// The twelve painter tools. Mirrors the hotkey map in developers/map-maker/dist/editor.js.
const PAINTER_TOOLS = [
  ['H', 'Hand'],
  ['B', 'Brush'],
  ['F', 'Fill'],
  ['R', 'Rect'],
  ['I', 'Eyedropper'],
  ['S', 'Spawn'],
  ['D', 'Respawn'],
  ['N', 'NPC'],
  ['E', 'Raise'],
  ['T', 'Resource node'],
  ['A', 'Scatter'],
  ['Z', 'Stamp'],
];

// The six shipped songs. Mirrors the WAVs in assets/audio/. const SONGS = [
//   'Opening Fairy Village',
//   'Menu Greenhaven',
//   'Where the River Bends',
//   'Lanterns at Dusk',
//   'Mosslight Waltz',
//   'Willowmere Lullaby',
// ];

// Header chrome contract: site.js builds the brand jump dropdown and the icon rail from one PAGES
// list, so every page in this folder must appear here and there. Same class names as the tools hub
// (.brand-cluster, .tool-jump, .gh-tool-rail) so developers/theme/theme.css styles the rail here too.
const PAGES = [
  {href: '/', file: 'index.html', label: 'Wiki home'},
  {href: '/news.html', file: 'news.html', label: 'The Hearth Post'},
  {href: '/woodcutting.html', file: 'woodcutting.html', label: 'Woodcutting'},
  {href: '/mining.html', file: 'mining.html', label: 'Mining'},
  {href: '/fishing.html', file: 'fishing.html', label: 'Fishing'},
  {href: '/smithing.html', file: 'smithing.html', label: 'Smithing'},
  {href: '/combat.html', file: 'combat.html', label: 'Combat'},
  {href: '/digging.html', file: 'digging.html', label: 'Digging'},
  {href: '/equipment.html', file: 'equipment.html', label: 'Equipment'},
  {href: '/capes.html', file: 'capes.html', label: 'Capes'},
  {href: '/coins.html', file: 'coins.html', label: 'Coins'},
  {href: '/npcs.html', file: 'npcs.html', label: 'NPCs and Shops'},
  {href: '/creatures.html', file: 'creatures.html', label: 'Creatures'},
  {href: '/pets.html', file: 'pets.html', label: 'Pets'},
  {href: '/crouch.html', file: 'crouch.html', label: 'Crouch'},
  {href: '/chat.html', file: 'chat.html', label: 'Chat'},
  {href: '/guilds.html', file: 'guilds.html', label: 'Guilds'},
  {href: '/friends.html', file: 'friends.html', label: 'Friends'},
  {href: '/items.html', file: 'items.html', label: 'Items'},
  {href: '/seasonal.html', file: 'seasonal.html', label: 'Seasonal'},
  {href: '/halloween.html', file: 'halloween.html', label: 'Halloween'},
  {href: '/character-forge.html', file: 'character-forge.html', label: 'Character Forge'},
  {href: '/gallery.html', file: 'gallery.html', label: 'Gallery'},
  {href: '/terrain.html', file: 'terrain.html', label: 'Terrain'},
  {href: '/props.html', file: 'props.html', label: 'Signs and Chests'},
  {href: '/first-person.html', file: 'first-person.html', label: 'First Person'},
  {href: '/account.html', file: 'account.html', label: 'Accounts'},
  {href: '/settings.html', file: 'settings.html', label: 'Settings'},
  {href: '/music.html', file: 'music.html', label: 'Music'},
  {href: '/map-maker.html', file: 'map-maker.html', label: 'Map Painter'},
  {href: '/contributing.html', file: 'contributing.html', label: 'Contributing'},
  {href: '/crash-codes.html', file: 'crash-codes.html', label: 'Crash Codes'},
  {href: '/themes.html', file: 'themes.html', label: 'Theme Packs'},
  {href: '/wake-up.html', file: 'wake-up.html', label: 'Wake-Up'},
  {href: '/cursors.html', file: 'cursors.html', label: 'Cursors'},
  {href: '/remis.html', file: 'remis.html', label: 'Rots and Tots'},
  {href: '/monetization.html', file: 'monetization.html', label: 'Crystal Store'},
  {href: '/props-packs.html', file: 'props-packs.html', label: 'Prop Packs'},
  {href: '/wood-and-ramps.html', file: 'wood-and-ramps.html', label: 'Wood and Ramps'},
  {href: '/atlas.html', file: 'atlas.html', label: 'Live Atlas'},
  {href: '/floors-and-walls.html', file: 'floors-and-walls.html', label: 'Floors and Walls'},
  {href: '/gear-forge.html', file: 'gear-forge.html', label: 'Gear Forge'},
  {href: '/gui-first.html', file: 'gui-first.html', label: 'GUI-first Law'},
  {href: '/admin-panel.html', file: 'admin-panel.html', label: 'Admin Panel'},
  {href: '/bosses.html', file: 'bosses.html', label: 'Bosses'},
  {href: '/layers.html', file: 'layers.html', label: 'Gear Layers'},
  {href: '/transmog.html', file: 'transmog.html', label: 'Change Look'},
  {href: '/gear-fx.html', file: 'gear-fx.html', label: 'Gear Effects'},
  {href: '/player-menu.html', file: 'player-menu.html', label: 'Player Menu'},
  {href: '/player-sheet.html', file: 'player-sheet.html', label: 'Player Sheet'},
  {href: '/worlds.html', file: 'worlds.html', label: 'Worlds'},
  {href: '/shipping-map.html', file: 'shipping-map.html', label: 'The Shipping Map'},
  {href: '/auth.html', file: 'auth.html', label: 'Accounts and Passwords'},
  {href: '/stride.html', file: 'stride.html', label: 'Stride'},
  {href: '/experience.html', file: 'experience.html', label: 'Experience'},
];

// Sibling local pages the private wiki header reaches. Label, default band slot, path.
const SIBLINGS = [
  ['World tools', '6001', '/'],
  ['Map painter', '6001', '/map-maker/'],
  ['Live atlas', '6001', '/atlas/'],
  ['Launch panel', '6003', '/'],
];

// Level, total XP, XP to next. Mirrors woodcutting_xp_to_next / woodcutting_level in
// server-architecture/crates/shared/src/lib.rs (cap WOODCUTTING_MAX_LEVEL = 99).
const LEVELS = [
  ['1', '0', '50'],
  ['2', '50', '100'],
  ['10', '2250', '500'],
  ['20', '9500', '1000'],
  ['30', '21750', '1500'],
  ['40', '39000', '2000'],
  ['50', '61250', '2500'],
  ['60', '88500', '3000'],
  ['70', '120750', '3500'],
  ['80', '158000', '4000'],
  ['90', '200250', '4500'],
  ['99', '242550', '0'],
];

// Stride curve: 40 x level. Total to reach L = 20 * L * (L - 1).
const STRIDE_LEVELS = [
  ['1', '0', '40'],
  ['2', '40', '80'],
  ['10', '1800', '400'],
  ['20', '7600', '800'],
  ['30', '17400', '1200'],
  ['40', '31200', '1600'],
  ['50', '49000', '2000'],
  ['60', '70800', '2400'],
  ['70', '96600', '2800'],
  ['80', '126400', '3200'],
  ['90', '160200', '3600'],
  ['99', '194040', '0'],
];

test('wiki hub lists the woodcutting article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\/woodcutting\.html"/);
  assert.match(html, /Woodcutting/);
});

test('wiki hub lists the mining article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\/mining\.html"/);
  assert.match(html, /Mining/);
});

test('wiki hub lists the stride article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\/stride\.html"/);
  assert.match(html, /Stride/);
});

test('woodcutting article exists and names all nine cuttable trees', async () => {
  const html = await readFile(path.join(root, 'woodcutting.html'), 'utf8');
  for (const [name] of TREES) assert.ok(html.includes(name), `missing tree ${name}`);
});

test('mining article exists and names all twenty rocks', async () => {
  const html = await readFile(path.join(root, 'mining.html'), 'utf8');
  for (const [name] of ROCKS) assert.ok(html.includes(name), `missing rock ${name}`);
});

test('woodcutting table pins tile ID, level gate, XP per chop and painter key', async () => {
  const html = await readFile(path.join(root, 'woodcutting.html'), 'utf8');
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map((match) => [...match[1].matchAll(/<td>([^<]*)<\/td>/g)].map((cell) => cell[1].trim()))
    .filter((cells) => cells.length > 0);
  for (const [name, tile, level, xp, key] of TREES) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, tile, level, xp, key], `row for ${name}`);
  }
});

test('mining table pins tile ID, level gate, XP per mine and painter key', async () => {
  const html = await readFile(path.join(root, 'mining.html'), 'utf8');
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map((match) => [...match[1].matchAll(/<td>([^<]*)<\/td>/g)].map((cell) => cell[1].trim()))
    .filter((cells) => cells.length > 0);
  for (const [name, tile, level, xp, key] of ROCKS) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, tile, level, xp, key], `row for ${name}`);
  }
});

test('scenery refusals, chop range and the Skills key are documented', async () => {
  const html = await readFile(path.join(root, 'woodcutting.html'), 'utf8');
  assert.match(html, /English oak/);
  assert.match(html, /White birch/);
  assert.match(html, /This oak is scenery\. Place a Young oak to make it cuttable\./);
  assert.match(html, /This birch is scenery\. It cannot be chopped\./);
  assert.match(html, /Need an axe\./);
  assert.match(html, /1\.75 tiles/);
  assert.match(html, /Walk closer to harvest\./);
  assert.match(html, /Still working\./);
  assert.match(html, /<code>P<\/code> during play/);
});

test('mine range, cooldown and the Skills key are documented', async () => {
  const html = await readFile(path.join(root, 'mining.html'), 'utf8');
  assert.match(html, /1\.75 tiles/);
  assert.match(html, /Walk closer to harvest\./);
  assert.match(html, /Still working\./);
  assert.match(html, /Need mining/);
  assert.match(html, /Need a pickaxe\./);
  assert.match(html, /<code>P<\/code> during play/);
  assert.match(html, /Mining card/);
});

test('wiki hub lists the fishing article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\/fishing\.html"/);
  assert.match(html, /Fishing/);
});

test('fishing article exists and names all six tiers', async () => {
  const html = await readFile(path.join(root, 'fishing.html'), 'utf8');
  for (const [tier] of FISHING_TIERS) assert.ok(html.includes(tier), `missing tier ${tier}`);
});

test('fishing table pins tier, level, fish, XP per catch and cast time', async () => {
  const html = await readFile(path.join(root, 'fishing.html'), 'utf8');
  const rows = tableRows(html);
  for (const [tier, level, fish, xp, cast] of FISHING_TIERS) {
    assert.deepEqual(rows.find((cells) => cells[0] === tier), [tier, level, fish, xp, cast], `row for ${tier}`);
  }
});

test('fishing cast rules and empty spots are documented', async () => {
  const html = await readFile(path.join(root, 'fishing.html'), 'utf8');
  assert.match(html, /1\.75 tiles/);
  assert.match(html, /Walk closer to harvest\./);
  assert.match(html, /Need fishing/);
  assert.match(html, /Harvest interrupted\./);
  assert.match(html, /That node is empty for now\./);
  assert.match(html, /Someone got there first\./);
  assert.match(html, /<code>P<\/code> during play/);
  assert.match(html, /Fishing card/);
  assert.match(html, /href="\/experience\.html"/);
});

test('stride article documents Dust Lungs sprint rules', async () => {
  const html = await readFile(path.join(root, 'stride.html'), 'utf8');
  assert.match(html, /<code>Shift<\/code>/);
  assert.match(html, /<code>LB<\/code>/);
  assert.match(html, /2x/);
  assert.match(html, /\+4/);
  assert.match(html, /2\.5/);
  assert.match(html, /Warm Trail/);
  assert.match(html, /Dust Lungs/);
  assert.match(html, /40 x current level/);
  assert.match(html, /stride_xp/);
});

test('stride table pins level, total XP and XP to next', async () => {
  const html = await readFile(path.join(root, 'stride.html'), 'utf8');
  const rows = tableRows(html);
  for (const [level, total, next] of STRIDE_LEVELS) {
    assert.deepEqual(rows.find((cells) => cells[0] === level), [level, total, next], `stride row level ${level}`);
  }
});

test('wiki hub lists the experience article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\/experience\.html"/);
  assert.match(html, /Experience/);
});

test('experience article documents the curve and the cap', async () => {
  const html = await readFile(path.join(root, 'experience.html'), 'utf8');
  assert.match(html, /50 x current level/);
  assert.match(html, /25 x level x \(level - 1\)/);
  assert.match(html, /cap is level 99/);
  assert.match(html, /Wanderer level/);
  assert.match(html, /href="\/stride\.html"/);
  assert.match(html, /40 x current level/);
  assert.match(html, /href="\/smithing\.html"/);
  assert.match(html, /href="\/combat\.html"/);
  assert.match(html, /fresh character reads <code>20<\/code>/);
});

test('experience table pins level, total XP and XP to next', async () => {
  const html = await readFile(path.join(root, 'experience.html'), 'utf8');
  const rows = tableRows(html);
  for (const [level, total, next] of LEVELS) {
    assert.deepEqual(rows.find((cells) => cells[0] === level), [level, total, next], `row for level ${level}`);
  }
});

test('experience article reuses the shared tree XP values', async () => {
  const html = await readFile(path.join(root, 'experience.html'), 'utf8');
  const rows = tableRows(html);
  for (const [name, , level, xp] of TREES) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, level, xp], `row for ${name}`);
  }
});

test('experience article reuses the shared rock XP values', async () => {
  const html = await readFile(path.join(root, 'experience.html'), 'utf8');
  const rows = tableRows(html);
  for (const [name, , level, xp] of ROCKS) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, level, xp], `row for ${name}`);
  }
});

test('wiki hub lists the smithing and combat articles', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /href="\/smithing\.html"/);
  assert.match(html, /Smithing/);
  assert.match(html, /href="\/combat\.html"/);
  assert.match(html, /Combat/);
});

test('smithing table pins make, station, level gate and XP per make', async () => {
  const html = await readFile(path.join(root, 'smithing.html'), 'utf8');
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map((match) => [...match[1].matchAll(/<td>([^<]*)<\/td>/g)].map((cell) => cell[1].trim()))
    .filter((cells) => cells.length > 0);
  for (const [name, station, level, xp] of RECIPES) {
    const row = rows.find((cells) => cells[0] === name);
    assert.ok(row, `row for ${name}`);
    assert.deepEqual(row.slice(0, 4), [name, station, level, xp], `row for ${name}`);
  }
});

test('smithing station rules and refusals are documented', async () => {
  const html = await readFile(path.join(root, 'smithing.html'), 'utf8');
  assert.match(html, /tile 113/);
  assert.match(html, /tile 101/);
  assert.match(html, /Step closer to the furnace\./);
  assert.match(html, /Need smithing/);
  assert.match(html, /You need a hammer\./);
  assert.match(html, /You smelt a Bronze bar\./);
  assert.match(html, /href="\/experience\.html"/);
});

test('combat table pins the classic long curve checkpoints', async () => {
  const html = await readFile(path.join(root, 'combat.html'), 'utf8');
  const rows = tableRows(html);
  for (const [level, total] of COMBAT_LEVELS) {
    assert.deepEqual(rows.find((cells) => cells[0] === level), [level, total], `combat row level ${level}`);
  }
});

test('combat article documents the six skills, styles and what ships', async () => {
  const html = await readFile(path.join(root, 'combat.html'), 'utf8');
  for (const skill of ['HEALTH', 'Attack', 'Strength', 'Defence', 'Archery', 'Wizardry']) {
    assert.ok(html.includes(skill), `missing combat skill ${skill}`);
  }
  assert.match(html, /starts at level 10/);
  assert.match(html, /<code>Q<\/code>/);
  assert.match(html, /Accurate/);
  assert.match(html, /Aggressive/);
  assert.match(html, /Defensive/);
  assert.match(html, /Controlled/);
  assert.match(html, /punch/);
  assert.match(html, /slash/);
  assert.match(html, /combat level 3/);
  assert.match(html, /href="\/experience\.html"/);
});

test('wiki hub lists every new article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/digging.html', '/equipment.html', '/capes.html', '/coins.html', '/npcs.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('digging table pins tile, walkability and XP per dig', async () => {
  const html = await readFile(path.join(root, 'digging.html'), 'utf8');
  const rows = tableRows(html);
  for (const [name, tile, walk, xp, drop] of DIGGABLE) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, tile, walk, xp, drop], `row for ${name}`);
  }
  assert.match(html, /Walk closer to dig\./);
  assert.match(html, /href="\/experience\.html"/);
  assert.match(html, /href="\/npcs\.html"/);
});

test('equipment article names the twenty slots and the bronze set', async () => {
  const html = await readFile(path.join(root, 'equipment.html'), 'utf8');
  for (const slot of ['Head', 'Face', 'Neck', 'Shoulders', 'Chest', 'Back', 'Wrists', 'Waist', 'Legs', 'Feet', 'Weapon', 'Off-hand', 'Hands', 'Tool', 'Ring L', 'Ring R', 'Earring', 'Trinket', 'Ammo', 'Pouch']) {
    assert.ok(html.includes(slot), `equipment page is missing the ${slot} slot`);
  }
  for (const piece of ['Bronze helm', 'Bronze platebody', 'Bronze platelegs', 'Candy cane sword']) {
    assert.ok(html.includes(piece), `equipment page is missing ${piece}`);
  }
  assert.match(html, /armour total/);
  assert.match(html, /href="\/smithing\.html"/);
  assert.match(html, /href="\/capes\.html"/);
});

test('capes table pins id, wallet and cost', async () => {
  const html = await readFile(path.join(root, 'capes.html'), 'utf8');
  const rows = tableRows(html);
  for (const [id, wallet, cost] of CAPES) {
    const row = rows.find((cells) => cells[0] === id);
    assert.ok(row, `row for ${id}`);
    assert.deepEqual(row.slice(0, 3), [id, wallet, cost], `row for ${id}`);
  }
  assert.match(html, /DEBUG/);
  assert.match(html, /Coins/);
  assert.match(html, /Crystals/);
  assert.match(html, /href="\/coins\.html"/);
});

test('coins article pins every tier and every honest rule', async () => {
  const html = await readFile(path.join(root, 'coins.html'), 'utf8');
  for (const tier of COIN_TIERS) assert.ok(html.includes(tier), `coins page is missing ${tier}`);
  assert.match(html, /100,000,000/);
  assert.match(html, /10,000/);
  assert.match(html, /100,001/);
  assert.match(html, /1,000,001/);
  assert.match(html, /10,000,001/);
  assert.match(html, /1\.5 tiles/);
  assert.match(html, /2 seconds/);
  assert.match(html, /3 minutes/);
  assert.match(html, /href="\/capes\.html"/);
});

test('npcs article pins every shop and dialogue cap', async () => {
  const html = await readFile(path.join(root, 'npcs.html'), 'utf8');
  assert.match(html, /24 characters/);
  assert.match(html, /240 characters/);
  assert.match(html, /up to 4 options/);
  assert.match(html, /up to forty rows/);
  assert.doesNotMatch(html, /up to eight rows|Two goods exist/, 'a shop is not capped at eight rows nor fixed to two goods');
  assert.match(html, /any item the game knows/, 'the shelf reaches every built-in and Gear Forge item');
  assert.match(html, /hand you a gift/, 'dialogue gifts are documented next to the shop');
  assert.match(html, /100,000 coins/);
  assert.match(html, /9,999/);
  assert.match(html, /2 tiles/);
  assert.match(html, /Sand/);
  assert.match(html, /Clay/);
  assert.match(html, /href="\/digging\.html"/);
});

test('cross-links every new article from at least one existing page', async () => {
  const [exp, mining] = await Promise.all([
    readFile(path.join(root, 'experience.html'), 'utf8'),
    readFile(path.join(root, 'mining.html'), 'utf8'),
  ]);
  assert.match(exp, /href="\/digging\.html"/);
  assert.match(exp, /href="\/capes\.html"/);
  assert.match(exp, /href="\/equipment\.html"/);
  assert.match(mining, /href="\/digging\.html"/);
});

test('wiki hub lists every round-three article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/creatures.html', '/pets.html', '/crouch.html', '/chat.html', '/guilds.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('creatures article names every hostile mob and both bosses', async () => {
  const html = await readFile(path.join(root, 'creatures.html'), 'utf8');
  for (const kind of ['Giant rat', 'Wild boar', 'Grey wolf', 'Bandit', 'Wyvern', 'Barrow King']) {
    assert.ok(html.includes(kind), `creatures page is missing ${kind}`);
  }
  const rows = tableRows(html);
  assert.deepEqual(rows.find((cells) => cells[0] === 'Barrow King'), ['Barrow King', '40', '3,200', 'Undead boss', 'magic', 'aggressive']);
  assert.match(html, /creature registry/);
  assert.match(html, /mob stat sheet/);
  assert.match(html, /href="\/combat\.html"/);
  assert.match(html, /href="\/npcs\.html"/);
});

test('pets article pins Rudolph and the pet curve', async () => {
  const html = await readFile(path.join(root, 'pets.html'), 'utf8');
  assert.match(html, /Rudolph/);
  assert.match(html, /level 50/);
  assert.match(html, /30 x current level/);
  assert.match(html, /tenth/);
  assert.match(html, /4 XP per point of damage/);
  assert.match(html, /4\.5 tiles per second/);
  assert.match(html, /gift-only/);
  assert.match(html, /href="\/combat\.html"/);
});

test('crouch article documents half speed and the sprint veto', async () => {
  const html = await readFile(path.join(root, 'crouch.html'), 'utf8');
  assert.match(html, /Left Ctrl/);
  assert.match(html, /x0\.5/);
  assert.match(html, /half of walk/);
  assert.match(html, /no Stride XP|Stride XP: none/);
  assert.match(html, /vetoed/);
  assert.match(html, /href="\/stride\.html"/);
  assert.match(html, /href="\/capes\.html"/);
});

test('chat article documents every shape and command', async () => {
  const html = await readFile(path.join(root, 'chat.html'), 'utf8');
  assert.match(html, /glance box/);
  assert.match(html, /expanded review/);
  assert.match(html, /compose line/);
  assert.match(html, /160 characters/);
  assert.match(html, /\/time/);
  assert.match(html, /\/w /);
  assert.match(html, /\/clear/);
  assert.match(html, /\[LNTN\] Ranger/);
  assert.match(html, /\/give /);
  assert.match(html, /href="\/guilds\.html"/);
});

test('guilds article pins every social cap', async () => {
  const html = await readFile(path.join(root, 'guilds.html'), 'utf8');
  assert.ok(html.includes(`${GUILD_CAPS.nameMin} to ${GUILD_CAPS.nameMax} characters`), 'guild name bounds missing');
  assert.match(html, /2 to 4 characters/);
  assert.match(html, /Members per guild<\/td><td>24<\/td>/);
  assert.match(html, /Guilds per world<\/td><td>32<\/td>/);
  assert.match(html, /Friends per account<\/td><td>100<\/td>/);
  assert.match(html, /160 character/);
  assert.match(html, /href="\/chat\.html"/);
});

test('equipment article names the bronze tools and the festive set', async () => {
  const html = await readFile(path.join(root, 'equipment.html'), 'utf8');
  for (const line of ['Bronze axe', 'Bronze pickaxe', 'Nutcracker hammer', 'Santa hat', 'Festive jumper', 'Festive trousers', 'Elf boots']) {
    assert.ok(html.includes(line), `equipment page is missing ${line}`);
  }
  assert.match(html, /skilling-tool slot/);
  assert.match(html, /hack/);
  assert.match(html, /crush/);
});

test('wiki hub lists every round-four article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/items.html', '/seasonal.html', '/character-forge.html', '/gallery.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('items article names every family and every group of ids', async () => {
  const html = await readFile(path.join(root, 'items.html'), 'utf8');
  for (const family of ['LOGS', 'ORES AND GEMS', 'FISH', 'BARS', 'TOOLS', 'EQUIPMENT']) {
    assert.ok(html.includes(family), `items page is missing the ${family} heading`);
  }
  for (const item of ['Young oak log', 'Elderwood log', 'Copper ore', 'Diamond', 'Minnow', 'Mooncale', 'Bronze bar', 'Hammer', 'Nutcracker hammer', 'Candy cane sword', 'Santa hat', 'Elf boots']) {
    assert.ok(html.includes(item), `items page is missing ${item}`);
  }
  assert.match(html, /seven families/);
  assert.match(html, /href="\/digging\.html"/);
  assert.match(html, /href="\/smithing\.html"/);
});

test('seasonal table pins every festive tile id', async () => {
  const html = await readFile(path.join(root, 'seasonal.html'), 'utf8');
  const rows = tableRows(html);
  for (const [name, tile] of FESTIVE_TILES) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, tile], `row for ${name}`);
  }
  assert.match(html, /MAX_TILE/);
  for (const piece of ['Santa hat', 'Festive jumper', 'Festive trousers', 'Elf boots', 'Nutcracker hammer', 'Candy cane sword', 'Rudolph']) {
    assert.ok(html.includes(piece), `seasonal page is missing ${piece}`);
  }
  assert.match(html, /gift-only/);
  assert.match(html, /href="\/equipment\.html"/);
  assert.match(html, /href="\/pets\.html"/);
});

test('halloween article pins every spooky tile id and names the roster', async () => {
  const html = await readFile(path.join(root, 'halloween.html'), 'utf8');
  const rows = tableRows(html);
  // The 26 Halloween prop tiles, 162 (jack-o-lantern) through 187 (pumpkin cart).
  const PROPS = [
    ["Jack-o'-lantern", "162"],
    ["Haunted house", "163"],
    ["Giant pumpkin", "164"],
    ["Witch cauldron", "165"],
    ["Crooked tombstone", "166"],
    ["Iron mausoleum", "167"],
    ["Dead tree", "168"],
    ["Skeleton", "169"],
    ["Ghost lantern post", "170"],
    ["Candy stall", "171"],
    ["Hay maze block", "172"],
    ["Coffin", "173"],
    ["Crow cage", "174"],
    ["Potion crate", "175"],
    ["Candy corn pile", "176"],
    ["Witch hat sign", "177"],
    ["Spider web post", "178"],
    ["Pumpkin stall", "179"],
    ["Pumpkin scarecrow", "180"],
    ["Gargoyle statue", "181"],
    ["Cemetery gate (2 x 2)", "182"],
    ["Witch altar", "183"],
    ["Fresh grave", "184"],
    ["Giant cobweb (2 x 2)", "185"],
    ["Skeleton hand", "186"],
    ["Pumpkin cart", "187"],
  ];
  for (const [name, tile] of PROPS) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, tile], `row for ${name}`);
  }
  assert.match(html, /MAX_TILE/);
  assert.match(html, /188/);
  assert.match(html, /Pumpkin vine/i);
  assert.match(html, /Trick-or-treat/);
  assert.match(html, /Mob loot/);
  assert.match(html, /loot table/);
  for (const mob of ["Black Cat", "Vampire Bat", "Restless Ghost", "Gourdhulk", "Hex Witch", "Moonhowl Werewolf", "Jack Hollowgourd"]) {
    assert.ok(html.includes(mob), `halloween page is missing ${mob}`);
  }
  assert.match(html, /Witch hat/);
  assert.match(html, /Pumpkin helm/);
  assert.match(html, /candy corn/i);
  assert.match(html, /Hallowmere/);
  assert.match(html, /href="\/bosses\.html"/);
});

test('character-forge article documents the parts, the CLI and the sheet', async () => {
  const html = await readFile(path.join(root, 'character-forge.html'), 'utf8');
  assert.match(html, /48 frames/);
  assert.match(html, /part-based/);
  assert.match(html, /Describe it/);
  assert.match(html, /Detail layer/);
  assert.match(html, /Frame inspection/);
  assert.match(html, /--new-kind/);
  assert.match(html, /assets\/models\//);
  assert.match(html, /href="\/equipment\.html"/);
  assert.match(html, /href="\/capes\.html"/);
  assert.match(html, /href="\/creatures\.html"/);
});

test('gallery embeds the game art and nothing off-site', async () => {
  const html = await readFile(path.join(root, 'gallery.html'), 'utf8');
  const srcs = [...html.matchAll(/<img src="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(srcs.length >= 10, `expected at least 10 gallery images, saw ${srcs.length}`);
  for (const src of srcs) {
    assert.ok(src.startsWith('/assets/'), `gallery image must live under /assets/, got ${src}`);
    const file = path.join(root, src.replace(/^\//, ''));
    await assert.doesNotReject(readFile(file), `missing gallery asset ${src}`);
  }
  // Alt text must be present on every image so a screen reader still reads the page.
  const withoutAlt = [...html.matchAll(/<img (?![^>]*alt=)[^>]*>/g)];
  assert.equal(withoutAlt.length, 0, 'every gallery <img> needs an alt');
});

test('every wiki <img> resolves to a file inside the wiki folder', async () => {
  for (const page of PAGES) {
    const html = await readFile(path.join(root, page.file), 'utf8');
    for (const match of html.matchAll(/<img src="([^"]+)"/g)) {
      const src = match[1];
      assert.ok(src.startsWith('/assets/'), `${page.file} embeds a non-local image src: ${src}`);
      const file = path.join(root, src.replace(/^\//, ''));
      await assert.doesNotReject(readFile(file), `${page.file} references a missing asset ${src}`);
    }
  }
});

test('wiki hub lists every round-five article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/terrain.html', '/props.html', '/first-person.html', '/account.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('terrain article names every family and every key tile constant', async () => {
  const html = await readFile(path.join(root, 'terrain.html'), 'utf8');
  for (const family of ['Grass and path', 'Water', 'Wood', 'Cobblestone build', 'Wood floors', 'Crafted grounds', 'Flowers', 'Trees', 'Rocks', 'Fences and hedges', 'Camp and market props', 'Festive props']) {
    assert.ok(html.includes(family), `terrain page is missing family ${family}`);
  }
  assert.match(html, /MAX_TILE/);
  assert.match(html, /MAX_HEIGHT<\/code> \(3\)/);
  assert.match(html, /RADIUS<\/code> \(0\.24/);
  assert.match(html, /twelve families/);
  assert.match(html, /href="\/mining\.html"/);
});

test('props article names all three sidecar tiles and their defaults', async () => {
  const html = await readFile(path.join(root, 'props.html'), 'utf8');
  assert.match(html, /tile 63/);
  assert.match(html, /tile 79/);
  assert.match(html, /tile 12/);
  assert.match(html, /120 printable ASCII/);
  assert.match(html, /The letters have worn away\./);
  assert.match(html, /usable: true/);
  assert.match(html, /sidecar/);
  assert.match(html, /href="\/terrain\.html"/);
});

test('first-person article documents the toggle, the projection and the sky', async () => {
  const html = await readFile(path.join(root, 'first-person.html'), 'utf8');
  assert.match(html, /<code>F5<\/code>/);
  assert.match(html, /Gamepad/);
  assert.match(html, /mouse/i);
  assert.match(html, /proportions/);
  assert.match(html, /clouds/);
  assert.match(html, /star motes/);
  assert.match(html, /Reduced motion/);
  assert.match(html, /session-only/);
  assert.match(html, /href="\/terrain\.html"/);
});

test('account article documents the whole path from the menu to a save row', async () => {
  const html = await readFile(path.join(root, 'account.html'), 'utf8');
  assert.match(html, /world picker/);
  assert.match(html, /case sensitive/);
  assert.match(html, /Show password/);
  assert.match(html, /Remember me/);
  assert.match(html, /ws:\/\//);
  assert.match(html, /wss:\/\//);
  assert.match(html, /save_version/);
  assert.match(html, /total level/);
  assert.match(html, /href="\/experience\.html"/);
  assert.match(html, /href="\/coins\.html"/);
  assert.match(html, /href="\/character-forge\.html"/);
});

test('wiki hub lists every round-six article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/settings.html', '/music.html', '/map-maker.html', '/contributing.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('settings article names every tab and every rebindable slot group', async () => {
  const html = await readFile(path.join(root, 'settings.html'), 'utf8');
  for (const tab of ['Video', 'Audio', 'Controls', 'Interface', 'Game']) {
    assert.match(html, new RegExp(`<h2>${tab}</h2>`), `settings page is missing the ${tab} tab`);
  }
  assert.match(html, /Twelve rebindable keyboard slots/);
  assert.match(html, /Alt\+Enter/);
  assert.match(html, /F5 is deliberately outside/);
  assert.match(html, /Reduced motion/);
  assert.match(html, /safe reset|Safe reset/);
  assert.match(html, /href="\/first-person\.html"/);
  assert.match(html, /href="\/experience\.html"/);
});

test('music article lists every shipped song', async () => {
  const html = await readFile(path.join(root, 'music.html'), 'utf8');
  for (const song of ['Opening Fairy Village', 'Menu Greenhaven', 'Where the River Bends', 'Lanterns at Dusk', 'Mosslight Waltz', 'Willowmere Lullaby']) {
    assert.ok(html.includes(song), `music page is missing ${song}`);
  }
  assert.match(html, /Real seek/);
  assert.match(html, /Live spectrum/);
  assert.match(html, /workshop\.py/);
  assert.match(html, /href="\/settings\.html"/);
});

test('map-maker table pins every painter tool to its hotkey', async () => {
  const html = await readFile(path.join(root, 'map-maker.html'), 'utf8');
  // Match only the first two cells of each row so an inline <code> in the description cell does not break the split.
  const rows = [...html.matchAll(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td>/g)].map((m) => [m[1], m[2]]);
  for (const [key, tool] of PAINTER_TOOLS) {
    assert.deepEqual(rows.find((cells) => cells[0] === key), [key, tool], `row for ${key}`);
  }
  assert.match(html, /resource-node|Resource node/);
  assert.match(html, /stamp|Stamp/);
  assert.match(html, /href="\/terrain\.html"/);
  assert.match(html, /href="\/props\.html"/);
});

test('contributing article states every contract the tests enforce', async () => {
  const html = await readFile(path.join(root, 'contributing.html'), 'utf8');
  assert.match(html, /Source of truth/);
  assert.match(html, /ASCII only/);
  assert.match(html, /Root-absolute links/);
  assert.match(html, /Images live in this folder/);
  assert.match(html, /What not to document/);
  assert.match(html, /node --test greenhaven-wiki\/tests\/wiki\.test\.mjs/);
  // The wiki is plain content of the game repo now (2026-09-27): it must not tell
  // contributors to commit inside a submodule or bump a submodule pointer.
  assert.match(html, /part of the game repository/);
  assert.doesNotMatch(html, /submodule/);
});

test('wiki hub lists every round-seven article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/themes.html', '/wake-up.html', '/cursors.html', '/remis.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('themes article names every base pack and the game sections', async () => {
  const html = await readFile(path.join(root, 'themes.html'), 'utf8');
  for (const pack of ['Meadow', 'Day', 'Dusk', 'Dock', 'Tide', 'Mist', 'Cloud', 'Reed', 'Birch', 'Ember', 'Stone']) {
    assert.ok(html.includes(pack), `themes page is missing the base pack ${pack}`);
  }
  for (const group of ['Guild Wars 1', 'Minecraft', 'Flyff', 'Old School RuneScape']) {
    assert.ok(html.includes(group), `themes page is missing the group ${group}`);
  }
  assert.match(html, /fifty-nine/);
  assert.match(html, /contrast gate/);
  assert.match(html, /Auto/);
  assert.match(html, /Cross-tab sync/);
});

test('wake-up article pins the timing, the mote count and the settings', async () => {
  const html = await readFile(path.join(root, 'wake-up.html'), 'utf8');
  assert.match(html, /3\.5/);
  assert.match(html, /eighteen golden motes/);
  assert.match(html, /six tumbling leaves/);
  assert.match(html, /2\.4 s/);
  assert.match(html, /3\.2 s/);
  assert.match(html, /Reduced motion/);
  assert.match(html, /WAKE_SECS/);
  assert.match(html, /href="\/settings\.html"/);
  assert.match(html, /href="\/gallery\.html"/);
});

test('cursors article names all three shipped cursors', async () => {
  const html = await readFile(path.join(root, 'cursors.html'), 'utf8');
  for (const name of ['Classic Arrow', 'Dot Pointer', 'Twig Ladybug']) {
    assert.ok(html.includes(name), `cursors page is missing ${name}`);
  }
  assert.match(html, /Cursor Maker/);
  assert.match(html, /hotspot/);
  assert.match(html, /href="\/gallery\.html"/);
  assert.match(html, /href="\/settings\.html"/);
  assert.match(html, /href="\/themes\.html"/);
});

test('remis table pins every rot rarity, cost and income', async () => {
  const html = await readFile(path.join(root, 'remis.html'), 'utf8');
  const rows = tableRows(html);
  for (const [name, rarity, cost, income] of REMIS_ROTS) {
    assert.deepEqual(rows.find((cells) => cells[0] === name), [name, rarity, cost, income], `row for ${name}`);
  }
  assert.match(html, /30 Tots/);
  assert.match(html, /six-slot/);
  assert.match(html, /Not online/);
  assert.match(html, /Not a Roblox deployment/);
  assert.match(html, /easter-eggs\/remis-rots-and-tots\//);
});

test('wiki hub lists every round-eight article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/monetization.html', '/props-packs.html', '/wood-and-ramps.html', '/atlas.html', '/floors-and-walls.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('monetization article names the wallets, the packs and the honest limits', async () => {
  const html = await readFile(path.join(root, 'monetization.html'), 'utf8');
  assert.match(html, /Two wallets/);
  assert.match(html, /Coins/);
  assert.match(html, /Crystals/);
  for (const pack of ['Handful', 'Pouch', 'Coffer']) assert.ok(html.includes(pack), `monetization page missing pack ${pack}`);
  for (const line of ['No pay-to-win', 'No loot boxes', 'No real-money trading']) assert.ok(html.includes(line), `monetization page missing ${line}`);
  assert.match(html, /payment-provider webhook|payment provider/);
  assert.match(html, /DEBUG/);
  assert.match(html, /href="\/capes\.html"/);
  assert.match(html, /href="\/coins\.html"/);
});

test('props-packs article names the market, home, camp and festive tiles', async () => {
  const html = await readFile(path.join(root, 'props-packs.html'), 'utf8');
  for (const prop of ['Stone well', 'Market stall, red awning', 'Market stall, blue awning', 'Notice board', 'Sundial']) {
    assert.ok(html.includes(prop), `props-packs page missing ${prop}`);
  }
  for (const prop of ['Anvil', 'Woodpile', 'Mailbox', 'Picnic table', 'Furnace', 'Gravestone', 'Training dummy']) {
    assert.ok(html.includes(prop), `props-packs page missing ${prop}`);
  }
  for (const prop of ['Log bench', 'Firewood stack', 'Stump seat']) {
    assert.ok(html.includes(prop), `props-packs page missing camp prop ${prop}`);
  }
  assert.match(html, /Twenty-nine props|29 props/);
  assert.match(html, /station_at/);
  assert.match(html, /href="\/seasonal\.html"/);
  assert.match(html, /href="\/smithing\.html"/);
});

test('wood-and-ramps article names every bridge tile and the height ceiling', async () => {
  const html = await readFile(path.join(root, 'wood-and-ramps.html'), 'utf8');
  for (const row of [['Boardwalk', '7'], ['Dock', '8'], ['Corduroy', '9']]) {
    const cells = tableRows(html).find((c) => c[0] === row[0]);
    assert.ok(cells && cells[1] === row[1], `missing wood tile ${row[0]}`);
  }
  assert.match(html, /Ramp \(tile 24\)/);
  assert.match(html, /Four directions/);
  assert.match(html, /MAX_HEIGHT<\/code>, which is 3/);
  assert.match(html, /no jump key/);
  assert.match(html, /href="\/terrain\.html"/);
  assert.match(html, /href="\/map-maker\.html"/);
});

test('atlas article is read-only and reaches the world snapshot', async () => {
  const html = await readFile(path.join(root, 'atlas.html'), 'utf8');
  assert.match(html, /Read only/);
  assert.match(html, /Depletion/);
  assert.match(html, /Player dots/);
  assert.match(html, /Height shading/);
  assert.match(html, /href="\/map-maker\.html"/);
  assert.match(html, /href="\/terrain\.html"/);
});

test('floors-and-walls article names every link family and every ground', async () => {
  const html = await readFile(path.join(root, 'floors-and-walls.html'), 'utf8');
  for (const wall of ['Cobblestone wall', 'Cobblestone doorway', 'Cobblestone archway', 'Cobblestone paving']) {
    assert.ok(html.includes(wall), `floors page is missing ${wall}`);
  }
  for (const floor of ['Wood plank floor', 'Wood board floor', 'Interior floor']) {
    assert.ok(html.includes(floor), `floors page is missing ${floor}`);
  }
  for (const ground of ['Timber paving', 'Pale plank floor', 'Knotty plank floor', 'Weathered decking', 'Mossy planks', 'Charred planks', 'Gravel path', 'Brick paving', 'Flagstone paving', 'Dressed stone', 'Mossy cobblestone', 'Ruin flagstone']) {
    assert.ok(html.includes(ground), `floors page is missing ground ${ground}`);
  }
  for (const fence of ['Picket fence', 'Low stone fence', 'Open gate', 'Closed gate', 'hedge']) {
    assert.ok(html.toLowerCase().includes(fence.toLowerCase()), `floors page is missing ${fence}`);
  }
  assert.match(html, /wall-link/);
  assert.match(html, /fence-family|fence family/);
  assert.match(html, /href="\/terrain\.html"/);
});

test('wiki hub lists every round-nine article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/gear-forge.html', '/gui-first.html', '/admin-panel.html', '/bosses.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('gear-forge article names the three looks, the parts, and the synthesiser', async () => {
  const html = await readFile(path.join(root, 'gear-forge.html'), 'utf8');
  for (const look of ['Icon', 'Held', 'Worn']) assert.ok(html.includes(look), `gear-forge page is missing the ${look} look`);
  const rows = tableRows(html);
  assert.deepEqual(rows.find((c) => c[0] === 'Hafts').slice(0, 2), ['Hafts', String(GEAR_PARTS.hafts)]);
  assert.deepEqual(rows.find((c) => c[0] === 'Heads').slice(0, 2), ['Heads', String(GEAR_PARTS.heads)]);
  assert.deepEqual(rows.find((c) => c[0] === 'Pommels').slice(0, 2), ['Pommels', String(GEAR_PARTS.pommels)]);
  for (const kind of ['axe', 'pickaxe', 'hammer', 'mace', 'sword']) assert.match(html, new RegExp(kind));
  for (const gem of ['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'diamond']) assert.ok(html.includes(gem), `missing gem ${gem}`);
  assert.match(html, /describe it/i);
  assert.match(html, /seeded PRNG/);
  assert.match(html, /24 distinct candidates|24 /);
  assert.match(html, /assets\/gear\/parts\.json/);
  assert.match(html, /href="\/equipment\.html"/);
  assert.match(html, /href="\/smithing\.html"/);
  assert.match(html, /href="\/character-forge\.html"/);
  assert.match(html, /href="\/gui-first\.html"/);
});

test('gui-first article states the rule and its exclusions', async () => {
  const html = await readFile(path.join(root, 'gui-first.html'), 'utf8');
  assert.match(html, /GUI/);
  assert.match(html, /No raw JSON text boxes/);
  assert.match(html, /no scripts|No "run this script/);
  assert.match(html, /Typing a name/);
  assert.match(html, /CLI is an .*additional.* path/);
  assert.match(html, /Music maker/);
  assert.match(html, /href="\/gear-forge\.html"/);
});

test('admin-panel article names the give / take surface and its audit', async () => {
  const html = await readFile(path.join(root, 'admin-panel.html'), 'utf8');
  assert.match(html, /Search and inspect/);
  assert.match(html, /Give or take|Give-or-take|Give \+?or\+? Take/);
  assert.match(html, /Make admin/);
  assert.match(html, /kick a player|kick/);
  assert.match(html, /teleport/);
  assert.match(html, /ban/);
  assert.match(html, /audit/i);
  assert.match(html, /\/give /);
  assert.match(html, /href="\/coins\.html"/);
  assert.match(html, /href="\/chat\.html"/);
  assert.match(html, /href="\/pets\.html"/);
});

test('bosses article names all three bosses and pins the Barrow King stats', async () => {
  const html = await readFile(path.join(root, 'bosses.html'), 'utf8');
  for (const boss of ['Thornmother', 'Wyvern', 'Barrow King']) {
    assert.ok(html.includes(boss), `bosses page is missing ${boss}`);
  }
  const rows = tableRows(html);
  for (const stat of BARROW_KING) {
    assert.ok(rows.find((c) => c[0] === stat), `bosses page is missing Barrow King stat ${stat}`);
  }
  assert.match(html, /3,200/);
  assert.match(html, /6 tiles/);
  assert.match(html, /2,700 seconds/);
  assert.match(html, /18,000/);
  assert.match(html, /href="\/combat\.html"/);
  assert.match(html, /href="\/creatures\.html"/);
});

test('equipment article reflects the Skilling tool label', async () => {
  const html = await readFile(path.join(root, 'equipment.html'), 'utf8');
  assert.match(html, /<td>Tool<\/td><td>Skilling<\/td>/);
  assert.match(html, /labelled <strong>Skilling<\/strong>/);
  assert.match(html, /You ready the Hammer\./);
});

test('wiki hub lists every round-twelve article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/transmog.html', '/gear-fx.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('transmog article names the Change look controls and the storage rule', async () => {
  const html = await readFile(path.join(root, 'transmog.html'), 'utf8');
  assert.match(html, /Change look|Change Look/);
  assert.match(html, /Skills\.equipped/);
  assert.match(html, /look:<\/code>|look:/);
  assert.match(html, /You change how it looks\./);
  assert.match(html, /Back.*cape|cape.*Back/);
  assert.match(html, /Tool slot|tool slot|<strong>Tool<\/strong> slot/);
  assert.match(html, /registry fingerprint/);
  assert.match(html, /href="\/equipment\.html"/);
  assert.match(html, /href="\/layers\.html"/);
});

test('gear-fx article names every effect kind and the live file', async () => {
  const html = await readFile(path.join(root, 'gear-fx.html'), 'utf8');
  for (const kind of ['Glow', 'Swing trail', 'Hit pop', 'Hit sparks', 'Dust']) {
    assert.ok(html.includes(kind), `gear-fx page is missing effect ${kind}`);
  }
  assert.match(html, /assets\/gear-fx\.json/);
  assert.match(html, /Effects<\/strong> panel|Effects panel/);
  assert.match(html, /Ghost of saved/);
  assert.match(html, /Before \/ after/);
  assert.match(html, /Touch up this frame/);
  assert.match(html, /engraved/);
  assert.match(html, /glowing/);
  assert.match(html, /href="\/gear-forge\.html"/);
  assert.match(html, /href="\/layers\.html"/);
});

test('gear-forge article covers the deferred batches (effects, delete, panel preview, fingerprint)', async () => {
  const html = await readFile(path.join(root, 'gear-forge.html'), 'utf8');
  assert.match(html, /Effects, engraved and glowing/);
  assert.match(html, /Per-frame touch-ups/);
  assert.match(html, /Delete, bring back/);
  assert.match(html, /An item preview in the panel/);
  assert.match(html, /The registry fingerprint/);
  assert.match(html, /href="\/gear-fx\.html"/);
  assert.match(html, /href="\/admin-panel\.html"/);
});

test('wiki hub lists every round-thirteen article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/player-menu.html', '/player-sheet.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('player-menu article names the popup buttons and the fixed F bind', async () => {
  const html = await readFile(path.join(root, 'player-menu.html'), 'utf8');
  assert.match(html, /Right-click/);
  assert.match(html, /24 x 36/);
  assert.match(html, /Whisper/);
  assert.match(html, /Add friend/);
  assert.match(html, /Remove friend/);
  assert.match(html, /not.*modal|light popup/);
  assert.match(html, /one-way|Requests are not built yet/);
  assert.match(html, /fixed bind/);
  assert.match(html, /href="\/friends\.html"/);
  assert.match(html, /href="\/chat\.html"/);
});

test('player-sheet article names every tab and its bind', async () => {
  const html = await readFile(path.join(root, 'player-sheet.html'), 'utf8');
  const rows = tableRows(html);
  for (const [key, tab] of [['P', 'Skills'], ['I', 'Inventory'], ['E', 'Equipment'], ['Y', 'Pets']]) {
    const row = rows.find((c) => c[0] === key);
    assert.ok(row && row[1] && row[1].startsWith(tab), `missing row ${key} -> ${tab}`);
  }
  assert.ok(rows.some((c) => c[0] && c[0].includes('Pause')), 'Shop tab missing');
  assert.match(html, /guide/);
  assert.match(html, /coin bag|coin card/);
  assert.match(html, /hidden Shop tab/);
  assert.match(html, /Escape/);
  assert.match(html, /href="\/equipment\.html"/);
  assert.match(html, /href="\/capes\.html"/);
  assert.match(html, /href="\/pets\.html"/);
});

test('guilds article names the board, founding and joining', async () => {
  const html = await readFile(path.join(root, 'guilds.html'), 'utf8');
  assert.match(html, /Guild Board/);
  assert.match(html, /<code>G<\/code>/);
  assert.match(html, /Found/);
  assert.match(html, /Join/);
  assert.match(html, /Leave/);
  assert.match(html, /disbands?/);
  assert.match(html, /throttled/);
  assert.match(html, /Requests are not built yet/);
});

test('npcs article names the shop reach, the trade flow, and stock counting', async () => {
  const html = await readFile(path.join(root, 'npcs.html'), 'utf8');
  assert.match(html, /2 tiles/);
  assert.match(html, /shop open|ShopOpen/);
  assert.match(html, /How a trade works/);
  assert.match(html, /counts down|counts down for this server session/);
  assert.match(html, /Bought 1 Sand/);
  assert.match(html, /Not enough coins\./);
});

test('wiki hub lists every round-ten article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/layers.html', '/worlds.html', '/shipping-map.html', '/auth.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('gear-forge article covers checks, review gear, goldens, live reload and Forge a set', async () => {
  const html = await readFile(path.join(root, 'gear-forge.html'), 'utf8');
  assert.match(html, /Checks and one-click fixes|thirteen rules/);
  assert.match(html, /Review gear/);
  assert.match(html, /Goldens that follow saves/);
  assert.match(html, /Live reload and Try on in game|once a second/);
  assert.match(html, /Forge a set/);
  assert.match(html, /never block Save/);
});

test('layers article walks the twenty-layer paint order', async () => {
  const html = await readFile(path.join(root, 'layers.html'), 'utf8');
  assert.match(html, /EquipSlot::LAYERS/);
  for (const layer of ['Back', 'Legs', 'Feet', 'Chest', 'Waist', 'Wrists', 'Hands', 'Shoulders', 'Neck', 'Face', 'Head', 'Earring', 'Ring L', 'Ring R', 'Trinket', 'Pouch', 'Ammo', 'Off-hand', 'Weapon']) {
    assert.ok(html.includes(`<strong>${layer}</strong>`), `layers page is missing ${layer}`);
  }
  assert.match(html, /last and top-most/);
  assert.match(html, /cape system/);
  assert.match(html, /href="\/equipment\.html"/);
  assert.match(html, /href="\/capes\.html"/);
});

test('worlds article names the shared and per-world state', async () => {
  const html = await readFile(path.join(root, 'worlds.html'), 'utf8');
  for (const term of ['current_world', 'locked_by_world', 'save_version', 'last_heartbeat', 'world_id']) {
    assert.ok(html.includes(term), `worlds page is missing ${term}`);
  }
  assert.match(html, /optimistic locking/);
  assert.match(html, /world A|one world at a time/);
  assert.match(html, /cross-world|Cross-world/);
  assert.match(html, /href="\/account\.html"/);
  assert.match(html, /href="\/chat\.html"/);
});

test('shipping-map article names the map and its districts', async () => {
  const html = await readFile(path.join(root, 'shipping-map.html'), 'utf8');
  assert.match(html, /Where the River Bends/);
  assert.match(html, /250 x 250/);
  assert.match(html, /62,500/);
  for (const place of ['waking trail', 'hamlet', 'mossy glade', 'dock', 'hills']) {
    assert.ok(html.includes(place), `shipping-map page is missing ${place}`);
  }
  assert.match(html, /anvil<\/strong> \(tile 101\)/);
  assert.match(html, /furnace<\/strong> \(tile 113\)/);
  assert.match(html, /href="\/props-packs\.html"/);
  assert.match(html, /href="\/terrain\.html"/);
});

test('auth article names the hash, the token, and the remember-me limits', async () => {
  const html = await readFile(path.join(root, 'auth.html'), 'utf8');
  assert.match(html, /Argon2id/);
  assert.match(html, /password_hash/);
  assert.match(html, /session token|session_token/);
  assert.match(html, /Resume session/);
  assert.match(html, /It never emails a password/);
  assert.match(html, /username is not taken/);
  assert.match(html, /only thing remembered is a name|remembers the <em>username<\/em>/);
  assert.match(html, /is_admin/);
  assert.match(html, /href="\/account\.html"/);
  assert.match(html, /href="\/worlds\.html"/);
});

test('wiki hub lists every round-eleven article', async () => {
  const html = await readFile(path.join(root, 'index.html'), 'utf8');
  for (const href of ['/friends.html', '/crash-codes.html']) {
    assert.ok(html.includes(`href="${href}"`), `index.html is missing ${href}`);
  }
});

test('friends article names live presence, the row menu and the two commands', async () => {
  const html = await readFile(path.join(root, 'friends.html'), 'utf8');
  assert.match(html, /Live presence/);
  assert.match(html, /green dot/);
  assert.match(html, /offline names dim|Offline names dim/);
  assert.match(html, /1-12 of 30/);
  assert.match(html, /Row menu|row menu|row opens a menu/i);
  assert.match(html, /Whisper/);
  assert.match(html, /Remove friend/);
  assert.match(html, /\/friend /);
  assert.match(html, /\/unfriend /);
  assert.match(html, /reachable/);
  assert.match(html, /throttled/);
  assert.match(html, /href="\/chat\.html"/);
  assert.match(html, /href="\/guilds\.html"/);
});

test('crash-codes article names every GH-xxx code', async () => {
  const html = await readFile(path.join(root, 'crash-codes.html'), 'utf8');
  const rows = tableRows(html);
  for (const [code, title] of CRASH_CODES) {
    const row = rows.find((cells) => cells[0] === code);
    assert.ok(row, `missing row for ${code}`);
    assert.equal(row[1], title, `${code} title`);
  }
  assert.match(html, /greenhaven-panic\.txt/);
  assert.match(html, /stable strings, never renumbered/);
  assert.match(html, /Ctrl\+C/);
  assert.match(html, /href="\/account\.html"/);
});

test('wiki pages load the shared tool chrome before their own styles', async () => {
  for (const file of PAGES.map((page) => page.file)) {
    const html = await readFile(path.join(root, file), 'utf8');
    const theme = html.indexOf('href="/theme.css"');
    const own = html.indexOf('href="/style.css"');
    assert.ok(theme > -1, `${file} does not load /theme.css`);
    assert.ok(own > theme, `${file} must load /theme.css before /style.css`);
    assert.match(html, /<script src="\/theme\.js"><\/script>/, `${file} does not load /theme.js`);
  }
});

test('wiki bundles the shared theme files so a static host serves them too', async () => {
  const src = await readFile(path.join(root, 'serve.mjs'), 'utf8');
  // Chrome ships inside this folder (a copy of developers/theme/), so the same files serve locally
  // and on a static host that runs no server code. themeDir roots at the wiki folder itself.
  assert.match(src, /const themeDir = here;/);
  assert.match(src, /'\/theme\.css': 'theme\.css', '\/theme\.js': 'theme\.js'/);
  // The copies must actually be present, or the theme picker 404s on the host.
  for (const chrome of ['theme.css', 'theme.js']) {
    const body = await readFile(path.join(root, chrome), 'utf8');
    assert.ok(body.length > 1000, `${chrome} is missing or empty in the wiki folder`);
  }
  // The stat-then-read branch answers 304 from the allowlisted name only; the path never sees request text.
  assert.match(src, /const chrome = CHROME\[url\.pathname\];/);
  assert.match(src, /const full = path\.join\(themeDir, chrome\);/);
  assert.doesNotMatch(src, /readFile\([^)]*url\.pathname/);
});

test('wiki styles consume the shared theme tokens instead of a fixed palette', async () => {
  const css = await readFile(path.join(root, 'style.css'), 'utf8');
  for (const token of ['--bg', '--header', '--panel', '--ink', '--muted', '--muted-accent', '--line', '--btn', '--accent', '--accent-soft']) {
    assert.ok(css.includes(`${token}:`), `style.css is missing the ${token} fallback`);
  }
  assert.match(css, /background:var\(--header\)/);
  assert.match(css, /color:var\(--accent\)/);
  assert.match(css, /color:var\(--muted-accent\)/);
  assert.match(css, /color:var\(--accent-soft\)/);
  assert.doesNotMatch(css, /var\(--meadow\)|var\(--trail\)|var\(--water\)/);
});

test('every wiki page header carries the hub chrome mounts', async () => {
  for (const page of PAGES) {
    const html = await readFile(path.join(root, page.file), 'utf8');
    assert.match(html, /<a class="brand" href="\/"/, `${page.file} has no brand link`);
    assert.match(html, /class="brand-icon"[^>]*>\s*<svg/, `${page.file} has no SVG brand icon`);
    assert.match(html, /<div class="actions"><\/div>/, `${page.file} has no actions mount for the theme picker`);
    assert.doesNotMatch(html, /nav-toggle|id="site-nav"/, `${page.file} still carries the old text nav`);
  }
});

test('wiki header chrome registers every page and reuses the shared rail styles', async () => {
  const [js, css] = await Promise.all([
    readFile(path.join(root, 'site.js'), 'utf8'),
    readFile(path.join(root, 'style.css'), 'utf8'),
  ]);
  const files = (await readdir(root)).filter((file) => file.endsWith('.html')).sort();
  assert.deepEqual(files, PAGES.map((page) => page.file).sort(), 'a page exists but is not in the header chrome');
  for (const page of PAGES) {
    assert.ok(js.includes(`'${page.href}'`), `site.js does not link ${page.href}`);
    assert.ok(js.includes(`'${page.label}'`), `site.js does not label ${page.label}`);
  }
  assert.match(js, /rail\.className = 'gh-tool-rail';/);
  assert.match(js, /jump\.className = 'tool-jump';/);
  assert.match(js, /cluster\.className = 'brand-cluster';/);
  // The rail gets its own full-width header row that wraps instead of overflowing.
  assert.match(css, /header>\.gh-tool-rail\{grid-column:1\/-1;grid-row:2;position:static[^}]*flex-wrap:wrap/);
  assert.match(css, /\.tool-jump nav a\[aria-current=page\]\{[^}]*color:var\(--accent-soft\)/);
  // The wiki owns its rail look (round icons on labelled shelves), scoped under header> so the
  // hub's shared square-tile rail in /theme.css is untouched.
  assert.doesNotMatch(css, /(^|\})\.gh-tool-rail a\s*\{/m);
  assert.match(css, /header>\.gh-tool-rail a\{/);
  // Every rail page sits on a known shelf.
  for (const group of js.matchAll(/group: '(\w+)'\}/g)) {
    assert.ok(js.includes(`{id: '${group[1]}'`), `site.js page group ${group[1]} has no shelf`);
  }
  // Snappy tooltips: data-tip drawn by CSS with a short fade, never the slow native title.
  assert.match(js, /link\.dataset\.tip = item\.label;/);
  assert.doesNotMatch(js, /link\.title = /);
  assert.match(css, /header>\.gh-tool-rail a::after\{content:attr\(data-tip\)[^}]*transition:opacity 70ms/);
  // Icons are drawn, never typed: these pages are ASCII-only.
  assert.match(js, /<svg viewBox="0 0 16 16"/);
});

test('wiki header reaches the sibling Greenhaven pages with no hardcoded host', async () => {
  const [js, css] = await Promise.all([
    readFile(path.join(root, 'site.js'), 'utf8'),
    readFile(path.join(root, 'style.css'), 'utf8'),
  ]);
  // Host comes from the current URL, so a copy on another host still reaches its neighbours.
  assert.match(js, /location\.protocol \+ '\/\/' \+ location\.hostname \+ ':' \+ port \+ path/);
  assert.doesNotMatch(js, /127\.0\.0\.1|localhost/, 'site.js hardcodes a host');
  for (const [label, port, at] of SIBLINGS) {
    assert.ok(js.includes(`'${label}'`), `site.js does not link ${label}`);
    assert.ok(js.includes(`'${port}'`) || js.includes(`: ${port}`), `site.js does not name the ${label} port`);
    if (at !== '/') assert.ok(js.includes(`'${at}'`), `site.js does not name the ${label} path`);
  }
  assert.match(js, /group\.className = 'gh-tool-rail-group';/);
  assert.match(js, /head\.className = 'tool-jump-head';/);
  assert.match(css, /\.gh-tool-rail-group\{display:flex/);
  assert.match(css, /\.gh-tool-rail-sep\{/);
  assert.match(css, /\.tool-jump-head\{/);
  // The dev links live in the JS chrome only: every page stays free of a listener URL, so flipping
  // SIBLINGS back to an empty list returns the wiki to publish-ready without touching a page.
  for (const page of PAGES) {
    const html = await readFile(path.join(root, page.file), 'utf8');
    assert.doesNotMatch(html, /:60\d\d/, `${page.file} names a local listener`);
  }
});

test('wiki pages stay ASCII-only and publish-ready', async () => {
  for (const file of [...PAGES.map((page) => page.file), 'style.css', 'site.js']) {
    const text = await readFile(path.join(root, file), 'utf8');
    const at = text.search(/[^\x09\x0A\x0D\x20-\x7E]/);
    assert.equal(at, -1, `${file} has a non-ASCII character at ${at}`);
  }
  for (const file of PAGES.map((page) => page.file)) {
    const html = await readFile(path.join(root, file), 'utf8');
    assert.doesNotMatch(html, /https?:\/\//, `${file} loads an external resource`);
    assert.doesNotMatch(html, /\.bat/i, `${file} names a script`);
    assert.doesNotMatch(html, /127\.0\.0\.1/, `${file} names a local port`);
    assert.doesNotMatch(html, /RPG_/, `${file} names an environment variable`);
    assert.doesNotMatch(html, /dev-page/, `${file} names the tools catalog`);
    assert.doesNotMatch(html, /batch\//, `${file} names a runner path`);
  }
});

test('the wiki server revalidates the shared theme chrome', async () => {
  const {createWikiServer} = await import('../serve.mjs');
  const server = createWikiServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const route of ['/theme.css', '/theme.js']) {
      const first = await fetch(base + route);
      const body = await first.text();
      assert.equal(first.status, 200, `${route} did not serve`);
      assert.ok(body.length > 1000, `${route} came back short`);
      assert.equal(first.headers.get('cache-control'), 'no-cache', `${route} may be cached without revalidating`);
      const tag = first.headers.get('etag');
      assert.ok(tag, `${route} carries no validator`);
      const again = await fetch(base + route, {headers: {'If-None-Match': tag}});
      assert.equal(again.status, 304, `${route} was not revalidated`);
      assert.equal(await again.text(), '', `${route} sent a body with its 304`);
      const stale = await fetch(base + route, {headers: {'If-None-Match': 'W/"0-0"'}});
      assert.equal(stale.status, 200, `${route} refused an out-of-date tag`);
      await stale.text();
    }
    // The allowlist branch is checked before safe(), which roots at this folder: a page still serves.
    const page = await fetch(`${base}/woodcutting.html`);
    assert.equal(page.status, 200);
    assert.ok((await page.text()).includes('Woodcutting'));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('wiki sidebar lists every page by shelf with a finder, contents and the latest news', async () => {
  const [js, css] = await Promise.all([
    readFile(path.join(root, 'site.js'), 'utf8'),
    readFile(path.join(root, 'style.css'), 'utf8'),
  ]);
  assert.match(js, /function mountSidebar\(\)/);
  assert.match(js, /side\.className = 'wiki-side';/);
  assert.match(js, /shell\.className = 'wiki-shell';/);
  assert.match(js, /href: '\/news\.html',\s*title: 'The Hearth Post, issue 1'/);
  assert.match(js, /summary\.textContent = 'On this page';/);
  assert.match(js, /input\.placeholder = 'Find a page';/);
  assert.match(js, /openAll\.textContent = 'Open all';/);
  assert.match(js, /closeAll\.textContent = 'Close all';/);
  // Remembered open shelves are a convenience: storage access is guarded.
  assert.match(js, /try \{ localStorage\.setItem\(SIDE_OPEN_KEY/);
  // Docked at 1024px and up (header shelves step aside), a drawer below that.
  assert.match(css, /\.wiki-shell\{display:grid;grid-template-columns:268px/);
  assert.match(css, /body\.has-side header>\.gh-tool-rail\{display:none\}/);
  assert.match(css, /body\.side-open \.wiki-side\{transform:none\}/);
});

test('the Hearth Post newsletter tells the 23-24 September story and is linked from the hub', async () => {
  const [news, hub] = await Promise.all([
    readFile(path.join(root, 'news.html'), 'utf8'),
    readFile(path.join(root, 'index.html'), 'utf8'),
  ]);
  assert.match(news, /<h1>The Hearth Post<\/h1>/);
  assert.match(news, /Issue 1 - 23 and 24 September 2026/);
  for (const story of ['gear-forge', 'festive', 'smithing', 'coins', 'creatures', 'friends', 'fixes', 'worlds', 'workshop']) {
    assert.match(news, new RegExp(`class="story[^"]*" id="${story}"`), `news.html is missing the ${story} story`);
  }
  // Numbers pinned to the changelog: 728 Rust + 627 Node + 16 Python.
  assert.match(news, /<b>1,371<\/b><span>tests passing<\/span>/);
  assert.match(news, /728 Rust, 627 Node and 16 Python/);
  assert.match(news, /version 0\.1\.12|Version <b>0\.1\.12<\/b>/);
  assert.ok(hub.includes('href="/news.html"'), 'index.html does not link the newsletter');
  assert.match(hub, /class="home-news"/);
});
