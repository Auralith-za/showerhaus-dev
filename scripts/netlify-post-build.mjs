import fs from 'fs';
import path from 'path';

const distDir = path.resolve(process.cwd(), 'dist/server');
const assetsDir = path.join(distDir, 'assets');

// Find the server build file
const files = fs.readdirSync(assetsDir);
const serverBuildFile = files.find(f => f.startsWith('server-build-') && f.endsWith('.js'));

if (!serverBuildFile) {
  console.error('Could not find server-build-*.js in dist/server/assets');
  process.exit(1);
}

const serverJsPath = path.join(distDir, 'server.js');

// We use the bundled getLoadContext from entry.server.tsx to avoid ESM/CJS interop issues at runtime.
// Since we set noExternal: true and minify: false, it is safely exported from the main bundle.
const serverJs = `
import { createRequestHandler } from "@netlify/vite-plugin-react-router/serverless";
import * as build from "./assets/${serverBuildFile}";

// Use the bundled getLoadContext from the entry module
// In React Router 7, the entry module is available at build.entry.module
const getLoadContext = build.entry?.module?.getLoadContext;

if (!getLoadContext) {
  console.warn('WARNING: getLoadContext not found in build.entry.module. Storefront features may fail.');
}

export default createRequestHandler({
  build,
  getLoadContext
});
`;

fs.writeFileSync(serverJsPath, serverJs.trim());
console.log(`Patched dist/server/server.js with bundled getLoadContext (using ${serverBuildFile})`);
