import { Router, Request, Response, NextFunction } from 'express';
import { getTemporalClient } from '../../temporal/client';
import { hotelComparisonWorkflow } from '../../workflows/hotelWorkflow';
import { getHotelsFromRedis, filterHotelsByPrice } from '../../redis/hotelCache';
import { AppError } from '../../error/AppError';
import { httpStatusCode, messages } from '../../constants/common.constants';
import { sendResponse } from '../../utils/sendResponse';
import logger from '../../logger';
import { hotelMessages } from './hotel.constants';

const hotelRouter = Router();

hotelRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const city = req.query.city as string;
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string, 10) : undefined;
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string, 10) : undefined;

    if (!city) {
      return next(new AppError(httpStatusCode.BAD_REQUEST, hotelMessages.CITY_PARAMETER_REQUIRED));
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const cachedHotels = await getHotelsFromRedis(city.toLowerCase());
      if (!cachedHotels || cachedHotels.length === 0) {
        return next(new AppError(httpStatusCode.NOT_FOUND, hotelMessages.NO_HOTELS_FOUND_IN_CACHE));
      }
      const filteredHotels = filterHotelsByPrice(cachedHotels, minPrice, maxPrice);
      return sendResponse(res, {
        data: filteredHotels,
        message: hotelMessages.HOTELS_FETCHED_SUCCESSFULLY,
        statusCode: httpStatusCode.OK,
        success: true,
      });
    }

    const client = await getTemporalClient();
    const handle = await client.workflow.start(hotelComparisonWorkflow, {
      taskQueue: 'hotel-offer-queue',
      workflowId: `hotel-comparison-${city}-${Date.now()}`,
      args: [{ city: city.toLowerCase() }],
    });

    const result = await handle.result();
    return sendResponse(res, {
      data: result.hotels,
      message: hotelMessages.HOTELS_FETCHED_SUCCESSFULLY,
      statusCode: httpStatusCode.OK,
      success: true,
    });
  } catch (error: any) {
    logger.error(`Error fetching hotels: ${error}`);
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(httpStatusCode.INTERNAL_SERVER_ERROR, messages.SOMETHING_WENT_WRONG));
  }
});

export default hotelRouter;
