// Post-build script for Netlify: injects Hydrogen getLoadContext into the generated server.js
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const serverDir = './dist/server';
const assetsDir = join(serverDir, 'assets');

// Find the server-build chunk file
const serverBuildFile = readdirSync(assetsDir).find(f => f.startsWith('server-build-') && f.endsWith('.js'));
if (!serverBuildFile) throw new Error('Could not find server-build chunk in dist/server/assets/');

const serverJs = `
import { createRequestHandler } from "@netlify/vite-plugin-react-router/serverless";
import { b as build } from "./assets/${serverBuildFile}";
import { createHydrogenContext } from "@shopify/hydrogen";
import { AppSession } from "../app/lib/session.js";
import { CART_QUERY_FRAGMENT } from "../app/lib/fragments.js";
import { getLocaleFromRequest } from "../app/lib/i18n.js";

function createNodeCache() {
  const store = new Map();
  return {
    match: async (req) => { const key = typeof req === 'string' ? req : req.url; return store.get(key)?.clone(); },
    put: async (req, res) => { const key = typeof req === 'string' ? req : req.url; store.set(key, res); },
    delete: async (req) => { const key = typeof req === 'string' ? req : req.url; return store.delete(key); },
    keys: async () => [],
    add: async () => {},
    addAll: async () => {},
  };
}

const _virtual_netlifyServer = createRequestHandler({
  build,
  getLoadContext: async (request) => {
    const env = {
      SESSION_SECRET: process.env.SESSION_SECRET ?? '',
      PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN ?? '',
      PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN ?? '',
      PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID ?? '',
      PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN ?? '',
    };

    if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET not set');

    const session = await AppSession.init(request, [env.SESSION_SECRET]);
    const cache = createNodeCache();
    const waitUntil = (_p) => {};

    return createHydrogenContext({
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromRequest(request),
      cart: { queryFragment: CART_QUERY_FRAGMENT },
    });
  },
});

export { _virtual_netlifyServer as default };
`;

writeFileSync(join(serverDir, 'server.js'), serverJs.trim());
console.log(`✓ Patched dist/server/server.js with Hydrogen getLoadContext (using ${serverBuildFile})`);
