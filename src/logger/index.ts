import winston from 'winston';
import buildDevLogger from './devLogger';
import buildProdLogger from './prodLogger';
const NODE_ENV = process.env.NODE_ENV || 'DEV';
let logger: winston.Logger;
if (NODE_ENV !== 'PRODUCTION') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}
export default logger;
