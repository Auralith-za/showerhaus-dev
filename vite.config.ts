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
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    // Force bundling of all dependencies for the Oxygen worker environment
    noExternal: true,
    optimizeDeps: {
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});
