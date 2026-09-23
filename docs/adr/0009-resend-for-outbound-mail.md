# Outbound mail is sent with Resend

The mail processor sends through Resend’s HTTP API. Auth owns copy and enqueues `{ to, subject, text, html }` to BullMQ. `RESEND_API_KEY` and `MAIL_FROM` live in server env only.

Resend rejects reserved test domains such as `example.com`. Outside production, the processor completes those jobs without calling Resend so local Sign-up and e2e do not retry a send that cannot succeed. In production the skip is off — reserved and real recipients both go to Resend. Other 4xx responses (except 408, 425, and 429) fail the job without retry.

One HTTP provider beats operating SMTP and local Mailpit for this portfolio stack. We still do not send mail on the request path.
