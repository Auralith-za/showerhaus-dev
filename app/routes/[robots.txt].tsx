import type {Route} from './+types/[robots.txt]';
import {parseGid} from '@shopify/hydrogen';
import {SITE_URL} from '~/lib/seo';

export async function loader({context}: Route.LoaderArgs) {
  let shopId: string | undefined;
  try {
    const {shop} = await context.storefront.query(ROBOTS_QUERY);
    shopId = parseGid(shop.id).id;
  } catch {
    shopId = undefined;
  }

  const body = robotsTxtData({url: SITE_URL, shopId});

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': `public, max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({url, shopId}: {shopId?: string; url?: string}) {
  const baseUrl = url || SITE_URL;

  return `
User-agent: *
Allow: /
Allow: /collections/showers
Allow: /collections/semi-frameless-showers
Allow: /collections/shower-spares
Allow: /collections/all
Allow: /products/
Allow: /pages/
${generalDisallowRules({baseUrl, shopId})}

# Google AdsBot
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*

# Allow Generative AI & Answer Engine Crawlers (GEO Optimization)
User-agent: GPTBot
Allow: /
Disallow: /account
Disallow: /cart
Disallow: /checkout

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({baseUrl, shopId})}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({baseUrl, shopId})}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

function generalDisallowRules({
  shopId,
  baseUrl,
}: {
  shopId?: string;
  baseUrl: string;
}) {
  return `Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Allow: /search/
Disallow: /search/?*
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/product-sitemap.xml
Sitemap: ${baseUrl}/page-sitemap.xml`;
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;
