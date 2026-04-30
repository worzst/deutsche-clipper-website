# Website Template — Build Guide

> This is the canonical knowledge base for building Astro websites with this template.
> Read this before touching any file. Update it at the end of any session with significant changes.

---

## Stack

|           |                                                                                   |
| --------- | --------------------------------------------------------------------------------- |
| Framework | Astro 6 (static output, Cloudflare Pages)                                         |
| CSS       | Tailwind v4 (`@tailwindcss/vite`) + scoped `<style>` for complex component CSS    |
| Icons     | Tabler via `astro-icon` + `@iconify-json/tabler` — `<Icon name="tabler:phone" />` |
| Email     | Resend via Cloudflare Pages Function (`functions/contact.ts`)                     |
| Analytics | Google Tag Manager + GA4 + Consent Mode v2                                        |
| Hosting   | Cloudflare Pages                                                                  |

```
npm run dev       # dev server → localhost:4321
npm run build     # env check → astro build → dist/
npm run preview   # preview build locally
```

---

## New Project Checklist

When starting a new site from this template, do these before writing any content:

1. **`src/config.ts`** — fill in `SITE_KEY`, `SITE_NAME`, `PHONE`, `PHONE_HREF`, `EMAIL`, `ADDRESS_STREET`, `ADDRESS_CITY`
2. **`src/styles/global.css`** — swap `--color-accent` and `--color-accent-2` for project palette (inside `@theme {}`)
3. **`astro.config.mjs`** — replace `YOURDOMAIN.ch` with actual domain
4. **`public/robots.txt`** — replace `YOURDOMAIN.ch` with actual domain
5. **`public/favicon.svg`** — replace placeholder with real brand favicon
6. **`.env` / `.dev.vars`** — set `PUBLIC_GTM_ID`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`
7. **`src/layouts/Layout.astro`** — update default `title` and `description` props
8. **`src/pages/index.astro`** — replace all placeholder content

---

## File Structure

```
src/
  config.ts               # shared constants — SITE_KEY, PHONE, EMAIL, SITE_NAME, ADDRESS_*
  env.d.ts                # TypeScript globals — Window.dataLayer, gtag, turnstile
  layouts/
    Layout.astro          # HTML shell: meta tags, GTM + Consent Mode v2, CookieBanner, reveal observer
    LegalLayout.astro     # legal pages: back link, prose styles, noindex
  pages/
    index.astro           # main page — assembles all sections, passes schema prop to Layout
    404.astro             # custom 404 with Nav + Footer, noindex
    danke.astro           # thank-you page for server-side redirect pattern, noindex
    impressum.astro       # imprint (noindex via LegalLayout)
    datenschutz.astro     # privacy policy (noindex via LegalLayout)
  components/
    Nav.astro             # sticky header, hamburger mobile menu — activePage prop for multi-page sites
    Hero.astro            # full-width hero with CTA buttons, uses .hero-gradient class
    SectionHeading.astro  # reusable h2 heading with optional label + italic em line
    Faq.astro             # accordion, single-open, prop-driven
    LeadForm.astro        # generic contact form, light/dark themes, Turnstile built-in
    Turnstile.astro       # Cloudflare Turnstile widget — renders nothing if PUBLIC_TURNSTILE_SITE_KEY unset
    ObfuscatedEmail.astro # spam-safe email link (no plain address in HTML)
    CookieBanner.astro    # GDPR consent bar, GTM Consent Mode v2 integration
    GTM.astro             # GTM loader via set:html (avoids prettier-plugin-astro conflicts)
    Footer.astro          # brand, contact, legal links
  scripts/
    formSubmit.ts         # wireForm() — handles async form submit + dataLayer event
  styles/
    global.css            # Tailwind import, @theme tokens, @layer base resets, @layer components layout
scripts/
  check-env.js            # pre-build guard — fails CF Pages deploy if env vars missing
functions/
  contact.ts              # Cloudflare Pages Function: honeypot → optional Turnstile → Resend API
public/
  favicon.svg             # brand icon (replace placeholder before launch)
  og-default.png          # OG social preview (1200×630px) — replace before launch
  robots.txt              # Allow all + sitemap URL
```

---

## Design Tokens

Tokens live in the `@theme {}` block in `src/styles/global.css`. This is Tailwind v4's CSS-first config — it replaces `tailwind.config.js`. Swap them per project; never hardcode colors in components.

```css
@theme {
  --color-bg: #f8f8f6;       /* page background */
  --color-paper: #ffffff;    /* card / nav / banner backgrounds */
  --color-ink: #111111;      /* primary text, dark backgrounds */
  --color-mute: #666666;     /* secondary text */
  --color-accent: #1a1a8c;   /* primary CTA, links, highlights */
  --color-accent-2: #e85c00; /* secondary highlight */
  --color-success: #6ee7b7;  /* form success icon */
  --color-error: #ff4d4d;    /* form error text */
  --font-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'Courier New', Courier, monospace;
}

/* Complex values that can't live in @theme */
:root {
  --line: rgba(0, 0, 0, 0.1);
  --max-width: 1280px;
  --section-pad: clamp(64px, 9vw, 112px);
  --gutter: clamp(16px, 5vw, 48px);
}
```

Tailwind automatically generates utility classes from `@theme` tokens: `bg-accent`, `text-ink`, `text-mute`, `bg-paper`, `bg-error`, `text-accent-2`, etc.

**Palette examples from existing projects:**

- haustechnikbasel: `--color-accent: #1e3a8a` (deep blue), warm grays
- ictira.com: `--color-bg: #eceae4`, `--color-ink: #0e0f12`, `--color-accent: #3a2bff`
- rohrservicebasel: `--color-accent: #1d3461` (navy), `--color-accent-2: #e8a020` (amber)

---

## CSS Architecture

The template uses **Tailwind v4** for the majority of styling with a clear rule for when scoped CSS is appropriate.

### Cascade layer order

Tailwind v4 uses CSS cascade layers internally:

```
@layer base < @layer components < @layer utilities
```

- `@layer base` — element resets (`body`, `html`, `a`, `ul`). These are sane defaults and never need to be overridden.
- `@layer components` — shared layout primitives (`.inner`, `.section`, `.grid-2`, `.grid-3`, `.section-alt`, `.hero-gradient`, `.reveal`). Because they live in `@layer components`, Tailwind utilities in `@layer utilities` can always override them. This is why `class="inner pb-12"` works — `.inner` provides horizontal padding, `pb-12` overrides the bottom.
- `@layer utilities` — all Tailwind utility classes.

**Critical rule:** never write CSS outside a `@layer` block in `global.css`. Unlayered CSS has higher cascade priority than any `@layer`, including `@layer utilities`, and will silently defeat Tailwind utility overrides.

### When to use scoped `<style>` vs Tailwind

Use **Tailwind utilities** for: spacing, typography, colors, flex/grid layout, responsive prefixes, hover/focus states — anything that maps to a single CSS property.

Use **scoped `<style>`** for:
- Complex animations with intermediate states (`max-height` transitions for FAQ accordion)
- CSS custom property theming across light/dark variants (`::placeholder`, `--lf-field-border`)
- Container max-width + gutter layout inside components (`.footer-inner`, `.nav-inner`) where mixing with global `.inner` would cause cascade conflicts

### Hero gradient

The hero gradient is defined as `.hero-gradient` in `@layer components` in `global.css`:

```css
.hero-gradient {
  background: linear-gradient(135deg, var(--color-accent) 0%, color-mix(in srgb, var(--color-accent) 60%, #000) 100%);
}
```

To customize: edit `global.css` directly. The Tailwind arbitrary value equivalent (`bg-[linear-gradient(...)]`) is fragile with `color-mix()` — keep it as a named class.

---

## Fonts

System font stack by default. To add Google Fonts:

**Option A — Astro fontProviders (recommended for CF Pages):**

```js
// astro.config.mjs
import { defineConfig, fontProviders } from 'astro/config';
export default defineConfig({
  experimental: {
    fonts: [{ provider: fontProviders.google(), name: 'Inter Tight', cssVariable: '--font-inter-tight' }],
  },
});
```

Then in Layout.astro: `import { Font } from 'astro:assets'` and `<Font cssVariable="--font-inter-tight" />`.

**Option B — @fontsource (bundle at build time, no external request):**

```
npm install @fontsource-variable/inter
```

Then in global.css: `@import '@fontsource-variable/inter';`

---

## Layout Architecture

- **`global.css` lives in `Layout.astro`** — never import it in individual pages or components. Any page not using Layout will lose all global styles.
- **`LegalLayout.astro` wraps `Layout.astro`** — includes `Nav` + `Footer` + a `← Zurück` back-link above the heading. Never give it its own `<html>` shell. For new legal-style pages, always use `LegalLayout`.
- **`noindex` pages**: pass `noindex={true}` to `Layout.astro` (or use `LegalLayout` which sets it automatically).
- **Sitemap exclusions**: configure in `astro.config.mjs` `sitemap()` filter — already excludes `/lp/`, `/danke`, `/impressum`, `/datenschutz`.

---

## Scroll Reveal

Add `class="reveal"` to any element to animate it in on scroll (fade + slide up). Add `data-delay="100"` for stagger.

```astro
<div class="reveal">Fades in</div>
<div class="reveal" data-delay="100">Staggered</div>
<div class="reveal" data-delay="200">More stagger</div>
```

Available delays: `60`, `80`, `100`, `120`, `160`, `180`, `200`, `240`, `300` (ms).
Observer is wired in `Layout.astro` — works on every page automatically.

---

## Shared Components

### SectionHeading

```typescript
interface Props {
  label?: string;           // mono uppercase label above heading
  heading: string;          // h2 text
  headingEm?: string;       // italic em on a new line (accent-colored)
  align?: 'left' | 'center'; // default 'center'
  size?: 'sm' | 'md' | 'lg'; // default 'md'
  mb?: number;              // margin-bottom px, default 56
}
```

Do **not** use inside dark/colored cards — it inherits `text-ink` which won't contrast on dark backgrounds.

### LeadForm

```typescript
type Field =
  | { type: 'text' | 'email' | 'tel' | 'url' | 'number'; name: string; placeholder?: string; required?: boolean }
  | { type: 'textarea'; name: string; placeholder?: string; rows?: number; required?: boolean }
  | { type: 'radios'; name: string; options: string[] }
  | { type: 'select'; name: string; options: string[]; placeholder?: string };

interface Props {
  id: string;               // prefix for IDs: {id}Form, {id}Success, {id}Error, {id}Label
  source: string;           // hidden _source field — appears in email subject line
  fields: Field[];
  action?: string;          // default '/contact' — form.action DOM property used, returns absolute URL
  submitLabel?: string;     // default 'Absenden'
  submitVariant?: 'accent' | 'ink'; // button color
  successTitle?: string;
  successBody?: string;
  errorHtml?: string;       // supports HTML (e.g. mailto fallback link)
  theme?: 'light' | 'dark'; // field color scheme
  turnstileTheme?: 'light' | 'dark' | 'auto'; // Turnstile widget theme, default 'auto'
}
```

Named slot `after-submit` — rendered after the submit button (good for trust indicators on LPs).
Multiple instances on one page work — wiring uses `data-*` attributes, Astro deduplicates `<script>` tags.
On success: form hides, success card shows, `window.dataLayer.push({ event: 'form_submit_success' })` fires.

**Show/hide implementation:** success and error elements use scoped CSS `display: none` / `.show { display: flex/block }` — no `hidden` Tailwind class and no `!important`. This avoids specificity conflicts between `display: none !important` (Tailwind `hidden`) and scoped CSS.

### Faq

Prop-driven accordion. Pass `questions` array `[{ q, a }]` or let it render its own defaults.
Single-open behaviour — clicking an open item closes it.
The open/close animation uses `max-height` transition in scoped CSS (can't be done with Tailwind).

### ObfuscatedEmail

```astro
<ObfuscatedEmail email="hallo@yourdomain.ch" class="optional-css-class" />
```

Never write `mailto:` links or plain email addresses anywhere else in the HTML. Use this component in footer, contact section, impressum, datenschutz.

### GTM

```astro
{gtmId && <GTM id={gtmId} />}
```

Uses `set:html` to inject the minified IIFE — this avoids `prettier-plugin-astro`'s inability to parse `define:vars` combined with `{` characters. **Never** reformat or move the snippet to a template expression.

### Nav

```typescript
interface Props {
  activePage?: string; // override Astro.url.pathname for active-link detection
}
```

Useful on multi-page sites where the active nav link should highlight a parent path. On single-page sites (all anchors), leave it unset — all nav items are anchor links and none will be marked active.
Mobile menu uses `hidden`/`flex` class toggling via JS.

### Turnstile

```astro
<Turnstile theme="auto" />
```

Renders nothing when `PUBLIC_TURNSTILE_SITE_KEY` is not set — safe to leave in every `LeadForm` during local dev. Set the env var in Cloudflare Pages to activate. Always use **managed** mode — invisible mode hides the widget and blocks users when Cloudflare issues a challenge.

### CookieBanner

The consent localStorage key is auto-derived from `SITE_KEY` in `config.ts` (computed as `` `${SITE_KEY}_consent` ``). No manual change needed per site — just set `SITE_KEY` in `config.ts`.

---

## Form Backend (`functions/contact.ts`)

Cloudflare Pages Function. POST to `/contact`.

**Flow:** honeypot check → Resend API → `{ ok: true }`.

**Honeypot:** hidden `_hp` field, positioned off-screen. Bots fill it, humans don't.

**Extra fields:** Any form field not in `[name, email, tel, message, _source, _hp]` is automatically included in the email. No backend changes needed when adding new form fields.

**Env vars** (Cloudflare Pages → Settings → Environment variables):

| Variable                    | Scope   | Value                                                          |
| --------------------------- | ------- | -------------------------------------------------------------- |
| `PUBLIC_GTM_ID`             | Build   | `GTM-XXXXXXX`                                                  |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build   | `0x...` from Cloudflare Dashboard → Turnstile                  |
| `RESEND_API_KEY`            | Runtime | `re_...` from resend.com                                       |
| `CONTACT_TO`                | Runtime | `hallo@yourdomain.ch`                                          |
| `CONTACT_FROM`              | Runtime | `forms@yourdomain.ch` — must be a verified Resend domain       |
| `CONTACT_BCC`               | Runtime | optional BCC address (e.g. secondary inbox or archive mailbox) |
| `TURNSTILE_SECRET`          | Runtime | `0x...` from Cloudflare Dashboard → Turnstile                  |

Local dev: build vars in `.env`, runtime vars in `.dev.vars` (both gitignored).

**Cloudflare Turnstile** is already built-in — `Turnstile.astro` is included in every `LeadForm`. To activate:

1. Create a Turnstile widget in Cloudflare Dashboard — use **Managed** mode
2. Add `PUBLIC_TURNSTILE_SITE_KEY` (build var) and `TURNSTILE_SECRET` (runtime var)
3. In local dev without these vars, the widget is invisible and server-side check is skipped — honeypot still runs

---

## GTM + Consent Mode v2

Configured in `Layout.astro`. Consent defaults run **before** GTM loads.

- **EEA + UK + CH regions:** all denied by default, `wait_for_update: 500ms`
- **All other regions:** granted by default

**GTM tags to configure in the container:**

1. **GA4 Configuration** — trigger: Consent Initialization — All Pages
2. **GA4 Event: generate_lead** — trigger: Custom Event `form_submit_success`
3. **Google Ads Conversion** — trigger: Custom Event `form_submit_success` (needs Conversion ID + Label from Google Ads → Goals → Conversions)

**Important:** Do NOT use "Google tag found on your website" in Google Ads campaign setup — it fails with permission denied (tag belongs to GA4 property, not Ads account). Create a new Conversion Action manually (Goals → Conversions → New → Website).

**Verify:** GA4 → Admin → DebugView. GTM Preview shows tags "Fired" even with consent denied — always accept the cookie banner before testing analytics events.

---

## Deployment — Cloudflare Pages

1. Push repo to GitHub
2. Cloudflare Dashboard → Pages → Create application → Connect to Git
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Node.js version: set via `.node-version` file (Cloudflare reads it automatically)
6. Environment variables: add `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `CONTACT_BCC` (optional), `TURNSTILE_SECRET`, `PUBLIC_GTM_ID`, `PUBLIC_TURNSTILE_SITE_KEY` in CF Pages settings
7. Apex redirect: Cloudflare → Redirect Rules → `yourdomain.ch` → `https://www.yourdomain.ch/$1` (301)

---

## SEO

- Homepage: `index, follow` (default — no `noindex` prop)
- Legal pages + `/danke`: `noindex, nofollow` (set via `LegalLayout` or `noindex={true}` prop)
- Sitemap: auto-generated by `@astrojs/sitemap` at `/sitemap-index.xml`
- Canonical URLs: computed from `Astro.site` + `Astro.url.pathname` in `Layout.astro`
- OG tags: `og:title`, `og:description`, `og:url`, `og:locale: de_CH`, `og:site_name`, `og:image`, `twitter:card: summary_large_image`
- OG image: place `og-default.png` (1200×630px) in `/public/`. Override per-page with `<Layout ogImage="/og-custom.png">`.

**Schema.org** — pass a `schema` object to `Layout.astro`:

```astro
---
const schema = {
  '@context': 'https://schema.org',
  '@type': SCHEMA_TYPE, // e.g. 'Plumber', 'LocalBusiness', 'HVACBusiness'
  name: SITE_NAME,
  telephone: PHONE,
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: ADDRESS_STREET,
    addressLocality: ADDRESS_CITY,
    addressCountry: 'CH',
  },
  areaServed: AREA_SERVED,
  openingHours: OPENING_HOURS,
  // Uncomment once real Google reviews exist:
  // aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', reviewCount: '12' },
};
---

<Layout title="..." description="..." schema={schema} />
```

`Layout.astro` injects it as `<script type="application/ld+json">` via `Fragment set:html` — safe from Prettier reformatting. All values come from `src/config.ts`. Only add `aggregateRating` once you have real reviews.

---

## Swiss / German Locale Gotchas

- **Swiss apostrophe `'` (U+2019) in JS string literals.** The typographic apostrophe looks like a closing single quote to JavaScript and silently breaks string literals. Always use double quotes for strings containing Swiss-formatted numbers: `"CHF 1'490"` not `'CHF 1\'490'`.

- **Swiss price formatting:** thousands separator is `'` (apostrophe). Store raw numbers, format at render: `.replace(/\B(?=(\d{3})+(?!\d))/g, "'")`.

- **German hyphenation:** add `hyphens: auto` on headings when `lang="de-CH"` is set — long compound nouns will otherwise overflow on mobile.

- **Du-Form vs. Sie-Form:** most local trade sites use Sie-Form (formal). Ictira marketing sites use Du-Form (modern/tech). Decide per project and apply consistently.

---

## Photo / Image Handling

**Always use `getImage()` from `astro:assets`** to convert JPG/PNG to WebP at build time. Reduces file sizes dramatically (example: 1.8 MB → 6 kB WebP).

```astro
---
import { getImage } from 'astro:assets';
import rawPhoto from '../assets/photo.jpg';
const photo = await getImage({ src: rawPhoto, format: 'webp', width: 800 });
---

<img src={photo.src} alt="..." width={photo.options.width} height={photo.attributes.height} />
```

**White-background cutout photos on colored backgrounds:**

- On near-white backgrounds (`bg-bg`, `bg-paper`): use `mix-blend-mode: multiply` — removes white bg seamlessly
- On dark/colored backgrounds (navy, dark gray): **never use `mix-blend-mode: multiply`** — multiplying against dark colors crushes the image to near-black. Instead: use a white pill/card wrapper with `border-radius` and `box-shadow`, or use a real transparent-bg PNG.

**Nav logo on dark nav:**
When a business logo has colored text on a white background and the nav is dark, wrap the logo in a white pill: `background: #fff; border-radius: 5px; padding: 7px 12px`. Size the image with a fixed width (e.g. `width: 128px; height: auto`) — never `width: auto` which renders the full source width.

---

## Astro Conventions

- **Run `npm run build` after any layout, CSS, or config change.** Most regressions surface immediately.
- **No `as any` or `@ts-ignore`.** Extend `Window` in `src/env.d.ts` for globals like `dataLayer`, `gtag`, `turnstile`.
- **Scoped CSS cannot be targeted from parent components.** For per-instance style overrides, use typed props or inline styles — not external class overrides.
- **Prefer composition over duplication.** If two pages share a significant block, extract a component.
- **`/lp/` landing pages:** use `Layout.astro` with `noindex={true}`, no Nav/Footer, own `LeadForm` instance with specific `source` value. Exclude from sitemap via `astro.config.mjs` filter (already configured).
- **`/danke` page:** alternative to AJAX success state — redirect here after a server-side form POST. Noindex, includes Nav + Footer. Only use this pattern if the form POSTs directly (not AJAX). Default template uses AJAX (`wireForm()`), so `/danke` is a standby page.
- **`404.astro`:** custom 404 with Nav + Footer, noindex. Cloudflare Pages serves it automatically for unmatched routes.
- **`prettier-plugin-astro` cannot parse `define:vars` with complex inline scripts.** Any `<script is:inline define:vars={{...}}>` block containing `{` characters (GTM IIFEs, minified snippets) causes a parse error. Fix: use `set:html` pattern (see `GTM.astro`).

---

## Common Patterns Reference

**Section with alternating background:**

```astro
<section class="section">...</section>
<!-- default bg-bg -->
<section class="section section-alt">...</section>
<!-- accent-tinted bg -->
<section class="section bg-ink text-white">...</section>
<!-- dark section -->
```

**3-column card grid:**

```astro
<div class="inner">
  <div class="grid-3">
    <div class="reveal">Card 1</div>
    <div class="reveal" data-delay="100">Card 2</div>
    <div class="reveal" data-delay="200">Card 3</div>
  </div>
</div>
```

Collapses to 2-col at 1024px, 1-col at 640px.

**Tabler icons:**

```astro
---
import { Icon } from 'astro-icon/components';
---

<Icon name="tabler:phone" size={24} />
<Icon name="tabler:mail" size={24} />
<Icon name="tabler:check" size={24} />
```

Browse all icons: tabler.io/icons

**Shared config import:**

```typescript
import { PHONE, PHONE_HREF, EMAIL, SITE_NAME } from '../config';
```

---

## Landing Page Pattern

For Google Ads campaigns, create `src/pages/lp/[slug].astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import LeadForm from '../../components/LeadForm.astro';
---

<Layout title="..." description="..." noindex={true}>
  <!-- No Nav, no Footer -->
  <!-- Hero with inline form -->
  <LeadForm
    id="lpHero"
    source="LP [Kampagne] · Hero"
    fields={[
      { type: 'text', name: 'name', placeholder: 'Ihr Name', required: true },
      { type: 'tel', name: 'tel', placeholder: 'Telefonnummer', required: true },
    ]}
    submitLabel="Jetzt anfragen"
  />
  <!-- Social proof, benefits, FAQ -->
  <LeadForm
    id="lpBottom"
    source="LP [Kampagne] · Abschluss"
    theme="dark"
    fields={[
      { type: 'text', name: 'name', placeholder: 'Ihr Name', required: true },
      { type: 'tel', name: 'tel', placeholder: 'Telefonnummer', required: true },
    ]}
  />
</Layout>
```

The `source` field distinguishes which form triggered the submission in the email subject line.

---

## Resend Email Setup

1. resend.com → Domains → Add your domain → verify DNS records
2. Sending address format: `forms@yourdomain.ch` (CONTACT_FROM), reply-to is set to the submitter's email
3. Until the domain is verified, use `onboarding@resend.dev` for testing (limited to your own email)
4. Receiving address: any mailbox you control (CONTACT_TO)

---

## Upgrading Astro

Check `astro.build/changelog`. The main breaking change pattern: `output: 'hybrid'` was removed in Astro 6 — use `prerender = false` on individual routes instead. Run `npx @astrojs/upgrade` for guided upgrades.
