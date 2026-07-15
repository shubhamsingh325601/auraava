# Auraava — Technical Requirements Document (TRD)

**Status**: Reverse-engineered from the current codebase (`d:/projects/Auraava/backend`, `d:/projects/Auraava/frontend`) as of 2026-07-06. Companion to [PRD.md](./PRD.md).

---

## 1. Architecture Overview

Two independent repositories, no monorepo tooling, no shared package:

```
Auraava/
├── backend/    (github.com/first500days/auraava-backend)
└── frontend/   (github.com/first500days/auraava-frontend)
```

- **Backend**: Node.js + Express 4 + TypeScript, long-running server (`app.listen`), not serverless. MongoDB via Mongoose 8.
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS 3. Talks to the backend via a Next.js rewrite proxy (`next.config.js`) so the browser only ever calls same-origin `/api/*`.
- **Auth**: Custom JWT (HS256 via `jose`), single hardcoded admin identity, httpOnly cookie.
- **Storage**: Local disk (`frontend/public/products/`) for uploaded images via Multer — no object storage (S3/Cloudinary) actually wired up, despite dead Cloudinary code present.
- **Deployment**: No Dockerfile, no CI/CD config, no `.env.example` in either repo.

---

## 2. Backend

### 2.1 Entry point (`backend/index.ts`)

- Middleware: `cors()` (origin = `FRONTEND_URL`, `credentials: true`), `cookie-parser`, `express.json()`, `express.urlencoded()`.
- Missing: `helmet`, rate limiting, request logging (morgan/pino), compression.
- `dotenv.config()` must run before `lib/mongodb.ts` is imported (env read at module load time) — current ordering is correct but fragile to refactors.
- Mongo connection is fired async but **not awaited** before `app.listen()`. Combined with `bufferCommands: false` in `lib/mongodb.ts`, requests arriving during the connection window will fail with a Mongoose buffering-timeout error instead of queuing. **Fix**: await `connectDB()` before calling `listen()`.
- Health check: `GET /api/health`.
- `routes/skincare.ts` is mounted twice — once as `/api/skincare`, once aliased as `/api/hair-care` — both hitting the same collection/model.

### 2.2 API Surface

Base path `/api/*`. Router-per-resource pattern (`routes/*.ts`), backed by a matching service module (`lib/*.ts`) that performs raw Mongoose operations.

| Resource | Endpoints | Auth |
|---|---|---|
| `/api/auth` | `POST /login`, `GET /check`, `POST /logout` | N/A (this *is* the auth) |
| `/api/products` | `GET /`, `GET /best-sellers?limit=`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | **None** |
| `/api/blogs` | `GET /`, `GET /slug/:slug`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | **None** |
| `/api/faqs` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | **None** |
| `/api/testimonials` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | **None** |
| `/api/offers` | `GET /`, `GET /:id`, `POST /` (dual-purpose add/update), `PUT /:id`, `DELETE /:id` | **None** |
| `/api/instagram` | `GET /`, `GET /:id`, `POST /` (dual-purpose), `PUT /:id`, `DELETE /:id` | **None** |
| `/api/about-us` | `GET /`, `GET /:id`, `POST /` (dual-purpose), `PUT /:id`, `DELETE /:id` | **None** |
| `/api/skincare` / `/api/hair-care` | `GET /`, `GET /:id`, `POST /` (dual-purpose), `PUT /:id`, `DELETE /:id` | **None** |
| `/api/stats` | `GET /`, `POST /` (replace-all / add / update, 3 body shapes) | **None**; no `DELETE`, despite a `deleteStatItem` function existing unused in `lib/stats.ts` |
| `/api/settings` | `GET /`, `POST /` (upsert) | **None** |
| `/api/upload` | `POST /` (multipart, field `file`, 10MB limit) | **None**; no MIME/extension allowlist |

**Critical finding**: only `/api/auth` implements authentication logic. No other router applies an auth-checking middleware. The admin/public separation exists solely at the **Next.js page level** (`middleware.ts` gates `/admin/*` pages) — the REST API itself is fully open. Anyone who discovers the API base URL can `POST`/`PUT`/`DELETE` any resource without a login. **This must be fixed before any real launch**, not treated as a nice-to-have — see §6.1.

### 2.3 Data Model (MongoDB / Mongoose 8)

All schemas use a `toJSON` transform renaming `_id` → `id` and dropping `__v`. No cross-model relations (no `ref`/`populate`) anywhere — every collection is independent.

| Model | Key fields | Pattern |
|---|---|---|
| `Product` | name, category, shortDescription, fullDescription, price (Number), currency, images[], mainImage, rating, reviews, inStock (Boolean), bestSeller (Boolean), sizes[], keyBenefits[{label,icon}], buttonText/Link, whatsappPhoneNumber/Template, createdAt | Flat collection |
| `Blog` | title, slug (unique), excerpt, content, author (free text), category, image, publishedAt, createdAt | Flat collection |
| `FAQ` | question, answer, order, createdAt | Flat collection |
| `Testimonial` | text, author, rating (Number, **no min/max validator**) | Flat collection |
| `AboutUs` (`AboutUsSection`) | title, subtitle, content, image, backgroundColor, textColor, layout (enum), order | Flat collection |
| `Offer` | `OffersData` singleton { sectionTitle, sectionSubtitle, isVisible, offers: `OfferItem`[] } | Singleton + embedded array |
| `Instagram` | `InstagramData` singleton { sectionTitle, sectionSubtitle, posts: `InstagramPost`[] } | Singleton + embedded array |
| `Skincare` (`HairCareData`) | singleton { sectionTitle, sectionDescription, items: `HairCareItem`[] } | Singleton + embedded array. Backs both `/api/skincare` and `/api/hair-care`. |
| `Stat` (`StatsData`) | singleton { items: `StatItem`{label, number: **String**, order}[] } | Singleton + embedded array |
| `Settings` | singleton { whatsappPhoneNumber (default `918971690503`), whatsappMessageTemplate } | Singleton |

No `User`/`Customer`, `Order`, `Cart`, or `Payment` models exist.

### 2.4 Auth Implementation

- **Three separate copies** of the same JWT create/verify logic exist: `backend/lib/auth.ts` (canonical), `backend/routes/auth.ts` (duplicate, doesn't import the canonical version), `frontend/lib/auth.ts` (duplicate, used by Next.js middleware). These must be kept behaviorally identical by hand — a real maintenance risk.
- Single admin identity via `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars, **insecure hardcoded fallbacks** (`admin` / `admin123`) if unset, present in 2 files.
- `JWT_SECRET` also has an **insecure hardcoded fallback** (`'fallback-secret-key-change-in-production'`) present in **3 files**. If this env var is never set in production, JWT tokens are forgeable by anyone who reads the public source.
- On login, a JWT (`{username, isAdmin:true}`, 24h expiry) is set as an httpOnly cookie `admin-session` (`secure` flag only in production, `sameSite: lax`).
- Frontend protection: `middleware.ts` verifies the cookie for `/admin/*` route access (page-level gate); `components/auth/protected-route.tsx` re-checks via `GET /api/auth/check` client-side on mount (redundant but harmless defense-in-depth; causes a brief unauthenticated flash while loading).
- **No CSRF token** on mutating requests — partially mitigated by `sameSite: lax`, but moot given the API isn't auth-gated at all (§2.2).
- `frontend` uses `jose ^6.1.3`, `backend` uses `jose ^5.10.0` — a major-version mismatch between two independent implementations of the same token verification logic. Should be pinned to the same major and ideally deduplicated into one shared verification path.

### 2.5 Service Layer (`lib/*.ts`) — Known Defects

- **No validation library** (zod/joi/express-validator) anywhere; only Mongoose `required` constraints. Errors surface as generic 500s (`{error: 'Failed to create X'}`) — inconsistent, since `products.ts` alone also includes `details: errorMessage` while every other route swallows the underlying message.
- **No ObjectId validation** on any `:id` route param — an invalid id throws a Mongoose `CastError`, caught generically and returned as a 500 instead of a 400.
- **Read-modify-write race conditions** on all singleton+embedded-array resources (Instagram, Offers, Skincare/Hair Care, Stats): "add item" reads the whole document, pushes locally, writes the whole array back — concurrent adds can silently lose a write.
- **Fabricated IDs returned on create**: `addInstagramPost` and `addSkincareItem` return `id: Date.now().toString()` instead of the real Mongo-assigned subdocument `_id`. A client using that id to immediately edit/delete the just-created item will not find it. `addOfferItem` works around this differently, by re-querying on `title+description+discount` match — fragile if two offers share those fields.
- **No `DELETE /api/stats/:id`** route despite `deleteStatItem` existing unused in `lib/stats.ts`; the admin UI works around this by doing a client-side array splice + full replace.
- **Image-delete functions are no-op stubs** (`deleteProductImages`, `deleteBlogImage`, etc. just `console.log`) — deleting content never removes its uploaded file from disk. Disk usage grows unbounded.
- **Dead code**: `backend/lib/api-client.ts` (a frontend-style fetch wrapper with no callers in the backend) and `backend/lib/utils.ts` (`cn()` classname helper, also frontend-only utility) — both leftovers, likely from an earlier Next.js-API-routes architecture that was split out into this Express service.

### 2.6 File Uploads (`routes/upload.ts`)

- Multer disk storage, writes to `path.join(process.cwd(), '..', 'public', 'products')` — **assumes backend and frontend are deployed as sibling directories sharing a parent**, which will break under most real deployment topologies (separate containers/hosts). Needs to move to a proper object store (S3-compatible) with the frontend serving via CDN/URL reference, not shared disk.
- 10MB size limit enforced; filename sanitized via regex.
- **No MIME-type/extension allowlist** — any file type can be uploaded and, if the upload directory is served statically without content-type sniffing protections, this is an arbitrary-file-upload risk.

---

## 3. Frontend

### 3.1 Structure

- App Router (`app/`), public pages: home, `/products`, `/products/[id]`, `/blog`, `/blog/[slug]`, `/about-us`, `/faqs`, `/hair-care-tips`.
- Admin pages under `/admin/*`, gated by `middleware.ts`.
- Data fetching is raw `fetch` + `useState`/`useEffect` in every component — no React Query/SWR, meaning no shared caching, dedup, or revalidation strategy; every navigation re-fetches from scratch and there's no loading/error-state consistency across components.
- No form library (react-hook-form) or client-side schema validation (zod) — forms rely on HTML `required` attributes only.

### 3.2 Design System Gap

- `components/ui/` contains only `button.tsx` (CVA-based) and `carousel.tsx` (Embla wrapper) — shadcn/ui-style dependencies (`class-variance-authority`, `clsx`, `tailwind-merge`) are installed but the rest of the primitive set (Input, Select, Textarea, Dialog, Card, Label, Badge) was never scaffolded.
- Every admin form hand-writes the same Tailwind input classes (`className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"`) repeated across 15+ files. Should be extracted into shared `Input`/`Textarea`/`Select` components.
- Delete confirmations use `window.confirm(...)` rather than an accessible modal.

### 3.3 Known Bugs / Dead Code

- `components/home/blogs.tsx` — fully implemented, never rendered on any page.
- `components/layout/top-navigation.tsx` — fully implemented, never imported (dead component; all its links point to `#` anyway).
- `frontend/lib/upload-image.ts` — dead Cloudinary upload path (hardcoded cloud name + placeholder preset) not used by the actual upload flow, which goes through the backend's local-disk Multer endpoint instead. `next.config.js` still allowlists `res.cloudinary.com` as a remote image host for this dead path.
- `app/admin/skincare/*` and `app/admin/hair-care/*` are near-duplicate admin UIs for the same backend resource (`/api/skincare` = `/api/hair-care` alias) — needs consolidation.
- Admin dashboard (`app/admin/page.tsx`) has no card/section for Blogs even though full blog CRUD pages exist at `app/admin/blogs/*` — orphaned from navigation.
- No admin UI exists for `/api/settings` (WhatsApp number/message template) despite the backend supporting it.
- `product-details.tsx` hardcodes a fallback WhatsApp number (`919598028672`) that **differs** from the `Settings` model's default (`918971690503`) — inconsistent fallbacks across the codebase.
- `app/faqs/page.tsx` reimplements the same accordion UI as `components/home/faqs.tsx` instead of reusing it; contains a stray leftover comment (`// lkl`).

### 3.4 Config Footgun

- `NEXT_PUBLIC_API_URL` is consumed inconsistently: `lib/api-client.ts` expects it to already include `/api`, while `next.config.js`'s rewrite rule appends `/api/:path*` to it. Setting the env var the same way in both places will double up the path (`/api/api/...`) in one of the two consumers. Needs a single documented convention (recommend: **base URL without `/api`**, and have every consumer append it consistently) plus a checked-in `.env.example` for both repos.

---

## 4. Dependencies

**Backend**: Express 4.18, Mongoose 8, `jose` 5.10, Multer 1.4.5-lts (⚠️ Multer 1.x has known CVEs — plan an upgrade to 2.x), TypeScript 5. Missing: helmet, express-rate-limit, a validation library, a logger, a test runner.

**Frontend**: Next.js 14.2 (one major behind current), React 18.3, `jose` 6.1 (major-version mismatch vs. backend), framer-motion 12.23, embla-carousel-react 8.0, tailwindcss 3.4, lucide-react 0.344 (stale pin). Missing: react-query/SWR, react-hook-form + zod, a test runner (Jest/Vitest/Playwright).

No test files exist in either repository. No CI/CD configuration (no `.github/workflows`, no Dockerfile) exists in either repository.

---

## 5. Non-Functional Requirements Not Currently Met

| Area | Current state | Requirement |
|---|---|---|
| Authentication on API | None on data-mutating routes | Every `POST`/`PUT`/`DELETE` route must verify the admin JWT server-side |
| Secrets management | Hardcoded fallback secrets in source | `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` must be required (fail-fast if unset), no fallback values committed |
| Input validation | Mongoose `required` only | Schema validation (zod/joi) at the API boundary, with 400 responses and field-level errors |
| Rate limiting | None | Rate limit `/api/auth/login` at minimum; consider global limits |
| XSS protection | `dangerouslySetInnerHTML` used unsanitized on admin-controlled offer text | Sanitize any HTML rendered from stored content (DOMPurify or equivalent), or stop accepting HTML in that field |
| File upload safety | No MIME/extension allowlist, disk-path deployment assumption | Allowlist image MIME types, move to object storage (S3-compatible) decoupled from either app's filesystem |
| Logging/monitoring | `console.log`/`console.error` only | Structured logging (pino/winston) + error tracking (Sentry) before production traffic |
| Testing | None | Unit tests for service layer, integration tests for API routes, at least smoke tests for critical frontend flows |
| CI/CD | None | Build+typecheck+test pipeline (GitHub Actions), containerization (Dockerfile) for reproducible deploys |
| Pagination | None — all list endpoints return full collections | Add `limit`/`skip` or cursor pagination once content volume grows |

---

## 6. Recommended Remediation Priorities

### 6.1 P0 — Security (block before any real production traffic)
1. Add JWT-verification middleware to every mutating route (`POST`/`PUT`/`DELETE`) across all resource routers — currently only page-level gating exists, the API itself is open.
2. Remove all hardcoded fallback secrets (`JWT_SECRET`, `ADMIN_USERNAME`/`PASSWORD`); fail startup if unset in production.
3. Sanitize `sectionSubtitle` (and any other admin-sourced HTML) before `dangerouslySetInnerHTML`, or switch to plain text + markdown rendering.
4. Add MIME/extension allowlist to the upload endpoint.
5. Add rate limiting to `/api/auth/login`.

### 6.2 P1 — Correctness / Data Integrity
1. Fix fabricated-ID bug in `addInstagramPost`/`addSkincareItem` (return the real Mongo `_id`).
2. Await DB connection before `app.listen()`, or switch off `bufferCommands: false`.
3. Add ObjectId validation on all `:id` routes (return 400, not 500, for malformed ids).
4. Implement real image deletion (currently no-op stubs) or accept and document unbounded disk growth.
5. Consolidate the duplicated JWT logic into one shared module consumed by both backend routers and remove the redundant copy in `routes/auth.ts`.
6. Resolve the `NEXT_PUBLIC_API_URL` double-`/api` footgun; add `.env.example` to both repos.

### 6.3 P2 — Product/UX Gaps (from PRD)
1. Add edit UI for Testimonials and FAQs.
2. Add Blogs to the admin dashboard navigation.
3. Consolidate Skincare/Hair Care duplicate admin sections.
4. Add admin UI for Settings (WhatsApp number/template).
5. Surface the Blogs component/link on the home page and footer.

### 6.4 P3 — New Build (only if moving beyond WhatsApp-inquiry model)
Cart, Checkout, Payment gateway integration, Order model + admin order management, real inventory quantity tracking, customer accounts. This is a from-scratch subsystem — see PRD §5 for scope framing before estimating.

---

## 7. Open Questions for Engineering Planning

1. Is the WhatsApp-inquiry model the permanent transaction mechanism, or is real checkout on the roadmap? (Determines whether P3 work above is in scope.)
2. Should the two repos be merged into a monorepo, or kept separate with a shared `.env.example`/API-contract doc to prevent drift (e.g., the `jose` version mismatch)?
3. Is local-disk file storage acceptable for the target deployment environment, or is migration to S3/Cloudinary-equivalent required before launch?
4. Is single-admin auth sufficient long-term, or is multi-admin/RBAC needed (e.g., separate content editors vs. full admins)?
