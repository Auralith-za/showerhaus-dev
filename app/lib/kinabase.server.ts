/**
 * Kinabase CRM API Integration
 * Handles authentication, customer lookup/creation, and enquiry recording.
 */

const DEFAULT_KINABASE_APP_ID = '12eae051-4c49-4283-b0b1-b6a1d8ffbb7b';
const DEFAULT_KINABASE_APP_SECRET =
  'BHi5MNx/R28OkQQ6Hgx+6HfOab07Uv4wkin4JVJSPVVreXqeJ/53hyL8YUljs3iq/LwbBPCpOeT0J19ww5BTxw==';
const KINABASE_BASE_URL = 'https://app.kinabase.com/api/v1';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export interface KinabaseCustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface KinabaseLeadPayload {
  customer: KinabaseCustomerDetails;
  citySuburb?: string;
  descriptionHtml: string;
  channel?: string; // defaults to 'Website'
}

/**
 * Retrieves a valid Bearer token for the Kinabase API.
 * Uses in-memory token caching to avoid repeated authentication calls.
 */
export async function getKinabaseToken(env?: any): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 300000) {
    return cachedToken;
  }

  const appId = env?.KINABASE_APP_ID || DEFAULT_KINABASE_APP_ID;
  const secret = env?.KINABASE_APP_SECRET || DEFAULT_KINABASE_APP_SECRET;

  const res = await fetch(`${KINABASE_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ appId, secret }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Kinabase authentication failed (${res.status}): ${errorText}`);
  }

  const data = (await res.json()) as { token: string };
  cachedToken = data.token;
  // Kinabase JWT tokens are typically valid for 60 minutes; cache for 50 minutes.
  tokenExpiresAt = now + 50 * 60 * 1000;
  return cachedToken;
}

/**
 * Finds an existing customer in Kinabase by email, or creates a new Customer record.
 */
export async function findOrCreateCustomer(
  token: string,
  details: KinabaseCustomerDetails
): Promise<{ id: string; label: string; secondaryLabel?: string }> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const fullName = `${details.firstName.trim()} ${details.lastName.trim()}`.trim();
  const emailLower = details.email.trim().toLowerCase();

  try {
    // 1. Search existing customers
    const res = await fetch(`${KINABASE_BASE_URL}/collections/customers/all`, { headers });
    if (res.ok) {
      const result = await res.json();
      const records = result.records || (Array.isArray(result) ? result : []);
      const existing = records.find(
        (r: any) => r.data?.email && r.data.email.trim().toLowerCase() === emailLower
      );

      if (existing) {
        return {
          id: existing.id,
          label: fullName || existing.data?.name?.firstName || 'Customer',
          secondaryLabel: details.email.trim(),
        };
      }
    }
  } catch (lookupError) {
    console.warn('[Kinabase] Customer lookup failed, proceeding to creation attempt:', lookupError);
  }

  // 2. Create customer if not found
  const createRes = await fetch(`${KINABASE_BASE_URL}/collections/customers`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        name: {
          firstName: details.firstName.trim(),
          lastName: details.lastName.trim(),
        },
        email: details.email.trim(),
        contactNumber: details.phone ? details.phone.trim() : undefined,
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create Kinabase customer (${createRes.status}): ${errText}`);
  }

  const newCustomer = await createRes.json();
  return {
    id: newCustomer.id,
    label: fullName,
    secondaryLabel: details.email.trim(),
  };
}

/**
 * Creates an Enquiry record in Kinabase linked to the customer.
 */
export async function createKinabaseEnquiry(
  token: string,
  options: {
    customer: { id: string; label: string; secondaryLabel?: string };
    descriptionHtml: string;
    citySuburb?: string;
    channel?: string;
  }
): Promise<{ id: string }> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const body = {
    data: {
      customer: {
        id: options.customer.id,
        label: options.customer.label,
        secondaryLabel: options.customer.secondaryLabel,
      },
      description: options.descriptionHtml,
      city: options.citySuburb?.trim() || '',
      channel: options.channel || 'Website',
      time: new Date().toISOString(),
    },
  };

  const res = await fetch(`${KINABASE_BASE_URL}/collections/enquiries`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create Kinabase enquiry (${res.status}): ${errorText}`);
  }

  const enquiry = await res.json();
  return { id: enquiry.id };
}

/**
 * High-level function to synchronize a lead into Kinabase as a Customer and Enquiry.
 * Catches and logs errors gracefully so user submissions and email dispatch are never disrupted.
 */
export async function syncLeadToKinabase(
  env: any,
  payload: KinabaseLeadPayload
): Promise<{ success: boolean; enquiryId?: string; error?: string }> {
  try {
    const token = await getKinabaseToken(env);
    const customer = await findOrCreateCustomer(token, payload.customer);
    const enquiry = await createKinabaseEnquiry(token, {
      customer,
      descriptionHtml: payload.descriptionHtml,
      citySuburb: payload.citySuburb,
      channel: payload.channel || 'Website',
    });

    console.info(`[Kinabase] Successfully recorded enquiry #${enquiry.id} for ${payload.customer.email}`);
    return { success: true, enquiryId: enquiry.id };
  } catch (err: any) {
    console.error('[Kinabase] Failed to sync lead:', err);
    return { success: false, error: err.message || String(err) };
  }
}
