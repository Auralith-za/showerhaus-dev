import { ServerRouter } from 'react-router';
import { isbot } from 'isbot';
import type { EntryContext } from 'react-router';

// Use a safe default import to handle CJS/ESM interop in Node.js (Netlify)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { renderToReadableStream } =
  (await import('react-dom/server').catch(() => null)) ??
  // @ts-expect-error fallback for CJS environments
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('react-dom/server');

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
