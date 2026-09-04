import type {Route} from './+types/account_.login';

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('return_to') || url.searchParams.get('redirect');
  if (returnTo) {
    context.session.set('return_to', returnTo);
  }

  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}
