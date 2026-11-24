// lib/brevo.ts
import type { OrderRecord } from '@/lib/db';

const BREVO_API_URL = 'https://api.brevo.com/v3';

export const MELTI_SURVEY_URL = 'https://survey-ecru-pi.vercel.app/';

export function buildPersonalizedSurveyUrl(email?: string): string {
  if (!email || !email.trim()) return MELTI_SURVEY_URL;
  return `${MELTI_SURVEY_URL}?email=${encodeURIComponent(email.trim().toLowerCase())}`;
}

interface SendTemplateParams {
  toEmail: string;
  toName?: string;
  templateId: number;
  params: Record<string, unknown>;
}

async function sendBrevoTemplate({
  toEmail,
  toName,
  templateId,
  params,
}: SendTemplateParams) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is missing in .env');
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'MÈLTI';

  const payload: Record<string, unknown> = {
    to: [{ email: toEmail, name: toName || toEmail.split('@')[0] }],
    templateId,
    params,
  };

  if (senderEmail) {
    payload.sender = { email: senderEmail, name: senderName };
  }

  const res = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Brevo email failed (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function sendOtpEmail(toEmail: string, otp: string, toName?: string) {
  const templateId = Number(process.env.BREVO_OTP_TEMPLATE_ID);
  if (!templateId) {
    throw new Error('BREVO_OTP_TEMPLATE_ID is missing or invalid in .env');
  }

  return sendBrevoTemplate({
    toEmail,
    toName,
    templateId,
    params: {
      OTP: otp,
      NAME: toName || 'Cocoa Lover',
    },
  });
}

export async function sendOrderConfirmationEmail(order: OrderRecord) {
  const orderTemplateId = Number(process.env.BREVO_ORDER_TEMPLATE_ID);
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ).replace(/\/$/, '');

  if (!orderTemplateId) {
    console.error(
      '[Brevo] Aborted: BREVO_ORDER_TEMPLATE_ID is missing or not a number.'
    );
    return null;
  }

  const customerName = order.shippingAddress.fullName.trim() || 'there';
  const receiptUrl = `${appUrl}/orders/${encodeURIComponent(order.orderId)}`;

  const itemsSummary = order.items
    .map(
      (item) =>
        `${item.shortName} (${item.cocoaPercent} Cocoa) × ${item.quantity} — ₹${
          item.unitPrice * item.quantity
        }`
    )
    .join(', ');

  const fullAddress = `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`;

  const paymentLabel =
    order.paymentMethod === 'demo_cod'
      ? 'Cash on Delivery'
      : order.paymentMethod === 'demo_card'
      ? 'Card Payment'
      : 'UPI Instant Payment';

  const result = await sendBrevoTemplate({
    toEmail: order.customerEmail,
    toName: customerName,
    templateId: orderTemplateId,
    params: {
      NAME: customerName,
      FIRSTNAME: customerName.split(' ')[0],
      ORDER_ID: order.orderId,
      ITEMS: itemsSummary,
      ITEMS_SUMMARY: itemsSummary,
      ITEMS_LIST: order.items.map((item) => ({
        name: item.shortName,
        packSize: item.packSize,
        cocoa: item.cocoaPercent,
        quantity: item.quantity,
        price: item.unitPrice,
        lineTotal: item.unitPrice * item.quantity,
      })),
      SUBTOTAL: `₹${order.subtotal}`,
      DISCOUNT: order.discount > 0 ? `-₹${order.discount}` : '₹0',
      COUPON_CODE: order.couponCode || '',
      SHIPPING: order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`,
      TOTAL: `₹${order.totalAmount}`,
      TOTAL_AMOUNT: `₹${order.totalAmount}`,
      PAYMENT_METHOD: paymentLabel,
      ADDRESS: fullAddress,
      SHIPPING_ADDRESS: fullAddress,
      PHONE: order.shippingAddress.phone,
      RECEIPT_URL: receiptUrl,
    },
  });

  console.log('[Brevo] Order confirmation template triggered:', order.orderId, result);
  return result;
}

export interface BrevoSignupInput {
  email: string;
  firstName?: string;
  name?: string;
}

export interface BrevoSignupResult {
  ok: boolean;
  status: number;
  contactId?: number;
  updated?: boolean;
  error?: string;
}

export async function subscribeContactToBrevo({
  email,
  firstName,
  name,
}: BrevoSignupInput): Promise<BrevoSignupResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const parsedListId = Number(process.env.BREVO_SIGNUP_LIST_ID);
  const listId =
    Number.isFinite(parsedListId) && parsedListId > 0 ? parsedListId : 3;

  if (!apiKey) {
    console.error('[Brevo] Missing BREVO_API_KEY in environment.');
    return {
      ok: false,
      status: 500,
      error: 'Email service is not configured right now.',
    };
  }

  const cleanEmail = email.trim().toLowerCase();
  const resolvedFirstName = (firstName || name || '').trim();

  const res = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email: cleanEmail,
      attributes: {
        FIRSTNAME: resolvedFirstName,
      },
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  // Brevo returns 204 No Content (empty body) when updating an existing contact
  if (res.status === 204) {
    return {
      ok: true,
      status: 204,
      updated: true,
    };
  }

  const rawBody = await res.text();
  let parsed: { id?: number; message?: string } = {};
  if (rawBody) {
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      parsed = { message: rawBody };
    }
  }

  if (!res.ok) {
    console.error('[Brevo] Contact signup failed:', res.status, parsed);
    return {
      ok: false,
      status: res.status,
      error:
        parsed.message || 'Unable to complete signup. Please try again shortly.',
    };
  }

  return {
    ok: true,
    status: res.status,
    contactId: parsed.id,
    updated: false,
  };
}