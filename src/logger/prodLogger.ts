import winston, { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { timestamp, combine, errors, json } = format;

const buildProdLogger = (): winston.Logger => {
  return createLogger({
    level: 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: {},
    transports: [
      new transports.Console(),
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        zippedArchive: true,// Compress logs for better storage efficiency
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
      new DailyRotateFile({
        dirname: 'logs',
        filename: 'exceptions-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '15d',
      }),
    ],
    rejectionHandlers: [
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

export default buildProdLogger;
