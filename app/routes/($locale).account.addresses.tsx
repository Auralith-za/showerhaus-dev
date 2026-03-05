import type { CustomerAddressInput } from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import type { Route } from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Addresses' }];
};

export async function loader({ context }: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({ request, context }: Route.ActionArgs) {
  const { customerAccount } = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        { error: { [addressId]: 'Unauthorized' } },
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const { data, errors } = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const { data, errors } = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const { data, errors } = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return { error: null, deletedAddress: addressId };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              { error: { [addressId]: error.message } },
              {
                status: 400,
              },
            );
          }
          return data(
            { error: { [addressId]: error } },
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          { error: { [addressId]: 'Method not allowed' } },
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        { error: error.message },
        {
          status: 400,
        },
      );
    }
    return data(
      { error },
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const { customer } = useOutletContext<{ customer: CustomerFragment }>();
  const { defaultAddress, addresses } = customer;

  return (
    <div className="max-w-4xl">
      <header className="mb-10">
        <h2 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary mb-2">My Addresses</h2>
        <p className="font-sans text-xs text-gray-400 font-light uppercase tracking-wider">Manage your delivery and billing locations for future quotes.</p>
      </header>

      {!addresses.nodes.length ? (
        <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200">
          <p className="font-sans text-xs tracking-widest uppercase text-gray-400 mb-8 font-semibold">You have no addresses saved.</p>
          <NewAddressForm />
        </div>
      ) : (
        <div className="space-y-20">
          <div>
            <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-primary mb-8 border-b border-gray-100 pb-4">Add New Location</h3>
            <NewAddressForm />
          </div>

          <div>
            <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-primary mb-8 border-b border-gray-100 pb-4">Saved Locations</h3>
            <ExistingAddresses
              addresses={addresses}
              defaultAddress={defaultAddress}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({ stateForMethod }) => (
        <div className="pt-8">
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
            className="bg-primary text-white px-10 py-4 text-[10px] tracking-[0.2em] font-semibold uppercase hover:bg-black transition-all duration-300 min-w-[180px]"
          >
            {stateForMethod('POST') !== 'idle' ? 'Creating...' : 'Create Location'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {addresses.nodes.map((address) => (
        <div key={address.id} className="border border-gray-100 p-8 shadow-sm">
          <AddressForm
            addressId={address.id}
            address={address}
            defaultAddress={defaultAddress}
          >
            {({ stateForMethod }) => (
              <div className="flex items-center gap-6 pt-8 border-t border-gray-50">
                <button
                  disabled={stateForMethod('PUT') !== 'idle'}
                  formMethod="PUT"
                  type="submit"
                  className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-primary hover:text-secondary disabled:opacity-50 transition-colors"
                >
                  {stateForMethod('PUT') !== 'idle' ? 'Saving' : 'Save'}
                </button>
                <button
                  disabled={stateForMethod('DELETE') !== 'idle'}
                  formMethod="DELETE"
                  type="submit"
                  className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400 hover:text-red-800 disabled:opacity-50 transition-colors"
                >
                  {stateForMethod('DELETE') !== 'idle' ? 'Deleting' : 'Delete'}
                </button>
              </div>
            )}
          </AddressForm>
        </div>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const { state, formMethod } = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  return (
    <Form id={addressId} className="space-y-6">
      <fieldset className="space-y-6">
        <input type="hidden" name="addressId" defaultValue={addressId} />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="firstName" className="font-sans text-[8px] tracking-[0.1em] uppercase font-bold text-gray-400">First name*</label>
            <input
              aria-label="First name"
              autoComplete="given-name"
              defaultValue={address?.firstName ?? ''}
              id="firstName"
              name="firstName"
              placeholder="First name"
              required
              type="text"
              className="w-full border-b border-gray-100 py-2 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="lastName" className="font-sans text-[8px] tracking-[0.1em] uppercase font-bold text-gray-400">Last name*</label>
            <input
              aria-label="Last name"
              autoComplete="family-name"
              defaultValue={address?.lastName ?? ''}
              id="lastName"
              name="lastName"
              placeholder="Last name"
              required
              type="text"
              className="w-full border-b border-gray-100 py-2 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="company" className="font-sans text-[8px] tracking-[0.1em] uppercase font-bold text-gray-400">Company</label>
          <input
            aria-label="Company"
            autoComplete="organization"
            defaultValue={address?.company ?? ''}
            id="company"
            name="company"
            placeholder="Company"
            type="text"
            className="w-full border-b border-gray-100 py-2 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="address1" className="font-sans text-[8px] tracking-[0.1em] uppercase font-bold text-gray-400">Address line*</label>
          <input
            aria-label="Address line 1"
            autoComplete="address-line1"
            defaultValue={address?.address1 ?? ''}
            id="address1"
            name="address1"
            placeholder="Address line 1*"
            required
            type="text"
            className="w-full border-b border-gray-100 py-2 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="city" className="font-sans text-[8px] tracking-[0.1em] uppercase font-bold text-gray-400">City*</label>
            <input
              aria-label="City"
              autoComplete="address-level2"
              defaultValue={address?.city ?? ''}
              id="city"
              name="city"
              placeholder="City"
              required
              type="text"
              className="w-full border-b border-gray-100 py-2 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="zip" className="font-sans text-[8px] tracking-[0.1em] uppercase font-bold text-gray-400">Zip / Postal Code*</label>
            <input
              aria-label="Zip"
              autoComplete="postal-code"
              defaultValue={address?.zip ?? ''}
              id="zip"
              name="zip"
              placeholder="Zip / Postal Code"
              required
              type="text"
              className="w-full border-b border-gray-100 py-2 bg-transparent text-primary placeholder-gray-300 focus:outline-none focus:border-primary transition-colors font-sans text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
            className="w-3 h-3 border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="defaultAddress" className="font-sans text-[9px] tracking-widest uppercase text-gray-400 font-bold cursor-pointer">Set as default address</label>
        </div>

        {error && (
          <p className="p-3 bg-red-50 text-red-800 font-sans text-[9px] tracking-widest uppercase font-bold">
            {error}
          </p>
        )}

        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}
