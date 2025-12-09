import express, { Express } from 'express';
import supplierRoutes from './routes/supplierRoutes';
import healthRoutes from './routes/healthRoutes';
import hotelRoutes from './routes/hotelRoutes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', supplierRoutes);
app.use('/', healthRoutes);
app.use('/', hotelRoutes);

export default app;

