import { Response } from 'express';
import { ApiResponse } from '../types/ApiResponse';

export const sendResponse = <T>(res: Response, responseData: ApiResponse<T>): Response<unknown> => {
  return res.status(responseData.statusCode).send(responseData);
};
