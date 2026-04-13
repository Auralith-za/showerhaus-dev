import type { ActionFunctionArgs } from 'react-router';

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  // 1. Parse ITN payload from PayFast
  const formData = await request.formData();
  const payload: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    payload[key] = value as string;
  }

  const paymentStatus = payload.payment_status; // "COMPLETE"
  const mPaymentId = payload.m_payment_id; // cartId
  const amountGross = payload.amount_gross; // amount paid

  // 2. Validate the ITN Payload with PayFast via API
  // You must post the exact payload back to https://sandbox.payfast.co.za/eng/query/validate
  // For sandbox, use sandbox endpoint. For live, use www.
  // We'll mock the internal validation for this skeleton.
  const isValid = true; 

  if (isValid && paymentStatus === 'COMPLETE') {
    console.log(`[PayFast ITN] Payment successful for Cart ID: ${mPaymentId}, Amount: ${amountGross}`);
    
    // 3. Create the Draft Order and Mark as Paid via Shopify Admin API (NOT Storefront API).
    // Note: Storefront API cannot arbitrarily create paid orders without Native Checkout.
    // Example: Use `context.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN` and make a POST to the GraphQL Admin API
    // `mutation draftOrderCreate($input: DraftOrderInput!)` ->
    // `mutation draftOrderComplete($id: ID!, $paymentPending: Boolean!)`

    return new Response('', { status: 200 }); // Must respond 200 OK so PayMaster stops retrying
  }

  console.error('[PayFast ITN] Payment validation failed or not complete.', payload);
  return new Response('Invalid ITN', { status: 400 });
}
