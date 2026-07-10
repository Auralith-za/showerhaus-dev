import { redirect } from 'react-router';
import type { Route } from './+types/$';

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  let pathname = url.pathname;

  // Split and filter out empty segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Detect if there's a locale prefix (e.g., "en-us" or similar)
  let localePrefix = '';
  if (segments.length > 0 && /^[a-z]{2}-[a-z]{2}$/i.test(segments[0])) {
    localePrefix = `/${segments[0]}`;
    segments.shift(); // Remove the locale segment for mapping
  }

  // Join the remaining segments back to form a normalized path
  const normalizedPath = '/' + segments.join('/');

  // Redirect mapping rules (keys must be lowercase)
  const redirectMap: Record<string, string> = {
    '/testimonials': '/pages/customer-stories',
    '/testimonials/': '/pages/customer-stories',
    '/customer-stories': '/pages/customer-stories',
    '/customer-stories/': '/pages/customer-stories',
    '/about-us': '/pages/about-us',
    '/about-us/': '/pages/about-us',
    '/about': '/pages/about-us',
    '/about/': '/pages/about-us',
    '/contact-us': '/contact',
    '/contact-us/': '/contact',
    '/contact/': '/contact',
    '/shop': '/collections/all',
    '/shop/': '/collections/all',
    '/frameless-shower-enclosures': '/pages/frameless-showers',
    '/frameless-shower-enclosures/': '/pages/frameless-showers',
    '/frameless-showers/': '/pages/frameless-showers',
    '/frameless-custom-made': '/pages/custom-made-showers',
    '/frameless-custom-made/': '/pages/custom-made-showers',
    '/custom-made-showers/': '/pages/custom-made-showers',
    '/shower-spares': '/collections/shower-spares',
    '/shower-spares/': '/collections/shower-spares',
    '/handles-towel-rails': '/collections/handles-towel-rails',
    '/handles-towel-rails/': '/collections/handles-towel-rails',
    '/hinges-and-clamps': '/collections/hinges-and-clamps',
    '/hinges-and-clamps/': '/collections/hinges-and-clamps',
  };

  const targetPath = redirectMap[normalizedPath.toLowerCase()];
  if (targetPath) {
    return redirect(`${localePrefix}${targetPath}`, 301);
  }

  // Throw 404 if no redirect matches
  throw new Response(`${pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}
