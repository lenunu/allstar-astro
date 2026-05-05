import { buildBookingEmail } from './_templates';

interface Env {
  PLUNK_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = await request.json() as Record<string, string>;

    const venueLabels: Record<string, string> = {
      'all-star-party-world': 'All Star Party World',
      '305-club': 'The 305 Club',
      'both': 'Both Venues',
    };

    const venueName = venueLabels[data.venue ?? ''] ?? data.venue ?? '—';

    await sendEmail(env.PLUNK_API_KEY, {
      to: 'eskimo1975@gmail.com',
      subject: `New Booking Request — ${data.firstName ?? ''} ${data.lastName ?? ''} (${venueName})`,
      html: buildBookingEmail(data, venueName),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('send-booking error:', err);
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
