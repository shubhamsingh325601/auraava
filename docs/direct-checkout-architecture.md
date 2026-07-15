# Auraava Direct Checkout — Architecture & Requirements Document

Status: **Analysis / Proposal only — no code, schema, or API changes have been made.**
Scope: Add a **third purchase option** ("Buy Directly") alongside the existing WhatsApp and External Marketplace flows, without altering either.

**Business framing:** Auraava is a brand website, not a full e-commerce platform. It is not becoming Amazon or Flipkart. Direct Checkout is a lightweight, additive way to let a customer complete a purchase without leaving the site — nothing more. The architecture below is deliberately minimal: one new database collection, no customer accounts, no order history, no loyalty/wishlist features.

---

## 0. Non-Negotiable Guarantees

| Flow | Status |
|---|---|
| **WhatsApp Purchase** | Unchanged — same fields, same handler, same behavior |
| **External Marketplace Purchase** (Amazon / Flipkart / custom link) | Unchanged — same fields, same handler, same behavior |
| **Direct Checkout** (Cart → Checkout → Payment → Order) | **Additional** — new, does not replace or modify the above |

- No existing API is modified.
- No existing database field is renamed, retyped, or removed.
- No migration is required for existing data.
- Nothing in the current application breaks. Everything described below is additive.

---

## 1. Current System Audit

### 1.1 Architecture
- **Backend**: Express + TypeScript, single MongoDB Atlas database via Mongoose. Entry point `backend/index.ts` mounts one router per resource (`/api/products`, `/api/offers`, `/api/settings`, `/api/upload`, `/api/auth`, etc.). No service layer beyond thin `lib/*.ts` data-access modules (e.g. `backend/lib/products.ts`) called directly by route handlers.
- **Frontend**: Next.js App Router. `frontend/next.config.js` rewrites `/api/:path*` to the backend, so all frontend fetches use relative `/api/...` paths — the browser never talks to the Express host directly.
- **Auth model**: There is **no customer account system at all**. The only authentication is a single hardcoded admin identity (`ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars → JWT in an `admin-session` cookie, verified by `backend/middleware/requireAdmin.ts`). All customer-facing GET routes are public; mutating routes require `requireAdmin`. **This document does not propose adding customer accounts, login, registration, or any customer-facing auth.**
- **File uploads**: `backend/routes/upload.ts` uses multer to write images to local disk (`public/products`), returning a relative URL. Orthogonal to checkout, no change needed.

### 1.2 Current Product Model (`backend/lib/models/Product.ts`)
A single flat `Product` document holds commerce fields directly:
```
name, category, shortDescription, fullDescription, price, currency,
images[], mainImage, rating, reviews, inStock, sizes[], keyBenefits[],
bestSeller, buttonText, buttonLink,
whatsappPhoneNumber, whatsappMessageTemplate, createdAt
```

### 1.3 Current Purchase Flows (both COMPLETE, WORKING, and must never change)

**1. WhatsApp Purchase** (`frontend/components/product/product-details.tsx`)
```
Customer clicks WhatsApp
    ↓
WhatsApp opens (wa.me link, prefilled message)
    ↓
Conversation continues
```
Uses `product.whatsappPhoneNumber`/`whatsappMessageTemplate` if set, else a hardcoded fallback. Builds `https://wa.me/{phone}?text={encoded message}` client-side and opens it in a new tab. No backend call, no order record.

**2. External Purchase** ("Dynamic Button")
```
Customer clicks Buy on Amazon / Buy on Flipkart / custom link
    ↓
Redirects externally (product.buttonLink)
```
Renders only if both `buttonText` and `buttonLink` are set on the product. Fully generic — the CTA copy and destination are admin-configured strings, not Amazon/Flipkart-specific fields.

Both flows are **stateless redirects**: no cart, no order, no payment, nothing persisted.

### 1.4 Admin CMS
`frontend/app/admin/products/[id]/page.tsx` is a single form editing every Product field directly, including "Dynamic Button" and "WhatsApp Settings" sections. The admin dashboard (`frontend/app/admin/page.tsx`) lists products alongside unrelated CMS resources (offers, testimonials, FAQs, etc.) — it is a general content CMS today, with no order-management surface.

### 1.5 What does **not** exist today, and is not being added
- No `User`/customer model or customer auth — and this document does not add one.
- No `Cart`, `Order`, `Payment`, `Coupon` collections.
- No payment gateway integration, no webhook endpoints.
- No customer login, registration, dashboard, profile, order history, order tracking, wishlist, saved addresses, or loyalty/reward-points system.

---

## 2. Explicitly Out of Scope

Per business direction, the following are **not** part of this architecture and must not be recommended or designed for, now or as an implicit side effect of Direct Checkout:

- Customer Login / Registration
- Customer Dashboard / Profile / Account
- My Orders / Order History / Track Order
- Wishlist
- Loyalty System / Reward Points
- Saved Addresses

Direct Checkout is a **guest-only, single-pass** flow: browse → cart → checkout → pay → thank-you page. Nothing is persisted for the customer beyond the order record itself, and the customer has no way to log back in and view it.

Coupons are **future scope only** — not designed or built now, mentioned in §4.2 purely as a placeholder for later.

---

## 3. Customer Flow

Customer browses products, then chooses one of three independent options on the product page:

```
Product Page
   ├── Option 1: WhatsApp                (existing, unchanged)
   ├── Option 2: External Marketplace    (existing, unchanged)
   └── Option 3: Buy Directly            (NEW)
```

### Option 3 — Buy Directly
```
Buy Directly
    ↓
Cart
    ↓
Checkout (collects contact + shipping details only, see §5.1)
    ↓
Payment Gateway
    ↓
Payment Success
    ↓
Thank You Page
```
No customer account is created at any point. The cart is client-side (browser state) until the customer proceeds to checkout; only a completed order is ever written to the database (see §6.3).

---

## 4. Design Principle: Non-Interference

The two existing CTAs are presentation-layer branches with no shared state. Direct Checkout keeps that property: it gets its own product field, its own component, its own API namespace, and its own admin section. `ProductDetails` renders up to three independent CTA blocks based on independent conditions:

```
{product.directCheckoutEnabled && <BuyNowButton .../>}        // NEW — Option 3
<WhatsAppButton .../>                                          // existing, unchanged
{product.buttonText && product.buttonLink && <DynamicButton/>} // existing, unchanged
```

No existing prop, condition, or handler is modified — only a new sibling branch is added.

---

## 5. Checkout Design

### 5.1 Checkout Fields (exact set — nothing more)
Checkout collects **only**:
- Full Name
- Mobile Number
- Email (optional)
- Address Line
- City
- State
- PIN Code

No account is created from this data — it is captured once, embedded directly on the `Order` document, and used only for fulfilling that one order.

### 5.2 Cart
The cart remains **client-side** (Zustand/Context + `localStorage` or component state) for the entire browsing session. Nothing about the cart is written to the database until the customer submits checkout — at that point the cart contents become the `items` on a newly created `Order`. There is no server-side `Cart` collection; this keeps the database to a single new collection (§6).

### 5.3 Product Page Coexistence
```
[ Buy Directly — ₹price ]        ← new, only if directCheckoutEnabled
[ Contact via WhatsApp ]         ← existing, unchanged
[ Buy on Amazon ]                ← existing "Dynamic Button", unchanged
```
Each CTA is gated by its own independent condition, so any combination is possible per product exactly as the admin configures it:

| WhatsApp | External Link | Direct Checkout |
|---|---|---|
| ✓ | | |
| | ✓ | |
| | | ✓ |
| ✓ | | ✓ |
| | ✓ | ✓ |
| ✓ | ✓ | |
| ✓ | ✓ | ✓ |

---

## 6. Database Design

### 6.1 Product model changes (additive only, optional field)
```ts
directCheckoutEnabled?: boolean   // default false — admin opt-in per product
```
This is the only new field required on `Product`. No existing field is renamed, retyped, or removed. Existing documents without this field behave exactly as today (undefined → falsy → no new button renders). No migration script is required.

The existing WhatsApp fields (`whatsappPhoneNumber`, `whatsappMessageTemplate`) and External Link fields (`buttonText`, `buttonLink`) are **not changed** — a product's WhatsApp/External options are already effectively "enabled" by those fields being populated, exactly as today.

### 6.2 New collection: `Order` (the only new collection)
```
_id, orderNumber (human-readable, e.g. AUR-2026-000123),
customer: { name, phone, email },
shippingAddress: { addressLine, city, state, pincode },
items: [{ productId, name, price, qty }],
totalAmount, currency,
paymentMethod, paymentStatus: enum [pending, paid, failed],
status: enum [New, Confirmed, Processing, Shipped, Delivered, Cancelled],
createdAt, updatedAt
```
`Order.items[].productId` references the existing `Product` collection by `_id` — read-only reference; Direct Checkout consumes the existing Product model as-is and never writes to it.

Only **completed** orders (i.e. an order actually placed by a customer through checkout) are stored. Abandoned carts are not persisted anywhere — they simply live in browser state and disappear if the customer leaves.

### 6.3 Collections explicitly NOT introduced
- No `Customer`/`Account`/`User` collection.
- No server-side `Cart` collection.
- No `Wishlist` collection.
- No `Coupon` collection (future scope only, not built now).

This keeps the database surface to **one new collection** (`Order`), plus one new optional field on `Product`.

### 6.4 Non-breaking guarantee
- Existing `Product`, `Settings`, `Offer`, etc. collections are untouched in structure.
- `Order` is net-new; nothing reads from or migrates old data into it.
- Existing product documents missing `directCheckoutEnabled` continue to serialize and render identically.

---

## 7. Admin Experience

### 7.1 Enabling Direct Checkout per product
Add one new checkbox to the **existing** product edit form (`frontend/app/admin/products/[id]/page.tsx`), inserted alongside — not replacing — the current "Dynamic Button" and "WhatsApp Settings" sections:
```
[ ] Enable Direct Checkout on Auraava
```
The existing WhatsApp and Dynamic Button sections keep their current markup, state, and submit payload keys untouched; the new field is simply an extra key merged into the same `PUT` body.

### 7.2 New Orders module (additive, separate routes)
- `/admin/orders` — list of orders with status filter.
- `/admin/orders/[id]` — order detail view.

Each order displays:
- Order ID
- Customer Name
- Phone Number
- Email
- Shipping Address
- Ordered Products
- Quantity
- Total Amount
- Payment Status
- Payment Method
- Created Date
- Current Status

Admin can update **status only**, and only to one of: `New`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`. Nothing more — no editing of order contents, amounts, or customer details, and no additional status values.

These are new pages; they don't touch the existing `/admin` dashboard cards for Products/Offers/Testimonials/etc. (an optional new "Orders" card summarizing count-by-status could be added to that dashboard).

---

## 8. Order Status Model

Two independent fields on `Order`, kept intentionally simple:

- **`paymentStatus`** — system-managed: `pending → paid` (set by verified payment webhook) or `pending → failed`. Not directly editable by admin.
- **`status`** — admin-managed fulfillment stage, one of exactly: `New → Confirmed → Processing → Shipped → Delivered`, with `Cancelled` reachable from any non-terminal state. An order is created with `status: New` once payment succeeds.

No `refunded`, `packed`, or other intermediate states are introduced — the six values above are the complete set.

---

## 9. Payment Gateway Recommendation

**Recommendation: Razorpay** (unchanged from prior analysis).

Reasons: (1) mature Node.js/Express integration with well-documented webhook signature verification (`razorpay` npm package + HMAC via `crypto`), which directly supports the security requirements in §11; (2) supports UPI, cards, netbanking, wallets out of the box, matching the Indian D2C customer base implied by the existing WhatsApp-first flow; (3) strong documentation reduces first-time integration risk; (4) can start with Orders API + hosted Checkout.js for v1.

- **Webhook verification**: every payment event verified via HMAC-SHA256 signature before any DB write.
- **Signature verification**: reject and log on mismatch — no order-status change on unverified events.
- **Payment security**: order `paymentStatus` only ever transitions to `paid` from a verified webhook, never from a client-side redirect alone.

---

## 10. Required Changes Inventory

### 10.1 Backend
- New model: `Order` (only new model).
- New routes: `backend/routes/orders.ts` (create + fetch), `backend/routes/checkout.ts` (init payment), `backend/routes/payments/webhook.ts`.
- New lib modules: `backend/lib/orders.ts`, `backend/lib/payments.ts` (Razorpay wrapper), `backend/lib/order-number.ts`.
- New middleware: raw-body capture scoped to the webhook route only (Razorpay signature verification needs the raw payload, not `express.json()`-parsed body).
- `Product` model: add 1 optional field (`directCheckoutEnabled`) — additive edit, not a rewrite.

### 10.2 Frontend
- New pages: `/cart`, `/checkout`, `/order-confirmation/[orderId]` (Thank You page), `/admin/orders`, `/admin/orders/[id]`.
- New components: `BuyNowButton`, `CartDrawer`/`CartPage`, `CheckoutForm`, `OrderSummary`, `OrderStatusBadge`.
- Additive edit to `ProductDetails` (new conditional CTA block) and to the admin product form (new "Direct Checkout" checkbox).
- New client-side cart state (Zustand or Context), persisted to `localStorage` — no server persistence.

### 10.3 APIs (new, namespaced separately from `/api/products`)
- `POST /api/orders` — create order from cart + checkout details.
- `GET /api/orders/:id` — order status lookup (customer-facing, for the Thank You page only).
- `POST /api/checkout/razorpay/init` — create Razorpay order, return details for Checkout.js.
- `POST /api/webhooks/razorpay` — signature-verified webhook, updates `paymentStatus`, idempotent.
- `GET /api/admin/orders`, `PATCH /api/admin/orders/:id/status` — admin-only, behind existing `requireAdmin`.

### 10.4 Middleware
- Reuse existing `requireAdmin` for all admin order routes — no new auth pattern.
- New: webhook signature-verification middleware (Razorpay HMAC-SHA256 of raw body against `X-Razorpay-Signature`).
- New: raw-body parser scoped only to the webhook path.

---

## 11. Security

- **Signature verification**: every webhook call verified via HMAC-SHA256 using the Razorpay webhook secret before any DB write; reject and log on mismatch.
- **Payment verification**: `paymentStatus` transitions to `paid` only from the verified webhook, never from a client-side redirect alone.
- **Idempotency**: webhook handler idempotent (keyed on the gateway payment ID), since gateways retry delivery.
- **Order validation**: recompute `totalAmount` server-side from `Product.price` at order-creation time — never trust client-submitted prices.
- **Fraud/abuse basics**: rate-limit `/api/checkout/*` and `/api/orders`; validate phone/PIN code formats server-side.
- **Secrets**: gateway key/secret via env vars, following the existing `JWT_SECRET`/`ADMIN_PASSWORD` pattern in `backend/lib/auth.ts`.

---

## 12. Implementation Plan

Implementation proceeds in the following order:

**Phase 1 — Order Model**
Define the `Order` schema (§6.2) and Mongoose model. No routes yet.

**Phase 2 — Cart**
Client-side cart store (Zustand/Context + `localStorage`), `/cart` page. No backend involvement.

**Phase 3 — Checkout**
`/checkout` page collecting exactly the fields in §5.1; client-side validation only at this stage.

**Phase 4 — Payment Gateway**
Razorpay order creation (`/api/checkout/razorpay/init`), Checkout.js integration, webhook route + signature verification.

**Phase 5 — Order APIs**
`POST /api/orders`, `GET /api/orders/:id`, wiring checkout submission to order creation and payment confirmation to `paymentStatus: paid`.

**Phase 6 — Admin Orders**
`/admin/orders`, `/admin/orders/[id]`, status-update endpoint restricted to the six allowed values (§8).

**Phase 7 — Frontend Integration**
Add `directCheckoutEnabled` field to Product model + admin form; add `BuyNowButton` to `ProductDetails` as a new conditional branch alongside the existing WhatsApp and External Link CTAs.

**Phase 8 — Testing**
End-to-end test of the full Buy Directly flow (cart → checkout → payment → thank-you → admin order visibility), plus regression check that WhatsApp and External Marketplace flows are visually and functionally unaffected.

---

## 13. Migration Strategy

No migration of existing data is required — every change is additive (one new collection, one new optional Product field). Deploying is safe at any time independent of the feature going live; the feature is fully gated behind `directCheckoutEnabled` defaulting to `false`/absent, so existing products are unaffected until an admin explicitly opts a product in.

---

## 14. Risk Analysis

| Risk | Mitigation |
|---|---|
| Webhook route accidentally parsed by global `express.json()` before signature check | Mount raw-body parsing for that route explicitly before the global JSON middleware (§10.4) |
| Client-trusted price/amount tampering | Always recompute `totalAmount` server-side from `Product.price` (§11) |
| New "Buy Directly" button visually competing with the existing WhatsApp CTA | Product/design decision on ordering and visual hierarchy (§4), not a technical risk |
| Scope creep into customer accounts, order history, or loyalty features | Explicitly out of scope (§2) — guest checkout only, no exceptions |
| Scope creep into a server-side cart or coupon system | Explicitly deferred — cart stays client-only (§5.2), coupons are future scope only (§2, §6.3) |

---

## Summary

The existing WhatsApp and External Marketplace flows are simple, stateless, client-side redirects with zero shared backend state, and remain **completely unchanged** by this proposal. Direct Checkout is added as a single, additive vertical slice: one new optional Product field, one new `Order` collection, new routes, new pages, and one new conditional UI branch in `ProductDetails`. The scope is deliberately narrow — guest checkout only, no customer accounts, no order history, no wishlist, no loyalty system, no server-side cart, no coupons beyond a future placeholder. Nothing proposed here requires modifying `whatsappPhoneNumber`, `whatsappMessageTemplate`, `buttonText`, `buttonLink`, or their existing handlers/routes.

No code has been written or modified as part of this document. Awaiting approval before implementation begins.
