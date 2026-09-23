# Origin-gated sign-in and Sign-up

A User may use only one app: Organization Users → `web`, Super Admin → `admin`. We enforce that at **sign-in and Sign-up** by classifying request `Origin` against `WEB_ORIGIN` and `ADMIN_ORIGIN`, not only later on role-gated routes.

Wrong-app access is rejected when the browser is on the other app. Sign-up is rejected on the admin origin. When Origin is the API (`BETTER_AUTH_URL`) or missing (Swagger, curl), email and password are enough so tooling can still obtain a Session.

Wrong-app sign-in uses the same unauthorized credential failure as an unknown email or wrong password so scripts cannot tell registered addresses (and platform vs org) from the status code. `Origin` is a policy boundary, not a security control: non-browser clients can set it arbitrarily.
