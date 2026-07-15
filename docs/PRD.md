# Auraava — Product Requirements Document (PRD)

**Status**: Reverse-engineered from the current built system (as of 2026-07-06). This document describes what the product *is today*, then lists the gaps that need product decisions before Auraava can be called a transactional e-commerce platform.

---

## 1. Product Summary

Auraava is a skincare/haircare brand website consisting of:
- A **public marketing + catalog site** (Next.js) where visitors browse products, blogs, hair-care tips, testimonials, offers, FAQs, and an Instagram feed.
- An **admin dashboard** (same Next.js app, gated at `/admin`) where a single admin account manages all site content.
- A **backend API** (Express + MongoDB) serving both.

**Current business model**: This is a **lead-generation catalog, not a checkout-based store**. There is no cart, no payment processor, and no order system. Every "buy" action is a WhatsApp deep link (`wa.me/...`) that pre-fills an inquiry message with the product name and price, handing the sale off to a human over WhatsApp. Product decisions in this PRD should treat that as the current source of truth for how revenue is actually captured today, not an oversight.

---

## 2. Users & Roles

| Role | Description | Access |
|---|---|---|
| **Site Visitor** | Anyone browsing the public site | Read-only access to all public pages/content |
| **Admin** | Single hardcoded operator account (no multi-user support, no roles/permissions tiers) | Full CRUD over all content via `/admin/*`, gated by username/password login |

There is currently no concept of a registered customer/account, no multi-admin support, and no role separation (e.g. editor vs. super-admin) — one admin identity controls everything.

---

## 3. Current Feature Set (as built)

### 3.1 Public site

| Feature | Page(s) | Description |
|---|---|---|
| Home | `/` | Hero carousel, special offers, best-seller product carousel, categories, hair-care tips teaser, testimonials, Instagram gallery, FAQs, stats counter |
| Product catalog | `/products` | Full product listing with client-side category filter (oils/shampoos/serums/sprays) |
| Product detail | `/products/[id]` | Gallery, description, key benefits, WhatsApp "inquire to buy" CTA, cross-sell carousel |
| Blog | `/blog`, `/blog/[slug]` | Article listing and detail pages |
| Hair care tips | `/hair-care-tips` | Full list of tips (home page shows a teaser) |
| About Us | `/about-us` | Admin-editable content sections + Instagram gallery |
| FAQs | `/faqs` | Standalone accordion page |
| SEO | sitewide | Metadata, OpenGraph, JSON-LD Organization schema, sitemap, robots.txt |

**Known gap**: the "Latest from our Blog" component exists and works but is not placed on any page, and the footer has no link to `/blog` — the blog is effectively undiscoverable from the site's navigation today.

### 3.2 Admin dashboard (`/admin/*`)

Single dashboard page lists and manages: Products, Special Offers, Testimonials, FAQs, Hair Care Tips, Instagram Posts, About Us, and links to a Statistics page. Content is created/edited/deleted per section, with image upload support (local disk storage).

**CRUD completeness gaps** (product decision needed on whether to fix or accept):
- **Testimonials**: no edit capability — must delete and recreate to fix a typo.
- **FAQs**: no edit capability, same limitation.
- **Blogs**: full create/edit pages exist but are **not linked from the admin dashboard at all** — an admin must know the URL to manage blog posts.
- **Skincare vs. Hair Care**: two parallel, near-duplicate admin sections manage what is the same backend resource — this looks like leftover duplication from a rebrand and needs a decision on which one is canonical.
- **Settings (WhatsApp number/message)**: backend supports editing this, but there is no admin UI for it — it must be changed by editing code/database directly.

### 3.3 "Purchase" mechanism

No cart or checkout. Every product and every offer links out to a WhatsApp chat pre-filled with a message template (configurable per-product or via a sitewide default). This is the entire transaction funnel today.

---

## 4. Content Model (what the admin can manage)

| Content type | Notes |
|---|---|
| Products | Name, category, descriptions, price, images, sizes, key benefits, best-seller flag, in-stock flag (boolean only — no quantity) |
| Blogs | Title, slug, excerpt, content, author (free text), category, image |
| Offers | Up to 3 promotional items with image, discount text, link |
| Testimonials | Author, text, rating |
| FAQs | Question/answer pairs |
| Hair Care / Skincare Tips | Title, description, image |
| Instagram Posts | Image + link, curated manually (no live Instagram API integration) |
| About Us | Ordered content sections with layout direction |
| Stats | Label + number pairs (e.g. "10,000+ customers") shown as a homepage counter |
| Settings | Sitewide WhatsApp number + message template |

There is intentionally no Customer, Order, Cart, Payment, or Inventory-quantity model in the current system.

---

## 5. Gaps Between Current State and a Full E-Commerce Product

If the product goal is (or becomes) a real transactional store, the following are **not present today** and represent net-new product scope, not bug fixes:

| Capability | Current state | What's needed |
|---|---|---|
| Cart | None | Cart model/state, add/remove/update-quantity UI, persistence (session or account-based) |
| Checkout | None | Address collection, shipping method/cost, order review/confirmation flow |
| Payments | None | Payment gateway integration (e.g. Razorpay/Stripe), refunds, payment status tracking |
| Orders | None | Order model, order history, admin order-management dashboard, order status lifecycle |
| Inventory | Boolean in-stock flag only | Quantity tracking, low-stock alerts, oversell prevention |
| Customer accounts | None (guest-only, admin-only login exists) | Registration/login, order history, saved addresses |
| Search | Category filter only | Full-text or faceted product search |
| Multi-admin / roles | Single hardcoded admin | User table, role-based permissions (editor/admin/etc.) |

**Recommendation for product owner**: decide explicitly whether Auraava is staying a WhatsApp-inquiry catalog (in which case the priority gaps are UX/content ones — blog discoverability, missing edit UIs, settings admin page) or moving to real checkout (in which case Cart/Order/Payment/Inventory is a substantial new build, detailed in the companion TRD).

---

## 6. Non-Functional Gaps Relevant to Product Risk

These are functionality-adjacent but affect product trust and should inform prioritization (full technical detail in the TRD):

- **No brute-force protection on admin login** — a determined attacker could attempt to guess the single admin password.
- **Content submitted via admin forms is not sanitized** before being rendered back to visitors on the homepage (offers section) — a compromised or malicious admin session could inject scripts that run in every visitor's browser.
- **Any user who discovers the API base URL can create/edit/delete any content directly**, bypassing the admin login entirely, because the backend does not check authentication on its data-mutating endpoints — only the admin UI *pages* are gated, not the API.
- **Uploaded images are never deleted** when their parent content is deleted — disk usage grows unbounded over time.

---

## 7. Out of Scope for This Document

Detailed technical architecture, API contracts, schema definitions, and specific engineering remediation steps are covered in the companion **[Technical Requirements Document (TRD)](./TRD.md)**.
