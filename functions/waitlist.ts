interface Env {
  deutsche_clipper_waitlist: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, string>;

  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Honeypot — bots fill this, humans don't
  if (data._hp) {
    return Response.json({ ok: true });
  }

  const email = data.email?.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const source = data._source?.trim() || 'Unbekannt';
  const name = data.name?.trim() || null;
  const platform = data.platform?.trim() || null;

  try {
    await env.deutsche_clipper_waitlist.prepare(
      'INSERT OR IGNORE INTO waitlist (email, source, name, platform) VALUES (?, ?, ?, ?)',
    )
      .bind(email, source, name, platform)
      .run();
  } catch (err) {
    console.error('D1 error:', err);
    return Response.json({ ok: false }, { status: 500 });
  }

  return Response.json({ ok: true });
};
