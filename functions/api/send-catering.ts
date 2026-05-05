import { buildCateringEmail } from './_templates';

interface Env {
  PLUNK_API_KEY: string;
}

interface CateringItem {
  name: string;
  variation: string;
  price: number;
}

interface CateringOrder {
  items: CateringItem[];
  total: number;
  name?: string;
  email?: string;
  phone?: string;
  eventDate?: string;
  notes?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = await request.json() as CateringOrder;

    if (!data.items?.length) {
      return Response.json({ ok: false, error: 'No items' }, { status: 400 });
    }

    await sendEmail(env.PLUNK_API_KEY, {
      to: 'eskimo1975@gmail.com',
      subject: `New Catering Inquiry — ${data.items.length} item${data.items.length !== 1 ? 's' : ''} · $${data.total.toFixed(2)}`,
      html: buildCateringEmail(data),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('send-catering error:', err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
};

async function sendEmail(apiKey: string, payload: { to: string; subject: string; html: string }) {
  const res = await fetch('https://next-api.useplunk.com/v1/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      to: payload.to,
      subject: payload.subject,
      body: payload.html,
      from: 'info@allstarpartyworld.com',
      name: 'All Star Party World',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Plunk error ${res.status}: ${text}`);
  }
}
