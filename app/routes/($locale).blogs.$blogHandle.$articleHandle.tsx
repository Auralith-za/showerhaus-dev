import {useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import { DRAFT_ARTICLES } from '~/lib/draftArticles';
import {
  SITE_URL,
  SITE_NAME,
  buildSeoMeta,
  buildBreadcrumbJsonLd,
  stripHtml,
  truncateText,
} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data, params}: any) => {
  const article = data?.article;
  const blogHandle = params?.blogHandle || article?.blog?.handle || 'guides';
  const articleHandle = params?.articleHandle || article?.handle || '';
  const canonicalUrl = `${SITE_URL}/blogs/${blogHandle}/${articleHandle}`;

  const title = article?.seo?.title
    ? `${article.seo.title} | ${SITE_NAME}`
    : `${article?.title || 'Shower Guide'} | ${SITE_NAME} South Africa`;

  const description =
    article?.seo?.description ||
    (article?.excerptHtml
      ? truncateText(article.excerptHtml, 160)
      : article?.contentHtml
        ? truncateText(article.contentHtml, 160)
        : `Expert shower enclosure and hardware guide from Shower Haus Durban & South Africa.`);

  const breadcrumbLd = buildBreadcrumbJsonLd([
    {name: 'Home', path: '/'},
    {name: 'Shower Guides', path: '/blogs'},
    {name: article?.title || 'Article', path: `/blogs/${blogHandle}/${articleHandle}`},
  ]);

  const articleLd = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: stripHtml(description),
        image: article.image?.url
          ? [
              article.image.url.startsWith('http')
                ? article.image.url
                : `${SITE_URL}${article.image.url}`,
            ]
          : [`${SITE_URL}/images/hero-3.png`],
        datePublished: article.publishedAt || '2026-06-01T10:00:00Z',
        dateModified: article.publishedAt || '2026-06-01T10:00:00Z',
        author: {
          '@type': 'Organization',
          name: article.author?.name || SITE_NAME,
          url: SITE_URL,
        },
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      }
    : null;

  return buildSeoMeta({
    title,
    description,
    canonicalUrl,
    image: article?.image?.url,
    type: 'article',
    jsonLd: [breadcrumbLd, ...(articleLd ? [articleLd] : [])],
  });
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
  ]);

  let article = blog?.articleByHandle;

  if (!article) {
    const draft = DRAFT_ARTICLES.find(
      (a) => a.handle === articleHandle && a.blog.handle === blogHandle
    );
    if (!draft) {
      throw new Response(null, {status: 404});
    }
    article = draft as any;
  } else {
    redirectIfHandleIsLocalized(
      request,
      {
        handle: articleHandle,
        data: blog.articleByHandle,
      },
      {
        handle: blogHandle,
        data: blog,
      },
    );
  }

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml} = article;

  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl bg-white mt-10">
      <header className="mb-16 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-primary font-bold mb-8">
          {title}
        </h1>
        {image && (
          <div className="w-full overflow-hidden shadow-sm mb-12">
            <Image data={image} sizes="90vw" loading="eager" className="w-full h-auto object-cover" />
          </div>
        )}
      </header>

      <div
        dangerouslySetInnerHTML={{__html: contentHtml}}
        className="article prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-p:font-sans prose-p:font-light prose-p:text-gray-600 prose-a:text-secondary prose-img:w-full prose-img:object-cover prose-img:rounded-md"
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
