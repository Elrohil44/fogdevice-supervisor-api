const { createLogger, format, transports } = require('winston');

const {
  colorize, timestamp, combine, printf,
} = format;

const { LOG_LEVEL } = process.env;

const myFormat = printf(({
  level, message, timestamp: ts, stack,
}) => `${ts} [${level}]: ${stack || message}`);


const logger = createLogger({
  level: LOG_LEVEL,
  transports: [new transports.Console()],
  format: combine(
    colorize({ all: true }),
    timestamp(),
    myFormat,
  ),
});

module.exports = logger;
