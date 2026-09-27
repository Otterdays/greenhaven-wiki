(function () {
  'use strict';
  const KEY = 'gh-theme';
  // Auto follows the OS; with no history yet it resolves to one of these two packs.
  const AUTO = 'auto';
  const AUTO_DARK = 'default';
  const AUTO_LIGHT = 'light';
  // The last pack this browser explicitly chose in each mode, so Auto can resolve to what
  // this person actually reads instead of always Meadow / Day.
  const LAST_DARK = 'gh-theme-last-dark';
  const LAST_LIGHT = 'gh-theme-last-light';
  // One fade, two files: theme.css animates for this long, and the class-window fallback adds
  // ANIM_GRACE_MS of headroom before it lifts.
  const FADE_MS = 280;
  const ANIM_GRACE_MS = FADE_MS + 80;

  // Concrete packs. Ids and order are asserted by developers/map-maker/tests/map.test.mjs.
  // bg / accent / ink are sample colors for the mini preview swatch.
  const THEMES = [
    { id: 'default', label: 'Meadow', mode: 'dark',  bg: '#101716', accent: '#c4dd93', ink: '#dce4df' },
    { id: 'light',   label: 'Day',    mode: 'light', bg: '#f3efe4', accent: '#4a6e32', ink: '#2c3428' },
    { id: 'dusk',    label: 'Dusk',   mode: 'dark',  bg: '#18140f', accent: '#e8b86a', ink: '#f0e4d0' },
    { id: 'dock',    label: 'Dock',   mode: 'dark',  bg: '#0e161a', accent: '#7ec4d4', ink: '#d8e8ec' },
    { id: 'birch',   label: 'Birch',  mode: 'light', bg: '#e6ebe8', accent: '#2e6a52', ink: '#1e2a24' },
    { id: 'ember',   label: 'Ember',  mode: 'dark',  bg: '#140e0c', accent: '#e07840', ink: '#f0d8c8' },
    { id: 'mist',    label: 'Mist',   mode: 'dark',  bg: '#161a18', accent: '#a8c8b8', ink: '#c8d4cc' },
    { id: 'cloud',   label: 'Cloud',  mode: 'light', bg: '#e8ecef', accent: '#4a7088', ink: '#2a3238' },
    { id: 'reed',    label: 'Reed',   mode: 'light', bg: '#e4ebe4', accent: '#4a7854', ink: '#2a342c' },
    { id: 'stone',   label: 'Stone',  mode: 'dark',  bg: '#17191b', accent: '#a0b0c0', ink: '#c8ced4' },
    { id: 'tide',    label: 'Tide',   mode: 'light', bg: '#e2ecec', accent: '#3a8080', ink: '#243436' },
    // Game packs. `game` maps to a GAMES title below; the panel groups by title.
    { id: 'ascalon',   label: 'Ascalon',   mode: 'dark',  game: 'gw',   bg: '#171a1c', accent: '#d8b45a', ink: '#dbe0da' },
    { id: 'searing',   label: 'Searing',   mode: 'dark',  game: 'gw',   bg: '#1a1010', accent: '#e07a3a', ink: '#f0d8cc' },
    { id: 'kryta',     label: 'Kryta',     mode: 'dark',  game: 'gw',   bg: '#141a16', accent: '#c4a84a', ink: '#d8e4d6' },
    { id: 'minecraft', label: 'Minecraft', mode: 'light', game: 'mc',   bg: '#c9c9c9', accent: '#4f9a34', ink: '#2b2b2b' },
    { id: 'nether',    label: 'Nether',    mode: 'dark',  game: 'mc',   bg: '#1a0e0c', accent: '#d0502e', ink: '#f0ccc0' },
    { id: 'end',       label: 'The End',   mode: 'dark',  game: 'mc',   bg: '#0e0c14', accent: '#b070e0', ink: '#e0d4f0' },
    { id: 'flyff',     label: 'Flyff',     mode: 'light', game: 'ff',   bg: '#e9f2fb', accent: '#2f86c8', ink: '#26303c' },
    { id: 'darkon',    label: 'Darkon',    mode: 'dark',  game: 'ff',   bg: '#150f22', accent: '#a878e0', ink: '#ddd0f2' },
    { id: 'madrigal',  label: 'Madrigal',  mode: 'light', game: 'ff',   bg: '#eef6ec', accent: '#3a9a6a', ink: '#243428' },
    { id: 'maple',     label: 'Maple',     mode: 'light', game: 'ms',   bg: '#f6ede0', accent: '#e08a2e', ink: '#3a2f22' },
    { id: 'ellinia',   label: 'Ellinia',   mode: 'dark',  game: 'ms',   bg: '#131a1a', accent: '#7fc25a', ink: '#d2e2d4' },
    { id: 'henesys',   label: 'Henesys',   mode: 'light', game: 'ms',   bg: '#eef4e6', accent: '#5aa02e', ink: '#2c341f' },
    { id: 'ludibrium', label: 'Ludibrium', mode: 'light', game: 'ms',   bg: '#f4eef8', accent: '#d060a8', ink: '#342838' },
    { id: 'aros',      label: 'Aros',      mode: 'dark',  game: 'aros', bg: '#121418', accent: '#46c0bd', ink: '#d2dae2' },
    { id: 'seaport',   label: 'Seaport',   mode: 'dark',  game: 'aros', bg: '#0e161c', accent: '#3aa8d0', ink: '#d0e4ec' },
    // Designed packs. No `game`, so they sort into Light / Dark.
    { id: 'arcade',    label: 'Arcade',    mode: 'dark',  bg: '#14101f', accent: '#e05ac8', ink: '#e6dcf4' },
    { id: 'grove',     label: 'Grove',     mode: 'dark',  bg: '#0f1510', accent: '#8fbf5a', ink: '#d4e2d0' },
    { id: 'frost',     label: 'Frost',     mode: 'light', bg: '#eaf2f7', accent: '#2e7fa8', ink: '#22303a' },
    { id: 'slate',     label: 'Slate',     mode: 'dark',  bg: '#171a1d', accent: '#8fb0cc', ink: '#ccd4dc' },
    { id: 'plum',      label: 'Plum',      mode: 'dark',  bg: '#180f18', accent: '#c46ac0', ink: '#ecdcee' },
    { id: 'mint',      label: 'Mint',      mode: 'light', bg: '#eaf5ef', accent: '#23a074', ink: '#1f342c' },
    { id: 'sakura',    label: 'Sakura',    mode: 'light', bg: '#f9eef2', accent: '#d85a90', ink: '#3a2830' },
    { id: 'noir',      label: 'Noir',      mode: 'dark',  bg: '#0a0a0b', accent: '#e8e8ea', ink: '#e8e8ea' },
    { id: 'lantern',   label: 'Lantern',   mode: 'dark',  bg: '#16120e', accent: '#e0a040', ink: '#f0e0cc' },
    { id: 'moss',      label: 'Moss',      mode: 'dark',  bg: '#101612', accent: '#6a9a48', ink: '#d0e0cc' },
    { id: 'honey',     label: 'Honey',     mode: 'light', bg: '#f6efd8', accent: '#c07820', ink: '#3a3018' },
    { id: 'copper',    label: 'Copper',    mode: 'dark',  bg: '#161210', accent: '#c87840', ink: '#ecd8c8' },
    { id: 'pearl',     label: 'Pearl',     mode: 'light', bg: '#eef2f4', accent: '#6a8898', ink: '#2a3238' },
    { id: 'clay',      label: 'Clay',      mode: 'light', bg: '#f0e6dc', accent: '#a06040', ink: '#3a2c24' },
    // Greenhaven places. Designed packs: no `game`, so they sort into Light / Dark.
    { id: 'porch',        label: 'Porch',        mode: 'dark',  bg: '#17120e', accent: '#e0a860', ink: '#f0e2cf' },
    { id: 'lanternwoods', label: 'Lantern Woods', mode: 'dark',  bg: '#12170f', accent: '#d0b050', ink: '#dfe6d4' },
    { id: 'mosslight',    label: 'Moss Light',   mode: 'light', bg: '#eef3e4', accent: '#3d6e2c', ink: '#22301c' },
    { id: 'fairyvillage', label: 'Fairy Village', mode: 'light', bg: '#eff6f2', accent: '#3f9a8a', ink: '#243028' },
    { id: 'winter',       label: 'Winter',       mode: 'light', bg: '#eef2f6', accent: '#5a7488', ink: '#28303a' },
    { id: 'sandstone',    label: 'Sandstone',    mode: 'light', bg: '#f2e8d8', accent: '#8a5c2e', ink: '#3a2e1e' },
    { id: 'aurora',       label: 'Aurora',       mode: 'dark',  bg: '#0c1218', accent: '#4ad0b0', ink: '#d8e6ea' },
    { id: 'pond',         label: 'Pond',         mode: 'dark',  bg: '#0e1816', accent: '#4aa088', ink: '#d2e4dc' },
    { id: 'deepwood',     label: 'Deepwood',     mode: 'dark',  bg: '#0d1410', accent: '#8fb46a', ink: '#cfe0cf' },
    { id: 'shoreline',    label: 'Shoreline',    mode: 'light', bg: '#eaf0ee', accent: '#2e7a84', ink: '#20302e' },
    { id: 'quarry',       label: 'Quarry',       mode: 'dark',  bg: '#151617', accent: '#c08a5a', ink: '#dfe2e4' },
    { id: 'orchard',      label: 'Orchard',      mode: 'light', bg: '#f4efe0', accent: '#7a5e1e', ink: '#332c18' },
    { id: 'duckmere',     label: 'Duckmere',     mode: 'dark',  bg: '#0e1512', accent: '#cdb35e', ink: '#d2ddd2' },
    { id: 'willowmere',   label: 'Willowmere',   mode: 'light', bg: '#eeeef6', accent: '#4b4f96', ink: '#2c2e3c' },
    { id: 'poppyfield',   label: 'Poppyfield',   mode: 'light', bg: '#f4efe6', accent: '#b4323f', ink: '#33291f' },
    { id: 'gorse',        label: 'Gorse',        mode: 'light', bg: '#eceee4', accent: '#e3bc33', ink: '#2a2f24' },
    { id: 'rosewood',     label: 'Rosewood',     mode: 'dark',  bg: '#171012', accent: '#c95f6d', ink: '#e6d3d2' },
    // Old School RuneScape packs.
    { id: 'giantsfoundry', label: 'Giants Foundry', mode: 'dark', game: 'osrs', bg: '#180f0a', accent: '#e07840', ink: '#f0dcd0' },
    { id: 'draynor',       label: 'Draynor',        mode: 'light', game: 'osrs', bg: '#eaf0e6', accent: '#3c6a7a', ink: '#26302a' },
  ];
  // Game titles rendered as their own panel sections, in this order.
  const GAMES = [
    { key: 'gw',   label: 'Guild Wars 1' },
    { key: 'mc',   label: 'Minecraft' },
    { key: 'ff',   label: 'Flyff' },
    { key: 'ms',   label: 'MapleStory' },
    { key: 'aros', label: 'Curse of Aros' },
    { key: 'osrs', label: 'Old School RuneScape' },
  ];
  const byId = Object.create(null);
  for (const pack of THEMES) byId[pack.id] = pack;
  const gameTitles = Object.create(null);
  for (const game of GAMES) gameTitles[game.key] = game.label;

  let rootEl = null;
  let animTimer = 0;
  let viewTransition = null;
  const listeners = new Set();

  function notify(resolved) {
    for (const fn of Array.from(listeners)) {
      try {
        fn(resolved);
      } catch {
        /* a bad listener must not stop the paint */
      }
    }
  }

  function prefersDark() {
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function reducedMotion() {
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Map a stored value ('auto' or a pack id) to the concrete pack id to paint.
  function lastUsed(key, mode) {
    try {
      const stored = localStorage.getItem(key);
      return stored && byId[stored] && byId[stored].mode === mode ? stored : null;
    } catch {
      return null;
    }
  }

  // The two packs Auto can paint. The swatch and the paint read the same answer, so the
  // preview can never promise a pack Auto would not apply.
  function autoPair() {
    return {
      dark: lastUsed(LAST_DARK, 'dark') || AUTO_DARK,
      light: lastUsed(LAST_LIGHT, 'light') || AUTO_LIGHT,
    };
  }

  function resolve(raw) {
    if (raw === AUTO) {
      const pair = autoPair();
      return prefersDark() ? pair.dark : pair.light;
    }
    return byId[raw] ? raw : 'default';
  }

  function readRaw() {
    try {
      const stored = localStorage.getItem(KEY);
      return (stored === AUTO || byId[stored]) ? stored : 'default';
    } catch {
      return 'default';
    }
  }

  function writeRaw(raw) {
    try {
      localStorage.setItem(KEY, raw);
      const pack = byId[raw];
      if (pack && pack.mode === 'dark') localStorage.setItem(LAST_DARK, raw);
      else if (pack && pack.mode === 'light') localStorage.setItem(LAST_LIGHT, raw);
    } catch {
      /* private mode: pack still applies for this page */
    }
  }

  // Smooth switch: prefer a View Transition crossfade, fall back to a short-lived global
  // transition window. Reduced motion is instant, and an instant paint is always available.
  function setPaint(animate, change) {
    const el = document.documentElement;
    if (!animate || reducedMotion()) { change(); return; }
    try {
      if (typeof document.startViewTransition === 'function') {
        // Rapid picks must not queue a full-page snapshot each: skip the running one instead.
        if (viewTransition) viewTransition.skipTransition();
        viewTransition = document.startViewTransition(change);
        return;
      }
    } catch {
      /* a hidden document refuses the transition; the class window below still paints */
    }
    el.classList.add('gh-theme-anim');
    change();
    window.clearTimeout(animTimer);
    animTimer = window.setTimeout(() => el.classList.remove('gh-theme-anim'), ANIM_GRACE_MS);
  }

  // Paint the pack.
  function commit(raw, animate) {
    const resolved = resolve(raw);
    const pack = byId[resolved];
    const el = document.documentElement;
    const change = () => {
      el.setAttribute('data-theme', resolved);
      el.setAttribute('data-theme-mode', pack.mode);
    };
    setPaint(animate, change);
    notify(resolved);
  }

  function hostForToggle() {
    const header = document.querySelector('header');
    if (!header) return document.body;
    const actions = header.querySelector(':scope > .actions');
    if (actions) return actions;
    let end = header.querySelector(':scope > .gh-chrome-end');
    if (end) return end;
    end = document.createElement('div');
    end.className = 'gh-chrome-end';
    header.appendChild(end);
    return end;
  }

  function makeOption(root, spec) {
    const isAuto = spec.id === AUTO;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isAuto ? 'gh-theme-option gh-theme-option--auto' : 'gh-theme-option';
    btn.dataset.themeId = spec.id;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.tabIndex = -1;
    btn.title = isAuto ? 'Follow system light / dark' : spec.label;
    // What the filter box matches: the name, the pack id, and the section it lives in. The
    // section words are there so `dark`, `light`, `games` and `system` narrow a 50-pack list the
    // way a name does. Transient: none of this is ever stored.
    const section = isAuto ? 'system' : (spec.game ? 'games ' + gameTitles[spec.game] : spec.mode);
    btn.dataset.ghSearch = [spec.label, spec.id, section, spec.mode].filter(Boolean).join(' ').toLowerCase();
    btn.dataset.ghLabel = String(spec.label).toLowerCase();

    const swatch = document.createElement('span');
    swatch.className = isAuto ? 'gh-theme-swatch gh-theme-swatch--auto' : 'gh-theme-swatch';
    swatch.setAttribute('aria-hidden', 'true');
    if (!isAuto) {
      swatch.style.setProperty('--swatch-bg', spec.bg);
      swatch.style.setProperty('--swatch-accent', spec.accent);
      swatch.style.setProperty('--swatch-ink', spec.ink);
    }

    const label = document.createElement('span');
    label.className = 'gh-theme-option-label';
    label.textContent = spec.label;

    btn.append(swatch, label);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      pick(root, spec.id);
    });
    return btn;
  }

  function syncChrome(root) {
    const raw = readRaw();
    const pack = byId[resolve(raw)];
    const isAuto = raw === AUTO;
    const toggle = root.querySelector('.gh-theme-toggle');
    if (!toggle) return;
    const label = root.querySelector('.gh-theme-toggle-label');
    if (label) label.textContent = 'Theme · ' + (isAuto ? 'Auto' : pack.label);
    toggle.style.setProperty('--swatch-bg', pack.bg);
    toggle.style.setProperty('--swatch-accent', pack.accent);
    toggle.style.setProperty('--swatch-ink', pack.ink);
    // Set on the root so both the toggle and the panel's Auto tile show the same pair.
    const pair = autoPair();
    root.style.setProperty('--swatch-auto-dark', byId[pair.dark].bg);
    root.style.setProperty('--swatch-auto-light', byId[pair.light].bg);
    toggle.classList.toggle('is-auto', isAuto);
    toggle.dataset.themeId = raw;
    toggle.title = isAuto
      ? 'Following system theme (' + pack.label + '). Click to choose.'
      : 'Theme: ' + pack.label + '. Click to choose.';
    toggle.setAttribute('aria-label', 'Theme: ' + (isAuto ? 'Auto, ' + pack.label : pack.label));
    const live = root.querySelector('.gh-theme-live');
    if (live) live.textContent = 'Theme: ' + (isAuto ? 'Auto, ' + pack.label : pack.label);
    root.querySelectorAll('.gh-theme-option').forEach((btn) => {
      const on = btn.dataset.themeId === raw;
      btn.setAttribute('aria-checked', on ? 'true' : 'false');
      btn.classList.toggle('is-active', on);
      btn.tabIndex = on ? 0 : -1;
    });
  }

  // Only the visible options take part in navigation: a filtered-out row must never hold a
  // focus nobody can see.
  function visibleOptions(scope) {
    const found = scope.querySelectorAll('.gh-theme-option');
    return Array.prototype.slice.call(found).filter((btn) => !btn.hidden);
  }

  function applyFilter(scope, text) {
    const needle = String(text || '').trim().toLowerCase();
    scope.querySelectorAll('.gh-theme-option').forEach((btn) => {
      btn.hidden = !!needle && (btn.dataset.ghSearch || '').indexOf(needle) < 0;
    });
    // A section goes only when every pack inside it has been filtered out.
    scope.querySelectorAll('.gh-theme-group, .gh-theme-subgroup').forEach((group) => {
      group.hidden = !group.querySelector('.gh-theme-option:not([hidden])');
    });
    const shown = visibleOptions(scope);
    const hint = scope.querySelector('.gh-theme-panel-hint');
    if (hint) {
      hint.textContent = !needle
        ? 'Saved per browser'
        : shown.length
          ? shown.length + ' of ' + (THEMES.length + 1) + ' packs'
          : 'No packs match "' + String(text).trim() + '" - Escape brings them back';
    }
    seatRovingFocus(scope);
  }

  // Hiding the current pack used to leave every visible option at tabIndex -1, so Tab from the
  // filter box walked straight out of the open panel. Keep exactly one visible row tabbable;
  // syncChrome still owns the roving focus after a real pick.
  function seatRovingFocus(scope) {
    const shown = visibleOptions(scope);
    if (!shown.length) return;
    const keep = shown.find((btn) => btn.dataset.themeId === readRaw()) || shown[0];
    for (const btn of shown) btn.tabIndex = btn === keep ? 0 : -1;
  }

  function setOpen(root, open) {
    const toggle = root.querySelector('.gh-theme-toggle');
    const panel = root.querySelector('.gh-theme-panel');
    root.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
    const filter = panel.querySelector('.gh-theme-filter');
    if (!open) {
      // A stale filter would hide half the list the next time the panel opens.
      if (filter && filter.value) {
        filter.value = '';
        applyFilter(panel, '');
      }
      return;
    }
    const active = panel.querySelector('.gh-theme-option.is-active:not([hidden])');
    if (active) {
      active.focus();
      return;
    }
    const first = visibleOptions(panel)[0];
    if (first) first.focus();
    else if (filter) filter.focus();
  }

  function pick(root, id, animate) {
    if (id !== AUTO && !byId[id]) return false;
    // Re-picking the pack already on screen is a no-op paint: it must not spend a full-page View
    // Transition, and Enter, Space and the option's own click can all land on one pick.
    const same = id === readRaw();
    writeRaw(id);
    if (!same) commit(id, animate !== false);
    if (root) syncChrome(root);
    return true;
  }

  // Roving focus across the radio options. Enter / Space apply the focused pack, Tab stays
  // inside the panel while it is open, and a printable letter jumps to the next pack whose name
  // starts with it.
  function bindNav(panel) {
    const filter = panel.querySelector('.gh-theme-filter');
    panel.addEventListener('keydown', (e) => {
      const root = rootEl || panel.closest('.gh-theme');
      if (e.key === 'Escape') {
        // Clear an active filter first; only an empty one closes the panel.
        if (filter && filter.value) {
          e.preventDefault();
          e.stopPropagation();
          filter.value = '';
          applyFilter(panel, '');
          filter.focus();
        }
        return;
      }
      if (e.key === 'Tab') {
        const stops = (filter ? [filter] : []).concat(visibleOptions(panel));
        const at = stops.indexOf(document.activeElement);
        if (at < 0) return;
        const last = stops.length - 1;
        if ((e.shiftKey && at === 0) || (!e.shiftKey && at === last)) {
          e.preventDefault();
          stops[e.shiftKey ? last : 0].focus();
        }
        return;
      }
      if (filter && document.activeElement === filter) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const shown = visibleOptions(panel)[0];
          if (shown) pick(root, shown.dataset.themeId);
          return;
        }
        // Down leaves the text box and enters the list, the way a combobox behaves.
        if (e.key === 'ArrowDown') {
          const first = visibleOptions(panel)[0];
          if (first) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }
      const options = visibleOptions(panel);
      if (!options.length) return;
      const i = options.indexOf(document.activeElement);
      if (e.key === 'Enter' || e.key === ' ') {
        if (i < 0) return;
        e.preventDefault();
        pick(root, options[i].dataset.themeId);
        return;
      }
      if (i < 0) return;
      let next = -1;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % options.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + options.length) % options.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = options.length - 1;
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const letter = e.key.toLowerCase();
        for (let step = 1; step <= options.length; step += 1) {
          const candidate = options[(i + step) % options.length];
          if ((candidate.dataset.ghLabel || '').indexOf(letter) === 0) {
            e.preventDefault();
            candidate.focus();
            return;
          }
        }
        return;
      }
      else return;
      e.preventDefault();
      options[next].focus();
    });
  }

  function mount() {
    if (document.querySelector('.gh-theme')) return;
    const root = document.createElement('div');
    root.className = 'gh-theme';
    rootEl = root;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'gh-theme-toggle';
    toggle.setAttribute('aria-label', 'Theme');
    toggle.setAttribute('aria-haspopup', 'dialog');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'gh-theme-panel');
    const toggleSwatch = document.createElement('span');
    toggleSwatch.className = 'gh-theme-swatch';
    toggleSwatch.setAttribute('aria-hidden', 'true');
    const toggleLabel = document.createElement('span');
    toggleLabel.className = 'gh-theme-toggle-label';
    toggle.append(toggleSwatch, toggleLabel);

    const panel = document.createElement('div');
    panel.id = 'gh-theme-panel';
    panel.className = 'gh-theme-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Theme');

    const head = document.createElement('div');
    head.className = 'gh-theme-panel-head';
    const title = document.createElement('span');
    title.className = 'gh-theme-panel-title';
    title.textContent = 'Theme';
    const hint = document.createElement('span');
    hint.className = 'gh-theme-panel-hint';
    hint.textContent = 'Saved per browser';
    // The filter count lands here, so it has to be spoken as well as shown. The id is assigned by
    // property - an `id: '...'` literal would read as a pack to the pinned regex.
    hint.id = 'gh-theme-panel-hint';
    hint.setAttribute('aria-live', 'polite');
    hint.setAttribute('aria-atomic', 'true');
    head.append(title, hint);

    // One row to narrow the whole pack list by name, place, game or section. Transient: never stored.
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'gh-theme-filter';
    input.className = 'gh-theme-filter';
    input.placeholder = 'Filter packs';
    input.setAttribute('aria-label', 'Filter packs');
    input.setAttribute('aria-describedby', 'gh-theme-panel-hint');
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.addEventListener('input', () => applyFilter(panel, input.value));

    // Spoken, not seen: which pack is now applied.
    const live = document.createElement('span');
    live.className = 'gh-theme-live';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');

    const body = document.createElement('div');
    body.className = 'gh-theme-body';
    body.setAttribute('role', 'radiogroup');
    body.setAttribute('aria-label', 'Theme packs');

    function buildGrid(specs) {
      const grid = document.createElement('div');
      grid.className = 'gh-theme-options';
      for (const spec of specs) grid.appendChild(makeOption(root, spec));
      return grid;
    }

    function buildGroup(label, specs) {
      const group = document.createElement('div');
      group.className = 'gh-theme-group';
      // A radiogroup of 50 options is meaningless without its sections, so each one is announced.
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', label);
      const glabel = document.createElement('span');
      glabel.className = 'gh-theme-group-label';
      glabel.textContent = label;
      group.append(glabel, buildGrid(specs));
      return group;
    }

    // Games section: one sub-section per game title.
    function buildGameGroups() {
      const group = document.createElement('div');
      group.className = 'gh-theme-group';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Games');
      const glabel = document.createElement('span');
      glabel.className = 'gh-theme-group-label';
      glabel.textContent = 'Games';
      group.appendChild(glabel);
      for (const game of GAMES) {
        const packs = THEMES.filter((t) => t.game === game.key);
        if (!packs.length) continue;
        const sub = document.createElement('div');
        sub.className = 'gh-theme-subgroup';
        sub.setAttribute('role', 'group');
        sub.setAttribute('aria-label', game.label);
        const sublabel = document.createElement('span');
        sublabel.className = 'gh-theme-subgroup-label';
        sublabel.textContent = game.label;
        sub.append(sublabel, buildGrid(packs));
        group.appendChild(sub);
      }
      return group;
    }

    const nonGame = THEMES.filter((t) => !t.game);
    body.appendChild(buildGroup('System', [{ id: AUTO, label: 'Auto' }]));
    body.appendChild(buildGameGroups());
    body.appendChild(buildGroup('Light', nonGame.filter((t) => t.mode === 'light')));
    body.appendChild(buildGroup('Dark', nonGame.filter((t) => t.mode === 'dark')));

    // The panel scrolls and the list is long, so the title and the filter row ride at the top
    // together instead of sliding away under the packs being searched.
    const top = document.createElement('div');
    top.className = 'gh-theme-panel-top';
    top.append(head, input);
    panel.append(top, body);
    root.append(toggle, panel, live);

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(root, !root.classList.contains('is-open'));
    });

    document.addEventListener('click', (e) => {
      if (!root.classList.contains('is-open')) return;
      if (root.contains(e.target)) return;
      setOpen(root, false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !root.classList.contains('is-open')) return;
      setOpen(root, false);
      toggle.focus();
    });

    bindNav(panel);
    syncChrome(root);
    hostForToggle().appendChild(root);
  }

  // Follow the OS while Auto is selected.
  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (readRaw() !== AUTO) return;
      commit(AUTO, true);
      if (rootEl) syncChrome(rootEl);
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystem);
    else if (mq.addListener) mq.addListener(onSystem);
  }

  // Keep open tabs in sync when another tab changes the pack.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    commit(readRaw(), true);
    if (rootEl) syncChrome(rootEl);
  });

  // Small public hook for pages and the console. Everything added here is additive: the
  // original packs / auto / current() / set(id) shape still works.
  const resolvePack = resolve;
  window.GHTheme = {
    packs: THEMES.map((t) => {
      const pack = { label: t.label, mode: t.mode, bg: t.bg, accent: t.accent };
      pack.id = t.id;
      if (t.game) pack.game = t.game;
      return pack;
    }),
    auto: AUTO,
    // The game sections in panel order, so a page can rebuild the grouping.
    games() {
      return GAMES.map((game) => ({ key: game.key, label: game.label }));
    },
    // What a stored value paints right now - and what Auto currently means.
    resolve(id) {
      return resolvePack(id === undefined ? readRaw() : id);
    },
    current() {
      const raw = readRaw();
      return { id: raw, resolved: resolvePack(raw), auto: raw === AUTO };
    },
    // Fired by every paint: a click, an Auto flip, and another tab's change alike. Returns an
    // unsubscribe.
    onChange(fn) {
      if (typeof fn !== 'function') return function () {};
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    // opts.animate === false paints without the crossfade. Works before the control mounts.
    set(id, opts) {
      const animate = !(opts && opts.animate === false);
      if (!rootEl) return pick(null, id, animate);
      return pick(rootEl, id, animate);
    },
  };

  // Paint before first render so there is no flash of the default pack.
  commit(readRaw(), false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
