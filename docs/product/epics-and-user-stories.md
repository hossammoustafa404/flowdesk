# Flowdesk — Epics & User Stories (MVP)

**Status:** Draft backlog derived from discovery  
**Source:** [flowdesk-discovery.md](../research/flowdesk-discovery.md)  
**Glossary:** [CONTEXT.md](../../CONTEXT.md)  
**Date:** 2026-09-23  

Stories use Flowdesk language (Customer ≠ User; Job; Org Role; Notification; Mark Informed).  
Priority: **P0** = must ship for portfolio MVP; **P1** = important but can follow a P0 slice.

---

## Epic map

| ID | Epic | Primary roles | Pain / outcome |
|----|------|---------------|----------------|
| E1 | Organization onboarding & access | Owner, invited Users | Sign-up → org; invite team; one org per User |
| E2 | Platform administration | Super Admin | List/suspend orgs; no tenant dispatch |
| E3 | Customers (thin) | Dispatcher, Owner | Phone reuse; archive without hard delete |
| E4 | Job intake | Dispatcher, Owner | Complete intake before field work |
| E5 | Assignment & reassignment | Dispatcher, Owner | Clear ownership; manual assign with hints |
| E6 | Field Job Status | Technician (+ overrides) | Status ladder; no peer assign |
| E7 | Notifications & Mark Informed | Dispatcher, Owner, system | Customer/tech updates without duplicates |
| E8 | Operational dashboard | Owner, Dispatcher | Open / overdue / blocked / done today |
| E9 | Org settings & workforce | Owner | Areas, default lang, deactivate tech |
| E10 | Bilingual UI (AR/EN) | All org Users | Switchable UI + RTL |

**Out of MVP (no stories):** invoicing, inventory, GPS/auto-dispatch, customer portal, recurring contracts, tech-to-tech assign, WhatsApp inbox, multi-org membership, hard delete, native apps.

---

## E1 — Organization onboarding & access

**Goal:** A new business can create an Organization and bring staff in without Super Admin provisioning.

### E1-US01 — Public Sign-up creates Organization + Owner (P0)

**As an** aspiring Owner  
**I want to** Sign-up on `web` with email, password, and Organization name  
**So that** I get a User, a new Organization, and the Owner Org Role in one act (Session only after Email verification).

**Acceptance**

- Sign-up on `web` creates User + Organization + Owner together in one successful act, or creates none of them.  
- Organization name is collected on Sign-up; slug is derived server-side.  
- No Session until Email verification succeeds; the first Session’s Active Organization is the Sign-up Organization.  
- Sign-up on `admin` origin is rejected.  
- Org Users cannot create another Organization via self-serve create (Sign-up is the only self-serve create path).  
- Smoke: the new Owner is a member only of the Organization created at Sign-up (full cross-tenant isolation remains X-US02).  
- Out of scope: invitee credential path (separate Invitation story; today’s invitee Sign-up→accept path will conflict until that lands).

### E1-US02 — Sign-in on the correct app (P0)

**As a** User  
**I want to** sign in only on the app that matches my kind of User (Organization User → `web`, Super Admin → `admin`)  
**So that** I cannot obtain a Session from the wrong product surface.

**Acceptance**

- Origin-gated sign-in/Sign-up per ADR 0006.  
- Wrong-app sign-in fails without enumerating Role via a distinct status.  
- **Satisfied by** existing `OriginGateHook` + `server-e2e` auth coverage (same unauthorized body as unknown credentials). This story is only the sign-in/Sign-up origin gate; post-Session wrong-app use is E1-US05; admin sign-in UI is out of scope here.

### E1-US03 — Owner invites Users with an Org Role (P0)

**As an** Owner  
**I want to** invite an email as Owner, Dispatcher, or Technician  
**So that** my team can join the Organization without creating a new tenant.

**Acceptance**

- Invitation specifies Org Role.  
- Accept/reject/get require Email verification.  
- Invitation does not create an Organization.

### E1-US04 — Invitation rejected if email already has an Organization (P0)

**As the** system  
**I want to** reject Invitation accept when the email already belongs to an Organization  
**So that** the one-org-per-User MVP rule holds.

**Acceptance**

- Accept succeeds only if that email has no Organization yet.  
- Clear error when the email already has an org (e.g. from prior Sign-up).

### E1-US05 — Session after verification (P0)

**As a** verified User  
**I want to** obtain a Session and use `web` according to my Org Role  
**So that** I can do my job in the product.

**Acceptance**

- Verified Owner/Dispatcher/Technician can use `web`.  
- Super Admin cannot use `web`; org Users cannot use `admin`.

---

## E2 — Platform administration

**Goal:** Super Admin can manage tenant lifecycle without day-to-day dispatch.

### E2-US01 — List Organizations (P0)

**As a** Super Admin  
**I want to** list Organizations in `admin`  
**So that** I can see tenants on the platform.

**Acceptance**

- Only Super Admin on `admin` can list orgs.  
- No Job/Customer cross-tenant ops from this list.

### E2-US02 — Suspend Organization (P0)

**As a** Super Admin  
**I want to** suspend an Organization  
**So that** its Users cannot log into `web`.

**Acceptance**

- Suspended org Users cannot obtain/use a `web` Session.  
- Super Admin still has no god-mode dispatch into that org’s Jobs.

### E2-US03 — Optional create Organization from admin (P1)

**As a** Super Admin  
**I want to** optionally create an Organization for support/demo  
**So that** I can help without making admin the primary onboarding path.

**Acceptance**

- Create-from-admin is available but not required for normal Sign-up onboarding.  
- Primary first Owner path remains public Sign-up on `web`.

---

## E3 — Customers (thin)

**Goal:** Reuse people by phone during intake; archive instead of delete.

### E3-US01 — Search Customer by phone (P0)

**As a** Dispatcher or Owner  
**I want to** search Customers by primary phone  
**So that** I reuse existing records instead of duplicating.

**Acceptance**

- Phone search returns matching Customers in my Organization.  
- Primary phone unique per Organization (DB hard rule).

### E3-US02 — Create Customer inline during intake (P0)

**As a** Dispatcher or Owner  
**I want to** create a Customer when none matches  
**So that** I can finish intake without leaving the flow.

**Acceptance**

- Fields: name, primary phone, optional secondary phone, one primary address.  
- New Customer is linked to the Job being created.

### E3-US03 — Edit Customer basics (P0)

**As a** Dispatcher or Owner  
**I want to** update name, phones, and primary address  
**So that** intake data stays accurate for the next Job.

**Acceptance**

- Edits stay within my Organization.  
- No CRM/marketing fields required.

### E3-US04 — Archive and unarchive Customer (P0)

**As an** Owner  
**I want to** archive a Customer (and unarchive later)  
**So that** they leave the default picker without destroying history.

**Acceptance**

- Archived Customers hidden from default intake picker.  
- No new Jobs for archived Customers.  
- Historical Jobs remain openable by Owner/Dispatcher.  
- No hard delete in MVP.

---

## E4 — Job intake

**Goal:** Capture a complete request before assignment (addresses incomplete intake pain).

### E4-US01 — Create Job with required intake (P0)

**As a** Dispatcher or Owner  
**I want to** create a Job with all required fields  
**So that** the Technician has what they need before travel.

**Acceptance — required**

- Linked Customer (with phone on Customer)  
- Service address (area/district + street/building; governorate if needed)  
- Problem summary (free text; AR/EN/mixed OK)  
- Service type: HVAC or Plumbing  
- Urgency: Emergency / Same day / Scheduled  
- Preferred time window or ASAP  
- Created-by recorded (system)

**Acceptance — optional allowed**

- Secondary/WhatsApp number if different; landmark notes; equipment hint; internal office-only notes.

**Acceptance — not collected**

- No required GPS pin, intake photos, or appliance serial DB.

### E4-US02 — Job starts as New (P0)

**As a** Dispatcher  
**I want** a newly created Job to be `New`  
**So that** it is clearly unassigned until I pick a Technician.

**Acceptance**

- Status after create is `New`.  
- Job cannot be Completed from `New` (must have been Assigned at least once).

### E4-US03 — Today’s jobs board for office (P0)

**As a** Dispatcher or Owner  
**I want to** see the Organization’s Jobs (paginated/filterable)  
**So that** I can monitor and act on today’s work.

**Acceptance**

- View all org Jobs (not Technician-limited).  
- Offset/limit pagination + query filters (status, assignee, etc.).

---

## E5 — Assignment & reassignment

**Goal:** One clear Assignee; no double-assign fog; manual pick with hints.

### E5-US01 — Assign Technician to a New Job (P0)

**As a** Dispatcher or Owner  
**I want to** manually assign an active Technician  
**So that** the Job has a single owner in the field.

**Acceptance**

- Assign moves Job to `Assigned` with that Assignee.  
- Inactive Technicians are hard-blocked.  
- Skill mismatch warns but does not hard-block.  
- Hints: skills, coverage area tags, today’s open Job count (no auto-dispatch / distance matrix).  
- Assign + Notification outbox commit atomically; UI may show notify `pending`.

### E5-US02 — Reassign Job (P0)

**As a** Dispatcher or Owner  
**I want to** reassign a Job to another Technician  
**So that** work continues when someone is stuck or leaves mid-flight.

**Acceptance**

- Allowed from `Assigned` / `En route` / `Blocked` (and as needed per Owner/Dispatcher).  
- New Technician receives Job at `Assigned`.  
- Job History retains previous Assignee.  
- Customer notified on reassign (new technician).

### E5-US03 — Cancel Job with reason (P0)

**As a** Dispatcher or Owner  
**I want to** cancel a Job with a required reason  
**So that** we stop work deliberately and can explain why.

**Acceptance**

- `Cancelled` requires a reason.  
- Customer notified on cancel (per notify rules).  
- Assigned Technician notified if they were assigned.

### E5-US04 — No Technician-to-Technician assign (P0)

**As a** Technician  
**I want** peer handoff blocked  
**So that** ownership always goes through the office.

**Acceptance**

- Technician cannot assign Jobs to others.  
- Stuck path: mark `Blocked` with reason → Dispatcher/Owner reassigns.

---

## E6 — Field Job Status

**Goal:** Clear ladder from Assigned → done/blocked; only on own Jobs.

### E6-US01 — Technician sees only my Jobs (P0)

**As a** Technician  
**I want to** see Jobs assigned to me (e.g. today)  
**So that** I am not distracted by the full org board.

**Acceptance**

- Own Jobs only; no full org board.  
- Cannot assign others.

### E6-US02 — Advance status on own Job (P0)

**As a** Technician  
**I want to** move my Job `Assigned` → `En route` → `On site` → `Completed` or `Blocked`  
**So that** the office and Customer know where work stands.

**Acceptance**

- Server enforces allowed transitions.  
- `Completed`: notes optional.  
- `Blocked`: reason required.  
- Only current Assignee may Complete (unless Owner/Dispatcher override).  
- Optimistic concurrency: stale write → conflict, UI reload.

### E6-US03 — Owner/Dispatcher status override (P0)

**As an** Owner or Dispatcher  
**I want to** override complete/cancel when needed  
**So that** ops can unblock exceptions without walking the tech ladder day-to-day.

**Acceptance**

- Overrides respect status rules and version token.  
- Late Complete after reassign is rejected.

### E6-US04 — Job History visible (P0)

**As a** Dispatcher or Owner  
**I want to** see Job History for assign/reassign/status/block/complete/cancel  
**So that** I know who had the Job and what changed.

**Acceptance**

- Append-only Job History for field-relevant events (ADR 0014).  
- No org-wide audit product in MVP.

---

## E7 — Notifications & Mark Informed

**Goal:** Customers and Technicians get the right pings; retries never double-send.

### E7-US01 — Customer Notifications on key events (P0)

**As a** Customer (recipient, no login)  
**I want to** receive outbound messages when the Job is Assigned, En route, On site, Completed, Cancelled, or reassigned  
**So that** I am not left waiting without updates.

**Acceptance**

- No auto Customer Notification on `Blocked` (office handles).  
- Language: per-Customer preference; default org default (NileFix → AR).  
- Delivery: `pending` → `sent` / `failed`.

### E7-US02 — Technician Notifications on assign/cancel/reassign (P0)

**As a** Technician  
**I want to** be notified when assigned, cancelled (if I was assigned), or involved in reassign (old + new)  
**So that** I know my workload changed.

**Acceptance**

- Matches discovery tech notify rules.  
- Same outbox/idempotency model as Customer Notifications.

### E7-US03 — Idempotent delivery and explicit resend (P0)

**As the** system  
**I want** retries to reuse an idempotency key per occurrence  
**So that** Customers are not double-messaged on worker retry.

**Acceptance**

- Key: `jobId + eventType + occurrenceId`.  
- Human **resend** creates a new Notification occurrence.  
- Failed/pending Notifications visible for office attention.

### E7-US04 — Resend or Mark Informed (P0)

**As a** Dispatcher or Owner  
**I want to** resend a failed Notification or Mark Informed  
**So that** I can clear attention items after calling the Customer myself.

**Acceptance**

- Resend = new Notification.  
- Mark Informed is not a Notification; records office told the Customer without a successful send.

---

## E8 — Operational dashboard

**Goal:** End owner blind spot — one place for open / overdue / blocked / done today (`Africa/Cairo`).

### E8-US01 — Dashboard buckets (P0)

**As an** Owner (Dispatcher may see ops view)  
**I want** counts for Open, Overdue, Blocked, Done today (and Cancelled separate)  
**So that** I know the day’s operational health.

**Acceptance — definitions**

| Bucket | Rule |
|--------|------|
| Open | `New`, `Assigned`, `En route`, `On site`, `Blocked` |
| Done today | `Completed` with `completed_at` today (Cairo) |
| Cancelled | Separate; not open, not done |
| Overdue | Preferred window end passed while still Open; **or** ASAP/Emergency with no window → overdue 2 hours after created if still `New` or `Assigned`; future-scheduled not overdue yet |
| Blocked | Still Open; distinct count |

### E8-US02 — Drill into Jobs from dashboard (P0)

**As an** Owner  
**I want to** open Jobs from a bucket  
**So that** I can intervene (reassign, cancel, override).

**Acceptance**

- Drill-down lists match bucket definitions.  
- Permissions match Owner/Dispatcher matrix.

---

## E9 — Org settings & workforce

**Goal:** Configure how the org runs; handle employee leave without auto-chaos.

### E9-US01 — Org settings (areas, default language) (P0)

**As an** Owner  
**I want to** set coverage areas and org default language  
**So that** assignment hints and Notification defaults match NileFix ops.

**Acceptance**

- Default language used when Customer has no preferred notify language.  
- Coverage area tags available for Technician profiles / assign hints.

### E9-US02 — Technician profile for assignment hints (P0)

**As an** Owner  
**I want** Technicians to have active/inactive, skills (HVAC/Plumbing/both), and coverage areas  
**So that** Dispatchers can assign with judgment aids.

**Acceptance**

- Inactive cannot be assigned.  
- Today’s open Job count available as a hint.

### E9-US03 — Deactivate User (employee leaves) (P0)

**As an** Owner  
**I want to** deactivate a Technician (or other org User)  
**So that** they cannot log in while history is retained.

**Acceptance**

- Login blocked; row kept.  
- Open Jobs **not** auto-reassigned; flagged **needs reassignment**.  
- Dispatcher/Owner reassigns each Job explicitly.  
- Customer notified only on reassign, not on deactivate alone.

### E9-US04 — Invite/deactivate and set Org Role (P0)

**As an** Owner  
**I want to** manage Users’ Org Roles and deactivation  
**So that** permissions match who does intake vs field work.

**Acceptance**

- Matches permissions matrix (Owner only for invite/deactivate/set role).

---

## E10 — Bilingual UI (AR/EN)

**Goal:** Product usable in Arabic and English without translating free-text notes via MT.

### E10-US01 — Switch UI language with RTL (P0)

**As an** org User  
**I want to** switch the UI between AR and EN  
**So that** I can work in my preferred language.

**Acceptance**

- Arabic UI is RTL.  
- Enums stored as stable English codes; labels translated in UI.  
- User content stays single free-text fields (mixed OK); no MT of notes in MVP.

### E10-US02 — Customer Notification language (P0)

**As the** system  
**I want** Customer Notifications in the Customer’s preferred language (else org default)  
**So that** homeowners get messages they can read.

**Acceptance**

- NileFix org default AR.  
- Preference stored on Customer when set.

---

## Cross-cutting reliability stories

These support multiple epics; implement with Jobs + Notifications.

### X-US01 — Optimistic concurrency on Job updates (P0)

**As the** system  
**I want** version/token checks on Job writes  
**So that** concurrent reassign vs complete cannot corrupt ownership.

**Acceptance**

- Stale write → conflict.  
- Complete only if current Assignee (or allowed override), status allowed, not Cancelled.  
- No “Completed always wins.”

### X-US02 — Tenant isolation (P0)

**As an** org User  
**I want** zero access to other Organizations’ Users, Customers, and Jobs  
**So that** multi-tenant data stays safe.

**Acceptance**

- Shared schema + `organization_id`; API + DB constraints enforce isolation.  
- Super Admin has no cross-org Job ops in MVP.

---

## Suggested delivery order (portfolio slices)

1. **E1 + E2** — Sign-up, invite, origin gate, admin list/suspend (+ NileFix seed)  
2. **E3 + E4** — Customers + Job intake + office board  
3. **E5 + E6 + X-US01** — Assign/status/history/concurrency  
4. **E7 + X-US02** — Outbox Notifications, resend, Mark Informed (tenancy tests continuous)  
5. **E8 + E9** — Dashboard + deactivate/needs-reassignment + org settings  
6. **E10** — AR/EN + RTL polish across shipped surfaces  

Each slice meets discovery definition of done: domain tests for status/tenancy/notify idempotency/concurrency as touched; Docker Compose + CI bar for the repo.

---

## Traceability

| Discovery area | Epics / stories |
|----------------|-----------------|
| Pain: incomplete intake | E4 |
| Pain: unclear ownership | E5, E6-US04 |
| Pain: status fog | E6, E8 |
| Pain: customer not updated | E7 |
| Pain: owner blind spot | E8 |
| Sign-up onboarding | E1-US01–US04 |
| Permissions matrix | E1–E9 role tags on stories |
| Edge: employee leaves | E9-US03 |
| Edge: notify crash / duplicate | E7-US03, X + ADR 0010 |
| Edge: concurrent complete | X-US01, ADR 0011 |
| Non-MVP list | Explicitly excluded above |

---

*When a story conflicts with [flowdesk-discovery.md](../research/flowdesk-discovery.md), discovery wins until a new decision is logged.*
