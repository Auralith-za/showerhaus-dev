import type {Route} from './+types/($locale).sitemap.$type.$page[.xml]';
import {
  STATIC_SITE_PAGES,
  getArticlesSitemapEntries,
  getCollectionsSitemapEntries,
  getProductsSitemapEntries,
  renderUrlSetXml,
  xmlResponse,
} from '~/lib/sitemap.server';
import {SITE_URL} from '~/lib/seo';

export async function loader({
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  const type = (params.type || '').toLowerCase();

  if (type === 'products') {
    const entries = await getProductsSitemapEntries(storefront);
    return xmlResponse(renderUrlSetXml(entries));
  }

  if (type === 'collections') {
    const entries = await getCollectionsSitemapEntries(storefront);
    return xmlResponse(renderUrlSetXml(entries));
  }

  if (type === 'pages') {
    return xmlResponse(renderUrlSetXml(STATIC_SITE_PAGES));
  }

  if (type === 'articles') {
    const entries = await getArticlesSitemapEntries(storefront);
    return xmlResponse(renderUrlSetXml(entries));
  }

  if (type === 'blogs') {
    return xmlResponse(
      renderUrlSetXml([
        {
          loc: `${SITE_URL}/blogs`,
          changefreq: 'weekly',
          priority: '0.80',
        },
      ]),
    );
  }

  throw new Response('Sitemap type not found', {status: 404});
}
