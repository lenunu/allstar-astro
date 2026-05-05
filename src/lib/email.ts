// Email provider abstraction — swap apiKey source or fetch URL to change providers

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  apiKey: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { apiKey, ...rest } = payload;

  if (!apiKey) throw new Error('PLUNK_API_KEY not set');

  const res = await fetch('https://next-api.useplunk.com/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      to: rest.to,
      subject: rest.subject,
      body: rest.html,
      from: 'info@allstarpartyworld.com',
      name: 'All Star Party World',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Plunk error ${res.status}: ${text}`);
  }
}
