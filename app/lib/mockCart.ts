import type { HydrogenCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { MOCK_PRODUCTS } from '~/lib/mockData';

export function createMockCart(session: any, storefront?: any): HydrogenCart {
  // We store the cart items in the session.
  // The session structure: { mock_cart_lines: Array<{ merchandiseId: string, quantity: number, id: string }> }

  async function getCartFromSession(): Promise<CartApiQueryFragment | null> {
    const lines = session.get('mock_cart_lines') || [];
    if (lines.length === 0) return null;

    let subtotalAmount = 0;

    // Filter out real Shopify variant IDs to batch-query them
    const shopifyVariantIds = lines
      .filter((line: any) => line.merchandiseId && line.merchandiseId.startsWith('gid://shopify/ProductVariant/'))
      .map((line: any) => line.merchandiseId);

    const shopifyVariants: Record<string, any> = {};
    if (shopifyVariantIds.length > 0 && storefront) {
      try {
        const data = await storefront.query(VARIANTS_QUERY, {
          variables: { ids: shopifyVariantIds },
        });
        (data?.nodes || []).forEach((node: any) => {
          if (node) {
            shopifyVariants[node.id] = node;
          }
        });
      } catch (err) {
        console.error('Failed to fetch shopify variants in mock cart:', err);
      }
    }

    const cartLinesNodes = lines.map((line: any) => {
      // If it's a real Shopify variant GID
      if (line.merchandiseId && line.merchandiseId.startsWith('gid://shopify/ProductVariant/')) {
        const variant = shopifyVariants[line.merchandiseId];
        const price = parseFloat(variant?.price?.amount || '0');
        const totalAmount = price * line.quantity;
        subtotalAmount += totalAmount;

        return {
          id: line.id,
          quantity: line.quantity,
          cost: {
            totalAmount: { amount: totalAmount.toString(), currencyCode: variant?.price?.currencyCode || 'ZAR' },
          },
          merchandise: {
            id: line.merchandiseId,
            title: variant?.title || 'Default Title',
            selectedOptions: variant?.selectedOptions || [{ name: 'Default', value: 'Default' }],
            product: {
              title: variant?.product?.title || 'Unknown Product',
              handle: variant?.product?.handle || 'unknown',
            },
            image: variant?.image ? { url: variant.image.url, altText: variant.image.altText || variant.product?.title } : null,
            price: { amount: price.toString(), currencyCode: variant?.price?.currencyCode || 'ZAR' },
          },
        };
      }

      // Mock Product Fallback
      const productId = line.merchandiseId.replace('-variant', '');
      const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);

      const price = parseFloat(mockProduct?.price || '0');
      const totalAmount = price * line.quantity;
      subtotalAmount += totalAmount;

      return {
        id: line.id,
        quantity: line.quantity,
        cost: {
          totalAmount: { amount: totalAmount.toString(), currencyCode: 'ZAR' },
        },
        merchandise: {
          id: line.merchandiseId,
          title: 'Default Title',
          selectedOptions: [{ name: 'Default', value: 'Default' }],
          product: {
            title: mockProduct?.title || 'Unknown Product',
            handle: mockProduct?.handle || 'unknown',
          },
          image: mockProduct?.image ? { url: mockProduct.image, altText: mockProduct.title } : null,
          price: { amount: price.toString(), currencyCode: 'ZAR' },
        },
      };
    });

    return {
      id: 'mock-cart-id',
      checkoutUrl: '/checkout',
      totalQuantity: lines.reduce((acc: number, line: any) => acc + line.quantity, 0),
      lines: {
        nodes: cartLinesNodes,
      },
      cost: {
        subtotalAmount: { amount: subtotalAmount.toString(), currencyCode: 'ZAR' },
        totalAmount: { amount: subtotalAmount.toString(), currencyCode: 'ZAR' },
        totalTaxAmount: { amount: '0', currencyCode: 'ZAR' },
      },
      discountCodes: [],
      appliedGiftCards: [],
    } as unknown as CartApiQueryFragment;
  }

  return {
    get: async () => await getCartFromSession(),
    getCartId: () => 'mock-cart-id',
    setCartId: (id: string) => new Headers(),
    addLines: async (lines: any[]) => {
      const currentLines = session.get('mock_cart_lines') || [];
      
      for (const input of lines) {
        const existing = currentLines.find((l: any) => l.merchandiseId === input.merchandiseId);
        if (existing) {
          existing.quantity += input.quantity;
        } else {
          currentLines.push({
            id: `line-${Date.now()}-${Math.random()}`,
            merchandiseId: input.merchandiseId,
            quantity: input.quantity || 1,
          });
        }
      }
      
      session.set('mock_cart_lines', currentLines);
      return { cart: await getCartFromSession(), errors: [] } as any;
    },
    updateLines: async (lines: any[]) => {
      const currentLines = session.get('mock_cart_lines') || [];
      for (const input of lines) {
        const existing = currentLines.find((l: any) => l.id === input.id);
        if (existing) {
          existing.quantity = input.quantity;
        }
      }
      session.set('mock_cart_lines', currentLines);
      return { cart: await getCartFromSession(), errors: [] } as any;
    },
    removeLines: async (lineIds: string[]) => {
      let currentLines = session.get('mock_cart_lines') || [];
      currentLines = currentLines.filter((l: any) => !lineIds.includes(l.id));
      session.set('mock_cart_lines', currentLines);
      return { cart: await getCartFromSession(), errors: [] } as any;
    },
    updateDiscountCodes: async () => ({ cart: await getCartFromSession(), errors: [] }),
    updateGiftCardCodes: async () => ({ cart: await getCartFromSession(), errors: [] }),
    removeGiftCardCodes: async () => ({ cart: await getCartFromSession(), errors: [] }),
    updateBuyerIdentity: async () => ({ cart: await getCartFromSession(), errors: [] }),
    updateNote: async () => ({ cart: await getCartFromSession(), errors: [] }),
    updateAttributes: async () => ({ cart: await getCartFromSession(), errors: [] }),
    query: async () => await getCartFromSession(),
  } as unknown as HydrogenCart;
}

const VARIANTS_QUERY = `#graphql
  query GetVariants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        title
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        image {
          id
          url
          altText
          width
          height
        }
        product {
          id
          title
          handle
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;
