import type {LoaderFunctionArgs} from 'react-router';
import {
  getProductsSitemapEntries,
  renderUrlSetXml,
  xmlResponse,
} from '~/lib/sitemap.server';

/**
 * Serves /product-sitemap.xml directly for Google Search Console compatibility
 */
export async function loader({context: {storefront}}: LoaderFunctionArgs) {
  const entries = await getProductsSitemapEntries(storefront);
  return xmlResponse(renderUrlSetXml(entries));
}
