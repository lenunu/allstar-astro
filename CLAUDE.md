# CLAUDE.md — AllStar Party World × The 305 Club — Astro Site

## Project Overview
Single Astro site consolidating **allstarpartyworld.com** and **the305club.com** under one domain.
Tagline: **TWO VENUES / One Destination. Multiple Experiences.**

**Dev server:** `npm run dev` → http://localhost:4321
**Build:** `npm run build` (output: `dist/`)
**Deploy target:** Cloudflare Pages (GitHub → CF Pages auto-deploy)

---

## Stack
| Layer | Choice |
|---|---|
| Framework | Astro v6 (static output) |
| Styling | Tailwind v4 + `@theme` tokens in `src/styles/global.css` |
| CMS | Payload CMS v3 at `cms.allstarpartyworld.com` |
| Database | PostgreSQL on Coolify |
| Email | Plunk (transactional) |
| Hosting | Cloudflare Pages |
| Fonts | Bebas Neue (display) · Oswald (heading) · DM Sans (body) via Google Fonts |
| Icons | Font Awesome 6.4 CDN |

---

## Brand Tokens
```
Yellow:   #F5C518  → All Star Party World accent
Blue:     #3B7DEB  → The 305 Club accent / primary CTA
Pink:     #E8357A  → secondary accent / experiences
Base:     #0e0f14  → page background
Surface1: #14161e
Surface2: #1c1f2b
Surface3: #242838
```

**Yellow on dark:** 8.4:1 contrast ✓
**Blue on dark:** 4.6:1 ✓
**White on base:** 14.9:1 ✓

---

## File Structure
```
src/
  components/layout/
    Nav.astro           fixed nav, hamburger, ARIA
    Footer.astro        4-col grid, responsive
  layouts/
    Base.astro          HTML shell, fonts, OG meta, skip link
    Page.astro          Base + Nav + <main> + Footer
  pages/
    index.astro                       ✅ done
    all-star-party-world.astro        ✅ done
    305-club.astro                    ✅ done
    balloon-packages.astro            ✅ done
    gallery.astro                     ✅ done (filterable, lightbox)
    book.astro                        ✅ done (POSTs to Payload API)
    waiver.astro                      ⏳ pending
    experiences/
      paint-me-one.astro              ✅ done
      karaoke-lounge.astro            ✅ done
      pop-star-divas.astro            ✅ done (placeholder photos)
      vr-experience.astro             ✅ done (placeholder photos)
  styles/
    global.css          Tailwind v4 @theme tokens
public/
  allstar-event-photos/     9 real event photos
  305-event-photos/         15 real event photos
  paintmeone-photos/        6 selected PMO photos
  karaoke-photos/           2 karaoke lounge photos
  brand_assets/
```

---

## Pages Status

### ✅ Completed
- **/** — Homepage: hero video, venue panels, stats, marquee, experiences, events grid, gallery, testimonials, FAQ, booking preview, CTA
- **/all-star-party-world** — Full kids venue page (yellow accent, real photos, packages, FAQ)
- **/305-club** — Full teen/adult venue page (blue accent, real photos, packages, FAQ)
- **/balloon-packages** — 4 pricing packages + 20-photo theme gallery
- **/gallery** — Masonry gallery, filter tabs (All / AllStar / 305 / Experiences), lightbox with keyboard nav
- **/book** — Full booking form: venue selector, contact, event details, POST to Payload API
- **/experiences/paint-me-one** — Full page with 6 real PMO photos
- **/experiences/karaoke-lounge** — Full page with 2 karaoke photos
- **/experiences/pop-star-divas** — Full page (placeholder, needs real photos)
- **/experiences/vr-experience** — Full page (placeholder, needs real photos)

### ⏳ Pending
- **/waiver** — Two-step gated flow:
  1. Scroll to read full legal text (checkbox unlocks when scrolled to bottom)
  2. Parent info + repeatable kids array + canvas signature + typed name fallback
  - On submit: POST to Payload Waivers collection → Plunk confirmation email
- **/gallery** upgrade — currently uses local photos only; wire to Payload Gallery collection after CMS is live

---

## Waiver Page Design (when you build it)
**Step 1 — Read**
- Full legal text in a scrollable container with fixed height
- "I have read and agree" checkbox + Continue button **disabled** until user scrolls to bottom
- Scroll progress indicator

**Step 2 — Sign**
- Parent: first name, last name, email, phone, relationship to child
- Event date picker
- Kids array (repeatable rows): first name, last name, age, date of birth — add/remove, min 1
- Signature: `<canvas>` draw pad + typed name field (ADA fallback)
- Acknowledgment checkbox
- Submit → POST to `https://cms.allstarpartyworld.com/api/waivers`
- Plunk sends confirmation to parent + notification to staff

---

## Payload CMS — cms.allstarpartyworld.com
**Server:** Coolify at 5.161.254.158
**Collections:**
- `bookings` — all booking form submissions
- `waivers` — parent + kids array + signature
- `gallery` — event photos with venue/tag metadata
- `events` — event cards
- `experiences` — experience page content
- `site-settings` — nav, footer, contact info, waiver text (singleton)

**Booking form endpoint:** `POST https://cms.allstarpartyworld.com/api/bookings`
**Waiver endpoint:** `POST https://cms.allstarpartyworld.com/api/waivers`

---

## Cloudflare Pages — Remaining Setup
- [ ] Create GitHub repo `lenunu/allstar-astro`, push project
- [ ] Connect repo to Cloudflare Pages (build: `npm run build`, output: `dist/`)
- [ ] Add custom domain `allstarpartyworld.com` to CF Pages project
- [ ] DNS A record for `cms.` → 5.161.254.158 (Coolify) — Cloudflare proxy ON
- [ ] DNS A record for `mail.` → 5.161.254.158 (Plunk) — proxy ON
- [ ] Keep `staging.` A record for WordPress
- [ ] Copy deploy webhook URL from CF Pages → paste into Payload SiteSettings webhook field

---

## Photos Needed
- **Pop Star Divas** — no real photos yet; placeholder gradient used
- **VR Experience** — no real photos yet; placeholder gradient used
- **Karaoke Lounge** — 2 photos available (`/karaoke-photos/`)
- **Gallery** — currently uses local photos; will pull from Payload Gallery collection after wiring

---

## ⚠️ Catering Menu — WooCommerce Migration (DO THIS BEFORE LAUNCH)

The catering menu currently lives in **WooCommerce on the WordPress staging site** at `staging.allstarpartyworld.com`.

### Key Facts
- Products are **variable** — e.g. Caesar Salad has Size variants (Small 10–15 ppl / Large 20–25 ppl) with different prices ($59.95–$99.95)
- Every menu item must support **one or more variations** (size, serving count, or option type)
- Currently uses WooCommerce product gallery images per item

### Migration Tasks (future session)
1. **Export WooCommerce products** — use WooCommerce CSV exporter or WP REST API (`/wp-json/wc/v3/products`) to get all products + variations + images
2. **Download all product media** — pull image URLs from the export, `curl`/`wget` them into `public/catering-photos/`
3. **Create Payload `Menu` collection** with fields:
   - `name` (text)
   - `description` (textarea)
   - `category` (select: Salads, Mains, Sides, Desserts, Drinks, Platters…)
   - `image` (upload → Media)
   - `variations` (array):
     - `label` (text) — e.g. "Small (10–15 ppl)" / "Large (20–25 ppl)"
     - `price` (number)
     - `servingSize` (text) — e.g. "Serves 10–15"
   - `available` (checkbox — allows hiding items without deleting)
   - `sortOrder` (number)
4. **Build `/catering` page** in Astro — fetches from Payload Menu collection at build time
   - Category filter tabs (Salads / Mains / Sides / etc.)
   - Each item card: photo, name, description, variation selector (dropdown or pill buttons), price display
   - "Request This Item" CTA → links to `/book` with `?catering=true` pre-filled
5. **WooCommerce credentials** needed for API export: stored in WordPress admin at `staging.allstarpartyworld.com/wp-admin`

### WooCommerce REST API export command (run when ready)
```bash
# Get all products (paginated)
curl "https://staging.allstarpartyworld.com/wp-json/wc/v3/products?per_page=100&page=1" \
  -u "consumer_key:consumer_secret" > catering-products.json

# Get variations for a specific product ID
curl "https://staging.allstarpartyworld.com/wp-json/wc/v3/products/{id}/variations" \
  -u "consumer_key:consumer_secret"
```
Need WooCommerce API keys from: WP Admin → WooCommerce → Settings → Advanced → REST API

---

## ADA Notes
- Skip link: first element in `<body>` via Base.astro
- All interactive elements have `:focus-visible` outlines
- FAQ accordions: `aria-expanded`, `aria-controls`, `role="region"`
- Mobile menu: `aria-expanded` on hamburger
- Gallery lightbox: `role="dialog"`, `aria-modal`, keyboard nav (←→ Escape)
- Booking form: labels on all inputs, `aria-required`, `aria-live` for errors/success
- Images: descriptive `alt` text; decorative images `alt=""`
- Video: `prefers-reduced-motion` checked → hero video paused/poster shown

---

## Design Rules (never break these)
- Never use `transition-all`
- Never use default Tailwind blue/indigo as primary
- Every clickable element needs hover + focus-visible + active states
- Page backgrounds layer: `#0e0f14` base → `#14161e` surface-1 → `#1c1f2b` surface-2
- Headings: Bebas Neue · Sub-headings/labels: Oswald · Body: DM Sans
- Noise overlay: SVG fractalNoise filter on `body::before` (in global.css)
- Marquee: CSS `@keyframes marquee`, respects `prefers-reduced-motion`

---

## Contact Info (used across pages)
- **Phone:** 786-471-0100
- **Address:** 8770 SW 131st Street, Miami, Florida 33176 (Next to The Falls Shopping Center)
- **Instagram:** https://www.instagram.com/allstarpartyworld/
- **Facebook:** https://www.facebook.com/AllStarPartyMiami/
- **YouTube:** https://www.youtube.com/@AllStarPartyWorld
