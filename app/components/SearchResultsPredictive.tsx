import { Link, useFetcher, type Fetcher } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import React, { useRef, useEffect } from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import { useAside } from './Aside';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const { term, inputRef, fetcher, total, items } = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles || !articles.length) return null;
  return (
    <div className="predictive-search-result mb-8" key="articles">
      <h5 className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-primary border-b border-gray-100 pb-2 mb-4">Articles</h5>
      <ul className="space-y-2">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li className="predictive-search-result-item" key={article.id}>
              <Link 
                onClick={closeSearch} 
                to={articleUrl}
                className="flex items-center gap-4 group p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                {article.image?.url && (
                  <div className="w-12 h-12 overflow-hidden rounded-sm flex-shrink-0">
                    <Image
                      alt={article.image.altText ?? ''}
                      src={article.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div>
                  <span className="font-display text-sm text-primary group-hover:text-[#4A89C8] transition-colors">{article.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections || !collections.length) return null;
  return (
    <div className="predictive-search-result mb-8" key="collections">
      <h5 className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-primary border-b border-gray-100 pb-2 mb-4">Collections</h5>
      <ul className="space-y-2">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={collection.id}>
              <Link 
                onClick={closeSearch} 
                to={collectionUrl}
                className="flex items-center gap-4 group p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                {collection.image?.url && (
                  <div className="w-12 h-12 overflow-hidden rounded-sm flex-shrink-0">
                    <Image
                      alt={collection.image.altText ?? ''}
                      src={collection.image.url}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <div>
                  <span className="font-display text-sm text-primary group-hover:text-[#4A89C8] transition-colors">{collection.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages || !pages.length) return null;
  return (
    <div className="predictive-search-result mb-8" key="pages">
      <h5 className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-primary border-b border-gray-100 pb-2 mb-4">Pages</h5>
      <ul className="space-y-2">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={page.id}>
              <Link 
                onClick={closeSearch} 
                to={pageUrl}
                className="flex items-center group p-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div>
                  <span className="font-display text-sm text-primary group-hover:text-[#4A89C8] transition-colors">{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="predictive-search-result mb-8" key="products">
      <h5 className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase text-primary border-b border-gray-100 pb-2 mb-4">Products</h5>
      <ul className="space-y-2">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li className="predictive-search-result-item" key={product.id}>
              <Link
                to={productUrl}
                onClick={closeSearch}
                className="flex gap-4 group p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {image && (
                  <div className="w-16 h-16 bg-white overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image
                      alt={image.altText ?? ''}
                      src={image.url}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <p className="font-display text-primary group-hover:text-secondary transition-colors">{product.title}</p>
                  <small className="font-sans text-xs text-gray-500 mt-1">{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  return (
    <div className="py-12 text-center text-gray-500 font-sans text-sm">
      <svg className="w-8 h-8 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      No results found for <q className="font-medium text-primary">"{term.current}"</q>
    </div>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({ key: 'search' });
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const { items, total } =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return { items, total, inputRef, term, fetcher };
}
