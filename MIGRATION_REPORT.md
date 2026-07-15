# Auraava UI Migration Report
### aurava-frontend (production, source of truth for functionality) ← visual reference from auraava-bloom (Lovable design mockup)

**Read-only analysis. No code was changed to produce this report.**

---

## How to read this report

- **Project A** = `auraava-frontend` (Next.js App Router, real Express/Mongo backend behind `NEXT_PUBLIC_API_URL`, proxied via `next.config.js` rewrites). This is the only place code may ever be changed, and only its **visual/styling** layer is in scope.
- **Project B** = `auraava-bloom` (Lovable-generated, TanStack Router + Supabase scaffolding). **100% of its pages render static mock arrays from `src/lib/site-data.ts`** — its Supabase/`api.functions.ts` plumbing exists but is unused by any page read in this audit. Bloom is a **visual reference only**; none of its data-fetching, auth, or routing patterns should ever be copied into Project A.
- Every section below ends with a **Risk** and **Migration difficulty** rating and an explicit **do-not-touch** list.
- Where Bloom lacks something Project A has, the recommendation is always to **extend Bloom's visual language to cover it**, never to remove the frontend functionality.

---

# Home

**Current functionality (`app/page.tsx` + `components/home/*`)**
Server component composing `Header`, `HeroCarousel`, `SpecialOffer` eagerly, then `next/dynamic`-lazy-loads `ProductCarousel`, `SkinCareSection`, `Testimonials`, `InstaGallerySection`, `FAQs`, `StatsSection` (SSR on) for INP. Every below-the-fold section independently fetches its own data: `GET /api/products/best-sellers`, `/api/hair-care`, `/api/testimonials`, `/api/instagram`, `/api/faqs`, `/api/stats`, `/api/offers` — several deferred via `requestIdleCallback`/`setTimeout` as a deliberate perf strategy. `special-offer.tsx` renders `sectionSubtitle` via `dangerouslySetInnerHTML` (CMS-driven HTML). A `Blogs` home component exists in code but is **not currently wired into `page.tsx`**.

**Current UI**
Section order: Hero → SpecialOffer → ProductCarousel → Categories → SkinCare → Testimonials → Instagram → FAQs → Stats → Footer. Uses shadcn `Carousel` wrapper for carousels. Heavy use of ad-hoc hardcoded hex backgrounds per section (`#D4E4D4`, `#F0FFF0`, `#FDF1FF`) mixed with CSS-variable tokens (`bg-background`, `text-muted-foreground`). Mixed typography (`font-serif` in places, sans elsewhere).

**Bloom UI**
Section order: Hero → **TrustBar** → Categories → Offers → Bestsellers → HaircareGuide → Testimonials → InstagramGallery → Stats → FaqsPreview. Two sections (`TrustBar`, and an unwired `Newsletter`) have no Project A equivalent. Consistent editorial design system: CSS custom properties (`--bg-deep`, `--bg-cream`, `--bg-sage`, `--bg-blush`, `--accent-gold`, `--primary-light`), `font-display`/`font-serif-display` type, `eyebrow` label style, a reusable `Reveal` scroll-animation wrapper (with `useReducedMotion` support), animated stat counters, full-bleed category tiles with gradient-overlay hover CTA, embla-based carousels with custom round nav buttons, single-rotating-quote testimonial with progress dots (vs. Project A's 3-up carousel).

**UI differences**
Different section order; Bloom adds a Trust Bar strip; category cards are full-bleed image+overlay vs. Project A's image-top/text-below card; Bloom's FAQ teaser is a two-column sticky layout vs. Project A's centered accordion; Bloom stats animate/count-up, Project A's are static; Bloom Instagram is a static grid+CTA tile, Project A's is a carousel; overall palette is muted/botanical (green/cream/gold) vs. Project A's brighter ad-hoc pastels.

**Safe UI changes to migrate**
Editorial type system (display/serif headings + `eyebrow` labels) site-wide; add a Trust Bar strip under the hero (static, no data dependency); restyle Category cards to full-bleed image + gradient overlay + hover CTA (same `/products` links); restyle Bestseller cards with badge chips/ratings using fields already fetched; adopt `Reveal`-style scroll-in animation with reduced-motion support; unify the flat pastel hex backgrounds into a CSS-variable palette; animate the stat counters (visual/behavioral only, same fetched data); pill-shaped buttons and hover-underline nav links.

**Must NOT touch**
Every `fetch('/api/...')` call and its `loading`/empty-state branches in each `components/home/*.tsx` file; the `requestIdleCallback`/`setTimeout` deferred-load pattern; `next/dynamic` lazy-loading wiring in `page.tsx`; the FAQ accordion's `openId` state logic; `dangerouslySetInnerHTML` in `special-offer.tsx`; all `/products`, `/products/{id}`, `/blog`, `/blog/{slug}` hrefs; the `metadata` SEO export.

**Migration difficulty:** Medium — many independent self-fetching components to reskin consistently while preserving each one's render branches.
**Risk:** Medium — restyling risks touching fetch/state logic embedded in the same files as the markup, and the CMS-driven `dangerouslySetInnerHTML` is fragile to "helpful" refactors.

---

# Products (List)

**Current functionality (`app/products/page.tsx`)**
Client component. `useEffect` → `fetch('/api/products')` → `setProducts`. Purely client-side category filter (`activeFilter` state, values: `all/oils/shampoos/serums/sprays` — note these slugs, not `hair-oils` etc.). No URL sync. `Product` interface: `id, name, category, shortDescription, price, currency, mainImage, inStock`.

**Current UI**
Centered heading, filled/solid pill filter buttons (hardcoded `#4A6451` green active state), 1–4 col responsive grid, card = fixed `h-56` image + centered text block, plain red text for "Out of Stock", no ratings/badges/reviews.

**Bloom UI**
Full dark textured hero/banner with breadcrumb embedded above the filter+grid; outlined/uppercase-tracked pill filters (URL-synced via TanStack `validateSearch`, not portable as-is); `aspect-[4/5]` cards with 5-star rating + review count, diagonal "Bestseller" ribbon, full dark overlay for out-of-stock, hover "View Details" reveal, per-card WhatsApp quick-enquiry button, staggered fade-up entrance animation, CSS-variable gold/sage/blush palette.

**UI differences**
No hero/banner in Project A; solid vs. outlined filter pills; fixed-height vs. aspect-ratio image box; no ratings/bestseller badge/WhatsApp CTA on Project A cards; text out-of-stock label vs. full overlay; single hardcoded green vs. multi-token palette.

**Safe UI changes to migrate**
Restyle filter pills to outlined/uppercase-tracked (same `onClick`/state); add star rating + review count display (optional fields, hide if `undefined`); restyle out-of-stock as full image overlay (same `!product.inStock` condition); add bestseller ribbon (same optional field pattern already used elsewhere); swap fixed-height image box for `aspect-[4/5]` + hover zoom; introduce the CSS-variable accent palette; add a decorative hero/breadcrumb banner above the grid; staggered fade-up card animation.

**Must NOT touch**
`fetchProducts()`/`fetch('/api/products')` and its `useEffect`; `products`/`activeFilter`/`loading` state; the exact filter category slug values (`oils`, `shampoos`, `serums`, `sprays`); the `Product` interface and `data.products` envelope; `Link href={/products/${id}}`; `next/image fill` usage; loading/empty states.

**Migration difficulty:** Low. **Risk:** Low (self-contained page, no forms/auth; only risk is assuming rating/bestseller fields exist in the real API response without a fallback).

---

# Product Detail

**Current functionality (`app/products/[id]/page.tsx` + `components/product/*`)**
Client component, `params.id` (older sync-destructure pattern), `useEffect(fetchProduct, [])` — **note: empty dependency array, will not refetch if `id` changes while mounted** (existing behavior, do not "fix" silently). `fetch('/api/products/{id}')`, `notFound()` on failure. Real, CMS-configurable fields not present in Bloom's static model: `keyBenefits` (icon+label pairs, mapped via a `benefitIcons` dictionary), `bestSeller`, optional secondary `buttonText`/`buttonLink` CTA, and **per-product** `whatsappPhoneNumber`/`whatsappMessageTemplate` with template-substitution logic (`{productName}`, `{price}`) and hardcoded fallbacks. `ProductGallery` has real multi-image thumbnail-select state (`images: string[]`). `Productcarousael` below independently fetches `/api/products/best-sellers` with its own deferred-load pattern.

**Current UI**
Two-column grid (gallery | details), thumbnail row + large image, `font-serif` title, hardcoded green price/accent, key-benefits list with per-benefit icons, full-width green WhatsApp button, optional secondary CTA, flat always-visible description section, generic bestsellers carousel below (not related-by-category).

**Bloom UI**
Category badge pill above title; star rating + review count near title; description **and** a (hardcoded, non-per-product) "How to Use" section wrapped in a shadcn `Accordion`; trust-badge row (Natural/Cruelty-Free/Quality Assured); category-filtered "You May Also Like" embla carousel with prev/next arrows; single-image gallery artificially repeated 4× (a mock-data limitation — Project A's real multi-image gallery is already more capable and is not something to "port from" Bloom).

**Safe UI changes to migrate**
Add category badge pill (data already available, just not passed to `ProductDetails`); add star rating/review display (`product.rating`/`reviews` already fetched but unrendered); wrap the existing full description in an `Accordion` (presentational only — do **not** add Bloom's hardcoded generic "How to Use" text since there's no backing field for it); add a static trust-badge row; restyle WhatsApp/CTA buttons to rounded-full pill with uppercase tracked labels (same handlers); adopt gold/sage tokens; retitle/restyle the existing bestsellers carousel visually (do not change its fetch to be category-filtered — that's a functional change, out of scope here unless requested separately).

**Must NOT touch**
`params.id` handling and `fetch('/api/products/{id}')`; the empty-dependency `useEffect`; `notFound()` guards; the full `Product` interface incl. `keyBenefits`, `bestSeller`, `buttonText/Link`, `whatsappPhoneNumber/MessageTemplate`; `ProductGallery`'s real multi-image thumbnail state; `formatWhatsAppMessage`/`handleWhatsAppClick` template logic and fallbacks; the optional secondary "Dynamic Button" `window.open` logic; the `benefitIcons` per-benefit icon map; `Productcarousael`'s independent fetch + deferred-load pattern.

**Migration difficulty:** Medium. **Risk:** Medium — real embedded business logic (per-product WhatsApp templating, dynamic CTA, real multi-image gallery) that a careless structural copy from Bloom could simplify away.

---

# Blog (List)

**Current functionality (`app/blog/page.tsx`)**
`useEffect` → `fetch('/api/blogs')` → `setBlogs`. No slug logic here. Links to `/blog/{slug}`.

**Current UI**
Flat pink (`#F8ECF8`) background, Framer Motion staggered grid entrance, `aspect-[4/5]` images via `next/image`, `font-serif` titles, "Key Takeaways" label above excerpt, no author/date/category shown in the list.

**Bloom UI**
Page hero (eyebrow+H1+subcopy); a large **featured-post** 2-col hero card above the grid (Project A has none); grid cards use `aspect-[16/9]` images, category pill badge, author+date row, explicit "Read →" CTA, `animate-fade-up` stagger instead of Framer Motion, CSS-variable palette instead of one flat hex.

**Safe UI changes to migrate**
Add a page hero block above the grid; adopt category badge + author/date footer row in existing cards (data already fetched: `author`, `category`, `publishedAt`); switch image ratio to 16/9 with "Read →" affordance; swap flat pink for CSS-variable palette; optionally give the first fetched blog a "featured" visual treatment (pure display rearrangement of already-fetched data, not a new fetch).

**Must NOT touch**
`fetch('/api/blogs')`/`data.blogs` parsing; `loading`/`blogs` state; `Link href={/blog/${slug}}`; the `Blog` interface shape.

**Migration difficulty:** Low. **Risk:** Low.

---

# Blog Detail

**Current functionality (`app/blog/[slug]/page.tsx`)**
Client component using Next 15's **async params** pattern (`await params` inside `useEffect`, then a second `useEffect` fires the fetch once `slug` resolves). `fetch('/api/blogs/slug/{slug}')`, dual `notFound()` guards (fetch failure + null blog). **Bespoke content parser**: splits `blog.content` by `\n\n` then by `\n`, manually detects `**bold**`-wrapped lines to render `<strong>` — this is real, custom logic tied to how the backend stores body text, not a markdown library.

**Current UI**
Back link, fixed-height hero image, Calendar/User/Tag meta row below the image, `prose` content classes, bottom "Back to All Posts" pill.

**Bloom UI**
No breadcrumb; author-avatar-with-initial circle next to author name; category+date row **above** the H1; full aspect-ratio (`16/10`) rounded hero image; content stored pre-split as a paragraph array (no bold-parsing needed in Bloom's mock data); a "More Articles" related-posts grid at the bottom (Project A has none).

**Safe UI changes to migrate**
Add an author-avatar/initial circle (trivially derivable: `author.charAt(0)`); add a "More Articles" section — safe as an **additional, new** read-only call to the already-used `/api/blogs` endpoint to source "more posts" (additive, not a change to existing fetch); adjust hero image aspect ratio/radius and meta-row ordering; adopt Bloom's article typography scale.

**Must NOT touch**
The async-params resolution pattern; `fetch('/api/blogs/slug/{slug}')` and its `notFound()` guard; the bespoke `\n\n`/`**bold**` content parser (do not replace with Bloom's pre-split-array approach without a backend content-model change); the second `notFound()` fallback; the `Breadcrumb` component/its `items` shape.

**Migration difficulty:** Medium (the "More Articles" addition needs a new, careful fetch). **Risk:** Medium — the custom content parser is fragile and easy to accidentally disturb during a markup refactor.

---

# About

**Current functionality (`app/about-us/page.tsx`)**
`fetch('/api/about-us')` → `setSections` if `data.sections` present. Each section is **rendered from live CMS data**: `style={{backgroundColor: section.backgroundColor, color: section.textColor}}` (raw hex from the API) and `dangerouslySetInnerHTML` for `content` (supports embedded HTML/line breaks). Layout direction (`text-left`/`text-right`) also CMS-driven.

**Current UI**
No hero, alternating image/text sections in `min-h-[…]` fixed-height image containers, then `InstaGallerySection`, then `Footer`. No contact-cards section.

**Bloom UI**
Full hero (headline + tagline + decorative SVG background) — absent in Project A; dynamic sections map semantic color names (`ivory/cream/sage/blush`) through a `BG_MAP` (a more constrained approach than Project A's raw arbitrary hex, but Project A's is CMS-driven by design — not a bug); `aspect-[4/5]` images; a substantial **bottom Contact section** (Call/Email/WhatsApp cards) that Project A entirely lacks.

**Safe UI changes to migrate**
Add a static hero header above the sections loop (purely additive, doesn't touch the fetch); add a bottom Contact section (Call/Email/WhatsApp cards) using Project A's **own real** contact details (already present in `Footer`: phone `+91 9718370125`, emails) — not Bloom's mock `BRAND` object; adjust image container to `aspect-[4/5]`; add scroll-reveal animation.

**Must NOT touch**
`fetch('/api/about-us')` and its `data.sections` guard; the inline `style={{backgroundColor, color}}` CMS-theming mechanism (do **not** replace with static Tailwind classes — this is how the CMS controls per-section theming, not decorative); the `layout === 'text-right'` ordering logic; `dangerouslySetInnerHTML` content rendering; `InstaGallerySection` placement.

**Migration difficulty:** Medium. **Risk:** Medium — the inline dynamic `style` + `dangerouslySetInnerHTML` are exactly the kind of code a well-meaning "cleanup" would break by replacing with static classes/plain text.

---

# Hair Care Tips

**Current functionality (`app/hair-care-tips/page.tsx` thin wrapper + `components/home/skin-care-tips.tsx`)**
`SkinCareSection` owns all logic: `useEffect(fetchHairCareData, [])` → `fetch('/api/hair-care')`, conditionally overrides `sectionTitle`/`sectionDescription`/`steps` if present (initial state has fallback defaults baked in — a different pattern than other pages, which start empty). `if (loading) return null` — **no loading UI shown** (intentional or not, preserve as-is). `step.reverse` drives alternating layout.

**Current UI**
Just a `Breadcrumb` above the section (no page hero at all); flat `#F0FFF0` background; fixed-height image containers; Framer Motion `whileInView` per-step reveal; hardcoded hex colors (`#4A6451`).

**Bloom UI**
Full editorial hero with grain/SVG pattern background; large decorative step numerals (`01`–`06` at 40% opacity) beside each title — Project A has none; alternates row background color by index parity; `aspect-[4/5]` images; CSS-variable tokens instead of hardcoded hex.

**Safe UI changes to migrate**
Add a hero section (title/subtitle/decorative background) above the breadcrumb/steps; add large decorative step-number typography (purely index-derived, `i+1`, no new data); alternate row background color by parity; swap fixed-height images for `aspect-[4/5]`; replace hardcoded hex with CSS-variable tokens.

**Must NOT touch**
`fetch('/api/hair-care')` and its conditional-override-of-defaults pattern; the `if (loading) return null` behavior; `step.reverse` layout logic; the `Breadcrumb` usage on the page wrapper.

**Migration difficulty:** Low. **Risk:** Low.

---

# FAQs

**Current functionality (`app/faqs/page.tsx`)**
`fetch('/api/faqs')` → `setFaqs`. Single-open accordion via **id-based** `openId` state (robust to reordering/filtering, unlike an index). No search.

**Current UI**
Centered header, `bg-card` accordion items, chevron rotates 180° on open, abrupt (non-animated) show/hide of the answer.

**Bloom UI**
Live client-side search/filter input (`useMemo` over the FAQ array); smooth CSS-grid height-animated accordion (`gridTemplateRows: isOpen ? "1fr":"0fr"`); Plus/X icon toggle in a circular badge instead of a chevron; open-item highlight (colored bg + left accent border); bottom "Still have questions? Chat on WhatsApp" CTA banner; first item open by default (index-based `open` state — **less robust** than Project A's id-based state, do not downgrade to index-based).

**Safe UI changes to migrate**
Adopt the smooth grid-row accordion animation (same `openId` toggle, just CSS); add open-state highlight styling driven by the existing `openId === faq.id` check; swap chevron for Plus/X circular badge; add a bottom "Still have questions?" WhatsApp CTA (use Project A's real contact number, not Bloom's mock one). The search box is a small, genuinely additive (but safe) feature: pure client-side `useState`/`useMemo` filter over the already-fetched `faqs` array — does not touch the existing fetch or `openId` logic.

**Must NOT touch**
`fetch('/api/faqs')` and its fallback; the **id-based** `openId` toggle logic (do not switch to Bloom's index-based pattern); loading/empty-state handling.

**Migration difficulty:** Low. **Risk:** Low.

---

# Header

**Current functionality (`components/layout/header.tsx` → `main-navigation.tsx`)**
Thin wrapper; `MainNavigation` holds hardcoded `navLinks` (Home, About Us, Products, Hair&Care, FAQs — note: **no Blog link**, even though `/blog` exists elsewhere), scroll-based hide/show (`showNav`/`lastScroll` state), mobile hamburger toggling an inline dropdown panel. No search, no auth.

**Current UI**
Fixed nav, flat `#EFEFE3` background, image-based logo (`/bgimage/logo1.png`, alt text literally says "BIOROIDTECH logo" — a template leftover worth flagging to the team separately, not a design task item), `min-h-[44px]` touch targets throughout.

**Bloom UI**
Adds: a top marquee announcement ticker bar (CSS `animate-marquee`); a "Blog" nav link (one more than Project A); a decorative (non-functional, no `onClick`) search icon button; a WhatsApp CTA pill button (real `wa.me` deep link); progressive background blur/opacity transition on scroll (vs. Project A's simple translate-only hide/show); a full-height right-side slide-in mobile drawer (dark theme, big display-font links) instead of an inline dropdown; hover-underline nav link animation; a text-based wordmark logo instead of an image file.

**Safe UI changes to migrate**
Add the marquee ticker bar (static copy, no data dependency); add scroll-based background blur/opacity to the existing scroll `useEffect` (styling addition only); restyle mobile menu as a full-height slide-in drawer (same `isOpen` state, same `navLinks`); add hover-underline animation to nav links. The decorative search icon can be ported **only as a visual placeholder** — do not claim it adds real search. Adding a "Blog" link to `navLinks` and/or a WhatsApp CTA button are content/feature additions, not pure restyles — flag to the team for a product decision before adding.

**Must NOT touch**
The scroll show/hide `useEffect` (`showNav`, `lastScroll`); `navLinks` hrefs; the mobile menu's `isOpen` toggle and close-on-click behavior; the logo `Link` wrapping `href="/"`.

**Migration difficulty:** Low-Medium. **Risk:** Low.

---

# Footer

**Current functionality (`components/layout/footer.tsx`)**
Fully static server component — no fetch, no state. Real contact info (`+91 9718370125`, `customer@auraava.com`, `auraavacare@gmail.com`), real social URLs (Facebook/Instagram/YouTube/Twitter/LinkedIn), all four policy links point to the **same** PDF (`/bgimage/Policy.pdf` — an existing quirk, not something to silently "fix" during a visual pass), dynamic `{new Date().getFullYear()}` copyright, and a "Developed by BIOROIDTECH" attribution line (likely a contractual/business credit — do not drop without explicit sign-off).

**Current UI**
Light `#EFEFE3` background, 4-equal-column grid, `react-icons/fa` social icons (plain, colored), `font-serif` column headings.

**Bloom UI**
Dark (`--bg-deep`) theme with a decorative SVG wave divider at the top; 12-col asymmetric grid; circular outlined social icon buttons (gold hover fill) using `lucide-react` + one custom inline SVG for X; italic tagline; a WhatsApp CTA button in the contact column; Bloom's own policy links are `href="#"` placeholders — **not more "real" than Project A's**, don't treat them as such.

**Safe UI changes to migrate**
Dark theme + SVG wave divider (pure visual); circular outlined social icons with gold hover fill (same real hrefs); 12-column asymmetric grid layout; italic tagline styling (content stays Project A's own copy). A WhatsApp CTA button in the footer is a new-element addition needing product sign-off, not a pure style port. Icon-set unification (`react-icons/fa` → `lucide-react`) is cosmetic only if done consistently site-wide.

**Must NOT touch**
All real social/contact hrefs; the PDF policy links (as-is); the dynamic copyright year; the "Developed by BIOROIDTECH" line.

**Migration difficulty:** Low. **Risk:** Low.

---

# Navigation

Covers `top-navigation.tsx` (secondary bar) in addition to Header above.

**Current functionality**
`top-navigation.tsx` is a static server component: 6 hardcoded links ("About us", "Mane Ambassador Program", "Blog", "Curly Girl/Guy Method", "MONSOON must-have!", "Oil Control Combo") — **all hrefs are `"#"` placeholders**, and this component is **not imported in `app/page.tsx`**. Its actual live usage elsewhere in the app was not confirmed from the files read — **flag to the team to confirm whether it's live or dead code before deciding to restyle or retire it.**

**Bloom UI**
No direct equivalent; Bloom's closest analog is the Header's marquee ticker (a promo message, not a links bar — different purpose).

**Safe UI changes to migrate**
If confirmed live, restyle `TopNavigation`'s link bar with Bloom's uppercase/tracked typography — but do not silently turn its placeholder `#` hrefs into real links as part of a "visual" pass; that's a functionality decision.

**Must NOT touch**
`top-navigation.tsx`'s `links` array structure (don't delete without confirming real usage); `main-navigation.tsx` logic (see Header section).

**Migration difficulty:** Low. **Risk:** Low–Medium (only because live-usage of `TopNavigation` needs confirmation first).

---

# Search

**Current functionality**
**No search functionality exists anywhere in `auraava-frontend`** (verified via full-repo grep for "search" — zero matches: no input, no API route, no state).

**Bloom UI**
Two unrelated things both loosely called "search": (1) a **decorative, non-functional** search icon button in the Header (no `onClick`, no dropdown); (2) a **real but trivial** client-side text filter on the FAQs page (`useMemo` over the local static FAQ array — no backend call). Bloom's `products.index.tsx` "search" params (`validateSearch`) are actually just URL-synced category-filter state, unrelated to text search.

**Safe UI changes to migrate**
The header search icon can be added as a **pure visual stub** (no click handler) if desired. The FAQ input's visual styling (rounded-full, leading icon) can be reused if/when Project A's FAQ page gets its own real search feature (see FAQs section above — that filter logic is already a safe, self-contained addition there).

**Must NOT touch**
N/A — nothing exists to preserve. Main risk is scope creep: shipping a half-wired "fake" search rather than either a pure visual stub or a fully working filter.

**Migration difficulty:** Low / N/A. **Risk:** Low.

---

# Admin Dashboard / Login

**Current functionality**
`app/admin/page.tsx`: wraps everything in `<ProtectedRoute>` (client-side re-check of auth via `/api/auth/check`); on mount, fires 7 parallel fetches (`/api/products`, `/offers`, `/testimonials`, `/faqs`, `/hair-care`, `/instagram`, `/about-us`) via `Promise.all`; renders one large single-page dashboard with a section per content type, each with inline list rows, "Add"/"Edit"/"Delete" links/buttons, and a generic `handleDelete(type, id)` using `confirm()`/`alert()`. `app/admin/login/page.tsx`: `POST /api/auth/login` with `{username, password}`, `credentials:'include'`, redirects to `/admin` on success.

**Real auth architecture (must be fully understood before any admin UI work):**
- `middleware.ts` gates all `/admin/*` (except `/admin/login`) server-side: reads `admin-session` cookie, calls `verifyToken()` (jose `jwtVerify` against `JWT_SECRET`), redirects to `/admin/login` if missing/invalid.
- `lib/auth.ts`'s `checkAuth()`/`/api/auth/check` is the client-side re-check used by `ProtectedRoute`.
- This is a **username/password + JWT-cookie** system against Project A's own backend — entirely different from Bloom's Supabase `auth.getSession()` + `has_role` RPC model. **None of Bloom's auth code is portable — only its visual shell.**
- **Only the dashboard (`app/admin/page.tsx`) is wrapped in `<ProtectedRoute>`** among the files read; `offers/page.tsx`, `about-us/page.tsx`, `stats/page.tsx`, and the various `new`/`[id]` sub-pages show no explicit guard in-file. This may be enforced by a shared layout not read in this pass, or may be a real gap — **recommend the team verify `app/admin/layout.tsx` (if any) before touching these pages**, since a careless visual restructure could accidentally strip a guard that currently only exists inline.

**Current UI**
Single scrolling page, `bg-card` sectioned blocks, plain list rows, standard shadcn-style `Button`. Login page: centered gradient card, icon header, show/hide password toggle.

**Bloom UI**
`AdminShell` — a persistent left sidebar (Dashboard/Products/Blogs/Offers/Testimonials/FAQs/Hair Care/Instagram/About Us/Stats) + top bar, dark green (`#1A3A2A`) branding, dashboard itself is a grid of `StatCard`s (count + icon + "Manage →" link) per content type, each linking to its own dedicated CRUD page. Login page: centered card on dark background, email/password with a bootstrap-first-admin flow (Supabase-specific, not portable) — visually a nicer, more editorial treatment (uppercase tracked labels, pill submit button).

**Safe UI changes to migrate**
Persistent left-sidebar navigation shell (visual structure — Project A currently has no shared admin layout, every page only has a single "Back to Dashboard" link; this is a **structural improvement requiring a new shared layout**, not a drop-in style swap, so scope it as its own task); stat-card summary tiles on the dashboard (same fetched counts, just card-based instead of full-list-per-section); toast notifications (e.g. `sonner`) instead of `alert()`/`confirm()`; restyle the login card with Bloom's dark/pill-button aesthetic, keeping the exact `username`/`password` fields and `POST /api/auth/login` call.

**Must NOT touch**
`<ProtectedRoute>` wrapping and the underlying `/api/auth/check` flow; `middleware.ts`/`lib/auth.ts` JWT-cookie mechanism (do not touch at all — not a UI file); `Promise.all` fetch-all pattern and per-section `data.X || []` fallbacks; `handleDelete(type, id)` generic delete + `fetchAllData()` refresh; `handleLogout` → `POST /api/auth/logout`; `POST /api/auth/login` `{username, password}` payload shape (do **not** switch to Bloom's email/Supabase model).

**Migration difficulty:** Medium — visual restyle of the dashboard/login cards is easy; adding a persistent sidebar is a bigger structural change (new shared layout, updated links) that should be scoped separately.
**Risk:** Medium — this file also contains the delete logic and links for Products/Offers/Testimonials/FAQs/HairCare/Instagram/AboutUs simultaneously; any edit here has a wide blast radius.

---

# Admin Products

**Current functionality**
No dedicated list page — list+delete lives inline in the dashboard (`app/admin/page.tsx`, `Product` interface, `DELETE /api/products/{id}`). Create: `app/admin/products/new/page.tsx` — rich form (`name, category, shortDescription, fullDescription, price, images[], inStock, bestSeller, keyBenefits[{label,icon}], buttonText/Link, whatsappPhoneNumber, whatsappMessageTemplate`), multi-image upload via `uploadImage()` (one at a time, appended to array, removable), per-benefit icon picker from a 9-icon dictionary, submit disabled without ≥1 image. Edit: `app/admin/products/[id]/page.tsx` (not read line-by-line here but follows the same field set via `PUT`).

**Current UI**
Full-page card form, image thumbnails with an X-to-remove overlay, native "Upload Image" button, repeatable per-benefit rows with icon `<select>` + text input + remove button, a dedicated "WhatsApp Settings" and "Dynamic Button" sub-section.

**Bloom UI**
`admin.products.tsx` via generic `SimpleCrud` + `ImageUpload` (drag/preview) — table columns (Name, Category, Price, Stock, Bestseller) + a single Add/Edit modal dialog with `switch` toggles for `in_stock`/`bestseller`, a `select` for category, and single-image upload only (no `keyBenefits` array UI, no per-benefit icons, no dynamic button, no WhatsApp per-product override — these are all real capabilities Bloom's model simply doesn't have).

**Safe UI changes to migrate**
Table+modal list view (a genuine UX upgrade — currently there is no dedicated products list page at all, only the dashboard's flat list) using toast instead of `alert`/`confirm`; `Switch` component instead of checkboxes for `inStock`/`bestSeller`; `ImageUpload` drag-drop visual style for the *first/main* image. **Multi-image, `keyBenefits` icon-picker, Dynamic Button, and per-product WhatsApp fields have no Bloom equivalent — these must be kept exactly as they are and simply restyled to match the new visual language, not removed or "simplified" to match Bloom's smaller schema.**

**Must NOT touch**
`POST/PUT/DELETE /api/products[/{id}]` payload shape including `images[]`, `keyBenefits[{label,icon}]`, `buttonText/Link`, `whatsappPhoneNumber/MessageTemplate`; the `benefitIconOptions` 9-icon dictionary; the submit-disabled-without-image guard; the category slug values (`shampoos/serums/oils/sprays`, distinct from Bloom's `hair-oils/hair-serums/hair-sprays` naming).

**Migration difficulty:** Medium-High — introducing a real list/table page is new structural work (currently doesn't exist), on top of restyling an already feature-rich form.
**Risk:** Medium — largest, most business-critical admin form in the app; any field dropped during a "simplify to match Bloom" pass would be a real functional regression.

---

# Admin Blogs

**Current functionality**
No dedicated list page — inline in dashboard is **not shown for blogs specifically** in the read files (dashboard doesn't have a Blogs section block at all — confirm with the team whether this is intentional or a gap). Create: `app/admin/blogs/new/page.tsx` — `title, slug(auto-generated from title, editable), excerpt, content(with a "use ** for bold, blank-line paragraphs" hint matching the bespoke Blog Detail parser), author, category, publishedAt(date), image`. Edit: `app/admin/blogs/[id]/page.tsx` exists (PUT flow).

**Current UI**
Full-page form, live slug auto-generation on title change, large `font-mono` content textarea with markdown-lite hint text, single featured-image upload with preview+X.

**Bloom UI**
`admin.blogs.tsx` via `SimpleCrud` — table (Title, Author, Category, Date) + modal with the same field set conceptually (`title, slug, author, category, excerpt, image, content, published_date`) but content is a plain textarea with a "paragraphs separated by blank lines" hint and **no bold-syntax mention** (Bloom's Blog Detail route consumes pre-split paragraph arrays, not `**bold**` markup) — a real content-model difference to respect, not copy.

**Safe UI changes to migrate**
Table+modal list view (fills the apparent listing gap); toast instead of `alert`; keep the title→slug auto-generation UX exactly as-is (Bloom doesn't have live auto-slug, Project A's is more advanced — don't downgrade it); `ImageUpload` drag-drop visual style.

**Must NOT touch**
The bespoke `**bold**`/blank-line content convention (must match the parser in `app/blog/[slug]/page.tsx` exactly — do not adopt Bloom's plain-paragraph model); `POST /api/blogs` and `PUT /api/blogs/{id}` payload shape; the auto-slug generation logic (`toLowerCase().replace(/[^a-z0-9]+/g,'-')`).

**Migration difficulty:** Medium (table/list view is new structural work). **Risk:** Medium — content-format mismatch risk is the main hazard if Bloom's simpler textarea hint text is copied verbatim without also preserving the bold-markup convention.

---

# Admin FAQ

**Current functionality**
List/delete inline in dashboard (`FAQ` interface: `id, question, order`; `DELETE /api/faqs/{id}`). Create: `app/admin/faqs/new/page.tsx` — `question, answer, order`, with a live preview block showing how the FAQ will render publicly. **No edit page exists** (`app/admin/faqs/[id]/page.tsx` is absent) — FAQs can be created and deleted but never edited once created, a real functional gap in Project A today.

**Current UI**
Full-page form, numeric order input with helper text, a styled live-preview card mimicking the public FAQ accordion.

**Bloom UI**
`admin.faqs.tsx` via `SimpleCrud` — table (Question, Order) + a single Add/Edit modal covering `question, answer, sort_order`. Because it's a generic modal, Bloom's pattern supports editing every field — which is exactly the missing capability in Project A.

**Safe UI changes to migrate**
Table list view (question + order columns) + a **new** modal-based edit affordance — this is flagged as a **gap-fill, not a pure visual port**: Project A has no `PUT /api/faqs/{id}` call in the pages read, so adding real edit capability requires confirming (or adding) a backend PUT endpoint before the UI can do anything beyond cosmetic restyling of add/delete. Keep the live-preview-on-add feature (a nice touch Bloom lacks) when restyling.

**Must NOT touch**
`POST /api/faqs` and `DELETE /api/faqs/{id}` payload/contract; the `order`/display-order semantics; the live preview block's logic (purely additive, don't remove).

**Migration difficulty:** Medium — visual restyle of add/delete is straightforward; true edit capability is a feature gap, not a style task (flag separately for product/backend scoping).
**Risk:** Low-Medium.

---

# Admin Testimonials

**Current functionality**
List/delete inline in dashboard (author + star rating shown, delete only — **no edit affordance in the list**, matching FAQ's gap pattern). Create: `app/admin/testimonials/new/page.tsx` — `text, author, rating` via a 5-star clickable picker, live preview card, `POST /api/testimonials`. **No edit page exists.** Public consumption: `components/home/testimonials.tsx` fetches the same `GET /api/testimonials`.

**Bloom UI**
`admin.testimonials.tsx` via `SimpleCrud` — table (Author, Rating as `★` repeat string, truncated Text) + unified Add/Edit modal (`text, author, rating, sort_order`) + `AlertDialog` delete confirmation instead of `confirm()`.

**Safe UI changes to migrate**
Toast instead of `alert()`/`confirm()`; table layout instead of raw list rows; the unified modal add/edit pattern — flagged as a **gap-fill** (adds real edit capability Project A currently lacks entirely for testimonials), not a pure cosmetic change, so it needs the same "confirm/add a PUT endpoint" caveat as FAQs above.

**Must NOT touch**
`POST /api/testimonials {text, author, rating}`; `DELETE /api/testimonials/{id}`; `GET /api/testimonials` shape (consumed by both admin and the public home carousel — do not rename fields).

**Migration difficulty:** Medium (no true list page exists yet; building one plus edit capability is feature work layered on top of a style pass).
**Risk:** Medium — touching this necessarily means touching `app/admin/page.tsx`, which also drives Products/Offers/FAQs/HairCare/Instagram/AboutUs sections in the same file.

---

# Admin Offers

**Current functionality (`app/admin/offers/page.tsx`)**
Single page managing both **section-level metadata** (`sectionTitle`, `sectionSubtitle` with `<br/>`-based line breaks, `isVisible` toggle) and up to N offer items (`id, title, description, image, discount, link, order`). Save flow distinguishes new-vs-existing offers via an `originalOfferIds` Set: new items → `POST /api/offers {action:'add', item}`, existing → `PUT /api/offers/{id}`; section metadata → separate `POST /api/offers`. Per-offer image upload via `uploadImage()`. Submit disabled unless every offer has `title/description/image/discount`. No explicit auth guard visible in this file.

**Bloom UI**
`admin.offers.tsx` via `SimpleCrud` with `maxItems={3}` — table (Title, Discount, "Band") + modal (`title, description, image, discount, link_url`, plus a **`band` sage/blush/cream color-theme select** Project A's model doesn't have at all) — and critically, **Bloom has no section title/subtitle/visibility concept whatsoever**; that's a Project A-only capability.

**Safe UI changes to migrate**
Compact table+modal list view; toast instead of `alert()`; `ImageUpload` drop-zone visual style (CSS/layout only — not Bloom's Supabase base64 upload logic, which is a different upload mechanism than Project A's own `lib/upload-image.ts`); modal-based edit instead of the always-expanded stacked form — **as long as the section-title/subtitle/visibility block is preserved somewhere in the redesigned page**, since Bloom's reference has no equivalent to copy from for that part.

**Must NOT touch**
The exact `/api/offers` payload shapes (`sectionTitle`, `sectionSubtitle` w/ `<br/>` handling, `isVisible`, `action:'add'` for new vs. `PUT` for existing); the `originalOfferIds` new-vs-existing tracking logic; the all-fields-required submit guard; `lib/upload-image.ts`'s own upload mechanism (do not swap for Bloom's Supabase-based one).

**Migration difficulty:** Low-Medium (direct 1:1 page exists; the section-metadata block needs deliberate preservation since Bloom has nothing to reference for it).
**Risk:** Medium — the new-vs-existing offer branching is exactly the kind of logic a UI-only restructure could accidentally break.

---

# Admin Settings (About-Us)

**Current functionality (`app/admin/about-us/page.tsx`)**
Manages an array of sections: `id, title, subtitle?, content, image, backgroundColor, textColor, layout('text-left'|'text-right'), order`. Save uses **POST for both add and update** (`{action:'add', section}` vs `{id, update}` — unlike Offers, which uses PUT for updates; **do not "normalize" these two patterns to match each other**, that's a backend contract change). Raw `<input type="color">` pickers for both background and text color. Submit disabled unless title/content/image present on every section.

**Bloom UI**
`admin.about-us.tsx` via `SimpleCrud` — `background_color` uses **preset swatch buttons + free hex input** (nicer UX); `text_color` is a semantic **dark/light select**, not a free color (a real, simpler design decision, different from Project A's raw-hex-for-both approach); `layout` enum is `image-left/image-right` (inverted naming vs. Project A's `text-left/text-right` — same concept, different label).

**Safe UI changes to migrate**
Layer Bloom's preset-swatch buttons **on top of** the existing hex `backgroundColor` state/input (same setter, purely additive UX) — pure visual/UX enhancement, no data-shape change. Toast instead of `alert`. Compact table+modal list.

**Must NOT touch**
`backgroundColor`/`textColor` must remain raw hex strings — do **not** switch `textColor` to a semantic dark/light enum without confirming what `/api/about-us` and its public consumers expect; the `layout` enum values `text-left|text-right` (do not rename to Bloom's `image-left/image-right` without a coordinated read/write mapping — this would silently break the public About page's `md:order-1/2` logic); the dual POST-for-add-and-update vs. Offers' POST/PUT split (do not unify).

**Migration difficulty:** Medium — data-model naming differences (color semantics, layout enum) mean visual parity with Bloom needs mapping, not copy-paste.
**Risk:** Medium — enum-naming and update-method differences are easy to accidentally "fix" into Bloom's convention, which would break the real API contract.

---

# Admin Hair Care

**Current functionality**
Spread across 3 files (not missing, just structured differently than Bloom): list+delete inline in dashboard; create at `app/admin/hair-care/new/page.tsx`; edit at `app/admin/hair-care/[id]/page.tsx`. Model: `title, description, image, reverse(checkbox), order`. Public consumer (`skin-care-tips.tsx`) also supports `sectionTitle`/`sectionDescription` overrides via the API — **but there is no admin UI field to edit those**, a real, separate gap.

**Bloom UI**
`admin.hair-care.tsx` via `SimpleCrud` — single table+modal page, `reverse` as a proper `Switch` component instead of a checkbox.

**Safe UI changes to migrate**
`Switch` instead of checkbox for `reverse` (same boolean, pure visual swap). Consolidating the current 3-route flow (dashboard list / `new` / `[id]`) into Bloom's single table+modal page is a **larger structural change** (changes URLs, and the dashboard's `Link` targets at `app/admin/page.tsx` lines ~376/391 reference these routes directly) — scope this as its own task, not a drop-in restyle.

**Must NOT touch**
`POST/PUT /api/hair-care[/{id}]` payload shape; the `/admin/hair-care/new` and `/admin/hair-care/[id]` routes (unless consolidating deliberately, with all dashboard links updated in the same change); the disabled-without-image submit guard.

**Migration difficulty:** Medium (route restructuring, if pursued, is bigger than a style pass). **Risk:** Medium.

---

# Admin Statistics

**Current functionality (`app/admin/stats/page.tsx`)**
`GET /api/stats` → pads/truncates to enforce a **2–4 item** floor/ceiling on load. Add blocked client-side above 4 (`alert`), remove blocked below 2 (`alert`), reorders remaining `order` values after removal. Save = **single `POST /api/stats {items: validStats}`**, a full-array-replace (not item-level CRUD, unlike Offers/About-Us).

**Bloom UI**
`admin.stats.tsx` via `SimpleCrud` with `maxItems={4}` but **no enforced minimum** — a real functional difference. Field naming: `value` (Bloom) vs. `number` (Project A) — naming only, do not rename the real API field.

**Safe UI changes to migrate**
Existing bordered-block/dashed-add-button styling is already close to Bloom's; main portable items are toast usage and (optionally) a table-style summary view — flagged as a bigger layout change if pursued, not purely cosmetic, since it changes from "one big form" to "per-item rows."

**Must NOT touch**
The single-array-replace `POST /api/stats {items}` contract; the 2-minimum/4-maximum enforcement (both the UI add/remove guards and the final `validStats.length < 2` submit guard); the `number` field name.

**Migration difficulty:** Low. **Risk:** Low — small, self-contained page with validation fully visible in one file.

---

# Admin Instagram

**Current functionality**
Same 3-file pattern as Hair Care: list+delete inline in dashboard, create at `.../instagram/new`, edit at `.../instagram/[id]`. Model: `image, link(optional URL), order`. Public consumer (`components/home/instagram.tsx`) also supports `sectionTitle`/`sectionSubtitle` overrides with **no matching admin field** — same gap pattern as Hair Care.

**Bloom UI**
`admin.instagram.tsx` via `SimpleCrud` — 3-column table (order, thumbnail preview, link) + modal, field named `link_url` (Bloom) vs. `link` (Project A) — naming only.

**Safe UI changes to migrate**
Thumbnail preview in a list/table (visual-only — `image` is already fetched; the dashboard already shows a small thumbnail today, so this mainly matters if/when a dedicated list page is built); `ImageUpload` drop-zone style. Same caveat as Hair Care: consolidating the 3-route flow into one table+modal page is structural work, not a style pass.

**Must NOT touch**
`POST/PUT /api/instagram[/{id}]` payload shape (`image, link, order` — do not rename `link` to `link_url`); disabled-without-image submit guard; the `/admin/instagram/new` and `/admin/instagram/[id]` routes unless consolidating deliberately with dashboard links updated together.

**Migration difficulty:** Medium. **Risk:** Medium — same route/link-consolidation risk as Hair Care.

---

# Cross-Cutting Notes

**Design tokens**
Project A (`tailwind.config.ts`, `app/globals.css`): HSL CSS-variable tokens (`--background`, `--accent`, `--radius: 0.5rem`), system-font stack, Tailwind 3.4, two simple keyframes (`fade-in`, `slide-in-from-bottom`), plus scattered ad-hoc hardcoded hex colors throughout individual components (`#4A6451`, `#F0FFF0`, `#EFEFE3`, `#D4E4D4`, `#F8ECF8`, `#25D366` for WhatsApp). Bloom (`src/styles.css`, `components.json`): Tailwind 4 `@theme inline`, a full botanical-palette token set (`--primary: #1A3A2A`, `--accent: #B87333`, `--accent-gold: #C9A84C`, cream/sage/blush backgrounds), custom serif/display fonts (Cormorant Garamond, DM Serif Display, DM Sans via `@fontsource`), shadcn "new-york" style, custom utilities (`grain`, `section-pad`, `container-x`, `animate-marquee`, `animate-fade-up`), and a `.dark` theme block Project A has no equivalent of.

**Migrating the token system itself** (recommended prerequisite, not a page-by-page item): introduce Bloom's richer CSS-variable palette into Project A's existing `--variable` token scheme (compatible mechanism, different values/breadth) before reskinning individual pages, so every page-level change above can consume shared tokens instead of one-off hex values.

**Icon library:** both use `lucide-react` (Bloom's version newer, 0.575 vs 0.344) — safe, no swap needed. Project A also uses `react-icons/fa` in the Footer only — candidate for unification if Bloom's `lucide-react`-only icon set is adopted footer-wide.

**Animation:** both list `framer-motion` and `embla-carousel-react` — compatible tooling; Bloom additionally has a reusable `Reveal` scroll-animation wrapper with `useReducedMotion` support, a good pattern to introduce for accessibility.

**Component primitives / dependency stack — important constraint:** Bloom pulls in the full Radix/shadcn primitive set, `react-hook-form` + `zod`, `@tanstack/react-query`, `@supabase/supabase-js`, `recharts`, `sonner`. **Project A's `package.json` has none of these** — only `class-variance-authority`, `clsx`, `tailwind-merge`, `embla-carousel-react`, `framer-motion`, `lucide-react`, `react-icons`, `jose`. This means Bloom's admin CRUD/forms/toasts are built on infrastructure Project A doesn't have; adopting visual patterns like `SimpleCrud`'s modal/table/toast UX will require adding compatible libraries (e.g. a toast library, a `Dialog`/`Table` component set) to Project A — a dependency decision to make once, up front, rather than per-page.

**Auth / middleware (Project A) — must be preserved exactly, never touched by a "UI" change:**
- `middleware.ts` gates `/admin` and `/admin/:path*` (except `/admin/login`) by reading an `admin-session` cookie and calling `verifyToken()`.
- `lib/auth.ts`: `verifyToken()` uses `jose`'s `jwtVerify` against `JWT_SECRET` (falls back to a hardcoded dev secret — a pre-existing risk, out of scope for this UI report, but worth flagging to the team separately). `checkAuth()` calls `GET /api/auth/check` with `credentials:'include'`.
- `components/auth/protected-route.tsx` is a second, **client-side** re-check layered on top of the middleware's server-side check — both layers must survive any restyle.
- Bloom's entire auth model (Supabase `auth.getSession()` + `has_role` RPC via `checkIsAdmin`) is fundamentally different and **must never be ported as code** — only `AdminShell`'s visual sidebar/header layout is a valid reference.
- Only `app/admin/page.tsx` visibly wraps content in `<ProtectedRoute>` among the files read; verify whether a shared `app/admin/layout.tsx` covers the rest before restructuring any admin page.

**App shell:** `app/layout.tsx` carries extensive SEO metadata (OpenGraph, Twitter card, JSON-LD Organization schema, favicon) that has no Bloom equivalent to reference and must be unaffected by any visual work.

---

# Migration Order

A safe, incremental sequence — each step is shippable and reviewable on its own, and later steps depend on earlier ones.

**Step 1 — Design-token foundation (no visible change yet).**
Introduce Bloom's CSS-variable palette (primary green, accent gold/blush, sage/cream backgrounds) and typography (display/serif headings, `eyebrow` label style) into Project A's existing `tailwind.config.ts` / `globals.css` token system, additively, alongside current tokens. Add the `Reveal`-style scroll animation wrapper (with reduced-motion support). No page markup changes yet — this just makes the tokens available.

**Step 2 — Low-risk, fully static pages first.**
Footer, then Header (marquee bar + scroll-blur + drawer restyle, keeping `navLinks`/`isOpen` logic untouched), then Navigation (pending confirmation of `TopNavigation`'s live status). These have no fetch/state complexity and validate the new token system in production before touching data-driven pages.

**Step 3 — Simple data-driven public pages.**
FAQs, Hair Care Tips, Blog (List) — Low difficulty/risk, mostly additive hero sections, accordion animation, card restyles, using data already fetched by each page.

**Step 4 — Public pages with real embedded logic (extra care).**
Blog Detail (preserve the bespoke bold/paragraph parser), About (preserve `dangerouslySetInnerHTML` and CMS-driven inline `style`), Products (List), Product Detail (preserve per-product WhatsApp templating, dynamic CTA, multi-image gallery). Restyle markup only; do not touch any `fetch`/state/business logic identified above.

**Step 5 — Home page.**
Reskin each `components/home/*` section individually (Hero, Categories, Offers, ProductCarousel, SkinCare, Testimonials, Instagram, FAQ, Stats), preserving each section's independent fetch/loading/empty branches and the deferred-load performance pattern. Do this last among public pages since it touches the most files at once.

**Step 6 — Admin visual foundation.**
Introduce a shared admin layout with Bloom's persistent left-sidebar shell (new structural work, scoped separately from token work), wrapped correctly by the existing `<ProtectedRoute>`/middleware auth — verify auth coverage on every admin page before or during this step. Add whatever component library is needed for tables/modals/toasts (dependency decision from Cross-Cutting Notes).

**Step 7 — Simple admin CRUD pages.**
Statistics, then Offers, then About-Us/Settings — restyle to table+modal pattern where a list page doesn't yet exist, preserving each page's distinct save-contract quirks (array-replace for Stats, new-vs-existing branching for Offers, POST-for-both-add-and-update plus raw-hex colors for About-Us).

**Step 8 — Admin pages with gap-fill opportunities.**
Testimonials and FAQ admin — restyle add/delete flows now, and treat "add missing edit capability" as a tracked follow-up feature (needs a `PUT` endpoint decision) rather than bundling it silently into the visual pass.

**Step 9 — Most complex/business-critical admin pages last.**
Products (richest form: multi-image, per-benefit icons, dynamic CTA, per-product WhatsApp — highest regression risk) and Blogs (bespoke content-format contract) — restyle only after the patterns from Steps 6–8 are proven, and verify every field survives a side-by-side diff against the original form before shipping.

**Step 10 — Hair Care / Instagram admin route consolidation (optional, separate track).**
If the team wants to collapse the current 3-route (dashboard-list / new / edit) flow into Bloom's single table+modal page, do this as its own explicitly-scoped change, since it touches routing and cross-file links (`app/admin/page.tsx`'s `Link` targets), not just visuals.
