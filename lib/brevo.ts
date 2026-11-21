// lib/brevo.ts
import type { OrderRecord } from '@/lib/db';
const BREVO_API_URL = 'https://api.brevo.com/v3';

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

export async function sendWelcomeEmail(
  toEmail: string,
  toName: string,
  tasteMood: string
) {
  const welcomeTemplateId = Number(process.env.BREVO_WELCOME_TEMPLATE_ID);
  const apiKey = process.env.BREVO_API_KEY;

  // Sync user attributes to Brevo Contacts for segmented GIF/dynamic campaigns
  if (apiKey) {
    await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email: toEmail,
        attributes: {
          FIRSTNAME: toName,
          TASTE_MOOD: tasteMood,
        },
        updateEnabled: true,
      }),
    }).catch(() => {});
  }

  if (!welcomeTemplateId) return null;

  return sendBrevoTemplate({
    toEmail,
    toName,
    templateId: welcomeTemplateId,
    params: {
      NAME: toName,
      TASTE_MOOD: tasteMood,
      COUPON_CODE: 'MELTI150',
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
      ITEMS: order.items.map((item) => ({
        name: item.shortName,
        packSize: item.packSize,
        cocoa: item.cocoaPercent,
        quantity: item.quantity,
        price: item.unitPrice,
        lineTotal: item.unitPrice * item.quantity,
      })),
      ITEMS_SUMMARY: itemsSummary,
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