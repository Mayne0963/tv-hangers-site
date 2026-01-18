# Page Design Spec — Mobile-first PWA (TV/Picture Mounting)

## Global (All Pages)
- Layout: Mobile-first (320–430px) single-column; at ≥1024px, constrained center container (max-width ~1120px) with optional 2-column sections.
- Meta: Default title template `"{Page} | {Business Name}"`; default description emphasizes local service area + insured/experienced.
- Global styles (tokens):
  - Colors: background `#0B0F14`, surface `#111827`, text `#F9FAFB`, muted `#9CA3AF`, accent `#22C55E`, danger `#EF4444`.
  - Type scale: 14/16/18 body; 24/30/36 headings; 44 primary CTA on mobile.
  - Buttons: primary filled accent, secondary outline; hover/active darken; focus ring visible.
  - Links: underline on hover; always high contrast.
- PWA UI: persistent “Install app” prompt (non-blocking) and offline-friendly empty states for cached pages.
- Shared components:
  - Top Nav: logo, phone tap-to-call, hamburger menu (mobile), inline links (desktop).
  - Account entry: “Sign in” when signed out; “My orders” when signed in.
  - Footer: service area, hours, license/insurance notes (if applicable), quick links.

---

## Home (/)
- Meta: Title `"TV & Picture Mounting"`; OG image = best portfolio hero.
- Page structure: stacked sections.
- Sections & components:
  1. Hero: headline, subhead, 2 CTAs (“Request quote”, “Call now”), trust badges.
  2. Services grid: 3–6 cards (TV mounting, picture/art hanging, cable concealment).
  3. How it works: 3-step row (send details → confirm estimate → install).
  4. Featured portfolio: horizontal scroll on mobile; grid on desktop.
  5. Featured reviews: 3 cards + average rating summary; link to /reviews.
  6. Sticky mobile CTA bar: “Quote” + “Call”.

## Portfolio (/portfolio)
- Meta: Title `"Portfolio"`; description highlights before/after installs.
- Layout: filter row + responsive card grid.
- Sections & components:
  - Filters: category pills + room type dropdown (collapsible on mobile).
  - Project grid: cards with thumbnail, title, tags, short summary.
  - Empty state: guidance to clear filters.

## Portfolio Project Details (/portfolio/:slug)
- Meta: Title = project title; OG image = first image.
- Layout: media-first; details below; desktop becomes 2-column (media left, details right).
- Sections & components:
  - Image carousel: swipe on mobile; thumbnails on desktop.
  - Project facts: category, room type, constraints, approximate location (optional).
  - Description: problem → solution → notes.
  - CTA module: “Request a similar install” (prefills job type).

## Reviews (/reviews)
- Meta: Title `"Customer Reviews"`.
- Layout: summary header + list.
- Sections & components:
  - Rating summary: average, distribution bars, verified badge legend.
  - Review list: verified first; show status only for admin preview.
  - “Leave a review” panel: input for verification code or deep-link token; then form (rating + text + display name).
  - Report link: flags as “needs review” (stored for admin moderation).

## Quote + Scheduling (/quote)
- Meta: Title `"Request a Quote & Schedule"`.
- Layout: multi-step form (progress indicator) to reduce mobile friction.
- Sections & components:
  1. Job type step: TV / Art / Concealment; optional add-ons.
  2. Details step: TV size, wall type, mounting height, studs/brick, etc.
  3. Photos step: upload wall area + TV/backplate + wiring.
  4. Timing step: preferred days/times (2–3 options) + urgency.
  5. Contact step: name, phone/email, address/ZIP, consent note.
  6. Estimate panel: shows estimated range + disclaimer (final quote after confirmation).
  7. Confirmation: request ID + next steps.

## Contact (/contact)
- Meta: Title `"Contact"`.
- Layout: form first; details second; desktop 2-column.
- Sections & components:
  - Contact form: name, phone/email, message, preferred contact method.
  - Quick actions: tap-to-call, tap-to-email.
  - Business info: hours, service area map/text, response-time expectation.

## Account (/account)
- Meta: Title `"Account"`.
- Primary goals: fast email OTP sign-in and a clear path to orders.
- Sections & components:
  - Signed-out state:
    - Email input + “Send sign-in code/link” CTA.
    - Small note explaining verification (email confirmation).
  - Signed-in state:
    - Profile card: display name + phone.
    - Quick actions: “Create an order”, “View my orders”, “Sign out”.

## Orders (/orders)
- Meta: Title `"My Orders"`.
- Layout: list on mobile; table on desktop.
- Sections & components:
  - Orders list: status chip, job type, created date, and “View” link.
  - Empty state: CTA to “Create an order”.

## Order Details (/orders/:id)
- Meta: Title `"Order Details"`.
- Layout: status-first timeline; desktop 2-column.
- Sections & components:
  - Status timeline: requested → scheduled → in progress → completed.
  - Job summary: job type, address (masked if needed), notes, attachments.
  - Review panel (completed-only): star rating + text; submit goes to moderation.
  - Support panel (completed-only): category dropdown (issue/complaint/question) + message.
  - Tip panel (completed-only):
    - Cash App deep link + QR code and handle.
    - Optional “I tipped” tracking (amount + method) for owners’ records.

## Admin Login (/admin/login)
- Meta: Title `"Admin Login"` (noindex).
- Layout: centered card.
- Components: email/password inputs, show/hide password, error states, logout redirect.

## Admin Console (/admin)
- Meta: Title `"Admin"` (noindex).
- Layout: mobile tab bar; desktop left sidebar + main panel.
- Sections & components:
  - Dashboard: counts (new requests, pending reviews).
  - CMS: editable blocks for Home/Services/Service area; preview toggle.
  - Portfolio manager: CRUD project, reorder images, featured toggle.
  - Requests manager: table/list with status updates and notes.
  - Review moderation: approve/reject/edit, mark verified
