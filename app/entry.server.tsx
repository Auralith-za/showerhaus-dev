import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import type { EntryContext } from 'react-router';

// Standard ESM import for CJS module pattern as recommended by Netlify/Node
import ReactDOMServer from 'react-dom/server';
const { renderToReadableStream } = ReactDOMServer;

// Netlify-specific load context injector
// This is exported so it can be used by the external server.js entry point
export async function getLoadContext(request: Request) {
  const env = {
    SESSION_SECRET: process.env.SESSION_SECRET ?? '',
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN ?? '',
    PUBLIC_STOREFRONT_API_TOKEN: process.env.PUBLIC_STOREFRONT_API_TOKEN ?? '',
    PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID ?? '',
    PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN ?? '',
  } as any;

  // These will be bundled because entry.server.tsx is part of the app
  const { createHydrogenRouterContext } = await import('~/lib/context');
  return createHydrogenRouterContext(request, env);
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  let statusCode = responseStatusCode;

  try {
    const body = await renderToReadableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        signal: request.signal,
        onError(error: unknown) {
          console.error('[SSR Error]', error);
          statusCode = 500;
        },
      },
    );

    if (isbot(request.headers.get('user-agent'))) {
      await body.allReady;
    }

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(body, {
      headers: responseHeaders,
      status: statusCode,
    });
  } catch (error) {
    console.error('[handleRequest Error]', error);
    return new Response('Server Error', { status: 500 });
  }
}
