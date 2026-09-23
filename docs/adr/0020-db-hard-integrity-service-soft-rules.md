# Hard integrity in Postgres; soft rules in services

Shared-schema tenancy uses PostgreSQL for hard integrity: foreign keys among Organization, User, Customer, and Job; unique Customer primary phone per Organization; Job `version` for optimistic concurrency. Soft product rules — skill-mismatch warnings, the Job Status transition matrix, notify policy — stay in action services where they stay readable and testable.

We rejected app-only checks with bare FKs (too easy to break phone uniqueness and tenancy invariants) and rejected encoding the status machine in triggers or heavy check constraints (painful to evolve and opaque in review).
