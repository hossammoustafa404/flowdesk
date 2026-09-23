# Three apps: server, web, admin

Flowdesk ships three deployables. `server` is the API. `web` is for Organization Users (Owner, Dispatcher, Technician). `admin` is only for Super Admins (list/suspend Organizations, optional support create) — never day-to-day dispatch.

We rejected one Next.js app with role-switched shells: Super Admin must not share the dispatch UI surface, and origin-gated auth is simpler with two browser origins. We rejected giving Technicians a separate native app in MVP.
