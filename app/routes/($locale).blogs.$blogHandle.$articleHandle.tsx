import {useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import { DRAFT_ARTICLES } from '~/lib/draftArticles';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
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
          <div className="max-w-md mx-auto overflow-hidden shadow-sm mb-12">
            <Image data={image} sizes="90vw" loading="eager" className="w-full h-auto object-cover" />
          </div>
        )}
      </header>

      <div
        dangerouslySetInnerHTML={{__html: contentHtml}}
        className="article prose prose-lg max-w-none prose-headings:font-display prose-headings:text-primary prose-p:font-sans prose-p:font-light prose-p:text-gray-600 prose-a:text-secondary"
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
