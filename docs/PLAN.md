# Project plan — accounting & tax practice website

Marketing website for an Australian (NSW) accounting / tax practice, with a CMS so
the owner can edit content without a developer. Deployed on Vercel.

Content direction comes from two reference sites — see [content-brief.md](content-brief.md).

## 1. Open questions (need answers before build)

| #   | Question                                                                                                | Why it matters                                                              |
| --- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Business name, logo, brand colours                                                                      | Design tokens, metadata, domain                                             |
| 2   | Is this a rebuild of one of the two reference sites, or a new firm inspired by them?                    | Decides whether existing copy can be reused or everything must be rewritten |
| 3   | Real details: address, phone, email, opening hours, ABN, tax agent number, memberships (CPA / IPA / CA) | Footer, contact page, compliance                                            |
| 4   | Service list and whether to publish prices                                                              | Services + Pricing pages                                                    |
| 5   | Who edits the site after launch, and how technical are they?                                            | Confirms the CMS choice                                                     |
| 6   | Online booking needed (Calendly / Cal.com), or contact form only?                                       | Phase 3 scope                                                               |
| 7   | Domain name and where DNS is managed                                                                    | Launch                                                                      |
| 8   | Any second language needed (e.g. Bangla, Chinese)?                                                      | i18n must be planned up front                                               |

## 2. Recommended stack

| Layer           | Choice                                                      | Reason                                                                                 |
| --------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Framework       | **Next.js (App Router) + TypeScript**                       | First-class on Vercel, static/ISR pages, great SEO                                     |
| Styling         | **Tailwind CSS + shadcn/ui**                                | Fast to build, accessible primitives                                                   |
| CMS             | **Payload CMS** (open source, admin at `/admin`)            | Runs inside the same Next.js app — no second service, no licence fee; you own the data |
| Database        | **Neon Postgres** (free plan)                               | Serverless Postgres, works well with Vercel; connection URL to be supplied             |
| Media storage   | **Vercel Blob** (free allowance)                            | Vercel has no persistent disk, so uploads need object storage                          |
| Forms           | Server Action + **Zod** validation + **Resend** (free plan) | Enquiry is saved to the database and emailed to the firm                               |
| Spam protection | **Cloudflare Turnstile** (free) + honeypot                  | Contact forms on tax sites attract spam                                                |
| Analytics       | Vercel Analytics + Speed Insights (free allowance)          | Zero config                                                                            |
| Hosting         | **Vercel Hobby**                                            | Preview deployments per branch                                                         |
| CI              | **GitHub Actions** (free minutes)                           | Runs the test suite on every push                                                      |
| Package manager | npm (already installed; pnpm is not)                        | No extra setup                                                                         |

Everything above has a free tier or is open source. Total running cost: **$0**, plus
the domain name.

### Free-tier limits to design around

Check each provider's pricing page at build time — limits change.

- **Neon free** — small storage quota and the database sleeps when idle, so the first
  request after a quiet period is slow. Mitigation: public pages are statically
  generated and revalidated on publish, so visitors never wait on the database. Only
  `/admin` and form submissions hit it live.
- **Neon connections** — use the **pooled** connection string for the app and the
  direct one for migrations.
- **Vercel functions** — request bodies are capped at a few MB, so media uploads go
  browser → Blob directly (client uploads), and images are compressed before upload.
- **Resend free** — daily/monthly send cap and one sending domain. Fine for enquiries.
  Because enquiries are also saved in the database, nothing is lost if an email fails.
- **Vercel Hobby** — its terms restrict it to personal, non-commercial use. It works
  technically, but a live business site is expected to be on Pro. Free-tier
  alternatives that allow commercial use exist (e.g. Cloudflare, Netlify) if this
  becomes a problem — decide before launch.

### Alternatives considered

- **Sanity** — does have a free plan, but content lives on their service with usage
  quotas. Not chosen: we want everything in our own Neon database.
- **WordPress (headless)** — separate PHP hosting, plugin/security upkeep.
- **Strapi** — needs an always-on server; doesn't fit Vercel.
- **Markdown/MDX in the repo** — cheapest, but the owner can't edit without Git.

There is no separate backend to build: Payload provides the admin UI, auth and data
API inside the Next.js app; Server Actions handle the contact form.

## 3. Site map

| Route                              | Purpose                                                                         | Idea source                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `/`                                | Hero, 3 service pillars, about teaser, services grid, why-us, testimonials, CTA | Tax Solutions NSW home                                          |
| `/about`                           | Firm story, principal's credentials, memberships, why choose us                 | Both                                                            |
| `/services`                        | Overview grid of all services                                                   | Both                                                            |
| `/services/[slug]`                 | One page per service with inclusions list + FAQ (good for SEO)                  | Tax Solutions NSW services                                      |
| `/pricing`                         | "From $X" guide prices, free quote / free first consult                         | Intax prices                                                    |
| `/resources` + `/resources/[slug]` | Articles: tax tips, key dates, checklists                                       | Tax Solutions NSW resources (theirs is a stub — do it properly) |
| `/contact`                         | Form, map, address, phones, hours (incl. tax-season hours), parking, FAQ        | Both                                                            |
| `/privacy`, `/terms`               | Legal                                                                           | Required when collecting enquiries                              |
| `/admin`                           | Payload admin panel (editors only, login required)                              | —                                                               |

Global: sticky header with phone number + "Book a consultation" button; footer with
contact details, hours, memberships, and the Professional Standards Legislation line.

## 4. CMS content model (Payload)

| Slug            | Kind              | Key fields                                                                                                                           |
| --------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `site-settings` | global            | name, logo, phones, email, address, geo, opening hours (incl. seasonal), socials, tax agent no., ABN, footer disclaimer, default SEO |
| `home-page`     | global            | hero, pillars, about teaser, featured services, CTA                                                                                  |
| `about-page`    | global            | story (rich text), credentials, memberships, why-us points                                                                           |
| `services`      | collection        | title, slug, category, summary, icon, body, inclusions[], who it's for, FAQs[], SEO                                                  |
| `pricing-items` | collection        | label, from-price, note, order                                                                                                       |
| `testimonials`  | collection        | quote, name, role, rating                                                                                                            |
| `faqs`          | collection        | question, answer, category                                                                                                           |
| `posts`         | collection        | title, slug, excerpt, cover, body, publishedAt, SEO; drafts enabled                                                                  |
| `legal-pages`   | collection        | title, slug, body                                                                                                                    |
| `media`         | upload collection | file, alt text (required), stored in Vercel Blob                                                                                     |
| `enquiries`     | collection        | name, email, phone, service, message, status; admin-read only, no public read                                                        |
| `users`         | auth collection   | email, role (admin / editor)                                                                                                         |

Public read access on content collections; everything else requires login. Enquiries
contain personal data: admin-only, covered by the privacy policy, with a retention
rule (e.g. delete after 12 months).

## 5. Phases

**Phase 0 — Setup (1 day)**

- `git init`, GitHub repo, scaffold with `create-payload-app` (Next.js + Postgres template), Tailwind
- shadcn/ui, Prettier, base layout, fonts, design tokens (section 9)
- Test tooling and CI pipeline wired up from day one (section 8)
- Connect repo to Vercel; first preview deployment

**Phase 1 — CMS (1–2 days)**

- Point Payload at Neon (pooled URL for the app, direct URL for migrations)
- Collections and globals from section 4, access control, admin/editor roles
- Vercel Blob storage adapter for `media` with client uploads
- `afterChange` hooks that revalidate cache tags so published edits appear immediately
- Generated types (`payload generate:types`), committed migrations
- Seed script with content from the content brief

**Phase 2 — Pages (2–3 days)**

- Header / footer / mobile nav
- Home, About, Services (+ detail), Pricing, Resources (+ detail), Contact, legal pages
- Reusable sections: Hero, ServiceCard, PricingTable, FAQ accordion, Testimonials, CTA band

**Phase 3 — Forms & integrations (1 day)**

- Contact form: Server Action → Zod → save to `enquiries` → Resend email; honeypot + Turnstile; success + error states
- Google Map embed, click-to-call links, optional booking embed

**Phase 4 — SEO & quality (1 day)**

- Metadata per page, Open Graph images, `sitemap.ts`, `robots.ts`
- JSON-LD: `AccountingService` (LocalBusiness) + `FAQPage`
- Accessibility pass (WCAG 2.2 AA), Lighthouse 95+, mobile check

**Phase 5 — Launch (½ day)**

- Production env vars in Vercel, custom domain + DNS
- Resend domain verification (SPF/DKIM) so emails don't land in spam
- Google Business Profile + Search Console
- Short editor guide for the owner

Rough total: **8–10 working days** for one developer, including tests and UI polish.

## 6. Environment variables

```
DATABASE_URL=            # Neon pooled connection string
DATABASE_URL_UNPOOLED=   # Neon direct connection string (migrations)
PAYLOAD_SECRET=
BLOB_READ_WRITE_TOKEN=
RESEND_API_KEY=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

Keep real values in `.env.local` (git-ignored) and in Vercel project settings. Never
paste the Neon URL into a committed file. Use a separate Neon **branch** for
development/tests so they never touch production data.

## 7. Compliance checklist (Australian tax practice)

Confirm each with the client — these are prompts, not legal advice.

- [ ] Registered tax agent number shown (footer)
- [ ] "Liability limited by a scheme approved under Professional Standards Legislation" — only if the firm is actually in such a scheme
- [ ] Memberships/logos (CPA, IPA, CA ANZ) only where held and permitted
- [ ] No guaranteed-refund or misleading claims (TPB Code of Professional Conduct)
- [ ] Prices labelled as guides ("from", GST status stated)
- [ ] Testimonials are real and approved by the person quoted
- [ ] Privacy policy covers the contact form (Australian Privacy Principles)
- [ ] Articles carry a "general information only, not advice" note

## 8. Testing strategy

All tools are free and open source. Tests are written alongside each feature, not at the end.

| Layer         | Tool                                                          | What it covers                                                                                                  |
| ------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Static        | TypeScript strict, ESLint, Prettier                           | Type errors, code quality, formatting                                                                           |
| Unit          | **Vitest**                                                    | Zod schemas, formatters (phone, price, hours), SEO/JSON-LD builders, access-control functions                   |
| Component     | **Vitest + React Testing Library**                            | Sections render given CMS data, empty states, form validation messages, accordion/nav behaviour                 |
| Integration   | **Vitest + Payload Local API** on a Neon test branch          | Collections save/read, access rules (public can't read enquiries), contact action saves + sends (Resend mocked) |
| End-to-end    | **Playwright** (Chromium, Firefox, WebKit + mobile viewports) | Every page loads, navigation, contact form happy path and errors, admin login → edit → change appears on site   |
| Accessibility | **@axe-core/playwright**                                      | Zero serious/critical violations on every page; keyboard-only walkthrough                                       |
| Visual        | Playwright screenshots                                        | Key pages at mobile and desktop, light theme (and dark if added)                                                |
| Performance   | **Lighthouse CI**                                             | Budgets: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95                                    |
| Links / SEO   | Playwright crawl                                              | No broken internal links, one `h1`, title + description on every page                                           |

**CI (GitHub Actions)** on every pull request: lint → typecheck → unit/component →
build → Playwright against the build → axe → Lighthouse CI. Merge is blocked on failure.

**Definition of done for any feature:** tests for it exist and pass, checked in a real
browser at 375px and 1440px, keyboard-accessible, no axe violations, no console errors.

**Manual before launch:** real iPhone and Android check, real email delivery test,
editor walkthrough with the owner.

## 9. UI/UX standards

**Design direction:** calm, trustworthy, professional — generous whitespace, strong
typography, one confident accent colour. No stock-photo clichés, no template look.
A short design exploration (2–3 home-page directions) happens before pages are built.

**Design system**

- Tokens for colour, type scale, spacing, radius and shadow defined once (Tailwind theme / CSS variables)
- Fluid type scale; body text ≥ 16px; line length 60–75 characters
- 8-point spacing grid; consistent section rhythm
- Colour contrast ≥ 4.5:1 for text (WCAG 2.2 AA)
- One icon set (Lucide); real photos of the office/team where possible

**Interaction**

- Mobile-first; sticky header with click-to-call and a persistent "Book a consultation" action
- Touch targets ≥ 44px; visible focus rings; skip-to-content link
- Every interactive element has hover, focus, active and disabled states
- Forms: labels always visible, inline validation on blur, clear error text, loading and success states, input never lost on error
- Subtle motion only (150–250ms), and it respects `prefers-reduced-motion`
- Designed empty, loading and error states; custom 404

**Performance as UX**

- Static pages, `next/image` with correct sizes, `next/font` (no layout shift)
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms on mobile
- Minimal client JavaScript — Server Components by default

**Conversion**

- Each page answers: what do you do, is it for me, what does it cost, how do I start
- Trust signals near calls to action: credentials, memberships, reviews
- Phone, address and hours reachable within one tap from anywhere
