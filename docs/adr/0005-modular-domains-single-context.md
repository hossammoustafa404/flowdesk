# Modular domains, single glossary

Flowdesk keeps one root `CONTEXT.md` for ubiquitous language. Product code is sliced into five Nest-style modules — Identity & Access, Tenancy (includes skills, coverage areas, org defaults), Customers, Jobs, and Notifications — not separate bounded-context trees or a `CONTEXT-MAP.md`.

Jobs enqueue Notifications; Notifications never change Job Status. We rejected a full multi-context map (too much ceremony for this MVP) and rejected folding Customers into Jobs or Identity into Tenancy (those boundaries are where tenancy isolation and the notify one-way rule would blur).
