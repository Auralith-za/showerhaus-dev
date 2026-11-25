import type {LoaderFunctionArgs} from 'react-router';
import {
  STATIC_SITE_PAGES,
  getArticlesSitemapEntries,
  getCollectionsSitemapEntries,
  renderUrlSetXml,
  xmlResponse,
} from '~/lib/sitemap.server';

/**
 * Serves /page-sitemap.xml directly for Google Search Console compatibility.
 * Includes all public static/landing pages, collections, and blog articles.
 */
export async function loader({context: {storefront}}: LoaderFunctionArgs) {
  const [collections, articles] = await Promise.all([
    getCollectionsSitemapEntries(storefront),
    getArticlesSitemapEntries(storefront),
  ]);

  const seen = new Set<string>();
  const combined = [...STATIC_SITE_PAGES, ...collections, ...articles].filter(
    (entry) => {
      if (seen.has(entry.loc)) return false;
      seen.add(entry.loc);
      return true;
    },
  );

  return xmlResponse(renderUrlSetXml(combined));
}
