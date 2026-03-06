import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
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
          return null;
        }
      },
    },
    tailwindcss(),
    hydrogen(),
    oxygen(), // Add oxygen() for all environments to ensure consistency
    reactRouter(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      'react-dom/server': 'react-dom/server.browser',
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    noExternal: true, // Bundle all dependencies for Oxygen
    optimizeDeps: {
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
