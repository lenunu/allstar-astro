import { buildWaiverEmail } from './_templates';

interface Env {
  PLUNK_API_KEY: string;
}

interface WaiverChild {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface WaiverPayload {
  parentFirstName?: string;
  parentLastName?: string;
  email?: string;
  phone?: string;
  numChildren?: string;
  children?: WaiverChild[];
  eventDate?: string;
  signature?: string;
  waiverVersion?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const data = await request.json() as WaiverPayload;

    if (!data.signature || !data.parentFirstName) {
      return Response.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const submittedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const parentName = `${data.parentFirstName ?? ''} ${data.parentLastName ?? ''}`.trim();
    const childCount = data.children?.length ?? data.numChildren ?? 0;

    await sendEmail(env.PLUNK_API_KEY, {
      to: 'eskimo1975@gmail.com',
      subject: `New Waiver — ${parentName} · ${childCount} child${Number(childCount) !== 1 ? 'ren' : ''}`,
      html: buildWaiverEmail({ ...data, submittedAt }),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('send-waiver error:', err);
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
