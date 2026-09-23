# Job optimistic concurrency and Assignee completion

Job updates use optimistic concurrency (version / token). A stale write returns conflict; the client reloads. **Completed** is accepted only if the actor is the current Assignee (or an Owner/Dispatcher override per status rules), the transition is allowed, and the Job is not Cancelled. A late Complete after reassignment is rejected.

We rejected “Completed always wins” and last-write-wins without a version: concurrent reassign vs complete would corrupt ownership and Customer Notifications.
