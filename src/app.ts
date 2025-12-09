import express, { Express } from 'express';
import supplierRoutes from './routes/supplierRoutes';
import healthRoutes from './routes/healthRoutes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', supplierRoutes);
app.use('/', healthRoutes);

export default app;

