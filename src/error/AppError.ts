import { httpStatusCode } from '../constants/common.constants';

export class AppError extends Error {
  public readonly success: boolean;
  public readonly statusCode: httpStatusCode;
  public readonly message: string;

  constructor(statusCode: httpStatusCode, message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.message = message;
    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this);
  }
}

class ErrorHandler {
  public async handleError(err: AppError): Promise<AppError> {
    return err;
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return true;
    }
    return false;
  }
}
export const errorHandler = new ErrorHandler();
