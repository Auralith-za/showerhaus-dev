import { redirect } from 'react-router';

export async function loader({ params }: any) {
  const splat = params['*'] || '';
  
  // Split the path and filter out empty values
  const parts = splat.split('/').filter(Boolean);
  
  // Clean parts by removing pagination terms: "page" and any numeric string (e.g. "2")
  const cleanParts = parts.filter(part => {
    const isPageKeyword = part.toLowerCase() === 'page';
    const isNumeric = /^\d+$/.test(part);
    return !isPageKeyword && !isNumeric;
  });

  // Extract the target handle (the first non-pagination part)
  let handle = cleanParts[0] || '';

  // Remove trailing slashes or formatting remnants
  if (handle && handle.endsWith('/')) {
    handle = handle.slice(0, -1);
  }

  handle = handle.toLowerCase().trim();

  if (!handle) {
    return redirect('/collections/all', 301);
  }

  // Redirect maps from old categories to new locations
  if (handle === 'frameless-shower-enclosures' || handle === 'frameless-showers') {
    return redirect('/pages/frameless-showers', 301);
  }
  
  if (
    handle === 'frameless-custom-made' || 
    handle === 'custom-made-showers' || 
    handle === 'frameless-custom-made-showers'
  ) {
    return redirect('/pages/custom-made-showers', 301);
  }

  if (handle === 'shower-spares' || handle === 'spares') {
    return redirect('/collections/shower-spares', 301);
  }

  // If it's a specific spares subcategory or other known collections
  const knownCollections = [
    'handles-towel-rails',
    'hinges-and-clamps',
    'shower-seals-and-cill-plate',
    'brackets-wheels',
    'profiles-channels',
    'accessories-other',
    'consumables',
    'shower-care'
  ];

  if (knownCollections.includes(handle)) {
    return redirect(`/collections/${handle}`, 301);
  }

  // Fallback to the parsed collection handle
  return redirect(`/collections/${handle}`, 301);
}
