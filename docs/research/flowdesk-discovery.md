# Flowdesk — Product Discovery Record

**Status:** Business discovery locked; architecture grilling for CONTEXT/ADRs largely complete (ADRs 0001–0020)  
**Date:** 2026-09-23  
**Purpose:** Flagship portfolio project proving end-to-end product delivery (requirements → production-quality full stack). Not a startup validation exercise.

**Backlog:** [Epics & user stories (MVP)](../product/epics-and-user-stories.md)

**Target stack (intent):** Next.js, React, TypeScript, NestJS, PostgreSQL, Redis/BullMQ, Docker, CI/CD  
**Apps:** `server` (API) · `web` (org users) · `admin` (platform super-admin)

---

## 1. Business context

### Company (fictional first tenant)

| Item | Decision |
|------|----------|
| Working name | **NileFix** / **نايل فيكس** |
| Industry | Residential **HVAC & plumbing** |
| Geography | **Egypt** — Greater Cairo operating area |
| Size (assumed) | ~15–40 people; office + field technicians in vans |
| Languages | **Arabic + English** (product and operations) |
| Today’s tools | Phone, WhatsApp, Google Calendar, spreadsheets |

### What the business does

Homeowners call/text when HVAC or plumbing fails or needs service. The office takes the request, assigns a technician, the tech performs work on site, the customer is kept informed, and the owner needs end-of-day visibility into open vs done work.

### How work flows today (pre-Flowdesk)

1. Homeowner calls/texts the office  
2. Dispatcher captures address, problem, urgency, preferred window  
3. Dispatcher picks a tech (availability / area / skill — judgment)  
4. Dispatcher notifies the tech (WhatsApp/SMS)  
5. Tech does the work; reports done / needs parts / return visit  
6. Dispatcher updates the customer  
7. Owner only hears about problems or gets an end-of-day verbal check  

### Pain points Flowdesk must address

1. **Incomplete intake** — missing address, floor, phone, equipment hint; tech calls office mid-route  
2. **Unclear ownership / double assignment** — two people text two techs, or nobody owns the job  
3. **Status fog** — office doesn’t know en route / on site / waiting / done  
4. **Customer not updated** — work finished (or tech moving) but customer left waiting  
5. **Owner blind spot** — no single list of open vs overdue vs done today  

### Market framing (why this business)

Upwork / freelance demand clusters on **ops with assignment, status, and handoffs** (field service, dispatch, work orders)—not generic “manage customers.” Field-service / trades ops maps cleanly to the target stack and stays an MVP ops product if invoicing, inventory, GPS, and CRM pipelines stay out of scope.

---

## 2. Target users

### Organization roles (NileFix and other tenants)

| Role | Uses | Primary job |
|------|------|-------------|
| **Dispatcher** (office coordinator) | `web` | Intake, assign/reassign, monitor status, customer notify hygiene |
| **Technician** | `web` (responsive) | Own jobs: status ladder, complete or block |
| **Owner / manager** | `web` | Dashboard, overrides, users, org settings, archive customers |

### Platform role

| Role | Uses | Primary job |
|------|------|-------------|
| **Platform super-admin** | `admin` | List/suspend orgs (optional create for support); **not** required for org onboarding; **not** day-to-day dispatch |

### Explicit non-users (MVP)

- **No customer login / portal / app** — customers call/text; office enters data  
- Super-admin is **not** an org member and has **no god-mode dispatch** in MVP  
- Org onboarding is **public web Sign-up** (creates Organization + Owner), not Super-admin provisioning  

---

## 3. Core workflows

### In MVP

| Workflow | Purpose |
|----------|---------|
| Job intake | Capture a complete request before assign |
| Assign / reassign | Human dispatcher/owner picks tech |
| Tech status updates | En route → on site → completed / blocked |
| Customer (+ tech) notifications | Queued outbound messages on key events |
| Owner operational view | Open / overdue / blocked / done today |

### Out of MVP

- Quotes, invoices, payments  
- Inventory / van stock / parts catalog  
- Live GPS map / route optimization / auto-dispatch  
- Customer self-serve portal  
- Recurring maintenance contracts  
- Tech-to-tech assignment  
- Two-way WhatsApp inbox  
- Hard delete / GDPR purge UI  
- Native mobile apps  

---

## 4. User journeys (MVP happy paths)

### Dispatcher

1. Login → today’s jobs board  
2. New call → search customer by **phone** → create/select customer → create job (required intake) → `New`  
3. Assign tech (skill / area / workload hints) → `Assigned` → notifications queued  
4. Monitor; handle Blocked / reassign / cancel; resend or mark informed if notify failed  

### Technician

1. Login → **my jobs** for today  
2. `Assigned` → `En route` → `On site` → `Completed` (notes optional) **or** `Blocked` (reason required)  
3. Cannot see full org board; cannot assign others  

### Owner

1. **Sign-up** on `web` → creates Organization + becomes Owner (after Email verification)  
2. Login → dashboard: open / overdue / blocked / done today  
3. Drill into jobs; override powers when needed  
4. Invite/deactivate users; org settings; archive/unarchive customers  

### Platform super-admin

1. Login to **admin**  
2. List orgs; suspend org; optionally create an org for support/demo  
3. No day-to-day dispatch; not the primary path for first Owner  

---

## 5. Functional requirements (MVP)

### Tenancy

- Multi-company: each org has isolated users, customers, jobs  
- User belongs to **exactly one org** in MVP  
- **Public Sign-up** on `web` creates an Organization and makes the signer the Owner  
- Owner invites Dispatchers, Technicians, and additional Owners (Invitation)  
- Invitation accept succeeds only if that email has **no Organization yet** (one-org rule)  
- NileFix is the first seeded tenant (demo); seed is not the only way orgs appear  
- Platform super-admin is platform-scoped (not an org member); list/suspend orgs; create-org from admin is optional support, not required onboarding  

### Customers (thin — not CRM)

- Reusable customer record linked from jobs  
- Search by phone; inline create during intake if new  
- Fields: name, primary phone, optional secondary phone, address(es) — start with **one primary address**  
- Archive/unarchive (owner); archived hidden from default picker; **no new jobs**; history retained  
- **No hard delete** in MVP  

### Job intake — required

- Customer (linked)  
- Phone (on customer)  
- Service address (area/district + street/building; governorate if needed)  
- Problem summary (free text, AR/EN/mixed)  
- Service type: **HVAC** or **Plumbing** (coarse)  
- Urgency: **Emergency** / **Same day** / **Scheduled**  
- Preferred time window or **ASAP**  
- Created by (dispatcher/owner — system)  

### Job intake — optional

- Secondary / WhatsApp number if different  
- Landmark / building notes  
- Unit/equipment hint  
- Internal office-only notes  

### Job intake — not collected

- Full CRM/marketing fields  
- Required GPS pin at intake  
- Intake photo uploads  
- Appliance serial/model database  

### Assignment

- Manual assign only (no auto-dispatch)  
- Tech attributes: active/inactive; skills (HVAC / Plumbing / both); coverage area tags; today’s open job count  
- Hard-block **inactive** techs  
- **Warn** (don’t hard-block) on skill mismatch  
- No distance matrix / “best tech” algorithm  

### Status lifecycle

| Status | Meaning |
|--------|---------|
| `New` | Intake done; not assigned |
| `Assigned` | Tech owns it; not started travel |
| `En route` | Heading there |
| `On site` | Arrived / working |
| `Blocked` | Cannot finish; **reason required** |
| `Completed` | Work finished |
| `Cancelled` | Will not be done; **reason required** |

**Transitions (summary)**

- Dispatcher/owner: `New` → `Assigned`; reassign; cancel; override complete when needed  
- Technician: on **own** jobs only — `Assigned` → `En route` → `On site` → `Completed` or `Blocked`  
- Cannot Complete from `New` (must have been Assigned at least once)  

### Reassignment

- Allowed from `Assigned` / `En route` / `Blocked` (and as needed per dispatcher/owner)  
- New tech receives job at **`Assigned`**  
- Event history retained (previous tech visible in Job History)  

### Stuck tech (no peer assign)

- Technicians **cannot** assign to each other  
- Tech marks `Blocked` with reason (e.g. request reassignment / traffic)  
- Dispatcher/owner reassigns; customer notified on reassign  

### Deactivate technician (employee leaves)

- Owner deactivates → login blocked; row kept for history  
- Open jobs **not** auto-reassigned; flagged **needs reassignment**  
- Dispatcher/owner explicitly reassigns each job  
- Customer notified **only on reassign**, not on deactivate alone  

### Notifications

**Customer notified on:** `Assigned`, `En route`, `On site`, `Completed`, `Cancelled`, and on **reassign** (new technician).  
**Blocked:** no auto customer ping (office handles).  

**Tech notified on:** assign, cancel (if was assigned), reassign (old + new).  

**Channel model**

- Provider abstraction; SMS/email (or WhatsApp sandbox/mock in dev) — not blocked on Meta WhatsApp Business approval to ship  
- BullMQ workers; retries with backoff  
- Records: `pending` → `sent` / `failed`  
- Dispatcher/owner: **resend** or **mark customer informed manually**  
- Idempotency key per `jobId + eventType + occurrenceId`; retries must not double-send; human resend = new occurrence  

**Assign + notify reliability**

- Assignment persist + notification **outbox rows** in **one DB transaction**  
- Worker reads outbox; assign can show success with notify `pending`  
- Failed/pending notifies visible for attention  

### Owner metrics (`Africa/Cairo`)

| Bucket | Definition |
|--------|------------|
| **Open** | `New`, `Assigned`, `En route`, `On site`, `Blocked` |
| **Done today** | `Completed` with `completed_at` today (Cairo) |
| **Cancelled** | Separate; not open, not done |
| **Overdue** | Preferred window end passed while still Open; **or** ASAP/Emergency with no window → overdue **2 hours after created** if still `New` or `Assigned`; future-scheduled windows not overdue yet |
| **Blocked** | Still Open; show distinct count |

### Concurrency

- Optimistic concurrency (version / token); stale write → conflict, UI reload  
- **Completed** only if actor is **current assignee** (or owner/dispatcher override), status allowed, not `Cancelled`  
- Late Complete after reassign → **rejected**  
- No naive “Completed always wins”  

### Bilingual

- UI: user switch **AR | EN**; RTL when AR selected  
- User content: single free-text fields (mixed OK)  
- Notifications: per-customer preferred language; default **org default** (NileFix → AR)  
- Enums stored as stable English codes; UI labels translated  
- One display name as typed; no MT of notes in MVP  

---

## 6. Business rules (condensed)

1. Jobs require a linked customer; phone search drives reuse.  
2. Required intake fields must be present before meaningful assign.  
3. Only active techs can be assigned; skill mismatch warns.  
4. Status machine is enforced server-side.  
5. Blocked/Cancelled require reasons.  
6. Reassign resets operational status to `Assigned` for new tech; history kept.  
7. No tech-to-tech assign; use Blocked → dispatcher reassign.  
8. Deactivate ≠ delete; open jobs need human reassign.  
9. Archive customer ≠ delete; no new jobs; history kept.  
10. Notifications are idempotent per occurrence; resend is explicit.  
11. Assign + outbox are atomic; notify delivery is async.  
12. Conflict on concurrent updates; completion tied to current assignee.  
13. Tenant isolation: no cross-org data access for org users.  
14. Super-admin does not operate tenant dispatch in MVP.  
15. Invitation accept requires the email has no Organization yet.  

---

## 7. Roles and permissions (MVP)

| Capability | Super-admin | Owner | Dispatcher | Technician |
|------------|:-----------:|:-----:|:----------:|:----------:|
| Public Sign-up → org + Owner | — | ✓ (self) | — | — |
| List/suspend orgs | ✓ | — | — | — |
| Create org from admin (optional) | ✓ | — | — | — |
| Cross-org job ops | — | — | — | — |
| Invite/deactivate users + set role | — | ✓ | — | — |
| Org settings (areas, default lang) | — | ✓ | — | — |
| Create/edit customers | — | ✓ | ✓ | — |
| Archive/unarchive customers | — | ✓ | — | — |
| Create jobs / intake | — | ✓ | ✓ | — |
| Assign/reassign/cancel | — | ✓ | ✓ | — |
| Status on **own** jobs | — | override* | override* | ✓ |
| View all org jobs | — | ✓ | ✓ | own only |
| Owner dashboard metrics | — | ✓ | ✓ (ops view OK) | — |
| Resend / mark informed | — | ✓ | ✓ | — |

\*Owner/dispatcher may override complete/cancel per status rules; they do not day-to-day walk the tech ladder.

---

## 8. MVP scope

- Multi-tenant orgs + platform admin app  
- Public Sign-up creates Organization + Owner; Owner invites other Org Roles  
- Auth + RBAC for four role types (3 org + 1 platform)  
- Thin customers + archive  
- Jobs: intake → assign → status → complete/block/cancel  
- Manual assignment with hints  
- Notifications via outbox + queue + idempotency  
- Owner open/overdue/blocked/done-today  
- AR/EN UI with RTL  
- Dockerized deploy + CI/CD appropriate to portfolio bar  
- Optimistic concurrency on job updates  

---

## 9. Non-MVP scope

- Invoicing, payments, Stripe  
- Inventory / parts  
- Live GPS, maps routing, auto-dispatch  
- Customer portal  
- Recurring contracts / service plans  
- Tech-to-tech assign or “suggest tech” confirmation flow  
- WhatsApp Business as hard dependency / two-way chat  
- Multi-org membership per user  
- Hard delete / anonymization workflows  
- Native iOS/Android apps  
- Full CRM pipeline, marketing, duplicate-merge tooling  
- Bulk “reassign all jobs to X”  
- Reporting warehouse / BI  

---

## 10. Important edge cases (locked)

| Case | Rule |
|------|------|
| Employee leaves with open jobs | Deactivate; flag needs reassignment; human reassign; notify on reassign only |
| Reassign mid-flight | New tech gets `Assigned`; history kept; customer notified |
| Customer archived | Hidden from intake; no new jobs; old jobs remain |
| Concurrent reassign vs complete | Version conflict; Complete only if still current assignee |
| Notify worker crash after assign | Outbox in same transaction; pending→retry idempotently |
| Duplicate notify on retry | Idempotency key; one customer-visible send per occurrence |
| Tech wants to hand off on WhatsApp | Reject peer assign; Blocked → dispatcher reassign |
| “Completed always wins” (rejected naive form) | Replaced by assignee + status + version rules |

---

## 11. Technical requirements (intent)

| Area | Direction |
|------|-----------|
| API | NestJS (`server`) |
| Web | Next.js + React + TypeScript (`web`) — all org roles |
| Admin | Next.js (`admin`) — platform super-admin only |
| DB | PostgreSQL |
| Jobs/queues | Redis + BullMQ (notifications, retries) |
| Auth | JWT (or equivalent); role + org claims |
| i18n | AR/EN + RTL |
| Timezone | `Africa/Cairo` for “today” / overdue |
| Deploy | Docker; CI/CD |
| Reliability | Transactional outbox; idempotent notification keys; optimistic locking on jobs |

**Implementation code and DB schema:** intentionally not designed in this document.

---

## 12. Architecture constraints

### Apps

| App | Audience | MVP responsibility |
|-----|----------|--------------------|
| `server` | — | Auth, tenancy, customers, jobs, notifications, queues |
| `web` | Dispatcher, technician, owner | All tenant day-to-day work (role-based UI) |
| `admin` | Platform super-admin | List/suspend orgs; optional create; not primary onboarding |

### Domain slice (**adopted**)

| Domain | Owns |
|--------|------|
| Identity & Access | Users, auth, Super Admin, Sessions, Sign-up, Invitations |
| Tenancy | Organizations, Org Roles, suspend, platform admin ops, skills, coverage areas, org defaults |
| Customers | Profiles, archive, phone search, addresses |
| Jobs | Lifecycle, assignment, Job Status, Job History, versioning |
| Notifications | Outbound Notifications, delivery state, idempotency, resend; Mark Informed |

**Rule:** Jobs enqueue Notifications; Notifications never invent Job Status changes.  
**Not separate MVP domains:** Billing, Inventory, Chat, Maps, CRM pipeline, analytics warehouse.
**Docs:** One root `CONTEXT.md` — no `CONTEXT-MAP.md` (see ADR 0005).

### Constraints

- Prefer simple modular NestJS over heavy DDD ceremony  
- Tenant isolation enforced in API and with DB constraints (ADR 0013, 0020)  
- Do not add features to “show Redis” — Redis exists because notifications/retries need a queue  
- WhatsApp is an adapter behind a provider interface, not the core domain  

### Still to grill (architecture)

- ~~API shape (REST resources, error format)~~ → ADR 0015  
- ~~Authorization enforcement patterns~~ → ADR 0016 (CASL from Org Role / Super Admin)  
- ~~Multi-tenancy DB strategy~~ → ADR 0013  
- ~~DB constraints & transactions beyond outbox~~ → ADR 0020 (FKs, unique phone/org, Job version; status machine in services)  
- ~~Audit log depth~~ → ADR 0014  
- ~~Pagination/filtering conventions~~ → ADR 0017  
- ~~Testing strategy~~ → ADR 0018  
- ~~Deployment topology~~ → ADR 0019  



---

## 13. Acceptance criteria (draft)

### Tenancy & admin

- Public Sign-up on `web` creates an Organization and Owner; org data is invisible to other orgs  
- Owner can invite users with Org Roles; invited Users join that Organization only  
- Invitation accept is rejected if the email already belongs to an Organization  
- Platform admin can list/suspend orgs (and optionally create one); suspended org Users cannot log into `web`  

### Intake & customers

- Dispatcher can find customer by phone or create inline and create a job with all required fields  
- Job cannot be treated as ready for field work without required intake  
- Archived customer cannot receive new jobs; historical jobs still openable by owner/dispatcher  

### Assignment & status

- Only active techs assignable; skill mismatch warns  
- Tech can only advance status on own jobs along allowed transitions  
- Blocked/Cancelled require reasons  
- Reassign lands at `Assigned` for new tech and records history  

### Notifications

- Customer receives messages for Assigned, En route, On site, Completed, Cancelled, Reassigned (per rules)  
- Retry does not duplicate; Resend creates a new occurrence  
- Failed notify visible; resend / mark informed works  

### Owner view

- Open / overdue / blocked / done-today match locked definitions in `Africa/Cairo`  

### Concurrency & leave

- Conflicting updates return conflict; late Complete after reassign fails  
- Deactivated tech cannot log in; open jobs flagged for reassignment  

### i18n

- User can switch AR/EN; Arabic UI is RTL  

---

## 14. Definition of done (portfolio MVP)

A slice is done when:

1. Matches locked workflows and rules above (not a generic CRUD demo)  
2. Covered by automated tests for critical domain rules (status transitions, tenancy isolation, notification idempotency, concurrency)  
3. Runs via Docker Compose (or equivalent) with documented setup  
4. CI runs lint/typecheck/tests on PR  
5. Seed data can demo NileFix (AR-default org) end-to-end  
6. README explains business context, roles, and how to run — not only tech stack  
7. No Non-MVP modules snuck in “because the stack supports it”  

---

## Decisions log (grilling)

| # | Topic | Outcome |
|---|--------|---------|
| 1 | Business type | Residential HVAC + plumbing (field service) |
| 2 | Locale | Egypt; AR + EN; NileFix |
| 3 | Roles | Dispatcher, Technician, Owner + Platform super-admin |
| 4 | Core flow | Adopt phone→intake→assign→field→notify→owner visibility |
| 5 | Pains | Five locked pain points |
| 6 | MVP cut | Intake, assign, status, notify, owner view — in; invoice/GPS/portal/contracts — out |
| 7 | Intake fields | Required/optional/out as locked |
| 8 | Statuses | 7 statuses + transition rules |
| 9 | Assignment | Manual + hints; hard-block inactive; warn skill |
| 10 | Notify | Customer also on En route & On site; provider abstraction |
| 11 | Overdue | Window / 2h emergency rule; Blocked counts as open |
| 12 | Tenancy | Multi-company; one org per user |
| 13 | Apps | server / web / admin (admin = platform only) |
| 14 | Customers | Thin reusable (B), not CRM |
| 15 | i18n | Switchable UI + RTL; single content fields; per-customer notify lang |
| 16 | Permissions | Matrix locked (updated: Sign-up creates org + Owner) |
| 16b | Org onboarding | Public Sign-up → Organization + Owner; Super Admin optional for create; Owner invites others |
| 16c | Invitation vs existing org | Accept only if email has no Organization yet |
| 16d | Field work unit | Job (not work order / service request / ticket) |
| 16e | Notification | Outbound Customer/tech message; Mark Informed is separate, not a Notification |
| 17 | Employee leaves | Deactivate + manual reassign |
| 18 | Peer assign ask | Rejected; Blocked → dispatcher |
| 19–20 | Concurrency | Version + current-assignee completion (not naive always-wins) |
| 21 | Double notify | Idempotency keys |
| 22 | Delete customer | Archive only |
| 23 | Partial failure | Transactional outbox |
| 24 | Journeys | Four journeys locked (Owner journey includes Sign-up) |
| 25 | Domains | Adopted: five modules + single CONTEXT.md (ADR 0005); Directory merged into Tenancy |
| 26 | ADR set | Kit ADRs deleted; Flowdesk ADRs 0001–0020 from locked decisions |
| 27 | Tenancy DB | Shared schema + `organization_id` (ADR 0013) |
| 28 | Audit | Job History only; no platform audit product (ADR 0014) |
| 29 | API | Resource REST JSON + code/message errors (ADR 0015) |
| 30 | Authorization | CASL from Org Role / Super Admin (ADR 0016) |
| 31 | Pagination | Offset/limit + query filters (ADR 0017) |
| 32 | Testing | Mandatory domain tests + NileFix E2E path (ADR 0018) |
| 33 | Deploy | Docker Compose local/demo + CI on PR (ADR 0019) |
| 34 | DB rules | Hard integrity in Postgres; soft rules in services (ADR 0020) |

---

## Next grilling topics

1. ~~Formally adopt or revise domain boundaries~~ → ADR 0005  
2. ~~API design conventions~~ → ADR 0015  
3. ~~Authorization & tenancy enforcement~~ → ADR 0016  
4. ~~Audit log minimum~~ → ADR 0014  
5. ~~Pagination/filtering~~ → ADR 0017  
6. ~~Testing & deployment~~ → ADR 0018, 0019  
7. Produce final “client SOW” tone doc if needed for portfolio narrative  
8. ~~Kit ADRs~~ → replaced by ADRs 0001–0020  
9. ~~Multi-tenancy DB strategy~~ → ADR 0013  
10. ~~DB constraints & soft rules~~ → ADR 0020  

---

*This file is the source of truth for product decisions until superseded. Do not design the database or write implementation code from assumptions that contradict this document without a new decision entry.*
