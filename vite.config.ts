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
    tailwindcss(),
    hydrogen(),
    oxygen(),
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
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
    },
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
