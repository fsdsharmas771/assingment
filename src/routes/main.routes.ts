import { Router } from 'express';
import healthRouter from '../module/health/health.routes';
import supplierRouter from '../module/supplier/supplier.routes';
import hotelRouter from '../module/hotel/hotel.routes';

const mainRouter = Router();

mainRouter.use('/health', healthRouter);
mainRouter.use('/supplier', supplierRouter);
mainRouter.use('/api/hotel', hotelRouter);

export default mainRouter;