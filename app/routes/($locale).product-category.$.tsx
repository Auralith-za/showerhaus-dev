import { redirect } from 'react-router';

export async function loader({ params }: any) {
  const splat = params['*'];
  
  let handle = splat;
  if (splat && splat.includes('/')) {
    const parts = splat.split('/');
    const validParts = parts.filter(Boolean);
    if (validParts.length > 0) {
      handle = validParts[validParts.length - 1];
    } else {
      handle = '';
    }
  }

  // Remove trailing slashes if any
  if (handle && handle.endsWith('/')) {
    handle = handle.slice(0, -1);
  }

  if (!handle) {
    return redirect('/collections/all', 301);
  }

  return redirect(`/collections/${handle}`, 301);
}
