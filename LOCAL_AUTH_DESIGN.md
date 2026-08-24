# ARCHON Local-Only Authentication Design

The production-safe design keeps Telegram authentication credentials out of the ARCHON server.

## Boundary

Browser/local runtime:
- Telegram authorization interaction
- OTP/2FA input
- Temporary authentication material
- Final session material

ARCHON server:
- Static UI/API
- Non-sensitive workflow metadata
- Rate limiting
- Health checks
- No OTP/2FA/session credential persistence

## Important

A browser-only implementation of Pyrogram/Telethon MTProto session generation
requires a dedicated client-side MTProto implementation or a trusted local
application/CLI. Pyrogram and Telethon are Python libraries and should not be
bundled into the public web server as a credential-export endpoint.

Therefore this package does not pretend that the current web UI generates a
real Telegram session. The UI and backend are production-safe foundations;
the actual credential generation must happen in a user-controlled local
runtime.

Never enter a Telegram password or OTP into an untrusted web form.
