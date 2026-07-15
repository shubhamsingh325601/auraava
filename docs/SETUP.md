# Auraava — Local Setup & Manual Steps

This covers what's already been done automatically, what you still need to do by hand, and how to run the project. See [PRD.md](./PRD.md) / [TRD.md](./TRD.md) for the full audit this setup is based on.

---

## What's already done for you

- `backend/.env` and `frontend/.env.local` created with working defaults and a freshly generated `JWT_SECRET` (both files match, as required).
- `backend/.env.example` and `frontend/.env.example` added (safe to commit — no real secrets in them).
- `npm install` run in both `backend/` and `frontend/`; safe `npm audit fix` applied to both (0 vulnerabilities left in backend; 5 remaining in frontend require a Next.js major-version bump — see "Optional" below).
- **Security fixes applied** (these were P0 issues from the audit):
  - Every mutating API route (`POST`/`PUT`/`DELETE` on products, blogs, faqs, testimonials, offers, instagram, about-us, skincare/hair-care, stats, settings, upload) now requires a valid admin session — previously the API was completely open regardless of admin login.
  - Removed the hardcoded fallback `JWT_SECRET`/`admin`/`admin123` — the backend now refuses to start if these env vars aren't set.
  - Rate limiting added to `/api/auth/login` (10 attempts / 15 min).
  - Sanitized the admin-editable "special offer" subtitle before rendering it as HTML (was a stored-XSS vector).
  - Upload endpoint now only accepts JPEG/PNG/WebP/GIF (was previously any file type).
  - Backend now waits for MongoDB to connect before accepting requests, instead of racing.
  - Duplicated JWT logic in `routes/auth.ts` now reuses `lib/auth.ts` instead of a second copy.
- Confirmed backend compiles (`tsc --noEmit` clean) and frontend dev server boots and serves the home page.

**I could not start the backend end-to-end** because there's no MongoDB running yet — that's the main manual step below.

---

## What you need to do manually

### 1. Get a MongoDB database (required — I cannot create accounts or provision cloud infra for you)

Pick one:

**Option A — MongoDB Atlas (recommended, free tier, no local install)**
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free (M0) cluster.
3. Under **Database Access**, create a database user with a password.
4. Under **Network Access**, add your current IP (or `0.0.0.0/0` for local dev only — don't do this in production).
5. Click **Connect → Drivers**, copy the connection string, it looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/auraava?retryWrites=true&w=majority`
6. Paste that into `backend/.env` as `MONGODB_URI` (replace the current `mongodb://localhost:27017/auraava` placeholder).

**Option B — Local MongoDB**
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community (Windows installer).
2. Start the `MongoDB` service (the installer sets this up to run automatically, or run `mongod` manually).
3. Leave `backend/.env`'s `MONGODB_URI=mongodb://localhost:27017/auraava` as-is — it'll just work once Mongo is running.

There is no seed/migration script in this codebase — the database starts empty. You'll need to log into `/admin` and create your first products, FAQs, etc. by hand once the app is running.

### 2. Set real admin credentials

`backend/.env` currently has a randomly generated dev password (`ADMIN_PASSWORD=yznG3Kcdzp`) so the app isn't left with the old `admin`/`admin123` default. **Change this before you rely on it for anything real** — pick your own `ADMIN_USERNAME`/`ADMIN_PASSWORD` in `backend/.env`. This is a judgment call only you should make (it's your login).

### 3. Decide on file storage before deploying anywhere beyond your own machine

Uploaded product images currently save to `frontend/public/products/` on local disk, and the backend assumes it's running as a sibling directory to `frontend/` (`backend/routes/upload.ts` does `path.join(process.cwd(), '..', 'public', 'products')`). This **only works if you run both apps on the same machine/container with that exact folder layout**. If you deploy backend and frontend separately (e.g., backend on Render, frontend on Vercel), uploads will break or silently write to the wrong place.

Before deploying, decide: keep them co-located, or migrate uploads to an object store (S3, Cloudinary, etc.). This is an architecture decision I can implement once you choose — I didn't pick one for you since it affects hosting cost and choice of provider.

### 4. Pick hosting for backend + frontend + decide domain

Nothing is deployed anywhere yet — no Vercel project, no server, no domain DNS. You'll need to:
- Choose a host for the Express backend (Render, Railway, Fly.io, a VPS, etc. — it's a long-running process, not serverless-compatible as-is).
- Choose a host for the Next.js frontend (Vercel is the natural fit for Next.js).
- Set the production env vars (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `FRONTEND_URL` on backend; `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `JWT_SECRET` on frontend) in each host's dashboard — never commit them.
- Point your domain's DNS at whatever hosts you choose.

I can scaffold a Dockerfile/CI pipeline if you tell me which hosts you're picking, but the account creation and DNS changes are things only you can do.

### 5. Optional, needs your judgment

- **Next.js 14 → 16 upgrade**: 5 remaining `npm audit` findings in the frontend only resolve via `next@16`, a two-major-version jump from the current `next@14.2`. This could involve breaking changes to the App Router APIs used across ~20 page/component files. I did not do this automatically — say the word and I'll do the upgrade + fix whatever breaks.
- **Multer 1.x → 2.x**: the backend's upload library has known CVEs in the 1.x line. Upgrading changes some of its API; I left it as-is since it wasn't flagged in the current `npm audit` output (transitive deps were fixed instead), but it's worth planning.
- **WhatsApp number**: the site's "buy" flow is entirely a WhatsApp deep link. The number is stored in the `Settings` collection (defaults to a placeholder) and also hardcoded as a fallback in a couple of components with a *different* placeholder number (a bug noted in the TRD). Once your database is up, log into `/admin` and set the real business WhatsApp number — there's currently no admin UI for the `/api/settings` endpoint, so for now it needs a direct API call or a database edit. I can build that admin UI screen if you want it now.
- **Cart/checkout/payments**: entirely unbuilt (see PRD §5). Only build this if you're moving off the WhatsApp-inquiry model — that's a product decision, not a technical one.

---

## Running it locally (once MongoDB is set up)

Two terminals:

```bash
# Terminal 1 — backend (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 — frontend (http://localhost:3000)
cd frontend
npm run dev
```

Visit `http://localhost:3000` for the public site, `http://localhost:3000/admin/login` for the admin panel (use the `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `backend/.env`).

If the backend fails to start, check the terminal output first — as of this setup it will refuse to start (by design) if `MONGODB_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, or `ADMIN_PASSWORD` are missing from `backend/.env`, and it will exit if it can't reach MongoDB.
