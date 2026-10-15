// [TRACE: DOCS/SCRATCHPAD.md] Wiki chrome: brand jump dropdown + a row of labelled icon shelves, built
// from one PAGES list so a new article registers in a single place. Same class contract as
// developers/map-maker/dist/tools-jump.js (.brand-cluster, .tool-jump, .gh-tool-rail), so the shared
// rail styles in developers/theme/theme.css apply here too. Icons are inline SVG paths: these pages
// stay ASCII-only, so no Unicode glyph may be used as an icon.
//
// This wiki is private for now, so the header also carries the sibling Greenhaven pages (tools hub,
// map painter, live atlas, launch panel). Their host comes from location.hostname, never
// a hardcoded loopback literal, so a copy running on another host still reaches its neighbours on the
// default local band. Flip SIBLINGS to an empty list to make the pages publish-ready again.
(function () {
  const ICONS = {
    home: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13.4 2.6C7.8 2.4 3.4 4.8 3.4 9.4c0 1.2.3 2.2.9 3L2.8 13.9l.9.9 1.5-1.5c.8.6 1.8.9 3 .9 4.6 0 6.2-4.6 5.2-11.6z"/></svg>',
    news: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.6 3.4h8.8v9.2H3.8a1.2 1.2 0 0 1-1.2-1.2z"/><path d="M11.4 6h2v5.4a1.2 1.2 0 0 1-2.4 0"/><path d="M4.6 5.8h4.8M4.6 8h4.8M4.6 10.2h3"/></svg>',
    woodcutting: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.6 4.7 6.5h1.6L3.1 11.1h4.2v3.3h1.4v-3.3h4.2L9.7 6.5h1.6z"/></svg>',
    mining: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 12.8 8 3.2l4.8 9.6H3.2z"/><path d="M5.6 10.4h4.8"/></svg>',
    fishing: '<svg viewBox="0 0 16 16" aria-hidden="true"><ellipse cx="7" cy="8" rx="4.6" ry="3.2"/><path d="M11.2 8 14.4 5.6v4.8z"/><circle cx="5.2" cy="7.2" r="0.9"/></svg>',
    stride: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 12.4 6.8 3.6h2.4L12.8 12.4h-2.2l-.7-1.8H6.1l-.7 1.8z"/><path d="M6.6 8.8h2.8"/></svg>',
    experience: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 13.6h12.2"/><path d="M2.8 11.4 6.4 7.8l2.4 2.4 4.6-4.8"/><path d="M10.6 5.2h3.2v3.2"/></svg>',
    smithing: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 14V8a4 4 0 0 1 8 0v6"/><path d="M2.6 14h3.2M10.2 14h3.2"/></svg>',
    combat: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3.2 11.6 11.2M13 3.2 4.4 11.2"/><path d="M2 9.6 6.4 14M14 9.6 9.6 14"/></svg>',
    digging: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h8v4a4 4 0 0 1-8 0z"/><path d="M8 11v3"/><path d="M6 14h4"/></svg>',
    equipment: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4h8l1 8H3z"/><path d="M6 4V2.6a2 2 0 0 1 4 0V4"/></svg>',
    coins: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.4"/><circle cx="8" cy="8" r="3"/><path d="M8 5v6"/></svg>',
    npcs: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.4" r="2.2"/><path d="M3.4 13c.7-2.5 2.4-3.8 4.6-3.8s3.9 1.3 4.6 3.8"/></svg>',
    capes: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h6l1.6 9.4a2 2 0 0 1-1.1 2.2L8 12.4l-3.5 2.2a2 2 0 0 1-1.1-2.2z"/><path d="M5 3a3 3 0 0 0 6 0"/></svg>',
    chat: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.6 3.4h10.8v7H9.4L6.4 13.4v-3H2.6z"/><path d="M5 6h6M5 8.2h4"/></svg>',
    guilds: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2 3 4v4.2c0 2.5 2 4.4 5 5.6 3-1.2 5-3.1 5-5.6V4z"/><path d="M6.4 8.2 7.6 9.4l2.8-3"/></svg>',
    friends: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="5.6" r="2.1"/><path d="M2.4 13.2c.6-2.4 1.9-3.6 3.6-3.6s3 1.2 3.6 3.6"/><circle cx="11.6" cy="6.4" r="1.6"/><path d="M10.8 10.1c1.5.1 2.6 1.3 3.1 3.3"/></svg>',
    pets: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="4.4" cy="6" r="1.4"/><circle cx="11.6" cy="6" r="1.4"/><circle cx="2.4" cy="9.4" r="1.4"/><circle cx="13.6" cy="9.4" r="1.4"/><path d="M8 8.4c-1.8 0-3.2 1.6-3.2 3.2S6.2 14 8 14s3.2-.8-1.8 3.2S9.8 8.4 8 8.4z" transform="translate(0 -2.2)"/></svg>',
    crouch: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="4" r="1.6"/><path d="M8 5.6v3.4M5.6 13.4 8 9l2.4 4.4M5.6 8.4 8 6.8l2.4 1.6"/></svg>',
    creatures: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 12c0-3 2-5.4 5-5.4s5 2.4 5 5.4"/><circle cx="6" cy="8" r="0.7"/><circle cx="10" cy="8" r="0.7"/><path d="M5.4 4.6 4 2.4M10.6 4.6 12 2.4"/></svg>',
    gallery: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.2" width="12" height="9.6" rx="1"/><path d="M2.4 11 5.6 8l2 2 2.8-3 3.2 4"/><circle cx="11" cy="6" r="0.9"/></svg>',
    seasonal: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8 11 6h-1.8L12.4 9.8H3.6L6.8 6H5z"/><path d="M7.2 9.8h1.6v2.6a0.8 0.8 0 0 1-1.6 0z"/></svg>',
    halloween: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.4c.4-1 1.2-1.4 2-1.2-.2.8-.8 1.2-1.4 1.4"/><ellipse cx="8" cy="9.4" rx="5" ry="4"/><path d="M8 5.6v7.4M5 6.4c-.6 1.8-.6 4 0 5.8M11 6.4c.6 1.8.6 4 0 5.8"/><path d="M5.8 8.6 6.8 9.8 5.8 11M10.2 8.6 9.2 9.8 10.2 11"/></svg>',
    items: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.6 5.4 8 2.6l5.4 2.8v5.4L8 13.6l-5.4-2.8z"/><path d="M2.6 5.4 8 8.2l5.4-2.8M8 8.2v5.4"/></svg>',
    forge: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h10l-1.4 5.4a3 3 0 0 1-2.8 2.2H7.2a3 3 0 0 1-2.8-2.2z"/><path d="M6.4 12.4h3.2v1.4h-3.2z"/></svg>',
    terrain: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 12 5 7l3 3 2-2 4 4z"/><path d="M2 14h12"/></svg>',
    props: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v6"/><path d="M4 3h8v4H4z"/><path d="M3 13h10v-3l-5-2-5 2z"/></svg>',
    firstperson: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.4" r="2.4"/><path d="M3.4 13.6c.7-2.6 2.4-4 4.6-4s3.9 1.4 4.6 4"/></svg>',
    account: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.4" width="12" height="9.2" rx="1"/><circle cx="6" cy="7.4" r="1.4"/><path d="M3.6 11.4c.5-1.2 1.3-1.8 2.4-1.8s1.9.6 2.4 1.8"/><path d="M10 6.8h3M10 9h3"/></svg>',
    settings: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.4"/><path d="M8 1.8v2M8 12.2v2M14.2 8h-2M3.8 8h-2M12.3 3.7l-1.4 1.4M5.1 11l-1.4 1.4M12.3 12.3l-1.4-1.4M5.1 5.1 3.7 3.7"/></svg>',
    music: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12V3.6l6-1.4v8"/><circle cx="4.4" cy="12" r="1.6"/><circle cx="10.4" cy="10.4" r="1.6"/></svg>',
    painter: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11.4 2.4 13.6 4.6 6 12.2 3 13l.8-3z"/><path d="M2 14.4h6"/></svg>',
    crash: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.2" y="4.8" width="5.6" height="8.2" rx="2.8"/><path d="M6.4 4.6 8 6.2l1.6-1.6M8 6.2v6.8"/><path d="M5.2 7.4 2.4 6.2M5.2 9.6H2.2M5.2 11.8 2.4 13M10.8 7.4l2.8-1.2M10.8 9.6h3M10.8 11.8 13.6 13"/></svg>',
    contributing: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.6h6.4l2.4 2.4v8.4H4z"/><path d="M6.2 7h5M6.2 9.2h5M6.2 11.4h3"/></svg>',
    themes: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.4a5.6 5.6 0 0 0 0 11.2c1 0 1.6-.6 1.6-1.4 0-.4-.2-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.6-1.4 1.4-1.4h1.2c1.6 0 2.6-1 2.6-2.6 0-2.4-2.6-3.8-6-3.8z"/><circle cx="5" cy="7" r="0.9"/><circle cx="8" cy="5" r="0.9"/><circle cx="11" cy="7" r="0.9"/></svg>',
    wakeup: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.4 11.4h11.2"/><path d="M5.4 11.4 8 4.6l2.6 6.8"/><path d="M6.8 6.4c1.4-1 2.8-1 4.2 0"/><path d="M11.6 3.6 12.8 2.4M13.6 5.6h1.4M11.6 7.6l1.2 1.2"/></svg>',
    cursors: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.4 12 8.4l-3.2.6 1.8 3.6-1.6.8-1.8-3.6-2.8 2.2z"/></svg>',
    remis: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="6" cy="6" r="1.4"/><circle cx="10" cy="6" r="1.4"/><circle cx="4" cy="9.6" r="1.4"/><circle cx="12" cy="9.6" r="1.4"/><path d="M8 4v8"/></svg>',
    monetization: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.4 10.4 6.4l4 1.4-2.6 3.4v3.4H4.2v-3.4L1.6 7.8l4-1.4z"/><path d="M6 10.4a2 2 0 0 0 4 0"/></svg>',
    packs: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.4" y="5.6" width="11.2" height="7.8" rx="0.6"/><path d="M2.4 8.2h11.2M8 5.6v7.8"/><path d="M5.6 5.6 4 3.2h2.6zM10.4 5.6 12 3.2H9.4z"/></svg>',
    wood: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h12M2 9h12M2 12h12"/><path d="M4 4v10M12 4v10"/></svg>',
    floors: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2" width="12" height="12" rx="0.6"/><path d="M2 6h12M2 10h12M6 2v12M10 2v12"/></svg>',
    gearforge: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11 2.4 13.6 5 12 6.6 9.4 4z"/><path d="M9.4 4 4.6 8.8l-1.2 3.8 3.8-1.2z"/></svg>',
    guifirst: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2.6" width="12" height="10.8" rx="0.8"/><path d="M2 6h12"/><path d="M5 8.8h6M5 11h4"/></svg>',
    adminpanel: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.6 4.6h10.8M2.6 11.4h10.8"/><circle cx="6" cy="4.6" r="1.7"/><circle cx="10.6" cy="11.4" r="1.7"/></svg>',
    bosses: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.4 12 4 6l4 2.4L12 6l1.6 6z"/><path d="M6.4 12 8 8.4l1.6 3.6"/></svg>',
    layers: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.4 13.6 5.4 8 8.4 2.4 5.4z"/><path d="M2.4 8.4 8 11.4l5.6-3"/><path d="M2.4 11.4 8 14.4l5.6-3"/></svg>',
    worlds: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.8"/><ellipse cx="8" cy="8" rx="2.6" ry="5.8"/><path d="M2.4 6h11.2M2.4 10h11.2"/></svg>',
    shippingmap: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3.4 6.4 5.6 9.6 3.4 14 5.6v7l-4.4-2.2-3.2 2.2L2 10.4z"/><path d="M6.4 5.6v7M9.6 3.4v7"/></svg>',
    auth: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.4" y="7" width="9.2" height="6.6" rx="1"/><path d="M5.4 7V4.8a2.6 2.6 0 0 1 5.2 0V7"/><circle cx="8" cy="10.4" r="0.8"/></svg>',
    hub: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.4 7.6 8 2.8l5.6 4.8"/><path d="M4 6.4v7h8v-7"/><path d="M6.8 13.4v-3.2h2.4v3.2"/></svg>',
    map: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.8" y="1.8" width="5.4" height="5.4" rx="0.6"/><rect x="8.8" y="1.8" width="5.4" height="5.4" rx="0.6"/><rect x="1.8" y="8.8" width="5.4" height="5.4" rx="0.6"/><rect x="8.8" y="8.8" width="5.4" height="5.4" rx="0.6"/></svg>',
    atlas: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.4"/><ellipse cx="8" cy="8" rx="2.2" ry="5.4"/><path d="M2.6 8h10.8"/></svg>',
    panel: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.6 4.6h10.8M2.6 11.4h10.8"/><circle cx="6" cy="4.6" r="1.7"/><circle cx="10.6" cy="11.4" r="1.7"/></svg>',
    transmog: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4h8l1 8H3z"/><path d="M6 4V2.6a2 2 0 0 1 4 0V4"/><path d="M11 10.4c1.5 0 2.4 1 2.4 2.2S12.5 14.8 11 14.8"/></svg>',
    gearfx: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.4 12.6 12 4"/><path d="M8.4 2.4 9.6 4.6l2.2 1.2-2.2 1.2L8.4 9.2 7.2 7 5 5.8l2.2-1.2z"/><path d="M12.4 10.4 13.6 12.6l-1.2-.4-.4-1.2.4-1.2 1.2-.4z"/></svg>',
    playermenu: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.4 12 8.4l-3.2.6 1.8 3.6-1.6.8-1.8-3.6-2.8 2.2z"/><rect x="8.4" y="2.4" width="6" height="5.4" rx="0.8"/></svg>',
    playersheet: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="2.6" width="12" height="10.8" rx="0.8"/><path d="M2 6h12"/><path d="M4.8 3.6h1M7.4 3.6h1M4.8 8.4h6.4M4.8 10.6h4"/></svg>',
  };
  const PAGES = [
    {href: 'index.html', match: /^\/(index\.html)?$/, label: 'Wiki home', icon: 'home', group: 'home'},
    {href: 'news.html', match: /^\/news\.html$/, label: 'The Hearth Post', icon: 'news', group: 'home'},
    {href: 'woodcutting.html', match: /^\/woodcutting\.html$/, label: 'Woodcutting', icon: 'woodcutting', group: 'skills'},
    {href: 'mining.html', match: /^\/mining\.html$/, label: 'Mining', icon: 'mining', group: 'skills'},
    {href: 'fishing.html', match: /^\/fishing\.html$/, label: 'Fishing', icon: 'fishing', group: 'skills'},
    {href: 'smithing.html', match: /^\/smithing\.html$/, label: 'Smithing', icon: 'smithing', group: 'skills'},
    {href: 'firemaking.html', match: /^\/firemaking\.html$/, label: 'Firemaking', icon: 'smithing', group: 'skills'},
    {href: 'cooking.html', match: /^\/cooking\.html$/, label: 'Cooking', icon: 'fishing', group: 'skills'},
    {href: 'holy.html', match: /^\/holy\.html$/, label: 'Holy', icon: 'combat', group: 'skills'},
    {href: 'combat.html', match: /^\/combat\.html$/, label: 'Combat', icon: 'combat', group: 'skills'},
    {href: 'digging.html', match: /^\/digging\.html$/, label: 'Digging', icon: 'digging', group: 'skills'},
    {href: 'stride.html', match: /^\/stride\.html$/, label: 'Stride', icon: 'stride', group: 'skills'},
    {href: 'experience.html', match: /^\/experience\.html$/, label: 'Experience', icon: 'experience', group: 'skills'},
    {href: 'equipment.html', match: /^\/equipment\.html$/, label: 'Equipment', icon: 'equipment', group: 'gear'},
    {href: 'items.html', match: /^\/items\.html$/, label: 'Items', icon: 'items', group: 'gear'},
    {href: 'capes.html', match: /^\/capes\.html$/, label: 'Capes', icon: 'capes', group: 'gear'},
    {href: 'coins.html', match: /^\/coins\.html$/, label: 'Coins', icon: 'coins', group: 'gear'},
    {href: 'monetization.html', match: /^\/monetization\.html$/, label: 'Crystal Store', icon: 'monetization', group: 'gear'},
    {href: 'transmog.html', match: /^\/transmog\.html$/, label: 'Change Look', icon: 'transmog', group: 'gear'},
    {href: 'npcs.html', match: /^\/npcs\.html$/, label: 'NPCs and Shops', icon: 'npcs', group: 'folk'},
    {href: 'creatures.html', match: /^\/creatures\.html$/, label: 'Creatures', icon: 'creatures', group: 'folk'},
    {href: 'bosses.html', match: /^\/bosses\.html$/, label: 'Bosses', icon: 'bosses', group: 'folk'},
    {href: 'pets.html', match: /^\/pets\.html$/, label: 'Pets', icon: 'pets', group: 'folk'},
    {href: 'chat.html', match: /^\/chat\.html$/, label: 'Chat', icon: 'chat', group: 'folk'},
    {href: 'friends.html', match: /^\/friends\.html$/, label: 'Friends', icon: 'friends', group: 'folk'},
    {href: 'guilds.html', match: /^\/guilds\.html$/, label: 'Guilds', icon: 'guilds', group: 'folk'},
    {href: 'player-menu.html', match: /^\/player-menu\.html$/, label: 'Player Menu', icon: 'playermenu', group: 'folk'},
    {href: 'shipping-map.html', match: /^\/shipping-map\.html$/, label: 'The Shipping Map', icon: 'shippingmap', group: 'world'},
    {href: 'player-sheet.html', match: /^\/player-sheet\.html$/, label: 'Player Sheet', icon: 'playersheet', group: 'world'},
    {href: 'crouch.html', match: /^\/crouch\.html$/, label: 'Crouch', icon: 'crouch', group: 'world'},
    {href: 'first-person.html', match: /^\/first-person\.html$/, label: 'First Person', icon: 'firstperson', group: 'world'},
    {href: 'wake-up.html', match: /^\/wake-up\.html$/, label: 'Wake-Up', icon: 'wakeup', group: 'world'},
    {href: 'seasonal.html', match: /^\/seasonal\.html$/, label: 'Seasonal', icon: 'seasonal', group: 'world'},
    {href: 'halloween.html', match: /^\/halloween\.html$/, label: 'Halloween', icon: 'halloween', group: 'world'},
    {href: 'remis.html', match: /^\/remis\.html$/, label: 'Rots and Tots', icon: 'remis', group: 'world'},
    {href: 'music.html', match: /^\/music\.html$/, label: 'Music', icon: 'music', group: 'world'},
    {href: 'gallery.html', match: /^\/gallery\.html$/, label: 'Gallery', icon: 'gallery', group: 'world'},
    {href: 'cursors.html', match: /^\/cursors\.html$/, label: 'Cursors', icon: 'cursors', group: 'world'},
    {href: 'account.html', match: /^\/account\.html$/, label: 'Accounts', icon: 'account', group: 'backstage'},
    {href: 'settings.html', match: /^\/settings\.html$/, label: 'Settings', icon: 'settings', group: 'backstage'},
    {href: 'crash-codes.html', match: /^\/crash-codes\.html$/, label: 'Crash Codes', icon: 'crash', group: 'backstage'},
    {href: 'builders.html', match: /^\/builders\.html$/, label: 'Builder Wiki', icon: 'forge', group: 'bhome'},
    {href: 'map-maker.html', match: /^\/map-maker\.html$/, label: 'Map Painter', icon: 'painter', group: 'tools'},
    {href: 'gear-forge.html', match: /^\/gear-forge\.html$/, label: 'Gear Forge', icon: 'gearforge', group: 'tools'},
    {href: 'character-forge.html', match: /^\/character-forge\.html$/, label: 'Character Forge', icon: 'forge', group: 'tools'},
    {href: 'atlas.html', match: /^\/atlas\.html$/, label: 'Live Atlas', icon: 'atlas', group: 'tools'},
    {href: 'admin-panel.html', match: /^\/admin-panel\.html$/, label: 'Admin Panel', icon: 'adminpanel', group: 'tools'},
    {href: 'terrain.html', match: /^\/terrain\.html$/, label: 'Terrain', icon: 'terrain', group: 'building'},
    {href: 'floors-and-walls.html', match: /^\/floors-and-walls\.html$/, label: 'Floors and Walls', icon: 'floors', group: 'building'},
    {href: 'wood-and-ramps.html', match: /^\/wood-and-ramps\.html$/, label: 'Wood and Ramps', icon: 'wood', group: 'building'},
    {href: 'props.html', match: /^\/props\.html$/, label: 'Signs and Chests', icon: 'props', group: 'building'},
    {href: 'props-packs.html', match: /^\/props-packs\.html$/, label: 'Prop Packs', icon: 'packs', group: 'building'},
    {href: 'layers.html', match: /^\/layers\.html$/, label: 'Gear Layers', icon: 'layers', group: 'building'},
    {href: 'gear-fx.html', match: /^\/gear-fx\.html$/, label: 'Gear Effects', icon: 'gearfx', group: 'building'},
    {href: 'gui-first.html', match: /^\/gui-first\.html$/, label: 'GUI-first Law', icon: 'guifirst', group: 'house'},
    {href: 'contributing.html', match: /^\/contributing\.html$/, label: 'Contributing', icon: 'contributing', group: 'house'},
    {href: 'themes.html', match: /^\/themes\.html$/, label: 'Theme Packs', icon: 'themes', group: 'house'},
    {href: 'worlds.html', match: /^\/worlds\.html$/, label: 'Worlds', icon: 'worlds', group: 'servers'},
    {href: 'auth.html', match: /^\/auth\.html$/, label: 'Accounts and Passwords', icon: 'auth', group: 'servers'},
  ];
  // Shelf order and the friendly name each shelf wears in the rail and the dropdown. A page's
  // `group` must be one of these ids; its place inside the shelf follows its place in PAGES.
  const GROUPS = [
    {id: 'home', label: ''},
    {id: 'skills', label: 'Skills'},
    {id: 'gear', label: 'Gear and coin'},
    {id: 'folk', label: 'Folk and critters'},
    {id: 'world', label: 'Around the world'},
    {id: 'backstage', label: 'Account and help'},
    {id: 'bhome', label: '', builders: true},
    {id: 'tools', label: 'Builder tools', builders: true},
    {id: 'building', label: 'World building', builders: true},
    {id: 'house', label: 'House rules', builders: true},
    {id: 'servers', label: 'Servers', builders: true},
  ];
  const LOCAL = {tools: 6001, panel: 6003};
  function neighbour(port, path) {
    return location.protocol + '//' + location.hostname + ':' + port + path;
  }
  const SIBLINGS = [
    {href: neighbour(LOCAL.tools, '/'), label: 'World tools', icon: 'hub'},
    {href: neighbour(LOCAL.tools, '/map-maker/'), label: 'Map painter', icon: 'map'},
    {href: neighbour(LOCAL.tools, '/atlas/'), label: 'Live atlas', icon: 'atlas'},
    {href: neighbour(LOCAL.panel, '/'), label: 'Launch panel', icon: 'panel'},
  ];

  function currentPage() {
    let path = location.pathname;
    try { path = decodeURIComponent(path); } catch { /* keep the raw path */ }
    // Strip the base path so matches work on GitHub Pages (/greenhaven-wiki/x.html -> /x.html)
    const local = '/' + path.split('/').pop();
    return PAGES.find((page) => page.match.test(local)) || PAGES[0];
  }

  // The wiki is two books on one shelf: the player wiki and the Builder Wiki. Chrome only ever
  // shows the shelves of the book you are in, plus one link across to the other.
  function onBuilders() {
    const group = GROUPS.find((item) => item.id === currentPage().group);
    return !!(group && group.builders);
  }
  function sideGroups() {
    const builders = onBuilders();
    return GROUPS.filter((group) => !!group.builders === builders);
  }
  function crossPage() {
    return onBuilders() ? PAGES[0] : PAGES.find((page) => page.href === 'builders.html');
  }

  function markLink(link, page) {
    if (page !== currentPage()) return;
    link.setAttribute('aria-current', 'page');
  }

  function railLink(item) {
    const link = document.createElement('a');
    link.href = item.href;
    // data-tip, not title: the native title tooltip waits about a second; style.css shows this
    // one on hover with no delay.
    link.dataset.tip = item.label;
    link.setAttribute('aria-label', item.label);
    link.innerHTML = ICONS[item.icon];
    markLink(link, item);
    return link;
  }

  // One shelf = a labelled pill of round icon links.
  function railShelf(label, items) {
    const group = document.createElement('span');
    group.className = 'gh-tool-rail-group';
    if (label) {
      const name = document.createElement('span');
      name.className = 'gh-tool-rail-label';
      name.setAttribute('aria-hidden', 'true');
      name.textContent = label;
      group.appendChild(name);
    }
    for (const item of items) group.appendChild(railLink(item));
    return group;
  }

  function mountRail() {
    if (document.querySelector('.gh-tool-rail')) return;
    const header = document.querySelector('header');
    if (!header) return;
    const rail = document.createElement('nav');
    rail.className = 'gh-tool-rail';
    rail.setAttribute('aria-label', 'Wiki pages and Greenhaven pages');
    for (const group of sideGroups()) {
      const items = PAGES.filter((page) => page.group === group.id);
      if (items.length) rail.appendChild(railShelf(group.label, items));
    }
    if (SIBLINGS.length) {
      const sep = document.createElement('span');
      sep.className = 'gh-tool-rail-sep';
      sep.setAttribute('aria-hidden', 'true');
      rail.appendChild(sep);
      rail.appendChild(railShelf('Workshop', SIBLINGS));
    }
    header.appendChild(rail);
  }

  // The hub drops its WIKI badge for the current page name plus a caret, and the dropdown lists the
  // sibling pages. The <small> stays in the HTML so a copy without this script still reads "WIKI".
  function mountJump() {
    if (document.querySelector('.tool-jump')) return;
    const header = document.querySelector('header');
    const brand = header && header.querySelector('a.brand');
    if (!brand) return;
    const small = brand.querySelector('small');
    if (small) small.remove();

    const cluster = document.createElement('div');
    cluster.className = 'brand-cluster';
    const jump = document.createElement('details');
    jump.className = 'tool-jump';
    const summary = document.createElement('summary');
    summary.textContent = currentPage().label;
    summary.setAttribute('aria-label', 'Wiki pages. Current: ' + currentPage().label);
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Wiki pages');
    for (const group of sideGroups()) {
      const items = PAGES.filter((page) => page.group === group.id);
      if (!items.length) continue;
      if (group.label) {
        const head = document.createElement('span');
        head.className = 'tool-jump-head';
        head.textContent = group.label;
        nav.appendChild(head);
      }
      for (const page of items) {
        const link = document.createElement('a');
        link.href = page.href;
        link.textContent = page.label;
        markLink(link, page);
        nav.appendChild(link);
      }
    }
    const cross = document.createElement('a');
    cross.className = 'tool-jump-cross';
    cross.href = crossPage().href;
    cross.textContent = onBuilders() ? 'Back to the player wiki' : 'Open the Builder Wiki';
    nav.appendChild(cross);
    if (SIBLINGS.length) {
      const head = document.createElement('span');
      head.className = 'tool-jump-head';
      head.textContent = 'Greenhaven pages';
      nav.appendChild(head);
      for (const sibling of SIBLINGS) {
        const link = document.createElement('a');
        link.href = sibling.href;
        link.textContent = sibling.label;
        nav.appendChild(link);
      }
    }
    jump.append(summary, nav);
    brand.replaceWith(cluster);
    cluster.append(brand, jump);

    document.addEventListener('click', (event) => {
      if (!jump.contains(event.target)) jump.open = false;
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') jump.open = false;
    });
  }

  // Catalog pages (wiki home, Builder Wiki): a search box in the head that filters the shelf index
  // as you type, hiding shelves with no match. Plain text match over each entry's title and blurb;
  // Enter opens the first match. Nothing leaves the page.
  function mountFinder() {
    const catalog = document.querySelector('main .catalog');
    const head = document.querySelector('main .home-head');
    if (!catalog || !head || document.querySelector('.finder')) return;
    const entries = [...catalog.querySelectorAll('.index li')];
    const shelves = [...catalog.querySelectorAll('.shelf')];
    const finder = document.createElement('label');
    finder.className = 'finder';
    finder.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor"/><path d="M10.4 10.4 14 14"/></svg>';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = onBuilders() ? 'Search builder pages: painter, tiles, forge...' : 'Search the wiki: fishing, pets, capes...';
    input.setAttribute('aria-label', 'Search wiki topics');
    finder.appendChild(input);
    const empty = document.createElement('p');
    empty.className = 'finder-empty';
    empty.textContent = 'Nothing here by that name yet - try another word.';
    empty.hidden = true;
    const filter = () => {
      const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      for (const entry of entries) {
        const text = entry.textContent.toLowerCase();
        entry.hidden = !words.every((word) => text.includes(word));
        if (!entry.hidden) shown += 1;
      }
      for (const shelf of shelves) shelf.hidden = !shelf.querySelector('.index li:not([hidden])');
      empty.hidden = shown > 0;
      catalog.classList.toggle('is-filtered', words.length > 0);
    };
    input.addEventListener('input', filter);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const first = catalog.querySelector('.index li:not([hidden]) a');
        if (first && input.value.trim()) location.href = first.href;
      } else if (event.key === 'Escape' && input.value) {
        input.value = '';
        filter();
      }
    });
    const lede = head.querySelector('.lede');
    (lede || head.firstElementChild).after(finder);
    catalog.prepend(empty);
  }

  // The newest Hearth Post issue, shown as the card at the top of the sidebar. Bump with each issue.
  const LATEST_NEWS = {
    href: 'news.html',
    title: 'The Hearth Post, issue 2',
    blurb: 'Version 0.1.14: monsters fight back, day and night, Halloween moves in.',
  };
  const SIDE_OPEN_KEY = 'gh-wiki-side-open';

  // localStorage can throw (private windows, blocked site data); the sidebar works without it.
  function readOpenGroups() {
    try {
      const ids = JSON.parse(localStorage.getItem(SIDE_OPEN_KEY) || 'null');
      return Array.isArray(ids) ? ids : null;
    } catch { return null; }
  }
  function writeOpenGroups(ids) {
    try { localStorage.setItem(SIDE_OPEN_KEY, JSON.stringify(ids)); } catch { /* not saved */ }
  }

  function sideLink(item) {
    const link = document.createElement('a');
    link.className = 'side-link';
    link.href = item.href;
    link.innerHTML = ICONS[item.icon];
    const text = document.createElement('span');
    text.textContent = item.label;
    link.appendChild(text);
    markLink(link, item);
    return link;
  }

  function sideGroup(id, label, items, open) {
    const group = document.createElement('details');
    group.className = 'side-group';
    group.dataset.group = id;
    group.open = open;
    const summary = document.createElement('summary');
    summary.textContent = label;
    const count = document.createElement('span');
    count.className = 'side-count';
    count.textContent = String(items.length);
    summary.appendChild(count);
    group.appendChild(summary);
    for (const item of items) group.appendChild(sideLink(item));
    return group;
  }

  // "On this page": one link per h2 in the article, with a scroll spy marking the section in view.
  function sideContents(main) {
    const heads = [...main.querySelectorAll('.page h2')];
    if (heads.length < 2) return null;
    const box = document.createElement('details');
    box.className = 'side-group side-toc';
    box.open = true;
    const summary = document.createElement('summary');
    summary.textContent = 'On this page';
    box.appendChild(summary);
    const links = new Map();
    for (const head of heads) {
      if (!head.id) {
        head.id = head.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
      }
      const link = document.createElement('a');
      link.className = 'side-link';
      link.href = '#' + head.id;
      link.textContent = head.textContent;
      box.appendChild(link);
      links.set(head, link);
    }
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          for (const link of links.values()) link.classList.remove('is-here');
          links.get(entry.target).classList.add('is-here');
        }
      }, {rootMargin: '0px 0px -70% 0px'});
      for (const head of heads) spy.observe(head);
    }
    return box;
  }

  // Left sidebar: latest news, a page finder, open/close-all controls, every page under its
  // shelf name, the current article's contents, and the sibling Greenhaven pages. On narrow screens
  // it becomes a drawer opened by the Contents button in the header.
  function mountSidebar() {
    const main = document.querySelector('body > main');
    const header = document.querySelector('header');
    if (!main || !header || document.querySelector('.wiki-side')) return;
    const here = currentPage();
    const remembered = readOpenGroups();

    const side = document.createElement('aside');
    side.className = 'wiki-side';
    side.id = 'wiki-side';
    side.setAttribute('aria-label', 'Wiki sidebar');

    const news = document.createElement('a');
    news.className = 'side-news';
    news.href = LATEST_NEWS.href;
    if (here.href === LATEST_NEWS.href) news.setAttribute('aria-current', 'page');
    news.innerHTML = '<span class="side-news-kicker">Latest news</span>';
    const newsTitle = document.createElement('b');
    newsTitle.textContent = LATEST_NEWS.title;
    const newsBlurb = document.createElement('span');
    newsBlurb.textContent = LATEST_NEWS.blurb;
    news.append(newsTitle, newsBlurb);
    side.appendChild(news);

    const contents = sideContents(main);
    if (contents) side.appendChild(contents);

    const find = document.createElement('label');
    find.className = 'side-find';
    find.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/></svg>';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Find a page';
    input.setAttribute('aria-label', 'Find a wiki page');
    find.appendChild(input);
    side.appendChild(find);

    const tools = document.createElement('div');
    tools.className = 'side-tools';
    const openAll = document.createElement('button');
    openAll.type = 'button';
    openAll.textContent = 'Open all';
    const closeAll = document.createElement('button');
    closeAll.type = 'button';
    closeAll.textContent = 'Close all';
    tools.append(openAll, closeAll);
    side.appendChild(tools);

    const nav = document.createElement('nav');
    nav.className = 'side-nav';
    nav.setAttribute('aria-label', 'All wiki pages');
    const groups = [];
    for (const group of sideGroups()) {
      const items = PAGES.filter((page) => page.group === group.id);
      if (!items.length) continue;
      if (!group.label) {
        for (const item of items) nav.appendChild(sideLink(item));
        const cross = sideLink(crossPage());
        cross.classList.add('side-cross');
        cross.querySelector('span').textContent = onBuilders() ? 'Back to the player wiki' : 'Builder Wiki';
        nav.appendChild(cross);
        continue;
      }
      const open = remembered ? remembered.includes(group.id) : here.group === group.id;
      const box = sideGroup(group.id, group.label, items, open || here.group === group.id);
      groups.push(box);
      nav.appendChild(box);
    }
    if (SIBLINGS.length) {
      const box = sideGroup('workshop', 'Workshop', SIBLINGS, remembered ? remembered.includes('workshop') : false);
      groups.push(box);
      nav.appendChild(box);
    }
    side.appendChild(nav);

    const top = document.createElement('button');
    top.type = 'button';
    top.className = 'side-top';
    top.textContent = 'Back to top';
    top.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    side.appendChild(top);

    const save = () => writeOpenGroups(groups.filter((box) => box.open).map((box) => box.dataset.group));
    for (const box of groups) box.addEventListener('toggle', () => { if (!input.value) save(); });
    openAll.addEventListener('click', () => { for (const box of groups) box.open = true; save(); });
    closeAll.addEventListener('click', () => { for (const box of groups) box.open = false; save(); });

    // Typing opens every shelf and hides what does not match; clearing restores the saved layout.
    let before = null;
    input.addEventListener('input', () => {
      const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      if (words.length && !before) before = groups.map((box) => box.open);
      for (const link of nav.querySelectorAll('.side-link')) {
        const text = link.textContent.toLowerCase();
        link.hidden = !words.every((word) => text.includes(word));
      }
      groups.forEach((box, index) => {
        const shown = box.querySelectorAll('.side-link:not([hidden])').length;
        box.hidden = words.length > 0 && shown === 0;
        box.open = words.length ? true : (before ? before[index] : box.open);
      });
      if (!words.length) before = null;
    });

    const shell = document.createElement('div');
    shell.className = 'wiki-shell';
    main.before(shell);
    shell.append(side, main);
    document.body.classList.add('has-side');

    // Drawer toggle for narrow screens (hidden by CSS when the sidebar is docked).
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'side-toggle';
    toggle.setAttribute('aria-controls', 'wiki-side');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.6 4h10.8M2.6 8h10.8M2.6 12h10.8"/></svg><span>Contents</span>';
    const scrim = document.createElement('div');
    scrim.className = 'side-scrim';
    const setDrawer = (open) => {
      document.body.classList.toggle('side-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setDrawer(!document.body.classList.contains('side-open')));
    scrim.addEventListener('click', () => setDrawer(false));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setDrawer(false); });
    side.addEventListener('click', (event) => { if (event.target.closest('a')) setDrawer(false); });
    const actions = header.querySelector('.actions');
    if (actions) actions.prepend(toggle); else header.appendChild(toggle);
    document.body.appendChild(scrim);
  }

  // Each shelf wears its own hue on the catalog, crumbs and the pager. style.css mixes --shelf into
  // the active theme's panel and ink, so the tint stays readable in light and dark alike.
  const SHELF_HUE = {
    home: '#5a8a3a', skills: '#4f9a4a', gear: '#c08a2a', folk: '#c45a6a', world: '#3a86b8', backstage: '#6a7a88',
    bhome: '#8a5ac0', tools: '#8a5ac0', building: '#b0703a', house: '#3a8a86', servers: '#6a7a88',
  };
  function shelfOf(page) {
    return GROUPS.find((group) => group.id === page.group);
  }
  function tint(el, id) {
    if (SHELF_HUE[id]) el.style.setProperty('--shelf', SHELF_HUE[id]);
  }
  function isArticle() {
    return !!shelfOf(currentPage()).label && !!document.querySelector('main > article.page');
  }

  // Catalog pages: tint each shelf and its jump chip, and put the page's own icon on every entry.
  function decorateIndex() {
    for (const chip of document.querySelectorAll('.shelf-jump a[data-shelf]')) tint(chip, chip.dataset.shelf);
    for (const shelf of document.querySelectorAll('main .catalog .shelf')) {
      tint(shelf, shelf.id);
      for (const link of shelf.querySelectorAll('.index a')) {
        if (link.querySelector('.index-icon')) continue;
        const page = PAGES.find((item) => item.href === link.getAttribute('href'));
        if (!page) continue;
        const icon = document.createElement('span');
        icon.className = 'index-icon';
        icon.innerHTML = ICONS[page.icon];
        link.prepend(icon);
      }
    }
  }

  // One tab on the top bar crosses between the two books: "For builders" on the player wiki,
  // "Player wiki" on the Builder Wiki.
  function mountWikiSwitch() {
    const actions = document.querySelector('header .actions');
    if (!actions || document.querySelector('.wiki-switch')) return;
    const target = crossPage();
    const link = document.createElement('a');
    link.className = 'wiki-switch';
    link.href = target.href;
    link.innerHTML = ICONS[onBuilders() ? 'home' : 'forge'];
    const text = document.createElement('span');
    text.textContent = onBuilders() ? 'Player wiki' : 'For builders';
    link.appendChild(text);
    if (onBuilders()) link.classList.add('is-builders');
    actions.prepend(link);
  }

  // Articles: "Wiki home / Shelf / Page" above the eyebrow.
  function mountCrumbs() {
    if (!isArticle() || document.querySelector('.crumbs')) return;
    const here = currentPage();
    const crumbs = document.createElement('nav');
    crumbs.className = 'crumbs';
    crumbs.setAttribute('aria-label', 'Breadcrumb');
    tint(crumbs, here.group);
    const home = document.createElement('a');
    home.href = onBuilders() ? 'builders.html' : 'index.html';
    home.textContent = onBuilders() ? 'Builder Wiki' : 'Wiki home';
    const shelf = document.createElement('span');
    shelf.textContent = shelfOf(here).label;
    const page = document.createElement('span');
    page.setAttribute('aria-current', 'page');
    page.textContent = here.label;
    crumbs.append(home, shelf, page);
    document.querySelector('main > article.page').prepend(crumbs);
  }

  // A quiet # beside each section heading, shown on hover, so a section can be linked directly.
  function mountAnchors() {
    if (!isArticle()) return;
    for (const head of document.querySelectorAll('main .page h2, main .page h3')) {
      if (head.querySelector('.anchor') || head.closest('.pager')) continue;
      if (!head.id) head.id = head.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
      const anchor = document.createElement('a');
      anchor.className = 'anchor';
      anchor.href = '#' + head.id;
      anchor.setAttribute('aria-label', 'Link to this section');
      anchor.textContent = '#';
      head.appendChild(anchor);
    }
  }

  // Article foot: previous / next page on the same shelf, then the rest of the shelf as chips.
  function mountPager() {
    if (!isArticle() || document.querySelector('.pager')) return;
    const here = currentPage();
    const shelf = PAGES.filter((page) => page.group === here.group);
    const at = shelf.indexOf(here);
    const pager = document.createElement('nav');
    pager.className = 'pager';
    pager.setAttribute('aria-label', 'More on this shelf');
    tint(pager, here.group);
    const steps = document.createElement('div');
    steps.className = 'pager-steps';
    const step = (page, kind) => {
      const a = document.createElement('a');
      a.className = 'pager-link pager-' + kind;
      a.href = page.href;
      a.innerHTML = '<span class="pager-kicker">' + (kind === 'prev' ? 'Previous' : 'Next') + '</span>';
      const b = document.createElement('b');
      b.textContent = page.label;
      a.appendChild(b);
      steps.appendChild(a);
    };
    if (at > 0) step(shelf[at - 1], 'prev');
    if (at < shelf.length - 1) step(shelf[at + 1], 'next');
    if (steps.children.length) pager.appendChild(steps);
    const others = shelf.filter((page) => page !== here);
    if (others.length) {
      const more = document.createElement('div');
      more.className = 'pager-shelf';
      const title = document.createElement('span');
      title.className = 'pager-shelf-title';
      title.textContent = 'More in ' + shelfOf(here).label;
      more.appendChild(title);
      for (const page of others) {
        const chip = document.createElement('a');
        chip.href = page.href;
        chip.innerHTML = ICONS[page.icon];
        chip.appendChild(document.createTextNode(page.label));
        more.appendChild(chip);
      }
      pager.appendChild(more);
    }
    document.querySelector('main > article.page').appendChild(pager);
  }

  // A thin accent line along the top edge that fills as an article is read.
  function mountProgress() {
    if (!isArticle() || document.querySelector('.read-progress')) return;
    const bar = document.createElement('div');
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    let queued = false;
    const paint = () => {
      queued = false;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (room > 0 ? Math.min(1, window.scrollY / room) : 1) + ')';
    };
    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, {passive: true});
    paint();
  }

  // Footer: one link per shelf ahead of the credit line.
  function mountFooter() {
    const footer = document.querySelector('body > footer');
    if (!footer || footer.querySelector('.foot-shelves')) return;
    const nav = document.createElement('nav');
    nav.className = 'foot-shelves';
    nav.setAttribute('aria-label', 'Shelves');
    for (const group of sideGroups()) {
      const first = PAGES.find((page) => page.group === group.id);
      if (!group.label || !first) continue;
      const a = document.createElement('a');
      a.href = first.href;
      a.textContent = group.label;
      tint(a, group.id);
      nav.appendChild(a);
    }
    footer.prepend(nav);
  }

  function mount() {
    mountRail();
    mountJump();
    mountSidebar();
    mountWikiSwitch();
    mountFinder();
    decorateIndex();
    mountCrumbs();
    mountAnchors();
    mountPager();
    mountProgress();
    mountFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
