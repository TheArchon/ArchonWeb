import logging

class SensitiveDataFilter(logging.Filter):
    BLOCKED_TERMS = (
        "otp=", "password=", "2fa=", "session=", "session_string=",
        "api_hash=", "auth_key=",
    )

    def filter(self, record: logging.LogRecord) -> bool:
        message = record.getMessage().lower()
        return not any(term in message for term in self.BLOCKED_TERMS)

def configure_logging() -> None:
    handler = logging.StreamHandler()
    handler.addFilter(SensitiveDataFilter())
    handler.setFormatter(logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    ))
    root = logging.getLogger()
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)
