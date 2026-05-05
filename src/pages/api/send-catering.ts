export const prerender = false;

import type { APIRoute } from 'astro';
import { sendEmail } from '../../lib/email';
import { cateringEmailHtml, type CateringOrderData } from '../../lib/emailTemplates';

const NOTIFY_EMAIL = 'eskimo1975@gmail.com';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data: CateringOrderData = await request.json();

    if (!data.items?.length) {
      return new Response(JSON.stringify({ ok: false, error: 'No items' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Cloudflare runtime env → locals.runtime.env, fallback to import.meta.env for local dev
    const runtime = (locals as any).runtime;
    const apiKey = runtime?.env?.PLUNK_API_KEY ?? import.meta.env.PLUNK_API_KEY;

    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `New Catering Inquiry — ${data.items.length} item${data.items.length !== 1 ? 's' : ''} · $${data.total.toFixed(2)}`,
      html: cateringEmailHtml(data),
      apiKey,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-catering error:', err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
