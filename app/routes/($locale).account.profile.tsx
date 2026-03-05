import type { CustomerFragment } from 'customer-accountapi.generated';
import type { CustomerUpdateInput } from '@shopify/hydrogen/customer-account-api-types';
import { CUSTOMER_UPDATE_MUTATION } from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type { Route } from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Profile' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount } = context;

  if (request.method !== 'PUT') {
    return data({ error: 'Method not allowed' }, { status: 405 });
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const { data, errors } = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      { error: error.message, customer: null },
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{ customer: CustomerFragment }>();
  const { state } = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="max-w-xl">
      <header className="mb-10">
        <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-2">My Profile</h2>
        <p className="font-sans text-xs text-gray-400 font-light uppercase tracking-wider">Update your personal account details below.</p>
      </header>

      <Form method="PUT" className="space-y-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="firstName" className="font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-gray-400">First name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                aria-label="First name"
                defaultValue={customer.firstName ?? ''}
                minLength={2}
                className="w-full border-b border-gray-200 py-3 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="font-sans text-[9px] tracking-[0.2em] uppercase font-bold text-gray-400">Last name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                aria-label="Last name"
                defaultValue={customer.lastName ?? ''}
                minLength={2}
                className="w-full border-b border-gray-200 py-3 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-sm"
              />
            </div>
          </div>
        </div>

        {action?.error && (
          <p className="p-4 bg-red-50 text-red-800 font-sans text-[10px] tracking-widest uppercase font-bold">
            {action.error}
          </p>
        )}

        <button
          type="submit"
          disabled={state !== 'idle'}
          className="bg-primary text-white px-12 py-4 text-[10px] tracking-[0.2em] font-semibold uppercase hover:bg-black transition-all duration-300 w-full md:w-auto"
        >
          {state !== 'idle' ? 'Updating...' : 'Save Changes'}
        </button>
      </Form>
    </div>
  );
}
