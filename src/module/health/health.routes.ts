import { Router, Request, Response } from 'express';
import axios from 'axios';
import { healthMessages, healthStatuses } from './health.constants';
import { httpStatusCode } from '../../constants/common.constants';
import { AppError } from '../../error/AppError';
import { sendResponse } from '../../utils/sendResponse';
import logger from '../../logger';

const healthRouter = Router();

const SUPPLIER_A_URL = process.env.SUPPLIER_A_URL || 'http://localhost:3000/supplier/supplierA/hotels';
const SUPPLIER_B_URL = process.env.SUPPLIER_B_URL || 'http://localhost:3000/supplier/supplierB/hotels';

healthRouter.get('/', async (req: Request, res: Response) => {
  const healthStatus = {
    status: healthStatuses.UP,
    timestamp: new Date().toISOString(),
    services: {
      supplierA: healthStatuses.DOWN,
      supplierB: healthStatuses.DOWN
    }
  };
  logger.info('Health check started');
  try {
    // Check Supplier A
    try {
      await axios.get(SUPPLIER_A_URL, { timeout: 5000 });
      healthStatus.services.supplierA = healthStatuses.UP;
    } catch (error) {
      healthStatus.services.supplierA = healthStatuses.DOWN;
    }

    // Check Supplier B
    try {
      await axios.get(SUPPLIER_B_URL, { timeout: 5000 });
      healthStatus.services.supplierB = healthStatuses.UP;
    } catch (error) {
      healthStatus.services.supplierB = healthStatuses.DOWN;
    }

    // Overall status
    if (healthStatus.services.supplierA === 'DOWN' && healthStatus.services.supplierB === 'DOWN') {
      healthStatus.status = healthStatuses.DOWN;
    }

    return sendResponse(res, {
      data: healthStatus,
      message: healthMessages.HEALTH_CHECK_SUCCESSFULLY,
      statusCode: healthStatus.status === healthStatuses.UP ? httpStatusCode.OK : httpStatusCode.SERVICE_UNAVAILABLE,
      success: true,
    });
  } catch (error) {
    throw new AppError(httpStatusCode.SERVICE_UNAVAILABLE, healthMessages.HEALTH_CHECK_FAILED);
  }
});

export default healthRouter;


