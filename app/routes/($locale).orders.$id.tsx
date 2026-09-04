import { redirect } from 'react-router';
import type { Route } from './+types/orders.$id';

export async function loader({ params }: Route.LoaderArgs) {
  const id = params.id ? encodeURIComponent(params.id) : '';
  if (id) {
    return redirect(`/account/orders/${id}`);
  }
  return redirect('/account/orders');
}

export default function OrdersRedirectRoute() {
  return null;
}
