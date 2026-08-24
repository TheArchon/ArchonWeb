# Telegram adapter boundary

Keep Telegram-specific code isolated here.

Rules:
- Never log OTPs, 2FA passwords, authorization keys, or session strings.
- Never persist authentication credentials in a normal database.
- Avoid permanent `.session` files.
- Disconnect temporary clients on every exit path.
- Delete temporary state on success, failure, cancellation, and expiry.

This project intentionally leaves credential-collecting web authentication disabled.
