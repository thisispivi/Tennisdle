import logging


class CustomFormatter(logging.Formatter):
    """
    Logging colored formatter, adapted from https://stackoverflow.com/a/56944256/3638629
    """

    grey = "\x1b[38;21m"
    blue = "\x1b[38;5;39m"
    yellow = "\x1b[38;5;226m"
    red = "\x1b[38;5;196m"
    bold_red = "\x1b[31;1m"
    reset = "\x1b[0m"
    pink = "\x1b[38;5;200m"
    purple = "\x1b[38;5;141m"
    lime = "\x1b[38;5;118m"
    orange = "\x1b[38;5;208m"

    def __init__(self, fmt):
        super().__init__()
        self.fmt = fmt
        self.FORMATS = {
            logging.DEBUG: self.grey + self.fmt + self.reset,
            logging.INFO: self.blue + self.fmt + self.reset,
            logging.WARNING: self.yellow + self.fmt + self.reset,
            logging.ERROR: self.red + self.fmt + self.reset,
            logging.CRITICAL: self.bold_red + self.fmt + self.reset,
            IMPORTANT: self.lime + self.fmt + self.reset,
            ATP: self.blue + self.fmt + self.reset,
            WTA: self.purple + self.fmt + self.reset,
            SAVE: self.pink + self.fmt + self.reset,
            FILTER_PLAYERS: self.orange + self.fmt + self.reset,
        }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)


ATP = 21
WTA = 22
SAVE = 23
IMPORTANT = 24
FILTER_PLAYERS = 25

logging.addLevelName(ATP, "ATP")
logging.addLevelName(WTA, "WTA")
logging.addLevelName(SAVE, "SAVE")
logging.addLevelName(IMPORTANT, "IMPORTANT")
logging.addLevelName(FILTER_PLAYERS, "FILTER_PLAYERS")


def atp(self, message, *args, **kws):
    if self.isEnabledFor(ATP):
        self._log(ATP, message, args, **kws)


def wta(self, message, *args, **kws):
    if self.isEnabledFor(WTA):
        self._log(WTA, message, args, **kws)


def save(self, message, *args, **kws):
    if self.isEnabledFor(SAVE):
        self._log(SAVE, message, args, **kws)


def important(self, message, *args, **kws):
    if self.isEnabledFor(IMPORTANT):
        self._log(IMPORTANT, message, args, **kws)


def filter_players(self, message, *args, **kws):
    if self.isEnabledFor(FILTER_PLAYERS):
        self._log(FILTER_PLAYERS, message, args, **kws)


logging.Logger.atp = atp
logging.Logger.wta = wta
logging.Logger.save = save
logging.Logger.important = important
logging.Logger.filter_players = filter_players


def get_custom_logger():
    """
    Get a custom logger with colored output.

    Returns:
        logging.Logger: Custom logger
    """
    handler = logging.StreamHandler()
    handler.setFormatter(CustomFormatter("[%(levelname)s] - %(asctime)s - %(message)s"))
    logger = logging.getLogger()
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger
