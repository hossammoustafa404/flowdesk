# Flowdesk

Multi-tenant field-service dispatch for residential HVAC and plumbing. Language here is for product concepts shared across web, admin, and server.

## Language

**Health**:
A signal that the API process is accepting HTTP requests. It does not mean dependencies such as PostgreSQL are reachable.
_Avoid_: Liveness, readiness, ping, heartbeat

**User**:
An authenticated person with a name and an email. Every login, Session, and email belongs to a User. A User is either a Super Admin or a member of exactly one Organization with one Org Role.
_Avoid_: Account, client, person

**Customer**:
A homeowner or site contact the Organization serves. A Customer is not a User and has no login. Jobs link to a Customer; phone search drives reuse.
_Avoid_: Client, contact, account, end user, service recipient, buyer

**Super Admin**:
A User who uses the admin app and cannot use the web app. A Super Admin is never an Organization member and does not run day-to-day dispatch. The first Super Admin is seeded; later Super Admins are created only by an existing Super Admin.
_Avoid_: Admin, owner, operator, staff, platform admin, Role

**Org Role**:
Which seat a User holds inside an Organization: Owner, Dispatcher, or Technician. Not a permission list and not a platform Super Admin.
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

**Organization**:
A named company workspace whose Users, Customers, and Jobs are isolated from other Organizations. Public Sign-up on the web app creates an Organization and makes that User its Owner. An Owner invites other Users. A Super Admin can list and suspend Organizations and is not required to create them. In MVP a User belongs to at most one Organization.
_Avoid_: Tenant, team, company, account, workspace

**Sign-up**:
Public registration on the web app that creates a User, a new Organization, and the Owner Org Role together. Sign-up is rejected on the admin app.
_Avoid_: Registration, onboarding, create account

**Invitation**:
A pending ask for an email to join an existing Organization with an Org Role. Accept, reject, and get require Email verification. Invitation is how Dispatchers, Technicians, and additional Owners join; it does not create an Organization. Accept succeeds only if that email has no Organization yet.
_Avoid_: Invite link, token, share

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
Proof that a User is signed in. The API treats a request as that User while the Session is valid.
_Avoid_: Token, JWT, login

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
