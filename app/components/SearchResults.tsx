import {Link} from 'react-router';
import {Image, Pagination} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <div className="space-y-1">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
              <div className="search-results-item border border-transparent border-b-gray-100 py-6 last:border-b-0 hover:bg-gray-50/80 transition-all duration-300 px-4 rounded-xl" key={article.id}>
                <Link prefetch="intent" to={articleUrl} className="font-display font-medium text-lg text-primary hover:text-secondary transition-colors block">
                  {article.title}
                </Link>
              </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <div className="space-y-1">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
              <div className="search-results-item border border-transparent border-b-gray-100 py-6 last:border-b-0 hover:bg-gray-50/80 transition-all duration-300 px-4 rounded-xl" key={page.id}>
                <Link prefetch="intent" to={pageUrl} className="font-display font-medium text-lg text-primary hover:text-secondary transition-colors block">
                  {page.title}
                </Link>
              </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const compareAtPrice = product?.selectedOrFirstAvailableVariant?.compareAtPrice;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <div className="search-results-item border border-transparent border-b-gray-100 py-6 last:border-b-0 hover:bg-gray-50/80 transition-all duration-300 px-4 rounded-xl" key={product.id}>
                <Link prefetch="intent" to={productUrl} className="flex items-center gap-8 group">
                  {image && (
                    <div className="w-24 h-24 bg-white overflow-hidden rounded-lg flex-shrink-0 border border-gray-100 flex items-center justify-center p-2 shadow-sm group-hover:shadow-md transition-shadow">
                      <Image data={image} alt={product.title} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-display text-lg text-primary group-hover:text-secondary transition-colors mb-2">{product.title}</p>
                    <div className="font-sans text-sm font-medium text-gray-500">
                      <ProductPrice price={price} compareAtPrice={compareAtPrice} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div>
              <div className="flex justify-center mb-6">
                <PreviousLink className="inline-block bg-white !text-primary border border-primary px-8 py-3.5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:!bg-primary hover:!text-white transition-colors cursor-pointer rounded-none">
                  {isLoading ? 'Loading...' : '↑ Load previous'}
                </PreviousLink>
              </div>
              <div className="space-y-1">
                {ItemsMarkup}
              </div>
              <div className="flex justify-center mt-8">
                <NextLink className="inline-block bg-white !text-primary border border-primary px-8 py-3.5 font-sans text-[10px] font-bold tracking-[0.2em] uppercase hover:!bg-primary hover:!text-white transition-colors cursor-pointer rounded-none">
                  {isLoading ? 'Loading...' : 'Load more ↓'}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}
