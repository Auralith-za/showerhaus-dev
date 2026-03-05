// Post-build script for Netlify: patches dist/server/server.js to inject Hydrogen getLoadContext
// Must inline all logic since TypeScript source files are NOT available as standalone JS at runtime
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const serverDir = './dist/server';
const assetsDir = join(serverDir, 'assets');

// Find the server-build chunk file
const serverBuildFile = readdirSync(assetsDir).find(f => f.startsWith('server-build-') && f.endsWith('.js'));
if (!serverBuildFile) throw new Error('Could not find server-build chunk in dist/server/assets/');

// Read CART_QUERY_FRAGMENT from source to inline (as a raw JS string)
const fragmentsSrc = readFileSync('./app/lib/fragments.ts', 'utf-8');
const cartFragmentMatch = fragmentsSrc.match(/const CART_QUERY_FRAGMENT = `([\s\S]*?)`\s*(?:as const)?;/);
const cartQueryFragment = cartFragmentMatch ? cartFragmentMatch[1] : '';

const serverJs = [
  'import { createRequestHandler } from "@netlify/vite-plugin-react-router/serverless";',
  `import { b as build } from "./assets/${serverBuildFile}";`,
  'import { createHydrogenContext } from "@shopify/hydrogen";',
  'import { createCookieSessionStorage } from "react-router";',
  '',
  'const CART_QUERY_FRAGMENT = ' + JSON.stringify(cartQueryFragment) + ';',
  '',
  'function getLocaleFromRequest(request) {',
  '  const url = new URL(request.url);',
  '  const firstPathPart = url.pathname.split("/")[1]?.toUpperCase() ?? "";',
  '  let pathPrefix = "", language = "EN", country = "US";',
  '  if (/^[A-Z]{2}-[A-Z]{2}$/i.test(firstPathPart)) {',
  '    pathPrefix = "/" + firstPathPart;',
  '    [language, country] = firstPathPart.split("-");',
  '  }',
  '  return { language, country, pathPrefix };',
  '}',
  '',
  'async function createAppSession(request, secrets) {',
  '  const storage = createCookieSessionStorage({',
  '    cookie: { name: "session", httpOnly: true, path: "/", sameSite: "lax", secrets },',
  '  });',
  '  const session = await storage.getSession(request.headers.get("Cookie")).catch(() => storage.getSession());',
  '  let isPending = false;',
  '  return {',
  '    get isPending() { return isPending; },',
  '    get has() { return session.has.bind(session); },',
  '    get get() { return session.get.bind(session); },',
  '    get flash() { return session.flash.bind(session); },',
  '    get unset() { isPending = true; return session.unset.bind(session); },',
  '    get set() { isPending = true; return session.set.bind(session); },',
  '    destroy() { return storage.destroySession(session); },',
  '    commit() { isPending = false; return storage.commitSession(session); },',
  '  };',
  '}',
  '',
  'function createNodeCache() {',
  '  const store = new Map();',
  '  return {',
  '    match: async (req) => { const key = typeof req === "string" ? req : req.url; return store.get(key)?.clone(); },',
  '    put: async (req, res) => { const key = typeof req === "string" ? req : req.url; store.set(key, res); },',
  '    delete: async (req) => { const key = typeof req === "string" ? req : req.url; return store.delete(key); },',
  '    keys: async () => [],',
  '    add: async () => {},',
  '    addAll: async () => {},',
  '  };',
  '}',
  '',
  'const _virtual_netlifyServer = createRequestHandler({',
  '  build,',
  '  getLoadContext: async (request) => {',
  '    const env = {',
  '      SESSION_SECRET: process.env.SESSION_SECRET ?? "",',
  '      PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN ?? "",',
  '      PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN ?? "",',
  '      PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID ?? "",',
  '      PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN ?? "",',
  '    };',
  '    if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET environment variable is not set");',
  '    const session = await createAppSession(request, [env.SESSION_SECRET]);',
  '    const cache = createNodeCache();',
  '    const waitUntil = (_p) => {};',
  '    return createHydrogenContext({ env, request, cache, waitUntil, session, i18n: getLocaleFromRequest(request), cart: { queryFragment: CART_QUERY_FRAGMENT } });',
  '  },',
  '});',
  '',
  'export { _virtual_netlifyServer as default };',
].join('\n');

writeFileSync(join(serverDir, 'server.js'), serverJs);
console.log('Patched dist/server/server.js with Hydrogen getLoadContext (using ' + serverBuildFile + ')');
