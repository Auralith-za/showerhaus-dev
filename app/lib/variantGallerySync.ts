/**
 * Shared helpers to keep product gallery images and selected variants in sync
 * across all Shower Haus product pages.
 */

export interface ImageLike {
  __typename?: string;
  id?: string | null;
  url?: string | null;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

/**
 * Normalizes a Shopify image (whether `ProductImage` on a variant or `ImageSource`/`Image` on `media.nodes`)
 * to a consistent key based on its canonical filename/URL so comparisons work across different GraphQL ID types.
 */
export function getImageKey(img?: ImageLike | null): string {
  if (!img) return '';
  if (img.url) {
    try {
      const cleanUrl = img.url.split('?')[0];
      const filename = cleanUrl.split('/').pop();
      if (filename) return decodeURIComponent(filename).toLowerCase().trim();
      return cleanUrl.toLowerCase().trim();
    } catch {
      return img.url.split('?')[0].toLowerCase().trim();
    }
  }
  return (img.id || '').toLowerCase().trim();
}

export function isSameImage(
  imgA?: ImageLike | null,
  imgB?: ImageLike | null,
): boolean {
  const keyA = getImageKey(imgA);
  const keyB = getImageKey(imgB);
  if (!keyA || !keyB) return false;
  return keyA === keyB;
}

/**
 * Explicit image-to-option overrides for specific product handles or filenames.
 * Keyed by normalized image filename (`getImageKey(img)`).
 * Value of `null` explicitly marks a shared image (lifestyle scene, dimensions, diagram)
 * that must never change the selected variant.
 */
export const EXPLICIT_IMAGE_OPTION_MAP: Record<
  string,
  Record<string, Record<string, string> | null>
> = {
  'semi-frameless-shower-screen': {
    'sf-screen-whitescreen_compressed.jpg': { Finish: 'Polished Aluminium' },
    'sf-screen-whitescreen-black_square_compressed.jpg': { Finish: 'Matt Black' },
    'sf-screen-scene1_compressed.png': null,
    'sf-screen-scene2_compressed.png': null,
  },
};

const SHARED_IMAGE_KEYWORDS = [
  'scene',
  'lifestyle',
  'diagram',
  'dimension',
  'dimensions',
  'measurement',
  'measurements',
  'drawing',
  'technical',
  'install',
  'installation',
  'guide',
  'chart',
  'shared',
  'all-finishes',
  'both-finishes',
  'comparison',
];

const VISUAL_OPTION_NAMES = new Set([
  'finish',
  'color',
  'colour',
  'side',
  'type',
  'style',
  'material',
]);

/**
 * Synonym tokens used to explicitly match an image's altText or filename to an option value
 * when multiple photos of the same finish exist in the product gallery.
 */
function getTokensForOptionValue(optionValue: string): string[] {
  const normalized = optionValue.trim().toLowerCase();
  const tokens = new Set<string>([
    normalized,
    normalized.replace(/\s+/g, '-'),
    normalized.replace(/\s+/g, '_'),
  ]);

  if (normalized === 'matt black' || normalized === 'matte black' || normalized === 'black') {
    tokens.add('matt-black');
    tokens.add('matte-black');
    tokens.add('matt_black');
    tokens.add('black');
  } else if (
    normalized === 'polished aluminium' ||
    normalized === 'polished aluminum'
  ) {
    tokens.add('polished-aluminium');
    tokens.add('polished-aluminum');
    tokens.add('polished_aluminium');
    tokens.add('aluminium');
    tokens.add('aluminum');
    tokens.add('chrome');
    tokens.add('silver');
  } else if (normalized === 'satin gold') {
    tokens.add('satin-gold');
    tokens.add('gold');
  } else if (normalized === 'antique brass') {
    tokens.add('antique-brass');
    tokens.add('brass');
  } else if (normalized === 'grey' || normalized === 'gray') {
    tokens.add('grey');
    tokens.add('gray');
  }

  return Array.from(tokens);
}

function textContainsToken(haystack: string, token: string): boolean {
  if (!haystack || !token) return false;
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return regex.test(haystack);
}

function isExplicitlySharedImage(img: ImageLike): boolean {
  const key = getImageKey(img);
  const alt = (img.altText || '').toLowerCase();
  const combined = `${key} ${alt}`;

  return SHARED_IMAGE_KEYWORDS.some((kw) => {
    // Match 'scene', 'scene1', 'scene-1', 'diagram', etc.
    const regex = new RegExp(`(^|[^a-z])${kw}([0-9_-]|$|[^a-z])`, 'i');
    return regex.test(combined);
  });
}

/**
 * Determines which option values (e.g. `{ Finish: "Matt Black" }`) an image explicitly represents.
 * Returns `null` if the image is a shared image (lifestyle scene, dimensions, diagram, or shared placeholder)
 * that should NOT change the selected variant when clicked.
 */
export function getImageOptionAssociation(
  img: ImageLike | null | undefined,
  product: any,
): Record<string, string> | null {
  if (!img || !product) return null;

  const imgKey = getImageKey(img);
  if (!imgKey) return null;

  const handle = (product.handle || '').toLowerCase();

  // 1. Check explicit per-product image map first
  if (
    handle &&
    EXPLICIT_IMAGE_OPTION_MAP[handle] &&
    imgKey in EXPLICIT_IMAGE_OPTION_MAP[handle]
  ) {
    return EXPLICIT_IMAGE_OPTION_MAP[handle][imgKey];
  }

  const variants: any[] = product?.variants?.nodes || [];
  const options: any[] = (product?.options || []).filter(
    (o: any) =>
      !(
        o.name === 'Title' &&
        o.optionValues?.length === 1 &&
        o.optionValues[0]?.name === 'Default Title'
      ),
  );

  if (options.length === 0 || variants.length === 0) {
    return null;
  }

  // 2. Check direct variant image assignments in Shopify
  const matchingVariants = variants.filter(
    (v) => v?.image && getImageKey(v.image) === imgKey,
  );

  if (matchingVariants.length > 0) {
    const associatedOptions: Record<string, string> = {};

    for (const option of options) {
      const optName = option.name;
      // Check if this option actually differentiates images across the product's variants
      const distinctImagesForOption = new Set<string>();
      for (const v of variants) {
        const vImgKey = getImageKey(v?.image);
        if (vImgKey) distinctImagesForOption.add(vImgKey);
      }

      // If every variant on the entire product shares one single placeholder image,
      // clicking that single placeholder image should not change options.
      if (distinctImagesForOption.size <= 1) {
        continue;
      }

      const valuesUsingThisImage = new Set<string>();
      for (const v of matchingVariants) {
        const foundOpt = (v.selectedOptions || []).find(
          (so: any) => so.name.toLowerCase() === optName.toLowerCase(),
        );
        if (foundOpt?.value) {
          valuesUsingThisImage.add(foundOpt.value);
        }
      }

      // Only associate if ALL variants using this image share the exact same single value for this option
      if (valuesUsingThisImage.size === 1) {
        const [singleValue] = Array.from(valuesUsingThisImage);
        associatedOptions[optName] = singleValue;
      }
    }

    if (Object.keys(associatedOptions).length > 0) {
      return associatedOptions;
    }
    // If variants with different finishes/colors share this same image, it's a shared image
    return null;
  }

  // 3. If the image is not directly assigned as `variant.image` (e.g. a 2nd or 3rd photo of a finish, or a shared lifestyle/diagram photo):
  if (isExplicitlySharedImage(img)) {
    return null;
  }

  // Check if altText or filename explicitly names a single option value of a visual option (Finish / Color / Colour / Side)
  const altText = (img.altText || '').toLowerCase();
  const filenameWithoutExt = imgKey.replace(/\.[a-z0-9]+$/i, '');

  // Support explicit altText syntax like "Finish: Matt Black" or "Color: Black"
  const associatedFromAltOrFilename: Record<string, string> = {};

  for (const option of options) {
    const optName = option.name;
    const optNameLower = optName.toLowerCase();
    const isVisualOption =
      VISUAL_OPTION_NAMES.has(optNameLower) || options.length === 1;
    if (!isVisualOption) continue;

    const optionValues: string[] = (option.optionValues || [])
      .map((ov: any) => ov?.name)
      .filter(Boolean);

    const matchedValues: string[] = [];

    for (const valName of optionValues) {
      const tokens = getTokensForOptionValue(valName);
      const matchesAlt = tokens.some((t) => textContainsToken(altText, t));
      const matchesFile = tokens.some((t) =>
        textContainsToken(filenameWithoutExt, t),
      );
      if (matchesAlt || matchesFile) {
        matchedValues.push(valName);
      }
    }

    // Only map if it unambiguously matches EXACTLY ONE option value (never multiple finishes)
    if (matchedValues.length === 1) {
      associatedFromAltOrFilename[optName] = matchedValues[0];
    }
  }

  return Object.keys(associatedFromAltOrFilename).length > 0
    ? associatedFromAltOrFilename
    : null;
}

/**
 * Finds the best gallery image to display when the user selects a new option value
 * (e.g. clicking the "Matt Black" or "Polished Aluminium" finish swatch).
 */
export function findGalleryImageForOptions(
  product: any,
  selectedOptionsMap: Record<string, string>,
  changedOptionName?: string,
): ImageLike | null {
  if (!product) return null;
  const variants: any[] = product?.variants?.nodes || [];
  const mediaImages: ImageLike[] = (product?.media?.nodes || [])
    .map((m: any) => m?.image)
    .filter(Boolean);

  // 1. Try exact variant match first
  const exactVariant = findExactVariant(variants, selectedOptionsMap);
  if (exactVariant?.image) {
    const matchingMedia = mediaImages.find((mImg) =>
      isSameImage(mImg, exactVariant.image),
    );
    return matchingMedia || exactVariant.image;
  }

  // 2. If the combination doesn't exist (or we want the image for the newly selected finish),
  // find any variant or gallery image associated with the changed option (or Finish/Color option)
  const targetOptionNames = changedOptionName
    ? [changedOptionName]
    : Object.keys(selectedOptionsMap).filter((k) =>
        VISUAL_OPTION_NAMES.has(k.toLowerCase()),
      );

  for (const optName of targetOptionNames) {
    const targetVal = selectedOptionsMap[optName];
    if (!targetVal) continue;

    const variantWithFinish = variants.find(
      (v) =>
        v?.image &&
        (v.selectedOptions || []).some(
          (so: any) =>
            so.name.toLowerCase() === optName.toLowerCase() &&
            so.value.toLowerCase() === targetVal.toLowerCase(),
        ),
    );
    if (variantWithFinish?.image) {
      const matchingMedia = mediaImages.find((mImg) =>
        isSameImage(mImg, variantWithFinish.image),
      );
      return matchingMedia || variantWithFinish.image;
    }

    // Also check gallery images mapped via `getImageOptionAssociation`
    for (const mImg of mediaImages) {
      const assoc = getImageOptionAssociation(mImg, product);
      if (
        assoc &&
        assoc[optName] &&
        assoc[optName].toLowerCase() === targetVal.toLowerCase()
      ) {
        return mImg;
      }
    }
  }

  return null;
}

/**
 * Finds the exact variant in `product.variants.nodes` matching every key/value in `selectedOptionsMap`.
 * Returns `null` if that combination does not exist (never silently switches another option like Size).
 */
export function findExactVariant(
  variants: any[],
  selectedOptionsMap: Record<string, string>,
): any | null {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  const entries = Object.entries(selectedOptionsMap).filter(
    ([k, v]) => k !== 'Title' && Boolean(v),
  );

  if (entries.length === 0) {
    return variants[0] || null;
  }

  return (
    variants.find((v) => {
      if (!Array.isArray(v?.selectedOptions)) return false;
      return entries.every(([optName, optVal]) =>
        v.selectedOptions.some(
          (so: any) =>
            so.name.toLowerCase() === optName.toLowerCase() &&
            so.value.toLowerCase() === optVal.toLowerCase(),
        ),
      );
    }) || null
  );
}
