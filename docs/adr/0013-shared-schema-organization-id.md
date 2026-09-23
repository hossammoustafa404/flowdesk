# Shared schema with organization_id

Tenant data lives in one PostgreSQL schema. Rows that belong to an Organization carry `organization_id`. The API enforces isolation; Super Admin platform ops are the exception path for list/suspend (and optional create), not cross-tenant Job access.

We rejected schema-per-tenant and database-per-tenant: no compliance driver for isolation-at-the-DB-name, and both complicate migrations, seed (NileFix), and a single Nest deploy. Shared schema keeps portfolio ops simple; missing `organization_id` filters remain an application bug to test for, not a reason to split schemas in MVP.
