# Mandatory domain tests, not coverage theater

MVP merge quality is judged by tests that lock the product rules: Job Status transitions, tenant isolation (`organization_id`), Notification idempotency (and outbox commit), and Job optimistic concurrency / Assignee completion. Critical auth paths (origin gate, Org Role / Super Admin abilities) are covered on the paths that enforce them.

Action services own domain assertions; controllers stay thin. One E2E (or few) covers the NileFix happy path: Sign-up or seed → invite → intake → assign → status → notify. We rejected E2E-only demos (domain bugs hide) and rejected a global coverage percentage gate (wrong incentive for a portfolio MVP).
