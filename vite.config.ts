import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    // Fix for Vite URL-encoding paths when project dir contains spaces
    {
      name: 'decode-uri-paths',
      enforce: 'pre',
      resolveId(id) {
        if (id.includes('%20')) {
          return { id: decodeURIComponent(id), moduleSideEffects: null };
        }
      },
      load(id) {
        if (id.includes('%20')) {
          // Return null to let other plugins handle after decoding
          return null;
        }
      },
    },
    tailwindcss(),
    hydrogen(),
    reactRouter(),
    process.env.NODE_ENV === 'development' ? oxygen() : null,
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      // Ensure we use the browser/worker version of react-dom/server
      'react-dom/server': 'react-dom/server.browser',
    },
  },
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
    rollupOptions: {
      // Explicitly mark node built-ins as external but ensure they don't crash the worker
      // if some dependency (not our code) tries to import them.
      external: [/^node:/, 'stream', 'util', 'url', 'path', 'fs', 'crypto'],
    },
  },
  ssr: {
    noExternal: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'isbot',
      '@shopify/hydrogen',
      'cookie',
      'set-cookie-parser',
    ],
    optimizeDeps: {
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
