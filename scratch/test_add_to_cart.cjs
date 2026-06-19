const { createGraphQLClient } = require('@shopify/graphql-client');

const client = createGraphQLClient({
  url: 'https://ueicbp-za.myshopify.com/api/2024-01/graphql.json',
  headers: {
    'X-Shopify-Storefront-Access-Token': '4399394a902aaf8ef2ea629571e86d26',
    'Content-Type': 'application/json'
  }
});

const query = `
  mutation {
    cartCreate(input: {
      lines: [
        {
          merchandiseId: "gid://shopify/ProductVariant/66832563536176",
          quantity: 1
        }
      ]
    }) {
      cart {
        id
        lines(first: 10) {
          edges {
            node {
              id
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function test() {
  try {
    const res = await client.request(query, { variables: {} });
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error(e.message);
  }
}
test();
