# Flowdesk

Multi-tenant field-service dispatch for residential HVAC and plumbing. Language here is for product concepts shared across web, admin, and server.

## Language

**Health**:
A signal that the API process is accepting HTTP requests. It does not mean dependencies such as PostgreSQL are reachable.
_Avoid_: Liveness, readiness, ping, heartbeat

**User**:
An authenticated person with a name and an email. Every login, Session, and email belongs to a User. A User is either a Super Admin, who is never an Organization member, or someone who may hold a seat in zero or more Organizations. Inside one Organization a User has exactly one Org Role.
_Avoid_: Account, client, person

**Customer**:
A homeowner or site contact the Organization serves. A Customer is not a User and has no login. Jobs link to a Customer; phone search drives reuse.
_Avoid_: Client, contact, account, end user, service recipient, buyer

**Super Admin**:
A User who uses the admin app and cannot use the web app. A Super Admin is never an Organization member and does not run day-to-day dispatch. The first Super Admin is seeded; later Super Admins are created only by an existing Super Admin.
_Avoid_: Admin, owner, operator, staff, platform admin, Role

**Org Role**:
The seat a User holds inside one Organization: Owner, Dispatcher, or Technician. A User has a separate Org Role in each Organization they belong to. Not a permission list and not a platform Super Admin.
_Avoid_: Role, Membership, position, permission, access level, customer

**Owner**:
An Org Role that runs the Organization: users, settings, overrides, and the operational dashboard.
_Avoid_: Admin, manager, Super Admin

**Dispatcher**:
An Org Role that takes intake, assigns and reassigns Jobs, monitors status, and handles customer-notify hygiene.
_Avoid_: Coordinator, office, admin, operator

**Technician**:
An Org Role that performs field work on Jobs assigned to them. A Technician sees only their own Jobs and cannot assign others.
_Avoid_: Tech, field worker, employee, contractor

**Deactivated**:
An Org Role a User still holds in one Organization but cannot act in. Their login and their other Organizations stay available. An Owner sets that seat active again; it is not a new Invitation. History and Jobs in that Organization stay. It is not removal of the seat, and the last Owner cannot be deactivated.
_Avoid_: deleted, banned, signed out, suspended

**Organization**:
A named company workspace whose Users, Customers, and Jobs are isolated from other Organizations. A verified User who is not a Super Admin may create one and becomes its Owner; there is no cap, and Sign-up does not create one. A User may hold many seats at once, may leave one unless they are its last Owner, and losing a seat or deleting the Organization does not delete the User, their other seats, or that Organization's Jobs. A Super Admin can list and suspend Organizations. Creating one from admin requires an Owner Invitation to an email in that same act, and the Super Admin gets no seat. While it has no seats, a Super Admin may cancel a pending Invitation and, once it is no longer pending, send another Owner Invitation. Once an Owner exists, only an Owner invites or cancels. Deleting an Organization ends its pending Invitations. Suspension blocks work in that Organization only.
_Avoid_: Tenant, team, company, account, workspace

**Sign-up**:
Public registration on the web app that creates a User and nothing else, or creates nothing if it fails. It does not collect an Organization name and does not assign an Org Role. A Session still waits for Email verification. Sign-up is rejected on the admin app.
_Avoid_: Registration, onboarding, create account, join

**Invitation**:
A pending ask for an email to join an existing Organization with an Org Role. It is the only way to gain a seat besides creating the Organization. Accept, reject, and get require Email verification. It does not create an Organization or a password. An invitee with no User yet Signs up, verifies email, then accepts. Accept succeeds only for that email, and only when that User does not already have an Org Role there, including a Deactivated one. An Owner cannot send one to someone who already has a seat there. An Organization has at most one pending Invitation per email. The same email may have a pending Invitation from another Organization. It expires 48 hours after it is sent, and sending again while it is pending is refused and does not extend that time. It stops being pending when it is accepted, rejected, cancelled, or expired. Accept adds a seat, leaves the User's other seats in place, and becomes the Active Organization only when the User had none.
_Avoid_: Invite link, token, share, Sign-up, direct add

**Job**:
A single field-service unit of work for one Customer at one service address: intake through assign, field progress, and complete, block, or cancel. A Job belongs to exactly one Organization.
_Avoid_: Work order, service request, ticket, task, order

**Job Status**:
Where a Job sits in its lifecycle: New, Assigned, En route, On site, Blocked, Completed, or Cancelled. Blocked and Cancelled require a reason. Transitions are enforced by the product; Technicians advance only their own Jobs.
_Avoid_: State, stage, phase, progress

**Assignee**:
The Technician currently responsible for a Job. Reassignment replaces the Assignee and returns the Job to Assigned. Completion is allowed only for the current Assignee (unless an Owner or Dispatcher overrides per product rules).
_Avoid_: Owner (for the tech), worker, assigned user

**Job History**:
An append-only record of field-relevant changes on a Job (assign, reassign, status transitions, block, complete, cancel), including who did it and when. It is not a platform-wide audit log.
_Avoid_: Audit log, activity feed, event store, timeline

**Notification**:
An outbound message to a Customer or a Technician about a Job event (for example Assigned, En route, On site, Completed, Cancelled, or reassigned). Delivery is pending, sent, or failed. A resend is a new Notification for the same kind of event, not a retry of the same one.
_Avoid_: Alert, email, SMS, push, outbox, message job

**Mark Informed**:
A record that the office told the Customer about a Job event without a successful Notification send. It is not a Notification.
_Avoid_: Resend, manual notify, acknowledge, dismiss failure

**Session**:
Proof that a User is signed in. The API treats a request as that User while the Session is valid. When the User belongs to Organizations, the Session’s Active Organization is the Organization the request is acting in.
_Avoid_: Token, JWT, login

**Active Organization**:
Which Organization a Session is currently acting in. A User with none has none, and may only create an Organization or accept an Invitation. Sign-in uses the last Active Organization only when that seat is not Deactivated and that Organization is not suspended. If the seat is Deactivated or the Organization is suspended while it is Active, the Session uses that same choice. The User may switch only among Organizations they can still work in. If every seat is unusable, the Session has no Active Organization: the User sees those Organizations as suspended or Deactivated, and may create an Organization or accept an Invitation, without opening their Customers or Jobs. Creating an Organization makes it the Active Organization. Accepting an Invitation does so only when the User had none. Customers, Jobs, and the Org Role in force are those of the Active Organization alone.
_Avoid_: Current tenant, selected workspace, membership

**Email verification**:
Proof that a User owns the email they signed up with. A User does not get a Session until Email verification succeeds. Testers finish verification by reading the queued mail job and calling Better Auth’s verify URL — they do not parse mailboxes.
_Avoid_: Confirm email, activation, magic link

**Event**:
A fact that a User did something that matters to the product. The auth Events are user signed up, user signed in, and user signed out. Sign-up does not include signed in. Failed auth, get-session, and Health are not Events. An Event is not a Log and not a Trace.
_Avoid_: Trace, span, log, login, capture

**Trace**:
The path of one HTTP request through the API, including database work. A Trace can exist with no User (for example a failed sign-in). Health is not traced. A Trace is not a product fact.
_Avoid_: Event, span, request log, log

**Metric**:
A number over time (count or latency), not a product fact. Auth has no custom Metrics. A later feature may add one. User id, email, and Session id are never Metric attributes.
_Avoid_: Event, Trace, counter, dashboard

**Log**:
A line written by the process logger (info, warn, or error). When tracing is on, a Log carries trace_id so it can join a Trace. HTTP 4xx adds a warn Log; HTTP 5xx adds an error Log. Info Logs still exist (boot, Prisma connected, and so on). A Log never includes email, password, or the request body. A Log is not an Event.
_Avoid_: Event, Trace, capture
