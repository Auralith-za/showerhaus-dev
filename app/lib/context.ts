import { createHydrogenContext } from '@shopify/hydrogen';
import { AppSession } from '~/lib/session';
import { CART_QUERY_FRAGMENT } from '~/lib/fragments';
import { getLocaleFromRequest } from '~/lib/i18n';

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
} as const;

// Automatically augment HydrogenAdditionalContext with the additional context type
type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType { }
}

/**
 * Creates a no-op in-memory cache compatible with Node.js (Netlify Functions).
 * The real Hydrogen cache relies on the Cloudflare Cache API which is not
 * available in Netlify's Node.js runtime.
 */
function createNodeCache(): Cache {
  const store = new Map<string, Response>();
  return {
    match: async (req: RequestInfo) => {
      const key = typeof req === 'string' ? req : (req as Request).url;
      return store.get(key)?.clone();
    },
    put: async (req: RequestInfo, res: Response) => {
      const key = typeof req === 'string' ? req : (req as Request).url;
      store.set(key, res);
    },
    delete: async (req: RequestInfo) => {
      const key = typeof req === 'string' ? req : (req as Request).url;
      return store.delete(key);
    },
    keys: async () => [],
    add: async () => { },
    addAll: async () => { },
  } as unknown as Cache;
}

/**
 * Creates Hydrogen context for React Router 7.9.x on Netlify (Node.js runtime).
 */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  // executionContext is optional — it's a Cloudflare Workers API not present on Netlify
  executionContext?: { waitUntil?: (promise: Promise<unknown>) => void },
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext?.waitUntil?.bind(executionContext) ?? ((_p: Promise<unknown>) => { });
  const cache = createNodeCache();
  const session = await AppSession.init(request, [env.SESSION_SECRET]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: getLocaleFromRequest(request),
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}
