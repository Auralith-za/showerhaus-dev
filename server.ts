// Netlify-compatible server entry for Shopify Hydrogen
import { storefrontRedirect } from '@shopify/hydrogen';
import { createRequestHandler } from '@netlify/vite-plugin-react-router/serverless';
import { createHydrogenRouterContext } from '~/lib/context';

// The Netlify plugin generates the server-build automatically.
// We export a handler that injects the Hydrogen context via getLoadContext.
export default createRequestHandler({
  // eslint-disable-next-line import/no-unresolved
  build: await import('virtual:react-router/server-build'),
  getLoadContext: async (request: Request) => {
    // Env variables are available via process.env on Node.js
    const env = {
      SESSION_SECRET: process.env.SESSION_SECRET ?? '',
      PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN ?? '',
      PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN ?? '',
      PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID ?? '',
      PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN ?? '',
    } as unknown as Env;

    const hydrogenContext = await createHydrogenRouterContext(request, env);

    return hydrogenContext;
  },
});
