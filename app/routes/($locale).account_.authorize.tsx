import {redirect} from 'react-router';
import type {Route} from './+types/account_.authorize';

export async function loader({context}: Route.LoaderArgs) {
  const response = await context.customerAccount.authorize();
  const returnTo = context.session.get('return_to');
  if (returnTo) {
    context.session.unset('return_to');
    return redirect(returnTo, {
      headers: response.headers,
    });
  }
  return response;
}
