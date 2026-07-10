import { redirect } from 'react-router';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { language, country } = context.storefront.i18n;

  if (params.locale) {
    const isLocaleFormat = /^[a-z]{2}-[a-z]{2}$/i.test(params.locale);
    if (!isLocaleFormat) {
      // If it's not a locale format, it's a standard URL segment (like 'testimonials', 'about-us')
      const path = `/${params.locale.toLowerCase()}`;
      
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

      const targetPath = redirectMap[path];
      if (targetPath) {
        return redirect(targetPath, 301);
      }

      throw new Response(null, { status: 404 });
    }

    if (params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()) {
      throw new Response(null, { status: 404 });
    }
  }

  return null;
}
