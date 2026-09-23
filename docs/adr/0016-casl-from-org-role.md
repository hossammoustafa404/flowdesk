# CASL abilities from Org Role

Authorization uses `@casl/ability`. Abilities are defined from whether the User is a Super Admin or which Org Role they hold (Owner, Dispatcher, Technician), matching the discovery permission matrix. Action services enforce checks; `web`/`admin` ability checks are UX only.

Organization-scoped subjects are always limited by that User’s `organization_id`. Super Admin platform abilities cover list/suspend (and optional create) of Organizations — not tenant Job dispatch.

We rejected role-string checks scattered in services (drifts from the matrix, fights existing Nest rules) and rejected per-User custom permission rows in MVP (ACL product scope we do not need).
