const { createGraphQLClient } = require('@shopify/graphql-client');

const client = createGraphQLClient({
  url: 'https://showerhaus-dev-0bc128092c126587724a.o2.myshopify.dev/api/2024-01/graphql.json',
  headers: {
    'X-Shopify-Storefront-Access-Token': 'a26569eb27a2948c26bbd2ab2bd858ec',
    'Content-Type': 'application/json'
  }
});

const query = `
  query Catalog($filters: [ProductFilter!]) {
    products(first: 5, filters: $filters) {
      nodes {
        id
      }
    }
  }
`;

async function test() {
  try {
    const res = await client.request(query, { variables: { filters: [] } });
    console.log("With []:", res.data ? "Success" : res);
  } catch (e) {
    console.error("With []:", e.message);
  }
  
  try {
    const res2 = await client.request(query, { variables: {} });
    console.log("Without filters:", res2.data ? "Success" : res2);
  } catch (e) {
    console.error("Without filters:", e.message);
  }
}
test();
