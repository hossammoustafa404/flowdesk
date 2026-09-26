# Flowdesk — Epics & User Stories (MVP)

**Status:** Draft backlog derived from discovery  
**Source:** [flowdesk-discovery.md](../research/flowdesk-discovery.md)  
**Glossary:** [CONTEXT.md](../../CONTEXT.md)  
**Date:** 2026-09-26  
**Decision:** Seats and Sign-up follow [ADR 0021](../adr/0021-signup-does-not-create-organization.md).

Stories use Flowdesk language (Customer ≠ User; Job; Org Role; Notification; Mark Informed).  
Priority: **P0** = must ship for portfolio MVP; **P1** = important but can follow a P0 slice.

Each story lists **Depends on** / **Unlocks** so delivery order is explicit. Epic IDs stay stable; **Suggested delivery order** (bottom) is the build sequence—not epic number order.

---

## Epic map

| ID | Epic | Primary roles | Pain / outcome |
|----|------|---------------|----------------|
| E1 | Organization onboarding & access | Owner, invited Users | Sign-up creates a User; the User creates an Organization; invite; a User may belong to many Organizations |
| E2 | Platform administration | Super Admin | List/suspend orgs; no tenant dispatch |
| E4 | Job intake | Dispatcher, Owner | Complete intake, including find-or-create Customer |
| E3 | Customers (thin) | Dispatcher, Owner | Edit after intake; archive without hard delete |
| E5 | Assignment & reassignment | Dispatcher, Owner | Clear ownership; manual assign with hints |
| E6 | Field Job Status | Technician (+ overrides) | Status ladder; no peer assign |
| E7 | Notifications & Mark Informed | Dispatcher, Owner, system | Customer/tech updates without duplicates |
| E8 | Operational dashboard | Owner, Dispatcher | Open / overdue / blocked / done today |
| E9 | Org settings & workforce | Owner | Areas, default lang, deactivate tech |
| E10 | Bilingual UI (AR/EN) | All org Users | Switchable UI + RTL |

E4 is written before E3 below: the first Job is what creates the Customer. Edit and archive come after that Job.

**Out of MVP (no stories):** invoicing, inventory, GPS/auto-dispatch, customer portal, recurring contracts, tech-to-tech assign, WhatsApp inbox, hard delete, native apps.

---

## Dependency rules (read first)

These are the ordering constraints that used to be easy to miss:

1. **Owner seat before invite UI** — Email verification and a Session (E1-US05) come before a User creates an Organization (E1-US06). Only then can that Owner invite (E1-US03).
2. **Workforce before assign** — Active/inactive, skills, and coverage areas (E9-US01/US02) must exist before meaningful assign with hints (E5). Deactivate-with-open-Jobs (E9-US03) waits until Jobs + assign exist.
3. **Outbox with first assign** — Assign/reassign/cancel persist Notification outbox rows in the same DB transaction (discovery rule 11). Ship a minimal outbox writer with E5; delivery worker, resend, and Mark Informed complete in E7. Assign UI may succeed while notify stays `pending`.
4. **Job History with reassign** — Reassign must append Job History (E6-US04 lands in the same slice as E5, not after field status polish).
5. **Tenant isolation from day one** — X-US02 starts with E1/E3; do not defer “tenancy” to the notify slice. A request sees only the Active Organization. A User with seats elsewhere still does not see those Customers or Jobs until they switch.
6. **Notify language data before polish** — Org default language (E9-US01) and optional Customer preferred language (on Customer / E7) feed Notifications. E10 is UI locale + RTL polish, not the first place language data appears.
7. **Dashboard after status ladder** — E8 bucket definitions need real Job Statuses and timestamps from E4–E6.
8. **Intake owns find-or-create** — Phone search and inline Customer create are part of Job intake (E4). They are not tickets that ship before the first Job. Edit and archive follow that Job.

---

## E1 — Organization onboarding & access

**Goal:** A person can get a User, then create or join Organizations, without Super Admin provisioning. A User may hold a seat in many Organizations.

### E1-US01 — Public Sign-up creates a User (P0)

**As a** person  
**I want to** Sign-up on `web` with name, email, and password  
**So that** I get a User and nothing else.

**Depends on:** Auth stack + Email verification plumbing (Better Auth); no prior org stories.  
**Unlocks:** E1-US05 (first Session). NileFix can also be seeded. Creating an Organization is E1-US06, not this story.  
**Surface:** `web` Sign-up form; `server` Sign-up handler; reject on `admin` origin.

**Acceptance**

- Sign-up on `web` creates a User, or creates nothing if it fails. It does not create an Organization or an Org Role.  
- The form does not collect an Organization name.  
- No Session until Email verification succeeds. After verification the User has no Active Organization until they create one (E1-US06) or accept an Invitation (E1-US03).  
- Sign-up on `admin` origin is rejected.  
- Smoke: the new User belongs to no Organization (full cross-tenant isolation remains X-US02).

**Notes / edges**

- An invitee with no User yet uses this same Sign-up, then accepts (E1-US03). Sign-up does not assign them a seat.  
- Out of scope here: create-Organization UI and Invitation accept/reject UI.

### E1-US02 — Sign-in on the correct app (P0)

**As a** User  
**I want to** sign in only on the app that matches my kind of User (a User with or without seats → `web`, Super Admin → `admin`)  
**So that** I cannot obtain a Session from the wrong product surface.

**Depends on:** Origin gate (ADR 0006); seeded or existing Users.  
**Unlocks:** Safe parallel work on `web` vs `admin` Session use (E1-US05, E2).  
**Surface:** Sign-in on `web` and `admin`; shared auth API with origin check.

**Acceptance**

- Origin-gated sign-in/Sign-up per ADR 0006.  
- Wrong-app sign-in fails without enumerating Role via a distinct status (same unauthorized body as unknown credentials).  
- A verified User with zero Organizations can sign in on `web`.  
- **Satisfied by** existing `OriginGateHook` + `server-e2e` auth coverage where already green; this story is only the sign-in/Sign-up origin gate.

**Notes / edges**

- Post-Session wrong-app use is E1-US05.  
- Super Admin sign-in on `admin` is in scope here. It is the first step of the platform journey (E2).

### E1-US05 — Session and Active Organization (P0)

**As a** verified User  
**I want to** obtain a Session and, once I have a usable seat, work in one Active Organization  
**So that** I can create or join an Organization, switch among the ones I can work in, and do my job in the one I am acting in.

**Depends on:** E1-US01 + Email verification; E1-US02 origin gate.  
**Unlocks:** E1-US06 (create), then invite (E1-US03) and all authenticated `web` work that needs an Active Organization.  
**Surface:** `web` session bootstrap; empty-seat screen; Organization switcher; role-aware shell (Owner/Dispatcher/Technician nav differences can be minimal at first).

**Acceptance**

- Unverified Users cannot obtain a Session.  
- Super Admin cannot use `web`; a User who is not a Super Admin cannot use `admin` (post-Session enforcement, not only the sign-in gate).  
- A Session with no Organizations, or with no usable seat, has no Active Organization. The User may create an Organization or accept an Invitation, and cannot open Customers or Jobs.  
- When every seat is unusable, the User sees those Organizations as suspended or Deactivated.  
- A User with exactly one usable seat is acting in that Organization.  
- A User with several usable seats is acting in the last Active Organization they can still use, or must choose before any Customer or Job work.  
- The switcher lists only Organizations the User can still work in. Switching changes the Active Organization without signing out.  
- Customers, Jobs, and the Org Role in force are those of the Active Organization alone.  
- If the active seat becomes Deactivated or that Organization is suspended, the Session chooses again by the same rules.

**Notes / edges**

- Ship this **before** create-Organization and invite UI.  
- Role-specific home routes can be stubs until later epics (e.g. Technician “my Jobs” arrives in E6).  
- Which Organization becomes active after create or accept is E1-US06 and E1-US03.

### E1-US06 — Verified User creates an Organization (P0)

**As a** verified User  
**I want to** create an Organization and become its Owner  
**So that** I have a company workspace, including when I already belong to other Organizations.

**Depends on:** E1-US05.  
**Unlocks:** Owner invite (E1-US03), org settings (E9-US01), and every later `web` story that needs an Active Organization.  
**Surface:** `web` create-Organization form (name). Slug is derived server-side.

**Acceptance**

- Any verified User who is not a Super Admin may create an Organization. There is no cap.  
- The creator becomes the Owner of that Organization and keeps their other seats.  
- Creating it makes it the Active Organization.  
- A Super Admin cannot create one on `web` and does not gain a seat here (admin create is E2-US03).  
- Customers and Jobs in the new Organization are empty and isolated (X-US02).

### E1-US03 — Owner invites Users with an Org Role (P0)

**As an** Owner  
**I want to** invite an email as Owner, Dispatcher, or Technician  
**So that** they gain a seat in this Organization without a new Organization being created for them.

**Depends on:** E1-US06 (the inviter’s Owner seat) and E1-US05; Invitation model per CONTEXT.  
**Unlocks:** Invitee joins and can work (Dispatcher intake, Technician field); E1-US04 pending list; E9-US04 (ongoing seat management).  
**Surface:** `web` Owner invite form; Invitation email; invitee accept/reject screens. A new User gets credentials from Sign-up (E1-US01), then accepts here.

**Acceptance — Owner sends**

- Only an Owner of this Organization may invite.  
- Invitation specifies Org Role (Owner, Dispatcher, or Technician) and the invitee email. It does not create an Organization or a password.  
- The Owner cannot invite an email that already has a seat here, including a Deactivated seat. The Owner sets that seat active again (E9-US04) instead.  
- The Owner cannot invite a Super Admin.  
- This Organization has at most one pending Invitation per email. Sending again while it is pending is refused and does not extend the 48 hours.  
- The same email may have a pending Invitation from another Organization.  
- There is no direct add that grants a seat without accept.  
- An email goes out with a link to that Invitation. The Invitation expires 48 hours after it is sent.

**Acceptance — invitee joins or declines**

- Accept, reject, and get require Email verification.  
- An invitee with no User yet Signs up with that email (E1-US01), verifies it, then accepts.  
- Accept succeeds only for the User whose email is on the Invitation, and only when that User has no seat in this Organization yet. A signed-in User with a different email is rejected.  
- Accept adds a seat with the Org Role on the Invitation and leaves the User’s other seats in place. It does not change an Org Role they already hold here.  
- Accept makes this Organization the Active Organization only when the User had none. Otherwise the Active Organization stays as it was.  
- Reject adds no seat. An expired or cancelled Invitation cannot be accepted.

**Notes / edges**

- Pending Invitations the Owner still needs to see or withdraw are E1-US04.  
- A Super Admin inviting the first Owner of an empty Organization is E2-US03.

### E1-US04 — Owner reviews pending Invitations (P0)

**As an** Owner  
**I want to** see Invitations for my Organization and cancel one that is still pending  
**So that** I know who has not joined and can withdraw a wrong or stale invite before sending another.

**Depends on:** E1-US03.  
**Unlocks:** Nothing later; this closes the Owner invite journey. Joined Users are managed in E9-US04.  
**Surface:** `web` Invitations list (Owner only).

**Acceptance**

- List is limited to this Organization and shows email, invited Org Role, and status (pending, accepted, rejected, cancelled, expired).  
- Owner can cancel a pending Invitation. A cancelled or expired Invitation cannot be accepted.  
- After it is no longer pending, the Owner may send a new Invitation to that email (E1-US03).  
- Dispatcher and Technician cannot list or cancel Invitations.  
- Cancelling does not affect a User who has already accepted.  
- While the Organization has no Owner yet, cancel is E2-US03, not this screen.

---

## E2 — Platform administration

**Goal:** Super Admin can manage tenant lifecycle without day-to-day dispatch and without holding a seat.

### E2-US01 — List Organizations (P0)

**As a** Super Admin  
**I want to** list Organizations in `admin`  
**So that** I can see tenants on the platform.

**Depends on:** Super Admin seed + E1-US02 admin sign-in gate; Organizations exist (E1-US06, E2-US03, or seed).  
**Unlocks:** E2-US02 suspend.  
**Surface:** `admin` org list.

**Acceptance**

- Only Super Admin on `admin` can list orgs.  
- List shows enough to identify tenants (name, slug, status, created)—no Job/Customer payloads.  
- An Organization with no seats yet is listed.  
- No Job/Customer cross-tenant ops from this list.

### E2-US02 — Suspend Organization (P0)

**As a** Super Admin  
**I want to** suspend an Organization  
**So that** nobody can work in it, while its Users can still use their other Organizations.

**Depends on:** E2-US01.  
**Unlocks:** Platform safety for portfolio demos / abuse cases.  
**Surface:** `admin` suspend action; `web` Active Organization rules in E1-US05.

**Acceptance**

- Suspension blocks that Organization only. Its Customers and Jobs cannot be opened. It is not restored as the Active Organization and it is not in the switcher.  
- A User with another usable Organization can sign in and work there.  
- A User whose only seat is suspended keeps that seat, can sign in, sees the Organization as suspended, and may still create another Organization or accept an Invitation.  
- A Session that was acting in it chooses again by the E1-US05 rules.  
- Super Admin still has no dispatch into that org’s Jobs.  
- List reflects suspended status.

### E2-US03 — Optional create Organization from admin (P1)

**As a** Super Admin  
**I want to** create an Organization and invite its first Owner  
**So that** I can make a support or demo tenant without holding a seat and without replacing self-serve create.

**Depends on:** E2-US01; Invitation rules in E1-US03. Must not replace E1-US06 as the normal onboarding path.  
**Unlocks:** Support/demo tenants whose first Owner joins by Invitation.  
**Surface:** `admin` create (name + first Owner email); cancel a pending Invitation while the Organization has no seats. No dispatch into tenant Jobs.

**Acceptance**

- Name is collected; slug is derived. The act requires the first Owner’s email and creates the Organization together with an Owner Invitation. The Super Admin gains no seat.  
- Until someone accepts, the Organization has no Users.  
- While it has no seats, the Super Admin may cancel a pending Invitation and then send an Owner Invitation. They cannot send a second Invitation to an email that already has one pending, and the 48 hours are not extended. Different emails may each have their own pending Owner Invitation.  
- A Super Admin email cannot be invited.  
- Once an Owner accepts, only an Owner invites or cancels (E1-US03, E1-US04). Accept follows E1-US03 for the Active Organization.  
- Tenant isolation still applies (X-US02).

---

## E4 — Job intake

**Goal:** Capture a complete request before assignment (addresses incomplete intake pain). Find-or-create Customer is part of this flow, not a prior epic.

### E4-US01 — Create Job with required intake (P0)

**As a** Dispatcher or Owner  
**I want to** take a call into a Job—reusing a Customer by phone or creating one inline—with every required field filled  
**So that** the Technician has what they need before travel, without a separate Customer setup step first.

**Depends on:** E1-US05 with an Active Organization (E1-US06 or an accepted Invitation).  
**Unlocks:** Office board (E4-US02), later Customer edit/archive (E3), E5 assign from `New`.  
**Surface:** `web` intake form (Dispatcher/Owner).

**Acceptance — Customer, in the same intake**

- Search Customers in this Organization by primary phone.  
- Primary phone unique per Organization (DB hard rule).  
- A match can be selected and linked to the Job.  
- No match → create inline: name, primary phone, optional secondary phone, one primary address. Optional preferred Notification language (else org default from E9-US01 / E7).  
- Duplicate primary phone in-org is rejected.  
- No CRM/marketing fields. Technician cannot create Customers or Jobs.

**Acceptance — Job, required**

- Linked Customer (with phone on Customer)  
- Service address (area/district + street/building; governorate if needed)  
- Problem summary (free text; AR/EN/mixed OK)  
- Service type: HVAC or Plumbing  
- Urgency: Emergency / Same day / Scheduled  
- Preferred time window or ASAP  
- Created-by recorded (system)

**Acceptance — optional allowed**

- Secondary/WhatsApp number if different; landmark notes; equipment hint; internal office-only notes.  
- Office-only notes stay on the Job for Dispatcher and Owner. They are not shown to the Technician (E6-US01).

**Acceptance — not collected**

- No required GPS pin, intake photos, or appliance serial DB.

**Acceptance — result of create**

- Status is `New`. No Assignee.  
- Job cannot be Completed from `New` (must have been Assigned at least once). Full transition ladder is E6.  
- Server rejects create if required fields are missing.

### E4-US02 — Today’s jobs board for office (P0)

**As a** Dispatcher or Owner  
**I want to** see the Organization’s Jobs (paginated/filterable)  
**So that** I can monitor and act on today’s work.

**Depends on:** E4-US01.  
**Unlocks:** Office path into assign/reassign/cancel (E5) and monitoring (E6/E8).  
**Surface:** `web` org Jobs board (not Technician-limited).

**Acceptance**

- View all org Jobs (not Technician-limited).  
- Default scope is today’s Jobs (`Africa/Cairo`). Filters can widen the day and narrow by status and, once assign exists, assignee.  
- Offset/limit pagination (ADR 0017).  
- Opening a Job shows the intake captured on create: Customer and phone, service address, problem, service type, urgency, window or ASAP, optional landmark and equipment hint, and office-only notes, plus status and Assignee when set.  
- Tenant-scoped: never other Organizations’ Jobs (X-US02).  
- Technician role does not get this full board (E6-US01).  
- Once this board exists, Dispatcher sign-in lands here. Owner can open it; Owner’s home becomes the dashboard in E8.

---

## E3 — Customers (thin)

**Goal:** Keep Customer records accurate after intake, and archive instead of delete.

Find-or-create is not a story here. It is part of E4-US01. These stories start only after a Customer exists from a Job.

### E3-US01 — Edit Customer basics (P0)

**As a** Dispatcher or Owner  
**I want to** update name, phones, and primary address  
**So that** the next Job and later Notifications use current contact details.

**Depends on:** E4-US01 (a Customer already created during intake).  
**Unlocks:** Correct phones and addresses on later Jobs and Notifications; the same lookup is how the Owner reaches archive (E3-US02).  
**Surface:** `web` Customer lookup by phone, then edit. Reachable from a Job and without starting a new Job. No CRM list, merge, or marketing fields.

**Acceptance**

- Lookup by primary phone returns matches in this Organization only, including when the Owner is not inside create-Job.  
- Edits stay within my Organization.  
- Primary phone uniqueness still enforced.  
- No CRM/marketing fields.  
- Changing the Customer’s primary address does not rewrite service addresses already stored on past Jobs.  
- Technician cannot look up or edit Customers.

### E3-US02 — Archive and unarchive Customer (P0)

**As an** Owner  
**I want to** archive a Customer (and unarchive later)  
**So that** they leave the default intake picker without destroying history.

**Depends on:** E4-US01.  
**Unlocks:** Remove from picker without hard delete. Does not block the first Job or assign.  
**Surface:** `web` Owner-only archive/unarchive, from the same Customer lookup as E3-US01.

**Acceptance**

- Archived Customers hidden from default intake picker.  
- No new Jobs for archived Customers.  
- Historical Jobs remain openable by Owner/Dispatcher.  
- Unarchive restores picker eligibility.  
- No hard delete in MVP.  
- Dispatcher cannot archive (permissions matrix).

---

## E9 — Org settings & workforce (early slice vs late slice)

**Goal:** Configure how the org runs; handle employee leave without auto-chaos.

> **Ordering note:** E9-US01 and E9-US02 are **before** E5. E9-US03 (deactivate with open Jobs) is **after** E5. E9-US04 overlaps invite (E1) for ongoing seat management. E9-US05 (delete the Organization) is P1.

### E9-US01 — Org settings (areas, default language) (P0)

**As an** Owner  
**I want to** set coverage areas and org default language  
**So that** assignment hints and Notification defaults match NileFix ops.

**Depends on:** E1-US06 (Owner of an Organization).  
**Unlocks:** E9-US02 (area tags on Technicians); E5 assign hints; E7/E10 Notification language fallback (NileFix → AR).  
**Surface:** `web` Owner org settings.

**Acceptance**

- Owner can set org default language (AR/EN).  
- Default language used when Customer has no preferred notify language.  
- Coverage area tags exist as org-configurable values for Technician profiles / assign hints.  
- Dispatcher/Technician cannot change org settings.

### E9-US02 — Technician profile for assignment hints (P0)

**As an** Owner  
**I want** Technicians to have active/inactive, skills (HVAC/Plumbing/both), and coverage areas  
**So that** Dispatchers can assign with judgment aids.

**Depends on:** E9-US01 (areas); invited Technician Users (E1-US03).  
**Unlocks:** E5-US01 hard-block inactive + skill/area/workload hints.  
**Surface:** `web` Owner workforce/profile edit.

**Acceptance**

- Fields: active/inactive; skills (HVAC / Plumbing / both); coverage area tags.  
- Inactive cannot be assigned (enforced in E5; profile must expose the flag here).  
- Today’s open Job count is computable once Jobs exist (hint UI can show 0 until E4/E5).  
- No distance matrix / auto-dispatch.

### E9-US03 — Deactivate a seat (employee leaves the field) (P0)

**As an** Owner  
**I want to** deactivate a Technician (or another User’s seat in this Organization)  
**So that** they cannot act here while history is retained, and they can still use their other Organizations.

**Depends on:** E5 (open Jobs + assign exist); E9-US02 active flag.  
**Unlocks:** Safe offboarding without auto-reassign chaos.  
**Surface:** `web` Owner deactivate; office board flag for Jobs needing reassignment.

**Acceptance**

- The seat stays. The User cannot act in this Organization. Their login and their other Organizations stay available.  
- If this Organization was Active, the Session chooses again by the E1-US05 rules.  
- The last Owner cannot be deactivated.  
- Open Jobs are not auto-reassigned; they are flagged **needs reassignment**.  
- Dispatcher/Owner reassigns each Job explicitly (E5-US02).  
- Customer notified only on reassign, not on deactivate alone.  
- Inactive assign hard-block still applies (E5-US01).  
- Setting the seat active again is E9-US04, not a new Invitation.

### E9-US04 — Org Role, deactivate, remove, and leave (P0)

**As an** Owner  
**I want to** manage seats in this Organization  
**So that** permissions match who does intake vs field work, and someone can leave this Organization without losing their User or their other seats.

**Depends on:** E1-US03 (invite); E9-US03 for deactivate semantics when Jobs exist.  
**Unlocks:** Ongoing workforce admin beyond first invite.  
**Surface:** `web` Owner people list (Org Role, deactivate, set active, remove); leave for the signed-in User.

**Acceptance**

- List is Users with a seat in this Organization (name, email, Org Role, active/inactive). Pending Invitations are E1-US04, not rows on this list.  
- Owner only for invite, deactivate, set active, set Org Role, and remove.  
- A Deactivated seat is still a seat. The Owner cannot invite that email again; the Owner sets the seat active.  
- Role changes, deactivate, and remove affect only this Organization.  
- A User may leave, and an Owner may remove them, unless they are the last Owner. The last Owner cannot be demoted.  
- Leaving or removal drops only that seat. The User and their other seats remain. Jobs in this Organization stay and are not auto-reassigned (E9-US03, E5-US02).  
- If the lost Organization was Active, the Session chooses again by the E1-US05 rules.  
- There is no “reassign all open Jobs” action (non-MVP).  
- Dispatcher and Technician cannot manage seats.

### E9-US05 — Owner deletes the Organization (P1)

**As an** Owner  
**I want to** delete this Organization  
**So that** its seats end and the people in it keep their Users and any other Organizations.

**Depends on:** E1-US06.  
**Unlocks:** Nothing later.  
**Surface:** `web` Owner delete. Not a Super Admin action.

**Acceptance**

- An Owner may delete the Organization, including when they are the only Owner.  
- Every seat in it is dropped. Those Users and their seats in other Organizations remain.  
- Pending Invitations end and cannot be accepted.  
- Jobs and Customers of that Organization are not deleted.  
- If it was the Active Organization, the Session chooses again by the E1-US05 rules.  
- Super Admin still has no dispatch and does not delete Organizations here.

---

## E5 — Assignment & reassignment

**Goal:** One clear Assignee; no double-assign fog; manual pick with hints.

### E5-US01 — Assign Technician to a New Job (P0)

**As a** Dispatcher or Owner  
**I want to** manually assign an active Technician  
**So that** the Job has a single owner in the field.

**Depends on:** E4-US01 (`New` Jobs); E9-US02 (active/skills/areas); **Notification outbox writer** (minimal E7 schema—rows committed here, worker may land in E7).  
**Unlocks:** E5-US02/US03; E6 field ladder; E7 delivery of assign pings.  
**Surface:** `web` assign control on Job detail / board; hints panel.

**Acceptance**

- Assign moves Job from `New` to `Assigned` with that Assignee.  
- Inactive Technicians are hard-blocked.  
- Skill mismatch warns but does not hard-block.  
- Hints: skills, coverage area tags, today’s open Job count (no auto-dispatch / distance matrix).  
- Assign + Notification outbox rows commit atomically; UI may show notify `pending`.  
- Only Dispatcher/Owner. Technician cannot assign anyone, including another Technician. Stuck work is `Blocked` with a reason, then office reassigns (E6, E5-US02).

**Notes / edges**

- Do not ship assign without outbox rows—retries/duplicates are undefined otherwise.  
- Optimistic concurrency token required once concurrent updates exist (X-US01 in same slice as status/reassign).

### E5-US02 — Reassign Job (P0)

**As a** Dispatcher or Owner  
**I want to** reassign a Job to another Technician  
**So that** work continues when someone is stuck or leaves mid-flight.

**Depends on:** E5-US01; Job History append (E6-US04 same slice); outbox writer.  
**Unlocks:** Stuck-tech path with E6 Blocked; E9-US03 offboarding.  
**Surface:** `web` reassign action.

**Acceptance**

- Allowed from `Assigned` / `En route` / `Blocked` (and as needed per Owner/Dispatcher).  
- New Technician receives Job at `Assigned`.  
- Job History retains previous Assignee.  
- Customer notified on reassign (new technician)—outbox row; delivery via E7.  
- Old + new Technician notify rows per discovery (delivery E7).

### E5-US03 — Cancel Job with reason (P0)

**As a** Dispatcher or Owner  
**I want to** cancel a Job with a required reason  
**So that** we stop work deliberately and can explain why.

**Depends on:** E4 Jobs; outbox writer for Customer (+ Assignee if any).  
**Unlocks:** Clean terminal state for board/dashboard.  
**Surface:** `web` cancel with reason field.

**Acceptance**

- `Cancelled` requires a reason.  
- Customer notified on cancel (per notify rules)—outbox; delivery E7.  
- Assigned Technician notified if they were assigned.  
- Cancelled Jobs are not Open for dashboard (E8).

---

## E6 — Field Job Status

**Goal:** Clear ladder from Assigned → done/blocked; only on own Jobs.

### E6-US04 — Job History visible (P0)

**As a** Dispatcher or Owner  
**I want to** see Job History for assign/reassign/status/block/complete/cancel  
**So that** I know who had the Job and what changed.

**Depends on:** Job model (E4); append on assign/reassign at minimum (E5).  
**Unlocks:** Credible reassign/audit-lite; supports concurrency investigations.  
**Surface:** `web` Job detail history list.

**Acceptance**

- Append-only Job History for field-relevant events (ADR 0014): assign, reassign, status transitions, block, complete, cancel—who and when.  
- Previous Assignee visible after reassign.  
- No org-wide audit product in MVP.

**Notes / edges**

- **Ship in the assign/status slice**, not after dashboard. Reassign acceptance depends on history.

### E6-US01 — Technician sees only my Jobs (P0)

**As a** Technician  
**I want to** see Jobs assigned to me (e.g. today)  
**So that** I am not distracted by the full org board.

**Depends on:** E5-US01 (assignments exist); E1 Technician Session.  
**Unlocks:** E6-US02 status advances.  
**Surface:** `web` Technician “my Jobs” (responsive).

**Acceptance**

- Own Jobs only; no full org board.  
- Default scope is today (`Africa/Cairo`).  
- Each Job shows the intake needed in the field: Customer name and phone, service address, landmark, problem, service type, urgency, window or ASAP, equipment hint. Office-only notes are omitted.  
- Cannot assign others (E5-US01).  
- Tenant-scoped.  
- Technician sign-in lands here.

### E6-US02 — Advance status on own Job (P0)

**As a** Technician  
**I want to** move my Job `Assigned` → `En route` → `On site` → `Completed` or `Blocked`  
**So that** the office and Customer know where work stands.

**Depends on:** E6-US01; server status machine; X-US01 version token; outbox rows for Customer-facing transitions (delivery E7).  
**Unlocks:** E7 Customer pings on En route / On site / Completed; E8 Done/Blocked counts.  
**Surface:** `web` Technician status actions on own Job.

**Acceptance**

- Server enforces allowed transitions.  
- `Completed`: notes optional.  
- `Blocked`: reason required.  
- Only current Assignee may Complete (unless Owner/Dispatcher override—E6-US03).  
- Optimistic concurrency: stale write → conflict, UI reload.  
- Customer Notification outbox on `En route`, `On site`, `Completed` (not on `Blocked`).

### E6-US03 — Owner/Dispatcher status override (P0)

**As an** Owner or Dispatcher  
**I want to** override complete/cancel when needed  
**So that** ops can unblock exceptions without walking the tech ladder day-to-day.

**Depends on:** E6-US02 rules; E5-US03 cancel; X-US01.  
**Unlocks:** Exception handling for E8 interventions.  
**Surface:** `web` Job detail override actions.

**Acceptance**

- Overrides respect status rules and version token.  
- Late Complete after reassign is rejected.  
- They do not day-to-day walk `Assigned` → `En route` → `On site` for Technicians.

---

## E7 — Notifications & Mark Informed

**Goal:** Customers and Technicians get the right pings; retries never double-send.

> **Ordering note:** Outbox **writes** begin with E5/E6. This epic finishes the **worker**, idempotent delivery, office attention UI, resend, and Mark Informed.

### E7-US01 — Customer Notifications on key events (P0)

**As a** Customer (recipient, no login)  
**I want to** receive outbound messages when the Job is Assigned, En route, On site, Completed, Cancelled, or reassigned  
**So that** I am not left waiting without updates.

**Depends on:** Outbox rows from E5/E6; E9-US01 org default language; provider abstraction (mock OK in dev).  
**Unlocks:** E7-US03/US04; closes “customer not updated” pain.  
**Surface:** Worker + provider; no Customer login UI.

**Acceptance**

- Events: Assigned, En route, On site, Completed, Cancelled, reassign (new technician).  
- No auto Customer Notification on `Blocked` (office handles).  
- Language: per-Customer preference if set; else org default (NileFix → AR).  
- Delivery: `pending` → `sent` / `failed`.  
- Channel: provider abstraction (SMS/email or WhatsApp sandbox/mock)—not blocked on Meta approval.

### E7-US02 — Technician Notifications on assign/cancel/reassign (P0)

**As a** Technician  
**I want to** be notified when assigned, cancelled (if I was assigned), or involved in reassign (old + new)  
**So that** I know my workload changed.

**Depends on:** Same outbox/worker as E7-US01.  
**Unlocks:** Field awareness without WhatsApp tribal knowledge.  
**Surface:** Worker → Technician contact channel on User/profile.

**Acceptance**

- Matches discovery tech notify rules (assign, cancel if assigned, reassign old + new).  
- Same outbox/idempotency model as Customer Notifications.  
- No tech notify requirement on every status step (En route/On site are Customer-facing).

### E7-US03 — Idempotent delivery and explicit resend (P0)

**As the** system  
**I want** retries to reuse an idempotency key per occurrence  
**So that** Customers are not double-messaged on worker retry.

**Depends on:** E7-US01/US02 worker.  
**Unlocks:** Safe retries; E7-US04 human resend.  
**Surface:** Worker + Notification records.

**Acceptance**

- Key: `jobId + eventType + occurrenceId`.  
- Worker retry with same occurrence must not double-send.  
- Human **resend** creates a new Notification occurrence.  
- Failed/pending Notifications visible for office attention.

### E7-US04 — Resend or Mark Informed (P0)

**As a** Dispatcher or Owner  
**I want to** resend a failed Notification or Mark Informed  
**So that** I can clear attention items after calling the Customer myself.

**Depends on:** E7-US03 visibility of failed/pending.  
**Unlocks:** Notify hygiene without lying that SMS succeeded.  
**Surface:** `web` office attention list / Job notify panel.

**Acceptance**

- Resend = new Notification occurrence.  
- Mark Informed is not a Notification; records office told the Customer without a successful send.  
- Only Dispatcher/Owner (permissions matrix).  
- Technician has no resend/Mark Informed.

---

## E8 — Operational dashboard

**Goal:** End owner blind spot — one place for open / overdue / blocked / done today (`Africa/Cairo`).

### E8-US01 — Dashboard buckets (P0)

**As an** Owner (Dispatcher may see ops view)  
**I want** counts for Open, Overdue, Blocked, Done today (and Cancelled separate)  
**So that** I know the day’s operational health.

**Depends on:** E4–E6 statuses + timestamps; Cancelled (E5-US03); timezone `Africa/Cairo`.  
**Unlocks:** E8-US02 drill-down.  
**Surface:** `web` Owner dashboard (Dispatcher ops view OK).

**Acceptance — definitions**

| Bucket | Rule |
|--------|------|
| Open | `New`, `Assigned`, `En route`, `On site`, `Blocked` |
| Done today | `Completed` with `completed_at` today (Cairo) |
| Cancelled | Separate; not open, not done |
| Overdue | Preferred window end passed while still Open; **or** ASAP/Emergency with no window → overdue 2 hours after created if still `New` or `Assigned`; future-scheduled not overdue yet |
| Blocked | Still Open; distinct count |

**Notes / edges**

- Technician does not get this dashboard.  
- Counts are org-scoped only.  
- Once this dashboard exists, Owner sign-in lands here. Dispatcher may open the same ops view; their default home stays the jobs board (E4-US02).

### E8-US02 — Drill into Jobs from dashboard (P0)

**As an** Owner  
**I want to** open Jobs from a bucket  
**So that** I can intervene (reassign, cancel, override).

**Depends on:** E8-US01; E5/E6 actions already available on Job detail.  
**Unlocks:** Closed loop on owner blind spot.  
**Surface:** `web` bucket → filtered Job list → existing Job actions.

**Acceptance**

- Drill-down lists match bucket definitions.  
- Permissions match Owner/Dispatcher matrix (intervene via existing E5/E6 actions).  
- No new god-mode beyond those roles.

---

## E10 — Bilingual UI (AR/EN)

**Goal:** Product usable in Arabic and English without translating free-text notes via MT.

> **Ordering note:** Enum labels and notify language **data** appear earlier. E10 is switchable UI + RTL polish across shipped surfaces.

### E10-US01 — Switch UI language with RTL (P0)

**As an** org User  
**I want to** switch the UI between AR and EN  
**So that** I can work in my preferred language.

**Depends on:** Shipped `web` surfaces from E1–E9 (polish pass can be incremental per slice, finalized here).  
**Unlocks:** Portfolio-ready AR/EN demo.  
**Surface:** `web` locale toggle; layout direction.

**Acceptance**

- Arabic UI is RTL.  
- Enums stored as stable English codes; labels translated in UI.  
- User content stays single free-text fields (mixed OK); no MT of notes in MVP.  
- Preference persists for the User (session or profile—match existing i18n approach).

### E10-US02 — Customer Notification language (P0)

**As the** system  
**I want** Customer Notifications in the Customer’s preferred language (else org default)  
**So that** homeowners get messages they can read.

**Depends on:** E9-US01 org default; E7 templates/worker; optional preference captured on intake (E4-US01) or edit (E3-US01).  
**Unlocks:** Correct AR-default NileFix demos.  
**Surface:** Customer field + notify renderer (not a second UI locale system).

**Acceptance**

- NileFix org default AR.  
- Preference stored on Customer when set.  
- Missing preference → org default.  
- Does not translate Job notes via MT.

---

## Cross-cutting reliability stories

These support multiple epics; start them when the dependent domain first appears—do not park them until the end.

### X-US01 — Optimistic concurrency on Job updates (P0)

**As the** system  
**I want** version/token checks on Job writes  
**So that** concurrent reassign vs complete cannot corrupt ownership.

**Depends on:** Job update APIs (E5/E6).  
**Unlocks:** Safe E5-US02 + E6-US02/US03.  
**Surface:** API version token; `web` reload on conflict.

**Acceptance**

- Stale write → conflict.  
- Complete only if current Assignee (or allowed override), status allowed, not Cancelled.  
- No “Completed always wins.”  
- Late Complete after reassign → rejected.

### X-US02 — Tenant isolation (P0)

**As an** org User  
**I want** zero access to any Organization that is not my Active Organization  
**So that** multi-tenant data stays safe even when I belong to more than one.

**Depends on:** First Organization-scoped resources (E1 onward).  
**Unlocks:** Every later epic’s API.  
**Surface:** Shared schema + `organization_id`; API guards + DB constraints; continuous tests.

**Acceptance**

- Shared schema + `organization_id`; API + DB constraints enforce isolation.  
- A request is authorized only as the Org Role in the Active Organization.  
- A User with a seat in another Organization does not see that Organization’s Users, Customers, or Jobs on this request.  
- A suspended Organization or a Deactivated seat grants no access to that Organization’s data.  
- Super Admin has no cross-org Job ops in MVP.  
- Add/extend isolation tests as each resource type appears (Users, Customers, Jobs, Notifications)—not a single late spike.

### X-US03 — NileFix seed walks the demo path (P0)

**As a** reviewer  
**I want** a re-runnable seed for NileFix  
**So that** the portfolio demo shows the locked journey without using public Sign-up as the way an Organization appears.

**Depends on:** The happy path it demonstrates (E1 through E8, org default language AR from E9-US01).  
**Unlocks:** Discovery definition of done item “seed can demo NileFix end-to-end”.  
**Surface:** Server seed script, not a product screen. Creating an Organization (E1-US06) remains the primary onboarding path.

**Acceptance**

- Seed is idempotent and creates NileFix (`نايل فيكس`) as an Organization with default language AR, coverage areas, an Owner, and sample Dispatcher and Technician Users, each with one seat in NileFix.  
- Seed includes at least one Customer and Jobs that show `New`, an assigned in-progress Job, and a completed-today Job so the board and dashboard are not empty.  
- The seed does not give those Users a second Organization. The product still allows one (E1-US06, E1-US03).  
- Running the product from this seed can follow discovery’s path: board → intake → assign → Technician status → Notification record → Owner buckets.  
- A different User can Sign-up and then create another Organization. NileFix is not the only tenant.

---

## Suggested delivery order (portfolio slices)

Order is dependency-safe. Epic numbers are labels only.

| Slice | Stories | Why this position |
|-------|---------|-------------------|
| **1. Access & platform** | E1-US01 → US02 → **US05** → **US06** → US03 → **US04**; E2-US01 → US02 (US03 P1); **X-US02 starts** | Session, then an Organization, before invite; pending Invitation list after the first invite can be sent; admin list/suspend parallel once Super Admin can sign in |
| **2. Workforce prerequisites** | E9-US01 → E9-US02 | Assign hints + inactive flag before E5 |
| **3. Intake, then Customer upkeep** | E4-US01 → E4-US02; then E3-US01 → E3-US02 | First Job creates the Customer. Edit and archive follow; they do not gate intake |
| **4. Assign, history, field status** | Outbox **writer** (E7 schema); E5-US01 → US02 → US03; **E6-US04**; E6-US01 → US02 → US03; **X-US01** | History with reassign; concurrency with status; outbox rows atomic with assign |
| **5. Notification delivery** | E7-US01 → US02 → US03 → US04 | Worker, idempotency, resend, Mark Informed |
| **6. Dashboard + offboarding** | E8-US01 → US02; E9-US03 → E9-US04 (E9-US05 P1) | Buckets need real statuses; deactivate, remove, and leave need open Jobs + reassign |
| **7. Bilingual polish + demo seed** | E10-US01; E10-US02 (if preference was not captured on E4/E3); **X-US03** | RTL across shipped surfaces; NileFix seed walks the full path once those surfaces exist |

Each slice also meets discovery’s definition of done as far as that slice has touched the product: domain tests for status, tenancy, notify idempotency, and concurrency when those rules are in play; Docker Compose; CI lint, typecheck, and tests; README that explains the business and how to run. X-US03 is the end-to-end NileFix seed, after the path exists.

**Parallelism (safe):** E2 can track beside late E1; E10 strings can land incrementally per slice and be verified in slice 7.

**Do not reorder into these traps:**

- Assign (E5) before Technician active/skills (E9-US02)  
- Assign without outbox writer  
- Reassign before Job History  
- Deactivate-with-Jobs (E9-US03) before assign  
- Dashboard (E8) before status ladder  
- Invite UI before the Owner has an Organization (E1-US06)  
- “Tenancy epic” only at the end  
- Customer search/create as tickets before the first Job (they are E4-US01)  

---

## Traceability

Discovery §4 journeys, each step mapped to a story:

| Journey step | Story |
|----------------|-------|
| Dispatcher: sign in → today’s jobs board | E1-US05, E4-US02 |
| Dispatcher: phone search or inline Customer → Job → `New` | E4-US01 |
| Dispatcher: assign with hints → `Assigned` → notify queued | E5-US01, outbox writer |
| Dispatcher: monitor Job, Blocked, reassign, cancel | E4-US02, E6-US02, E5-US02, E5-US03 |
| Dispatcher: resend or Mark Informed | E7-US03, E7-US04 |
| Technician: sign in → my Jobs today, read intake | E6-US01 |
| Technician: status ladder or Blocked with reason | E6-US02 |
| Technician: no org board, no peer assign | E6-US01, E5-US01 |
| Owner: Sign-up, then create Organization as Owner | E1-US01, E1-US02, E1-US05, E1-US06 |
| Owner: dashboard buckets | E8-US01 |
| Owner: drill in and override | E8-US02, E6-US03 |
| Owner: invite, invitee Sign-up if needed, accept/reject, pending list and cancel | E1-US03, E1-US04 |
| Owner: deactivate, set active, set Org Role, remove, leave, org settings, archive | E9-US03, E9-US04, E9-US01, E3-US02 |
| Owner: delete the Organization | E9-US05 |
| Super Admin: sign in, list, suspend, optional create | E1-US02, E2-US01, E2-US02, E2-US03 |
| NileFix seed demo of that path | X-US03 |

| Discovery area | Epics / stories |
|----------------|-----------------|
| Pain: incomplete intake | E4; field read of that intake is E6-US01 |
| Pain: unclear ownership | E5, E6-US04 |
| Pain: status fog | E6, E8 |
| Pain: customer not updated | E7 |
| Pain: owner blind spot | E8 |
| Sign-up, create Organization, Session, and Invitation | E1-US01, US02, US05, US06, US03, US04 |
| Permissions matrix | Role tags + acceptance on each story |
| Edge: employee leaves | E9-US03, E9-US04; no bulk reassign |
| Edge: notify crash / duplicate | E7-US03, X + ADR 0010 |
| Edge: concurrent complete | X-US01, ADR 0011 |
| Edge: archived Customer | E3-US02 |
| Portfolio DoD (seed, Docker, CI, README) | Slice note + X-US03 |
| Non-MVP list | Explicitly excluded above |

---

*When a story conflicts with [flowdesk-discovery.md](../research/flowdesk-discovery.md), discovery wins until a new decision is logged. Seats and Sign-up follow [ADR 0021](../adr/0021-signup-does-not-create-organization.md) and [CONTEXT.md](../../CONTEXT.md).*
