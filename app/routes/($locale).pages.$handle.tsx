import { useLoaderData } from 'react-router';
import type { Route } from './+types/pages.$handle';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.page.title ?? ''}` }];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return { ...deferredData, ...criticalData };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({ context, request, params }: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  // Handle redirects for old/custom pages
  if (params.handle === 'contact') {
    throw new Response(null, { status: 301, headers: { Location: '/contact' } });
  }
  if (params.handle === 'newsletter') {
    throw new Response(null, { status: 301, headers: { Location: '/blogs' } });
  }

  const [{ page }] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    const formattedTitle = params.handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      page: {
        id: 'mock-page',
        handle: params.handle,
        title: formattedTitle,
        body: `
          <div class="prose prose-lg mx-auto">
            <p class="lead text-xl text-gray-500 mb-8">Welcome to our ${formattedTitle} page. This is a beautifully designed placeholder for your actual content. You can seamlessly replace this text by creating a page with handle <code>${params.handle}</code> in your Shopify Admin.</p>
            
            <h3 class="text-2xl font-display text-primary mt-12 mb-4">Our Commitment</h3>
            <p>At ShowerHaus, we pride ourselves on delivering exceptional quality and service. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <h3 class="text-2xl font-display text-primary mt-12 mb-4">Key Information</h3>
            <ul class="space-y-4 my-6">
              <li class="flex items-start"><span class="text-secondary mr-2">✓</span> <span><strong>Reliability:</strong> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span></li>
              <li class="flex items-start"><span class="text-secondary mr-2">✓</span> <span><strong>Excellence:</strong> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span></li>
              <li class="flex items-start"><span class="text-secondary mr-2">✓</span> <span><strong>Support:</strong> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</span></li>
            </ul>
            
            <h3 class="text-2xl font-display text-primary mt-12 mb-4">Get in Touch</h3>
            <p>If you have any specific questions regarding our ${formattedTitle.toLowerCase()}, please don't hesitate to <a href="/contact" class="text-secondary underline hover:text-primary">contact our customer care team</a>. We are always here to help you design your perfect bathroom.</p>
          </div>
        `,
        seo: {
          title: formattedTitle,
          description: 'Placeholder page'
        }
      }
    };
  }

  redirectIfHandleIsLocalized(request, { handle: params.handle, data: page });

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div className="page bg-white min-h-[60vh] py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-primary">{page.title}</h1>
        </header>
        <main
          className="prose prose-lg prose-gray font-sans font-light text-gray-600 mx-auto"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
