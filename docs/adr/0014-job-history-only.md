# Job history only — no platform audit product

MVP keeps an append-only **Job History** of field-relevant changes: assign, reassign, status transitions, block, complete, cancel (actor, timestamps, reasons where required). That supports reassignment visibility and concurrency disputes.

We do not ship a separate Organization-wide or platform audit log UI for invites, deactivations, Customer archive, or settings. Those retain ordinary row timestamps where useful. A full Audit Event stream can wait until a real compliance need appears; building it now would pull scope into a mini-SIEM.
