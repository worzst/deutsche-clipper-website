interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
  CONTACT_BCC?: string;
  TURNSTILE_SECRET?: string;
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, string>;

  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Honeypot — bots fill this, humans don't
  if (data._hp) {
    return Response.json({ ok: true }); // silent reject
  }

  // Turnstile verification (only enforced when TURNSTILE_SECRET is set)
  if (env.TURNSTILE_SECRET) {
    const token = data['cf-turnstile-response'];
    if (!token) {
      return Response.json({ ok: false }, { status: 400 });
    }
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token }),
    });
    const { success } = (await verify.json()) as { success: boolean };
    if (!success) {
      return Response.json({ ok: false }, { status: 400 });
    }
  }

  const { name, email, tel, message, _source } = data;

  if (!name?.trim()) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const source = _source?.trim() || 'Unbekannt';

  // Build email body from known fields, then append any extra fields
  const rows: string[] = [
    `<p><strong>Quelle:</strong> ${escape(source)}</p><hr>`,
    `<p><strong>Name:</strong> ${escape(name)}</p>`,
    email ? `<p><strong>Email:</strong> <a href="mailto:${escape(email)}">${escape(email)}</a></p>` : '',
    tel ? `<p><strong>Telefon:</strong> ${escape(tel)}</p>` : '',
    message ? `<p><strong>Nachricht:</strong><br>${escape(message).replace(/\n/g, '<br>')}</p>` : '',
  ].filter(Boolean);

  // Any extra form fields (e.g. plz, problem, package) are included automatically
  const knownFields = new Set(['name', 'email', 'tel', 'message', '_source', '_hp', 'cf-turnstile-response']);
  for (const [key, val] of Object.entries(data)) {
    if (!knownFields.has(key) && val?.trim()) {
      rows.push(`<p><strong>${escape(key)}:</strong> ${escape(val)}</p>`);
    }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      bcc: env.CONTACT_BCC || undefined,
      reply_to: email || undefined,
      subject: `[${source}] Neue Anfrage von ${name}`,
      html: rows.join('\n'),
    }),
  });

  if (!res.ok) {
    console.error('Resend error:', await res.text());
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
};
