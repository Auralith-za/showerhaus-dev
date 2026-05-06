import type { ActionFunctionArgs } from 'react-router';

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  // 1. Gather form data from checkout
  const amount = formData.get('amount') as string;
  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const cartId = formData.get('cartId') as string;

  // WARNING: In a real app, you MUST recalculate the cart totals server-side
  // to avoid price-tampering on the frontend. We skip this here for the skeleton.

  // 2. Payfast credentials from environment variables (fallback to sandbox)
  const env = context.env as any;
  const merchantId = env.PAYFAST_MERCHANT_ID || '10000100'; // Payfast Sandbox ID
  const merchantKey = env.PAYFAST_MERCHANT_KEY || '46f0cd694581a'; // Payfast Sandbox Key
  const isSandbox = !env.PAYFAST_MERCHANT_ID;
  const payfastUrl = isSandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
  
  // Use public domain if available, otherwise fallback to request origin
  const origin = new URL(request.url).origin;
  const appUrl = env.PUBLIC_STORE_DOMAIN || origin;

  // 3. Construct parameters
  const params: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${appUrl}/checkout/success`,
    cancel_url: `${appUrl}/checkout/cancel`,
    notify_url: `${appUrl}/api/payfast-itn`,
    name_first: firstName || 'Customer',
    name_last: lastName || '',
    email_address: email,
    m_payment_id: cartId,
    amount: amount,
    item_name: 'ShowerHaus Order',
  };

  // FOR LOCAL TESTING: If on localhost, PayFast will reject the return_url.
  // We'll provide a way to bypass this for the developer.
  if (origin.includes('localhost')) {
      console.warn('PayFast does not support localhost URLs. Redirecting to success page for demo purposes.');
      return new Response(null, {
          status: 302,
          headers: {
              Location: '/checkout/success',
          },
      });
  }

  // Note: PayFast signature generation would go here using MD5 (or SHA256)
  // Example: 
  // const paramString = Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
  // const signature = crypto.createHash('md5').update(paramString + '&passphrase=' + passphrase).digest('hex');
  // params.signature = signature;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting to PayFast...</title>
      </head>
      <body onload="document.getElementById('payfast-form').submit();">
        <p>Connecting to PayFast, please wait...</p>
        <form id="payfast-form" action="${payfastUrl}" method="post">
          ${Object.entries(params)
            .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}" />`)
            .join('\n')}
        </form>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
