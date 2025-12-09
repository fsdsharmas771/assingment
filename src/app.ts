import express, { Express } from 'express';
import mainRouter from './routes/main.routes';
import { globalErrorHandler } from './middleware/globalErrorMiddleware';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRouter);

app.use(globalErrorHandler);

export default app;

