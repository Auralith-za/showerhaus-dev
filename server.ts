// @ts-ignore
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import * as build from 'virtual:react-router/server-build';
import { createRequestHandler } from 'react-router';
import { createHydrogenRouterContext } from '~/lib/context';

export default {
  async fetch(request: Request, env: Env, executionContext: ExecutionContext): Promise<Response> {
    try {
      const appLoadContext = await createHydrogenRouterContext(request, env, executionContext);

      const handleRequest = createRequestHandler(build, 'production');

      const response = await handleRequest(request, appLoadContext);

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', { status: 500 });
    }
  },
};
