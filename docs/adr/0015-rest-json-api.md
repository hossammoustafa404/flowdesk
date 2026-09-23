# Resource-oriented REST JSON API

The `server` exposes a resource-oriented REST JSON API (Nest global prefix as configured) for `web` and `admin`. List/get/create/update use resources; intentional state changes that are not a plain field PATCH use action sub-routes (for example assign, resend). Error bodies carry a stable machine `code`, a human `message`, and optional `details`.

We rejected GraphQL for MVP (second paradigm, weaker fit for Swagger-first Nest) and rejected an actions-only RPC surface (boards and Customer search need ordinary collection reads). OpenAPI/Swagger remains the contract source for portfolio review.
