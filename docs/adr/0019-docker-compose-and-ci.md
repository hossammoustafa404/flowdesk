# Docker Compose for local and demo, CI on PR

Local and portfolio demo runs use **Docker Compose** for PostgreSQL, Redis, and the `server` (and containerized `web`/`admin` when that earns its keep; otherwise documented `nx`/`pnpm` dev for the Next apps against Compose-backed API and data). Pull requests run lint, typecheck, and the mandatory domain tests (ADR 0018).

We rejected Kubernetes-in-repo as an MVP showpiece and rejected a PaaS-only story with no Compose path — reviewers must be able to bring the stack up from the README. Multi-region or orchestrated prod can wait until there is a real ops need.
