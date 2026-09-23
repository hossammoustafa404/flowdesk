# Outbound work is queued through Redis/BullMQ

Auth mail and Job Notifications are enqueued to Redis with BullMQ (`@nestjs/bullmq`) and processed asynchronously. Workers run in the same Nest process as the API in MVP. Failures are retried by the queue with backoff.

We rejected sending mail or provider SMS/email inline on the request path: a provider outage would fail Sign-up or assignment after the User or Job change already existed, and HTTP latency would hold the response. We rejected a Postgres-backed queue to keep the Nest/BullMQ path and avoid mixing job-queue state into the application database. Redis exists because retries need a queue — not as a feature showcase.

Seed stubs the mail queue. E2E finishes Email verification by reading the queued mail job and calling Better Auth’s verify URL, not by parsing mailboxes.
