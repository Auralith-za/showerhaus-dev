import { createStorefrontClient } from '@shopify/hydrogen';

const client = createStorefrontClient({
  storeDomain: 'https://ueicbp-za.myshopify.com',
  publicStorefrontToken: '4399394a902aaf8ef2ea629571e86d26',
  storefrontApiVersion: '2024-01'
});

async function run() {
  const query = `
    query Catalog(
      $first: Int
      $query: String
      $sortKey: ProductSortKeys
      $reverse: Boolean
    ) {
      products(
        first: $first
        query: $query
        sortKey: $sortKey
        reverse: $reverse
      ) {
        nodes {
          title
        }
      }
    }
  `;
  
  const queryVariables = {
    first: 12,
    sortKey: 'RELEVANCE',
    reverse: false
  };
  
  // Simulation of URL: /collections/all?filter.p.product_type=Shower+Seals
  // queryParts would be empty since we don't have 'filter' params.
  // maxPrice is not set.
  // So queryVariables.query is NOT set.
  
  const response = await fetch('https://ueicbp-za.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '4399394a902aaf8ef2ea629571e86d26'
    },
    body: JSON.stringify({ query, variables: queryVariables })
  });
  console.log(JSON.stringify(await response.json(), null, 2));
}
run();
