# Notification outbox and idempotency

When a Job event should notify a Customer or Technician, the Job write and Notification outbox rows commit in **one database transaction**. Workers read the outbox; assignment can succeed while delivery is still pending. Delivery is pending, sent, or failed. Dispatcher/Owner may **resend** (a new Notification occurrence) or **Mark Informed** (not a Notification).

Idempotency key is per `jobId + eventType + occurrenceId`. Worker retries must not double-send; human resend creates a new occurrence. Providers sit behind an abstraction (SMS/email; WhatsApp sandbox/mock in dev) so Meta approval is not a ship blocker.

We rejected notify-after-commit without an outbox (crash between commit and enqueue loses the message) and rejected “retries reuse the same send” (duplicates Customers).
