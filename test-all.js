const { createStorefrontClient } = require('@shopify/hydrogen');

const client = createStorefrontClient({
  storeDomain: 'https://ueicbp-za.myshopify.com',
  publicStorefrontToken: '4399394a902aaf8ef2ea629571e86d26',
  storefrontApiVersion: '2024-01'
});

async function run() {
  const query = `
    query {
      collection(handle: "all") {
        title
        products(first: 5) {
          nodes {
            title
          }
        }
      }
    }
  `;
  const response = await fetch('https://ueicbp-za.myshopify.com/api/2024-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '4399394a902aaf8ef2ea629571e86d26'
    },
    body: JSON.stringify({ query })
  });
  console.log(JSON.stringify(await response.json(), null, 2));
}
run();
