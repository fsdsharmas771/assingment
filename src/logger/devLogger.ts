import winston, { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { timestamp, combine, printf, errors, colorize, simple } = format;

const buildDevLogger = (): winston.Logger => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  });

  return createLogger({
    level: 'debug',
    format: combine(
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat,
    ),
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        zippedArchive: true, // Compress logs for better storage efficiency
        maxFiles: '15d', // Retain logs for 15 days
      }),
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        zippedArchive: true,
        maxFiles: '15d',
      }),
    ],
    exceptionHandlers: [
      new transports.Console({ format: combine(colorize(), simple()) }),
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'exceptions-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '15d',
      }),
    ],
    rejectionHandlers: [
      new transports.Console({ format: combine(colorize(), simple()) }),
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'rejections-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '15d',
      }),
    ],
  });
};

export default buildDevLogger;
