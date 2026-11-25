import type {Storefront} from '@shopify/hydrogen';
import {SITE_URL} from './seo';
import {DRAFT_ARTICLES} from './draftArticles';

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'daily' | 'weekly' | 'monthly';
  priority?: string;
  image?: {
    loc: string;
    title?: string;
  };
}

export const STATIC_SITE_PAGES: SitemapUrlEntry[] = [
  {
    loc: `${SITE_URL}/`,
    changefreq: 'daily',
    priority: '1.0',
  },
  {
    loc: `${SITE_URL}/collections/showers`,
    changefreq: 'daily',
    priority: '0.95',
  },
  {
    loc: `${SITE_URL}/pages/custom-made-showers`,
    changefreq: 'weekly',
    priority: '0.95',
  },
  {
    loc: `${SITE_URL}/pages/frameless-showers`,
    changefreq: 'weekly',
    priority: '0.95',
  },
  {
    loc: `${SITE_URL}/pages/design-your-shower`,
    changefreq: 'weekly',
    priority: '0.90',
  },
  {
    loc: `${SITE_URL}/collections/all`,
    changefreq: 'daily',
    priority: '0.90',
  },
  {
    loc: `${SITE_URL}/collections/semi-frameless-showers`,
    changefreq: 'daily',
    priority: '0.90',
  },
  {
    loc: `${SITE_URL}/collections/shower-spares`,
    changefreq: 'daily',
    priority: '0.90',
  },
  {
    loc: `${SITE_URL}/pages/about-us`,
    changefreq: 'monthly',
    priority: '0.80',
  },
  {
    loc: `${SITE_URL}/pages/customer-stories`,
    changefreq: 'monthly',
    priority: '0.80',
  },
  {
    loc: `${SITE_URL}/contact`,
    changefreq: 'monthly',
    priority: '0.85',
  },
  {
    loc: `${SITE_URL}/blogs`,
    changefreq: 'weekly',
    priority: '0.80',
  },
  {
    loc: `${SITE_URL}/pages/our-story`,
    changefreq: 'monthly',
    priority: '0.70',
  },
  {
    loc: `${SITE_URL}/pages/projects`,
    changefreq: 'monthly',
    priority: '0.75',
  },
  {
    loc: `${SITE_URL}/pages/accreditation`,
    changefreq: 'monthly',
    priority: '0.75',
  },
  {
    loc: `${SITE_URL}/legal`,
    changefreq: 'monthly',
    priority: '0.50',
  },
  {
    loc: `${SITE_URL}/legal/shipping-and-delivery`,
    changefreq: 'monthly',
    priority: '0.60',
  },
  {
    loc: `${SITE_URL}/legal/refund-and-returns`,
    changefreq: 'monthly',
    priority: '0.60',
  },
  {
    loc: `${SITE_URL}/legal/terms-and-conditions`,
    changefreq: 'monthly',
    priority: '0.50',
  },
  {
    loc: `${SITE_URL}/legal/privacy`,
    changefreq: 'monthly',
    priority: '0.50',
  },
  {
    loc: `${SITE_URL}/legal/cookies`,
    changefreq: 'monthly',
    priority: '0.40',
  },
  {
    loc: `${SITE_URL}/legal/using-our-website`,
    changefreq: 'monthly',
    priority: '0.40',
  },
];

export function renderUrlSetXml(entries: SitemapUrlEntry[]): string {
  const hasImages = entries.some((e) => Boolean(e.image?.loc));
  const xmlnsImage = hasImages
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : '';

  const todayIso = new Date().toISOString();

  const urlsXml = entries
    .map((entry) => {
      const lastmod = entry.lastmod || todayIso;
      const changefreq = entry.changefreq || 'weekly';
      const priorityTag = entry.priority
        ? `\n    <priority>${escapeXml(entry.priority)}</priority>`
        : '';
      const imageTag = entry.image?.loc
        ? `\n    <image:image>\n      <image:loc>${escapeXml(entry.image.loc)}</image:loc>${
            entry.image.title
              ? `\n      <image:title>${escapeXml(entry.image.title)}</image:title>`
              : ''
          }\n    </image:image>`
        : '';

      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>${priorityTag}${imageTag}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${xmlnsImage}>
${urlsXml}
</urlset>`;
}

export function renderSitemapIndexXml(): string {
  const todayIso = new Date().toISOString();
  const sitemaps = [
    `${SITE_URL}/sitemap/products/1.xml`,
    `${SITE_URL}/sitemap/collections/1.xml`,
    `${SITE_URL}/sitemap/pages/1.xml`,
    `${SITE_URL}/sitemap/articles/1.xml`,
  ];

  const items = sitemaps
    .map(
      (loc) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(todayIso)}</lastmod>
  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

export async function getProductsSitemapEntries(
  storefront: Storefront,
): Promise<SitemapUrlEntry[]> {
  try {
    const data = await storefront.query(SITEMAP_PRODUCTS_QUERY, {
      cache: storefront.CacheLong(),
    });
    const nodes = data?.products?.nodes || [];

    // Sort Showers products first with highest priority (0.95)
    const sorted = [...nodes].sort((a: any, b: any) => {
      const aIsShower =
        a.productType === 'Showers' || a.handle?.includes('semi-frameless');
      const bIsShower =
        b.productType === 'Showers' || b.handle?.includes('semi-frameless');
      if (aIsShower && !bIsShower) return -1;
      if (!aIsShower && bIsShower) return 1;
      return 0;
    });

    return sorted.map((p: any) => {
      const isShower =
        p.productType === 'Showers' || p.handle?.includes('semi-frameless');
      return {
        loc: `${SITE_URL}/products/${p.handle}`,
        lastmod: p.updatedAt || new Date().toISOString(),
        changefreq: 'weekly',
        priority: isShower ? '0.95' : '0.80',
        image: p.featuredImage?.url
          ? {
              loc: p.featuredImage.url,
              title: p.title,
            }
          : undefined,
      };
    });
  } catch (error) {
    console.error('Failed to build products sitemap:', error);
    return [];
  }
}

export async function getCollectionsSitemapEntries(
  storefront: Storefront,
): Promise<SitemapUrlEntry[]> {
  const baseCollections: SitemapUrlEntry[] = [
    {
      loc: `${SITE_URL}/collections/showers`,
      changefreq: 'daily',
      priority: '0.95',
    },
    {
      loc: `${SITE_URL}/collections/all`,
      changefreq: 'daily',
      priority: '0.90',
    },
  ];

  try {
    const data = await storefront.query(SITEMAP_COLLECTIONS_QUERY, {
      cache: storefront.CacheLong(),
    });
    const nodes = data?.collections?.nodes || [];
    const seen = new Set(baseCollections.map((c) => c.loc));

    for (const col of nodes) {
      if (!col?.handle || col.handle === 'frontpage' || col.handle === 'all') {
        continue;
      }
      const loc = `${SITE_URL}/collections/${col.handle}`;
      if (!seen.has(loc)) {
        seen.add(loc);
        baseCollections.push({
          loc,
          lastmod: col.updatedAt || new Date().toISOString(),
          changefreq: 'daily',
          priority: '0.90',
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch collections for sitemap:', error);
  }

  return baseCollections;
}

export async function getArticlesSitemapEntries(
  storefront: Storefront,
): Promise<SitemapUrlEntry[]> {
  const entries: SitemapUrlEntry[] = [];
  const seen = new Set<string>();

  try {
    const data = await storefront.query(SITEMAP_ARTICLES_QUERY, {
      cache: storefront.CacheLong(),
    });
    const blogs = data?.blogs?.nodes || [];
    for (const blog of blogs) {
      const articles = blog?.articles?.nodes || [];
      for (const article of articles) {
        if (!article?.handle || !blog?.handle) continue;
        const loc = `${SITE_URL}/blogs/${blog.handle}/${article.handle}`;
        if (!seen.has(loc)) {
          seen.add(loc);
          entries.push({
            loc,
            lastmod: article.publishedAt || new Date().toISOString(),
            changefreq: 'monthly',
            priority: '0.75',
          });
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch articles for sitemap:', error);
  }

  for (const draft of DRAFT_ARTICLES) {
    const loc = `${SITE_URL}/blogs/${draft.blog.handle}/${draft.handle}`;
    if (!seen.has(loc)) {
      seen.add(loc);
      entries.push({
        loc,
        lastmod: draft.publishedAt,
        changefreq: 'monthly',
        priority: '0.70',
      });
    }
  }

  return entries;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, max-age=${60 * 60}`,
    },
  });
}

const SITEMAP_PRODUCTS_QUERY = `#graphql
  query SitemapProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 250, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        handle
        title
        productType
        updatedAt
        featuredImage {
          url
          altText
        }
      }
    }
  }
` as const;

const SITEMAP_COLLECTIONS_QUERY = `#graphql
  query SitemapCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 100, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        handle
        title
        updatedAt
      }
    }
  }
` as const;

const SITEMAP_ARTICLES_QUERY = `#graphql
  query SitemapArticles($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    blogs(first: 20) {
      nodes {
        handle
        title
        articles(first: 100, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            handle
            title
            publishedAt
          }
        }
      }
    }
  }
` as const;
