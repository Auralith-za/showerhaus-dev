import { Link, useLoaderData } from 'react-router';
import type { Route } from './+types/policies.$handle';
import { type Shop } from '@shopify/hydrogen/storefront-api-types';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.policy.title ?? ''}` }];
};

export async function loader({ params, context }: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', { status: 404 });
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', { status: 404 });
  }

  return { policy };
}

export default function Policy() {
  const { policy } = useLoaderData<typeof loader>();

  return (
    <div className="policy-page bg-white min-h-[60vh] py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-gray-400 hover:text-primary transition-colors font-sans text-sm tracking-widest uppercase border-b border-transparent hover:border-gray-200 pb-1"
          >
            ← Return Home
          </Link>
        </div>

        <h1 className="font-display text-4xl md:text-5xl text-primary mb-12 text-center">
          {policy.title}
        </h1>

        <div
          className="prose prose-lg mx-auto font-sans font-light text-gray-600 prose-headings:font-display prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-medium prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
