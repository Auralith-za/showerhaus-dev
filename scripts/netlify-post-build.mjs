import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

// 1. First, create our custom server.js that imports getLoadContext from the bundle
const serverJs = `
import { createRequestHandler } from "@netlify/vite-plugin-react-router/serverless";
import * as build from "./assets/${serverBuildFile}";

// Use the bundled getLoadContext from the entry module
const getLoadContext = build.entry?.module?.getLoadContext;

export default createRequestHandler({
  build,
  getLoadContext
});
`;

fs.writeFileSync(serverJsPath, serverJs.trim());
console.log(`Created dist/server/server.js`);

// 2. Now use esbuild to bundle server.js into a single robust ESM file.
// This inlines all dependencies like @shopify/hydrogen and react-router,
// which fixes the named-export issues in Node ESM runtime on Netlify.
// We keep the assets/server-build-*.js external to avoid bundling the entire app.
console.log('Bundling server.js with esbuild...');
try {
  // Fix syntax: use plain backticks and ensure the command is valid
  const cmd = `npx esbuild "${serverJsPath}" --bundle --platform=node --format=esm --outfile="${serverJsPath}" --external:./assets/* --allow-overwrite`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Successfully bundled server.js');
} catch (error) {
  console.error('Failed to bundle server.js with esbuild:', error.message);
  process.exit(1);
}
