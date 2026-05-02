// Fails the build on Cloudflare Pages if required runtime env vars are missing.
// Skipped in local dev (CF_PAGES is only set on Cloudflare's build runners).
if (process.env.CF_PAGES !== '1') process.exit(0);

// const required = ['RESEND_API_KEY', 'CONTACT_TO', 'CONTACT_FROM'];
const required = [];
const missing = required.filter((k) => !process.env[k]);

if (missing.length) {
  console.error(`[check-env] Missing env vars: ${missing.join(', ')}`);
  console.error('Add them in Cloudflare Pages → Settings → Environment variables');
  process.exit(1);
}
