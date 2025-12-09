import { Router, Request, Response } from 'express';
import { sendResponse } from '../../utils/sendResponse';
import { supplierMessages } from './supplier.constants';
import { httpStatusCode } from '../../constants/common.constants';
import { supplierAData, supplierBData, SupplierHotel } from './supplier.data';

const supplierRouter = Router();

const filterByCity = (hotels: SupplierHotel[], city?: string): SupplierHotel[] => {
  if (!city) return hotels;
  const lowerCity = city.toLowerCase();
  return hotels.filter((hotel) => hotel.city.toLowerCase() === lowerCity);
};

supplierRouter.get('/supplierA/hotels', (req: Request, res: Response) => {
  const city = req.query.city as string | undefined;
  const filtered = filterByCity(supplierAData, city);

  return sendResponse(res, {
    data: filtered,
    message: supplierMessages.HOTELS_FETCHED_SUCCESSFULLY,
    statusCode: httpStatusCode.OK,
    success: true,
  });
});

supplierRouter.get('/supplierB/hotels', (req: Request, res: Response) => {
  const city = req.query.city as string | undefined;
  const filtered = filterByCity(supplierBData, city);

  return sendResponse(res, {
    data: filtered,
    message: supplierMessages.HOTELS_FETCHED_SUCCESSFULLY,
    statusCode: httpStatusCode.OK,
    success: true,
  });
});

export default supplierRouter;
