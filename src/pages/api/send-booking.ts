export const prerender = false;

import type { APIRoute } from 'astro';
import { sendEmail } from '../../lib/email';
import { bookingEmailHtml, type BookingData } from '../../lib/emailTemplates';

const NOTIFY_EMAIL = 'eskimo1975@gmail.com';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data: BookingData = await request.json();

    // Cloudflare runtime env → locals.runtime.env, fallback to import.meta.env for local dev
    const runtime = (locals as any).runtime;
    const apiKey = runtime?.env?.PLUNK_API_KEY ?? import.meta.env.PLUNK_API_KEY;

    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New Booking Request — ${data.firstName ?? ''} ${data.lastName ?? ''} (${data.venue ?? 'Unknown venue'})`,
      html: bookingEmailHtml(data),
      apiKey,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-booking error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
