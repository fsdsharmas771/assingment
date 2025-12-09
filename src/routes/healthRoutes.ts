import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const SUPPLIER_A_URL = process.env.SUPPLIER_A_URL || 'http://localhost:3000/supplierA/hotels';
const SUPPLIER_B_URL = process.env.SUPPLIER_B_URL || 'http://localhost:3000/supplierB/hotels';

router.get('/health', async (req: Request, res: Response) => {
  const healthStatus = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      supplierA: 'DOWN',
      supplierB: 'DOWN'
    }
  };

  try {
    // Check Supplier A
    try {
      await axios.get(SUPPLIER_A_URL, { timeout: 5000 });
      healthStatus.services.supplierA = 'UP';
    } catch (error) {
      healthStatus.services.supplierA = 'DOWN';
    }

    // Check Supplier B
    try {
      await axios.get(SUPPLIER_B_URL, { timeout: 5000 });
      healthStatus.services.supplierB = 'UP';
    } catch (error) {
      healthStatus.services.supplierB = 'DOWN';
    }

    // Overall status
    if (healthStatus.services.supplierA === 'DOWN' && healthStatus.services.supplierB === 'DOWN') {
      healthStatus.status = 'DOWN';
    }

    const statusCode = healthStatus.status === 'UP' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    healthStatus.status = 'DOWN';
    res.status(503).json(healthStatus);
  }
});

export default router;

