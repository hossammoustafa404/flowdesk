# Landing Page Overrides

> **PROJECT:** Flowdesk
> **Page Type:** Landing / Marketing

> Rules in this file **override** the Master file. For all other rules, refer to MASTER.md.

---

## Page Pattern

**Primary:** Product Demo + Features (product-led storytelling)
**Secondary cues:** Hero-Centric Design (product UI dominates first viewport)

### Section Order

1. Sticky nav (Product, Workflow, Roles, FAQ) + Sign in + Create organization
2. Hero — brand, one headline, one sentence, CTAs, full-bleed jobs board mockup
3. Problem — concrete office/field pain (intake gaps, ownership, status fog, notify gaps, owner blind spot)
4. Workflow — intake → assign → field status → notify → owner view
5. Showcase — alternating product UI stories (board, assign, tech ladder, owner metrics, notify hygiene)
6. Roles — Owner / Dispatcher / Technician (what each sees)
7. FAQ — objections grounded in product rules (no fake proof)
8. Final CTA — Sign-up creates Organization + Owner
9. Footer

### Explicit Omissions

- No pricing (not defined in product docs)
- No fabricated customers, testimonials, stats, integrations, or certifications
- No generic feature-card grid as the primary story

### CTA Labels

- Primary: **Create your organization** → `/sign-up`
- Secondary: **See how it works** → `#workflow`
- Nav: **Sign in** → `/sign-in`

### Visual Direction

- Navy primary + orange urgency accent (status/emergency only; not decorative)
- Spacious density; product chrome may use soft elevation; marketing surfaces stay flat and typographic
- Poppins headings / Open Sans body via `next/font`
- CSS scroll reveals; honor `prefers-reduced-motion`
- Lucide icons (repo standard), not Phosphor

### Content Density Override

Master density dial was spacious for marketing; **product mockups** may use denser internal spacing to read as real UI.
