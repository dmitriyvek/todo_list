import sys

from loguru import logger


def setup_logger(log_level: str) -> logger:
    # remove default console logging
    logger.remove()

    logger.add(
        sys.stderr,
        level=log_level,
        backtrace=True,
    )

    return logger
