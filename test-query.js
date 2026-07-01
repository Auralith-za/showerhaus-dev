import { createStorefrontClient } from '@shopify/hydrogen';

const client = createStorefrontClient({
  storeDomain: 'https://shower-haus.myshopify.com',
  publicStorefrontToken: 'd65fddda4c9354e6ff71221bb5dddbfc', // Usually in .env
  storefrontApiVersion: '2024-01'
});

async function run() {
  const query = `
    query {
      collection(handle: "all") {
        products(first: 5, filters: [{ price: { min: 100, max: 150 } }]) {
          nodes {
            title
            priceRange { minVariantPrice { amount } }
          }
        }
      }
    }
  `;
  const response = await fetch('https://shower-haus.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': 'd65fddda4c9354e6ff71221bb5dddbfc'
    },
    body: JSON.stringify({ query })
  });
  console.log(await response.json());
}
run();
