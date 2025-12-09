import { NextFunction, Request, Response } from 'express';
import { httpStatusCode, messages } from '../constants/common.constants';
import { AppError, errorHandler } from '../error/AppError';
import logger from '../logger';
import { sendResponse } from '../utils/sendResponse';

export const globalErrorHandler = async (err: AppError, req: Request, res: Response, _next: NextFunction): Promise<void> => {
  if (!errorHandler.isTrustedError(err)) {
    logger.error(err);
    sendResponse(res, {
      data: null,
      message: messages.SOMETHING_WENT_WRONG,
      statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
      success: false,
    });
    return;
  }
  const errDetails = await errorHandler.handleError(err);
  const { message, statusCode, success } = errDetails || {};
  sendResponse(res, {
    data: null,
    message,
    statusCode,
    success,
  });
};
