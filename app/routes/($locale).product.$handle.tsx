import { redirect } from 'react-router';

export async function loader({ params }: any) {
  const { handle } = params;
  
  if (!handle) {
    return redirect('/collections/all', 301);
  }

  return redirect(`/products/${handle}`, 301);
}
