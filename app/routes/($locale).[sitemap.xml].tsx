import type {Route} from './+types/($locale).[sitemap.xml]';
import {renderSitemapIndexXml, xmlResponse} from '~/lib/sitemap.server';

export async function loader(_args: Route.LoaderArgs) {
  return xmlResponse(renderSitemapIndexXml());
}
