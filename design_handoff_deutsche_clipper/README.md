# Handoff: Deutsche Clipper – Landing Pages

## Overview

Deutsche Clipper is a marketplace platform connecting German content creators/brands with "Clipper" — video editors who create short-form viral clips from long-form content. Clipper werden pro 1.000 Views bezahlt; Creator zahlen nur für echte Performance.

This handoff covers **two separate landing pages** for the Beta launch:
- **`clipper.html`** — for Clipper (video editors looking to earn money)
- **`creator.html`** — for Creator/Brands looking to grow via clips

Both pages drive a single CTA: **Waitlist / Beta sign-up via Email**.

---

## About the Design Files

The files in this bundle (`clipper.html`, `creator.html`) are **high-fidelity design references built in HTML/React**. They are prototypes showing the intended look, copy, and interactions — **not production code to ship directly**.

The task is to **recreate these designs in your target stack** (e.g. Next.js, Remix, or plain HTML) using your codebase's established patterns. If no frontend framework exists yet, **Next.js with Tailwind CSS** is the recommended choice for this project.

---

## Fidelity

**High-fidelity.** These are pixel-accurate mocks with final copy, colors, typography, spacing, hover states, and animations. Recreate them faithfully.

---

## Design Tokens

### Colors
| Token | Value | Usage |
|---|---|---|
| `bg-base` | `#080808` | Page background |
| `text-primary` | `#f0f0f0` | Headings, body |
| `text-muted` | `rgba(255,255,255,0.55)` | Secondary text |
| `text-dimmed` | `rgba(255,255,255,0.3)` | Tertiary text, labels |
| `accent-gold` | `#FFCC00` | Clipper page accent (DE flag gold) |
| `accent-red` | `#E30613` | Creator page accent (DE flag red) |
| `border-subtle` | `rgba(255,255,255,0.06)` | Dividers, card borders |
| `border-mid` | `rgba(255,255,255,0.12)` | Input borders |
| `surface-card` | `rgba(255,255,255,0.03)` | Card backgrounds |

### Typography
| Role | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Display / Hero | Bebas Neue | clamp(80px, 12vw, 180px) | 400 | 2px |
| Section heading | Bebas Neue | clamp(48px, 6vw, 80px) | 400 | 2px |
| Card heading | Bebas Neue | 22–28px | 400 | 1px |
| Body | DM Sans | 15–20px | 300 | — |
| Label / Tag | DM Sans | 11–13px | 700 | 3–4px |
| Stat value | Bebas Neue | 40px | 400 | 1px |

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
```

### Spacing
Base unit: `8px`. Common values: `12, 16, 24, 28, 32, 40, 48, 64, 80, 100, 120px`.

### Shape
- Buttons use a **cut-corner** clip-path (not border-radius):
  ```css
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  ```
- Small cut (inputs, small buttons): replace `12px` with `10px` or `16px`
- Cards/grid items: no border-radius — sharp corners throughout

### Animations
| Name | Description |
|---|---|
| `fadeUp` | `opacity 0→1, translateY 40px→0`, 0.8–0.9s, `cubic-bezier(0.16,1,0.3,1)` |
| `pulse` | `opacity 0.5↔1`, 4–5s, `ease-in-out infinite` — used on glows |
| `ticker` | `translateX(0 → -50%)`, 20s, `linear infinite` — scrolling text banner |
| `float` | `translateY 0 → -10px → 0`, 6s, `ease-in-out infinite` — dashboard mock |
| Page load stagger | Hero elements appear with `0.1s` stagger delays |

### Background decorations (both pages)
1. **Grid overlay**: `60×60px` CSS grid lines at `rgba(255,255,255,0.025)–0.03` opacity
2. **Noise texture**: SVG `feTurbulence` filter at ~4% opacity, fixed position
3. **Accent glow**: `radial-gradient` in accent color at `~10% opacity`, `600×600px`, `position: absolute`, animated with `pulse`
4. **Diagonal stripe** (creator page): right-side panel via `clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%)`

---

## Screens & Views

### 1. Clipper Landing Page (`clipper.html`)

**Purpose:** Attract video editors to sign up for the Clipper Beta. Core promise: earn money per 1,000 views.

#### Nav
- Fixed, full-width, height `64px`, padding `0 40px`
- Left: Logo (DC initials in DE flag colors + "DEUTSCHE CLIPPER" in Bebas Neue)
- Right: ghost link "Für Creator →" + filled CTA button "Beta-Zugang" in `accent-gold`
- On scroll (`>40px`): background `rgba(8,8,8,0.92)` + `backdrop-filter: blur(12px)` + subtle bottom border

#### Hero Section
- `min-height: 100vh`, centered layout, `padding: 100px 40px 80px`
- **Tag pill**: `background: accent-gold`, black text, uppercase, `letterSpacing: 3`, text: `"Clipper Beta 2025"`
- **H1**: `"CLIP IT. / CASH / IT."` — "CASH" in accent-gold, " IT." as outlined text (`WebkitTextStroke: 2px`)
- **Subtext**: Two-column layout (`1fr 1fr`) separated by vertical divider line, `fontSize: 20, fontWeight: 300`
  - Left: "Werde bezahlter Clipper für die größten deutschen Creator. Du schneidest. Wir rechnen ab."
  - Right: "Verdiene **pro 1.000 Views** — direkt, transparent, und ohne Bullshit." (`<strong>` in accent-gold)
- **CTA Button**: "Jetzt zur Beta anmelden", cut-corner shape, `padding: 16px 36px`, `fontSize: 16, fontWeight: 700`
- **Stats row** (3 items, `gap: 60px`, `marginTop: 72px`):
  - `€0,50–3,00` / pro 1.000 Views / je nach Creator
  - `100%` / Remote / Clip von überall
  - `∞` / Creator / wachsendes Netzwerk

#### How It Works (3-column grid, `gap: 2px`)
Section label: "So funktioniert's" | H2: "IN DREI SCHRITTEN / **ZUM EARNING**"

| # | Title | Description |
|---|---|---|
| 01 | Creator aussuchen | Durchsuche Creator, die aktiv Clipper suchen. Bewirb dich kostenlos auf ihre Kanäle. |
| 02 | Clips erstellen | Schneid die besten Momente aus dem Content. Short-Form für TikTok, Reels und YouTube Shorts. |
| 03 | Geld verdienen | Pro 1.000 Views erhältst du direkt deine Vergütung — automatisch, transparent, auf dein Konto. |

- First column: `borderTop: 3px solid accent-gold`; others: `borderTop: 3px solid rgba(255,255,255,0.08)`
- Large ghost step number (`72px`, `rgba(255,255,255,0.05)`) positioned `absolute top-right`
- Middle column has `background: rgba(255,255,255,0.03)` background

#### Benefits (2×2 grid)
Section H2: "WARUM / **DEUTSCHE CLIPPER**?"
Right side: short paragraph about the platform's uniqueness

Cards on hover: `borderColor → accent-gold + 40% opacity`, `background → accent-gold + 5% opacity`

| Title | Description |
|---|---|
| 💸 Pay-per-View | Keine Pauschalbeträge. Du verdienst direkt proportional zu deinen Views. |
| 🎯 Echte Creator | Keine Fake-Anfragen. Nur verifizierte deutsche Creator mit aktivem Publikum. |
| ⚡ Schnelle Auszahlung | Wöchentliche Auszahlungen. Direkt auf dein Konto. Keine monatelangen Wartezeiten. |
| 🔒 Rechtlich sicher | Klare Verträge, DSGVO-konform. Du bist abgesichert — von beiden Seiten. |

#### Waitlist Section (`#waitlist`)
Two-column layout (`1fr 1fr`, `gap: 80px`)

**Left column:**
- Tag: "Limitierte Beta-Plätze"
- H2: "SICHERE DEINEN / **PLATZ**"
- Body text about Beta benefits

**Right column — Email form:**
- Combined input+button container with cut-corner clip-path
- Input: `type="email"`, placeholder "deine@email.de"
- Button: "Als Clipper anmelden", `background: accent-gold`, `color: #080808`
- Border animates to accent on focus
- Disclaimer: "Kein Spam. Keine Kosten. Jederzeit abmeldbar."
- Cross-link below divider: "DU BIST EIN CREATOR?" → link to creator page in `#E30613`
- On submit: replace form with success state ("🎉 DU BIST DRIN!") with accent-colored box

---

### 2. Creator Landing Page (`creator.html`)

**Purpose:** Attract YouTubers, Twitch streamers, and other content creators to sign up. Core promise: go viral, pay only for real views.

#### Nav
Same structure as Clipper nav, but:
- CTA "Beta-Zugang" in `accent-red` (#E30613) with white text
- Cross-link: "Für Clipper →" (right side)

#### Hero Section
- **Pill badge** with animated red dot: "Creator Beta jetzt offen"
- **H1**: `"MEHR VIEWS. / WENIGER (outlined) / AUFWAND (red)"`
- **Two-column subtext** (`420px 1fr`, `gap: 0`):
  - Left: "Professionelle Clipper verwandeln deinen Long-Form Content in **virale Kurzvideos**"
  - Right: explanation of pay-per-view model + red CTA button
- **Stats row** (3 items, separated by top border):
  - `0 €` / Fixkosten / nur Pay-per-View
  - `+300%` / Mehr Content / aus deinen Videos
  - `48h` / Erste Clips / nach Freigabe

#### Ticker Banner
Full-width scrolling text banner between hero and content sections.
Items: `Mehr Reichweite · Virales Wachstum · Professionelle Clipper · Einfache Abrechnung · Nur bei Erfolg · DSGVO-konform · Made in Germany`
- Accent-colored for first item of each repeat cycle
- `animation: ticker 20s linear infinite`
- Duplicated array for seamless loop

#### How It Works
Two-column layout (`380px 1fr`) — left column **sticky** (`top: 100px`).

**Left (sticky):** Label "Ablauf" | H2: "SO / **EINFACH** / GEHT'S" | description text

**Right (3 step cards, stacked):**

| # | Title | Description |
|---|---|---|
| 01 | Profil erstellen | Beschreibe deinen Kanal. Wir matchen dich mit passenden Clippern. |
| 02 | Clips genehmigen | Alle Clips landen zur Freigabe in deinem Dashboard. Volle Kontrolle. |
| 03 | Wachsen & abrechnen | Du bezahlst nur für echte Views — direkt über die Plattform. |

Each card: `flexbox row`, numbered square icon (`48×48px`, `border: 2px solid accent`) + text block. Hover: accent-tinted border + background.

#### Benefits (3×2 grid)
H2: "ALLES WAS DU / **BRAUCHST**"

| Title | Description |
|---|---|
| Nur für Erfolg zahlen | Kein Monatsabo, keine Agenturgebühren. Pay-per-View only. |
| Kuratierte Clipper | Nur verifizierte, erfahrene Clipper. |
| Vollständiges Management | Vertragsabwicklung, Abrechnung, Kommunikation — alles zentral. |
| Volle Content-Kontrolle | Jeder Clip muss von dir freigegeben werden. |
| Deutsche Creator & Clipper | Gezielt für den deutschen Markt. |
| Skalierbar | Wächst mit deinen Anforderungen. |

#### Waitlist / Application Section
Two-column layout (`1fr 1fr`, `gap: 100px`)

**Left:** Tag "Creator Beta" | H2: "JETZT / BEWERBEN" | benefits list (4 checkmark items):
- ✓ Zugang zu einem verifizierten Clipper-Netzwerk
- ✓ Kostenloses Onboarding & Setup
- ✓ Beta-Pricing — günstigere Konditionen als später
- ✓ Direkter Kontakt zum Gründerteam

**Right — 3-field form:**
- Text input: "Dein Name / Kanal-Name"
- Email input: "deine@email.de" (required)
- Text input: "Hauptplattform (z.B. YouTube, Twitch...)"
- Submit button: full-width, cut-corner, `background: accent-red`, white text
- Cross-link: "DU BIST EIN CLIPPER?" → clipper page link in `#FFCC00`
- Success state: box with "🎉 BEWERBUNG ERHALTEN!" — note that creators are manually reviewed

---

## Interactions & Behavior

### Navigation
- `clipper.html` ↔ `creator.html` linked via nav cross-links and form cross-links
- Both anchor `#waitlist` for CTA scroll

### Forms
- No backend wired up — forms currently use a `setTimeout(800ms)` mock
- **Integration needed**: Connect to an email collection backend (Mailchimp, ConvertKit, Supabase, or custom API endpoint)
- Success state replaces the form in-place (no page navigation)
- Validation: email field is `required`; other fields are optional

### Hover States
- Nav links: `color` transition `rgba(255,255,255,0.5) → #fff`, `0.2s`
- CTA buttons: `opacity → 0.85`, `0.15s`
- Benefit cards: `borderColor` → accent at 40% opacity, `background` → accent at 5%, `0.2s`
- Cross-links: `gap` increases on hover (arrow moves right), `0.2s`

### Scroll
- Nav transitions from transparent to `rgba(8,8,8,0.92)` with blur when `scrollY > 40px`

---

## Logo

The logo is an inline SVG (`56×40px viewBox`) representing the German flag:
- 3 horizontal stripes: near-black / red `#E30613` / gold `#FFCC00`
- "DC" text centered in Bebas Neue, white
- Followed by "DEUTSCHE CLIPPER" in Bebas Neue

**Replace with final brand asset** when available. The SVG logo in the files serves as placeholder.

---

## SEO / Meta (to add in production)

```html
<meta name="description" content="Deutsche Clipper – Die Plattform für Creator und Clipper. Verdiene Geld mit viralen Clips oder lass deinen Content viral gehen." />
<meta property="og:title" content="Deutsche Clipper" />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

---

## Files in This Package

| File | Description |
|---|---|
| `clipper.html` | Clipper landing page (design reference, React/Babel inline) |
| `creator.html` | Creator landing page (design reference, React/Babel inline) |
| `tweaks-panel.jsx` | Design tweaks UI helper — not needed in production |
| `README.md` | This document |

---

## Recommended Tech Stack (if starting fresh)

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + CSS Modules for complex animations
- **Fonts**: `next/font` with Google Fonts (Bebas Neue, DM Sans)
- **Forms/Waitlist**: Resend + Supabase, or a simple Mailchimp embed
- **Analytics**: Plausible (DSGVO-konform)
- **Hosting**: Vercel

---

## Out of Scope (not in this design)

- Mobile / responsive breakpoints (desktop-first design — mobile breakpoints to be designed separately)
- Authenticated dashboard / logged-in states
- Payment / payout flows
- Creator profile pages
- Clipper portfolio pages
