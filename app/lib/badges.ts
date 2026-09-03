/**
 * Extracts and formats badge tags for a product from Shopify tags and compare-at pricing.
 * Supports any current or future tags created in Shopify (e.g. 'on-sale', 'reduced', 'new', etc.)
 */
export function getProductBadges(product?: {
  tags?: string[];
  priceRange?: any;
  compareAtPriceRange?: any;
  compareAtPrice?: any;
  price?: any;
}): string[] {
  if (!product) return [];

  const badges: string[] = [];
  const tags = product.tags || [];

  // Add all Shopify product tags
  for (const tag of tags) {
    const cleanTag = tag.trim();
    if (cleanTag) {
      badges.push(cleanTag);
    }
  }

  // Check if compare-at-price is active
  const compareAtPrice =
    product.compareAtPrice ||
    product.compareAtPriceRange?.minVariantPrice;
  const price =
    product.price ||
    product.priceRange?.minVariantPrice;

  const isOnSale =
    compareAtPrice &&
    price &&
    parseFloat(compareAtPrice.amount) > 0 &&
    parseFloat(compareAtPrice.amount) !== parseFloat(price.amount);

  if (isOnSale) {
    const hasSaleTag = badges.some((b) =>
      ['sale', 'on-sale', 'on sale', 'reduced', 'discount'].includes(
        b.toLowerCase(),
      ),
    );
    if (!hasSaleTag) {
      badges.push('On-Sale');
    }
  }

  // Deduplicate case-insensitively
  const uniqueBadges: string[] = [];
  const seenLower = new Set<string>();
  for (const b of badges) {
    const lower = b.toLowerCase();
    if (!seenLower.has(lower)) {
      seenLower.add(lower);
      uniqueBadges.push(b);
    }
  }

  return uniqueBadges;
}
