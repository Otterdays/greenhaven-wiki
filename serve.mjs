// [TRACE: DOCS/SCRATCHPAD.md] Local viewer for the wiki pages. Node standard library only, no npm.
// The pages use root-absolute links (/style.css, /site.js), so file:// cannot render them; serve this folder.
// The shared tool chrome (/theme.css, /theme.js) is bundled in this folder (a copy of developers/theme/),
// so the same files serve locally and on a static host that runs no server code. Fixed allowlist below
// revalidates them; /favicon.ico aliases the bundled svg. No request text reaches the path.
import http from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const types = {html:'text/html',css:'text/css',js:'text/javascript',svg:'image/svg+xml',ico:'image/x-icon',txt:'text/plain',md:'text/markdown',png:'image/png',gif:'image/gif',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp'};
const texty = new Set(['html','css','js','svg','txt','md']);
const themeDir = here;
const CHROME = {'/theme.css': 'theme.css', '/theme.js': 'theme.js', '/favicon.ico': 'favicon.svg'};

export function safe(urlPath) {
  let raw = decodeURIComponent(urlPath.split('?')[0]);
  if (raw === '/') raw = 'index.html';
  raw = raw.replace(/^\/+/, '');
  if (!raw || raw.includes('\0')) return null;
  const resolved = path.resolve(here, raw);
  const relative = path.relative(here, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return resolved;
}

export function createWikiServer() {
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405).end('Method not allowed'); return; }
      const chrome = CHROME[url.pathname];
      if (chrome) {
        // Revalidate the shared chrome like the tool servers do: 66 KB of theme sheet and script
        // should not come back on every wiki reload. [TRACE: DOCS/IMPROVEMENTS.md]
        const full = path.join(themeDir, chrome);
        const info = await stat(full);
        const tag = `W/"${info.size.toString(16)}-${Math.round(info.mtimeMs).toString(16)}"`;
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('ETag', tag);
        if (req.headers['if-none-match'] === tag) { res.writeHead(304).end(); return; }
        const data = await readFile(full);
        const kind = types[path.extname(chrome).slice(1)] || 'application/octet-stream';
        res.writeHead(200, {'Content-Type': `${kind}; charset=utf-8`}).end(req.method === 'HEAD' ? undefined : data);
        return;
      }
      const file = safe(url.pathname);
      if (!file) { res.writeHead(400).end('Bad path'); return; }
      const data = await readFile(file);
      const ext = path.extname(file).slice(1).toLowerCase();
      const type = types[ext];
      const headers = {'Content-Type': type ? (texty.has(ext) ? `${type}; charset=utf-8` : type) : 'application/octet-stream'};
      if (!type) headers['Content-Disposition'] = `attachment; filename="${path.basename(file)}"`;
      res.writeHead(200, headers).end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'}).end('Not found');
    }
  });
}

const isMain = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const bind = process.env.RPG_WIKI_BIND || '127.0.0.1:6004';
  const colon = bind.lastIndexOf(':');
  const host = bind.slice(0, colon);
  const port = Number(bind.slice(colon + 1));
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Bad RPG_WIKI_BIND: ${bind}`);
  }
  createWikiServer().listen(port, host, () => console.log(`Greenhaven wiki: http://${bind}`));
}
