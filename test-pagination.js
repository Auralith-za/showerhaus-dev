const query = `
  query Catalog(
    $first: Int
    $after: String
    $sortKey: ProductSortKeys
  ) {
    products(first: $first, after: $after, sortKey: $sortKey) {
      nodes { id title }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

async function run() {
  const res1 = await fetch('https://ueicbp-za.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '4399394a902aaf8ef2ea629571e86d26'
    },
    body: JSON.stringify({ query, variables: { first: 12, sortKey: "BEST_SELLING" } })
  });
  const data1 = await res1.json();
  const page1Nodes = data1.data.products.nodes.map(n => n.title);
  
  const cursor = data1.data.products.pageInfo.endCursor;

  const res2 = await fetch('https://ueicbp-za.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '4399394a902aaf8ef2ea629571e86d26'
    },
    body: JSON.stringify({ query, variables: { first: 12, after: cursor, sortKey: "BEST_SELLING" } })
  });
  const data2 = await res2.json();
  const page2Nodes = data2.data.products.nodes.map(n => n.title);
  
  const overlap = page1Nodes.filter(title => page2Nodes.includes(title));
  console.log('Duplicates with BEST_SELLING:', overlap.length);
}
run();
