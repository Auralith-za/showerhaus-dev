import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import netlifyReactRouter from '@netlify/vite-plugin-react-router';
import netlify from '@netlify/vite-plugin';

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
    netlifyReactRouter(),
    netlify(),
    tsconfigPaths(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
