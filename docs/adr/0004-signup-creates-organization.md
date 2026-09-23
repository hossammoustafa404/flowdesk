# Sign-up creates the Organization

Public **Sign-up** on `web` creates a User, a new Organization, and the Owner Org Role together (after Email verification). That is the primary onboarding path. An Owner invites Dispatchers, Technicians, and additional Owners. **Invitation** accept succeeds only if that email has no Organization yet. In MVP a User belongs to at most one Organization.

Super Admin can list and suspend Organizations and may create one for support or demo, but is not required for onboarding. We rejected Super-Admin-only provisioning as the sole path (too heavy for a portfolio multi-tenant product) and rejected multi-org membership in MVP.
