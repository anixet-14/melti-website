// lib/brevo.ts
const BREVO_API_URL = 'https://api.brevo.com/v3';

interface SendTemplateParams {
  toEmail: string;
  toName?: string;
  templateId: number;
  params: Record<string, string | number>;
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