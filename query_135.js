const STOREFRONT_URL = 'https://ueicbp-za.myshopify.com/api/2024-01/graphql.json';
const STOREFRONT_TOKEN = '4399394a902aaf8ef2ea629571e86d26';

const query = `
{
  product(handle: "135-hard-lip-seal") {
    title
    options {
      name
      values
    }
    variants(first: 10) {
      edges {
        node {
          title
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}
`;

fetch(STOREFRONT_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
  },
  body: JSON.stringify({ query }),
})
  .then((res) => res.json())
  .then((json) => console.log(JSON.stringify(json, null, 2)))
  .catch((err) => console.error(err));
