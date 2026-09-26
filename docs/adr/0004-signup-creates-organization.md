# Sign-up creates the Organization

Superseded by [ADR 0021](./0021-signup-does-not-create-organization.md).

Public **Sign-up** on `web` creates a User, a new Organization, and the Owner Org Role together in one successful act (before Email verification), or creates none of them. Organization name is collected at Sign-up; slug is derived. A Session is issued only after Email verification, with Active Organization set to that Organization. Sign-up is the only self-serve Organization create path; org Users cannot create another. Invitees obtain credentials through the Invitation flow, not Sign-up.

An Owner invites Dispatchers, Technicians, and additional Owners. **Invitation** accept succeeds only if that email has no Organization yet. In MVP a User belongs to at most one Organization.

Super Admin can list and suspend Organizations and may create one for support or demo, but is not required for onboarding. We rejected Super-Admin-only provisioning as the sole path (too heavy for a portfolio multi-tenant product) and rejected multi-org membership in MVP. We rejected creating the Organization only after Email verification or via a separate post–Sign-up create call, so a verified User is never left without an Organization from Owner onboarding.
